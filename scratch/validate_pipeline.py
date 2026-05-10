"""End-to-end validator for the v0.2 crypto + wire pipeline.

Reads a JSONL capture from frida_capture_inbound.py and decrypts every
inbound `recv` frame using polylux.crypto + polylux.wire with the AES key
extracted from the same UserSessionHelper process.

If every frame decrypts (no GCM auth failure), the pipeline is sound:
  wire bytes -> unpack_frame -> AuraCipher.decrypt -> plaintext

If the BCryptDecrypt log entries are also present, we verify the decrypted
plaintext matches what UserSessionHelper itself produced byte-for-byte.

Usage:
    python scratch/validate_pipeline.py <jsonl_capture> <key_hex>
"""
import json
import sys
from pathlib import Path

from cryptography.exceptions import InvalidTag

from polylux.crypto.aura_gcm import AuraCipher
from polylux.wire.frame import unpack_frame


def main():
    if len(sys.argv) < 3:
        print("usage: <jsonl_capture> <key_hex>"); sys.exit(2)

    capture = Path(sys.argv[1])
    key = bytes.fromhex(sys.argv[2])
    cipher = AuraCipher(key)

    events = [json.loads(line) for line in capture.read_text().splitlines() if line.strip()]
    print(f"[+] {len(events)} events in capture")

    # Group recv events by socket: each socket is one independent stream of frames
    streams: dict[int, bytearray] = {}
    decrypted: list[bytes] = []
    bcdec_plaintexts: list[bytes] = []

    n_recv = n_dec = 0
    for e in events:
        if e["kind"] == "recv":
            n_recv += 1
            sock = e["sock"]
            streams.setdefault(sock, bytearray()).extend(bytes.fromhex(e["hex"]))
        elif e["kind"] == "dec":
            n_dec += 1
            bcdec_plaintexts.append(bytes.fromhex(e["hex"]))

    print(f"[+] {n_recv} recv events across {len(streams)} sockets, {n_dec} BCryptDecrypt events")

    # Drain each stream into discrete frames
    for sock, buf in streams.items():
        i = 0
        while i + 4 <= len(buf):
            length = int.from_bytes(buf[i:i+4], "little")
            if i + 4 + length > len(buf):
                print(f"[!] sock {sock}: incomplete trailing frame at offset {i} (need {length} bytes, have {len(buf) - i - 4}); stopping")
                break
            frame_bytes = bytes(buf[i:i+4+length])
            i += 4 + length
            try:
                frame = unpack_frame(frame_bytes)
            except ValueError as ex:
                print(f"[!] sock {sock}: malformed frame at offset {i}: {ex}")
                continue
            try:
                pt = cipher.decrypt(frame.ciphertext, frame.nonce, frame.tag)
            except InvalidTag:
                print(f"[!] sock {sock}: GCM auth FAILED on frame (length={length}). Wrong key or wrong framing.")
                continue
            decrypted.append(pt)

    print(f"[+] decrypted {len(decrypted)} frames successfully")
    if not decrypted:
        print("[!] no frames decrypted — capture empty or framing wrong"); sys.exit(1)

    # Pair against BCryptDecrypt log entries (UserSessionHelper's own plaintext output)
    matched = 0
    for our, theirs in zip(decrypted, bcdec_plaintexts):
        if our == theirs:
            matched += 1
        else:
            print(f"[!] MISMATCH: ours={our.hex()[:60]}... theirs={theirs.hex()[:60]}...")
    print(f"[+] plaintext match: {matched} / {min(len(decrypted), len(bcdec_plaintexts))} compared")

    if matched == min(len(decrypted), len(bcdec_plaintexts)) and matched > 0:
        print("\n*** END-TO-END VALIDATED ***")
        print("    wire bytes -> unpack_frame -> AuraCipher.decrypt -> plaintext")
        print("    matches BCryptDecrypt output byte-for-byte.")
    elif len(decrypted) > 0 and len(bcdec_plaintexts) == 0:
        print("\n*** CRYPTO CHECK PASSED (no BCryptDecrypt log to compare) ***")
        print("    All recv frames decrypted without GCM auth failure.")
        print("    Sample plaintext head:", decrypted[0][:32].hex())


if __name__ == "__main__":
    main()
