# Next session — pick up here

> Read `PROJECT_STATE.md` **§18 + §18.7 first** — 2026-05-17 the v0.5
> Windows installer landed (PyInstaller + Inno Setup, 77 MB single-exe);
> §18.7 the same-day polish round (tray-only autostart via --minimized,
> Inno [Code] uninstall-prior-version, optional disable-ASUS-services
> task). §17 shipped the headless sensor daemon. Then read §2 + §2b for
> the working agreement, then §16 for v0.4 ship recap.

## TL;DR — what works as of v0.4 (2026-05-14)

  - **Tabbed UI** — Armoury-Crate-style sidebar shell, 1280×860,
    six tabs (Dashboard / Anime Matrix / OLED / Aura RGB / Ryujin /
    Settings). ENABLED toggle in each device's header.
  - **Matrix** — clock (3×5 native font or Arial Bold 6..16 px,
    independent color) / text (uppercase scrolling marquee, AC style,
    Arial Bold, configurable size + speed) / image (PNG/JPG/BMP/GIF,
    animated cycling, horizontal scroll for wide images) / off.
    Brightness 0–100 applied at color-scale / ImageEnhance time.
    Rotation 0/90/180/270.
  - **OLED** — hardware_monitor (SINGLE = pick one of 6 metrics or
    ROTATE = cycle through checked metrics every N seconds) / text
    (live label + value, scroll if > 16 chars) / preset_gif (chip-
    internal cycle) / off. All text uppercased to match panel firmware.
  - **Aura RGB** — solid / off scenes via OpenRGB SDK, MB-only by
    default; HSV color picker + 8 preset swatches.
  - **Dashboard** — CPU/GPU radial gauges (cool/warm/hot threshold
    colors), fan RPM cards (LHM), memory bar, per-device status row.
  - **Live preview** — every scene renders a matching preview in the
    UI, fed by the same bytes the hardware receives (frame-emitter
    architecture via `state.set_frame` / `add_frame_listener`).
  - **External services bundled** — LHM started by a scheduled task at
    logon (admin, one-time UAC); OpenRGB spawned as `--server` child of
    Polylux. Polylux quitting cleans up OpenRGB.

## Run modes

  - Full mode:  `python -m polylux.service` (drivers + UI + tray)
  - Headless:   `python -m polylux.service --headless`
  - UI dev:     `python -m polylux.ui.app` (window only, no drivers)
  - No UAC:     `python -m polylux.service --no-kill-asus`
  - Custom skin: `--skin <name>`

## First action when you resume — pick ONE

Ordered by impact for v0.5 public launch.

1. **~~Custom headless sensor daemon~~ — DONE 2026-05-17 (§17).**
   `tools/PolyluxSensorDaemon/` is built, tested, wired into
   `polylux/service/external.py`. Vlad still needs to run
   `tools/install_sensor_daemon_service.ps1` elevated once to register
   the Windows service and verify live sensors. Until then the
   subprocess fallback runs (dev mode).

2. **~~Installer~~ — DONE 2026-05-17 (§18).** PyInstaller + Inno
   Setup. `installer/Polylux.iss` produces a 77 MB
   `Polylux-Setup-0.5.0.exe`. One UAC. Auto-starts at boot. Bundles
   sensor daemon + OpenRGB. Service install + uninstall fully wired.
   Verified end-to-end on the Z690 Extreme. Remaining polish:
   code-signing cert (SmartScreen), `console=False` after file
   logger lands, clean `polylux.yaml.default` separated from dev
   working copy — see §18.6.

3. **OLED protocol research** — now the top remaining v0.5 item.
   Capture session with AC:
   - Switch OLED through all 6 factory presets while USBPcap captures
     → decode the per-preset selector opcode
   - Move AC's brightness slider while capturing → confirm or correct
     the speculative `ec 51 14 <level>`
   - Once decoded, restore the OLED brightness + preset_index UI
     controls in `polylux/ui/pages/oled.py`.

4. **Ryujin custom_image live test**. Upload protocol decoded in §9.3
   (chip 1988, 358× 4096B bulk, GIF89a 320×240). Live behavior never
   tested. Plug an image upload through Polylux, see if the display
   actually changes or if there's an analogous firmware bug to OLED's.
   If it works → add a Ryujin "image" scene similar to matrix's.

