r"""Light a single R-byte for a fixed duration. Usage: --byte N --duration S"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--byte", type=int, required=True)
    parser.add_argument("--duration", type=float, default=10.0)
    args = parser.parse_args()

    print(f"Lighting byte {args.byte} for {args.duration}s")
    with AniMeMatrix.open() as m:
        m.clear()
        m.set_byte(args.byte, 0xFF)
        deadline = time.monotonic() + args.duration
        while time.monotonic() < deadline:
            m.flush()
            time.sleep(0.25)
        m.clear()
        m.flush()
    print("done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
