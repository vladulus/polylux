# Polylux v0.4 — Tabbed UI redesign (Armoury Crate-style)

**Status:** approved (Vlad delegated decisions, signed off on mockups)
**Date:** 2026-05-13
**Replaces:** v0.3 Winamp-style single-window UI (`polylux/ui/window.py`)
**Target version:** v0.4

## Goal

Replace the Winamp-style single-page UI with a tabbed dashboard inspired by Armoury Crate v6. Polylux is being positioned as a full AC replacement; the current UI doesn't sell that vision. The new UI must:

1. Open on a **Dashboard** showing live system telemetry (CPU/GPU temps + usage, fan RPMs, memory) so the user immediately feels they're "using Polylux" not "configuring Polylux".
2. Provide a **dedicated tab per device** (Anime Matrix / OLED / Aura RGB / Ryujin LCD) where every config knob is exposed visually — no YAML editing for any common task.
3. Keep the existing **skin system** so users can re-color the new UI through `polylux/ui/skins/<name>/skin.json` without code changes.

Mockups validated by Vlad: see `.superpowers/brainstorm/1138-1778709911/content/` (dashboard-mockup.html, matrix-tab.html, oled-tab.html).

## Decisions locked in

| Decision | Choice |
|---|---|
| Window paradigm | Frameless + custom titlebar (consistent with current UI + skin system); fixed size 940×640 for v0.4, resizing deferred |
| Navigation | Left sidebar (180px), 6 entries: Dashboard / Anime Matrix / OLED / Aura RGB / Ryujin LCD / Settings |
| Active page state | `QStackedWidget` — only one page widget visible at a time, others stay constructed for instant switch |
| Skin system | **Kept**. New QSS selectors added for sidebar, gauges, scene cards, sliders. Skin JSON gains `layout.sidebar_width`, no breaking change to existing `claude` skin |
| Fan RPM source | `LibreHardwareMonitorLib.dll` (free, OSS) read via Python `wmi` package — no `pythonnet` dep, no DLL bundling; LHM service is the dep |
| Dashboard refresh | 1 Hz timer (same cadence as OLED driver) |
| Live preview | Drivers emit each rendered frame via a Qt signal; UI subscribes per device and shows the exact bytes hardware sees (single source of truth, no drift) |
| Autosave | Existing 2s debounce in `ServiceState._schedule_save` — unchanged |
| Tab on first launch | Dashboard |

## Out of scope for v0.4

- Resizable window (fixed-size for now; resize is non-trivial with QSS-driven sizing)
- Aura RGB per-zone control (stays `solid` / `off`; HSV color picker is in scope)
- OLED custom_image scene — blocked by ASUS firmware bug on Z690 Extreme per §9.2 (upload completes USB-side but display stays on hw-monitor frame). Not exposed; the existing `preset_gif` / `text` / `hardware_monitor` scenes cover OLED's usable surface.
- Ryujin custom_image scene — upload protocol decoded in §9.3 (chip 1988, 358× 4096B bulk chunks, GIF89a 320×240) but live display behavior untested. May or may not have a firmware bug analogous to OLED — that's a v0.5 research item. For v0.4 the Ryujin tab stays at the current driver scope (`hardware_monitor` / `off`).
- Skin authoring UI inside the app (still hand-edit JSON; only theme selector via dropdown)
- Settings tab — autostart, kill_asus_stack toggle, language. Stub for v0.4, full polish in v0.5
- Drag-to-reorder of LED zones / sensors (advanced power-user feature)

## Architecture

### Module layout

```
polylux/ui/
  app.py                  # existing — wire main_window + tray (small changes)
  state.py                # existing — extend listener mechanism to per-device frame signals
  skin.py                 # existing — extend QSS template for new selectors
  skins/
    claude/skin.json      # existing — extend with new layout + sidebar color fields (see Skin extensions)
  main_window.py          # NEW — replaces window.py: frameless shell + sidebar + QStackedWidget
  sidebar.py              # NEW — left nav with active-state styling, version label, skin dropdown
  pages/
    __init__.py           # NEW
    base.py               # NEW — DevicePage base class (header + scenes row + config grid + live preview)
    dashboard.py          # NEW — landing page with gauges + fan cards + device-status row
    matrix.py             # NEW — DevicePage for Anime Matrix
    oled.py               # NEW — DevicePage for OLED
    aura_rgb.py           # NEW — DevicePage for Aura RGB
    ryujin.py             # NEW — DevicePage for Ryujin LCD
    settings.py           # NEW — basic settings (skin, on-top, kill_asus_stack)
  widgets/
    __init__.py           # NEW
    gauge.py              # NEW — RadialGauge custom QWidget (QPainter conic arc)
    scene_card.py         # NEW — clickable preview card for a scene
    slider_row.py         # NEW — labeled slider + value readout
    seg_button.py         # NEW — segmented button (rotation 0/90/180/270, font size S/M/L)
    color_picker.py       # NEW — HSV wheel + hex input + preset swatches
    live_preview.py       # NEW — per-device preview canvas subscribed to driver frames

polylux/sensors/
  __init__.py             # NEW
  lhm.py                  # NEW — LibreHardwareMonitor WMI bridge (fan RPMs, MB temps)

polylux/drivers/<device>/  # existing — add frame_emitter signal hook (small change each)
```

