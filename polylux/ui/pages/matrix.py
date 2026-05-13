"""Matrix page — scenes: clock / text / fill / off."""
from __future__ import annotations

from PyQt6.QtWidgets import QLabel, QWidget

from polylux.ui.pages.base import DevicePage
from polylux.ui.widgets.live_preview import MatrixLivePreview


class MatrixPage(DevicePage):
    DEVICE_KEY = "matrix"
    DEVICE_TITLE = "Anime Matrix"
    DEVICE_SUBTITLE = "DEV 2 · CHIP 1845"

    def _scenes(self):
        return [
            ("clock", "CLOCK", None),
            ("text",  "TEXT",  None),
            ("fill",  "FILL",  None),
            ("off",   "OFF",   None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        return QLabel(f"(scene config for {scene} — Task 17)")

    def build_common_config(self) -> QWidget:
        return QLabel("(common config — Task 17)")

    def build_live_preview(self) -> QWidget:
        return MatrixLivePreview()
