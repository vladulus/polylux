"""Dashboard page — landing tab with system telemetry."""
from __future__ import annotations

import logging

from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtWidgets import (
    QFrame, QHBoxLayout, QLabel, QProgressBar, QVBoxLayout, QWidget,
)

from polylux.sensors.lhm import LHMSensors
from polylux.ui.state import ServiceState
from polylux.ui.widgets.gauge import RadialGauge


log = logging.getLogger(__name__)


def _cpu_pct() -> float:
    try:
        import psutil
        return psutil.cpu_percent(interval=None)
    except Exception:
        return 0.0


def _cpu_temp(lhm: LHMSensors) -> float:
    """Try psutil first (works on Linux); fall back to LHM on Windows."""
    try:
        import psutil
        if hasattr(psutil, "sensors_temperatures"):
            temps = psutil.sensors_temperatures()
            for key in ("coretemp", "k10temp", "cpu_thermal"):
                if key in temps and temps[key]:
                    return float(temps[key][0].current)
    except Exception:
        pass
    # Fallback: LHM temps
    temps = lhm.temps()
    for k in ("cpu package", "cpu (tctl/tdie)", "core (tctl/tdie)", "cpu core #1"):
        if k in temps:
            return float(temps[k])
    return 0.0


def _gpu_state() -> tuple[float, float]:
    """Return (temp_c, util_pct). Both 0 if unavailable."""
    try:
        import pynvml
        pynvml.nvmlInit()
        try:
            h = pynvml.nvmlDeviceGetHandleByIndex(0)
            t = pynvml.nvmlDeviceGetTemperature(h, pynvml.NVML_TEMPERATURE_GPU)
            u = pynvml.nvmlDeviceGetUtilizationRates(h)
            return (float(t), float(u.gpu))
        finally:
            pynvml.nvmlShutdown()
    except Exception:
        return (0.0, 0.0)


def _mem_used_gb() -> tuple[float, float]:
    try:
        import psutil
        m = psutil.virtual_memory()
        return (m.used / (1024 ** 3), m.total / (1024 ** 3))
    except Exception:
        return (0.0, 0.0)


class _Card(QFrame):
    def __init__(self, label: str) -> None:
        super().__init__()
        self.setObjectName("card")
        v = QVBoxLayout(self)
        v.setContentsMargins(14, 14, 14, 14)
        self._label = QLabel(label)
        self._label.setObjectName("card_label")
        v.addWidget(self._label)
        self._value = QLabel("—")
        f = self._value.font()
        f.setPointSize(20)
        self._value.setFont(f)
        v.addWidget(self._value)
        self._bar = QProgressBar()
        self._bar.setTextVisible(False)
        self._bar.setRange(0, 100)
        self._bar.setFixedHeight(4)
        v.addWidget(self._bar)

    def set_value(self, text: str, pct: int) -> None:
        self._value.setText(text)
        self._bar.setValue(max(0, min(100, int(pct))))


class DashboardPage(QWidget):
    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        self._state = state
        self._lhm = LHMSensors()

        v = QVBoxLayout(self)
        v.setContentsMargins(26, 22, 26, 22)
        v.setSpacing(0)

        # Header
        h_row = QHBoxLayout()
        t = QLabel("System Overview")
        f = t.font()
        f.setPointSize(16)
        f.setBold(True)
        t.setFont(f)
        h_row.addWidget(t, 1)
        sub = QLabel("Z690 EXTREME")
        sub.setObjectName("dim")
        h_row.addWidget(sub)
        v.addLayout(h_row)
        v.addSpacing(18)

        # Gauges row
        gauges = QHBoxLayout()
        gauges.setSpacing(12)
        self._cpu_temp = RadialGauge(label="CPU", unit="°C", thresholds=(60, 80))
        self._gpu_temp = RadialGauge(label="GPU", unit="°C", thresholds=(65, 85))
        for g in (self._cpu_temp, self._gpu_temp):
            box = QFrame()
            box.setObjectName("card")
            bv = QVBoxLayout(box)
            bv.setContentsMargins(14, 14, 14, 14)
            lbl = QLabel(g.label())
            lbl.setObjectName("card_label")
            bv.addWidget(lbl, alignment=Qt.AlignmentFlag.AlignLeft)
            bv.addWidget(g, alignment=Qt.AlignmentFlag.AlignCenter)
            gauges.addWidget(box, 1)
        v.addLayout(gauges)
        v.addSpacing(12)

        # Cards row (fans + memory)
        cards = QHBoxLayout()
        cards.setSpacing(12)
        self._fan_cards: list[_Card] = []
        for label in ("CPU FAN", "CHASSIS 1", "CHASSIS 2"):
            c = _Card(label)
            cards.addWidget(c, 1)
            self._fan_cards.append(c)
        self._mem_card = _Card("MEMORY")
        cards.addWidget(self._mem_card, 1)
        v.addLayout(cards)
        v.addSpacing(18)

        # Device status row
        dev_row = QHBoxLayout()
        dev_row.setSpacing(10)
        self._device_pills: dict[str, QLabel] = {}
        for key, name in [("matrix", "ANIME MATRIX"), ("oled", "OLED"),
                          ("aura_rgb", "AURA RGB"), ("ryujin_lcd", "RYUJIN")]:
            pill = QFrame()
            pill.setObjectName("card")
            ph = QVBoxLayout(pill)
            ph.setContentsMargins(12, 10, 12, 10)
            n = QLabel(name)
            n.setObjectName("card_label")
            ph.addWidget(n)
            lbl = QLabel("—")
            self._device_pills[key] = lbl
            ph.addWidget(lbl)
            dev_row.addWidget(pill, 1)
        v.addLayout(dev_row)

        # Footer / LHM notice
        self._lhm_notice = QLabel("")
        self._lhm_notice.setObjectName("dim")
        v.addWidget(self._lhm_notice)
        v.addStretch(1)

        # 1 Hz refresh
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._refresh)
        self._timer.start(1000)
        self._refresh()

    def _refresh(self) -> None:
        self._cpu_temp.set_value(_cpu_temp(self._lhm))
        cpu_p = _cpu_pct()
        self._cpu_temp.set_sub_text(f"USAGE {cpu_p:.0f}%")

        gt, gu = _gpu_state()
        self._gpu_temp.set_value(gt)
        self._gpu_temp.set_sub_text(f"USAGE {gu:.0f}%")

        ok, err = self._lhm.health()
        if ok:
            fans = self._lhm.fans()
            for i, card in enumerate(self._fan_cards):
                if i < len(fans):
                    card.set_value(f"{fans[i].rpm} rpm",
                                   pct=int(min(fans[i].rpm / 30, 100)))
                else:
                    card.set_value("—", 0)
            self._lhm_notice.setText("")
        else:
            for card in self._fan_cards:
                card.set_value("—", 0)
            self._lhm_notice.setText(
                "Install LibreHardwareMonitor for fan readings  →  github.com/LibreHardwareMonitor/LibreHardwareMonitor"
            )

        used, total = _mem_used_gb()
        pct = int((used / total) * 100) if total else 0
        self._mem_card.set_value(f"{used:.1f}/{total:.0f}GB", pct)

        cfg = self._state.snapshot()
        self._device_pills["matrix"].setText(f"{cfg.matrix.scene}")
        self._device_pills["oled"].setText(f"{cfg.oled.scene}")
        self._device_pills["aura_rgb"].setText(f"{cfg.aura_rgb.scene}")
        self._device_pills["ryujin_lcd"].setText(f"{cfg.ryujin_lcd.scene}")
