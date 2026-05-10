r"""Replay captured Aura RGB frames to the AURA LED Controller.

Uses HID Output Reports (Report ID 0x11, 20 bytes payload) via the
Windows HID stack (hidapi). Sends 3-chunk frames captured from
oled_custom_p1.pcap to PID 0x18F3.

If LEDs change color (RAM, AIO, etc.), the protocol is validated and
we can build a proper driver.
"""
from __future__ import annotations

import sys
import time
from pathlib import Path


# Captured frames from oled_custom_p1.pcap (first 3 frames, all 3-chunk).
# Each chunk is the 20-byte HID data payload.
CAPTURED_FRAMES = [
    [
        bytes.fromhex("11ff0a1b 07ff3a3d 25ff8f8f 3eff080c 41ffc2c3".replace(" ", "")),
        bytes.fromhex("11ff0a5b 4949ff3a 3d5a5aff d4d56464 ffb2b300".replace(" ", "")),
        bytes.fromhex("11ff0a7b 00000000 00000000 00000000 00000000".replace(" ", "")),
    ],
    [
        bytes.fromhex("11ff0a1b 07ff2e31 25ff9b9c 3eff0004 41ffb6b7".replace(" ", "")),
        bytes.fromhex("11ff0a1b 47fffcfc 49ff474b 5affe1e1 64ffbebe".replace(" ", "")),
        bytes.fromhex("11ff0a7b 00000000 00000000 00000000 00000000".replace(" ", "")),
    ],
    [
        bytes.fromhex("11ff0a1b 07ff2225 25ffa7a7 3eff0a0f 41ffaaaa".replace(" ", "")),
        bytes.fromhex("11ff0a1b 47fff0f0 49ff5357 5affeded 64ffcbcc".replace(" ", "")),
        bytes.fromhex("11ff0a7b 00000000 00000000 00000000 00000000".replace(" ", "")),
    ],
]


# 7-byte command captured rarely (Report ID 0x10):
INIT_CMD_10 = bytes.fromhex("10ff060b 000000")   # observed 8x in pcap


def main() -> int:
    import hid

    # Find Aura LED Controller
    aura_devs = list(hid.enumerate(0x0B05, 0x18F3))
    if not aura_devs:
        print("AURA LED Controller (PID 0x18F3) not found", file=sys.stderr)
        return 2
    print(f"Found AURA: {aura_devs[0]['product_string']}")

    dev = hid.device()
    try:
        dev.open_path(aura_devs[0]["path"])
    except OSError as ex:
        print(f"Failed to open AURA device: {ex}", file=sys.stderr)
        print("(Is LightingService.exe holding it exclusively? Kill it first.)")
        return 2

    try:
        # On Windows, hidapi.write() expects [report_id, ...payload] where
        # the TOTAL length matches the max output report size declared in
        # the device's HID descriptor (often 65B = 1 ID + 64 payload).
        # Pad our 20-byte captured chunks to that size with trailing zeros.
        print(f"Replaying 3 captured Aura RGB frames at 100ms intervals...")
        for fi in range(20):
            frame = CAPTURED_FRAMES[fi % len(CAPTURED_FRAMES)]
            for chunk in frame:
                padded = bytes(chunk) + b"\x00" * (65 - len(chunk))
                n = dev.write(padded)
                if n < 0:
                    print(f"  HID write failed: {dev.error()}")
                    # Try send_feature_report fallback
                    print(f"  Falling back to send_feature_report...")
                    n = dev.send_feature_report(padded)
                    if n < 0:
                        return 1
            time.sleep(0.1)
        print("done.")
    finally:
        dev.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
