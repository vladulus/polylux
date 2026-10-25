"""Hardware-monitor sources shared by the OLED and the Ryujin LCD.

A source is a live LHM temperature name ("cpu package", "vrm", "temperature
#1"…), a fan tach ("rpm:fan #2"), or one of SPECIAL: CPU / GPU / memory load
and the Ryujin's own readings over USB (coolant temperature, pump, pump-head
fan and radiator fan RPM; run_ryujin reads them).
"""
from __future__ import annotations

from typing import Callable, Optional

SPECIAL = ("cpu_pct", "gpu_pct", "mem_pct", "liquid", "pump_rpm", "head_fan_rpm", "radiator_rpm")

# Ryujin read_status() field behind each RPM source.
_RYUJIN_RPM = {"pump_rpm": "rpm_1", "head_fan_rpm": "rpm_2", "radiator_rpm": "aio_rpm"}

# LHM entries that are not readings worth showing (per-core TjMax margins,
# DIMM sensor thresholds and resolution).
_NOISE = ("distance to tjmax", "limit", "resolution")

# Board sensors whose LHM name says nothing; SYSTIN is AC's motherboard sensor.
_RENAMES = {"temperature #1": "MOTHERBOARD"}

_SPECIAL_LABELS = {
    "cpu_pct": "CPU USAGE",
    "gpu_pct": "GPU USAGE",
    "mem_pct": "MEM USAGE",
    "liquid": "LIQUID",
    "pump_rpm": "PUMP RPM",
    "head_fan_rpm": "VRM FAN RPM",
    "radiator_rpm": "RADIATOR RPM",
}


def available() -> list[str]:
    """Every source that has a live reading right now (specials always)."""
    out = list(SPECIAL)
    try:
        from polylux.sensors.lhm import LHMSensors
        s = LHMSensors()
        out += sorted(t for t in s.temps() if not any(n in t for n in _NOISE))
        out += [f"rpm:{f.name.lower()}" for f in s.fans() if f.rpm > 0]
    except Exception:  # noqa: BLE001 — daemon down: specials only
        pass
    return out


def label(source: str, fan_names: Optional[dict[str, str]] = None) -> str:
    """Display name: 'cpu package' -> 'CPU PACKAGE', 'temperature #1' ->
    'MOTHERBOARD', 'rpm:fan #2' -> the fan card's name (fan_names, from
    fan_card_names) or 'FAN #2'."""
    s = source.lower()
    if s in _SPECIAL_LABELS:
        return _SPECIAL_LABELS[s]
    if s.startswith("rpm:"):
        name = (fan_names or {}).get(s[4:])
        return f"{name} RPM".upper() if name else s[4:].upper()
    return _RENAMES.get(s, s).upper()


def fan_card_names(fans) -> dict[str, str]:
    """LHM tach name ('fan #2') -> the user's card name, from fans.fans: a
    board card drives /control/N, whose tach LHM calls 'Fan #N+1'."""
    out = {}
    for f in fans:
        head, sep, idx = f.sensor_id.rpartition("/control/")
        if sep and idx.isdigit() and f.name:
            out[f"fan #{int(idx) + 1}"] = f.name
    return out


def make_reader(temps, ryujin: Optional[Callable[[], Optional[dict]]] = None,
                deg: str = "℃", decimals: int = 1) -> Callable[[str], str]:
    """Return source -> display string for one tick, reading each sensor family
    at most once. `temps` is an LHMSensors; `ryujin` returns the Ryujin's
    read_status() dict (None when it isn't reporting)."""
    import psutil

    cache: dict = {}

    def temps_now() -> dict:
        if "t" not in cache:
            cache["t"] = temps.temps()
        return cache["t"]

    def value(source: str) -> str:
        s = source.lower()
        if s == "liquid" or s in _RYUJIN_RPM:
            if "ryujin" not in cache:
                cache["ryujin"] = ryujin() if ryujin else None
            st = cache["ryujin"]
            if not st:
                return "--"
            if s == "liquid":
                return f"{st['liquid_c']:.{decimals}f}{deg}"
            return f"{st[_RYUJIN_RPM[s]]}rpm"
        if s == "cpu_pct":
            return f"{psutil.cpu_percent():.0f}%"
        if s == "mem_pct":
            return f"{psutil.virtual_memory().percent:.0f}%"
        if s == "gpu_pct":
            from polylux.service.main import _read_value_source
            return _read_value_source("gpu_pct")
        if s.startswith("rpm:"):
            if "fans" not in cache:
                cache["fans"] = {f.name.lower(): f.rpm for f in temps.fans()}
            rpm = cache["fans"].get(s[4:])
            return f"{rpm}rpm" if rpm is not None else "--"
        v = temps_now().get(s)
        return f"{v:.{decimals}f}{deg}" if v is not None else "--"

    return value
