# Changelog

## v0.5 — 2026-05-17

Ship-ready Windows installer + fan PWM control + clean-room sensor
daemon. Daily-driveable on a Z690 Extreme.

### Added

  - **Headless sensor daemon** (`tools/PolyluxSensorDaemon/`) — C# /
    .NET 8 LTS Windows service wrapping `LibreHardwareMonitorLib`.
    Exposes `/data.json` (LHM-compat tree) and `/control/fan/<id>`
    (PWM write) on `http://127.0.0.1:8085`. Replaces v0.4's
    LHM-as-scheduled-task path so the system tray stays clean.
  - **Windows installer** (`installer/Polylux-Setup-<v>.exe`) —
    PyInstaller frozen Polylux + bundled `PolyluxSensorDaemon.exe` +
    OpenRGB portable, wrapped by Inno Setup. 77 MB compressed.
    One UAC at install, then auto-starts at logon forever.
  - **Fan PWM control** — per-fan AUTO / OFF / SILENT / MEDIUM / FULL
    / CURVE modes, 4-point editable curve driven by any temperature
    sensor, auto-discovery + auto-calibration on first install.
    Radial gauges with inline-editable fan names. Right-click a
    gauge to open the settings modal.
  - **ASUS stack neutralizer** (optional, default on) — disables
    AC services + scheduled tasks at install time. Reversible.
  - **Auto-launch + tray autostart** — installer launches Polylux
    minimized at end; HKCU Run key starts it minimized at every
    logon. Click the tray icon to open the window.
  - **Matrix bitmap clock fonts** — Bold 7 / Slim 7 / Mini 5,
    pixel-defined for the 7-row matrix. What you see in preview
    matches the panel 1:1 (no TTF scaling artefacts).
  - **Matrix text font picker** — dropdown across bundled (Asus Rog,
    Pixelya) + system fonts (Arial Bold, Consolas, Bahnschrift, …).
  - **♥ SUPPORT button** in the titlebar — links to Revolut.

### Changed

  - Brand: `Polylux` → `Claude's Polylux` (window title, tray tooltip,
    titlebar).
  - PyInstaller `console=False` + rotating file log at
    `%APPDATA%\Polylux\polylux.log` so closing a stray console
    window doesn't kill the app.
  - Config discovery prefers `%APPDATA%\Polylux\polylux.yaml` for
    installed mode (writeable without admin), falls back to bundled
    defaults.
  - Live preview LEDs render as squares (not circles) — closer to
    the physical panel.
  - Matrix image scroll: scales to fill the long axis preserving
    aspect, scrolls when the short side overflows.
  - Service install closes any running Polylux cleanly via
    `CloseApplications=force` before the file overwrite.

### Fixed

  - `MainWindow.closeEvent` now ignores + hides instead of letting
    Qt destroy the widget — close from taskbar / Alt-F4 / X button
    no longer takes the app down.
  - `WA_QuitOnClose=False` on MainWindow + FanSettingsDialog
    belt-and-suspenders against modal-dialog-quits-app bugs.
  - `kill_asus_stack` no longer downgrades `Disabled` services to
    `Manual` — the installer's lockdown survives Polylux launches.
  - `CREATE_NO_WINDOW` on every internal subprocess.run — no more
    cmd-window flashes at startup.
  - `faulthandler` + Python excepthook write to
    `polylux.crash.log` so silent vanishings finally produce
    diagnostics.
  - Use-after-free in Fans tab when a state listener destroyed a
    card while its event handler was still running.

### Known limits

  - `AsusCertService` re-enables itself shortly after the installer
    disables it (likely an internal ASUS watchdog inside the
    service binary). The actual blocker process
    `Aac3572MbHal_x86.exe` stays dead via the taskkill loop, so
    operational impact is nil. Mitigation tracked for v0.6.
  - Installer `.exe` is unsigned → Windows SmartScreen warning on
    first download. Code-signing cert tracked for v0.6.
  - Live preview uses a uniform grid; the physical Z690 Extreme
    matrix has a brick offset. Visual mismatch only — data is
    correct.

---

## v0.4 — 2026-05-14

Tabbed UI + live hardware integration. First version that feels like
one product instead of three coordinated apps.

  - PyQt6 sidebar shell, 1280×860, six tabs (Dashboard / Anime Matrix
    / OLED / Aura RGB / Ryujin LCD / Settings).
  - Dashboard with radial CPU/GPU gauges, fan RPM cards, memory bar.
  - Matrix: clock (independent colour + size) / text marquee / image
    or GIF / off, all with brightness + rotation.
  - OLED: hardware-monitor (SINGLE pick or ROTATE through metrics) /
    text / preset-GIF / off, uppercase rendering matching panel
    firmware.
  - Aura RGB: solid + off via OpenRGB SDK, MB-only by default.
  - Live preview frame-bus: each scene runner emits the last
    rendered bytes; UI widgets subscribe + repaint.
  - LibreHardwareMonitor + OpenRGB bundled and auto-started.

---

## v0.3 — 2026-05-12

UI + RGB validation + scene polish. Winamp-style single-page window.

  - Working Aura RGB via OpenRGB SDK; every OpenRGB mode exposed
    as a scene.
  - Matrix scene polish (clock, text, fill, image).
  - OLED scene foundations.

---

## v0.2 — 2026-05-10

Direct USB protocol breakthrough.

  - Chip 1A21 (the motherboard's USB-attached display controller)
    talked to directly via `usb1` — no AC, no driver.
  - AniMe Matrix LUT fully mapped (252-LED grid → byte positions).
  - OLED + matrix render pipelines decoded from USBPcap captures.

---

## v0.1 — 2026-05-09

Initial reverse-engineering tooling.

  - USBPcap capture analysis scripts in `scratch/`.
  - First successful matrix init sequence replay.
  - Project structure + driver plugin architecture defined.
