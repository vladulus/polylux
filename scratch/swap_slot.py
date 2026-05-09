"""Swap an AniMe Matrix slot on the live install with our test pattern,
or restore from backup.

Usage:
    python scratch/swap_slot.py install   # copies test_pattern.bin -> slot 1
    python scratch/swap_slot.py restore   # copies backups/anime/1.bin -> slot 1

Why slot 1? It's the slot most likely to be the user's "currently playing"
animation (stock Armoury Crate UI typically pre-selects slot 1 when you
open the AniMe Matrix page). If your active slot is different, edit
SLOT_INDEX below.
"""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

SLOT_INDEX = 1  # which .bin to overwrite (1..4)
LIVE_DIR = Path(
    r"C:\Program Files (x86)\ASUS\ArmouryDevice\View"
    r"\E7C8DA76-C9B9-4297-8681-DD878330AFE7\externalFiles"
)
BACKUP_DIR = Path(__file__).parent / "backups" / "anime"
TEST_PATTERN = Path(__file__).parent / "test_pattern.bin"


def install() -> int:
    if not TEST_PATTERN.exists():
        print(f"ERROR: test pattern not found at {TEST_PATTERN}")
        print("       run `python scratch/make_test_anim.py` first")
        return 1
    target = LIVE_DIR / f"{SLOT_INDEX}.bin"
    if not target.exists():
        print(f"ERROR: live slot file missing: {target}")
        return 1
    print(f"copying {TEST_PATTERN.name} -> {target}")
    shutil.copyfile(TEST_PATTERN, target)
    sz = target.stat().st_size
    print(f"  installed, slot {SLOT_INDEX} now {sz} bytes")
    print()
    print("Vlad: open Armoury Crate, navigate to AniMe Matrix on motherboard,")
    print("      select slot", SLOT_INDEX, "if not already selected, and click")
    print("      'Apply' (or whatever the action button is called).")
    print("      Tell me what you see on the physical matrix.")
    return 0


def restore() -> int:
    src = BACKUP_DIR / f"{SLOT_INDEX}.bin"
    if not src.exists():
        print(f"ERROR: backup not found: {src}")
        return 1
    target = LIVE_DIR / f"{SLOT_INDEX}.bin"
    print(f"restoring {src} -> {target}")
    shutil.copyfile(src, target)
    sz = target.stat().st_size
    print(f"  restored, slot {SLOT_INDEX} back to {sz} bytes")
    return 0


def main() -> int:
    if len(sys.argv) != 2 or sys.argv[1] not in {"install", "restore"}:
        print(__doc__)
        return 2
    return install() if sys.argv[1] == "install" else restore()


if __name__ == "__main__":
    sys.exit(main())
