"""Polylux foreground service — scene-based driver dispatch with UI.

Single-process architecture:
  - Main thread: Qt event loop (UI + tray)
  - Driver threads: one per enabled device, read ServiceState every
    iteration so UI changes propagate live
  - Stop event coordinates shutdown across threads + Qt

Usage::

    python -m polylux.service                # full mode: drivers + UI + tray
    python -m polylux.service --headless     # no UI/tray (Windows service mode)
"""
from __future__ import annotations

import argparse
import logging
import logging.handlers
import os
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
from polylux.service import external
from polylux.ui.state import ServiceState, build_state

log = logging.getLogger("polylux")


# ---------------------------------------------------------------------------
# Scene runners — read state.snapshot() each iteration so UI mutations propagate
# ---------------------------------------------------------------------------


def run_matrix(chip, state: ServiceState, stop: threading.Event) -> None:
    from polylux.drivers.anime_matrix import AniMeMatrix, lut
    from polylux.drivers.anime_matrix.render import Frame

    matrix = AniMeMatrix(chip=chip)
    last_scene = None
    off_done = False

    # Text scene scroll state
    last_text = None
    last_text_color = None
    last_text_rotation = None
    last_text_font_size = None
    text_fits = True
    text_seg_w = 1
    scroll_offset = 0
    scroll_offset_f = 0.0
    SCROLL_FPS = 20.0

    # Image scene state
    last_image_path = None
    img_pil = None
    img_n_frames = 1
    img_frame_idx = 0
    img_frame_tick = 0
    img_scroll_offset_f = 0.0
    img_seg_w = 1
    img_fits = True

    while not stop.is_set():
        mcfg = state.snapshot().matrix
        if mcfg.scene != last_scene:
            off_done = False
            last_scene = mcfg.scene

        if mcfg.scene == "off":
            if not off_done:
                try:
                    black = Frame().to_bytes()
                    matrix.send_frame(black)
                    state.set_frame("matrix", black)
                    off_done = True
                except Exception as ex:
                    log.warning("matrix clear failed: %s", ex)
            state.mark_update("matrix")
            stop.wait(mcfg.update_seconds)
            continue

        is_animated = False
        b = max(0, min(100, mcfg.brightness)) / 100.0
        scaled_text_color = (
            int(mcfg.color[0] * b),
            int(mcfg.color[1] * b),
            int(mcfg.color[2] * b),
        )
        scaled_clock_color = (
            int(mcfg.clock_color[0] * b),
            int(mcfg.clock_color[1] * b),
            int(mcfg.clock_color[2] * b),
        )
        try:
            from polylux.drivers.anime_matrix.render import _matrix_font
            frame = Frame()
            if mcfg.scene == "clock":
                now = datetime.now().strftime("%H:%M")
                if mcfg.clock_font_size <= 5:
                    # Native 3×5 pixel font — clock-style, pixel-perfect
                    frame.draw_tiny_text(
                        now, color=scaled_clock_color, rotation=mcfg.rotation,
                    )
                else:
                    frame.draw_text(
                        now,
                        color=scaled_clock_color,
                        rotation=mcfg.rotation,
                        font=_matrix_font(mcfg.clock_font_size),
                    )
            elif mcfg.scene == "text":
                font = _matrix_font(mcfg.text_font_size)
                if (mcfg.text != last_text or mcfg.color != last_text_color
                        or mcfg.rotation != last_text_rotation
                        or mcfg.text_font_size != last_text_font_size):
                    last_text = mcfg.text
                    last_text_color = mcfg.color
                    last_text_rotation = mcfg.rotation
                    last_text_font_size = mcfg.text_font_size
                    scroll_offset_f = 0.0
                    if mcfg.text:
                        long_axis = lut.MAX_ROW if mcfg.rotation in (90, 270) else lut.MAX_COL
                        tw, _ = frame.measure_text(mcfg.text.upper(), font=font)
                        text_fits = tw <= long_axis
                        text_seg_w = max(1, tw + 8)
                    else:
                        text_fits = True
                shown_text = mcfg.text.upper() if mcfg.text else mcfg.text
                if mcfg.text and not text_fits:
                    frame.draw_text_scrolled(
                        shown_text, int(scroll_offset_f),
                        color=scaled_text_color, rotation=mcfg.rotation, font=font,
                    )
                    scroll_offset_f = (scroll_offset_f + mcfg.scroll_speed / 66.7) % text_seg_w
                    is_animated = True
                elif mcfg.text:
                    frame.draw_text(shown_text, color=scaled_text_color,
                                    rotation=mcfg.rotation, font=font)
            elif mcfg.scene == "image" and mcfg.image_path:
                try:
                    from PIL import Image, ImageEnhance
                    # Reload only on path change — animated GIFs keep the
                    # PIL Image alive across frames so seek() works.
                    if mcfg.image_path != last_image_path:
                        last_image_path = mcfg.image_path
                        img_pil = Image.open(mcfg.image_path)
                        img_n_frames = getattr(img_pil, "n_frames", 1)
                        img_frame_idx = 0
                        img_frame_tick = 0
                        img_scroll_offset_f = 0.0
                        # Measure first frame for scroll decision
                        long_axis = lut.MAX_ROW if mcfg.rotation in (90, 270) else lut.MAX_COL
                        aspect = img_pil.width / max(img_pil.height, 1)
                        scaled_w = max(1, int(round(aspect * lut.MAX_COL)))
                        img_fits = scaled_w <= long_axis
                        img_seg_w = max(1, scaled_w + 4)

                    if img_pil is not None:
                        if img_n_frames > 1:
                            img_pil.seek(img_frame_idx % img_n_frames)
                            img_frame_tick += 1
                            if img_frame_tick >= 3:  # ~6.6 fps at 20Hz loop = readable
                                img_frame_idx = (img_frame_idx + 1) % img_n_frames
                                img_frame_tick = 0
                            is_animated = True
                        frame_img = img_pil.convert("RGB")
                        if b < 1.0:
                            frame_img = ImageEnhance.Brightness(frame_img).enhance(b)
                        if mcfg.image_scroll and not img_fits:
                            frame.draw_image_scrolled(
                                frame_img, int(img_scroll_offset_f),
                                rotation=mcfg.rotation,
                            )
                            img_scroll_offset_f = (img_scroll_offset_f
                                                    + mcfg.scroll_speed / 66.7) % img_seg_w
                            is_animated = True
                        else:
                            frame.draw_image(frame_img)
                except Exception as ex:
                    log.warning("matrix image scene: %s — %s", mcfg.image_path, ex)
            frame_bytes = frame.to_bytes()
            matrix.send_frame(frame_bytes)
            state.set_frame("matrix", frame_bytes)
            state.mark_update("matrix")
        except Exception as ex:
            state.mark_update("matrix", error=str(ex))
            log.warning("matrix send_frame failed: %s", ex)

        target_sleep = (1.0 / SCROLL_FPS) if is_animated else mcfg.update_seconds
        slept = 0.0
        step = min(0.05, target_sleep)
        while slept < target_sleep and not stop.is_set():
            time.sleep(step)
            slept += step


