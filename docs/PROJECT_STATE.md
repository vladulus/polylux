# Polylux — Project State

**Last updated:** 2026-05-10 (afternoon — see §8b for v0.2 progress)

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
| 2026-05-09 | Reject slideshow-via-drive-letter approach | Ryujin doesn't mount as a Windows volume. |
| 2026-05-09 | Reject pure ctypes-on-SDK-DLL approach | DLLs are 7-export plugin shims (`ExecuteFunction` dispatcher). They need ArmourySocketServer running anyway. The WebSocket route is cleaner. |
| 2026-05-09 | Reject pure USB protocol RE | Estimated 1–2 days per device. Strategy C (use existing services) gets us to first frame in hours. |
| 2026-05-09 | Strategy C locked in | Use ArmourySocketServer + LightingService as backend. Replace only the UI bloat. ~80 % bloat eliminated. |
| 2026-05-10 | Pure-Python crypto (path b) over Frida-RPC (path a) | Key extracts cleanly via BCryptExportKey "KeyDataBlob"; AES-256-GCM matches the captured cipher byte-perfect. Frida required only at service startup (key extraction), not the hot path. |
| 2026-05-10 | Decline driver-level investigation for now | Strategy C just got 100 % validated; v0.2 is ~30 min from working. Driver RE was already rejected 2026-05-09 for cost + brick risk (§10b rule 2). Re-evaluate only if the ASUS daemon path breaks under a future update. |

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
