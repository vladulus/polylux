"""Replicate the FULL per-frame sequence captured from ASUS daemon:

  1. INT OUT ep 0x02 (HID Output Report, mi_01):
       65 bytes: ec 7f 04 00 03 + 60 zeros
  2. BULK OUT ep 0x01 (vendor, mi_00): 768 bytes pixel frame

The HID interrupt OUT is the "frame prep" / "begin transfer" signal. Without
it, the bulk frame data is silently ignored by the device firmware.

Test plan: send the prep-INT, then a custom bulk frame. See if matrix changes.
"""
from __future__ import annotations

import os
import sys
import time
from pathlib import Path

import libusb
libusb_dir = Path(libusb.__file__).parent / "_platform" / "windows" / "x86_64"
os.environ["PATH"] = str(libusb_dir) + os.pathsep + os.environ["PATH"]

import usb.core, usb.util, usb.backend.libusb1
import hid


VID = 0x0B05
PID = 0x1A21


def open_bulk():
    backend = usb.backend.libusb1.get_backend(
        find_library=lambda n: str(libusb_dir / "libusb-1.0.dll")
    )
    dev = usb.core.find(idVendor=VID, idProduct=PID, backend=backend)
    if dev is None:
        raise RuntimeError("device not found")
    usb.util.claim_interface(dev, 0)
    return dev


def open_hid():
    devs = list(hid.enumerate(VID, PID))
    if not devs:
        raise RuntimeError("HID iface not found")
    h = hid.device()
    h.open_path(devs[0]["path"])
    return h


def send_frame(usb_dev, hid_dev, frame: bytes) -> None:
    """One full frame transfer: prep INT + bulk data."""
    if len(frame) != 768:
        raise ValueError(f"frame must be 768B, got {len(frame)}")

    # Prep packet — HID Output Report on iface 1 INT ep 0x02
    # First byte is report ID 0xec (per captured payload `ec 7f 04 00 03 ...`)
    prep = bytes([0xEC, 0x7F, 0x04, 0x00, 0x03]) + b"\x00" * 60  # 65 bytes total
    n = hid_dev.write(prep)
    if n < 0:
        raise RuntimeError(f"hid write failed: {hid_dev.error()}")

    # Bulk frame on iface 0 ep 0x01
    n = usb_dev.write(0x01, frame, timeout=2000)
    if n != 768:
        raise RuntimeError(f"bulk write incomplete: {n}/768")


def main():
    print("[+] opening bulk interface (mi_00)...")
    udev = open_bulk()
    print("[+] opening HID interface (mi_01)...")
    hdev = open_hid()

    try:
        print("[+] frame 1: ALL ZEROS (matrix should go dark)")
        send_frame(udev, hdev, b"\x00" * 768)
        time.sleep(2)

        print("[+] frame 2: ALL 0xff (matrix should go full bright)")
        send_frame(udev, hdev, b"\xff" * 768)
        time.sleep(2)

        print("[+] frame 3: HALF ON (first 384 bytes 0xff, rest zero)")
        send_frame(udev, hdev, b"\xff" * 384 + b"\x00" * 384)
        time.sleep(2)

        print("[+] frame 4: ALL ZEROS again")
        send_frame(udev, hdev, b"\x00" * 768)
        time.sleep(2)

        print("[+] holding all-bright for 5s — should stay if no-one overwrites")
        send_frame(udev, hdev, b"\xff" * 768)
        time.sleep(5)
    finally:
        usb.util.release_interface(udev, 0)
        usb.util.dispose_resources(udev)
        hdev.close()
        print("[+] released")


if __name__ == "__main__":
    sys.exit(main() or 0)
