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


def _fit(img: Image.Image, stretch: bool) -> Image.Image:
    img = img.convert("RGB")
    if stretch:
        return img.resize(LCD_SIZE, Image.Resampling.LANCZOS)
    return ImageOps.fit(img, LCD_SIZE, Image.Resampling.LANCZOS)


def ryujin_image(path: str | Path, stretch: bool = False) -> bytes:
    """JPEG or GIF bytes for RyujinLCD.upload_image()."""
    with Image.open(path) as src:
        n = getattr(src, "n_frames", 1)
        buf = io.BytesIO()
        if n == 1:
            _fit(src, stretch).save(buf, format="JPEG", quality=90)
            return buf.getvalue()
        frames, durations = [], []
        for frame in ImageSequence.Iterator(src):
            frames.append(_fit(frame, stretch).convert("P", palette=Image.Palette.ADAPTIVE))
            durations.append(int(frame.info.get("duration", 100)) or 100)
    frames[0].save(buf, format="GIF", save_all=True, append_images=frames[1:],
                   duration=durations, loop=0, optimize=True)
    return buf.getvalue()
