"""SliderRow — labeled horizontal slider with live numeric readout."""
from __future__ import annotations

from typing import Optional

from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtWidgets import QHBoxLayout, QLabel, QSlider, QVBoxLayout, QWidget


class SliderRow(QWidget):
    """A row with: top label, then a slider + numeric readout below.

    Emits ``value_changed(int)`` on user drag. The readout is formatted
    via ``fmt.format(v=value)``.
    """

    value_changed = pyqtSignal(int)

    def __init__(
        self,
        label: str,
        minimum: int = 0,
        maximum: int = 100,
        value: int = 0,
        fmt: str = "{v}",
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._fmt = fmt

        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(6)

        self._label = QLabel(label)
        self._label.setObjectName("field_label")
        v.addWidget(self._label)

        row = QHBoxLayout()
        row.setContentsMargins(0, 0, 0, 0)
        row.setSpacing(10)

        self._slider = QSlider(Qt.Orientation.Horizontal)
        self._slider.setRange(minimum, maximum)
        self._slider.setValue(value)
        self._slider.valueChanged.connect(self._on_change)
        row.addWidget(self._slider, 1)

        self._readout = QLabel()
        self._readout.setObjectName("slider_readout")
        self._readout.setMinimumWidth(48)
        self._readout.setAlignment(Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignVCenter)
        row.addWidget(self._readout)

        v.addLayout(row)
        self._refresh_readout(value)

    def _on_change(self, v: int) -> None:
        self._refresh_readout(v)
        self.value_changed.emit(v)

    def _refresh_readout(self, v: int) -> None:
        self._readout.setText(self._fmt.format(v=v))

    def value(self) -> int:
        return self._slider.value()

    def set_value(self, v: int) -> None:
        self._slider.setValue(v)

    def value_label_text(self) -> str:
        return self._readout.text()
