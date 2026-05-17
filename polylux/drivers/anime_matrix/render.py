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
from pathlib import Path
from typing import Iterable, Optional, Sequence, Tuple

from . import lut
from . import font_3x5


# Family-name → file-path map. Asus ROG is bundled with Polylux; the
# rest come from C:/Windows/Fonts. UI exposes the keys of this dict as
# the matrix-text font dropdown choices, so adding a font here makes it
# available in the user picker.
_BUNDLED_FONT_DIR = Path(__file__).resolve().parent.parent.parent / "ui" / "fonts"
_FAMILY_PATHS: dict[str, str] = {
    "Asus Rog":          str(_BUNDLED_FONT_DIR / "AsusROG-Regular.ttf"),
    "Pixelya":           str(_BUNDLED_FONT_DIR / "Pixelya.ttf"),
    "Arial Bold":        "C:/Windows/Fonts/arialbd.ttf",
    "Arial":             "C:/Windows/Fonts/arial.ttf",
    "Consolas Bold":     "C:/Windows/Fonts/consolab.ttf",
    "Consolas":          "C:/Windows/Fonts/consola.ttf",
    "Bahnschrift":       "C:/Windows/Fonts/bahnschrift.ttf",
    "Segoe UI":          "C:/Windows/Fonts/segoeui.ttf",
    "Segoe UI Bold":     "C:/Windows/Fonts/seguisb.ttf",
    "Tahoma":            "C:/Windows/Fonts/tahoma.ttf",
    "Verdana":           "C:/Windows/Fonts/verdana.ttf",
    "Impact":            "C:/Windows/Fonts/impact.ttf",
}

# Display fonts where punctuation glyphs are stylised / decorative
# (Pixelya renders ":" as a tiny ROG logo, Asus Rog uses logo glyphs
# for several punct chars). When rendering a clock, swap to a clean
# fallback for these specific characters.
_DECORATIVE_PUNCT_FONTS = {"Pixelya", "Asus Rog"}
_PUNCT_FALLBACK_FAMILY = "Arial Bold"
_PUNCT_NEEDS_FALLBACK = set(":;.,")

# Fallback chain when the requested family file isn't on disk.
_FALLBACK_FAMILIES = ("Asus Rog", "Arial Bold", "Arial", "Consolas Bold", "Consolas")

_font_cache: dict = {}


def available_matrix_fonts() -> list[str]:
    """Return font family names whose file is present on the current host."""
    return [fam for fam, path in _FAMILY_PATHS.items() if _os.path.exists(path)]


def clear_font_cache() -> None:
    """Force re-pick the matrix font on next render (used after edits)."""
    global _font_cache
    _font_cache = {}


