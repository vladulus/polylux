"""Live-preview widgets — show the exact data the driver last sent."""
from __future__ import annotations

from typing import Any, Optional

from PyQt6.QtCore import Qt, QRectF, QSize
from PyQt6.QtGui import QColor, QFont, QPainter
from PyQt6.QtWidgets import QWidget


class _BaseLivePreview(QWidget):
    """Stores the last frame; subclasses override paintEvent()."""

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self._last: Any = None
        self.setMinimumHeight(80)

    def set_frame(self, frame: Any) -> None:
        self._last = frame
        self.update()

    def last_frame(self) -> Any:
        return self._last


class MatrixLivePreview(_BaseLivePreview):
    """Renders the AniMe Matrix 768-byte buffer using the real LED LUT.

    Each LED is drawn as a small dot at its physical (col, row) coordinate.
    Inactive LEDs (the staircase cutouts at top-left and bottom-right) are
    simply skipped so the preview matches the actual case-front shape.
    """

    DOT = 6     # ellipse diameter
    GAP_X = 3
    GAP_Y = 1

    def sizeHint(self) -> QSize:
        try:
            from polylux.drivers.anime_matrix import lut
            return QSize(
                lut.MAX_COL * (self.DOT + self.GAP_X) + 8,
                lut.MAX_ROW * (self.DOT + self.GAP_Y) + 8,
            )
        except Exception:
            return QSize(80, 260)

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing, True)
        p.fillRect(self.rect(), QColor("#000"))

        try:
            from polylux.drivers.anime_matrix import lut
        except Exception:
            p.end()
            return

        buf: bytes = self._last or b""
        have_data = len(buf) >= lut.TOTAL_BYTES

        # Center the matrix in the available width
        total_w = lut.MAX_COL * (self.DOT + self.GAP_X)
        x_off = max(4, (self.width() - total_w) // 2)
        y_off = 4

        from PyQt6.QtCore import Qt as _Qt
        p.setPen(_Qt.PenStyle.NoPen)

        for col, row in lut.ALL_COORDS:
            x = x_off + (col - 1) * (self.DOT + self.GAP_X)
            y = y_off + (row - 1) * (self.DOT + self.GAP_Y)
            if have_data:
                rb, gb, bb = lut.rgb_bytes(col, row)
                r = buf[rb]
                g = buf[gb]
                b = buf[bb]
                if r == 0 and g == 0 and b == 0:
                    p.setBrush(QColor(28, 28, 28))
                else:
                    p.setBrush(QColor(r, g, b))
            else:
                p.setBrush(QColor(28, 28, 28))
            p.drawEllipse(x, y, self.DOT, self.DOT)
        p.end()


class OledLivePreview(_BaseLivePreview):
    """Renders the OLED's current (label, value) tuple in white on black."""

    WIDTH = 256
    HEIGHT = 64
    SCALE = 2

    def sizeHint(self) -> QSize:
        return QSize(self.WIDTH * self.SCALE, self.HEIGHT * self.SCALE)

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing, False)
        p.fillRect(self.rect(), QColor("#000"))
        if not self._last:
            p.end()
            return
        kind = self._last[0]
        p.setPen(QColor("#FFFFFF"))
        if kind == "text":
            _, label, value = self._last
            f1 = QFont("JetBrains Mono", 9)
            p.setFont(f1)
            p.drawText(8, 18, label or "")
            f2 = QFont("JetBrains Mono", 22)
            f2.setWeight(QFont.Weight.Light)
            p.setFont(f2)
            r = QRectF(8, 22, self.width() - 16, self.height() - 24)
            p.drawText(r, int(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignVCenter),
                       value or "")
        elif kind == "preset_gif":
            idx = self._last[1] if len(self._last) > 1 else 0
            p.setFont(QFont("JetBrains Mono", 12))
            p.drawText(self.rect(), int(Qt.AlignmentFlag.AlignCenter),
                       f"▶ preset_gif[{idx}]")
        elif kind == "off":
            p.setFont(QFont("JetBrains Mono", 11))
            p.setPen(QColor("#444"))
            p.drawText(self.rect(), int(Qt.AlignmentFlag.AlignCenter), "— off —")
        p.end()


class AuraLivePreview(_BaseLivePreview):
    """Renders the per-zone RGB list as a horizontal strip of swatches."""

    def sizeHint(self) -> QSize:
        return QSize(240, 64)

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        p.fillRect(self.rect(), QColor("#0a0a0a"))
        zones = self._last or []
        if not zones:
            p.setPen(QColor("#444"))
            p.setFont(QFont("Inter", 9))
            p.drawText(self.rect(), int(Qt.AlignmentFlag.AlignCenter), "no zones")
            p.end()
            return
        w = self.width() / max(len(zones), 1)
        for i, (r, g, b) in enumerate(zones):
            p.fillRect(int(i * w) + 2, 8, int(w) - 4, self.height() - 16,
                       QColor(int(r), int(g), int(b)))
        p.end()


class RyujinLivePreview(_BaseLivePreview):
    """Stub — firmware-driven, no preview content for v0.4."""

    def sizeHint(self) -> QSize:
        return QSize(240, 64)

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        p.fillRect(self.rect(), QColor("#0a0a0a"))
        p.setPen(QColor("#666"))
        p.setFont(QFont("Inter", 10))
        p.drawText(self.rect(), int(Qt.AlignmentFlag.AlignCenter),
                   "firmware-driven — no preview")
        p.end()
