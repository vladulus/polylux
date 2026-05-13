"""Render primitives for the AniMe Matrix.

Provides a Frame class — a working 768-byte buffer + (col, row, rgb) API —
and high-level operations like draw_text and draw_image that compose
content on top of the LED grid.

Usage::

    from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix
    from polylux.drivers.anime_matrix.render import Frame

    f = Frame()
    f.set_pixel(1, 1, (0xFF, 0, 0))            # top-left red
    f.fill((0, 0xFF, 0))                       # whole matrix green
    f.draw_text("12:34", font, color=(0xFF, 0xFF, 0xFF))

    with AniMeMatrix.open() as m:
        m.send_frame(f.to_bytes())
"""
from __future__ import annotations

import os as _os
from typing import Iterable, Optional, Sequence, Tuple

from . import lut
from . import font_3x5


_FONT_CANDIDATES = (
    # path, size — first match wins. AC-style scoreboard look: Arial uppercase.
    ("C:/Windows/Fonts/arialbd.ttf",  9),  # Arial Bold
    ("C:/Windows/Fonts/arial.ttf",    9),  # Arial Regular
    ("C:/Windows/Fonts/consolab.ttf", 9),  # Consolas Bold fallback
    ("C:/Windows/Fonts/consola.ttf",  9),
    ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 9),
)

_font_cache: dict = {}


def clear_font_cache() -> None:
    """Force re-pick the matrix font on next render (used after edits)."""
    global _font_cache
    _font_cache = {}


def _matrix_font(size: int = 9):
    """Return a PIL font picked for the AniMe Matrix's 7-LED short axis.

    Tries Arial Bold, Consolas Bold, Courier on Windows; DejaVu on Linux.
    Falls back to Pillow's built-in default at the requested pixel size.
    Cached per-size so repeated frame renders don't re-load.
    """
    cached = _font_cache.get(size)
    if cached is not None:
        return cached
    try:
        from PIL import ImageFont  # type: ignore
    except ImportError:
        return None
    for path, _default_size in _FONT_CANDIDATES:
        if _os.path.exists(path):
            try:
                font = ImageFont.truetype(path, size)
                _font_cache[size] = font
                return font
            except Exception:
                continue
    try:
        font = ImageFont.load_default(size=size)
    except TypeError:
        font = ImageFont.load_default()
    _font_cache[size] = font
    return font


RGB = Tuple[int, int, int]
BLACK: RGB = (0, 0, 0)
WHITE: RGB = (0xFF, 0xFF, 0xFF)


