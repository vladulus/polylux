"""Comprehensive UserSessionHelper capture v2 — handles WSASend (Windows
async pattern) + correlates BCryptEncrypt output to wire send buffer.

Key insights baked in (lessons from prior session debugging):
  - UserSessionHelper uses WSASend, NOT plain send(), for outbound TCP.
    Boost::Asio + Windows IOCP under the hood.
  - BCryptEncrypt outputs ciphertext to a buffer; that same buffer
    pointer often appears in a subsequent WSASend WSABUF — that's the
    correlation key.
  - WSABUF on x64 is 16 bytes total: ULONG len (4) + 4 padding + CHAR* buf (8)
  - Overlapped IO: lpOverlapped non-NULL means async, but the bytes are
    committed at WSASend call time. onEnter capture is correct.
  - Filter noise: skip frames < 50 bytes (background poll keepalives).
"""
from __future__ import annotations
import sys, time, json, frida
from datetime import datetime
from pathlib import Path

JS = r"""
'use strict';

// --- Module / function lookups (Frida 17+ syntax) ---
function expByName(modName, fnName) {
    const mod = Process.findModuleByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e){ return null; }
}

const WSASEND       = expByName('ws2_32.dll', 'WSASend');
const WSARECV       = expByName('ws2_32.dll', 'WSARecv');
const SEND          = expByName('ws2_32.dll', 'send');
const RECV          = expByName('ws2_32.dll', 'recv');
const WSACONNECT    = expByName('ws2_32.dll', 'WSAConnect');
const CONNECT_FN    = expByName('ws2_32.dll', 'connect');
const BCRYPT_ENC    = expByName('bcrypt.dll', 'BCryptEncrypt');
const BCRYPT_DEC    = expByName('bcrypt.dll', 'BCryptDecrypt');

// --- Correlation state: most-recent encrypt output ---
let g_lastEnc = null;        // {addr (ptr.toString), len, ts, plaintext_hex}
let g_seq = 0;
const CORRELATE_WINDOW_MS = 100;

// --- WSABUF helper ---
function readWsabufList(pBuffers, count) {
    // x64 layout: { ULONG len; CHAR* buf; } sizeof = 16 due to alignment
    const SZ = 16;
    const out = [];
    for (let i = 0; i < count; i++) {
        const wb = pBuffers.add(i * SZ);
        const len = wb.readU32();
        if (len === 0 || len > 1<<20) continue;
        const bufPtr = wb.add(8).readPointer();
        if (bufPtr.isNull()) continue;
        const data = bufPtr.readByteArray(Math.min(len, 65536));
        out.push({len, addr: bufPtr.toString(), data});
    }
    return out;
}

// --- BCryptEncrypt: stash plaintext + ciphertext output address for correlation ---
if (BCRYPT_ENC) {
    Interceptor.attach(BCRYPT_ENC, {
        onEnter(args) {
            this.plain = args[1]; this.cb = args[2].toInt32();
            this.cBuf = args[6]; this.pcb = args[8];
            this.info = args[3];
        },
        onLeave(retval) {
            if (retval.toInt32() !== 0) return;
            if (this.cb <= 0 || this.cb > 65536) return;
            const ptHex = this.plain.readByteArray(this.cb);
            const cipherLen = this.pcb.isNull() ? 0 : this.pcb.readU32();
            // remember the cipher buffer for correlation with next WSASend
            g_lastEnc = {
                addr: this.cBuf.toString(),
                len: cipherLen,
                ts: Date.now()
            };
            // extract nonce + tag from auth-info (BCRYPT_AUTHENTICATED_CIPHER_MODE_INFO)
            let nonceHex = null, tagHex = null;
            if (!this.info.isNull()) {
                try {
                    const np = this.info.add(8).readPointer();
                    const nl = this.info.add(16).readU32();
                    if (nl > 0 && nl < 64 && !np.isNull()) nonceHex = np.readByteArray(nl);
                    const tp = this.info.add(40).readPointer();
                    const tl = this.info.add(48).readU32();
                    if (tl > 0 && tl < 64 && !tp.isNull()) tagHex = tp.readByteArray(tl);
                } catch(e){}
            }
            send({type:'enc', seq:++g_seq, ts:Date.now(),
                  plain_len:this.cb, cipher_len:cipherLen,
                  cipher_addr: this.cBuf.toString()}, ptHex);
            if (nonceHex) send({type:'enc_nonce', seq:g_seq}, nonceHex);
            if (tagHex)   send({type:'enc_tag', seq:g_seq}, tagHex);
        }
    });
}

// --- BCryptDecrypt: capture inbound plaintext too ---
if (BCRYPT_DEC) {
    Interceptor.attach(BCRYPT_DEC, {
        onEnter(args) { this.pPlain = args[6]; this.pcb = args[8]; },
        onLeave(retval) {
            if (retval.toInt32() !== 0) return;
            if (this.pcb.isNull()) return;
            const got = this.pcb.readU32();
            if (got <= 0 || got > 65536) return;
            const data = this.pPlain.readByteArray(got);
            send({type:'dec', seq:++g_seq, ts:Date.now(), plain_len:got}, data);
        }
    });
}

// --- WSASend: real outbound for IOCP-based servers (Boost::Asio etc.) ---
if (WSASEND) {
    Interceptor.attach(WSASEND, {
        onEnter(args) {
            const sock = args[0].toInt32();
            const pBuffers = args[1];
            const cnt = args[2].toInt32();
            if (cnt > 16 || cnt <= 0) return;
            const chunks = readWsabufList(pBuffers, cnt);
            // Concat all chunks into one logical message (most callers send 1 chunk anyway)
            for (const c of chunks) {
                // Correlate: same addr as most-recent BCryptEncrypt output?
                let correlation = null;
                if (g_lastEnc && (Date.now() - g_lastEnc.ts) < 100) {
                    if (c.addr === g_lastEnc.addr) {
                        correlation = 'matches enc#' + g_seq + ' addr+ts';
                    }
                }
                if (c.len < 50 && !correlation) continue;  // filter noise
                send({type:'wsasend', seq:++g_seq, ts:Date.now(),
                      sock, n: c.len, addr: c.addr, correlation}, c.data);
            }
        }
    });
}

// --- WSARecv: inbound for IOCP ---
if (WSARECV) {
    Interceptor.attach(WSARECV, {
        onEnter(args) {
            this.sock = args[0].toInt32();
            this.pBuffers = args[1];
            this.cnt = args[2].toInt32();
            this.pBytesRecv = args[3];
        },
        onLeave(retval) {
            // Synchronous completion: pBytesRecv has the count
            // Async (overlapped): bytes come via completion routine; we miss those here
            if (this.pBytesRecv.isNull()) return;
            const got = this.pBytesRecv.readU32();
            if (got <= 0 || got > 1<<20) return;
            const chunks = readWsabufList(this.pBuffers, this.cnt);
            for (const c of chunks) {
                if (c.len < 50) continue;
                send({type:'wsarecv', seq:++g_seq, ts:Date.now(),
                      sock: this.sock, n: c.len, addr: c.addr}, c.data);
                break; // we logged the first non-empty chunk; partial reads are OK
            }
        }
    });
}

// --- send() / recv() (synchronous, less common in modern Windows servers) ---
if (SEND) {
    Interceptor.attach(SEND, {
        onEnter(args) { this.s = args[0].toInt32(); this.buf = args[1]; this.len = args[2].toInt32(); },
        onLeave(retval) {
            const got = retval.toInt32();
            if (got <= 0 || got < 50) return;  // filter noise
            const data = this.buf.readByteArray(got);
            send({type:'send', seq:++g_seq, ts:Date.now(), sock: this.s, n: got}, data);
        }
    });
}
if (RECV) {
    Interceptor.attach(RECV, {
        onEnter(args) { this.s = args[0].toInt32(); this.buf = args[1]; },
        onLeave(retval) {
            const got = retval.toInt32();
            if (got <= 0 || got < 50) return;
            const data = this.buf.readByteArray(got);
            send({type:'recv', seq:++g_seq, ts:Date.now(), sock: this.s, n: got}, data);
        }
    });
}

// --- connect() / WSAConnect: identify endpoint per socket ---
function dumpSockaddr(addr) {
    const fam = addr.readU16();
    if (fam !== 2 /* AF_INET */) return null;
    const port = (addr.add(2).readU8() << 8) | addr.add(3).readU8();
    const a = addr.add(4);
    const ip = `${a.readU8()}.${a.add(1).readU8()}.${a.add(2).readU8()}.${a.add(3).readU8()}`;
    return {ip, port};
}
if (CONNECT_FN) {
    Interceptor.attach(CONNECT_FN, {
        onEnter(args) {
            const sock = args[0].toInt32();
            const ep = dumpSockaddr(args[1]);
            if (ep) send({type:'connect', sock, ip:ep.ip, port:ep.port});
        }
    });
}
if (WSACONNECT) {
    Interceptor.attach(WSACONNECT, {
        onEnter(args) {
            const sock = args[0].toInt32();
            const ep = dumpSockaddr(args[1]);
            if (ep) send({type:'wsaconnect', sock, ip:ep.ip, port:ep.port});
        }
    });
}

send({type:'log', msg:'capture v2 hooks armed: WSASend, WSARecv, send, recv, connect, BCryptEncrypt+Decrypt'});
"""