def _read_value_source(source: str) -> str:
    if source == "cpu_pct":
        try:
            import psutil
            # interval=0.1 forces a real sample window. interval=None
            # returns 0.0 until the per-thread internal counter is primed,
            # which made the OLED show CPU 0% on idle reads.
            return f"{psutil.cpu_percent(interval=0.1):.0f}%"
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
            if hasattr(psutil, "sensors_temperatures"):
                temps = psutil.sensors_temperatures()
                for key in ("coretemp", "k10temp", "cpu_thermal"):
                    if key in temps and temps[key]:
                        return f"{temps[key][0].current:.0f} °C"
        except Exception:
            pass
        # Windows fallback: LHM HTTP endpoint
        try:
            from polylux.sensors.lhm import LHMSensors
            temps = LHMSensors().temps()
            for k in ("cpu package", "cpu core", "cpu (tctl/tdie)", "core (tctl/tdie)"):
                if k in temps:
                    return f"{temps[k]:.0f} °C"
            return "n/a"
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
    if source == "gpu_pct":
        try:
            import pynvml
            pynvml.nvmlInit()
            try:
                h = pynvml.nvmlDeviceGetHandleByIndex(0)
                u = pynvml.nvmlDeviceGetUtilizationRates(h)
                return f"{u.gpu}%"
            finally:
                pynvml.nvmlShutdown()
        except Exception:
            return "?"
    if source == "fan_rpm":
        try:
            from polylux.sensors.lhm import LHMSensors
            fans = LHMSensors().fans()
            if fans:
                return f"{fans[0].rpm}"
            return "n/a"
        except Exception:
            return "?"
    return "?"


def _label_for_source(source: str) -> str:
    return {
        "cpu_temp": "CPU TEMP",
        "gpu_temp": "GPU TEMP",
        "cpu_pct": "CPU",
        "gpu_pct": "GPU",
        "mem_pct": "MEM",
        "fan_rpm": "FAN",
        "static": "",
    }.get(source, source.upper())


