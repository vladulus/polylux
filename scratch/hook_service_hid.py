"""Capture USB HID protocol bytes that ArmouryCrate.Service.exe sends to
the AniMe Matrix when user clicks Apply.

Hooks (in PID 35832 = ArmouryCrate.Service.exe):
  hid.dll!HidD_SetFeature         - feature report
  hid.dll!HidD_SetOutputReport    - output report
  kernel32.dll!WriteFile          - generic write (HID often uses this)
  kernel32.dll!DeviceIoControl    - low-level USB IOCTLs

For each call, dumps:
  - file/device handle
  - full buffer hex
  - return value

If we capture HID bytes during an Apply, we can replay them from Polylux
via Python's `ctypes.windll.hid` or `pyhidapi` — bypassing Service entirely.
"""
import sys, time, json, frida
from pathlib import Path
from datetime import datetime


JS = r"""
'use strict';
let g_seq = 0;

function expByName(modName, fnName) {
    const m = Process.findModuleByName(modName);
    if (!m) return null;
    try { const a = m.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return m.getExportByName(fnName); } catch(e){ return null; }
}

function bytesToHex(buf) {
    const u8 = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < u8.length; i++) s += (u8[i] < 16 ? '0' : '') + u8[i].toString(16);
    return s;
}

function readMaybe(ptr, n) {
    if (!ptr || ptr.isNull() || n <= 0 || n > 65536) return null;
    try { return ptr.readByteArray(n); } catch(e) { return null; }
}

// HidD_SetFeature(HANDLE, PVOID buf, ULONG len)
const HSF = expByName('hid.dll', 'HidD_SetFeature');
if (HSF) Interceptor.attach(HSF, {
    onEnter(args) {
        const handle = args[0].toString();
        const buf = args[1];
        const len = args[2].toInt32();
        const data = readMaybe(buf, len);
        send({type:'hid_setfeature', seq:++g_seq, ts:Date.now(),
              handle, len, hex: data ? bytesToHex(data) : null});
    },
    onLeave(retval) { send({type:'ret', seq: g_seq, fn: 'HidD_SetFeature', ret: retval.toInt32()}); }
});

// HidD_SetOutputReport(HANDLE, PVOID buf, ULONG len)
const HSO = expByName('hid.dll', 'HidD_SetOutputReport');
if (HSO) Interceptor.attach(HSO, {
    onEnter(args) {
        const handle = args[0].toString();
        const buf = args[1];
        const len = args[2].toInt32();
        const data = readMaybe(buf, len);
        send({type:'hid_setoutput', seq:++g_seq, ts:Date.now(),
              handle, len, hex: data ? bytesToHex(data) : null});
    },
    onLeave(retval) { send({type:'ret', seq: g_seq, fn: 'HidD_SetOutputReport', ret: retval.toInt32()}); }
});

// WriteFile(handle, buf, len, &written, NULL)
// We only want HID-related WriteFile calls (small buffers <= 1024B)
const WF = expByName('kernel32.dll', 'WriteFile');
if (WF) Interceptor.attach(WF, {
    onEnter(args) {
        const len = args[2].toInt32();
        if (len === 0 || len > 4096) return;
        this.handle = args[0].toString();
        this.buf = args[1];
        this.len = len;
        this.skip = false;
    },
    onLeave(retval) {
        if (this.skip) return;
        const data = readMaybe(this.buf, this.len);
        if (!data) return;
        // Filter out log-file writes (start with "2026-" timestamp)
        const u8 = new Uint8Array(data);
        if (u8.length > 5 && u8[0] === 0x32 && u8[1] === 0x30 && u8[2] === 0x32 && u8[3] === 0x36 && u8[4] === 0x2d) return;
        send({type:'writefile', seq:++g_seq, ts:Date.now(),
              handle: this.handle, len: this.len,
              hex: bytesToHex(data),
              ret: retval.toInt32()});
    }
});

// DeviceIoControl(handle, dwIoControlCode, pInBuffer, nInBufferSize, ...)
const DIO = expByName('kernel32.dll', 'DeviceIoControl');
if (DIO) Interceptor.attach(DIO, {
    onEnter(args) {
        const ioctl = args[1].toInt32();
        const inSize = args[3].toInt32();
        if (inSize === 0 || inSize > 4096) return;
        this.handle = args[0].toString();
        this.ioctl = ioctl;
        this.inBuf = args[2];
        this.inSize = inSize;
        this.skip = false;
    },
    onLeave(retval) {
        if (this.skip) return;
        const data = readMaybe(this.inBuf, this.inSize);
        if (!data) return;
        send({type:'ioctl', seq:++g_seq, ts:Date.now(),
              handle: this.handle, ioctl: '0x' + (this.ioctl >>> 0).toString(16),
              len: this.inSize, hex: bytesToHex(data),
              ret: retval.toInt32()});
    }
});

send({type:'log', msg:'HID hooks armed in Service.exe'});
"""


def main():
    if len(sys.argv) < 2:
        print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 90

    out = Path('scratch/captures') / f'hid_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jsonl'
    out.parent.mkdir(parents=True, exist_ok=True)
    f = out.open('w', encoding='utf-8')

    session = frida.attach(pid)
    script = session.create_script(JS)

    counts = {}
    def on_msg(m, d):
        if m['type'] != 'send':
            if m['type'] == 'error': print('[!]', m.get('description'))
            return
        p = m['payload']
        if p.get('type') == 'log':
            print('[frida]', p['msg']); return
        f.write(json.dumps(p) + '\n'); f.flush()
        kind = p['type']
        counts[kind] = counts.get(kind, 0) + 1
        if kind in ('hid_setfeature', 'hid_setoutput'):
            print(f"  [{kind}] handle={p['handle']} len={p['len']} hex={p.get('hex','')[:80]}")
        elif kind == 'writefile':
            print(f"  [WriteFile] handle={p['handle']} len={p['len']} hex={p['hex'][:80]}")
        elif kind == 'ioctl':
            print(f"  [DeviceIoControl] handle={p['handle']} ioctl={p['ioctl']} len={p['len']} hex={p['hex'][:80]}")

    script.on('message', on_msg)
    script.load()
    print(f'[+] hooks armed on PID {pid}, capturing {dur}s -> {out}')
    print(f'[+] Vlad: click Apply on matrix in AC NOW (any color)')
    time.sleep(dur)
    session.detach()
    f.close()
    print(f'\n[+] counts: {counts}')
    print(f'[+] saved -> {out}')


if __name__ == '__main__':
    main()
