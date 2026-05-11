r"""Brute-force sweep for OLED Custom Image activation — observational.

Setup:
  kill ASUS daemons, open chip (NO matrix init), ec 51 15 reset,
  upload test GIF87a 256x64.

Loop:
  For each of N candidate activation commands:
    1. Print BIG visible candidate number + hex
    2. Send command(s)
    3. Hold 2 seconds
    4. Reset state (ec 51 15) to keep tests independent
    5. Continue

Vlad watches OLED throughout. At end, types the candidate number where
something visible happened. We mark that as the winner.
"""
from __future__ import annotations

import io
import subprocess
import sys
import time
from pathlib import Path


def hex_str(bs: bytes) -> str:
    return " ".join(f"{b:02x}" for b in bs)


def kill_asus():
    targets = ["Aac3572MbHal_x86", "ArmouryCrate.UserSessionHelper",
               "ArmouryCrate.Service", "LightingService"]
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


def pad65(prefix: bytes) -> bytes:
    return prefix + b"\x00" * (65 - len(prefix))


CANDIDATES = [
    ("Full AC trailer: 73 ff + 51 10 01 01 + dc + 5c 01 01",
     [bytes([0xEC, 0x73, 0xFF]),
      bytes([0xEC, 0x51, 0x10, 0x01, 0x01]),
      bytes([0xEC, 0xDC]),
      bytes([0xEC, 0x5C, 0x01, 0x01])]),
    ("ec 51 10 01 01 alone",
     [bytes([0xEC, 0x51, 0x10, 0x01, 0x01])]),
    ("ec 5c 01 01 alone",
     [bytes([0xEC, 0x5C, 0x01, 0x01])]),
    ("ec 51 10 02 02",
     [bytes([0xEC, 0x51, 0x10, 0x02, 0x02])]),
    ("ec 51 10 03 03",
     [bytes([0xEC, 0x51, 0x10, 0x03, 0x03])]),
    ("ec 51 10 04 04",
     [bytes([0xEC, 0x51, 0x10, 0x04, 0x04])]),
    ("ec 51 10 02 01",
     [bytes([0xEC, 0x51, 0x10, 0x02, 0x01])]),
    ("ec 51 10 00 01",
     [bytes([0xEC, 0x51, 0x10, 0x00, 0x01])]),
    ("ec 51 10 01 00",
     [bytes([0xEC, 0x51, 0x10, 0x01, 0x00])]),
    ("ec 5c 02 01",
     [bytes([0xEC, 0x5C, 0x02, 0x01])]),
    ("ec 5c 00 01",
     [bytes([0xEC, 0x5C, 0x00, 0x01])]),
    ("ec 5d 01 01",
     [bytes([0xEC, 0x5D, 0x01, 0x01])]),
    ("ec af 01 01",
     [bytes([0xEC, 0xAF, 0x01, 0x01])]),
    ("ec 71 01 01 (Ryujin switch — try here too)",
     [bytes([0xEC, 0x71, 0x01, 0x01])]),
    ("ec 51 10 + ec 5c 01 01",
     [bytes([0xEC, 0x51, 0x10]),
      bytes([0xEC, 0x5C, 0x01, 0x01])]),
    ("ec 73 ff + ec 5c 01 01 (commit + refresh, no mode)",
     [bytes([0xEC, 0x73, 0xFF]),
      bytes([0xEC, 0x5C, 0x01, 0x01])]),
    ("Paranoid: 73ff + dc + 51 10 01 01 + dc + 5c 01 01 + dc",
     [bytes([0xEC, 0x73, 0xFF]),
      bytes([0xEC, 0xDC]),
      bytes([0xEC, 0x51, 0x10, 0x01, 0x01]),
      bytes([0xEC, 0xDC]),
      bytes([0xEC, 0x5C, 0x01, 0x01]),
      bytes([0xEC, 0xDC])]),
]


def main() -> int:
    sys.path.insert(0, str(Path(__file__).parent.parent))
    from polylux.drivers.chip_1a21 import Chip1A21
    from polylux.drivers.livedash_oled import LiveDashOLED

    print("=" * 60)
    print("OLED Custom Image — brute force sweep (observational)")
    print("=" * 60)
    print("\nKilling ASUS daemons...")
    kill_asus()
    time.sleep(0.5)

    print("Opening chip (no matrix init)...")
    chip = Chip1A21.open()

    try:
        print("Sending ec 51 15 (EXIT preset, reset state)")
        chip.hid_write(pad65(bytes([0xEC, 0x51, 0x15])))
        time.sleep(0.2)

        gif_bytes = make_test_gif()
        print(f"\nGenerated test GIF: {len(gif_bytes)} bytes")
        oled = LiveDashOLED(chip)
        oled.upload_image(gif_bytes)
        print("Upload done")
        time.sleep(0.3)

        n = len(CANDIDATES)
        print(f"\nSweep ready: {n} candidates. Pauza dupa fiecare.")
        print("Input dupa fiecare:")
        print("  [Enter]   = urmatorul candidat")
        print("  text      = nota observatia (ex: 'apare imagine', 'dungi', 'q-code')")
        print("  r         = re-upload imagine")
        print("  x         = reset state (ec 51 15)")
        print("  q         = stop sweep\n")
        time.sleep(1)

        observations: list[tuple[int, str, str]] = []
        for i, (desc, packets) in enumerate(CANDIDATES, 1):
            print(f"\n##### [{i:02d}/{n}] {desc} #####")
            for pkt in packets:
                print(f"        send: {hex_str(pkt)}")
                chip.hid_write(pad65(pkt))
                time.sleep(0.08)
            print(f"        >>> uita-te la OLED. ", end="", flush=True)
            ans = input("obs: ").strip()
            if ans.lower() == "q":
                print("Stop.")
                break
            if ans.lower() == "x":
                print("        reset state (ec 51 15)")
                chip.hid_write(pad65(bytes([0xEC, 0x51, 0x15])))
                time.sleep(0.2)
            elif ans.lower() == "r":
                print("        re-upload imagine")
                chip.hid_write(pad65(bytes([0xEC, 0x51, 0x15])))
                time.sleep(0.1)
                oled.upload_image(gif_bytes)
                time.sleep(0.2)
            elif ans:
                observations.append((i, desc, ans))
                print(f"        salvat: '{ans}'")
            # Always reset between candidates so each test is independent
            chip.hid_write(pad65(bytes([0xEC, 0x51, 0x15])))
            time.sleep(0.2)

        print("\n" + "=" * 60)
        print("OBSERVATII salvate:")
        if observations:
            for i, desc, obs in observations:
                print(f"  [{i:02d}] {desc}")
                print(f"       -> {obs}")
            log_path = Path(__file__).parent / "captures" / "oled_brute_result.txt"
            log_path.parent.mkdir(exist_ok=True)
            with log_path.open("w", encoding="utf-8") as f:
                f.write("OLED brute-force sweep results\n")
                f.write("=" * 60 + "\n")
                for i, desc, obs in observations:
                    f.write(f"[{i:02d}] {desc}\n     -> {obs}\n")
            print(f"\nSaved to {log_path}")
        else:
            print("  (none)")
        print("=" * 60)
    finally:
        chip.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
