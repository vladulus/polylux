"""Use Frida to enumerate modules in ArmouryCrate.Service.exe / LightingService.exe
and detect what DLLs they load when matrix Apply happens.

The PowerShell .Modules ACL-blocks for SYSTEM processes; Frida bypasses
that via its elevated helper.
"""
import sys, time, json, frida


JS = r"""
'use strict';

const wanted = [
    'ArmouryAIOSDK', 'ArmouryMBLedSDK', 'AuraSdk', 'aurasdk',
    'A110402', 'A120002', 'asMediaSDK', 'libusb', 'hid', 'setupapi'
];

// 1. Snapshot current modules
const all = Process.enumerateModules();
const found = [];
for (const m of all) {
    const lname = m.name.toLowerCase();
    if (wanted.some(w => lname.includes(w.toLowerCase()))) {
        found.push({name: m.name, base: m.base.toString(), size: m.size, path: m.path});
    }
}
send({type:'snapshot', count: all.length, matches: found});

// 2. Hook LoadLibraryExW (most common API now) and LoadLibraryW so we
// see future loads
function hookLoad(modName, fnName) {
    const m = Process.findModuleByName(modName);
    if (!m) return;
    let addr;
    try { addr = m.findExportByName(fnName); } catch(e){}
    if (!addr) return;
    Interceptor.attach(addr, {
        onEnter(args) {
            try {
                const path = args[0].readUtf16String();
                if (path) send({type:'load', api: fnName, path: path});
            } catch(e){}
        }
    });
    send({type:'log', msg: 'hooked ' + fnName});
}
hookLoad('kernel32.dll', 'LoadLibraryExW');
hookLoad('kernel32.dll', 'LoadLibraryW');
hookLoad('kernel32.dll', 'LoadLibraryExA');
hookLoad('kernel32.dll', 'LoadLibraryA');

// 3. Hook USB / HID APIs to see if they get called during Apply
function hookSimple(modName, fnName) {
    const m = Process.findModuleByName(modName);
    if (!m) return;
    let addr;
    try { addr = m.findExportByName(fnName); } catch(e){}
    if (!addr) return;
    Interceptor.attach(addr, {
        onEnter(args) {
            send({type:'api', fn: fnName, ts: Date.now()});
        }
    });
    send({type:'log', msg: 'hooked ' + fnName});
}
hookSimple('hid.dll', 'HidD_GetAttributes');
hookSimple('hid.dll', 'HidD_SetFeature');
hookSimple('hid.dll', 'HidD_SetOutputReport');
hookSimple('kernel32.dll', 'WriteFile');
hookSimple('kernel32.dll', 'DeviceIoControl');
hookSimple('setupapi.dll', 'SetupDiGetClassDevsW');
"""


def main():
    if len(sys.argv) < 2:
        print("usage: <PID> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30

    print(f"[+] attaching to {pid}...")
    session = frida.attach(pid)
    script = session.create_script(JS)

    counts = {}
    def on_msg(m, d):
        if m['type'] != 'send':
            if m['type'] == 'error': print('[!]', m.get('description'))
            return
        p = m['payload']
        kind = p.get('type')
        if kind == 'log':
            print('[frida]', p['msg'])
        elif kind == 'snapshot':
            print(f"[+] {p['count']} modules total. Matches:")
            for mm in p['matches']:
                print(f"    {mm['name']:35} {mm['path']}")
            if not p['matches']:
                print("    (none — SDK plugins not currently loaded)")
        elif kind == 'load':
            print(f"  LoadLibrary[{p['api']}] {p['path']}")
            counts[p['path']] = counts.get(p['path'], 0) + 1
        elif kind == 'api':
            counts[p['fn']] = counts.get(p['fn'], 0) + 1

    script.on('message', on_msg)
    script.load()
    print(f"[+] watching for {dur}s — Vlad: click Apply on matrix in AC")
    time.sleep(dur)
    session.detach()

    if counts:
        print("\n[+] event counts:")
        for k, v in sorted(counts.items(), key=lambda x: -x[1])[:20]:
            print(f"    {v:4}  {k}")


if __name__ == "__main__":
    main()
