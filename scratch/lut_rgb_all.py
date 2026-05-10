r"""RGB test on ALL active LEDs at once — cycles through 8 colors.

Sets every R-byte, G-byte, B-byte to the color's R, G, B value. Padding
bytes also get set but the firmware ignores them.
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix


N_BLOCKS = 16
PLANE_BYTES = 16
BLOCK_BYTES = 48

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


def paint_color(m: AniMeMatrix, r: int, g: int, b: int) -> None:
    """Set all R-bytes to `r`, G-bytes to `g`, B-bytes to `b` for every block."""
    m.clear()
    for block in range(N_BLOCKS):
        base = block * BLOCK_BYTES
        for slot in range(PLANE_BYTES):
            m.set_byte(base + slot, r)
            m.set_byte(base + PLANE_BYTES + slot, g)
            m.set_byte(base + 2 * PLANE_BYTES + slot, b)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--per-color", type=float, default=3.0)
    args = parser.parse_args()

    print(f"Cycling matrix through {len(COLORS)} colors @ {args.per_color}s each = "
          f"{len(COLORS) * args.per_color}s total")

    with AniMeMatrix.open() as m:
        for name, r, g, b in COLORS:
            print(f"  -> {name}  (R={r:#04x}, G={g:#04x}, B={b:#04x})")
            paint_color(m, r, g, b)
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
