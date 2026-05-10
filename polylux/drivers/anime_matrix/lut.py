"""AniMe Matrix coordinate lookup table — verified empirically with Vlad 2026-05-10.

Maps physical (col, row) positions on the ROG Maximus Z690 Extreme's
AniMe Matrix to byte offsets in the 768-byte frame buffer.

# Topology

  Top staircase:    rows 1..3  with 2, 4, 6 LEDs (left-anchored, cols 1..N)
  Middle:           rows 4..29 with 7 LEDs each (full width, 26 rows)
  Bottom staircase: rows 30..36 narrowing 7, 6, 5, 4, 3, 2, 1 (left-anchored)

  Total: 12 + 182 + 28 = 222 active LEDs

Per-column LED count (verified manually):
  col 1 = 36, col 2 = 35, col 3 = 33, col 4 = 32,
  col 5 = 30, col 6 = 29, col 7 = 27.  Sum = 222.

# Storage layout (768 bytes)

The frame buffer is partitioned into 16 blocks of 48 bytes. Each block has
three 16-byte planes:

  block N: bytes N*48..N*48+15 = R-plane
           bytes N*48+16..N*48+31 = G-plane
           bytes N*48+32..N*48+47 = B-plane

For an LED at R-byte offset n: G-byte = n+16, B-byte = n+32 (within same block).

## Block contents (raster row-major, with paddings)

  Block 0: 15 active + 1 padding (slot 15)
    - rows 1, 2, 3 (top staircase, 12 LEDs)
    - row 4 cols 1..3 (first 3 of middle, 3 LEDs)

  Blocks 1..14: 14 active + 2 padding (slots 14, 15) each
    - Cover middle rows 4 cols 4..7 onwards through row 32 cols 1..4
      in raster row-major order, 14 LEDs per block.

  Block 15: 11 active + 5 padding. Special layout — each row segment
    is aligned to 2 slots (1 byte of padding after odd-LED row segments).
    Active slots: 0, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12.
    Padding slots: 1, 9, 13, 14, 15.

      slot  0 = (5, 32)   — row 32's last LED (row 32 has cols 1..5)
      slot  1 = PAD
      slot  2 = (1, 33)
      slot  3 = (2, 33)
      slot  4 = (3, 33)
      slot  5 = (4, 33)
      slot  6 = (1, 34)
      slot  7 = (2, 34)
      slot  8 = (3, 34)
      slot  9 = PAD
      slot 10 = (1, 35)
      slot 11 = (2, 35)
      slot 12 = (1, 36)
      slot 13..15 = PAD

# Verified pin points (col, row at R-byte)

  byte 0   = (1, 1)        byte 676 = (1, 31)
  byte 720 = (5, 32)       byte 722 = (1, 33)
  byte 725 = (4, 33)       byte 726 = (1, 34)
  byte 727 = (2, 34)       byte 728 = (3, 34)
  byte 729 = PAD           byte 730 = (1, 35)
  byte 732 = (1, 36)       byte 734 = PAD

# Known dead pixels

  Vlad's specific board has ~4 LEDs with a dead B channel (visible as
  yellow when commanded white). These are not encoded here — render
  primitives should treat them as visual glitches, not LUT errors.
"""
from __future__ import annotations


N_BLOCKS = 16
PLANE_BYTES = 16             # bytes per plane within a block
BLOCK_BYTES = 48             # R + G + B planes per block
TOTAL_BYTES = N_BLOCKS * BLOCK_BYTES   # 768

# Block 15 active-slot mapping. Index = LED-raster position within block 15
# (0..10), value = slot offset within block 15 R-plane.
_BLOCK15_ACTIVE_SLOTS = [0, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12]


