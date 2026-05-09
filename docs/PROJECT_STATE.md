# Polylux — Project State

**Last updated:** 2026-05-09

This document is the single source of truth for project state across sessions.
Anyone (Claude or human) starting a new session should read this **first**, then
the per-area docs in this folder.

---

## 1. Mission

Lightweight, free, open-source replacement for ASUS Armoury Crate. Drives ROG
hardware (Ryujin AIO LCD, motherboard LiveDash OLED, AniMe Matrix, Aura RGB)
without the bloat — no telemetry, no auto-updaters, no 700+ MB of background
services.

**Eventual goal:** publish on GitHub as a free tool with a Buy Me a Coffee /
GitHub Sponsors button. Branding: *"Claude's project, made by Claude for you."*

## 2. Ownership and process

- **Owner:** Vlad (vlad@impulsive.ro). Hardware in Romania.
- **Lead / architect / code author:** Claude.
- **Vlad's role:** "helping hands." He runs commands on his PC, watches the
  physical LCD/OLED for visual confirmation, exercises the Armoury Crate UI on
  request so we can capture live traffic. He does NOT make technical decisions
  — those are Claude's call. He DOES make taste / scope / aesthetic decisions
  for the final UX. License is MIT.
- **Communication:** Romanian with Vlad. Code/comments/docs in English.
- **Per `C:\Users\vlad\CLAUDE.md`:** no apologies, no flattery, no false
  validations. Direct technical disagreement when needed. Verify before action.

## 3. Hardware target (Vlad's PC, the development reference rig)

| Component | Identifier | Notes |
|---|---|---|
| Motherboard | ROG Maximus **Z690** Extreme | DeviceType `8` in ASUS terms |
| AIO | ROG **Ryujin II 360** | DeviceType `50` |
| Ryujin LCD | 320×240 portrait, 24-bit color | USB VID `0B05` PID `1988` |
| LiveDash OLED (on MB I/O shroud) | resolution unknown — needs USBPcap to confirm | USB VID `0B05` PID `1A21` ("OLED Controller") |
| AniMe Matrix (on MB cover, dot pattern) | not yet identified as separate USB PID — possibly multiplexed on PID 1A21 or via the Aura USB controller | Has 4 animation slots |
| Aura USB controller | RGB | USB VID `0B05` PID `18F3` |
| GPU | NVIDIA (model unspecified — use `pynvml` / `nvidia-smi`) | for stat overlay |

**Important hardware-side note:** Vlad has **disabled motherboard RGB in BIOS**.
He doesn't like blinkenlights. So Aura RGB control is a *non-goal* for v1 — we
don't need to drive RGB, we just need to leave it off. Don't reintroduce RGB
control as a feature without checking with him.

**Drives H: and I: are Vlad's CARD READER, NOT Ryujin storage.** Ryujin's
"USB storage" is internal-only (only writeable through the proprietary protocol);
it does not mount as a Windows drive letter. Don't propose writing slideshow
JPGs to drive letters.

## 4. The displays — what Vlad wants on each

| Display | Content |
|---|---|
| Ryujin II LCD (320×240 portrait) | The "Aura Blue" GIF (`C:\Users\vlad\Desktop\Aura Blue GIF - Aura Blue - Discover & Share GIFs.gif`, 498×498 square, 90 frames, dark hollow center) **scaled non-uniform** to portrait (Vlad confirmed: stretch only width, do NOT crop). A single big GPU temperature number rendered into the dark hollow center, color shifting white → yellow → red as temp rises. Eventually GIF speed reactive to GPU load. |
| LiveDash OLED (MB) | TBD with Vlad. He hasn't picked content for it yet. Default proposal: CPU temp / brand "ADA" / something minimal. |
| AniMe Matrix (MB) | Digital clock — HH:MM, refresh 1 Hz. He explicitly said "nu vreau mare lucru, doar ceasul digital" (just the clock). |
| Aura RGB | All off (already off in BIOS). |

The "boring HWiNFO-in-corners" layout was rejected — see decision log.

## 5. Architecture decision (Strategy C, locked in)

We **don't** reverse-engineer USB protocols ourselves. We use the ASUS
infrastructure that's already installed as a "frame server" for our content,
and replace only the bloated UI on top.

**Keep running** (~150 MB total):
- `LightingService.exe` (~80 MB) — owns the actual USB hardware
- `ArmourySocketServer.exe` (~3 MB) — the WebSocket bridge that loads
  the ASUS plugin SDK DLLs (`ArmouryAIOSDK.dll`, `ArmouryMBLedSDK.dll`)
  and exposes them on `ws://127.0.0.1:9013` (alert + command channel)

