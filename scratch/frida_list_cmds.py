"""List all unique 'Cmd' values seen in BCryptDecrypt plaintexts.

Helps identify the command name for OLED, RGB lights, etc.
Run this for ~30s while Vlad clicks Apply on different pages
(matrix, OLED, RGB, anything).
"""
import sys, time, frida

JS = r"""
'use strict';
const seen = new Set();

const decAddr = (() => {
    const m = Process.findModuleByName('bcrypt.dll');
    if (!m) return null;
    try { return m.findExportByName('BCryptDecrypt'); } catch(e){}
    try { return m.getExportByName('BCryptDecrypt'); } catch(e){ return null; }
})();

if (decAddr) {
    Interceptor.attach(decAddr, {
        onEnter(args) { this.pPlain = args[6]; this.pcb = args[8]; },
        onLeave(retval) {
            if (retval.toInt32() !== 0) return;
            const got = this.pcb.readU32();
            if (got <= 0 || got > 65536) return;
            const data = new Uint8Array(this.pPlain.readByteArray(got));
            // Find pattern: 0x03 'Cmd' 0x10 <u32 len> <wstring>
            for (let i = 0; i + 12 <= data.length; i++) {
                if (data[i] === 0x03 && data[i+1] === 0x43 && data[i+2] === 0x6d && data[i+3] === 0x64
                    && data[i+4] === 0x10) {
                    const plen = data[i+5] | (data[i+6]<<8) | (data[i+7]<<16) | (data[i+8]<<24);
                    if (plen > 0 && plen < 200 && i + 9 + plen <= data.length) {
                        let cmd = '';
                        for (let j = 0; j+1 < plen; j += 2) {
                            cmd += String.fromCharCode(data[i+9+j] | (data[i+9+j+1]<<8));
                        }
                        cmd = cmd.replace(/\x00+$/, '');
                        if (cmd && !seen.has(cmd)) {
                            seen.add(cmd);
                            send({type:'cmd', cmd: cmd, plaintext_size: got});
                        }
                    }
                    break;
                }
            }
        }
    });
    send({type:'log', msg:'cmd-listing hook armed'});
}
"""


if len(sys.argv) < 2: print("usage: <PID> [seconds]"); sys.exit(2)
pid = int(sys.argv[1])
dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60
session = frida.attach(pid)
script = session.create_script(JS)
def on_msg(m, d):
    p = m.get('payload', {})
    if p.get('type') == 'log': print('[frida]', p['msg'])
    elif p.get('type') == 'cmd':
        print(f'[CMD] {p["cmd"]:40} (plaintext {p["plaintext_size"]} bytes)')
script.on('message', on_msg)
script.load()
print(f'[+] hook armed; LISTING all unique Cmds for {dur}s')
print('[+] VLAD: cycle through Armoury Crate pages — matrix, OLED, RGB, fan, anything — and Apply on each')
time.sleep(dur)
session.detach()
print('[+] detached')
