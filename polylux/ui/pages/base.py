"""DevicePage — shared structure for per-device tabs.

Layout: header (name + status) → scene cards row → scene config card
(left) + common config card (right) → live preview.

Subclasses provide:
  - DEVICE_KEY: "matrix" | "oled" | "aura_rgb" | "ryujin_lcd"
  - DEVICE_TITLE: display string in header
  - SCENES: list of (scene_key, title, preview_widget_factory)
  - build_scene_config(scene) -> QWidget: editable controls for current scene
  - build_common_config() -> QWidget: brightness/etc.
  - build_live_preview() -> QWidget: subclass-specific preview widget
"""
from __future__ import annotations

import logging
import time
from typing import Optional

from PyQt6.QtCore import QTimer
from PyQt6.QtWidgets import (
    QFrame, QHBoxLayout, QLabel, QVBoxLayout, QWidget,
)

from polylux.ui.state import ServiceState
from polylux.ui.widgets.scene_card import SceneCard


log = logging.getLogger(__name__)


class DevicePage(QWidget):
    DEVICE_KEY: str = "OVERRIDE"
    DEVICE_TITLE: str = "OVERRIDE"
    DEVICE_SUBTITLE: str = ""

    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        self._state = state
        self._scene_cards: dict[str, SceneCard] = {}

        outer = QVBoxLayout(self)
        outer.setContentsMargins(26, 22, 26, 22)
        outer.setSpacing(0)

        # --- Header ---
        header_row = QHBoxLayout()
        h_title = QLabel(self.DEVICE_TITLE)
        f = h_title.font()
        f.setPointSize(16)
        f.setBold(True)
        h_title.setFont(f)
        header_row.addWidget(h_title, 1)
        h_sub = QLabel(self.DEVICE_SUBTITLE)
        h_sub.setObjectName("dim")
        header_row.addWidget(h_sub)
        outer.addLayout(header_row)

        self._status_lbl = QLabel("● starting…")
        self._status_lbl.setObjectName("dim")
        outer.addSpacing(2)
        outer.addWidget(self._status_lbl)
        outer.addSpacing(18)

        # --- Scene cards row ---
        sc_label = QLabel("SCENE")
        sc_label.setObjectName("card_label")
        outer.addWidget(sc_label)
        outer.addSpacing(8)
        self._scene_row = QHBoxLayout()
        self._scene_row.setSpacing(10)
        outer.addLayout(self._scene_row)
        for key, title, preview in self._scenes():
            card = SceneCard(scene_key=key, title=title, preview=preview)
            card.clicked_scene.connect(self.set_scene)
            self._scene_row.addWidget(card)
            self._scene_cards[key] = card

        outer.addSpacing(20)

        # --- Config row ---
        cfg_row = QHBoxLayout()
        cfg_row.setSpacing(20)
        self._scene_cfg_holder = QFrame()
        self._scene_cfg_holder.setObjectName("card")
        self._scene_cfg_layout = QVBoxLayout(self._scene_cfg_holder)
        self._scene_cfg_layout.setContentsMargins(18, 18, 18, 18)
        cfg_row.addWidget(self._scene_cfg_holder, 1)

        common_holder = QFrame()
        common_holder.setObjectName("card")
        common_v = QVBoxLayout(common_holder)
        common_v.setContentsMargins(18, 18, 18, 18)
        common_lbl = QLabel("COMMON")
        common_lbl.setObjectName("card_label")
        common_v.addWidget(common_lbl)
        common_v.addSpacing(10)
        common_v.addWidget(self.build_common_config())
        cfg_row.addWidget(common_holder, 1)
        outer.addLayout(cfg_row)

        outer.addSpacing(20)

        # --- Live preview ---
        preview_card = QFrame()
        preview_card.setObjectName("card")
        prev_h = QHBoxLayout(preview_card)
        prev_h.setContentsMargins(18, 14, 18, 14)
        prev_lbl = QLabel("LIVE PREVIEW")
        prev_lbl.setObjectName("card_label")
        prev_h.addWidget(prev_lbl, 1)
        self._live_widget = self.build_live_preview()
        prev_h.addWidget(self._live_widget)
        outer.addWidget(preview_card)
        outer.addStretch(1)

        # Initial state from config
        scene_now = self._scene_from_state()
        self._select_scene_visual(scene_now)
        self._rebuild_scene_config(scene_now)

        # Status refresh
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._refresh_status)
        self._timer.start(1000)

        # Live preview subscription
        if self.DEVICE_KEY in ("matrix", "oled", "aura_rgb", "ryujin_lcd"):
            state.add_frame_listener(self.DEVICE_KEY, self._on_frame)
            last = state.last_frame(self.DEVICE_KEY)
            if last is not None:
                self._on_frame(last)

    # --- Overrides ---

    def _scenes(self) -> list[tuple[str, str, Optional[QWidget]]]:
        raise NotImplementedError

    def build_scene_config(self, scene: str) -> QWidget:
        return QWidget()

    def build_common_config(self) -> QWidget:
        return QWidget()

    def build_live_preview(self) -> QWidget:
        return QWidget()

    # --- Public ---

    def active_scene(self) -> str:
        return self._scene_from_state()

    def set_scene(self, scene_key: str) -> None:
        if scene_key not in self._scene_cards:
            return
        try:
            self._state.update_device(self.DEVICE_KEY, {"scene": scene_key})
        except Exception:
            log.exception("set_scene failed")
            return
        self._select_scene_visual(scene_key)
        self._rebuild_scene_config(scene_key)

    # --- Internals ---

    def _scene_from_state(self) -> str:
        cfg = self._state.snapshot()
        dev_cfg = getattr(cfg, self.DEVICE_KEY)
        return dev_cfg.scene

    def _select_scene_visual(self, scene: str) -> None:
        for k, card in self._scene_cards.items():
            card.set_active(k == scene)

    def _rebuild_scene_config(self, scene: str) -> None:
        while self._scene_cfg_layout.count():
            item = self._scene_cfg_layout.takeAt(0)
            w = item.widget()
            if w is not None:
                w.deleteLater()
        title = QLabel(f"{scene.upper()} SCENE")
        title.setObjectName("card_label")
        self._scene_cfg_layout.addWidget(title)
        self._scene_cfg_layout.addSpacing(10)
        body = self.build_scene_config(scene)
        self._scene_cfg_layout.addWidget(body)
        self._scene_cfg_layout.addStretch(1)

    def _on_frame(self, frame) -> None:
        if hasattr(self._live_widget, "set_frame"):
            self._live_widget.set_frame(frame)

    def _refresh_status(self) -> None:
        status = self._state.status().get(self.DEVICE_KEY, {})
        cfg = getattr(self._state.snapshot(), self.DEVICE_KEY)
        now = time.time()
        if not cfg.enabled:
            self._status_lbl.setText("● disabled")
            return
        err = status.get("last_error")
        upd = status.get("last_update", 0)
        if err:
            self._status_lbl.setText(f"● error: {err[:60]}")
        elif upd == 0:
            self._status_lbl.setText("● starting…")
        elif now - upd < 5:
            self._status_lbl.setText(f"● ACTIVE · last frame {int((now - upd) * 1000)}ms ago")
        else:
            self._status_lbl.setText(f"● stale {int(now - upd)}s")
