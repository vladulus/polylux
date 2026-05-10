r"""Send Aura RGB SET_REPORT via Control endpoint using pyusb.

Aura LED Controller (PID 0x18F3) has only Interrupt IN on iface 2.
AC sends commands via Control transfer SET_REPORT (HID class request)
through ep 0x00 (default control endpoint). hidapi.write() can't do
this because it expects an Output endpoint. We do it directly with
libusb ctrl_transfer.

Setup captured from AC:
  bmRT=0x21  bReq=0x09 (SET_REPORT)  wVal=0x0211 (Output, ID 0x11)
  wIdx=0x0002 (iface 2)  wLen=20
"""
from __future__ import annotations

import os
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import libusb
LIBUSB_DIR = Path(libusb.__file__).parent / "_platform" / "windows" / "x86_64"
if str(LIBUSB_DIR) not in os.environ.get("PATH", ""):
    os.environ["PATH"] = str(LIBUSB_DIR) + os.pathsep + os.environ.get("PATH", "")

import usb.core
import usb.util
import usb.backend.libusb1


CAPTURED_FRAMES = [
    [
        bytes.fromhex("11ff0a1b07ff3a3d25ff8f8f3eff080c41ffc2c3"),
        bytes.fromhex("11ff0a5b4949ff3a3d5a5affd4d56464ffb2b300"),
        bytes.fromhex("11ff0a7b0000000000000000000000000000000000"[:40]),
    ],
    [
        bytes.fromhex("11ff0a1b07ff2e3125ff9b9c3eff000441ffb6b7"),
        bytes.fromhex("11ff0a1b47fffcfc49ff474b5affe1e164ffbebe"),
        bytes.fromhex("11ff0a7b" + "00" * 16),
    ],
    [
        bytes.fromhex("11ff0a1b07ff222525ffa7a73eff0a0f41ffaaaa"),
        bytes.fromhex("11ff0a1b47fff0f049ff53575affeded64ffcbcc"),
        bytes.fromhex("11ff0a7b" + "00" * 16),
    ],
]


def main() -> int:
    backend = usb.backend.libusb1.get_backend(
        find_library=lambda n: str(LIBUSB_DIR / "libusb-1.0.dll")
    )
    dev = usb.core.find(idVendor=0x0B05, idProduct=0x18F3, backend=backend)
    if dev is None:
        print("AURA controller not found", file=sys.stderr)
        return 2
    print(f"Found AURA controller via libusb")

    # On Windows, control transfers can usually be sent without claiming
    # any interface (they go to the default control endpoint).
    # But the SET_REPORT request has wIndex=2 meaning interface 2.
    # If Windows has its HID driver bound to iface 2, we may need to
    # detach it. Try without detach first.

    print(f"Sending {len(CAPTURED_FRAMES) * 3} chunks (replay 10 iterations)...")
    n_ok = 0
    n_fail = 0
    for iteration in range(10):
        frame = CAPTURED_FRAMES[iteration % len(CAPTURED_FRAMES)]
        for chunk_idx, chunk in enumerate(frame):
            try:
                n = dev.ctrl_transfer(
                    bmRequestType=0x21,   # host->dev, class, interface
                    bRequest=0x09,        # SET_REPORT
                    wValue=0x0211,        # Output report, ID 0x11
                    wIndex=0x0002,        # interface 2
                    data_or_wLength=chunk,
                    timeout=1000,
                )
                if n == len(chunk):
                    n_ok += 1
                else:
                    print(f"  iter {iteration} chunk {chunk_idx}: short write {n}/{len(chunk)}")
                    n_fail += 1
            except usb.core.USBError as ex:
                if n_fail < 3:
                    print(f"  iter {iteration} chunk {chunk_idx}: USBError: {ex}")
                n_fail += 1
        time.sleep(0.1)

    print(f"\nSent {n_ok} chunks OK, {n_fail} failed")
    return 0 if n_ok else 1


if __name__ == "__main__":
    sys.exit(main())
