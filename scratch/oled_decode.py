r"""Decode OLED HID command(s) from USBPcap capture.

The matrix uses prefix [0xEC, 0x7F, 0x04, 0x00, 0x03] on the HID INT OUT
endpoint (iface 1, ep 0x02). We expect OLED to use a similar 65-byte HID
prep packet with a DIFFERENT prefix.

Strategy:
  1. Read pcap, filter on bus/device matching VID 0x0B05 PID 0x1A21.
  2. Extract all OUT transfers (HID INT OUT + Bulk OUT).
  3. Group by transfer size; the 65B HID prep packets stand out.
  4. Print distinct HID prep prefixes (first 8 bytes) seen during OLED Apply.
"""
from __future__ import annotations

import struct
import sys
from collections import Counter, defaultdict
from pathlib import Path


def read_pcap(path: Path):
    """Yield (timestamp, packet_data) tuples from a libpcap-format file."""
    with path.open("rb") as f:
        magic = f.read(4)
        if magic in (b"\xd4\xc3\xb2\xa1", b"\xa1\xb2\xc3\xd4"):
            endian = "<" if magic == b"\xd4\xc3\xb2\xa1" else ">"
        else:
            raise RuntimeError(f"unexpected pcap magic {magic!r}")
        f.read(20)   # version (4), thiszone (4), sigfigs (4), snaplen (4), network (4)
        while True:
            header = f.read(16)
            if len(header) < 16:
                return
            ts_sec, ts_usec, incl_len, orig_len = struct.unpack(endian + "IIII", header)
            data = f.read(incl_len)
            if len(data) < incl_len:
                return
            ts = ts_sec + ts_usec / 1_000_000
            yield ts, data


def parse_usbpcap_record(packet: bytes):
    """Parse the USBPcap pseudo-header at start of each packet record.

    USBPcap header layout (little-endian):
      u16 headerLen
      u64 irpId
      u32 status
      u16 function
      u8  info
      u16 bus
      u16 device
      u8  endpoint
      u8  transfer
      u32 dataLength
    (= 28 bytes minimum, plus URB-specific fields based on transfer type)
    """
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
        "bus": bus,
        "device": device,
        "endpoint": endpoint,
        "transfer": transfer,
        "data_length": data_length,
        "payload": payload,
    }


def main() -> int:
    pcap_path = Path(r"C:\Users\vlad\Desktop\Polylux\scratch\captures\oled_p1.pcap")
    if not pcap_path.exists():
        print(f"missing: {pcap_path}", file=sys.stderr)
        return 2

    transfer_types = {0: "ISOCH", 1: "INTERRUPT", 2: "CONTROL", 3: "BULK"}
    device_filter: set[int] | None = None   # populated below

    # First pass: figure out which (bus, device) corresponds to our 1A21 chip.
    # USBPcap injects URB_FUNCTION_GET_DESCRIPTOR or similar early in the
    # capture if --inject-descriptors is on. The device descriptor includes
    # idVendor and idProduct. Simpler: just find packets whose 64-byte
    # bulk OUT contains the matrix-style data and capture the device id
    # they use.
    #
    # Even simpler: count packets per (bus, device) and report; we expect
    # 1A21 to be the most active device during the OLED Apply.

    per_device_count: Counter = Counter()
    per_device_endpoints: defaultdict = defaultdict(set)
    interesting_records = []
    n_pkts = 0
    for ts, pkt in read_pcap(pcap_path):
        n_pkts += 1
        rec = parse_usbpcap_record(pkt)
        if rec is None:
            continue
        key = (rec["bus"], rec["device"])
        per_device_count[key] += 1
        per_device_endpoints[key].add(rec["endpoint"])

    print(f"total packets: {n_pkts}")
    print(f"per-device packet counts (top 10):")
    for (bus, dev), n in per_device_count.most_common(10):
        eps = sorted(per_device_endpoints[(bus, dev)])
        ep_str = " ".join(f"0x{e:02x}" for e in eps)
        print(f"  bus={bus}  device={dev}  pkts={n:5d}  endpoints={ep_str}")

    if not per_device_count:
        return 0

    # Look for the device that has BOTH ep 0x01 BULK OUT and ep 0x02 INT OUT
    # (signatures of the OLED Controller / AniMe Matrix chip per PID 1A21).
    candidate = None
    for (bus, dev), eps in per_device_endpoints.items():
        if 0x01 in eps and 0x02 in eps:
            candidate = (bus, dev)
            break
    if candidate is None:
        candidate = per_device_count.most_common(1)[0][0]
        print(f"\nNo device with 0x01+0x02 OUT found; falling back to most active")
    top_device = candidate
    print(f"\nFiltering to top device: bus={top_device[0]} device={top_device[1]}")

    # Second pass: dump all HID INT OUT + Bulk OUT data for that device.
    hid_prefixes_seen: Counter = Counter()
    bulk_sizes: Counter = Counter()
    n_int_out = n_bulk_out = 0

    for ts, pkt in read_pcap(pcap_path):
        rec = parse_usbpcap_record(pkt)
        if rec is None or (rec["bus"], rec["device"]) != top_device:
            continue
        ep = rec["endpoint"]
        if ep & 0x80:
            continue   # skip IN transfers
        xfer = rec["transfer"]
        size = rec["data_length"]
        payload = rec["payload"]
        if xfer == 1:   # INTERRUPT (HID)
            n_int_out += 1
            if len(payload) >= 8:
                hid_prefixes_seen[bytes(payload[:8])] += 1
        elif xfer == 3:  # BULK
            n_bulk_out += 1
            bulk_sizes[size] += 1

    print(f"\nHID INT OUT packets: {n_int_out}")
    print(f"Bulk OUT packets:    {n_bulk_out}")
    print(f"\nDistinct HID prefixes (first 8 bytes):")
    for prefix, count in hid_prefixes_seen.most_common(20):
        hexstr = " ".join(f"{b:02x}" for b in prefix)
        print(f"  {count:4d}x   {hexstr}")
    print(f"\nBulk OUT size distribution:")
    for size, count in sorted(bulk_sizes.items()):
        print(f"  {count:4d}x   {size}B")

    # Third pass: dump full content of one example for each unique prefix
    print(f"\n=== Full sample for each unique HID prefix (first 65 bytes) ===\n")
    samples_per_prefix: dict[bytes, bytes] = {}
    for ts, pkt in read_pcap(pcap_path):
        rec = parse_usbpcap_record(pkt)
        if rec is None or (rec["bus"], rec["device"]) != top_device:
            continue
        if rec["endpoint"] & 0x80 or rec["transfer"] != 1:
            continue
        payload = bytes(rec["payload"])
        if len(payload) < 8:
            continue
        prefix = payload[:8]
        if prefix in samples_per_prefix:
            continue
        samples_per_prefix[prefix] = payload

    for prefix, sample in sorted(samples_per_prefix.items(),
                                  key=lambda p: -hid_prefixes_seen[p[0]]):
        count = hid_prefixes_seen[prefix]
        hexpref = " ".join(f"{b:02x}" for b in prefix)
        print(f"--- prefix {hexpref}  ({count}x, full size {len(sample)}B) ---")
        # hex dump in 16-byte rows
        for i in range(0, min(len(sample), 65), 16):
            chunk = sample[i:i + 16]
            hexstr = " ".join(f"{b:02x}" for b in chunk)
            asciistr = "".join(chr(b) if 32 <= b < 127 else "." for b in chunk)
            print(f"  {i:3d}: {hexstr:<48s}  |{asciistr}|")
        print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
