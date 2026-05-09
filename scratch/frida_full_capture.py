"""Comprehensive BCrypt capture + replay hook for UserSessionHelper.

Phase 1 (capture):
  - Hook BCryptEncrypt and BCryptDecrypt
  - Persist the BCRYPT_KEY_HANDLE used in JS global state
  - Hook ws2_32!send to know which socket carries each encrypt
  - Save full plaintext + ciphertext per direction with timestamps

Phase 2 (replay, exposed as RPC for Polylux Python side):
  - rpc.encrypt(plaintext_hex) -> ciphertext_hex
  - rpc.send_via_socket(ciphertext_hex) -> bytes_written
  - rpc.get_state() -> {has_key, send_socket, last_message_id, ...}
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

import frida


JS = r"""
'use strict';

let g_keyHandle = null;
let g_sendSocket = null;
let g_msgIdCounter = 0;

function modByName(name) {
    return Process.findModuleByName(name);
}
function expByName(modName, fnName) {
    const mod = modByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e) { return null; }
}

// ---- BCryptEncrypt --------------------------------------------------------
const encAddr = expByName('bcrypt.dll', 'BCryptEncrypt');
if (encAddr) {
    Interceptor.attach(encAddr, {
        onEnter(args) {
            this.hKey = args[0];
            this.pPlain = args[1];
            this.cbPlain = args[2].toInt32();
            this.pCiph = args[6];
            this.pcbResult = args[8];
            // Stash key handle on first sight (ASCII-safe — Frida send() rejects 64-bit ptr)
            if (!g_keyHandle) {
                g_keyHandle = this.hKey;
                send({type: 'state', event: 'keyhandle_captured', handle: this.hKey.toString()});
            }
        },
        onLeave(retval) {
            if (this.cbPlain <= 0 || this.cbPlain > 65536) return;
            const plain = this.pPlain.readByteArray(Math.min(this.cbPlain, 65536));
            // ciphertext length comes from pcbResult OUT param
            let cipherLen = 0;
            try { cipherLen = this.pcbResult.readU32(); } catch(e){}
            const cipher = (cipherLen > 0 && cipherLen < 65536) ? this.pCiph.readByteArray(cipherLen) : null;
            send({type: 'enc', plain_len: this.cbPlain, cipher_len: cipherLen, key: this.hKey.toString()}, plain);
            // Also send cipher as separate frame so receiver can correlate
            if (cipher) {
                send({type: 'enc_out', plain_len: this.cbPlain, cipher_len: cipherLen}, cipher);
            }
        }
    });
    send({type: 'log', msg: 'HOOK BCryptEncrypt @ ' + encAddr});
}

// ---- BCryptDecrypt --------------------------------------------------------
const decAddr = expByName('bcrypt.dll', 'BCryptDecrypt');
if (decAddr) {
    Interceptor.attach(decAddr, {
        onEnter(args) {
            this.hKey = args[0];
            this.pCiph = args[1];
            this.cbCiph = args[2].toInt32();
            this.pPlain = args[6];
            this.pcbResult = args[8];
        },
        onLeave(retval) {
            if (retval.toInt32() !== 0) return;
            if (this.pcbResult.isNull()) return;
            let got = 0;
            try { got = this.pcbResult.readU32(); } catch(e){}
            if (got <= 0 || got > 65536) return;
            const plain = this.pPlain.readByteArray(got);
            send({type: 'dec', cipher_len: this.cbCiph, plain_len: got, key: this.hKey.toString()}, plain);
        }
    });
    send({type: 'log', msg: 'HOOK BCryptDecrypt @ ' + decAddr});
}

// ---- ws2_32!send ----------------------------------------------------------
const sendAddr = expByName('ws2_32.dll', 'send') || expByName('WS2_32.dll', 'send');
if (sendAddr) {
    Interceptor.attach(sendAddr, {
        onEnter(args) {
            this.s = args[0].toInt32();
            this.buf = args[1];
            this.len = args[2].toInt32();
        },
        onLeave(retval) {
            const got = retval.toInt32();
            if (got <= 0 || got > 65536) return;
            // The "interesting" socket is whichever one carries length-prefixed
            // BCrypt frames. Heuristic: track the most-recently-written socket.
            if (got >= 4) {
                g_sendSocket = this.s;
            }
            const data = this.buf.readByteArray(Math.min(got, 65536));
            send({type: 'wire_send', sock: this.s, n: got}, data);
        }
    });
    send({type: 'log', msg: 'HOOK ws2_32!send'});
}

