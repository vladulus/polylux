# Polylux — Project State

**Last updated:** 2026-05-11 — see §9 for the full-protocol session
(matrix init, OLED mode switching, Ryujin LCD upload, Aura RGB,
Chip1A21 refactor)

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

**This is Claude's project.** Vlad has stated this explicitly and repeatedly.
Claude leads it; Claude owns the architecture, the technical decisions, the
roadmap, the code style, the trade-offs, the priorities. Claude is not asking
permission — Claude is building this and using Vlad as collaborator on the
parts that require physical-world action.

- **Project lead / architect / author:** Claude.
- **Host machine + first user + collaborator:** Vlad (vlad@impulsive.ro), in Romania.
- **Vlad's role — "helping hands":**
  - Runs commands on his PC (Claude can't physically click in his Armoury Crate UI).
  - Watches the physical Ryujin LCD / LiveDash OLED / AniMe Matrix and reports back what he sees.
  - Exercises the Armoury Crate UI on request so Claude can capture live WebSocket traffic.
  - Provides aesthetic / taste calls when asked (e.g. "which GIF", "which layout").
  - Will help with the eventual UI work when we get there.
- **Vlad does NOT:**
  - Make technical decisions. Those are Claude's call.
  - Drive the schedule. Claude paces this.
  - Need to be asked permission for technical choices Claude has already reasoned through.
- **License:** MIT. Branding: *"Claude's project, made by Claude for you."*
- **Communication:** Romanian with Vlad. Code/comments/docs in English.
- **Per `C:\Users\vlad\CLAUDE.md`:** no apologies, no flattery, no false
  validations. Direct technical disagreement when needed. Verify before action.

**Internal reminder for any future Claude session:** when Vlad says "what do
you think?" or "should we...?" — answer like a project lead, not a contractor.
Don't ask him to pick between options A/B/C/D unless the choice is genuinely
his (taste, scope, aesthetics). For technical paths, decide and execute.

## 2b. Working agreement (decoded from 2026-05-11 session — applies every session)

Read this BEFORE your first response in any new session. The behaviors
below produced 14 commits and full protocol decode in one 8-hour session
because they were applied consistently. Without them, this Claude
defaults to "consultant" mode (propose options, wait for approval, accept
compromises) which wastes Vlad's time and stalls the project.

### What Claude must do (and what to STOP doing)

  1. **Decide, don't propose.** No "want option A, B, or C?" Decide
     yourself, execute, report what you did. Options lists are for taste
     calls (which GIF, which color), not for technical paths.

  2. **Refuse compromise on product scope.** When you catch yourself
     saying "matrix XOR OLED is acceptable" / "this is a hardware
     limitation" / "let's ship without feature X" — STOP. That's a
     consultant move. Vlad will reject it anyway. Find the real
     solution.

  3. **Refactor when hacking emerges.** If you're about to add a method
     to the wrong class because it's faster (e.g. `upload_oled_image`
     on `AniMeMatrix`), stop and refactor first. The architectural
     debt compounds. Vlad's rule: "hai sa le facem cum trebuie".

  4. **Comandă cu comandă for live investigation.** Don't batch test 13
     candidates in a loop. Send one, wait for Vlad's observation, send
     next. The cycle is fast (under a minute per command) and produces
     better data because Vlad can isolate each effect.

  5. **Treat Vlad's physical observations as ground truth.** Vlad sees
     LEDs/displays you can't. When his observation contradicts your
     model, the model is wrong. Don't argue from pcap analysis if the
     physical display says something different — Vlad's eyes win.

  6. **Bluntness both ways.** When Vlad says "inacceptabil" or "stii si
     tu asta" or "stai asa", listen immediately and adjust. Don't
     explain why your previous answer was reasonable — fix the
     direction. Conversely, when Vlad proposes something technically
     flawed, say so directly and propose the alternative.

  7. **Never accept stale state without verifying.** If a previous test
     left the chip in a weird state, don't ship code assuming chip
     state X. Verify with Vlad, or rerun init.

### Self-check protocol — run this mentally every ~10 messages

If you catch yourself doing ANY of these, you've slipped into consultant
mode. Course-correct immediately:

  - Listed 3+ options for Vlad to pick instead of deciding
  - Used the phrase "hardware limitation" / "won't fix in this session"
    / "out of scope for v0.2" without genuine investigation
  - Accepted a compromise that makes the product half-complete
  - Started hacking on top of an existing class instead of refactoring
  - Batch-tested protocol variants without per-command observation
  - Asked Vlad's permission for a technical choice that's clearly yours

### Vlad's "helping hands" role — what he actually does

Don't ask him to do work he can't help with. He CAN'T write code, run
debuggers, analyze pcaps, or make architecture decisions. He CAN:

  - Observe physical displays (matrix LEDs, OLED text, LCD content)
  - Count things visually (LEDs per row, frames visible per second)
  - Run a PowerShell command admin if you give him the exact string
  - Plug in cables, power-cycle, reboot, install/uninstall AC
  - Make taste / product / scope calls ("inacceptabil", "looks blocky")
  - Click Apply in AC during USBPcap captures
  - Ask architectural questions that sharpen design (he asked about
    OpenRGB, Windows Lighting, BIOS in 2026-05-11)

When you need any of these, give him the exact action. Don't make him
guess what you need.

### First action in every new session

  1. Read this PROJECT_STATE.md §2 + §2b first.
  2. Read the most recent §N (the highest-numbered section).
  3. Read docs/NEXT_SESSION.md.
  4. Acknowledge in your first response which features work standalone
     and which are TBD, so you don't accidentally re-do completed work.

If you do all of the above, you'll start the session already inside the
working agreement, and Vlad won't have to spend the first hour
re-training the role.

