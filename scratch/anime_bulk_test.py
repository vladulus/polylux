"""Direct bulk write to AniMe Matrix via pyusb / libusb-1.0.

Captured protocol from USBPcap on Vlad's ROG Maximus Z690 Extreme:
  Device:    VID 0x0B05, PID 0x1A21 (OLED Controller mi_00)
  Driver:    WinUSB (already installed)
  Endpoint:  0x01 OUT, transfer type BULK
  Payload:   768 bytes per frame, binary on/off (0x00 / 0xff)

Test: extract one 768-byte frame from scratch/captures/matrix_apply.pcap
and bulk-write it to the device. Matrix should display that captured frame.
If matrix changes — Polylux drives the chip directly.

Note: ASUS HAL Aac3572MbHal_x86.exe is currently using the device but WinUSB
allows shared access at the API layer. Worst case we get sharing violations.
If that happens, Vlad kills the HAL daemons and we retry.
"""
from __future__ import annotations

import struct
import sys
import time
from pathlib import Path


VID = 0x0B05
PID = 0x1A21
INTERFACE = 0  # mi_00, the OLED Controller
ENDPOINT_OUT = 0x01  # bulk OUT


def extract_frame_from_pcap(path: Path, frame_index: int = 0) -> bytes:
    """Return the (frame_index)-th unique 768-byte bulk write to dev 10
    endpoint 0x01 from a USBPcap file."""
    with open(path, "rb") as f:
        f.read(24)  # global header
        seen = set()
        idx = 0
        while True:
            ph = f.read(16)
            if len(ph) < 16:
                break
            _, _, caplen, _ = struct.unpack("<IIII", ph)
            data = f.read(caplen)
            if len(data) < 27:
                continue
            hdrlen = struct.unpack_from("<H", data, 0)[0]
            irp, status, func, info, bus, dev, endp, xfer, dlen = struct.unpack_from(
                "<QIHBHHBBI", data, 2
            )
            if dev != 10 or dlen != 768 or xfer != 3 or endp != 1:
                continue
            body = data[hdrlen : hdrlen + 768]
            if len(body) != 768:
                continue
            if body in seen:
                continue
            seen.add(body)
            if idx == frame_index:
                return body
            idx += 1
    raise IndexError(f"no frame {frame_index} in {path}")


def main():
    print("[+] importing pyusb + libusb backend...")
    import usb.core
    import usb.util
    import usb.backend.libusb1
    import os
    # libusb python package bundles the DLL; pyusb needs it on PATH
    import libusb
    libusb_dir = Path(libusb.__file__).parent / "_platform" / "windows" / "x86_64"
    os.environ["PATH"] = str(libusb_dir) + os.pathsep + os.environ["PATH"]
    backend = usb.backend.libusb1.get_backend(
        find_library=lambda name: str(libusb_dir / "libusb-1.0.dll")
    )
    print(f"[+] backend: {backend}")

    print(f"[+] looking for VID 0x{VID:04x} PID 0x{PID:04x}...")
    dev = usb.core.find(idVendor=VID, idProduct=PID, backend=backend)
    if dev is None:
        print("[!] device not found. Check pyusb backend / libusb installation.")
        return 1
    print(f"[+] device found: {dev}")

    cfg = dev.get_active_configuration()
    print(f"[+] active config: {cfg.bConfigurationValue}, num interfaces: {cfg.bNumInterfaces}")

    # Walk interfaces / endpoints
    for intf in cfg:
        print(f"    intf={intf.bInterfaceNumber} class=0x{intf.bInterfaceClass:02x}")
        for ep in intf:
            print(f"        ep=0x{ep.bEndpointAddress:02x} type={ep.bmAttributes & 3} max={ep.wMaxPacketSize}")

    # Locate the right interface + endpoint
    intf = cfg[(INTERFACE, 0)]
    print(f"[+] target interface: {intf.bInterfaceNumber}")

    # Detach kernel driver if any (Windows WinUSB doesn't always require this)
    try:
        if dev.is_kernel_driver_active(INTERFACE):
            print("[+] detaching kernel driver...")
            dev.detach_kernel_driver(INTERFACE)
    except (NotImplementedError, AttributeError):
        pass
    except Exception as ex:
        print(f"[!] detach failed (probably non-fatal): {ex}")

    try:
        usb.util.claim_interface(dev, INTERFACE)
        print("[+] interface claimed")
    except Exception as ex:
        print(f"[!] claim failed: {ex}")
        return 1

    pcap = Path("scratch/captures/matrix_apply.pcap")
    print(f"[+] extracting frame from {pcap}...")
    frame = extract_frame_from_pcap(pcap, frame_index=0)
    print(f"[+] frame: {len(frame)} bytes, {sum(1 for b in frame if b)} non-zero pixels")
    print(f"    head: {frame[:32].hex()}")

    print("[+] bulk writing frame to endpoint 0x01...")
    try:
        n = dev.write(ENDPOINT_OUT, frame, timeout=2000)
        print(f"[+] wrote {n} bytes")
    except Exception as ex:
        print(f"[!] write failed: {type(ex).__name__}: {ex}")

    time.sleep(2)

    # Try a totally blank frame to see "off" state
    print("\n[+] writing all-zero frame (matrix should go dark)...")
    try:
        n = dev.write(ENDPOINT_OUT, b"\x00" * 768, timeout=2000)
        print(f"[+] wrote {n} bytes")
    except Exception as ex:
        print(f"[!] zero-write failed: {type(ex).__name__}: {ex}")

    time.sleep(2)

    # Try all-on (every pixel bright)
    print("\n[+] writing all-bright frame (matrix should go full ON)...")
    try:
        n = dev.write(ENDPOINT_OUT, b"\xff" * 768, timeout=2000)
        print(f"[+] wrote {n} bytes")
    except Exception as ex:
        print(f"[!] full-write failed: {type(ex).__name__}: {ex}")

    time.sleep(2)

    usb.util.release_interface(dev, INTERFACE)
    usb.util.dispose_resources(dev)
    print("\n[+] done. Vlad — what happened to matrix during the 3 writes?")


if __name__ == "__main__":
    sys.exit(main() or 0)