// ---- RPC interface --------------------------------------------------------
rpc.exports = {
    state() {
        return {
            has_key: g_keyHandle !== null,
            key_handle: g_keyHandle ? g_keyHandle.toString() : null,
            send_socket: g_sendSocket
        };
    },

    /**
     * Encrypt plaintext using the stashed BCRYPT_KEY_HANDLE.
     * plaintext_hex: string of hex bytes
     * Returns: { ok: bool, cipher_hex: string, error: string }
     */
    encrypt(plaintext_hex) {
        if (!g_keyHandle) return { ok: false, error: 'no key captured yet — wait for an Apply click first' };
        if (!encAddr) return { ok: false, error: 'BCryptEncrypt addr unknown' };

        const plainBytes = new Uint8Array(plaintext_hex.length / 2);
        for (let i = 0; i < plainBytes.length; i++) {
            plainBytes[i] = parseInt(plaintext_hex.substr(i*2, 2), 16);
        }
        const plainBuf = Memory.alloc(plainBytes.length || 1);
        Memory.writeByteArray(plainBuf, plainBytes);

        // Allocate a generous output buffer (~plaintext + 256 padding/IV/tag)
        const outCap = plainBytes.length + 256;
        const cipherBuf = Memory.alloc(outCap);
        const pcbResult = Memory.alloc(4);

        // Call BCryptEncrypt(hKey, pbInput, cbInput, NULL, NULL, 0, pbOutput, cbOutput, pcbResult, 0)
        const fn = new NativeFunction(encAddr, 'int', [
            'pointer','pointer','uint32','pointer','pointer','uint32',
            'pointer','uint32','pointer','uint32'
        ]);
        const status = fn(
            g_keyHandle,
            plainBuf, plainBytes.length,
            ptr(0), ptr(0), 0,
            cipherBuf, outCap, pcbResult, 0
        );
        if (status !== 0) {
            return { ok: false, error: 'BCryptEncrypt status 0x' + (status>>>0).toString(16) };
        }
        const got = Memory.readU32(pcbResult);
        const out = Memory.readByteArray(cipherBuf, got);
        // Convert ArrayBuffer -> hex
        const u8 = new Uint8Array(out);
        let hex = '';
        for (let i = 0; i < u8.length; i++) {
            hex += (u8[i] < 16 ? '0' : '') + u8[i].toString(16);
        }
        return { ok: true, cipher_hex: hex, cipher_len: got };
    },
};

send({type: 'log', msg: 'RPC ready: state(), encrypt(hex)'});
"""


SESSION_LOG = Path(__file__).parent / "captures" / f"frida_full_{time.strftime('%Y%m%d_%H%M%S')}.jsonl"
SESSION_LOG.parent.mkdir(parents=True, exist_ok=True)
log_f = SESSION_LOG.open("w", encoding="utf-8")


def on_message(message, data):
    if message["type"] != "send":
        if message["type"] == "error":
            print(f"[!] frida error: {message.get('description')}")
        return
    p = message["payload"]
    kind = p.get("type")
    if kind == "log":
        print(f"[frida] {p['msg']}")
        return
    # Persist to JSONL
    rec = dict(p)
    if data is not None:
        rec["data_hex"] = data.hex()
    rec["wall"] = time.strftime("%H:%M:%S")
    log_f.write(json.dumps(rec) + "\n")
    log_f.flush()
    # Live summary
    if kind == "state":
        print(f"[STATE] {p}")
    elif kind in ("enc", "dec"):
        n = p.get("plain_len", 0)
        if data is None:
            return
        # Try printable hint
        try:
            head = data[:80]
            printable = sum(1 for b in head if 32 <= b < 127 or b in (9, 10, 13))
        except Exception:
            printable = 0
        snippet = data[:80].hex()
        print(f"  {kind:3} {n:5}b  printable={printable:3d}/{min(80,len(data))}  hex={snippet}")
    elif kind == "wire_send":
        print(f"  WIRE→ sock={p['sock']} n={p['n']}  hex={data[:24].hex() if data else ''}")
    elif kind == "enc_out":
        pass  # we already log enc, skip duplicate prints


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: frida_full_capture.py <PID> [seconds]")
        return 2
    pid = int(sys.argv[1])
    duration = int(sys.argv[2]) if len(sys.argv) > 2 else 60
    print(f"[+] attaching to PID {pid}")
    session = frida.attach(pid)
    script = session.create_script(JS)
    script.on("message", on_message)
    script.load()
    print(f"[+] script loaded, RPC available")
    print(f"[+] log file: {SESSION_LOG}")
    print(f"[+] capturing for {duration}s — VLAD: do something in Armoury Crate")
    time.sleep(duration)
    print("\n[+] Final state:")
    print(json.dumps(script.exports_sync.state(), indent=2))
    session.detach()
    print("[+] detached")
    log_f.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
