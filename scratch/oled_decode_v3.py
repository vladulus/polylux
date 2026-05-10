r"""Decode OLED Custom Animation upload protocol from oled_custom_p1.pcap.

AC uses HID Set_Report via CONTROL endpoint (not INT OUT) for the OLED
image upload path. Setup packet:
  bmRequestType=0x21 (host->device, class, interface)
  bRequest=0x09 (SET_REPORT)
  wValue=0x0211 (Report Type=Output, Report ID=0x11)
  wIndex=0x0002 (interface 2 — note: device only has iface 0+1, so iface 2
                 in HID descriptor must mean a logical sub-interface...
                 actually wIndex=2 = HID interface number 1 + 1? Or it's
                 the actual HID interface index for the OLED.)
  wLength=20 (0x14)

We want:
  1. Count CTRL packets per device (find which one is the OLED).
  2. Pair Setup packet with following Data packet to get the 20B payload.
  3. Extract the byte content of each upload, see what the protocol looks
     like (header + chunk + pixel bytes).
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
    pcap_path = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures\oled_custom_p1.pcap")

    # Pass 1: per-device traffic + transfer breakdown
    print("Pass 1: traffic per device\n")
    per_dev_traffic: defaultdict = defaultdict(lambda: Counter())
    per_dev_total = Counter()
    n_pkts = 0
    for ts, pkt in read_pcap(pcap_path):
        n_pkts += 1
        rec = parse_usbpcap_record(pkt)
        if rec is None:
            continue
        key = (rec["bus"], rec["device"])
        per_dev_total[key] += 1
        ep_xfer = (rec["endpoint"], rec["transfer"])
        per_dev_traffic[key][ep_xfer] += 1

    print(f"total packets: {n_pkts}")
    for (bus, dev), n in per_dev_total.most_common(8):
        print(f"  bus={bus} dev={dev}  total={n}")
        for (ep, xfer), c in per_dev_traffic[(bus, dev)].most_common(5):
            xfer_name = {0: "ISO", 1: "INT", 2: "CTRL", 3: "BULK"}.get(xfer, "?")
            print(f"      ep=0x{ep:02x}  {xfer_name:5s}  x {c}")

    # Pass 2: focus on the device with lots of CTRL traffic — likely OLED upload.
    print("\nPass 2: find device with most CTRL OUT (upload candidate)\n")
    ctrl_per_dev = Counter()
    for (bus, dev), traffic in per_dev_traffic.items():
        ctrl_count = sum(c for (ep, xfer), c in traffic.items() if xfer == 2)
        ctrl_per_dev[(bus, dev)] = ctrl_count
    for (bus, dev), n in ctrl_per_dev.most_common(5):
        print(f"  bus={bus} dev={dev}  CTRL pkts = {n}")
    if not ctrl_per_dev:
        return 0
    target = ctrl_per_dev.most_common(1)[0][0]
    print(f"\n=> Target device: bus={target[0]} dev={target[1]}\n")

    # Pass 3: dump CTRL setup + data payloads
    print("Pass 3: first 30 CTRL transfers on target device\n")
    n_shown = 0
    setup_pending = None
    distinct_setups: Counter = Counter()
    distinct_data_first_bytes: Counter = Counter()
    setup_seen = []
    data_seen = []
    for ts, pkt in read_pcap(pcap_path):
        rec = parse_usbpcap_record(pkt)
        if rec is None or (rec["bus"], rec["device"]) != target:
            continue
        if rec["transfer"] != 2:   # CTRL only
            continue
        payload = bytes(rec["payload"])
        if len(payload) >= 8 and payload[0] in (0x21, 0xa1):
            # USB CONTROL with Setup+Data in same record: payload[0:8]=setup,
            # payload[8:8+wLen]=data, possibly followed by status completion.
            setup_pending = payload[:8]
            distinct_setups[setup_pending] += 1
            if len(setup_seen) < 30:
                setup_seen.append((ts, setup_pending))
            data = payload[8:]
            if data:
                if len(data_seen) < 30:
                    data_seen.append((ts, data, setup_pending))
                if len(data) >= 4:
                    distinct_data_first_bytes[data[:4]] += 1

    print(f"distinct Setup packets:")
    for setup, count in distinct_setups.most_common(10):
        # Decode setup
        if len(setup) >= 8:
            bmRT, bReq, wVal, wIdx, wLen = (
                setup[0], setup[1],
                struct.unpack("<H", setup[2:4])[0],
                struct.unpack("<H", setup[4:6])[0],
                struct.unpack("<H", setup[6:8])[0],
            )
            print(f"  {count:6d}x  bmRT=0x{bmRT:02x} bReq=0x{bReq:02x}  "
                  f"wVal=0x{wVal:04x} wIdx=0x{wIdx:04x} wLen={wLen}")

    print(f"\ndistinct first-4-bytes of data payloads (top 20):")
    for prefix, count in distinct_data_first_bytes.most_common(20):
        hexstr = " ".join(f"{b:02x}" for b in prefix)
        print(f"  {count:6d}x  {hexstr}")

    print(f"\nFirst 20 data payloads in time order (hex dump):")
    for ts, payload, setup in data_seen[:20]:
        hexpld = " ".join(f"{b:02x}" for b in payload[:32])
        ascii_pld = "".join(chr(b) if 32 <= b < 127 else "." for b in payload[:32])
        print(f"  +{ts:7.3f}  len={len(payload):3d}  {hexpld:<96s}  |{ascii_pld}|")

    return 0


if __name__ == "__main__":
    sys.exit(main())
