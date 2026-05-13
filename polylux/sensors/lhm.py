"""LibreHardwareMonitor (LHM) WMI bridge.

Reads fan RPMs and temperatures from the LHM Windows service via its
WMI namespace ``root\\LibreHardwareMonitor``. If LHM isn't running, the
class still constructs but ``health()`` reports the problem and the
data accessors return empty defaults — never raises from the data
methods.

LHM project: https://github.com/LibreHardwareMonitor/LibreHardwareMonitor
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Optional


log = logging.getLogger(__name__)

try:
    import wmi  # type: ignore[import-untyped]
except ImportError:  # pragma: no cover
    wmi = None


LHM_NAMESPACE = "root\\LibreHardwareMonitor"


@dataclass
class Fan:
    name: str
    rpm: int


class _FakeSensorList:
    """Tiny stand-in that quacks like the WMI client for tests + offline UI dev."""

    def __init__(self, sensors: list[Any]) -> None:
        self._sensors = sensors

    def Sensor(self) -> list[Any]:  # noqa: N802 (mimicking WMI casing)
        return list(self._sensors)


def _mk_fake_sensor(name: str, value: float, sensor_type: str):
    class _S:
        Name = name
        Value = value
        SensorType = sensor_type
        Identifier = f"/{sensor_type.lower()}/{name}"
    return _S()


# Hand-rolled fake sensor data so UI work can proceed without LHM installed.
FAKE_SENSORS_FOR_TEST = _FakeSensorList([
    _mk_fake_sensor("CPU Package", 23.0, "Temperature"),
    _mk_fake_sensor("GPU Hot Spot", 53.0, "Temperature"),
    _mk_fake_sensor("Motherboard", 31.0, "Temperature"),
    _mk_fake_sensor("CPU Fan", 1240.0, "Fan"),
    _mk_fake_sensor("Chassis #1", 880.0, "Fan"),
    _mk_fake_sensor("Chassis #2", 920.0, "Fan"),
])


class LHMSensors:
    """Thin WMI wrapper around LHM's sensor namespace.

    Pass ``_wmi_namespace`` to inject a fake client in tests; in production
    the constructor builds a real ``wmi.WMI(namespace=LHM_NAMESPACE)``.
    """

    def __init__(self, _wmi_namespace: Optional[Any] = None) -> None:
        self._last_error: Optional[str] = None
        if _wmi_namespace is not None:
            self._w = _wmi_namespace
            return
        if wmi is None:
            self._w = None
            self._last_error = "wmi package not installed"
            return
        try:
            self._w = wmi.WMI(namespace=LHM_NAMESPACE)
        except Exception as ex:
            self._w = None
            self._last_error = str(ex)
            log.info("LHM not available: %s", ex)

    def health(self) -> tuple[bool, Optional[str]]:
        if self._w is None:
            return (False, self._last_error)
        try:
            _ = self._w.Sensor()
            return (True, None)
        except Exception as ex:
            self._last_error = str(ex)
            return (False, str(ex))

    def _sensors_by_type(self, sensor_type: str) -> list[Any]:
        if self._w is None:
            return []
        try:
            return [s for s in self._w.Sensor() if getattr(s, "SensorType", "") == sensor_type]
        except Exception as ex:
            self._last_error = str(ex)
            log.debug("LHM Sensor() failed: %s", ex)
            return []

    def fans(self) -> list[Fan]:
        return [
            Fan(name=str(s.Name), rpm=int(round(float(s.Value or 0))))
            for s in self._sensors_by_type("Fan")
        ]

    def temps(self) -> dict[str, float]:
        return {
            str(s.Name).lower(): float(s.Value)
            for s in self._sensors_by_type("Temperature")
            if s.Value is not None
        }

    @property
    def last_error(self) -> Optional[str]:
        return self._last_error
