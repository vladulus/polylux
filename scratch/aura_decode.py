r"""Decode the Aura RGB controller protocol from oled_custom_p1.pcap.

In that capture, bus=1 dev=10 received 40413 HID Set_Report transfers
via Control ep 0x00 with Report ID 0x11 (20-byte payload). The data was
NOT OLED image upload (which we failed to capture); it was Aura RGB
sync traffic that AC was running in parallel.

Payload structure observed:
  byte 0     = 0x11        Report ID
  byte 1     = 0xff        ???
  byte 2     = 0x0a        ??? (cmd 'set zone colors'?)
  byte 3     = chunk-type  (0x1b, 0x5b, 0x7b, 0x6b cycling)
  bytes 4-19 = data        (16 bytes of per-zone color data)

Chunk types observed:
  0x1b (21288x): "data chunk start" (most common — likely first chunk of frame)
  0x7b (10882x): "frame terminator" (all-zero data body — marks end of frame)
  0x5b ( 8230x): "data chunk mid"
  0x6b (   13x): "data chunk special" (rare)

This script:
  1. Identifies the USB device descriptor for dev=10 (find VID/PID).
  2. Groups successive Setup+Data packets into "frames" by 0x7b terminator.
  3. Stats how many data chunks per frame.
  4. Dumps first 10 frames as hex for visual inspection.
"""
from __future__ import annotations

import struct
import sys
from collections import Counter
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
    target_device = (1, 10)

    # Look for the USB device descriptor for bus=1 dev=10.
    # USBPcap injects these as URB_FUNCTION_GET_DESCRIPTOR-type packets.
    print("Looking for device descriptor (VID/PID for dev=10)...\n")
    for ts, pkt in read_pcap(pcap_path):
        rec = parse_usbpcap_record(pkt)
        if rec is None or (rec["bus"], rec["device"]) != target_device:
            continue
        # Device descriptor first 18 bytes: bLength=18, bDescriptorType=1, ...
        # idVendor at offset 8 (2 bytes LE), idProduct at offset 10.
        for i in range(min(len(rec["payload"]) - 18, 64)):
            chunk = rec["payload"][i:i + 18]
            if (len(chunk) == 18 and chunk[0] == 18 and chunk[1] == 1):
                vid = struct.unpack("<H", chunk[8:10])[0]
                pid = struct.unpack("<H", chunk[10:12])[0]
                print(f"Found device descriptor for dev=10:")
                print(f"  VID 0x{vid:04x} PID 0x{pid:04x}")
                break
        else:
            continue
        break
    else:
        print("(no device descriptor found in capture for dev=10)")

    print()

    # Pass: extract all 20-byte payloads + group into frames.
    frames: list[list[bytes]] = []
    current_frame: list[bytes] = []
    chunk_type_in_frame: list[int] = []
    n_total = 0

    for ts, pkt in read_pcap(pcap_path):
        rec = parse_usbpcap_record(pkt)
        if rec is None or (rec["bus"], rec["device"]) != target_device:
            continue
        if rec["transfer"] != 2:   # CTRL only
            continue
        payload = bytes(rec["payload"])
        if len(payload) < 28:
            continue
        if not (payload[0] == 0x21 and payload[1] == 0x09):
            continue
        data = payload[8:28]   # 20-byte data
        if len(data) != 20:
            continue
        if data[0] != 0x11 or data[1] != 0xff or data[2] != 0x0a:
            continue  # not Aura RGB
        n_total += 1
        chunk_type = data[3]
        current_frame.append(data)
        if chunk_type == 0x7b:
            # Frame terminator
            frames.append(current_frame)
            current_frame = []
    if current_frame:
        frames.append(current_frame)

    print(f"Total Aura packets: {n_total}")
    print(f"Total frames (terminated by 0x7b): {len(frames)}")

    chunks_per_frame: Counter = Counter(len(f) for f in frames)
    print(f"\nChunks-per-frame distribution:")
    for n_chunks, count in sorted(chunks_per_frame.items()):
        print(f"  {n_chunks:3d} chunks  x {count}")

    # Dump first 10 frames in full
    print(f"\nFirst 10 frames (hex dump):\n")
    for fi, frame in enumerate(frames[:10]):
        print(f"--- frame {fi}  ({len(frame)} chunks) ---")
        for ci, chunk in enumerate(frame):
            hexstr = " ".join(f"{b:02x}" for b in chunk)
            ascii_str = "".join(chr(b) if 32 <= b < 127 else "." for b in chunk)
            print(f"  chunk {ci} ({hex(chunk[3])}): {hexstr}  |{ascii_str}|")
        print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
