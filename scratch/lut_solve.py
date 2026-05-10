r"""LUT solver — exploits the discovered block structure.

Storage layout (verified empirically + by Vlad's visual observation):

  Block 0: 15 LEDs + 1 padding,  16 bytes per plane × 3 planes = 48 bytes
  Block 1..15: 14 LEDs + 2 padding, 16 bytes per plane × 3 planes = 48 bytes

  Total: 16 blocks × 48 bytes = 768 bytes
  Total real LEDs: 15 + 14 × 15 = 225

For a given LED j, the bytes that fire it are:
    R-byte = block_start + j_in_block
    G-byte = R-byte + 16
    B-byte = R-byte + 32

Inverse: for each LED candidate, look at its brightness curve over the
768-sample walk. The 3 highest peaks (or 2 if a channel is dead) reveal
the (R, G, B) byte indices that drive it.

Strategy:

  1. Read the existing per-LED-per-byte intensity matrix (n_bytes × n_leds)
     from the previous decode pass.
  2. For each LED candidate, find the top-3 peaks in its curve.
  3. Validate that they form an (R, R+16, R+32) triplet — accept the LED
     if the spacing checks out, mark dead-channel B if only 2 peaks
     align with R-spacing.
  4. Build the byte→LED LUT: for each byte i in 0..767, which LED?

This is the standalone, theory-driven version — robust to per-byte
detection noise because we vote across the whole walk.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import cv2  # type: ignore
import numpy as np


BLOCK_BYTES = 48          # 16 R + 16 G + 16 B
PLANE_BYTES = 16          # bytes per plane within a block
N_BYTES = 768
N_BLOCKS = 16


def block_layout() -> list[int]:
    """Return list of LED counts per block.

    Layout (verified by Vlad's manual count, 3 passes):
      Block  0:  15 LEDs + 1 padding   (top staircase 2+4+6=12 + 3 from middle row 4)
      Blocks 1..14: 14 LEDs + 2 padding each (middle, 2 rows of 7 cols per block)
      Block 15: 12 LEDs + 4 padding   (bottom staircase 6+4+2=12, mirror of top)

    Total: 15 + 14*14 + 12 = 223 real LEDs.
    Total bytes per plane: 16 + 16*14 + 16 = 256 → 256 * 3 = 768 bytes. ✓
    """
    return [15] + [14] * 14 + [12]


def expected_red_bytes() -> list[int]:
    """List of byte indices that should be R-channel for a real LED."""
    out = []
    for b, n_leds in enumerate(block_layout()):
        for j in range(n_leds):
            out.append(b * BLOCK_BYTES + j)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--video", default="scratch/captures/lut_crawl_video.mp4",
        help="video path (used to re-detect LED candidates)"
    )
    parser.add_argument(
        "--per-byte", type=float, default=0.5
    )
    parser.add_argument(
        "--marker", type=float, default=5.0
    )
    parser.add_argument(
        "--out", default="polylux/drivers/anime_matrix/lut.py"
    )
    args = parser.parse_args()

    # Bring the existing decoder primitives into scope.
    sys.path.insert(0, str(Path(__file__).parent))
    from lut_crawler_decode import (
        read_brightness_curve, find_marker_edges,
        detect_led_positions, sample_led_brightness,
    )

    cap = cv2.VideoCapture(args.video)
    fps = cap.get(cv2.CAP_PROP_FPS)
    n_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"[solver] video: fps={fps:.2f}  frames={n_frames}")

    print(f"[solver] reading brightness curve...")
    curve = read_brightness_curve(cap)

    phase_c_start, phase_d_start, phase_a_peak = find_marker_edges(
        curve, fps, args.marker, N_BYTES, args.per_byte
    )
    n_phase_c = phase_d_start - phase_c_start
    print(f"[solver] PHASE C: frames [{phase_c_start}..{phase_d_start})  len={n_phase_c}")

    print(f"[solver] detecting LED candidates from PHASE A peak...")
    led_centers_a, roi = detect_led_positions(cap, phase_a_peak)
    print(f"[solver] {len(led_centers_a)} LED candidates (Phase A)")

    # Augment with Phase C single-byte spikes — autoexposure-free detections.
    # Walk through every Nth bin, find the brightest spot, cluster all hits.
    print(f"[solver] augmenting with Phase C bright-spot scan...")
    bin_size_p = (phase_d_start - phase_c_start) / N_BYTES
    extra_spots: list[tuple[float, float]] = []
    sample_stride = 1   # check every byte
    for i in range(0, N_BYTES, sample_stride):
        bin_lo = phase_c_start + int(round(i * bin_size_p))
        bin_hi = phase_c_start + int(round((i + 1) * bin_size_p))
        sample_idx = bin_lo + int(round(0.5 * (bin_hi - bin_lo)))
        cap.set(cv2.CAP_PROP_POS_FRAMES, sample_idx)
        ok, frame = cap.read()
        if not ok:
            continue
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # Threshold relative to local frame max (each byte produces ONE bright LED).
        peak = int(gray.max())
        if peak < 60:
            continue
        thr = max(peak - 20, int(0.85 * peak))
        ys, xs = np.where(gray > thr)
        if len(xs) == 0:
            continue
        # Take the centroid of the brightest blob.
        x = float(xs.mean()); y = float(ys.mean())
        extra_spots.append((x, y))

    # Cluster all detections into unique LEDs.
    all_spots = list(led_centers_a.tolist()) + extra_spots
    all_spots = np.asarray(all_spots, dtype=np.float32)
    print(f"[solver] {len(all_spots)} raw spots before clustering")

    # Naive radius-clustering (LEDs are ~12-20 px apart in this video).
    clusters: list[list[tuple[float, float]]] = []
    for s in all_spots:
        x, y = float(s[0]), float(s[1])
        placed = False
        for c in clusters:
            cx, cy = c[0]
            if (x - cx) ** 2 + (y - cy) ** 2 < 8.0 ** 2:
                c.append((x, y))
                placed = True
                break
        if not placed:
            clusters.append([(x, y)])
    led_centers = np.asarray(
        [(float(np.mean([p[0] for p in c])), float(np.mean([p[1] for p in c])))
         for c in clusters if len(c) >= 2],   # require >=2 sightings
        dtype=np.float32,
    )
    print(f"[solver] {len(led_centers)} unique LED clusters (>=2 sightings)")

    print(f"[solver] sampling per-LED brightness over the {N_BYTES}-byte walk...")
    bin_size = n_phase_c / N_BYTES
    intensities = np.zeros((N_BYTES, len(led_centers)), dtype=np.float32)
    for i in range(N_BYTES):
        bin_lo = phase_c_start + int(round(i * bin_size))
        bin_hi = phase_c_start + int(round((i + 1) * bin_size))
        sample_idx = bin_lo + int(round(0.6 * (bin_hi - bin_lo)))
        row = sample_led_brightness(cap, led_centers, sample_idx)
        if row is not None:
            intensities[i] = row
    cap.release()

    # Subtract per-LED median so each LED's own baseline is zero.
    medians = np.median(intensities, axis=0)
    diffs = intensities - medians[None, :]   # shape (768, N_LEDS)

    print(f"[solver] solving block-aware LUT...")
    # For every LED candidate, find the top-3 peak bytes in its diff curve.
    # The triplet should match (k, k+16, k+32) for some k that's the R-byte.
    # Score every LED by how well its top peaks fit the pattern.
    n_leds = len(led_centers)
    led_assignments: list[dict | None] = [None] * n_leds
    for j in range(n_leds):
        curve_j = diffs[:, j].copy()
        # The top 3 peaks (probably R, G, B for this LED).
        top_idx = np.argsort(curve_j)[-3:][::-1]    # descending intensity
        top_idx_sorted = sorted(int(i) for i in top_idx)
        # Score: do these match (k, k+16, k+32)?
        a, b, c = top_idx_sorted
        if b - a == 16 and c - b == 16:
            r_byte = a
            score = float(curve_j[a] + curve_j[b] + curve_j[c])
            led_assignments[j] = {
                "r_byte": r_byte,
                "g_byte": r_byte + 16,
                "b_byte": r_byte + 32,
                "score": score,
                "scores_rgb": [float(curve_j[a]), float(curve_j[b]), float(curve_j[c])],
                "x": float(led_centers[j, 0]),
                "y": float(led_centers[j, 1]),
                "channels_alive": 3,
            }
        else:
            # Maybe one channel dead — top 2 should match (k, k+16) or (k, k+32).
            top2_idx = sorted(int(i) for i in np.argsort(curve_j)[-2:])
            d = top2_idx[1] - top2_idx[0]
            if d in (16, 32):
                r_byte = top2_idx[0]
                live = "RG" if d == 16 else "RB"
                score = float(curve_j[top2_idx[0]] + curve_j[top2_idx[1]])
                led_assignments[j] = {
                    "r_byte": r_byte,
                    "g_byte": r_byte + 16 if d == 16 else None,
                    "b_byte": r_byte + 32 if d == 32 else (r_byte + 32 if d == 16 else None),
                    "score": score,
                    "scores_rgb": [float(curve_j[top2_idx[0]]), float(curve_j[top2_idx[1]]),
                                   None],
                    "x": float(led_centers[j, 0]),
                    "y": float(led_centers[j, 1]),
                    "channels_alive": 2,
                    "live_channels": live,
                }

    valid = [a for a in led_assignments if a is not None]
    print(f"[solver] {len(valid)}/{n_leds} LED candidates fit the (R, R+16, R+32) pattern")

    # The 225 expected real-LED R-bytes (theoretical).
    theory_r_bytes = set(expected_red_bytes())
    matched_r_bytes = {a["r_byte"] for a in valid}
    spurious = matched_r_bytes - theory_r_bytes
    missing = theory_r_bytes - matched_r_bytes
    print(f"[solver] theory: {len(theory_r_bytes)} R-bytes; "
          f"detected: {len(matched_r_bytes)}; "
          f"spurious: {len(spurious)}; missing: {len(missing)}")
    if missing:
        print(f"[solver] missing R-bytes (LEDs we couldn't pin): {sorted(missing)[:30]}{'...' if len(missing) > 30 else ''}")
    if spurious:
        print(f"[solver] spurious R-bytes (detections that don't fit any LED slot): {sorted(spurious)[:30]}{'...' if len(spurious) > 30 else ''}")

    # Resolve duplicates: if multiple LED candidates claim the same r_byte,
    # keep the highest-scoring one.
    by_r: dict[int, dict] = {}
    for a in valid:
        r = a["r_byte"]
        if r not in by_r or a["score"] > by_r[r]["score"]:
            by_r[r] = a

    # Build the byte→LED LUT (the actual deliverable).
    lut: list = [None] * N_BYTES
    layout = block_layout()
    for r_byte_observed, a in by_r.items():
        block = r_byte_observed // BLOCK_BYTES
        j_in_block = r_byte_observed % BLOCK_BYTES
        # `top_idx_sorted[0]` may have landed in G or B plane if R was
        # the dim-channel for this LED; collapse to canonical R-slot.
        j_in_red = j_in_block % PLANE_BYTES
        if j_in_red >= layout[block]:
            # Slot is padding for this block (the trailing 1, 2, or 4
            # padding bytes per plane).
            continue
        real_r = block * BLOCK_BYTES + j_in_red
        lut[real_r]                     = (a["x"], a["y"], "R")
        lut[real_r + PLANE_BYTES]       = (a["x"], a["y"], "G")
        lut[real_r + 2 * PLANE_BYTES]   = (a["x"], a["y"], "B")
        if a["channels_alive"] == 2 and a.get("live_channels") == "RB":
            lut[real_r + PLANE_BYTES] = (a["x"], a["y"], "G_DEAD")

    n_assigned = sum(1 for e in lut if e is not None)
    print(f"[solver] LUT entries assigned: {n_assigned}/{N_BYTES}")

    # Write the python module.
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w") as f:
        f.write('"""Auto-generated AniMe Matrix LUT — DO NOT EDIT BY HAND.\n\n')
        f.write('Each entry is (x_image, y_image, channel) or None for padding.\n')
        f.write('"""\n\n')
        f.write('LUT = [\n')
        for entry in lut:
            f.write(f'    {entry!r},\n')
        f.write(']\n')
    print(f"[solver] wrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
