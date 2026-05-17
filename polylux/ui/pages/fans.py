"""Fans page — preset modes + advanced curve editor per detected fan.

Polylux replaces the per-fan PWM control Armoury Crate / AI Suite owned.
The daemon (PolyluxSensorDaemon) does the chip writes via LHM IControl;
this page is just the UI for choosing each fan's mode and (optionally)
curve, plus a 1-Hz RPM readout.

Fans are auto-discovered from the daemon's ``/data.json`` on first
load: any ``/lpc/.../control/N`` sensor with a matching ``.../fan/N``
tachometer becomes a card. Discovered fans not yet in the user's
config are added with mode=``auto`` so nothing changes unprompted.
"""
from __future__ import annotations

import logging
from dataclasses import replace
from typing import Optional

from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtWidgets import (
    QCheckBox, QComboBox, QDoubleSpinBox, QFrame, QGridLayout, QHBoxLayout,
    QLabel, QLineEdit, QPushButton, QSizePolicy, QVBoxLayout, QWidget,
)

from polylux.config import FanConfig
from polylux.sensors.lhm import LHMSensors
from polylux.ui.state import ServiceState


log = logging.getLogger(__name__)


PRESET_PILLS = [
    ("auto",   "AUTO"),
    ("off",    "OFF"),
    ("silent", "SILENT"),
    ("medium", "MEDIUM"),
    ("full",   "FULL"),
    ("curve",  "CURVE"),
]


class _ModePill(QPushButton):
    """Small toggle-style button. Active state styled via QSS objectName."""

    def __init__(self, mode: str, label: str) -> None:
        super().__init__(label)
        self.mode = mode
        self.setCheckable(True)
        self.setObjectName("mode_pill")
        self.setMinimumWidth(72)
        self.setCursor(Qt.CursorShape.PointingHandCursor)


