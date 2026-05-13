"""ColorPicker — swatch button + hex input + preset row.

The big swatch opens a QColorDialog for visual picking. Hex input lets
the user type any RGB. Presets are quick-click swatches for the 6-8
common colors.
"""
from __future__ import annotations

from typing import Optional, Sequence

from PyQt6.QtCore import pyqtSignal
from PyQt6.QtGui import QColor
from PyQt6.QtWidgets import (
    QColorDialog, QHBoxLayout, QLineEdit, QPushButton, QVBoxLayout, QWidget,
)


RGB = tuple[int, int, int]

DEFAULT_PRESETS: Sequence[RGB] = (
    (255, 255, 255), (193,  95,  60), (255,   0,   0),
    (255, 165,   0), (255, 255,   0), (  0, 255,   0),
    (  0, 200, 255), (170,   0, 255),
)


class ColorPicker(QWidget):
    """Emits ``color_changed((r,g,b))`` when the colour changes from any
    of: swatch dialog, hex input commit, or preset click.
    """

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

        row1 = QHBoxLayout()
        row1.setSpacing(10)
        self._swatch = QPushButton()
        self._swatch.setObjectName("color_swatch")
        self._swatch.setFixedSize(48, 48)
        self._swatch.clicked.connect(self._open_dialog)
        row1.addWidget(self._swatch)

        self._hex = QLineEdit()
        self._hex.setObjectName("hex_input")
        self._hex.setMaxLength(7)
        self._hex.editingFinished.connect(self._on_hex_commit)
        row1.addWidget(self._hex, 1)
        v.addLayout(row1)

        self._preset_row = QHBoxLayout()
        self._preset_row.setSpacing(6)
        for i, p in enumerate(self._presets):
            btn = QPushButton()
            btn.setObjectName("color_preset")
            btn.setFixedSize(22, 22)
            btn.setStyleSheet(f"background-color: rgb({p[0]},{p[1]},{p[2]}); border-radius: 4px;")
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
        return self._hex.text()

    def _refresh(self) -> None:
        r, g, b = self._color
        self._swatch.setStyleSheet(
            f"background-color: rgb({r},{g},{b}); border: 1px solid #2a2a2a; border-radius: 6px;"
        )
        self._hex.blockSignals(True)
        self._hex.setText(f"#{r:02X}{g:02X}{b:02X}")
        self._hex.blockSignals(False)

    def _open_dialog(self) -> None:
        r, g, b = self._color
        col = QColorDialog.getColor(QColor(r, g, b), self, "Pick a colour")
        if col.isValid():
            self.set_color((col.red(), col.green(), col.blue()))

    def _on_hex_commit(self) -> None:
        text = self._hex.text().strip().lstrip("#")
        if len(text) != 6:
            self._refresh()
            return
        try:
            r = int(text[0:2], 16)
            g = int(text[2:4], 16)
            b = int(text[4:6], 16)
        except ValueError:
            self._refresh()
            return
        self.set_color((r, g, b))

    def _on_preset_clicked(self, idx: int) -> None:
        if 0 <= idx < len(self._presets):
            self.set_color(self._presets[idx])
