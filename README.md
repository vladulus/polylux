<h1 align="center">Polylux</h1>

<p align="center">
  <strong>Open-source replacement for ASUS Armoury Crate.</strong><br>
  Drives ROG hardware without 700 MB of bloat.
</p>

<p align="center">
  <a href="https://github.com/vladulus/polylux/releases/latest"><img src="https://img.shields.io/github/v/release/vladulus/polylux?label=latest&color=C15F3C" alt="Latest Release" /></a>
  <a href="https://github.com/vladulus/polylux/stargazers"><img src="https://img.shields.io/github/stars/vladulus/polylux?style=flat" alt="GitHub Stars" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/vladulus/polylux" alt="MIT License" /></a>
  <a href="https://github.com/vladulus/polylux/releases/latest"><img src="https://img.shields.io/badge/platform-Windows%2010%20%2F%2011-blue" alt="Windows 10/11" /></a>
  <a href="https://revolut.me/vladrev76"><img src="https://img.shields.io/badge/support-Revolut-7e3aed" alt="Support on Revolut" /></a>
</p>

<p align="center">
  <a href="https://github.com/vladulus/polylux/releases/latest">Download</a> •
  <a href="./CHANGELOG.md">Changelog</a> •
  <a href="./docs/PROJECT_STATE.md">Architecture docs</a> •
  <a href="https://revolut.me/vladrev76">Support</a>
</p>