**Kill** (~500–700 MB freed):
- `ArmouryCrate.exe` (~290 MB) — the giant Electron UI
- `ArmouryCrate.UserSessionH...` (~83 MB) — UI helper
- `asus_framework.exe` × N (~50–80 MB) — additional Electron renderer processes
- `ArmouryCrate.Service.exe` (~170 MB) and possibly more — verify which are
  required vs. just bloat before killing

Polylux replaces the killed processes with a small Python service (~30 MB).

## 6. The wire protocol (decoded so far)

Source: beautified JS from
`C:\Program Files (x86)\ASUS\ArmouryDevice\View\2dfe216d-3481-4684-ad4d-2566bd7cfe4f\service.js`
(AIO service, ~13 000 lines). Saved beautified copies in
`scratch/aio_index_beautified.js`, `scratch/aio_service_beautified.js`,
`scratch/motherboard_index_beautified.js`. Re-beautify if ASUS pushes an update.

### Endpoints

| Connection | URL | Purpose | Auth |
|---|---|---|---|
| `nodeServer` | `ws://127.0.0.1:1042?role=deviceService&deviceType={type}&pid={modelNumber}&dongleSN=&deviceSN=` | Talks to asus_framework.exe (Electron main, framework events). | none observed |
| `socketServer` | `ws://127.0.0.1:9013` | Talks to ArmourySocketServer — **THIS is the hardware command channel**. | **none — plain WS** |
| logServer | `ws://127.0.0.1:9014?role=devicePageLogger&deviceType={type}&pid={modelNumber}` | Logs only. Currently appears to be down/refused on Vlad's box. | n/a |
| TLS port | `https://127.0.0.1:9012` | Same ArmourySocketServer process; TLS variant. Curl test returned 200 OK after schannel renegotiation, suggesting client-cert auth. **Don't bother — port 9013 is the plain version of the same thing.** | client cert |

`asus_framework.exe` also listens on `1043` and exposes Express on port `1042`
(plain HTTP). The `1042` Express server returned 404 + `helmet` headers in the
curl test, confirming plain HTTP. CSP allowed `127.0.0.1:*` and `api.giphy.com`
(used by the GIF picker in the UI).

The host can be overridden by passing `--host=` on the asus_framework.exe
command line. Default is `127.0.0.1:1042`.

### Outbound message format (client → server, on `socketServer`)

XML strings, built by xmlbuilder in the JS:

```xml
<root>
  <command>ConnectionOpen</command>
  <device>{modelNumber-uuid}</device>
</root>
```

Or for hardware actions, a nested form (from `mediaTransfer` in
`aio_index_beautified.js` line 853):

```xml
<root>
  <device_type key="AIO">
    <device key="{modelNumber}">
      <function key="MEDIA_TRANSFER">
        <settings>
          <media_transfer
            path="C:\Program Files (x86)\ASUS\ArmouryDevice\view\{relPath}"
            type="0|1|2|3"  <!-- 0=jpg 1=gif 2=avi 3=other -->
            index="{slot}"/>
        </settings>
      </function>
    </device>
  </device_type>
</root>
```

Client also sends a `sessionKey` per command for matching replies. **`sessionKey`
is a UUID generated client-side** (`nn.generateUUID()` in JS — Python should use
`uuid.uuid4()`). Server echoes the sessionKey on its reply. There is **no
handshake or token issuance** for sessionKey — generate locally per command.

### Inbound message format (server → client)

JSON strings. The aio service handles these commands explicitly:

- `GetDeviceProfileList`
- `GetDeviceProfile`
- `GetDeviceDescription`
- `IsNewDevice`
- (default: dispatched to `handleSocketServerEvent` for events)

The aio service also receives URI-encoded XML on its `nodeServer` connection
when ASUS framework pushes hardware events.

### Constants discovered

In `modules/aio/index.js`:

