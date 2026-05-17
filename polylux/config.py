"""Polylux configuration loader — scene-based per-device config.

Each device (matrix / oled / ryujin_lcd / aura_rgb) has an `enabled`
flag and a `scene` selecting one of a few rendering modes. Scene-
specific fields are validated lazily.

Scenes available:

  matrix:
    clock     — current time HH:MM in 3×5 tiny font, rotated 270, centered
    text      — static `text` string in tiny font
    fill      — solid `color` RGB
    off       — black

  oled:
    hardware_monitor — `label` / `value_source` (cpu_temp / gpu_temp /
                       cpu_pct / mem_pct / static)
    text             — `label` / `value` static text
    qcode            — fall back to chip's Q-Code display (no data)
    preset_gif       — factory-preloaded animation (shark / swimmer / etc)
    off              — chip in data-input mode, nothing displayed

  ryujin_lcd:
    hardware_monitor — chip's firmware-resident hw monitor (default state)
    off              — chip's data-input mode
    # NOTE: custom_image is blocked by ASUS firmware bug on Z690 Extreme.
    # See PROJECT_STATE.md §9.2. Not exposed here until firmware fix.

  aura_rgb:
    solid     — every detected device set to `color`
    off       — every detected device set to (0,0,0)
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

try:
    import yaml  # type: ignore[import-untyped]
except ImportError:  # pragma: no cover
    yaml = None


def _default_config_path() -> Path:
    """Locate the canonical config file for the current install.

    Resolution order:
      1. ``%APPDATA%\\Polylux\\polylux.yaml`` — the per-user, always-
         writeable location seeded by the installer on first install.
         **Always preferred** so the UI can save changes without admin.
         If the file is missing but the directory exists (or we can
         create it), seed it from the bundled default before returning.
      2. Bundled default at ``<package>/../polylux.yaml`` — works in
         dev (repo root) and in the frozen install (``_internal/``).
         Read-only fallback when %APPDATA% is unavailable (very rare).

    Picks #1 even when the user passed no ``--config`` arg, so
    double-clicking the installed exe still loads the user's actual
    settings rather than the factory bundle.
    """
    bundled = Path(__file__).resolve().parent.parent / "polylux.yaml"
    appdata = os.environ.get("APPDATA")
    if not appdata:
        return bundled
    user_path = Path(appdata) / "Polylux" / "polylux.yaml"
    if user_path.exists():
        return user_path
    # Try to seed it from the bundled default so subsequent saves work.
    try:
        user_path.parent.mkdir(parents=True, exist_ok=True)
        if bundled.exists():
            user_path.write_bytes(bundled.read_bytes())
            return user_path
    except OSError:
        pass
    return bundled


# Backwards-compat: module-level constant resolved at import time.
# Code that wants live discovery should call _default_config_path()
# directly (it's cheap; one stat per call).
DEFAULT_CONFIG_PATH = _default_config_path()


RGB = tuple[int, int, int]


def _coerce_color(raw: Any) -> RGB:
    if not isinstance(raw, (list, tuple)) or len(raw) != 3:
        raise ValueError(f"color must be a 3-element list, got {raw!r}")
    out = (int(raw[0]), int(raw[1]), int(raw[2]))
    if not all(0 <= c <= 255 for c in out):
        raise ValueError(f"color components must be 0..255, got {out}")
    return out


@dataclass
class MatrixConfig:
    enabled: bool = False
    scene: str = "clock"
    color: RGB = (0xFF, 0xFF, 0xFF)            # used by scene=text
    clock_color: RGB = (0xFF, 0xFF, 0xFF)      # used by scene=clock, independent of text
    text: str = ""
    rotation: int = 270
    update_seconds: float = 1.0     # how often the scene re-renders
    brightness: int = 100           # 0-100, applied at frame-build time
    scroll_speed: int = 55          # used in text + image scenes, px-per-frame analog
    text_font_size: int = 11        # PIL font px-size for scene=text
    clock_font_size: int = 5        # 5 = native 3×5 pixel font; 6+ = PIL Arial Bold at that px size
    image_path: str = ""            # used when scene=image; PNG/JPG/GIF via PIL
    image_scroll: bool = True       # if image wider than long axis, scroll horizontally

    SCENES = ("clock", "text", "image", "off")

    def validate(self) -> None:
        if self.scene not in self.SCENES:
            raise ValueError(f"matrix.scene must be one of {self.SCENES}, got {self.scene!r}")
        if self.rotation not in (0, 90, 180, 270):
            raise ValueError(f"matrix.rotation must be 0/90/180/270, got {self.rotation}")
        if not 0 <= self.brightness <= 100:
            raise ValueError(f"matrix.brightness must be 0..100, got {self.brightness}")
        if not 1 <= self.scroll_speed <= 100:
            raise ValueError(f"matrix.scroll_speed must be 1..100, got {self.scroll_speed}")
        if not 7 <= self.text_font_size <= 16:
            raise ValueError(f"matrix.text_font_size must be 7..16, got {self.text_font_size}")
        if not 5 <= self.clock_font_size <= 16:
            raise ValueError(f"matrix.clock_font_size must be 5..16, got {self.clock_font_size}")


@dataclass
class OledConfig:
    enabled: bool = False
    scene: str = "hardware_monitor"
    label: str = "CPU Temp."
    value: str = ""                  # used when scene=text (static)
    value_source: str = "cpu_temp"   # used when scene=hardware_monitor (single mode)
    update_seconds: float = 2.0
    preset_index: int = 0            # used when scene=preset_gif
    brightness: int = 100
    font_size: str = "medium"        # small | medium | large
    hw_mode: str = "single"          # single | rotate
    rotate_sources: tuple[str, ...] = ("cpu_temp", "gpu_temp", "cpu_pct")
    rotate_interval_s: float = 3.0
    scroll_speed: int = 50           # 1..100, used when text scene value exceeds 16 chars

    SCENES = ("hardware_monitor", "text", "preset_gif", "off")
    VALUE_SOURCES = (
        "cpu_temp", "gpu_temp", "cpu_pct", "gpu_pct",
        "mem_pct", "fan_rpm", "static",
    )
    FONT_SIZES = ("small", "medium", "large")
    HW_MODES = ("single", "rotate")

    def validate(self) -> None:
        if self.scene not in self.SCENES:
            raise ValueError(f"oled.scene must be one of {self.SCENES}, got {self.scene!r}")
        if self.scene == "hardware_monitor" and self.value_source not in self.VALUE_SOURCES:
            raise ValueError(f"oled.value_source must be one of {self.VALUE_SOURCES}, got {self.value_source!r}")
        if self.font_size not in self.FONT_SIZES:
            raise ValueError(f"oled.font_size must be one of {self.FONT_SIZES}, got {self.font_size!r}")
        if self.hw_mode not in self.HW_MODES:
            raise ValueError(f"oled.hw_mode must be one of {self.HW_MODES}, got {self.hw_mode!r}")
        if not 0 <= self.brightness <= 100:
            raise ValueError(f"oled.brightness must be 0..100, got {self.brightness}")
        if not 0.5 <= self.rotate_interval_s <= 30.0:
            raise ValueError(f"oled.rotate_interval_s must be 0.5..30.0, got {self.rotate_interval_s}")
        if not 1 <= self.scroll_speed <= 100:
            raise ValueError(f"oled.scroll_speed must be 1..100, got {self.scroll_speed}")
        if self.hw_mode == "rotate":
            bad = [s for s in self.rotate_sources if s not in self.VALUE_SOURCES]
            if bad:
                raise ValueError(f"oled.rotate_sources contains unknown metrics: {bad}")
            if not self.rotate_sources:
                raise ValueError("oled.rotate_sources cannot be empty when hw_mode=rotate")


@dataclass
class RyujinLcdConfig:
    enabled: bool = False
    scene: str = "hardware_monitor"

    SCENES = ("hardware_monitor", "off")

    def validate(self) -> None:
        if self.scene not in self.SCENES:
            raise ValueError(f"ryujin_lcd.scene must be one of {self.SCENES}, got {self.scene!r}")


@dataclass
class AuraRGBConfig:
    enabled: bool = False
    scene: str = "Off"                # also serves as the OpenRGB mode name
    color: RGB = (0, 0, 0)
    host: str = "127.0.0.1"
    port: int = 6742
    # Default safe: only touch motherboard. Users opt in to keyboards
    # / mice / etc by adding their type names here.
    types: tuple[str, ...] = ("MOTHERBOARD",)
    brightness: int = 100             # 0-100, multiplied into RGB before send

    # Whatever the OpenRGB SDK exposes via available_modes() — these are
    # the common ones we hardcode for v0.4 so the UI has a stable list
    # even before the driver is connected. Per-device intersection is
    # the real source of truth at runtime.
    SCENES = (
        "Direct", "Static", "Breathing", "Flashing",
        "Spectrum Cycle", "Rainbow", "Chase Fade", "Chase", "Off",
        # v0.3 legacy alias kept so existing YAML loads:
        "solid",
    )

    def validate(self) -> None:
        if self.scene not in self.SCENES:
            raise ValueError(f"aura_rgb.scene must be one of {self.SCENES}, got {self.scene!r}")
        if not 0 <= self.brightness <= 100:
            raise ValueError(f"aura_rgb.brightness must be 0..100, got {self.brightness}")


@dataclass
class FanConfig:
    """One controllable fan on a Super-IO chip (e.g. Nuvoton NCT6798D).

    The Polylux runner POSTs to the sensor daemon every
    ``FansConfig.update_seconds`` to enforce the chosen mode. ``auto``
    leaves the chip in default (BIOS) control mode — Polylux performs
    a one-shot ``SetDefault`` then stops fighting the BIOS curve.
    """
    sensor_id: str = ""               # e.g. "/lpc/nct6798d/0/control/0"
    name: str = ""                    # user label, e.g. "CPU FAN"
    mode: str = "auto"                # auto / off / silent / medium / full / curve
    temp_source: str = "cpu package"  # which key from sensor_daemon.temps() drives the curve
    # 4 anchor points (temp_c, duty_pct). Linear interp between, clamped
    # to first/last duty outside the range. Used when mode="curve".
    curve: tuple[tuple[float, float], ...] = (
        (35.0, 0.0),
        (50.0, 30.0),
        (70.0, 60.0),
        (85.0, 100.0),
    )

    MODES = ("auto", "off", "silent", "medium", "full", "curve")
    # Preset percentages — single source of truth for both UI labels and
    # the runner's preset → duty resolution.
    PRESET_DUTY = {
        "off":    0.0,
        "silent": 30.0,
        "medium": 60.0,
        "full":   100.0,
    }

    def validate(self) -> None:
        if not self.sensor_id:
            raise ValueError("fan.sensor_id is required")
        if self.mode not in self.MODES:
            raise ValueError(f"fan.mode must be one of {self.MODES}, got {self.mode!r}")
        if self.mode == "curve":
            if not self.curve or len(self.curve) < 2:
                raise ValueError("fan.curve must have at least 2 anchor points")
            for t, d in self.curve:
                if not 0 <= d <= 100:
                    raise ValueError(f"fan.curve duty must be 0..100, got {d}")
                if not -50 <= t <= 150:
                    raise ValueError(f"fan.curve temp must be -50..150, got {t}")


@dataclass
class FansConfig:
    """Fan-control device (Super-IO PWM)."""
    enabled: bool = False
    update_seconds: float = 3.0       # how often the runner re-evaluates each fan
    fans: list[FanConfig] = field(default_factory=list)

    def validate(self) -> None:
        if not 0.5 <= self.update_seconds <= 30.0:
            raise ValueError(f"fans.update_seconds must be 0.5..30.0, got {self.update_seconds}")
        seen = set()
        for f in self.fans:
            f.validate()
            if f.sensor_id in seen:
                raise ValueError(f"fans.fans contains duplicate sensor_id: {f.sensor_id}")
            seen.add(f.sensor_id)


@dataclass
class ServiceConfig:
    """Service-level settings."""
    kill_asus_stack: bool = True
    """Run `polylux.service.kill_asus_stack.kill_asus_stack()` at startup
    so Aac3572MbHal doesn't fight us for chip 1A21. Requires admin or
    UAC consent on first run for full effect (Stop-Service)."""


@dataclass
class PolyluxConfig:
    service: ServiceConfig = field(default_factory=ServiceConfig)
    matrix: MatrixConfig = field(default_factory=MatrixConfig)
    oled: OledConfig = field(default_factory=OledConfig)
    ryujin_lcd: RyujinLcdConfig = field(default_factory=RyujinLcdConfig)
    aura_rgb: AuraRGBConfig = field(default_factory=AuraRGBConfig)
    fans: FansConfig = field(default_factory=FansConfig)

    def validate(self) -> None:
        self.matrix.validate()
        self.oled.validate()
        self.ryujin_lcd.validate()
        self.aura_rgb.validate()
        self.fans.validate()


def load(path: str | Path = DEFAULT_CONFIG_PATH) -> PolyluxConfig:
    p = Path(path)
    if not p.exists():
        return PolyluxConfig()
    if yaml is None:
        raise RuntimeError("PyYAML required; install with `pip install pyyaml`")
    raw = yaml.safe_load(p.read_text(encoding="utf-8")) or {}

    cfg = PolyluxConfig()

    if "service" in raw:
        s = raw["service"] or {}
        cfg.service.kill_asus_stack = bool(s.get("kill_asus_stack", True))

    m = raw.get("matrix") or {}
    cfg.matrix.enabled = bool(m.get("enabled", False))
    cfg.matrix.scene = str(m.get("scene", cfg.matrix.scene))
    if "color" in m:
        cfg.matrix.color = _coerce_color(m["color"])
    cfg.matrix.text = str(m.get("text", cfg.matrix.text))
    cfg.matrix.rotation = int(m.get("rotation", cfg.matrix.rotation))
    cfg.matrix.update_seconds = float(m.get("update_seconds", cfg.matrix.update_seconds))
    cfg.matrix.brightness = int(m.get("brightness", cfg.matrix.brightness))
    cfg.matrix.scroll_speed = int(m.get("scroll_speed", cfg.matrix.scroll_speed))
    cfg.matrix.text_font_size = int(m.get("text_font_size", cfg.matrix.text_font_size))
    cfg.matrix.clock_font_size = int(m.get("clock_font_size", cfg.matrix.clock_font_size))
    cfg.matrix.image_path = str(m.get("image_path", cfg.matrix.image_path))
    cfg.matrix.image_scroll = bool(m.get("image_scroll", cfg.matrix.image_scroll))
    if "clock_color" in m:
        cfg.matrix.clock_color = _coerce_color(m["clock_color"])

    o = raw.get("oled") or {}
    cfg.oled.enabled = bool(o.get("enabled", False))
    cfg.oled.scene = str(o.get("scene", cfg.oled.scene))
    cfg.oled.label = str(o.get("label", cfg.oled.label))
    cfg.oled.value = str(o.get("value", cfg.oled.value))
    cfg.oled.value_source = str(o.get("value_source", cfg.oled.value_source))
    cfg.oled.update_seconds = float(o.get("update_seconds", cfg.oled.update_seconds))
    cfg.oled.preset_index = int(o.get("preset_index", cfg.oled.preset_index))
    cfg.oled.brightness = int(o.get("brightness", cfg.oled.brightness))
    cfg.oled.font_size = str(o.get("font_size", cfg.oled.font_size))
    cfg.oled.hw_mode = str(o.get("hw_mode", cfg.oled.hw_mode))
    if "rotate_sources" in o and isinstance(o["rotate_sources"], list):
        cfg.oled.rotate_sources = tuple(str(s) for s in o["rotate_sources"])
    cfg.oled.rotate_interval_s = float(o.get("rotate_interval_s", cfg.oled.rotate_interval_s))
    cfg.oled.scroll_speed = int(o.get("scroll_speed", cfg.oled.scroll_speed))

    r = raw.get("ryujin_lcd") or {}
    cfg.ryujin_lcd.enabled = bool(r.get("enabled", False))
    cfg.ryujin_lcd.scene = str(r.get("scene", cfg.ryujin_lcd.scene))

    a = raw.get("aura_rgb") or {}
    cfg.aura_rgb.enabled = bool(a.get("enabled", False))
    scene_raw = str(a.get("scene", cfg.aura_rgb.scene))
    # Map v0.3 lowercase aliases to OpenRGB mode names.
    _legacy = {"solid": "Static", "off": "Off"}
    cfg.aura_rgb.scene = _legacy.get(scene_raw, scene_raw)
    if "color" in a:
        cfg.aura_rgb.color = _coerce_color(a["color"])
    cfg.aura_rgb.host = str(a.get("host", cfg.aura_rgb.host))
    cfg.aura_rgb.port = int(a.get("port", cfg.aura_rgb.port))
    if "types" in a and isinstance(a["types"], list):
        cfg.aura_rgb.types = tuple(str(t).upper() for t in a["types"])
    cfg.aura_rgb.brightness = int(a.get("brightness", cfg.aura_rgb.brightness))

    fans_raw = raw.get("fans") or {}
    cfg.fans.enabled = bool(fans_raw.get("enabled", False))
    cfg.fans.update_seconds = float(fans_raw.get("update_seconds", cfg.fans.update_seconds))
    fan_list = fans_raw.get("fans") or []
    if isinstance(fan_list, list):
        cfg.fans.fans = []
        for entry in fan_list:
            if not isinstance(entry, dict):
                continue
            fan = FanConfig()
            fan.sensor_id = str(entry.get("sensor_id", ""))
            fan.name = str(entry.get("name", fan.sensor_id))
            fan.mode = str(entry.get("mode", fan.mode))
            fan.temp_source = str(entry.get("temp_source", fan.temp_source))
            curve_raw = entry.get("curve")
            if isinstance(curve_raw, list) and curve_raw:
                pts = []
                for p in curve_raw:
                    if isinstance(p, (list, tuple)) and len(p) == 2:
                        pts.append((float(p[0]), float(p[1])))
                if pts:
                    fan.curve = tuple(pts)
            cfg.fans.fans.append(fan)

    cfg.validate()
    return cfg
