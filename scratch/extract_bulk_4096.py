r"""Extract the 4096B bulk OUT chunk from full_init_p1_v2.pcap on device 7.

This is the only bulk OUT in the capture - likely Ryujin LCD image data
or OLED Custom Image upload. Dump it to a binary file for inspection.

Also extract the HID INT OUT context: what command precedes the bulk?
"""
from __future__ import annotations

import struct
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from full_pcap_analyze import read_pcap, parse_rec


def main() -> int:
    pcap_path = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures\full_init_p1_v2.pcap")
    target_device = (1, 7)

    bulk_payload = None
    bulk_timestamp = None
    recent_hids: list[tuple[float, bytes]] = []

    for ts, pkt in read_pcap(pcap_path):
        rec = parse_rec(pkt)
        if rec is None or (rec["bus"], rec["device"]) != target_device:
            continue
        if rec["endpoint"] & 0x80:
            continue
        if rec["transfer"] == 1 and rec["data_length"] >= 8:
            recent_hids.append((ts, bytes(rec["payload"])))
        elif rec["transfer"] == 3 and rec["data_length"] == 4096:
            bulk_payload = bytes(rec["payload"])
            bulk_timestamp = ts
            break

    if bulk_payload is None:
        print("4096B bulk not found", file=sys.stderr)
        return 1

    print(f"Found 4096B bulk at t={bulk_timestamp:.4f}s\n")

    # Show last 10 HID packets BEFORE the bulk (context)
    print(f"Last 10 HID packets before the bulk:")
    for ts, payload in recent_hids[-10:]:
        dt = bulk_timestamp - ts
        hex_str = " ".join(f"{b:02x}" for b in payload[:16])
        ascii_str = "".join(chr(b) if 32 <= b < 127 else "." for b in payload[:16])
        print(f"  -{dt:6.3f}s  {hex_str:<48s}  |{ascii_str}|")

    print(f"\nBulk content (first 256 bytes):")
    for i in range(0, min(256, len(bulk_payload)), 16):
        chunk = bulk_payload[i:i + 16]
        hex_str = " ".join(f"{b:02x}" for b in chunk)
        ascii_str = "".join(chr(b) if 32 <= b < 127 else "." for b in chunk)
        print(f"  {i:4d}: {hex_str:<48s}  |{ascii_str}|")

    # Stats on bulk
    print(f"\nBulk stats: len={len(bulk_payload)}")
    print(f"  bytes 0..15: {bulk_payload[:16].hex()}")
    print(f"  zeros: {bulk_payload.count(0)}/{len(bulk_payload)}")
    print(f"  unique bytes: {len(set(bulk_payload))}")

    # Save to disk for further analysis
    out = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures\bulk_4096_dev7.bin")
    out.write_bytes(bulk_payload)
    print(f"\nSaved to {out}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
