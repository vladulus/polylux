"""Wait for UserSessionHelper.exe to appear, attach IMMEDIATELY, and capture
EVERY byte that flows in/out plus every BCrypt operation, from process birth.

Use this to catch the connection-time handshake between UWP and Helper —
the bytes my fresh-TCP replay script (scratch/replay_setmatrixled.py) is
clearly missing.

Procedure:
  1. Vlad stops all of Armoury Crate (services + tray + processes).
  2. Run this script. It polls every 100 ms for UserSessionHelper.
  3. Vlad starts AC fresh.
  4. Script attaches and starts capturing within ms of helper birth.

Hooks:
  bcrypt.dll!BCryptOpenAlgorithmProvider  -- learn cipher provider name
  bcrypt.dll!BCryptGenerateSymmetricKey   -- catch key derivation
  bcrypt.dll!BCryptSetProperty            -- catch IV / chain mode setting
  bcrypt.dll!BCryptEncrypt                -- plaintext + cipher + nonce
  bcrypt.dll!BCryptDecrypt                -- inbound plaintext
  ws2_32.dll!WSAAccept                    -- new client connect (WHO)
  ws2_32.dll!accept                       -- old-style accept
  ws2_32.dll!WSARecv / recv               -- inbound bytes
  ws2_32.dll!WSASend / send               -- outbound bytes
"""
from __future__ import annotations

import json
import sys
import time
from datetime import datetime
from pathlib import Path

import frida
import psutil

HELPER_NAME = "ArmouryCrate.UserSessionHelper.exe"


