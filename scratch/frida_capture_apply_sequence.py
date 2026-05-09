"""Capture the EXACT sequence of (BCryptEncrypt -> send) calls during
ONE Apply click, with timestamps and ordering.

This tells us:
  - How many encrypt calls per logical SetMatrixLED apply
  - Plaintext input size for each
  - Exact wire bytes sent for each
  - The interleaving: encrypt all then send all? or encrypt-send-encrypt-send?
"""
import sys, time, json, datetime, frida
from pathlib import Path

JS = r"""
'use strict';
let g_seq = 0;

function expByName(modName, fnName) {
    const mod = Process.findModuleByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e) { return null; }
}

const encAddr = expByName('bcrypt.dll', 'BCryptEncrypt');
const sendAddr = expByName('ws2_32.dll', 'send') || expByName('WS2_32.dll', 'send');

if (encAddr) {
    Interceptor.attach(encAddr, {
        onEnter(args) {
            this.seq = ++g_seq;
            this.plain = args[1];
            this.cbPlain = args[2].toInt32();
            this.cBuf = args[6];
            this.pcb = args[8];
            // Also stash the auth-info struct pointer so we can read the nonce
            this.info = args[3];
        },
        onLeave(retval) {
            if (this.cbPlain <= 0 || this.cbPlain > 65536) return;
            const ptHex = this.cbPlain ? this.plain.readByteArray(this.cbPlain) : null;
            const got = this.pcb.readU32();
            const ctHex = (got > 0 && got < 65536) ? this.cBuf.readByteArray(got) : null;
            // Try to read nonce/tag from info struct
            let nonceHex = null, tagHex = null;
            if (!this.info.isNull()) {
                try {
                    const noncePtr = this.info.add(8).readPointer();
                    const cbNonce = this.info.add(16).readU32();
                    if (cbNonce > 0 && cbNonce < 64 && !noncePtr.isNull()) {
                        nonceHex = noncePtr.readByteArray(cbNonce);
                    }
                    const tagPtr = this.info.add(40).readPointer();
                    const cbTag = this.info.add(48).readU32();
                    if (cbTag > 0 && cbTag < 64 && !tagPtr.isNull()) {
                        tagHex = tagPtr.readByteArray(cbTag);
                    }
                } catch(e){}
            }
            send({type:'enc', seq:this.seq, plain_len:this.cbPlain, cipher_len:got,
                  has_info: !this.info.isNull()}, ptHex);
            if (ctHex) send({type:'enc_cipher', seq:this.seq}, ctHex);
            if (nonceHex) send({type:'enc_nonce', seq:this.seq}, nonceHex);
            if (tagHex) send({type:'enc_tag', seq:this.seq}, tagHex);
        }
    });
}

if (sendAddr) {
    Interceptor.attach(sendAddr, {
        onEnter(args) { this.seq = ++g_seq; this.s = args[0].toInt32(); this.buf = args[1]; this.len = args[2].toInt32(); },
        onLeave(retval) {
            const got = retval.toInt32();
            if (got <= 0) return;
            const data = this.buf.readByteArray(Math.min(got, 65536));
            send({type:'send', seq:this.seq, sock:this.s, n:got}, data);
        }
    });
}

send({type:'log', msg: 'sequence-capture hooks installed'});
"""


SESSION = time.strftime("%Y%m%d_%H%M%S")
OUT_DIR = Path(__file__).parent / "captures"
OUT_DIR.mkdir(exist_ok=True)
OUT = OUT_DIR / f"apply_sequence_{SESSION}.jsonl"


def main():
    if len(sys.argv) < 2:
        print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30

    session = frida.attach(pid)
    script = session.create_script(JS)

    f = OUT.open("w", encoding="utf-8")

    def on_msg(m, d):
        if m["type"] != "send": return
        p = m["payload"]
        kind = p.get("type")
        if kind == "log":
            print("[frida]", p["msg"]); return
        rec = dict(p)
        if d is not None: rec["data_hex"] = d.hex()
        rec["wall"] = datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]
        f.write(json.dumps(rec) + "\n")
        f.flush()
        # Live summary
        if kind in ("enc", "send"):
            extra = ''
            if kind == 'enc': extra = f' plain={p.get("plain_len",0)} cipher={p.get("cipher_len",0)}'
            elif kind == 'send': extra = f' sock={p.get("sock")} n={p.get("n")}'
            print(f"  seq={p['seq']:5} {kind:12}{extra}")

    script.on("message", on_msg)
    script.load()
    print(f"[+] sequence capture for {dur}s; out -> {OUT}")
    print(f"[+] VLAD: do ONE matrix Apply (change color, click Apply)")
    time.sleep(dur)
    session.detach()
    f.close()
    print(f"[+] saved {OUT}")


if __name__ == "__main__":
    main()
