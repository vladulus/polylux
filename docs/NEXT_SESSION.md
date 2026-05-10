# Next session — pick up here

> Read `PROJECT_STATE.md` **§8e first** for the latest state: AniMe Matrix
> is fully mapped (LUT + render), and v0.2 scope was corrected to include
> OLED + LCD + RGB (not matrix alone).

## TL;DR

  - **AniMe Matrix:** DONE. LUT verified empirically with Vlad (222 LEDs,
    36×7 portrait layout, 16-block storage, special block-15 alignment).
    Render primitives ship: set_pixel, set_row, set_col, fill, clear,
    draw_text (PIL font), draw_tiny_text (3×5 pixel font), draw_image,
    rotation parameter for portrait/landscape text orientation.
  - **OLED next.** Same chip (PID 1A21), same USB interfaces — just a
    different HID command prefix. Workflow: USBPcap on iface 1 ep 0x02
    while Vlad does Apply in AC OLED settings, diff the prefix vs
    matrix's [0xEC, 0x7F, 0x04, 0x00, 0x03], implement driver.
  - **LCD after that.** Different chip (PID 1988), separate capture +
    decode workflow, full 320×240 image upload.
  - **RGB after that.** Bundle OpenRGB as dependency, no protocol RE.
  - **Then service infra + installer + ship v0.2.**

## What to verify still works on resume

```python
from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix
from polylux.drivers.anime_matrix.render import Frame

with AniMeMatrix.open() as m:
    f = Frame()
    f.draw_tiny_text("12:34", color=(0xFF, 0xFF, 0xFF), rotation=270)
    m.send_frame(f.to_bytes())
```

Should show the time on the matrix. If matrix is locked by ASUS daemons,
kill them first via PowerShell admin:

```
Get-Process | Where-Object { $_.ProcessName -match
  'Aac3572|LightingService|ArmouryCrate|asus_framework|ArmourySocketServer|ArmourySwAgent'
} | Stop-Process -Force
```

## OLED capture setup (next session work)

1. Vlad re-enables AC (Services.msc → start LightingService + ArmouryCrate
   services). Verify AC UI opens and OLED page works.
