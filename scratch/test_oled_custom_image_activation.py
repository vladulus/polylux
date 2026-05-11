r"""Live test — does the full OLED Custom Image trailer activate display?

Hypothesis (from 2026-05-12 pcap analysis of oled_p1, oled_custom_p1,
full_init_p1_v2):

  Full upload sequence is:
    ec 72 01 00 01 ...          register upload
    ec 51 00 ...                lock
    ec 73 01 ...                start send
    ec 7f 02 sLO sHI ...        bulk prep with 16-bit LE size
    BULK <padded image>         GIF data
    ec 73 ff ...                end / commit upload          ← was missing
    ec 51 10 01 01 ...          switch to image-display mode ← was missing
    ec 5c 01 01 ...             refresh / activate            ← was missing

Polylux's upload_image() only sends the first 5 (no trailer). This
explains why upload completes byte-correctly but display never changes.

Test plan:
  1. Open Chip1A21 (no kill needed if Aac3572MbHal isn't blocking).
  2. Init for matrix (full reset to known state).
  3. Generate a high-contrast GIF87a 256x64 (white text on black).
  4. Upload via existing upload_image().
  5. Send the 3 missing trailer commands.
  6. Pause for Vlad to observe OLED.

If OLED shows the custom image: hypothesis confirmed, document and bake
into driver.
If not: try variants (skip ec 51 10 01 01, try different ec 5c byte,
  fall back to mode-switch sweep).
"""
from __future__ import annotations

import io
import sys
import time
from pathlib import Path


def make_test_gif() -> bytes:
    """Make a 256x64 GIF87a with high-contrast diagonal stripes + 'POLYLUX' text.

    Single-frame. Anything visible will be obvious vs hw-monitor temps.
    """
    from PIL import Image, ImageDraw, ImageFont

    img = Image.new("L", (256, 64), color=0)  # black
    draw = ImageDraw.Draw(img)
    # Diagonal stripes
    for x in range(-64, 256, 8):
        draw.line([(x, 0), (x + 64, 64)], fill=255, width=2)
    # Big text "POLYLUX" centered
    try:
        font = ImageFont.truetype("arial.ttf", 32)
    except OSError:
        font = ImageFont.load_default()
    txt = "POLYLUX"
    bbox = draw.textbbox((0, 0), txt, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    # White text with black halo for contrast against stripes
    cx = (256 - w) // 2
    cy = (64 - h) // 2
    for ox in (-1, 0, 1):
        for oy in (-1, 0, 1):
            draw.text((cx + ox, cy + oy), txt, fill=0, font=font)
    draw.text((cx, cy), txt, fill=255, font=font)

    buf = io.BytesIO()
    img.save(buf, format="GIF", version="GIF87a")
    return buf.getvalue()


def kill_blocking_processes() -> None:
    """Kill the autonomous OLED writer if it's running. Safe to call repeatedly."""
    import subprocess
    targets = ["Aac3572MbHal_x86", "ArmouryCrate.UserSessionHelper",
               "ArmouryCrate.Service", "LightingService"]
    for name in targets:
        # taskkill returns 128 if process not found — ignore
        result = subprocess.run(
            ["taskkill", "/F", "/IM", f"{name}.exe"],
            capture_output=True, text=True,
        )
        if result.returncode == 0:
            print(f"  killed {name}")
        else:
            print(f"  {name} not running (or already killed)")


def main() -> int:
    # Make sure we're importing from the repo
    sys.path.insert(0, str(Path(__file__).parent.parent))
    from polylux.drivers.chip_1a21 import Chip1A21
    from polylux.drivers.anime_matrix import AniMeMatrix
    from polylux.drivers.livedash_oled import LiveDashOLED

    print("=" * 60)
    print("OLED Custom Image activation test")
    print("=" * 60)

    print("\n[1/6] Killing blocking processes...")
    kill_blocking_processes()
    time.sleep(0.5)

    print("\n[2/6] Opening chip + init...")
    chip = Chip1A21.open()
    try:
        chip.init_for_matrix()
        print("  init OK")

        # Smoke test: blank matrix to confirm we own the chip
        matrix = AniMeMatrix(chip)
        matrix.clear()
        matrix.flush()
        print("  matrix cleared (chip accessible)")

        print("\n[3/6] Generating test GIF87a 256x64...")
        gif_bytes = make_test_gif()
        print(f"  generated {len(gif_bytes)} bytes, magic={gif_bytes[:6]!r}")

        print("\n[4/6] Uploading image to OLED (existing upload_image)...")
        oled = LiveDashOLED(chip)
        # NOTE: we do NOT call set_text() — that would send ec 51 09 (text mode)
        # which we don't want. We want to stay in image-mode after upload.
        oled.upload_image(gif_bytes)
        print("  upload sequence sent (ec 72 + ec 51 00 + ec 73 + ec 7f 02 + BULK)")
        time.sleep(0.1)

        print("\n[5/6] Sending missing trailer: ec 73 ff + ec 51 10 01 01 + ec 5c 01 01...")
        # ec 73 ff = end / commit upload
        p_commit = bytes([0xEC, 0x73, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00]) + b"\x00" * 57
        chip.hid_write(p_commit)
        time.sleep(0.1)

        # ec 51 10 01 01 = image-display mode (formerly thought Q-Code)
        p_imode = bytes([0xEC, 0x51, 0x10, 0x01, 0x01, 0x00, 0x00, 0x00]) + b"\x00" * 57
        chip.hid_write(p_imode)
        time.sleep(0.1)

        # ec 5c 01 01 = refresh / activate
        p_refresh = bytes([0xEC, 0x5C, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00]) + b"\x00" * 57
        chip.hid_write(p_refresh)
        print("  trailer sent")

        print("\n[6/6] HOLDING for 15 seconds. LOOK AT THE OLED NOW.")
        print("  Expected if hypothesis correct: diagonal stripes + 'POLYLUX' text.")
        print("  If you see temperatures: hypothesis fails OR Aac3572MbHal restarted.")
        print("  If you see blank/static junk: partial activation.")
        for i in range(15, 0, -1):
            print(f"  {i}s...", end="\r")
            time.sleep(1)
        print()

    finally:
        chip.close()

    print("\nDONE. Tell me what you saw on the OLED.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
