r"""LUT crawler — debug helper.

Reads the brightness curve once and dumps it to a PNG plot + a small
text histogram so we can see where Phase A / B / C / D / E actually
land in the recording.

Use this when the decoder's marker detection is producing nonsense.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import cv2  # type: ignore
import numpy as np


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--video", required=True)
    parser.add_argument("--out", default="scratch/captures/brightness_curve.png")
    args = parser.parse_args()

    cap = cv2.VideoCapture(args.video)
    fps = cap.get(cv2.CAP_PROP_FPS)
    n_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"video: fps={fps:.2f}  frames={n_frames}  duration={n_frames / fps:.1f}s")

    curve = []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        curve.append(float(gray.mean()))
    cap.release()

    curve_np = np.asarray(curve, dtype=np.float32)
    np.save(args.out.replace(".png", ".npy"), curve_np)

    # Render a 1280x400 plot with cv2 directly (no matplotlib dependency)
    W, H = 1280, 400
    img = np.full((H, W, 3), 30, dtype=np.uint8)
    # x axis labels (every 30s)
    for t in range(0, int(n_frames / fps) + 1, 30):
        x = int(t * fps / n_frames * W)
        cv2.line(img, (x, 0), (x, H), (60, 60, 60), 1)
        cv2.putText(img, f"{t}s", (x + 2, 12), cv2.FONT_HERSHEY_PLAIN,
                    0.8, (180, 180, 180), 1)

    # plot the curve
    cmin, cmax = float(curve_np.min()), float(curve_np.max())
    print(f"curve range: min={cmin:.1f}  max={cmax:.1f}  mid={(cmin + cmax) / 2:.1f}")
    span = max(cmax - cmin, 1.0)
    pts = []
    for i, v in enumerate(curve_np):
        x = int(i / max(n_frames - 1, 1) * (W - 1))
        y = H - 20 - int((v - cmin) / span * (H - 40))
        pts.append((x, y))
    for a, b in zip(pts, pts[1:]):
        cv2.line(img, a, b, (200, 220, 255), 1)

    # mark threshold line
    thr = (cmin + cmax) / 2
    y_thr = H - 20 - int((thr - cmin) / span * (H - 40))
    cv2.line(img, (0, y_thr), (W, y_thr), (80, 80, 200), 1)
    cv2.putText(img, f"thr={thr:.1f}", (5, y_thr - 3), cv2.FONT_HERSHEY_PLAIN,
                0.9, (120, 120, 220), 1)

    out = Path(args.out)
    cv2.imwrite(str(out), img)
    print(f"wrote {out}")

    # text-mode summary: print where the brightness exceeds the upper third
    upper = cmin + 0.66 * span
    lower = cmin + 0.33 * span
    print(f"upper third = {upper:.1f}, lower third = {lower:.1f}")

    above_upper = np.where(curve_np > upper)[0]
    if len(above_upper):
        # group into runs
        diffs = np.diff(above_upper)
        breaks = np.where(diffs > 1)[0]
        runs = []
        start = above_upper[0]
        for b in breaks:
            end = above_upper[b]
            runs.append((int(start), int(end)))
            start = above_upper[b + 1]
        runs.append((int(start), int(above_upper[-1])))
        print(f"runs ABOVE upper third (potential phase A and D):")
        for s, e in runs:
            print(f"  frames [{s}..{e}]  ({s / fps:.1f}s..{e / fps:.1f}s)  "
                  f"len={e - s}  ({(e - s) / fps:.1f}s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