def run_oled(chip, state: ServiceState, stop: threading.Event) -> None:
    from polylux.drivers.livedash_oled import LiveDashOLED

    oled = LiveDashOLED(chip=chip)
    last_scene = None
    one_shot_done = False

    # Scroll state for long text values
    SCROLL_THRESHOLD = 16
    last_scroll_value = None
    scroll_idx = 0

    # Brightness state — try the speculative `0xEC 0x14 <level>` opcode.
    # If the chip doesn't honor it, the slider becomes a no-op (slider
    # still moves in UI but display doesn't dim). See docs §9.2-ish.
    last_brightness = None

    while not stop.is_set():
        ocfg = state.snapshot().oled
        if ocfg.scene != last_scene:
            one_shot_done = False
            oled._text_mode_armed = False
            last_scene = ocfg.scene

        # Push brightness when it changes
        if ocfg.brightness != last_brightness:
            try:
                level = max(0, min(255, int(ocfg.brightness * 2.55)))
                chip.hid_write(bytes([0xEC, 0x14, level]) + b"\x00" * 62)
            except Exception as ex:
                log.debug("OLED brightness write failed: %s", ex)
            last_brightness = ocfg.brightness

        is_scrolling = False
        try:
            if ocfg.scene == "hardware_monitor":
                if ocfg.hw_mode == "rotate" and ocfg.rotate_sources:
                    idx = int(time.time() / max(ocfg.rotate_interval_s, 0.5)) % len(ocfg.rotate_sources)
                    src = ocfg.rotate_sources[idx]
                    value = _read_value_source(src)
                    label = _label_for_source(src)
                else:
                    src = ocfg.value_source
                    value = _read_value_source(src)
                    label = ocfg.label
                # OLED firmware renders all text in uppercase — match that
                # so the preview matches the panel.
                label = label.upper()
                value = value.upper()
                oled.set_text(label, value)
                state.set_frame("oled", ("text", label, value))
            elif ocfg.scene == "text":
                full_value = (ocfg.value if ocfg.value else "POLYLUX").upper()
                label = (ocfg.label or "").upper()
                if full_value != last_scroll_value:
                    last_scroll_value = full_value
                    scroll_idx = 0
                if len(full_value) > SCROLL_THRESHOLD:
                    padded = full_value + "   "
                    idx = scroll_idx % len(padded)
                    window = (padded + padded)[idx:idx + SCROLL_THRESHOLD]
                    oled.set_text(label, window)
                    state.set_frame("oled", ("text", label, window))
                    scroll_idx += 1
                    is_scrolling = True
                else:
                    oled.set_text(label, full_value)
                    state.set_frame("oled", ("text", label, full_value))
            elif ocfg.scene == "preset_gif" and not one_shot_done:
                chip.hid_write(bytes([0xEC, 0x51, 0x10]) + b"\x00" * 62)
                state.set_frame("oled", ("preset_gif", ocfg.preset_index))
                one_shot_done = True
            elif ocfg.scene == "off" and not one_shot_done:
                oled.set_text("", "")
                chip.hid_write(bytes([0xEC, 0x51, 0x15]) + b"\x00" * 62)
                state.set_frame("oled", ("off",))
                one_shot_done = True
            state.mark_update("oled")
        except Exception as ex:
            state.mark_update("oled", error=str(ex))
            log.warning("oled update failed: %s", ex)

        # scroll_speed 1-100 → chars per second 0.1..10; 1 char per frame
        scroll_fps = max(0.1, ocfg.scroll_speed / 10.0)
        target_sleep = (1.0 / scroll_fps) if is_scrolling else ocfg.update_seconds
        slept = 0.0
        step = min(0.1, target_sleep)
        while slept < target_sleep and not stop.is_set():
            time.sleep(step)
            slept += step


def run_fans(state: ServiceState, stop: threading.Event) -> None:
    """Push fan PWM settings to the sensor daemon on a timer.

    Each tick: snapshot current config + temps, resolve each fan's
    target duty (preset or interpolated curve), POST it to the
    daemon. The chip remembers the last write, so misses are
    self-healing on the next tick.
    """
    from polylux.sensors.fan_control import apply_all
    from polylux.sensors.lhm import LHMSensors

    sensors = LHMSensors()
    while not stop.is_set():
        fcfg = state.snapshot().fans
        if fcfg.enabled and fcfg.fans:
            try:
                temps = {k.lower(): v for k, v in sensors.temps().items()}
                apply_all(fcfg.fans, temps)
            except Exception as ex:
                log.warning("fan runner tick failed: %s", ex)
        stop.wait(max(0.5, fcfg.update_seconds))