2. Install USBPcap if not already (https://desowin.org/usbpcap/).
3. Identify the USB bus the PID 1A21 device is on (USBPcap install lists
   them).
4. Filter capture to that device only — minimizes noise.
5. In AC, navigate to OLED page, change some setting (image, animation,
   text), click Apply.
6. Save .pcap to `scratch/captures/oled_apply.pcap`.
7. Open in Wireshark, filter on bulk OUT to iface 0 ep 0x01 + interrupt
   OUT to iface 1 ep 0x02. Compare HID prep bytes vs matrix:
   - Matrix HID prep: `[0xEC, 0x7F, 0x04, 0x00, 0x03] + 60 zeros`
   - OLED HID prep:   `[0xEC, 0x7F, ?, ?, ?] + ...`  (likely byte 2 or 4 differs)

This is the same workflow that cracked the matrix protocol in §8d.

(Old content below this line predates the matrix completion — kept for
reference but most of it is superseded.)

---

## ⚠️ CRITICAL CAPTURE GOTCHA (added 2026-05-10 morning, parallel session learning)

**UserSessionHelper sends via WSASend, NOT plain send().** If you only hook
`ws2_32.dll!send` you'll see ZERO real wire traffic. You'll waste hours
wondering "where did the SetMatrixLED bytes go?" (parallel session did).

**Solution ready:** use `scratch/frida_capture_v2.py`. It hooks WSASend +
WSARecv with correct WSABUF iteration (16-byte struct on x64 with implicit
4-byte padding before the buf pointer at offset 8), correlates each
WSASend buffer pointer against the most-recent BCryptEncrypt output
pointer (within 100 ms), and filters noise frames < 50 bytes.

See `PROJECT_STATE.md §8a` for full hook table + WSABUF layout + correlation
algorithm. Don't reinvent this.

## Strategic context (decided 2026-05-10 morning chat)

Polylux is also Vlad's **best realistic source of passive income**. Profile:
50yo UK resident, owns home outright (mom's gift), no monthly surplus,
runs multiple solo businesses but doesn't like sales/marketing. Polylux
fits perfectly because:
  - Real demand (millions of ASUS ROG users hate Armoury Crate)
  - No comparable free open-source alternative
  - Distribution organic (GitHub + Reddit posts on r/ASUS, r/AsusROG, HN)
  - Donation-friendly audience (gamers spend on hardware, will donate $5/mo)
  - Tech moat (we cracked the protocol; competitors will take months to catch up)
  - No customer-support burden like SaaS

**Monetization roadmap**:
  - v0.2 (next 1-2 sessions): standalone TCP client, kill UWP UI dependency, brag about -290MB RAM win
  - v0.3 (1-2 weeks): OLED + Ryujin LCD support (Vlad's original Aura Blue + GPU temp idea)
  - v0.4 (PUBLIC LAUNCH): polished README with before/after screenshots,
    60-sec demo video, comparison vs Armoury Crate / SignalRGB,
    GitHub Sponsors + Buy Me a Coffee + Ko-fi links, posts on
    r/ASUS, r/AsusROG, r/buildapc, Hacker News, ROG forum, eventually
    MSI installer for non-tech users

**Realistic income trajectory**:
  - Month 1-3 post-launch: 10-50 stars, 0-5 donors, $0-50/mo
  - Month 6-12: 500-2000 stars, 50-200 donors, $200-1000/mo
  - Year 2: potentially $1000-5000/mo if maintained
  - Cap (de facto Armoury Crate replacement): $10k+/mo + Pro version + OEM consulting

This drives next-session priorities: ship v0.2 fast, then v0.3, then PUBLIC.

## ⚡ PROOF: replay accepted at wire level

In commit `ad6cbd8` we proved that ArmouryCrate.Service does NOT have
AES-GCM nonce-replay protection. Captured 48 wire frames during one
8-second window, replayed them on the same socket, ALL 48 succeeded
(`ok_count=48 err_count=0`), and matrix visibly changed state
(green → yellow).

The 48 captured frames were background polls (QuerySMTCInfo /
QueryNotification — small 13-byte bodies). Replaying them caused a
state perturbation. The actual SetMatrixLED apply did not fall in our
8-second capture window — that was the only reason matrix didn't go
to whatever the captured Apply intended.

This means the FULL wire-replay path WORKS. We just need to capture
the right Apply burst.

## Where we stopped (2026-05-09 evening)

We cracked the protocol. The hardware-control channel is **not** the
WebSocket on 9013 (that's keepalive only) but a custom binary length-prefixed
protocol on **port 50100** between `ArmouryCrate.UserSessionHelper.exe` and
`ArmouryCrate.Service.exe`, **encrypted via Windows BCrypt** (not OpenSSL,
not TLS).

We hooked `BCryptEncrypt` / `BCryptDecrypt` with Frida and dumped
plaintext. The Apply command is `Cmd='SetMatrixLED'` carrying the same
fields as `current.json`. Full format documented in `PROJECT_STATE.md` §8.

## 🎯 Where we are (2026-05-10 evening — v0.2 BREAKTHROUGH)

**Polylux now drives the AniMe Matrix directly via USB, with zero ASUS
daemons cooperation.** Full details in `PROJECT_STATE.md §8d`. Read that
first.

### Quick start to verify it still works

```python
from polylux.drivers.anime_matrix.usb_direct import AniMeMatrix
with AniMeMatrix.open() as m:
    m.fill(0xff)   # all pixels on
    m.flush()      # send to chip — matrix lights up white
```

If that works, we own the matrix. If not, ASUS daemons reclaimed the
device — kill them via PowerShell admin first:

```
Get-Process | Where-Object { $_.ProcessName -match 'Aac3572|LightingService|ArmouryCrate|asus_framework|ArmourySocketServer|ArmourySwAgent' } | Stop-Process -Force
```

### Known protocol (live verified)

  USB:    VID 0x0B05 PID 0x1A21, WinUSB driver, 2 interfaces.
  Frame:  HID Output Report iface 1 ep 0x02:
            65B = [0xEC, 0x7F, 0x04, 0x00, 0x03] + 60 zeros
          Then BULK OUT iface 0 ep 0x01: 768B pixel data
            (R plane, G plane, B plane — planar layout).

### Captured assets in scratch/captures/

  matrix_apply.pcap  — USBPcap of real ArmouryCrate Apply session.
                       Contains many 768-byte bulk frames showing the
                       clock at various minutes. Replay-friendly with
                       `m.send_frame(captured_bytes)` (no LUT needed).

### Partial pixel mapping LUT (R-plane bytes)

  byte 0 -> (1,1)   byte 1 -> (2,1)   byte 2 -> (1,2)   byte 3 -> (2,2)
  byte 4 -> (3,1)   byte 5 -> (4,1)   byte 6 -> (1,3)   byte 7 -> (2,3)
  byte 8 -> (3,2)   byte 9 -> (4,2)   byte 10 -> (5,1)
  byte 14 -> (3,3)
  byte 100 -> (1,7)  byte 200 -> (5,9)  byte 215 -> (4,10) [G plane]
  byte 222, 230, 255, 767 -> padding

Pattern is staircase-aware non-raster scan (likely 2x2 quads scattered).
LUT crawler is the next big task.

## ⚡ Where we paused (2026-05-10 afternoon-late)

**Vlad authorized full aggressive mode** — "il facem degeaba dacă nu scapăm de AC", "dacă se strică AC îl reinstalăm". Acceptăm risc de a sparge AC pentru progres.

### The chain we mapped this session

UWP ArmouryCrate.exe (UI click)
  → UserSessionHelper.exe :51100   (encrypted SetMatrixLED — peer-checked)
  → ArmouryCrate.Service.exe :50100 (encrypted forward — peer-checked)
  → LightingService.exe (writes XML cache files in C:\Program Files (x86)\LightingService\)
  → ??? (unknown writer)
  → matrix changes color

We confirmed AURA_3.0 XML is the canonical matrix command, captured the
exact format with all 3 textlist entries for [@HOUR][@IND][@MINUTE], and
verified hue values match Vlad's clicks (0.666=blue, 0.166=yellow, 0=red).

### What we proved DOES NOT work for v0.2 "kill UWP"

- 51100 (Helper): peer-process-check, FIN at ~20ms (§8c)
- 50100 (Service): same peer-check
- 9013 (ArmourySocketServer): WS connects but never replies to JSON/XML
- File-write to LedMatrix_LastScript.xml: no effect; cache only
- Aac3572MbHal HID writes: only 2 unique 65-byte payloads despite 3 color
  changes (heartbeat, not data)
- AuraSdk COM (`{05921124-...}`): instantiates from regular user, but
  Enumerate() returns 0 devices for ALL devType masks. Likely because
  motherboard RGB is BIOS-disabled.
- ASUSAuraMBHal COM (`{E7C8DA76-...}`): CoCreateInstance fails with
  E_UNEXPECTED — AppID launch permission probably gates regular users.

### Strongest live clues

The matrix is on USB device `\\?\usb#vid_0b05&pid_1a21&mi_00#...` (the OLED
Controller chip per §3 — AniMe Matrix is multiplexed on it). Aac3572MbHal_x86.exe
opens this device 469 times during a 30s capture but its writes are constant
(2 unique 65-byte HID payloads, prefix 0xec). Either:
  - The actual data path is async/IOCP/WriteFileEx that my hooks miss
  - A different process writes the matrix data (not yet identified)
  - Service.exe ↔ MbHal channel uses encryption (strings ASUSAURAHALENCYPT,
    ASUSAURAHALKEYCONTAINER found in MbHal binary)

### Where to start when resuming

Pick ONE of these next attacks (ordered by EV):

1. **Hook ALL processes that have HID.dll loaded simultaneously** during a
   matrix Apply. Whoever writes >100B to the device handle wins. Start with
   Aac3572MbHal_x86 + LightingService + ArmouryCrate.Service + ROGLiveService.
   Use NtWriteFile + NtDeviceIoControlFile + WriteFileEx (async path).

2. **Try AuraDevelopement Class** (`{34B707DC-1133-4EBC-B380-21387A50A89D}`).
   See `scratch/com_aurasdk_explore.py` for setup. May offer richer methods.

3. **Hook MbHal_x86 with WriteFileEx + completion routines**. The 469
   handle-opens to vid_0b05&pid_1a21 must be writing data SOMEWHERE. Async
   IO is the most likely answer.

4. **Strings/IDA on Aac3572MbHal_x86.exe** to find named-pipe / encrypted
   IPC entry. Look for `ASUSAURAHALENCYPT` keys in code, find the IPC
   server endpoint, Frida-fake messages to drive matrix.

5. **Direct HID write from Polylux** to vid_0b05&pid_1a21. Capture a
   complete Apply burst with enough breadth (NtWriteFile + WriteFileEx +
   NtDeviceIoControlFile in MbHal during a fresh Apply), then replay
   verbatim from Python via `hidapi`.

## First action when you resume

DON'T REDO DISCOVERY. Read **§8c first** in `PROJECT_STATE.md` — it
documents the peer-process-check wall that killed the original v0.2
"standalone TCP" plan. Then §8b for what crypto/wire infrastructure is
already in place.

**Context as of 2026-05-10 afternoon:**

  - Crypto + wire format fully solved in pure Python, validated against
    live captures (`polylux/crypto/aura_gcm.py`, `polylux/wire/frame.py`,
    `polylux/crypto/key_extractor.py`).
  - Helper enforces peer-process identity check after accept() —
    fresh-TCP from a non-UWP peer is dropped at ~20 ms with no bytes
    read. v0.1's decrypt-substitute remains the only path that drives
    hardware without UWP cooperation.
  - v0.2 scope pivoted: ship a production-grade packaging of v0.1.

**Next concrete steps for v0.2 (revised):**

1. **Integrate `extract_key` into the live service** — even though the
   key isn't strictly needed for decrypt-substitute (we mutate plaintext
   post-`BCryptDecrypt`), having it in hand lets us add live monitoring
   later. Optional: log it on startup so we can passively decrypt for
   diagnostics.

2. **Fix the OVERFLOW desync gotcha** documented in §10b. When force-color
   refuses an overflow, log a warning so users know to restart AC if
   matrix stops responding. Better: pre-pad the captured plaintext to a
   safe length so overflows can't happen.

3. **Auto-restart on Helper PID change** — `MatrixForceColorDriver.run_forever`
   already polls and re-attaches; verify it's robust across actual AC
   restarts (Vlad's stop+start cycle is a real test case).

4. **Windows service installer** — wrap `python -m polylux.service` with
   `nssm` or `pywin32`'s service framework so it auto-starts at boot,
   runs hidden, restarts on crash. Add an installer script.

5. **Tray icon** (optional) — minimal pystray icon for status + manual
   stop. Not in v0.2 scope unless quick.

6. **README + screenshots** — for v0.4 public launch later. Skip for v0.2.

**For v0.3+ (parallel work, optional):**

  - Frida-inject Polylux into ArmouryCrate.exe (UWP) — the only feasible
    way to inject fresh SetMatrixLED from outside. Lets Polylux drive the
    matrix without UI clicks while UWP runs in background.
  - Ryujin LCD via the same decrypt-substitute pattern (capture an LCD
    Apply, mutate fields).
  - LiveDash OLED similarly.

## What Vlad does

- Help with Frida captures: he clicks Apply in Armoury Crate UI, we
  capture. Same procedure as this session.
- Visually confirm matrix color changes when we send commands.

## Tooling already installed in venv

- frida + frida-tools 17.9.7 — runtime instrumentation
- scapy — pcap-style capture (but we don't need it now — Frida is direct)
- websockets, cryptography, pefile, jsbeautifier, Pillow, psutil, pynvml

npcap loopback adapter is enabled at OS level. No new installs needed
for next session.

## ⚠️ HARDWARE SAFETY — read this before any write command

Read **`docs/PROJECT_STATE.md` §10b — DO NOT BRICK** before sending any command
that mutates device state. Vlad's motherboard cost £1400. Hard rules:

- No firmware/flash/bootloader endpoints. Ever. (Cmd names like
  `*Update*`, `*Flash*`, `*FW*`, `*Boot*` — STOP, ask Vlad first.)
- No raw USB writes (we're going through ASUS services on 50100).
- Backup before mutate (still have backups in scratch/backups/).
- Read-probe before write-probe (send a `Query*` Cmd before any
  `Set*` Cmd, see that we get a reply).
- AniMe Matrix first-write: send `SetMatrixLED` with literally the
  same params as Vlad's last Apply (round-trip), confirm no visual
  change, before changing anything.

If uncertain whether a command is safe — **don't send it**, ask Vlad.

## Reference scripts to keep / reuse

- `scratch/frida_bcrypt.py` — the breakthrough hook. Keep, extend.
- `scratch/extract_setmatrixled.py` — offline plaintext decoder. Will
  evolve into `polylux/format/aura_proto.py`.
- `scratch/frida_list_modules.py` — handy when re-attaching.
- `scratch/frida_winsock.py` — confirms which socket carries the data.
- `scratch/capture_loopback.py` — only needed if revisiting the
  TCP-stream side. Frida is faster.

## Reference paths

- Project root: `C:\Users\vlad\Desktop\Polylux`
- BCrypt capture: `scratch/captures/bcrypt_session_full.txt`
- Plaintext sample: `scratch/captures/setmatrixled_plaintext.bin`
- Beautified JS: `scratch/aio_*_beautified.js`,
  `scratch/motherboard_index_beautified.js`
- AMMX backups: `scratch/backups/anime/{1,2,3,4}.bin`
