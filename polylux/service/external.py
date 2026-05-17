"""External-process manager — keeps OpenRGB + the Polylux sensor daemon running.

Polylux relies on two external binaries that we ship in ``tools/``:

  - OpenRGB                — Aura RGB control via SDK on TCP :6742
  - Polylux Sensor Daemon  — LibreHardwareMonitorLib wrapper exposing the
                             LHM-compatible JSON tree on HTTP :8085

This module:
  - launches OpenRGB as a child process at service startup (user-mode,
    no UAC) and terminates it cleanly at shutdown
  - ensures the sensor daemon is running. Strategy, in order:
      1. If the Windows service ``PolyluxSensorDaemon`` is installed,
         start it (zero-UAC if the service is set to run as LocalSystem
         with auto-start at boot — the normal case after install).
      2. Otherwise, fall back to spawning the published exe as a child
         process (dev / unconfigured mode). LHM sensor access needs
         admin; if Polylux itself isn't elevated, the daemon still runs
         but most sensors will report ``-`` until elevated.
      3. If neither path is available (exe missing, service not
         installed), log a hint pointing at the install script.

Background: v0.4 bundled the LibreHardwareMonitor GUI via a scheduled
task, which polluted the system tray. v0.5 replaces that with the
in-house headless daemon at ``tools/PolyluxSensorDaemon/`` (see §17 in
``docs/PROJECT_STATE.md``). The old scheduled-task path is gone.

On Linux / Mac the OpenRGB launch is a no-op stub for now.
"""
from __future__ import annotations

import logging
import subprocess
import sys
import time
from pathlib import Path
from typing import Optional


log = logging.getLogger(__name__)


_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
_OPENRGB_EXE = _REPO_ROOT / "tools" / "OpenRGB" / "OpenRGB Windows 64-bit" / "OpenRGB.exe"
_SENSOR_DAEMON_EXE = (
    _REPO_ROOT / "tools" / "PolyluxSensorDaemon" / "publish" / "PolyluxSensorDaemon.exe"
)
_SENSOR_SERVICE_NAME = "PolyluxSensorDaemon"


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


def _sensor_service_state() -> Optional[str]:
    """Return ``RUNNING`` / ``STOPPED`` / etc. for the daemon service, or None if uninstalled."""
    if sys.platform != "win32":
        return None
    try:
        out = subprocess.run(
            ["sc", "query", _SENSOR_SERVICE_NAME],
            capture_output=True, text=True, timeout=3,
        )
        if out.returncode != 0:
            return None
        for line in out.stdout.splitlines():
            line = line.strip()
            if line.startswith("STATE"):
                # "STATE              : 4  RUNNING"
                parts = line.split()
                return parts[-1] if parts else None
        return None
    except Exception:
        return None


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


def ensure_sensor_daemon() -> None:
    """Ensure the Polylux sensor daemon is up so Dashboard can read fans/temps.

    Order of preference:
      1. Windows service ``PolyluxSensorDaemon`` (the prod install path).
      2. Spawn the published exe as a child process (dev fallback).
      3. Log a hint if neither path is available.
    """
    if sys.platform != "win32":
        return

    if _is_process_running("PolyluxSensorDaemon.exe"):
        log.info("sensor daemon: already running")
        return

    state = _sensor_service_state()
    if state is not None:
        if state.upper() == "RUNNING":
            log.info("sensor daemon: service %s already RUNNING", _SENSOR_SERVICE_NAME)
            return
        try:
            rc = subprocess.run(
                ["sc", "start", _SENSOR_SERVICE_NAME],
                capture_output=True, text=True, timeout=5,
            )
            if rc.returncode == 0:
                log.info("sensor daemon: started service %s", _SENSOR_SERVICE_NAME)
                time.sleep(1.0)
                return
            log.warning(
                "sensor daemon: 'sc start %s' failed rc=%d, falling back to subprocess",
                _SENSOR_SERVICE_NAME, rc.returncode,
            )
        except Exception as ex:
            log.warning("sensor daemon: sc start raised %s, falling back", ex)

    # Fallback: spawn the published exe directly.
    if not _SENSOR_DAEMON_EXE.exists():
        log.warning(
            "sensor daemon: not installed and exe missing at %s. Build with "
            "tools/build_sensor_daemon.ps1, then install as a Windows service "
            "with tools/install_sensor_daemon_service.ps1 (elevated, one time).",
            _SENSOR_DAEMON_EXE,
        )
        return

    try:
        creationflags = 0x08000000  # CREATE_NO_WINDOW
        proc = subprocess.Popen(
            [str(_SENSOR_DAEMON_EXE)],
            cwd=str(_SENSOR_DAEMON_EXE.parent),
            creationflags=creationflags,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        _owned_procs.append(proc)
        log.info("sensor daemon spawned pid=%d (subprocess fallback — needs admin for full sensor access)", proc.pid)
        time.sleep(0.7)
    except Exception as ex:
        log.warning("sensor daemon: subprocess spawn failed: %s", ex)


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
