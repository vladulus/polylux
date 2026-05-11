# Next session — pick up here

> Read `PROJECT_STATE.md` **§15 first** — 2026-05-12 was the v0.3
> milestones day. UI shipped, RGB validated end-to-end, OLED scenes
> polished. Read §2 + §2b for the working agreement, then §15.

## TL;DR — what works as of 2026-05-12 (v0.3)

  - **Matrix:** clock / text / fill / off, 3x5 font, rotation 0/90/180/270.
  - **OLED:** hardware_monitor (cpu_pct / mem_pct / cpu_temp / gpu_temp via
    psutil+pynvml) / text (custom string) / preset_gif (factory ROM
    animations) / off. Q-Code removed from user scenes (BIOS POST only).
  - **Aura RGB:** delegated to OpenRGB. Default type filter is
    ("MOTHERBOARD",) — keyboards/mice never touched. Validated live on
    Vlad's Z690 Extreme with BIOS RGB enabled. Requires BIOS RGB on,
    same constraint as AC for now (override is v0.4+ research).
  - **UI:** PyQt6 native window, Winamp-style frameless skinnable, tray
    icon, debounced YAML autosave on changes. Default skin: `claude`
    (760x480, dark, Claude orange accent).
  - **Service:** `polylux/service/main.py` — Qt event loop + driver
    threads in one process. `kill_asus_stack` at startup (UAC fallback
    via temp .ps1, pre-checked so no UAC if services already stopped).

## Run modes

  - Full mode: `python -m polylux.service` (drivers + UI + tray)
  - Headless: `python -m polylux.service --headless` (Windows service)
  - UI dev: `python -m polylux.ui.app` (no drivers, just window)
  - No UAC: `python -m polylux.service --no-kill-asus`
  - Custom skin: `python -m polylux.service --skin claude`

## First action when you resume

Pick ONE of these (ordered by impact for v0.4 public launch):

1. **3 more skins** — `polylux/ui/skins/<name>/skin.json` + assets:
     - `winamp-classic` (LCD green retro tribute, mono Comic Sans? lol no
       — pixel font + green-on-black like classic Winamp 2)
     - `rog` (dark gaming red — for users transitioning from AC)
     - `cyberpunk` (purple/green retro-futur, terminal-ish)
   Each ~30 minutes if you already understand the skin format
   (`polylux/ui/skin.py` generates QSS from JSON).

2. **UI input polish** — currently scenes are dropdown-only. Add:
     - Color picker for matrix.color and aura_rgb.color
     - Text input for matrix.text (when scene=text)
     - Text input for oled.label + oled.value (when scene=text)
     - Value-source dropdown for oled (cpu_temp / gpu_temp / cpu_pct /
       mem_pct / static)
   This makes Polylux usable without ever editing YAML.

3. **Ryujin LCD driver** (chip 1988) — Vlad has Ryujin II 360, but it's
   niche per his "nu toata lumea are riujin". Optional but a nice
   feature for users who do have AIO. Wire protocol decoded in §9.3.
   Test if firmware bug (per OLED §9.2) applies to chip 1988 too —
   maybe it doesn't, since it's a different firmware.

4. **Installer + Windows service** — wrap with nssm so Polylux starts
   at boot, runs hidden, restarts on crash. Add `scripts/install.py`
   that detects venv, downloads OpenRGB portable, registers nssm
   service.

5. **v0.4 research: AC's BIOS RGB override**. Frida-hook
   LightingService.exe while AC enables RGB on a BIOS-disabled system.
   Look for `SetFirmwareEnvironmentVariableW`, asio driver IOCTLs,
   ACPI/WMI namespace calls. Replicate as admin-required "wake RGB"
   step in Polylux. Vlad wants this for full AC replacement.

## What Vlad does

  - Watches the matrix / OLED displays and reports observations
  - Toggles BIOS settings when needed (UAC consent, BIOS RGB on/off
    for tests)
  - Aesthetic / scope / product-direction taste calls
  - Will help with UI polish — color picker / theming feedback when
    iterating on skins

## What Claude has access to

  - `tools/OpenRGB/` (gitignored) — portable OpenRGB binary, run with
    `--server` for SDK on port 6742
  - `.venv/` with: PyQt6, pystray, fastapi (unused, can be removed),
    openrgb-python, scapy, pyusb, hidapi, psutil, pynvml, Pillow
  - `scratch/captures/` — USBPcap captures including dev 8 Aura RGB
    init sequence (used for §9.4.1 finding)
  - `polylux.yaml` — user config (Vlad's current state)

## Constraints to remember

  - Vlad's CLAUDE.md: no apologies, blunt, decide-don't-propose, no
    asking permission for technical paths
  - §2b: command-by-command for live investigation, refuse compromise
    on product scope, ec 42 01 matrix init suppresses OLED (send OLED
    first or reset _text_mode_armed)
  - §10b hardware safety: no firmware writes, no driver swaps without
    explicit consent, backup before mutate
  - "Polylux replaces AC" — every UI/feature decision flows from this

## Captures already on disk

  scratch/captures/matrix_p1.pcap          33 MB — matrix Apply on cold-boot AC
  scratch/captures/oled_custom_p1.pcap     64 MB — Aura RGB traffic (mislabeled)
  scratch/captures/oled_p1.pcap            13 MB
  scratch/captures/oled_anim_p1.pcap       29 MB
  scratch/captures/full_init_p1.pcap       19 MB — AC install + Ryujin preset Apply
  scratch/captures/full_init_p1_v2.pcap    51 MB — post-reboot init + OLED Apply
                                                   (turned out to be Q-Code Apply,
                                                   not Custom Image)

## Strategic context

Polylux is Vlad's monetization path (passive income from millions of
ASUS ROG users frustrated with AC). v0.3 should ship as soon as the
3 skins + UI inputs are polished. Public launch v0.4 needs:

  - Demo video showing AC removal -> Polylux install -> -290MB RAM win
  - Before/after screenshots
  - GitHub Sponsors + Buy Me a Coffee + Ko-fi links
  - Posts on r/ASUS, r/AsusROG, r/buildapc, Hacker News, ROG forum
  - Eventually MSI installer for non-tech users
