# Tabbed UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace v0.3 Winamp single-page UI with an Armoury Crate–style sidebar + tabbed layout (Dashboard / Anime Matrix / OLED / Aura RGB / Ryujin LCD / Settings).

**Architecture:** `MainWindow` = frameless 940×640 shell with a 180px sidebar + `QStackedWidget` of 6 pages. Pages read config + status from `ServiceState` and write changes through `state.update_device(...)`. Live previews subscribe to per-device "last rendered frame" stored on `ServiceState`, populated by the scene runners in `polylux/service/main.py`. Fan RPMs come from a `polylux/sensors/lhm.py` WMI bridge to LibreHardwareMonitor (degrades gracefully if absent). Skin system kept — `skin.py` QSS template extended; `claude/skin.json` extended with new layout/color fields.

**Tech Stack:** Python 3.13, PyQt6 (already in `.venv`), `wmi` package (new), `psutil` + `pynvml` (already), pytest + pytest-qt (new).

**Spec:** [2026-05-13-tabbed-ui-redesign-design.md](../specs/2026-05-13-tabbed-ui-redesign-design.md) — read first for context.

---

## File structure

**New files:**
```
polylux/sensors/__init__.py
polylux/sensors/lhm.py                    # LibreHardwareMonitor WMI bridge
polylux/ui/main_window.py                 # replaces window.py
polylux/ui/sidebar.py                     # left nav widget
polylux/ui/pages/__init__.py
polylux/ui/pages/base.py                  # DevicePage abstract
polylux/ui/pages/dashboard.py
polylux/ui/pages/matrix.py
polylux/ui/pages/oled.py
polylux/ui/pages/aura_rgb.py
polylux/ui/pages/ryujin.py
polylux/ui/pages/settings.py
polylux/ui/widgets/__init__.py
polylux/ui/widgets/gauge.py               # RadialGauge
polylux/ui/widgets/scene_card.py
polylux/ui/widgets/slider_row.py
polylux/ui/widgets/seg_button.py
polylux/ui/widgets/color_picker.py
polylux/ui/widgets/live_preview.py        # 4 variants (matrix/oled/aura/ryujin)
tests/test_lhm.py
tests/test_config_v04.py
tests/test_state_frames.py
tests/test_ui_widgets.py
tests/test_ui_pages.py
tests/conftest.py                         # qtbot setup
```

**Modified files:**
```
polylux/config.py                         # add brightness/scroll_speed/font_size/hw_mode/rotate_*
polylux/ui/state.py                       # add per-device last-frame + emit_frame()
polylux/ui/skin.py                        # extend QSS template
polylux/ui/skins/claude/skin.json         # add new layout + color fields
polylux/ui/app.py                         # swap PolyluxWindow → MainWindow
polylux/service/main.py                   # call state.emit_frame() in scene runners
pyproject.toml or requirements.*          # add wmi + pytest-qt
docs/PROJECT_STATE.md                     # §16 add v0.4 milestone after work lands
```

**Deleted files:**
```
polylux/ui/window.py                      # replaced by main_window.py
```

---

## Conventions

- Every code step shows complete, runnable code — no `...` ellipses.
- Tests use `pytest` (already configured at repo root); UI tests use `pytest-qt`'s `qtbot` fixture.
- All committed messages follow the existing convention: short prefix in brackets (`[ui]`, `[config]`, `[sensors]`, `[service]`, `[test]`, `[deps]`), then a one-line summary. Include the Co-Authored-By trailer.
- Run command convention on Vlad's Windows box: `.venv/Scripts/python.exe -m pytest tests/test_X.py -v` (use forward slashes, work from repo root). PowerShell-friendly.
- Before committing UI changes, run `.venv/Scripts/python.exe -m polylux.ui.app` once to make sure the window opens without exception. This is the "smoke test" referenced in steps.

---

## Phase 1 — Foundation (no UI)

### Task 1: Add dependencies (wmi, pytest-qt)

**Files:**
- Modify: `requirements.txt` (or equivalent — check `pyproject.toml`/`setup.py` first; if neither exists, just `pip install` directly and note in PROJECT_STATE)
- Test: n/a (deps install)

- [ ] **Step 1: Check current dep declaration**

Run:
```bash
ls pyproject.toml setup.py requirements.txt 2>/dev/null
```

Expected: one or none of these files exists. If `requirements.txt` exists, edit it. If only `pyproject.toml`, edit `[project.dependencies]`. If neither, this project tracks deps informally — install into the venv and document in PROJECT_STATE.md.

- [ ] **Step 2: Install the new deps into the existing venv**

Run:
```bash
.venv/Scripts/python.exe -m pip install wmi pytest-qt
```

Expected: both install cleanly. `wmi` is pure Python (depends on `pywin32` which is already in the venv). `pytest-qt` brings nothing heavy.

- [ ] **Step 3: Verify imports work**

Run:
```bash
.venv/Scripts/python.exe -c "import wmi, pytestqt; print('ok')"
```

Expected: prints `ok`.

- [ ] **Step 4: Add `tests/conftest.py` with qtbot config**

Create file `tests/conftest.py`:
```python
"""Test setup — ensures PyQt6 widget tests can run headless on CI/Windows."""
import os

# Force offscreen Qt platform so pytest-qt doesn't require an actual display.
os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

import pytest  # noqa: E402
from PyQt6.QtWidgets import QApplication  # noqa: E402


@pytest.fixture(scope="session")
def qapp():
    """Single QApplication shared across all UI tests in the session."""
    app = QApplication.instance() or QApplication([])
    yield app
```

- [ ] **Step 5: Smoke-test that qtbot works**

Create `tests/test_smoke_qt.py`:
```python
def test_qt_starts(qtbot, qapp):
    from PyQt6.QtWidgets import QLabel
    w = QLabel("hello")
    qtbot.addWidget(w)
    assert w.text() == "hello"
```

Run:
```bash
.venv/Scripts/python.exe -m pytest tests/test_smoke_qt.py -v
```

Expected: 1 passed.

- [ ] **Step 6: Commit**

```bash
git add tests/conftest.py tests/test_smoke_qt.py
# If you edited a deps file, add it too:
# git add pyproject.toml  (or requirements.txt)
git commit -m "[deps+test] add wmi + pytest-qt, qtbot conftest for UI tests

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Extend config schema (additive)

**Files:**
- Modify: `polylux/config.py`
- Test: `tests/test_config_v04.py` (new)

- [ ] **Step 1: Write failing tests for the new fields**

Create `tests/test_config_v04.py`:
```python
"""Tests for v0.4 config schema additions — all additive, default-safe."""
import textwrap
from pathlib import Path

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
    import pytest
    o = OledConfig()
    o.hw_mode = "bogus"
    with pytest.raises(ValueError, match="oled.hw_mode"):
        o.validate()


def test_oled_rotate_rejects_unknown_metric():
    import pytest
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
```

- [ ] **Step 2: Run tests, verify they fail**

Run:
```bash
.venv/Scripts/python.exe -m pytest tests/test_config_v04.py -v
```

Expected: many fails with `AttributeError: 'MatrixConfig' object has no attribute 'brightness'` etc.

- [ ] **Step 3: Extend `MatrixConfig`**

In `polylux/config.py`, replace the `MatrixConfig` dataclass body:
```python
@dataclass
class MatrixConfig:
    enabled: bool = False
    scene: str = "clock"
    color: RGB = (0xFF, 0xFF, 0xFF)
    text: str = ""
    rotation: int = 270
    update_seconds: float = 1.0
    brightness: int = 100       # 0-100, applied at frame-build time
    scroll_speed: int = 55      # used in text scene, frames-per-tick analog

    SCENES = ("clock", "text", "fill", "off")

    def validate(self) -> None:
        if self.scene not in self.SCENES:
            raise ValueError(f"matrix.scene must be one of {self.SCENES}, got {self.scene!r}")
        if self.rotation not in (0, 90, 180, 270):
            raise ValueError(f"matrix.rotation must be 0/90/180/270, got {self.rotation}")
        if not 0 <= self.brightness <= 100:
            raise ValueError(f"matrix.brightness must be 0..100, got {self.brightness}")
        if not 1 <= self.scroll_speed <= 100:
            raise ValueError(f"matrix.scroll_speed must be 1..100, got {self.scroll_speed}")
```

- [ ] **Step 4: Extend `OledConfig`**

In `polylux/config.py`, replace the `OledConfig` dataclass body:
```python
@dataclass
class OledConfig:
    enabled: bool = False
    scene: str = "hardware_monitor"
    label: str = "CPU Temp."
    value: str = ""
    value_source: str = "cpu_temp"
    update_seconds: float = 2.0
    preset_index: int = 0
    brightness: int = 100
    font_size: str = "medium"             # small | medium | large
    hw_mode: str = "single"               # single | rotate
    rotate_sources: tuple[str, ...] = ("cpu_temp", "gpu_temp", "cpu_pct")
    rotate_interval_s: float = 3.0

    SCENES = ("hardware_monitor", "text", "preset_gif", "off")
    VALUE_SOURCES = (
        "cpu_temp", "gpu_temp", "cpu_pct", "gpu_pct",
        "mem_pct", "fan_rpm", "static",
    )
    FONT_SIZES = ("small", "medium", "large")
    HW_MODES = ("single", "rotate")

    def validate(self) -> None:
        if self.scene not in self.SCENES:
            raise ValueError(f"oled.scene must be one of {self.SCENES}, got {self.scene!r}")
        if self.scene == "hardware_monitor" and self.value_source not in self.VALUE_SOURCES:
            raise ValueError(f"oled.value_source must be one of {self.VALUE_SOURCES}, got {self.value_source!r}")
        if self.font_size not in self.FONT_SIZES:
            raise ValueError(f"oled.font_size must be one of {self.FONT_SIZES}, got {self.font_size!r}")
        if self.hw_mode not in self.HW_MODES:
            raise ValueError(f"oled.hw_mode must be one of {self.HW_MODES}, got {self.hw_mode!r}")
        if not 0 <= self.brightness <= 100:
            raise ValueError(f"oled.brightness must be 0..100, got {self.brightness}")
        if not 0.5 <= self.rotate_interval_s <= 30.0:
            raise ValueError(f"oled.rotate_interval_s must be 0.5..30.0, got {self.rotate_interval_s}")
        if self.hw_mode == "rotate":
            bad = [s for s in self.rotate_sources if s not in self.VALUE_SOURCES]
            if bad:
                raise ValueError(f"oled.rotate_sources contains unknown metrics: {bad}")
            if not self.rotate_sources:
                raise ValueError("oled.rotate_sources cannot be empty when hw_mode=rotate")
```

- [ ] **Step 5: Extend `AuraRGBConfig`**

In `polylux/config.py`, replace the `AuraRGBConfig` dataclass body:
```python
@dataclass
class AuraRGBConfig:
    enabled: bool = False
    scene: str = "off"
    color: RGB = (0, 0, 0)
    host: str = "127.0.0.1"
    port: int = 6742
    types: tuple[str, ...] = ("MOTHERBOARD",)
    brightness: int = 100             # 0-100, multiplied into RGB before send

    SCENES = ("solid", "off")

    def validate(self) -> None:
        if self.scene not in self.SCENES:
            raise ValueError(f"aura_rgb.scene must be one of {self.SCENES}, got {self.scene!r}")
        if not 0 <= self.brightness <= 100:
            raise ValueError(f"aura_rgb.brightness must be 0..100, got {self.brightness}")
```

- [ ] **Step 6: Extend `load()` parsing**

In `polylux/config.py`, inside the `load()` function, extend the matrix / oled / aura_rgb blocks:

Replace the existing matrix block:
```python
    m = raw.get("matrix") or {}
    cfg.matrix.enabled = bool(m.get("enabled", False))
    cfg.matrix.scene = str(m.get("scene", cfg.matrix.scene))
    if "color" in m:
        cfg.matrix.color = _coerce_color(m["color"])
    cfg.matrix.text = str(m.get("text", cfg.matrix.text))
    cfg.matrix.rotation = int(m.get("rotation", cfg.matrix.rotation))
    cfg.matrix.update_seconds = float(m.get("update_seconds", cfg.matrix.update_seconds))
    cfg.matrix.brightness = int(m.get("brightness", cfg.matrix.brightness))
    cfg.matrix.scroll_speed = int(m.get("scroll_speed", cfg.matrix.scroll_speed))
```

Replace the existing oled block:
```python
    o = raw.get("oled") or {}
    cfg.oled.enabled = bool(o.get("enabled", False))
    cfg.oled.scene = str(o.get("scene", cfg.oled.scene))
    cfg.oled.label = str(o.get("label", cfg.oled.label))
    cfg.oled.value = str(o.get("value", cfg.oled.value))
    cfg.oled.value_source = str(o.get("value_source", cfg.oled.value_source))
    cfg.oled.update_seconds = float(o.get("update_seconds", cfg.oled.update_seconds))
    cfg.oled.preset_index = int(o.get("preset_index", cfg.oled.preset_index))
    cfg.oled.brightness = int(o.get("brightness", cfg.oled.brightness))
    cfg.oled.font_size = str(o.get("font_size", cfg.oled.font_size))
    cfg.oled.hw_mode = str(o.get("hw_mode", cfg.oled.hw_mode))
    if "rotate_sources" in o and isinstance(o["rotate_sources"], list):
        cfg.oled.rotate_sources = tuple(str(s) for s in o["rotate_sources"])
    cfg.oled.rotate_interval_s = float(o.get("rotate_interval_s", cfg.oled.rotate_interval_s))
```

Replace the existing aura block:
```python
    a = raw.get("aura_rgb") or {}
    cfg.aura_rgb.enabled = bool(a.get("enabled", False))
    cfg.aura_rgb.scene = str(a.get("scene", cfg.aura_rgb.scene))
    if "color" in a:
        cfg.aura_rgb.color = _coerce_color(a["color"])
    cfg.aura_rgb.host = str(a.get("host", cfg.aura_rgb.host))
    cfg.aura_rgb.port = int(a.get("port", cfg.aura_rgb.port))
    if "types" in a and isinstance(a["types"], list):
        cfg.aura_rgb.types = tuple(str(t).upper() for t in a["types"])
    cfg.aura_rgb.brightness = int(a.get("brightness", cfg.aura_rgb.brightness))
```

- [ ] **Step 7: Run tests, verify they pass**

Run:
```bash
.venv/Scripts/python.exe -m pytest tests/test_config_v04.py -v
```

Expected: all green.

- [ ] **Step 8: Run the full existing test suite to make sure nothing regressed**

Run:
```bash
.venv/Scripts/python.exe -m pytest -x
```

Expected: green or only failures that pre-existed (verify by checking git log).

- [ ] **Step 9: Commit**

```bash
git add polylux/config.py tests/test_config_v04.py
git commit -m "[config] v0.4 schema: brightness, scroll_speed, font_size, oled rotate mode

Additive only — existing v0.3 YAML loads with defaults.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: LibreHardwareMonitor WMI bridge (`polylux/sensors/lhm.py`)

**Files:**
- Create: `polylux/sensors/__init__.py`
- Create: `polylux/sensors/lhm.py`
- Test: `tests/test_lhm.py`

- [ ] **Step 1: Write failing tests with a mock WMI module**

