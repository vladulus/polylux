"""Tests for device-page base behavior."""
from pathlib import Path

import pytest

from polylux.config import PolyluxConfig
from polylux.ui.state import ServiceState


@pytest.fixture
def state(tmp_path: Path) -> ServiceState:
    return ServiceState(cfg=PolyluxConfig(), yaml_path=tmp_path / "polylux.yaml")


def test_device_page_sets_active_scene_card(qtbot, qapp, state):
    from polylux.ui.pages.matrix import MatrixPage
    p = MatrixPage(state)
    qtbot.addWidget(p)
    # MatrixConfig defaults: scene="clock"
    assert p.active_scene() == "clock"
    p.set_scene("text")
    assert p.active_scene() == "text"
    assert state.snapshot().matrix.scene == "text"


@pytest.mark.parametrize("page_mod,cls,scenes", [
    ("oled", "OledPage", ("hardware_monitor", "text", "image", "off")),
    ("ryujin", "RyujinPage", ("hardware_monitor", "image", "animation", "off")),
])
def test_every_scene_builds_and_validates(qtbot, qapp, state, page_mod, cls, scenes):
    import importlib
    Page = getattr(importlib.import_module(f"polylux.ui.pages.{page_mod}"), cls)
    p = Page(state)
    qtbot.addWidget(p)
    for scene in scenes:
        p.set_scene(scene)
        assert p.active_scene() == scene


def test_ryujin_fans_get_regular_cards(qtbot, qapp, tmp_path):
    """Pump, pump-head fan and radiator fans are fans.fans entries, so they
    get the same gauge cards (right-click settings) as the board headers."""
    from polylux.config import load
    from polylux.ui.pages.fans import FansPage
    cfgp = tmp_path / "polylux.yaml"
    cfgp.write_text("ryujin_lcd:\n  enabled: true\n", encoding="utf-8")
    st = ServiceState(cfg=load(cfgp), yaml_path=cfgp)
    st.set_frame("ryujin_fans", {"liquid_c": 28.1, "rpm_1": 2760, "rpm_2": 1890,
                                 "aio_rpm": 1350, "aio_pct": 43,
                                 "pump_target": 40, "head_target": 30})
    p = FansPage(st)
    qtbot.addWidget(p)
    assert {"ryujin:pump", "ryujin:head_fan", "ryujin:radiator"} <= set(p._fan_to_card)
    p._refresh_live()
    assert p._fan_to_card["ryujin:pump"]._gauge._value == 2760


def test_fan_cards_survive_config_change_from_worker_thread(qtbot, qapp, tmp_path):
    """Auto Tuning changes the config from its own thread; the cards must be
    rebuilt on the GUI thread, not orphaned (page went empty, 2026-10-25)."""
    import threading
    from polylux.config import load
    from polylux.ui.pages.fans import FansPage
    cfgp = tmp_path / "polylux.yaml"
    cfgp.write_text("ryujin_lcd:\n  enabled: true\n", encoding="utf-8")
    st = ServiceState(cfg=load(cfgp), yaml_path=cfgp)
    p = FansPage(st)
    qtbot.addWidget(p)
    fans = list(st.snapshot().fans.fans)
    t = threading.Thread(target=lambda: st.update_device("fans", {"fans": fans}))
    t.start()
    t.join()
    qtbot.waitUntil(lambda: len(p._fan_to_card) == len(fans))
    assert all(c.parent() is p._cards_holder for c in p._cards)


def test_banner_shows_ryujin_auto_tuning_progress(qtbot, qapp, tmp_path):
    from polylux.config import load
    from polylux.ui.pages.fans import FansPage
    cfgp = tmp_path / "polylux.yaml"
    cfgp.write_text("ryujin_lcd:\n  enabled: true\n", encoding="utf-8")
    st = ServiceState(cfg=load(cfgp), yaml_path=cfgp)
    p = FansPage(st)
    qtbot.addWidget(p)
    frame = {"liquid_c": 30.0, "rpm_1": 2000, "rpm_2": 1500, "aio_rpm": 900,
             "pump_target": 60, "head_target": 30, "aio_pct": 30}
    st.set_frame("ryujin_fans", {**frame, "tuning": "pump 60 %"})
    p._refresh_live()
    assert not p._cal_banner.isHidden() and "pump 60 %" in p._cal_text.text()
    st.set_frame("ryujin_fans", frame)
    p._refresh_live()
    assert p._cal_banner.isHidden()