`polylux/ui/window.py` is deleted. `app.py` swaps `PolyluxWindow` → `MainWindow`.

### Navigation

`MainWindow` constructs all 6 pages eagerly at startup (none are heavy — the heaviest is Dashboard with 6 gauges, all CSS). `QStackedWidget` index 0 = Dashboard. Sidebar emits `nav_changed(int)` → `stack.setCurrentIndex(...)`. Active sidebar item gets `[active]` property → QSS styles border-left.

### Live preview architecture (single source of truth)

Today each driver loop computes frames and pushes them straight to hardware. To show the user exactly what the device sees:

1. Each driver gains a thread-safe `frame_emitter: Optional[Callable[[Frame], None]]` attribute. After every successful render, the driver calls `self.frame_emitter(frame)` if set.
2. Frame type per device:
   - Matrix → `bytes` (1216-byte buffer, post-EC framing stripped)
   - OLED → `PIL.Image` (mode `1`, 256×64)
   - Aura RGB → `list[tuple[int,int,int]]` (per-zone color)
   - Ryujin → `PIL.Image` (hardware_monitor scene's last text + style summary; for v0.4 we don't have framebuffer access, so just a textual readout)
3. `MainWindow` registers Qt-signal-backed callbacks (cross-thread safe) on each driver. Each device page subscribes to its driver's signal and updates a `LivePreviewWidget`.
4. When a page isn't visible (`isVisible() == False`), the widget early-returns from paint — driver still emits, but UI doesn't burn CPU rendering invisible frames.

