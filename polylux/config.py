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

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

try:
    import yaml  # type: ignore[import-untyped]
except ImportError:  # pragma: no cover
    yaml = None


DEFAULT_CONFIG_PATH = Path(__file__).resolve().parent.parent / "polylux.yaml"


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
    color: RGB = (0xFF, 0xFF, 0xFF)
    text: str = ""
    rotation: int = 270
    update_seconds: float = 1.0     # how often the scene re-renders

    SCENES = ("clock", "text", "fill", "off")

    def validate(self) -> None:
        if self.scene not in self.SCENES:
            raise ValueError(f"matrix.scene must be one of {self.SCENES}, got {self.scene!r}")
        if self.rotation not in (0, 90, 180, 270):
            raise ValueError(f"matrix.rotation must be 0/90/180/270, got {self.rotation}")


@dataclass
class OledConfig:
    enabled: bool = False
    scene: str = "hardware_monitor"
    label: str = "CPU Temp."
    value: str = ""                  # used when scene=text (static)
    value_source: str = "cpu_temp"   # used when scene=hardware_monitor
    update_seconds: float = 2.0
    preset_index: int = 0            # used when scene=preset_gif

    SCENES = ("hardware_monitor", "text", "preset_gif", "off")
    VALUE_SOURCES = ("cpu_temp", "gpu_temp", "cpu_pct", "mem_pct", "static")

    def validate(self) -> None:
        if self.scene not in self.SCENES:
            raise ValueError(f"oled.scene must be one of {self.SCENES}, got {self.scene!r}")
        if self.scene == "hardware_monitor" and self.value_source not in self.VALUE_SOURCES:
            raise ValueError(f"oled.value_source must be one of {self.VALUE_SOURCES}, got {self.value_source!r}")


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
    scene: str = "off"
    color: RGB = (0, 0, 0)
    host: str = "127.0.0.1"
    port: int = 6742
    # Default safe: only touch motherboard. Users opt in to keyboards
    # / mice / etc by adding their type names here.
    types: tuple[str, ...] = ("MOTHERBOARD",)

    SCENES = ("solid", "off")

    def validate(self) -> None:
        if self.scene not in self.SCENES:
            raise ValueError(f"aura_rgb.scene must be one of {self.SCENES}, got {self.scene!r}")


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

    def validate(self) -> None:
        self.matrix.validate()
        self.oled.validate()
        self.ryujin_lcd.validate()
        self.aura_rgb.validate()


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

    o = raw.get("oled") or {}
    cfg.oled.enabled = bool(o.get("enabled", False))
    cfg.oled.scene = str(o.get("scene", cfg.oled.scene))
    cfg.oled.label = str(o.get("label", cfg.oled.label))
    cfg.oled.value = str(o.get("value", cfg.oled.value))
    cfg.oled.value_source = str(o.get("value_source", cfg.oled.value_source))
    cfg.oled.update_seconds = float(o.get("update_seconds", cfg.oled.update_seconds))
    cfg.oled.preset_index = int(o.get("preset_index", cfg.oled.preset_index))

    r = raw.get("ryujin_lcd") or {}
    cfg.ryujin_lcd.enabled = bool(r.get("enabled", False))
    cfg.ryujin_lcd.scene = str(r.get("scene", cfg.ryujin_lcd.scene))

    a = raw.get("aura_rgb") or {}
    cfg.aura_rgb.enabled = bool(a.get("enabled", False))
    cfg.aura_rgb.scene = str(a.get("scene", cfg.aura_rgb.scene))
    if "color" in a:
        cfg.aura_rgb.color = _coerce_color(a["color"])
    cfg.aura_rgb.host = str(a.get("host", cfg.aura_rgb.host))
    cfg.aura_rgb.port = int(a.get("port", cfg.aura_rgb.port))
    if "types" in a and isinstance(a["types"], list):
        cfg.aura_rgb.types = tuple(str(t).upper() for t in a["types"])

    cfg.validate()
    return cfg
