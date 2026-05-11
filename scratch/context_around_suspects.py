r"""Dump 10-event window before/after each suspect command.

Suspects:
  OLED chip (1A21):
    ec 5c 01 01  — one-shot, appears in every OLED session
    ec d0 00     — frequent, possibly heartbeat
  Ryujin LCD chip (1988):
    ec 99 00     — one-shot
    ec a0 00     — one-shot
    ec a1 00     — one-shot
    ec 52 00 03 02 02  — frequent

For each suspect, also report what came BEFORE the first occurrence
in the session — that's the "we just uploaded, now flip state" moment.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from full_pcap_analyze import read_pcap, parse_rec


def collect_events(pcap_path: Path, target: tuple[int, int]) -> list:
    """All OUT events for target device, in time order."""
    out = []
    for ts, pkt in read_pcap(pcap_path):
        rec = parse_rec(pkt)
        if rec is None or (rec["bus"], rec["device"]) != target:
            continue
        if rec["endpoint"] & 0x80:
            continue
        payload = bytes(rec["payload"])
        out.append((ts, rec["transfer"], rec["data_length"], payload))
    return out


def hex_n(b: bytes, n: int) -> str:
    return " ".join(f"{x:02x}" for x in b[:n])


def dump_around(events: list, indices: list, label: str, window: int = 10) -> None:
    if not indices:
        print(f"\n  No occurrences of {label}.")
        return
    print(f"\n  {label} — {len(indices)} occurrence(s), first 3 with ±{window} context:")
    for hit_idx in indices[:3]:
        ts0 = events[hit_idx][0]
        print(f"\n    Hit at event idx {hit_idx}, t={ts0:.4f}s:")
        lo = max(0, hit_idx - window)
        hi = min(len(events), hit_idx + window + 1)
        for i in range(lo, hi):
            ts, xfer, size, payload = events[i]
            dt = ts - ts0
            kind = {1: "INT", 3: "BULK"}.get(xfer, f"x{xfer}")
            marker = "  >>>" if i == hit_idx else "     "
            if xfer == 1:
                print(f"      {marker} idx={i:5d}  {dt:+9.4f}s  {kind}   {size:4d}B   {hex_n(payload, 8)}")
            else:
                print(f"      {marker} idx={i:5d}  {dt:+9.4f}s  {kind}  {size:5d}B")


def scan(pcap_path: Path, target: tuple[int, int], suspects: list[bytes]) -> None:
    print(f"\n{'=' * 78}")
    print(f"{pcap_path.name}  device bus={target[0]} dev={target[1]}")
    print(f"{'=' * 78}")
    events = collect_events(pcap_path, target)
    print(f"Total OUT events: {len(events)}")

    for sus in suspects:
        indices = [
            i for i, (_, xfer, _, payload) in enumerate(events)
            if xfer == 1 and payload[:len(sus)] == sus
        ]
        dump_around(events, indices, f"ec {hex_n(sus, len(sus))}")


def main() -> int:
    base = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures")

    # OLED-side suspects (chip 1A21)
    oled_suspects = [
        bytes([0xec, 0x5c, 0x01, 0x01]),
        bytes([0xec, 0xd0, 0x00]),
    ]

    # Ryujin LCD-side suspects (chip 1988)
    ryujin_suspects = [
        bytes([0xec, 0x99]),
        bytes([0xec, 0xa0]),
        bytes([0xec, 0xa1]),
        bytes([0xec, 0x52, 0x00, 0x03, 0x02, 0x02]),
    ]

    oled_pcaps = [
        ("oled_p1.pcap", (1, 10)),
        ("oled_custom_p1.pcap", (1, 12)),
        ("full_init_p1_v2.pcap", (1, 7)),
    ]
    for name, target in oled_pcaps:
        path = base / name
        if path.exists():
            scan(path, target, oled_suspects)

    # Ryujin: dev 20 in matrix_p1
    print(f"\n\n{'#' * 78}\n# RYUJIN LCD CHIP (PID 1988)\n{'#' * 78}")
    path = base / "matrix_p1.pcap"
    if path.exists():
        scan(path, (1, 20), ryujin_suspects)

    return 0


if __name__ == "__main__":
    sys.exit(main())