def run_aura_rgb(state: ServiceState, stop: threading.Event) -> None:
    from polylux.drivers.aura_rgb import AuraRGB, AuraRGBError

    last_scene = None
    last_color = None
    rgb = None
    try:
        while not stop.is_set():
            acfg = state.snapshot().aura_rgb

            # Connect lazily on first iteration
            if rgb is None:
                try:
                    rgb = AuraRGB.connect(host=acfg.host, port=acfg.port,
                                          types=acfg.types)
                    controlled = rgb.controlled_devices
                    log.info("aura_rgb: connected, %d total devices, %d controlled (%s)",
                             len(rgb.devices), len(controlled),
                             ", ".join(d.name for d in controlled) or "none")
                except AuraRGBError as ex:
                    state.mark_update("aura_rgb", error=str(ex))
                    log.warning("aura_rgb connect failed: %s", ex)
                    # Retry every 5 seconds
                    stop.wait(5.0)
                    continue

            try:
                last_brightness_aura = getattr(run_aura_rgb, "_last_brightness", None)
                if (acfg.scene != last_scene or acfg.color != last_color
                        or acfg.brightness != last_brightness_aura):
                    b = max(0, min(100, acfg.brightness)) / 100.0
                    scaled = (
                        int(acfg.color[0] * b),
                        int(acfg.color[1] * b),
                        int(acfg.color[2] * b),
                    )
                    # OpenRGB mode = acfg.scene (legacy "solid" mapped at load).
                    rgb.set_mode(acfg.scene, color=scaled)
                    controlled_n = len(rgb.controlled_devices)
                    # The live preview shows the requested colour for colour-
                    # using modes, black for Off, and a per-mode placeholder
                    # otherwise. Cycle-modes (Rainbow / Spectrum) we just
                    # show as a rainbow strip.
                    if acfg.scene.lower() == "off":
                        preview = [(0, 0, 0)] * max(controlled_n, 1)
                    elif "rainbow" in acfg.scene.lower() or "spectrum" in acfg.scene.lower():
                        import colorsys
                        preview = [
                            tuple(int(c * 255) for c in colorsys.hsv_to_rgb(i / 12, 1.0, b))
                            for i in range(12)
                        ]
                    else:
                        preview = [scaled] * max(controlled_n, 1)
                    state.set_frame("aura_rgb", preview)
                    last_scene = acfg.scene
                    last_color = acfg.color
                    run_aura_rgb._last_brightness = acfg.brightness  # type: ignore[attr-defined]
                state.mark_update("aura_rgb")
            except Exception as ex:
                state.mark_update("aura_rgb", error=str(ex))
                log.warning("aura_rgb update failed: %s", ex)
            stop.wait(1.0)
    finally:
        if rgb is not None:
            try: rgb.close()
            except Exception: pass


# ---------------------------------------------------------------------------
# Top-level service runner
# ---------------------------------------------------------------------------


_stop_event = threading.Event()


def _on_signal(_signum, _frame) -> None:
    log.info("shutdown signal received")
    _stop_event.set()


def _log_dir() -> Path:
    """Per-user log location. Always writeable, exists across both dev
    and installed runs (where %APPDATA% is the canonical config home)."""
    base = os.environ.get("APPDATA") or str(Path.home() / "AppData" / "Roaming")
    p = Path(base) / "Polylux"
    p.mkdir(parents=True, exist_ok=True)
    return p


