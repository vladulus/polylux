"""Polylux skin loader — directory-based skins with JSON manifest.

A skin lives in `polylux/ui/skins/<name>/` and contains:
  skin.json  — manifest (colors, fonts, layout, geometry)
  *.png      — optional bitmap assets (background, custom buttons)
  *.qss      — optional Qt StyleSheet for finer control

Users install custom skins by dropping a folder in the same location.
"""
from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


log = logging.getLogger(__name__)

SKINS_DIR = Path(__file__).resolve().parent / "skins"


@dataclass
class Skin:
    name: str
    author: str = "unknown"
    description: str = ""
    version: str = "1.0"

    width: int = 480
    height: int = 280
    frameless: bool = True
    always_on_top_available: bool = True

    colors: dict[str, str] = field(default_factory=dict)
    fonts: dict[str, object] = field(default_factory=dict)
    layout: dict[str, int] = field(default_factory=dict)

    asset_dir: Path = field(default_factory=Path)

    def color(self, key: str, fallback: str = "#FFFFFF") -> str:
        return self.colors.get(key, fallback)

    def font_family(self, role: str = "body") -> str:
        """Return the FIRST family from the comma-separated list as
        the primary; system fallback handled by Qt."""
        families = self.fonts.get(role, ["sans-serif"])
        if isinstance(families, str):
            return families
        if not families:
            return "sans-serif"
        return families[0]

    def font_size(self, role: str = "body") -> int:
        key = f"{role}_size_px"
        v = self.fonts.get(key, 12)
        return int(v) if v else 12

    def asset_path(self, rel: str) -> Optional[Path]:
        p = self.asset_dir / rel
        return p if p.exists() else None

    def qss(self) -> str:
        """Build a Qt StyleSheet from the manifest colors + layout.

        Skins can override with a `style.qss` file in their directory —
        if present, its content is appended after the generated base.
        """
        c = self.colors
        l = self.layout
        body_family = self.font_family("body")
        body_size = self.font_size("body")
        header_family = self.font_family("header")
        header_size = self.font_size("header")
        mono_size = self.font_size("mono")
        padding = l.get("padding", 12)
        row_gap = l.get("row_gap", 8)
        radius = l.get("border_radius_px", 8)

        base = f"""
        /* Generated from skin: {self.name} */
        QWidget {{
            background-color: {c.get('bg', '#1a1a1a')};
            color: {c.get('text', '#e6e6e6')};
            font-family: "{body_family}";
            font-size: {body_size}px;
        }}
        QMainWindow, #root {{
            background-color: {c.get('bg', '#1a1a1a')};
            border: 1px solid {c.get('border', '#3a3a3a')};
            border-radius: {radius}px;
        }}
        #titlebar {{
            background-color: {c.get('bg_alt', '#222222')};
            border-top-left-radius: {radius}px;
            border-top-right-radius: {radius}px;
            min-height: {l.get('titlebar_height', 32)}px;
        }}
        #titlebar QLabel {{
            background: transparent;
            color: {c.get('text', '#e6e6e6')};
            font-family: "{header_family}";
            font-size: {header_size}px;
            padding-left: {padding}px;
        }}
        #titlebar QPushButton {{
            background: transparent;
            color: {c.get('text_dim', '#888888')};
            border: none;
            padding: 4px 10px;
        }}
        #titlebar QPushButton:hover {{
            color: {c.get('text', '#e6e6e6')};
            background-color: {c.get('surface', '#2a2a2a')};
        }}
        #titlebar QPushButton#close_btn:hover {{
            color: white;
            background-color: {c.get('err', '#ef5350')};
        }}
        QGroupBox {{
            background-color: {c.get('surface', '#2a2a2a')};
            border: 1px solid {c.get('border', '#3a3a3a')};
            border-radius: {radius}px;
            margin-top: {row_gap}px;
            padding: {padding}px;
            font-family: "{header_family}";
            font-size: {header_size}px;
        }}
        QPushButton {{
            background-color: {c.get('surface', '#2a2a2a')};
            color: {c.get('text', '#e6e6e6')};
            border: 1px solid {c.get('border', '#3a3a3a')};
            border-radius: {radius//2}px;
            padding: 4px 12px;
        }}
        QPushButton:hover {{
            border-color: {c.get('accent', '#C15F3C')};
        }}
        QPushButton:pressed {{
            background-color: {c.get('accent_dim', '#7a3d27')};
        }}
        QComboBox, QLineEdit, QSpinBox {{
            background-color: {c.get('bg_alt', '#222222')};
            color: {c.get('text', '#e6e6e6')};
            border: 1px solid {c.get('border', '#3a3a3a')};
            border-radius: {radius//2}px;
            padding: 4px 8px;
        }}
        QComboBox:hover, QLineEdit:hover, QSpinBox:hover {{
            border-color: {c.get('accent', '#C15F3C')};
        }}
        QLabel#status_ok {{ color: {c.get('ok', '#4caf50')}; }}
        QLabel#status_warn {{ color: {c.get('warn', '#ffa726')}; }}
        QLabel#status_err {{ color: {c.get('err', '#ef5350')}; }}
        QLabel#accent {{ color: {c.get('accent', '#C15F3C')}; }}
        QLabel#dim {{ color: {c.get('text_dim', '#888888')}; }}
        QFrame#card {{
            background-color: {c.get('surface', '#2a2a2a')};
            border: 1px solid {c.get('border', '#3a3a3a')};
            border-radius: {radius}px;
        }}
        """
        # Append per-skin overrides if present.
        custom = self.asset_dir / "style.qss"
        if custom.exists():
            try:
                base += "\n/* Custom override */\n" + custom.read_text(encoding="utf-8")
            except Exception:
                log.exception("failed to read %s", custom)
        return base


def load_skin(name: str = "claude") -> Skin:
    """Load a skin by directory name from `polylux/ui/skins/`."""
    skin_dir = SKINS_DIR / name
    manifest_path = skin_dir / "skin.json"
    if not manifest_path.exists():
        log.warning("skin '%s' not found, falling back to claude", name)
        skin_dir = SKINS_DIR / "claude"
        manifest_path = skin_dir / "skin.json"

    with manifest_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    win = data.get("window", {})
    return Skin(
        name=data.get("name", name),
        author=data.get("author", "unknown"),
        description=data.get("description", ""),
        version=data.get("version", "1.0"),
        width=int(win.get("width", 480)),
        height=int(win.get("height", 280)),
        frameless=bool(win.get("frameless", True)),
        always_on_top_available=bool(win.get("always_on_top_available", True)),
        colors=dict(data.get("colors", {})),
        fonts=dict(data.get("fonts", {})),
        layout={k: int(v) if isinstance(v, (int, float)) else v
                for k, v in data.get("layout", {}).items()},
        asset_dir=skin_dir,
    )


def list_skins() -> list[str]:
    """List installed skin directory names."""
    if not SKINS_DIR.exists():
        return []
    return sorted(d.name for d in SKINS_DIR.iterdir()
                  if d.is_dir() and (d / "skin.json").exists())
