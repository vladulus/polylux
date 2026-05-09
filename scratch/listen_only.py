"""
Pure listener on ws://127.0.0.1:9013 (ArmourySocketServer).

Connects, never sends, prints every frame received with a timestamp.
Stays open until Ctrl-C.

The hypothesis: the server may push heartbeats, alerts, or device-state
updates spontaneously. Even if we never click in Armoury Crate, just
sitting on the socket might reveal:
  - Whether 9013 is server-pushed (alerts) or expects client-initiated traffic
  - Heartbeat / keepalive structure
  - Native message format (XML vs JSON, framing, etc.)

If silent for >30s with Armoury Crate idle, this is genuinely an
on-demand channel and we'll need Vlad to provoke traffic from the UI.
"""
from __future__ import annotations

import asyncio
import datetime
import json
import sys
from pathlib import Path

import websockets

URL = "ws://127.0.0.1:9013"
LOG_PATH = Path(__file__).parent / "captures" / "9013_passive.log"


def now() -> str:
    return datetime.datetime.now().isoformat(timespec="milliseconds")


async def main() -> None:
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    log = LOG_PATH.open("a", encoding="utf-8")
    log.write(f"\n=== {now()} session start ===\n")
    log.flush()

    print(f"[+] connecting to {URL}", flush=True)
    print(f"[+] logging to {LOG_PATH}", flush=True)

    try:
        async with websockets.connect(
            URL,
            open_timeout=5,
            max_size=None,
            additional_headers={"Origin": "http://127.0.0.1:1042"},
        ) as ws:
            print(f"[+] connected, listening (Ctrl-C to stop)", flush=True)
            log.write(f"{now()} CONNECTED\n")
            log.flush()

            n_frames = 0
            while True:
                try:
                    data = await asyncio.wait_for(ws.recv(), timeout=10)
                except asyncio.TimeoutError:
                    # heartbeat from us so the user knows we're alive
                    print(f"[.] {now()} silent ({n_frames} frames so far)", flush=True)
                    continue

                n_frames += 1
                if isinstance(data, bytes):
                    line = f"{now()} BIN[{len(data)}] {data[:200]!r}"
                else:
                    # try to pretty-print JSON; otherwise raw
                    pretty = data
                    try:
                        pretty = json.dumps(json.loads(data), indent=2)
                    except json.JSONDecodeError:
                        pass
                    line = f"{now()} TXT[{len(data)}] {pretty[:1000]}"

                print(line, flush=True)
                log.write(line + "\n")
                log.flush()
    except KeyboardInterrupt:
        print(f"\n[+] stopped after {n_frames} frames")
    except Exception as e:
        print(f"[!] {type(e).__name__}: {e}", flush=True)
        log.write(f"{now()} ERROR {type(e).__name__}: {e}\n")
    finally:
        log.write(f"{now()} session end\n\n")
        log.close()


if __name__ == "__main__":
    asyncio.run(main())
