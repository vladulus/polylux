r"""Test RGB plane mapping on a single LED.

Hypothesis: for LED at R-byte = N, the G-byte = N + 16 and B-byte = N + 32
(within the same 48-byte block). Confirms the planar storage assumption.

Cycles a single LED through 8 colors, ~3 seconds each.
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix


# (name, r, g, b) per byte values 0..255
COLORS = [
    ("RED",     0xFF, 0x00, 0x00),
    ("ORANGE",  0xFF, 0x7F, 0x00),
    ("YELLOW",  0xFF, 0xFF, 0x00),
    ("GREEN",   0x00, 0xFF, 0x00),
    ("CYAN",    0x00, 0xFF, 0xFF),
    ("BLUE",    0x00, 0x00, 0xFF),
    ("VIOLET",  0xFF, 0x00, 0xFF),
    ("WHITE",   0xFF, 0xFF, 0xFF),
]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--r-byte", type=int, default=0,
                        help="R-channel byte offset of the LED to test (default 0 = (1, 1))")
    parser.add_argument("--per-color", type=float, default=3.0,
                        help="seconds to hold each color (default 3)")
    args = parser.parse_args()

    r_byte = args.r_byte
    g_byte = r_byte + 16
    b_byte = r_byte + 32

    print(f"R-byte = {r_byte}, G-byte = {g_byte}, B-byte = {b_byte}")
    print(f"Cycling through {len(COLORS)} colors @ {args.per_color}s each "
          f"= {len(COLORS) * args.per_color}s total")

    with AniMeMatrix.open() as m:
        for name, r, g, b in COLORS:
            print(f"  -> {name}  (R={r:#04x}, G={g:#04x}, B={b:#04x})")
            m.clear()
            m.set_byte(r_byte, r)
            m.set_byte(g_byte, g)
            m.set_byte(b_byte, b)
            deadline = time.monotonic() + args.per_color
            while time.monotonic() < deadline:
                m.flush()
                time.sleep(0.25)
        m.clear()
        m.flush()
    print("done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
