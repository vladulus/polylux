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