JS = r"""
'use strict';

let g_seq = 0;

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

function readBuf(ptr, n) {
    if (ptr.isNull() || n <= 0 || n > 65536) return null;
    try { return ptr.readByteArray(n); } catch(e) { return null; }
}

// --- BCrypt: learn the cipher setup ---
const BCRYPT_OPEN = expByName('bcrypt.dll', 'BCryptOpenAlgorithmProvider');
if (BCRYPT_OPEN) {
    Interceptor.attach(BCRYPT_OPEN, {
        onEnter(args) {
            // (phAlgorithm, pszAlgId, pszImplementation, dwFlags)
            const algo = args[1].isNull() ? null : args[1].readUtf16String();
            const impl = args[2].isNull() ? null : args[2].readUtf16String();
            send({type:'bcrypt_open', seq:++g_seq, ts:Date.now(), algo, impl});
        }
    });
}

const BCRYPT_GENKEY = expByName('bcrypt.dll', 'BCryptGenerateSymmetricKey');
if (BCRYPT_GENKEY) {
    Interceptor.attach(BCRYPT_GENKEY, {
        onEnter(args) {
            // (hAlgorithm, phKey, pbKeyObject, cbKeyObject, pbSecret, cbSecret, dwFlags)
            const cbSecret = args[5].toInt32();
            const secret = readBuf(args[4], cbSecret);
            send({type:'bcrypt_genkey', seq:++g_seq, ts:Date.now(),
                  cbKeyObject: args[3].toInt32(), cbSecret},
                 secret);
        }
    });
}

const BCRYPT_SET = expByName('bcrypt.dll', 'BCryptSetProperty');
if (BCRYPT_SET) {
    Interceptor.attach(BCRYPT_SET, {
        onEnter(args) {
            // (hObject, pszProperty, pbInput, cbInput, dwFlags)
            const prop = args[1].isNull() ? null : args[1].readUtf16String();
            const cb = args[3].toInt32();
            const data = readBuf(args[2], cb);
            send({type:'bcrypt_set', seq:++g_seq, ts:Date.now(), prop, cb}, data);
        }
    });
}

const BCRYPT_ENC = expByName('bcrypt.dll', 'BCryptEncrypt');
if (BCRYPT_ENC) {
    Interceptor.attach(BCRYPT_ENC, {
        onEnter(args) {
            this.skip = false;
            const cbOut = args[7].toInt32();
            if (cbOut === 0) { this.skip = true; return; }
            this.cbPlain = args[2].toInt32();
            this.plain = readBuf(args[1], this.cbPlain);
            this.pCipher = args[6];
            this.pcb = args[8];
            this.pInfo = args[3];
        },
        onLeave(retval) {
            if (this.skip) return;
            if (retval.toInt32() !== 0) return;
            const got = this.pcb.readU32();
            const cipher = readBuf(this.pCipher, got);
            let nonce = null, tag = null;
            if (!this.pInfo.isNull()) {
                try {
                    const cbInfo = this.pInfo.readU32();
                    if (cbInfo === 0x58) {
                        const nP = this.pInfo.add(8).readPointer();
                        const nL = this.pInfo.add(16).readU32();
                        nonce = readBuf(nP, nL);
                        const tP = this.pInfo.add(40).readPointer();
                        const tL = this.pInfo.add(48).readU32();
                        tag = readBuf(tP, tL);
                    }
                } catch(e){}
            }
            send({type:'enc', seq:++g_seq, ts:Date.now(),
                  plain_hex: bytesToHex(this.plain),
                  cipher_hex: cipher ? bytesToHex(cipher) : null,
                  nonce_hex: nonce ? bytesToHex(nonce) : null,
                  tag_hex: tag ? bytesToHex(tag) : null});
        }
    });
}

const BCRYPT_DEC = expByName('bcrypt.dll', 'BCryptDecrypt');
if (BCRYPT_DEC) {
    Interceptor.attach(BCRYPT_DEC, {
        onEnter(args) { this.pPlain = args[6]; this.pcb = args[8]; },
        onLeave(retval) {
            if (retval.toInt32() !== 0) return;
            if (this.pcb.isNull()) return;
            const got = this.pcb.readU32();
            const plain = readBuf(this.pPlain, got);
            send({type:'dec', seq:++g_seq, ts:Date.now(),
                  plain_hex: plain ? bytesToHex(plain) : null});
        }
    });
}

// --- Sockets ---
function dumpSockaddr(addr) {
    try {
        const fam = addr.readU16();
        if (fam !== 2) return null;
        const port = (addr.add(2).readU8() << 8) | addr.add(3).readU8();
        const a = addr.add(4);
        return {ip:`${a.readU8()}.${a.add(1).readU8()}.${a.add(2).readU8()}.${a.add(3).readU8()}`, port};
    } catch(e) { return null; }
}

const ACCEPT = expByName('ws2_32.dll', 'accept');
if (ACCEPT) {
    Interceptor.attach(ACCEPT, {
        onEnter(args) { this.sListen = args[0].toInt32(); },
        onLeave(retval) {
            const newSock = retval.toInt32();
            if (newSock <= 0) return;
            send({type:'accept', seq:++g_seq, ts:Date.now(), listen_sock:this.sListen, new_sock:newSock});
        }
    });
}

const WSAACCEPT = expByName('ws2_32.dll', 'WSAAccept');
if (WSAACCEPT) {
    Interceptor.attach(WSAACCEPT, {
        onEnter(args) { this.sListen = args[0].toInt32(); },
        onLeave(retval) {
            const newSock = retval.toInt32();
            if (newSock <= 0) return;
            send({type:'wsaaccept', seq:++g_seq, ts:Date.now(), listen_sock:this.sListen, new_sock:newSock});
        }
    });
}

const RECV = expByName('ws2_32.dll', 'recv');
if (RECV) {
    Interceptor.attach(RECV, {
        onEnter(args) { this.s = args[0].toInt32(); this.buf = args[1]; },
        onLeave(retval) {
            const got = retval.toInt32();
            if (got <= 0) return;
            const data = readBuf(this.buf, got);
            send({type:'recv', seq:++g_seq, ts:Date.now(), sock:this.s, n:got,
                  hex: data ? bytesToHex(data) : null});
        }
    });
}

const WSARECV = expByName('ws2_32.dll', 'WSARecv');
if (WSARECV) {
    Interceptor.attach(WSARECV, {
        onEnter(args) {
            this.sock = args[0].toInt32();
            this.pBuffers = args[1];
            this.cnt = args[2].toInt32();
            this.pBytesRecv = args[3];
        },
        onLeave(retval) {
            if (this.pBytesRecv.isNull()) return;
            const got = this.pBytesRecv.readU32();
            if (got <= 0 || got > 1<<20) return;
            for (let i = 0; i < this.cnt; i++) {
                const wb = this.pBuffers.add(i*16);
                const len = wb.readU32();
                if (len === 0) continue;
                const bp = wb.add(8).readPointer();
                if (bp.isNull()) continue;
                const data = readBuf(bp, Math.min(len, got));
                if (data) {
                    send({type:'wsarecv', seq:++g_seq, ts:Date.now(),
                          sock:this.sock, n:Math.min(len, got),
                          hex: bytesToHex(data)});
                }
                break;  // first non-empty buf is enough
            }
        }
    });
}

const SEND = expByName('ws2_32.dll', 'send');
if (SEND) {
    Interceptor.attach(SEND, {
        onEnter(args) { this.s = args[0].toInt32(); this.buf = args[1]; this.len = args[2].toInt32(); },
        onLeave(retval) {
            const got = retval.toInt32();
            if (got <= 0) return;
            const data = readBuf(this.buf, got);
            send({type:'send', seq:++g_seq, ts:Date.now(), sock:this.s, n:got,
                  hex: data ? bytesToHex(data) : null});
        }
    });
}

const WSASEND = expByName('ws2_32.dll', 'WSASend');
if (WSASEND) {
    Interceptor.attach(WSASEND, {
        onEnter(args) {
            const sock = args[0].toInt32();
            const pBuffers = args[1];
            const cnt = args[2].toInt32();
            for (let i = 0; i < cnt; i++) {
                const wb = pBuffers.add(i*16);
                const len = wb.readU32();
                if (len === 0) continue;
                const bp = wb.add(8).readPointer();
                if (bp.isNull()) continue;
                const data = readBuf(bp, len);
                if (data) {
                    send({type:'wsasend', seq:++g_seq, ts:Date.now(),
                          sock, n:len, hex: bytesToHex(data)});
                }
            }
        }
    });
}

send({type:'log', msg:'all hooks armed at process birth'});
"""


