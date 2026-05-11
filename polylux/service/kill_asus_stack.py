"""Kill the ASUS userland stack so Polylux owns chip 1A21.

Aac3572MbHal_x86.exe is the autonomous OLED+LCD writer. It's a Windows
service-supervised process — taskkill-ing it as a regular user works,
but the supervising service respawns it within seconds. Stopping the
service properly requires admin (SeServicePrivilege).

This module exposes two strategies:

  1. `kill_processes()` — non-admin, kills running ASUS processes by
     name. Returns immediately. Aac3572MbHal will respawn ~30s later
     unless the parent service is also stopped.

  2. `stop_services()` — best-effort. Tries `Stop-Service` directly;
     if access denied, falls back to UAC-elevation via
     `Start-Process -Verb RunAs` (which prompts the user). Setting
     start type to Manual prevents auto-restart on next boot.

Service names on a ROG Z690 Extreme installation:
  - ArmouryCrateService
  - AsusCertService          (parent of Aac3572MbHal child processes)
  - AsusFanControlService
  - LightingService
  - ROGLiveService (sometimes ROGLiveServiceV2)

The aggressive kill list of processes (some may not exist depending on
install state):
  - Aac3572MbHal_x86         (CRITICAL — autonomous chip writer)
  - Aac3572DramHal_x86
  - ArmouryCrate
  - ArmouryCrate.Service
  - ArmouryCrate.UserSessionHelper
  - ArmouryCrateControlInterface
  - ArmouryHtmlDebugServer
  - ArmourySocketServer
  - ArmourySwAgent
  - asus_framework
  - LightingService
  - ROGLiveService
"""
from __future__ import annotations

import logging
import subprocess
from typing import Iterable

log = logging.getLogger(__name__)


ASUS_PROCESSES = (
    "Aac3572MbHal_x86",
    "Aac3572DramHal_x86",
    "ArmouryCrate",
    "ArmouryCrate.Service",
    "ArmouryCrate.UserSessionHelper",
    "ArmouryCrateControlInterface",
    "ArmouryHtmlDebugServer",
    "ArmourySocketServer",
    "ArmourySwAgent",
    "asus_framework",
    "LightingService",
    "ROGLiveService",
)

ASUS_SERVICES = (
    "ArmouryCrateService",
    "AsusCertService",
    "AsusFanControlService",
    "LightingService",
    "ROGLiveService",
    "ROGLiveServiceV2",
)


def kill_processes(names: Iterable[str] = ASUS_PROCESSES) -> dict[str, bool]:
    """Force-kill ASUS userland processes. Non-admin OK. Idempotent.

    Returns a dict mapping process name to whether it was killed
    (False = wasn't running, also fine).
    """
    results: dict[str, bool] = {}
    for name in names:
        proc = subprocess.run(
            ["taskkill", "/F", "/IM", f"{name}.exe"],
            capture_output=True, text=True,
        )
        killed = proc.returncode == 0
        results[name] = killed
        if killed:
            log.info("killed %s.exe", name)
    return results


def _services_running(names: Iterable[str]) -> list[str]:
    """Return names of services that are currently Running. Read-only,
    no admin required. Names not found on the system are skipped."""
    names = list(names)
    name_list = ",".join(names)
    script = (
        f"Get-Service -Name {name_list} -ErrorAction SilentlyContinue "
        f"| Where-Object {{ $_.Status -eq 'Running' }} "
        f"| ForEach-Object {{ $_.Name }}"
    )
    proc = subprocess.run(
        ["powershell.exe", "-NoProfile", "-Command", script],
        capture_output=True, text=True,
    )
    if proc.returncode != 0:
        return []
    return [n.strip() for n in proc.stdout.splitlines() if n.strip()]


def stop_services(names: Iterable[str] = ASUS_SERVICES,
                  set_manual: bool = True,
                  elevate_if_needed: bool = True) -> bool:
    """Stop ASUS Windows services so they don't respawn Aac3572MbHal etc.

    Pre-check: if no target service is currently Running, no-op (no UAC).

    Args:
      names: services to stop.
      set_manual: also set their start type to Manual.
      elevate_if_needed: trigger UAC via Start-Process -Verb RunAs.

    Returns True if services were already stopped or successfully stopped.
    """
    names = list(names)
    running = _services_running(names)
    if not running:
        log.info("ASUS services already stopped — no UAC needed.")
        return True
    log.info("Running ASUS services that need stopping: %s", ", ".join(running))

    name_list = ",".join(names)
    direct_script = f"Stop-Service -Name {name_list} -Force -ErrorAction Continue"
    if set_manual:
        manual_lines = " ; ".join(
            f"Set-Service {n} -StartupType Manual -ErrorAction SilentlyContinue"
            for n in names
        )
        direct_script += f" ; {manual_lines}"

    proc = subprocess.run(
        ["powershell.exe", "-NoProfile", "-Command", direct_script],
        capture_output=True, text=True,
    )
    direct_ok = proc.returncode == 0 and "Cannot open" not in proc.stderr
    if direct_ok:
        log.info("Stopped ASUS services directly (had admin token).")
        return True

    if not elevate_if_needed:
        log.warning("Could not stop services without admin: %s", proc.stderr.strip()[:200])
        return False

    log.info("Direct Stop-Service blocked. Triggering UAC elevation...")

    # Write the elevated script to a temp .ps1 file — avoids the
    # quoting hell of passing a multi-statement script through
    # nested PowerShell invocations.
    import tempfile
    elevated_body = direct_script + "\nStart-Sleep -Seconds 2\n"
    tf = tempfile.NamedTemporaryFile(
        mode="w", suffix=".ps1", delete=False, encoding="utf-8"
    )
    try:
        tf.write(elevated_body)
        tf.close()
        ps1_path = tf.name

        # Wrap Start-Process call so the outer (non-elevated) shell
        # waits for UAC + the elevated child to complete.
        launcher = (
            f"Start-Process -Verb RunAs -Wait -FilePath powershell.exe "
            f"-ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass',"
            f"'-File','{ps1_path}')"
        )
        elevation = subprocess.run(
            ["powershell.exe", "-NoProfile", "-Command", launcher],
            capture_output=True, text=True,
        )
        if elevation.returncode == 0:
            log.info("Elevated Stop-Service completed.")
            return True
        log.warning("UAC-elevated Stop-Service failed: %s",
                    (elevation.stderr or elevation.stdout).strip()[:200])
        return False
    finally:
        try:
            import os
            os.unlink(ps1_path)
        except Exception:
            pass


def kill_asus_stack(stop_services_first: bool = True) -> None:
    """Full takedown: stop services (so respawn is disabled), then kill
    any remaining processes. Call this at Polylux service startup.

    If admin not available and elevate_if_needed=False, falls back to
    process-kill only and relies on the caller's tight loop to keep
    Aac3572MbHal dead (it'll respawn every ~30s).
    """
    if stop_services_first:
        stop_services(elevate_if_needed=True)
    kill_processes()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
                        datefmt="%H:%M:%S")
    kill_asus_stack()
