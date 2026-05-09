"""Capture EVERYTHING from UserSessionHelper boot:
  - connect() / WSAConnect calls (which sockets, to which ports)
  - send() / WSASend (outbound TCP, plaintext at this layer = ciphertext)
  - BCryptEncrypt input plaintext (what UserSessionHelper builds before encrypt)

Strategy:
  1. Kill any existing UserSessionHelper (it normally auto-respawns from
     ArmouryCrate.Service, but we want a fresh one we control).
  2. frida.spawn(path)  -- starts our own UserSessionHelper SUSPENDED.
  3. frida.attach to that PID, install hooks while still suspended.
  4. resume(pid) and let it boot. We catch the very first handshake bytes.

NOTE: This may briefly detach UserSessionHelper from its parent
(ArmouryCrate.Service may not recognize our spawn as its child). For
PROBE purposes this is fine — we only want to learn the handshake
pattern. We can't permanently substitute UserSessionHelper this way.
"""
import sys, time, json, subprocess, frida
from pathlib import Path

JS = r"""
'use strict';
let g_seq = 0;
function ts() { return Date.now(); }

function expByName(modName, fnName) {
    const mod = Process.findModuleByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e){ return null; }
}

// ---- connect() — ws2_32 ----
const conAddr = expByName('ws2_32.dll', 'connect') || expByName('WS2_32.dll', 'connect');
if (conAddr) {
    Interceptor.attach(conAddr, {
        onEnter(args) {
            this.s = args[0].toInt32();
            // sockaddr_in: family(2) | port(2 BE) | addr(4) | zero(8)
            const addr = args[1];
            const fam = addr.readU16();
            const port = (addr.add(2).readU8() << 8) | addr.add(3).readU8();
            const ip0 = addr.add(4).readU8(); const ip1 = addr.add(5).readU8();
            const ip2 = addr.add(6).readU8(); const ip3 = addr.add(7).readU8();
            send({type:'connect', seq:++g_seq, ts:ts(), s:this.s, family:fam, port:port,
                  ip:ip0+'.'+ip1+'.'+ip2+'.'+ip3});
        }
    });
}

// ---- send() — ws2_32 ----
const sendAddr = expByName('ws2_32.dll', 'send') || expByName('WS2_32.dll', 'send');
if (sendAddr) {
    Interceptor.attach(sendAddr, {
        onEnter(args) { this.s = args[0].toInt32(); this.buf = args[1]; this.len = args[2].toInt32(); },
        onLeave(retval) {
            const got = retval.toInt32();
            if (got <= 0) return;
            const data = this.buf.readByteArray(Math.min(got, 65536));
            send({type:'send', seq:++g_seq, ts:ts(), s:this.s, n:got}, data);
        }
    });
}

// ---- recv() — ws2_32 ----
const recvAddr = expByName('ws2_32.dll', 'recv') || expByName('WS2_32.dll', 'recv');
if (recvAddr) {
    Interceptor.attach(recvAddr, {
        onEnter(args) { this.s = args[0].toInt32(); this.buf = args[1]; this.len = args[2].toInt32(); },
        onLeave(retval) {
            const got = retval.toInt32();
            if (got <= 0) return;
            const data = this.buf.readByteArray(Math.min(got, 65536));
            send({type:'recv', seq:++g_seq, ts:ts(), s:this.s, n:got}, data);
        }
    });
}

// ---- BCryptEncrypt: capture plaintext & extract nonce/tag from auth-info ----
const encAddr = expByName('bcrypt.dll', 'BCryptEncrypt');
if (encAddr) {
    Interceptor.attach(encAddr, {
        onEnter(args) {
            this.plain = args[1]; this.cb = args[2].toInt32(); this.info = args[3];
            this.cBuf = args[6]; this.pcb = args[8];
        },
        onLeave(retval) {
            if (this.cb <= 0 || this.cb > 65536) return;
            const pt = this.plain.readByteArray(this.cb);
            let cipherLen = 0; try { cipherLen = this.pcb.readU32(); } catch(e){}
            let nonce = null, tag = null;
            if (!this.info.isNull()) {
                try {
                    const noncePtr = this.info.add(8).readPointer();
                    const cbN = this.info.add(16).readU32();
                    if (cbN > 0 && cbN < 64 && !noncePtr.isNull()) nonce = noncePtr.readByteArray(cbN);
                    const tagPtr = this.info.add(40).readPointer();
                    const cbT = this.info.add(48).readU32();
                    if (cbT > 0 && cbT < 64 && !tagPtr.isNull()) tag = tagPtr.readByteArray(cbT);
                } catch(e){}
            }
            send({type:'enc', seq:++g_seq, ts:ts(), plain_len:this.cb, cipher_len:cipherLen}, pt);
            if (nonce) send({type:'enc_nonce', seq:g_seq}, nonce);
            if (tag) send({type:'enc_tag', seq:g_seq}, tag);
        }
    });
}

send({type:'log', msg:'handshake-capture hooks armed'});
"""

USHELPER = r"C:\Program Files\ASUS\Armoury Crate Service\ArmouryCrate.UserSessionHelper.exe"

def main():
    out = Path('scratch/captures') / f'handshake_{time.strftime("%Y%m%d_%H%M%S")}.jsonl'
    out.parent.mkdir(exist_ok=True)
    f = out.open('w', encoding='utf-8')

    # Kill existing
    print('[+] killing existing UserSessionHelper.exe (if any)')
    subprocess.run(['taskkill', '/F', '/IM', 'ArmouryCrate.UserSessionHelper.exe'],
                   capture_output=True)
    time.sleep(1)

    print(f'[+] frida.spawn({USHELPER})')
    pid = frida.spawn(USHELPER)
    print(f'[+] spawned PID={pid}')
    session = frida.attach(pid)
    script = session.create_script(JS)

    def on_msg(m, d):
        if m['type'] != 'send':
            if m['type']=='error': print('[!]', m.get('description'))
            return
        p = m['payload']
        rec = dict(p)
        if d is not None: rec['data_hex'] = d.hex()
        f.write(json.dumps(rec)+'\n')
        f.flush()
        kind = p.get('type')
        if kind == 'log':
            print('[frida]', p['msg'])
        elif kind == 'connect':
            print(f"  CONNECT s={p['s']} -> {p['ip']}:{p['port']}")
        elif kind in ('send','recv'):
            sample = (d or b'')[:24].hex() if d else ''
            print(f"  {kind.upper():4} s={p['s']} n={p['n']:5} hex0..24={sample}")
        elif kind == 'enc':
            print(f"  ENC plain={p['plain_len']:5}")

    script.on('message', on_msg)
    script.load()
    print('[+] hooks loaded; resuming process')
    frida.resume(pid)
    print('[+] capturing 30s — let UserSessionHelper boot and do its handshake')
    time.sleep(30)
    session.detach()
    f.close()
    print(f'[+] saved -> {out}')

main()
