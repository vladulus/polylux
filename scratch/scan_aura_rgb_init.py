r"""Scan pcaps for Aura RGB chip (PID 0x18F3) init sequence.

The chip uses CTRL transfers (ep 0x00) for Set_Report, not BULK/INT OUT
like 1A21/1988. Goal: identify the early commands AC sends BEFORE the
normal per-zone color writes — those are the "enable" / "init" sequence
that OpenRGB might be missing, explaining why Vlad's BIOS-disabled MB
doesn't actually light up even when SDK clients send colors.
"""
from __future__ import annotations

import struct
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from full_pcap_analyze import read_pcap, parse_rec


def find_aura_devs(pcap_path: Path) -> list[tuple[int, int]]:
    """Aura chip signature: ep 0x00 CTRL + ep 0x82 INT IN (no bulk/INT OUT)."""
    per_dev_eps: defaultdict = defaultdict(set)
    for ts, pkt in read_pcap(pcap_path):
        rec = parse_rec(pkt)
        if rec is None: continue
        per_dev_eps[(rec["bus"], rec["device"])].add((rec["endpoint"], rec["transfer"]))
    auras = []
    for key, eps in per_dev_eps.items():
        # Aura: has ep 0x00 CTRL transfers (transfer=2 in pcap encoding)
        if (0x00, 2) in eps and (0x82, 1) in eps and not any(
            (ep, 3) in eps for ep in (0x01,)
        ):
            auras.append(key)
    return auras


def scan(pcap_path: Path) -> None:
    print(f"\n{'=' * 70}\n{pcap_path.name}\n{'=' * 70}")
    auras = find_aura_devs(pcap_path)
    print(f"Aura chip candidates: {auras}")
    for target in auras:
        events: list = []
        for ts, pkt in read_pcap(pcap_path):
            rec = parse_rec(pkt)
            if rec is None or (rec["bus"], rec["device"]) != target:
                continue
            if rec["endpoint"] & 0x80:
                continue  # skip IN
            events.append((ts, rec))
        if not events:
            continue
        print(f"\n--- dev {target}: {len(events)} OUT events ---")
        # Count distinct first-byte signatures (after the URB setup,
        # CTRL transfers have setup packet + data; pcap shows data only?)
        # For now show first ~50 events with their first 16 bytes.
        t0 = events[0][0]
        for i, (ts, rec) in enumerate(events[:50]):
            dt = ts - t0
            head = " ".join(f"{b:02x}" for b in rec["payload"][:16])
            print(f"  +{dt:7.4f}s  ep=0x{rec['endpoint']:02x} xfer={rec['transfer']} "
                  f"len={rec['data_length']:4d}  {head}")

        # Distinct command bytes (byte 0 of payload)
        first_bytes = Counter(bytes(rec["payload"][:1]) for _, rec in events)
        print(f"\n  Distinct first bytes:")
        for b, n in first_bytes.most_common(20):
            print(f"    {n:5d}x  0x{b[0]:02x}" if b else "    (empty)")


def main() -> int:
    base = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures")
    candidates = [
        "oled_custom_p1.pcap",  # noted as containing Aura RGB traffic
        "full_init_p1.pcap",
        "full_init_p1_v2.pcap",
        "matrix_p1.pcap",
    ]
    for name in candidates:
        p = base / name
        if p.exists():
            scan(p)
    return 0


if __name__ == "__main__":
    sys.exit(main())
