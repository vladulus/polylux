r"""Enumerate USB device VID:0B05 PID:1A21 — list all interfaces and endpoints.

Per docs §3, AniMe Matrix and LiveDash OLED are multiplexed on this chip.
We've used mi_00 (vendor bulk) + mi_01 (HID) for the matrix. We want to
know what other interfaces / endpoints exist that might drive the OLED.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

# Add libusb to PATH (the same trick usb_direct.py uses).
import libusb
LIBUSB_DIR = Path(libusb.__file__).parent / "_platform" / "windows" / "x86_64"
if str(LIBUSB_DIR) not in os.environ.get("PATH", ""):
    os.environ["PATH"] = str(LIBUSB_DIR) + os.pathsep + os.environ.get("PATH", "")

import usb.core
import usb.util
import usb.backend.libusb1


VID = 0x0B05
PID = 0x1A21


def main() -> int:
    backend = usb.backend.libusb1.get_backend(
        find_library=lambda n: str(LIBUSB_DIR / "libusb-1.0.dll")
    )
    dev = usb.core.find(idVendor=VID, idProduct=PID, backend=backend)
    if dev is None:
        print(f"Device VID 0x{VID:04x} PID 0x{PID:04x} not found", file=sys.stderr)
        return 2

    print(f"=== Device VID 0x{VID:04x} PID 0x{PID:04x} ===")
    try:
        print(f"Manufacturer: {usb.util.get_string(dev, dev.iManufacturer)}")
    except Exception as ex:
        print(f"  (could not read manufacturer: {ex})")
    try:
        print(f"Product:      {usb.util.get_string(dev, dev.iProduct)}")
    except Exception as ex:
        print(f"  (could not read product: {ex})")
    try:
        print(f"Serial:       {usb.util.get_string(dev, dev.iSerialNumber)}")
    except Exception as ex:
        print(f"  (could not read serial: {ex})")
    print(f"bcdDevice:    0x{dev.bcdDevice:04x}")
    print(f"bcdUSB:       0x{dev.bcdUSB:04x}")
    print(f"Speed:        {dev.speed}")
    print()
    for cfg in dev:
        print(f"=== Configuration {cfg.bConfigurationValue} ===")
        print(f"  bNumInterfaces:    {cfg.bNumInterfaces}")
        print(f"  bmAttributes:      0x{cfg.bmAttributes:02x}")
        print(f"  bMaxPower:         {cfg.bMaxPower * 2} mA")
        for intf in cfg:
            print(f"\n  --- Interface {intf.bInterfaceNumber} (alt {intf.bAlternateSetting}) ---")
            print(f"    Class:    0x{intf.bInterfaceClass:02x} ({usb_class_name(intf.bInterfaceClass)})")
            print(f"    Subclass: 0x{intf.bInterfaceSubClass:02x}")
            print(f"    Protocol: 0x{intf.bInterfaceProtocol:02x}")
            print(f"    Endpoints: {intf.bNumEndpoints}")
            for ep in intf:
                ep_addr = ep.bEndpointAddress
                direction = "IN " if ep_addr & 0x80 else "OUT"
                ep_num = ep_addr & 0x7F
                xfer_types = {0: "CONTROL", 1: "ISOCH", 2: "BULK", 3: "INTERRUPT"}
                xfer = xfer_types.get(ep.bmAttributes & 0x03, "UNKNOWN")
                print(f"      ep 0x{ep_addr:02x} ({direction} #{ep_num}) "
                      f"{xfer:9s} max_packet={ep.wMaxPacketSize} interval={ep.bInterval}")
    return 0


def usb_class_name(cls: int) -> str:
    names = {
        0x00: "device-defined",
        0x01: "audio",
        0x02: "CDC",
        0x03: "HID",
        0x05: "physical",
        0x06: "image",
        0x07: "printer",
        0x08: "mass storage",
        0x09: "hub",
        0x0a: "CDC data",
        0x0b: "smart card",
        0x0d: "content security",
        0x0e: "video",
        0x0f: "personal healthcare",
        0x10: "audio/video",
        0xdc: "diagnostic",
        0xe0: "wireless",
        0xef: "misc",
        0xfe: "application specific",
        0xff: "vendor specific",
    }
    return names.get(cls, f"unknown 0x{cls:02x}")


if __name__ == "__main__":
    sys.exit(main())
