r"""Light all LEDs in a given column, in red. Hold until Ctrl+C.

Uses a PRESUMPTIVE LUT derived from Vlad's stated topology:

  Row  1:  2 LEDs   (cols 1-2)
  Row  2:  4 LEDs   (cols 1-4)
  Row  3:  6 LEDs   (cols 1-6)
  Rows 4..3+M: 7 LEDs each (cols 1-7), where M = middle-row count
  Row  3+M+1: 6 LEDs (cols 1-6)
  Row  3+M+2: 4 LEDs (cols 1-4)
  Row  3+M+3: 2 LEDs (cols 1-2)

  Total = 24 + 7*M.

The storage is assumed row-major raster: each LED's R-channel byte is
its raster index, with the buffer divided into 16 blocks of 16 R-bytes
each. Block 0 holds the first 15 LEDs (raster indices 0..14, slot 15 =
padding); blocks 1..14 hold 14 LEDs each (slots 14, 15 = padding);
block 15 holds the last 12 LEDs (slots 12..15 = padding).

If lighting col 1 produces a clean vertical line, the topology and the
row-major assumption are both correct. If the pattern is scattered, the
storage order is different and we'll need to refine.
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix, FRAME_SIZE


# Block layout, derived from Vlad's per-column LED counts (col 1..7 = 36, 35,
# 33, 32, 30, 29, 27, total = 222). Block 15 holds 11 active LEDs (not 12).
BLOCK_SIZES = [15] + [14] * 14 + [11]
PLANE_BYTES = 16
BLOCK_BYTES = 48


def physical_leds(middle_rows: int = 27) -> list[tuple[int, int]]:
    """Return list of (col, row) in raster order matching the storage walk.

    Topology (verified by Vlad's per-column counts 2026-05-10):
      Top staircase: rows 1..3 with 2, 4, 6 LEDs (left-anchored)
      Middle:        rows 4..30 with 7 LEDs each (27 rows)
      Bottom stair:  rows 31..36 with 6, 5, 4, 3, 2, 1 LEDs (left-anchored,
                     narrowing right-to-left)
    Total = 12 + 189 + 21 = 222 LEDs.
    """
    leds: list[tuple[int, int]] = []
    # Top staircase: 2, 4, 6 left-anchored
    leds += [(c, 1) for c in range(1, 3)]
    leds += [(c, 2) for c in range(1, 5)]
    leds += [(c, 3) for c in range(1, 7)]
    # Middle: M rows of 7
    for r in range(4, 4 + middle_rows):
        leds += [(c, r) for c in range(1, 8)]
    # Bottom: 6 rows, left-anchored, narrowing 6,5,4,3,2,1
    bottom_start = 4 + middle_rows
    for offset, count in enumerate([6, 5, 4, 3, 2, 1]):
        leds += [(c, bottom_start + offset) for c in range(1, count + 1)]
    return leds


def led_to_r_byte(led_idx: int) -> int | None:
    """Map a 0-based LED raster index to its R-channel byte offset.

    Returns None if the LED index is out of range for the block layout.
    """
    block_start = 0
    for b, count in enumerate(BLOCK_SIZES):
        if led_idx < block_start + count:
            slot = led_idx - block_start
            return b * BLOCK_BYTES + slot
        block_start += count
    return None


def build_col_to_bytes(middle_rows: int) -> dict[int, list[int]]:
    """For each col 1..7, return the list of R-channel byte offsets to light it."""
    leds = physical_leds(middle_rows)
    out: dict[int, list[int]] = {}
    for idx, (col, row) in enumerate(leds):
        r_byte = led_to_r_byte(idx)
        if r_byte is None:
            continue
        out.setdefault(col, []).append(r_byte)
    return out


def light_col(m: AniMeMatrix, r_bytes: list[int], duration: float) -> None:
    """Light all R-bytes for `duration` seconds, refreshing 4 Hz."""
    m.clear()
    for b in r_bytes:
        if 0 <= b < FRAME_SIZE:
            m.set_byte(b, 0xFF)
    deadline = time.monotonic() + duration
    while time.monotonic() < deadline:
        m.flush()
        time.sleep(0.25)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--col", type=int, default=None,
                        help="single column 1..7 (omit to sweep all 7)")
    parser.add_argument("--middle-rows", type=int, default=27,
                        help="number of middle rows (cols=7 each); default 27")
    parser.add_argument("--duration", type=float, default=8.0,
                        help="seconds to hold each column (default 8)")
    args = parser.parse_args()

    col_to_bytes = build_col_to_bytes(args.middle_rows)
    leds_total = sum(BLOCK_SIZES)
    leds_topology = sum(len(v) for v in col_to_bytes.values())
    print(f"topology: {leds_topology} LEDs across cols 1..7 (middle_rows={args.middle_rows})")
    print(f"block layout: {leds_total} LEDs across {len(BLOCK_SIZES)} blocks")
    if leds_topology > leds_total:
        print(f"WARNING: topology has {leds_topology} LEDs but storage only holds "
              f"{leds_total}; tail LEDs will be unmapped")

    cols_to_test = [args.col] if args.col else list(range(1, 8))
    if args.col is not None and not 1 <= args.col <= 7:
        print("col must be in 1..7", file=sys.stderr)
        return 2

    with AniMeMatrix.open() as m:
        for col in cols_to_test:
            r_bytes = col_to_bytes.get(col, [])
            print(f"\n=== col {col}: {len(r_bytes)} LEDs ===")
            print(f"  R-bytes = {r_bytes}")
            light_col(m, r_bytes, args.duration)
        m.clear()
        m.flush()
    print("\ndone.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
