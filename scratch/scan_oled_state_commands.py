r"""Scan all OLED-related pcaps for state-switch commands on chip 1A21.

Goal: find the `ec 51 NN` (or other `ec NN`) command(s) that activate
OLED Custom Image display, and the analogous command for Ryujin LCD.

Strategy:
  1. For each pcap, identify the chip-1A21 device by endpoint signature
     (ep 0x01 BULK OUT + ep 0x02 INT OUT + ep 0x82 INT IN).
  2. Collect every distinct HID INT OUT payload (first 8 bytes).
  3. Surface commands that are NOT in the known §9.2 slot map.
  4. For each unknown command, dump timestamp + surrounding context
     (what came before/after — bulk size, other commands).
  5. Separately track Ryujin LCD device (PID 0x1988 — same endpoint
     signature, distinguish by which HID prefixes it uses).
"""
from __future__ import annotations

import struct
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from full_pcap_analyze import read_pcap, parse_rec


# Known ec 51 NN slots from §9.2
KNOWN_EC_51 = {
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05,
    0x09, 0x10, 0x11, 0x15,
}

# Other known ec NN prefixes from §9.1, §9.2, §9.3
KNOWN_EC_PREFIXES = {
    0x42,  # ec 42 01 = enable matrix display mode
    0x51,  # ec 51 NN = chip mode switch (slot map)
    0x53,  # ec 53 = OLED text write
    0x71,  # ec 71 = Ryujin LCD switch to Custom Image
    0x72,  # ec 72 = register upload
    0x73,  # ec 73 = start send / commit
    0x7f,  # ec 7f = bulk prep
    0x82,  # ec 82 = control packet (init)
    0xc1,  # ec c1 = frame companion
    0xdc,  # ec dc = heartbeat
    0xf1,  # ec f1 = unknown control (Ryujin)
}


def find_asus_chips(pcap_path: Path) -> list[tuple[int, int]]:
    """Return list of (bus, device) for devices matching ASUS chip endpoint signature."""
    per_dev_eps: defaultdict = defaultdict(set)
    for ts, pkt in read_pcap(pcap_path):
        rec = parse_rec(pkt)
        if rec is None:
            continue
        per_dev_eps[(rec["bus"], rec["device"])].add((rec["endpoint"], rec["transfer"]))
    chips = []
    for key, eps in per_dev_eps.items():
        if {(0x01, 3), (0x02, 1), (0x82, 1)}.issubset(eps):
            chips.append(key)
    return chips


def scan_chip(pcap_path: Path, target: tuple[int, int]) -> dict:
    """Walk pcap for one chip device. Return dict with all data."""
    hid_first8: Counter = Counter()
    bulk_sizes: Counter = Counter()
    ec_51_variants: Counter = Counter()
    other_ec: Counter = Counter()
    timeline = []  # list of (ts, kind, head8, size)

    for ts, pkt in read_pcap(pcap_path):
        rec = parse_rec(pkt)
        if rec is None or (rec["bus"], rec["device"]) != target:
            continue
        if rec["endpoint"] & 0x80:
            continue  # skip IN
        payload = bytes(rec["payload"])
        if rec["transfer"] == 1:  # INT OUT (HID)
            head8 = payload[:8]
            hid_first8[head8] += 1
            timeline.append((ts, "INT", head8, rec["data_length"]))
            if len(payload) >= 2 and payload[0] == 0xec:
                op = payload[1]
                if op == 0x51:
                    # capture more bytes for ec 51 to distinguish 10 01 01 etc
                    ec_51_variants[payload[:8]] += 1
                elif op not in KNOWN_EC_PREFIXES:
                    other_ec[payload[:8]] += 1
        elif rec["transfer"] == 3:  # BULK OUT
            bulk_sizes[rec["data_length"]] += 1
            timeline.append((ts, "BULK", b"", rec["data_length"]))

    return {
        "hid_first8": hid_first8,
        "bulk_sizes": bulk_sizes,
        "ec_51_variants": ec_51_variants,
        "other_ec": other_ec,
        "timeline": timeline,
    }


def hex_8(b: bytes) -> str:
    return " ".join(f"{x:02x}" for x in b[:8])


def report_chip(pcap_name: str, target: tuple[int, int], data: dict) -> None:
    print(f"\n--- {pcap_name}  bus={target[0]} dev={target[1]}  ---")

    # All ec 51 variants (full first-8-bytes)
    print(f"\n  ALL ec 51 variants seen ({sum(data['ec_51_variants'].values())} total events, {len(data['ec_51_variants'])} distinct):")
    for prefix, count in data["ec_51_variants"].most_common(30):
        nn = prefix[2] if len(prefix) >= 3 else -1
        known = "KNOWN" if nn in KNOWN_EC_51 else "*** UNKNOWN ***"
        print(f"    {count:5d}x  {hex_8(prefix)}   nn=0x{nn:02x}  [{known}]")

    # Other ec prefixes (not 0x42/51/53/71/72/73/7f/82/c1/dc/f1)
    if data["other_ec"]:
        print(f"\n  Other ec NN prefixes (UNKNOWN OPCODES):")
        for prefix, count in data["other_ec"].most_common(20):
            print(f"    {count:5d}x  {hex_8(prefix)}")
    else:
        print(f"\n  (no unknown ec NN opcodes — all in {sorted(hex(p) for p in KNOWN_EC_PREFIXES)})")

    # Bulk OUT size distribution
    print(f"\n  Bulk OUT sizes (top 10):")
    for size, count in sorted(data["bulk_sizes"].items(), key=lambda x: -x[1])[:10]:
        print(f"    {count:5d}x  {size}B")


def find_state_change_context(pcap_name: str, target: tuple[int, int],
                              data: dict, target_prefix_first3: bytes) -> None:
    """Show 5 events before/after each occurrence of target_prefix_first3."""
    timeline = data["timeline"]
    matches = [i for i, (_, kind, head, _) in enumerate(timeline)
               if kind == "INT" and head[:3] == target_prefix_first3]
    if not matches:
        return
    print(f"\n  Context around '{hex_8(target_prefix_first3)}...' in {pcap_name}:")
    for m in matches[:5]:
        t0 = timeline[m][0]
        print(f"    Event {m} at t={t0:.4f}s:")
        lo = max(0, m - 5)
        hi = min(len(timeline), m + 6)
        for i in range(lo, hi):
            ts, kind, head, size = timeline[i]
            dt = ts - t0
            marker = "  >>>" if i == m else "     "
            if kind == "INT":
                print(f"      {marker} {dt:+8.4f}s  INT   {size:4d}B  {hex_8(head)}")
            else:
                print(f"      {marker} {dt:+8.4f}s  BULK  {size:4d}B")


def main() -> int:
    base = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures")
    targets_pcaps = [
        "oled_p1.pcap",
        "oled_custom_p1.pcap",
        "oled_anim_p1.pcap",
        "full_init_p1_v2.pcap",
        "matrix_p1.pcap",
    ]
    for name in targets_pcaps:
        path = base / name
        if not path.exists():
            print(f"MISSING: {name}")
            continue
        print(f"\n{'=' * 78}\n{name}  ({path.stat().st_size / 1e6:.1f} MB)\n{'=' * 78}")
        chips = find_asus_chips(path)
        print(f"Chip-signature devices: {chips}")
        for target in chips:
            data = scan_chip(path, target)
            # Skip devices with zero ec 51 traffic — those are noise
            if not data["ec_51_variants"] and not data["other_ec"] and not data["bulk_sizes"]:
                continue
            report_chip(name, target, data)
    return 0


if __name__ == "__main__":
    sys.exit(main())
