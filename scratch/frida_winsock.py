"""Hook Winsock send/recv on a target process — see ALL TCP traffic
regardless of TLS/non-TLS. We want to know WHICH socket the matrix Apply
data flies through.
"""
import sys, time, frida

JS = r"""
const ws2 = Process.findModuleByName('ws2_32.dll') || Process.findModuleByName('WS2_32.dll');
if (!ws2) { send({type:'log', msg:'no ws2_32'}); }

function hook(name, dirLabel) {
    let addr = null;
    try { addr = ws2.findExportByName(name); } catch(e){}
    if (!addr) { try { addr = ws2.getExportByName(name); } catch(e){} }
    if (!addr) { send({type:'log', msg:'missing '+name}); return; }
    Interceptor.attach(addr, {
        onEnter(args) {
            // send(SOCKET s, const char *buf, int len, int flags)
            // recv(SOCKET s, char *buf, int len, int flags)
            this.s = args[0].toInt32();
            this.buf = args[1];
            this.len = args[2].toInt32();
        },
        onLeave(retval) {
            const got = retval.toInt32();
            const n = (dirLabel === 'send') ? this.len : got;
            if (n <= 0 || n > 65536) return;
            // Read socket peer to identify port
            // We don't have getpeername here easily; just dump the socket id
            const data = this.buf.readByteArray(Math.min(n, 1024));
            send({type: dirLabel, sock: this.s, n: n}, data);
        }
    });
    send({type:'log', msg:'hooked '+name});
}

hook('send', 'send');
hook('recv', 'recv');
hook('WSASend', 'wsasend');
hook('WSARecv', 'wsarecv');
"""

def on_msg(m, d):
    if m['type'] == 'send':
        p = m['payload']
        kind = p.get('type')
        if kind == 'log':
            print('[frida]', p['msg']); return
        if d is None: return
        n = p.get('n', 0)
        sock = p.get('sock', '?')
        # Quick decode attempt
        printable = sum(1 for b in d[:80] if 32<=b<127 or b in (9,10,13))
        if printable > 60:
            try:
                t = d.decode('utf-8', errors='replace')[:600]
                print(f"\n[{kind} sock={sock} {n}b TEXT]:\n{t}")
                return
            except: pass
        print(f"\n[{kind} sock={sock} {n}b BIN]: {d[:128].hex()}")

if len(sys.argv) < 2:
    print("usage: frida_winsock.py <PID> [seconds]"); sys.exit(2)
pid = int(sys.argv[1])
dur = int(sys.argv[2]) if len(sys.argv) >= 3 else 30

session = frida.attach(pid)
script = session.create_script(JS)
script.on('message', on_msg)
script.load()
print(f"[+] hooked PID {pid}; capturing for {dur}s — DO YOUR THING IN AC NOW")
time.sleep(dur)
session.detach()
print("[+] detached")
