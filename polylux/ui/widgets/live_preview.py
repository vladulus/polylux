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

    The matrix is mounted horizontally on the Z690 Extreme's I/O shroud,
    so we render with rows on the X axis (left-to-right) and columns on
    the Y axis (top-to-bottom). This matches the physical orientation
    the user sees.
    """

    def sizeHint(self) -> QSize:
        return QSize(380, 120)

    def minimumSizeHint(self) -> QSize:
        return QSize(280, 80)

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

        # Horizontal orientation: rows on X (36 across), cols on Y (7 down).
        # Compute dot size that fits the available area.
        avail_w = self.width() - 16
        avail_h = self.height() - 16
        dot_x = max(4, avail_w // (lut.MAX_ROW + 2))  # +2 padding cells
        dot_y = max(4, avail_h // (lut.MAX_COL + 1))
        dot = max(3, min(dot_x, dot_y, 14))             # cap so dots don't dominate
        gap = max(1, dot // 4)

        used_w = lut.MAX_ROW * (dot + gap)
        used_h = lut.MAX_COL * (dot + gap)
        x_off = (self.width() - used_w) // 2
        y_off = (self.height() - used_h) // 2

        from PyQt6.QtCore import Qt as _Qt
        p.setPen(_Qt.PenStyle.NoPen)

        for col, row in lut.ALL_COORDS:
            # rotate -90° (effectively 90° physical orientation rotated 180° again):
            # physical X = MAX_ROW - row, physical Y = col - 1
            x = x_off + (lut.MAX_ROW - row) * (dot + gap)
            y = y_off + (col - 1) * (dot + gap)
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
            p.drawEllipse(x, y, dot, dot)
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
