"""Polylux UI app entry point — QApplication + tray + window.

Runs alongside the driver threads in the same Polylux process. The tray
icon is the always-present touchpoint; the main window is hidden at
launch and shown on left-click of the tray.

Run standalone for UI development::

    python -m polylux.ui.app

This loads polylux.yaml and presents the UI without starting any drivers.
"""
from __future__ import annotations

import logging
import sys
from pathlib import Path
from typing import Optional

from PyQt6.QtCore import Qt
from PyQt6.QtGui import QAction, QIcon, QPainter, QPixmap, QColor, QFont
from PyQt6.QtWidgets import QApplication, QSystemTrayIcon, QMenu

from polylux.ui.skin import load_skin
from polylux.ui.state import ServiceState, build_state
from polylux.ui.window import PolyluxWindow


log = logging.getLogger(__name__)


def _build_tray_icon(accent: str = "#C15F3C") -> QIcon:
    """Generate a simple 32x32 tray icon: orange square with 'P' glyph.

    Lightweight, no external asset needed. Skins can override later by
    providing `tray.png` in their dir (TODO).
    """
    pix = QPixmap(32, 32)
    pix.fill(Qt.GlobalColor.transparent)
    painter = QPainter(pix)
    painter.setRenderHint(QPainter.RenderHint.Antialiasing, True)
    painter.setBrush(QColor(accent))
    painter.setPen(Qt.PenStyle.NoPen)
    painter.drawRoundedRect(2, 2, 28, 28, 6, 6)
    painter.setPen(QColor("#ffffff"))
    f = QFont("Arial", 18)
    f.setBold(True)
    painter.setFont(f)
    painter.drawText(pix.rect(), int(Qt.AlignmentFlag.AlignCenter), "P")
    painter.end()
    return QIcon(pix)


class PolyluxApp:
    """Bundles QApplication + tray icon + main window."""

    def __init__(self, state: ServiceState, skin_name: str = "claude"):
        self._state = state
        self._skin = load_skin(skin_name)
        self._app = QApplication.instance() or QApplication(sys.argv)
        self._app.setQuitOnLastWindowClosed(False)
        self._window = PolyluxWindow(state=state, skin=self._skin)
        self._tray = self._build_tray()

    def _build_tray(self) -> QSystemTrayIcon:
        tray = QSystemTrayIcon(self._app)
        tray.setIcon(_build_tray_icon(accent=self._skin.color("accent", "#C15F3C")))
        tray.setToolTip("Claude's Polylux")

        menu = QMenu()
        a_show = QAction("Open Polylux", menu)
        a_show.triggered.connect(self._show_window)
        menu.addAction(a_show)
        menu.addSeparator()
        a_quit = QAction("Quit", menu)
        a_quit.triggered.connect(self._quit)
        menu.addAction(a_quit)
        tray.setContextMenu(menu)

        tray.activated.connect(self._on_tray_activated)
        tray.show()
        return tray

    def _on_tray_activated(self, reason: int) -> None:
        # Left click or double click → show window
        if reason in (
            QSystemTrayIcon.ActivationReason.Trigger,
            QSystemTrayIcon.ActivationReason.DoubleClick,
        ):
            self._show_window()

    def _show_window(self) -> None:
        self._window.show()
        self._window.raise_()
        self._window.activateWindow()

    def _quit(self) -> None:
        log.info("UI quit requested")
        self._app.quit()

    def exec(self) -> int:
        return self._app.exec()


def main() -> int:
    """Standalone UI launcher — no drivers, just the window for design work."""
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
                        datefmt="%H:%M:%S")
    yaml_path = Path(__file__).resolve().parent.parent.parent / "polylux.yaml"
    state = build_state(yaml_path)
    app = PolyluxApp(state=state)
    # Show window immediately in standalone mode (no service running)
    app._show_window()
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())