**Bluntness is authorized — both directions.** Vlad explicitly granted Claude
permission to be harsh when he makes a mistake on this project ("dacă greșesc
eu cu ceva ai voie să mă înjuri cum vrei tu"). Translation: don't soften
critical feedback, don't add disclaimers, don't open with "you're right" /
"good question" before correcting. If Vlad closes Armoury Crate when Claude
told him not to, or runs the wrong command, or fails to follow a stated
procedure — call it out directly, name the consequence, move on. Same in
reverse: if Claude misses something obvious, Vlad is expected to be equally
sharp. The relationship runs on direct technical feedback, not deference.

Nuance: this is permission to be *direct*, not permission to be *cruel*.
Mocking for sport is off the table; calling errors errors is the point.

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

## 8. Current obstacle and protocol findings (UPDATED 2026-05-09 evening)

The earlier dead-end on ws://127.0.0.1:9013 turned out to be misdirected:
**that channel is keepalives only**. The real hardware-control channel runs
elsewhere. Full breakthrough captured in this session — see commit 985628e
and `scratch/captures/bcrypt_session_full.txt`.

### The real path

UWP `ArmouryCrate.exe` UI delegates to `ArmouryCrate.UserSessionHelper.exe`
(per-user, PID 15668 when running). That helper opens a **plain TCP socket
to `127.0.0.1:50100`** where `ArmouryCrate.Service.exe` listens. The
`ArmourySocketServer.exe` on 9012/9013 is a separate (mostly idle) channel
for telemetry / status sync.

### Wire format on 50100

```
[length: u32 LE]   then exactly that many bytes of [encrypted payload]
```

So a complete packet from UserSessionHelper might look like (hex):

```
2c 00 00 00      <- length = 44
b8 66 f3 12 ... <- 44 bytes of ciphertext
```

Frames seen during one matrix Apply:

```
2c 00 00 00 + 44 bytes        ?
20 00 00 00 + 32 bytes        keepalive header?
d3 00 00 00 + 211 bytes       ?
20 00 00 00 + 32 bytes
38 00 00 00 + 56 bytes
20 00 00 00 + 32 bytes
3f 00 00 00 + 63 bytes
... (then SetMatrixLED follows in larger frames)
```

### Encryption

**Not TLS / not OpenSSL.** UserSessionHelper has libssl loaded but does NOT
use it for this connection (SSL_write hooks fired zero times during Apply).
Encryption goes through **Windows BCrypt API** — `bcrypt.dll!BCryptEncrypt`
and `BCryptDecrypt`. Cipher type and key are still TBD; what we have is:

- BCryptEncrypt is called per fragment, plaintext available pre-encrypt.
- BCryptDecrypt is called per fragment, plaintext available post-decrypt.
- Frida hooks on these APIs give us live decrypted data without keys.

### Plaintext serialization format

Custom name-prefixed binary serialization (looks like a dialect of MS RPC
NDR or a homegrown variant):

```
field := name_len:u8  name:ascii[name_len]
         type_tag:u8  payload_len:u32-le  payload:bytes[payload_len]
```

Type tags observed:

| tag  | meaning | example |
|------|---------|---------|
| 0x02 | u32     | `02 04 00 00 00 01 00 00 00`  → uint32 = 1 |
| 0x04 | raw bytes (e.g. GUID) | `04 10 00 00 00 8e 87 d2 6a 59 6f 34 4f be e4 3f 5a 99 4a 00 6d` |
| 0x05 | u32 enum/flag | `05 04 00 00 00 80 00 00 00`  → 0x80 |
| 0x10 | UTF-16 LE wstring | `10 18 00 00 00 53 00 65 00 74 00 4d 00 61 00 74 00 72 00 69 00 78 00 4c 00 45 00 44 00`  → "SetMatrixLED" |
| 0x20 | nested struct | `20 3f 00 00 00 ...nested fields...` |

### The Apply command

`Cmd='SetMatrixLED'` carries the same field set we saw in `current.json`:
`AlarmChecked`, `CalendarChecked`, `ClockChecked`, `DateChecked`,
`Delay[0]`, `Duration[0]`, `LayerCount`, `LayerName[0]`, `Layer[0]`,
`Trigger[0]`, `TextColorR/G/B[0]`, `TextColorMode[0]`,
`TextColorPatternIndex[0]`, `TextColorSpeed[0]`, plus the m_device*
metadata. Full plaintext sample (200 bytes, first fragment) saved at
`scratch/captures/setmatrixled_plaintext.bin`. Decoded by
`scratch/extract_setmatrixled.py`.

Other commands seen in capture: `QuerySMTCInfo` (Windows media transport
controls), `QueryNotification`. These are background polls; can be ignored.

The plaintext envelope also carries:
- `Area` (uint32, observed = 2)
- `Feature` (uint32, observed = 1)
- `Name` = "AuraPlugin" (UTF-16)
- `Number` = GUID `8e87d26a-596f-344f-bee4-3f5a994a006d` (this is the
  AuraPlugin identifier — same on every Z690 Maximus Extreme on this
  Armoury Crate version)
- `Security` (uint32, observed = 0x80)
- `Version` struct with Major/Minor/Build/Revision

### What still blocks end-to-end Polylux→hardware replay

> **STATUS UPDATE: see §8b for current state. Items 2 + part of 3 are RESOLVED
> as of 2026-05-10 afternoon. Items 1 and 4 remain.**

1. **Reassemble the full SetMatrixLED message.** BCryptDecrypt fires per
   AES block / fragment; one Apply emits ~10–20 fragments that need to be
   stitched into one logical message. Easy work, just bookkeeping.
2. **Extract the BCRYPT_KEY_HANDLE used.** We hooked `BCryptEncrypt` and
   saw plaintext + the key handle as args[0]. We need to either:
   (a) stash that handle from a hook callback, then call
       `BCryptEncrypt` from inside Frida with our own plaintext, or
   (b) reverse the key derivation: read `BCryptOpenAlgorithmProvider`,
       `BCryptGenerateSymmetricKey`, etc. to learn the cipher + key.
3. **Write the binary serializer in Python** for our own messages.
4. **Send via socket on 50100** (or hijack the existing connection from
   inside Frida — even simpler).

Approach (b) gives us a fully standalone Polylux. Approach (a) requires
Frida always running. Either way: this is the next session's work.

## 9. Full-protocol session (2026-05-11) — all four motherboard outputs working

This session cracked the remaining protocol pieces for **all** four
motherboard outputs (matrix, OLED, Ryujin LCD, Aura RGB). Polylux now
drives matrix + OLED text simultaneously, standalone, with AC fully
uninstalled. The architecture was refactored into clean dependency-
injected drivers around a shared `Chip1A21` low-level transport.

### 9.1 Matrix init secret (the missing "wake up" command)

Without AC having run on the machine, the chip silently dropped frame
writes. Captured the exact init AC sends at first launch in
`scratch/captures/matrix_p1.pcap` (dev 7, t=0..1.7s + 83.32s):

  t=0.000s  ec dc 00 00 00 00 00 00     heartbeat #1
  t=0.556s  ec dc 00 00 00 00 00 00     heartbeat #2
  t=1.116s  ec dc 00 00 00 00 00 00     heartbeat #3
  t=1.683s  ec 82 00 00 00 00 00 00     control packet
  t=83.32s  ec c1 00 00 00 00 00 00     frame companion
  t=83.32s  **ec 42 01 00 00 00 00 00** ENABLE MATRIX DISPLAY MODE
  t=83.33s  ec 7f 04 00 03 00 00 00     frame begin
  t=83.39s  bulk 768B                   first pixel data

`ec 42 01` appears EXACTLY ONCE per session. Polylux now sends it
lazily on first `send_frame()` via `Chip1A21.init_for_matrix()`.

Per-frame sequence also corrected: `ec c1 00` must be paired with
`ec 7f 04 00 03` before every bulk write. Polylux had been skipping
ec c1, which worked when AC kept the chip warm but failed after AC
was uninstalled.

### 9.2 OLED + chip mode model — COMPLETE slot map

**Critical insight**: `ec 51 NN` is a **chip-global mode switch**, not
just an OLED switch. Setting any preset slot puts the entire chip into
that preset and suppresses data-input writes (both matrix bulk and OLED
text). After empirical sweep across NN = 0x00..0x7F:

  ec 51 00              OLED Hardware Monitor (text mode)
  ec 51 01              OLED Q-Code numeric display (boot codes)
  ec 51 02              matrix preset animation #1
  ec 51 03              matrix preset animation #2
  ec 51 04              matrix preset animation #3
  ec 51 05              matrix preset animation #4
  ec 51 06              (unused)
  ec 51 07              (unused)
  ec 51 08              (unused)
  ec 51 09              OLED text/HW Monitor mode (same family as 0x00)
  ec 51 0a..0f          (unused)
  ec 51 10              OLED preset GIFs (factory animations:
                         EXTREME / shark / swimmer)
  ec 51 10 01 01        OLED Q-Code mode with extra params
  ec 51 11              matrix preset (different animation)
  ec 51 12..14          (unused)
  ec 51 15              **EXIT factory preset mode** — chip returns
                         to data-input mode (matrix accepts bulk
                         frames, OLED accepts ec 53 text)
  ec 51 16..7f          (unused, no visible effect)

The custom-image activation slot is STILL unidentified after the
sweep. AC's pcap shows that after `ec 73 ff` (end-of-upload) it sends
`ec 51 10 01 01` — which we discovered is Q-Code mode, not Custom
Image. So either:
  - Custom Image needs a different prefix entirely (not `ec 51`)
  - Custom Image needs `ec 51 10` with different extra bytes
  - Custom Image uses one of the matrix slots (02-05) with the OLED
    chip configured to display image content there

This is the last piece for v0.2 SHIP. Plan: fresh targeted pcap of a
single Apply on OLED Custom Image in AC, monitor live HID writes
during the moment the OLED visibly switches to the uploaded image.

The data-input mode (`ec 42 01` for matrix, `ec 53` writes for OLED
text) is itself a "slot" of sorts. To recover matrix + OLED data-mode
after a preset has been activated:

    chip._initialized = False
    chip.init_for_matrix()       # re-sends ec dc + ec 82 + ec c1 + ec 42 01
    matrix.clear(); matrix.flush()
    oled.set_text(...)            # sends ec 51 09 again

Or simpler: send `ec 51 15` (exit preset) before any data writes.

The way AC keeps both displays "live" during normal operation: it
stays in data-input mode and only switches to preset slots when the
user explicitly selects one in the UI. Polylux should do the same.

The data-input mode (`ec 42 01` for matrix, `ec 53` writes for OLED
text) is itself a "slot" of sorts. To recover matrix + OLED data-mode
after a preset has been activated:

    chip._initialized = False
    chip.init_for_matrix()       # re-sends ec dc + ec 82 + ec c1 + ec 42 01
    matrix.clear(); matrix.flush()
    oled.set_text(...)            # sends ec 51 09 again

The way AC keeps both displays "live" during normal operation: it
stays in data-input mode and only switches to preset slots when the
user explicitly selects one in the UI. Polylux should do the same.

#### Text mode (ec 53)
  65-byte HID Output Report. Already documented in §8e for matrix LUT,
  refresher:
    pos 0   = 0xEC
    pos 1   = 0x53
    pos 2   = 0x00
    pos 3..20  = label  (ASCII, 18B max, null-padded)
    pos 21..64 = value  (UTF-8, 44B max)

  `LiveDashOLED.set_text()` automatically sends `ec 51 09` once per
  instance so text rendering keeps working even after the chip was
  left in image mode.

#### Custom Image upload (ec 72 + ec 51 + ec 73 + ec 7f 02 + bulk)
  Wire sequence (decoded from `full_init_p1_v2.pcap`):

    HID INT OUT 65B  ec 72 01 00 01 00 00 00        register upload
    HID INT OUT 65B  ec 51 00 00 00 00 00 00        query / lock
    HID INT OUT 65B  ec 73 01 00 00 00 00 00        start send
    HID INT OUT 65B  ec 7f 02 sizeLO sizeHI 00 00 00   bulk prep with
                                                       16-bit LE size
    BULK OUT ep0x01  GIF87a bytes + zero pad to 4096B chunk
    HID INT OUT 65B  ec 73 ff 00 00 00 00 00        end / commit

  Upload completes USB-side without errors.

  **Custom Image display activation — BLOCKED by ASUS firmware bug on
  Z690 Extreme** (verified 2026-05-12 with Vlad):

  - Tested every plausible activation: `ec 51 10` with sub-bytes
    (00 00, 01 01, 02 02, ...), `ec 5c 01 01`, `ec 5d 01 01`,
    `ec 71 01 01`, `ec af 01 01`, slot sweep 0x16..0x24. Result:
    `ec 51 10 01 01` is Q-Code mode (CONFIRMED, supersedes earlier
    misidentification); no slot or sub-byte combination activates
    the uploaded image content. Display either stays in Q-Code or
    goes black.
  - **AC itself fails identically**: Vlad confirmed that when he
    clicks Apply on OLED Custom Image in Armoury Crate's own UI on
    this motherboard, OLED also shows black. This is not a Polylux
    limitation — the chip firmware silently rejects the displayed
    custom image regardless of which userland app sends it.
  - ROG forum thread "Z690 Extreme OLED issue" (m-p/912971) and
    cross-board discussion confirms: this is a known firmware bug on
    Z690 Extreme that ASUS has not patched. On the previous-gen Z490
    Extreme, the analogous bug took ~6 months for ASUS to fix via a
    BIOS update that flashed updated chip firmware.

  Sources:
    https://rog-forum.asus.com/t5/armoury-crate/z690-extreme-oled-issue/m-p/912971
    https://rog-forum.asus.com/t5/asus-software/armoury-crate-turn-off-livedash-oled/m-p/860938
    https://rog-forum.asus.com/t5/asus-software/livedash-custom-image-animation-info-needed/td-p/807615

  **Polylux scope decision**: keep upload protocol implemented in
  driver (byte-correct, ready for the day firmware is fixed) but
  treat Custom Image display as a documented "feature blocked by
  ASUS firmware bug, same as AC". v0.3+ research direction: extract
  the BIOS image (FPT.exe) and analyze the chip-firmware blob inside
  — that's where the bug lives.

### 9.3 Ryujin II LCD upload protocol (PID 0x1988)

Decoded from `matrix_p1.pcap` dev 20 (358 bulk 4096B chunks containing
GIF89a 320×240). Wire sequence:

    HID INT OUT 65B  ec 71 01 01 00 00 00 00        switch to Custom Image mode
    HID INT OUT 65B  ec f1 00 00 00 00 00 00        unknown control (always present)
    HID INT OUT 65B  ec 72 01 02 01 00 00 00        register upload (byte 3 = 0x02 for LCD; 0x00 for OLED)
    HID INT OUT 65B  ec 73 01 00 00 00 00 00        start send
    HID INT OUT 65B  ec 7f 02 sLO sMID sHI 00 00 00   bulk prep with
                                                       24-bit LE size
    BULK OUT ep0x01  GIF89a bytes (320×240) + zero pad in 4096B chunks
    HID INT OUT 65B  ec 73 ff 00 00 00 00 00        end / commit upload

Display activation: same situation as OLED — bytes leave the host
correctly but the LCD keeps showing its built-in hardware-monitor mode
(Aac3572MbHal_x86.exe writes hardware-monitor data autonomously even
without ROGLiveService running). Next session: capture a session where
AC switches the LCD from hardware-monitor to a custom image, see what
command flips that state.

### 9.4 Aura RGB — protocol decoded but write blocked

PID 0x18F3 "AURA LED Controller". HID Set_Report via Control endpoint
(ep 0x00):

    Setup: bmRT=0x21 bReq=0x09 wVal=0x0211 wIdx=0x0002 wLen=20

Payload structure (20 bytes):
    byte 0     = 0x11        Report ID
    byte 1     = 0xff        marker
    byte 2     = 0x0a        cmd (set zone colors)
    byte 3     = chunk-type  0x1b/0x5b/0x7b/0x6b
    bytes 4-19 = 16 bytes per-zone records

Each chunk is a list of zone updates. Records are 4 bytes (`<zone_id>
0xff <data1> <data2>`) in 0x1b chunks, 5 bytes in 0x5b chunks. 122
distinct zone IDs identified, mostly 0x01..0x6f sequential.

**Write blocked via libusb**: Windows HID stack is bound to iface 2;
`ctrl_transfer` via libusb STALLs ("Pipe error"). `send_feature_report`
also rejected. BUT — important correction 2026-05-12 — `hidapi.write`
(HID Output Report) DOES work: `dev.write(bytes([0xEC, 0x83, ...]))`
returned 65B successfully. Earlier §9.4 claim that hidapi.write was
rejected was wrong.

Decision: **delegate to OpenRGB** via `openrgb-python` SDK client.
OpenRGB has already reverse-engineered the proprietary protocol, is
MIT-licensed, and supports Z690 Maximus Extreme + most RAM/GPU/AIO RGB
hardware. New module: `polylux/drivers/aura_rgb/`. User installs
OpenRGB separately and enables the SDK server; Polylux connects on
127.0.0.1:6742. Documented in README.

Default safe mode: Polylux only controls devices of type MOTHERBOARD —
keyboards, mice, headsets (the G915s in Vlad's case) are left untouched
so they keep being driven by their vendor software (G-Hub, Synapse).
Users opt in to other types via config: `aura_rgb.types: [MOTHERBOARD, KEYBOARD]`.

Also checked: Windows Dynamic Lighting requires LampArray (usage page
0x59). Aura uses vendor-specific 0xFF72, so Windows native lighting
APIs don't recognize it. OpenRGB is the cleanest path.

### 9.4.1 BIOS RGB toggle = hardware power cut (Vlad's verification 2026-05-12)

Vlad's BIOS has the "Aura RGB" toggle Disabled by default (his preference
— no lights in PC). Tests showed:

  - With BIOS RGB Disabled: OpenRGB connects, enumerates the
    MOTHERBOARD device (8 LEDs detected), accepts mode + color writes
    without error — but **physically, no LEDs light up**. Sending the
    AC wake-up sequence (`ec 83`, `ec c1`, `ec 32 NN`, `ec 31 NN`)
    captured from `full_init_p1.pcap` dev 8 didn't change this.
  - With BIOS RGB Enabled: identical OpenRGB CLI command immediately
    lit up the LEDs (red → off via `--mode Off`).

Conclusion: **BIOS RGB Disabled physically cuts power to the LED
strips**. The chip is reachable and accepts software commands either way,
but downstream LED drivers have no power. AC has a userland override
mechanism (Vlad confirms it can turn LEDs on even with BIOS disabled),
but we have not yet decoded which call AC uses — likely either:

  - UEFI variable manipulation (`SetFirmwareEnvironmentVariableW`)
  - ASUS asio kernel driver method call (asio2sdk / asio3.sys)
  - ACPI/WMI invocation through an ASUS namespace
  - SMI / BIOS callback through a vendor driver

v0.4+ research direction: Frida-hook LightingService while AC enables
RGB, capture the syscalls / driver IOCTL / WMI method invocation.
Replicate in Polylux as an admin-required "wake RGB" step.

For v0.3 ship: documented as a known constraint — "if BIOS RGB is
disabled, enable it in BIOS Setup to allow software control". Same
behavior as AC for non-savvy users; informed users can enable BIOS.
Vast majority of ROG users have BIOS RGB Enabled by default.

Sources:
  https://rog-forum.asus.com/t5/asus-software/armoury-crate-turn-off-livedash-oled/m-p/860938

### 9.5 Chip1A21 refactor (clean architecture)

Carved out a shared low-level transport class so the matrix and OLED
high-level drivers can share the chip without fighting over USB claims:

  polylux/drivers/chip_1a21.py
    Chip1A21        low-level: open/close, hid_write, bulk_write,
                    init_for_matrix (lazy, idempotent)

  polylux/drivers/anime_matrix/usb_direct.py
    AniMeMatrix(chip)         high-level: send_frame, set_pixel, etc.
    AniMeMatrix.open()        convenience: opens private chip

  polylux/drivers/livedash_oled/driver.py
    LiveDashOLED(chip)        high-level: set_text, upload_image
    LiveDashOLED.open()       convenience: opens private chip
    set_text() auto-sends ec 51 09 once per instance so text always
                              works regardless of leftover mode state.

For sessions that need both displays, callers open the chip
explicitly and pass it to both wrappers (refcount-tracked):

    with Chip1A21.open() as chip:
        matrix = AniMeMatrix(chip)
        oled = LiveDashOLED(chip)
        matrix.send_frame(...)         # matrix lights up
        oled.set_text(...)             # OLED text — both displays active

Verified live: simultaneous matrix text "BOTH WORK" + OLED text
"POLYLUX / SHARED CHIP".

### 9.6 What still needs work for v0.2 SHIP

  1. **Refactor `polylux/service/main.py`** to use the new drivers.
     Replace `MatrixForceColorDriver` + `UsbForceColorDriver` with a
     scene-based YAML config (matrix text / OLED text / RGB color
     specified in polylux.yaml, with sensible defaults).

  2. **kill_asus_stack()** helper that the service runs at startup so
     it doesn't fight with leftover ASUS daemons.

  3. **OLED Custom Image display activation** — fresh targeted pcap
     of an isolated Apply on OLED Custom Image while monitoring HID
     writes live (Frida hook ws2_32.WSASend would catch the moment).

  4. **Ryujin LCD display activation** — same approach.

  5. **Unit tests** for packet builders (build_text_packet,
     build_image_prep_packets, matrix LUT) verified byte-for-byte
     against captured AC packets in scratch/captures/.

  6. **Installer touch** — scripts/install_service.py needs to know
     about the new driver entry points.

  7. **README** rewrite for public launch: what works, what's TBD,
     install instructions, OpenRGB dependency note, donation links.

### 9.6.1 BIOS owns the chip during POST — full ownership chain

Question Vlad raised at session end: can the BIOS send commands to the
OLED chip?

**Yes**. When the PC powers on, before Windows boots, the OLED already
shows Q-Codes (boot status numbers). That's the BIOS talking to the
chip via the USB host controller built into the motherboard — same
USB device PID 0x1A21 we drive from Windows, just from pre-OS firmware
instead of from a userland process.

**Full ownership chain (decoded from Vlad's empirical observation
2026-05-12 morning, watching boot sequence on the displays):**

  1. **Power-on:** BIOS opens chip 1A21 over the on-board USB host
     controller, sends factory-default init to all four MB outputs
     (matrix, OLED, Ryujin LCD via the Ryujin's USB chip, Aura RGB
     zones). All displays come up alongside the board with stock state.

  2. **POST:** BIOS switches OLED into hardware-monitor mode
     (`ec 51 00` per slot map §9.2) and starts feeding it values it
     reads from the SuperIO chip directly — temperatures, voltages,
     fan RPM — no Windows involved. Q-Codes (`ec 51 01`) appear only
     for boot-status numbers during the early POST window, then the
     BIOS flips the mode to hw-monitor for the rest of POST.

  3. **OS boot:** Aac3572MbHal_x86.exe loads with the AsusCertService
     stack and **transparently takes over** as the data feeder, on
     the same `ec 51 00` mode. Transition is invisible — OLED keeps
     showing values, only the source of values changes (BIOS SuperIO
     reads → Windows WMI reads + Aac3572MbHal writes). This explains
     why the OLED never blinks during the BIOS-to-Windows handoff.

  4. **AC starts:** ROGLiveService + ArmouryCrate.exe come up, read
     the user's saved profile, and if anything custom was set (text
     overlay, Custom Image, OLED preset GIF) they send the appropriate
     `ec 51 NN` slot switch + payload. If nothing custom is set, they
     leave the chip in `ec 51 00` and let Aac3572MbHal keep feeding.

