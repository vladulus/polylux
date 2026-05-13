"""Matrix page — scenes: clock / text / fill / off."""
from __future__ import annotations

from PyQt6.QtWidgets import (
    QCheckBox, QLabel, QLineEdit, QVBoxLayout, QWidget,
)

from polylux.ui.pages.base import DevicePage
from polylux.ui.widgets.color_picker import ColorPicker
from polylux.ui.widgets.live_preview import MatrixLivePreview
from polylux.ui.widgets.seg_button import SegButton
from polylux.ui.widgets.slider_row import SliderRow


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
        cfg = self._state.snapshot().matrix
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        if scene == "text":
            text_input = QLineEdit(cfg.text)
            text_input.setPlaceholderText("HELLO WORLD")
            text_input.editingFinished.connect(
                lambda: self._state.update_device("matrix", {"text": text_input.text()})
            )
            v.addWidget(QLabel("MESSAGE"))
            v.addWidget(text_input)

            spd = SliderRow(label="SCROLL SPEED", minimum=1, maximum=100,
                            value=cfg.scroll_speed, fmt="{v}")
            spd.value_changed.connect(
                lambda val: self._state.update_device("matrix", {"scroll_speed": val})
            )
            v.addWidget(spd)
        elif scene == "fill":
            pick = ColorPicker(color=cfg.color)
            pick.color_changed.connect(
                lambda c: self._state.update_device("matrix", {"color": c})
            )
            v.addWidget(QLabel("COLOR"))
            v.addWidget(pick)
        else:
            lbl = QLabel("(no extra config)")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        v.addStretch(1)
        return w

    def build_common_config(self) -> QWidget:
        cfg = self._state.snapshot().matrix
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        bri = SliderRow(label="BRIGHTNESS", minimum=0, maximum=100,
                        value=cfg.brightness, fmt="{v}")
        bri.value_changed.connect(
            lambda val: self._state.update_device("matrix", {"brightness": val})
        )
        v.addWidget(bri)

        rot = SegButton(
            options=[("0°", 0), ("90°", 90), ("180°", 180), ("270°", 270)],
            value=cfg.rotation,
        )
        rot.value_changed.connect(
            lambda val: self._state.update_device("matrix", {"rotation": val})
        )
        v.addWidget(QLabel("ROTATION"))
        v.addWidget(rot)

        enable = QCheckBox("ENABLED")
        enable.setChecked(cfg.enabled)
        enable.toggled.connect(
            lambda on: self._state.update_device("matrix", {"enabled": on})
        )
        v.addWidget(enable)
        v.addStretch(1)
        return w

    def build_live_preview(self) -> QWidget:
        return MatrixLivePreview()
