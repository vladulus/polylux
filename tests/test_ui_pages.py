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