def _raster_leds() -> list[tuple[int, int]]:
    """Return list of (col, row) in raster row-major storage order."""
    leds: list[tuple[int, int]] = []
    # Top staircase (left-anchored)
    leds += [(c, 1) for c in range(1, 3)]
    leds += [(c, 2) for c in range(1, 5)]
    leds += [(c, 3) for c in range(1, 7)]
    # Middle: 26 rows full width (rows 4..29)
    for r in range(4, 30):
        leds += [(c, r) for c in range(1, 8)]
    # Bottom: 7 rows narrowing left-anchored (rows 30..36)
    for offset, count in enumerate([7, 6, 5, 4, 3, 2, 1]):
        leds += [(c, 30 + offset) for c in range(1, count + 1)]
    return leds


def _led_idx_to_r_byte(led_idx: int) -> int | None:
    """Given raster LED index 0..221, return R-channel byte offset, else None."""
    if led_idx < 0:
        return None
    if led_idx < 15:                                          # block 0
        return led_idx
    if led_idx < 15 + 14 * 14:                                # blocks 1..14
        offset = led_idx - 15
        block = 1 + offset // 14
        slot = offset % 14
        return block * BLOCK_BYTES + slot
    block15_idx = led_idx - (15 + 14 * 14)
    if block15_idx < len(_BLOCK15_ACTIVE_SLOTS):              # block 15
        return 15 * BLOCK_BYTES + _BLOCK15_ACTIVE_SLOTS[block15_idx]
    return None


def _build_tables() -> tuple[
    dict[tuple[int, int], int],
    list[tuple[int, int] | None],
]:
    """Return (coord_to_r_byte, byte_to_coord)."""
    raster = _raster_leds()
    c2b: dict[tuple[int, int], int] = {}
    b2c: list[tuple[int, int] | None] = [None] * TOTAL_BYTES
    for idx, (col, row) in enumerate(raster):
        r = _led_idx_to_r_byte(idx)
        if r is None:
            continue
        c2b[(col, row)] = r
        b2c[r] = (col, row)
    return c2b, b2c


COORD_TO_R_BYTE, R_BYTE_TO_COORD = _build_tables()


# --- Public derived constants ---

N_LEDS = len(COORD_TO_R_BYTE)

ALL_COORDS: list[tuple[int, int]] = sorted(COORD_TO_R_BYTE, key=lambda p: (p[1], p[0]))

ROWS: list[int] = sorted({r for _c, r in COORD_TO_R_BYTE})
COLS_PER_ROW: dict[int, list[int]] = {r: [] for r in ROWS}
for (c, r) in ALL_COORDS:
    COLS_PER_ROW[r].append(c)

MAX_COL = max(c for c, _ in COORD_TO_R_BYTE)
MAX_ROW = max(r for _, r in COORD_TO_R_BYTE)


# --- Public API ---

def r_byte(col: int, row: int) -> int:
    """Return the R-channel byte offset for the LED at (col, row).

    Raises KeyError if no LED exists at that position.
    """
    return COORD_TO_R_BYTE[(col, row)]


def g_byte(col: int, row: int) -> int:
    """Return the G-channel byte offset (= R-byte + 16)."""
    return r_byte(col, row) + PLANE_BYTES


def b_byte(col: int, row: int) -> int:
    """Return the B-channel byte offset (= R-byte + 32)."""
    return r_byte(col, row) + 2 * PLANE_BYTES


def rgb_bytes(col: int, row: int) -> tuple[int, int, int]:
    """Return (r_byte, g_byte, b_byte) for the LED at (col, row)."""
    r = r_byte(col, row)
    return r, r + PLANE_BYTES, r + 2 * PLANE_BYTES


def has_led(col: int, row: int) -> bool:
    """Return True if a physical LED exists at (col, row)."""
    return (col, row) in COORD_TO_R_BYTE


def coord_at_r_byte(r_byte_idx: int) -> tuple[int, int] | None:
    """Return (col, row) for an R-byte offset, or None if padding/invalid."""
    if not 0 <= r_byte_idx < TOTAL_BYTES:
        return None
    return R_BYTE_TO_COORD[r_byte_idx]
