"""Probe ws://127.0.0.1:9013 using the *real* ASUS XML envelope discovered
in C:\\ProgramData\\ASUS\\ACUTLog\\LOG\\AC30\\*.xml.

These XML reference files have the canonical structure: <root> wrapping
<header>ASUS_AURA</header><version>X</version><funcid>N</funcid> + body.
"""
from __future__ import annotations

import asyncio
import datetime

import websockets

URL = "ws://127.0.0.1:9013"


def now() -> str:
    return datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]


# Structures cribbed verbatim from ProgramData\ASUS\ACUTLog\LOG\AC30\*.xml.
# funcid 1 = GetDeviceStatus, funcid 2 = GetDeviceCap, plus the QueryAllDevice
# format which uses <header>AURA Devices</header>.
PROBES = [
    (
        "QueryAllDevice (header=AURA Devices)",
        '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>'
        "<root>"
        "<header>AURA Devices</header>"
        "<version>1.0</version>"
        "</root>",
    ),
    (
        "GetDeviceStatus funcid=1",
        '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>'
        "<root>"
        "<header>ASUS_AURA</header>"
        "<version>1.2</version>"
        "<funcid>1</funcid>"
        "</root>",
    ),
    (
        "GetDeviceCap funcid=2",
        '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>'
        "<root>"
        "<header>ASUS_AURA</header>"
        "<version>1.0</version>"
        "<funcid>2</funcid>"
        "</root>",
    ),
    (
        "ASUS_AURA funcid=0 (probe-zero)",
        "<root>"
        "<header>ASUS_AURA</header>"
        "<version>1.0</version>"
        "<funcid>0</funcid>"
        "</root>",
    ),
    # Headerless variants (xmlbuilder { headless: true } in JS strips prolog)
    (
        "ASUS_AURA funcid=1 headless",
        "<root><header>ASUS_AURA</header><version>1.2</version><funcid>1</funcid></root>",
    ),
    # Try the AURA_3.0 header from SetMatrixLEDScript
    (
        "AURA_3.0 query",
        "<root><header>AURA_3.0</header><version>1.0</version></root>",
    ),
]


async def probe() -> None:
    async with websockets.connect(
        URL, open_timeout=5, max_size=None,
        additional_headers={"Origin": "http://127.0.0.1:1042"},
    ) as ws:
        print(f"[{now()}] connected to {URL}")

        async def reader():
            try:
                while True:
                    msg = await ws.recv()
                    text = msg if isinstance(msg, str) else f"BIN[{len(msg)}]"
                    print(f"[{now()}] [<<< REPLY <<<] {text[:1200]}")
            except websockets.ConnectionClosed:
                print(f"[{now()}] reader: closed")

        reader_task = asyncio.create_task(reader())

        for label, payload in PROBES:
            print(f"\n[{now()}] [>>> {label}]")
            print(f"          {payload[:200]}")
            await ws.send(payload)
            await asyncio.sleep(2.0)

        print(f"\n[{now()}] all probes sent — listening 8s for late replies")
        await asyncio.sleep(8)
        reader_task.cancel()


if __name__ == "__main__":
    asyncio.run(probe())
