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
        return QSize(900, 220)

    def minimumSizeHint(self) -> QSize:
        return QSize(400, 140)

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        # Square LEDs render crisper without antialiasing.
        p.setRenderHint(QPainter.RenderHint.Antialiasing, False)
        p.fillRect(self.rect(), QColor("#000"))

        try:
            from polylux.drivers.anime_matrix import lut
        except Exception:
            p.end()
            return

        buf: bytes = self._last or b""
        have_data = len(buf) >= lut.TOTAL_BYTES

        # Horizontal orientation: rows on X (36 across), cols on Y (7 down).
        avail_w = self.width() - 16
        avail_h = self.height() - 16
        dot_x = max(4, avail_w // (lut.MAX_ROW + 2))
        dot_y = max(4, avail_h // (lut.MAX_COL + 1))
        dot = max(3, min(dot_x, dot_y, 22))
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
            # Physical LEDs are square — square preview is more honest.
            p.drawRect(x, y, dot, dot)
        p.end()


class OledLivePreview(_BaseLivePreview):
    """Renders the ROG LiveDash OLED — 128×32 monochrome panel.

    Layout matches AC's default: label small at top (line 1, ~10px), value
    larger below (line 2, fills remaining height). At scale 5x the
    on-screen widget is 640×160 — visible and readable.
    """

    WIDTH = 128
    HEIGHT = 32
    SCALE = 5

    def sizeHint(self) -> QSize:
        return QSize(self.WIDTH * self.SCALE, self.HEIGHT * self.SCALE)

    def minimumSizeHint(self) -> QSize:
        return QSize(self.WIDTH * 3, self.HEIGHT * 3)

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing, True)

        # Compute integer scale that fits widget and centre the OLED panel.
        scale = max(2, min(self.width() // self.WIDTH, self.height() // self.HEIGHT))
        panel_w = self.WIDTH * scale
        panel_h = self.HEIGHT * scale
        x_off = (self.width() - panel_w) // 2
        y_off = (self.height() - panel_h) // 2
        p.fillRect(self.rect(), QColor("#000"))
        p.fillRect(x_off, y_off, panel_w, panel_h, QColor("#000"))

        if not self._last:
            p.end()
            return
        kind = self._last[0]
        p.setPen(QColor("#FFFFFF"))
        if kind == "text":
            _, label, value = self._last
            # Approximation of the ROG/Eurostile-ish font AC ships — Bahnschrift
            # Condensed (Windows 10+) and Agency FB (Windows default) have the
            # same condensed-geometric block-letter feel.
            rog_family = "Bahnschrift Condensed, Agency FB, Impact, Inter"
            # Label centered horizontally on the top half of the panel.
            f1 = QFont()
            f1.setFamilies(["Bahnschrift Condensed", "Agency FB", "Impact", "Inter"])
            f1.setPixelSize(int(panel_h * 0.28))
            f1.setWeight(QFont.Weight.DemiBold)
            p.setFont(f1)
            label_rect = QRectF(x_off, y_off + panel_h * 0.03,
                                panel_w, panel_h * 0.34)
            p.drawText(label_rect,
                       int(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter),
                       label or "")
            # Value bigger, centered on the bottom half.
            f2 = QFont()
            f2.setFamilies(["Bahnschrift Condensed", "Agency FB", "Impact", "Inter"])
            f2.setPixelSize(int(panel_h * 0.55))
            f2.setWeight(QFont.Weight.Bold)
            p.setFont(f2)
            value_rect = QRectF(x_off, y_off + panel_h * 0.36,
                                panel_w, panel_h * 0.62)
            p.drawText(value_rect,
                       int(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter),
                       value or "")
        elif kind == "preset_gif":
            idx = self._last[1] if len(self._last) > 1 else 0
            p.setFont(QFont("JetBrains Mono", max(10, panel_h // 4)))
            p.drawText(x_off, y_off, panel_w, panel_h,
                       int(Qt.AlignmentFlag.AlignCenter),
                       f"▶ preset_gif[{idx}]")
        elif kind == "off":
            p.setFont(QFont("JetBrains Mono", max(10, panel_h // 6)))
            p.setPen(QColor("#444"))
            p.drawText(x_off, y_off, panel_w, panel_h,
                       int(Qt.AlignmentFlag.AlignCenter), "— off —")
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