5. **AC BIOS-RGB override research** (the long-tail item from
   §15.9). Frida-hook `LightingService.exe` while AC turns RGB on with
   BIOS RGB disabled. Find the WMI / ACPI / asio driver IOCTL call
   path. Replicate in Polylux as an admin-required "wake RGB" step
   for users with BIOS RGB off.

6. **Polish backlog** (one-tap quick wins, in priority order):
   - Resizable window — drop the fixed-size, let user resize. Needs
     QSS revamp (currently absolute pixels everywhere).
   - 3 more skins — winamp-classic / rog-red / cyberpunk.
   - More fonts in matrix — let user pick from a system-font dropdown
     in the TEXT scene config (we already have the `_matrix_font(size)`
     hook; add a `font_family` param + persistence).
   - Settings tab v0.5 polish — autostart toggle (HKCU Run key),
     language picker (en/ro), light theme variant.

## What Vlad does

  - Runs the live UI, photographs the OLED / matrix when something
    doesn't match
  - UAC approvals when needed (admin-elevated PowerShell scripts)
  - Aesthetic / taste calls (which font, which color, what looks AC-like)
  - Will help capture USBPcap when we get to OLED protocol decoding

## What Claude has access to

  - `tools/PolyluxSensorDaemon/` (committed source, gitignored
    bin/obj/publish) — C# / .NET 8 LHM-lib wrapper. Build with
    `tools/build_sensor_daemon.ps1`, install as a Windows service
    with `tools/install_sensor_daemon_service.ps1` (elevated). v0.5
    replacement for the v0.4 LHM scheduled-task path.
  - `tools/LibreHardwareMonitor/` (gitignored) — LHM 0.9.6 portable;
    daemon NuGet-references the lib but the bundled exe is now legacy
    once the sensor-daemon service is installed.
  - `tools/OpenRGB/OpenRGB Windows 64-bit/` (gitignored) — OpenRGB
    portable, started as subprocess by `polylux.service.external`
  - `tools/nssm.exe` — tried for LHM-as-service, doesn't work with the
    GUI binary but available for future use
  - .NET 8 SDK auto-installed per-user at
    `C:\Users\vlad\AppData\Local\Microsoft\dotnet\` (8.0.421)
  - `.venv/` with PyQt6, pystray, fastapi, openrgb-python, scapy,
    pyusb, hidapi, psutil, pynvml, Pillow, wmi, pytest-qt

## Constraints to remember

  - Vlad's CLAUDE.md: no apologies, blunt, decide-don't-propose, no
    asking permission for technical paths
  - §2b: command-by-command for live investigation, refuse compromise
    on product scope, ec 42 01 matrix init suppresses OLED (send OLED
    first or reset `_text_mode_armed`)
  - §10b hardware safety: no firmware writes, no driver swaps without
    explicit consent, backup before mutate
  - §9.2: OLED Custom Image upload blocked by firmware bug — never
    expose as a scene
  - §9.4.1: Aura RGB default types is `("MOTHERBOARD",)` — adding
    KEYBOARD / MOUSE clobbers per-key effects, must show warning
  - "Polylux replaces AC" — every UI/feature decision flows from this

## Captures already on disk

  scratch/captures/matrix_p1.pcap          33 MB — matrix Apply cold-boot AC
  scratch/captures/oled_custom_p1.pcap     64 MB — Aura RGB (mislabeled)
  scratch/captures/oled_p1.pcap            13 MB
  scratch/captures/oled_anim_p1.pcap       29 MB
  scratch/captures/full_init_p1.pcap       19 MB — AC install + Ryujin preset Apply
  scratch/captures/full_init_p1_v2.pcap    51 MB — post-reboot init + OLED Apply

  Missing for v0.5: OLED preset-switch capture, OLED brightness
  capture, Ryujin custom_image live attempt.

## Strategic context

v0.4 is the first user-facing version that actually feels like a
product. v0.5 launch needs:

  - Custom sensor daemon → no tray pollution
  - Installer → one-click setup
  - GitHub Sponsors + Buy Me a Coffee + Ko-fi links
  - Demo video showing AC removal → Polylux install → -290 MB RAM win
  - Before/after screenshots
  - Posts on r/ASUS, r/AsusROG, r/buildapc, Hacker News, ROG forum
  - Eventually MSI-installer-style polish for non-tech users
