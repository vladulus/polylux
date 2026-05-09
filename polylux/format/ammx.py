"""AMMX — ASUS Motherboard Matrix animation file format.

Used by Armoury Crate to store AniMe-Matrix-on-motherboard animations
(seen on ROG Maximus Z690 Extreme; likely identical on other Maximus
boards with the dot-matrix LED panel on the I/O shroud).

Reverse-engineered from sample files in
``View\\<MB-uuid>\\externalFiles\\1.bin .. 4.bin`` on a Z690 Extreme,
2026-05-09. Format verified by round-trip test (file == encode(decode(file))
byte-for-byte).

File layout
-----------

::

    File header (32 bytes):
      00..03  "AMMX" magic                        (b'\\x41\\x4d\\x4d\\x58')
      04..07  version block                       (b'\\x01\\x01\\x04\\x03')
      08      reserved, observed 0x00
      09      device flag, observed 0xe1
      0a..0b  frame_count (u16 big-endian)
      0c      format flag, observed 0x03
      0d..1f  19 bytes of zero padding

    Per-frame block (774 bytes), repeated `frame_count` times:
      00..01  "FS" magic                          (b'\\x46\\x53')
      02..03  frame_index (u16 big-endian, 0..n-1)
      04      reserved, observed 0x00
      05      format flag, observed 0x03 (must match file header byte 0x0c)
      06..0d  --- begin pixel data ---
      ...
      271 bytes total of pixel data: 24 columns × 32 rows = 768 bytes,
      one byte per pixel, 0..255 brightness (linear, AFAICT — not gamma-corrected;
      empirical: observed values in real animations span 0x00..0x70 typically,
      suggesting either soft cap or perceptual scaling. To be confirmed.)

    Total file size: 32 + 774 * frame_count.

Frame layout in pixel buffer is **row-major, top-to-bottom, left-to-right**,
i.e. ``pixel[row][col] = data[row*24 + col]``. Image is 24 wide × 32 tall
(portrait orientation, matches the physical orientation of the dots on
the I/O shroud).

The per-frame `format flag` byte at offset 5 is always 0x03 in observed
files. Hypothesis: this could be a color-depth indicator (0x03 = 8-bit
grayscale). Other values may exist for color-capable boards. Don't speculate —
match observed values when writing.
"""
from __future__ import annotations

import struct
from dataclasses import dataclass, field
from pathlib import Path
from typing import List

# ---- constants ----------------------------------------------------------------

FILE_MAGIC = b"AMMX"
VERSION_BLOCK = b"\x01\x01\x04\x03"
DEFAULT_DEVICE_FLAG = 0xE1
DEFAULT_FORMAT_FLAG = 0x03
FRAME_MAGIC = b"FS"

WIDTH = 24
HEIGHT = 32
PIXELS_PER_FRAME = WIDTH * HEIGHT  # 768
FRAME_HEADER_SIZE = 6
FRAME_SIZE = FRAME_HEADER_SIZE + PIXELS_PER_FRAME  # 774
FILE_HEADER_SIZE = 32

# ---- dataclasses --------------------------------------------------------------


@dataclass
class Frame:
    """A single 24×32 grayscale frame (pixel values 0..255)."""

    pixels: bytes  # exactly PIXELS_PER_FRAME bytes (24*32 = 768)
    index: int = 0
    format_flag: int = DEFAULT_FORMAT_FLAG

    def __post_init__(self) -> None:
        if len(self.pixels) != PIXELS_PER_FRAME:
            raise ValueError(
                f"Frame.pixels must be exactly {PIXELS_PER_FRAME} bytes, "
                f"got {len(self.pixels)}"
            )


@dataclass
class Animation:
    """A full AMMX file: header metadata + a list of frames."""

    frames: List[Frame] = field(default_factory=list)
    device_flag: int = DEFAULT_DEVICE_FLAG
    format_flag: int = DEFAULT_FORMAT_FLAG

    @property
    def frame_count(self) -> int:
        return len(self.frames)


# ---- encoder / decoder --------------------------------------------------------


def decode(data: bytes) -> Animation:
    """Parse a complete AMMX byte string into an Animation.

    Validates magic bytes and arithmetic. Raises ``ValueError`` on malformed input.
    """
    if len(data) < FILE_HEADER_SIZE:
        raise ValueError(f"file too short: {len(data)} bytes")
    if data[:4] != FILE_MAGIC:
        raise ValueError(f"bad file magic: {data[:4]!r} (expected {FILE_MAGIC!r})")
    if data[4:8] != VERSION_BLOCK:
        raise ValueError(
            f"unexpected version block: {data[4:8].hex()} (expected {VERSION_BLOCK.hex()})"
        )

    device_flag = data[9]
    frame_count = struct.unpack(">H", data[10:12])[0]
    format_flag_file = data[12]

    expected_size = FILE_HEADER_SIZE + frame_count * FRAME_SIZE
    if len(data) != expected_size:
        raise ValueError(
            f"size mismatch: have {len(data)}, expected {expected_size} for "
            f"frame_count={frame_count}"
        )

    frames: List[Frame] = []
    for i in range(frame_count):
        off = FILE_HEADER_SIZE + i * FRAME_SIZE
        block = data[off : off + FRAME_SIZE]
        if block[:2] != FRAME_MAGIC:
            raise ValueError(
                f"frame {i} bad magic at offset 0x{off:x}: {block[:2]!r}"
            )
        idx = struct.unpack(">H", block[2:4])[0]
        if idx != i:
            raise ValueError(
                f"frame {i} index field is {idx} (expected {i})"
            )
        # block[4] is reserved (0x00), block[5] is format flag
        frame = Frame(
            pixels=bytes(block[FRAME_HEADER_SIZE:FRAME_SIZE]),
            index=idx,
            format_flag=block[5],
        )
        frames.append(frame)

    return Animation(
        frames=frames,
        device_flag=device_flag,
        format_flag=format_flag_file,
    )


def encode(anim: Animation) -> bytes:
    """Serialize an Animation back to AMMX bytes."""
    if anim.frame_count > 0xFFFF:
        raise ValueError(f"too many frames ({anim.frame_count}); u16 max 65535")

    header = bytearray(FILE_HEADER_SIZE)
    header[0:4] = FILE_MAGIC
    header[4:8] = VERSION_BLOCK
    header[8] = 0x00
    header[9] = anim.device_flag
    header[10:12] = struct.pack(">H", anim.frame_count)
    header[12] = anim.format_flag
    # bytes 13..31 stay zero

    out = bytearray(header)
    for i, frame in enumerate(anim.frames):
        block = bytearray(FRAME_SIZE)
        block[0:2] = FRAME_MAGIC
        block[2:4] = struct.pack(">H", i)
        block[4] = 0x00
        block[5] = frame.format_flag
        block[FRAME_HEADER_SIZE:FRAME_SIZE] = frame.pixels
        out.extend(block)

    return bytes(out)


# ---- conveniences -------------------------------------------------------------


def load_file(path: str | Path) -> Animation:
    return decode(Path(path).read_bytes())


def save_file(path: str | Path, anim: Animation) -> None:
    Path(path).write_bytes(encode(anim))
