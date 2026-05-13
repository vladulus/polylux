"""Settings page — skin selector + on-top + kill_asus_stack toggle.

v0.4 minimal. Autostart-with-Windows / language deferred to v0.5.
"""
from __future__ import annotations

from PyQt6.QtWidgets import (
    QCheckBox, QComboBox, QFrame, QLabel, QVBoxLayout, QWidget,
)

from polylux.ui.skin import Skin, list_skins, load_skin
from polylux.ui.state import ServiceState


class SettingsPage(QWidget):
    def __init__(self, state: ServiceState, skin: Skin) -> None:
        super().__init__()
        self._state = state
        self._skin = skin

        v = QVBoxLayout(self)
        v.setContentsMargins(26, 22, 26, 22)
        v.setSpacing(0)

        t = QLabel("Settings")
        f = t.font()
        f.setPointSize(16)
        f.setBold(True)
        t.setFont(f)
        v.addWidget(t)
        v.addSpacing(18)

        # Skin selector
        card = QFrame()
        card.setObjectName("card")
        cv = QVBoxLayout(card)
        cv.setContentsMargins(18, 18, 18, 18)
        lbl = QLabel("APPEARANCE")
        lbl.setObjectName("card_label")
        cv.addWidget(lbl)
        cv.addSpacing(10)
        cv.addWidget(QLabel("Skin"))
        self._skin_combo = QComboBox()
        self._skin_combo.addItems(list_skins())
        self._skin_combo.setCurrentText(skin.name.lower())
        self._skin_combo.currentTextChanged.connect(self._on_skin_changed)
        cv.addWidget(self._skin_combo)
        v.addWidget(card)
        v.addSpacing(12)

        # Service toggles
        card2 = QFrame()
        card2.setObjectName("card")
        cv2 = QVBoxLayout(card2)
        cv2.setContentsMargins(18, 18, 18, 18)
        lbl2 = QLabel("SERVICE")
        lbl2.setObjectName("card_label")
        cv2.addWidget(lbl2)
        cv2.addSpacing(10)
        self._kill_cb = QCheckBox("Kill ASUS service stack at startup")
        self._kill_cb.setChecked(state.snapshot().service.kill_asus_stack)
        self._kill_cb.toggled.connect(self._on_kill_changed)
        cv2.addWidget(self._kill_cb)
        v.addWidget(card2)
        v.addStretch(1)

    def _on_skin_changed(self, name: str) -> None:
        try:
            new_skin = load_skin(name)
            w = self.window()
            if w is not None:
                w.setStyleSheet(new_skin.qss())
        except Exception:
            pass

    def _on_kill_changed(self, on: bool) -> None:
        try:
            cfg = self._state.snapshot()
            cfg.service.kill_asus_stack = on
            self._state._schedule_save()  # type: ignore[attr-defined]
        except Exception:
            pass
