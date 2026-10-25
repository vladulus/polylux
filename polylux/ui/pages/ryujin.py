"""Ryujin LCD page — scenes: hardware_monitor / image / animation / off.

Mirrors AC 6.5.7's Display tab (§9.3): the firmware's hardware monitor,
an uploaded image or GIF, one of the three built-in animations, or the
display switched off. COMMON holds orientation and the standby switch.
"""
from __future__ import annotations

from pathlib import Path

from PyQt6.QtWidgets import (
    QCheckBox, QFileDialog, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget,
)

from polylux.config import RyujinLcdConfig
from polylux.ui.pages.base import DevicePage
from polylux.ui.widgets.live_preview import RyujinLivePreview
from polylux.ui.widgets.seg_button import SegButton


class RyujinPage(DevicePage):
    DEVICE_KEY = "ryujin_lcd"
    DEVICE_TITLE = "Ryujin LCD"
    DEVICE_SUBTITLE = "AIO · 320×240 · CHIP 1988"

    def _scenes(self):
        return [
            ("hardware_monitor", "HARDWARE_MONITOR", None),
            ("image",            "IMAGE",            None),
            ("animation",        "ANIMATION",        None),
            ("off",              "OFF",              None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        cfg: RyujinLcdConfig = self._state.snapshot().ryujin_lcd
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        if scene == "image":
            row = QHBoxLayout()
            row.setSpacing(8)
            self._image_path_lbl = QLabel(
                Path(cfg.image_path).name if cfg.image_path else "(no image selected)"
            )
            self._image_path_lbl.setObjectName("dim")
            self._image_path_lbl.setWordWrap(True)
            row.addWidget(self._image_path_lbl, 1)
            btn = QPushButton("Browse…")
            btn.clicked.connect(self._on_pick_image)
            row.addWidget(btn)
            v.addWidget(QLabel("IMAGE OR GIF"))
            v.addLayout(row)
            stretch = QCheckBox("STRETCH TO FIT (no cropping)")
            stretch.setChecked(cfg.image_stretch)
            stretch.toggled.connect(
                lambda on: self._state.update_device("ryujin_lcd", {"image_stretch": on})
            )
            v.addWidget(stretch)
        elif scene == "animation":
            seg = SegButton(options=[("1", 0), ("2", 1), ("3", 2)], value=cfg.animation)
            seg.value_changed.connect(
                lambda val: self._state.update_device("ryujin_lcd", {"animation": val})
            )
            v.addWidget(QLabel("BUILT-IN ANIMATION"))
            v.addWidget(seg)
        else:
            lbl = QLabel("(firmware-driven — no extra config)" if scene == "hardware_monitor"
                         else "(display off)")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        v.addStretch(1)
        return w

    def _on_pick_image(self) -> None:
        path, _ = QFileDialog.getOpenFileName(
            self, "Pick image for the Ryujin LCD",
            "", "Images (*.png *.jpg *.jpeg *.bmp *.gif);;All files (*.*)",
        )
        if path:
            self._state.update_device("ryujin_lcd", {"image_path": path})
            self._image_path_lbl.setText(Path(path).name)

    def build_common_config(self) -> QWidget:
        cfg: RyujinLcdConfig = self._state.snapshot().ryujin_lcd
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)
        orient = SegButton(options=[("PORTRAIT", True), ("LANDSCAPE", False)],
                           value=cfg.portrait)
        orient.value_changed.connect(
            lambda val: self._state.update_device("ryujin_lcd", {"portrait": val})
        )
        v.addWidget(QLabel("ORIENTATION"))
        v.addWidget(orient)
        dark = QCheckBox("DARK WHEN THE PC IS OFF")
        dark.setChecked(cfg.dark_when_off)
        dark.toggled.connect(
            lambda on: self._state.update_device("ryujin_lcd", {"dark_when_off": on})
        )
        v.addWidget(dark)
        v.addStretch(1)
        return w

    def build_live_preview(self):
        return RyujinLivePreview()
