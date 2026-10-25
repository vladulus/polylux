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
