r"""Analyze full_init pcaps: find Ryujin LCD + OLED Custom + matrix init protocols.

Workflow:
  1. Walk pcap, collect per-device traffic stats (endpoint, transfer, size).
  2. Identify the 3 target ASUS devices by their endpoint signature:
       - PID 1A21 OLED Controller : ep 0x01 BULK OUT + ep 0x02 INT OUT + ep 0x82 INT IN
       - PID 1988 ROG Ryujin II  : same endpoint layout as 1A21
       - PID 18F3 Aura LED        : ep 0x00 CTRL only + ep 0x82 INT IN
     (device numbers vary across pcaps; identify by ep layout instead)
  3. For each target device, dump first 80 events ordered in time.
  4. Identify distinct HID prefixes + bulk OUT sizes.
"""
from __future__ import annotations

import struct
import sys
from collections import Counter, defaultdict
from pathlib import Path


def read_pcap(path: Path):
    with path.open("rb") as f:
        magic = f.read(4)
        endian = "<" if magic == b"\xd4\xc3\xb2\xa1" else ">"
        f.read(20)
        while True:
            header = f.read(16)
            if len(header) < 16:
                return
            ts_sec, ts_usec, incl_len, _ = struct.unpack(endian + "IIII", header)
            data = f.read(incl_len)
            if len(data) < incl_len:
                return
            yield ts_sec + ts_usec / 1_000_000, data


def parse_rec(packet: bytes):
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
    return {"bus": bus, "device": device, "endpoint": endpoint,
            "transfer": transfer, "data_length": data_length, "payload": payload}


def analyze_pcap(pcap_path: Path) -> None:
    print(f"\n{'=' * 70}\nANALYZING: {pcap_path.name}  ({pcap_path.stat().st_size / 1e6:.1f} MB)\n{'=' * 70}\n")

    # Pass 1: collect per-device stats
    per_dev_eps: defaultdict = defaultdict(lambda: defaultdict(int))
    per_dev_total: Counter = Counter()
    for ts, pkt in read_pcap(pcap_path):
        rec = parse_rec(pkt)
        if rec is None:
            continue
        key = (rec["bus"], rec["device"])
        per_dev_total[key] += 1
        per_dev_eps[key][(rec["endpoint"], rec["transfer"])] += 1

    print(f"Devices in pcap (top 10):")
    for key, n in per_dev_total.most_common(10):
        bus, dev = key
        eps = sorted(per_dev_eps[key].keys())
        # Try to identify ASUS chip by endpoint layout
        ep_set = set((ep, xfer) for ep, xfer in eps)
        hints = []
        if {(0x01, 3), (0x02, 1), (0x82, 1)}.issubset(ep_set):
            hints.append("ASUS chip (1A21 or 1988)")
        elif {(0x00, 2), (0x82, 1)}.issubset(ep_set):
            hints.append("Aura LED (18F3)")
        elif (0x85, 1) in ep_set and len(ep_set) == 1:
            hints.append("HID keyboard/mouse?")
        ep_str = " ".join(f"0x{ep:02x}/{({0:'CTRL',1:'INT',2:'CTRL',3:'BULK'}.get(xfer,'?'))}" for ep, xfer in eps)
        print(f"  bus={bus} dev={dev:3d}  pkts={n:7d}  eps=[{ep_str}]  {'<-- ' + ', '.join(hints) if hints else ''}")

    # Pass 2: focus on devices with HID class signature (ep 0x02 INT + ep 0x82 INT IN)
    # These include matrix/OLED chip, Ryujin LCD, possibly others.
    asus_chip_devices = [
        key for key, ep_traffic in per_dev_eps.items()
        if {(0x02, 1), (0x82, 1)}.issubset(set(ep_traffic.keys()))
    ]
    print(f"\nASUS chip device candidates: {asus_chip_devices}")

    for target in asus_chip_devices:
        print(f"\n--- Analyzing device bus={target[0]} dev={target[1]} ---")
        hid_prefixes: Counter = Counter()
        bulk_sizes: Counter = Counter()
        events_first = []
        events_last = []
        all_events = []
        n_int_out = n_bulk_out = 0
        for ts, pkt in read_pcap(pcap_path):
            rec = parse_rec(pkt)
            if rec is None or (rec["bus"], rec["device"]) != target:
                continue
            if rec["endpoint"] & 0x80:
                continue
            payload = bytes(rec["payload"])
            if rec["transfer"] == 1:
                n_int_out += 1
                if len(payload) >= 8:
                    hid_prefixes[payload[:8]] += 1
            elif rec["transfer"] == 3:
                n_bulk_out += 1
                bulk_sizes[rec["data_length"]] += 1
            all_events.append((ts, rec))
        events_first = all_events[:50]
        events_last = all_events[-20:]
        print(f"  HID INT OUT pkts: {n_int_out}")
        print(f"  Bulk OUT pkts: {n_bulk_out}")
        print(f"  Distinct HID prefixes (top 12):")
        for prefix, count in hid_prefixes.most_common(12):
            hex_str = " ".join(f"{b:02x}" for b in prefix)
            ascii_str = "".join(chr(b) if 32 <= b < 127 else "." for b in prefix)
            print(f"    {count:5d}x  {hex_str}  |{ascii_str}|")
        print(f"  Bulk OUT sizes:")
        for size, count in sorted(bulk_sizes.items()):
            print(f"    {count:5d}x  {size}B")

        if events_first:
            t0 = events_first[0][0]
            print(f"\n  First 30 events:")
            for i, (ts, rec) in enumerate(events_first[:30]):
                dt = ts - t0
                ep = rec["endpoint"]
                xfer = {0: "ISO", 1: "INT", 2: "CTRL", 3: "BULK"}.get(rec["transfer"], "?")
                size = rec["data_length"]
                head = " ".join(f"{b:02x}" for b in rec["payload"][:8])
                print(f"    +{dt:7.4f}s  ep=0x{ep:02x}  {xfer}  {size:4d}B  head={head}")


def main() -> int:
    base = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures")
    for name in ("full_init_p1.pcap", "full_init_p1_v2.pcap"):
        path = base / name
        if path.exists():
            analyze_pcap(path)
        else:
            print(f"missing: {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
