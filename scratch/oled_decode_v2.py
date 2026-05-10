r"""Deeper analysis of oled_p1.pcap — find OLED animation/image traffic.

We've already decoded the text mode (ec 53 00). Vlad confirms AC was set
to ANIMATION mode during capture, so we should also have image data in
the pcap that we missed first pass. Strategy:

  1. List ALL bulk OUT sizes (we saw only 768B but maybe missed others).
  2. Print the time-ordered sequence of HID prep + bulk OUT events to
     see what HID prep precedes each bulk burst.
  3. Look for any large HID INT OUT packets (>= 64B) that come in bursts.
"""
from __future__ import annotations

import struct
import sys
from collections import Counter, defaultdict
from pathlib import Path


def read_pcap(path: Path):
    with path.open("rb") as f:
        magic = f.read(4)
        if magic in (b"\xd4\xc3\xb2\xa1", b"\xa1\xb2\xc3\xd4"):
            endian = "<" if magic == b"\xd4\xc3\xb2\xa1" else ">"
        else:
            raise RuntimeError(f"unexpected pcap magic {magic!r}")
        f.read(20)
        while True:
            header = f.read(16)
            if len(header) < 16:
                return
            ts_sec, ts_usec, incl_len, orig_len = struct.unpack(endian + "IIII", header)
            data = f.read(incl_len)
            if len(data) < incl_len:
                return
            yield ts_sec + ts_usec / 1_000_000, data


def parse_usbpcap_record(packet: bytes):
    if len(packet) < 28:
        return None
    header_len = struct.unpack_from("<H", packet, 0)[0]
    if header_len < 27 or header_len > len(packet):
        return None
    bus = struct.unpack_from("<H", packet, 17)[0]
    device = struct.unpack_from("<H", packet, 19)[0]
    endpoint = packet[21]
    transfer = packet[22]
    data_length = struct.unpack_from("<I", packet, 23)[0]
    payload = packet[header_len:header_len + data_length]
    return {
        "bus": bus, "device": device, "endpoint": endpoint,
        "transfer": transfer, "data_length": data_length, "payload": payload,
    }


def main() -> int:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--pcap",
        default=r"C:\Users\vlad\Desktop\Polylux\scratch\captures\oled_custom_p1.pcap")
    parser.add_argument("--bus", type=int, default=1)
    parser.add_argument("--device", type=int, default=10)
    args = parser.parse_args()
    pcap_path = Path(args.pcap)
    target_device = (args.bus, args.device)
    print(f"Analyzing {pcap_path.name} for device bus={args.bus} dev={args.device}\n")

    # First pass: all bulk OUT sizes
    bulk_out_sizes: Counter = Counter()
    hid_int_out_sizes: Counter = Counter()
    for ts, pkt in read_pcap(pcap_path):
        rec = parse_usbpcap_record(pkt)
        if rec is None or (rec["bus"], rec["device"]) != target_device:
            continue
        if rec["endpoint"] & 0x80:
            continue
        if rec["transfer"] == 3:  # BULK
            bulk_out_sizes[rec["data_length"]] += 1
        elif rec["transfer"] == 1:  # INTERRUPT
            hid_int_out_sizes[rec["data_length"]] += 1
    print(f"BULK OUT size distribution:")
    for size, count in sorted(bulk_out_sizes.items()):
        print(f"  {size:5d}B  x {count}")
    print(f"\nHID INT OUT size distribution:")
    for size, count in sorted(hid_int_out_sizes.items()):
        print(f"  {size:5d}B  x {count}")

    # Second pass: time-ordered HID + bulk events
    print(f"\nFirst 60 events ordered in time (HID prefix + endpoint + size):\n")
    events = []
    for ts, pkt in read_pcap(pcap_path):
        rec = parse_usbpcap_record(pkt)
        if rec is None or (rec["bus"], rec["device"]) != target_device:
            continue
        if rec["endpoint"] & 0x80:
            continue
        events.append((ts, rec))

    if not events:
        print("(no events)")
        return 0
    t0 = events[0][0]
    for i, (ts, rec) in enumerate(events[:60]):
        dt = ts - t0
        ep = rec["endpoint"]
        xfer = {0: "ISO", 1: "INT", 2: "CTRL", 3: "BULK"}.get(rec["transfer"], "?")
        size = rec["data_length"]
        if size >= 8:
            head = " ".join(f"{b:02x}" for b in rec["payload"][:8])
        else:
            head = " ".join(f"{b:02x}" for b in rec["payload"])
        print(f"  +{dt:7.4f}s  ep=0x{ep:02x}  {xfer}  {size:4d}B  head={head}")

    # Third pass: chunk the events into "bursts" (gap > 50ms = new burst)
    print(f"\n\n=== Bursts (gap > 50ms separates them) ===\n")
    burst_threshold = 0.050
    bursts: list[list[dict]] = [[]]
    prev_ts = events[0][0]
    for ts, rec in events:
        if ts - prev_ts > burst_threshold and bursts[-1]:
            bursts.append([])
        bursts[-1].append((ts, rec))
        prev_ts = ts

    print(f"total bursts: {len(bursts)}")
    burst_signatures: Counter = Counter()
    for burst in bursts:
        sig_parts = []
        for ts, rec in burst[:6]:
            head = " ".join(f"{b:02x}" for b in rec["payload"][:4])
            ep = rec["endpoint"]
            xfer = {1: "I", 3: "B"}.get(rec["transfer"], "?")
            sig_parts.append(f"{xfer}{ep:02x}@{rec['data_length']}[{head}]")
        signature = " | ".join(sig_parts) + (" ..." if len(burst) > 6 else "")
        burst_signatures[signature] += 1
    print(f"\nMost common burst signatures (top 10):")
    for sig, count in burst_signatures.most_common(10):
        print(f"  {count:4d}x   {sig}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
