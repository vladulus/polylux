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
from PyQt6.QtGui import QAction, QIcon, QPainter, QPixmap, QColor, QFont, QFontDatabase
from PyQt6.QtWidgets import QApplication, QSystemTrayIcon, QMenu

_FONT_DIR = Path(__file__).resolve().parent / "fonts"


def _register_bundled_fonts() -> list[str]:
    """Load every .ttf/.otf in polylux/ui/fonts/ into the Qt font db.

    Returns the family names Qt registered so callers can verify the
    asset reached the renderer (PyInstaller-frozen builds occasionally
    miss the data file if the spec wasn't refreshed)."""
    if not _FONT_DIR.is_dir():
        return []
    families: list[str] = []
    for path in sorted(_FONT_DIR.glob("*")):
        if path.suffix.lower() not in (".ttf", ".otf"):
            continue
        font_id = QFontDatabase.addApplicationFont(str(path))
        if font_id < 0:
            log.warning("font: failed to register %s", path.name)
            continue
        for fam in QFontDatabase.applicationFontFamilies(font_id):
            families.append(fam)
            log.info("font registered: %s (from %s)", fam, path.name)
    return families

from polylux.ui.main_window import MainWindow
from polylux.ui.skin import load_skin
from polylux.ui.state import ServiceState, build_state


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
    """Bundles QApplication + tray icon + main window.

    ``start_minimized=True`` keeps the main window hidden at launch and
    surfaces a one-shot tray notification so the user knows Polylux is
    running. Used by the autostart Run-key so boot doesn't pop the
    full window. Manual launches (Start menu, desktop shortcut) leave
    it ``False`` so the window opens immediately on click.
    """

    def __init__(self, state: ServiceState, skin_name: str = "claude",
                 start_minimized: bool = False):
        self._state = state
        self._skin = load_skin(skin_name)
        self._start_minimized = start_minimized
        self._app = QApplication.instance() or QApplication(sys.argv)
        self._app.setQuitOnLastWindowClosed(False)
        # Bundled fonts (Asus ROG, etc.) must register before any widget
        # constructs its QFonts — otherwise Qt falls back to the next
        # name in the skin's family list silently.
        _register_bundled_fonts()
        # Log every "about to quit" so we can root-cause unexpected
        # shutdowns: aboutToQuit fires on app.quit(), SIGTERM/SIGINT,
        # session logout, or sometimes when Qt itself decides to exit
        # despite quitOnLastWindowClosed=False. Without this hook,
        # silent exits leave no trace in polylux.log.
        self._app.aboutToQuit.connect(
            lambda: log.warning("QApplication.aboutToQuit fired — Polylux shutting down")
        )
        # Set a sane application-wide default font so widgets without
        # explicit font-size in QSS don't inherit point-size -1.
        default_font = QFont(self._skin.font_family("body"), self._skin.font_size("body"))
        if default_font.pointSize() <= 0:
            default_font.setPointSize(10)
        self._app.setFont(default_font)
        self._window = MainWindow(state=state, skin=self._skin)
        self._tray = self._build_tray()
        if not start_minimized:
            self._show_window()
        elif self._tray.supportsMessages():
            self._tray.showMessage(
                "Claude's Polylux",
                "Running in tray. Click the icon to open.",
                QSystemTrayIcon.MessageIcon.Information,
                3000,
            )

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
