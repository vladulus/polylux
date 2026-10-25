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


def test_fans_page_shows_ryujin_card(qtbot, qapp, state):
    from polylux.ui.pages.fans import FansPage
    state.update_device("ryujin_lcd", {"enabled": True})
    state.set_frame("ryujin_fans", {"liquid_c": 28.1, "rpm_1": 2760, "rpm_2": 1890,
                                    "aio_rpm": 1350, "aio_pct": 43, "aio_temp": 38.0,
                                    "pump_pct": 100, "embedded_pct": 30})
    p = FansPage(state)
    qtbot.addWidget(p)
    p._ryujin_card.refresh()
    assert "2760 rpm" in p._ryujin_card._readout.text()
