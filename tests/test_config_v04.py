"""Tests for v0.4 config schema additions — all additive, default-safe."""
import textwrap
from pathlib import Path

import pytest

from polylux.config import (
    AuraRGBConfig, MatrixConfig, OledConfig, PolyluxConfig, load,
)


def test_matrix_brightness_default():
    assert MatrixConfig().brightness == 100


def test_matrix_scroll_speed_default():
    assert MatrixConfig().scroll_speed == 55


def test_oled_brightness_default():
    assert OledConfig().brightness == 100


def test_oled_font_size_default():
    assert OledConfig().font_size == "medium"


def test_oled_hw_mode_default():
    assert OledConfig().hw_mode == "single"


def test_oled_rotate_sources_default():
    o = OledConfig()
    assert o.rotate_sources == ("cpu_temp", "gpu_temp", "cpu_pct")
    assert isinstance(o.rotate_sources, tuple)


def test_oled_rotate_interval_default():
    assert OledConfig().rotate_interval_s == 3.0


def test_oled_value_sources_includes_new_metrics():
    assert "gpu_pct" in OledConfig.VALUE_SOURCES
    assert "fan_rpm" in OledConfig.VALUE_SOURCES


def test_aura_rgb_brightness_default():
    assert AuraRGBConfig().brightness == 100


def test_oled_hw_mode_rejects_unknown():
    o = OledConfig()
    o.hw_mode = "bogus"
    with pytest.raises(ValueError, match="oled.hw_mode"):
        o.validate()


def test_oled_rotate_rejects_unknown_metric():
    o = OledConfig()
    o.hw_mode = "rotate"
    o.rotate_sources = ("cpu_temp", "not_a_metric")
    with pytest.raises(ValueError, match="rotate_sources"):
        o.validate()


def test_yaml_load_with_new_fields(tmp_path: Path):
    yaml = textwrap.dedent("""
        oled:
          enabled: true
          scene: hardware_monitor
          hw_mode: rotate
          rotate_sources: [cpu_temp, gpu_temp]
          rotate_interval_s: 2.5
          brightness: 80
          font_size: large
        matrix:
          brightness: 50
          scroll_speed: 30
        aura_rgb:
          brightness: 75
    """)
    p = tmp_path / "polylux.yaml"
    p.write_text(yaml, encoding="utf-8")

    cfg = load(p)
    assert cfg.oled.hw_mode == "rotate"
    assert cfg.oled.rotate_sources == ("cpu_temp", "gpu_temp")
    assert cfg.oled.rotate_interval_s == 2.5
    assert cfg.oled.brightness == 80
    assert cfg.oled.font_size == "large"
    assert cfg.matrix.brightness == 50
    assert cfg.matrix.scroll_speed == 30
    assert cfg.aura_rgb.brightness == 75


def test_yaml_load_old_format_still_works(tmp_path: Path):
    """v0.3 YAML without new fields must load with defaults."""
    yaml = textwrap.dedent("""
        oled:
          enabled: true
          scene: hardware_monitor
          value_source: cpu_temp
    """)
    p = tmp_path / "polylux.yaml"
    p.write_text(yaml, encoding="utf-8")
    cfg = load(p)
    assert cfg.oled.brightness == 100
    assert cfg.oled.hw_mode == "single"
