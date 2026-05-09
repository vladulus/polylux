"""Capture an Apply burst then immediately replay it on the same socket.

Strategy: stay attached, observe send() calls in real time, buffer them as
they come in, then replay the buffer once the burst quiets down.

We're testing whether the server has AES-GCM nonce-replay protection. If
not, double-Apply should work and the matrix may flicker (or no-op if
state already matches the captured state).
"""
import sys, time, frida, threading

JS = r"""
'use strict';
let g_lastSocket = null;
let g_buffer = [];   // [{sock, hex}]
let g_capturing = false;

const sendAddr = (() => {
    const m = Process.findModuleByName('ws2_32.dll') || Process.findModuleByName('WS2_32.dll');
    if (!m) return null;
    try { return m.findExportByName('send'); } catch(e){}
    try { return m.getExportByName('send'); } catch(e){ return null; }
})();

if (sendAddr) {
    Interceptor.attach(sendAddr, {
        onEnter(args) { this.s = args[0].toInt32(); this.buf = args[1]; this.len = args[2].toInt32(); },
        onLeave(retval) {
            const got = retval.toInt32();
            if (got <= 0) return;
            g_lastSocket = this.s;
            if (g_capturing) {
                const data = this.buf.readByteArray(got);
                const u8 = new Uint8Array(data);
                let hex = '';
                for (let i = 0; i < u8.length; i++) hex += (u8[i] < 16 ? '0' : '') + u8[i].toString(16);
                g_buffer.push({sock: this.s, hex: hex, n: got});
            }
        }
    });
}
const sendFn = sendAddr ? new NativeFunction(sendAddr, 'int', ['int','pointer','int','int']) : null;

rpc.exports = {
    startCapture() { g_buffer = []; g_capturing = true; return {ok:true}; },
    stopCapture() { g_capturing = false; return {ok:true, count: g_buffer.length, sock: g_lastSocket}; },
    getBuffer() { return g_buffer; },
    replay() {
        if (!sendFn) return {ok:false, error:'no send'};
        let ok_count = 0, err_count = 0;
        for (const f of g_buffer) {
            const len = f.hex.length / 2;
            const buf = Memory.alloc(len || 1);
            const u8 = new Uint8Array(len);
            for (let i = 0; i < len; i++) u8[i] = parseInt(f.hex.substr(i*2, 2), 16);
            if (len) buf.writeByteArray(Array.from(u8));
            const written = sendFn(f.sock, buf, len, 0);
            if (written > 0) ok_count++; else err_count++;
        }
        return {ok: true, ok_count: ok_count, err_count: err_count, total: g_buffer.length};
    }
};
send({type:'log', msg:'capture-replay RPC ready'});
"""


def main():
    if len(sys.argv) < 2:
        print("usage: <PID>"); sys.exit(2)
    pid = int(sys.argv[1])
    session = frida.attach(pid)
    script = session.create_script(JS)
    def on_msg(m, d):
        if m["type"] == "send":
            p = m["payload"]
            if p.get("type") == "log": print("[frida]", p["msg"])
        elif m["type"] == "error":
            print("[!]", m.get("description"))
    script.on("message", on_msg)
    script.load()
    print("[+] attached")
    print()
    print("VLAD: I'm starting capture in 3 seconds. Then YOU change matrix")
    print("      color in Armoury Crate UI and click Apply ONCE. Then wait.")
    print()
    time.sleep(3)
    script.exports_sync.start_capture()
    print("[+] CAPTURING for 8 seconds... CLICK APPLY NOW")
    time.sleep(8)
    res = script.exports_sync.stop_capture()
    print(f"[+] captured {res['count']} send events on sock={res.get('sock')}")
    if res['count'] == 0:
        print("[!] nothing captured. Did you click Apply?")
        session.detach(); return 1
    # Show the buffer summary
    buf = script.exports_sync.get_buffer()
    print(f"[+] buffer summary:")
    for i, f in enumerate(buf[:30]):
        print(f"  {i+1:3} sock={f['sock']} n={f['n']:5} hex0..16={f['hex'][:32]}")
    if len(buf) > 30:
        print(f"  ... and {len(buf) - 30} more")
    print()
    print("[+] sleeping 2s before replay")
    time.sleep(2)
    print("[+] REPLAYING — VLAD WATCH MATRIX")
    rep = script.exports_sync.replay()
    print(f"[+] replay result: {rep}")
    print()
    print("VLAD: did the matrix change at all?")
    time.sleep(3)
    session.detach()


if __name__ == "__main__":
    main()
