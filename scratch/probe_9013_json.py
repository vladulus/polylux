"""Probe ArmourySocketServer 9013 with JSON messages.

Captured wsasend traffic shows the server speaks JSON:
    {"command":"MatrixSync","device":"E7C8DA76-...","matrix_model_name":"..."}

So the protocol on 9013 is plain JSON-over-WebSocket. Try:
  1. Open WS to ws://127.0.0.1:9013
  2. Send ConnectionOpen JSON for the matrix device UUID
  3. Watch replies

Read-only; safe per §10b rule 8.
"""
import asyncio
import json
import uuid
import websockets


URL = "ws://127.0.0.1:9013"
MATRIX_DEVICE = "E7C8DA76-C9B9-4297-8681-DD878330AFE7"


async def probe(payload: dict, label: str, expect_seconds: float = 3.0) -> None:
    print(f"--- {label} ---")
    payload.setdefault("sessionKey", str(uuid.uuid4()))
    msg = json.dumps(payload, separators=(",", ":"))
    try:
        async with websockets.connect(URL, open_timeout=3) as ws:
            print(f"[->] {msg}")
            await ws.send(msg)
            try:
                while True:
                    reply = await asyncio.wait_for(ws.recv(), timeout=expect_seconds)
                    print(f"[<-] {reply!r}")
            except asyncio.TimeoutError:
                print(f"[+] no more messages within {expect_seconds}s")
    except Exception as ex:
        print(f"[!] {type(ex).__name__}: {ex}")
    print()


async def main():
    # 1. ConnectionOpen for matrix device
    await probe({
        "command": "ConnectionOpen",
        "device": MATRIX_DEVICE,
    }, "ConnectionOpen for matrix device")

    # 2. ConnectionOpen with deviceType field (the server's MatrixSync payload
    # had `matrix_model_name`, suggesting tagged variants)
    await probe({
        "command": "ConnectionOpen",
        "device": MATRIX_DEVICE,
        "device_type": "8",
    }, "ConnectionOpen with deviceType=8 (MBLED)")

    # 3. Try the AIO-format envelope (xml-style nested)
    # Probably won't work but useful to see error response
    await probe({
        "command": "MatrixSync",
        "device": MATRIX_DEVICE,
    }, "Echo MatrixSync (server's own pattern)")


if __name__ == "__main__":
    asyncio.run(main())
