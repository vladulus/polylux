"""Capture loopback TCP traffic on ports 9013, 1042, 9012 and decode WebSocket
frames flying between asus_framework <-> ArmourySocketServer.

Saves raw .pcapng-like dump to scratch/captures/<timestamp>.dump for offline
analysis. Also live-decodes WebSocket text/binary frames as they flow and
prints them.

Run from a regular shell. If npcap denies access, re-run as Administrator.
"""
from __future__ import annotations

import datetime
import struct
import sys
from collections import defaultdict
from pathlib import Path

from scapy.all import sniff, TCP, IP, Raw

PORTS = (9013, 1042, 9012, 9014)
IFACE = r"\Device\NPF_Loopback"

CAPTURE_DIR = Path(__file__).parent / "captures"
CAPTURE_DIR.mkdir(exist_ok=True)
SESSION = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
RAW_DUMP = CAPTURE_DIR / f"loopback_{SESSION}.bin"
TXT_DUMP = CAPTURE_DIR / f"loopback_{SESSION}.txt"

raw_f = RAW_DUMP.open("ab")
txt_f = TXT_DUMP.open("a", encoding="utf-8", errors="replace", newline="\n")
# Force UTF-8 stdout — default cp1252 chokes on emoji/CJK strings ASUS sends
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)


def now() -> str:
    return datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]


# Per-connection accumulators (TCP stream reassembly)
streams: dict[tuple[str, str], bytearray] = defaultdict(bytearray)


def parse_ws_frames(buf: bytearray) -> tuple[list[tuple[int, bytes]], int]:
    """Parse as many complete WebSocket frames as possible from `buf`.

    Returns (frames_list, bytes_consumed). frames_list = [(opcode, payload), ...].
    Handles unmasked (server-to-client) and masked (client-to-server) frames.
    """
    frames = []
    offset = 0
    while offset + 2 <= len(buf):
        b0 = buf[offset]
        b1 = buf[offset + 1]
        fin = b0 & 0x80
        opcode = b0 & 0x0F
        masked = b1 & 0x80
        plen = b1 & 0x7F
        h = offset + 2
        if plen == 126:
            if h + 2 > len(buf):
                break
            plen = struct.unpack_from(">H", buf, h)[0]
            h += 2
        elif plen == 127:
            if h + 8 > len(buf):
                break
            plen = struct.unpack_from(">Q", buf, h)[0]
            h += 8
        if masked:
            if h + 4 > len(buf):
                break
            mask = bytes(buf[h:h + 4])
            h += 4
        if h + plen > len(buf):
            break
        payload = bytes(buf[h:h + plen])
        if masked:
            payload = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
        frames.append((opcode, payload))
        offset = h + plen
    return frames, offset


def log(line: str) -> None:
    print(line, flush=True)
    txt_f.write(line + "\n")
    txt_f.flush()


def handle(pkt) -> None:
    if not (pkt.haslayer(TCP) and pkt.haslayer(Raw)):
        return
    sport = pkt[TCP].sport
    dport = pkt[TCP].dport
    if sport not in PORTS and dport not in PORTS:
        return
    payload = bytes(pkt[Raw])
    direction = f"{pkt[IP].src}:{sport} -> {pkt[IP].dst}:{dport}"
    raw_f.write(f"--- {now()} {direction} [{len(payload)}] ---\n".encode())
    raw_f.write(payload)
    raw_f.write(b"\n")
    raw_f.flush()

    # Reassemble per (src,dst) pair
    key = (f"{pkt[IP].src}:{sport}", f"{pkt[IP].dst}:{dport}")
    streams[key].extend(payload)
    frames, consumed = parse_ws_frames(streams[key])
    if consumed:
        del streams[key][:consumed]
    for opcode, body in frames:
        opname = {0x1: "TEXT", 0x2: "BIN", 0x8: "CLOSE", 0x9: "PING", 0xA: "PONG", 0x0: "CONT"}.get(opcode, f"OP{opcode}")
        # Heuristic: most "OP14/OP15/OPn" outputs were misparsed continuations;
        # only treat as a real frame on first 4 valid opcodes. Skip if invalid.
        if opcode > 0xA:
            continue  # likely misparse, drop silently
        port_filter = (sport == 9013 or dport == 9013 or sport == 9012 or dport == 9012)
        # On 1042 we'd normally drown in UI localization strings. Filter by port
        # — only print/log frames on the hardware-relevant ports. Raw .bin still
        # captures everything for offline forensics.
        if not port_filter:
            return
        if opcode == 0x1:
            try:
                text = body.decode("utf-8", errors="replace")
            except Exception:
                text = repr(body[:200])
            log(f"[{now()}] {direction} WS {opname} ({len(body)}): {text[:600]}")
        elif opcode == 0x2:
            log(f"[{now()}] {direction} WS BIN ({len(body)}): {body[:120].hex()}")
        else:
            log(f"[{now()}] {direction} WS {opname} ({len(body)})")


def main() -> int:
    log(f"=== capture session {SESSION} ===")
    log(f"interface: {IFACE}")
    log(f"ports: {PORTS}")
    log(f"raw -> {RAW_DUMP}")
    log(f"txt -> {TXT_DUMP}")
    log("Sniffing... Ctrl-C to stop.")
    bpf = " or ".join(f"tcp port {p}" for p in PORTS)
    try:
        sniff(iface=IFACE, filter=bpf, prn=handle, store=False)
    except KeyboardInterrupt:
        log("\nstopped")
    except Exception as e:
        log(f"\nERROR: {type(e).__name__}: {e}")
        return 1
    finally:
        raw_f.close()
        txt_f.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
