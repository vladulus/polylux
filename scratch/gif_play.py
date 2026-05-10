r"""Play an animated GIF on the AniMe Matrix.

Each frame is resampled to the matrix's 7x36 grid (nearest neighbour),
then projected onto the LEDs via render.Frame.draw_image. Frame duration
is read from the GIF metadata; defaults to 100ms if unavailable.

Loops until Ctrl+C.
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix
from polylux.drivers.anime_matrix.render import Frame


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--gif", required=True)
    parser.add_argument("--loops", type=int, default=3, help="number of loop passes (default 3)")
    parser.add_argument("--speed", type=float, default=1.0,
                        help="playback speed multiplier (default 1.0)")
    parser.add_argument("--rotation", type=int, choices=[0, 90, 180, 270],
                        default=0, help="rotate each frame")
    args = parser.parse_args()

    from PIL import Image

    img = Image.open(args.gif)
    print(f"GIF: {args.gif}")
    print(f"  size: {img.size}  mode: {img.mode}  frames: {img.n_frames}")

    # Pre-render all frames to 768-byte matrix buffers (avoids per-frame PIL work).
    print(f"  pre-rendering {img.n_frames} frames...")
    rendered_frames: list[tuple[bytes, float]] = []
    for i in range(img.n_frames):
        img.seek(i)
        frame_rgb = img.convert("RGB")
        if args.rotation == 90:
            frame_rgb = frame_rgb.transpose(Image.ROTATE_270)
        elif args.rotation == 180:
            frame_rgb = frame_rgb.transpose(Image.ROTATE_180)
        elif args.rotation == 270:
            frame_rgb = frame_rgb.transpose(Image.ROTATE_90)
        f = Frame()
        f.draw_image(frame_rgb)
        duration_ms = img.info.get("duration", 100)   # default 100ms
        rendered_frames.append((f.to_bytes(), duration_ms / 1000.0 / args.speed))
    print(f"  done.")

    with AniMeMatrix.open() as m:
        for loop in range(args.loops):
            print(f"loop {loop + 1}/{args.loops}")
            for frame_bytes, duration in rendered_frames:
                m.send_frame(frame_bytes)
                time.sleep(max(0.02, duration))
        m.clear()
        m.flush()
    print("done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
