"""Unit tests for polylux.crypto.key_extractor parsing logic.

Frida + the live process aren't exercised here — that's an integration test
done manually via the CLI script (see scratch/extract_key_smoketest.py).
"""
import pytest

from polylux.crypto.key_extractor import (
    KEY_LEN,
    KDBM_MAGIC,
    KeyExtractionError,
    _parse_keydata_blob,
)


def _make_blob(magic: bytes, version: int, keysize: int, key: bytes) -> bytes:
    return (
        magic
        + version.to_bytes(4, "little")
        + keysize.to_bytes(4, "little")
        + key
    )


def test_parses_valid_keydata_blob():
    key = bytes(range(32))
    blob = _make_blob(KDBM_MAGIC, version=1, keysize=KEY_LEN, key=key)
    assert _parse_keydata_blob(blob) == key


def test_rejects_short_blob():
    with pytest.raises(KeyExtractionError, match="too short"):
        _parse_keydata_blob(b"abc")


def test_rejects_wrong_magic():
    blob = _make_blob(b"XXXX", version=1, keysize=KEY_LEN, key=bytes(KEY_LEN))
    with pytest.raises(KeyExtractionError, match="unexpected magic"):
        _parse_keydata_blob(blob)


def test_rejects_wrong_version():
    blob = _make_blob(KDBM_MAGIC, version=2, keysize=KEY_LEN, key=bytes(KEY_LEN))
    with pytest.raises(KeyExtractionError, match="unsupported.*version"):
        _parse_keydata_blob(blob)


def test_rejects_wrong_keysize():
    blob = _make_blob(KDBM_MAGIC, version=1, keysize=16, key=bytes(16))
    with pytest.raises(KeyExtractionError, match="unexpected key size 16"):
        _parse_keydata_blob(blob)


def test_rejects_truncated_blob():
    blob = _make_blob(KDBM_MAGIC, version=1, keysize=KEY_LEN, key=bytes(10))
    with pytest.raises(KeyExtractionError, match="truncated"):
        _parse_keydata_blob(blob)


def test_parses_real_capture():
    """Real KeyDataBlob captured 2026-05-10 from PID 14624."""
    real = bytes.fromhex(
        "4b44424d"               # magic 'KDBM'
        "01000000"               # version 1
        "20000000"               # keysize 32
        "9e47a7af38a4ae9608b84b4269987bb1ac6c3d3c7c297bae1c5522063e5070e4"
    )
    expected = bytes.fromhex(
        "9e47a7af38a4ae9608b84b4269987bb1ac6c3d3c7c297bae1c5522063e5070e4"
    )
    assert _parse_keydata_blob(real) == expected
