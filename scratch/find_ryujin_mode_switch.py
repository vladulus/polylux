r"""Find what HID commands precede the FIRST bulk OUT on Ryujin (dev 20)
in matrix_p1.pcap. That sequence likely contains the 'switch to Custom
Image mode' command."""
from __future__ import annotations
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from full_pcap_analyze import read_pcap, parse_rec


def main() -> int:
    pcap = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures\matrix_p1.pcap")
    target = (1, 20)

    all_events = []
    first_bulk_idx = None
    for ts, pkt in read_pcap(pcap):
        rec = parse_rec(pkt)
        if rec is None or (rec["bus"], rec["device"]) != target:
            continue
        if rec["endpoint"] & 0x80:
            continue
        all_events.append((ts, rec))
        if first_bulk_idx is None and rec["transfer"] == 3:
            first_bulk_idx = len(all_events) - 1

    if first_bulk_idx is None:
        print("no bulk OUT on dev 20")
        return 1

    print(f"First bulk OUT on dev 20 is event #{first_bulk_idx}")
    print(f"\nLast 30 HID events BEFORE first bulk:\n")
    start = max(0, first_bulk_idx - 30)
    t0 = all_events[start][0]
    for i in range(start, first_bulk_idx + 5):
        ts, rec = all_events[i]
        dt = ts - t0
        ep = rec["endpoint"]
        xfer = {0: "ISO", 1: "INT", 2: "CTRL", 3: "BULK"}.get(rec["transfer"], "?")
        size = rec["data_length"]
        head = " ".join(f"{b:02x}" for b in rec["payload"][:16])
        marker = "  <-- FIRST BULK" if i == first_bulk_idx else ""
        print(f"  #{i:3d} +{dt:7.4f}s  ep=0x{ep:02x}  {xfer}  {size:4d}B  head={head}{marker}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