- `AIO_PANEL` — Ryujin II LCD
- `AIO2_PANEL` — Ryujin III LCD
- `AIO_LED` — RGB on AIO
- `AIO_MATRIX` — matrix on AIO (Ryujin doesn't have one — probably for newer AIOs)
- `MBLED` — motherboard LEDs
- `Matrix` — generic matrix
- `Oled` — OLED display
- `Headset` — USB headset

Function names sent to `ExecuteFunction` (the SDK plugin dispatcher) include:
`displayImage`, `bootImage`, `setControlMode`, `setFanSettings`,
`setLightingEffect`, `setLightingHardwarePlayer`, `setLigtingHardwarePower`,
`setLightingOff`, `setMatrixHardware`, `setMatrixLEDMode`, `setMatrixS0S5Mode`,
`getCpuTemp`, `getFanPumpRPM`, `getCroppedImage`, `getExternalImage`,
`getFreeSpaceSize`, `getLightingHardwareSensor`, `getAuraSyncModeStatus`,
`getConfig`, `deleteExternalImage`, `onApplyImageOrAnimation`,
`gif_player`, `led_player`, `led_player2`, `matrix_gif_player`,
`matrix_hw_monitor_player`, `multi_hw_monitor_player`, `multi_media_player`,
`text_player`, `fan_player`, `warning_player`.

### Player keys (in JS, `key:"..."` patterns)

`text_player`, `fan_player`, `multi_hw_monitor_player`, `multi_media_player`,
`warning_player`, `led_player`, `led_player2`, `matrix_hw_monitor_player`,
`matrix_gif_player`, `gif_player`, `image`. These are likely the named "modes"
on each device.

## 7. Filesystem layer

The aio module **writes files to disk** in
`{pathMapping.proj}\view\{output}\{uuid}.{ext}` and then dispatches commands
over WebSocket that reference that path. So the architecture is:

1. UI uploads media to Express endpoint (or Polylux writes file directly).
2. File lands at e.g. `C:\Program Files (x86)\ASUS\ArmouryDevice\view\externalFiles\aio\origin\{uuid}.gif`.
3. The aio service crops/converts to AVI via `dispatch(getCroppedImage)`.
4. AVI lands at `...\view\{output}\{uuid}.avi`.
5. `mediaTransfer` XML command is sent over WebSocket pointing at the AVI.
6. ArmourySocketServer → SDK plugin DLL → LightingService → USB → Ryujin LCD.

So we **don't need an Express upload step** — we can write our final file
directly to the filesystem and just send the `mediaTransfer` XML over WebSocket
ourselves. This skips the entire UI layer.

For Ryujin LCD playback the device *prefers AVI* (the JS checks
`devicePlayRequireAVI` capability). Need to determine: does our render pipeline
emit an AVI, or can we get away with GIF (`type="1"`) for the `mediaTransfer`?
Probably AVI — generate with `imageio` or `Pillow` + `ffmpeg-python`.

### AniMe Matrix is different — pre-rendered .bin files

Path: `C:\Program Files (x86)\ASUS\ArmouryDevice\View\E7C8DA76-C9B9-4297-8681-DD878330AFE7\externalFiles\`

Contents:
- `1.bin` (290 KB)
- `2.bin` (257 KB)
- `3.bin` (164 KB)
- `4.bin` (115 KB)
- `MBMatrixAnimationCreator.exe` (529 KB) — **ASUS's own tool that produces these .bin files.**

Plan: feed `MBMatrixAnimationCreator.exe` a known input (e.g. an animated GIF of
"12:34"), capture the .bin output, hexdump the first few hundred bytes, look for
header / framecount / dimensions / pixel-format markers. Possibly run the EXE
with `--help` first to see CLI args. If interactive-only, instrument with
ProcMon (Sysinternals) to see file I/O. The 4 sample .bin files give us 4
ready-made examples to compare formats across.

For a 1 Hz digital clock we don't even need 4 slots — we can rewrite a single
.bin file once per second and tell ArmourySocketServer to play that slot.

## 8. Current obstacle

Connecting to `ws://127.0.0.1:9013` from Python works (no auth, plain WS
handshake succeeds). Sending the obvious `<root><command>ConnectionOpen</command>
<device>{modelNumber}</device></root>` produces **no reply** within 6 seconds.

Hypotheses, in order of likelihood:

1. **XML schema is wrong** — server may want `<device_type>` wrapper, attributes
   instead of nested elements, namespaces, etc. Need to capture an actual
   working message between Armoury Crate UI and ArmourySocketServer to compare.
2. **Ports are reversed in my model** — `mn = ln.alertSocketServer = ws://127.0.0.1:9013`
   *was* in service.js, but `alertSocketServer` could mean "the server pushes
   alerts to me" (server → client only), not "I send commands here." The actual
   command port might be 9012 (TLS, needs cert) or even just back through
   port 1042. **Need to verify.**
3. **Subprotocol / Origin mismatch** — Python sets `Origin: http://127.0.0.1:1042`
   but server may require a specific WebSocket subprotocol header.

## 9. Next concrete steps (start here next session)

1. **Capture real traffic.** With Armoury Crate running, start a WebSocket
   passive listener (`scratch/probe_socket.py` adapted to listen-only) on port
   9013 *while* Vlad clicks something in the Armoury Crate Ryujin page (e.g.
   uploads a new slideshow image). Compare the bytes flying past with our
   guessed XML. **Vlad must do this physically — Claude can't.**
