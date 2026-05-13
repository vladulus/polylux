"""Aura RGB page — scenes: solid / off."""
from __future__ import annotations

from PyQt6.QtWidgets import QCheckBox, QLabel, QVBoxLayout, QWidget

from polylux.ui.pages.base import DevicePage
from polylux.ui.widgets.color_picker import ColorPicker
from polylux.ui.widgets.live_preview import AuraLivePreview
from polylux.ui.widgets.slider_row import SliderRow


KNOWN_TYPES = ("MOTHERBOARD", "KEYBOARD", "MOUSE", "DRAM", "GPU", "HEADSET")


class AuraRGBPage(DevicePage):
    DEVICE_KEY = "aura_rgb"
    DEVICE_TITLE = "Aura RGB"
    DEVICE_SUBTITLE = "OpenRGB · MB-only by default"

    def _scenes(self):
        return [
            ("solid", "SOLID", None),
            ("off",   "OFF",   None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        cfg = self._state.snapshot().aura_rgb
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)
        if scene == "solid":
            pick = ColorPicker(color=cfg.color)
            pick.color_changed.connect(
                lambda c: self._state.update_device("aura_rgb", {"color": c})
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
        cfg = self._state.snapshot().aura_rgb
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        bri = SliderRow(label="BRIGHTNESS", minimum=0, maximum=100,
                        value=cfg.brightness, fmt="{v}")
        bri.value_changed.connect(
            lambda val: self._state.update_device("aura_rgb", {"brightness": val})
        )
        v.addWidget(bri)

        v.addWidget(QLabel("TYPES TO CONTROL"))
        warn = QLabel("⚠ KEYBOARD / MOUSE override per-key effects. MB-only is safe.")
        warn.setObjectName("dim")
        warn.setWordWrap(True)
        v.addWidget(warn)
        self._type_checks: list[tuple[str, QCheckBox]] = []
        for t in KNOWN_TYPES:
            cb = QCheckBox(t)
            cb.setChecked(t in cfg.types)
            cb.toggled.connect(lambda _on, _t=t: self._sync_types())
            v.addWidget(cb)
            self._type_checks.append((t, cb))

        v.addStretch(1)
        return w

    def _sync_types(self) -> None:
        types = tuple(t for t, cb in self._type_checks if cb.isChecked())
        # Always keep at least MOTHERBOARD to avoid full disable surprise
        if not types:
            types = ("MOTHERBOARD",)
        self._state.update_device("aura_rgb", {"types": types})

    def build_live_preview(self):
        return AuraLivePreview()
