"""Replay the EXACT byte sequence UserSessionHelper sent during a captured Apply.

Tests whether ArmouryCrate.Service rejects nonce-replays. If it accepts,
matrix should re-apply the captured-state config (probably a no-op if state
already matches; otherwise visible change). If it rejects, we know AES-GCM
nonce-replay protection is in effect on the server side and we have to
make every replay "fresh" with new key material.

Usage:
    python scratch/frida_replay_wire.py <PID> --capture <jsonl>
"""
import argparse, json, sys, time, frida
from pathlib import Path

JS = r"""
'use strict';
let g_sendSocket = null;

const sendAddr = (() => {
    const m = Process.findModuleByName('ws2_32.dll') || Process.findModuleByName('WS2_32.dll');
    if (!m) return null;
    try { return m.findExportByName('send'); } catch(e){}
    try { return m.getExportByName('send'); } catch(e){ return null; }
})();

if (sendAddr) {
    Interceptor.attach(sendAddr, {
        onEnter(args) { this.s = args[0].toInt32(); this.len = args[2].toInt32(); },
        onLeave(retval) {
            if (retval.toInt32() > 0 && this.len >= 4) {
                if (g_sendSocket !== this.s) {
                    g_sendSocket = this.s;
                    send({type:'log', msg:'send sock='+this.s});
                }
            }
        }
    });
}

const sendFn = sendAddr ? new NativeFunction(sendAddr, 'int', ['int','pointer','int','int']) : null;

function bytesFromHex(hex) {
    const a = new Uint8Array(hex.length / 2);
    for (let i = 0; i < a.length; i++) a[i] = parseInt(hex.substr(i*2, 2), 16);
    return a;
}

rpc.exports = {
    state() { return { send_socket: g_sendSocket }; },
    sendBytes(sock, hex) {
        if (!sendFn) return {ok:false, error:'no send fn'};
        const b = bytesFromHex(hex);
        const buf = Memory.alloc(b.length || 1);
        if (b.length) buf.writeByteArray(Array.from(b));
        const written = sendFn(sock, buf, b.length, 0);
        return {ok: written > 0, n: written};
    }
};

send({type:'log', msg:'wire-replay RPC ready'});
"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pid", type=int)
    parser.add_argument("--capture", required=True, help="apply_sequence_*.jsonl from a previous capture")
    parser.add_argument("--max-frames", type=int, default=50, help="how many wire frames to replay (cap to avoid pathological replay)")
    args = parser.parse_args()

    log = Path(args.capture)
    if not log.exists():
        print(f"[!] missing: {log}"); return 1

    events = [json.loads(l) for l in log.open()]
    sends = [e for e in events if e.get("type") == "send" and e.get("data_hex")]
    print(f"[+] {len(sends)} send events in capture; replaying first {args.max_frames}")

    session = frida.attach(args.pid)
    script = session.create_script(JS)
    def on_msg(m, d):
        if m["type"] == "send":
            p = m["payload"]
            if p.get("type") == "log":
                print("[frida]", p["msg"])
    script.on("message", on_msg)
    script.load()
    print("[+] script loaded; observing send to learn current socket...")
    deadline = time.time() + 10
    while time.time() < deadline:
        s = script.exports_sync.state()
        if s["send_socket"]: break
        time.sleep(0.3)
    s = script.exports_sync.state()
    print(f"[+] state: {s}")
    if not s["send_socket"]:
        print("[!] no send socket observed in 10s")
        session.detach(); return 1

    sock = s["send_socket"]
    print(f"[+] replaying {min(args.max_frames, len(sends))} wire frames on sock={sock}")
    for i, e in enumerate(sends[: args.max_frames]):
        h = e["data_hex"]
        res = script.exports_sync.send_bytes(sock, h)
        print(f"  frame {i+1:2}/{min(args.max_frames, len(sends))} n={e.get('n')} -> wrote {res.get('n', 0)} ok={res.get('ok')}")
        time.sleep(0.05)
    print()
    print("VLAD: did the matrix change at all in the last few seconds?")
    time.sleep(2)
    session.detach()
    return 0


if __name__ == "__main__":
    sys.exit(main())
