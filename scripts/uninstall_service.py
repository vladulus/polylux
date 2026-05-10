"""Remove the Polylux scheduled task installed by install_service.py.

Run from an *elevated* prompt:
    python scripts/uninstall_service.py
"""
from __future__ import annotations

import ctypes
import subprocess
import sys


TASK_NAME = "Polylux"


def _is_admin() -> bool:
    try:
        return bool(ctypes.windll.shell32.IsUserAnAdmin())
    except Exception:
        return False


def main() -> int:
    if not _is_admin():
        print("[!] this script must run from an *elevated* prompt.")
        return 1

    # Stop first (if running)
    subprocess.run(
        ["schtasks.exe", "/End", "/TN", TASK_NAME],
        capture_output=True, text=True,
    )
    # Then delete
    result = subprocess.run(
        ["schtasks.exe", "/Delete", "/TN", TASK_NAME, "/F"],
        capture_output=True, text=True,
    )
    if result.returncode == 0:
        print(f"[+] task '{TASK_NAME}' removed")
        return 0
    if "cannot find the file specified" in (result.stderr or "").lower():
        print(f"[+] task '{TASK_NAME}' was not installed; nothing to do")
        return 0
    print(f"[!] schtasks /Delete failed:")
    print(result.stdout)
    print(result.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