class _FanCard(QFrame):
    """One card per controllable fan: header + mode pills + (curve)."""

    def __init__(self, state: ServiceState, fan_index: int) -> None:
        super().__init__()
        self._state = state
        self._fan_index = fan_index
        self.setObjectName("card")
        self.setMinimumWidth(280)

        v = QVBoxLayout(self)
        v.setContentsMargins(16, 14, 16, 14)
        v.setSpacing(10)

        # Header: inline-editable fan name + live RPM.
        # QLineEdit styled to look like a label until focused. Click →
        # cursor appears, type, click anywhere else (editingFinished)
        # → save to config.
        head = QHBoxLayout()
        self._name_edit = QLineEdit("")
        nf = self._name_edit.font()
        nf.setBold(True)
        self._name_edit.setFont(nf)
        self._name_edit.setObjectName("fan_name_edit")
        self._name_edit.setStyleSheet(
            "QLineEdit#fan_name_edit { background: transparent; border: none; padding: 0; }"
            "QLineEdit#fan_name_edit:focus { background: rgba(255,255,255,0.06);"
            " border: 1px solid rgba(255,255,255,0.18); border-radius: 3px;"
            " padding: 1px 4px; }"
        )
        self._name_edit.editingFinished.connect(self._persist_name)
        head.addWidget(self._name_edit, 1)
        self._rpm_lbl = QLabel("— RPM")
        self._rpm_lbl.setObjectName("dim")
        head.addWidget(self._rpm_lbl)
        v.addLayout(head)

        # Mode pills row
        self._pills: dict[str, _ModePill] = {}
        pills_row = QHBoxLayout()
        pills_row.setSpacing(6)
        for mode, label in PRESET_PILLS:
            p = _ModePill(mode, label)
            p.clicked.connect(lambda _checked, m=mode: self._set_mode(m))
            self._pills[mode] = p
            pills_row.addWidget(p)
        pills_row.addStretch(1)
        v.addLayout(pills_row)

        # Curve editor (only visible when mode=curve)
        self._curve_box = QWidget()
        cb = QGridLayout(self._curve_box)
        cb.setContentsMargins(0, 4, 0, 0)
        cb.setHorizontalSpacing(8)
        cb.setVerticalSpacing(4)
        cb.addWidget(QLabel("TEMP °C"), 0, 1)
        cb.addWidget(QLabel("DUTY %"), 0, 2)
        self._spin_temps: list[QDoubleSpinBox] = []
        self._spin_duties: list[QDoubleSpinBox] = []
        for i in range(4):
            cb.addWidget(QLabel(f"PT {i+1}"), i + 1, 0)
            st = QDoubleSpinBox()
            st.setRange(-20, 120)
            st.setSuffix(" °")
            st.setDecimals(0)
            st.valueChanged.connect(self._persist_curve)
            cb.addWidget(st, i + 1, 1)
            self._spin_temps.append(st)
            sd = QDoubleSpinBox()
            sd.setRange(0, 100)
            sd.setSuffix(" %")
            sd.setDecimals(0)
            sd.valueChanged.connect(self._persist_curve)
            cb.addWidget(sd, i + 1, 2)
            self._spin_duties.append(sd)
        # Temp source selector
        cb.addWidget(QLabel("DRIVEN BY"), 5, 0)
        self._temp_src = QComboBox()
        self._temp_src.addItems([
            "cpu package", "cpu core", "gpu core",
            "gpu hot spot", "motherboard",
        ])
        self._temp_src.setEditable(True)
        self._temp_src.currentTextChanged.connect(
            lambda s: self._patch_fan({"temp_source": s})
        )
        cb.addWidget(self._temp_src, 5, 1, 1, 2)
        v.addWidget(self._curve_box)

        self.refresh()

    # ---- state interactions ----

    def _current_fan(self) -> Optional[FanConfig]:
        fans = self._state.snapshot().fans.fans
        if 0 <= self._fan_index < len(fans):
            return fans[self._fan_index]
        return None

    def _patch_fan(self, patch: dict) -> None:
        fans = list(self._state.snapshot().fans.fans)
        if not (0 <= self._fan_index < len(fans)):
            return
        cur = fans[self._fan_index]
        kwargs = {**{
            "sensor_id": cur.sensor_id, "name": cur.name, "mode": cur.mode,
            "temp_source": cur.temp_source, "curve": cur.curve,
        }, **patch}
        fans[self._fan_index] = FanConfig(**kwargs)
        try:
            self._state.update_device("fans", {"fans": fans})
        except Exception:
            log.exception("fan patch failed")

    def _set_mode(self, mode: str) -> None:
        self._patch_fan({"mode": mode})
        self.refresh()

    def _persist_name(self) -> None:
        new_name = self._name_edit.text().strip()
        fan = self._current_fan()
        if fan is None or new_name == fan.name:
            return
        # Don't allow empty — fall back to sensor id tail so the card
        # still has *something* readable in the header.
        if not new_name:
            new_name = fan.sensor_id.rsplit("/", 1)[-1]
        self._patch_fan({"name": new_name})

    def _persist_curve(self) -> None:
        pts = tuple(
            (self._spin_temps[i].value(), self._spin_duties[i].value())
            for i in range(4)
        )
        self._patch_fan({"curve": pts})

    # ---- view refresh ----

    def refresh(self) -> None:
        fan = self._current_fan()
        if fan is None:
            return
        new_text = fan.name or fan.sensor_id.rsplit("/", 1)[-1]
        if self._name_edit.text() != new_text and not self._name_edit.hasFocus():
            self._name_edit.blockSignals(True)
            self._name_edit.setText(new_text)
            self._name_edit.blockSignals(False)
        for mode, pill in self._pills.items():
            pill.setChecked(mode == fan.mode)
        self._curve_box.setVisible(fan.mode == "curve")
        # Sync spinners from config (block signals to avoid feedback loop)
        for i, (t, d) in enumerate(list(fan.curve)[:4]):
            self._spin_temps[i].blockSignals(True)
            self._spin_duties[i].blockSignals(True)
            self._spin_temps[i].setValue(t)
            self._spin_duties[i].setValue(d)
            self._spin_temps[i].blockSignals(False)
            self._spin_duties[i].blockSignals(False)
        self._temp_src.blockSignals(True)
        idx = self._temp_src.findText(fan.temp_source)
        if idx >= 0:
            self._temp_src.setCurrentIndex(idx)
        else:
            self._temp_src.setEditText(fan.temp_source)
        self._temp_src.blockSignals(False)

    def set_rpm(self, rpm: Optional[int]) -> None:
        self._rpm_lbl.setText(f"{rpm} RPM" if rpm is not None else "— RPM")


