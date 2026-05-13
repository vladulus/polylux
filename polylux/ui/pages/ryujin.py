"""Ryujin LCD page — v0.4 minimal (firmware-driven scenes only)."""
from __future__ import annotations

from PyQt6.QtWidgets import QCheckBox, QLabel, QVBoxLayout, QWidget

from polylux.ui.pages.base import DevicePage
from polylux.ui.widgets.live_preview import RyujinLivePreview


class RyujinPage(DevicePage):
    DEVICE_KEY = "ryujin_lcd"
    DEVICE_TITLE = "Ryujin LCD"
    DEVICE_SUBTITLE = "AIO · CHIP 1988 · firmware-driven"

    def _scenes(self):
        return [
            ("hardware_monitor", "HARDWARE_MONITOR", None),
            ("off",              "OFF",              None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.addWidget(QLabel("(firmware-driven — no extra config)"))
        v.addStretch(1)
        return w

    def build_common_config(self):
        # Ryujin has no extra controls in v0.4 — ENABLED is in the header.
        return None

    def build_live_preview(self):
        return RyujinLivePreview()
