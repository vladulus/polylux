r"""Test clock text in all 4 rotations.

Each rotation held 6s. Spune-mi care arată corect.
"""
from __future__ import annotations

import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix
from polylux.drivers.anime_matrix.render import Frame


def hold(m: AniMeMatrix, frame: Frame, seconds: float) -> None:
    deadline = time.monotonic() + seconds
    buf = frame.to_bytes()
    while time.monotonic() < deadline:
        m.send_frame(buf)
        time.sleep(0.2)


def main() -> int:
    with AniMeMatrix.open() as m:
        for rotation in (0, 90, 180, 270):
            print(f"rotation = {rotation}° (head-tilt to read)")
            f = Frame()
            f.draw_text("12:34", color=(0xFF, 0xFF, 0xFF), rotation=rotation)
            hold(m, f, 6)
        m.clear()
        m.flush()
    print("done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
