"""Capture INBOUND traffic on UserSessionHelper's listening port (51100).

Hook recv() and WSARecv(). Identify the burst that triggered the
SetMatrixLED BCryptDecrypt by correlating timestamps. Save it.
Then we can replay by connecting to 127.0.0.1:51100 from Python.
"""
import sys, time, json, frida
from pathlib import Path
from collections import defaultdict

JS = r"""
'use strict';
let g_buffer = [];
let g_capturing = false;

function expByName(modName, fnName) {
    const mod = Process.findModuleByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e) { return null; }
}

const recvAddr = expByName('ws2_32.dll', 'recv') || expByName('WS2_32.dll', 'recv');
if (recvAddr) {
    Interceptor.attach(recvAddr, {
        onEnter(args) { this.s = args[0].toInt32(); this.buf = args[1]; this.len = args[2].toInt32(); },
        onLeave(retval) {
            const got = retval.toInt32();
            if (got <= 0) return;
            if (g_capturing) {
                const data = this.buf.readByteArray(got);
                const u8 = new Uint8Array(data);
                let hex = '';
                for (let i = 0; i < u8.length; i++) hex += (u8[i] < 16 ? '0' : '') + u8[i].toString(16);
                g_buffer.push({ts: Date.now(), kind:'recv', sock: this.s, n: got, hex: hex});
            }
        }
    });
    send({type:'log', msg:'hooked recv'});
}

const decAddr = expByName('bcrypt.dll', 'BCryptDecrypt');
if (decAddr) {
    Interceptor.attach(decAddr, {
        onEnter(args) { this.pPlain = args[6]; this.pcb = args[8]; },
        onLeave(retval) {
            if (retval.toInt32() !== 0) return;
            if (this.pcb.isNull()) return;
            const got = this.pcb.readU32();
            if (got <= 0 || got > 65536 || !g_capturing) return;
            const data = this.pPlain.readByteArray(got);
            const u8 = new Uint8Array(data);
            let hex = '';
            for (let i = 0; i < u8.length; i++) hex += (u8[i] < 16 ? '0' : '') + u8[i].toString(16);
            g_buffer.push({ts: Date.now(), kind:'dec', n: got, hex: hex});
        }
    });
    send({type:'log', msg:'hooked BCryptDecrypt'});
}

rpc.exports = {
    startCapture() { g_buffer = []; g_capturing = true; return {ok:true}; },
    stopCapture() { g_capturing = false; return {ok:true, count: g_buffer.length}; },
    getBuffer() { return g_buffer; }
};
send({type:'log', msg: 'inbound RPC ready'});
"""

def main():
    if len(sys.argv) < 2: print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 25
    session = frida.attach(pid)
    script = session.create_script(JS)
    def on_msg(m, d):
        if m['type']=='send' and m['payload'].get('type')=='log':
            print('[frida]', m['payload']['msg'])
    script.on('message', on_msg)
    script.load()
    print('[+] attached')
    time.sleep(1)
    script.exports_sync.start_capture()
    print(f'[+] CAPTURING INBOUND for {dur}s — VLAD: APPLY MATRIX COLOR NOW')
    time.sleep(dur)
    res = script.exports_sync.stop_capture()
    print(f'[+] stopped: {res["count"]} events')
    buf = script.exports_sync.get_buffer()
    if not buf:
        print('[!] empty'); session.detach(); return

    # Find SetMatrixLED in dec events
    target = bytes('SetMatrixLED', 'utf-16-le').hex()
    sml_dec_idx = None
    for i, e in enumerate(buf):
        if e['kind'] == 'dec' and target in e['hex']:
            sml_dec_idx = i
            print(f'[+] SetMatrixLED plaintext found at idx={i} ts={e["ts"]} size={e["n"]}')
            break

    # Collect recv events grouped by socket and identify inbound port
    by_sock = defaultdict(list)
    for e in buf:
        if e['kind'] == 'recv': by_sock[e['sock']].append(e)
    print(f'[+] recv sockets observed: {dict((s, len(v)) for s,v in by_sock.items())}')
    for s, items in by_sock.items():
        max_n = max(it['n'] for it in items)
        big = sum(1 for it in items if it['n'] >= 200)
        print(f'    sock={s}  count={len(items)}  max_body={max_n}  bodies>=200: {big}')

    if sml_dec_idx is None:
        print('[!] SetMatrixLED not seen — Apply may not have happened')
        out = Path('scratch/captures') / f'inbound_{time.strftime("%Y%m%d_%H%M%S")}.jsonl'
        out.parent.mkdir(exist_ok=True)
        with out.open('w') as f:
            for e in buf: f.write(json.dumps(e)+'\n')
        print(f'[+] saved raw buffer to {out}')
        session.detach(); return

    # Find recv events around the SetMatrixLED dec timestamp
    sml_ts = buf[sml_dec_idx]['ts']
    inbound_burst = [e for e in buf if e['kind']=='recv' and abs(e['ts']-sml_ts) < 2000 and e['n'] >= 100]
    print(f'[+] inbound burst (recv events near SetMatrixLED, body>=100): {len(inbound_burst)}')
    for e in inbound_burst[:20]:
        print(f'    ts={e["ts"]} sock={e["sock"]} n={e["n"]} hex0..16={e["hex"][:32]}')

    # Save everything for offline replay tooling
    out = Path('scratch/captures') / f'inbound_apply_{time.strftime("%Y%m%d_%H%M%S")}.jsonl'
    out.parent.mkdir(exist_ok=True)
    with out.open('w') as f:
        for e in buf: f.write(json.dumps(e)+'\n')
    print(f'[+] saved -> {out}')
    session.detach()

main()
