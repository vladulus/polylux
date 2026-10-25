"""OLED page — scenes: hardware_monitor / text / image / off.

hardware_monitor: SINGLE shows one source, ROTATE cycles through the checked
ones. Sources are the original six metrics plus every live sensor (the same
list as the Ryujin's hardware monitor, polylux.sensors.sources).
"""
from __future__ import annotations

from pathlib import Path

from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import (
    QCheckBox, QComboBox, QFileDialog, QGridLayout, QHBoxLayout, QLabel, QLineEdit,
    QListWidget, QListWidgetItem, QPushButton, QVBoxLayout, QWidget,
)

from polylux.config import OledConfig
from polylux.sensors.sources import available as available_sources, fan_card_names, label as source_label
from polylux.ui.pages.base import DevicePage
from polylux.ui.widgets.live_preview import OledLivePreview
from polylux.ui.widgets.seg_button import SegButton
from polylux.ui.widgets.slider_row import SliderRow


METRIC_DISPLAY = {
    "cpu_temp": "CPU TEMP",
    "gpu_temp": "GPU TEMP",
    "cpu_pct":  "CPU USAGE",
    "gpu_pct":  "GPU USAGE",
    "mem_pct":  "MEM USAGE",
    "fan_rpm":  "FAN RPM",
}


def _clear_layout(layout) -> None:
    """Recursively detach + delete every widget and layout in `layout`."""
    while layout.count():
        item = layout.takeAt(0)
        w = item.widget()
        if w is not None:
            w.deleteLater()
            continue
        sub = item.layout()
        if sub is not None:
            _clear_layout(sub)
            sub.deleteLater()


