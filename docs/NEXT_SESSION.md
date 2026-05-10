# Next session — pick up here

> Read `PROJECT_STATE.md` first, especially §8 which has the latest protocol
> map. This file is the action-oriented start guide.

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

DON'T REDO DISCOVERY. The protocol is documented. Open
`PROJECT_STATE.md` §8 and use it as the spec.

**Confirmed reality (verified 2026-05-09 evening, commits 0fe7688 / smart_replay):**

- Hooks on `send()` and `BCryptEncrypt` from inside UserSessionHelper see
  only background poll traffic during a matrix Apply (44-byte max bodies,
  QuerySMTCInfo and QueryNotification). They do NOT see the SetMatrixLED.
- Hook on `BCryptDecrypt` sees the FULL 2986-byte SetMatrixLED plaintext
  arriving (we captured it earlier).
- Conclusion: ArmouryCrate.exe (UWP UI, PID 37048) sends SetMatrixLED to
  UserSessionHelper via UserSessionHelper's listening port `51100`,
  encrypted. UserSessionHelper decrypts (BCryptDecrypt fires) and applies.

**Quick win path** for next session (~30-60 min):

1. Hook `recv()` / `WSARecv()` in UserSessionHelper (PID 15668) to capture
   the INBOUND ciphertext on port 51100 — alongside the existing
   BCryptDecrypt hook. Match the wire bytes that arrived to the plaintext
   that BCryptDecrypt produced. Save the wire ciphertext for that one
   specific Apply burst.
2. Open our own TCP connection to `127.0.0.1:51100` from Python.
3. Send the captured inbound bytes verbatim. UserSessionHelper should
   decrypt and process them as if they came from ArmouryCrate.exe.
4. Matrix should change to whatever Vlad's Apply set during capture.
5. If yes — END-TO-END WORKING. Then mutate plaintext, re-encrypt
   (we have the Frida-RPC encrypt path proven; key may be shared between
   inbound and outbound or may be different — check by encrypting our
   payload and comparing tag length / cipher to a captured one).
6. If sending bytes to 51100 from Python fails because the server expects
   a TLS handshake or session-key establishment first, then we have to
   replicate that. Look for the handshake bytes in the capture before the
   first SetMatrixLED frame — those are the session setup.

If 51100 has a per-connection session key and won't talk to a fresh client
without ArmouryCrate.exe-style auth, fallback: hijack the existing
ArmouryCrate.exe → UserSessionHelper connection by writing into THAT
socket from inside Frida (which is attached to UserSessionHelper, so we
can call `send()` on the socket the kernel knows is paired with the
already-authenticated peer).

The remaining engineering after the quick win:

1. **Capture a full Apply session and reassemble fragments.** The current
   capture only got the first 200-byte fragment. Modify
   `scratch/frida_bcrypt.py` so it accumulates plaintext fragments into a
   single buffer until it sees a complete message (use the outer 4-byte
   LE length prefix observed in `frida_winsock.py` to know the total).
   Save full plaintext to `scratch/captures/setmatrixled_full.bin`.

2. **Write the binary serializer/deserializer** as
   `polylux/format/aura_proto.py` matching the type tags table from §8.
   Round-trip test against the captured plaintext (must produce identical
   bytes).

3. **Decide the encrypt path** (one of):
   - **(a) Frida-as-RPC**: stash `BCRYPT_KEY_HANDLE` on first Encrypt
     call, expose RPC from Frida JS that takes plaintext, calls
     `BCryptEncrypt` with that handle, returns ciphertext. Polylux core
     drives this via `frida.attach`. Pro: works today. Con: Frida is a
     runtime dep.
   - **(b) Standalone**: hook `BCryptOpenAlgorithmProvider`,
     `BCryptGenerateSymmetricKey`, `BCryptSetProperty` to learn cipher
     suite, key, IV. Replicate from Python with `cryptography` lib.
     Pro: pure Python, no Frida. Con: more RE work.
   - Recommendation for v0.1: do (a) first to prove end-to-end works,
     then promote to (b) for v0.2.

4. **Send-side**: open our own TCP connection to 127.0.0.1:50100. Send
   `<u32_LE_length><ciphertext>` framed messages. Should get a similar
   reply we already see in capture (`'result' = 1` or JSON wstring).

5. **Visual confirmation**: send a SetMatrixLED with
   `TextColorR=255, TextColorG=0, TextColorB=0` and ask Vlad if matrix
   turns red. That's the end-to-end smoke test.

6. After matrix works → repeat the same playbook for Ryujin LCD
   (`Cmd='???'` — capture during a Ryujin slideshow change to learn it).

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