def _discover_controllable_fans(url: str = "http://127.0.0.1:8085/data.json") -> list[dict]:
    """Walk daemon /data.json for (control, fan) pairs that look plugged in.

    Returns a list of dicts: {sensor_id, name, fan_sensor_id, current_rpm}.

    Filtering rules (silence vs noise):
      - Only Super-IO chip fans (``/lpc/...``). GPU fans are driver-
        managed; LHM IControl writes don't reach them, so exposing them
        in the UI would just be a non-functional widget.
      - Only fans with ``Max RPM > 0`` — the chip records peak fan
        speed since daemon start, so an empty header (no fan wired)
        stays at 0; a real fan that has spun at least once shows >0.
        Misses brand-new installs where the fan hasn't spun yet —
        re-click DISCOVER FANS after the system runs a bit.
    """
    import json
    import re
    import urllib.request
    try:
        with urllib.request.urlopen(url, timeout=2.0) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as ex:
        log.warning("fan discovery: daemon fetch failed: %s", ex)
        return []

    controls: dict[str, dict] = {}
    fans: dict[str, dict] = {}

    def walk(node):
        if not isinstance(node, dict):
            return
        sid = node.get("SensorId") or ""
        if "/control/" in sid:
            controls[sid] = {"name": node.get("Text", ""), "value": node.get("Value", "")}
        elif "/fan/" in sid:
            fans[sid] = {
                "name": node.get("Text", ""),
                "value": node.get("Value", ""),
                "max": node.get("Max", ""),
            }
        for c in node.get("Children", []) or []:
            walk(c)

    walk(data)

    def _rpm(s: str) -> int:
        m = re.match(r"\s*(\d+)", s or "")
        return int(m.group(1)) if m else 0

    pairs = []
    for csid, cmeta in controls.items():
        # Super-IO chip fans only — drop GPU and any other non-mobo controls.
        if "/lpc/" not in csid:
            continue
        fsid = csid.replace("/control/", "/fan/")
        if fsid not in fans:
            continue
        fan_max = _rpm(fans[fsid].get("max", ""))
        fan_now = _rpm(fans[fsid].get("value", ""))
        # Plugged-in heuristic: either currently spinning or has spun
        # since the daemon started.
        if fan_max <= 0 and fan_now <= 0:
            continue
        pairs.append({
            "sensor_id": csid,
            "name": cmeta["name"] or csid.rsplit("/", 1)[-1],
            "fan_sensor_id": fsid,
            "current_rpm": fan_now,
        })
    return pairs


