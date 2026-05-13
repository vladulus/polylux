"""SceneCard — clickable preview tile for one device scene."""
from __future__ import annotations

from typing import Optional

from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QMouseEvent
from PyQt6.QtWidgets import QFrame, QLabel, QVBoxLayout, QWidget


class SceneCard(QFrame):
    """Vertical card: top preview area + bottom title strip.

    Emits ``clicked_scene(str)`` with the scene_key when left-clicked.
    QSS targets ``QFrame[active="true"]`` for the active state.
    """

    clicked_scene = pyqtSignal(str)

    def __init__(
        self,
        scene_key: str,
        title: str,
        preview: Optional[QWidget] = None,
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._scene_key = scene_key
        self.setObjectName("scene_card")
        self.setProperty("active", "false")
        self.setCursor(Qt.CursorShape.PointingHandCursor)
        self.setFrameShape(QFrame.Shape.NoFrame)

        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(0)

        # Preview area (top)
        self._preview_container = QFrame()
        self._preview_container.setObjectName("scene_card_preview")
        self._preview_container.setMinimumHeight(80)
        pv = QVBoxLayout(self._preview_container)
        pv.setContentsMargins(0, 0, 0, 0)
        pv.setAlignment(Qt.AlignmentFlag.AlignCenter)
        if preview is not None:
            pv.addWidget(preview, alignment=Qt.AlignmentFlag.AlignCenter)
        v.addWidget(self._preview_container)

        # Title strip (bottom)
        self._title = QLabel(title)
        self._title.setObjectName("scene_card_title")
        self._title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self._title.setContentsMargins(0, 8, 0, 8)
        v.addWidget(self._title)

    def scene_key(self) -> str:
        return self._scene_key

    def is_active(self) -> bool:
        return self.property("active") == "true"

    def set_active(self, on: bool) -> None:
        self.setProperty("active", "true" if on else "false")
        self.style().unpolish(self)
        self.style().polish(self)
        self.update()

    def mousePressEvent(self, ev: QMouseEvent) -> None:
        if ev.button() == Qt.MouseButton.LeftButton:
            self.clicked_scene.emit(self._scene_key)
            ev.accept()
            return
        super().mousePressEvent(ev)
