"""Check whether BCryptEncrypt and BCryptDecrypt use the same key handle.

If they do, Helper has one symmetric key for the whole process.
If they differ, there are at least two keys (probably one per socket pair).

Hooks log args[0] (the BCRYPT_KEY_HANDLE) for every Encrypt and Decrypt call
for ~10 seconds, then prints the unique set of handles seen in each direction.
"""
import sys, time, frida, json
from collections import Counter

JS = r"""
'use strict';
let g_events = [];

const ENC = Process.findModuleByName('bcrypt.dll').findExportByName('BCryptEncrypt');
const DEC = Process.findModuleByName('bcrypt.dll').findExportByName('BCryptDecrypt');

if (ENC) Interceptor.attach(ENC, {
    onEnter(args) {
        g_events.push({k:'enc', h: args[0].toString(), cb: args[2].toInt32()});
    }
});
if (DEC) Interceptor.attach(DEC, {
    onEnter(args) {
        g_events.push({k:'dec', h: args[0].toString(), cb: args[2].toInt32()});
    }
});

rpc.exports = {
    drain() { const e = g_events; g_events = []; return e; }
};
send({type:'log', msg:'handle-watch armed'});
"""

if len(sys.argv) < 2:
    print("usage: <PID> [seconds]"); sys.exit(2)
pid = int(sys.argv[1])
dur = int(sys.argv[2]) if len(sys.argv) > 2 else 10

session = frida.attach(pid)
script = session.create_script(JS)
def on_msg(m, d):
    if m['type']=='send' and m['payload'].get('type')=='log':
        print('[frida]', m['payload']['msg'])
script.on('message', on_msg)
script.load()
print(f'[+] watching for {dur}s')
time.sleep(dur)
events = script.exports_sync.drain()
session.detach()

enc_handles = Counter(e['h'] for e in events if e['k'] == 'enc')
dec_handles = Counter(e['h'] for e in events if e['k'] == 'dec')

print(f'[+] {len(events)} BCrypt events: {sum(enc_handles.values())} enc + {sum(dec_handles.values())} dec')
print()
print(f'enc handles ({len(enc_handles)} unique):')
for h, n in enc_handles.most_common():
    print(f'  {h}  x {n}')
print()
print(f'dec handles ({len(dec_handles)} unique):')
for h, n in dec_handles.most_common():
    print(f'  {h}  x {n}')
print()
overlap = set(enc_handles) & set(dec_handles)
print(f'handles used for BOTH enc and dec: {len(overlap)}')
for h in overlap:
    print(f'  {h}')
print(f'enc-only handles: {set(enc_handles) - set(dec_handles)}')
print(f'dec-only handles: {set(dec_handles) - set(enc_handles)}')
