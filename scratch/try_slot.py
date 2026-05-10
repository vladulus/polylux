r"""Send a single `ec 51 NN` slot-select command and exit.

Usage: python scratch/try_slot.py NN
  where NN is hex like 06, 07, 14, etc.

Optionally: --upload to pre-load polylux_oled_test.gif before switching.
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from polylux.drivers.chip_1a21 import Chip1A21
from polylux.drivers.livedash_oled import LiveDashOLED


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("nn", help="slot index in hex, e.g. 06")
    parser.add_argument("--upload", action="store_true",
                        help="pre-upload polylux_oled_test.gif + ec 73 ff before switch")
    parser.add_argument("--gif",
                        default=r"C:\Users\vlad\Desktop\polylux_oled_test.gif")
    args = parser.parse_args()

    try:
        nn = int(args.nn, 16)
    except ValueError:
        print(f"NN must be hex (00..ff), got {args.nn}", file=sys.stderr)
        return 2

    with Chip1A21.open() as chip:
        if args.upload:
            gif = Path(args.gif).read_bytes()
            print(f"upload {len(gif)}B from {args.gif}")
            oled = LiveDashOLED(chip)
            oled.upload_image(gif)
            time.sleep(0.2)
            chip.hid_write(bytes([0xEC, 0x73, 0xFF]) + b"\x00" * 62)
            print("commit ec 73 ff sent")
            time.sleep(0.3)
        cmd = bytes([0xEC, 0x51, nn]) + b"\x00" * 62
        chip.hid_write(cmd)
        print(f"sent: ec 51 {nn:02x} (slot {nn})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
