r"""Visualize the byte→pixel LUT.

Plots every byte's detected (x, y) on a copy of the Phase-A reference
frame, colored by byte index (rainbow). Lets us eyeball:

  - Do the dots cover the whole matrix area?
  - Are there clusters (many bytes mapping to the same LED — likely
    padding bytes that produced no real LED)?
  - Does the byte-index sweep look spatially structured?

Also dumps simple statistics: cluster sizes, byte-coordinate ranges.
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path

import cv2  # type: ignore
import numpy as np


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lut", default="scratch/captures/lut_image_space.json")
    parser.add_argument("--video", default="scratch/captures/lut_crawl_video.mp4")
    parser.add_argument("--out", default="scratch/captures/lut_visual.png")
    parser.add_argument("--cluster-radius", type=float, default=12.0,
                        help="pixels within which two LEDs are 'the same' (clustering threshold)")
    args = parser.parse_args()

    data = json.loads(Path(args.lut).read_text())
    lut = data["lut"]
    fps = data["fps"]
    print(f"loaded LUT: {len(lut)} bytes, fps={fps:.2f}")

    # Get a reference frame (around Phase A peak) to overlay on.
    cap = cv2.VideoCapture(args.video)
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(22.0 * fps)))  # ~Phase A peak
    ok, ref = cap.read()
    cap.release()
    if not ok:
        # fallback: black canvas
        H, W = 1900, 1080
        ref = np.zeros((H, W, 3), dtype=np.uint8)

    overlay = ref.copy()

    # Cluster bytes by proximity so we can count duplicates.
    coords = []
    for i, entry in enumerate(lut):
        if entry is None:
            coords.append(None)
            continue
        x, y, conf = entry
        coords.append((float(x), float(y), float(conf)))

    # Naive clustering: union-find by radius.
    clusters: list[list[int]] = []
    cluster_of = [-1] * len(coords)
    for i, c in enumerate(coords):
        if c is None:
            continue
        x, y, _ = c
        best = -1
        for ci, members in enumerate(clusters):
            mx, my = members[0]  # cluster anchor
            if (x - mx) ** 2 + (y - my) ** 2 < args.cluster_radius ** 2:
                best = ci
                break
        if best == -1:
            clusters.append([(x, y), i])
            cluster_of[i] = len(clusters) - 1
        else:
            clusters[best].append(i)
            cluster_of[i] = best

    # Stats.
    sizes = [len(c) - 1 for c in clusters]   # subtract anchor
    print(f"clusters: {len(clusters)}  (unique LED positions)")
    print(f"  mean cluster size: {np.mean(sizes):.2f}  max: {max(sizes)}  "
          f"singletons: {sum(1 for s in sizes if s == 1)}")
    big = sorted([(s, ci) for ci, s in enumerate(sizes)], reverse=True)[:10]
    print(f"  top 10 largest clusters (potential padding bytes / firmware crosstalk):")
    for s, ci in big:
        members = [str(m) for m in clusters[ci][1:]]
        print(f"    cluster {ci} @ ({clusters[ci][0][0]:.0f}, {clusters[ci][0][1]:.0f})  "
              f"size={s}  bytes=[{', '.join(members[:8])}{'...' if s > 8 else ''}]")

    # Render. Color by byte index (HSV rainbow).
    for i, c in enumerate(coords):
        if c is None:
            continue
        x, y, _ = c
        hue = int(i / len(coords) * 179)
        rgb = cv2.cvtColor(np.uint8([[[hue, 255, 255]]]), cv2.COLOR_HSV2BGR)[0, 0]
        cv2.circle(overlay, (int(x), int(y)), 3, tuple(int(v) for v in rgb), -1)

    # Highlight large clusters in white outline.
    for ci, s in enumerate(sizes):
        if s >= 3:
            x, y = clusters[ci][0]
            cv2.circle(overlay, (int(x), int(y)), 8, (255, 255, 255), 1)

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(args.out, overlay)
    print(f"wrote {args.out}")

    # Also write a "byte index along x" sanity plot — does the byte-sweep
    # produce a continuous curve in either x or y?
    H = 400
    W = 1200
    img = np.full((H, W, 3), 30, dtype=np.uint8)
    for i, c in enumerate(coords):
        if c is None:
            continue
        x_norm = i / len(coords)
        x_px = int(x_norm * (W - 1))
        # plot detected y in upper half, detected x in lower half
        y_overlay_y = int(c[1] / max(p[1] for p in coords if p) * (H // 2 - 10))
        x_overlay_y = H // 2 + int(c[0] / max(p[0] for p in coords if p) * (H // 2 - 10))
        img[y_overlay_y, x_px] = (200, 220, 255)
        img[x_overlay_y, x_px] = (255, 220, 200)
    cv2.putText(img, "y-coord vs byte index", (10, 12),
                cv2.FONT_HERSHEY_PLAIN, 0.9, (200, 220, 255), 1)
    cv2.putText(img, "x-coord vs byte index", (10, H // 2 + 12),
                cv2.FONT_HERSHEY_PLAIN, 0.9, (255, 220, 200), 1)
    sweep_path = args.out.replace(".png", "_sweep.png")
    cv2.imwrite(sweep_path, img)
    print(f"wrote {sweep_path}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