def _configure_logging(level: str) -> None:
    """Wire log output to BOTH stderr (visible in dev console) AND a
    rotating file under %APPDATA%\\Polylux\\polylux.log.

    The frozen installer ships with ``console=False`` so stderr is a
    no-op for end users — the file handler is the only durable record
    of what happened, especially for crashes during boot autostart.
    Rotation keeps disk usage bounded (5 × 2 MB max)."""
    fmt = logging.Formatter(
        "%(asctime)s %(levelname)s %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    root = logging.getLogger()
    root.setLevel(level)
    # Strip any handlers a prior call (e.g. test setup) installed.
    for h in list(root.handlers):
        root.removeHandler(h)
    # Console handler — silently no-op when there's no console attached.
    sh = logging.StreamHandler(stream=sys.stderr)
    sh.setFormatter(fmt)
    root.addHandler(sh)
    # File handler — the durable record.
    try:
        log_path = _log_dir() / "polylux.log"
        fh = logging.handlers.RotatingFileHandler(
            log_path, maxBytes=2 * 1024 * 1024, backupCount=5,
            encoding="utf-8",
        )
        fh.setFormatter(fmt)
        root.addHandler(fh)
        log.info("log file: %s", log_path)
    except Exception as ex:
        # Don't let logging setup take the whole app down — fall back
        # to console-only and surface the problem.
        log.warning("file logging unavailable: %s", ex)


def main() -> int:
    parser = argparse.ArgumentParser(description="Polylux service")
    parser.add_argument("--config", default=str(cfg_mod.DEFAULT_CONFIG_PATH))
    parser.add_argument("--log-level", default="INFO",
                        choices=("DEBUG", "INFO", "WARNING", "ERROR"))
    parser.add_argument("--no-kill-asus", action="store_true",
                        help="Skip kill_asus_stack (override config)")
    parser.add_argument("--headless", action="store_true",
                        help="No UI / tray (for running as Windows service)")
    parser.add_argument("--minimized", action="store_true",
                        help="Start with the window hidden — tray icon only. "
                             "Used by the autostart Run-key so boot doesn't "
                             "pop a window. Click the tray icon to open the UI.")
    parser.add_argument("--skin", default="claude",
                        help="UI skin name (default: claude)")
    args = parser.parse_args()

    _configure_logging(args.log_level)

    yaml_path = Path(args.config)
    state = build_state(yaml_path)
    cfg = state.snapshot()
    log.info("config loaded from %s", yaml_path)
    log.info("  matrix.enabled=%s scene=%s", cfg.matrix.enabled, cfg.matrix.scene)
    log.info("  oled.enabled=%s scene=%s", cfg.oled.enabled, cfg.oled.scene)
    log.info("  ryujin_lcd.enabled=%s scene=%s", cfg.ryujin_lcd.enabled, cfg.ryujin_lcd.scene)
    log.info("  aura_rgb.enabled=%s scene=%s", cfg.aura_rgb.enabled, cfg.aura_rgb.scene)
    log.info("  fans.enabled=%s count=%d", cfg.fans.enabled, len(cfg.fans.fans))

    if cfg.service.kill_asus_stack and not args.no_kill_asus:
        log.info("killing ASUS stack (Aac3572MbHal + services)...")
        kill_asus_stack()

    # Bring up bundled external services so the user gets a one-process feel.
    # Sensor daemon: prefer the PolyluxSensorDaemon Windows service (installed
    # once, runs as LocalSystem, zero UAC); fall back to subprocess for dev.
    # OpenRGB runs in user mode → spawn directly.
    external.ensure_sensor_daemon()
    if cfg.aura_rgb.enabled:
        external.launch_openrgb()

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
        t = threading.Thread(target=run_oled, args=(chip, state, _stop_event),
                             daemon=True, name="oled")
        t.start()
        threads.append(t)
        time.sleep(0.3)

    if cfg.matrix.enabled and chip is not None:
        t = threading.Thread(target=run_matrix, args=(chip, state, _stop_event),
                             daemon=True, name="matrix")
        t.start()
        threads.append(t)

    if cfg.aura_rgb.enabled:
        t = threading.Thread(target=run_aura_rgb, args=(state, _stop_event),
                             daemon=True, name="aura_rgb")
        t.start()
        threads.append(t)

    # Always start run_fans — it idles when fans.enabled=False, so the
    # user can toggle ENABLED in the UI mid-session and have the runner
    # pick it up on the next tick without restarting Polylux.
    t = threading.Thread(target=run_fans, args=(state, _stop_event),
                         daemon=True, name="fans")
    t.start()
    threads.append(t)

    if cfg.ryujin_lcd.enabled and cfg.ryujin_lcd.scene == "hardware_monitor":
        log.info("ryujin_lcd: firmware-default hw monitor active (no thread needed)")

    if not threads and args.headless:
        log.warning("no drivers enabled in headless mode; exiting")
        if chip is not None:
            chip.close()
        return 0

    signal.signal(signal.SIGINT, _on_signal)
    signal.signal(signal.SIGTERM, _on_signal)

    if args.headless:
        log.info("Polylux running headless. Ctrl-C to stop.")
        try:
            while not _stop_event.is_set():
                time.sleep(0.5)
        except KeyboardInterrupt:
            pass
    else:
        # Qt event loop — UI + tray
        if args.minimized:
            log.info("Polylux running minimized. Tray icon active, UI on tray click.")
        else:
            log.info("Polylux running. Window open + tray icon.")
        from polylux.ui.app import PolyluxApp
        app = PolyluxApp(state=state, skin_name=args.skin,
                         start_minimized=args.minimized)
        # Bridge Qt quit -> stop_event
        app._app.aboutToQuit.connect(_stop_event.set)
        rc = app.exec()
        log.info("Qt loop exited rc=%d", rc)

    # Clean shutdown of any external processes we spawned.
    external.stop_all()

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
