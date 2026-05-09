"""Generate a clearly-distinct test AMMX animation: diagonal sweep.

Output is `scratch/test_pattern.bin` — 60 frames of a moving diagonal
brightness gradient at 50 % max intensity. Eye-safe, visually unmistakable
against any of the existing 4 slots' content (which are all complex
animations from ASUS's stock library).
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from polylux.format import ammx


WIDTH = ammx.WIDTH    # 24
HEIGHT = ammx.HEIGHT  # 32
N_FRAMES = 60
MAX_BRIGHTNESS = 0x80  # 50 % — eye-safe


def diagonal_sweep_frame(t: float) -> bytes:
    """Build one frame of a diagonal brightness wave.

    `t` in [0, 1) — phase within the loop. Wave moves from top-left to
    bottom-right and back as a sine: each pixel's brightness depends on
    (x+y) and the phase, capped at MAX_BRIGHTNESS.
    """
    import math
    pixels = bytearray(WIDTH * HEIGHT)
    for y in range(HEIGHT):
        for x in range(WIDTH):
            # diagonal coordinate normalized 0..1
            d = (x + y) / (WIDTH + HEIGHT - 2)
            phase = 2 * math.pi * (d - t)
            v = (math.sin(phase) + 1) / 2  # 0..1
            pixels[y * WIDTH + x] = round(v * MAX_BRIGHTNESS)
    return bytes(pixels)


def main() -> int:
    frames = []
    for i in range(N_FRAMES):
        t = i / N_FRAMES
        frames.append(ammx.Frame(pixels=diagonal_sweep_frame(t), index=i))

    anim = ammx.Animation(frames=frames)
    out = Path(__file__).parent / "test_pattern.bin"
    ammx.save_file(out, anim)

    # Sanity: re-read and confirm decode is clean
    re_anim = ammx.load_file(out)
    assert re_anim.frame_count == N_FRAMES, "frame_count round-trip mismatch"
    assert re_anim.frames[0].pixels == frames[0].pixels, "pixel data mismatch"

    size = out.stat().st_size
    expected = ammx.FILE_HEADER_SIZE + N_FRAMES * ammx.FRAME_SIZE
    print(f"wrote {out}")
    print(f"  size: {size} bytes (expected {expected}, match={size == expected})")
    print(f"  frames: {re_anim.frame_count}")
    print(f"  device_flag: 0x{re_anim.device_flag:02x}, format_flag: 0x{re_anim.format_flag:02x}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
