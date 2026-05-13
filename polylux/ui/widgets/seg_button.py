"""SegButton — segmented button group (rotation 0/90/180/270, font S/M/L)."""
from __future__ import annotations

from typing import Any, Optional, Sequence

from PyQt6.QtCore import pyqtSignal
from PyQt6.QtWidgets import QHBoxLayout, QPushButton, QWidget


class SegButton(QWidget):
    """N mutually-exclusive segments. Emits ``value_changed(object)`` with
    the selected value when the user clicks a different segment.
    """

    value_changed = pyqtSignal(object)

    def __init__(
        self,
        options: Sequence[tuple[str, Any]],
        value: Any = None,
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._buttons: list[QPushButton] = []
        self._values: list[Any] = []

        h = QHBoxLayout(self)
        h.setContentsMargins(0, 0, 0, 0)
        h.setSpacing(0)

        for label, val in options:
            btn = QPushButton(label)
            btn.setObjectName("seg_button")
            btn.setCheckable(True)
            btn.setProperty("on", "false")
            btn.clicked.connect(lambda _checked, v=val: self.set_value(v))
            h.addWidget(btn, 1)
            self._buttons.append(btn)
            self._values.append(val)

        if value is None and self._values:
            value = self._values[0]
        self._value = value
        self._sync_visual()

    def _sync_visual(self) -> None:
        for btn, val in zip(self._buttons, self._values):
            on = (val == self._value)
            btn.setChecked(on)
            btn.setProperty("on", "true" if on else "false")
            btn.style().unpolish(btn)
            btn.style().polish(btn)

    def value(self) -> Any:
        return self._value

    def set_value(self, v: Any) -> None:
        if v == self._value:
            return
        if v not in self._values:
            return
        self._value = v
        self._sync_visual()
        self.value_changed.emit(v)
