"""Turn any image or GIF into the 256x64 GIF the OLED accepts.

AC's own presets are GIF89a 256x64, 12–66 KB; the driver caps uploads
at 100 KB, so long animations are thinned until they fit.
"""
from __future__ import annotations

import io
from pathlib import Path

from PIL import Image, ImageOps, ImageSequence

OLED_SIZE = (256, 64)
MAX_BYTES = 100 * 1024


def _frames(src: Image.Image) -> list[tuple[Image.Image, int]]:
    out = []
    for frame in ImageSequence.Iterator(src):
        img = ImageOps.fit(frame.convert("RGB"), OLED_SIZE, Image.Resampling.LANCZOS)
        out.append((img.convert("L"), int(frame.info.get("duration", 100)) or 100))
    return out


def _encode(frames: list[tuple[Image.Image, int]]) -> bytes:
    buf = io.BytesIO()
    imgs = [f.convert("P", palette=Image.Palette.ADAPTIVE, colors=16) for f, _ in frames]
    imgs[0].save(buf, format="GIF", save_all=len(imgs) > 1, append_images=imgs[1:],
                 duration=[d for _, d in frames], loop=0, optimize=True)
    return buf.getvalue()


def oled_gif(path: str | Path) -> bytes:
    """GIF bytes for LiveDashOLED.upload_image(), ≤ 100 KB."""
    with Image.open(path) as src:
        frames = _frames(src)
    data = _encode(frames)
    while len(data) > MAX_BYTES and len(frames) > 1:
        # drop every other frame and double the remaining durations
        frames = [(f, d * 2) for f, d in frames[::2]]
        data = _encode(frames)
    if len(data) > MAX_BYTES:
        raise ValueError(f"{path}: still {len(data)} bytes as a single frame")
    return data
