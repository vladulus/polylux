r"""Live demo of render primitives — verifies set_pixel, set_row, set_col, fill, draw_text."""
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
        # Step 1: corners — (1,1) red, (7,4) green, (1, 36) blue
        print("step 1: 3 corner pixels (red top-left, green top-right of row 4, blue bottom)")
        f = Frame()
        f.set_pixel(1, 1, (0xFF, 0, 0))
        f.set_pixel(7, 4, (0, 0xFF, 0))
        f.set_pixel(1, 36, (0, 0, 0xFF))
        hold(m, f, 5)

        # Step 2: outline (perimeter LEDs only)
        print("step 2: outline (border LEDs white)")
        f = Frame()
        from polylux.drivers.anime_matrix.lut import COLS_PER_ROW, ROWS
        for row in ROWS:
            cols = COLS_PER_ROW[row]
            f.set_pixel(cols[0], row, (0xFF, 0xFF, 0xFF))
            if len(cols) > 1:
                f.set_pixel(cols[-1], row, (0xFF, 0xFF, 0xFF))
        hold(m, f, 5)

        # Step 3: row sweep — light row 1, row 2, ..., row 36 one at a time, then off
        print("step 3: row sweep top -> bottom")
        for row in ROWS:
            f = Frame()
            f.set_row(row, (0, 0xFF, 0xFF))
            hold(m, f, 0.15)

        # Step 4: col sweep
        print("step 4: col sweep left -> right")
        for col in range(1, 8):
            f = Frame()
            f.set_col(col, (0xFF, 0xFF, 0))
            hold(m, f, 0.5)

        # Step 5: text "P"
        print("step 5: draw_text 'P' (centered)")
        f = Frame()
        f.draw_text("P", color=(0xFF, 0x40, 0x40))
        hold(m, f, 5)

        # Step 6: text "12:34"
        print("step 6: draw_text '12:34'")
        f = Frame()
        f.draw_text("12:34", color=(0xFF, 0xFF, 0xFF))
        hold(m, f, 5)

        # clear
        m.clear()
        m.flush()
    print("done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
