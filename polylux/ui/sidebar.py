"""Left navigation sidebar — vertical list of QPushButtons.

Each item has a key (used by MainWindow to switch the stacked widget
index) and a display label. The active item has the `active="true"`
property for QSS styling.
"""
from __future__ import annotations

from typing import Optional, Sequence

from PyQt6.QtCore import pyqtSignal
from PyQt6.QtWidgets import QLabel, QPushButton, QVBoxLayout, QWidget


class Sidebar(QWidget):
    nav_changed = pyqtSignal(str)

    def __init__(
        self,
        items: Sequence[tuple[str, str]],
        brand_text: str = "POLYLUX",
        footer_text: str = "v0.4-dev",
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self.setObjectName("sidebar")
        self._buttons: dict[str, QPushButton] = {}
        self._active: Optional[str] = None

        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(0)

        brand = QLabel(brand_text)
        brand.setObjectName("brand")
        v.addWidget(brand)

        for key, label in items:
            btn = QPushButton(label)
            btn.setProperty("active", "false")
            btn.clicked.connect(lambda _ck, k=key: self.set_active(k))
            v.addWidget(btn)
            self._buttons[key] = btn

        v.addStretch(1)

        foot = QLabel(footer_text)
        foot.setObjectName("sidebar_foot")
        v.addWidget(foot)

        if items:
            self.set_active(items[0][0])

    def active(self) -> Optional[str]:
        return self._active

    def set_active(self, key: str) -> None:
        if key not in self._buttons:
            return
        if key == self._active:
            return
        for k, btn in self._buttons.items():
            on = (k == key)
            btn.setProperty("active", "true" if on else "false")
            btn.style().unpolish(btn)
            btn.style().polish(btn)
        self._active = key
        self.nav_changed.emit(key)
