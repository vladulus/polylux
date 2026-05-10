"""Probe ArmourySocketServer's plain-WebSocket channel on port 9013.

Per docs/PROJECT_STATE.md §6:
  socketServer = ws://127.0.0.1:9013, no auth, plain WS, "the hardware
  command channel". Used by asus_framework.exe instances to dispatch
  ExecuteFunction calls to ASUS plugin DLLs (ArmouryAIOSDK.dll, etc.)
  -> LightingService -> USB.

This probe:
  1. Connects (no path or various paths until something accepts).
  2. Sends a simple ConnectionOpen XML.
  3. Logs any reply.
  4. Tries a Get* query for AIO (DeviceType 50) to see read-side responses.

Read-only probes only. Per §10b rule 8: read before write.
"""
from __future__ import annotations

import asyncio
import sys
import uuid

import websockets


BASE_URL = "ws://127.0.0.1:9013"

# Vlad's hardware identifiers per PROJECT_STATE.md §3
DEVICE_TYPE_AIO = 50
RYUJIN_MODEL_UUID = "2dfe216d-3481-4684-ad4d-2566bd7cfe4f"


async def try_connect(url: str) -> None:
    print(f"[+] connecting to {url}")
    try:
        async with websockets.connect(url, open_timeout=3) as ws:
            print(f"[+] CONNECTED to {url}")

            # Per §6, asus_framework connects with role-based query string:
            # "?role=deviceService&deviceType={type}&pid={modelNumber}&dongleSN=&deviceSN="
            # but this URL was for nodeServer (port 1042). 9013 might not need it.

            # Send a basic ConnectionOpen probe. Server expects xmlbuilder
            # headless output where the top-level JS object key becomes the
            # root XML element. The aio service uses {xml: {command, device}}
            # which serialises as <xml>...</xml> (NOT <root>).
            session_key = str(uuid.uuid4())
            xml = (
                f"<xml>"
                f"<command>ConnectionOpen</command>"
                f"<device>{RYUJIN_MODEL_UUID}</device>"
                f"<sessionKey>{session_key}</sessionKey>"
                f"</xml>"
            )
            print(f"[->] {xml}")
            await ws.send(xml)

            # Wait for reply
            try:
                while True:
                    reply = await asyncio.wait_for(ws.recv(), timeout=3)
                    print(f"[<-] {reply!r}")
            except asyncio.TimeoutError:
                print("[+] no more messages within 3s")
    except Exception as ex:
        print(f"[!] {type(ex).__name__}: {ex}")


async def try_role_url() -> None:
    """Try the role-based URL pattern from §6 (which §6 says belongs to
    nodeServer port 1042, but some servers accept the same on the data
    port too)."""
    url = (
        f"{BASE_URL}/?role=deviceService&deviceType={DEVICE_TYPE_AIO}"
        f"&pid={RYUJIN_MODEL_UUID}&dongleSN=&deviceSN="
    )
    await try_connect(url)


async def main():
    print("=== plain root URL ===")
    await try_connect(BASE_URL)
    print()
    print("=== role-based URL (deviceService AIO) ===")
    await try_role_url()
    print()
    print("=== with trailing slash ===")
    await try_connect(BASE_URL + "/")


if __name__ == "__main__":
    asyncio.run(main())
