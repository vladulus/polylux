"""Wire-frame pack/unpack tests.

Includes a real-capture round-trip vector from
scratch/captures/inbound_apply_20260509_180003.jsonl (44-byte body, the smallest
frame size = 16-byte plaintext header chunk).
"""
import io

import pytest

from polylux.wire.frame import (
    Frame,
    HEADER_LEN,
    NONCE_LEN,
    OVERHEAD,
    TAG_LEN,
    pack_frame,
    read_frame,
    unpack_frame,
)


# Captured wire bytes from inbound_apply_20260509_180003.jsonl (line 2):
#   length=0x2c=44 = 12 (nonce) + 16 (ct) + 16 (tag)
WIRE_HEADER = bytes.fromhex("2c000000")
WIRE_BODY   = bytes.fromhex("dacac50b889e29db119186e9688b83a18bf1454cb8ee00cc57fd1463e6455c76a6c5ae55b7c4e2ae79a43030")
WIRE_FRAME  = WIRE_HEADER + WIRE_BODY

EXPECT_NONCE = bytes.fromhex("dacac50b889e29db119186e9")
EXPECT_CT    = bytes.fromhex("688b83a18bf1454cb8ee00cc57fd1463")
EXPECT_TAG   = bytes.fromhex("e6455c76a6c5ae55b7c4e2ae79a43030")


def test_unpack_real_capture():
    f = unpack_frame(WIRE_FRAME)
    assert f.nonce == EXPECT_NONCE
    assert f.ciphertext == EXPECT_CT
    assert f.tag == EXPECT_TAG


def test_pack_unpack_round_trip():
    original = Frame(
        nonce=b"\x01" * NONCE_LEN,
        ciphertext=b"hello, polylux on the wire",
        tag=b"\x02" * TAG_LEN,
    )
    wire = pack_frame(original)
    parsed = unpack_frame(wire)
    assert parsed == original


def test_read_frame_from_stream():
    stream = io.BytesIO(WIRE_FRAME + b"trailing garbage")
    f = read_frame(stream)
    assert f.nonce == EXPECT_NONCE
    assert f.ciphertext == EXPECT_CT
    assert f.tag == EXPECT_TAG
    assert stream.read() == b"trailing garbage"


def test_read_two_frames_back_to_back():
    f1 = Frame(nonce=b"\xa0" * NONCE_LEN, ciphertext=b"first",  tag=b"\xa1" * TAG_LEN)
    f2 = Frame(nonce=b"\xb0" * NONCE_LEN, ciphertext=b"second", tag=b"\xb1" * TAG_LEN)
    stream = io.BytesIO(pack_frame(f1) + pack_frame(f2))
    assert read_frame(stream) == f1
    assert read_frame(stream) == f2


def test_short_frame_rejected():
    with pytest.raises(ValueError, match="too short"):
        unpack_frame(b"\x00\x00\x00\x00")  # length=0 — no nonce/tag space


def test_length_mismatch_rejected():
    bad = bytes.fromhex("ff000000") + WIRE_BODY  # claims 255 bytes, only 44 present
    with pytest.raises(ValueError, match="length mismatch"):
        unpack_frame(bad)


def test_eof_mid_frame_raises():
    stream = io.BytesIO(WIRE_HEADER + WIRE_BODY[:10])  # cut short
    with pytest.raises(EOFError):
        read_frame(stream)


def test_constants():
    assert HEADER_LEN == 4
    assert NONCE_LEN == 12
    assert TAG_LEN == 16
    assert OVERHEAD == NONCE_LEN + TAG_LEN == 28
