"""Polylux configuration loader.

Reads `polylux.yaml` from the project root (or a path passed in). Exposes
typed access to per-device settings.

Example config::

    matrix:
      enabled: true
      mode: force_color
      color: [0, 255, 0]   # RGB

    oled:
      enabled: false       # not yet implemented

    ryujin_lcd:
      enabled: false       # not yet implemented
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


@dataclass
class MatrixConfig:
    enabled: bool = False
    mode: str = "force_color"  # only mode supported in v0.1
    color: tuple[int, int, int] = (0, 255, 0)

    def validate(self) -> None:
        if self.mode != "force_color":
            raise ValueError(f"matrix.mode={self.mode!r} not yet supported")
        if not (0 <= self.color[0] <= 255 and 0 <= self.color[1] <= 255 and 0 <= self.color[2] <= 255):
            raise ValueError(f"matrix.color components must be 0..255, got {self.color}")


@dataclass
class OledConfig:
    enabled: bool = False


@dataclass
class RyujinLcdConfig:
    enabled: bool = False


@dataclass
class PolyluxConfig:
    matrix: MatrixConfig = field(default_factory=MatrixConfig)
    oled: OledConfig = field(default_factory=OledConfig)
    ryujin_lcd: RyujinLcdConfig = field(default_factory=RyujinLcdConfig)

    def validate(self) -> None:
        self.matrix.validate()


def _coerce_color(raw: Any) -> tuple[int, int, int]:
    if not isinstance(raw, (list, tuple)) or len(raw) != 3:
        raise ValueError(f"color must be a 3-element list, got {raw!r}")
    return (int(raw[0]), int(raw[1]), int(raw[2]))


def load(path: str | Path = DEFAULT_CONFIG_PATH) -> PolyluxConfig:
    p = Path(path)
    if not p.exists():
        # Allow running with all defaults (everything disabled)
        return PolyluxConfig()
    if yaml is None:
        raise RuntimeError(
            "PyYAML is required to load config; install with `pip install pyyaml`"
        )
    raw = yaml.safe_load(p.read_text(encoding="utf-8")) or {}

    cfg = PolyluxConfig()

    m = raw.get("matrix") or {}
    cfg.matrix.enabled = bool(m.get("enabled", False))
    cfg.matrix.mode = str(m.get("mode", "force_color"))
    if "color" in m:
        cfg.matrix.color = _coerce_color(m["color"])

    o = raw.get("oled") or {}
    cfg.oled.enabled = bool(o.get("enabled", False))

    r = raw.get("ryujin_lcd") or {}
    cfg.ryujin_lcd.enabled = bool(r.get("enabled", False))

    cfg.validate()
    return cfg
