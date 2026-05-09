"""Test 2: modify ApplyStatusFile.xml (not current.json) and wait longer.

ApplyStatusFile.xml is the "live applied" file written when the Armoury Crate
UI clicks Apply. It has the colors as <scr><scg><scb> (251/253/88 = yellow).

If LightingService polls this file at any interval up to ~25s, we'll see
the change. If it only reads on IPC notification, we still won't.
"""
from __future__ import annotations

import re
import shutil
import sys
import time
from pathlib import Path

LIVE_PATH = Path(
    r"C:\Users\vlad\AppData\Local\Packages\B9ECED6F.ArmouryCrate_qmba6cd70vzyy"
    r"\LocalState\MatrixDeviceData\ROG MAXIMUS Z690 EXTREME_0"
    r"\ApplyImageData\ApplyStatusFile.xml"
)
BACKUP = Path(__file__).parent / "backups" / "ApplyStatusFile.xml.original"

WAIT_SECONDS = 30  # longer window in case the daemon polls slowly


def main() -> int:
    if not LIVE_PATH.exists():
        print(f"ERROR: {LIVE_PATH}")
        return 1

    BACKUP.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(LIVE_PATH, BACKUP)
    print(f"[+] backup -> {BACKUP}")

    original = LIVE_PATH.read_text(encoding="utf-8")
    print(f"[i] original content:")
    print(original.strip()[:400])

    # Replace <scr>251</scr><scg>253</scg><scb>88</scb> with red
    modified = original
    modified = re.sub(r"<scr>\d+</scr>", "<scr>255</scr>", modified)
    modified = re.sub(r"<scg>\d+</scg>", "<scg>0</scg>", modified)
    modified = re.sub(r"<scb>\d+</scb>", "<scb>0</scb>", modified)

    if modified == original:
        print("[!] no replacements — pattern mismatch")
        return 1

    LIVE_PATH.write_text(modified, encoding="utf-8")
    print(f"[+] file rewritten with red @ {time.strftime('%H:%M:%S')}")
    print(f"[!] VLAD: watch the matrix for the next {WAIT_SECONDS}s")
    for i in range(WAIT_SECONDS, 0, -1):
        if i % 5 == 0 or i <= 3:
            print(f"    {i}s remaining...")
        time.sleep(1)

    LIVE_PATH.write_text(original, encoding="utf-8")
    print(f"[+] restored @ {time.strftime('%H:%M:%S')}")
    print()
    print("Vlad, did the matrix turn RED at any point during those 30s?")
    return 0


if __name__ == "__main__":
    sys.exit(main())
