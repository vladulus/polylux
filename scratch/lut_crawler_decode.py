r"""LUT crawler — decode phase.

Consumes a video recorded while `lut_crawler_emit.py` was running and
produces a JSON LUT mapping each buffer-byte index (0..767) to its
physical pixel position in image-space (x, y) plus a confidence score.

Pipeline:

  1. Read every video frame, compute mean brightness over a centred ROI.
  2. Find the start marker by scanning the brightness curve for the
     all-on / all-off transition pair. Mark the t=0 frame of PHASE C.
  3. Find the end marker the same way.
  4. The interval between markers is sliced into N equal bins (one per
     emitted byte). For each bin, take a frame from the middle ~60%
     of the bin (avoid edges to dodge cross-byte transitions).
  5. Subtract the OFF baseline (median of last second of PHASE B), then
     argmax brightness inside the ROI. That's the LED for that byte —
     unless the maximum is below threshold, in which case the byte is
     padding (no LED) and we record None.

Output: scratch/captures/lut_image_space.json with shape:

    {
      "video":   "<path>",
      "fps":     30.0,
      "n_bytes": 768,
      "roi":     [x, y, w, h],
      "lut":     [[x, y, conf], [x, y, conf], ..., null, ...]
    }

Run:

    .venv\Scripts\python.exe scratch\lut_crawler_decode.py \
        --video scratch/captures/lut_crawl_video.mp4 \
        --per-byte 0.5 --marker 5.0

The decoder is independent from the emitter — pass the same --per-byte
and --marker values you used for the emit run.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import cv2  # type: ignore
import numpy as np


FRAME_SIZE_DEFAULT = 768


def read_brightness_curve(cap: "cv2.VideoCapture") -> np.ndarray:
    """Walk the whole video once and return per-frame mean brightness."""
    means: list[float] = []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        means.append(float(gray.mean()))
    return np.asarray(means, dtype=np.float32)


def find_marker_edges(
    curve: np.ndarray, fps: float, marker_s: float,
    n_bytes: int, per_byte_s: float,
) -> tuple[int, int, int]:
    """Return (idx_start_phase_C, idx_start_end_marker).

    Phone autoexposure makes the all-on phases drop back to baseline
    after ~0.5s — they're spikes, not plateaus. We anchor off the
    Phase A spike location (argmax in the first 1/4 of the video) and
    then derive everything else from the deterministic emit timeline
    (Phase A 5s + Phase B 5s + Phase C n*per_byte + Phase D 5s + Phase E 5s).
    """
    n = len(curve)
    quarter = n // 4

    # Phase A peak: argmax in the first quarter (Phase A is the first
    # bright thing in the video, no matter how much "before" footage).
    phase_a_peak = int(np.argmax(curve[:quarter]))

    # Phase A end: walk forward from peak until brightness drops below
    # halfway between peak and a local low (the "fall" off the A spike).
    peak_val = float(curve[phase_a_peak])
    # Estimate "off baseline" as median of frames in [peak+1s..peak+marker_s].
    look_lo = phase_a_peak + int(round(1.0 * fps))
    look_hi = min(n, phase_a_peak + int(round(marker_s * fps * 2)))
    if look_hi - look_lo < 5:
        raise RuntimeError("not enough frames after Phase A peak to estimate baseline")
    off_est = float(np.median(curve[look_lo:look_hi]))
    drop_thr = off_est + 0.3 * (peak_val - off_est)
    phase_a_end = phase_a_peak
    for i in range(phase_a_peak + 1, min(n, phase_a_peak + int(2.0 * fps))):
        if curve[i] < drop_thr:
            phase_a_end = i
            break

    # The emit timeline puts Phase C exactly marker_s seconds after the
    # END of Phase A (i.e. after Phase B which is the second 5s marker).
    phase_c_start = phase_a_end + int(round(marker_s * fps))

    # Detect Phase D EMPIRICALLY: argmax in the last quarter of the
    # video minus the trailing Phase E (5s off). Calculated phase_d_start
    # is unreliable because emit timing drifts ~30 frames over 6 minutes
    # (USB latency, sleep precision, autoexposure phase).
    last_quarter_lo = max(phase_c_start, n - int(round((marker_s * 2 + 5) * fps)))
    last_quarter_hi = n - int(round(marker_s * 0.5 * fps))   # exclude Phase E tail
    if last_quarter_hi <= last_quarter_lo:
        last_quarter_hi = n
    phase_d_peak = last_quarter_lo + int(np.argmax(curve[last_quarter_lo:last_quarter_hi]))

    # Phase D peak ≈ first frame of Phase D (autoexposure spikes before
    # adapting). So Phase C ends roughly there.
    phase_d_start = phase_d_peak
    print(f"[crawler-decode]   Phase D peak (= Phase C end): frame {phase_d_start} ({phase_d_start / fps:.1f}s)")

    if phase_d_start > n or phase_d_start <= phase_c_start:
        raise RuntimeError(
            f"Phase D detection gave bad value ({phase_d_start}); curve range "
            f"[{last_quarter_lo}..{last_quarter_hi}]"
        )

    print(f"[crawler-decode]   Phase A peak: frame {phase_a_peak} ({phase_a_peak / fps:.1f}s)  "
          f"value={peak_val:.1f}")
    print(f"[crawler-decode]   off baseline estimate: {off_est:.1f}  drop threshold: {drop_thr:.1f}")
    print(f"[crawler-decode]   Phase A end: frame {phase_a_end} ({phase_a_end / fps:.1f}s)")
    return phase_c_start, phase_d_start, phase_a_peak


def detect_led_positions(
    cap: "cv2.VideoCapture", phase_a_peak: int,
) -> tuple[np.ndarray, tuple[int, int, int, int]]:
    """Find every LED's center in image-space, plus the matrix bounding box.

    At Phase A peak the matrix is all-on. We threshold the frame, find
    connected components, take centroids — those are the physical LED
    positions. The bounding box of all centroids is the matrix ROI.

    Returns:
      led_centers: np.array of shape (N, 2) with (x, y) per LED
      bbox: (x, y, w, h) of the matrix area
    """
    cap.set(cv2.CAP_PROP_POS_FRAMES, phase_a_peak)
    ok, frame = cap.read()
    if not ok:
        raise RuntimeError("could not read PHASE A reference frame")
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Aggressive threshold to isolate bright LEDs from reflections / text.
    # Phase A peak has the LEDs much brighter than anything else in frame.
    thr = max(int(0.70 * gray.max()), 80)
    _, mask = cv2.threshold(gray, thr, 255, cv2.THRESH_BINARY)

    # Morphological close to glue partial pixels together.
    kern = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kern)

    # Connected components → centroids.
    n_lab, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)
    led_centers = []
    for i in range(1, n_lab):  # skip background (label 0)
        area = int(stats[i, cv2.CC_STAT_AREA])
        # Filter spurious tiny noise and giant blobs (text reflections,
        # multiple LEDs glued together at the bbox edges).
        if 4 <= area <= 200:
            led_centers.append((float(centroids[i, 0]), float(centroids[i, 1])))
    led_centers = np.asarray(led_centers, dtype=np.float32)

    if len(led_centers) == 0:
        raise RuntimeError("no LED centroids detected at Phase A peak")

    # ROI = bbox of LED centers (with padding).
    x0 = int(led_centers[:, 0].min()) - 8
    y0 = int(led_centers[:, 1].min()) - 8
    x1 = int(led_centers[:, 0].max()) + 8
    y1 = int(led_centers[:, 1].max()) + 8
    h, w = gray.shape
    x0 = max(0, x0); y0 = max(0, y0)
    x1 = min(w, x1); y1 = min(h, y1)
    bbox = (x0, y0, x1 - x0, y1 - y0)
    return led_centers, bbox


def compute_baseline(cap: "cv2.VideoCapture", roi: tuple[int, int, int, int],
                      phase_b_end: int, fps: float, n: int = 8) -> np.ndarray:
    """Median frame of the last `n / fps` seconds of PHASE B (off baseline)."""
    x, y, w, h = roi
    start = max(0, phase_b_end - n)
    cap.set(cv2.CAP_PROP_POS_FRAMES, start)
    stack = []
    for _ in range(n):
        ok, frame = cap.read()
        if not ok:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        stack.append(gray[y:y + h, x:x + w])
    if not stack:
        raise RuntimeError("could not read baseline frames")
    return np.median(np.stack(stack, axis=0), axis=0).astype(np.float32)


def sample_led_brightness(
    cap: "cv2.VideoCapture",
    led_centers: np.ndarray,
    sample_idx: int,
    sample_radius: int = 4,
) -> np.ndarray | None:
    """Read frame at `sample_idx`, return per-LED max brightness (raw, no baseline).

    Returns shape (N_LEDS,) array of float32 or None if the frame couldn't be read.
    """
    cap.set(cv2.CAP_PROP_POS_FRAMES, sample_idx)
    ok, frame = cap.read()
    if not ok:
        return None
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY).astype(np.float32)
    H, W = gray.shape
    out = np.zeros(len(led_centers), dtype=np.float32)
    for j, (cx_img, cy_img) in enumerate(led_centers):
        cx = int(round(cx_img)); cy = int(round(cy_img))
        x0 = max(0, cx - sample_radius); x1 = min(W, cx + sample_radius + 1)
        y0 = max(0, cy - sample_radius); y1 = min(H, cy + sample_radius + 1)
        if x1 <= x0 or y1 <= y0:
            out[j] = 0.0
            continue
        out[j] = float(gray[y0:y1, x0:x1].max())
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--video", required=True, help="path to recorded video")
    parser.add_argument("--per-byte", type=float, default=0.5)
    parser.add_argument("--marker", type=float, default=5.0)
    parser.add_argument("--n-bytes", type=int, default=FRAME_SIZE_DEFAULT)
    parser.add_argument(
        "--threshold", type=float, default=15.0,
        help="min peak brightness over baseline (0..255) to count as a real LED"
    )
    parser.add_argument(
        "--out", default="scratch/captures/lut_image_space.json",
    )
    args = parser.parse_args()

    video = Path(args.video)
    if not video.exists():
        print(f"[crawler-decode] ERROR: {video} does not exist", file=sys.stderr)
        return 2

    cap = cv2.VideoCapture(str(video))
    if not cap.isOpened():
        print(f"[crawler-decode] ERROR: could not open {video}", file=sys.stderr)
        return 2

    fps = cap.get(cv2.CAP_PROP_FPS)
    n_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"[crawler-decode] video: {video.name}  fps={fps:.2f}  frames={n_frames}")

    print(f"[crawler-decode] reading brightness curve...")
    curve = read_brightness_curve(cap)

    print(f"[crawler-decode] finding marker edges...")
    phase_c_start, phase_d_start, phase_a_peak = find_marker_edges(
        curve, fps, args.marker, args.n_bytes, args.per_byte
    )
    n_phase_c_frames = phase_d_start - phase_c_start
    expected = int(round(args.n_bytes * args.per_byte * fps))
    print(
        f"[crawler-decode] PHASE C: frames [{phase_c_start}..{phase_d_start})  "
        f"len={n_phase_c_frames}  expected~{expected}"
    )
    if abs(n_phase_c_frames - expected) > expected * 0.1:
        print(
            f"[crawler-decode] WARNING: PHASE C length is >10% off expected. "
            f"Check --per-byte / --marker match the emit run."
        )

    print(f"[crawler-decode] detecting LED centers + ROI from PHASE A peak frame...")
    led_centers, roi = detect_led_positions(cap, phase_a_peak)
    print(f"[crawler-decode] {len(led_centers)} LED centers detected, ROI = {roi}")

    print(f"[crawler-decode] sampling per-LED brightness for {args.n_bytes} bytes...")
    bin_size = n_phase_c_frames / args.n_bytes
    n_leds = len(led_centers)
    intensities = np.zeros((args.n_bytes, n_leds), dtype=np.float32)
    for i in range(args.n_bytes):
        bin_lo = phase_c_start + int(round(i * bin_size))
        bin_hi = phase_c_start + int(round((i + 1) * bin_size))
        # Sample from the middle of the bin (60% mark) — avoid transitions.
        sample_idx = bin_lo + int(round(0.6 * (bin_hi - bin_lo)))
        row = sample_led_brightness(cap, led_centers, sample_idx)
        if row is not None:
            intensities[i] = row
        if i % 128 == 0 or i == args.n_bytes - 1:
            print(f"[crawler-decode]   sampled byte {i:3d}/{args.n_bytes - 1}")

    # Each LED has its own baseline = median brightness across all 768 byte
    # samples. When byte i fires LED j, intensities[i,j] >> medians[j].
    # When byte i is padding or its LED has a dead channel, no LED's
    # diff exceeds threshold -> LUT entry is None.
    medians = np.median(intensities, axis=0)
    diffs = intensities - medians[None, :]

    print(f"[crawler-decode] resolving LUT...")
    lut: list = []
    found = 0
    padding = 0
    for i in range(args.n_bytes):
        j = int(np.argmax(diffs[i]))
        score = float(diffs[i, j])
        if score < args.threshold:
            lut.append(None)
            padding += 1
            result = None
        else:
            cx, cy = led_centers[j]
            lut.append([int(round(cx)), int(round(cy)), score])
            found += 1
            result = (int(round(cx)), int(round(cy)), score)
        if i % 64 == 0 or i == args.n_bytes - 1:
            print(f"[crawler-decode]   byte {i:3d}: {result}")

    cap.release()

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({
        "video": str(video),
        "fps": fps,
        "n_bytes": args.n_bytes,
        "roi": list(roi),
        "lut": lut,
    }, indent=2))
    print(f"[crawler-decode] wrote {out}")
    print(f"[crawler-decode] LEDs found: {found}  padding bytes: {padding}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
