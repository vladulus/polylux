"""Polylux main window — frameless shell with sidebar + stacked pages.

Replaces v0.3's polylux/ui/window.py. Frameless, fixed-size for v0.4,
draggable via the titlebar.
"""
from __future__ import annotations

import logging
from typing import Optional

from PyQt6.QtCore import Qt, QPoint
from PyQt6.QtGui import QMouseEvent
from PyQt6.QtWidgets import (
    QFrame, QHBoxLayout, QLabel, QMainWindow, QPushButton, QStackedWidget,
    QVBoxLayout, QWidget,
)

from polylux.ui.sidebar import Sidebar
from polylux.ui.skin import Skin
from polylux.ui.state import ServiceState


log = logging.getLogger(__name__)


NAV_ITEMS = [
    ("dashboard",  "▦  Dashboard"),
    ("matrix",     "⬢  Anime Matrix"),
    ("oled",       "▭  OLED"),
    ("aura_rgb",   "✦  Aura RGB"),
    ("ryujin_lcd", "≋  Ryujin LCD"),
    ("fans",       "✺  Fans"),
    ("settings",   "⚙  Settings"),
]


class MainWindow(QMainWindow):
    def __init__(self, state: ServiceState, skin: Skin) -> None:
        super().__init__()
        self._state = state
        self._skin = skin
        self._drag_pos: Optional[QPoint] = None

        flags = Qt.WindowType.Window
        if skin.frameless:
            flags |= Qt.WindowType.FramelessWindowHint
        self.setWindowFlags(flags)
        self.setFixedSize(skin.width, skin.height)
        self.setWindowTitle("Polylux")

        root = QWidget(self)
        root.setObjectName("root")
        self.setCentralWidget(root)
        root_v = QVBoxLayout(root)
        root_v.setContentsMargins(0, 0, 0, 0)
        root_v.setSpacing(0)

        # Titlebar
        self._titlebar = self._build_titlebar()
        root_v.addWidget(self._titlebar)

        # Body: sidebar + stacked pages
        body = QFrame()
        body_h = QHBoxLayout(body)
        body_h.setContentsMargins(0, 0, 0, 0)
        body_h.setSpacing(0)

        self._sidebar = Sidebar(items=NAV_ITEMS)
        self._sidebar.setFixedWidth(skin.layout.get("sidebar_width", 180))
        body_h.addWidget(self._sidebar)

        self._stack = QStackedWidget()
        body_h.addWidget(self._stack, 1)

        # Pages constructed eagerly so live previews subscribe to state
        # immediately even when the tab isn't visible.
        from polylux.ui.pages.dashboard import DashboardPage
        from polylux.ui.pages.matrix import MatrixPage
        from polylux.ui.pages.oled import OledPage
        from polylux.ui.pages.aura_rgb import AuraRGBPage
        from polylux.ui.pages.ryujin import RyujinPage
        from polylux.ui.pages.fans import FansPage
        from polylux.ui.pages.settings import SettingsPage

        self._pages = {
            "dashboard":  DashboardPage(state),
            "matrix":     MatrixPage(state),
            "oled":       OledPage(state),
            "aura_rgb":   AuraRGBPage(state),
            "ryujin_lcd": RyujinPage(state),
            "fans":       FansPage(state),
            "settings":   SettingsPage(state, skin),
        }
        for key, _ in NAV_ITEMS:
            self._stack.addWidget(self._pages[key])

        self._sidebar.nav_changed.connect(self._on_nav_changed)
        self._on_nav_changed("dashboard")

        root_v.addWidget(body, 1)
        self.setStyleSheet(skin.qss())

    def _build_titlebar(self) -> QFrame:
        bar = QFrame()
        bar.setObjectName("titlebar")
        bar.setFixedHeight(self._skin.layout.get("titlebar_height", 36))
        h = QHBoxLayout(bar)
        h.setContentsMargins(12, 0, 12, 0)
        h.setSpacing(8)

        title = QLabel("POLYLUX")
        title.setObjectName("title_label")
        h.addWidget(title, 1)

        min_btn = QPushButton("—")
        min_btn.setObjectName("min_btn")
        min_btn.setFixedWidth(36)
        min_btn.clicked.connect(self.showMinimized)
        h.addWidget(min_btn)

        close_btn = QPushButton("✕")
        close_btn.setObjectName("close_btn")
        close_btn.setFixedWidth(36)
        close_btn.clicked.connect(self.hide)
        h.addWidget(close_btn)
        return bar

    def _on_nav_changed(self, key: str) -> None:
        keys = [k for k, _ in NAV_ITEMS]
        if key in keys:
            self._stack.setCurrentIndex(keys.index(key))

    # --- frameless drag-to-move ---

    def mousePressEvent(self, e: QMouseEvent) -> None:
        if e.button() == Qt.MouseButton.LeftButton:
            tb_h = self._skin.layout.get("titlebar_height", 36)
            if e.position().y() < tb_h:
                self._drag_pos = e.globalPosition().toPoint() - self.frameGeometry().topLeft()
                e.accept()

    def mouseMoveEvent(self, e: QMouseEvent) -> None:
        if self._drag_pos is not None and (e.buttons() & Qt.MouseButton.LeftButton):
            self.move(e.globalPosition().toPoint() - self._drag_pos)
            e.accept()

    def mouseReleaseEvent(self, e: QMouseEvent) -> None:
        self._drag_pos = None
