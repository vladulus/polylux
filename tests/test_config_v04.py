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


def test_oled_dark_when_off_default():
    # AC has no OLED brightness; the S5 switch defaults to dark (§9.2)
    assert OledConfig().dark_when_off is True


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


def test_oled_rotate_takes_any_sensor_but_not_empty():
    """Sources are the six legacy metrics or any live sensor name (same list
    as the Ryujin), so only an empty entry is invalid."""
    o = OledConfig()
    o.hw_mode = "rotate"
    o.rotate_sources = ("cpu_temp", "vrm", "rpm:fan #2")
    o.validate()
    o.rotate_sources = ("cpu_temp", "")
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
    assert cfg.oled.dark_when_off is True
    assert cfg.oled.hw_mode == "single"


def test_yaml_preset_gif_falls_back(tmp_path: Path):
    """preset_gif (chip-internal cycle) is gone; old configs must still load."""
    p = tmp_path / "polylux.yaml"
    p.write_text(textwrap.dedent("""
        oled:
          scene: preset_gif
          preset_index: 2
          brightness: 40
    """), encoding="utf-8")
    cfg = load(p)
    cfg.validate()
    assert cfg.oled.scene == "hardware_monitor"


def test_yaml_ryujin_fields(tmp_path: Path):
    p = tmp_path / "polylux.yaml"
    p.write_text(textwrap.dedent("""
        ryujin_lcd:
          scene: animation
          animation: 2
          portrait: false
        service:
          dark_when_off: false
    """), encoding="utf-8")
    cfg = load(p)
    cfg.validate()
    assert (cfg.ryujin_lcd.scene, cfg.ryujin_lcd.animation, cfg.ryujin_lcd.portrait) == \
        ("animation", 2, False)
    assert cfg.ryujin_lcd.dark_when_off is True
    assert cfg.service.dark_when_off is False



def test_yaml_ryujin_monitor_slots(tmp_path: Path):
    p = tmp_path / "polylux.yaml"
    p.write_text(textwrap.dedent("""
        ryujin_lcd:
          monitor_slots:
          - [CPU, cpu package]
          - [VRM, "temperature #2"]
          - [Water, liquid]
          - [Top fan, "rpm:fan #1"]
    """), encoding="utf-8")
    cfg = load(p)
    cfg.validate()
    assert cfg.ryujin_lcd.monitor_slots[1] == ("VRM", "temperature #2")
    assert cfg.ryujin_lcd.monitor_slots[3] == ("Top fan", "rpm:fan #1")


def test_ryujin_pump_curve_defaults_and_yaml(tmp_path: Path):
    from polylux.config import RyujinLcdConfig
    assert RyujinLcdConfig().pump_mode == "curve"
    assert RyujinLcdConfig().pump_temp_source == "cpu package"
    p = tmp_path / "polylux.yaml"
    p.write_text(textwrap.dedent("""
        ryujin_lcd:
          pump_mode: fixed
          pump_pct: 70
          pump_curve: [[25, 40], [80, 100]]
    """), encoding="utf-8")
    cfg = load(p)
    cfg.validate()
    assert (cfg.ryujin_lcd.pump_mode, cfg.ryujin_lcd.pump_pct) == ("fixed", 70)
    assert cfg.ryujin_lcd.pump_curve == ((25.0, 40.0), (80.0, 100.0))