2. If 9013 sees no traffic during UI activity, repeat for 1042 and 9012 (the
   latter requires extracting the client cert from `asus_framework.exe` first
   — use `pefile` + `strings.exe` + binwalk).
3. Once we have a captured "good" XML message, replicate it byte-for-byte from
   Python and confirm a JSON reply.
4. From there, use `mediaTransfer` to push a known JPG to the LCD as smoke test.
5. Build the render pipeline (Aura Blue GIF + GPU temp text → AVI/GIF on disk →
   `mediaTransfer` XML over WS).
6. Tackle AniMe Matrix `.bin` format (separate, parallel work — see §7).
7. Tackle LiveDash OLED (probably analogous to LCD via `oled/imageOrAnimation`).
8. Wrap as Windows service (`pywin32` or `nssm`), auto-start.

## 10. Open questions for Vlad

- LiveDash OLED content choice (he hasn't decided). Suggest CPU temp default.
- Final Polylux UI — tray icon? web localhost UI? PyQt? (he said he'll help
  with UI when we get there)
- Whether to ship a single config.yaml or do a small PyQt config app.

## 11. Constraints / non-negotiables

- **MIT license.**
- **No telemetry.** Ever. The whole point.
- **Auto-start as Windows service** (Vlad has stated this requirement clearly).
- **Headless** — no UI window opens at boot. Tray icon at most.
- **Don't break Vlad's machine.** No BIOS changes, no driver swaps unless
  explicitly approved. Zadig / WinUSB driver swaps — only if every other path
  fails, and only with Vlad's explicit consent that session.
- **License compatibility:** we link against / talk to ASUS's services, but
  don't ship any of their binaries. No GPL contamination either way.

## 12. Decision log

| Date | Decision | Reasoning |
|---|---|---|
| 2026-05-09 | License = MIT | Maximum adoption for a community tool. |
| 2026-05-09 | Language = Python (v1) | Fast to iterate, big community. Possibly Rust for v2. |
| 2026-05-09 | Repo = private until v0.1 works, then public | Avoid attracting issues on broken code. |
| 2026-05-09 | Reject "stats in 4 corners" layout | Vlad's taste call — we use a single big number in the GIF's dark center. |
| 2026-05-09 | Use Aura Blue GIF (not the cosmic explosion one) | Already square (498×498), has a dark hollow center perfect for stats overlay. |
| 2026-05-09 | Non-uniform scale GIF to LCD aspect, NO crop | Vlad's preference; smoke/aura is organic enough that distortion is invisible. |
| 2026-05-09 | RGB = leave off (BIOS-disabled), don't build a controller | Vlad doesn't like lights. Removed from v1 scope. |
| 2026-05-09 | Reject slideshow-via-drive-letter approach | Ryujin doesn't mount as a Windows volume. |
| 2026-05-09 | Reject pure ctypes-on-SDK-DLL approach | DLLs are 7-export plugin shims (`ExecuteFunction` dispatcher). They need ArmourySocketServer running anyway. The WebSocket route is cleaner. |
| 2026-05-09 | Reject pure USB protocol RE | Estimated 1–2 days per device. Strategy C (use existing services) gets us to first frame in hours. |
| 2026-05-09 | Strategy C locked in | Use ArmourySocketServer + LightingService as backend. Replace only the UI bloat. ~80 % bloat eliminated. |

## 13. Reference paths

- Project root: `C:\Users\vlad\Desktop\Polylux`
- Beautified JS: `scratch/aio_index_beautified.js`, `scratch/aio_service_beautified.js`, `scratch/motherboard_index_beautified.js`
- Source GIF: `C:\Users\vlad\Desktop\Aura Blue GIF - Aura Blue - Discover & Share GIFs.gif`
- ASUS install root (32-bit): `C:\Program Files (x86)\ASUS\ArmouryDevice\`
- ASUS install root (64-bit): `C:\Program Files\ASUS\`
- Cross-session memory: `C:\Users\vlad\.claude\projects\C--Users-vlad-Desktop-restu\memory\project_ryujin_lcd.md`

## 14. Things Vlad explicitly told Claude

- "Asta este proiectul tău, eu doar te ajut cu ce ai nevoie."
- "Toate deciziile le iei tu, eu doar o să te ajut la UI și la orice ai nevoie."
- "Take the lead."
- "Scriem pe el `Claude's project, made by Claude for you`."
- "Nu-mi plac beculețele in PC."
- About speaking style: blunt, direct, technical disagreement when warranted,
  no apologies, no flattery.
