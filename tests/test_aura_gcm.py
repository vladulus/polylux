"""Round-trip tests for polylux.crypto.aura_gcm using a live-captured vector
from UserSessionHelper.exe (see scratch/captures/v0.2/gcm_pairs.jsonl).

If this test passes, Polylux can encrypt and decrypt UserSessionHelper traffic
in pure Python without Frida runtime overhead.
"""
import pytest

from polylux.crypto.aura_gcm import AuraCipher


# Captured 2026-05-10 from PID 14624 (UserSessionHelper.exe) via Frida hook on
# BCryptEncrypt. Key extracted via BCryptExportKey on the same handle.
KEY        = bytes.fromhex("9e47a7af38a4ae9608b84b4269987bb1ac6c3d3c7c297bae1c5522063e5070e4")
NONCE      = bytes.fromhex("4802fce7db9fb3fa94fcb101")
PLAINTEXT  = bytes.fromhex("01000000a90100001000000004000000")
CIPHERTEXT = bytes.fromhex("43e962bab958baac449a278172befd3f")
TAG        = bytes.fromhex("8770c81cf9b07841ecbdfd8ab53a0d83")


def test_encrypt_matches_live_capture():
    cipher = AuraCipher(KEY)
    ct, tag = cipher.encrypt(PLAINTEXT, NONCE)
    assert ct == CIPHERTEXT
    assert tag == TAG


def test_decrypt_matches_live_capture():
    cipher = AuraCipher(KEY)
    plain = cipher.decrypt(CIPHERTEXT, NONCE, TAG)
    assert plain == PLAINTEXT


def test_round_trip():
    cipher = AuraCipher(KEY)
    msg = b"polylux says hello, ASUS"
    nonce = b"\x00" * 12
    ct, tag = cipher.encrypt(msg, nonce)
    assert cipher.decrypt(ct, nonce, tag) == msg


def test_invalid_key_length():
    with pytest.raises(ValueError, match="32 bytes"):
        AuraCipher(b"\x00" * 16)


def test_invalid_nonce_length():
    cipher = AuraCipher(KEY)
    with pytest.raises(ValueError, match="12 bytes"):
        cipher.encrypt(b"hello", b"\x00" * 8)
