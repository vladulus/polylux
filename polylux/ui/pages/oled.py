"""OLED page — scenes: hardware_monitor / text / preset_gif / off.

Includes the SINGLE / ROTATE mode toggle for hardware_monitor with a
multi-checkbox metric picker + interval slider.
"""
from __future__ import annotations

from PyQt6.QtWidgets import (
    QCheckBox, QGridLayout, QLabel, QLineEdit, QPushButton, QVBoxLayout, QWidget,
)

from polylux.config import OledConfig
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


class OledPage(DevicePage):
    DEVICE_KEY = "oled"
    DEVICE_TITLE = "OLED Display"
    DEVICE_SUBTITLE = "DEV 6 · 256×64 · CHIP 1845"

    def _scenes(self):
        return [
            ("hardware_monitor", "HARDWARE_MONITOR", None),
            ("text",             "TEXT",             None),
            ("preset_gif",       "PRESET_GIF",       None),
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
        elif scene == "preset_gif":
            lbl = QLabel(f"(preset thumbnails — v0.5, currently index={cfg.preset_index})")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        else:
            lbl = QLabel("(no extra config)")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        v.addStretch(1)
        return w

    def _on_hw_mode_changed(self, mode: str) -> None:
        self._state.update_device("oled", {"hw_mode": mode})
        self._render_hw_mode(mode)

    def _render_hw_mode(self, mode: str) -> None:
        while self._metric_holder_v.count():
            item = self._metric_holder_v.takeAt(0)
            wid = item.widget()
            if wid is not None:
                wid.deleteLater()

        cfg: OledConfig = self._state.snapshot().oled
        if mode == "single":
            self._metric_holder_v.addWidget(QLabel("METRIC TO DISPLAY"))
            grid = QGridLayout()
            grid.setSpacing(6)
            for i, key in enumerate(["cpu_temp", "gpu_temp", "cpu_pct",
                                     "gpu_pct", "mem_pct", "fan_rpm"]):
                btn = QPushButton(METRIC_DISPLAY[key])
                btn.setCheckable(True)
                btn.setChecked(key == cfg.value_source)
                btn.setProperty("on", "true" if key == cfg.value_source else "false")
                btn.clicked.connect(lambda _ck, k=key: self._set_metric(k))
                grid.addWidget(btn, i // 2, i % 2)
            self._metric_holder_v.addLayout(grid)

            self._metric_holder_v.addWidget(QLabel("LABEL OVERRIDE"))
            li = QLineEdit(cfg.label)
            li.textChanged.connect(
                lambda txt: self._state.update_device("oled", {"label": txt})
            )
            self._metric_holder_v.addWidget(li)
        else:
            self._metric_holder_v.addWidget(QLabel("METRICS TO CYCLE"))
            grid = QGridLayout()
            grid.setSpacing(6)
            self._rotate_checks: list[tuple[str, QCheckBox]] = []
            for i, key in enumerate(["cpu_temp", "gpu_temp", "cpu_pct",
                                     "gpu_pct", "mem_pct", "fan_rpm"]):
                cb = QCheckBox(METRIC_DISPLAY[key])
                cb.setChecked(key in cfg.rotate_sources)
                cb.toggled.connect(lambda _on, _k=key: self._sync_rotate_sources())
                grid.addWidget(cb, i // 2, i % 2)
                self._rotate_checks.append((key, cb))
            self._metric_holder_v.addLayout(grid)

            ivl = SliderRow(label="INTERVAL (sec)", minimum=1, maximum=10,
                            value=int(round(cfg.rotate_interval_s)), fmt="{v}s")
            ivl.value_changed.connect(
                lambda val: self._state.update_device("oled", {"rotate_interval_s": float(val)})
            )
            self._metric_holder_v.addWidget(ivl)

    def _set_metric(self, key: str) -> None:
        self._state.update_device("oled", {"value_source": key})
        self._render_hw_mode("single")  # refresh the on/off visuals

    def _sync_rotate_sources(self) -> None:
        sources = tuple(k for k, cb in self._rotate_checks if cb.isChecked())
        if not sources:
            return  # Empty list is invalid — config validation would reject
        self._state.update_device("oled", {"rotate_sources": sources})

    def build_common_config(self) -> QWidget:
        cfg: OledConfig = self._state.snapshot().oled
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        bri = SliderRow(label="BRIGHTNESS", minimum=0, maximum=100,
                        value=cfg.brightness, fmt="{v}")
        bri.value_changed.connect(
            lambda val: self._state.update_device("oled", {"brightness": val})
        )
        v.addWidget(bri)

        rate = SliderRow(label="REFRESH RATE (sec)", minimum=1, maximum=10,
                         value=int(round(cfg.update_seconds)), fmt="{v}s")
        rate.value_changed.connect(
            lambda val: self._state.update_device("oled", {"update_seconds": float(val)})
        )
        v.addWidget(rate)

        size = SegButton(
            options=[("SMALL", "small"), ("MEDIUM", "medium"), ("LARGE", "large")],
            value=cfg.font_size,
        )
        size.value_changed.connect(
            lambda val: self._state.update_device("oled", {"font_size": val})
        )
        v.addWidget(QLabel("FONT SIZE"))
        v.addWidget(size)

        enable = QCheckBox("ENABLED")
        enable.setChecked(cfg.enabled)
        enable.toggled.connect(
            lambda on: self._state.update_device("oled", {"enabled": on})
        )
        v.addWidget(enable)
        v.addStretch(1)
        return w

    def build_live_preview(self) -> QWidget:
        return OledLivePreview()
