"""Radial gauge widget — 230° conic arc with center value + label."""
from __future__ import annotations

from typing import Optional

from PyQt6.QtCore import Qt, QRectF, QSize
from PyQt6.QtGui import QPainter, QPen, QColor, QFont
from PyQt6.QtWidgets import QWidget


COOL = "#4caf50"
WARM = "#ffa726"
HOT = "#ef5350"


class RadialGauge(QWidget):
    """230° arc gauge with a numeric reading inside.

    The arc colour switches based on the configured thresholds — green
    while below the first threshold, orange between the two, red above
    the upper one.
    """

    SWEEP_DEG = 230

    def __init__(
        self,
        label: str = "",
        unit: str = "",
        min_value: float = 0.0,
        max_value: float = 100.0,
        thresholds: tuple[float, float] = (60.0, 80.0),
        accent: str = "#C15F3C",
        track_color: str = "#1f1f1f",
        text_color: str = "#FFFFFF",
        sub_color: str = "#666666",
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._label = label
        self._unit = unit
        self._min = float(min_value)
        self._max = float(max_value)
        self._thr_low, self._thr_high = thresholds
        self._value = float(min_value)
        self._sub_text = ""
        self._accent = accent
        self._track_color = track_color
        self._text_color = text_color
        self._sub_color = sub_color
        self.setMinimumSize(140, 140)

    def sizeHint(self) -> QSize:
        return QSize(160, 160)

    def value(self) -> float:
        return self._value

    def label(self) -> str:
        return self._label

    def set_value(self, v: float) -> None:
        self._value = max(self._min, min(self._max, float(v)))
        self.update()

    def set_sub_text(self, text: str) -> None:
        self._sub_text = text
        self.update()

    def set_thresholds(self, low: float, high: float) -> None:
        self._thr_low, self._thr_high = low, high
        self.update()

    def arc_color(self) -> str:
        if self._value >= self._thr_high:
            return HOT
        if self._value >= self._thr_low:
            return WARM
        return COOL

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing, True)

        side = min(self.width(), self.height())
        x = (self.width() - side) // 2
        y = (self.height() - side) // 2
        pad = side * 0.07
        rect = QRectF(x + pad, y + pad, side - pad * 2, side - pad * 2)

        thickness = side * 0.10
        pen = QPen(QColor(self._track_color))
        pen.setWidthF(thickness)
        pen.setCapStyle(Qt.PenCapStyle.RoundCap)
        p.setPen(pen)
        # Qt arc angles: 16ths of a degree; 0 at 3 o'clock, positive CCW.
        # We want a 230° arc starting at lower-left, sweeping clockwise
        # through the top. Start = 245°, sweep = -230° (clockwise).
        start_angle_16 = int(245.0 * 16)
        full_sweep_16 = int((-self.SWEEP_DEG) * 16)
        p.drawArc(rect, start_angle_16, full_sweep_16)

        frac = (self._value - self._min) / max(self._max - self._min, 1e-9)
        frac = max(0.0, min(1.0, frac))
        pen.setColor(QColor(self.arc_color()))
        p.setPen(pen)
        p.drawArc(rect, start_angle_16, int(full_sweep_16 * frac))

        p.setPen(QColor(self._text_color))
        f = QFont("JetBrains Mono", int(side * 0.18))
        if f.pointSize() <= 0:
            f.setPointSize(20)
        f.setWeight(QFont.Weight.Light)
        p.setFont(f)
        text = f"{int(round(self._value))}{self._unit}"
        p.drawText(rect, int(Qt.AlignmentFlag.AlignCenter), text)

        if self._sub_text or self._label:
            p.setPen(QColor(self._sub_color))
            f2 = QFont("Inter", int(side * 0.06))
            if f2.pointSize() <= 0:
                f2.setPointSize(8)
            p.setFont(f2)
            sub_rect = QRectF(rect.x(), rect.y() + rect.height() * 0.58,
                              rect.width(), rect.height() * 0.2)
            p.drawText(sub_rect, int(Qt.AlignmentFlag.AlignCenter),
                       self._sub_text or self._label)

        p.end()