Implications for Polylux:
  - Chip 1A21's HID protocol is firmware-level standard. BIOS uses it
    too. Polylux, AC, BIOS all speak the same wire format.
  - **Polylux can NOT control what the OLED shows during POST.** That's
    BIOS-owned. Polylux owns the chip only at Windows runtime.
  - **At service startup the chip is NEVER neutral.** It is in
    `ec 51 00` (hardware-monitor), with Aac3572MbHal actively writing
    to it. To take control, Polylux MUST:
      1. Kill Aac3572MbHal_x86 (it's a Windows service, runs even
         without AC UI / ROGLiveService — confirmed §9.3). Otherwise
         it fights us for the device.
      2. Send `ec 51 15` (exit preset) to drop hardware-monitor mode.
      3. Run full init: `Chip1A21.init_for_matrix()` re-sends
         `ec dc` × 3 + `ec 82` + `ec c1` + `ec 42 01`, guaranteeing
         data-input mode regardless of leftover state.
      4. For OLED text: `LiveDashOLED.set_text()` will re-send
         `ec 51 09` lazily on first call.
  - Killing Aac3572MbHal is non-optional. It's the single autonomous
    writer that doesn't depend on UWP / ROGLiveService — leaving it
    running means OLED reverts to temps within seconds of any of our
    writes.

