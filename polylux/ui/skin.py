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

        base += f"""
        /* --- v0.4 tabbed UI additions --- */
        #sidebar {{
            background-color: {c.get('sidebar_bg', c.get('bg_alt', '#0a0a0a'))};
            border-right: 1px solid {c.get('sidebar_border', c.get('border', '#1f1f1f'))};
        }}
        #sidebar QLabel#brand {{
            color: {c.get('accent', '#C15F3C')};
            font-family: "{header_family}";
            font-weight: 700;
            font-size: 14px;
            padding: 18px 18px 12px 18px;
            letter-spacing: 3px;
        }}
        #sidebar QPushButton {{
            background: transparent;
            border: none;
            border-left: 3px solid transparent;
            text-align: left;
            padding: 10px 14px 10px 18px;
            color: {c.get('text_dim', '#888')};
            font-family: "{body_family}";
            font-size: 13px;
        }}
        #sidebar QPushButton:hover {{
            color: {c.get('text', '#fff')};
            background-color: {c.get('sidebar_active_bg', '#181818')};
        }}
        #sidebar QPushButton[active="true"] {{
            color: {c.get('text', '#fff')};
            border-left: 3px solid {c.get('accent', '#C15F3C')};
            background-color: {c.get('sidebar_active_bg', '#181818')};
        }}
        #sidebar QLabel#sidebar_foot {{
            color: {c.get('text_dim', '#444')};
            font-size: 10px;
            padding: 8px 18px;
            letter-spacing: 1px;
        }}

        QFrame#scene_card {{
            background-color: {c.get('card_bg', '#161616')};
            border: 1px solid {c.get('card_border', '#242424')};
            border-radius: {l.get('card_radius', 8)}px;
        }}
        QFrame#scene_card[active="true"] {{
            border-color: {c.get('accent', '#C15F3C')};
            background-color: {c.get('scene_card_active_bg', '#1a120e')};
        }}
        QFrame#scene_card_preview {{
            background-color: {c.get('bg_alt', '#0a0a0a')};
            border-bottom: 1px solid {c.get('card_border', '#1f1f1f')};
        }}
        QLabel#scene_card_title {{
            color: {c.get('text_dim', '#888')};
            font-size: 12px;
            letter-spacing: 1px;
        }}
        QFrame#scene_card[active="true"] QLabel#scene_card_title {{
            color: {c.get('accent', '#C15F3C')};
            font-weight: 600;
        }}

        QLabel#card_label {{
            color: {c.get('text_dim', '#666')};
            font-size: {self.font_size('label')}px;
            letter-spacing: 2px;
            font-weight: 600;
        }}

        QPushButton#seg_button {{
            background: transparent;
            color: {c.get('text_dim', '#888')};
            border: 1px solid {c.get('card_border', '#242424')};
            border-right: none;
            border-radius: 0;
            padding: 9px 0;
            font-family: "{self.font_family('header')}";
            font-size: 12px;
        }}
        QPushButton#seg_button:first-child {{ border-top-left-radius: 6px; border-bottom-left-radius: 6px; }}
        QPushButton#seg_button:last-child  {{ border-right: 1px solid {c.get('card_border', '#242424')}; border-top-right-radius: 6px; border-bottom-right-radius: 6px; }}
        QPushButton#seg_button[on="true"] {{
            background-color: {c.get('accent', '#C15F3C')};
            color: white;
            font-weight: 600;
            border-color: {c.get('accent', '#C15F3C')};
        }}

        QLabel#field_label {{
            color: {c.get('text_dim', '#888')};
            font-size: {self.font_size('label')}px;
            letter-spacing: 1px;
        }}
        QLabel#slider_readout {{
            color: {c.get('text', '#fff')};
            font-family: "{self.font_family('header')}";
            font-size: 13px;
        }}

        QSlider::groove:horizontal {{
            background: {c.get('bg_alt', '#0a0a0a')};
            border: 1px solid {c.get('card_border', '#242424')};
            border-radius: 3px;
            height: 6px;
        }}
        QSlider::sub-page:horizontal {{
            background: {c.get('accent', '#C15F3C')};
            border: 1px solid {c.get('accent', '#C15F3C')};
            border-radius: 3px;
            height: 6px;
        }}
        QSlider::add-page:horizontal {{
            background: {c.get('bg_alt', '#0a0a0a')};
            border: 1px solid {c.get('card_border', '#242424')};
            border-radius: 3px;
            height: 6px;
        }}
        QSlider::handle:horizontal {{
            background: {c.get('accent', '#C15F3C')};
            border: 2px solid {c.get('surface', '#161616')};
            width: 14px;
            margin-top: -6px;
            margin-bottom: -6px;
            border-radius: 9px;
        }}
        QSlider::handle:horizontal:hover {{
            background: {c.get('text', '#fff')};
        }}

        QCheckBox {{
            color: {c.get('text', '#e6e6e6')};
            spacing: 8px;
            padding: 4px 0;
        }}
        QCheckBox::indicator {{
            width: 16px;
            height: 16px;
            border: 1px solid {c.get('card_border', '#242424')};
            border-radius: 3px;
            background: {c.get('bg_alt', '#0a0a0a')};
        }}
        QCheckBox::indicator:checked {{
            background: {c.get('accent', '#C15F3C')};
            border-color: {c.get('accent', '#C15F3C')};
            image: none;
        }}
        QCheckBox::indicator:hover {{
            border-color: {c.get('accent', '#C15F3C')};
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
