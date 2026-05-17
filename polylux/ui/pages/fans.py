"""Fans page — radial gauges + auto-calibration + right-click settings modal.

Visual layout:
  - Status banner (calibration progress when running, otherwise hidden)
  - Discovered fans laid out in a grid as radial gauges:
      [RPM number in centre, inline-editable name below]
  - Right-click any gauge → modal dialog with mode pills + curve editor

Calibration flow (auto, once per fan):
  - On page show, if any fan has max_rpm == 0, kick off a 30 s
    background calibration: every fan goes to PWM 100% via the daemon,
    daemon records peak RPM (LHM ``Max`` field), we read it back and
    save into the fan's config. Banner reads
    "Polylux is calibrating the fans... 28s remaining".
  - Prior modes are restored after calibration so the user doesn't
    end up stuck at 100% PWM forever if Polylux is killed mid-cal.
"""
from __future__ import annotations

import logging
import threading
import time
from dataclasses import asdict
from typing import Optional

from PyQt6.QtCore import Qt, QTimer, pyqtSignal
from PyQt6.QtWidgets import (
    QCheckBox, QComboBox, QDialog, QDoubleSpinBox, QFrame, QGridLayout,
    QHBoxLayout, QLabel, QLineEdit, QPushButton, QSizePolicy,
    QVBoxLayout, QWidget,
)

from polylux.config import FanConfig
from polylux.sensors.fan_control import _post as fan_post
from polylux.ui.state import ServiceState
from polylux.ui.widgets.gauge import RadialGauge


log = logging.getLogger(__name__)


PRESET_PILLS = [
    ("auto",   "AUTO"),
    ("off",    "OFF"),
    ("silent", "SILENT"),
    ("medium", "MEDIUM"),
    ("full",   "FULL"),
    ("curve",  "CURVE"),
]

DAEMON_URL = "http://127.0.0.1:8085"
CALIBRATION_SECONDS = 30


# ---------------------------------------------------------------------------
# Daemon helpers
# ---------------------------------------------------------------------------

