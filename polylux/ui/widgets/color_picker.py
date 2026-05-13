"""ColorPicker — current-color swatch (opens dialog) + preset row.

Click the big swatch to open the system colour dialog. Or click a
preset for one of 8 common colours. Hex-typing is a power-user feature
deferred to v0.5; it muddies the visual without earning its keep here.
"""
from __future__ import annotations

from typing import Optional, Sequence

from PyQt6.QtCore import pyqtSignal
from PyQt6.QtGui import QColor
from PyQt6.QtWidgets import (
    QColorDialog, QHBoxLayout, QPushButton, QVBoxLayout, QWidget,
)


RGB = tuple[int, int, int]

DEFAULT_PRESETS: Sequence[RGB] = (
    (255, 255, 255), (193,  95,  60), (255,   0,   0),
    (255, 165,   0), (255, 255,   0), (  0, 255,   0),
    (  0, 200, 255), (170,   0, 255),
)


class ColorPicker(QWidget):
    """Emits ``color_changed((r,g,b))`` on swatch-dialog or preset click."""

    color_changed = pyqtSignal(tuple)

    def __init__(
        self,
        color: RGB = (255, 255, 255),
        presets: Sequence[RGB] = DEFAULT_PRESETS,
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._color: RGB = tuple(color)  # type: ignore[assignment]
        self._presets = list(presets)

        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(10)

        self._swatch = QPushButton("CUSTOM…")
        self._swatch.setObjectName("color_swatch")
        self._swatch.setFixedHeight(38)
        self._swatch.clicked.connect(self._open_dialog)
        v.addWidget(self._swatch)

        self._preset_row = QHBoxLayout()
        self._preset_row.setSpacing(6)
        for i, p in enumerate(self._presets):
            btn = QPushButton()
            btn.setObjectName("color_preset")
            btn.setFixedSize(28, 28)
            btn.setStyleSheet(
                f"background-color: rgb({p[0]},{p[1]},{p[2]}); "
                f"border: 1px solid #2a2a2a; border-radius: 4px;"
            )
            btn.clicked.connect(lambda _ck, idx=i: self._on_preset_clicked(idx))
            self._preset_row.addWidget(btn)
        self._preset_row.addStretch(1)
        v.addLayout(self._preset_row)

        self._refresh()

    def color(self) -> RGB:
        return self._color

    def set_color(self, c: RGB) -> None:
        c = (int(c[0]) & 0xFF, int(c[1]) & 0xFF, int(c[2]) & 0xFF)
        if c == self._color:
            return
        self._color = c
        self._refresh()
        self.color_changed.emit(c)

    def hex_text(self) -> str:
        r, g, b = self._color
        return f"#{r:02X}{g:02X}{b:02X}"

    def _refresh(self) -> None:
        r, g, b = self._color
        # Auto-pick text color for contrast against the swatch bg.
        luma = 0.299 * r + 0.587 * g + 0.114 * b
        fg = "#000000" if luma > 140 else "#FFFFFF"
        self._swatch.setStyleSheet(
            f"background-color: rgb({r},{g},{b}); color: {fg}; "
            f"border: 1px solid #2a2a2a; border-radius: 6px; "
            f"font-family: 'JetBrains Mono', monospace; letter-spacing: 2px;"
        )
        self._swatch.setText(f"#{r:02X}{g:02X}{b:02X}")

    def _open_dialog(self) -> None:
        r, g, b = self._color
        col = QColorDialog.getColor(QColor(r, g, b), self, "Pick a colour")
        if col.isValid():
            self.set_color((col.red(), col.green(), col.blue()))

    def _on_preset_clicked(self, idx: int) -> None:
        if 0 <= idx < len(self._presets):
            self.set_color(self._presets[idx])
