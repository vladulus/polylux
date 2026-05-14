"""LHM bridge tests — HTTP/JSON variant (LHM 0.9.5+ Remote Web Server).

No actual LHM service required: tests inject a static JSON tree via
``_injected_tree`` so they can run on CI / offline.
"""
import pytest

from polylux.sensors.lhm import LHMSensors, FAKE_TREE_FOR_TEST


def _tree_with(children):
    return {
        "Text": "Sensor",
        "Children": [
            {
                "Text": "Mobo",
                "Children": children,
            },
        ],
    }


def test_health_ok_when_tree_present():
    s = LHMSensors(_injected_tree=FAKE_TREE_FOR_TEST)
    ok, err = s.health()
    assert ok is True and err is None


def test_health_fails_when_url_unreachable():
    s = LHMSensors(url="http://127.0.0.1:1/nope", timeout=0.1)
    ok, err = s.health()
    assert ok is False
    assert err  # some error message


def test_fans_returns_only_fan_sensors():
    s = LHMSensors(_injected_tree=FAKE_TREE_FOR_TEST)
    fans = s.fans()
    names = [f.name for f in fans]
    assert "CPU Fan" in names
    assert "Chassis #1" in names
    assert "Chassis #2" in names
    cpu = next(f for f in fans if f.name == "CPU Fan")
    assert cpu.rpm == 1240


def test_temps_returns_dict_keyed_by_lowered_name():
    s = LHMSensors(_injected_tree=FAKE_TREE_FOR_TEST)
    temps = s.temps()
    assert temps["cpu package"] == 23.0
    assert temps["gpu hot spot"] == 53.0
    assert temps["motherboard"] == 31.0


def test_walks_arbitrary_depth():
    """SensorId paths under deeply nested trees should still surface."""
    tree = _tree_with([
        {"Text": "Group", "Children": [
            {"Text": "Sub", "Children": [
                {"Text": "Fan X", "Value": "1500 RPM",
                 "SensorId": "/x/y/z/fan/9"},
                {"Text": "Temp X", "Value": "42.5 °C",
                 "SensorId": "/x/y/z/temperature/5"},
            ]},
        ]},
    ])
    s = LHMSensors(_injected_tree=tree)
    fans = s.fans()
    temps = s.temps()
    assert any(f.name == "Fan X" and f.rpm == 1500 for f in fans)
    assert temps["temp x"] == 42.5


def test_ignores_zero_rpm_fans_kept_at_zero():
    """Stopped fans (0 RPM) are still reported — useful for ECO mode."""
    tree = _tree_with([
        {"Text": "Fans", "Children": [
            {"Text": "Idle Fan", "Value": "0 RPM", "SensorId": "/lpc/x/fan/0"},
        ]},
    ])
    s = LHMSensors(_injected_tree=tree)
    fans = s.fans()
    assert len(fans) == 1
    assert fans[0].rpm == 0


def test_handles_negative_temperatures():
    tree = _tree_with([
        {"Text": "Temps", "Children": [
            {"Text": "Outside", "Value": "-5.0 °C", "SensorId": "/x/temperature/0"},
        ]},
    ])
    s = LHMSensors(_injected_tree=tree)
    assert s.temps()["outside"] == -5.0
