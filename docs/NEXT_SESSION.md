# Next session — pick up here

> Read `PROJECT_STATE.md` first, especially §8 which has the latest protocol
> map. This file is the action-oriented start guide.

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
