"""Hook ArmouryMBLedSDK.dll!ExecuteFunction in ArmourySocketServer.exe to
learn the calling convention + input/output format.

The SDK plugin is what actually drives the USB matrix. ArmourySocketServer
loads the plugin and calls ExecuteFunction with command data. If we capture
ExecuteFunction calls during a real Apply, we learn:
  - Function signature (arg count, types)
  - Input format (XML? JSON? binary struct?)
  - Output format
  - Whether plugin needs prior Entrypoint/Post_Entrypoint init we'd have to
    replicate when loading it ourselves via ctypes

Usage:
    python scratch/hook_executefunction.py <ArmourySocketServer PID> [seconds]
"""
import sys
import time
import json
import frida
from datetime import datetime
from pathlib import Path


JS = r"""
'use strict';

const MOD = 'ArmouryMBLedSDK.dll';

function findExport(modName, fn) {
    const m = Process.findModuleByName(modName);
    if (!m) { send({type:'log', msg:'module not loaded: ' + modName}); return null; }
    try { const a = m.findExportByName(fn); if (a) return a; } catch(e){}
    try { return m.getExportByName(fn); } catch(e){ return null; }
}

const MAX_DUMP = 4096;
function readMaybe(ptr, n) {
    if (!ptr || ptr.isNull()) return null;
    try { return ptr.readByteArray(Math.min(n, MAX_DUMP)); } catch(e) { return null; }
}

function bytesToHex(buf) {
    const u8 = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < u8.length; i++) s += (u8[i] < 16 ? '0' : '') + u8[i].toString(16);
    return s;
}

function tryReadString(ptr, maxLen) {
    if (!ptr || ptr.isNull()) return null;
    try {
        // Try ASCII C-string first
        const s = ptr.readCString(maxLen);
        if (s && s.length > 1) return {kind:'ascii', val: s.substring(0, 200)};
    } catch(e){}
    try {
        const w = ptr.readUtf16String(maxLen);
        if (w && w.length > 1) return {kind:'utf16', val: w.substring(0, 200)};
    } catch(e){}
    return null;
}

const fnNames = ['ExecuteFunction', 'Entrypoint', 'Post_Entrypoint', 'Post_EntrypointReturn', 'startService', 'freeBuffer', 'timerCallback'];
let g_seq = 0;

for (const name of fnNames) {
    const addr = findExport(MOD, name);
    if (!addr) {
        send({type:'log', msg:'export not found: ' + name});
        continue;
    }
    send({type:'log', msg:'hooked ' + name + ' @ ' + addr});
    Interceptor.attach(addr, {
        onEnter(args) {
            const seq = ++g_seq;
            this.seq = seq;
            this.name = name;
            // Dump first 8 args generically — strings or numbers
            const dump = {seq, fn: name, ts: Date.now(), args: []};
            for (let i = 0; i < 8; i++) {
                let a = args[i];
                let entry = {idx: i, ptr: a.toString()};
                // Treat as int32 if value looks small
                const lo = a.toInt32();
                if (lo >= -65536 && lo <= 65536) entry.int32 = lo;
                // Try as string
                const s = tryReadString(a, 1024);
                if (s) entry.str = s;
                // Or short bytes dump
                const b = readMaybe(a, 64);
                if (b) entry.head_hex = bytesToHex(b);
                dump.args.push(entry);
            }
            send({type:'enter', ...dump});
        },
        onLeave(retval) {
            send({type:'leave', seq: this.seq, fn: this.name, ts: Date.now(),
                  ret: retval.toString(), ret_int: retval.toInt32()});
        }
    });
}

send({type:'log', msg:'all hooks installed'});
"""


def main():
    if len(sys.argv) < 2:
        print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60

    out = Path('scratch/captures') / f'execfn_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jsonl'
    out.parent.mkdir(parents=True, exist_ok=True)
    f = out.open('w', encoding='utf-8')

    session = frida.attach(pid)
    script = session.create_script(JS)

    counters = {'enter': 0, 'leave': 0}
    fn_names = set()

    def on_msg(m, d):
        if m['type'] != 'send':
            if m['type'] == 'error': print('[!]', m.get('description'))
            return
        p = m['payload']
        if p.get('type') == 'log':
            print('[frida]', p['msg']); return
        kind = p['type']
        counters[kind] = counters.get(kind, 0) + 1
        f.write(json.dumps(p) + '\n'); f.flush()
        fn = p.get('fn', '?')
        fn_names.add(fn)
        if kind == 'enter':
            print(f"[ENTER #{p['seq']}] {fn}")
            for a in p['args'][:6]:
                if a.get('str'):
                    s = a['str']
                    print(f"   arg[{a['idx']}] STR ({s['kind']}): {s['val'][:120]}")
                elif a.get('int32') is not None and a.get('int32') != 0:
                    print(f"   arg[{a['idx']}] INT32: {a['int32']}")
                elif a.get('head_hex') and any(c not in '0' for c in a['head_hex'][:32]):
                    print(f"   arg[{a['idx']}] HEX: {a['head_hex'][:80]}")
        elif kind == 'leave':
            print(f"[LEAVE #{p['seq']}] {fn} ret={p['ret']} int={p['ret_int']}")

    script.on('message', on_msg)
    script.load()

    print(f'[+] hooks armed on PID {pid} for {dur}s -> {out}')
    print(f'[+] Vlad: now click Apply in Armoury Crate (matrix tab, any color)')
    time.sleep(dur)
    session.detach()
    f.close()
    print(f'\n[+] counters: {counters}')
    print(f'[+] functions seen: {sorted(fn_names)}')
    print(f'[+] saved -> {out}')


if __name__ == '__main__':
    main()
