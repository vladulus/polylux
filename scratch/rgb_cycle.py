"""Live RGB cycle demo for Polylux.

Cycles the matrix through RED -> GREEN -> BLUE -> WHITE -> OFF every
~2 seconds. Plane offsets per §8d empirical mapping:

  R plane: bytes   0..255   (off = no R = cyan/turquoise when others on)
  G plane: bytes 256..511   (off = no G = magenta)
  B plane: bytes 512..767   (off = no B = yellow)

This is approximate — plane sizes might be ~210-220 each with padding.
For pure-color demonstration the slop doesn't matter; padding bytes have
no LED behind them.

Run: python scratch/rgb_cycle.py
Stop: Ctrl-C
"""
from __future__ import annotations

import sys
import time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix, FRAME_SIZE


# Plane offsets (256 bytes each, total 768)
PLANES = {
    "R": (0,   256),
    "G": (256, 512),
    "B": (512, 768),
}


def make_frame(r: int = 0, g: int = 0, b: int = 0) -> bytes:
    """Build a 768B frame from per-plane intensities (0..255)."""
    buf = bytearray(FRAME_SIZE)
    for i in range(*PLANES["R"]): buf[i] = r
    for i in range(*PLANES["G"]): buf[i] = g
    for i in range(*PLANES["B"]): buf[i] = b
    return bytes(buf)


def main():
    sequence = [
        ("RED",     make_frame(r=0xFF)),
        ("GREEN",   make_frame(g=0xFF)),
        ("BLUE",    make_frame(b=0xFF)),
        ("WHITE",   make_frame(r=0xFF, g=0xFF, b=0xFF)),
        ("YELLOW",  make_frame(r=0xFF, g=0xFF)),
        ("MAGENTA", make_frame(r=0xFF, b=0xFF)),
        ("CYAN",    make_frame(g=0xFF, b=0xFF)),
        ("OFF",     make_frame()),
    ]
    print("[+] RGB cycle starting. Ctrl-C to stop.")
    with AniMeMatrix.open() as m:
        try:
            while True:
                for label, frame in sequence:
                    m.send_frame(frame)
                    print(f"  {label}")
                    time.sleep(2)
        except KeyboardInterrupt:
            print("\n[+] stopped, leaving matrix on white")
            m.send_frame(make_frame(r=0xFF, g=0xFF, b=0xFF))


if __name__ == "__main__":
    main()
