"""Round-trip test for the AMMX format implementation.

For each backed-up .bin file:
  1. Read raw bytes from disk.
  2. Decode to an Animation.
  3. Re-encode back to bytes.
  4. Compare byte-for-byte against the original.

If all four pass with zero diff, our AMMX format model is exact and we can
safely generate our own .bin files for the AniMe Matrix without risking
malformed input to the ASUS service / firmware.
"""
from __future__ import annotations

import sys
from pathlib import Path

# Make project root importable when run from repo root
sys.path.insert(0, str(Path(__file__).parent.parent))

from polylux.format import ammx


def diff_first(a: bytes, b: bytes, max_show: int = 8) -> str:
    """Return a short human-readable description of the first few diffs."""
    if a == b:
        return "(identical)"
    if len(a) != len(b):
        prefix = f"length differs: {len(a)} vs {len(b)}; "
    else:
        prefix = ""
    diffs = []
    for i, (x, y) in enumerate(zip(a, b)):
        if x != y:
            diffs.append(f"@{i:#06x}: {x:#04x} vs {y:#04x}")
            if len(diffs) >= max_show:
                break
    return prefix + "; ".join(diffs)


def main() -> int:
    backups = Path(__file__).parent / "backups" / "anime"
    if not backups.exists():
        print(f"backup dir missing: {backups}")
        return 2

    files = sorted(backups.glob("*.bin"))
    if not files:
        print(f"no .bin files in {backups}")
        return 2

    all_ok = True
    for f in files:
        original = f.read_bytes()
        try:
            anim = ammx.decode(original)
        except Exception as e:
            print(f"[FAIL] {f.name}: decode error: {e}")
            all_ok = False
            continue
        encoded = ammx.encode(anim)
        ok = encoded == original
        flag = "OK  " if ok else "FAIL"
        print(
            f"[{flag}] {f.name}  size={len(original):7d}  frames={anim.frame_count:4d}  "
            f"device_flag=0x{anim.device_flag:02x}  format_flag=0x{anim.format_flag:02x}  "
            f"{diff_first(original, encoded) if not ok else ''}"
        )
        if not ok:
            all_ok = False

    print()
    print("ALL PASSED" if all_ok else "FAILURES — fix decoder/encoder before generating new content")
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
