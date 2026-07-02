## Polylux v0.5 — first daily-driveable release

Open-source replacement for ASUS Armoury Crate on the ROG Maximus
Z690 Extreme + Ryujin II 360. Replaces ~700 MB of AC + AURA + AsusCert
+ Aac3572MbHal services with one tray app + one Windows service.

### Install

Download `Polylux-Setup-0.5.0.exe` (77 MB) and run it. One UAC prompt
for the whole install. Polylux launches in your tray immediately and
auto-starts at every logon afterwards.

The installer will:

1. Cleanly remove any prior Polylux install.
2. *(Optional, default on)* Disable the Armoury Crate / Aura /
   AsusCert services. Reversible from `services.msc`.
3. Install `PolyluxSensorDaemon` as a Windows service (LocalSystem,
   auto-start).
4. *(Optional, default on)* Add Polylux to Run-on-logon.
5. Create Start Menu + Desktop shortcuts.
6. Launch Polylux in tray.

### What's in v0.5

- **AniMe Matrix:** clock with 3 pixel-perfect bitmap fonts (Bold 7,
  Slim 7, Mini 5), scrolling text marquee with font picker, static +
  animated image scenes with auto-scroll, rotation, brightness.
- **LiveDash OLED:** hardware monitor (single or rotating metrics),
  custom text, preset GIF mode.
- **Aura RGB:** every OpenRGB mode as a scene, HSV picker, MB-only
  by default.
- **Fans:** per-fan AUTO / OFF / SILENT / MEDIUM / FULL / CURVE
  modes, 4-point editable curves driven by any temp sensor,
  auto-discovery + first-run calibration. Right-click a gauge to
  open settings.
- **Dashboard:** radial CPU/GPU gauges, fan RPMs, memory bar.

Full release notes in [CHANGELOG.md](https://github.com/vladulus/polylux/blob/main/CHANGELOG.md).

### SmartScreen

The installer is unsigned — Windows will show "Microsoft Defender
SmartScreen prevented an unrecognized app from starting." Click
"More info" → "Run anyway". Code-signing cert is on the v0.6
roadmap.

### Tested on

- ROG Maximus Z690 Extreme + 13th-gen Intel + NVIDIA GPU + 7 PWM
  fans on the Nuvoton NCT6798D SuperIO chip.

If you have a *different* ROG board and want Polylux to support it,
file an issue with a USBPcap capture of Armoury Crate driving the
device — most chips can be added in a single session of protocol
decoding once captures exist.

### Support

If Polylux saved you the 700 MB of AC bloat:

- **Revolut:** https://revolut.me/vladrev76 (UK / EU, zero fees,
  instant). Vlad runs the Z690 Extreme test rig.
- **Star the repo** — costs nothing, helps discoverability.

MIT licensed. Built with PyQt6, .NET 8, LibreHardwareMonitor, OpenRGB.
