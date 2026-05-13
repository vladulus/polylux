"""LHM bridge tests — no actual LHM service required (uses fake WMI sensor list)."""
from unittest.mock import MagicMock, patch

import pytest

from polylux.sensors.lhm import Fan, LHMSensors, FAKE_SENSORS_FOR_TEST


def _fake_sensor(name: str, value: float, sensor_type: str, identifier: str = ""):
    s = MagicMock()
    s.Name = name
    s.Value = value
    s.SensorType = sensor_type
    s.Identifier = identifier or f"/{sensor_type.lower()}/{name}"
    return s


def test_health_ok_when_wmi_responds():
    fake_wmi = MagicMock()
    fake_wmi.Sensor.return_value = [_fake_sensor("CPU Package", 23.0, "Temperature")]
    s = LHMSensors(_wmi_namespace=fake_wmi)
    ok, err = s.health()
    assert ok is True and err is None


def test_health_fails_when_wmi_raises():
    fake_wmi = MagicMock()
    fake_wmi.Sensor.side_effect = Exception("namespace not found")
    s = LHMSensors(_wmi_namespace=fake_wmi)
    ok, err = s.health()
    assert ok is False
    assert "namespace not found" in (err or "")


def test_fans_returns_only_fan_sensors():
    fake_wmi = MagicMock()
    fake_wmi.Sensor.return_value = [
        _fake_sensor("CPU Fan", 1240.0, "Fan"),
        _fake_sensor("Chassis #1", 880.0, "Fan"),
        _fake_sensor("CPU Package", 23.0, "Temperature"),
        _fake_sensor("GPU Hot Spot", 53.0, "Temperature"),
    ]
    s = LHMSensors(_wmi_namespace=fake_wmi)
    fans = s.fans()
    assert len(fans) == 2
    assert fans[0].name == "CPU Fan" and fans[0].rpm == 1240
    assert fans[1].name == "Chassis #1" and fans[1].rpm == 880


def test_temps_returns_dict_keyed_by_lowered_name():
    fake_wmi = MagicMock()
    fake_wmi.Sensor.return_value = [
        _fake_sensor("CPU Package", 23.5, "Temperature"),
        _fake_sensor("GPU Hot Spot", 53.0, "Temperature"),
        _fake_sensor("Motherboard", 31.0, "Temperature"),
    ]
    s = LHMSensors(_wmi_namespace=fake_wmi)
    temps = s.temps()
    assert temps == {
        "cpu package": 23.5,
        "gpu hot spot": 53.0,
        "motherboard": 31.0,
    }


def test_init_with_unreachable_service_does_not_raise():
    """Constructing LHMSensors must NEVER raise — health() reports the problem."""
    with patch("polylux.sensors.lhm.wmi") as fake_wmi_mod:
        fake_wmi_mod.WMI.side_effect = Exception("rpc unavailable")
        s = LHMSensors()
        ok, err = s.health()
        assert ok is False
        assert "rpc unavailable" in (err or "")
        # Sane fallbacks:
        assert s.fans() == []
        assert s.temps() == {}


def test_fake_sensors_smoke():
    """FAKE_SENSORS_FOR_TEST is a hand-rolled fixture for offline UI development."""
    s = LHMSensors(_wmi_namespace=FAKE_SENSORS_FOR_TEST)
    assert len(s.fans()) >= 1
    assert "cpu package" in s.temps()
