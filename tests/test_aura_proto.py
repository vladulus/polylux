"""Round-trip tests for polylux.format.aura_proto against captured
plaintext from real Armoury Crate traffic.
"""
from __future__ import annotations

import struct
from pathlib import Path

import pytest

from polylux.format import aura_proto as ap


def test_u32_roundtrip():
    msg = [ap.U32("ClockChecked", 1), ap.U32("AlarmChecked", 0)]
    blob = ap.serialize(msg)
    parsed = ap.deserialize(blob)
    assert ap.to_dict(parsed) == {"ClockChecked": 1, "AlarmChecked": 0}


def test_wstr_roundtrip():
    msg = [ap.WStr("Cmd", "SetMatrixLED")]
    blob = ap.serialize(msg)
    parsed = ap.deserialize(blob)
    assert parsed[0].value() == "SetMatrixLED"


def test_wstr_null_terminator_preserved():
    msg = [ap.WStr("Delay[0]", "0", null_terminated=True)]
    blob = ap.serialize(msg)
    # Wire format: 08 "Delay[0]" 10 02000000 00 00  +  null wide char
    # Actually: name_len(1) + name(8) + tag(1) + len(4) + 4 bytes payload
    # ("0\x00\x00\x00")
    assert blob[10:14] == b"\x04\x00\x00\x00"  # len = 4 (one wide char + null)


def test_bytes_field_for_guid():
    guid = bytes.fromhex("8e87d26a596f344fbee43f5a994a006d")
    msg = [ap.Bytes("Number", guid)]
    blob = ap.serialize(msg)
    parsed = ap.deserialize(blob)
    assert parsed[0].value() == guid


def test_struct_nested():
    inner = [ap.U32("Major", 6), ap.U32("Minor", 4)]
    msg = [ap.WStr("Cmd", "GetVersion"), ap.Struct("Version", inner)]
    blob = ap.serialize(msg)
    parsed = ap.deserialize(blob)
    assert parsed[0].value() == "GetVersion"
    assert parsed[1].tag == ap.TAG_STRUCT
    inner_parsed = parsed[1].value()
    assert ap.to_dict(inner_parsed) == {"Major": 6, "Minor": 4}


def test_strict_truncation_raises():
    blob = ap.serialize([ap.U32("X", 1)])
    with pytest.raises(ValueError):
        ap.deserialize(blob[:-1])


def test_lenient_truncation_returns_partial():
    msg = [ap.U32("X", 1), ap.U32("Y", 2)]
    blob = ap.serialize(msg)
    truncated = blob[:len(blob) // 2]
    parsed = ap.deserialize(truncated, strict=False)
    assert len(parsed) <= 1


def test_realworld_setmatrixled_sample():
    """Decode the captured plaintext from a real Apply click and verify
    we get the expected fields."""
    sample = Path(__file__).parent.parent / "scratch" / "captures" / "setmatrixled_plaintext.bin"
    if not sample.exists():
        pytest.skip("no real-world sample available; run a Frida BCrypt capture first")

    raw = sample.read_bytes()
    parsed = ap.deserialize(raw, strict=False)
    d = ap.to_dict(parsed)
    # Spot-check a few fields we know should be there
    assert d.get("Cmd") == "SetMatrixLED", f"got Cmd={d.get('Cmd')!r}"
    assert d.get("ClockChecked") == 1
    assert d.get("AlarmChecked") == 0
    assert "LayerCount" in d


def test_realworld_setmatrixled_byte_identical():
    """Re-encoding a parsed message must produce the same bytes (or fewer
    if the sample is truncated mid-field, which we tolerate)."""
    sample = Path(__file__).parent.parent / "scratch" / "captures" / "setmatrixled_plaintext.bin"
    if not sample.exists():
        pytest.skip("no real-world sample available")
    raw = sample.read_bytes()
    parsed = ap.deserialize(raw, strict=False)
    re_encoded = ap.serialize(parsed)
    # Match the prefix that fully parsed
    consumed = len(re_encoded)
    assert raw[:consumed] == re_encoded, (
        "round-trip is not byte-identical; check field encoding"
    )