def _matrix_font(size: int = 9, family: str = "Asus Rog"):
    """Return a PIL font for the matrix at ``size`` px, preferring ``family``.

    If the requested family isn't on disk, walks the fallback chain
    (bundled Asus Rog → Arial Bold → Arial → Consolas Bold → Consolas)
    before defaulting to Pillow's built-in bitmap font. Cached per
    (size, family) pair so render hot loops don't re-load.
    """
    cache_key = (size, family)
    cached = _font_cache.get(cache_key)
    if cached is not None:
        return cached
    try:
        from PIL import ImageFont  # type: ignore
    except ImportError:
        return None
    tried: list[str] = []
    for candidate in (family,) + tuple(f for f in _FALLBACK_FAMILIES if f != family):
        path = _FAMILY_PATHS.get(candidate)
        if not path or not _os.path.exists(path):
            tried.append(candidate)
            continue
        try:
            font = ImageFont.truetype(path, size)
            _font_cache[cache_key] = font
            return font
        except Exception:
            tried.append(candidate)
            continue
    try:
        font = ImageFont.load_default(size=size)
    except TypeError:
        font = ImageFont.load_default()
    _font_cache[cache_key] = font
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

    def draw_bitmap_text(
        self,
        text: str,
        bmp_font,                     # clock_fonts.BitmapFont
        *,
        color: RGB = WHITE,
        rotation: int = 0,
    ) -> None:
        """Render ``text`` using a pixel-defined :class:`BitmapFont`.

        No PIL, no scaling, no anti-aliasing — each glyph pixel maps
        1:1 to a matrix LED. Used by clock scenes so the readout looks
        identical in the preview and on the panel regardless of font
        size sliders.
        """
        try:
            from PIL import Image  # type: ignore
        except ImportError as ex:
            raise RuntimeError("Pillow is required for draw_bitmap_text") from ex
        if rotation not in (0, 90, 180, 270):
            raise ValueError(f"rotation must be 0, 90, 180, or 270; got {rotation}")

        if rotation in (90, 270):
            canvas_w, canvas_h = lut.MAX_ROW, lut.MAX_COL          # 36 × 7
        else:
            canvas_w, canvas_h = lut.MAX_COL, lut.MAX_ROW          # 7 × 36

        text_w, text_h = bmp_font.text_size(text)
        if text_w == 0:
            return
        canvas = Image.new("L", (canvas_w, canvas_h), 0)
        x0 = max(0, (canvas_w - text_w) // 2)
        y0 = max(0, (canvas_h - text_h) // 2)
        px = canvas.load()
        for x, y in bmp_font.iter_pixels(text):
            xx, yy = x0 + x, y0 + y
            if 0 <= xx < canvas_w and 0 <= yy < canvas_h:
                px[xx, yy] = 255

        if rotation == 90:
            canvas = canvas.transpose(Image.ROTATE_270)
        elif rotation == 180:
            canvas = canvas.transpose(Image.ROTATE_180)
        elif rotation == 270:
            canvas = canvas.transpose(Image.ROTATE_90)

        px = canvas.load()
        r_v, g_v, b_v = _clip_rgb(color)
        for col, row in lut.ALL_COORDS:
            if px[col - 1, row - 1] > 127:
                self._set_rgb(col, row, r_v, g_v, b_v)

    def draw_text(
        self,
        text: str,
        *,
        color: RGB = WHITE,
        font: Optional["PIL.ImageFont.ImageFont"] = None,  # type: ignore[name-defined]
        center: bool = True,
        rotation: int = 0,
        punct_fallback: Optional["PIL.ImageFont.ImageFont"] = None,  # type: ignore[name-defined]
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

        # Render onto a generously oversized "scratch" canvas first so
        # we can measure the text and auto-shrink it to fit the panel
        # without clipping. The user may pick e.g. Pixelya at size 12;
        # Pixelya is native 7-row but 12pt produces ~9 visible px tall,
        # which would clip on the 7-row matrix. We render at the
        # requested size, then NEAREST-scale the rendered bitmap down
        # to ≤ canvas size, preserving aspect.
        scratch_w = canvas_w * 4
        scratch_h = canvas_h * 4
        scratch = Image.new("L", (scratch_w, scratch_h), 0)
        draw = ImageDraw.Draw(scratch)

        # Build the per-character (text, font) segment list. Without a
        # punct_fallback, the whole string uses ``font``. With one,
        # characters in _PUNCT_NEEDS_FALLBACK get swapped to it — used
        # for Pixelya/Asus-Rog where ``:`` is a decorative logo glyph,
        # so the clock "12:34" comes out as digits-Pixelya plus a
        # clean colon from Arial Bold.
        if punct_fallback is not None:
            segments: list[tuple[str, "ImageFont.ImageFont"]] = []
            cur_text = ""
            cur_font = font
            for ch in text:
                wanted = punct_fallback if ch in _PUNCT_NEEDS_FALLBACK else font
                if wanted is cur_font:
                    cur_text += ch
                else:
                    if cur_text:
                        segments.append((cur_text, cur_font))
                    cur_text = ch
                    cur_font = wanted
            if cur_text:
                segments.append((cur_text, cur_font))
        else:
            segments = [(text, font)]

        # Measure all segments to compute total width + max height.
        widths: list[int] = []
        offsets: list[int] = []  # x-offset of each segment's draw call
        total_w = 0
        ascent_top = 10**9
        descent_bottom = -10**9
        for seg_text, seg_font in segments:
            sb = draw.textbbox((0, 0), seg_text, font=seg_font)
            w = sb[2] - sb[0]
            widths.append(w)
            offsets.append(-sb[0])
            total_w += w
            ascent_top = min(ascent_top, sb[1])
            descent_bottom = max(descent_bottom, sb[3])
        text_h = descent_bottom - ascent_top

        # Draw the segments onto the oversized scratch canvas, centred.
        scratch_x_cursor = (scratch_w - total_w) // 2
        scratch_y = (scratch_h - text_h) // 2 - ascent_top
        for (seg_text, seg_font), x_off, seg_w in zip(segments, offsets, widths):
            draw.text((scratch_x_cursor + x_off, scratch_y),
                      seg_text, fill=255, font=seg_font)
            scratch_x_cursor += seg_w

        # Crop to actual content + shrink-to-fit the panel canvas.
        bbox = scratch.getbbox()
        canvas = Image.new("L", (canvas_w, canvas_h), 0)
        if bbox is not None:
            text_img = scratch.crop(bbox)
            # Scale so that neither dimension exceeds the panel canvas.
            # cap at 1.0 — we never upscale, just shrink overflowing text.
            scale = min(canvas_w / text_img.width,
                        canvas_h / text_img.height, 1.0)
            if scale < 1.0:
                new_w = max(1, int(text_img.width * scale))
                new_h = max(1, int(text_img.height * scale))
                text_img = text_img.resize((new_w, new_h), Image.NEAREST)
            if center:
                paste_x = (canvas_w - text_img.width) // 2
                paste_y = (canvas_h - text_img.height) // 2
            else:
                paste_x = 0
                paste_y = 0
            canvas.paste(text_img, (paste_x, paste_y))

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

        The image is rescaled so its LONG side fills the matrix's long
        axis (preserving aspect ratio); the short side may overflow the
        matrix's short axis — when it does, the visible window scrolls
        through that overflow. This is the "fill the display, pan if
        needed" behaviour users expect.

        For images whose short side after long-axis-fit is still
        smaller than the matrix's short axis (e.g. text marquees), the
        callers should still hit this path via the explicit
        ``image_scroll`` flag — the function will just render the same
        scaled image with a marquee-style horizontal repeat.

        Returns the segment width (scaled_long + gap_px) so the caller can wrap
        ``offset_px`` modulo this value.
        """
        try:
            from PIL import Image  # type: ignore
        except ImportError as ex:
            raise RuntimeError("Pillow is required for draw_image_scrolled") from ex

        if rotation not in (0, 90, 180, 270):
            raise ValueError(f"rotation must be 0, 90, 180, or 270; got {rotation}")

        # Render-time orientation: when the user rotates the matrix
        # display 90°/270°, the window the user "sees" is rotated
        # too — we render onto a canvas whose long/short axes match
        # the user's perception, then transpose at the end.
        if rotation in (90, 270):
            win_w, canvas_h = lut.MAX_ROW, lut.MAX_COL    # 36 × 7
        else:
            win_w, canvas_h = lut.MAX_COL, lut.MAX_ROW    # 7 × 36

        if image.mode != "RGB":
            image = image.convert("RGB")
        aspect = image.width / max(image.height, 1)
        matrix_long = max(lut.MAX_COL, lut.MAX_ROW)
        # Scale so the image's longer dimension matches the matrix's
        # long axis. The shorter dimension may end up either smaller
        # than the matrix short axis (image fits comfortably, scroll
        # just loops the picture) or larger (we crop a window through
        # the picture as offset advances).
        if aspect >= 1.0:
            scaled_w = matrix_long
            scaled_h = max(1, int(round(matrix_long / aspect)))
        else:
            scaled_w = max(1, int(round(matrix_long * aspect)))
            scaled_h = matrix_long
        # Centre vertically on the canvas so portrait images on a
        # landscape canvas / vice-versa don't anchor to one edge.
        scaled = image.resize((scaled_w, scaled_h), resample=Image.NEAREST)
        if scaled_h != canvas_h:
            framed = Image.new("RGB", (scaled_w, canvas_h), (0, 0, 0))
            y_off = (canvas_h - scaled_h) // 2
            framed.paste(scaled, (0, y_off))
            scaled = framed
            scaled_h = canvas_h
        scaled_w_eff = scaled.width

        seg_w = scaled_w_eff + max(1, gap_px)
        # Build a marquee canvas wide enough that any window position
        # (mod seg_w) returns content without falling off the end.
        copies = max(2, (win_w // seg_w) + 2)
        wide = Image.new("RGB", (seg_w * copies, canvas_h), (0, 0, 0))
        for i in range(copies):
            wide.paste(scaled, (seg_w * i, 0))

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