class FansPage(QWidget):
    """No DevicePage inheritance — fans don't fit the scene/preview model."""

    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        self._state = state
        self._cards: list[_FanCard] = []
        self._fan_to_card: dict[str, _FanCard] = {}  # sensor_id -> card
        self._sensors = LHMSensors()

        outer = QVBoxLayout(self)
        outer.setContentsMargins(26, 22, 26, 22)
        outer.setSpacing(0)

        # Header
        head = QHBoxLayout()
        title = QLabel("Fans")
        tf = title.font(); tf.setPointSize(16); tf.setBold(True)
        title.setFont(tf)
        head.addWidget(title, 1)
        sub = QLabel("PWM control via PolyluxSensorDaemon · Nuvoton chip")
        sub.setObjectName("dim")
        head.addWidget(sub)
        self._enable_cb = QCheckBox("ENABLED")
        self._enable_cb.setChecked(bool(state.snapshot().fans.enabled))
        self._enable_cb.toggled.connect(self._on_enable_toggled)
        head.addSpacing(16)
        head.addWidget(self._enable_cb)
        outer.addLayout(head)

        self._status_lbl = QLabel("● starting…")
        self._status_lbl.setObjectName("dim")
        outer.addSpacing(2)
        outer.addWidget(self._status_lbl)
        outer.addSpacing(14)

        # Toolbar
        bar = QHBoxLayout()
        btn = QPushButton("DISCOVER FANS")
        btn.clicked.connect(self._discover_and_seed)
        bar.addWidget(btn)
        bar.addStretch(1)
        outer.addLayout(bar)
        outer.addSpacing(12)

        # Cards grid (2 columns)
        self._cards_holder = QWidget()
        self._cards_grid = QGridLayout(self._cards_holder)
        self._cards_grid.setSpacing(14)
        self._cards_grid.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(self._cards_holder, 1)
        outer.addStretch(0)

        # Build cards from existing config; if empty, auto-discover
        if not state.snapshot().fans.fans:
            self._discover_and_seed()
        self._rebuild_cards()

        # Refresh RPMs + status every 1s
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._refresh_live)
        self._timer.start(1000)

        state.add_listener(self._rebuild_cards)

    # ---- discovery + cards ----

    def _discover_and_seed(self) -> None:
        pairs = _discover_controllable_fans()
        if not pairs:
            self._status_lbl.setText("● no daemon at 127.0.0.1:8085, can't discover fans")
            return
        existing_ids = {f.sensor_id for f in self._state.snapshot().fans.fans}
        added = 0
        new_list = list(self._state.snapshot().fans.fans)
        for p in pairs:
            if p["sensor_id"] in existing_ids:
                continue
            new_list.append(FanConfig(
                sensor_id=p["sensor_id"], name=p["name"], mode="auto",
            ))
            added += 1
        if added:
            self._state.update_device("fans", {"fans": new_list})
            log.info("fans: discovered %d new (total %d)", added, len(new_list))
        self._status_lbl.setText(
            f"● {len(self._state.snapshot().fans.fans)} fans configured "
            f"({added} newly discovered)"
        )

    def _rebuild_cards(self) -> None:
        # Wipe + rebuild
        while self._cards_grid.count():
            item = self._cards_grid.takeAt(0)
            w = item.widget()
            if w is not None:
                w.deleteLater()
        self._cards.clear()
        self._fan_to_card.clear()

        fans = self._state.snapshot().fans.fans
        cols = 2
        for i, fan in enumerate(fans):
            card = _FanCard(self._state, i)
            self._cards_grid.addWidget(card, i // cols, i % cols)
            self._cards.append(card)
            self._fan_to_card[fan.sensor_id] = card

    def _refresh_live(self) -> None:
        # Pull a fresh sensor tree; pair fan tachs to control IDs.
        pairs = _discover_controllable_fans()
        rpm_by_control = {p["sensor_id"]: p["current_rpm"] for p in pairs}
        for fan in self._state.snapshot().fans.fans:
            card = self._fan_to_card.get(fan.sensor_id)
            if card is not None:
                card.set_rpm(rpm_by_control.get(fan.sensor_id))
        # Status: brief
        cfg = self._state.snapshot().fans
        active = sum(1 for f in cfg.fans if f.mode != "auto")
        if not cfg.enabled:
            self._status_lbl.setText("● disabled (BIOS owns fan control)")
        elif not cfg.fans:
            self._status_lbl.setText("● no fans configured — click DISCOVER FANS")
        else:
            self._status_lbl.setText(
                f"● {len(cfg.fans)} fans · {active} overridden · daemon active"
            )

    def _on_enable_toggled(self, on: bool) -> None:
        try:
            self._state.update_device("fans", {"enabled": on})
        except Exception:
            log.exception("fans ENABLED toggle failed")
