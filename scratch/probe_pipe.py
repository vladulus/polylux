"""Probe \\.\pipe\ArmouryCrateDeviceMonitor.

The named pipe likely serves as the IPC trigger LightingService listens on
for "config changed, please re-apply" notifications. Strategy:
  1. Open the pipe in read+write byte mode
  2. Send a few candidate messages (ping, JSON, simple keywords)
  3. Read whatever comes back

If the server speaks a documented protocol we can replicate from Python.
If it disconnects on our first byte, we know it expects a specific framing
or auth handshake and we'll need to capture real traffic next.
"""
from __future__ import annotations

import struct
import time

import win32file
import win32pipe
import pywintypes

PIPES = [
    r"\\.\pipe\ArmouryCrateDeviceMonitor",
    r"\\.\pipe\AuraPipe1",
]


def probe_pipe(name: str) -> None:
    print(f"\n=== {name} ===")
    try:
        h = win32file.CreateFile(
            name,
            win32file.GENERIC_READ | win32file.GENERIC_WRITE,
            0,
            None,
            win32file.OPEN_EXISTING,
            0,
            None,
        )
    except pywintypes.error as e:
        print(f"  open failed: {e}")
        return
    print("  opened")

    # Try byte mode read first to see if server pushes anything
    try:
        win32pipe.SetNamedPipeHandleState(
            h, win32pipe.PIPE_READMODE_MESSAGE, None, None
        )
        print("  set message mode")
    except pywintypes.error as e:
        print(f"  could not set message mode (using byte mode): {e}")

    # Probes — diverse, short, fast
    probes = [
        b"\x00",  # null byte (ping)
        b"\x01\x00\x00\x00",  # tiny u32
        b"ping\n",  # plain text
        b'{"command":"ping"}\n',  # JSON
        b'<root><header>ASUS_AURA</header><version>1.0</version><funcid>1</funcid></root>',
        b"GetStatus\n",
    ]

    for probe in probes:
        print(f"  >> {probe!r}")
        try:
            win32file.WriteFile(h, probe)
        except pywintypes.error as e:
            print(f"     write failed: {e}")
            break
        time.sleep(0.5)
        # Try to read with a short timeout via PeekNamedPipe
        try:
            bytes_avail = win32pipe.PeekNamedPipe(h, 0)[1]
            if bytes_avail:
                _, data = win32file.ReadFile(h, bytes_avail)
                print(f"     << ({len(data)}) {data[:200]!r}")
            else:
                print(f"     << (no reply yet)")
        except pywintypes.error as e:
            print(f"     read failed: {e}")
            break

    try:
        win32file.CloseHandle(h)
    except Exception:
        pass


def main() -> None:
    for p in PIPES:
        probe_pipe(p)


if __name__ == "__main__":
    main()
