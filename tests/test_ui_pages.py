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