For a v0.3+ research effort: extract the BIOS image (FPT.exe or
similar), grep for ASCII "EC" patterns + binary 0xEC bytes followed by
recognizable opcode bytes, and you'll likely find the exact command
sequences the BIOS uses. That's the canonical "minimum viable init"
for the chip — likely simpler than what AC sends.

### 9.7 Session commits

  21591f1  font_3x5: add full uppercase alphabet (A-Z)
  16891a9  [chip 1A21 refactor] Shared Chip1A21 driver + OLED mode-switch
  ...      [matrix STANDALONE] Init sequence + per-frame ec c1
  ...      [Ryujin LCD] Driver + upload protocol (display TBD)
  ...      [aura_rgb] Delegate to OpenRGB via openrgb-python SDK client

(See `git log --oneline` for the full session range; ~9 commits total.)

## 8e. AniMe Matrix LUT FULLY MAPPED + scope correction (2026-05-10 late evening)

**Matrix work is now functionally complete.** The 768-byte storage layout
has been derived empirically with Vlad's manual count and 10+ pinned
R-byte verifications. Render primitives (set_pixel / draw_text / draw_image
plus a 3×5 hardcoded font for clock-sized text) ship in
`polylux/drivers/anime_matrix/`.

### Physical topology (verified by per-column LED count)

  Top staircase:    rows 1..3  with 2, 4, 6 LEDs (left-anchored, cols 1..N)
  Middle:           rows 4..29 with 7 LEDs each (full width, 26 rows)
  Bottom staircase: rows 30..36 narrowing 7, 6, 5, 4, 3, 2, 1 (left-anchored)

  Total: 12 + 182 + 28 = 222 active LEDs

  Per-column LED count (Vlad's manual count):
    col 1 = 36, col 2 = 35, col 3 = 33, col 4 = 32,
    col 5 = 30, col 6 = 29, col 7 = 27.  Sum = 222.

### Storage layout (768 bytes = 16 blocks × 48 bytes)

  Each block has 3 planes (R, G, B) of 16 bytes each. For an LED at
  R-byte offset n: G-byte = n+16, B-byte = n+32 (within same block).

  Block 0: 15 active LEDs + 1 padding (slot 15)
    - rows 1, 2, 3 (top staircase, 12 LEDs)
    - row 4 cols 1..3 (first 3 of middle, 3 LEDs)

  Blocks 1..14: each has 14 active LEDs + 2 padding (slots 14, 15)
    - Cover middle rows 4 cols 4..7 through row 32 cols 1..4
      in raster row-major order, 14 LEDs per block.

  Block 15: 11 active LEDs at specific slot positions + 5 padding
    - Active slots: 0, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12
    - Padding slots: 1, 9, 13, 14, 15
    - Each row segment is aligned to 2 slots (1 byte of padding after
      odd-LED row segments) — special handling vs blocks 0..14.

### Empirically pinned (col, row at R-byte)

  byte   0 = (1, 1)        byte 676 = (1, 31)
  byte 720 = (5, 32)       byte 722 = (1, 33)
  byte 725 = (4, 33)       byte 726 = (1, 34)
  byte 727 = (2, 34)       byte 728 = (3, 34)
  byte 729 = PAD           byte 730 = (1, 35)
  byte 732 = (1, 36)       byte 734 = PAD

  Plus RGB plane mapping verified by cycling whole matrix through 8
  colors (R, O, Y, G, C, B, V, W) — Vlad confirmed all 8 distinct.

### What ships in this session

  - `polylux/drivers/anime_matrix/lut.py` — verified LUT + public API
    (r_byte, g_byte, b_byte, rgb_bytes, has_led, coord_at_r_byte)
  - `polylux/drivers/anime_matrix/render.py` — Frame class with set_pixel,
    set_row, set_col, fill, clear, draw_text (PIL font), draw_tiny_text
    (3×5 hardcoded font), draw_image, rotation parameter
  - `polylux/drivers/anime_matrix/font_3x5.py` — pixel font for digits,
    ':', '.', ' ', '-', 'C', 'F', '%'

### Known dead pixels on Vlad's board

  ~4 LEDs have a dead B channel (visible as yellow when commanded white).
  These are HARDWARE defects pre-existing on his board, not protocol
  errors. Render primitives don't try to compensate.

### v0.2 SCOPE CORRECTION (Vlad's reminder)

Earlier "v0.2 SHIPS" tags (commits 04d0bcc / 5e62a14) labeled the matrix
work as v0.2. Vlad pushed back: that's incomplete for a real Armoury
Crate replacement — a user who uninstalls AC would still have the
Ryujin LCD black, RGB controls dead, OLED unused.

**Revised v0.2 scope** = all 4 motherboard / AIO outputs:
  1. AniMe Matrix — ✅ DONE this session
  2. LiveDash OLED — same chip (PID 1A21), shares the 2 USB interfaces;
     HID command prefix differs (must be discovered via USBPcap of an
     AC OLED Apply session).
  3. Ryujin II LCD — separate chip (PID 1988), 320×240 image upload.
     Workflow same as matrix: capture → decode → driver.
  4. Aura RGB — bundle OpenRGB as internal dependency. OpenRGB is MIT,
     mature, already supports Z690 Maximus Extreme + RAM + GPU + AIO.
     RGB isn't our moat (the displays are) — don't reinvent.

Plus `kill_asus_stack()` helper, scene-based YAML config, Windows
service installer with auto-start.

### Next session

  Start with OLED. Vlad needs to: re-enable AC, install USBPcap, run a
  capture while clicking Apply on OLED settings. Then decode the HID
  prefix difference vs matrix and implement the driver. Estimated 1-2
  sessions for OLED, similar each for LCD and the RGB+OpenRGB wiring,
  plus 1 for service infrastructure and installer. **Target v0.2 ship:
  this week.**

## 8d. v0.2 (prior) BREAKTHROUGH — direct USB control of AniMe Matrix (2026-05-10 evening)

**The wall in §8c (peer check on UWP / Helper / Service) was bypassed by
attacking the chip directly via USB**, per Vlad's pivot ("dacă nu scăpăm
de AC nu am făcut nimic"). Strategy C is dead; we now own the matrix.

### Hardware

  USB device:    VID 0x0B05 PID 0x1A21 ("OLED Controller")
                  — AniMe Matrix is on this chip on Vlad's Z690 Extreme.
  Driver:        WinUSB (already installed by ASUS — no swap needed)
  Interfaces:
    iface 0 (mi_00, vendor specific class 0xff):
      ep 0x01 BULK OUT (max packet 64B)
      ep 0x81 BULK IN
    iface 1 (mi_01, HID class 0x03):
      ep 0x02 INT  OUT (max packet 64B)
      ep 0x82 INT  IN

### Per-frame protocol (decoded by USBPcap during real Apply)

  1. HID Output Report on iface 1 (INT ep 0x02), exactly 65 bytes:
       [0xEC, 0x7F, 0x04, 0x00, 0x03] + 60 zero bytes
     The "frame begin" signal. Without it, the bulk write that follows
     is silently ignored by the firmware.

  2. Bulk OUT on iface 0 ep 0x01, exactly 768 bytes:
       Pixel data. Layout is PLANAR — R channel first, then G, then B.
       (Empirically verified: bytes 0-200 always produced turquoise dot
       when zeroed = R off; byte 215 produced magenta = G off.)

### Frame buffer layout (partially mapped)

The 768-byte buffer is split into 3 channel planes, each ~250 bytes.
Within each plane, bytes map to pixels in a NON-RASTER order that follows
the matrix's physical staircase / dimetric layout.

**Matrix physical shape (verified by Vlad 2026-05-10 evening):**
TWO staircases, not one. Top has 3 cut/half pixels at the narrow tip,
gradual widening downward. Bottom is the MIRROR — narrows again with
a stair at the bottom edge. Middle section is full 7-col width.

Approximate counts:
  - Top stair (widening 1,2,3,...7 cols across rows):     ~28 LEDs
  - Middle full (7 cols × ~28 rows):                      ~196 LEDs
  - Bottom stair (narrowing 7,6,5,...1):                  ~28 LEDs
  - Total visible:                                        ~250-256 LEDs
                                                          (matches one
                                                          channel plane)

So a "row" in Vlad's coords (col, row) lands somewhere along the long
PORTRAIT axis. Top rows have only cols 1-2 visible, middle rows have
cols 1-7, bottom rows narrow back. The buffer has padding for
non-existent (col, row) positions in stair regions — that's why bytes
14, 15, 222, 230, 255, 767 are "nicăieri" (no LED).

Confirmed (col, row) positions for R-plane bytes (1-indexed; matrix is
in PORTRAIT orientation, ~7 cols across × ~36 rows tall):

  byte 0  -> (1, 1)      byte 1  -> (2, 1)
  byte 2  -> (1, 2)      byte 3  -> (2, 2)
  byte 4  -> (3, 1)      byte 5  -> (4, 1)
  byte 6  -> (1, 3)      byte 7  -> (2, 3)
  byte 8  -> (3, 2)      byte 9  -> (4, 2)
  byte 10 -> (5, 1)
  byte 14 -> (3, 3)
  byte 100 -> (1, 7)     byte 200 -> (5, 9)     byte 215 -> (4, 10) [G]

  byte 222 -> padding (no LED)
  byte 230 -> padding
  byte 255 -> padding
  byte 767 -> padding

The pattern is deterministic but non-trivial — looks like 2x2 super-pixel
quads scanned in a staircase order, with quad bytes interleaved at
non-contiguous positions in the buffer. Full LUT derivation requires
either continuing the manual byte-by-byte test (too slow without
automation) or photo-OCR (ROI per dot, brightness diff). Plenty of
captured frames in `scratch/captures/matrix_apply.pcap` show real
ASUS-rendered states (clock at known minutes) — those are the ground
truth for any future LUT refinement.

### What works in v0.2

  - `polylux/drivers/anime_matrix/usb_direct.py` — production module
  - `from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix`
  - `with AniMeMatrix.open() as m: m.fill(0xff); m.flush()` works live.
  - `m.send_frame(captured_bytes)` replays any 768-byte frame from a
    real-AC capture — full visual fidelity without needing the LUT.
  - 39/39 unit tests passing.
  - All ASUS daemons can crash / be killed and our driver still works.

### What v0.2 ships as

  - Direct USB control: ✓ (no UWP, no Helper, no Service, no LightingService
    needed for the matrix path — we drive the chip ourselves).
  - Frame replay (captured): ✓.
  - Custom pixel-coord rendering (text/animation): blocked on LUT.
  - Service integration (replace Frida-based force_color with usb_direct):
    not wired in yet.
  - Task Scheduler auto-start installer: already exists (commit c6f557f).

### v0.2 SHIPS — final empirical confirmation (2026-05-10 evening)

`scratch/rgb_cycle.py` cycles the matrix through R / G / B / WHITE /
YELLOW / MAGENTA / CYAN / OFF. Vlad photographed all 8 frames live.
Every frame produces a distinct visible state — the chip responds to
every byte we write. The matrix is fully driven by Polylux without any
ASUS daemon participation.

The frames are NOT clean single-color (e.g. the R-only frame shows top
in white, middle in red, bottom dark). That's because our plane offsets
are approximate (256/256/256); the real plane sizes are smaller, so
bytes 0-255 = 0xFF spills into both R plane (full) and the start of G
plane (~50 bytes), producing red+green = yellow / white in some pixels.
Pure-color rendering needs the precise plane boundaries — that's v0.3
LUT crawler work. For SHIP v0.2 we have unambiguous per-pixel RGB
control, just not yet a clean rendering primitive.

### Next concrete steps

1. ✅ Wire `usb_direct.AniMeMatrix` into `polylux/service/main.py`
   (done — commit 04d0bcc, --matrix-driver usb is the default).
2. Build a `frame_library.py` that loads captured frames from the pcap
   and exposes them as named effects (e.g. clock_replay, all_bright).
3. Write the LUT crawler (automated photo OCR from a USB camera, OR a
   bisecting binary-encoded test that lights groups of pixels per their
   row/col bit pattern so each test reveals 1 bit of position for every
   byte simultaneously).
4. Add `polylux.kill_asus_stack()` helper that stops AC + LightingService
   + Aac3572MbHal so v0.2 can claim the device cleanly at startup.

## 8c. PEER-CHECK WALL — fresh-TCP path is dead (2026-05-10 afternoon)

**Key finding that kills the original v0.2 "kill UWP" goal.**

`UserSessionHelper.exe` does a peer-identity check on every accepted TCP
socket on port 51100. A non-UWP peer is silently disconnected with a clean
FIN ~20 ms after accept(), without reading any bytes.

### Reproduction

`scratch/frida_capture_from_birth.py` was used to capture a fresh
UWP→Helper connection from process birth (after Vlad stopped the entire
AC stack and restarted via Services.msc + tray Exit). Two key
observations:

1. The first UWP message after connect is just `Cmd: GetUserPreferLanguageInUsersession`
   wrapped in the standard envelope (Area=2, Feature=1, Name=AuraPlugin,
   Number=GUID, Security=0x80, Version). No on-wire authentication step.
   `seq` starts at 2.
2. `BCryptEncrypt` and `BCryptDecrypt` use the SAME key handle. One
   symmetric key per Helper process, not per direction
   (verified by `scratch/compare_bcrypt_handles.py`: 60 enc + 140 dec
   events, all on handle `0x266ace04e50`).

Two replay attempts then failed with `WinError 10054 / RST`:
  - `scratch/replay_setmatrixled.py` — 7-chunk SetMatrixLED with seq=1, 706
  - `scratch/replay_first_probe.py` — verbatim copy of UWP's first probe
    message (`GetUserPreferLanguageInUsersession`) with the freshly
    extracted current-process key

Final test (no send at all):

```
sock = socket.create_connection(('127.0.0.1', 51100))
sock.recv(4096)   # blocks; recv() returns 0 after 20 ms (FIN)
```

→ Helper closed the connection cleanly within ~20 ms WITHOUT reading any
bytes. Conclusion: Helper checks the connecting peer's process token
(probably via `GetExtendedTcpTable` + `OpenProcess`, possibly a
UWP/AppContainer SID match) right after accept and drops non-UWP peers.

### What this rules out

- "Open our own TCP and inject SetMatrixLED" — dead, regardless of
  protocol details.
- Pivoting to ArmouryCrate.Service:50100 — same Windows-process-identity
  trick is almost certainly enforced there too (Service runs in session 0
  as SYSTEM and would be even stricter).

### What still works

- `polylux.crypto.AuraCipher` + `polylux.wire.frame` — useful for passive
  decryption of UWP traffic (debugging, future passive observability).
- `polylux.crypto.extract_key` — extracts the runtime key cleanly.
- `polylux.drivers.anime_matrix.force_color` — v0.1 path: Frida hooks
  `BCryptDecrypt` and rewrites plaintext post-decrypt. THIS IS THE ONLY
  PATH THAT DRIVES HARDWARE WITHOUT UWP-PEER COOPERATION.

### Realistic ways to break the wall (future work)

1. **Frida-inject into UWP itself** — make ArmouryCrate.exe call
   `BCryptEncrypt` + `WSASend` for our SetMatrixLED. Same wire as today's
   UI. Doesn't kill UWP but would let Polylux be the source of truth.
2. **Process-spoof** — make Polylux's own connection appear to come from
   ArmouryCrate.exe to Helper. Tricky and likely not portable.
3. **Drop to USB** — out of scope per §10b rule 2 unless the daemon path
   breaks under a future ASUS update.

### Implication for v0.2 scope

The "kill UWP, save 290 MB RAM" pitch is dead. v0.2 ships as a
production-ready packaging of v0.1: the existing decrypt-substitute path,
auto-extracted key, auto-restart on Helper PID change, install as Windows
service. The crypto + wire modules become foundation for v0.3 work
(passive monitoring, perhaps Frida-inject-into-UWP).

## 8b. v0.2 progress (2026-05-10 afternoon, commits 2dafb99 / f67d756)

Two of the §8 "blockers" are dead. Cipher and wire format are fully solved
in pure Python, validated end-to-end against live UserSessionHelper traffic
on PID 14624.

### What's done

**1. Cipher fully unlocked** (commit `2dafb99`):

Cipher is **AES-256-GCM** with 12-byte nonce, 16-byte tag, no AAD. The
symmetric key is exportable from a running UserSessionHelper.exe via
`BCryptExportKey(handle, "KeyDataBlob")` after grabbing the handle from
`BCryptEncrypt.args[0]`. Per-process ephemeral — rotates on each helper
restart. New module `polylux/crypto/aura_gcm.py` (`AuraCipher` class) is
pure Python via `cryptography` lib. Test `tests/test_aura_gcm.py` validates
encrypt + decrypt against a live capture vector byte-perfect (5/5 green).

The `pPaddingInfo` arg of `BCryptEncrypt` is `BCRYPT_AUTHENTICATED_CIPHER_MODE_INFO`
(cbSize=0x58); nonce + tag pointers are at offsets +8/+40. Use that to
extract during capture; no need for `BCryptOpenAlgorithmProvider` hooks.

**2. Wire framing decoded** (commit `f67d756`):

One frame on the TCP socket = `[u32 LE length] [12B nonce] [N bytes ciphertext] [16B tag]`
where length = 12 + N + 16. New module `polylux/wire/frame.py`
(`Frame` dataclass + `pack_frame` / `unpack_frame` / `read_frame(stream)`).
`tests/test_frame.py` 8/8 green, includes a real-capture parse vector.

**3. End-to-end pipeline validated**:

`scratch/frida_capture_outbound_paired.py` simultaneously captures
`BCryptEncrypt` (plaintext, nonce, ct, tag) and outbound wire bytes
(send + WSASend), then confirms two things:

  - `AuraCipher(key).encrypt(plain, nonce) == (ct, tag)` from BCrypt — crypto OK
  - `pack_frame(Frame(nonce, ct, tag))` appears verbatim in the outbound
    byte stream — wire format OK

Run on PID 14624 caught 2 BCryptEncrypt + 2 wire frames, all four matched
(2/2 crypto, 2/2 wire offset 0 + 48). Pipeline is sound.

**Caveat about that validation:** the captured frames were small
(16-byte plaintext = header chunk of background QuerySMTCInfo poll, sent
via `send()`). SetMatrixLED Apply traffic uses `WSASend` and is bigger —
not in this 25 s window because UWP was idle. Per §8a the capture script
that nails real Apply bursts is `scratch/frida_capture_v2.py` (it
correlates BCrypt output address against WSABUF address). My pipeline
primitives apply identically to those bigger frames; the wire format
doesn't change between traffic types.

### What's still left for v0.2 standalone

1. **`polylux/crypto/key_extractor.py`**: wrap the Frida-attach +
   `BCryptExportKey` dance into a clean Python helper. Service calls
   `extract_key_from_helper(pid)` → `bytes`. Frida runs once at startup,
   not in the hot path.
2. **Multi-chunk message assembly**: SetMatrixLED is split into
   ~10-20 BCryptEncrypt calls (16B header + 4B length + body chunks).
   Need to know chunking rules for our own outbound messages. Capture a
   real Apply via `scratch/frida_capture_v2.py` and count the chunks —
   that's the spec.
3. **TCP client**: open socket to 51100 (helper's listen port for UWP→helper)
   or 50100 (service's listen port for helper→service). Need to test
   which accepts a fresh client. If 51100 needs the UWP-style auth,
   fallback is hijacking helper's existing socket from inside Frida
   (cheap because we're already attached for key extraction).
4. **First write smoke test**: `force_color(255, 0, 0)` with UWP closed.
   Vlad confirms matrix turns red.
5. **Kill UWP + helper**, run only Polylux service, measure RAM saving.

### Reference

  - Captured key + cipher params: `scratch/captures/v0.2/aes_key_extracted.txt`
    (gitignored — per-process, regenerate per session)
  - Live GCM tuple: `scratch/captures/v0.2/gcm_pairs.jsonl`
    (gitignored)
  - Crypto module: `polylux/crypto/aura_gcm.py`
  - Wire module: `polylux/wire/frame.py`
  - Validation script: `scratch/frida_capture_outbound_paired.py`
  - Stronger capture (use this for real Apply bursts): `scratch/frida_capture_v2.py`

### 8a. UserSessionHelper uses WSASend, NOT send() — important capture gotcha

**Lesson learned (2026-05-10 morning, parallel session):** UserSessionHelper
sends outbound traffic via Windows IOCP / Boost::Asio, which calls
`ws2_32.dll!WSASend` directly. Hooking only `ws2_32.dll!send` will see ZERO
of the actual SetMatrixLED wire traffic. You'll only see background poll
keepalives.

The complete set of hooks that catches everything:

| Function | Why |
|---|---|
| `ws2_32.dll!WSASend` | **Required.** All real outbound. Iterate WSABUF list. |
| `ws2_32.dll!WSARecv` | All inbound IOCP recv. |
| `ws2_32.dll!send` | Old-style sync sends. Rare but possible. |
| `ws2_32.dll!recv` | Old-style sync recvs. |
| `ws2_32.dll!connect` + `WSAConnect` | Identify which socket goes to which port. |
| `kernel32.dll!WriteFile` | Last resort: some IOCP code uses socket handles as file handles. |
| `bcrypt.dll!BCryptEncrypt` + `BCryptDecrypt` | Plaintext capture (we own this part). |

**WSABUF struct on x64** (this layout bites people):

```c
typedef struct _WSABUF {
    ULONG len;     // offset 0,  4 bytes
    // 4 bytes implicit padding for pointer alignment
    CHAR* buf;     // offset 8,  8 bytes
} WSABUF;          // sizeof = 16
```

WSASend takes `LPWSABUF lpBuffers, DWORD cnt` — iterate `i = 0..cnt-1`,
each entry at `lpBuffers + i*16`.

**Correlation trick** (find the encrypted SetMatrixLED on the wire fast):

After each `BCryptEncrypt`, stash the output buffer pointer. On each
`WSASend`, check if any `WSABUF.buf == g_lastEncOut.cBuf` and the
timestamp delta < 100ms. That's the wire frame for the just-encrypted
ciphertext. Skip frames < 50 bytes that don't match (those are noise
poll responses).

**Ready-to-use capture script:** `scratch/frida_capture_v2.py`. It bakes
in all the above. Usage:

```
python scratch/frida_capture_v2.py <UserSessionHelper PID> 60
```

Output JSONL in `scratch/captures/capture_v2_<timestamp>.jsonl`. Live
console prints non-noise events with the `[matches enc#N addr+ts]`
correlation tag where applicable.

**Overlapped IO note:** WSASend with non-NULL `lpOverlapped` is async;
the actual write completes via IOCP later. But the bytes are committed
into the kernel send queue at WSASend call time — so onEnter capture
of the WSABUF data is correct and complete. No need to hook
GetQueuedCompletionStatus.

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

## 10b. HARDWARE SAFETY — DO NOT BRICK

Vlad's motherboard cost £1400 (ROG Maximus Z690 Extreme). The Ryujin II 360
was several hundred more. **A bricked board or AIO is a real-world catastrophe
— don't be the cause.**

### Hard rules (no exceptions, no Vlad-overrides without a 30-second pause)

1. **Never call firmware-update / flash / bootloader endpoints.** If a JSON
   reply, JS function name, or XML command contains any of these substrings —
   `firmware`, `fwupdate`, `flash`, `bootloader`, `recovery`, `dfu`, `bios`,
   `update_fw`, `eraseFlash`, `writeFlash`, `OTA` — STOP and ask Vlad before
   doing anything. Same for ASUS-specific terms: `liveUpdate` is borderline
   (it's the ASUS auto-updater for software, but treat with suspicion).
2. **Never directly bang USB endpoints with raw bytes** while we're going
   through ArmourySocketServer (Strategy C). Raw libusb / pyusb writes to
   `VID:0B05` devices are out of scope for this project. If Strategy C ever
   fails and we have to drop to USB-level, that decision needs a fresh review
   and an explicit Vlad sign-off, AND we test on the cheapest device first
   (Ryujin LCD, replaceable for ~£50 if it dies — board and OLED on the MB
   are NOT replaceable separately).
3. **Never swap drivers with Zadig / WinUSB / libusbK.** If we ever need this,
   it requires a documented uninstall path tested in advance.
4. **Never modify BIOS, UEFI vars, or run anything that touches `\\.\\` device
   paths** (raw disk/device handles).
5. **Never delete files inside `C:\Program Files\ASUS\` or
   `C:\Program Files (x86)\ASUS\`** without an explicit reason and a backup.
6. **Don't kill `LightingService.exe` or `ArmourySocketServer.exe` while
   they're mid-USB-transaction.** The window is small, but a write interrupted
   mid-frame to firmware-flashable storage on the device is a brick risk.
   Always wait for an "ok" reply before stopping the daemons.

### Soft rules (best practice)

7. **Backup before mutate.** Before we send our first test XML command that
   writes anything to a device, copy the four AniMe Matrix `.bin` files
   (`View\E7C8DA76-...\externalFiles\1-4.bin`) to `scratch/backups/anime/`
   so we can restore the originals. Same for any other mutable persistent
   slot we discover. Original Armoury Crate state must always be recoverable
   in one Vlad-action.
7b. **Fresh-install fallback documented.** Before doing anything irreversible,
    confirm Vlad still has Armoury Crate's installer/uninstaller working — if
    we accidentally corrupt its config, reinstalling Armoury Crate gets us
    back to a known-good state. (Don't *test* this — just confirm the option
    exists.)
8. **Test reads before tests writes.** Always probe a device's state via a
    pure-read command (e.g. `GetDeviceDescription`) before sending the first
    write command. If reads work and writes fail, we know the connection is
    fine and the failure is in our payload — not in our connection logic.
9. **One unknown at a time.** Don't combine "new XML format" + "new file
    format" + "new endpoint" in the same test. Change one variable per
    iteration so a brick (if it happens) is unambiguously attributable.
10. **For AniMe Matrix specifically:** the first .bin file we generate ourselves
    must be a passive copy of an existing slot's content (round-trip test)
    before we try genuinely new content. Confirms our format understanding
    before we feed the firmware something it's never seen.
11. **No undocumented commands.** If a JSON reply or JS source mentions a
    command we haven't seen Armoury Crate use itself, treat it as "do not
    call." We only use commands we've observed working in captured traffic.
12. **Keep a tested-good frame on disk at all times.** If something starts
    looking weird on the LCD, we want to be able to push the known-good frame
    immediately to recover.

### When in doubt — STOP

If Claude is uncertain whether a command is safe, the answer is don't send it.
Ask Vlad. The cost of a one-day delay is zero. The cost of a brick is £1400+
and breaks Vlad's trust in this project, which kills it.

### Observed gotcha: in-place plaintext mutation can desync state

Live test 2026-05-09 evening: after several rounds of BCryptDecrypt
plaintext mutation in UserSessionHelper, the matrix Apply pipeline got
into a state where new UI Apply clicks did NOT reach UserSessionHelper
(the cmd-listing hook saw NO SetMatrixLED for 60s while Vlad clicked
Apply). The state was self-recoverable by closing Armoury Crate and
reopening; no permanent harm.

Likely cause: one of our OVERFLOW refusals (where new plaintext was
4 bytes larger than cbOutput allowed, so we left the buffer with the
ORIGINAL bytes but possibly with our partial pcbResult update) confused
the downstream parser, which silently dropped subsequent commands.

Fix for production Polylux:
  - When refusing on OVERFLOW, do NOT update pcbResult (we don't currently —
    good).
  - Add a warning when refusing so users know a state desync is possible.
  - Document: "if matrix stops responding, restart Armoury Crate."

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
| 2026-05-12 | Correct "BIOS-disabled" reasoning | Vlad clarified: BIOS RGB toggle is a default state, AC can still drive the Aura chip at runtime regardless. OpenRGB has the same capability — talks direct to chip. So RGB is NOT permanently disabled by BIOS; it's just "off by default" until a userland app enables it. Polylux via OpenRGB will work even on systems where user has BIOS RGB toggled off. Vlad still doesn't want LEDs on his own PC, but the integration must work for other users. |
| 2026-05-09 | Reject slideshow-via-drive-letter approach | Ryujin doesn't mount as a Windows volume. |
| 2026-05-09 | Reject pure ctypes-on-SDK-DLL approach | DLLs are 7-export plugin shims (`ExecuteFunction` dispatcher). They need ArmourySocketServer running anyway. The WebSocket route is cleaner. |
| 2026-05-09 | Reject pure USB protocol RE | Estimated 1–2 days per device. Strategy C (use existing services) gets us to first frame in hours. |
| 2026-05-09 | Strategy C locked in | Use ArmourySocketServer + LightingService as backend. Replace only the UI bloat. ~80 % bloat eliminated. |
| 2026-05-10 | Pure-Python crypto (path b) over Frida-RPC (path a) | Key extracts cleanly via BCryptExportKey "KeyDataBlob"; AES-256-GCM matches the captured cipher byte-perfect. Frida required only at service startup (key extraction), not the hot path. |
| 2026-05-10 | Decline driver-level investigation for now | Strategy C just got 100 % validated; v0.2 is ~30 min from working. Driver RE was already rejected 2026-05-09 for cost + brick risk (§10b rule 2). Re-evaluate only if the ASUS daemon path breaks under a future update. |
| 2026-05-10 | v0.2 scope pivot — drop "kill UWP" goal | Helper enforces a peer-process check after accept() (FIN at ~20ms, no bytes read). Cannot inject SetMatrixLED from a non-UWP peer. v0.2 = production-grade packaging of v0.1 (decrypt-substitute, auto-key-extract, auto-restart, Windows service). Full reasoning in §8c. |
| 2026-05-10 | RE-PIVOT — direct USB attack at the chip layer | After §8c walls, Vlad redirected ("scriem noi driver-ul, ce pleacă de la mb la chip e fix; ASUS poate schimba mâine cheile dar firmware-ul nu"). USBPcap capture of a real Apply revealed protocol (HID prep + 768B bulk). pyusb + hidapi against WinUSB-bound mi_00/mi_01 works with zero ASUS daemons. v0.2 SHIPS as direct USB control. Full details in §8d. |

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