Create `tests/test_lhm.py`:
```python
"""LHM bridge tests — no actual LHM service required (uses fake WMI sensor list)."""
from unittest.mock import MagicMock, patch

import pytest

from polylux.sensors.lhm import Fan, LHMSensors, FAKE_SENSORS_FOR_TEST


def _fake_sensor(name: str, value: float, sensor_type: str, identifier: str = ""):
    s = MagicMock()
    s.Name = name
    s.Value = value
    s.SensorType = sensor_type
    s.Identifier = identifier or f"/{sensor_type.lower()}/{name}"
    return s


def test_health_ok_when_wmi_responds():
    fake_wmi = MagicMock()
    fake_wmi.Sensor.return_value = [_fake_sensor("CPU Package", 23.0, "Temperature")]
    s = LHMSensors(_wmi_namespace=fake_wmi)
    ok, err = s.health()
    assert ok is True and err is None


def test_health_fails_when_wmi_raises():
    fake_wmi = MagicMock()
    fake_wmi.Sensor.side_effect = Exception("namespace not found")
    s = LHMSensors(_wmi_namespace=fake_wmi)
    ok, err = s.health()
    assert ok is False
    assert "namespace not found" in (err or "")


def test_fans_returns_only_fan_sensors():
    fake_wmi = MagicMock()
    fake_wmi.Sensor.return_value = [
        _fake_sensor("CPU Fan", 1240.0, "Fan"),
        _fake_sensor("Chassis #1", 880.0, "Fan"),
        _fake_sensor("CPU Package", 23.0, "Temperature"),
        _fake_sensor("GPU Hot Spot", 53.0, "Temperature"),
    ]
    s = LHMSensors(_wmi_namespace=fake_wmi)
    fans = s.fans()
    assert len(fans) == 2
    assert fans[0].name == "CPU Fan" and fans[0].rpm == 1240
    assert fans[1].name == "Chassis #1" and fans[1].rpm == 880


def test_temps_returns_dict_keyed_by_lowered_name():
    fake_wmi = MagicMock()
    fake_wmi.Sensor.return_value = [
        _fake_sensor("CPU Package", 23.5, "Temperature"),
        _fake_sensor("GPU Hot Spot", 53.0, "Temperature"),
        _fake_sensor("Motherboard", 31.0, "Temperature"),
    ]
    s = LHMSensors(_wmi_namespace=fake_wmi)
    temps = s.temps()
    assert temps == {
        "cpu package": 23.5,
        "gpu hot spot": 53.0,
        "motherboard": 31.0,
    }


def test_init_with_unreachable_service_does_not_raise():
    """Constructing LHMSensors must NEVER raise — health() reports the problem."""
    with patch("polylux.sensors.lhm.wmi") as fake_wmi_mod:
        fake_wmi_mod.WMI.side_effect = Exception("rpc unavailable")
        s = LHMSensors()
        ok, err = s.health()
        assert ok is False
        assert "rpc unavailable" in (err or "")
        # Sane fallbacks:
        assert s.fans() == []
        assert s.temps() == {}


def test_fake_sensors_smoke():
    """FAKE_SENSORS_FOR_TEST is a hand-rolled fixture for offline UI development."""
    s = LHMSensors(_wmi_namespace=FAKE_SENSORS_FOR_TEST)
    assert len(s.fans()) >= 1
    assert "cpu package" in s.temps()
```

