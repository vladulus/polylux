"""SceneCard — clickable preview tile for one device scene."""
from __future__ import annotations

from typing import Optional

from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QMouseEvent
from PyQt6.QtWidgets import QFrame, QLabel, QVBoxLayout, QWidget


class SceneCard(QFrame):
    """Clickable button-style card with a bordered title strip.

    Emits ``clicked_scene(str)`` with the scene_key when left-clicked.
    QSS targets ``QFrame[active="true"]`` for the active state.

    The optional ``preview`` widget is kept for backwards compatibility
    but currently unused — scenes show as plain bordered buttons.
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
        self.setMinimumHeight(56)

        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(0)

        self._title = QLabel(title)
        self._title.setObjectName("scene_card_title")
        self._title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self._title.setContentsMargins(0, 14, 0, 14)
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
