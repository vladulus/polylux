"""Aura RGB page — every OpenRGB mode exposed as a scene card.

The motherboard controller advertises 9 modes (Direct, Off, Static,
Breathing, Flashing, Spectrum Cycle, Rainbow, Chase Fade, Chase). They
run firmware-side so Polylux just sets the mode + a base color via
OpenRGB SDK; no per-frame Python animation loop.

Color picker is shown for every mode — modes that don't use color
(Spectrum Cycle / Rainbow) silently ignore it on the device.
"""
from __future__ import annotations

from PyQt6.QtWidgets import QCheckBox, QLabel, QVBoxLayout, QWidget

from polylux.ui.pages.base import DevicePage
from polylux.ui.widgets.color_picker import ColorPicker
from polylux.ui.widgets.live_preview import AuraLivePreview
from polylux.ui.widgets.slider_row import SliderRow


KNOWN_TYPES = ("MOTHERBOARD", "KEYBOARD", "MOUSE", "DRAM", "GPU", "HEADSET")

# Hardcoded common-MB list for v0.4 — matches what `available_modes()`
# returns on the Z690 Extreme. v0.5 will query the driver at runtime so
# users with different controllers see exactly their device's modes.
AURA_MODES = [
    "Direct", "Static", "Breathing", "Flashing",
    "Spectrum Cycle", "Rainbow", "Chase Fade", "Chase", "Off",
]


class AuraRGBPage(DevicePage):
    DEVICE_KEY = "aura_rgb"
    DEVICE_TITLE = "Aura RGB"
    DEVICE_SUBTITLE = "OpenRGB · MB-only by default"

    def _scenes(self):
        return [(m, m.upper(), None) for m in AURA_MODES]

    def build_scene_config(self, scene: str) -> QWidget:
        cfg = self._state.snapshot().aura_rgb
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        if scene.lower() == "off":
            lbl = QLabel("LEDs turned off via firmware-native 'Off' mode.")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        else:
            pick = ColorPicker(color=cfg.color)
            pick.color_changed.connect(
                lambda c: self._state.update_device("aura_rgb", {"color": c})
            )
            v.addWidget(QLabel("COLOR"))
            v.addWidget(pick)

            if scene.lower() in ("spectrum cycle", "rainbow"):
                note = QLabel(
                    "This mode cycles through the full hue wheel — the "
                    "color picker is ignored by the firmware."
                )
                note.setObjectName("dim")
                note.setWordWrap(True)
                v.addWidget(note)

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
        if not types:
            types = ("MOTHERBOARD",)
        self._state.update_device("aura_rgb", {"types": types})

    def build_live_preview(self):
        return AuraLivePreview()
