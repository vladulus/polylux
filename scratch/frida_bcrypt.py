"""Hook BCryptEncrypt/BCryptDecrypt in UserSessionHelper to capture
plaintext data BEFORE / AFTER the custom-protocol encryption.

BCryptEncrypt(
  BCRYPT_KEY_HANDLE hKey,
  PUCHAR            pbInput,      // plaintext (in)
  ULONG             cbInput,
  VOID              *pPaddingInfo,
  PUCHAR            pbIV,
  ULONG             cbIV,
  PUCHAR            pbOutput,     // ciphertext (out)
  ULONG             cbOutput,
  ULONG             *pcbResult,
  ULONG             dwFlags
);
"""
import sys, time, frida

JS = r"""
function hookExport(modName, fnName, plainArgIdx, plainSizeIdx, label) {
    let mod = Process.findModuleByName(modName);
    if (!mod) { send({type:'log', msg:'no module '+modName}); return; }
    let addr = null;
    try { addr = mod.findExportByName(fnName); } catch(e){}
    if (!addr) { try { addr = mod.getExportByName(fnName); } catch(e){} }
    if (!addr) { send({type:'log', msg:'no export '+modName+'!'+fnName}); return; }
    Interceptor.attach(addr, {
        onEnter(args) {
            this.plain = args[plainArgIdx];
            this.cb = args[plainSizeIdx].toInt32();
            this.label = label;
        },
        onLeave(retval) {
            if (this.cb <= 0 || this.cb > 65536) return;
            const data = this.plain.readByteArray(Math.min(this.cb, 4096));
            send({type: this.label, n: this.cb, ret: retval.toInt32()}, data);
        }
    });
    send({type:'log', msg:'HOOK '+modName+'!'+fnName+' @ '+addr});
}

// BCryptEncrypt: arg0=key, arg1=input(plain), arg2=cbInput
hookExport('bcrypt.dll', 'BCryptEncrypt', 1, 2, 'enc');
// BCryptDecrypt: arg0=key, arg1=input(cipher), arg2=cbInput
//   Plaintext goes into arg6=pbOutput, after call. Capture arg6 at onLeave.
const dec_mod = Process.findModuleByName('bcrypt.dll');
let dec_addr = null;
try { dec_addr = dec_mod.findExportByName('BCryptDecrypt'); } catch(e){}
if (!dec_addr) { try { dec_addr = dec_mod.getExportByName('BCryptDecrypt'); } catch(e){} }
if (dec_addr) {
    Interceptor.attach(dec_addr, {
        onEnter(args) {
            this.pbOutput = args[6];
            this.pcbResult = args[8];
        },
        onLeave(retval) {
            if (retval.toInt32() !== 0) return;
            if (this.pcbResult.isNull()) return;
            const got = this.pcbResult.readU32();
            if (got <= 0 || got > 65536) return;
            const data = this.pbOutput.readByteArray(Math.min(got, 4096));
            send({type:'dec', n: got}, data);
        }
    });
    send({type:'log', msg:'HOOK bcrypt.dll!BCryptDecrypt @ '+dec_addr});
}
"""

def on_msg(m, d):
    if m['type'] == 'send':
        p = m['payload']
        kind = p.get('type')
        if kind == 'log': print('[frida]', p['msg']); return
        if d is None: return
        n = p.get('n', 0)
        try:
            t = d.decode('utf-8', errors='replace')
            printable = sum(1 for c in t[:80] if c.isprintable() or c in '\n\r\t')
        except: t = ''; printable = 0
        if printable > 60 and len(t) > 0:
            print(f"\n[{kind} {n}b TEXT]:\n{t[:1500]}")
        else:
            print(f"\n[{kind} {n}b BIN]: {d[:200].hex()}")

if len(sys.argv) < 2: print("usage: <PID> [seconds]"); sys.exit(2)
pid = int(sys.argv[1]); dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30
session = frida.attach(pid)
script = session.create_script(JS)
script.on('message', on_msg)
script.load()
print(f"[+] hooked PID {pid}; capturing {dur}s — DO YOUR THING NOW")
time.sleep(dur)
session.detach()
print("[+] detached")
