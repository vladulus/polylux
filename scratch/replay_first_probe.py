"""Replay the FIRST logical message UWP sends to Helper on a fresh
connection — `Cmd: GetUserPreferLanguageInUsersession`.

Captured 2026-05-10 from the birth_*.jsonl capture (sock=1716, seq=2..28).
This is the SIMPLEST inbound message: a probe-style query that any AuraPlugin-
aware Helper should accept on a fresh socket.

If Helper accepts this message and replies, the SetMatrixLED RST observed
earlier is a state-machine / message-type issue (probably "first inbound
must be a probe, not an Apply"). If Helper RSTs THIS too, the problem is
deeper — peer-check / OOB-auth that we still haven't found.
"""
from __future__ import annotations
import os, socket, struct, sys, time, struct
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from polylux.crypto import AuraCipher, extract_key, find_helper_pid
from polylux.wire.frame import Frame, pack_frame, unpack_frame

# Captured plaintexts (verbatim from birth_20260510_105944.jsonl, seq 2..28)
CHUNKS_HEX = [
    # seq=2 16B header  (zero | seq=2 | total_len=316 | flag=1)
    "00000000020000003c01000001000000",
    # length=0xb7=183
    "b7000000",
    # 183B envelope (Area, Feature, Name=AuraPlugin, Number, Security, Version)
    "04417265610504000000020000000746656174757265050400000001000000044e616d651014000000410075007200610050006c007500670069006e00064e756d62657204100000008e87d26a596f344fbee43f5a994a006d0853656375726974790504000000800000000756657273696f6e203f000000054275696c6402040000000b000000054d616a6f72020400000006000000054d696e6f72020400000004000000085265766973696f6e020400000000000000",
    # length=0x1c=28
    "1c000000",
    # 28B Number block
    "064e756d62657204100000008e87d26a596f344fbee43f5a994a006d",
    # length=0x4d=77
    "4d000000",
    # 77B Cmd: GetUserPreferLanguageInUsersession
    "03436d64104400000047006500740055007300650072005000720065006600650072004c0061006e006700750061006700650049006e005500730065007200730065007300730069006f006e00",
]


def main():
    pid = find_helper_pid()
    if pid is None:
        print("[!] UserSessionHelper.exe not running"); sys.exit(1)
    print(f"[+] helper PID: {pid}")
    print("[+] extracting AES key (re-extract — new helper PID after restart)...")
    key = extract_key(pid)
    print(f"[+] key: {key.hex()}")
    cipher = AuraCipher(key)

    chunks = [bytes.fromhex(h) for h in CHUNKS_HEX]
    sizes  = [len(c) for c in chunks]
    print(f"[+] sending {len(chunks)} chunks, sizes={sizes}")

    print(f"[+] connecting to 127.0.0.1:51100...")
    sock = socket.create_connection(("127.0.0.1", 51100), timeout=5.0)
    print(f"[+] connected: {sock.getsockname()} -> {sock.getpeername()}")

    for i, plain in enumerate(chunks):
        nonce = os.urandom(12)
        ct, tag = cipher.encrypt(plain, nonce)
        wire = pack_frame(Frame(nonce, ct, tag))
        try:
            sock.sendall(wire)
            print(f"  chunk {i+1}/{len(chunks)} sent ({len(plain)}B plain -> {len(wire)}B wire)")
        except (ConnectionResetError, BrokenPipeError) as ex:
            print(f"  [!] chunk {i+1} failed: {ex}")
            sock.close(); return
        time.sleep(0.005)

    print("[+] all chunks sent. Reading response (5s timeout)...")
    sock.settimeout(5.0)
    response = b""
    try:
        while True:
            data = sock.recv(65536)
            if not data:
                print("[+] server closed cleanly"); break
            response += data
            print(f"  recv {len(data)}B: {data[:60].hex()}{'...' if len(data) > 60 else ''}")
    except socket.timeout:
        print("[+] no response in 5s")
    except ConnectionResetError as ex:
        print(f"[!] reset: {ex}")
    sock.close()

    # Try to decrypt response frames
    if response:
        print(f"\n[+] response total: {len(response)}B")
        i = 0
        idx = 0
        while i + 4 <= len(response):
            ln = struct.unpack_from("<I", response, i)[0]
            if i + 4 + ln > len(response):
                print(f"  [!] truncated frame at offset {i}"); break
            frame_bytes = response[i:i+4+ln]
            i += 4 + ln
            try:
                f = unpack_frame(frame_bytes)
                pt = cipher.decrypt(f.ciphertext, f.nonce, f.tag)
                idx += 1
                print(f"  reply chunk #{idx} ({len(pt)}B): {pt[:48].hex()}{'...' if len(pt)>48 else ''}")
                # ASCII view
                asc = ''.join(chr(b) if 32 <= b < 127 else '.' for b in pt[:80])
                print(f"      ascii: {asc}")
            except Exception as ex:
                print(f"  [!] decrypt frame {idx+1} failed: {ex}")
        if idx > 0:
            print(f"\n*** PROBE REPLAY ACCEPTED *** Helper decoded our message and replied.")
            print(f"    State-machine theory: SetMatrixLED RST was because we skipped probes.")


if __name__ == "__main__":
    main()
