"""Polylux foreground service — scene-based driver dispatch.

Loads polylux.yaml, kills the ASUS userland stack, opens chip 1A21
once, and starts one driver thread per enabled device. Each driver
renders its configured scene on a polling cadence.

Usage::

    python -m polylux.service [--config path/to/polylux.yaml]

For Windows service install, wrap with nssm pointing at the venv's
pythonw.exe + this module.
"""
from __future__ import annotations

import argparse
import logging
import signal
import sys
import threading
import time
from datetime import datetime
from pathlib import Path
from typing import Optional

from polylux import config as cfg_mod
from polylux.config import PolyluxConfig
from polylux.service.kill_asus_stack import kill_asus_stack

log = logging.getLogger("polylux")


# ---------------------------------------------------------------------------
# Scene runners — one per device, take (chip_or_client, cfg, stop_event)
# ---------------------------------------------------------------------------


def run_matrix(chip, mcfg, stop: threading.Event) -> None:
    """Matrix scene loop. Updates the matrix every `update_seconds`."""
    from polylux.drivers.anime_matrix import AniMeMatrix
    from polylux.drivers.anime_matrix.render import Frame

    matrix = AniMeMatrix(chip=chip)
    while not stop.is_set():
        frame = Frame()
        scene = mcfg.scene
        if scene == "clock":
            now = datetime.now().strftime("%H:%M")
            frame.draw_tiny_text(now, color=mcfg.color, rotation=mcfg.rotation)
        elif scene == "text":
            frame.draw_tiny_text(mcfg.text, color=mcfg.color, rotation=mcfg.rotation)
        elif scene == "fill":
            frame.fill(mcfg.color)
        elif scene == "off":
            pass  # black frame
        else:
            log.warning("matrix unknown scene %r — leaving black", scene)

        try:
            matrix.send_frame(frame.to_bytes())
        except Exception as ex:
            log.warning("matrix send_frame failed: %s", ex)

        # Sleep in small increments so SIGINT is responsive
        slept = 0.0
        while slept < mcfg.update_seconds and not stop.is_set():
            time.sleep(min(0.1, mcfg.update_seconds - slept))
            slept += 0.1


def _read_value_source(source: str) -> str:
    """Read a hardware-monitor value and format it as a short string.

    Returns "?" if the source can't be read (e.g., no GPU lib installed).
    """
    if source == "cpu_pct":
        try:
            import psutil
            return f"{psutil.cpu_percent(interval=None):.0f}%"
        except Exception:
            return "?"
    if source == "mem_pct":
        try:
            import psutil
            return f"{psutil.virtual_memory().percent:.0f}%"
        except Exception:
            return "?"
    if source == "cpu_temp":
        try:
            import psutil
            temps = psutil.sensors_temperatures() if hasattr(psutil, "sensors_temperatures") else {}
            for key in ("coretemp", "k10temp", "cpu_thermal"):
                if key in temps and temps[key]:
                    return f"{temps[key][0].current:.0f} °C"
            return "n/a"  # Windows psutil doesn't expose CPU temps natively
        except Exception:
            return "?"
    if source == "gpu_temp":
        try:
            import pynvml
            pynvml.nvmlInit()
            try:
                h = pynvml.nvmlDeviceGetHandleByIndex(0)
                t = pynvml.nvmlDeviceGetTemperature(h, pynvml.NVML_TEMPERATURE_GPU)
                return f"{t} °C"
            finally:
                pynvml.nvmlShutdown()
        except Exception:
            return "?"
    return "?"


def run_oled(chip, ocfg, stop: threading.Event) -> None:
    """OLED scene loop."""
    from polylux.drivers.livedash_oled import LiveDashOLED

    oled = LiveDashOLED(chip=chip)
    one_shot_done = False

    while not stop.is_set():
        scene = ocfg.scene
        try:
            if scene == "hardware_monitor":
                value = _read_value_source(ocfg.value_source)
                oled.set_text(ocfg.label, value)
            elif scene == "text":
                oled.set_text(ocfg.label, ocfg.value)
            elif scene == "qcode" and not one_shot_done:
                chip.hid_write(bytes([0xEC, 0x51, 0x10, 0x01, 0x01]) + b"\x00" * 60)
                one_shot_done = True
            elif scene == "preset_gif" and not one_shot_done:
                # Send ec 51 10 for default preset rotation. preset_index
                # currently unused — the chip cycles through factory
                # presets on its own once in slot 0x10.
                chip.hid_write(bytes([0xEC, 0x51, 0x10]) + b"\x00" * 62)
                one_shot_done = True
            elif scene == "off" and not one_shot_done:
                # Return chip to data-input mode; OLED stops displaying.
                chip.hid_write(bytes([0xEC, 0x51, 0x15]) + b"\x00" * 62)
                one_shot_done = True
        except Exception as ex:
            log.warning("oled update failed: %s", ex)

        slept = 0.0
        while slept < ocfg.update_seconds and not stop.is_set():
            time.sleep(min(0.1, ocfg.update_seconds - slept))
            slept += 0.1


