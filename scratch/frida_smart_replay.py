"""Smart capture-and-replay: longer window, group sends by socket, only
replay the burst that contains SetMatrixLED-class traffic.

Heuristic: a SetMatrixLED apply produces a burst of 6+ wire frames per
socket within ~500ms, with at least one body frame >= 200 bytes.
"""
import sys, time, json, frida
from collections import defaultdict

JS = r"""
'use strict';
let g_capturing = false;
let g_buffer = [];

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
            if (g_capturing) {
                const data = this.buf.readByteArray(got);
                const u8 = new Uint8Array(data);
                let hex = '';
                for (let i = 0; i < u8.length; i++) hex += (u8[i] < 16 ? '0' : '') + u8[i].toString(16);
                g_buffer.push({ts: Date.now(), sock: this.s, n: got, hex: hex});
            }
        }
    });
}
const sendFn = sendAddr ? new NativeFunction(sendAddr, 'int', ['int','pointer','int','int']) : null;

rpc.exports = {
    startCapture() { g_buffer = []; g_capturing = true; return {ok:true}; },
    stopCapture() { g_capturing = false; return {ok:true, count: g_buffer.length}; },
    getBuffer() { return g_buffer; },
    sendFrames(items) {
        if (!sendFn) return {ok:false};
        let okc = 0, errc = 0;
        for (const f of items) {
            const len = f.hex.length / 2;
            const buf = Memory.alloc(len || 1);
            const u8 = new Uint8Array(len);
            for (let i = 0; i < len; i++) u8[i] = parseInt(f.hex.substr(i*2, 2), 16);
            if (len) buf.writeByteArray(Array.from(u8));
            const w = sendFn(f.sock, buf, len, 0);
            if (w > 0) okc++; else errc++;
        }
        return {ok: true, ok_count: okc, err_count: errc};
    }
};
send({type:'log', msg: 'smart-replay RPC ready'});
"""

def main():
    if len(sys.argv) < 2: print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 25
    session = frida.attach(pid)
    script = session.create_script(JS)
    def on_msg(m, d):
        if m['type'] == 'send' and m['payload'].get('type') == 'log':
            print('[frida]', m['payload']['msg'])
    script.on('message', on_msg)
    script.load()
    print('[+] attached')
    print()
    print(f'VLAD: I will capture for {dur}s. Click Apply with NEW color')
    print('      (e.g., bright pink — anything different from current)')
    print()
    time.sleep(2)
    script.exports_sync.start_capture()
    print(f'[+] CAPTURING {dur}s — APPLY NOW')
    time.sleep(dur)
    res = script.exports_sync.stop_capture()
    print(f'[+] stopped, {res["count"]} events captured')

    buf = script.exports_sync.get_buffer()
    if not buf:
        print('[!] empty'); session.detach(); return

    # Group by socket
    by_sock = defaultdict(list)
    for f in buf: by_sock[f['sock']].append(f)
    print(f'[+] sockets observed: {list(by_sock.keys())}')
    for s, items in by_sock.items():
        max_n = max(it['n'] for it in items)
        big_count = sum(1 for it in items if it['n'] >= 200)
        print(f'    sock={s}  count={len(items):4}  max_body={max_n:5}  bodies>=200: {big_count}')

    # Heuristic: pick socket with MOST big frames (>=200 bytes) — those carry SetMatrixLED bodies
    target_sock = None
    best_big = 0
    for s, items in by_sock.items():
        big = sum(1 for it in items if it['n'] >= 200)
        if big > best_big:
            best_big = big
            target_sock = s
    if target_sock is None or best_big == 0:
        print('[!] no socket has big frames; SetMatrixLED probably did not happen during capture')
        session.detach(); return

    print(f'[+] targeting sock={target_sock} ({best_big} big frames)')
    target_frames = by_sock[target_sock]
    # Find the BURST containing big frames: group by time clusters
    target_frames.sort(key=lambda f: f['ts'])
    burst = []
    in_burst = False
    burst_end_ts = 0
    for f in target_frames:
        if f['n'] >= 200:
            in_burst = True
            burst_end_ts = f['ts'] + 800  # 800ms of related traffic
        if in_burst and f['ts'] <= burst_end_ts:
            burst.append(f)
        if in_burst and f['ts'] > burst_end_ts:
            break
    print(f'[+] burst: {len(burst)} frames')
    if not burst:
        session.detach(); return

    print('[+] burst preview:')
    for i, f in enumerate(burst[:20]):
        print(f'    {i+1:3} sock={f["sock"]} n={f["n"]:5} hex0..16={f["hex"][:32]}')

    print()
    print('[+] sleeping 2s then REPLAYING burst — VLAD watch matrix')
    time.sleep(2)
    rep = script.exports_sync.send_frames(burst)
    print(f'[+] replay: {rep}')
    print()
    print('VLAD: did matrix change to the color you just set?')
    time.sleep(3)
    session.detach()

main()
