"""Progressive fill — light increasingly many bytes of the frame buffer
to derive the byte-to-pixel mapping by direct observation.

Per second, light one more chunk of the buffer (chunk_size bytes). Vlad
watches the matrix fill and describes the pattern: which dot appears
first, in what direction does it grow, where does it wrap.

This reveals:
  - Which range of buffer bytes are "padding" (no visible effect)
  - The scan order (row-major, column-major, staircase, etc.)
  - The total number of pixels visible

Output the fill table to stdout as we go. Vlad can comment in real-time.
"""
import sys
import time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix, FRAME_SIZE


CHUNK = 16              # bytes lit per step
STEP_SECONDS = 1.0      # seconds between steps


def main():
    with AniMeMatrix.open() as m:
        print("[+] matrix opened. Starting from all-OFF.")
        m.clear(); m.flush()
        time.sleep(1.5)

        for end in range(CHUNK, FRAME_SIZE + 1, CHUNK):
            m.clear()
            for i in range(end):
                m.set_byte(i, 0xFF)
            m.flush()
            print(f"  bytes [0..{end-1}] lit  ({end} of {FRAME_SIZE} = {100*end/FRAME_SIZE:.1f}%)")
            time.sleep(STEP_SECONDS)

        print("[+] full buffer lit (768B). Holding 3s, then off.")
        time.sleep(3)
        m.clear(); m.flush()
        print("[+] off")


if __name__ == "__main__":
    sys.exit(main() or 0)