def _discover_controllable_fans(url: str = f"{DAEMON_URL}/data.json") -> list[dict]:
    """Walk daemon /data.json for (control, fan) pairs that look plugged in.

    Filtering:
      - Only Super-IO chip fans (``/lpc/...``). GPU fans aren't
        PWM-writeable via LHM IControl.
      - Only fans with ``Max RPM > 0`` or current > 0 — empty headers
        stay quiet, real fans either currently spinning or recorded
        a peak since daemon start.
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
        if "/lpc/" not in csid:
            continue
        fsid = csid.replace("/control/", "/fan/")
        if fsid not in fans:
            continue
        fan_max = _rpm(fans[fsid].get("max", ""))
        fan_now = _rpm(fans[fsid].get("value", ""))
        if fan_max <= 0 and fan_now <= 0:
            continue
        pairs.append({
            "sensor_id": csid,
            "name": cmeta["name"] or csid.rsplit("/", 1)[-1],
            "fan_sensor_id": fsid,
            "current_rpm": fan_now,
            "max_rpm": fan_max,
        })
    return pairs


def _rpm_snapshot(url: str = f"{DAEMON_URL}/data.json") -> dict[str, int]:
    """sensor_id (control) -> current RPM of its paired fan tach."""
    pairs = _discover_controllable_fans(url)
    return {p["sensor_id"]: p["current_rpm"] for p in pairs}


def _max_rpm_snapshot(url: str = f"{DAEMON_URL}/data.json") -> dict[str, int]:
    """sensor_id (control) -> Max RPM recorded by the chip since daemon start."""
    pairs = _discover_controllable_fans(url)
    return {p["sensor_id"]: p["max_rpm"] for p in pairs}


# ---------------------------------------------------------------------------
# Calibration worker
# ---------------------------------------------------------------------------

class _CalibrationThread(threading.Thread):
    """Force every fan to ``mode='full'`` in config for CALIBRATION_SECONDS,
    then read peak RPM from the daemon and restore prior modes.

    Mutating config (rather than POSTing directly) avoids a race with the
    `run_fans` thread which would otherwise re-apply the user-configured
    mode every few seconds and clobber the calibration override.

    Also: reset the chip's running ``Max`` field at start by reading
    fresh after the 100% blast, not during. Old Max values from prior
    runs survive across daemon restarts, so without this we'd just
    report whatever historical peak the chip happens to remember.
    """

    def __init__(
        self,
        state: ServiceState,
        on_tick,        # callable(seconds_remaining: int)
        on_done,        # callable(maxes: dict[str, int])
    ):
        super().__init__(daemon=True, name="fan-calibration")
        self._state = state
        self._on_tick = on_tick
        self._on_done = on_done

    def _set_all_modes(self, mode_by_sid: dict[str, str]) -> None:
        fans = list(self._state.snapshot().fans.fans)
        out = []
        for f in fans:
            new_mode = mode_by_sid.get(f.sensor_id, f.mode)
            kwargs = {**asdict(f), "mode": new_mode}
            if "curve" in kwargs and isinstance(kwargs["curve"], list):
                kwargs["curve"] = tuple(tuple(p) for p in kwargs["curve"])
            out.append(FanConfig(**kwargs))
        try:
            self._state.update_device("fans", {"fans": out})
        except Exception:
            log.exception("calibration: state update failed")

    def run(self) -> None:
        fans = list(self._state.snapshot().fans.fans)
        if not fans:
            self._on_done({})
            return
        prior_modes = {f.sensor_id: f.mode for f in fans}
        try:
            # Phase 1: force everyone to 'full' via config — runner picks
            # this up on its next tick. The runner enforces it every
            # cycle so the chip stays at 100% throughout the window.
            self._set_all_modes({f.sensor_id: "full" for f in fans})

            # Phase 2: also kick the daemon directly so we don't wait
            # for the next runner tick (could be up to update_seconds).
            for f in fans:
                fan_post(DAEMON_URL, f.sensor_id,
                         {"mode": "software", "value": 100}, 2.0)

            # Phase 3: count down 1 Hz, sampling live RPMs so we have a
            # measured peak that doesn't depend on whatever stale Max
            # the chip happens to remember from before calibration.
            live_peaks: dict[str, int] = {f.sensor_id: 0 for f in fans}
            for remaining in range(CALIBRATION_SECONDS, 0, -1):
                try:
                    self._on_tick(remaining)
                except Exception:
                    log.exception("calibration tick callback failed")
                try:
                    snap = _rpm_snapshot()
                    for sid, rpm in snap.items():
                        if rpm > live_peaks.get(sid, 0):
                            live_peaks[sid] = rpm
                except Exception:
                    pass
                time.sleep(1.0)

            # Phase 4: combine our live samples with the chip's Max
            # (in case it spun briefly between our polls), then keep
            # the higher value per fan.
            chip_maxes = _max_rpm_snapshot()
            maxes = {
                sid: max(live_peaks.get(sid, 0), chip_maxes.get(sid, 0))
                for sid in set(live_peaks) | set(chip_maxes)
            }

            # Phase 5: restore prior modes BEFORE firing done callback
            # so the UI reflects the final state immediately.
            self._set_all_modes(prior_modes)

            try:
                self._on_done(maxes)
            except Exception:
                log.exception("calibration done callback failed")
        except Exception:
            log.exception("calibration thread crashed; attempting mode restore")
            self._set_all_modes(prior_modes)


# ---------------------------------------------------------------------------
# Mode pill (used in the settings modal)
# ---------------------------------------------------------------------------

class _ModePill(QPushButton):
    def __init__(self, mode: str, label: str) -> None:
        super().__init__(label)
        self.mode = mode
        self.setCheckable(True)
        self.setObjectName("mode_pill")
        self.setMinimumWidth(72)
        self.setCursor(Qt.CursorShape.PointingHandCursor)


# ---------------------------------------------------------------------------
# Settings modal — right-click target
# ---------------------------------------------------------------------------

class FanSettingsDialog(QDialog):
    def __init__(self, state: ServiceState, fan_index: int, parent: QWidget) -> None:
        super().__init__(parent)
        self._state = state
        self._fan_index = fan_index
        self.setWindowTitle("Fan settings")
        self.setModal(True)
        self.setMinimumWidth(420)
        # Closing this dialog must never quit the app.
        self.setAttribute(Qt.WidgetAttribute.WA_QuitOnClose, False)

        v = QVBoxLayout(self)
        v.setContentsMargins(20, 18, 20, 18)
        v.setSpacing(14)

        fan = self._current_fan()
        title = QLabel(fan.name if fan else "")
        tf = title.font(); tf.setPointSize(14); tf.setBold(True)
        title.setFont(tf)
        v.addWidget(title)

        v.addWidget(QLabel("MODE"))
        pills_row = QHBoxLayout(); pills_row.setSpacing(6)
        self._pills: dict[str, _ModePill] = {}
        for mode, label in PRESET_PILLS:
            p = _ModePill(mode, label)
            p.clicked.connect(lambda _c, m=mode: self._set_mode(m))
            self._pills[mode] = p
            pills_row.addWidget(p)
        pills_row.addStretch(1)
        v.addLayout(pills_row)

        # Curve editor — visible only when mode=curve
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
            st = QDoubleSpinBox(); st.setRange(-20, 120); st.setSuffix(" °"); st.setDecimals(0)
            st.valueChanged.connect(self._persist_curve); cb.addWidget(st, i + 1, 1)
            self._spin_temps.append(st)
            sd = QDoubleSpinBox(); sd.setRange(0, 100); sd.setSuffix(" %"); sd.setDecimals(0)
            sd.valueChanged.connect(self._persist_curve); cb.addWidget(sd, i + 1, 2)
            self._spin_duties.append(sd)
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

        close_btn = QPushButton("Close")
        close_btn.clicked.connect(self.accept)
        btn_row = QHBoxLayout(); btn_row.addStretch(1); btn_row.addWidget(close_btn)
        v.addLayout(btn_row)

        self._refresh()

    # ---- state plumbing ----

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
        kwargs = {**asdict(cur), **patch}
        # asdict serializes tuples to lists; convert curve back.
        if "curve" in kwargs and isinstance(kwargs["curve"], list):
            kwargs["curve"] = tuple(
                tuple(p) if isinstance(p, (list, tuple)) else p
                for p in kwargs["curve"]
            )
        fans[self._fan_index] = FanConfig(**kwargs)
        try:
            self._state.update_device("fans", {"fans": fans})
        except Exception:
            log.exception("fan patch failed")

    def _set_mode(self, mode: str) -> None:
        self._patch_fan({"mode": mode})
        self._refresh()

    def _persist_curve(self) -> None:
        pts = tuple(
            (self._spin_temps[i].value(), self._spin_duties[i].value())
            for i in range(4)
        )
        self._patch_fan({"curve": pts})

    def _refresh(self) -> None:
        fan = self._current_fan()
        if fan is None:
            return
        for mode, pill in self._pills.items():
            pill.setChecked(mode == fan.mode)
        self._curve_box.setVisible(fan.mode == "curve")
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


# ---------------------------------------------------------------------------
# Gauge card — the visible per-fan widget
# ---------------------------------------------------------------------------

class _FanGaugeCard(QFrame):
    """RadialGauge with RPM in centre + inline-editable name below.

    Right-click anywhere opens the FanSettingsDialog. Context menu also
    exposes a "Settings…" entry for users who don't think to right-click.
    """

    def __init__(self, state: ServiceState, fan_index: int) -> None:
        super().__init__()
        self._state = state
        self._fan_index = fan_index
        self.setObjectName("card")
        # Fixed size — matches the Dashboard CPU/GPU gauge card footprint
        # so 3 cards fit comfortably in the 1280px window without the
        # gauges blowing up to full-width when there are only 2 fans.
        self.setFixedSize(220, 260)

        v = QVBoxLayout(self)
        v.setContentsMargins(12, 14, 12, 12)
        v.setSpacing(6)

        fan = self._current_fan()
        max_rpm = (fan.max_rpm if fan else 0) or 2000  # safe scale during calibration
        # unit="" — we render the unit separately under the value so the
        # gauge text stays compact and the rpm label doesn't get repeated.
        self._gauge = RadialGauge(
            label="", unit="",
            min_value=0, max_value=max_rpm,
            thresholds=(max_rpm * 0.55, max_rpm * 0.85),
        )
        self._gauge.setFixedSize(160, 160)
        # Gauge label sits inside the arc — keep it empty here, we
        # render the fan name as a separate widget below the arc so
        # it can be the inline-editable QLineEdit.
        # Gauge + mode label are transparent to mouse so card-level
        # click handler can route presses anywhere on the card body
        # to "open settings", while the name field still grabs its own
        # focus for inline editing.
        self._gauge.setAttribute(Qt.WidgetAttribute.WA_TransparentForMouseEvents, True)
        v.addWidget(self._gauge, 1, Qt.AlignmentFlag.AlignCenter)

        self._name_edit = QLineEdit("")
        nf = self._name_edit.font(); nf.setBold(True)
        self._name_edit.setFont(nf)
        self._name_edit.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self._name_edit.setObjectName("fan_name_edit")
        self._name_edit.setStyleSheet(
            "QLineEdit#fan_name_edit { background: transparent; border: none; padding: 0; }"
            "QLineEdit#fan_name_edit:focus { background: rgba(255,255,255,0.06);"
            " border: 1px solid rgba(255,255,255,0.18); border-radius: 3px;"
            " padding: 1px 4px; }"
        )
        self._name_edit.editingFinished.connect(self._persist_name)
        v.addWidget(self._name_edit)

        self._mode_lbl = QLabel("")
        self._mode_lbl.setObjectName("dim")
        self._mode_lbl.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self._mode_lbl.setAttribute(Qt.WidgetAttribute.WA_TransparentForMouseEvents, True)
        v.addWidget(self._mode_lbl)

        self._refresh_from_state()

    # ---- right-click anywhere on the card body → settings ----

    def mousePressEvent(self, ev) -> None:
        if ev.button() == Qt.MouseButton.RightButton:
            self._open_settings()
            ev.accept()
            return
        super().mousePressEvent(ev)

    def _open_settings(self) -> None:
        dlg = FanSettingsDialog(self._state, self._fan_index, parent=self.window())
        dlg.exec()
        # Do NOT touch self.* after this point. Any state mutation
        # inside the dialog triggers FansPage._rebuild_cards via the
        # state listener, which deleteLater()s this card. The replacement
        # card built by _rebuild_cards already reflects the new state.

    # ---- state ----

    def _current_fan(self) -> Optional[FanConfig]:
        fans = self._state.snapshot().fans.fans
        if 0 <= self._fan_index < len(fans):
            return fans[self._fan_index]
        return None

    def _persist_name(self) -> None:
        new_name = self._name_edit.text().strip()
        fan = self._current_fan()
        if fan is None or new_name == fan.name:
            return
        if not new_name:
            new_name = fan.sensor_id.rsplit("/", 1)[-1]
        fans = list(self._state.snapshot().fans.fans)
        cur = fans[self._fan_index]
        kwargs = {**asdict(cur), "name": new_name}
        if "curve" in kwargs and isinstance(kwargs["curve"], list):
            kwargs["curve"] = tuple(tuple(p) for p in kwargs["curve"])
        fans[self._fan_index] = FanConfig(**kwargs)
        try:
            self._state.update_device("fans", {"fans": fans})
        except Exception:
            log.exception("fan rename failed")

    def _refresh_from_state(self) -> None:
        fan = self._current_fan()
        if fan is None:
            return
        new_text = fan.name or fan.sensor_id.rsplit("/", 1)[-1]
        if self._name_edit.text() != new_text and not self._name_edit.hasFocus():
            self._name_edit.blockSignals(True)
            self._name_edit.setText(new_text)
            self._name_edit.blockSignals(False)
        self._mode_lbl.setText(fan.mode.upper())
        # Re-scale gauge if calibration updated max_rpm
        if fan.max_rpm > 0:
            self._gauge._max = float(fan.max_rpm)
            self._gauge.set_thresholds(fan.max_rpm * 0.55, fan.max_rpm * 0.85)

    def set_rpm(self, rpm: Optional[int]) -> None:
        if rpm is None:
            return
        # Gauge shows the raw number in its centre; "rpm" label sits as
        # the gauge sub_text rather than embedded in the value so the
        # numerals stay big and unit cluttered out separately.
        self._gauge.set_value(float(rpm))
        self._gauge.set_sub_text("rpm")


# ---------------------------------------------------------------------------
# Page
# ---------------------------------------------------------------------------

class FansPage(QWidget):

    _cal_tick = pyqtSignal(int)        # cross-thread: seconds_remaining
    _cal_done = pyqtSignal(object)     # cross-thread: dict[sensor_id -> max_rpm]

    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        self._state = state
        self._cards: list[_FanGaugeCard] = []
        self._fan_to_card: dict[str, _FanGaugeCard] = {}
        self._cal_thread: Optional[_CalibrationThread] = None

        outer = QVBoxLayout(self)
        outer.setContentsMargins(26, 22, 26, 22)
        outer.setSpacing(0)

        # Header
        head = QHBoxLayout()
        title = QLabel("Fans")
        tf = title.font(); tf.setPointSize(16); tf.setBold(True)
        title.setFont(tf)
        head.addWidget(title, 1)
        sub = QLabel("PWM control · Nuvoton chip · right-click a fan for settings")
        sub.setObjectName("dim")
        head.addWidget(sub)
        self._enable_cb = QCheckBox("ENABLED")
        self._enable_cb.setChecked(bool(state.snapshot().fans.enabled))
        self._enable_cb.toggled.connect(self._on_enable_toggled)
        head.addSpacing(16); head.addWidget(self._enable_cb)
        outer.addLayout(head)

        self._status_lbl = QLabel("● starting…")
        self._status_lbl.setObjectName("dim")
        outer.addSpacing(2); outer.addWidget(self._status_lbl)
        outer.addSpacing(10)

        # Calibration banner — usually hidden
        self._cal_banner = QFrame()
        self._cal_banner.setObjectName("card")
        cb = QHBoxLayout(self._cal_banner)
        cb.setContentsMargins(16, 10, 16, 10)
        self._cal_text = QLabel("Polylux is calibrating the fans…")
        cf = self._cal_text.font(); cf.setBold(True); self._cal_text.setFont(cf)
        cb.addWidget(self._cal_text, 1)
        self._cal_countdown = QLabel("")
        self._cal_countdown.setObjectName("dim")
        cb.addWidget(self._cal_countdown)
        self._cal_banner.setVisible(False)
        outer.addWidget(self._cal_banner)
        outer.addSpacing(12)

        # Gauges grid
        self._cards_holder = QWidget()
        self._cards_grid = QGridLayout(self._cards_holder)
        self._cards_grid.setSpacing(14)
        self._cards_grid.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(self._cards_holder, 1)
        outer.addStretch(0)

        # First-time discovery + maybe-calibrate
        if not state.snapshot().fans.fans:
            self._discover_and_seed()
        self._rebuild_cards()
        self._maybe_start_calibration()

        # 1 Hz refresh
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._refresh_live)
        self._timer.start(1000)

        state.add_listener(self._rebuild_cards)
        self._cal_tick.connect(self._on_cal_tick)
        self._cal_done.connect(self._on_cal_done)

    # ---- discovery + calibration ----

    def _discover_and_seed(self) -> None:
        pairs = _discover_controllable_fans()
        if not pairs:
            self._status_lbl.setText("● no daemon at 127.0.0.1:8085 — can't discover fans")
            return
        existing = {f.sensor_id for f in self._state.snapshot().fans.fans}
        new_list = list(self._state.snapshot().fans.fans)
        for p in pairs:
            if p["sensor_id"] in existing:
                continue
            new_list.append(FanConfig(
                sensor_id=p["sensor_id"], name=p["name"], mode="auto",
                max_rpm=int(p.get("max_rpm", 0)),
            ))
        if len(new_list) != len(self._state.snapshot().fans.fans):
            self._state.update_device("fans", {"fans": new_list})
            log.info("fans: discovered %d fans (total %d)",
                     len(pairs), len(new_list))

    def _maybe_start_calibration(self) -> None:
        fans = self._state.snapshot().fans.fans
        if not fans:
            return
        if self._cal_thread is not None and self._cal_thread.is_alive():
            return
        uncalibrated = [f for f in fans if f.max_rpm <= 0]
        if not uncalibrated:
            return
        log.info("fans: starting auto-calibration for %d uncalibrated fan(s)",
                 len(uncalibrated))
        self._cal_banner.setVisible(True)
        self._cal_text.setText("Polylux is calibrating the fans…")
        self._cal_countdown.setText(f"{CALIBRATION_SECONDS}s remaining")
        self._cal_thread = _CalibrationThread(
            state=self._state,
            on_tick=self._cal_tick.emit,
            on_done=self._cal_done.emit,
        )
        self._cal_thread.start()

    def _on_cal_tick(self, remaining: int) -> None:
        self._cal_countdown.setText(f"{remaining}s remaining")

    def _on_cal_done(self, maxes: dict) -> None:
        fans = list(self._state.snapshot().fans.fans)
        updated = 0
        for i, fan in enumerate(fans):
            m = int(maxes.get(fan.sensor_id, 0))
            if m > 0 and m != fan.max_rpm:
                kwargs = {**asdict(fan), "max_rpm": m}
                if "curve" in kwargs and isinstance(kwargs["curve"], list):
                    kwargs["curve"] = tuple(tuple(p) for p in kwargs["curve"])
                fans[i] = FanConfig(**kwargs)
                updated += 1
        if updated:
            try:
                self._state.update_device("fans", {"fans": fans})
                log.info("fans: calibration recorded max_rpm for %d fan(s)", updated)
            except Exception:
                log.exception("calibration persist failed")
        self._cal_banner.setVisible(False)
        self._cal_thread = None

    # ---- cards lifecycle ----

    def _rebuild_cards(self) -> None:
        while self._cards_grid.count():
            item = self._cards_grid.takeAt(0)
            w = item.widget()
            if w is not None:
                w.deleteLater()
        self._cards.clear()
        self._fan_to_card.clear()
        fans = self._state.snapshot().fans.fans
        cols = 3
        for i, fan in enumerate(fans):
            card = _FanGaugeCard(self._state, i)
            self._cards_grid.addWidget(card, i // cols, i % cols)
            self._cards.append(card)
            self._fan_to_card[fan.sensor_id] = card

    def _refresh_live(self) -> None:
        rpms = _rpm_snapshot()
        for fan in self._state.snapshot().fans.fans:
            card = self._fan_to_card.get(fan.sensor_id)
            if card is None:
                continue
            # Cards can be deleted underneath us when a state-change
            # listener triggers _rebuild_cards between QTimer ticks.
            # The Python reference in _fan_to_card lingers a beat
            # longer than the underlying C++ QWidget. Swallow that
            # specific race instead of fattening the log with
            # "QWidget deleted" tracebacks.
            try:
                card.set_rpm(rpms.get(fan.sensor_id))
                card._refresh_from_state()
            except RuntimeError as ex:
                if "has been deleted" not in str(ex):
                    raise
        cfg = self._state.snapshot().fans
        active = sum(1 for f in cfg.fans if f.mode != "auto")
        if self._cal_thread is not None and self._cal_thread.is_alive():
            return  # banner has the message
        if not cfg.enabled:
            self._status_lbl.setText("● disabled (BIOS owns fan control)")
        elif not cfg.fans:
            self._status_lbl.setText("● no fans configured")
        else:
            self._status_lbl.setText(
                f"● {len(cfg.fans)} fans · {active} overridden · daemon active"
            )

    def _on_enable_toggled(self, on: bool) -> None:
        try:
            self._state.update_device("fans", {"enabled": on})
        except Exception:
            log.exception("fans ENABLED toggle failed")
