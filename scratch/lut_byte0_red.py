r"""Light byte 0 (= R-plane slot 0 of block 0) at full red, hold until Ctrl+C.

The framebuffer layout is planar:
  bytes 0..15   = R-plane of block 0
  bytes 16..31  = G-plane of block 0
  bytes 32..47  = B-plane of block 0

For "byte 0 only red", we set byte[0] = 0xFF and leave everything else 0.
The single LED that should light up is the one at R-slot 0 of block 0 —
this tells us which physical (col, row) position byte 0 maps to.
"""
from __future__ import annotations

import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix


def main() -> int:
    print("Lighting byte 0 = 0xFF (red, R-plane slot 0 of block 0).")
    print("Hold Ctrl+C to stop.")
    with AniMeMatrix.open() as m:
        m.clear()
        m.set_byte(0, 0xFF)
        try:
            while True:
                m.flush()
                time.sleep(0.25)
        except KeyboardInterrupt:
            pass
        m.clear()
        m.flush()
    print("done — matrix cleared.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