def run_aura_rgb(acfg, stop: threading.Event) -> None:
    """Aura RGB one-shot via OpenRGB SDK."""
    from polylux.drivers.aura_rgb import AuraRGB, AuraRGBError

    try:
        rgb = AuraRGB.connect(host=acfg.host, port=acfg.port)
    except AuraRGBError as ex:
        log.warning("aura_rgb connect failed (skip): %s", ex)
        return

    try:
        if acfg.scene == "solid":
            log.info("aura_rgb: %d devices detected, setting solid %s",
                     len(rgb.devices), acfg.color)
            rgb.set_all(acfg.color)
        elif acfg.scene == "off":
            log.info("aura_rgb: setting all devices off")
            rgb.turn_off()
        # No polling loop — RGB doesn't change unless config does.
        stop.wait()
    finally:
        rgb.close()


# ---------------------------------------------------------------------------
# Top-level service runner
# ---------------------------------------------------------------------------


_stop_event = threading.Event()


def _on_signal(_signum, _frame) -> None:
    log.info("shutdown signal received")
    _stop_event.set()


def main() -> int:
    parser = argparse.ArgumentParser(description="Polylux service")
    parser.add_argument("--config", default=str(cfg_mod.DEFAULT_CONFIG_PATH))
    parser.add_argument("--log-level", default="INFO",
                        choices=("DEBUG", "INFO", "WARNING", "ERROR"))
    parser.add_argument("--no-kill-asus", action="store_true",
                        help="Skip kill_asus_stack (override config)")
    args = parser.parse_args()

    logging.basicConfig(
        level=args.log_level,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    cfg: PolyluxConfig = cfg_mod.load(args.config)
    log.info("config loaded from %s", args.config)
    log.info("  matrix.enabled=%s scene=%s", cfg.matrix.enabled, cfg.matrix.scene)
    log.info("  oled.enabled=%s scene=%s", cfg.oled.enabled, cfg.oled.scene)
    log.info("  ryujin_lcd.enabled=%s scene=%s", cfg.ryujin_lcd.enabled, cfg.ryujin_lcd.scene)
    log.info("  aura_rgb.enabled=%s scene=%s", cfg.aura_rgb.enabled, cfg.aura_rgb.scene)

    if cfg.service.kill_asus_stack and not args.no_kill_asus:
        log.info("killing ASUS stack (Aac3572MbHal + services)...")
        kill_asus_stack()

    # Open chip 1A21 once if any chip-1A21 device is enabled.
    chip = None
    need_chip = cfg.matrix.enabled or cfg.oled.enabled
    if need_chip:
        from polylux.drivers.chip_1a21 import Chip1A21
        try:
            chip = Chip1A21.open()
            log.info("Chip1A21 opened")
        except Exception as ex:
            log.error("Chip1A21 open failed: %s", ex)
            return 1

    threads: list[threading.Thread] = []

    if cfg.oled.enabled and chip is not None:
        # IMPORTANT: send OLED commands BEFORE matrix init so ec 51 09 takes
        # before ec 42 01 suppression. The OLED driver does this in set_text().
        t = threading.Thread(target=run_oled, args=(chip, cfg.oled, _stop_event),
                             daemon=True, name="oled")
        t.start()
        threads.append(t)
        time.sleep(0.3)  # let OLED settle into text mode before matrix init

    if cfg.matrix.enabled and chip is not None:
        t = threading.Thread(target=run_matrix, args=(chip, cfg.matrix, _stop_event),
                             daemon=True, name="matrix")
        t.start()
        threads.append(t)

    if cfg.aura_rgb.enabled:
        t = threading.Thread(target=run_aura_rgb, args=(cfg.aura_rgb, _stop_event),
                             daemon=True, name="aura_rgb")
        t.start()
        threads.append(t)

    if cfg.ryujin_lcd.enabled:
        # Ryujin LCD hardware_monitor is firmware-resident on chip 1988 —
        # it shows hw monitor data autonomously once Aac3572MbHal stops
        # overwriting it. For now, scene=hardware_monitor is implicitly
        # handled by killing Aac3572MbHal. scene=off would require talking
        # to chip 1988 directly (TBD). Log + skip for now.
        if cfg.ryujin_lcd.scene == "hardware_monitor":
            log.info("ryujin_lcd: firmware-default hw monitor active (no thread needed)")
        else:
            log.warning("ryujin_lcd.scene=%s not yet implemented", cfg.ryujin_lcd.scene)

    if not threads:
        log.warning("no drivers running; nothing to do")
        if chip is not None:
            chip.close()
        return 0

    signal.signal(signal.SIGINT, _on_signal)
    signal.signal(signal.SIGTERM, _on_signal)

    log.info("Polylux running. Ctrl-C to stop.")
    try:
        while not _stop_event.is_set():
            time.sleep(0.5)
    except KeyboardInterrupt:
        pass

    log.info("stopping driver threads...")
    _stop_event.set()
    for t in threads:
        t.join(timeout=3.0)
    if chip is not None:
        chip.close()
    log.info("bye")
    return 0


if __name__ == "__main__":
    sys.exit(main())
