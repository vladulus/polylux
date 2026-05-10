r"""Debug helper: for the first few LED candidates, print top-10 brightness peaks."""
from __future__ import annotations

import sys
from pathlib import Path

import cv2  # type: ignore
import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from lut_crawler_decode import (
    read_brightness_curve, find_marker_edges,
    detect_led_positions, sample_led_brightness,
)


def main() -> int:
    cap = cv2.VideoCapture("scratch/captures/lut_crawl_video.mp4")
    fps = cap.get(cv2.CAP_PROP_FPS)
    print(f"video fps={fps:.2f}")

    curve = read_brightness_curve(cap)
    phase_c_start, phase_d_start, phase_a_peak = find_marker_edges(
        curve, fps, 5.0, 768, 0.5
    )
    n_phase_c = phase_d_start - phase_c_start

    led_centers, roi = detect_led_positions(cap, phase_a_peak)
    print(f"{len(led_centers)} LED candidates")

    print("sampling intensity matrix (this can take a minute)...")
    bin_size = n_phase_c / 768
    intensities = np.zeros((768, len(led_centers)), dtype=np.float32)
    for i in range(768):
        bin_lo = phase_c_start + int(round(i * bin_size))
        bin_hi = phase_c_start + int(round((i + 1) * bin_size))
        sample_idx = bin_lo + int(round(0.6 * (bin_hi - bin_lo)))
        row = sample_led_brightness(cap, led_centers, sample_idx)
        if row is not None:
            intensities[i] = row
    cap.release()

    medians = np.median(intensities, axis=0)
    diffs = intensities - medians[None, :]

    print()
    print("Top 10 brightest bytes for first 8 LED candidates (sorted by Phase A position):")
    print("(LED idx is internal order from detection — y-coord shows where on matrix)")

    # Sort LED candidates by y then x to roughly walk top-to-bottom
    order = np.lexsort((led_centers[:, 0], led_centers[:, 1]))

    for n_shown, j in enumerate(order[:8]):
        x, y = led_centers[j]
        curve_j = diffs[:, j]
        top10 = np.argsort(curve_j)[-10:][::-1]   # descending
        peaks = [(int(idx), float(curve_j[idx])) for idx in top10]
        print(f"\nLED #{j} at image ({x:.0f}, {y:.0f}) [walk-order {n_shown}]:")
        for byte_idx, score in peaks:
            block = byte_idx // 48
            plane = (byte_idx // 16) % 3
            slot = byte_idx % 16
            plane_name = "RGB"[plane]
            print(f"  byte {byte_idx:3d}  block={block:2d}  plane={plane_name}  slot={slot:2d}  score={score:6.1f}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
