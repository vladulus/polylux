"""AniMe Matrix high-level driver — depends on Chip1A21 for USB transport.

Talks to the 222-LED matrix on the ROG Maximus Z690 Extreme motherboard.
The matrix lives on the same chip (VID 0x0B05 PID 0x1A21) as the
LiveDash OLED — both displays share USB interfaces via the `Chip1A21`
low-level driver in `polylux.drivers.chip_1a21`.

Frame protocol (verified byte-for-byte against AC traffic):
  1. HID Output Report ec c1 00 ... — frame companion
  2. HID Output Report ec 7f 04 00 03 ... — frame begin
  3. Bulk OUT 768 bytes — pixel data (1 byte per LED per channel,
     R/G/B planes, 16 blocks of 48 bytes; see lut.py for the map)

Usage::

    from polylux.drivers.anime_matrix import AniMeMatrix
    from polylux.drivers.anime_matrix.render import Frame

    with AniMeMatrix.open() as m:
        f = Frame()
        f.draw_tiny_text("12:34", rotation=270)
        m.send_frame(f.to_bytes())

When sharing the chip with LiveDashOLED, open the chip explicitly:

    from polylux.drivers.chip_1a21 import Chip1A21
    from polylux.drivers.livedash_oled import LiveDashOLED

    with Chip1A21.open() as chip:
        matrix = AniMeMatrix(chip)
        oled = LiveDashOLED(chip)
        matrix.send_frame(...)
        oled.set_text(...)
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from polylux.drivers.chip_1a21 import Chip1A21, Chip1A21Error


FRAME_SIZE = 768


# Per-frame HID prep packets (sent before every bulk pixel transfer).
_HID_PREP_C1 = bytes([0xEC, 0xC1, 0x00]) + b"\x00" * 62
_HID_PREP_7F = bytes([0xEC, 0x7F, 0x04, 0x00, 0x03]) + b"\x00" * 60


class AniMeMatrixError(Chip1A21Error):
    """Backwards-compat alias for the chip error."""


@dataclass
class AniMeMatrix:
    """High-level driver for the matrix display.

    Args:
      chip: an open `Chip1A21`. Use `AniMeMatrix.open()` to create one
            on the fly for the simple single-display case.
    """
    chip: Chip1A21
    _frame: bytearray = field(default_factory=lambda: bytearray(FRAME_SIZE))
    _owns_chip: bool = False    # True if we opened the chip ourselves

    @classmethod
    def open(cls) -> "AniMeMatrix":
        """Open a private Chip1A21 and return a matrix bound to it.

        Use this for code that only touches the matrix. For code that
        also drives the LiveDash OLED on the same chip, open the chip
        yourself and pass it to both wrappers.
        """
        chip = Chip1A21.open()
        instance = cls(chip=chip, _owns_chip=True)
        chip._refcount += 1
        return instance

    def close(self) -> None:
        """Release the chip if we own it. Safe to call multiple times."""
        if self._owns_chip and self.chip is not None:
            self.chip._refcount -= 1
            if self.chip._refcount <= 0:
                self.chip.close()
            self._owns_chip = False

    def __enter__(self) -> "AniMeMatrix":
        return self

    def __exit__(self, *_):
        self.close()

    # --- frame buffer helpers ---

    def clear(self) -> None:
        """Set the working frame buffer to all-off."""
        for i in range(FRAME_SIZE):
            self._frame[i] = 0

    def fill(self, value: int = 0xFF) -> None:
        """Set every byte of the working frame to `value`."""
        if not 0 <= value <= 0xFF:
            raise ValueError(f"value must be 0..255, got {value}")
        for i in range(FRAME_SIZE):
            self._frame[i] = value

    def set_byte(self, index: int, value: int = 0xFF) -> None:
        """Set one byte in the working frame buffer (raw offset 0..767)."""
        if not 0 <= index < FRAME_SIZE:
            raise IndexError(f"frame index out of range: {index}")
        if not 0 <= value <= 0xFF:
            raise ValueError(f"value must be 0..255, got {value}")
        self._frame[index] = value

    def get_byte(self, index: int) -> int:
        if not 0 <= index < FRAME_SIZE:
            raise IndexError(f"frame index out of range: {index}")
        return self._frame[index]

    @property
    def frame(self) -> bytes:
        return bytes(self._frame)

    # --- wire transfer ---

    def flush(self) -> None:
        """Push the current working frame buffer to the device."""
        self.send_frame(self._frame)

    def send_frame(self, buf: bytes) -> None:
        """Push an arbitrary 768-byte frame buffer to the matrix.

        Lazily runs the chip's matrix-enable init the first time (sends
        the ec 42 01 magic command, etc.). After that, just the per-frame
        sequence from matrix_p1.pcap:
          1. HID ec c1 00 — frame companion
          2. HID ec 7f 04 00 03 — frame begin
          3. Bulk OUT 768B — pixel data
        """
        if len(buf) != FRAME_SIZE:
            raise ValueError(f"frame must be {FRAME_SIZE}B, got {len(buf)}")
        # First-frame init. Idempotent — only sends ec 42 01 once per chip
        # instance. Also: side-effect of suppressing OLED text writes
        # until chip power-cycle (see Chip1A21.init_for_matrix() docstring).
        self.chip.init_for_matrix()
        self.chip.hid_write(_HID_PREP_C1)
        self.chip.hid_write(_HID_PREP_7F)
        n = self.chip.bulk_write(bytes(buf))
        if n != FRAME_SIZE:
            raise AniMeMatrixError(f"bulk write incomplete: {n}/{FRAME_SIZE}")