> **Claude's project.** v0.5 ships an end-to-end installer + Windows
> service + tray app. Daily-driveable on a ROG Maximus Z690 Extreme.
> If it saves you 700 MB of RAM and your sanity,
> [tip Vlad](https://revolut.me/vladrev76) — he runs the test rig.

A lightweight, native Windows app that drives ROG hardware — AniMe
Matrix, motherboard LiveDash OLED, Ryujin AIO LCD, Aura RGB, fan PWM —
without 700 MB of telemetry, auto-updaters, and background services.

```
Before: Armoury Crate + AsusCertService + Aac3572MbHal + ArmouryCrateService
        + Aura Service + LiveUpdate + LightingService          ≈ 700 MB RAM
After:  Polylux.exe + PolyluxSensorDaemon.exe                  ≈ 230 MB RAM
```

## Screenshots

<p align="center">
  <em>Tabbed UI, live previews, fan PWM control with radial gauges.<br>
  (Screenshots coming with the next push — the live app is what ships
  in <a href="https://github.com/vladulus/polylux/releases/latest">v0.5</a>.)</em>
</p>

## Status

**v0.5 — installer ships, daily-driveable.**

What's running end-to-end on a ROG Maximus Z690 Extreme:

  - **AniMe Matrix** — clock (3 bitmap fonts: Bold 7 / Slim 7 / Mini 5),
    scrolling text marquee (Arial Bold uppercase, font picker), static
    image / animated GIF (auto-scrolls when bigger than the panel),
    rotation 0/90/180/270, brightness, live preview that matches the
    physical panel.
  - **LiveDash OLED** — hardware monitor (CPU/GPU temp/load, fan RPM,
    memory) with single or rotating metric modes, custom text mode
    with horizontal scroll for long values, factory-preset GIF mode.
  - **Aura RGB** — every OpenRGB mode exposed as a scene (Static,
    Breathing, Spectrum Cycle, Rainbow, etc.), HSV colour picker,
    motherboard-only by default with explicit opt-in for keyboard /
    mouse / RAM.
  - **Ryujin LCD** — firmware-driven hardware monitor.
  - **Fan PWM control** — `tools/PolyluxSensorDaemon/` (C# / .NET 8
    Windows service) wraps `LibreHardwareMonitorLib.IControl`, exposes
    HTTP `POST /control/fan/<id>` so any client can set PWM 0-100% on
    any Super-IO fan header. Polylux UI presets: AUTO / OFF /
    SILENT (30%) / MEDIUM (60%) / FULL (100%) / CURVE (4 anchor
    points, linear interp against a temperature source). Auto-
    calibration on first run measures each fan's max RPM so the
    radial gauges scale correctly.
  - **Dashboard** — radial gauges (CPU + GPU temp), fan RPM cards,
    memory bar, per-device status row.
  - **Tray app** with auto-launch on install, auto-start at logon,
    proper close-to-tray.

What's tested:
  - ROG Maximus Z690 Extreme (motherboard with AniMe Matrix +
    LiveDash OLED + 7 PWM fan headers via Nuvoton NCT6798D)
  - Aura RGB on the motherboard controller
  - 73 Python unit tests green

What's not tested yet:
  - Ryujin II 360 custom image upload (protocol decoded but unverified)
  - Other ASUS motherboard models (only Z690 Extreme captures exist)
  - OLED brightness control + per-preset GIF selection (USBPcap
    research ongoing — see `docs/PROJECT_STATE.md` §15.9)

## Install

**One-liner** (PowerShell, downloads + runs the latest installer):

```powershell
irm https://raw.githubusercontent.com/vladulus/polylux/main/scripts/install.ps1 | iex
```

Or manual: download
[`Polylux-Setup-<version>.exe`](https://github.com/vladulus/polylux/releases/latest)
from Releases and run it. One UAC prompt for the whole install — never
again afterwards.

What the installer does:

  1. Uninstalls any prior Polylux cleanly (so every install produces
     a pristine `%PROGRAMFILES%\Polylux\` tree).
  2. *(Optional task, default on)* Disables the Armoury Crate
     service stack (`ArmouryCrateService`, `AsusCertService`,
     `AsusFanControlService`, `LightingService`, etc.). Fully
     reversible — re-enable from `services.msc`.
  3. Installs `PolyluxSensorDaemon` as a Windows service running
     as LocalSystem, auto-starting at boot. Zero further UAC
     prompts.
  4. *(Optional task, default on)* Registers Polylux to auto-start
     in your tray at logon via `HKCU\…\Run`.
  5. Adds a Start Menu + Desktop shortcut.
  6. Launches Polylux immediately in the tray so you don't have to
     reboot to start using it.

Build from source (developers):

```bash
git clone https://github.com/vladulus/polylux.git
cd polylux
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
python -m polylux.service                 # dev mode, no installer
# OR
.venv\Scripts\pyinstaller installer\polylux.spec --noconfirm
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer\Polylux.iss
# -> installer\Output\Polylux-Setup-<version>.exe
```

## Architecture

Two cooperating processes:

```
┌────────────────────────────────────────────────────┐
│   Polylux.exe   (PyQt6 tray app, user-mode)        │
│   ─────────────                                    │
│   - matrix/oled/aura/ryujin/fans drivers           │
│   - tabbed UI (Dashboard / per-device / Settings)  │
│   - reads sensors via HTTP from the daemon         │
│   - writes hardware via libusb / OpenRGB SDK       │
└──────────────────────┬─────────────────────────────┘
                       │ HTTP localhost:8085
                       ▼
┌────────────────────────────────────────────────────┐
│   PolyluxSensorDaemon.exe   (Windows service)      │
│   ──────────────────────────                       │
│   - wraps LibreHardwareMonitorLib                  │
│   - GET /data.json  → sensors (LHM-compat tree)    │
│   - POST /control/fan/<id>  → IControl write       │
│   - runs as LocalSystem (ring-0 access for         │
│     SuperIO fan control without UAC at runtime)    │
└────────────────────────────────────────────────────┘
```

Plugin-based core. Each device family is a separate driver module:

  - `polylux/drivers/anime_matrix/` — AniMe Matrix USB direct,
    bitmap clock fonts, image renderer
  - `polylux/drivers/livedash_oled/` — OLED hardware monitor scenes
  - `polylux/drivers/ryujin_lcd/` — Ryujin II/III LCD (320×240)
  - `polylux/drivers/aura_rgb/` — Aura RGB (delegates to OpenRGB SDK)
  - `polylux/sensors/` — LHM-tree parser + fan-control HTTP client
  - `polylux/service/` — main entry point, signal handling, runner
    threads, ASUS-stack neutralisation
  - `polylux/ui/` — PyQt6 frontend (tabbed window + system tray)
  - `tools/PolyluxSensorDaemon/` — the .NET 8 sensor daemon source
  - `installer/` — PyInstaller spec + Inno Setup script

Documentation:

  - `docs/PROJECT_STATE.md` — full architectural log, protocol
    decode notes, every shipped milestone (§1 → §19).
  - `docs/NEXT_SESSION.md` — pickup file for the next dev session.

## Status of the broader ASUS ecosystem

Polylux is a clean-room reverse engineering effort. Where ASUS ships a
driver / SDK we use it (OpenRGB, LHM). Where they don't, the USB
protocols were decoded from USBPcap captures of the AC stack.

The decoded protocols live in `docs/PROJECT_STATE.md` §6, §8, §9. Pull
requests to extend Polylux to other ROG motherboards are welcome —
typically all you need is a USBPcap capture of the manufacturer software
controlling the new hardware, plus a willingness to send single-frame
test commands to find the chip's command opcodes.

## Support

If Polylux saved you the headache of running AC:

  - **Revolut:** [revolut.me/vladrev76](https://revolut.me/vladrev76)
    (UK / EU, zero fees, instant). Vlad runs the Z690 Extreme test
    rig and burns the test cycles.
  - **Star the repo** — it costs you nothing and helps people find
    the project.
  - **Report breakage** with `polylux.crash.log` (in
    `%APPDATA%\Polylux\`) and we'll get to it.

## License

MIT. See `LICENSE`.
