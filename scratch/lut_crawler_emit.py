r"""LUT crawler — emit phase.

Walks the matrix through 768 single-byte-on frames so an external camera
can record which physical LED corresponds to each buffer offset.

Timeline (record from a tripod, do not move the camera):

  t=0..5s     PHASE A: all bytes = 0xFF      (start marker — "go bright")
  t=5..10s    PHASE B: all bytes = 0x00      (start marker — "go dark")
  t=10s..     PHASE C: byte i = 0xFF (i in 0..767), 500ms per byte
              total = 768 * 0.5 = 384s = 6.4 min
  end..+5s    PHASE D: all bytes = 0xFF      (end marker — "go bright again")
  +5..+10s    PHASE E: all bytes = 0x00      (end marker)

Total runtime: ~6.7 minutes. The two markers let the decoder pin the
exact frame ranges in the video without any wall-clock sync.

Run while the camera is recording. Don't move the matrix or the camera.

USAGE
-----
    .venv\Scripts\python.exe scratch\lut_crawler_emit.py

If ASUS daemons reclaim the device mid-run, kill them first:

    Get-Process | Where-Object { $_.ProcessName -match
      'Aac3572|LightingService|ArmouryCrate|asus_framework|ArmourySocketServer|ArmourySwAgent'
    } | Stop-Process -Force
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix, FRAME_SIZE


def hold(matrix: AniMeMatrix, seconds: float, refresh_hz: float = 4.0) -> None:
    """Keep the current frame on the matrix for `seconds`.

    The matrix latches each frame indefinitely after one write, but we
    re-flush a few times per second so a brief USB hiccup can't leave
    it stuck on a stale state.
    """
    deadline = time.monotonic() + seconds
    interval = 1.0 / refresh_hz
    while time.monotonic() < deadline:
        matrix.flush()
        sleep_left = min(interval, deadline - time.monotonic())
        if sleep_left > 0:
            time.sleep(sleep_left)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--per-byte", type=float, default=0.5,
        help="seconds to hold each single-byte frame (default 0.5)"
    )
    parser.add_argument(
        "--marker", type=float, default=5.0,
        help="seconds for each marker phase (default 5.0)"
    )
    parser.add_argument(
        "--fast", action="store_true",
        help="dry-run: 0.05s/byte + 1s markers (~40s total) to smoke-test the loop"
    )
    parser.add_argument(
        "--limit", type=int, default=FRAME_SIZE,
        help=f"only walk bytes 0..LIMIT-1 (default {FRAME_SIZE}, full)"
    )
    args = parser.parse_args()

    if args.fast:
        args.per_byte = 0.05
        args.marker = 1.0

    print(f"[crawler-emit] opening matrix...")
    with AniMeMatrix.open() as m:
        print(f"[crawler-emit] PHASE A: all-on marker ({args.marker}s)")
        m.fill(0xFF)
        hold(m, args.marker)

        print(f"[crawler-emit] PHASE B: all-off marker ({args.marker}s)")
        m.clear()
        hold(m, args.marker)

        total_s = args.limit * args.per_byte
        print(
            f"[crawler-emit] PHASE C: walking 0..{args.limit - 1} "
            f"@ {args.per_byte}s/byte = {total_s:.1f}s "
            f"({total_s / 60:.1f} min)"
        )
        t_start = time.monotonic()
        for i in range(args.limit):
            m.clear()
            m.set_byte(i, 0xFF)
            m.flush()
            if i % 64 == 0 or i == args.limit - 1:
                elapsed = time.monotonic() - t_start
                print(f"[crawler-emit]   byte {i:3d}/{args.limit - 1}  ({elapsed:6.1f}s)")
            target = t_start + (i + 1) * args.per_byte
            now = time.monotonic()
            if target > now:
                time.sleep(target - now)

        print(f"[crawler-emit] PHASE D: all-on end marker ({args.marker}s)")
        m.fill(0xFF)
        hold(m, args.marker)

        print(f"[crawler-emit] PHASE E: all-off end marker ({args.marker}s)")
        m.clear()
        hold(m, args.marker)

    print(f"[crawler-emit] done. Stop the camera and copy the video to")
    print(f"               scratch/captures/lut_crawl_video.mp4")
    return 0


if __name__ == "__main__":
    sys.exit(main())
