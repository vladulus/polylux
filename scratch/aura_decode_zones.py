r"""Extract distinct zone IDs and value sequences from Aura RGB pcap.

Per frame analysis: 0x1b chunks have 4 records of 4 bytes:
  <zone_id> 0xff <data1> <data2>

Goal: find all zone IDs used, and see how each zone's data varies over
time (to confirm interpretation as a "color" channel).
"""
from __future__ import annotations

import struct
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from aura_decode import read_pcap, parse_usbpcap_record


def main() -> int:
    pcap_path = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures\oled_custom_p1.pcap")
    target_device = (1, 10)

    zone_history: dict[int, list[tuple[int, int]]] = defaultdict(list)

    for ts, pkt in read_pcap(pcap_path):
        rec = parse_usbpcap_record(pkt)
        if rec is None or (rec["bus"], rec["device"]) != target_device:
            continue
        if rec["transfer"] != 2:
            continue
        payload = bytes(rec["payload"])
        if len(payload) < 28:
            continue
        if not (payload[0] == 0x21 and payload[1] == 0x09):
            continue
        data = payload[8:28]
        if len(data) != 20 or data[0] != 0x11 or data[1] != 0xff or data[2] != 0x0a:
            continue

        chunk_type = data[3]
        body = data[4:]

        if chunk_type == 0x1b:
            # 4 records of 4 bytes: <id> ff <d1> <d2>
            for i in range(0, 16, 4):
                if i + 3 < 16:
                    zid = body[i]
                    if body[i + 1] != 0xff:
                        continue
                    d1, d2 = body[i + 2], body[i + 3]
                    zone_history[zid].append((d1, d2))
        elif chunk_type == 0x5b:
            # 3 records of 5 bytes: <id> <id> ff <d1> <d2>
            for i in range(0, 15, 5):
                if i + 4 < 16:
                    zid = body[i]
                    if body[i + 2] != 0xff:
                        continue
                    d1, d2 = body[i + 3], body[i + 4]
                    zone_history[zid].append((d1, d2))

    print(f"Distinct zone IDs found: {len(zone_history)}\n")
    for zid in sorted(zone_history):
        history = zone_history[zid]
        n = len(history)
        # Sample: first 6 + last 6
        sample = history[:6] + [(None, None)] + history[-6:] if n > 12 else history
        d1_min = min(h[0] for h in history)
        d1_max = max(h[0] for h in history)
        d2_min = min(h[1] for h in history)
        d2_max = max(h[1] for h in history)
        diffs = [abs(h[0] - h[1]) for h in history]
        print(f"zone 0x{zid:02x} ({zid:3d}):  n={n}  d1 range=[{d1_min:3d}..{d1_max:3d}]  "
              f"d2 range=[{d2_min:3d}..{d2_max:3d}]  mean(|d1-d2|)={sum(diffs)/n:.1f}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
