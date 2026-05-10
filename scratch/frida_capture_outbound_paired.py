"""Capture OUTBOUND traffic from UserSessionHelper.exe paired with the
BCryptEncrypt context that produced it.

Hooks:
  ws2_32!send  -- the wire bytes leaving Helper
  bcrypt!BCryptEncrypt -- the (nonce, plaintext, ciphertext, tag) tuple
                         that should appear inside one of those wire frames

After the capture window, validates that:

    each send() body == pack_frame(Frame(nonce, ciphertext, tag))

for some BCryptEncrypt that fired just before that send. If yes, the wire
format is proven. The script also runs the bytes through polylux's own
AuraCipher (using the extracted key) and confirms decryption gives back
the captured plaintext.

Usage:
    python scratch/frida_capture_outbound_paired.py <PID> [seconds]
"""
import sys
import time
import frida
from pathlib import Path

from cryptography.exceptions import InvalidTag

# Make polylux importable when running from project root
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from polylux.crypto.aura_gcm import AuraCipher
from polylux.wire.frame import Frame, pack_frame, unpack_frame


JS = r"""
'use strict';

let g_keyHandle = null;
let g_events = [];
let g_capturing = false;

function expByName(modName, fnName) {
    const mod = Process.findModuleByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e){ return null; }
}

function bytesToHex(buf) {
    const u8 = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < u8.length; i++) s += (u8[i] < 16 ? '0' : '') + u8[i].toString(16);
    return s;
}

// --- BCryptEncrypt hook ---
const encAddr = expByName('bcrypt.dll', 'BCryptEncrypt');
if (encAddr) {
    Interceptor.attach(encAddr, {
        onEnter(args) {
            this.skip = true;
            const cbOut = args[7].toInt32();
            if (cbOut === 0) return;          // size-query call
            if (args[3].isNull()) return;     // need GCM padding info

            const pPad = args[3];
            const cbInfo = pPad.readU32();
            if (cbInfo !== 0x58) return;      // not auth-mode info struct

            this.skip = false;
            this.pPlain  = args[1];
            this.cbPlain = args[2].toInt32();
            this.pCipher = args[6];
            this.pcbResult = args[8];

            const pNonce = pPad.add(8).readPointer();
            const cbNonce = pPad.add(16).readU32();
            const pTag = pPad.add(40).readPointer();
            const cbTag = pPad.add(48).readU32();

            this.nonce = pNonce.isNull() ? null : pNonce.readByteArray(cbNonce);
            this.pTag = pTag;
            this.cbTag = cbTag;
            this.plain = this.pPlain.readByteArray(this.cbPlain);

            if (!g_keyHandle) g_keyHandle = args[0];
        },
        onLeave(retval) {
            if (this.skip) return;
            if (retval.toInt32() !== 0) return;
            if (!g_capturing) return;

            const got = this.pcbResult.readU32();
            const cipher = this.pCipher.readByteArray(got);
            const tag = this.pTag.isNull() ? null : this.pTag.readByteArray(this.cbTag);

            g_events.push({
                kind: 'enc',
                ts:   Date.now(),
                nonce_hex:  bytesToHex(this.nonce),
                plain_hex:  bytesToHex(this.plain),
                cipher_hex: bytesToHex(cipher),
                tag_hex:    bytesToHex(tag)
            });
        }
    });
    send({type:'log', msg:'BCryptEncrypt hooked'});
}

// --- send() hook ---
const sendAddr = expByName('ws2_32.dll', 'send') || expByName('WS2_32.dll', 'send');
if (sendAddr) {
    Interceptor.attach(sendAddr, {
        onEnter(args) {
            this.s = args[0].toInt32();
            this.buf = args[1];
            this.len = args[2].toInt32();
        },
        onLeave(retval) {
            if (!g_capturing) return;
            const sent = retval.toInt32();
            if (sent <= 0) return;
            const data = this.buf.readByteArray(sent);
            g_events.push({
                kind: 'send',
                ts: Date.now(),
                sock: this.s,
                hex: bytesToHex(data)
            });
        }
    });
    send({type:'log', msg:'ws2_32!send hooked'});
}

// --- WSASend hook ---
const wsasendAddr = expByName('ws2_32.dll', 'WSASend') || expByName('WS2_32.dll', 'WSASend');
if (wsasendAddr) {
    Interceptor.attach(wsasendAddr, {
        // WSASend(s, lpBuffers, dwBufferCount, lpNumberOfBytesSent, dwFlags, lpOverlapped, lpCompletionRoutine)
        onEnter(args) {
            this.s = args[0].toInt32();
            this.lpBuffers = args[1];
            this.cnt = args[2].toInt32();
        },
        onLeave(retval) {
            if (!g_capturing) return;
            // WSABUF { ULONG len; CHAR* buf; } — on x64 padded to 16 bytes
            const parts = [];
            for (let i = 0; i < this.cnt; i++) {
                const wsabuf = this.lpBuffers.add(i * 16);
                const len = wsabuf.readU32();
                const ptr = wsabuf.add(8).readPointer();
                if (len > 0 && !ptr.isNull()) {
                    parts.push(bytesToHex(ptr.readByteArray(len)));
                }
            }
            g_events.push({
                kind: 'wsasend',
                ts: Date.now(),
                sock: this.s,
                hex: parts.join('')
            });
        }
    });
    send({type:'log', msg:'ws2_32!WSASend hooked'});
}

// --- Key export RPC ---
const exportAddr = expByName('bcrypt.dll', 'BCryptExportKey');
const exportFn = exportAddr ? new NativeFunction(exportAddr, 'int', [
    'pointer','pointer','pointer','pointer','uint32','pointer','uint32'
]) : null;

function utf16zString(s) {
    const buf = Memory.alloc((s.length + 1) * 2);
    buf.writeUtf16String(s);
    return buf;
}

rpc.exports = {
    startCapture()  { g_events = []; g_capturing = true;  return {ok:true}; },
    stopCapture()   { g_capturing = false; return {ok:true, count: g_events.length}; },
    getEvents()     { return g_events; },
    exportKey() {
        if (!g_keyHandle) return {ok:false, error:'no key captured'};
        if (!exportFn)    return {ok:false, error:'export fn unavailable'};
        const blobName = utf16zString('KeyDataBlob');
        const pcb = Memory.alloc(4);
        let st = exportFn(g_keyHandle, ptr(0), blobName, ptr(0), 0, pcb, 0);
        if (st !== 0 && st !== -2147483643) return {ok:false, error:'size query 0x'+(st>>>0).toString(16)};
        const need = pcb.readU32();
        const out = Memory.alloc(need);
        st = exportFn(g_keyHandle, ptr(0), blobName, out, need, pcb, 0);
        if (st !== 0) return {ok:false, error:'export 0x'+(st>>>0).toString(16)};
        const got = pcb.readU32();
        return {ok:true, hex: bytesToHex(out.readByteArray(got))};
    }
};

send({type:'log', msg:'paired RPC ready'});
"""