def find_helper_pid():
    for proc in psutil.process_iter(["pid", "name"]):
        if proc.info["name"] and proc.info["name"].lower() == HELPER_NAME.lower():
            return int(proc.info["pid"])
    return None


def main():
    out = Path("scratch/captures") / f"birth_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jsonl"
    out.parent.mkdir(parents=True, exist_ok=True)

    print(f"[+] waiting for {HELPER_NAME} to appear (poll every 100 ms)...")
    print(f"[+] Vlad: confirm Armoury stack is fully stopped, then start AC fresh.")
    deadline = time.time() + 120  # 2 minutes
    pid = None
    while time.time() < deadline:
        pid = find_helper_pid()
        if pid is not None:
            break
        time.sleep(0.1)

    if pid is None:
        print(f"[!] timed out waiting for {HELPER_NAME}"); sys.exit(1)
    print(f"[+] found PID {pid}, attaching NOW")

    session = frida.attach(pid)
    script = session.create_script(JS)

    f = out.open("w", encoding="utf-8")
    counters = {}

    def on_msg(m, d):
        if m["type"] != "send":
            if m["type"] == "error":
                print("[!]", m.get("description"))
            return
        p = m["payload"]
        kind = p.get("type")
        if kind == "log":
            print("[frida]", p["msg"]); return
        counters[kind] = counters.get(kind, 0) + 1
        rec = dict(p)
        if d is not None:
            rec["data_hex"] = d.hex()
        rec["wall"] = datetime.now().strftime("%H:%M:%S.%f")[:-3]
        f.write(json.dumps(rec) + "\n"); f.flush()

        # Live print key events
        if kind in ("bcrypt_open", "bcrypt_genkey", "bcrypt_set", "accept", "wsaaccept"):
            print(f"  {kind:14} seq={p['seq']} {dict((k,v) for k,v in p.items() if k not in ('type','seq','ts'))}")
        elif kind in ("recv", "wsarecv", "send", "wsasend"):
            n = p.get("n", "?")
            sock = p.get("sock", "?")
            head = (p.get("hex") or "")[:32]
            print(f"  {kind:14} seq={p['seq']} sock={sock} n={n} head={head}")

    script.on("message", on_msg)
    script.load()

    print(f"[+] capturing for 90 s — Vlad now: open AC, click matrix tab, click Apply if you want")
    time.sleep(90)
    session.detach()
    f.close()
    print(f"\n[+] counters: {counters}")
    print(f"[+] saved -> {out}")


if __name__ == "__main__":
    main()
