"""Capture what asus_framework.exe sends/receives on its 9013 WebSocket
connections by hooking WSASend / WSARecv / send / recv from inside.

Use to learn the real outbound XML and inbound JSON message formats so
Polylux can mimic them. Also handy to see what the legitimate UI sends
when the user clicks (e.g. matrix Apply).

Filters: skip frames < 30B and skip TLS (`170303`) frames since 9013 is
plain WS. Logs only WS-data-frames-looking traffic.
"""
import sys, time, json, frida
from pathlib import Path
from datetime import datetime


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
    try { return ptr.readByteArray(n); } catch(e){ return null; }
}

function isLikelyWebSocketFrame(data) {
    if (!data || data.byteLength < 2) return false;
    const u8 = new Uint8Array(data);
    // WS Data frame: first byte FIN + opcode (1=text, 2=binary). High bit FIN is common.
    const opcode = u8[0] & 0x0f;
    if (![0x1, 0x2, 0x8, 0x9, 0xa].includes(opcode)) return false;
    // Skip TLS (170303 = TLS app data) — used on port 9012, not us
    if (u8[0] === 0x17 && u8[1] === 0x03 && u8[2] === 0x03) return false;
    return true;
}

function dumpAscii(buf) {
    const u8 = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < Math.min(u8.length, 200); i++) {
        s += (u8[i] >= 0x20 && u8[i] < 0x7f) ? String.fromCharCode(u8[i]) : '.';
    }
    return s;
}

const WSASEND = expByName('ws2_32.dll', 'WSASend');
const WSARECV = expByName('ws2_32.dll', 'WSARecv');
const SEND    = expByName('ws2_32.dll', 'send');
const RECV    = expByName('ws2_32.dll', 'recv');

if (WSASEND) Interceptor.attach(WSASEND, {
    onEnter(args) {
        const sock = args[0].toInt32();
        const pBuffers = args[1];
        const cnt = args[2].toInt32();
        for (let i = 0; i < cnt; i++) {
            const wb = pBuffers.add(i*16);
            const len = wb.readU32();
            if (len < 5) continue;
            const bp = wb.add(8).readPointer();
            if (bp.isNull()) continue;
            const data = readBuf(bp, Math.min(len, 4096));
            if (!data) continue;
            send({type:'wsasend', seq:++g_seq, ts:Date.now(),
                  sock, n:len,
                  hex: bytesToHex(data),
                  ascii: dumpAscii(data)});
        }
    }
});
if (WSARECV) Interceptor.attach(WSARECV, {
    onEnter(args) {
        this.sock = args[0].toInt32();
        this.pBuffers = args[1];
        this.cnt = args[2].toInt32();
        this.pBytesRecv = args[3];
    },
    onLeave(retval) {
        if (this.pBytesRecv.isNull()) return;
        const got = this.pBytesRecv.readU32();
        if (got < 5 || got > 65536) return;
        for (let i = 0; i < this.cnt; i++) {
            const wb = this.pBuffers.add(i*16);
            const len = wb.readU32();
            if (len === 0) continue;
            const bp = wb.add(8).readPointer();
            if (bp.isNull()) continue;
            const data = readBuf(bp, Math.min(len, got));
            if (!data) continue;
            send({type:'wsarecv', seq:++g_seq, ts:Date.now(),
                  sock: this.sock, n: Math.min(len, got),
                  hex: bytesToHex(data),
                  ascii: dumpAscii(data)});
            break;
        }
    }
});
if (SEND) Interceptor.attach(SEND, {
    onEnter(args) { this.s = args[0].toInt32(); this.buf = args[1]; this.len = args[2].toInt32(); },
    onLeave(retval) {
        const got = retval.toInt32();
        if (got < 5) return;
        const data = readBuf(this.buf, got);
        if (!data) return;
        send({type:'send', seq:++g_seq, ts:Date.now(),
              sock: this.s, n: got, hex: bytesToHex(data), ascii: dumpAscii(data)});
    }
});
if (RECV) Interceptor.attach(RECV, {
    onEnter(args) { this.s = args[0].toInt32(); this.buf = args[1]; },
    onLeave(retval) {
        const got = retval.toInt32();
        if (got < 5) return;
        const data = readBuf(this.buf, got);
        if (!data) return;
        send({type:'recv', seq:++g_seq, ts:Date.now(),
              sock: this.s, n: got, hex: bytesToHex(data), ascii: dumpAscii(data)});
    }
});

send({type:'log', msg:'9013-watch armed on asus_framework'});
"""


def main():
    if len(sys.argv) < 2:
        print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30

    out = Path('scratch/captures') / f'9013_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jsonl'
    out.parent.mkdir(parents=True, exist_ok=True)
    f = out.open('w', encoding='utf-8')

    session = frida.attach(pid)
    script = session.create_script(JS)

    def on_msg(m, d):
        if m['type'] != 'send':
            if m['type'] == 'error': print('[!]', m.get('description'))
            return
        p = m['payload']
        if p.get('type') == 'log':
            print('[frida]', p['msg']); return
        f.write(json.dumps(p) + '\n'); f.flush()
        kind = p['type']
        ascii_preview = p.get('ascii', '').replace('\n', ' ')[:120]
        print(f"  {kind:8} sock={p['sock']:4} n={p['n']:5}  {ascii_preview}")
    script.on('message', on_msg)
    script.load()
    print(f'[+] capturing {dur}s on PID {pid} -> {out}')
    print(f'[+] Vlad: do something in Armoury Crate (e.g. open AIO tab) to provoke traffic')
    time.sleep(dur)
    session.detach()
    f.close()
    print(f'[+] saved -> {out}')


if __name__ == '__main__':
    main()