def main():
    if len(sys.argv) < 2:
        print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 15

    session = frida.attach(pid)
    script = session.create_script(JS)

    def on_msg(m, d):
        if m['type'] == 'send' and m['payload'].get('type') == 'log':
            print('[frida]', m['payload']['msg'])
        elif m['type'] == 'error':
            print('[!]', m.get('description'))
    script.on('message', on_msg)
    script.load()

    print(f'[+] capturing {dur}s on PID {pid}')
    time.sleep(0.5)
    script.exports_sync.start_capture()
    time.sleep(dur)
    res = script.exports_sync.stop_capture()
    print(f'[+] stopped: {res["count"]} events')

    events = script.exports_sync.get_events()
    key_resp = script.exports_sync.export_key()
    session.detach()

    # Decode KeyDataBlob -> raw key bytes
    if not key_resp.get('ok'):
        print('[!] key export failed:', key_resp.get('error')); sys.exit(1)
    blob = bytes.fromhex(key_resp['hex'])
    # KeyDataBlob: magic(4) version(4) keysize(4) keybytes(keysize)
    assert blob[:4] == b'KDBM', f"unexpected magic {blob[:4]!r}"
    keysize = int.from_bytes(blob[8:12], 'little')
    key = blob[12:12 + keysize]
    print(f'[+] key extracted ({keysize}B): {key.hex()}')

    cipher = AuraCipher(key)

    enc_events  = [e for e in events if e['kind'] == 'enc']
    send_events = [e for e in events if e['kind'] in ('send', 'wsasend')]
    n_send = sum(1 for e in events if e['kind'] == 'send')
    n_wsasend = sum(1 for e in events if e['kind'] == 'wsasend')
    print(f'[+] {len(enc_events)} BCryptEncrypt + send={n_send} WSASend={n_wsasend} (= {len(send_events)} outbound)')

    if send_events:
        print('[+] sample outbound bytes (first event):')
        sample = bytes.fromhex(send_events[0]['hex'])
        print(f'    kind={send_events[0]["kind"]} sock={send_events[0]["sock"]} len={len(sample)}')
        print(f'    head: {sample[:64].hex()}')

    if not enc_events:
        print('[!] no encrypt events captured'); sys.exit(1)

    # Reconstruct continuous outbound streams per socket (Helper splits frames
    # across consecutive send() calls: a 4-byte length prefix, then the body).
    streams: dict[int, bytes] = {}
    for snd in send_events:
        sock = snd['sock']
        streams[sock] = streams.get(sock, b'') + bytes.fromhex(snd['hex'])
    if streams:
        print(f'[+] reassembled {len(streams)} outbound streams: ' +
              ', '.join(f'sock={s} ({len(b)}B)' for s, b in streams.items()))

    # For each enc event, build the expected wire frame and look for it in any stream
    matched = 0
    crypto_ok = 0
    for enc in enc_events:
        nonce = bytes.fromhex(enc['nonce_hex'])
        ct    = bytes.fromhex(enc['cipher_hex'])
        tag   = bytes.fromhex(enc['tag_hex'])
        plain = bytes.fromhex(enc['plain_hex'])

        # 1) Crypto check: re-encrypt our way, confirm match
        try:
            our_ct, our_tag = cipher.encrypt(plain, nonce)
            assert our_ct == ct and our_tag == tag, "Python encrypt diverged"
            crypto_ok += 1
        except Exception as ex:
            print(f'[!] crypto check failed for nonce={nonce.hex()[:16]}: {ex}')
            continue

        # 2) Wire check: search in reassembled streams
        expected = pack_frame(Frame(nonce=nonce, ciphertext=ct, tag=tag))
        for sock, stream in streams.items():
            if expected in stream:
                matched += 1
                offset = stream.find(expected)
                print(f'    [OK] enc nonce={nonce.hex()[:16]}... -> wire stream sock={sock} offset={offset}')
                break

    print(f'[+] crypto round-trip: {crypto_ok} / {len(enc_events)} pairs match')
    print(f'[+] wire frame match: {matched} / {len(enc_events)} found in send() bytes')

    if crypto_ok == len(enc_events) and matched > 0:
        print('\n*** END-TO-END VALIDATED [v0.2] ***')
        print('    AuraCipher reproduces UserSessionHelper output')
        print('    pack_frame(Frame(nonce, ct, tag)) appears verbatim on the wire')
    elif crypto_ok == len(enc_events):
        print('\n*** CRYPTO VALIDATED ***  (wire frame match needs send() coverage)')
    else:
        print('\n*** VALIDATION FAILED ***')


if __name__ == "__main__":
    main()
