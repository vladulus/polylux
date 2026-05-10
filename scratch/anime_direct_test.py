"""First direct-to-USB test for the AniMe Matrix on Vlad's
ROG Maximus Z690 Extreme (VID 0x0B05, PID 0x1A21).

Adapts the documented laptop protocol (asusctl / Starlight / dixyes gist)
which uses VID 0x0B05 PID 0x193b. We assume — and will verify — that the
motherboard chip speaks the same protocol family.

Test:
  1. Enumerate matching devices, list interfaces.
  2. Open each interface, send identity init packet, see what's accepted.
  3. Send brightness + display-on commands.
  4. Send one all-pixels-bright frame.
  5. If matrix changes — Polylux just took control of the chip directly.

If the device is held exclusively by ArmouryCrate.Service.exe / LightingService
/ Aac3572MbHal_x86, the open will fail. In that case Vlad needs to kill
those processes first (we have authorization).
"""
from __future__ import annotations

import struct
import sys
import time
import hid


VID = 0x0B05
PID = 0x1A21

REPORT_ID = 0x5E
PACKET_LEN = 640
PANE_LEN = 0x278  # bytes per pane payload


def _pad(data: bytes) -> bytes:
    """Pad to PACKET_LEN. The first byte must already be REPORT_ID."""
    if len(data) > PACKET_LEN:
        raise ValueError(f"packet too big: {len(data)} > {PACKET_LEN}")
    return data + b"\x00" * (PACKET_LEN - len(data))


def packet_identity() -> bytes:
    return _pad(bytes([REPORT_ID]) + b"ASUS Tech.Inc." + b"\x00")


def packet_init() -> bytes:
    return _pad(bytes([REPORT_ID, 0xC2]))


def packet_display_on(enable: bool = True) -> bytes:
    return _pad(bytes([REPORT_ID, 0xC3, 0x01, 0x00 if enable else 0x80]))


def packet_brightness(level: int) -> bytes:
    """Level: 0..3 (off, low, mid, high)."""
    return _pad(bytes([REPORT_ID, 0xC0, 0x04, level & 0x03]))


def packet_commit_settings() -> bytes:
    """Persist brightness + display-on to flash."""
    return _pad(bytes([REPORT_ID, 0xC4, 0x01, 0x80]))


def packet_pane(pane_index: int, pixels: bytes) -> bytes:
    """One frame pane.

    Header: [REPORT_ID, 0xC0, 0x02, <offset:u16 LE>, <len:u16 LE>, <pixels...>]
    pane_index 0 -> offset 0x0001
    pane_index 1 -> offset 0x0001 + PANE_LEN
    pane_index 2 -> offset 0x0001 + 2*PANE_LEN  (laptops with 3 panes only)
    """
    if len(pixels) > PANE_LEN:
        raise ValueError(f"pane too big: {len(pixels)} > {PANE_LEN}")
    offset = 0x0001 + pane_index * PANE_LEN
    return _pad(
        bytes([REPORT_ID, 0xC0, 0x02])
        + struct.pack("<HH", offset, len(pixels))
        + pixels
    )


def packet_flush() -> bytes:
    return _pad(bytes([REPORT_ID, 0xC0, 0x03]))


def main():
    print(f"[+] enumerating HID devices for VID 0x{VID:04x} PID 0x{PID:04x}")
    devices = list(hid.enumerate(VID, PID))
    if not devices:
        print("[!] no matching devices")
        return 1
    for d in devices:
        print(f"    iface={d['interface_number']} usage_page=0x{d['usage_page']:04x} usage=0x{d['usage']:04x}")
        print(f"    path={d['path']}")
        print(f"    product={d['product_string']!r} mfr={d['manufacturer_string']!r}")
        print()

    # Try each interface in order
    for d in devices:
        path = d["path"]
        iface = d["interface_number"]
        print(f"--- trying iface {iface}: {path[:80]} ---")
        try:
            h = hid.device()
            h.open_path(path)
        except OSError as ex:
            print(f"    [!] open failed: {ex}")
            continue

        try:
            print("    sending identity packet...")
            h.send_feature_report(packet_identity())
            print("    sending init (0xC2)...")
            h.send_feature_report(packet_init())
            print("    enabling display...")
            h.send_feature_report(packet_display_on(True))
            print("    setting brightness HIGH...")
            h.send_feature_report(packet_brightness(3))
            print("    committing settings...")
            h.send_feature_report(packet_commit_settings())

            print("    writing all-bright pane 0...")
            full_bright = b"\xff" * PANE_LEN
            h.send_feature_report(packet_pane(0, full_bright))
            print("    writing all-bright pane 1...")
            h.send_feature_report(packet_pane(1, full_bright))

            print("    flushing frame...")
            h.send_feature_report(packet_flush())

            print(f"    [+] iface {iface}: ALL PACKETS ACCEPTED — check matrix")
            print("    Vlad: did matrix change? (full bright = all dots ON, or some pattern)")
            time.sleep(2)
        except Exception as ex:
            print(f"    [!] write failed at some step: {type(ex).__name__}: {ex}")
        finally:
            try: h.close()
            except: pass
        print()


if __name__ == "__main__":
    sys.exit(main() or 0)
