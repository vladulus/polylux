"""Passive listener on wss://127.0.0.1:9012 — log everything that arrives.

The 9012 channel is where ArmourySocketServer talks to UWP UI components.
TLS uses an expired demo cert (verify=NONE). Listen-only client; we hold
the connection open and dump whatever the server pushes spontaneously
or in response to UI activity.
"""
from __future__ import annotations

import asyncio
import datetime
import json
import ssl

import websockets


def now() -> str:
    return datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]


async def main() -> None:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    print(f"[{now()}] connecting to wss://127.0.0.1:9012")
    async with websockets.connect(
        "wss://127.0.0.1:9012",
        ssl=ctx,
        open_timeout=5,
        max_size=None,
        additional_headers={"Origin": "http://127.0.0.1:1042"},
    ) as ws:
        print(f"[{now()}] connected — listening (Ctrl-C to stop)")

        n = 0
        while True:
            try:
                msg = await asyncio.wait_for(ws.recv(), timeout=10)
            except asyncio.TimeoutError:
                print(f"[{now()}] silent ({n} frames so far)")
                continue
            n += 1
            if isinstance(msg, bytes):
                print(f"[{now()}] BIN[{len(msg)}] {msg[:300].hex()}")
                if msg.startswith(b"<") or all(32 <= b < 127 or b in (9, 10, 13) for b in msg[:50]):
                    print(f"            ascii: {msg[:300].decode('latin-1', errors='replace')}")
            else:
                print(f"[{now()}] TEXT[{len(msg)}]: {msg[:1500]}")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
