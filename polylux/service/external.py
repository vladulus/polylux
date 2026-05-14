"""External-process manager — keeps OpenRGB + LibreHardwareMonitor running.

Polylux relies on two external binaries that we ship in ``tools/``:

  - OpenRGB        — Aura RGB control via SDK on TCP :6742
  - LibreHardwareMonitor (LHM) — fan + temp sensors via HTTP :8085

This module:
  - launches OpenRGB as a child process at service startup (user-mode,
    no UAC) and terminates it cleanly at shutdown
  - triggers the Windows scheduled task ``PolyluxLHM`` to (re)launch
    LHM if it isn't already running; the task itself runs LHM elevated
    so the WMI / sensor access just works
  - skips anything that's already running so a second Polylux instance
    or a user-launched copy doesn't get killed

On Linux / Mac the OpenRGB launch is a no-op stub for now.
"""
from __future__ import annotations

import logging
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Optional


log = logging.getLogger(__name__)


_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
_OPENRGB_EXE = _REPO_ROOT / "tools" / "OpenRGB" / "OpenRGB Windows 64-bit" / "OpenRGB.exe"
_LHM_EXE = _REPO_ROOT / "tools" / "LibreHardwareMonitor" / "LibreHardwareMonitor.exe"
_LHM_TASK_NAME = "PolyluxLHM"


_owned_procs: list[subprocess.Popen] = []


def _is_process_running(name: str) -> bool:
    """Return True if a Windows process matching ``name`` exists."""
    if sys.platform != "win32":
        return False
    try:
        out = subprocess.run(
            ["tasklist", "/FI", f"IMAGENAME eq {name}", "/NH"],
            capture_output=True, text=True, timeout=3,
        )
        return name.lower() in out.stdout.lower()
    except Exception:
        return False


def launch_openrgb() -> Optional[subprocess.Popen]:
    """Spawn OpenRGB --server if it isn't already running.

    Returns the Popen handle if we launched it, None otherwise.
    """
    if sys.platform != "win32":
        log.info("openrgb auto-launch: skipped (non-Windows)")
        return None
    if _is_process_running("OpenRGB.exe"):
        log.info("openrgb: already running, will reuse")
        return None
    if not _OPENRGB_EXE.exists():
        log.warning("openrgb: binary missing at %s — Aura RGB will fail to connect",
                    _OPENRGB_EXE)
        return None
    try:
        creationflags = 0x08000000  # CREATE_NO_WINDOW
        proc = subprocess.Popen(
            [str(_OPENRGB_EXE), "--server", "--noautoconnect"],
            cwd=str(_OPENRGB_EXE.parent),
            creationflags=creationflags,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        _owned_procs.append(proc)
        log.info("openrgb spawned pid=%d (--server)", proc.pid)
        # Give the SDK server ~0.7s to bind :6742
        time.sleep(0.7)
        return proc
    except Exception as ex:
        log.warning("openrgb launch failed: %s", ex)
        return None


def ensure_lhm() -> None:
    """Ensure LibreHardwareMonitor is running with admin rights.

    Strategy: trigger the ``PolyluxLHM`` scheduled task (which runs LHM
    elevated). If the task hasn't been registered, log a hint pointing
    at ``tools/register_lhm_task.ps1`` — that one-time setup needs UAC
    consent and isn't something we can do from the service.
    """
    if sys.platform != "win32":
        return
    if _is_process_running("LibreHardwareMonitor.exe"):
        log.info("lhm: already running")
        return
    try:
        rc = subprocess.run(
            ["schtasks", "/Run", "/TN", _LHM_TASK_NAME],
            capture_output=True, text=True, timeout=5,
        )
        if rc.returncode == 0:
            log.info("lhm: triggered scheduled task %s", _LHM_TASK_NAME)
            time.sleep(1.0)
        else:
            log.warning(
                "lhm: scheduled task %s not found — run tools/register_lhm_task.ps1 once "
                "(elevated) to register it. Dashboard fan readings will be unavailable.",
                _LHM_TASK_NAME,
            )
    except Exception as ex:
        log.warning("lhm: schtasks call failed: %s", ex)


def stop_all() -> None:
    """Terminate every child process we own. Idempotent."""
    while _owned_procs:
        proc = _owned_procs.pop()
        try:
            if proc.poll() is None:
                proc.terminate()
                try:
                    proc.wait(timeout=2)
                except subprocess.TimeoutExpired:
                    proc.kill()
                log.info("stopped child pid=%d", proc.pid)
        except Exception as ex:
            log.debug("stop_all: %s", ex)
