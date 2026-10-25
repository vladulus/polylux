# Next session — pick up here

> State as of 2026-10-25. `PROJECT_STATE.md` has the protocols (§9.2 OLED,
> §9.3 Ryujin, §9.4 fans/Aura/power-off) and the daemon (§17).

## Where things stand

  - **Armoury Crate and the whole ASUS stack are uninstalled** (25.10):
    AC service + app, AURA/AIOFan/Ambient HALs, GameSDK, ROG Live,
    Framework, AsusFanControlService, AsusCertService, update services,
    SONiX DDR, the AsIO3 / MsIo64 / SONiXDDR drivers, the `\ASUS\` tasks.
    Program folders left on disk. AC logs kept in
    `scratch/asus_reference/` (gitignored). Vlad still has to reboot and
    set BIOS "Download & Install ARMOURY CRATE app" = Disabled.
  - **The live app is the frozen build in `C:\Program Files\Polylux`.**
    Source changes reach it only through
    `installer\redeploy.ps1` (build → swap → relaunch, one UAC).
  - **Sensor daemon** (`tools/PolyluxSensorDaemon`, service, swapped by
    hand: build_sensor_daemon.ps1 then stop service / copy exe / start):
      - enforces requested fan duty against the chip readback (LHM only
        writes on change and drops writes when the ISA mutex is busy);
      - logs every correction with the NCT6798D mode/command/output
        registers to the Application Event Log (provider
        `PolyluxSensorDaemon`);
      - publishes VRM temperature from the ASUS EC (GLACIAL map, 0x3E).
  - **Fans**: 4 board headers (UPPER_R/LOWER_R/UPPER_L/LOWER_L = control
    0/2/1/3) + Ryujin pump / pump-head (VRM) fan / radiator fans as cards.
    Sources: cpu package, cpu core, gpu, motherboard (SYSTIN), liquid,
    vrm. Auto Tuning measures max RPM and start duty (`min_duty`) for every
    fan; calibration overrides are runtime-only.
  - **OLED / Matrix / Ryujin LCD / power-off dark state** work from
    Polylux (see PROJECT_STATE).

## Open items, in order

1. **Who writes the fan chip besides us.** Event Log on 25.10 showed
   foreign values both in manual mode (mode 0x00, cmd we never sent,
   following temperature) and switches to SmartFan (mode 0x40). Read the
   corrections after Vlad's reboot (ASUS stack + AsIO3 gone): none →
   it was ASUS software; still there → BIOS/EC, look at BIOS Q-Fan.
2. **Ryujin image/GIF display.** Uploads complete but the panel keeps
   the hardware monitor or refuses (`ec 7f 02`). AC's sequence after the
   upload (`SetProfile multi_media_player`) is in
   `scratch/captures/ryujin_files_USBPcap*.pcap` — decode it, no AC needed.
3. **Radiator fan staging.** Both radiator fans share one Ryujin PWM;
   staging needs one moved to a free board header (#5–#7) — Vlad's call.
4. **Installer** (`installer/Polylux.iss`) not rebuilt since July;
   `neutralize-asus.cmd` CRLF change uncommitted in an earlier session —
   check `git status`.

## Run modes

  - Installed: `C:\Program Files\Polylux\Polylux.exe --config %APPDATA%\Polylux\polylux.yaml`
  - From source: `.venv\Scripts\python.exe -m polylux.service --config %APPDATA%\Polylux\polylux.yaml`
    (single instance: close the installed one first)
  - Tests: `QT_QPA_PLATFORM=offscreen .venv/Scripts/python.exe -m pytest -q tests`

## Captures on disk (`scratch/captures/`, gitignored)

  OLED presets / brightness, Matrix S5, Ryujin (modes, files, pages,
  steps, warn, autotune), full init — named by subject, two USBPcap
  roots each.