class Frame:
    """A 768-byte working frame buffer indexed by (col, row).

    Padding bytes are written too (always 0) — the firmware ignores them.
    """

    __slots__ = ("_buf",)

    def __init__(self, initial: Optional[bytes] = None) -> None:
        if initial is None:
            self._buf = bytearray(lut.TOTAL_BYTES)
        else:
            if len(initial) != lut.TOTAL_BYTES:
                raise ValueError(
                    f"initial buffer must be {lut.TOTAL_BYTES} bytes, got {len(initial)}"
                )
            self._buf = bytearray(initial)

    # -- low-level access --

    def to_bytes(self) -> bytes:
        return bytes(self._buf)

    def __bytes__(self) -> bytes:
        return self.to_bytes()

    # -- whole-frame ops --

    def clear(self) -> None:
        for i in range(lut.TOTAL_BYTES):
            self._buf[i] = 0

    def fill(self, color: RGB) -> None:
        r, g, b = _clip_rgb(color)
        for c, row in lut.ALL_COORDS:
            self._set_rgb(c, row, r, g, b)

    # -- pixel ops --

    def set_pixel(self, col: int, row: int, color: RGB) -> None:
        if not lut.has_led(col, row):
            return
        r, g, b = _clip_rgb(color)
        self._set_rgb(col, row, r, g, b)

    def get_pixel(self, col: int, row: int) -> RGB:
        if not lut.has_led(col, row):
            return BLACK
        rb, gb, bb = lut.rgb_bytes(col, row)
        return (self._buf[rb], self._buf[gb], self._buf[bb])

    def _set_rgb(self, col: int, row: int, r: int, g: int, b: int) -> None:
        rb, gb, bb = lut.rgb_bytes(col, row)
        self._buf[rb] = r
        self._buf[gb] = g
        self._buf[bb] = b

    # -- row/col helpers --

    def set_row(self, row: int, color: RGB) -> None:
        if row not in lut.COLS_PER_ROW:
            return
        r, g, b = _clip_rgb(color)
        for c in lut.COLS_PER_ROW[row]:
            self._set_rgb(c, row, r, g, b)

    def set_col(self, col: int, color: RGB) -> None:
        r, g, b = _clip_rgb(color)
        for c, row in lut.ALL_COORDS:
            if c == col:
                self._set_rgb(c, row, r, g, b)

    # -- image rendering --

    def draw_image(
        self,
        image: "PIL.Image.Image",  # type: ignore[name-defined]
        *,
        invert_y: bool = False,
    ) -> None:
        """Sample a PIL image into the LED grid.

        The image is expected to be in RGB mode and roughly portrait
        (cols=7 wide × rows=36 tall). It's resized to (7, 36) via nearest
        neighbour, then each LED at (col, row) reads the pixel at
        (col - 1, row - 1) of the resized image.

        Args:
          image:      PIL.Image in any mode (converted to RGB).
          invert_y:   If True, flip the image vertically (useful when the
                      matrix is physically mounted upside down).
        """
        try:
            from PIL import Image  # type: ignore
        except ImportError as ex:
            raise RuntimeError("Pillow is required for draw_image") from ex

        if image.mode != "RGB":
            image = image.convert("RGB")
        if invert_y:
            image = image.transpose(Image.FLIP_TOP_BOTTOM)

        resized = image.resize((lut.MAX_COL, lut.MAX_ROW), resample=Image.NEAREST)
        px = resized.load()
        for col, row in lut.ALL_COORDS:
            r, g, b = px[col - 1, row - 1]
            self._set_rgb(col, row, r, g, b)

    def draw_text(
        self,
        text: str,
        *,
        color: RGB = WHITE,
        font: Optional["PIL.ImageFont.ImageFont"] = None,  # type: ignore[name-defined]
        center: bool = True,
        rotation: int = 0,
    ) -> None:
        """Render `text` onto the matrix using a PIL font.

        rotation:
          0   — text drawn natively (rows are matrix rows, cols are matrix cols).
                Best for single characters or short labels (matrix is only 7 cols
                wide, so longer strings won't fit horizontally).
          90  — text drawn rotated 90° clockwise, so the writing direction runs
                along the LONG axis of the matrix (36 LEDs tall). Best for the
                clock / temperature where you want to read along the long axis.
                User reads with the matrix orientation as-is — head tilted right.
          180 — text drawn upside down.
          270 — text rotated 90° counter-clockwise (head tilted left).

        The text is drawn onto an off-screen monochrome canvas (matched in size
        to the final orientation), centred if requested, then projected onto
        lit LEDs. Background pixels are left untouched.
        """
        try:
            from PIL import Image, ImageDraw, ImageFont  # type: ignore
        except ImportError as ex:
            raise RuntimeError("Pillow is required for draw_text") from ex

        if rotation not in (0, 90, 180, 270):
            raise ValueError(f"rotation must be 0, 90, 180, or 270; got {rotation}")
        if font is None:
            font = _matrix_font() or ImageFont.load_default()

        # Canvas dimensions before final rotation. For rotation=0/180 we draw
        # at portrait dimensions (col × row); for rotation=90/270 we draw at
        # landscape dimensions (row × col) so the text fits horizontally
        # before being rotated back into the portrait LED grid.
        if rotation in (90, 270):
            canvas_w, canvas_h = lut.MAX_ROW, lut.MAX_COL          # 36 × 7
        else:
            canvas_w, canvas_h = lut.MAX_COL, lut.MAX_ROW          # 7 × 36

        canvas = Image.new("L", (canvas_w, canvas_h), 0)
        draw = ImageDraw.Draw(canvas)
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        if center:
            x = (canvas_w - text_w) // 2 - bbox[0]
            y = (canvas_h - text_h) // 2 - bbox[1]
        else:
            x, y = -bbox[0], -bbox[1]
        draw.text((x, y), text, fill=255, font=font)

        # Rotate the canvas so its final dimensions are MAX_COL × MAX_ROW
        # (portrait, matching the LED grid orientation).
        if rotation == 90:
            canvas = canvas.transpose(Image.ROTATE_270)   # PIL: ROTATE_270 = 90° CW
        elif rotation == 180:
            canvas = canvas.transpose(Image.ROTATE_180)
        elif rotation == 270:
            canvas = canvas.transpose(Image.ROTATE_90)    # PIL: ROTATE_90 = 90° CCW

        assert canvas.size == (lut.MAX_COL, lut.MAX_ROW), (
            f"canvas size after rotation {canvas.size} != "
            f"({lut.MAX_COL}, {lut.MAX_ROW})"
        )

        px = canvas.load()
        r_v, g_v, b_v = _clip_rgb(color)
        for col, row in lut.ALL_COORDS:
            if px[col - 1, row - 1] > 127:
                self._set_rgb(col, row, r_v, g_v, b_v)

    def draw_image_scrolled(
        self,
        image: "PIL.Image.Image",  # type: ignore[name-defined]
        offset_px: int,
        *,
        rotation: int = 90,
        gap_px: int = 4,
    ) -> int:
        """Render a scrolling horizontal slice of `image` onto the matrix.

        The image is first rescaled to the matrix's short-axis height (7 px)
        preserving its aspect ratio, then duplicated end-to-end with a
        configurable gap to produce a seamless marquee canvas. A
        long-axis-wide window starting at ``offset_px`` is cropped and
        projected onto the LED grid using the rotation rules from
        ``draw_image``.

        Returns the segment width (scaled_w + gap_px) so the caller can wrap
        ``offset_px`` modulo this value.
        """
        try:
            from PIL import Image  # type: ignore
        except ImportError as ex:
            raise RuntimeError("Pillow is required for draw_image_scrolled") from ex

        if rotation not in (0, 90, 180, 270):
            raise ValueError(f"rotation must be 0, 90, 180, or 270; got {rotation}")

        if rotation in (90, 270):
            win_w, canvas_h = lut.MAX_ROW, lut.MAX_COL    # 36 × 7
        else:
            win_w, canvas_h = lut.MAX_COL, lut.MAX_ROW    # 7 × 36

        if image.mode != "RGB":
            image = image.convert("RGB")
        aspect = image.width / max(image.height, 1)
        scaled_h = canvas_h
        scaled_w = max(1, int(round(aspect * scaled_h)))
        scaled = image.resize((scaled_w, scaled_h), resample=Image.NEAREST)

        seg_w = scaled_w + max(1, gap_px)
        wide = Image.new("RGB", (seg_w * 2, canvas_h), (0, 0, 0))
        wide.paste(scaled, (0, 0))
        wide.paste(scaled, (seg_w, 0))

        off = offset_px % seg_w
        window = wide.crop((off, 0, off + win_w, canvas_h))

        if rotation == 90:
            window = window.transpose(Image.ROTATE_270)
        elif rotation == 180:
            window = window.transpose(Image.ROTATE_180)
        elif rotation == 270:
            window = window.transpose(Image.ROTATE_90)

        px = window.load()
        for col, row in lut.ALL_COORDS:
            r, g, b = px[col - 1, row - 1]
            self._set_rgb(col, row, r, g, b)
        return seg_w

    def draw_text_scrolled(
        self,
        text: str,
        offset_px: int,
        *,
        color: RGB = WHITE,
        font: Optional["PIL.ImageFont.ImageFont"] = None,  # type: ignore[name-defined]
        rotation: int = 90,
        gap_px: int = 8,
    ) -> int:
        """Render a horizontally scrolling view of `text` onto the matrix.

        Builds a wide PIL canvas containing the text twice (back-to-back with
        a configurable gap) so cropping a moving window produces a seamless
        looping marquee. Returns the segment width (text_w + gap_px) — the
        caller wraps ``offset_px`` modulo this value to keep scrolling
        forever without drift.

        Use this for long messages that don't fit on the matrix's long axis
        (36 LEDs at rotation 90/270, 7 LEDs at rotation 0/180). For short
        text, ``draw_text`` produces a centred static rendering.
        """
        try:
            from PIL import Image, ImageDraw, ImageFont  # type: ignore
        except ImportError as ex:
            raise RuntimeError("Pillow is required for draw_text_scrolled") from ex

        if rotation not in (0, 90, 180, 270):
            raise ValueError(f"rotation must be 0, 90, 180, or 270; got {rotation}")
        if font is None:
            font = _matrix_font() or ImageFont.load_default()

        if rotation in (90, 270):
            win_w, canvas_h = lut.MAX_ROW, lut.MAX_COL
        else:
            win_w, canvas_h = lut.MAX_COL, lut.MAX_ROW

        # Measure text once
        probe = ImageDraw.Draw(Image.new("L", (1, 1)))
        bb = probe.textbbox((0, 0), text, font=font)
        text_w = bb[2] - bb[0]
        text_h = bb[3] - bb[1]
        if text_w <= 0:
            return 1

        seg_w = text_w + max(1, gap_px)
        wide_w = seg_w * 2

        wide = Image.new("L", (wide_w, canvas_h), 0)
        draw = ImageDraw.Draw(wide)
        # Centre vertically — formula must produce a negative y when the
        # font's bbox top offset (bb[1]) exceeds (canvas_h - text_h)/2.
        # PIL handles negative y by drawing higher; clamping to 0 leaves
        # the text sitting at the bottom of the canvas.
        y = (canvas_h - text_h) // 2 - bb[1]
        draw.text((-bb[0], y), text, fill=255, font=font)
        draw.text((seg_w - bb[0], y), text, fill=255, font=font)

        off = offset_px % seg_w
        window = wide.crop((off, 0, off + win_w, canvas_h))

        if rotation == 90:
            window = window.transpose(Image.ROTATE_270)
        elif rotation == 180:
            window = window.transpose(Image.ROTATE_180)
        elif rotation == 270:
            window = window.transpose(Image.ROTATE_90)

        px = window.load()
        r_v, g_v, b_v = _clip_rgb(color)
        for col, row in lut.ALL_COORDS:
            if px[col - 1, row - 1] > 127:
                self._set_rgb(col, row, r_v, g_v, b_v)
        return seg_w

    def measure_text(
        self,
        text: str,
        *,
        font: Optional["PIL.ImageFont.ImageFont"] = None,  # type: ignore[name-defined]
    ) -> tuple[int, int]:
        """Return (width_px, height_px) for ``text`` rendered with the given
        PIL font (default font when None). Used by callers to decide between
        static draw vs scrolling marquee.
        """
        try:
            from PIL import Image, ImageDraw, ImageFont  # type: ignore
        except ImportError as ex:
            raise RuntimeError("Pillow is required for measure_text") from ex
        if font is None:
            font = _matrix_font() or ImageFont.load_default()
        bb = ImageDraw.Draw(Image.new("L", (1, 1))).textbbox((0, 0), text, font=font)
        return (bb[2] - bb[0], bb[3] - bb[1])

    def draw_tiny_text(
        self,
        text: str,
        *,
        color: RGB = WHITE,
        rotation: int = 270,
        center: bool = True,
        spacing: int = 1,
    ) -> None:
        """Render `text` using the hardcoded 3×5 pixel font.

        Designed for the clock / temperature use case where the text needs
        to fit on the matrix's short axis (7 cols). At rotation=90/270 the
        text runs along the long axis (36 rows), with 5 pixels of glyph
        height leaving ~2 cols of vertical margin.

        Supported characters: digits 0-9, ':', '.', ' ', '-', 'C', 'F', '%'.
        Unknown characters render as blanks.

        Args:
          rotation: 0 = native (text on short axis, only short strings fit)
                    90  = head tilted right (most common for clock)
                    180 = upside down
                    270 = head tilted left (also common, depends on user prefs)
        """
        if rotation not in (0, 90, 180, 270):
            raise ValueError(f"rotation must be 0, 90, 180, or 270; got {rotation}")

        bmp = font_3x5.render_text_bitmap(text, spacing=spacing)
        if not bmp or not bmp[0]:
            return
        bmp_h = len(bmp)
        bmp_w = len(bmp[0])

        # Place bmp into a canvas matching the rotation-pre dimensions.
        # For rotation 0/180 we want canvas = (MAX_COL × MAX_ROW) = portrait
        # For rotation 90/270 we want canvas = (MAX_ROW × MAX_COL) = landscape.
        if rotation in (90, 270):
            canvas_w, canvas_h = lut.MAX_ROW, lut.MAX_COL
        else:
            canvas_w, canvas_h = lut.MAX_COL, lut.MAX_ROW

        canvas = [[False] * canvas_w for _ in range(canvas_h)]
        if center:
            x0 = max(0, (canvas_w - bmp_w) // 2)
            y0 = max(0, (canvas_h - bmp_h) // 2)
        else:
            x0, y0 = 0, 0
        for y in range(bmp_h):
            for x in range(bmp_w):
                cx, cy = x0 + x, y0 + y
                if 0 <= cx < canvas_w and 0 <= cy < canvas_h:
                    canvas[cy][cx] = bmp[y][x]

        # Rotate canvas → portrait (MAX_COL × MAX_ROW) LED grid coords.
        if rotation == 0:
            rotated = canvas
        elif rotation == 90:
            # 90° CW: (y, x) -> (x, max_y - y). Source landscape → portrait.
            src_h, src_w = canvas_h, canvas_w
            rotated = [[False] * lut.MAX_COL for _ in range(lut.MAX_ROW)]
            for y in range(src_h):
                for x in range(src_w):
                    if canvas[y][x]:
                        new_x = src_h - 1 - y
                        new_y = x
                        if 0 <= new_x < lut.MAX_COL and 0 <= new_y < lut.MAX_ROW:
                            rotated[new_y][new_x] = True
        elif rotation == 180:
            rotated = [[canvas[canvas_h - 1 - y][canvas_w - 1 - x]
                        for x in range(canvas_w)]
                       for y in range(canvas_h)]
        else:  # 270
            src_h, src_w = canvas_h, canvas_w
            rotated = [[False] * lut.MAX_COL for _ in range(lut.MAX_ROW)]
            for y in range(src_h):
                for x in range(src_w):
                    if canvas[y][x]:
                        new_x = y
                        new_y = src_w - 1 - x
                        if 0 <= new_x < lut.MAX_COL and 0 <= new_y < lut.MAX_ROW:
                            rotated[new_y][new_x] = True

        r_v, g_v, b_v = _clip_rgb(color)
        for col, row in lut.ALL_COORDS:
            if rotated[row - 1][col - 1]:
                self._set_rgb(col, row, r_v, g_v, b_v)


# -- helpers --

def _clip_rgb(color: Sequence[int]) -> Tuple[int, int, int]:
    """Clip and unpack any 3-tuple to (R, G, B) in 0..255."""
    if len(color) != 3:
        raise ValueError(f"color must be a 3-tuple, got {color}")
    r, g, b = color
    return (max(0, min(0xFF, int(r))),
            max(0, min(0xFF, int(g))),
            max(0, min(0xFF, int(b))))