def main():
    if len(sys.argv) < 2:
        print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60

    out_path = Path('scratch/captures') / f'capture_v2_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jsonl'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    f = out_path.open('w', encoding='utf-8')

    session = frida.attach(pid)
    script = session.create_script(JS)

    counters = {'enc':0, 'dec':0, 'wsasend':0, 'wsarecv':0, 'send':0, 'recv':0, 'connect':0, 'wsaconnect':0}

    def on_msg(m, d):
        if m['type'] != 'send':
            if m['type']=='error': print('[!]', m.get('description'))
            return
        p = m['payload']
        kind = p.get('type')
        if kind == 'log':
            print('[frida]', p['msg']); return
        if kind in counters:
            counters[kind] += 1
        rec = dict(p)
        if d is not None: rec['data_hex'] = d.hex()
        rec['wall'] = datetime.now().strftime('%H:%M:%S.%f')[:-3]
        f.write(json.dumps(rec)+'\n'); f.flush()
        # Live brief print for non-noise
        if kind in ('enc','dec','wsasend'):
            extra = ''
            if kind == 'wsasend' and p.get('correlation'):
                extra = f' [{p["correlation"]}]'
            print(f"  {kind:8} seq={p.get('seq','?')} n={p.get('n', p.get('plain_len','?'))}{extra}")
        elif kind in ('connect','wsaconnect'):
            print(f"  CONNECT sock={p['sock']} -> {p['ip']}:{p['port']}")

    script.on('message', on_msg)
    script.load()
    print(f'[+] capture v2 active for {dur}s — write to {out_path}')
    print(f'[+] VLAD: do an Apply in Armoury Crate during this window')
    time.sleep(dur)
    session.detach()
    f.close()
    print(f'\n[+] counters: {counters}')
    print(f'[+] saved -> {out_path}')


if __name__ == '__main__':
    main()
