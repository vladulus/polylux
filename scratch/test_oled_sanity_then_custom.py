r"""Diagnostic v2 — confirm OLED is alive before re-testing Custom Image.

Plan:
  1. Kill ASUS daemons.
  2. Open chip + init.
  3. Try set_text("HELLO", "OLED") — should display text if OLED alive.
  4. Wait 5s, ask Vlad: does text appear?
  5. Then re-test Custom Image trailer (different variants if needed).
"""
from __future__ import annotations

import io
import subprocess
import sys
import time
from pathlib import Path


def kill_asus():
    targets = ["Aac3572MbHal_x86", "ArmouryCrate.UserSessionHelper",
               "ArmouryCrate.Service", "LightingService", "ROGLiveService"]
    for name in targets:
        subprocess.run(["taskkill", "/F", "/IM", f"{name}.exe"],
                       capture_output=True, text=True)


def make_test_gif() -> bytes:
    from PIL import Image, ImageDraw, ImageFont
    img = Image.new("L", (256, 64), color=0)
    draw = ImageDraw.Draw(img)
    for x in range(-64, 256, 8):
        draw.line([(x, 0), (x + 64, 64)], fill=255, width=2)
    try:
        font = ImageFont.truetype("arial.ttf", 32)
    except OSError:
        font = ImageFont.load_default()
    draw.text((50, 16), "POLYLUX", fill=255, font=font)
    buf = io.BytesIO()
    img.save(buf, format="GIF", version="GIF87a")
    return buf.getvalue()


def main() -> int:
    sys.path.insert(0, str(Path(__file__).parent.parent))
    from polylux.drivers.chip_1a21 import Chip1A21
    from polylux.drivers.livedash_oled import LiveDashOLED

    print("Killing ASUS daemons...")
    kill_asus()
    time.sleep(0.5)

    print("\n=== TEST 1: OLED sanity (set_text) ===")
    chip = Chip1A21.open()
    try:
        chip.init_for_matrix()
        oled = LiveDashOLED(chip)
        oled.set_text("HELLO", "OLED ALIVE?")
        print("Sent ec 51 09 (text mode) + ec 53 'HELLO' / 'OLED ALIVE?'")
        print("\n>>> LOOK AT OLED. Text expected. Holding 8 seconds.")
        for i in range(8, 0, -1):
            print(f"  {i}s...", end="\r")
            time.sleep(1)
        print("\n\nIf text appeared = OLED hardware OK, Custom Image is the only TBD.")
        print("If still black = OLED needs deeper wake-up. We pause for diagnosis.")
    finally:
        chip.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