- [ ] **Step 2: Run tests, verify they fail (module doesn't exist)**

Run:
```bash
.venv/Scripts/python.exe -m pytest tests/test_lhm.py -v
```

Expected: `ModuleNotFoundError: No module named 'polylux.sensors'`.

- [ ] **Step 3: Create `polylux/sensors/__init__.py`**

```python
"""External sensor bridges (LibreHardwareMonitor etc.)."""
```

- [ ] **Step 4: Implement `polylux/sensors/lhm.py`**

```python
"""LibreHardwareMonitor (LHM) WMI bridge.

Reads fan RPMs and temperatures from the LHM Windows service via its
WMI namespace ``root\\LibreHardwareMonitor``. If LHM isn't running, the
class still constructs but ``health()`` reports the problem and the
data accessors return empty defaults — never raises from the data
methods.

LHM project: https://github.com/LibreHardwareMonitor/LibreHardwareMonitor
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Optional


log = logging.getLogger(__name__)

try:
    import wmi  # type: ignore[import-untyped]
except ImportError:  # pragma: no cover
    wmi = None


LHM_NAMESPACE = "root\\LibreHardwareMonitor"


@dataclass
class Fan:
    name: str
    rpm: int


class _FakeSensorList:
    """Tiny stand-in that quacks like the WMI client for tests + offline UI dev."""

    def __init__(self, sensors: list[Any]) -> None:
        self._sensors = sensors

    def Sensor(self) -> list[Any]:  # noqa: N802 (mimicking WMI casing)
        return list(self._sensors)


def _mk_fake_sensor(name: str, value: float, sensor_type: str):
    class _S:
        Name = name
        Value = value
        SensorType = sensor_type
        Identifier = f"/{sensor_type.lower()}/{name}"
    return _S()


# Hand-rolled fake sensor data so UI work can proceed without LHM installed.
FAKE_SENSORS_FOR_TEST = _FakeSensorList([
    _mk_fake_sensor("CPU Package", 23.0, "Temperature"),
    _mk_fake_sensor("GPU Hot Spot", 53.0, "Temperature"),
    _mk_fake_sensor("Motherboard", 31.0, "Temperature"),
    _mk_fake_sensor("CPU Fan", 1240.0, "Fan"),
    _mk_fake_sensor("Chassis #1", 880.0, "Fan"),
    _mk_fake_sensor("Chassis #2", 920.0, "Fan"),
])


class LHMSensors:
    """Thin WMI wrapper around LHM's sensor namespace.

    Pass ``_wmi_namespace`` to inject a fake client in tests; in production
    the constructor builds a real ``wmi.WMI(namespace=LHM_NAMESPACE)``.
    """

    def __init__(self, _wmi_namespace: Optional[Any] = None) -> None:
        self._last_error: Optional[str] = None
        if _wmi_namespace is not None:
            self._w = _wmi_namespace
            return
        if wmi is None:
            self._w = None
            self._last_error = "wmi package not installed"
            return
        try:
            self._w = wmi.WMI(namespace=LHM_NAMESPACE)
        except Exception as ex:
            self._w = None
            self._last_error = str(ex)
            log.info("LHM not available: %s", ex)

    def health(self) -> tuple[bool, Optional[str]]:
        if self._w is None:
            return (False, self._last_error)
        try:
            _ = self._w.Sensor()
            return (True, None)
        except Exception as ex:
            self._last_error = str(ex)
            return (False, str(ex))

    def _sensors_by_type(self, sensor_type: str) -> list[Any]:
        if self._w is None:
            return []
        try:
            return [s for s in self._w.Sensor() if getattr(s, "SensorType", "") == sensor_type]
        except Exception as ex:
            self._last_error = str(ex)
            log.debug("LHM Sensor() failed: %s", ex)
            return []

    def fans(self) -> list[Fan]:
        return [
            Fan(name=str(s.Name), rpm=int(round(float(s.Value or 0))))
            for s in self._sensors_by_type("Fan")
        ]

    def temps(self) -> dict[str, float]:
        return {
            str(s.Name).lower(): float(s.Value)
            for s in self._sensors_by_type("Temperature")
            if s.Value is not None
        }

    @property
    def last_error(self) -> Optional[str]:
        return self._last_error
```

- [ ] **Step 5: Run tests, verify they pass**

Run:
```bash
.venv/Scripts/python.exe -m pytest tests/test_lhm.py -v
```

Expected: 6 passed.

- [ ] **Step 6: Commit**

```bash
git add polylux/sensors/ tests/test_lhm.py
git commit -m "[sensors] LibreHardwareMonitor WMI bridge with mock-friendly API

Degrades gracefully if LHM service not running — health() reports state,
fans()/temps() return empty rather than raising. FAKE_SENSORS_FOR_TEST
fixture lets UI development proceed offline.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: ServiceState — per-device last-frame storage

**Files:**
- Modify: `polylux/ui/state.py`
- Test: `tests/test_state_frames.py` (new)

- [ ] **Step 1: Write failing tests**

Create `tests/test_state_frames.py`:
```python
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
```

- [ ] **Step 2: Run tests, verify they fail**

Run:
```bash
.venv/Scripts/python.exe -m pytest tests/test_state_frames.py -v
```

Expected: fails with `AttributeError: 'ServiceState' object has no attribute 'last_frame'`.

- [ ] **Step 3: Extend `ServiceState`**

In `polylux/ui/state.py`, inside `class ServiceState`:

Add to `__init__` after `self._listeners: list[Callable[[], None]] = []`:
```python
        self._last_frames: dict[str, Any] = {
            "matrix": None, "oled": None,
            "ryujin_lcd": None, "aura_rgb": None,
        }
        self._frame_listeners: dict[str, list[Callable[[Any], None]]] = {
            "matrix": [], "oled": [],
            "ryujin_lcd": [], "aura_rgb": [],
        }
```

Add these methods at the end of the class:
```python
    # --- per-device last-frame storage ---

    def last_frame(self, device: str) -> Any:
        with self._lock:
            if device not in self._last_frames:
                raise ValueError(f"unknown device: {device}")
            return self._last_frames[device]

    def set_frame(self, device: str, frame: Any) -> None:
        """Drivers call this after each successful render. Stores the
        frame and notifies any UI subscribers (thread-safe; listeners
        are invoked outside the lock).
        """
        with self._lock:
            if device not in self._last_frames:
                raise ValueError(f"unknown device: {device}")
            self._last_frames[device] = frame
            listeners = list(self._frame_listeners[device])
        for fn in listeners:
            try:
                fn(frame)
            except Exception:
                log.exception("frame listener failed for %s", device)

    def add_frame_listener(self, device: str, fn: Callable[[Any], None]) -> None:
        with self._lock:
            if device not in self._frame_listeners:
                raise ValueError(f"unknown device: {device}")
            self._frame_listeners[device].append(fn)

    def remove_frame_listener(self, device: str, fn: Callable[[Any], None]) -> None:
        with self._lock:
            if fn in self._frame_listeners.get(device, []):
                self._frame_listeners[device].remove(fn)
```

- [ ] **Step 4: Run tests, verify they pass**

Run:
```bash
.venv/Scripts/python.exe -m pytest tests/test_state_frames.py -v
```

Expected: 6 passed.

- [ ] **Step 5: Run full test suite**

Run:
```bash
.venv/Scripts/python.exe -m pytest -x
```

Expected: no new regressions.

- [ ] **Step 6: Commit**

```bash
git add polylux/ui/state.py tests/test_state_frames.py
git commit -m "[state] add per-device last-frame storage + listener API

Drivers call set_frame() after each successful render. UI pages subscribe
via add_frame_listener() to display the exact bytes hardware receives —
single source of truth, no UI/HW drift.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Wire scene runners to emit frames

**Files:**
- Modify: `polylux/service/main.py`

- [ ] **Step 1: Read the current `run_matrix` / `run_oled` / `run_aura_rgb` to confirm their structure**

Already known — see top of plan. Each runner has a render path that builds bytes/text/etc. and sends to hardware. We add `state.set_frame(...)` after the send.

- [ ] **Step 2: Update `run_matrix`**

Replace the `try:` block inside `run_matrix` (the one starting `frame = Frame()`):
```python
        try:
            frame = Frame()
            if mcfg.scene == "clock":
                now = datetime.now().strftime("%H:%M")
                frame.draw_tiny_text(now, color=mcfg.color, rotation=mcfg.rotation)
            elif mcfg.scene == "text":
                frame.draw_tiny_text(mcfg.text, color=mcfg.color, rotation=mcfg.rotation)
            elif mcfg.scene == "fill":
                frame.fill(mcfg.color)
            frame_bytes = frame.to_bytes()
            matrix.send_frame(frame_bytes)
            state.set_frame("matrix", frame_bytes)
            state.mark_update("matrix")
        except Exception as ex:
            state.mark_update("matrix", error=str(ex))
            log.warning("matrix send_frame failed: %s", ex)
```

Also in the `off`/`off_done` branch, set a zeroed frame so the preview clears:
```python
        if mcfg.scene == "off":
            if not off_done:
                try:
                    black = Frame().to_bytes()
                    matrix.send_frame(black)
                    state.set_frame("matrix", black)
                    off_done = True
                except Exception as ex:
                    log.warning("matrix clear failed: %s", ex)
            state.mark_update("matrix")
            stop.wait(mcfg.update_seconds)
            continue
```

- [ ] **Step 3: Update `run_oled` to emit a `(label, value)` tuple as the "frame"**

The OLED has no easy bitmap accessor without re-rendering — for v0.4 we emit a structured `("text", label, value)` tuple. The OLED `LivePreview` widget will render this with PIL at display time using the same fonts as the chip.

Replace the `try:` block inside `run_oled`:
```python
        try:
            if ocfg.scene == "hardware_monitor":
                if ocfg.hw_mode == "rotate" and ocfg.rotate_sources:
                    # Pick next metric in rotation based on monotonic time
                    idx = int(time.time() / max(ocfg.rotate_interval_s, 0.5)) % len(ocfg.rotate_sources)
                    src = ocfg.rotate_sources[idx]
                    value = _read_value_source(src)
                    label = _label_for_source(src)
                else:
                    src = ocfg.value_source
                    value = _read_value_source(src)
                    label = ocfg.label
                oled.set_text(label, value)
                state.set_frame("oled", ("text", label, value))
            elif ocfg.scene == "text":
                text = ocfg.value if ocfg.value else "POLYLUX"
                oled.set_text("", text)
                state.set_frame("oled", ("text", "", text))
            elif ocfg.scene == "preset_gif" and not one_shot_done:
                chip.hid_write(bytes([0xEC, 0x51, 0x10]) + b"\x00" * 62)
                state.set_frame("oled", ("preset_gif", ocfg.preset_index))
                one_shot_done = True
            elif ocfg.scene == "off" and not one_shot_done:
                oled.set_text("", "")
                chip.hid_write(bytes([0xEC, 0x51, 0x15]) + b"\x00" * 62)
                state.set_frame("oled", ("off",))
                one_shot_done = True
            state.mark_update("oled")
        except Exception as ex:
            state.mark_update("oled", error=str(ex))
            log.warning("oled update failed: %s", ex)
```

Add a helper above `run_oled` (right after `_read_value_source`):
```python
def _label_for_source(source: str) -> str:
    return {
        "cpu_temp": "CPU TEMP",
        "gpu_temp": "GPU TEMP",
        "cpu_pct": "CPU",
        "gpu_pct": "GPU",
        "mem_pct": "MEM",
        "fan_rpm": "FAN",
        "static": "",
    }.get(source, source.upper())
```

Also extend `_read_value_source` to handle `gpu_pct` and `fan_rpm`. Add inside the function, before the final `return "?"`:
```python
    if source == "gpu_pct":
        try:
            import pynvml
            pynvml.nvmlInit()
            try:
                h = pynvml.nvmlDeviceGetHandleByIndex(0)
                u = pynvml.nvmlDeviceGetUtilizationRates(h)
                return f"{u.gpu}%"
            finally:
                pynvml.nvmlShutdown()
        except Exception:
            return "?"
    if source == "fan_rpm":
        try:
            from polylux.sensors.lhm import LHMSensors
            fans = LHMSensors().fans()
            if fans:
                return f"{fans[0].rpm}"
            return "n/a"
        except Exception:
            return "?"
```

- [ ] **Step 4: Update `run_aura_rgb`**

Replace the `try:` block inside the `while not stop.is_set()` loop (the inner one that applies scene changes):
```python
            try:
                if acfg.scene != last_scene or acfg.color != last_color:
                    if acfg.scene == "solid":
                        rgb.set_all(acfg.color)
                        controlled_n = len(rgb.controlled_devices)
                        state.set_frame("aura_rgb", [acfg.color] * max(controlled_n, 1))
                    elif acfg.scene == "off":
                        rgb.turn_off()
                        controlled_n = len(rgb.controlled_devices)
                        state.set_frame("aura_rgb", [(0, 0, 0)] * max(controlled_n, 1))
                    last_scene = acfg.scene
                    last_color = acfg.color
                state.mark_update("aura_rgb")
            except Exception as ex:
                state.mark_update("aura_rgb", error=str(ex))
                log.warning("aura_rgb update failed: %s", ex)
```

- [ ] **Step 5: Ryujin — emit a textual readout**

Find where `run_ryujin_lcd` (or similar) is dispatched. It's likely in `main()` around the line `if cfg.ryujin_lcd.enabled and cfg.ryujin_lcd.scene == "hardware_monitor":`. The Ryujin driver mostly just hands the chip back to firmware. For v0.4 we don't need a frame emitter on it — Ryujin tab will show "(firmware-driven, no preview)". Skip Ryujin frame emission. (Note in commit message.)

- [ ] **Step 6: Smoke test — start the service for ~5 seconds, then stop**

This is a real-hardware smoke test on Vlad's box. Run:
```bash
.venv/Scripts/python.exe -m polylux.service --no-kill-asus --headless --log-level INFO
```

Watch the log for ~5 seconds: matrix/oled/aura should report normal scene activity, no exceptions related to frame emission. Press Ctrl-C.

Expected: nothing unusual logged; no "frame listener failed" warnings.

- [ ] **Step 7: Commit**

```bash
git add polylux/service/main.py
git commit -m "[service] scene runners emit last-rendered frame to ServiceState

Matrix: emits the 1216-byte bytes buffer.
OLED: emits (label, value) tuples (and rotation cycles when hw_mode=rotate).
Aura RGB: emits per-zone RGB list.
Ryujin: no emission (firmware-driven).

Adds _label_for_source helper, extends _read_value_source with gpu_pct and
fan_rpm via LibreHardwareMonitor.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 2 — UI widgets

### Task 6: RadialGauge widget

**Files:**
- Create: `polylux/ui/widgets/__init__.py`
- Create: `polylux/ui/widgets/gauge.py`
- Test: `tests/test_ui_widgets.py` (new)

- [ ] **Step 1: Write failing test**

Create `tests/test_ui_widgets.py`:
```python
"""UI widget tests — pure-Qt, no service state, no hardware."""
import pytest


def test_radial_gauge_value(qtbot, qapp):
    from polylux.ui.widgets.gauge import RadialGauge
    g = RadialGauge(label="CPU", unit="°C")
    qtbot.addWidget(g)
    g.set_value(53.0)
    assert g.value() == 53.0
    assert g.label() == "CPU"


def test_radial_gauge_threshold_color(qtbot, qapp):
    from polylux.ui.widgets.gauge import RadialGauge, COOL, WARM, HOT
    g = RadialGauge(label="CPU", unit="°C", thresholds=(60.0, 80.0))
    qtbot.addWidget(g)
    g.set_value(30.0)
    assert g.arc_color() == COOL
    g.set_value(70.0)
    assert g.arc_color() == WARM
    g.set_value(90.0)
    assert g.arc_color() == HOT


def test_radial_gauge_clamps_below_min(qtbot, qapp):
    from polylux.ui.widgets.gauge import RadialGauge
    g = RadialGauge(label="X", unit="", min_value=0, max_value=100)
    qtbot.addWidget(g)
    g.set_value(-10.0)
    assert g.value() == 0
    g.set_value(150.0)
    assert g.value() == 100
```

- [ ] **Step 2: Create `polylux/ui/widgets/__init__.py`**

```python
"""Polylux custom Qt widgets used across pages."""
```

- [ ] **Step 3: Implement `polylux/ui/widgets/gauge.py`**

```python
"""Radial gauge widget — 230° conic arc with center value + label."""
from __future__ import annotations

from typing import Optional

from PyQt6.QtCore import Qt, QRectF, QSize
from PyQt6.QtGui import QPainter, QPen, QColor, QFont
from PyQt6.QtWidgets import QWidget


COOL = "#4caf50"
WARM = "#ffa726"
HOT = "#ef5350"


class RadialGauge(QWidget):
    """230° arc gauge with a numeric reading inside.

    The arc colour switches based on the configured thresholds — green
    while below the first threshold, orange between the two, red above
    the upper one.
    """

    SWEEP_DEG = 230

    def __init__(
        self,
        label: str = "",
        unit: str = "",
        min_value: float = 0.0,
        max_value: float = 100.0,
        thresholds: tuple[float, float] = (60.0, 80.0),
        accent: str = "#C15F3C",
        track_color: str = "#1f1f1f",
        text_color: str = "#FFFFFF",
        sub_color: str = "#666666",
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._label = label
        self._unit = unit
        self._min = float(min_value)
        self._max = float(max_value)
        self._thr_low, self._thr_high = thresholds
        self._value = float(min_value)
        self._sub_text = ""
        self._accent = accent
        self._track_color = track_color
        self._text_color = text_color
        self._sub_color = sub_color
        self.setMinimumSize(140, 140)

    def sizeHint(self) -> QSize:
        return QSize(160, 160)

    def value(self) -> float:
        return self._value

    def label(self) -> str:
        return self._label

    def set_value(self, v: float) -> None:
        self._value = max(self._min, min(self._max, float(v)))
        self.update()

    def set_sub_text(self, text: str) -> None:
        self._sub_text = text
        self.update()

    def set_thresholds(self, low: float, high: float) -> None:
        self._thr_low, self._thr_high = low, high
        self.update()

    def arc_color(self) -> str:
        if self._value >= self._thr_high:
            return HOT
        if self._value >= self._thr_low:
            return WARM
        return COOL

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing, True)

        # Square area centered in the widget.
        side = min(self.width(), self.height())
        x = (self.width() - side) // 2
        y = (self.height() - side) // 2
        pad = side * 0.07
        rect = QRectF(x + pad, y + pad, side - pad * 2, side - pad * 2)

        thickness = side * 0.10
        pen = QPen(QColor(self._track_color))
        pen.setWidthF(thickness)
        pen.setCapStyle(Qt.PenCapStyle.RoundCap)
        p.setPen(pen)
        # Qt arc angles: 16ths of a degree; 0 at 3 o'clock, positive CCW.
        # We want a 230° arc starting at lower-left, sweeping clockwise
        # through the top. Start = 245°, sweep = -230° (i.e. clockwise).
        start_angle_16 = int((245.0) * 16)
        full_sweep_16 = int((-self.SWEEP_DEG) * 16)
        p.drawArc(rect, start_angle_16, full_sweep_16)

        # Filled portion proportional to value
        frac = (self._value - self._min) / max(self._max - self._min, 1e-9)
        frac = max(0.0, min(1.0, frac))
        pen.setColor(QColor(self.arc_color()))
        p.setPen(pen)
        p.drawArc(rect, start_angle_16, int(full_sweep_16 * frac))

        # Center value
        p.setPen(QColor(self._text_color))
        f = QFont("JetBrains Mono", int(side * 0.18))
        if f.pointSize() <= 0:
            f.setPointSize(20)
        f.setWeight(QFont.Weight.Light)
        p.setFont(f)
        text = f"{int(round(self._value))}{self._unit}"
        p.drawText(rect, int(Qt.AlignmentFlag.AlignCenter), text)

        # Sub label under center
        if self._sub_text or self._label:
            p.setPen(QColor(self._sub_color))
            f2 = QFont("Inter", int(side * 0.06))
            if f2.pointSize() <= 0:
                f2.setPointSize(8)
            p.setFont(f2)
            sub_rect = QRectF(rect.x(), rect.y() + rect.height() * 0.58,
                              rect.width(), rect.height() * 0.2)
            p.drawText(sub_rect, int(Qt.AlignmentFlag.AlignCenter),
                       self._sub_text or self._label)

        p.end()
```

- [ ] **Step 4: Run tests, verify they pass**

Run:
```bash
.venv/Scripts/python.exe -m pytest tests/test_ui_widgets.py::test_radial_gauge_value tests/test_ui_widgets.py::test_radial_gauge_threshold_color tests/test_ui_widgets.py::test_radial_gauge_clamps_below_min -v
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add polylux/ui/widgets/__init__.py polylux/ui/widgets/gauge.py tests/test_ui_widgets.py
git commit -m "[ui+widget] RadialGauge — 230° arc with threshold colors

Cool < threshold_low, warm between, hot above threshold_high. Used on
Dashboard for CPU/GPU temps and usage.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: SceneCard widget

**Files:**
- Create: `polylux/ui/widgets/scene_card.py`
- Test: extend `tests/test_ui_widgets.py`

- [ ] **Step 1: Add failing test**

Append to `tests/test_ui_widgets.py`:
```python
def test_scene_card_click_emits_signal(qtbot, qapp):
    from polylux.ui.widgets.scene_card import SceneCard
    c = SceneCard(scene_key="clock", title="CLOCK")
    qtbot.addWidget(c)
    with qtbot.waitSignal(c.clicked_scene, timeout=500) as blocker:
        qtbot.mouseClick(c, Qt_LeftButton())
    assert blocker.args == ["clock"]


def Qt_LeftButton():
    from PyQt6.QtCore import Qt
    return Qt.MouseButton.LeftButton


def test_scene_card_active_property(qtbot, qapp):
    from polylux.ui.widgets.scene_card import SceneCard
    c = SceneCard(scene_key="text", title="TEXT")
    qtbot.addWidget(c)
    assert c.is_active() is False
    c.set_active(True)
    assert c.is_active() is True
    assert c.property("active") == "true"
```

- [ ] **Step 2: Implement `polylux/ui/widgets/scene_card.py`**

```python
"""SceneCard — clickable preview tile for one device scene."""
from __future__ import annotations

from typing import Optional

from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QMouseEvent
from PyQt6.QtWidgets import QFrame, QLabel, QVBoxLayout, QWidget


class SceneCard(QFrame):
    """Vertical card: top preview area + bottom title strip.

    Emits ``clicked_scene(str)`` with the scene_key when left-clicked.
    QSS targets ``QFrame[active="true"]`` for the active state.
    """

    clicked_scene = pyqtSignal(str)

    def __init__(
        self,
        scene_key: str,
        title: str,
        preview: Optional[QWidget] = None,
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._scene_key = scene_key
        self.setObjectName("scene_card")
        self.setProperty("active", "false")
        self.setCursor(Qt.CursorShape.PointingHandCursor)
        self.setFrameShape(QFrame.Shape.NoFrame)

        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(0)

        # Preview area (top)
        self._preview_container = QFrame()
        self._preview_container.setObjectName("scene_card_preview")
        self._preview_container.setMinimumHeight(80)
        pv = QVBoxLayout(self._preview_container)
        pv.setContentsMargins(0, 0, 0, 0)
        pv.setAlignment(Qt.AlignmentFlag.AlignCenter)
        if preview is not None:
            pv.addWidget(preview, alignment=Qt.AlignmentFlag.AlignCenter)
        v.addWidget(self._preview_container)

        # Title strip (bottom)
        self._title = QLabel(title)
        self._title.setObjectName("scene_card_title")
        self._title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self._title.setContentsMargins(0, 8, 0, 8)
        v.addWidget(self._title)

    def scene_key(self) -> str:
        return self._scene_key

    def is_active(self) -> bool:
        return self.property("active") == "true"

    def set_active(self, on: bool) -> None:
        self.setProperty("active", "true" if on else "false")
        # Force QSS re-evaluation
        self.style().unpolish(self)
        self.style().polish(self)
        self.update()

    def mousePressEvent(self, ev: QMouseEvent) -> None:
        if ev.button() == Qt.MouseButton.LeftButton:
            self.clicked_scene.emit(self._scene_key)
            ev.accept()
            return
        super().mousePressEvent(ev)
```

- [ ] **Step 3: Run tests, verify they pass**

Run:
```bash
.venv/Scripts/python.exe -m pytest tests/test_ui_widgets.py -k scene_card -v
```

Expected: 2 passed.

- [ ] **Step 4: Commit**

```bash
git add polylux/ui/widgets/scene_card.py tests/test_ui_widgets.py
git commit -m "[ui+widget] SceneCard — clickable scene tile with active state

Emits clicked_scene(str) so pages can wire to state.update_device(...).
QSS uses [active=true] property selector for highlighting.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: SliderRow widget

**Files:**
- Create: `polylux/ui/widgets/slider_row.py`
- Test: extend `tests/test_ui_widgets.py`

- [ ] **Step 1: Add failing test**

Append to `tests/test_ui_widgets.py`:
```python
def test_slider_row_emits_value_changed(qtbot, qapp):
    from polylux.ui.widgets.slider_row import SliderRow
    s = SliderRow(label="BRIGHTNESS", minimum=0, maximum=100, value=50)
    qtbot.addWidget(s)
    with qtbot.waitSignal(s.value_changed, timeout=500) as blocker:
        s.set_value(75)
    assert blocker.args == [75]
    assert s.value() == 75


def test_slider_row_value_label_updates(qtbot, qapp):
    from polylux.ui.widgets.slider_row import SliderRow
    s = SliderRow(label="X", minimum=0, maximum=100, value=10, fmt="{v}")
    qtbot.addWidget(s)
    s.set_value(42)
    assert "42" in s.value_label_text()
```

- [ ] **Step 2: Implement `polylux/ui/widgets/slider_row.py`**

```python
"""SliderRow — labeled horizontal slider with live numeric readout."""
from __future__ import annotations

from typing import Optional

from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtWidgets import QHBoxLayout, QLabel, QSlider, QVBoxLayout, QWidget


class SliderRow(QWidget):
    """A row with: top label, then a slider + numeric readout below.

    Emits ``value_changed(int)`` on user drag. The readout is formatted
    via ``fmt.format(v=value)``.
    """

    value_changed = pyqtSignal(int)

    def __init__(
        self,
        label: str,
        minimum: int = 0,
        maximum: int = 100,
        value: int = 0,
        fmt: str = "{v}",
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._fmt = fmt

        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(6)

        self._label = QLabel(label)
        self._label.setObjectName("field_label")
        v.addWidget(self._label)

        row = QHBoxLayout()
        row.setContentsMargins(0, 0, 0, 0)
        row.setSpacing(10)

        self._slider = QSlider(Qt.Orientation.Horizontal)
        self._slider.setRange(minimum, maximum)
        self._slider.setValue(value)
        self._slider.valueChanged.connect(self._on_change)
        row.addWidget(self._slider, 1)

        self._readout = QLabel()
        self._readout.setObjectName("slider_readout")
        self._readout.setMinimumWidth(48)
        self._readout.setAlignment(Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignVCenter)
        row.addWidget(self._readout)

        v.addLayout(row)
        self._refresh_readout(value)

    def _on_change(self, v: int) -> None:
        self._refresh_readout(v)
        self.value_changed.emit(v)

    def _refresh_readout(self, v: int) -> None:
        self._readout.setText(self._fmt.format(v=v))

    def value(self) -> int:
        return self._slider.value()

    def set_value(self, v: int) -> None:
        self._slider.setValue(v)

    def value_label_text(self) -> str:
        return self._readout.text()
```

- [ ] **Step 3: Run tests + commit**

```bash
.venv/Scripts/python.exe -m pytest tests/test_ui_widgets.py -k slider_row -v
```

Expected: 2 passed.

```bash
git add polylux/ui/widgets/slider_row.py tests/test_ui_widgets.py
git commit -m "[ui+widget] SliderRow — labeled slider with live value readout

Used for brightness, scroll_speed, rotate_interval, refresh_rate config.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: SegButton widget

**Files:**
- Create: `polylux/ui/widgets/seg_button.py`
- Test: extend `tests/test_ui_widgets.py`

- [ ] **Step 1: Add failing test**

Append to `tests/test_ui_widgets.py`:
```python
def test_seg_button_active_state(qtbot, qapp):
    from polylux.ui.widgets.seg_button import SegButton
    b = SegButton(options=[("0°", 0), ("90°", 90), ("180°", 180), ("270°", 270)],
                  value=270)
    qtbot.addWidget(b)
    assert b.value() == 270


def test_seg_button_click_changes_value(qtbot, qapp):
    from polylux.ui.widgets.seg_button import SegButton
    b = SegButton(options=[("A", "a"), ("B", "b")], value="a")
    qtbot.addWidget(b)
    with qtbot.waitSignal(b.value_changed, timeout=500) as blocker:
        b.set_value("b")
    assert blocker.args == ["b"]
    assert b.value() == "b"
```

- [ ] **Step 2: Implement `polylux/ui/widgets/seg_button.py`**

```python
"""SegButton — segmented button group (rotation 0/90/180/270, font S/M/L)."""
from __future__ import annotations

from typing import Any, Optional, Sequence

from PyQt6.QtCore import pyqtSignal
from PyQt6.QtWidgets import QHBoxLayout, QPushButton, QWidget


class SegButton(QWidget):
    """N mutually-exclusive segments. Emits ``value_changed(object)`` with
    the selected value when the user clicks a different segment.
    """

    value_changed = pyqtSignal(object)

    def __init__(
        self,
        options: Sequence[tuple[str, Any]],
        value: Any = None,
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._buttons: list[QPushButton] = []
        self._values: list[Any] = []

        h = QHBoxLayout(self)
        h.setContentsMargins(0, 0, 0, 0)
        h.setSpacing(0)

        for label, val in options:
            btn = QPushButton(label)
            btn.setObjectName("seg_button")
            btn.setCheckable(True)
            btn.setProperty("on", "false")
            btn.clicked.connect(lambda _checked, v=val: self.set_value(v))
            h.addWidget(btn, 1)
            self._buttons.append(btn)
            self._values.append(val)

        if value is None and self._values:
            value = self._values[0]
        self._value = value
        self._sync_visual()

    def _sync_visual(self) -> None:
        for btn, val in zip(self._buttons, self._values):
            on = (val == self._value)
            btn.setChecked(on)
            btn.setProperty("on", "true" if on else "false")
            btn.style().unpolish(btn)
            btn.style().polish(btn)

    def value(self) -> Any:
        return self._value

    def set_value(self, v: Any) -> None:
        if v == self._value:
            return
        if v not in self._values:
            return
        self._value = v
        self._sync_visual()
        self.value_changed.emit(v)
```

- [ ] **Step 3: Run + commit**

```bash
.venv/Scripts/python.exe -m pytest tests/test_ui_widgets.py -k seg_button -v
```

Expected: 2 passed.

```bash
git add polylux/ui/widgets/seg_button.py tests/test_ui_widgets.py
git commit -m "[ui+widget] SegButton — segmented button group

Used for matrix rotation, OLED font_size, OLED hw_mode toggles.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: ColorPicker widget (HSV wheel + hex input + presets)

**Files:**
- Create: `polylux/ui/widgets/color_picker.py`
- Test: extend `tests/test_ui_widgets.py`

For v0.4 keep it simple: a `QColorDialog` launched from a swatch button, with a hex input field and a row of preset swatches. Full custom HSV wheel painting is deferred to v0.5 — `QColorDialog` is already polished and themed.

- [ ] **Step 1: Add failing test**

Append:
```python
def test_color_picker_set_color_updates_hex(qtbot, qapp):
    from polylux.ui.widgets.color_picker import ColorPicker
    c = ColorPicker(color=(193, 95, 60))
    qtbot.addWidget(c)
    assert c.hex_text() == "#C15F3C"
    c.set_color((0, 255, 0))
    assert c.hex_text() == "#00FF00"


def test_color_picker_preset_emits_signal(qtbot, qapp):
    from polylux.ui.widgets.color_picker import ColorPicker
    c = ColorPicker(color=(0, 0, 0), presets=[(255, 0, 0), (0, 255, 0)])
    qtbot.addWidget(c)
    with qtbot.waitSignal(c.color_changed, timeout=500) as blocker:
        c._on_preset_clicked(0)
    assert blocker.args == [(255, 0, 0)]
```

- [ ] **Step 2: Implement `polylux/ui/widgets/color_picker.py`**

```python
"""ColorPicker — swatch button + hex input + preset row.

The big swatch opens a QColorDialog for visual picking. Hex input lets
the user type any RGB. Presets are quick-click swatches for the 6-8
common colors.
"""
from __future__ import annotations

from typing import Optional, Sequence

from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QColor
from PyQt6.QtWidgets import (
    QColorDialog, QHBoxLayout, QLabel, QLineEdit, QPushButton, QVBoxLayout, QWidget,
)


RGB = tuple[int, int, int]

DEFAULT_PRESETS: Sequence[RGB] = (
    (255, 255, 255), (193,  95,  60), (255,   0,   0),
    (255, 165,   0), (255, 255,   0), (  0, 255,   0),
    (  0, 200, 255), (170,   0, 255),
)


class ColorPicker(QWidget):
    """Emits ``color_changed((r,g,b))`` when the colour changes from any
    of: swatch dialog, hex input commit, or preset click.
    """

    color_changed = pyqtSignal(tuple)

    def __init__(
        self,
        color: RGB = (255, 255, 255),
        presets: Sequence[RGB] = DEFAULT_PRESETS,
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._color: RGB = tuple(color)  # type: ignore[assignment]
        self._presets = list(presets)

        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(10)

        row1 = QHBoxLayout()
        row1.setSpacing(10)
        self._swatch = QPushButton()
        self._swatch.setObjectName("color_swatch")
        self._swatch.setFixedSize(48, 48)
        self._swatch.clicked.connect(self._open_dialog)
        row1.addWidget(self._swatch)

        self._hex = QLineEdit()
        self._hex.setObjectName("hex_input")
        self._hex.setMaxLength(7)
        self._hex.editingFinished.connect(self._on_hex_commit)
        row1.addWidget(self._hex, 1)
        v.addLayout(row1)

        # Presets row
        self._preset_row = QHBoxLayout()
        self._preset_row.setSpacing(6)
        for i, p in enumerate(self._presets):
            btn = QPushButton()
            btn.setObjectName("color_preset")
            btn.setFixedSize(22, 22)
            btn.setStyleSheet(f"background-color: rgb({p[0]},{p[1]},{p[2]}); border-radius: 4px;")
            btn.clicked.connect(lambda _ck, idx=i: self._on_preset_clicked(idx))
            self._preset_row.addWidget(btn)
        self._preset_row.addStretch(1)
        v.addLayout(self._preset_row)

        self._refresh()

    def color(self) -> RGB:
        return self._color

    def set_color(self, c: RGB) -> None:
        c = (int(c[0]) & 0xFF, int(c[1]) & 0xFF, int(c[2]) & 0xFF)
        if c == self._color:
            return
        self._color = c
        self._refresh()
        self.color_changed.emit(c)

    def hex_text(self) -> str:
        return self._hex.text()

    def _refresh(self) -> None:
        r, g, b = self._color
        self._swatch.setStyleSheet(
            f"background-color: rgb({r},{g},{b}); border: 1px solid #2a2a2a; border-radius: 6px;"
        )
        self._hex.blockSignals(True)
        self._hex.setText(f"#{r:02X}{g:02X}{b:02X}")
        self._hex.blockSignals(False)

    def _open_dialog(self) -> None:
        r, g, b = self._color
        col = QColorDialog.getColor(QColor(r, g, b), self, "Pick a colour")
        if col.isValid():
            self.set_color((col.red(), col.green(), col.blue()))

    def _on_hex_commit(self) -> None:
        text = self._hex.text().strip().lstrip("#")
        if len(text) != 6:
            self._refresh()
            return
        try:
            r = int(text[0:2], 16)
            g = int(text[2:4], 16)
            b = int(text[4:6], 16)
        except ValueError:
            self._refresh()
            return
        self.set_color((r, g, b))

    def _on_preset_clicked(self, idx: int) -> None:
        if 0 <= idx < len(self._presets):
            self.set_color(self._presets[idx])
```

- [ ] **Step 3: Run + commit**

```bash
.venv/Scripts/python.exe -m pytest tests/test_ui_widgets.py -k color_picker -v
```

Expected: 2 passed.

```bash
git add polylux/ui/widgets/color_picker.py tests/test_ui_widgets.py
git commit -m "[ui+widget] ColorPicker — swatch + hex input + 8 preset swatches

QColorDialog for visual picking. Hex input round-trips. Preset row for
quick access to common colors (white, claude orange, R/O/Y/G/B/V).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: LivePreview widgets (4 variants)

**Files:**
- Create: `polylux/ui/widgets/live_preview.py`
- Test: extend `tests/test_ui_widgets.py`

- [ ] **Step 1: Add failing tests**

Append:
```python
def test_matrix_preview_paints_without_error(qtbot, qapp):
    from polylux.ui.widgets.live_preview import MatrixLivePreview
    w = MatrixLivePreview()
    qtbot.addWidget(w)
    # 1216-byte buffer of zeros = black frame
    w.set_frame(b"\x00" * 1216)
    assert w.last_frame() == b"\x00" * 1216


def test_oled_preview_renders_text_frame(qtbot, qapp):
    from polylux.ui.widgets.live_preview import OledLivePreview
    w = OledLivePreview()
    qtbot.addWidget(w)
    w.set_frame(("text", "CPU TEMP", "23°C"))
    assert w.last_frame() == ("text", "CPU TEMP", "23°C")


def test_aura_preview_handles_list(qtbot, qapp):
    from polylux.ui.widgets.live_preview import AuraLivePreview
    w = AuraLivePreview()
    qtbot.addWidget(w)
    w.set_frame([(193, 95, 60), (0, 0, 0), (255, 255, 255)])
    assert w.last_frame() == [(193, 95, 60), (0, 0, 0), (255, 255, 255)]
```

- [ ] **Step 2: Implement `polylux/ui/widgets/live_preview.py`**

```python
"""Live-preview widgets — show the exact data the driver last sent."""
from __future__ import annotations

from typing import Any, Optional

from PyQt6.QtCore import Qt, QRectF, QSize
from PyQt6.QtGui import QColor, QFont, QImage, QPainter, QPen
from PyQt6.QtWidgets import QWidget


class _BaseLivePreview(QWidget):
    """Stores the last frame; subclasses override paintEvent()."""

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self._last: Any = None
        self.setMinimumHeight(80)

    def set_frame(self, frame: Any) -> None:
        self._last = frame
        self.update()

    def last_frame(self) -> Any:
        return self._last


class MatrixLivePreview(_BaseLivePreview):
    """Renders the AniMe Matrix 1216-byte buffer as a 33×32-ish dot grid.

    For v0.4 we render a compact representation — each byte becomes a
    tiny coloured rect on a fixed grid. The exact LED layout is
    non-rectangular but the impression is enough for the user.
    """

    GRID_W = 38
    GRID_H = 32
    SCALE = 6

    def sizeHint(self) -> QSize:
        return QSize(self.GRID_W * self.SCALE, self.GRID_H * self.SCALE)

    def paintEvent(self, _ev) -> None:
        if not self.isVisible():
            return
        p = QPainter(self)
        p.fillRect(self.rect(), QColor("#000"))
        if not self._last:
            p.end()
            return
        buf: bytes = self._last
        # 1216 bytes — render row by row, 1 byte = 1 LED brightness.
        # Skip first 8 bytes (likely header pad) — same heuristic the
        # mockup used; tune later when LUT consulted.
        body = buf[8:8 + self.GRID_W * self.GRID_H] if len(buf) >= 8 + self.GRID_W * self.GRID_H else buf
        for i, v in enumerate(body):
            if v == 0:
                continue
            x = (i % self.GRID_W) * self.SCALE
            y = (i // self.GRID_W) * self.SCALE
            p.fillRect(x, y, self.SCALE - 1, self.SCALE - 1,
                       QColor(int(v), int(v * 0.5), int(v * 0.25)))
        p.end()


class OledLivePreview(_BaseLivePreview):
    """Renders the OLED's current (label, value) tuple in white on black.

    256×64 native; widget renders at 2x scale for legibility.
    """

    WIDTH = 256
    HEIGHT = 64
    SCALE = 2

    def sizeHint(self) -> QSize:
        return QSize(self.WIDTH * self.SCALE, self.HEIGHT * self.SCALE)

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing, False)
        p.fillRect(self.rect(), QColor("#000"))
        if not self._last:
            p.end()
            return
        kind = self._last[0]
        p.setPen(QColor("#FFFFFF"))
        if kind == "text":
            _, label, value = self._last
            # Label small, top-left
            f1 = QFont("JetBrains Mono", 9)
            p.setFont(f1)
            p.drawText(8, 18, label or "")
            # Value big, centered vertically
            f2 = QFont("JetBrains Mono", 22)
            f2.setWeight(QFont.Weight.Light)
            p.setFont(f2)
            r = QRectF(8, 22, self.width() - 16, self.height() - 24)
            p.drawText(r, int(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignVCenter),
                       value or "")
        elif kind == "preset_gif":
            idx = self._last[1] if len(self._last) > 1 else 0
            p.setFont(QFont("JetBrains Mono", 12))
            p.drawText(self.rect(), int(Qt.AlignmentFlag.AlignCenter),
                       f"▶ preset_gif[{idx}]")
        elif kind == "off":
            p.setFont(QFont("JetBrains Mono", 11))
            p.setPen(QColor("#444"))
            p.drawText(self.rect(), int(Qt.AlignmentFlag.AlignCenter), "— off —")
        p.end()


class AuraLivePreview(_BaseLivePreview):
    """Renders the per-zone RGB list as a horizontal strip of swatches.

    Each entry → one rectangle in a row. Spaces denote zone boundaries
    in MB layout (we don't have geometry — fixed-width strip suffices).
    """

    def sizeHint(self) -> QSize:
        return QSize(240, 64)

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        p.fillRect(self.rect(), QColor("#0a0a0a"))
        zones = self._last or []
        if not zones:
            p.setPen(QColor("#444"))
            p.setFont(QFont("Inter", 9))
            p.drawText(self.rect(), int(Qt.AlignmentFlag.AlignCenter), "no zones")
            p.end()
            return
        w = self.width() / max(len(zones), 1)
        for i, (r, g, b) in enumerate(zones):
            p.fillRect(int(i * w) + 2, 8, int(w) - 4, self.height() - 16,
                       QColor(int(r), int(g), int(b)))
        p.end()


class RyujinLivePreview(_BaseLivePreview):
    """Stub — firmware-driven, no preview content for v0.4."""

    def sizeHint(self) -> QSize:
        return QSize(240, 64)

    def paintEvent(self, _ev) -> None:
        p = QPainter(self)
        p.fillRect(self.rect(), QColor("#0a0a0a"))
        p.setPen(QColor("#666"))
        p.setFont(QFont("Inter", 10))
        p.drawText(self.rect(), int(Qt.AlignmentFlag.AlignCenter),
                   "firmware-driven — no preview")
        p.end()
```

- [ ] **Step 3: Run + commit**

```bash
.venv/Scripts/python.exe -m pytest tests/test_ui_widgets.py -k preview -v
```

Expected: 3 passed.

```bash
git add polylux/ui/widgets/live_preview.py tests/test_ui_widgets.py
git commit -m "[ui+widget] Live-preview widgets per device

MatrixLivePreview: 1216-byte buffer → 38×32 dot grid.
OledLivePreview: (kind, label, value) tuples → 256×64 rendering.
AuraLivePreview: per-zone RGB list → swatch strip.
RyujinLivePreview: stub (firmware-driven).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 3 — Shell

### Task 12: Extend skin loader (QSS template + claude/skin.json)

**Files:**
- Modify: `polylux/ui/skin.py`
- Modify: `polylux/ui/skins/claude/skin.json`

- [ ] **Step 1: Extend `claude/skin.json` with the new layout + colors**

Replace the file contents:
```json
{
  "name": "Claude",
  "author": "Claude",
  "description": "Default Polylux skin — dark, minimal, Claude orange accent.",
  "version": "2.0",

  "window": {
    "width": 940,
    "height": 640,
    "frameless": true,
    "always_on_top_available": true
  },

  "colors": {
    "bg": "#0d0d0d",
    "bg_alt": "#0a0a0a",
    "surface": "#161616",
    "border": "#242424",
    "text": "#e6e6e6",
    "text_dim": "#888888",
    "accent": "#C15F3C",
    "accent_dim": "#7a3d27",
    "ok": "#4caf50",
    "warn": "#ffa726",
    "err": "#ef5350",
    "sidebar_bg": "#0a0a0a",
    "sidebar_border": "#1f1f1f",
    "sidebar_active_bg": "#181818",
    "card_bg": "#161616",
    "card_border": "#242424",
    "scene_card_active_bg": "#1a120e"
  },

  "fonts": {
    "header": ["JetBrains Mono", "Consolas", "monospace"],
    "body":   ["Inter", "Segoe UI", "sans-serif"],
    "header_size_px": 18,
    "body_size_px": 13,
    "mono_size_px": 12,
    "label_size_px": 10
  },

  "layout": {
    "padding": 20,
    "row_gap": 12,
    "border_radius_px": 8,
    "titlebar_height": 36,
    "sidebar_width": 180,
    "main_padding_x": 26,
    "main_padding_y": 22,
    "card_radius": 8
  }
}
```

- [ ] **Step 2: Extend `skin.py` — add the QSS for new selectors**

In `polylux/ui/skin.py`, in `Skin.qss()`, append to the `base` string (just before the `# Append per-skin overrides if present.` line):

```python
        base += f"""
        /* --- v0.4 tabbed UI additions --- */
        #sidebar {{
            background-color: {c.get('sidebar_bg', c.get('bg_alt', '#0a0a0a'))};
            border-right: 1px solid {c.get('sidebar_border', c.get('border', '#1f1f1f'))};
        }}
        #sidebar QLabel#brand {{
            color: {c.get('accent', '#C15F3C')};
            font-family: "{header_family}";
            font-weight: 700;
            font-size: 14px;
            padding: 18px 18px 12px 18px;
            letter-spacing: 3px;
        }}
        #sidebar QPushButton {{
            background: transparent;
            border: none;
            border-left: 3px solid transparent;
            text-align: left;
            padding: 10px 14px 10px 18px;
            color: {c.get('text_dim', '#888')};
            font-family: "{body_family}";
            font-size: 13px;
        }}
        #sidebar QPushButton:hover {{
            color: {c.get('text', '#fff')};
            background-color: {c.get('sidebar_active_bg', '#181818')};
        }}
        #sidebar QPushButton[active="true"] {{
            color: {c.get('text', '#fff')};
            border-left: 3px solid {c.get('accent', '#C15F3C')};
            background-color: {c.get('sidebar_active_bg', '#181818')};
        }}
        #sidebar QLabel#sidebar_foot {{
            color: {c.get('text_dim', '#444')};
            font-size: 10px;
            padding: 8px 18px;
            letter-spacing: 1px;
        }}

        QFrame#scene_card {{
            background-color: {c.get('card_bg', '#161616')};
            border: 1px solid {c.get('card_border', '#242424')};
            border-radius: {l.get('card_radius', 8)}px;
        }}
        QFrame#scene_card[active="true"] {{
            border-color: {c.get('accent', '#C15F3C')};
            background-color: {c.get('scene_card_active_bg', '#1a120e')};
        }}
        QFrame#scene_card_preview {{
            background-color: {c.get('bg_alt', '#0a0a0a')};
            border-bottom: 1px solid {c.get('card_border', '#1f1f1f')};
        }}
        QLabel#scene_card_title {{
            color: {c.get('text_dim', '#888')};
            font-size: 12px;
            letter-spacing: 1px;
        }}
        QFrame#scene_card[active="true"] QLabel#scene_card_title {{
            color: {c.get('accent', '#C15F3C')};
            font-weight: 600;
        }}

        QFrame#card {{
            background-color: {c.get('card_bg', '#161616')};
            border: 1px solid {c.get('card_border', '#242424')};
            border-radius: {l.get('card_radius', 8)}px;
        }}
        QLabel#card_label {{
            color: {c.get('text_dim', '#666')};
            font-size: {self.font_size('label')}px;
            letter-spacing: 2px;
            font-weight: 600;
        }}

        QPushButton#seg_button {{
            background: transparent;
            color: {c.get('text_dim', '#888')};
            border: 1px solid {c.get('card_border', '#242424')};
            border-right: none;
            border-radius: 0;
            padding: 9px 0;
            font-family: "{self.font_family('header')}";
            font-size: 12px;
        }}
        QPushButton#seg_button:first-child {{ border-top-left-radius: 6px; border-bottom-left-radius: 6px; }}
        QPushButton#seg_button:last-child  {{ border-right: 1px solid {c.get('card_border', '#242424')}; border-top-right-radius: 6px; border-bottom-right-radius: 6px; }}
        QPushButton#seg_button[on="true"] {{
            background-color: {c.get('accent', '#C15F3C')};
            color: white;
            font-weight: 600;
            border-color: {c.get('accent', '#C15F3C')};
        }}

        QLabel#field_label {{
            color: {c.get('text_dim', '#888')};
            font-size: {self.font_size('label')}px;
            letter-spacing: 1px;
        }}
        QLabel#slider_readout {{
            color: {c.get('text', '#fff')};
            font-family: "{self.font_family('header')}";
            font-size: 13px;
        }}

        QFrame#scene_card[active="true"] QLabel {{
            color: {c.get('text', '#fff')};
        }}
        """
```

Also add a `label_size_px` accessor — extend the `font_size()` method to accept the new role (no change needed, the existing implementation reads `{role}_size_px`).

- [ ] **Step 3: Smoke-test that the skin still loads**

Run:
```bash
.venv/Scripts/python.exe -c "from polylux.ui.skin import load_skin; s = load_skin('claude'); print('w=', s.width, 'h=', s.height); print(s.qss()[:200])"
```

Expected: prints `w= 940 h= 640` and shows QSS preamble.

- [ ] **Step 4: Commit**

```bash
git add polylux/ui/skin.py polylux/ui/skins/claude/skin.json
git commit -m "[ui+skin] extend skin.json + QSS for sidebar, scene_card, cards, seg buttons

claude skin bumped to v2.0 with 940x640 window. All new selectors fall
back gracefully when colors/layout fields absent.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Sidebar widget

**Files:**
- Create: `polylux/ui/sidebar.py`
- Test: extend `tests/test_ui_widgets.py`

- [ ] **Step 1: Add failing test**

Append to `tests/test_ui_widgets.py`:
```python
def test_sidebar_emits_nav_changed(qtbot, qapp):
    from polylux.ui.sidebar import Sidebar
    sb = Sidebar(items=[("dash", "Dashboard"), ("matrix", "Anime Matrix")])
    qtbot.addWidget(sb)
    with qtbot.waitSignal(sb.nav_changed, timeout=500) as blocker:
        sb.set_active("matrix")
    assert blocker.args == ["matrix"]


def test_sidebar_default_active_is_first(qtbot, qapp):
    from polylux.ui.sidebar import Sidebar
    sb = Sidebar(items=[("a", "A"), ("b", "B")])
    qtbot.addWidget(sb)
    assert sb.active() == "a"
```

- [ ] **Step 2: Implement `polylux/ui/sidebar.py`**

```python
"""Left navigation sidebar — vertical list of QPushButtons.

Each item has a key (used by MainWindow to switch the stacked widget
index) and a display label. The active item has the `active="true"`
property for QSS styling.
"""
from __future__ import annotations

from typing import Optional, Sequence

from PyQt6.QtCore import pyqtSignal
from PyQt6.QtWidgets import QLabel, QPushButton, QVBoxLayout, QWidget


class Sidebar(QWidget):
    nav_changed = pyqtSignal(str)

    def __init__(
        self,
        items: Sequence[tuple[str, str]],
        brand_text: str = "POLYLUX",
        footer_text: str = "v0.4-dev",
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self.setObjectName("sidebar")
        self._buttons: dict[str, QPushButton] = {}
        self._active: Optional[str] = None

        v = QVBoxLayout(self)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(0)

        brand = QLabel(brand_text)
        brand.setObjectName("brand")
        v.addWidget(brand)

        for key, label in items:
            btn = QPushButton(label)
            btn.setProperty("active", "false")
            btn.clicked.connect(lambda _ck, k=key: self.set_active(k))
            v.addWidget(btn)
            self._buttons[key] = btn

        v.addStretch(1)

        foot = QLabel(footer_text)
        foot.setObjectName("sidebar_foot")
        v.addWidget(foot)

        if items:
            self.set_active(items[0][0])

    def active(self) -> Optional[str]:
        return self._active

    def set_active(self, key: str) -> None:
        if key not in self._buttons:
            return
        if key == self._active:
            return
        for k, btn in self._buttons.items():
            on = (k == key)
            btn.setProperty("active", "true" if on else "false")
            btn.style().unpolish(btn)
            btn.style().polish(btn)
        self._active = key
        self.nav_changed.emit(key)
```

- [ ] **Step 3: Run + commit**

```bash
.venv/Scripts/python.exe -m pytest tests/test_ui_widgets.py -k sidebar -v
```

Expected: 2 passed.

```bash
git add polylux/ui/sidebar.py tests/test_ui_widgets.py
git commit -m "[ui] Sidebar — left navigation widget with active-state

Emits nav_changed(key) on click; MainWindow wires this to QStackedWidget
index.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: MainWindow shell (replaces window.py)

**Files:**
- Create: `polylux/ui/main_window.py`

- [ ] **Step 1: Implement `polylux/ui/main_window.py` (no test — manual smoke)**

```python
"""Polylux main window — frameless shell with sidebar + stacked pages.

Replaces v0.3's polylux/ui/window.py. Frameless, fixed-size for v0.4,
draggable via the titlebar.
"""
from __future__ import annotations

import logging
from typing import Optional

from PyQt6.QtCore import Qt, QPoint
from PyQt6.QtGui import QMouseEvent
from PyQt6.QtWidgets import (
    QFrame, QHBoxLayout, QLabel, QMainWindow, QPushButton, QStackedWidget,
    QVBoxLayout, QWidget,
)

from polylux.ui.sidebar import Sidebar
from polylux.ui.skin import Skin
from polylux.ui.state import ServiceState


log = logging.getLogger(__name__)


NAV_ITEMS = [
    ("dashboard",  "▦  Dashboard"),
    ("matrix",     "⬢  Anime Matrix"),
    ("oled",       "▭  OLED"),
    ("aura_rgb",   "✦  Aura RGB"),
    ("ryujin_lcd", "≋  Ryujin LCD"),
    ("settings",   "⚙  Settings"),
]


class MainWindow(QMainWindow):
    def __init__(self, state: ServiceState, skin: Skin) -> None:
        super().__init__()
        self._state = state
        self._skin = skin
        self._drag_pos: Optional[QPoint] = None

        flags = Qt.WindowType.Window
        if skin.frameless:
            flags |= Qt.WindowType.FramelessWindowHint
        self.setWindowFlags(flags)
        self.setFixedSize(skin.width, skin.height)
        self.setWindowTitle("Polylux")

        root = QWidget(self)
        root.setObjectName("root")
        self.setCentralWidget(root)
        root_v = QVBoxLayout(root)
        root_v.setContentsMargins(0, 0, 0, 0)
        root_v.setSpacing(0)

        # Titlebar
        self._titlebar = self._build_titlebar()
        root_v.addWidget(self._titlebar)

        # Body: sidebar + stacked pages
        body = QFrame()
        body_h = QHBoxLayout(body)
        body_h.setContentsMargins(0, 0, 0, 0)
        body_h.setSpacing(0)

        self._sidebar = Sidebar(items=NAV_ITEMS)
        self._sidebar.setFixedWidth(skin.layout.get("sidebar_width", 180))
        body_h.addWidget(self._sidebar)

        self._stack = QStackedWidget()
        body_h.addWidget(self._stack, 1)

        # Pages constructed lazily? No — eager so live previews subscribe
        # to state immediately even when the tab isn't visible.
        from polylux.ui.pages.dashboard import DashboardPage
        from polylux.ui.pages.matrix import MatrixPage
        from polylux.ui.pages.oled import OledPage
        from polylux.ui.pages.aura_rgb import AuraRGBPage
        from polylux.ui.pages.ryujin import RyujinPage
        from polylux.ui.pages.settings import SettingsPage

        self._pages = {
            "dashboard":  DashboardPage(state),
            "matrix":     MatrixPage(state),
            "oled":       OledPage(state),
            "aura_rgb":   AuraRGBPage(state),
            "ryujin_lcd": RyujinPage(state),
            "settings":   SettingsPage(state, skin),
        }
        for key, _ in NAV_ITEMS:
            self._stack.addWidget(self._pages[key])

        self._sidebar.nav_changed.connect(self._on_nav_changed)
        self._on_nav_changed("dashboard")

        root_v.addWidget(body, 1)
        self.setStyleSheet(skin.qss())

    def _build_titlebar(self) -> QFrame:
        bar = QFrame()
        bar.setObjectName("titlebar")
        bar.setFixedHeight(self._skin.layout.get("titlebar_height", 36))
        h = QHBoxLayout(bar)
        h.setContentsMargins(12, 0, 12, 0)
        h.setSpacing(8)

        title = QLabel("POLYLUX")
        title.setObjectName("title_label")
        h.addWidget(title, 1)

        min_btn = QPushButton("—")
        min_btn.setObjectName("min_btn")
        min_btn.setFixedWidth(36)
        min_btn.clicked.connect(self.showMinimized)
        h.addWidget(min_btn)

        close_btn = QPushButton("✕")
        close_btn.setObjectName("close_btn")
        close_btn.setFixedWidth(36)
        close_btn.clicked.connect(self.hide)
        h.addWidget(close_btn)
        return bar

    def _on_nav_changed(self, key: str) -> None:
        keys = [k for k, _ in NAV_ITEMS]
        if key in keys:
            self._stack.setCurrentIndex(keys.index(key))

    # --- frameless drag-to-move ---

    def mousePressEvent(self, e: QMouseEvent) -> None:
        if e.button() == Qt.MouseButton.LeftButton:
            tb_h = self._skin.layout.get("titlebar_height", 36)
            if e.position().y() < tb_h:
                self._drag_pos = e.globalPosition().toPoint() - self.frameGeometry().topLeft()
                e.accept()

    def mouseMoveEvent(self, e: QMouseEvent) -> None:
        if self._drag_pos is not None and (e.buttons() & Qt.MouseButton.LeftButton):
            self.move(e.globalPosition().toPoint() - self._drag_pos)
            e.accept()

    def mouseReleaseEvent(self, e: QMouseEvent) -> None:
        self._drag_pos = None
```

- [ ] **Step 2: Page stubs — create the 6 page files as empty `QWidget` for now**

Create `polylux/ui/pages/__init__.py` (empty docstring file).

Create `polylux/ui/pages/dashboard.py`:
```python
"""Dashboard page — placeholder until Task 16."""
from PyQt6.QtWidgets import QLabel, QVBoxLayout, QWidget

from polylux.ui.state import ServiceState


class DashboardPage(QWidget):
    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        v = QVBoxLayout(self)
        v.addWidget(QLabel("Dashboard — coming soon"))
```

Create `polylux/ui/pages/matrix.py`, `oled.py`, `aura_rgb.py`, `ryujin.py`, `settings.py` analogously, each exposing a class named `MatrixPage`, `OledPage`, `AuraRGBPage`, `RyujinPage`, `SettingsPage`. SettingsPage takes a second arg `skin`:

```python
"""Settings page — placeholder until Task 21."""
from PyQt6.QtWidgets import QLabel, QVBoxLayout, QWidget

from polylux.ui.skin import Skin
from polylux.ui.state import ServiceState


class SettingsPage(QWidget):
    def __init__(self, state: ServiceState, skin: Skin) -> None:
        super().__init__()
        v = QVBoxLayout(self)
        v.addWidget(QLabel("Settings — coming soon"))
```

- [ ] **Step 3: Wire `app.py` to use MainWindow**

In `polylux/ui/app.py`, replace the `from polylux.ui.window import PolyluxWindow` line with `from polylux.ui.main_window import MainWindow`, and in `PolyluxApp.__init__` change `self._window = PolyluxWindow(state=state, skin=self._skin)` to `self._window = MainWindow(state=state, skin=self._skin)`.

- [ ] **Step 4: Smoke test**

Run:
```bash
.venv/Scripts/python.exe -m polylux.ui.app
```

Expected: a 940×640 frameless window opens with sidebar on the left (Dashboard / Anime Matrix / OLED / Aura RGB / Ryujin LCD / Settings) and a "Dashboard — coming soon" placeholder in the main area. Click each sidebar item — main area swaps to "<Tab> — coming soon". Close window with the × button.

- [ ] **Step 5: Delete `polylux/ui/window.py`**

```bash
git rm polylux/ui/window.py
```

- [ ] **Step 6: Commit**

```bash
git add polylux/ui/main_window.py polylux/ui/pages/ polylux/ui/app.py
git commit -m "[ui] MainWindow shell — sidebar + QStackedWidget + page stubs

Replaces v0.3 Winamp-style window.py (deleted). All 6 nav entries route
to placeholder pages — content lands in Tasks 16-21.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 4 — Pages

### Task 15: DevicePage base class

**Files:**
- Modify: `polylux/ui/pages/base.py` (currently doesn't exist — create)
- Test: `tests/test_ui_pages.py` (new)

- [ ] **Step 1: Failing test**

Create `tests/test_ui_pages.py`:
```python
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
```

- [ ] **Step 2: Implement `polylux/ui/pages/base.py`**

```python
"""DevicePage — shared structure for per-device tabs.

Layout: header (name + status) → scene cards row → scene config card
(left) + common config card (right) → live preview.

Subclasses provide:
  - DEVICE_KEY: "matrix" | "oled" | "aura_rgb" | "ryujin_lcd"
  - DEVICE_TITLE: display string in header
  - SCENES: list of (scene_key, title, preview_widget_factory)
  - build_scene_config(scene) -> QWidget: editable controls for current scene
  - build_common_config() -> QWidget: brightness/etc.
  - build_live_preview() -> QWidget: subclass-specific preview widget
"""
from __future__ import annotations

import logging
import time
from typing import Optional

from PyQt6.QtCore import Qt, QTimer, pyqtSignal
from PyQt6.QtWidgets import (
    QFrame, QGridLayout, QHBoxLayout, QLabel, QVBoxLayout, QWidget,
)

from polylux.ui.state import ServiceState
from polylux.ui.widgets.scene_card import SceneCard


log = logging.getLogger(__name__)


class DevicePage(QWidget):
    DEVICE_KEY: str = "OVERRIDE"
    DEVICE_TITLE: str = "OVERRIDE"
    DEVICE_SUBTITLE: str = ""

    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        self._state = state
        self._scene_cards: dict[str, SceneCard] = {}

        outer = QVBoxLayout(self)
        outer.setContentsMargins(26, 22, 26, 22)
        outer.setSpacing(0)

        # --- Header ---
        header_row = QHBoxLayout()
        h_title = QLabel(self.DEVICE_TITLE)
        f = h_title.font()
        f.setPointSize(16)
        f.setBold(True)
        h_title.setFont(f)
        header_row.addWidget(h_title, 1)
        h_sub = QLabel(self.DEVICE_SUBTITLE)
        h_sub.setObjectName("dim")
        header_row.addWidget(h_sub)
        outer.addLayout(header_row)

        self._status_lbl = QLabel("● starting…")
        self._status_lbl.setObjectName("dim")
        outer.addSpacing(2)
        outer.addWidget(self._status_lbl)
        outer.addSpacing(18)

        # --- Scene cards row ---
        sc_label = QLabel("SCENE")
        sc_label.setObjectName("card_label")
        outer.addWidget(sc_label)
        outer.addSpacing(8)
        self._scene_row = QHBoxLayout()
        self._scene_row.setSpacing(10)
        outer.addLayout(self._scene_row)
        for key, title, preview in self._scenes():
            card = SceneCard(scene_key=key, title=title, preview=preview)
            card.clicked_scene.connect(self.set_scene)
            self._scene_row.addWidget(card)
            self._scene_cards[key] = card

        outer.addSpacing(20)

        # --- Config row ---
        cfg_row = QHBoxLayout()
        cfg_row.setSpacing(20)
        self._scene_cfg_holder = QFrame()
        self._scene_cfg_holder.setObjectName("card")
        self._scene_cfg_layout = QVBoxLayout(self._scene_cfg_holder)
        self._scene_cfg_layout.setContentsMargins(18, 18, 18, 18)
        cfg_row.addWidget(self._scene_cfg_holder, 1)

        common_holder = QFrame()
        common_holder.setObjectName("card")
        common_v = QVBoxLayout(common_holder)
        common_v.setContentsMargins(18, 18, 18, 18)
        common_lbl = QLabel("COMMON")
        common_lbl.setObjectName("card_label")
        common_v.addWidget(common_lbl)
        common_v.addSpacing(10)
        common_v.addWidget(self.build_common_config())
        cfg_row.addWidget(common_holder, 1)
        outer.addLayout(cfg_row)

        outer.addSpacing(20)

        # --- Live preview ---
        preview_card = QFrame()
        preview_card.setObjectName("card")
        prev_h = QHBoxLayout(preview_card)
        prev_h.setContentsMargins(18, 14, 18, 14)
        prev_lbl = QLabel("LIVE PREVIEW")
        prev_lbl.setObjectName("card_label")
        prev_h.addWidget(prev_lbl, 1)
        self._live_widget = self.build_live_preview()
        prev_h.addWidget(self._live_widget)
        outer.addWidget(preview_card)
        outer.addStretch(1)

        # Initial state from config
        scene_now = self._scene_from_state()
        self._select_scene_visual(scene_now)
        self._rebuild_scene_config(scene_now)

        # Status refresh
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._refresh_status)
        self._timer.start(1000)

        # Live preview subscription
        if self.DEVICE_KEY in ("matrix", "oled", "aura_rgb", "ryujin_lcd"):
            state.add_frame_listener(self.DEVICE_KEY, self._on_frame)
            last = state.last_frame(self.DEVICE_KEY)
            if last is not None:
                self._on_frame(last)

    # --- Overrides ---

    def _scenes(self) -> list[tuple[str, str, Optional[QWidget]]]:
        raise NotImplementedError

    def build_scene_config(self, scene: str) -> QWidget:
        return QWidget()

    def build_common_config(self) -> QWidget:
        return QWidget()

    def build_live_preview(self) -> QWidget:
        return QWidget()

    # --- Public ---

    def active_scene(self) -> str:
        return self._scene_from_state()

    def set_scene(self, scene_key: str) -> None:
        if scene_key not in self._scene_cards:
            return
        try:
            self._state.update_device(self.DEVICE_KEY, {"scene": scene_key})
        except Exception:
            log.exception("set_scene failed")
            return
        self._select_scene_visual(scene_key)
        self._rebuild_scene_config(scene_key)

    # --- Internals ---

    def _scene_from_state(self) -> str:
        cfg = self._state.snapshot()
        dev_cfg = getattr(cfg, self.DEVICE_KEY)
        return dev_cfg.scene

    def _select_scene_visual(self, scene: str) -> None:
        for k, card in self._scene_cards.items():
            card.set_active(k == scene)

    def _rebuild_scene_config(self, scene: str) -> None:
        # Clear holder (keep nothing) — preserve the layout itself
        while self._scene_cfg_layout.count():
            item = self._scene_cfg_layout.takeAt(0)
            w = item.widget()
            if w is not None:
                w.deleteLater()
        title = QLabel(f"{scene.upper()} SCENE")
        title.setObjectName("card_label")
        self._scene_cfg_layout.addWidget(title)
        self._scene_cfg_layout.addSpacing(10)
        body = self.build_scene_config(scene)
        self._scene_cfg_layout.addWidget(body)
        self._scene_cfg_layout.addStretch(1)

    def _on_frame(self, frame) -> None:
        if hasattr(self._live_widget, "set_frame"):
            self._live_widget.set_frame(frame)

    def _refresh_status(self) -> None:
        status = self._state.status().get(self.DEVICE_KEY, {})
        cfg = getattr(self._state.snapshot(), self.DEVICE_KEY)
        now = time.time()
        if not cfg.enabled:
            self._status_lbl.setText("● disabled")
            return
        err = status.get("last_error")
        upd = status.get("last_update", 0)
        if err:
            self._status_lbl.setText(f"● error: {err[:60]}")
        elif upd == 0:
            self._status_lbl.setText("● starting…")
        elif now - upd < 5:
            self._status_lbl.setText(f"● ACTIVE · last frame {int((now - upd) * 1000)}ms ago")
        else:
            self._status_lbl.setText(f"● stale {int(now - upd)}s")
```

- [ ] **Step 3: Update `polylux/ui/pages/matrix.py` to subclass DevicePage minimally**

Replace `polylux/ui/pages/matrix.py`:
```python
"""Matrix page — scenes: clock / text / fill / off."""
from __future__ import annotations

from typing import Optional

from PyQt6.QtWidgets import QLabel, QWidget

from polylux.ui.pages.base import DevicePage
from polylux.ui.state import ServiceState
from polylux.ui.widgets.live_preview import MatrixLivePreview


class MatrixPage(DevicePage):
    DEVICE_KEY = "matrix"
    DEVICE_TITLE = "Anime Matrix"
    DEVICE_SUBTITLE = "DEV 2 · CHIP 1845"

    def _scenes(self):
        return [
            ("clock", "CLOCK", None),
            ("text",  "TEXT",  None),
            ("fill",  "FILL",  None),
            ("off",   "OFF",   None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        return QLabel(f"(scene config for {scene} — Task 17)")

    def build_common_config(self) -> QWidget:
        return QLabel("(common config — Task 17)")

    def build_live_preview(self) -> QWidget:
        return MatrixLivePreview()
```

- [ ] **Step 4: Run + commit**

```bash
.venv/Scripts/python.exe -m pytest tests/test_ui_pages.py -v
.venv/Scripts/python.exe -m polylux.ui.app
```

Expected: test passes; UI opens; clicking Anime Matrix shows header, 4 placeholder scene cards (highlighting on click), placeholder config cards, live preview canvas.

```bash
git add polylux/ui/pages/base.py polylux/ui/pages/matrix.py tests/test_ui_pages.py
git commit -m "[ui+page] DevicePage base + MatrixPage minimal subclass

Shared structure: header, scene-cards row, scene config (dynamic),
common config, live preview. Subscribes to state.last_frame() via
add_frame_listener. Subclasses override _scenes() + build_*().

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 16: DashboardPage (gauges + fan cards + device status row)

**Files:**
- Modify: `polylux/ui/pages/dashboard.py`

- [ ] **Step 1: Replace `polylux/ui/pages/dashboard.py` with the real implementation**

```python
"""Dashboard page — landing tab with system telemetry."""
from __future__ import annotations

import logging

from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtWidgets import (
    QFrame, QGridLayout, QHBoxLayout, QLabel, QProgressBar, QVBoxLayout, QWidget,
)

from polylux.sensors.lhm import LHMSensors
from polylux.ui.state import ServiceState
from polylux.ui.widgets.gauge import RadialGauge


log = logging.getLogger(__name__)


def _cpu_pct() -> float:
    try:
        import psutil
        return psutil.cpu_percent(interval=None)
    except Exception:
        return 0.0


def _cpu_temp() -> float:
    try:
        import psutil
        temps = psutil.sensors_temperatures() if hasattr(psutil, "sensors_temperatures") else {}
        for key in ("coretemp", "k10temp", "cpu_thermal"):
            if key in temps and temps[key]:
                return float(temps[key][0].current)
    except Exception:
        pass
    return 0.0


def _gpu_state() -> tuple[float, float]:
    """Return (temp_c, util_pct). Both 0 if unavailable."""
    try:
        import pynvml
        pynvml.nvmlInit()
        try:
            h = pynvml.nvmlDeviceGetHandleByIndex(0)
            t = pynvml.nvmlDeviceGetTemperature(h, pynvml.NVML_TEMPERATURE_GPU)
            u = pynvml.nvmlDeviceGetUtilizationRates(h)
            return (float(t), float(u.gpu))
        finally:
            pynvml.nvmlShutdown()
    except Exception:
        return (0.0, 0.0)


def _mem_used_gb() -> tuple[float, float]:
    try:
        import psutil
        m = psutil.virtual_memory()
        return (m.used / (1024 ** 3), m.total / (1024 ** 3))
    except Exception:
        return (0.0, 0.0)


class _Card(QFrame):
    def __init__(self, label: str) -> None:
        super().__init__()
        self.setObjectName("card")
        v = QVBoxLayout(self)
        v.setContentsMargins(14, 14, 14, 14)
        self._label = QLabel(label)
        self._label.setObjectName("card_label")
        v.addWidget(self._label)
        self._value = QLabel("—")
        f = self._value.font()
        f.setPointSize(20)
        self._value.setFont(f)
        v.addWidget(self._value)
        self._bar = QProgressBar()
        self._bar.setTextVisible(False)
        self._bar.setRange(0, 100)
        self._bar.setFixedHeight(4)
        v.addWidget(self._bar)

    def set_value(self, text: str, pct: int) -> None:
        self._value.setText(text)
        self._bar.setValue(max(0, min(100, int(pct))))


class DashboardPage(QWidget):
    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        self._state = state
        self._lhm = LHMSensors()

        v = QVBoxLayout(self)
        v.setContentsMargins(26, 22, 26, 22)
        v.setSpacing(0)

        # Header
        h_row = QHBoxLayout()
        t = QLabel("System Overview")
        f = t.font()
        f.setPointSize(16)
        f.setBold(True)
        t.setFont(f)
        h_row.addWidget(t, 1)
        sub = QLabel("Z690 EXTREME")
        sub.setObjectName("dim")
        h_row.addWidget(sub)
        v.addLayout(h_row)
        v.addSpacing(18)

        # Gauges row
        gauges = QHBoxLayout()
        gauges.setSpacing(12)
        self._cpu_temp = RadialGauge(label="CPU", unit="°C", thresholds=(60, 80))
        self._gpu_temp = RadialGauge(label="GPU", unit="°C", thresholds=(65, 85))
        for g in (self._cpu_temp, self._gpu_temp):
            box = QFrame()
            box.setObjectName("card")
            bv = QVBoxLayout(box)
            bv.setContentsMargins(14, 14, 14, 14)
            lbl = QLabel(g.label())
            lbl.setObjectName("card_label")
            bv.addWidget(lbl, alignment=Qt.AlignmentFlag.AlignLeft)
            bv.addWidget(g, alignment=Qt.AlignmentFlag.AlignCenter)
            gauges.addWidget(box, 1)
        v.addLayout(gauges)
        v.addSpacing(12)

        # Cards row (fans + memory)
        cards = QHBoxLayout()
        cards.setSpacing(12)
        self._fan_cards: list[_Card] = []
        for label in ("CPU FAN", "CHASSIS 1", "CHASSIS 2"):
            c = _Card(label)
            cards.addWidget(c, 1)
            self._fan_cards.append(c)
        self._mem_card = _Card("MEMORY")
        cards.addWidget(self._mem_card, 1)
        v.addLayout(cards)
        v.addSpacing(18)

        # Device status row
        dev_row = QHBoxLayout()
        dev_row.setSpacing(10)
        self._device_pills: dict[str, QLabel] = {}
        for key, name in [("matrix", "ANIME MATRIX"), ("oled", "OLED"),
                          ("aura_rgb", "AURA RGB"), ("ryujin_lcd", "RYUJIN")]:
            pill = QFrame()
            pill.setObjectName("card")
            ph = QVBoxLayout(pill)
            ph.setContentsMargins(12, 10, 12, 10)
            n = QLabel(name)
            n.setObjectName("card_label")
            ph.addWidget(n)
            lbl = QLabel("—")
            self._device_pills[key] = lbl
            ph.addWidget(lbl)
            dev_row.addWidget(pill, 1)
        v.addLayout(dev_row)

        # Footer / LHM notice
        self._lhm_notice = QLabel("")
        self._lhm_notice.setObjectName("dim")
        v.addWidget(self._lhm_notice)
        v.addStretch(1)

        # 1 Hz refresh
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._refresh)
        self._timer.start(1000)
        self._refresh()

    def _refresh(self) -> None:
        self._cpu_temp.set_value(_cpu_temp())
        cpu_p = _cpu_pct()
        self._cpu_temp.set_sub_text(f"USAGE {cpu_p:.0f}%")

        gt, gu = _gpu_state()
        self._gpu_temp.set_value(gt)
        self._gpu_temp.set_sub_text(f"USAGE {gu:.0f}%")

        ok, err = self._lhm.health()
        if ok:
            fans = self._lhm.fans()
            for i, card in enumerate(self._fan_cards):
                if i < len(fans):
                    card.set_value(f"{fans[i].rpm} rpm",
                                   pct=int(min(fans[i].rpm / 30, 100)))
                else:
                    card.set_value("—", 0)
            self._lhm_notice.setText("")
        else:
            for card in self._fan_cards:
                card.set_value("—", 0)
            self._lhm_notice.setText(
                f"Install LibreHardwareMonitor for fan readings ({err or 'service not running'})"
            )

        used, total = _mem_used_gb()
        pct = int((used / total) * 100) if total else 0
        self._mem_card.set_value(f"{used:.1f}/{total:.0f}GB", pct)

        cfg = self._state.snapshot()
        self._device_pills["matrix"].setText(f"{cfg.matrix.scene}")
        self._device_pills["oled"].setText(f"{cfg.oled.scene}")
        self._device_pills["aura_rgb"].setText(f"{cfg.aura_rgb.scene}")
        self._device_pills["ryujin_lcd"].setText(f"{cfg.ryujin_lcd.scene}")
```

- [ ] **Step 2: Smoke test**

```bash
.venv/Scripts/python.exe -m polylux.ui.app
```

Expected: Dashboard tab shows CPU/GPU radial gauges updating every second, fan cards either populated (if LHM running) or "—" with the inline notice, memory card with X.XGB/32GB, device status row showing each device's current scene name.

- [ ] **Step 3: Commit**

```bash
git add polylux/ui/pages/dashboard.py
git commit -m "[ui+page] Dashboard — CPU/GPU gauges, fan cards, memory, device status

1 Hz refresh. LHM degrades to '—' + notice line if absent. CPU temp via
psutil, GPU temp/usage via pynvml, memory via psutil.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 17: MatrixPage — full implementation

**Files:**
- Modify: `polylux/ui/pages/matrix.py`

- [ ] **Step 1: Replace with full implementation**

```python
"""Matrix page — scenes: clock / text / fill / off."""
from __future__ import annotations

from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import (
    QCheckBox, QHBoxLayout, QLabel, QLineEdit, QVBoxLayout, QWidget,
)

from polylux.ui.pages.base import DevicePage
from polylux.ui.state import ServiceState
from polylux.ui.widgets.color_picker import ColorPicker
from polylux.ui.widgets.live_preview import MatrixLivePreview
from polylux.ui.widgets.seg_button import SegButton
from polylux.ui.widgets.slider_row import SliderRow


class MatrixPage(DevicePage):
    DEVICE_KEY = "matrix"
    DEVICE_TITLE = "Anime Matrix"
    DEVICE_SUBTITLE = "DEV 2 · CHIP 1845"

    def _scenes(self):
        return [
            ("clock", "CLOCK", None),
            ("text",  "TEXT",  None),
            ("fill",  "FILL",  None),
            ("off",   "OFF",   None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        cfg = self._state.snapshot().matrix
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        if scene == "text":
            text_input = QLineEdit(cfg.text)
            text_input.setPlaceholderText("HELLO WORLD")
            text_input.editingFinished.connect(
                lambda: self._state.update_device("matrix", {"text": text_input.text()})
            )
            v.addWidget(QLabel("MESSAGE"))
            v.addWidget(text_input)

            spd = SliderRow(label="SCROLL SPEED", minimum=1, maximum=100,
                            value=cfg.scroll_speed, fmt="{v}")
            spd.value_changed.connect(
                lambda val: self._state.update_device("matrix", {"scroll_speed": val})
            )
            v.addWidget(spd)
        elif scene == "fill":
            pick = ColorPicker(color=cfg.color)
            pick.color_changed.connect(
                lambda c: self._state.update_device("matrix", {"color": c})
            )
            v.addWidget(QLabel("COLOR"))
            v.addWidget(pick)
        else:
            lbl = QLabel("(no extra config)")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        v.addStretch(1)
        return w

    def build_common_config(self) -> QWidget:
        cfg = self._state.snapshot().matrix
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        bri = SliderRow(label="BRIGHTNESS", minimum=0, maximum=100,
                        value=cfg.brightness, fmt="{v}")
        bri.value_changed.connect(
            lambda val: self._state.update_device("matrix", {"brightness": val})
        )
        v.addWidget(bri)

        rot = SegButton(
            options=[("0°", 0), ("90°", 90), ("180°", 180), ("270°", 270)],
            value=cfg.rotation,
        )
        rot.value_changed.connect(
            lambda val: self._state.update_device("matrix", {"rotation": val})
        )
        v.addWidget(QLabel("ROTATION"))
        v.addWidget(rot)

        enable = QCheckBox("ENABLED")
        enable.setChecked(cfg.enabled)
        enable.toggled.connect(
            lambda on: self._state.update_device("matrix", {"enabled": on})
        )
        v.addWidget(enable)
        v.addStretch(1)
        return w

    def build_live_preview(self) -> QWidget:
        return MatrixLivePreview()
```

- [ ] **Step 2: Smoke test**

```bash
.venv/Scripts/python.exe -m polylux.ui.app
```

Expected: Anime Matrix tab — click scenes, see config swap. On TEXT scene the message field appears. Drag brightness slider — value updates instantly. Rotation seg button highlights one of 4. Toggle ENABLED.

- [ ] **Step 3: Commit**

```bash
git add polylux/ui/pages/matrix.py
git commit -m "[ui+page] MatrixPage — full scene config + common config

Text input + scroll_speed for TEXT scene, color picker for FILL,
brightness slider + rotation seg + enabled checkbox in common.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 18: OledPage — full implementation with single/rotate mode

**Files:**
- Modify: `polylux/ui/pages/oled.py`

- [ ] **Step 1: Replace with full implementation**

```python
"""OLED page — scenes: hardware_monitor / text / preset_gif / off.

Includes the SINGLE / ROTATE mode toggle for hardware_monitor with a
multi-checkbox metric picker + interval slider.
"""
from __future__ import annotations

from typing import List

from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import (
    QCheckBox, QGridLayout, QHBoxLayout, QLabel, QLineEdit, QPushButton,
    QVBoxLayout, QWidget,
)

from polylux.config import OledConfig
from polylux.ui.pages.base import DevicePage
from polylux.ui.state import ServiceState
from polylux.ui.widgets.live_preview import OledLivePreview
from polylux.ui.widgets.seg_button import SegButton
from polylux.ui.widgets.slider_row import SliderRow


METRIC_DISPLAY = {
    "cpu_temp": "CPU TEMP",
    "gpu_temp": "GPU TEMP",
    "cpu_pct":  "CPU USAGE",
    "gpu_pct":  "GPU USAGE",
    "mem_pct":  "MEM USAGE",
    "fan_rpm":  "FAN RPM",
}


class OledPage(DevicePage):
    DEVICE_KEY = "oled"
    DEVICE_TITLE = "OLED Display"
    DEVICE_SUBTITLE = "DEV 6 · 256×64 · CHIP 1845"

    def _scenes(self):
        return [
            ("hardware_monitor", "HARDWARE_MONITOR", None),
            ("text",             "TEXT",             None),
            ("preset_gif",       "PRESET_GIF",       None),
            ("off",              "OFF",              None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        cfg: OledConfig = self._state.snapshot().oled
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        if scene == "hardware_monitor":
            mode_seg = SegButton(
                options=[("SINGLE", "single"), ("ROTATE", "rotate")],
                value=cfg.hw_mode,
            )
            mode_seg.value_changed.connect(self._on_hw_mode_changed)
            v.addWidget(QLabel("MODE"))
            v.addWidget(mode_seg)
            v.addSpacing(6)
            self._metric_holder = QWidget()
            self._metric_holder_v = QVBoxLayout(self._metric_holder)
            self._metric_holder_v.setContentsMargins(0, 0, 0, 0)
            self._metric_holder_v.setSpacing(14)
            v.addWidget(self._metric_holder)
            self._render_hw_mode(cfg.hw_mode)
        elif scene == "text":
            label_in = QLineEdit(cfg.label)
            label_in.setPlaceholderText("LABEL")
            label_in.editingFinished.connect(
                lambda: self._state.update_device("oled", {"label": label_in.text()})
            )
            v.addWidget(QLabel("LABEL"))
            v.addWidget(label_in)
            value_in = QLineEdit(cfg.value)
            value_in.setPlaceholderText("VALUE")
            value_in.editingFinished.connect(
                lambda: self._state.update_device("oled", {"value": value_in.text()})
            )
            v.addWidget(QLabel("VALUE"))
            v.addWidget(value_in)
        elif scene == "preset_gif":
            lbl = QLabel(f"(preset thumbnails — Task 18b, currently index={cfg.preset_index})")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        else:
            lbl = QLabel("(no extra config)")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        v.addStretch(1)
        return w

    def _on_hw_mode_changed(self, mode: str) -> None:
        self._state.update_device("oled", {"hw_mode": mode})
        self._render_hw_mode(mode)

    def _render_hw_mode(self, mode: str) -> None:
        # Clear holder
        while self._metric_holder_v.count():
            item = self._metric_holder_v.takeAt(0)
            wid = item.widget()
            if wid is not None:
                wid.deleteLater()

        cfg: OledConfig = self._state.snapshot().oled
        if mode == "single":
            self._metric_holder_v.addWidget(QLabel("METRIC TO DISPLAY"))
            grid = QGridLayout()
            grid.setSpacing(6)
            for i, key in enumerate(["cpu_temp", "gpu_temp", "cpu_pct",
                                     "gpu_pct", "mem_pct", "fan_rpm"]):
                btn = QPushButton(METRIC_DISPLAY[key])
                btn.setCheckable(True)
                btn.setChecked(key == cfg.value_source)
                btn.setProperty("on", "true" if key == cfg.value_source else "false")
                btn.clicked.connect(lambda _ck, k=key: self._set_metric(k))
                grid.addWidget(btn, i // 2, i % 2)
            self._metric_holder_v.addLayout(grid)

            self._metric_holder_v.addWidget(QLabel("LABEL OVERRIDE"))
            li = QLineEdit(cfg.label)
            li.editingFinished.connect(
                lambda: self._state.update_device("oled", {"label": li.text()})
            )
            self._metric_holder_v.addWidget(li)
        else:
            self._metric_holder_v.addWidget(QLabel("METRICS TO CYCLE"))
            grid = QGridLayout()
            grid.setSpacing(6)
            self._rotate_checks: list[tuple[str, QCheckBox]] = []
            for i, key in enumerate(["cpu_temp", "gpu_temp", "cpu_pct",
                                     "gpu_pct", "mem_pct", "fan_rpm"]):
                cb = QCheckBox(METRIC_DISPLAY[key])
                cb.setChecked(key in cfg.rotate_sources)
                cb.toggled.connect(lambda _on, _k=key: self._sync_rotate_sources())
                grid.addWidget(cb, i // 2, i % 2)
                self._rotate_checks.append((key, cb))
            self._metric_holder_v.addLayout(grid)

            ivl = SliderRow(label="INTERVAL (sec)", minimum=1, maximum=10,
                            value=int(round(cfg.rotate_interval_s)), fmt="{v}s")
            ivl.value_changed.connect(
                lambda v: self._state.update_device("oled", {"rotate_interval_s": float(v)})
            )
            self._metric_holder_v.addWidget(ivl)

    def _set_metric(self, key: str) -> None:
        self._state.update_device("oled", {"value_source": key})
        self._render_hw_mode("single")  # refresh the on/off visuals

    def _sync_rotate_sources(self) -> None:
        sources = tuple(k for k, cb in self._rotate_checks if cb.isChecked())
        if not sources:
            return  # Empty list is invalid — config validation would reject
        self._state.update_device("oled", {"rotate_sources": sources})

    def build_common_config(self) -> QWidget:
        cfg: OledConfig = self._state.snapshot().oled
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        bri = SliderRow(label="BRIGHTNESS", minimum=0, maximum=100,
                        value=cfg.brightness, fmt="{v}")
        bri.value_changed.connect(
            lambda val: self._state.update_device("oled", {"brightness": val})
        )
        v.addWidget(bri)

        rate = SliderRow(label="REFRESH RATE (sec)", minimum=1, maximum=10,
                         value=int(round(cfg.update_seconds)), fmt="{v}s")
        rate.value_changed.connect(
            lambda val: self._state.update_device("oled", {"update_seconds": float(val)})
        )
        v.addWidget(rate)

        size = SegButton(
            options=[("SMALL", "small"), ("MEDIUM", "medium"), ("LARGE", "large")],
            value=cfg.font_size,
        )
        size.value_changed.connect(
            lambda val: self._state.update_device("oled", {"font_size": val})
        )
        v.addWidget(QLabel("FONT SIZE"))
        v.addWidget(size)

        enable = QCheckBox("ENABLED")
        enable.setChecked(cfg.enabled)
        enable.toggled.connect(
            lambda on: self._state.update_device("oled", {"enabled": on})
        )
        v.addWidget(enable)
        v.addStretch(1)
        return w

    def build_live_preview(self) -> QWidget:
        return OledLivePreview()
```

- [ ] **Step 2: Smoke test**

```bash
.venv/Scripts/python.exe -m polylux.ui.app
```

Expected: OLED tab; on `hardware_monitor` scene the MODE toggle appears; clicking SINGLE shows 6 metric buttons (clicking one highlights it); clicking ROTATE swaps in 6 checkboxes + interval slider. Brightness / refresh rate / font size + ENABLED in COMMON.

- [ ] **Step 3: Commit**

```bash
git add polylux/ui/pages/oled.py
git commit -m "[ui+page] OledPage — full scene config with SINGLE/ROTATE modes

hardware_monitor scene: MODE toggle (SINGLE = pick one metric; ROTATE =
cycle through checked metrics every N sec). Text scene: label + value
inputs. preset_gif: thumbnail grid placeholder. Common: brightness,
refresh rate, font size, enabled.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 19: AuraRGBPage

**Files:**
- Modify: `polylux/ui/pages/aura_rgb.py`

- [ ] **Step 1: Replace contents**

```python
"""Aura RGB page — scenes: solid / off."""
from __future__ import annotations

from PyQt6.QtWidgets import QCheckBox, QHBoxLayout, QLabel, QVBoxLayout, QWidget

from polylux.ui.pages.base import DevicePage
from polylux.ui.widgets.color_picker import ColorPicker
from polylux.ui.widgets.live_preview import AuraLivePreview
from polylux.ui.widgets.slider_row import SliderRow


KNOWN_TYPES = ("MOTHERBOARD", "KEYBOARD", "MOUSE", "DRAM", "GPU", "HEADSET")


class AuraRGBPage(DevicePage):
    DEVICE_KEY = "aura_rgb"
    DEVICE_TITLE = "Aura RGB"
    DEVICE_SUBTITLE = "OpenRGB · MB-only by default"

    def _scenes(self):
        return [
            ("solid", "SOLID", None),
            ("off",   "OFF",   None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        cfg = self._state.snapshot().aura_rgb
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)
        if scene == "solid":
            pick = ColorPicker(color=cfg.color)
            pick.color_changed.connect(
                lambda c: self._state.update_device("aura_rgb", {"color": c})
            )
            v.addWidget(QLabel("COLOR"))
            v.addWidget(pick)
        else:
            lbl = QLabel("(no extra config)")
            lbl.setObjectName("dim")
            v.addWidget(lbl)
        v.addStretch(1)
        return w

    def build_common_config(self) -> QWidget:
        cfg = self._state.snapshot().aura_rgb
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.setSpacing(14)

        bri = SliderRow(label="BRIGHTNESS", minimum=0, maximum=100,
                        value=cfg.brightness, fmt="{v}")
        bri.value_changed.connect(
            lambda val: self._state.update_device("aura_rgb", {"brightness": val})
        )
        v.addWidget(bri)

        v.addWidget(QLabel("TYPES TO CONTROL"))
        warn = QLabel("⚠ KEYBOARD / MOUSE override per-key effects. MB-only is safe.")
        warn.setObjectName("dim")
        warn.setWordWrap(True)
        v.addWidget(warn)
        self._type_checks: list[tuple[str, QCheckBox]] = []
        for t in KNOWN_TYPES:
            cb = QCheckBox(t)
            cb.setChecked(t in cfg.types)
            cb.toggled.connect(lambda _on, _t=t: self._sync_types())
            v.addWidget(cb)
            self._type_checks.append((t, cb))

        enable = QCheckBox("ENABLED")
        enable.setChecked(cfg.enabled)
        enable.toggled.connect(
            lambda on: self._state.update_device("aura_rgb", {"enabled": on})
        )
        v.addWidget(enable)
        v.addStretch(1)
        return w

    def _sync_types(self) -> None:
        types = tuple(t for t, cb in self._type_checks if cb.isChecked())
        # Always keep at least MOTHERBOARD to avoid full disable surprise
        if not types:
            types = ("MOTHERBOARD",)
        self._state.update_device("aura_rgb", {"types": types})

    def build_live_preview(self):
        return AuraLivePreview()
```

- [ ] **Step 2: Smoke test + commit**

```bash
.venv/Scripts/python.exe -m polylux.ui.app
```

Expected: Aura RGB tab — SOLID/OFF scene cards; SOLID shows color picker; brightness slider + types checkboxes + warning + enabled.

```bash
git add polylux/ui/pages/aura_rgb.py
git commit -m "[ui+page] AuraRGBPage — color picker + types multi-check + warning

Default keeps MOTHERBOARD only; checking KEYBOARD/MOUSE shows a warning
that per-key effects will be overridden (per §9.4.1).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 20: RyujinPage

**Files:**
- Modify: `polylux/ui/pages/ryujin.py`

- [ ] **Step 1: Replace**

```python
"""Ryujin LCD page — v0.4 minimal (firmware-driven scenes only)."""
from __future__ import annotations

from PyQt6.QtWidgets import QCheckBox, QLabel, QVBoxLayout, QWidget

from polylux.ui.pages.base import DevicePage
from polylux.ui.widgets.live_preview import RyujinLivePreview


class RyujinPage(DevicePage):
    DEVICE_KEY = "ryujin_lcd"
    DEVICE_TITLE = "Ryujin LCD"
    DEVICE_SUBTITLE = "AIO · CHIP 1988 · firmware-driven"

    def _scenes(self):
        return [
            ("hardware_monitor", "HARDWARE_MONITOR", None),
            ("off",              "OFF",              None),
        ]

    def build_scene_config(self, scene: str) -> QWidget:
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        v.addWidget(QLabel("(firmware-driven — no extra config)"))
        v.addStretch(1)
        return w

    def build_common_config(self) -> QWidget:
        cfg = self._state.snapshot().ryujin_lcd
        w = QWidget()
        v = QVBoxLayout(w)
        v.setContentsMargins(0, 0, 0, 0)
        enable = QCheckBox("ENABLED")
        enable.setChecked(cfg.enabled)
        enable.toggled.connect(
            lambda on: self._state.update_device("ryujin_lcd", {"enabled": on})
        )
        v.addWidget(enable)
        v.addStretch(1)
        return w

    def build_live_preview(self):
        return RyujinLivePreview()
```

- [ ] **Step 2: Smoke + commit**

```bash
.venv/Scripts/python.exe -m polylux.ui.app
```

Expected: Ryujin tab with HARDWARE_MONITOR/OFF cards, "firmware-driven — no preview" in the live preview area.

```bash
git add polylux/ui/pages/ryujin.py
git commit -m "[ui+page] RyujinPage — minimal v0.4 (hardware_monitor / off)

Custom image upload (§9.3 protocol decoded) deferred to v0.5 — live test
of firmware bug applicability pending.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 21: SettingsPage

**Files:**
- Modify: `polylux/ui/pages/settings.py`

- [ ] **Step 1: Replace**

```python
"""Settings page — skin selector + on-top + kill_asus_stack toggle.

v0.4 minimal. Autostart-with-Windows / language deferred to v0.5.
"""
from __future__ import annotations

from PyQt6.QtWidgets import (
    QCheckBox, QComboBox, QFrame, QLabel, QVBoxLayout, QWidget,
)

from polylux.ui.skin import Skin, list_skins, load_skin
from polylux.ui.state import ServiceState


class SettingsPage(QWidget):
    def __init__(self, state: ServiceState, skin: Skin) -> None:
        super().__init__()
        self._state = state
        self._skin = skin

        v = QVBoxLayout(self)
        v.setContentsMargins(26, 22, 26, 22)
        v.setSpacing(0)

        t = QLabel("Settings")
        f = t.font()
        f.setPointSize(16)
        f.setBold(True)
        t.setFont(f)
        v.addWidget(t)
        v.addSpacing(18)

        # Skin selector
        card = QFrame()
        card.setObjectName("card")
        cv = QVBoxLayout(card)
        cv.setContentsMargins(18, 18, 18, 18)
        lbl = QLabel("APPEARANCE")
        lbl.setObjectName("card_label")
        cv.addWidget(lbl)
        cv.addSpacing(10)
        cv.addWidget(QLabel("Skin"))
        self._skin_combo = QComboBox()
        self._skin_combo.addItems(list_skins())
        self._skin_combo.setCurrentText(skin.name.lower())
        self._skin_combo.currentTextChanged.connect(self._on_skin_changed)
        cv.addWidget(self._skin_combo)
        v.addWidget(card)
        v.addSpacing(12)

        # Service toggles
        card2 = QFrame()
        card2.setObjectName("card")
        cv2 = QVBoxLayout(card2)
        cv2.setContentsMargins(18, 18, 18, 18)
        lbl2 = QLabel("SERVICE")
        lbl2.setObjectName("card_label")
        cv2.addWidget(lbl2)
        cv2.addSpacing(10)
        self._kill_cb = QCheckBox("Kill ASUS service stack at startup")
        self._kill_cb.setChecked(state.snapshot().service.kill_asus_stack)
        self._kill_cb.toggled.connect(self._on_kill_changed)
        cv2.addWidget(self._kill_cb)
        v.addWidget(card2)
        v.addStretch(1)

    def _on_skin_changed(self, name: str) -> None:
        try:
            new_skin = load_skin(name)
            w = self.window()
            if w is not None:
                w.setStyleSheet(new_skin.qss())
        except Exception:
            pass

    def _on_kill_changed(self, on: bool) -> None:
        # service config is read at service start, but persisting via state
        # makes the value survive restart.
        try:
            cfg = self._state.snapshot()
            cfg.service.kill_asus_stack = on
            self._state._schedule_save()  # type: ignore[attr-defined]
        except Exception:
            pass
```

- [ ] **Step 2: Smoke + commit**

```bash
.venv/Scripts/python.exe -m polylux.ui.app
```

Expected: Settings tab — skin dropdown changes window style instantly; kill_asus_stack checkbox persists to YAML after 2s.

```bash
git add polylux/ui/pages/settings.py
git commit -m "[ui+page] SettingsPage v0.4 stub — skin selector + kill_asus toggle

Autostart, language, full theme editor → v0.5.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 5 — Integration + docs

### Task 22: End-to-end smoke test on real hardware

- [ ] **Step 1: Start full service**

```bash
.venv/Scripts/python.exe -m polylux.service --no-kill-asus
```

- [ ] **Step 2: Verify behavior**

  - Tray icon appears.
  - Click tray → MainWindow opens. Dashboard shows live CPU/GPU temps.
  - Anime Matrix tab: change scene to TEXT, type a message in the field → see it appear on the matrix within 1 sec; live preview matches.
  - OLED tab: change to hardware_monitor + ROTATE mode + check CPU TEMP + GPU TEMP + CPU USAGE + interval=2s. Watch OLED cycle; live preview updates.
  - Aura RGB tab: pick a colour from picker → MB lights change colour live.
  - Close the window via × → service keeps running. Re-open via tray.
  - Quit via tray → service stops cleanly, no orphan threads.

If any of the above fails, file a follow-up issue and fix.

- [ ] **Step 3: Quit + commit nothing (this task is verification)**

---

### Task 23: Update documentation

**Files:**
- Modify: `docs/PROJECT_STATE.md` (append §16)
- Modify: `docs/NEXT_SESSION.md` (point at §16 and list v0.5 candidates)

- [ ] **Step 1: Append a §16 to `PROJECT_STATE.md`**

Write a new section summarizing the v0.4 milestones: tabbed UI shipped, LHM bridge, frame-emitter live preview, OLED rotate mode, additive config schema. Reference the commit hashes from Tasks 1–22.

- [ ] **Step 2: Rewrite `NEXT_SESSION.md` to point at §16**

List v0.5 candidates ordered by impact: installer + nssm service, OLED brightness protocol verification, Ryujin custom_image live test, AC BIOS-RGB override research, autostart with Windows, more skins.

- [ ] **Step 3: Commit**

```bash
git add docs/PROJECT_STATE.md docs/NEXT_SESSION.md
git commit -m "docs §16 + NEXT_SESSION.md: v0.4 tabbed UI ship + v0.5 roadmap

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Self-review

- **Spec coverage:** Every section of the spec maps to a task:
  - Goal / window paradigm / nav → Tasks 12-14
  - Sidebar + QStackedWidget → Tasks 13, 14
  - Skin system kept + extensions → Task 12
  - LibreHardwareMonitor → Tasks 1, 3 + Dashboard wiring in Task 16
  - Dashboard refresh + gauges → Task 16
  - Live preview architecture → Tasks 4, 5, 11, 15 (subscription in DevicePage)
  - Autosave unchanged → uses existing `ServiceState._schedule_save` via `update_device`; covered implicitly throughout
  - Tab on first launch (Dashboard) → Task 14 (`_on_nav_changed("dashboard")`)
  - State extensions → Task 2
  - DevicePage shell → Task 15
  - Matrix/OLED/Aura/Ryujin pages → Tasks 17, 18, 19, 20
  - Dashboard page → Task 16
  - Settings stub → Task 21
  - Skin extensions → Task 12
  - End-to-end test → Task 22
  - Docs → Task 23

- **Placeholder scan:** I find one placeholder — the `preset_gif` thumbnail grid in OledPage is written as "(preset thumbnails — Task 18b, currently index=…)". Acceptable trade-off: factory ROM presets aren't enumerated anywhere yet and adding live thumbnail extraction is a v0.5 research item. Documented in Task 18 step 1. No other "TBD"/"TODO"/"add error handling" placeholders.

- **Type consistency:** `state.set_frame(device, frame)` is defined in Task 4 and used identically in Task 5 (service runners). `state.add_frame_listener(device, fn)` defined Task 4, used Task 15. `SegButton` signature consistent across Tasks 9, 17, 18. `RadialGauge.set_value` / `set_sub_text` defined Task 6, used Task 16. `SliderRow.value_changed(int)` consistent across all uses.

- **Tasks total:** 23. Average ~6 steps each. All have explicit code + commit step.

---

## Execution Handoff

Plan complete and saved to [docs/superpowers/plans/2026-05-13-tabbed-ui-redesign.md](2026-05-13-tabbed-ui-redesign.md). Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Good for this plan since most tasks are isolated component builds.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints. Slower but every step happens in your view.

Which approach?
