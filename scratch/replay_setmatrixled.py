"""Smoke test for v0.2: replay a captured SetMatrixLED Apply against a fresh
TCP connection to UserSessionHelper.exe on 127.0.0.1:51100.

Flow:
  1. Auto-find UserSessionHelper PID, attach Frida, extract the AES-256 key.
  2. Load 7 plaintext chunks from scratch/captures/v0.2/setmatrixled_chunks.json
     (one logical SetMatrixLED message captured 2026-05-09 from a prior session).
  3. Connect to 127.0.0.1:51100.
  4. For each chunk:
       - Pick a fresh 12-byte random nonce.
       - Encrypt with AuraCipher (current key).
       - Frame with pack_frame: [u32 length][nonce][ciphertext][tag].
       - Send the framed bytes.
  5. Read whatever Helper sends back for ~3 seconds, log it.
  6. Close.

Expected outcomes:
  - Helper accepts the connection, decrypts our frames, applies the
    SetMatrixLED → matrix changes to whatever the captured Apply set
    (Vlad will see the change visually).
  - Helper closes the connection without errors.

If the connection is refused or Helper closes after first frame: the listen
port likely requires UWP-style auth that we haven't replicated. Falls back
to socket-hijack via Frida (next iteration).

Run:
    python scratch/replay_setmatrixled.py
"""
from __future__ import annotations

import json
import os
import socket
import struct
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from polylux.crypto import AuraCipher, extract_key, find_helper_pid
from polylux.wire.frame import Frame, pack_frame


CHUNKS_PATH = Path("scratch/captures/v0.2/setmatrixled_chunks.json")
HOST = "127.0.0.1"
PORT = 51100
RESPONSE_READ_TIMEOUT = 3.0


def main():
    pid = find_helper_pid()
    if pid is None:
        print("[!] UserSessionHelper.exe not running"); sys.exit(1)
    print(f"[+] helper PID: {pid}")

    print("[+] extracting AES key (Frida one-shot)...")
    key = extract_key(pid)
    print(f"[+] key: {key.hex()}")
    cipher = AuraCipher(key)

    payload = json.loads(CHUNKS_PATH.read_text())
    chunks = [bytes.fromhex(c["hex"]) for c in payload["chunks"]]
    sizes  = [len(c) for c in chunks]
    print(f"[+] loaded {len(chunks)} plaintext chunks, sizes={sizes}, total_len={payload['total_len']}")

    # Override seq counter — captured was 706 (mid-session); a fresh connection
    # likely needs to start at 1. Keep total_len + flag from capture.
    seq = int(os.environ.get("REPLAY_SEQ", "1"))
    flag = int(os.environ.get("REPLAY_FLAG", "1"))
    total_len = payload["total_len"]
    new_header = struct.pack("<IIII", 0, seq, total_len, flag)
    chunks[0] = new_header
    print(f"[+] rewritten header: seq={seq} total_len={total_len} flag={flag}")
    print(f"    new header hex: {new_header.hex()}")
    print()
    print(f"[+] connecting to {HOST}:{PORT}...")
    sock = socket.create_connection((HOST, PORT), timeout=5.0)
    print(f"[+] connected from {sock.getsockname()} -> {sock.getpeername()}")

    bytes_sent = 0
    for i, plain in enumerate(chunks):
        nonce = os.urandom(12)
        ct, tag = cipher.encrypt(plain, nonce)
        wire = pack_frame(Frame(nonce=nonce, ciphertext=ct, tag=tag))
        sock.sendall(wire)
        bytes_sent += len(wire)
        print(f"  chunk {i+1}/{len(chunks)}: plain={len(plain):5d}B  wire={len(wire):5d}B  nonce={nonce.hex()[:12]}...")
        # Tiny pause between chunks to avoid coalescing into one TCP segment in
        # weird ways. Helper expects them as separate frames anyway.
        time.sleep(0.01)

    print(f"[+] sent {bytes_sent} bytes total. Reading any response...")
    sock.settimeout(RESPONSE_READ_TIMEOUT)
    response = b""
    try:
        while True:
            chunk = sock.recv(65536)
            if not chunk:
                print("[+] server closed cleanly"); break
            response += chunk
            print(f"  recv {len(chunk)}B: {chunk[:64].hex()}{'...' if len(chunk) > 64 else ''}")
    except socket.timeout:
        print(f"[+] no response in {RESPONSE_READ_TIMEOUT}s (server may still be processing)")
    except ConnectionResetError as ex:
        print(f"[!] server reset connection: {ex}")

    sock.close()
    print()
    if response:
        print(f"[+] total response: {len(response)} bytes")
        # Try to decrypt response as wire frames
        offset = 0
        idx = 0
        while offset + 4 <= len(response):
            length = struct.unpack_from("<I", response, offset)[0]
            if offset + 4 + length > len(response):
                print(f"  [!] truncated response frame at offset {offset}")
                break
            frame_bytes = response[offset:offset+4+length]
            offset += 4 + length
            try:
                from polylux.wire.frame import unpack_frame
                frame = unpack_frame(frame_bytes)
                pt = cipher.decrypt(frame.ciphertext, frame.nonce, frame.tag)
                idx += 1
                print(f"  reply chunk #{idx}: plain={len(pt)}B  head={pt[:48].hex()}")
            except Exception as ex:
                print(f"  [!] cannot decrypt response frame: {ex}")
        if idx > 0:
            print()
            print("*** END-TO-END WORKING ***")
            print("    Helper accepted our frames, replied with encrypted data we decrypted.")
            print("    Ask Vlad if matrix changed visually.")
    else:
        print("[!] empty response. Possibilities:")
        print("    - Helper accepted silently (matrix may have changed; ask Vlad)")
        print("    - Helper rejected our auth/seq and closed without reply")
        print("    - Helper still processing (try longer timeout)")


if __name__ == "__main__":
    main()
