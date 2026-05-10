"""Comprehensive low-level hook of Aac3572MbHal_x86.exe to find what it
reads/writes around a matrix Apply. Includes NT-level APIs that bypass
kernel32.WriteFile / DeviceIoControl wrappers.
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

const handleMap = new Map();
const GFPN = expByName('kernel32.dll', 'GetFinalPathNameByHandleW');
let resolveHandle = null;
if (GFPN) {
    const fn = new NativeFunction(GFPN, 'uint32', ['pointer','pointer','uint32','uint32']);
    resolveHandle = function(handle) {
        try {
            const buf = Memory.alloc(2 * 1024);
            const r = fn(handle, buf, 1024, 0);
            if (r > 0 && r < 1024) return buf.readUtf16String(r);
        } catch(e){}
        return null;
    };
}

function pathFor(handle) {
    return handleMap.get(handle) || (resolveHandle ? resolveHandle(ptr(handle)) : null) || '<?>';
}

// CreateFile to track new handles
const CFW = expByName('kernel32.dll', 'CreateFileW');
if (CFW) Interceptor.attach(CFW, {
    onEnter(args) { try { this.path = args[0].readUtf16String(); } catch(e){ this.path = '<?>'; } },
    onLeave(retval) {
        const h = retval.toString();
        if (h !== '0xffffffffffffffff') {
            handleMap.set(h, this.path);
            // only emit interesting opens
            if (this.path && (this.path.toLowerCase().includes('hid#') ||
                              this.path.toLowerCase().includes('\\\\?\\') ||
                              this.path.toLowerCase().includes('lightingservice') ||
                              this.path.toLowerCase().includes('asus'))) {
                send({type:'open', seq:++g_seq, ts:Date.now(), handle:h, path:this.path});
            }
        }
    }
});

// kernel32.WriteFile
const WF = expByName('kernel32.dll', 'WriteFile');
if (WF) Interceptor.attach(WF, {
    onEnter(args) {
        const len = args[2].toInt32();
        if (len === 0 || len > 32768) return;
        this.handle = args[0].toString();
        this.buf = args[1];
        this.len = len;
    },
    onLeave(retval) {
        if (!this.handle) return;
        const data = readMaybe(this.buf, this.len);
        if (!data) return;
        const u8 = new Uint8Array(data);
        if (u8.length > 5 && u8[0] === 0x32 && u8[1] === 0x30 && u8[2] === 0x32 && u8[3] === 0x36) return;  // log
        send({type:'wf', seq:++g_seq, ts:Date.now(),
              handle: this.handle, path: pathFor(this.handle),
              len: this.len, hex: bytesToHex(data)});
    }
});

// kernel32.ReadFile
const RF = expByName('kernel32.dll', 'ReadFile');
if (RF) Interceptor.attach(RF, {
    onEnter(args) {
        const len = args[2].toInt32();
        if (len === 0 || len > 32768) return;
        this.handle = args[0].toString();
        this.buf = args[1];
        this.bytesRead = args[3];  // LPDWORD
        this.skip = false;
    },
    onLeave(retval) {
        if (this.skip) return;
        if (!this.handle || !this.bytesRead) return;
        try {
            const got = this.bytesRead.readU32();
            if (got <= 0 || got > 32768) return;
            const data = readMaybe(this.buf, got);
            if (!data) return;
            send({type:'rf', seq:++g_seq, ts:Date.now(),
                  handle: this.handle, path: pathFor(this.handle),
                  len: got, hex: bytesToHex(data).substring(0, 240)});
        } catch(e){}
    }
});

// ntdll.NtWriteFile - lower level
const NWF = expByName('ntdll.dll', 'NtWriteFile');
if (NWF) Interceptor.attach(NWF, {
    onEnter(args) {
        // NtWriteFile(handle, evt, apc, apcCtx, ioStatus, buf, len, offset, key)
        const len = args[6].toInt32();
        if (len === 0 || len > 32768) return;
        this.handle = args[0].toString();
        this.buf = args[5];
        this.len = len;
    },
    onLeave(retval) {
        if (!this.handle) return;
        const data = readMaybe(this.buf, this.len);
        if (!data) return;
        const u8 = new Uint8Array(data);
        if (u8.length > 5 && u8[0] === 0x32 && u8[1] === 0x30) return;
        send({type:'ntwf', seq:++g_seq, ts:Date.now(),
              handle: this.handle, path: pathFor(this.handle),
              len: this.len, hex: bytesToHex(data)});
    }
});

// ntdll.NtDeviceIoControlFile - low-level IOCTL
const NDIO = expByName('ntdll.dll', 'NtDeviceIoControlFile');
if (NDIO) Interceptor.attach(NDIO, {
    onEnter(args) {
        // NtDeviceIoControlFile(handle, evt, apc, apcCtx, ioStatus, ioctl, inBuf, inLen, outBuf, outLen)
        const ioctl = args[5].toInt32();
        const inLen = args[7].toInt32();
        if (inLen === 0 || inLen > 32768) return;
        this.handle = args[0].toString();
        this.ioctl = ioctl;
        this.inBuf = args[6];
        this.inLen = inLen;
    },
    onLeave(retval) {
        if (!this.handle) return;
        const data = readMaybe(this.inBuf, this.inLen);
        if (!data) return;
        send({type:'ntioctl', seq:++g_seq, ts:Date.now(),
              handle: this.handle, path: pathFor(this.handle),
              ioctl: '0x' + (this.ioctl >>> 0).toString(16),
              len: this.inLen, hex: bytesToHex(data)});
    }
});

send({type:'log', msg:'deep MbHal hooks armed'});
"""


def main():
    if len(sys.argv) < 2:
        print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30

    out = Path('scratch/captures') / f'mbhal_deep_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jsonl'
    out.parent.mkdir(parents=True, exist_ok=True)
    f = out.open('w', encoding='utf-8')

    session = frida.attach(pid)
    script = session.create_script(JS)

    counts = {}
    interesting_paths = set()

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
        path = p.get('path', '?')
        if path != '<?>':
            interesting_paths.add((kind, path[:60]))
        # only print large or new-path events
        if kind == 'open':
            print(f"  OPEN handle={p['handle']:18}  {path}")
        elif kind in ('wf','ntwf') and p['len'] > 100:
            print(f"  {kind:6} h={p['handle']:18} len={p['len']:5}  path={path[:70]}")
            print(f"          hex0..32: {p['hex'][:64]}")
        elif kind == 'ntioctl' and p['len'] > 50:
            print(f"  IOCTL  h={p['handle']:18} ioctl={p['ioctl']:10} len={p['len']:5}  path={path[:50]}")
            print(f"          hex0..32: {p['hex'][:64]}")
        elif kind == 'rf' and p['len'] > 100:
            print(f"  READ   h={p['handle']:18} len={p['len']:5}  path={path[:70]}")

    script.on('message', on_msg)
    script.load()
    print(f'[+] hooks armed on PID {pid}, capturing {dur}s -> {out}')
    print(f'[+] Vlad: change matrix color in AC during this window')
    time.sleep(dur)
    session.detach()
    f.close()
    print(f'\n[+] counts: {counts}')
    print(f'[+] interesting paths seen:')
    for kind, p in sorted(interesting_paths)[:30]:
        print(f'    {kind:8} {p}')


if __name__ == '__main__':
    main()
