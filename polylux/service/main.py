"""Polylux foreground service.

Reads polylux.yaml, attaches Frida hooks for each enabled device, and
stays alive. Re-attaches whenever a target process restarts.

Usage::

    python -m polylux.service [--config path/to/polylux.yaml]

For real production use, run this under nssm (Windows service wrapper)
or pythonw + Task Scheduler so it runs from boot without a console window.
"""
from __future__ import annotations

import argparse
import logging
import signal
import sys
import threading
import time
from pathlib import Path

from polylux import config as cfg_mod
from polylux.crypto import KeyExtractionError, extract_key, find_helper_pid
from polylux.drivers.anime_matrix.force_color import MatrixForceColorDriver
from polylux.drivers.anime_matrix.usb_force_color import UsbForceColorDriver

log = logging.getLogger("polylux")


_stop_event = threading.Event()


def _on_signal(_signum, _frame) -> None:
    log.info("shutdown signal received")
    _stop_event.set()


def main() -> int:
    parser = argparse.ArgumentParser(description="Polylux service")
    parser.add_argument(
        "--config",
        default=str(cfg_mod.DEFAULT_CONFIG_PATH),
        help="path to polylux.yaml (default: project root)",
    )
    parser.add_argument(
        "--log-level",
        default="INFO",
        choices=("DEBUG", "INFO", "WARNING", "ERROR"),
    )
    parser.add_argument(
        "--matrix-driver",
        default="usb",
        choices=("usb", "frida"),
        help="usb (v0.2, direct USB, no ASUS daemons needed) or frida (v0.1, decrypt-substitute, requires UWP active)",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=args.log_level,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    cfg = cfg_mod.load(args.config)
    log.info("loaded config from %s", args.config)
    log.info("matrix: enabled=%s color=%s", cfg.matrix.enabled, cfg.matrix.color)
    log.info("oled: enabled=%s", cfg.oled.enabled)
    log.info("ryujin_lcd: enabled=%s", cfg.ryujin_lcd.enabled)

    # Best-effort key extraction at startup. Only meaningful for the
    # frida driver (v0.1) and future passive monitoring. The usb driver
    # (v0.2) doesn't need it — it talks to the chip directly.
    if args.matrix_driver == "frida":
        helper_pid = find_helper_pid()
        if helper_pid is None:
            log.info("UserSessionHelper not running yet; key extraction deferred")
        else:
            try:
                key = extract_key(helper_pid, timeout=10.0)
                log.info("AES-256 key extracted from helper PID %d (fingerprint=%s...)",
                         helper_pid, key.hex()[:16])
            except KeyExtractionError as ex:
                log.warning("key extraction failed (non-fatal): %s", ex)

    drivers: list = []
    threads: list[threading.Thread] = []

    if cfg.matrix.enabled:
        if args.matrix_driver == "usb":
            d = UsbForceColorDriver(color=cfg.matrix.color)
            log.info("matrix driver: usb_direct (v0.2)")
        else:
            d = MatrixForceColorDriver(color=cfg.matrix.color)
            log.info("matrix driver: frida force-color (v0.1, requires UWP)")
        drivers.append(d)
        t = threading.Thread(target=d.run_forever, daemon=True, name="matrix-driver")
        t.start()
        threads.append(t)
    else:
        log.info("matrix driver disabled by config")

    if cfg.oled.enabled:
        log.warning("oled driver requested but not yet implemented")
    if cfg.ryujin_lcd.enabled:
        log.warning("ryujin_lcd driver requested but not yet implemented")

    if not drivers:
        log.warning("no drivers enabled; nothing to do (exit)")
        return 0

    signal.signal(signal.SIGINT, _on_signal)
    signal.signal(signal.SIGTERM, _on_signal)

    log.info("Polylux running. Ctrl-C to stop.")
    try:
        while not _stop_event.is_set():
            time.sleep(1)
    except KeyboardInterrupt:
        pass

    log.info("shutting down drivers...")
    for d in drivers:
        d.detach()
    log.info("bye")
    return 0


if __name__ == "__main__":
    sys.exit(main())
