"""
Dump exported function names from ASUS SDK DLLs.

Run from project root with the venv Python:
    .venv/Scripts/python.exe scratch/dump_sdk_exports.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import pefile

DLLS = [
    r"C:/Program Files (x86)/ASUS/ArmouryDevice/dll/AIOFanSDK/ArmouryAIOSDK.dll",
    r"C:/Program Files (x86)/ASUS/ArmouryDevice/dll/MBLedSDK/ArmouryMBLedSDK.dll",
    r"C:/Program Files/ASUS/AuraSDK/AuraSdk_x64.dll",
    # also probe other interesting candidates:
    r"C:/Program Files (x86)/ASUS/ArmouryDevice/dll/AIOFanSDK/InstallHelper.dll",
    r"C:/Program Files (x86)/ASUS/ArmouryDevice/dll/MBLedSDK/A110402.dll",
    r"C:/Program Files (x86)/ASUS/ArmouryDevice/dll/MBLedSDK/A120002.dll",
]


def dump(path: str) -> None:
    p = Path(path)
    print(f"\n=== {p.name} ({p.parent.name}) ===")
    if not p.exists():
        print("  (file not found)")
        return
    try:
        pe = pefile.PE(str(p), fast_load=True)
        pe.parse_data_directories(directories=[
            pefile.DIRECTORY_ENTRY["IMAGE_DIRECTORY_ENTRY_EXPORT"]
        ])
    except Exception as e:
        print(f"  pefile error: {e}")
        return

    if not hasattr(pe, "DIRECTORY_ENTRY_EXPORT"):
        print("  (no exports)")
        return

    exports = pe.DIRECTORY_ENTRY_EXPORT.symbols
    print(f"  {len(exports)} exports:")
    for sym in exports:
        if sym.name:
            name = sym.name.decode("latin-1")
        else:
            name = f"<ordinal {sym.ordinal}>"
        print(f"    {name}")


def main() -> int:
    for d in DLLS:
        dump(d)
    return 0


if __name__ == "__main__":
    sys.exit(main())
