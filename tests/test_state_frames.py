"""Per-device last-frame storage tests on ServiceState."""
from pathlib import Path

import pytest

from polylux.config import PolyluxConfig
from polylux.ui.state import ServiceState


@pytest.fixture
def state(tmp_path: Path) -> ServiceState:
    return ServiceState(cfg=PolyluxConfig(), yaml_path=tmp_path / "polylux.yaml")


def test_last_frame_is_none_by_default(state: ServiceState):
    assert state.last_frame("matrix") is None
    assert state.last_frame("oled") is None
    assert state.last_frame("aura_rgb") is None
    assert state.last_frame("ryujin_lcd") is None


def test_set_frame_stores_and_returns(state: ServiceState):
    state.set_frame("matrix", b"\x00" * 1216)
    assert state.last_frame("matrix") == b"\x00" * 1216


def test_set_frame_invokes_listeners(state: ServiceState):
    seen = []
    state.add_frame_listener("oled", lambda f: seen.append(f))
    state.set_frame("oled", "fake-image")
    assert seen == ["fake-image"]


def test_set_frame_listener_isolated_per_device(state: ServiceState):
    seen_matrix = []
    seen_oled = []
    state.add_frame_listener("matrix", lambda f: seen_matrix.append(f))
    state.add_frame_listener("oled", lambda f: seen_oled.append(f))
    state.set_frame("matrix", "M1")
    state.set_frame("oled", "O1")
    assert seen_matrix == ["M1"]
    assert seen_oled == ["O1"]


def test_set_frame_unknown_device_raises(state: ServiceState):
    with pytest.raises(ValueError, match="unknown device"):
        state.set_frame("nope", b"x")


def test_listener_failure_does_not_break_state(state: ServiceState):
    def bad(_f):
        raise RuntimeError("boom")

    state.add_frame_listener("matrix", bad)
    state.set_frame("matrix", b"x")  # must not raise
    assert state.last_frame("matrix") == b"x"
