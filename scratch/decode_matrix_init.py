r"""Extract matrix init sequence + Ryujin LCD protocol from matrix_p1.pcap."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from full_pcap_analyze import read_pcap, parse_rec


def main() -> int:
    pcap_path = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures\matrix_p1.pcap")

    # Pass 1: collect all events for device 7 (matrix) and 20 (Ryujin)
    matrix_events = []
    ryujin_events = []
    for ts, pkt in read_pcap(pcap_path):
        rec = parse_rec(pkt)
        if rec is None:
            continue
        if (rec["bus"], rec["device"]) == (1, 7):
            if not (rec["endpoint"] & 0x80):
                matrix_events.append((ts, rec))
        elif (rec["bus"], rec["device"]) == (1, 20):
            if not (rec["endpoint"] & 0x80):
                ryujin_events.append((ts, rec))

    print(f"\n=== Matrix (dev 7): {len(matrix_events)} events ===\n")
    print(f"First 60 events:")
    if matrix_events:
        t0 = matrix_events[0][0]
        for ts, rec in matrix_events[:60]:
            dt = ts - t0
            ep = rec["endpoint"]
            xfer = {0: "ISO", 1: "INT", 2: "CTRL", 3: "BULK"}.get(rec["transfer"], "?")
            size = rec["data_length"]
            head = " ".join(f"{b:02x}" for b in rec["payload"][:16])
            print(f"  +{dt:7.4f}s  ep=0x{ep:02x}  {xfer}  {size:4d}B  head={head}")

    print(f"\n=== Ryujin LCD (dev 20): {len(ryujin_events)} events ===\n")
    print(f"First 60 events:")
    if ryujin_events:
        t0 = ryujin_events[0][0]
        for ts, rec in ryujin_events[:60]:
            dt = ts - t0
            ep = rec["endpoint"]
            xfer = {0: "ISO", 1: "INT", 2: "CTRL", 3: "BULK"}.get(rec["transfer"], "?")
            size = rec["data_length"]
            head = " ".join(f"{b:02x}" for b in rec["payload"][:16])
            print(f"  +{dt:7.4f}s  ep=0x{ep:02x}  {xfer}  {size:4d}B  head={head}")

    # Extract first Ryujin bulk content
    print(f"\n=== First Ryujin bulk OUT (4096B) content ===\n")
    for ts, rec in ryujin_events:
        if rec["transfer"] == 3 and rec["data_length"] == 4096:
            payload = bytes(rec["payload"])
            # Save to disk
            out = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures\ryujin_first_bulk.bin")
            out.write_bytes(payload)
            print(f"Saved first 4096B bulk to {out}")
            print(f"  First 64 bytes (hex):")
            for i in range(0, 64, 16):
                chunk = payload[i:i + 16]
                hex_str = " ".join(f"{b:02x}" for b in chunk)
                ascii_str = "".join(chr(b) if 32 <= b < 127 else "." for b in chunk)
                print(f"    {i:4d}: {hex_str:<48s}  |{ascii_str}|")
            break

    return 0


if __name__ == "__main__":
    sys.exit(main())