This avoids the alternative (UI re-implementing every scene's rendering logic) which would mean two render paths to keep in sync.

### LibreHardwareMonitor integration

LHM runs as a Windows service exposing sensor data via WMI namespace `root\LibreHardwareMonitor`. `polylux/sensors/lhm.py`:

```python
class LHMSensors:
    def __init__(self): self._wmi = wmi.WMI(namespace="root\\LibreHardwareMonitor")
    def fans(self) -> list[Fan]:                     # name, rpm, percent
    def temps(self) -> dict[str, float]:             # cpu_package, gpu_core, mb_chipset, ...
    def cpu_freq_mhz(self) -> float:
    def gpu_clock_mhz(self) -> float:
    def health(self) -> tuple[bool, Optional[str]]:  # is service alive
```

If LHM isn't installed/running, `health()` returns `(False, "LHM not running")`. Dashboard fan cards show "—" and a single-line yellow notice "Install LibreHardwareMonitor for fan readings → [link]". CPU/GPU temps still work (psutil + pynvml unchanged), so the dashboard isn't empty.

Installer (out of scope for v0.4 spec) will offer to fetch + install LHM as a side-step.

### State extensions (config.py)

Add the following dataclass fields. All have defaults so existing `polylux.yaml` continues to load unchanged:

```python
class MatrixConfig:
    brightness: int = 100          # 0-100, applied at frame-build time
    scroll_speed: int = 55         # used in text scene, frames/sec analog

class OledConfig:
    brightness: int = 100          # 0-100, applied via 0xEC 0x14 0xBR? — TODO verify protocol
    font_size: str = "medium"      # small | medium | large
    # value_source gains: gpu_pct, fan_rpm

class AuraRGBConfig:
    brightness: int = 100          # 0-100, multiplied into RGB before send
```

`OledConfig.VALUE_SOURCES = ("cpu_temp", "gpu_temp", "cpu_pct", "gpu_pct", "mem_pct", "fan_rpm", "static")` — adds `gpu_pct` and `fan_rpm`.

### Page anatomy (DevicePage base class)

Every device tab follows the same vertical structure:

```
+-----------------------------------------------------+
| <Device Name>            chip/dev ID · status badge |
| ● ACTIVE  · 60 fps · last frame 12ms ago            |
+-----------------------------------------------------+
| SCENE                                                |
| [ scene_card ][ scene_card ][ scene_card ][ card ]   |
+-----------------------------------------------------+
| [ SCENE CONFIG       ]    [ COMMON                ]  |
| (dynamic per scene)        (brightness, rotation,    |
|                              enabled toggle, etc)    |
+-----------------------------------------------------+
| LIVE PREVIEW       [ canvas — driver's last frame ]  |
+-----------------------------------------------------+
```

`DevicePage.__init__(state, device_key, ...)` builds the shell; subclasses override `scenes()` (list of scene metadata with preview render fn) and `build_scene_config(scene)` (returns a QWidget to drop into the left config card when scene changes). Scene clicks call `state.update_device(device, {"scene": new_scene})`. Common card changes call `state.update_device(...)` with the relevant patch.

Subclass-specific:

- **MatrixPage**: scenes = clock / text / fill / off. Scene config: text scene → text input + scroll_speed slider; fill → color picker; clock/off → empty. Common: brightness, rotation seg (0/90/180/270), enabled.
- **OledPage**: scenes = hardware_monitor / text / preset_gif / off. Scene config: hw_monitor → 6-card metric picker (cpu temp / gpu temp / cpu pct / gpu pct / mem pct / fan rpm) + label override; text → label input + value input; preset_gif → thumbnail grid of factory ROM presets. Common: brightness, refresh rate slider (0.5–5s), font_size seg.
- **AuraRGBPage**: scenes = solid / off. Scene config: solid → HSV color picker + 8 preset swatches. Common: brightness, types multi-check (MOTHERBOARD / KEYBOARD / MOUSE / DRAM), enabled.
- **RyujinPage**: scenes = hardware_monitor / off. Scene config: empty (chip's firmware drives content). Common: enabled. (Smallest tab — minimal v0.4 surface.)

### Dashboard page

Three rows:

1. **CPU + GPU large gauges** (RadialGauge widget, 230° arc, value in center) — each occupies 2 grid cols. Driven by 1 Hz timer reading psutil.cpu_percent / pynvml. Color of arc reflects threshold: cool < 60° green, warm 60-80° orange, hot > 80° red.
2. **Small cards row** — CPU FAN / CHASSIS_1 / CHASSIS_2 / MEMORY. RPM source from LHM; memory from psutil. Each card: label / big number / progress bar.
3. **Device status row** — Matrix / OLED / Aura / Ryujin pills showing scene + ● status dot. Clickable → navigates to that device's tab.

If LHM unavailable: fan cards show "—" + a one-line notice in the dashboard footer.

### Skin extensions

`skin.json` gains:

```json
{
  "layout": {
    "sidebar_width": 180,
    "main_padding_x": 26,
    "main_padding_y": 22,
    "card_radius": 8
  },
  "colors": {
    "sidebar_bg": "#0a0a0a",
    "active_bg": "#181818",
    "card_bg": "#161616",
    "card_border": "#242424"
  }
}
```

All have fallbacks in `skin.py:Skin.qss()` so the `claude` skin keeps rendering identically when these are absent. New QSS selectors added: `#sidebar`, `#sidebar a[active=true]`, `.scene-card`, `.scene-card[active=true]`, `.gauge`, `.metric-card`, `.metric-card[on=true]`.

### Data flow (one user interaction)

User clicks the "CPU TEMP" metric on OLED tab:
1. `MetricCard.clicked` → page handler → `state.update_device("oled", {"value_source": "cpu_temp"})`
2. `ServiceState.update_device` patches `OledConfig`, validates, bumps revision, schedules debounced YAML save, fires listeners.
3. OLED driver loop (independent thread) reads `state.snapshot()` next iteration, sees new `value_source`, renders new frame, sends to hardware, emits frame via `frame_emitter`.
4. UI's `LivePreviewWidget` for OLED receives signal, repaints with new bytes.
5. 2s later, `polylux.yaml` is rewritten.

UI never blocks on hardware. Drivers never block on UI. Both read/write through `ServiceState`.

## Testing

- Unit: `polylux/sensors/lhm.py` mocks WMI cursor + asserts parsed fan/temp readings (LHM service NOT required for tests).
- Unit: each page's `build_scene_config(scene)` returns expected widget tree; clicking a scene card calls `state.update_device` once with correct patch.
- Manual:
  - All 4 tabs open without exceptions when their respective device is disabled in config.
  - Switching scene on each tab updates `polylux.yaml` after 2s.
  - Live preview shows the exact bytes the hardware receives (verify by hand for matrix clock scene).
  - Dashboard gauges update every second; LHM absence shows the inline notice (test by stopping LHM service).
  - Skin selector in Settings tab swaps colors instantly without restart.

## Open questions (will not block implementation — Claude decides at coding time)

- OLED brightness protocol — need to verify `0xEC 0x14 <level>` works or if it's `0xEC 0x13`. If neither works, brightness slider becomes read-only with a `(firmware doesn't expose)` note.
- Ryujin tab content — v0.4 stays at hardware_monitor / off (matching current driver scope, niche per Vlad's "nu toata lumea are riujin"). Live test of custom_image upload (protocol decoded §9.3) is a v0.5 research path.
- Aura RGB types multi-check — must NOT default-enable keyboards/mice per §9.4.1. Default stays `("MOTHERBOARD",)`. Checking new types is opt-in with a tooltip warning about per-key control collisions.

## Migration / rollback

- v0.3 users on `claude` skin see no breaking change in their YAML — config schema is additive only.
- Rollback path: keep `polylux/ui/window.py` in git history one revision back; emergency revert is `git revert <new-ui-commit>` → service runs the old Winamp UI again.
- No data migration needed.
- `.gitignore` adds `.superpowers/` (brainstorming session content, regenerated per session).
