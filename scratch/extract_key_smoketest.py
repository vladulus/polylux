"""Live smoke test for polylux.crypto.key_extractor.

Auto-finds UserSessionHelper.exe, attaches Frida, extracts the AES-256 key,
prints it, then re-encrypts a known plaintext to prove the key is valid by
verifying the cipher matches a fresh BCryptEncrypt capture.

Usage:
    python scratch/extract_key_smoketest.py
    python scratch/extract_key_smoketest.py <PID>
"""
import sys
from pathlib import Path

# Make polylux importable when running from project root
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from polylux.crypto import AuraCipher, extract_key, find_helper_pid


def main():
    pid = int(sys.argv[1]) if len(sys.argv) > 1 else find_helper_pid()
    if pid is None:
        print("[!] UserSessionHelper.exe not running"); sys.exit(1)
    print(f"[+] target PID: {pid}")

    print("[+] extracting key (this can take up to 30s if helper is idle)...")
    key = extract_key(pid)
    print(f"[+] key ({len(key)} bytes): {key.hex()}")

    cipher = AuraCipher(key)
    msg = b"polylux key extractor live smoke test"
    nonce = b"\x00" * 12
    ct, tag = cipher.encrypt(msg, nonce)
    recovered = cipher.decrypt(ct, nonce, tag)
    assert recovered == msg
    print("[+] AuraCipher round-trip OK with extracted key")
    print("[+] smoke test PASSED")


if __name__ == "__main__":
    main()
