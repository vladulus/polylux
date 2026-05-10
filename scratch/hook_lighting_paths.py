"""Hook CreateFile + WriteFile in LightingService.exe so we resolve every
write target (file path / pipe / device handle).

We saw matrix Apply XML written to handles like 0xb60, 0x5a4, 0xa44... but
don't know if they're files, named pipes, or USB device handles. This
script tracks every handle's origin via CreateFileW/A and reports the
path on each WriteFile.
"""
import sys, time, json, frida
from pathlib import Path
from datetime import datetime


JS = r"""
'use strict';

const handleMap = new Map();  // handle ptr-string -> path
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

// Helper to resolve handle path via GetFinalPathNameByHandleW
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

// CreateFileW(lpFileName, ...)
const CFW = expByName('kernel32.dll', 'CreateFileW');
if (CFW) Interceptor.attach(CFW, {
    onEnter(args) { try { this.path = args[0].readUtf16String(); } catch(e){ this.path = '<?>'; } },
    onLeave(retval) {
        const handle = retval.toString();
        if (handle === '0xffffffffffffffff' || handle === '-1') return;
        handleMap.set(handle, this.path);
        send({type:'createfile', handle, path: this.path});
    }
});
const CFA = expByName('kernel32.dll', 'CreateFileA');
if (CFA) Interceptor.attach(CFA, {
    onEnter(args) { try { this.path = args[0].readCString(); } catch(e){ this.path = '<?>'; } },
    onLeave(retval) {
        const handle = retval.toString();
        if (handle === '0xffffffffffffffff' || handle === '-1') return;
        handleMap.set(handle, this.path);
        send({type:'createfile', handle, path: this.path});
    }
});

const WF = expByName('kernel32.dll', 'WriteFile');
if (WF) Interceptor.attach(WF, {
    onEnter(args) {
        const len = args[2].toInt32();
        if (len === 0 || len > 16384) return;
        this.handle = args[0].toString();
        this.buf = args[1];
        this.len = len;
    },
    onLeave(retval) {
        if (!this.handle) return;
        try {
            const data = this.buf.readByteArray(this.len);
            const u8 = new Uint8Array(data);
            // Skip log files
            if (u8.length > 5 && u8[0] === 0x32 && u8[1] === 0x30 && u8[2] === 0x32 && u8[3] === 0x36) return;
            const path = handleMap.get(this.handle) || (resolveHandle ? resolveHandle(ptr(this.handle)) : null) || '<unknown>';
            send({type:'writefile', seq:++g_seq, ts:Date.now(),
                  handle: this.handle,
                  path, len: this.len,
                  hex: bytesToHex(data),
                  ret: retval.toInt32()});
        } catch(e){}
    }
});

send({type:'log', msg:'CreateFile + WriteFile hooks armed in LightingService'});
"""


def main():
    if len(sys.argv) < 2:
        print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60

    out = Path('scratch/captures') / f'paths_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jsonl'
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
        if kind == 'createfile':
            # Only print interesting paths
            path = p.get('path', '')
            if any(x in path.lower() for x in ['log', '.tmp', 'config']):
                return
            print(f"  CREATE handle={p['handle']:18}  {path}")
        elif kind == 'writefile':
            head = p['hex'][:80]
            asc = bytes.fromhex(p['hex'][:200]).decode('utf-8', errors='replace').replace('\n', ' ')[:80]
            print(f"  WRITE  handle={p['handle']:18} len={p['len']:5}  path={p['path'][:80]}")
            print(f"         ascii={asc}")

    script.on('message', on_msg)
    script.load()
    print(f'[+] hooks armed on PID {pid}, capturing {dur}s -> {out}')
    print(f'[+] Vlad: change matrix color a couple of times during this window')
    time.sleep(dur)
    session.detach()
    f.close()
    print(f'\n[+] counts: {counts}')


if __name__ == '__main__':
    main()
