"""Matrix page — scenes: clock / text / fill / off."""
from __future__ import annotations

from pathlib import Path

from PyQt6.QtWidgets import (
    QCheckBox, QComboBox, QFileDialog, QHBoxLayout, QLabel, QLineEdit,
    QPushButton, QVBoxLayout, QWidget,
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
            ("image", "IMAGE", None),
            ("off",   "OFF",   None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        cfg = self._state.snapshot().matrix
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        if scene == "clock":
            pick = ColorPicker(color=cfg.clock_color)
            pick.color_changed.connect(
                lambda c: self._state.update_device("matrix", {"clock_color": c})
            )
            v.addWidget(QLabel("COLOR"))
            v.addWidget(pick)

            # Clock uses bitmap fonts purpose-built for the 7-row
            # matrix. Each font has a fixed pixel height — no size
            # slider needed; pick the font and it just fits.
            from polylux.drivers.anime_matrix import clock_fonts
            clock_fams = clock_fonts.names()
            v.addWidget(QLabel("FONT"))
            clock_font_cb = QComboBox()
            clock_font_cb.addItems(clock_fams)
            if cfg.clock_font_family in clock_fams:
                clock_font_cb.setCurrentText(cfg.clock_font_family)
            clock_font_cb.currentTextChanged.connect(
                lambda fam: self._state.update_device("matrix", {"clock_font_family": fam})
            )
            v.addWidget(clock_font_cb)
            hint = QLabel("Pixel-perfect bitmap fonts · 1 LED = 1 pixel")
            hint.setObjectName("dim")
            v.addWidget(hint)
        elif scene == "text":
            text_input = QLineEdit(cfg.text)
            text_input.setPlaceholderText("HELLO WORLD")
            text_input.textChanged.connect(
                lambda txt: self._state.update_device("matrix", {"text": txt})
            )
            v.addWidget(QLabel("MESSAGE"))
            v.addWidget(text_input)

            pick = ColorPicker(color=cfg.color)
            pick.color_changed.connect(
                lambda c: self._state.update_device("matrix", {"color": c})
            )
            v.addWidget(QLabel("COLOR"))
            v.addWidget(pick)

            size = SliderRow(label="FONT SIZE", minimum=7, maximum=16,
                             value=cfg.text_font_size, fmt="{v}px")
            size.value_changed.connect(
                lambda val: self._state.update_device("matrix", {"text_font_size": val})
            )
            v.addWidget(size)

            # Font family — populated from the matrix renderer's
            # available_matrix_fonts(), which filters to fonts whose
            # file is actually present on disk (so we don't offer
            # families that would silently fall back).
            from polylux.drivers.anime_matrix.render import available_matrix_fonts
            fams = available_matrix_fonts() or ["Asus Rog", "Arial Bold", "Arial"]
            v.addWidget(QLabel("FONT FAMILY"))
            font_cb = QComboBox()
            font_cb.addItems(fams)
            if cfg.text_font_family in fams:
                font_cb.setCurrentText(cfg.text_font_family)
            font_cb.currentTextChanged.connect(
                lambda fam: self._state.update_device("matrix", {"text_font_family": fam})
            )
            v.addWidget(font_cb)

            spd = SliderRow(label="SCROLL SPEED", minimum=1, maximum=100,
                            value=cfg.scroll_speed, fmt="{v}")
            spd.value_changed.connect(
                lambda val: self._state.update_device("matrix", {"scroll_speed": val})
            )
            v.addWidget(spd)
        elif scene == "image":
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
            v.addWidget(QLabel("IMAGE FILE"))
            v.addLayout(row)
            hint = QLabel("PNG / JPG / BMP / GIF. Scaled to 7-LED short axis; GIFs animate.")
            hint.setObjectName("dim")
            v.addWidget(hint)

            scroll_cb = QCheckBox("SCROLL HORIZONTALLY (wide images)")
            scroll_cb.setChecked(cfg.image_scroll)
            scroll_cb.toggled.connect(
                lambda on: self._state.update_device("matrix", {"image_scroll": on})
            )
            v.addWidget(scroll_cb)

            spd = SliderRow(label="SCROLL SPEED", minimum=1, maximum=100,
                            value=cfg.scroll_speed, fmt="{v}")
            spd.value_changed.connect(
                lambda val: self._state.update_device("matrix", {"scroll_speed": val})
            )
            v.addWidget(spd)
        else:
            lbl = QLabel("(no extra config)")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        v.addStretch(1)
        return w

    def _on_pick_image(self) -> None:
        path, _ = QFileDialog.getOpenFileName(
            self, "Pick image for matrix",
            "", "Images (*.png *.jpg *.jpeg *.bmp *.gif);;All files (*.*)",
        )
        if path:
            self._state.update_device("matrix", {"image_path": path})
            self._image_path_lbl.setText(Path(path).name)

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

        v.addStretch(1)
        return w

    def build_live_preview(self) -> QWidget:
        return MatrixLivePreview()
