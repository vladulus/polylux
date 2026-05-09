"""Capture the EXACT BCryptEncrypt call arguments on first invocation.

This tells us what cipher mode / IV / padding info UserSessionHelper uses,
so we can pass the same params on our own encrypt calls.
"""
import sys, time, frida

JS = r"""
let counter = 0;
const fn = Process.findModuleByName('bcrypt.dll').findExportByName('BCryptEncrypt');
Interceptor.attach(fn, {
    onEnter(args) {
        if (counter >= 5) return;
        counter++;
        const a = [];
        for (let i = 0; i < 10; i++) {
            a.push({
                idx: i,
                value: args[i].toString(),
                int: (i === 2 || i === 5 || i === 7 || i === 9) ? args[i].toInt32() : null
            });
        }
        // Read first 32 bytes of pIV (args[4]) if non-null
        let iv = null, ivlen = args[5].toInt32();
        if (!args[4].isNull() && ivlen > 0 && ivlen < 256) {
            iv = args[4].readByteArray(ivlen);
        }
        // Read first 64 bytes of pPaddingInfo (args[3]) if non-null
        let pad = null;
        if (!args[3].isNull()) {
            try { pad = args[3].readByteArray(64); } catch(e){}
        }
        send({type:'enc_args', call: counter, args: a}, iv);
        send({type:'enc_padding', call: counter}, pad);
    }
});
send({type:'log', msg: 'hook installed, waiting for calls'});
"""

if len(sys.argv) < 2: print("usage: <PID>"); sys.exit(2)
pid = int(sys.argv[1])
session = frida.attach(pid)
script = session.create_script(JS)

call_data = {}
def on_msg(m, d):
    if m['type'] != 'send': return
    p = m['payload']
    kind = p.get('type')
    if kind == 'log': print('[frida]', p['msg']); return
    call = p.get('call')
    if call not in call_data: call_data[call] = {}
    if kind == 'enc_args':
        call_data[call]['args'] = p['args']
        call_data[call]['iv'] = d.hex() if d else None
    elif kind == 'enc_padding':
        call_data[call]['pad'] = d.hex() if d else None
    if 'args' in call_data[call] and 'pad' in call_data[call]:
        # complete; print
        print(f"\n--- BCryptEncrypt call #{call} ---")
        for a in call_data[call]['args']:
            extra = f' = {a["int"]}' if a['int'] is not None else ''
            print(f"  arg[{a['idx']}] = {a['value']}{extra}")
        print(f"  IV (arg4, arg5={call_data[call]['args'][5]['int']}b): {call_data[call]['iv']}")
        print(f"  Padding (arg3, first 64b): {call_data[call]['pad']}")

script.on('message', on_msg)
script.load()
print(f"[+] hooked {pid}; capturing 30s — provoke an Apply if needed")
time.sleep(30)
session.detach()
print("[+] detached")