class OledPage(DevicePage):
    DEVICE_KEY = "oled"
    DEVICE_TITLE = "OLED Display"
    DEVICE_SUBTITLE = "DEV 6 · 256×64 · CHIP 1845"

    def _scenes(self):
        return [
            ("hardware_monitor", "HARDWARE_MONITOR", None),
            ("text",             "TEXT",             None),
            ("image",            "IMAGE",            None),
            ("off",              "OFF",              None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        cfg: OledConfig = self._state.snapshot().oled
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        if scene == "hardware_monitor":
            mode_seg = SegButton(
                options=[("SINGLE", "single"), ("ROTATE", "rotate")],
                value=cfg.hw_mode,
            )
            mode_seg.value_changed.connect(self._on_hw_mode_changed)
            v.addWidget(QLabel("MODE"))
            v.addWidget(mode_seg)
            v.addSpacing(6)
            self._metric_holder = QWidget()
            self._metric_holder_v = QVBoxLayout(self._metric_holder)
            self._metric_holder_v.setContentsMargins(0, 0, 0, 0)
            self._metric_holder_v.setSpacing(14)
            v.addWidget(self._metric_holder)
            self._render_hw_mode(cfg.hw_mode)
        elif scene == "text":
            label_in = QLineEdit(cfg.label)
            label_in.setPlaceholderText("LABEL")
            label_in.textChanged.connect(
                lambda txt: self._state.update_device("oled", {"label": txt})
            )
            v.addWidget(QLabel("LABEL"))
            v.addWidget(label_in)
            value_in = QLineEdit(cfg.value)
            value_in.setPlaceholderText("VALUE")
            value_in.textChanged.connect(
                lambda txt: self._state.update_device("oled", {"value": txt})
            )
            v.addWidget(QLabel("VALUE"))
            v.addWidget(value_in)

            spd = SliderRow(label="SCROLL SPEED (>16 chars)", minimum=1, maximum=100,
                            value=cfg.scroll_speed, fmt="{v}")
            spd.value_changed.connect(
                lambda val: self._state.update_device("oled", {"scroll_speed": val})
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
            v.addWidget(QLabel("IMAGE OR GIF"))
            v.addLayout(row)
            hint = QLabel("Cropped to 256×64 and uploaded once; animated GIFs keep playing.")
            hint.setObjectName("dim")
            hint.setWordWrap(True)
            v.addWidget(hint)
        else:
            lbl = QLabel("(no extra config)")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        v.addStretch(1)
        return w

    def _on_hw_mode_changed(self, mode: str) -> None:
        self._state.update_device("oled", {"hw_mode": mode})
        self._render_hw_mode(mode)

    def _source_list(self, current: tuple[str, ...]) -> list[str]:
        """The original six metrics, then every live sensor (same list as the
        Ryujin); a configured source that isn't live right now stays listed."""
        out = list(METRIC_DISPLAY)
        out += [x for x in available_sources() if x not in out]
        out += [x for x in current if x not in out]
        return out

    def _source_text(self, key: str) -> str:
        return METRIC_DISPLAY.get(key) or source_label(
            key, fan_card_names(self._state.snapshot().fans.fans))

    def _render_hw_mode(self, mode: str) -> None:
        _clear_layout(self._metric_holder_v)

        cfg: OledConfig = self._state.snapshot().oled
        if mode == "single":
            self._metric_holder_v.addWidget(QLabel("METRIC TO DISPLAY"))
            combo = QComboBox()
            for key in self._source_list((cfg.value_source,)):
                combo.addItem(self._source_text(key), key)
            combo.setCurrentIndex(max(0, combo.findData(cfg.value_source)))
            combo.currentIndexChanged.connect(lambda _i: self._set_metric(combo.currentData()))
            self._metric_holder_v.addWidget(combo)

            self._metric_holder_v.addWidget(QLabel("LABEL OVERRIDE"))
            self._label_edit = QLineEdit(cfg.label)
            self._label_edit.textChanged.connect(
                lambda txt: self._state.update_device("oled", {"label": txt})
            )
            self._metric_holder_v.addWidget(self._label_edit)
        else:
            self._metric_holder_v.addWidget(QLabel("METRICS TO CYCLE"))
            self._rotate_list = QListWidget()
            self._rotate_list.setMinimumHeight(220)
            for key in self._source_list(tuple(cfg.rotate_sources)):
                item = QListWidgetItem(self._source_text(key))
                item.setData(Qt.ItemDataRole.UserRole, key)
                item.setFlags(item.flags() | Qt.ItemFlag.ItemIsUserCheckable)
                item.setCheckState(Qt.CheckState.Checked if key in cfg.rotate_sources
                                   else Qt.CheckState.Unchecked)
                self._rotate_list.addItem(item)
            self._rotate_list.itemChanged.connect(lambda _it: self._sync_rotate_sources())
            self._metric_holder_v.addWidget(self._rotate_list)

            ivl = SliderRow(label="INTERVAL (sec)", minimum=1, maximum=10,
                            value=int(round(cfg.rotate_interval_s)), fmt="{v}s")
            ivl.value_changed.connect(
                lambda val: self._state.update_device("oled", {"rotate_interval_s": float(val)})
            )
            self._metric_holder_v.addWidget(ivl)

    def _set_metric(self, key: str) -> None:
        # The label follows the metric; the user can still override it after.
        text = self._source_text(key)
        self._state.update_device("oled", {"value_source": key, "label": text})
        self._label_edit.blockSignals(True)
        self._label_edit.setText(text)
        self._label_edit.blockSignals(False)

    def _sync_rotate_sources(self) -> None:
        sources = tuple(
            self._rotate_list.item(i).data(Qt.ItemDataRole.UserRole)
            for i in range(self._rotate_list.count())
            if self._rotate_list.item(i).checkState() == Qt.CheckState.Checked
        )
        if not sources:
            return  # Empty list is invalid — config validation would reject
        self._state.update_device("oled", {"rotate_sources": sources})

    def _on_pick_image(self) -> None:
        path, _ = QFileDialog.getOpenFileName(
            self, "Pick image for the OLED",
            "", "Images (*.png *.jpg *.jpeg *.bmp *.gif);;All files (*.*)",
        )
        if path:
            self._state.update_device("oled", {"image_path": path})
            self._image_path_lbl.setText(Path(path).name)

    def build_common_config(self) -> QWidget:
        # The two switches of AC's OLED Settings dialog (ec 5c); there is
        # no brightness.
        cfg: OledConfig = self._state.snapshot().oled
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)
        dark = QCheckBox("DARK WHEN THE PC IS OFF")
        dark.setChecked(cfg.dark_when_off)
        dark.toggled.connect(lambda on: self._state.update_device("oled", {"dark_when_off": on}))
        v.addWidget(dark)
        rot = QCheckBox("ROTATE 180°")
        rot.setChecked(cfg.rotate_180)
        rot.toggled.connect(lambda on: self._state.update_device("oled", {"rotate_180": on}))
        v.addWidget(rot)
        v.addStretch(1)
        return w

    def build_live_preview(self) -> QWidget:
        return OledLivePreview()
