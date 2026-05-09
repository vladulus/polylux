# Next session — pick up here

> Read `PROJECT_STATE.md` first. This file is a short, action-oriented start guide.

## Where we stopped

Connected from Python to `ws://127.0.0.1:9013` (ArmourySocketServer's plain-WS
port). Auth-free. Sent a guess at the `ConnectionOpen` XML message — got no
reply in 6 seconds.

## Working theory

Either:
- **(a)** the XML schema is wrong (server wants different element structure / attributes), or
- **(b)** port 9013 is alerts-only (server → client) and commands go elsewhere.

We can't tell without **comparing against a real captured message**. That
requires Vlad to interact with Armoury Crate while we passively listen.

## First action when you resume

Don't redo discovery — it's all in `PROJECT_STATE.md` §6. Go straight to:

1. Adapt `scratch/probe_socket.py` into `scratch/listen_only.py`. Connects to
   `ws://127.0.0.1:9013`, prints every frame received with a timestamp, never
   sends. Bonus: also open a parallel listener on `ws://127.0.0.1:1042`.
2. Tell Vlad: "Open Armoury Crate, navigate to the Ryujin LCD page, change a
   setting (e.g. swap the slideshow image, toggle the temp display). Tell me
   when done."
3. Watch the listener output. The XML/JSON pattern that flies past *is* the
   real protocol. Match it byte-for-byte from Python.
4. If 9013 stays silent, repeat on 1042 and (with TLS) 9012.
5. If both are silent, we go to **Plan B**: use `mitmproxy` or a simple
   `socat`-equivalent in front of port 9013 to MitM Armoury Crate's own
   WebSocket and see what it actually sends. (See `docs/PLAN_B_MITM.md` —
   write that doc once you get there.)

## What Vlad does NOT do unprompted

- Restart Armoury Crate
- Touch BIOS
- Install/uninstall ASUS software
- Edit any file inside `C:\Program Files (x86)\ASUS\`

If any of those become necessary, ask first and explain why.

## File map (relevant scratch artifacts)

- `scratch/dump_sdk_exports.py` — dumps DLL exports (already run, output
  documented in PROJECT_STATE.md §6).
- `scratch/aio_index_beautified.js` — UI module, ~7 000 lines (Express
  routes / file ops).
- `scratch/aio_service_beautified.js` — service module, ~13 000 lines
  (WebSocket connections, sendSocketServer, sessionKey).
- `scratch/motherboard_index_beautified.js` — analogous module for MB.
- `scratch/probe_socket.py` — first attempt to talk to 9013. Got no reply.
  Adapt before next attempt.