def test_calibration_full_is_runtime_only(tmp_path, monkeypatch):
    """Calibration drives every fan at full through a runtime override and
    never writes 'full' into the saved config (a kill mid-calibration used
    to leave the board fans on full with max_rpm 0)."""
    from polylux.config import load
    from polylux.ui.pages import fans as fp
    cfgp = tmp_path / "polylux.yaml"
    cfgp.write_text(
        "fans:\n  fans:\n  - sensor_id: /lpc/nct6798d/0/control/0\n    name: A\n"
        "    mode: curve\n", encoding="utf-8")
    st = ServiceState(cfg=load(cfgp), yaml_path=cfgp)
    seen = {}

    def tick(_):
        if not seen:      # first tick = the full-speed phase
            seen["effective"] = [f.mode for f in st.effective_fans()]
            seen["saved"] = [f.mode for f in st.snapshot().fans.fans]

    sid = "/lpc/nct6798d/0/control/0"
    duty_now = {}

    def post(url, s, payload, timeout):
        duty_now[s] = payload["value"]
        return True

    def rpm():
        # Starts from standstill only at 20 %.
        d = duty_now.get(sid, 100)
        return {sid: 1500 if d == 100 else (400 if d >= 20 else 0)}

    monkeypatch.setattr(fp, "CALIBRATION_SECONDS", 1)
    monkeypatch.setattr(fp, "STOP_SECONDS", 1)
    monkeypatch.setattr(fp, "STEP_SECONDS", 1)
    monkeypatch.setattr(fp, "fan_post", post)
    monkeypatch.setattr(fp, "_rpm_snapshot", rpm)
    monkeypatch.setattr(fp, "_max_rpm_snapshot", lambda: {})
    monkeypatch.setattr(fp.time, "sleep", lambda s: None)
    done = []
    fp._CalibrationThread(st, tick, done.append).run()
    assert seen["effective"] == ["full"] and seen["saved"] == ["curve"]
    assert [f.mode for f in st.effective_fans()] == ["curve"]
    assert done == [({sid: 1500}, {sid: 20.0})]


def test_min_duty_raises_a_running_curve_but_not_zero():
    from polylux.config import FanConfig
    from polylux.sensors.fan_control import resolve_duty
    fan = FanConfig(sensor_id="x", mode="curve", temp_source="t", min_duty=25.0,
                    curve=((35.0, 0.0), (50.0, 30.0)))
    assert resolve_duty(fan, {"t": 30.0}) == 0.0       # stop stays stop
    assert resolve_duty(fan, {"t": 43.0}) == 25.0      # 16 % would not start it
    assert resolve_duty(fan, {"t": 50.0}) == 30.0


def test_oled_offers_every_live_sensor(qtbot, qapp, state, monkeypatch):
    """The OLED picker lists the six metrics plus every live sensor."""
    from polylux.ui.pages import oled
    monkeypatch.setattr(oled, "available_sources",
                        lambda: ["cpu_pct", "gpu_pct", "mem_pct", "liquid", "vrm", "rpm:fan #2"])
    p = oled.OledPage(state)
    qtbot.addWidget(p)
    p.set_scene("hardware_monitor")
    p._render_hw_mode("rotate")
    keys = [p._rotate_list.item(i).data(oled.Qt.ItemDataRole.UserRole)
            for i in range(p._rotate_list.count())]
    assert {"cpu_temp", "fan_rpm", "liquid", "vrm", "rpm:fan #2"} <= set(keys)
    p._render_hw_mode("single")
    p._set_metric("vrm")
    assert state.snapshot().oled.value_source == "vrm"
    assert state.snapshot().oled.label == "VRM"


def test_oled_reader_uses_shared_sources_for_new_keys(monkeypatch):
    from polylux.service import main

    class FakeTemps:
        def temps(self):
            return {"vrm": 47.0}

        def fans(self):
            return []

    monkeypatch.setattr(main, "_read_value_source", lambda s: f"legacy:{s}")
    read = main._oled_reader(ServiceState.__new__(ServiceState), FakeTemps())
    assert read("cpu_temp") == "legacy:cpu_temp"
    assert read("vrm") == "47 °C"


def test_shared_reader_ryujin_sources():
    from polylux.sensors.sources import label, make_reader

    class FakeTemps:
        def temps(self):
            return {}

        def fans(self):
            return []

    st = {"liquid_c": 31.44, "rpm_1": 2100, "rpm_2": 1300, "aio_rpm": 990}
    read = make_reader(FakeTemps(), ryujin=lambda: st)
    assert [read(s) for s in ("liquid", "pump_rpm", "head_fan_rpm", "radiator_rpm")] == \
        ["31.4℃", "2100rpm", "1300rpm", "990rpm"]
    assert make_reader(FakeTemps(), ryujin=lambda: None)("pump_rpm") == "--"
    assert label("rpm:fan #4", {"fan #4": "LOWER_L"}) == "LOWER_L RPM"
    assert label("temperature #1") == "MOTHERBOARD"
