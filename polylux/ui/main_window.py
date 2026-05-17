"""Polylux main window — frameless shell with sidebar + stacked pages.

Replaces v0.3's polylux/ui/window.py. Frameless, fixed-size for v0.4,
draggable via the titlebar.
"""
from __future__ import annotations

import logging
from typing import Optional

from PyQt6.QtCore import Qt, QPoint
from PyQt6.QtGui import QCloseEvent, QMouseEvent
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

        # Belt-and-suspenders so Polylux never quits because the user
        # closed the window. closeEvent below already calls hide() +
        # ignore(), but Qt has historically had edge cases (modal
        # dialogs being destroyed, taskbar close, ALT+F4 on hidden
        # window) where the widget can still be destroyed despite
        # ignore(), and once *that* fires Qt counts it as the "last
        # window closed" — together with QApplication.quitOnLastWindow=
        # False this prevents either path from taking the app down.
        self.setAttribute(Qt.WidgetAttribute.WA_QuitOnClose, False)

        flags = Qt.WindowType.Window
        if skin.frameless:
            flags |= Qt.WindowType.FramelessWindowHint
        self.setWindowFlags(flags)
        self.setFixedSize(skin.width, skin.height)
        self.setWindowTitle("Claude's Polylux")

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

        title = QLabel("CLAUDE'S POLYLUX")
        title.setObjectName("title_label")
        h.addWidget(title, 1)

        # Support / donate link — sits to the right of the title,
        # before the window controls, visible but not pushy. Revolut.me
        # for UK-friendly zero-fee instant transfers.
        bmc_btn = QPushButton("♥  SUPPORT")
        bmc_btn.setObjectName("bmc_btn")
        bmc_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        bmc_btn.setToolTip("Open revolut.me/vladrev76 in your browser")
        bmc_btn.clicked.connect(self._open_support_page)
        h.addWidget(bmc_btn)

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

    def _open_support_page(self) -> None:
        # Best-effort — failure to open the browser is harmless, the
        # button just does nothing.
        try:
            import webbrowser
            webbrowser.open("https://revolut.me/vladrev76")
        except Exception:
            log.warning("could not open support page", exc_info=True)

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

    def closeEvent(self, event: QCloseEvent) -> None:
        """Hide instead of destroying.

        Without this override, an Alt+F4 / taskbar 'Close window' /
        any system-level close request destroys the QMainWindow. Once
        it's destroyed, there are no top-level windows left except the
        QSystemTrayIcon — and Qt then quits the whole application
        regardless of setQuitOnLastWindowClosed(False). The result was
        Polylux silently exiting at random whenever the user closed
        the main window. Ignoring the event + calling hide() keeps the
        tray icon alive and the app running; the user can re-open the
        window from the tray any time.
        """
        event.ignore()
        self.hide()
