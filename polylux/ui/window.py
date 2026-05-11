"""Polylux main window — frameless skinnable PyQt6 window.

Layout (compact, Winamp-style):
  +----------------------------------------+
  | titlebar:  POLYLUX           - x       |
  +----------------------------------------+
  | matrix:   [clock      v]  status: OK   |
  | oled:     [hw_monitor v]  CPU 23%       |
  | ryujin:   [hw_monitor v]                |
  | rgb:      [off        v]                |
  +----------------------------------------+
  | skin: [claude       v]   [☐ on top]    |
  +----------------------------------------+
"""
from __future__ import annotations

import logging
from typing import Optional

from PyQt6.QtCore import Qt, QPoint, QTimer
from PyQt6.QtGui import QMouseEvent
from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QComboBox, QGroupBox, QGridLayout, QCheckBox, QFrame,
)

from polylux.ui.skin import Skin, list_skins, load_skin
from polylux.ui.state import ServiceState


log = logging.getLogger(__name__)


class PolyluxWindow(QMainWindow):
    """Frameless skinnable main window."""

    def __init__(self, state: ServiceState, skin: Skin):
        super().__init__()
        self._state = state
        self._skin = skin
        self._drag_pos: Optional[QPoint] = None

        self._init_window()
        self._build_ui()
        self._apply_skin(skin)

        # Periodic status refresh
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._refresh_status)
        self._timer.start(1000)

    def _init_window(self) -> None:
        flags = Qt.WindowType.Window
        if self._skin.frameless:
            flags |= Qt.WindowType.FramelessWindowHint
        self.setWindowFlags(flags)
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground, False)
        self.setFixedSize(self._skin.width, self._skin.height)
        self.setWindowTitle("Claude's Polylux")

    def _build_ui(self) -> None:
        root = QWidget(self)
        root.setObjectName("root")
        self.setCentralWidget(root)

        v = QVBoxLayout(root)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(0)

        # Titlebar
        titlebar = QFrame()
        titlebar.setObjectName("titlebar")
        tb = QHBoxLayout(titlebar)
        tb.setContentsMargins(0, 0, 0, 0)
        title = QLabel("CLAUDE'S POLYLUX")
        title.setObjectName("title_label")
        tb.addWidget(title, 1)
        self._on_top_cb = QCheckBox("on top")
        self._on_top_cb.setObjectName("on_top_cb")
        self._on_top_cb.toggled.connect(self._toggle_on_top)
        tb.addWidget(self._on_top_cb)
        min_btn = QPushButton("—")
        min_btn.setObjectName("min_btn")
        min_btn.setFixedWidth(36)
        min_btn.clicked.connect(self.showMinimized)
        tb.addWidget(min_btn)
        close_btn = QPushButton("✕")
        close_btn.setObjectName("close_btn")
        close_btn.setFixedWidth(36)
        close_btn.clicked.connect(self.hide)
        tb.addWidget(close_btn)
        v.addWidget(titlebar)

        # Body
        body = QWidget()
        body_layout = QVBoxLayout(body)
        body_layout.setContentsMargins(12, 12, 12, 12)
        body_layout.setSpacing(8)

        # Per-device row factory
        self._device_combos: dict[str, QComboBox] = {}
        self._device_status: dict[str, QLabel] = {}

        device_specs = [
            ("matrix",     "matrix",     ["clock", "text", "fill", "off"]),
            ("oled",       "oled",       ["hardware_monitor", "text", "qcode", "preset_gif", "off"]),
            ("ryujin_lcd", "ryujin LCD", ["hardware_monitor", "off"]),
            ("aura_rgb",   "aura RGB",   ["solid", "off"]),
        ]
        grid = QGridLayout()
        grid.setHorizontalSpacing(8)
        grid.setVerticalSpacing(6)
        for row, (key, label, scenes) in enumerate(device_specs):
            lbl = QLabel(label + ":")
            lbl.setObjectName("dim")
            grid.addWidget(lbl, row, 0)
            combo = QComboBox()
            combo.addItems(scenes)
            combo.currentTextChanged.connect(
                lambda txt, k=key: self._on_scene_changed(k, txt)
            )
            grid.addWidget(combo, row, 1)
            self._device_combos[key] = combo
            status = QLabel("—")
            status.setObjectName("dim")
            grid.addWidget(status, row, 2)
            self._device_status[key] = status
        body_layout.addLayout(grid)

        body_layout.addStretch(1)

        # Footer: skin selector + version
        footer = QHBoxLayout()
        footer.addWidget(QLabel("skin:"))
        self._skin_combo = QComboBox()
        self._skin_combo.addItems(list_skins())
        self._skin_combo.setCurrentText(self._skin.name.lower())
        self._skin_combo.currentTextChanged.connect(self._on_skin_changed)
        footer.addWidget(self._skin_combo)
        footer.addStretch(1)
        v_lbl = QLabel("v0.3-dev")
        v_lbl.setObjectName("accent")
        footer.addWidget(v_lbl)
        body_layout.addLayout(footer)

        v.addWidget(body, 1)

        # Sync initial selections from config
        self._sync_from_config()

    def _apply_skin(self, skin: Skin) -> None:
        self._skin = skin
        self.setStyleSheet(skin.qss())
        self.setFixedSize(skin.width, skin.height)

    # --- event handlers ---

    def _on_scene_changed(self, device: str, scene: str) -> None:
        try:
            self._state.update_device(device, {"scene": scene})
            log.info("%s.scene -> %s", device, scene)
        except Exception:
            log.exception("scene change failed")

    def _on_skin_changed(self, name: str) -> None:
        try:
            new_skin = load_skin(name)
            self._apply_skin(new_skin)
        except Exception:
            log.exception("skin change failed")

    def _toggle_on_top(self, on: bool) -> None:
        flags = self.windowFlags()
        if on:
            flags |= Qt.WindowType.WindowStaysOnTopHint
        else:
            flags &= ~Qt.WindowType.WindowStaysOnTopHint
        self.setWindowFlags(flags)
        self.show()  # required after flag change

    def _sync_from_config(self) -> None:
        cfg = self._state.snapshot()
        self._device_combos["matrix"].setCurrentText(cfg.matrix.scene)
        self._device_combos["oled"].setCurrentText(cfg.oled.scene)
        self._device_combos["ryujin_lcd"].setCurrentText(cfg.ryujin_lcd.scene)
        self._device_combos["aura_rgb"].setCurrentText(cfg.aura_rgb.scene)

    def _refresh_status(self) -> None:
        import time
        now = time.time()
        status = self._state.status()
        cfg = self._state.snapshot()
        enabled_map = {
            "matrix": cfg.matrix.enabled,
            "oled": cfg.oled.enabled,
            "ryujin_lcd": cfg.ryujin_lcd.enabled,
            "aura_rgb": cfg.aura_rgb.enabled,
        }
        for k, lbl in self._device_status.items():
            if not enabled_map[k]:
                lbl.setText("disabled")
                lbl.setObjectName("dim")
                continue
            s = status[k]
            if s["last_error"]:
                lbl.setText(f"err: {s['last_error'][:24]}")
                lbl.setObjectName("status_err")
            elif s["last_update"] == 0:
                lbl.setText("starting…")
                lbl.setObjectName("dim")
            elif now - s["last_update"] < 5:
                lbl.setText("OK")
                lbl.setObjectName("status_ok")
            else:
                lbl.setText(f"stale {int(now - s['last_update'])}s")
                lbl.setObjectName("status_warn")
            lbl.setStyleSheet("")  # force re-evaluation of object name in QSS

    # --- frameless drag-to-move ---

    def mousePressEvent(self, e: QMouseEvent) -> None:
        if e.button() == Qt.MouseButton.LeftButton:
            # Only drag if click is on the titlebar zone
            if e.position().y() < self._skin.layout.get("titlebar_height", 32):
                self._drag_pos = e.globalPosition().toPoint() - self.frameGeometry().topLeft()
                e.accept()

    def mouseMoveEvent(self, e: QMouseEvent) -> None:
        if self._drag_pos is not None and e.buttons() & Qt.MouseButton.LeftButton:
            self.move(e.globalPosition().toPoint() - self._drag_pos)
            e.accept()

    def mouseReleaseEvent(self, e: QMouseEvent) -> None:
        self._drag_pos = None
