"""Turn any image or GIF into what the Ryujin LCD accepts: a 320x240
JPEG for stills (what AC sent), a 320x240 GIF for animations.

`stretch=True` scales without cropping (Vlad's choice for the Aura Blue
GIF, docs §4); otherwise the image is cropped to fill.
"""
from __future__ import annotations

import io
from pathlib import Path

from PIL import Image, ImageOps, ImageSequence

LCD_SIZE = (320, 240)


def _fit(img: Image.Image, stretch: bool, portrait: bool) -> Image.Image:
    """The panel is always fed 320x240. The firmware rotates its own
    animations but not uploaded images (live 2026-10-25), so a portrait
    image is laid out 240x320 and turned into the 320x240 buffer here."""
    img = ImageOps.exif_transpose(img).convert("RGB")
    size = (LCD_SIZE[1], LCD_SIZE[0]) if portrait else LCD_SIZE
    if stretch:
        img = img.resize(size, Image.Resampling.LANCZOS)
    else:
        img = ImageOps.fit(img, size, Image.Resampling.LANCZOS)
    return img.rotate(PORTRAIT_ROTATION, expand=True) if portrait else img


PORTRAIT_ROTATION = 270  # degrees counter-clockwise — AC rotates by 270 (AIOFanSDK log)


def ryujin_image(path: str | Path, stretch: bool = False, portrait: bool = False) -> bytes:
    """JPEG or GIF bytes for RyujinLCD.upload_image()."""
    with Image.open(path) as src:
        n = getattr(src, "n_frames", 1)
        buf = io.BytesIO()
        if n == 1:
            _fit(src, stretch, portrait).save(buf, format="JPEG", quality=90)
            return buf.getvalue()
        frames, durations = [], []
        for frame in ImageSequence.Iterator(src):
            frames.append(_fit(frame, stretch, portrait).convert("P", palette=Image.Palette.ADAPTIVE))
            durations.append(int(frame.info.get("duration", 100)) or 100)

    def encode() -> bytes:
        buf = io.BytesIO()
        frames[0].save(buf, format="GIF", save_all=True, append_images=frames[1:],
                       duration=durations, loop=0, optimize=True,
                       disposal=1)   # "keep previous frame", as in AC's GIF; 0 garbled the LCD
        return buf.getvalue()

    data = encode()
    # A 4.2 MB GIF made the LCD reboot mid-upload (2026-10-25); AC's own
    # was 1.7 MB and 2.6 MB went through. Thin frames until under the cap.
    while len(data) > MAX_GIF_BYTES and len(frames) > 1:
        frames, durations = frames[::2], [d * 2 for d in durations[::2]]
        data = encode()
    return data


MAX_GIF_BYTES = 2 * 1024 * 1024
