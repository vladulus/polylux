"""Probe wss://127.0.0.1:9012 (the real ArmourySocketServer).

The TLS layer there uses an expired demo cert from WebSocket++; verify_mode
must be CERT_NONE. No client cert required.
"""
from __future__ import annotations

import asyncio
import datetime
import json
import ssl

import websockets


def now() -> str:
    return datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]


URL = "wss://127.0.0.1:9012"


PROBES = [
    # The same probes that got nothing on 9013, retried on the real channel
    "<root><header>AURA Devices</header><version>1.0</version></root>",
    "<root><header>ASUS_AURA</header><version>1.2</version><funcid>1</funcid></root>",
    "<root><header>ASUS_AURA</header><version>1.0</version><funcid>2</funcid></root>",
    "<xml><command>ConnectionOpen</command><device>2dfe216d-3481-4684-ad4d-2566bd7cfe4f</device></xml>",
    "<xml><command>GetDeviceDescription</command><device>2dfe216d-3481-4684-ad4d-2566bd7cfe4f</device></xml>",
    "<xml><command>ConnectionOpen</command><device>E7C8DA76-C9B9-4297-8681-DD878330AFE7</device></xml>",
    "<xml><command>GetDeviceDescription</command><device>E7C8DA76-C9B9-4297-8681-DD878330AFE7</device></xml>",
    json.dumps({"command": "ping"}),
    json.dumps({"command": "GetDeviceProfileList"}),
]


async def probe() -> None:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    async with websockets.connect(
        URL,
        ssl=ctx,
        open_timeout=5,
        max_size=None,
        additional_headers={"Origin": "http://127.0.0.1:1042"},
    ) as ws:
        print(f"[{now()}] CONNECTED to {URL}")

        async def reader():
            try:
                while True:
                    msg = await ws.recv()
                    if isinstance(msg, bytes):
                        print(f"[{now()}] [<<<] BIN[{len(msg)}] {msg[:300]!r}")
                    else:
                        print(f"[{now()}] [<<<] TEXT[{len(msg)}]: {msg[:1500]}")
            except websockets.ConnectionClosed as e:
                print(f"[{now()}] reader closed: {e}")

        reader_task = asyncio.create_task(reader())

        for i, p in enumerate(PROBES):
            print(f"\n[{now()}] [{i:02d}>>>] {p[:120]}")
            try:
                await ws.send(p)
            except Exception as e:
                print(f"  send error: {e}")
                break
            await asyncio.sleep(1.5)

        print(f"\n[{now()}] all sent — listening 10s for late replies")
        await asyncio.sleep(10)
        reader_task.cancel()


if __name__ == "__main__":
    asyncio.run(probe())
