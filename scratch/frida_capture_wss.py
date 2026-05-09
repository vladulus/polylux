"""Attach Frida to ArmouryCrate.UserSessionHelper.exe and dump plaintext
data going through SChannel TLS encryption (i.e., the WSS payloads on
port 9012 before they're encrypted).

Workflow:
  1. Run this script.
  2. Vlad clicks something in Armoury Crate UI (e.g., change matrix color
     and Apply).
  3. We see the exact plaintext WSS frames the official client sends.
  4. We replicate that from Python verbatim and ArmourySocketServer
     starts replying.

Hook target: secur32.dll!EncryptMessage. Its 3rd arg is a SecBufferDesc
containing the plaintext data buffer (BufferType == SECBUFFER_DATA == 1).
"""
from __future__ import annotations

import sys

import frida


JS_HOOK = r"""
'use strict';

const SECBUFFER_DATA = 1;

const fn = Module.findExportByName('secur32.dll', 'EncryptMessage');
if (!fn) {
    console.warn('[!] EncryptMessage not found in secur32.dll');
}

Interceptor.attach(fn, {
    onEnter(args) {
        // args[2] = PSecBufferDesc
        const pBufferDesc = args[2];
        if (pBufferDesc.isNull()) return;
        // SecBufferDesc: ULONG ulVersion (4), ULONG cBuffers (4), PSecBuffer pBuffers (8 on x64)
        const cBuffers = pBufferDesc.add(4).readU32();
        const pBuffers = pBufferDesc.add(8).readPointer();
        if (pBuffers.isNull() || cBuffers === 0 || cBuffers > 16) return;

        // SecBuffer: ULONG cbBuffer (4), ULONG BufferType (4), PVOID pvBuffer (8 on x64)
        // sizeof on x64 = 16 (with implicit alignment padding)
        const SECBUF_SIZE = 16;
        for (let i = 0; i < cBuffers; i++) {
            const buf = pBuffers.add(i * SECBUF_SIZE);
            const cbBuffer = buf.readU32();
            const BufferType = buf.add(4).readU32();
            const pvBuffer = buf.add(8).readPointer();
            if (BufferType !== SECBUFFER_DATA) continue;
            if (cbBuffer === 0 || pvBuffer.isNull()) continue;
            const len = Math.min(cbBuffer, 8192);
            const data = pvBuffer.readByteArray(len);
            send({type: 'tls_plaintext_send', total: cbBuffer, len: len}, data);
        }
    }
});

const fn2 = Module.findExportByName('secur32.dll', 'DecryptMessage');
if (fn2) {
    Interceptor.attach(fn2, {
        onLeave(retval) {
            // After DecryptMessage, the SecBuffer holding ciphertext gets
            // remapped to plaintext type=1 in place. Caller passes pBufferDesc
            // as args[1]; but onLeave can't access args directly without saving.
            // For our needs, capturing ENCRYPT side is enough — that's what
            // the client SENDS. Server replies show in DecryptMessage.
        },
    });
    Interceptor.attach(fn2, {
        onEnter(args) {
            this.pBufferDesc = args[1];
        },
        onLeave(retval) {
            const pBufferDesc = this.pBufferDesc;
            if (pBufferDesc.isNull()) return;
            const cBuffers = pBufferDesc.add(4).readU32();
            const pBuffers = pBufferDesc.add(8).readPointer();
            if (pBuffers.isNull() || cBuffers === 0 || cBuffers > 16) return;
            const SECBUF_SIZE = 16;
            for (let i = 0; i < cBuffers; i++) {
                const buf = pBuffers.add(i * SECBUF_SIZE);
                const cbBuffer = buf.readU32();
                const BufferType = buf.add(4).readU32();
                const pvBuffer = buf.add(8).readPointer();
                if (BufferType !== SECBUFFER_DATA) continue;
                if (cbBuffer === 0 || pvBuffer.isNull()) continue;
                const len = Math.min(cbBuffer, 8192);
                const data = pvBuffer.readByteArray(len);
                send({type: 'tls_plaintext_recv', total: cbBuffer, len: len}, data);
            }
        },
    });
}

console.log('[+] hooks installed on EncryptMessage / DecryptMessage');
"""


TARGET_NAME = "ArmouryCrate.UserSessionHelper.exe"


def _resolve_target():
    """Find the right process to attach to. Try by name first, then scan
    all PIDs for one whose path matches our target binary.
    """
    try:
        return frida.attach(TARGET_NAME)
    except (frida.ProcessNotFoundError, Exception):
        pass
    # Fallback: use device.enumerate_processes()
    device = frida.get_local_device()
    for proc in device.enumerate_processes():
        if "UserSessionHelper" in proc.name or "UserSessionH" in proc.name:
            print(f"[+] matched by partial name: {proc.name} pid={proc.pid}")
            return frida.attach(proc.pid)
    raise RuntimeError("could not find UserSessionHelper")


def _decode(b: bytes) -> str:
    # Best-effort printable preview
    try:
        return b.decode("utf-8")
    except UnicodeDecodeError:
        return repr(b)


def on_message(message, data):
    if message["type"] == "send":
        p = message["payload"]
        kind = p.get("type", "?")
        total = p.get("total", -1)
        if data is None:
            print(f"[{kind}] total={total} (no data)")
            return
        # If it's WebSocket framing, the first byte's lower nibble has opcode.
        # WS frames look like: 0x81 (FIN+TEXT) 0x?? len then payload.
        first = data[0] if data else 0
        opcode = first & 0x0F
        opname = {0x1: "TEXT", 0x2: "BIN", 0x8: "CLOSE", 0x9: "PING", 0xA: "PONG"}.get(opcode, f"op{opcode:x}")
        # Try to find the WS payload — quick & dirty
        text = _decode(data[:600])
        print(f"\n[{kind}] {total} bytes (op {opname}? hex0={first:02x}):")
        if any(32 <= b < 127 or b in (9, 10, 13) for b in data[:80]):
            print(f"  TEXT: {text[:600]}")
        else:
            print(f"  HEX:  {data[:200].hex()}")
    elif message["type"] == "error":
        print("[!] frida error:", message.get("description"))
        print(message.get("stack", ""))


def main() -> int:
    # PID supplied via argv if provided, else try by name then enumerate
    pid_arg = None
    if len(sys.argv) >= 2:
        try:
            pid_arg = int(sys.argv[1])
        except ValueError:
            pass
    if pid_arg is not None:
        print(f"[+] attaching by PID {pid_arg}")
        session = frida.attach(pid_arg)
    else:
        print(f"[+] looking for process: {TARGET_NAME}")
        try:
            session = _resolve_target()
        except (RuntimeError, frida.ServerNotRunningError, Exception) as e:
            print(f"[!] {e}")
            return 1
    print(f"[+] attached")

    script = session.create_script(JS_HOOK)
    script.on("message", on_message)
    script.load()
    print("[+] script loaded — hooks active")
    print()
    print("VLAD: trigger something in Armoury Crate UI now")
    print("      (change matrix color, toggle OLED option, click Apply)")
    print()
    print("Hit ENTER to detach and exit...")
    sys.stdin.readline()
    session.detach()
    return 0


if __name__ == "__main__":
    sys.exit(main())
