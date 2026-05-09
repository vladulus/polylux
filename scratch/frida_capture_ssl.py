"""Attach to UserSessionHelper.exe (PID arg) and hook OpenSSL's SSL_write
and SSL_read. Dump plaintext WSS frames going to/from ws[s]://127.0.0.1:9012.
"""
from __future__ import annotations

import sys

import frida


JS = r"""
'use strict';

const ssl_dll = 'libssl-1_1-x64.dll';

function tryHookExport(modName, fnName, hooks) {
    let addr = null;
    // Try Frida 17+ API first, fall back to older API
    try {
        const mod = Process.findModuleByName(modName);
        if (mod) {
            try { addr = mod.findExportByName(fnName); } catch (e) {}
            if (!addr) {
                try { addr = mod.getExportByName(fnName); } catch (e) {}
            }
        }
    } catch (e) {
        send({type: 'log', msg: `lookup error for ${modName}!${fnName}: ${e}`});
    }
    if (!addr) {
        send({type: 'log', msg: `MISSING: ${modName}!${fnName}`});
        return false;
    }
    Interceptor.attach(addr, hooks);
    send({type: 'log', msg: `HOOK OK: ${modName}!${fnName} @ ${addr}`});
    return true;
}

function dumpHex(ptr, n) {
    if (ptr.isNull() || n <= 0) return '';
    const cap = Math.min(n, 4096);
    return ptr.readByteArray(cap);
}

// SSL_write(ssl, buf, num) -> int
tryHookExport(ssl_dll, 'SSL_write', {
    onEnter(args) {
        const buf = args[1];
        const num = args[2].toInt32();
        if (num <= 0) return;
        const data = buf.readByteArray(Math.min(num, 4096));
        send({type: 'ssl_write', total: num}, data);
    }
});

// SSL_read(ssl, buf, num) -> int (bytes filled on success)
tryHookExport(ssl_dll, 'SSL_read', {
    onEnter(args) {
        this.buf = args[1];
        this.num = args[2].toInt32();
    },
    onLeave(retval) {
        const got = retval.toInt32();
        if (got <= 0) return;
        const data = this.buf.readByteArray(Math.min(got, 4096));
        send({type: 'ssl_read', total: got}, data);
    }
});
"""


def on_message(message, data):
    if message["type"] == "send":
        p = message["payload"]
        kind = p.get("type")
        if kind == "log":
            print(f"[frida] {p['msg']}")
            return
        if kind not in ("ssl_write", "ssl_read"):
            return
        total = p.get("total", -1)
        arrow = ">>>" if kind == "ssl_write" else "<<<"
        if data is None:
            print(f"  {arrow} {kind} total={total} (no data)")
            return
        # Try printable
        try:
            text = data.decode("utf-8")
            printable = sum(1 for c in text if c.isprintable() or c in "\n\r\t")
            if printable > len(text) * 0.85:
                print(f"\n  {arrow} {kind} ({total}b TEXT):\n{text[:1500]}")
                return
        except UnicodeDecodeError:
            pass
        print(f"\n  {arrow} {kind} ({total}b BIN): {data[:200].hex()}")
    elif message["type"] == "error":
        print(f"[!] frida error: {message.get('description')}")


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: frida_capture_ssl.py <PID>")
        return 2
    pid = int(sys.argv[1])
    print(f"[+] attaching to PID {pid}")
    session = frida.attach(pid)
    print("[+] attached")
    script = session.create_script(JS)
    script.on("message", on_message)
    script.load()
    print("[+] hooks installed")
    print()
    duration = 60
    if len(sys.argv) >= 3:
        try: duration = int(sys.argv[2])
        except ValueError: pass
    print("VLAD: trigger something in Armoury Crate UI now")
    print("      (change matrix color, toggle OLED option, click Apply)")
    print(f"  capturing for {duration}s...")
    import time
    time.sleep(duration)
    session.detach()
    print("[+] detached")
    return 0


if __name__ == "__main__":
    sys.exit(main())
