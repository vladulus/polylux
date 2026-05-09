"""Test: does LightingService auto-reload current.json on file change?

Approach:
  1. Read AppData\\...\\MatrixDeviceData\\<device>\\ScenarioProfile\\System\\current.json
  2. Save a backup
  3. Modify the TextColor RGB from (251,253,88) yellow to (255,0,0) red
  4. Wait 8 seconds — observer (Vlad) watches the matrix
  5. Restore the backup, wait 5 more seconds
  6. Print result

Vlad reports: did the color change to red, then back to yellow?
  - YES  -> LightingService watches the file. Polylux can drive the
            matrix purely by writing JSON. No WebSocket needed.
  - NO   -> Need active trigger. Likely a WebSocket command we still
            need to discover, OR a Win32 signal / named pipe.
"""
from __future__ import annotations

import json
import re
import shutil
import sys
import time
from pathlib import Path

LIVE_PATH = Path(
    r"C:\Users\vlad\AppData\Local\Packages\B9ECED6F.ArmouryCrate_qmba6cd70vzyy"
    r"\LocalState\MatrixDeviceData\ROG MAXIMUS Z690 EXTREME_0"
    r"\ScenarioProfile\System\current.json"
)
BACKUP_PATH = Path(__file__).parent / "backups" / "current.json.original"

NEW_R, NEW_G, NEW_B = 255, 0, 0  # RED, very obvious change from yellow

WAIT_SECONDS = 8


def main() -> int:
    if not LIVE_PATH.exists():
        print(f"ERROR: {LIVE_PATH} does not exist")
        return 1

    # Save backup
    BACKUP_PATH.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(LIVE_PATH, BACKUP_PATH)
    print(f"[+] backup saved -> {BACKUP_PATH}")

    original = LIVE_PATH.read_text(encoding="utf-8")

    # The fx field is a JSON string ENCODED inside the parent JSON. The
    # color appears in two forms:
    #   - "color":[255,255,255]  (per-text-layer in the inner fx string)
    #   - "TextColorR[0]":"251","TextColorG[0]":"253","TextColorB[0]":"88"
    # We mutate both to maximize the odds of LightingService reading the
    # one it cares about.
    modified = original

    # 1) outer TextColorR/G/B fields (note: original has whitespace after colon)
    modified = re.sub(r'("TextColorR\[0\]"\s*:\s*)"\d+"', rf'\1"{NEW_R}"', modified)
    modified = re.sub(r'("TextColorG\[0\]"\s*:\s*)"\d+"', rf'\1"{NEW_G}"', modified)
    modified = re.sub(r'("TextColorB\[0\]"\s*:\s*)"\d+"', rf'\1"{NEW_B}"', modified)

    # 2) inner per-layer "color":[r,g,b] arrays (escaped because they live in
    # the embedded "fx" JSON string)
    modified = re.sub(
        r'\\"color\\":\[(?:\d+,){2}\d+\]',
        f'\\\\"color\\\\":[{NEW_R},{NEW_G},{NEW_B}]',
        modified,
    )

    # Sanity: report how many fields changed
    n_outer = sum(1 for k in ("TextColorR", "TextColorG", "TextColorB") if f'"{k}[0]":' in original)
    n_inner = original.count('\\"color\\":')
    print(f"[i] outer TextColor fields present: {n_outer} (will be replaced)")
    print(f"[i] inner per-layer color arrays present: {n_inner} (will be replaced)")

    if modified == original:
        print("[!] no replacements made — file format may have changed")
        return 1

    LIVE_PATH.write_text(modified, encoding="utf-8")
    print(f"[+] live file updated to red @ {time.strftime('%H:%M:%S')}")
    print(f"    --- VLAD: look at the matrix NOW. Color should be RED. ---")
    for i in range(WAIT_SECONDS, 0, -1):
        print(f"    waiting {i}s before restore...")
        time.sleep(1)

    LIVE_PATH.write_text(original, encoding="utf-8")
    print(f"[+] restored original yellow color @ {time.strftime('%H:%M:%S')}")
    print(f"    --- VLAD: matrix should be back to YELLOW now. ---")
    print()
    print("Vlad, please report:")
    print("  1. Did the color change to RED at all?")
    print("  2. If yes — did it change back to YELLOW after restore?")
    print("  3. Or did the matrix never visually change?")
    return 0


if __name__ == "__main__":
    sys.exit(main())
