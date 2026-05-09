"""
Try several XML root variants against ws://127.0.0.1:9013, watching for any reply.
"""
from __future__ import annotations

import asyncio
import datetime
import json

import websockets

URL = "ws://127.0.0.1:9013"
AIO_MODEL = "2dfe216d-3481-4684-ad4d-2566bd7cfe4f"
MB_MODEL = "E7C8DA76-C9B9-4297-8681-DD878330AFE7"


def now() -> str:
    return datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]


VARIANTS = [
    # Most likely per re-reading combineContent + xmlbuilder default-root behaviour
    f"<xml><command>ConnectionOpen</command><device>{AIO_MODEL}</device></xml>",
    f"<xml><command>GetDeviceDescription</command><device>{AIO_MODEL}</device></xml>",
    f"<xml><command>GetDeviceProfileList</command><device>{AIO_MODEL}</device></xml>",
    # Same but for motherboard
    f"<xml><command>ConnectionOpen</command><device>{MB_MODEL}</device></xml>",
    f"<xml><command>GetDeviceDescription</command><device>{MB_MODEL}</device></xml>",
    # Alternative root tags (in case xmlbuilder option differs)
    f"<root><command>ConnectionOpen</command><device>{AIO_MODEL}</device></root>",
    f"<request><command>ConnectionOpen</command><device>{AIO_MODEL}</device></request>",
    # No wrapping at all
    f"<command>ConnectionOpen</command><device>{AIO_MODEL}</device>",
    # Just JSON (in case server accepts both)
    json.dumps({"command": "ConnectionOpen", "device": AIO_MODEL}),
    json.dumps({"xml": {"command": "ConnectionOpen", "device": AIO_MODEL}}),
    # device_type nested form (matches mediaTransfer style)
    f"<xml><device_type><$ key=\"AIO\"/><device><$ key=\"{AIO_MODEL}\"/><function><$ key=\"GET_DEVICE_DESCRIPTION\"/></function></device></device_type></xml>",
    # With xml prolog (headless:false equivalent)
    f"<?xml version=\"1.0\" encoding=\"UTF-8\"?><xml><command>ConnectionOpen</command><device>{AIO_MODEL}</device></xml>",
]


async def probe() -> None:
    async with websockets.connect(
        URL, open_timeout=5, max_size=None,
        additional_headers={"Origin": "http://127.0.0.1:1042"},
    ) as ws:
        print(f"[{now()}] connected to {URL}")

        # Background reader so we don't miss replies during sends
        async def reader():
            try:
                while True:
                    msg = await ws.recv()
                    print(f"[{now()}] [<] {msg!r}")
            except websockets.ConnectionClosed:
                print(f"[{now()}] reader: connection closed")

        reader_task = asyncio.create_task(reader())

        for i, v in enumerate(VARIANTS):
            label = v[:80].replace("\n", " ")
            print(f"\n[{now()}] [{i:02d}>] {label}")
            try:
                await ws.send(v)
            except Exception as e:
                print(f"[{now()}] send failed: {e}")
                break
            await asyncio.sleep(1.5)  # let server respond

        print(f"\n[{now()}] all variants sent, listening 8 more seconds for late replies")
        await asyncio.sleep(8)
        reader_task.cancel()


if __name__ == "__main__":
    asyncio.run(probe())
