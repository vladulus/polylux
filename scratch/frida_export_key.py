"""Use Frida to call BCryptExportKey on UserSessionHelper's symmetric key
handle. Returns the raw AES-GCM key bytes that we can then use in pure
Python (cryptography library) without Frida.

If this works:
  - We get a stable AES key for the lifetime of UserSessionHelper
  - We can open our own TCP socket to 127.0.0.1:50100
  - Encrypt SetMatrixLED messages ourselves
  - Drive the matrix without ANY Frida runtime
"""
import sys, time, frida


JS = r"""
'use strict';

let g_keyHandle = null;
let g_alg = null;

function expByName(modName, fnName) {
    const mod = Process.findModuleByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e){ return null; }
}

const encAddr = expByName('bcrypt.dll', 'BCryptEncrypt');
const exportAddr = expByName('bcrypt.dll', 'BCryptExportKey');

if (encAddr) {
    Interceptor.attach(encAddr, {
        onEnter(args) {
            if (!g_keyHandle) {
                g_keyHandle = args[0];
                send({type:'log', msg:'KEY captured: ' + args[0].toString()});
            }
        }
    });
}

const exportFn = exportAddr ? new NativeFunction(exportAddr, 'int', [
    'pointer','pointer','pointer','pointer','uint32','pointer','uint32'
]) : null;

function utf16zString(s) {
    const buf = Memory.alloc((s.length + 1) * 2);
    buf.writeUtf16String(s);
    return buf;
}

rpc.exports = {
    state() {
        return {
            has_key: g_keyHandle !== null,
            handle: g_keyHandle ? g_keyHandle.toString() : null,
            export_fn_avail: exportFn !== null
        };
    },
    exportKey(blobType) {
        if (!g_keyHandle) return {ok:false, error:'no key captured'};
        if (!exportFn) return {ok:false, error:'BCryptExportKey not loaded'};
        const blobName = utf16zString(blobType);

        // Query size first
        const pcb = Memory.alloc(4);
        let status = exportFn(g_keyHandle, ptr(0), blobName, ptr(0), 0, pcb, 0);
        if (status !== 0 && status !== -2147483643 /* STATUS_BUFFER_TOO_SMALL */) {
            return {ok:false, error:'size query failed status=0x'+(status>>>0).toString(16)};
        }
        const needed = pcb.readU32();
        if (needed === 0 || needed > 65536) return {ok:false, error:'unexpected size '+needed};

        const out = Memory.alloc(needed);
        status = exportFn(g_keyHandle, ptr(0), blobName, out, needed, pcb, 0);
        if (status !== 0) {
            return {ok:false, error:'export failed status=0x'+(status>>>0).toString(16)};
        }
        const got = pcb.readU32();
        const u8 = new Uint8Array(out.readByteArray(got));
        let hex = '';
        for (let i = 0; i < u8.length; i++) hex += (u8[i] < 16 ? '0' : '') + u8[i].toString(16);
        return {ok:true, blob: blobType, size: got, hex: hex};
    }
};

send({type:'log', msg:'export-key RPC ready'});
"""

if len(sys.argv) < 2: print("usage: <PID>"); sys.exit(2)
pid = int(sys.argv[1])
session = frida.attach(pid)
script = session.create_script(JS)
def on_msg(m, d):
    if m['type']=='send' and m['payload'].get('type')=='log':
        print('[frida]', m['payload']['msg'])
    elif m['type']=='error':
        print('[!]', m.get('description'))
script.on('message', on_msg)
script.load()
print('[+] script loaded; waiting for first BCryptEncrypt to capture key handle...')
deadline = time.time() + 20
while time.time() < deadline:
    s = script.exports_sync.state()
    if s['has_key']: break
    time.sleep(0.5)
s = script.exports_sync.state()
print(f'[+] state: {s}')
if not s['has_key']:
    print('[!] no key captured in 20s — UserSessionHelper might be idle')
    print('    nudge it (e.g. open Armoury Crate UI) and re-run')
    session.detach(); sys.exit(1)

# Try several blob types — different keys export under different formats
for blob in ('KeyDataBlob', 'OpaqueKeyBlob', 'AES_WRAP_KEY_BLOB'):
    res = script.exports_sync.export_key(blob)
    print(f'\\n[+] export {blob!r}:')
    if res['ok']:
        print(f'    size={res["size"]} hex={res["hex"][:200]}')
    else:
        print(f'    FAIL: {res.get("error")}')

session.detach()
