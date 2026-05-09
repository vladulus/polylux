"""Quick: dump loaded modules of UserSessionHelper to find the TLS API
it actually uses (winhttp / schannel / sspicli / bcrypt / etc.).
"""
import sys
import frida

JS = """
const mods = Process.enumerateModules();
const interesting = mods.filter(m => /winhttp|schannel|sspicli|secur32|bcrypt|websocket|http\.dll|wininet|crypt/i.test(m.name));
send({type:'modules', count: mods.length, interesting: interesting.map(m=>m.name)});
"""

if len(sys.argv) < 2:
    print("usage: frida_list_modules.py <PID>")
    sys.exit(2)

session = frida.attach(int(sys.argv[1]))

def on_msg(message, data):
    if message.get("type") == "send":
        p = message.get("payload", {})
        print(f"total modules: {p.get('count')}")
        print("TLS-relevant modules loaded:")
        for n in p.get("interesting", []):
            print(f"  {n}")

script = session.create_script(JS)
script.on("message", on_msg)
script.load()

import time; time.sleep(1)  # let messages flush
session.detach()
