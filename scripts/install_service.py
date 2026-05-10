"""Install Polylux as a Windows scheduled task that auto-starts at login.

Why Task Scheduler over a real Windows Service:
  - Windows Services run in session 0 (SYSTEM) — they would NOT see the
    user's UserSessionHelper.exe (which lives in the user's session 1).
  - Polylux MUST run in the user's session to attach Frida to Helper.
  - Task Scheduler with "Run only when user is logged on" + "Run with
    highest privileges" runs in session 1, elevated, auto-launched at
    login. No UAC popup at every boot.

Run this script ONCE as administrator. After install, Polylux starts
silently every time you log in. To stop / uninstall / change config,
use scripts/uninstall_service.py or Task Scheduler GUI directly
(taskschd.msc -> Polylux).

Usage:
    Open an *elevated* PowerShell:
        python scripts/install_service.py

    To uninstall later:
        python scripts/uninstall_service.py
"""
from __future__ import annotations

import argparse
import ctypes
import getpass
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


TASK_NAME = "Polylux"
TASK_DESCRIPTION = (
    "Polylux service: lightweight free replacement for ASUS Armoury Crate. "
    "Drives ROG hardware via Frida hooks. Runs at login as the current user."
)


def _is_admin() -> bool:
    try:
        return bool(ctypes.windll.shell32.IsUserAnAdmin())
    except Exception:
        return False


def _build_task_xml(python_exe: Path, project_root: Path, user_id: str) -> str:
    """Build a Task Scheduler v2 XML manifest in the canonical format."""
    ns = "http://schemas.microsoft.com/windows/2004/02/mit/task"
    ET.register_namespace("", ns)

    # Build the XML by string template — easier to read and matches the
    # Task Scheduler GUI's canonical output exactly.
    xml = f"""<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="{ns}">
  <RegistrationInfo>
    <Description>{TASK_DESCRIPTION}</Description>
    <URI>\\{TASK_NAME}</URI>
  </RegistrationInfo>
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>
      <UserId>{user_id}</UserId>
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <UserId>{user_id}</UserId>
      <LogonType>InteractiveToken</LogonType>
      <RunLevel>HighestAvailable</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>true</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>false</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <DisallowStartOnRemoteAppSession>false</DisallowStartOnRemoteAppSession>
    <UseUnifiedSchedulingEngine>true</UseUnifiedSchedulingEngine>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <Priority>7</Priority>
    <RestartOnFailure>
      <Interval>PT1M</Interval>
      <Count>10</Count>
    </RestartOnFailure>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>{python_exe}</Command>
      <Arguments>-m polylux.service</Arguments>
      <WorkingDirectory>{project_root}</WorkingDirectory>
    </Exec>
  </Actions>
</Task>
"""
    return xml


def _install(xml_path: Path) -> None:
    cmd = ["schtasks.exe", "/Create", "/TN", TASK_NAME, "/XML", str(xml_path), "/F"]
    print(f"[+] running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[!] schtasks failed (exit {result.returncode}):")
        print(result.stdout)
        print(result.stderr)
        sys.exit(1)
    print(f"[+] {result.stdout.strip()}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--start-now",
        action="store_true",
        help="Start the task immediately after install",
    )
    parser.add_argument(
        "--xml-only",
        action="store_true",
        help="Print the Task Scheduler XML without installing",
    )
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parents[1]
    python_exe = project_root / ".venv" / "Scripts" / "python.exe"
    if not python_exe.exists():
        print(f"[!] {python_exe} not found. Set up the .venv first.")
        return 1

    user_id = f"{ctypes.create_unicode_buffer(257).value}\\{getpass.getuser()}"
    # Better way to get full domain\user form on Windows
    try:
        out = subprocess.check_output(["whoami"], text=True).strip()
        user_id = out
    except Exception:
        pass

    xml = _build_task_xml(python_exe, project_root, user_id)

    if args.xml_only:
        print(xml)
        return 0

    if not _is_admin():
        print("[!] this script must run from an *elevated* prompt (Run as administrator).")
        print("    Open Terminal -> right-click -> Run as administrator, then re-run.")
        return 1

    xml_path = project_root / "scripts" / "_polylux-task.xml"
    # Task Scheduler XML files must be UTF-16 LE with BOM
    xml_path.write_text(xml, encoding="utf-16")
    print(f"[+] wrote {xml_path}")

    _install(xml_path)
    print(f"[+] task '{TASK_NAME}' installed for user {user_id}")
    print(f"    Triggers: at user logon")
    print(f"    Privileges: highest available (no UAC at run time)")
    print(f"    Restart on failure: every 1 min, up to 10 times")

    if args.start_now:
        print()
        print(f"[+] starting task now...")
        result = subprocess.run(
            ["schtasks.exe", "/Run", "/TN", TASK_NAME],
            capture_output=True, text=True,
        )
        if result.returncode == 0:
            print(f"[+] {result.stdout.strip()}")
        else:
            print(f"[!] start failed: {result.stderr.strip()}")

    print()
    print("Manage with:")
    print(f"    taskschd.msc -> Task Scheduler Library -> {TASK_NAME}")
    print(f"    schtasks /Run    /TN {TASK_NAME}")
    print(f"    schtasks /End    /TN {TASK_NAME}")
    print(f"    schtasks /Query  /TN {TASK_NAME} /V")
    print(f"    python scripts/uninstall_service.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
