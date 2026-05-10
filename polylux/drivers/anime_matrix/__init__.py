"""AniMe Matrix driver — high-level API for the motherboard 222-LED display.

Public classes:
  - AniMeMatrix: the device handle (open via .open() or with a shared
    Chip1A21 instance).

Public modules:
  - .render: Frame class + drawing primitives (set_pixel, set_row,
    set_col, fill, draw_text, draw_tiny_text, draw_image)
  - .lut: physical (col, row) <-> buffer byte index mapping
  - .font_3x5: hardcoded 3x5 pixel font for clock-sized text
"""
from .usb_direct import AniMeMatrix, AniMeMatrixError, FRAME_SIZE  # noqa: F401
