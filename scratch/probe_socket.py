"""
Probe ArmourySocketServer (ws://127.0.0.1:9013) by sending ConnectionOpen
and a benign query, watching what comes back.

The wire protocol (decoded from beautified service.js):
  - Outgoing: XML strings (xmlbuilder-style, root element implicit)
  - Incoming: JSON strings
  - No auth, no TLS, plain WebSocket
"""
from __future__ import annotations

import asyncio
import json
from typing import Any

import websockets

URL = "ws://127.0.0.1:9013"

# AIO (Ryujin) device on this PC. Confirmed from
# C:\Program Files (x86)\ASUS\ArmouryDevice\View\2dfe216d-3481-4684-ad4d-2566bd7cfe4f\config.ini
# DeviceType = 50
AIO_MODEL = "2dfe216d-3481-4684-ad4d-2566bd7cfe4f"

# Motherboard. DeviceType = 8
MB_MODEL = "E7C8DA76-C9B9-4297-8681-DD878330AFE7"


def make_xml_simple(command: str, device: str, **extra: str) -> str:
    """Replicate xmlbuilder Builder({headless:true}).buildObject(obj).

    For a flat dict like {command, device, dongleSN}, output is
        <root><command>...</command><device>...</device></root>
    The aio service wraps payloads under a <root> by default.
    """
    parts = [f"<{k}>{v}</{k}>" for k, v in {"command": command, "device": device, **extra}.items()]
    return "<root>" + "".join(parts) + "</root>"


async def probe() -> None:
    async with websockets.connect(
        URL,
        open_timeout=5,
        max_size=None,
        additional_headers={"Origin": "http://127.0.0.1:1042"},
    ) as ws:
        print(f"[+] connected to {URL}")

        # Step 1: ConnectionOpen for AIO. This is what aio service.js
        # sends in onopen — a handshake that registers our intent to talk
        # to that device.
        msg = make_xml_simple("ConnectionOpen", AIO_MODEL)
        print(f"[>] {msg}")
        await ws.send(msg)

        # Step 2: ask for device description — benign read query.
        msg2 = make_xml_simple("GetDeviceDescription", AIO_MODEL)
        print(f"[>] {msg2}")
        await ws.send(msg2)

        # Step 3: also try the MB (ConnectionOpen + GetDeviceDescription)
        msg3 = make_xml_simple("ConnectionOpen", MB_MODEL)
        print(f"[>] {msg3}")
        await ws.send(msg3)

        msg4 = make_xml_simple("GetDeviceDescription", MB_MODEL)
        print(f"[>] {msg4}")
        await ws.send(msg4)

        # Read whatever comes back for ~6 seconds
        end = asyncio.get_event_loop().time() + 6
        while asyncio.get_event_loop().time() < end:
            try:
                data = await asyncio.wait_for(ws.recv(), timeout=end - asyncio.get_event_loop().time())
            except asyncio.TimeoutError:
                break
            if isinstance(data, bytes):
                print(f"[<] (binary {len(data)} bytes) {data[:120]!r}")
                continue
            try:
                obj: Any = json.loads(data)
                print(f"[<] JSON: {json.dumps(obj, indent=2)[:800]}")
            except json.JSONDecodeError:
                print(f"[<] TEXT ({len(data)}): {data[:400]}")


if __name__ == "__main__":
    asyncio.run(probe())
