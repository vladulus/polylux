r"""Smoke test: replay an OLED text packet captured from AC.

Sends the exact bytes AC sent for displaying "CPU Temp." / "32.0 ℃" on the
motherboard OLED. If the OLED lights up showing that text, we own it.

The OLED shares the chip with the AniMe Matrix (PID 1A21), so we use the
existing matrix USB driver — just write a different HID prep packet.
"""
from __future__ import annotations

import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix


def build_oled_text_packet(label: str, value: str) -> bytes:
    """Build a 65-byte HID OUT packet to display label + value on OLED.

    Layout (verified from USBPcap of AC OLED hardware monitor mode):
      pos 0     = 0xEC          magic
      pos 1     = 0x53          'S' — set OLED text command
      pos 2     = 0x00          reserved/param
      pos 3-20  = label (ASCII, up to 18 bytes, null-padded)
      pos 21-64 = value (UTF-8, up to 44 bytes, null-padded)
    """
    pkt = bytearray(65)
    pkt[0] = 0xEC
    pkt[1] = 0x53
    pkt[2] = 0x00
    label_bytes = label.encode("utf-8")[:18]
    pkt[3:3 + len(label_bytes)] = label_bytes
    value_bytes = value.encode("utf-8")[:44]
    pkt[21:21 + len(value_bytes)] = value_bytes
    return bytes(pkt)


def main() -> int:
    samples = [
        ("POLYLUX",      "SHIPS"),
        ("Polylux",      "12:34"),
        ("MATRIX",       "PWNED"),
        ("OLED",         "POLYLUX"),
    ]

    print("Each packet held 10s, re-flushed at 2 Hz to fight AC overwrites.")
    print()
    with AniMeMatrix.open() as m:
        for label, value in samples:
            pkt = build_oled_text_packet(label, value)
            safe_label = label.encode("ascii", "replace").decode("ascii")
            safe_value = value.encode("ascii", "replace").decode("ascii")
            print(f"--- writing: label='{safe_label}'  value='{safe_value}' "
                  f"(10s hold) ---")
            print(f"    hex: {' '.join(f'{b:02x}' for b in pkt[:32])}...")
            deadline = time.monotonic() + 10.0
            n_writes = 0
            while time.monotonic() < deadline:
                n = m._hid_dev.write(pkt)
                if n < 0:
                    print(f"    HID write FAILED: {m._hid_dev.error()}")
                    break
                n_writes += 1
                time.sleep(0.5)
            print(f"    -> {n_writes} writes of {n} bytes each")
    print("done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
