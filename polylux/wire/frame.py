"""On-wire frame format for ArmouryCrate.UserSessionHelper.exe (port 51100).

One frame on the wire is:

    +---------------------+----------------+----------------------+----------+
    | length: u32 LE      | nonce: 12B     | ciphertext: N bytes  | tag: 16B |
    +---------------------+----------------+----------------------+----------+

  length = 12 + N + 16 (i.e. the total size of the rest of the frame)
  N      = plaintext length (GCM is a stream cipher, no padding)

A logical message (e.g. one SetMatrixLED Apply) is split into multiple chunks
by the sender: typically a 16-byte header chunk, a 4-byte length chunk, then
the body chunk(s). Each chunk is wrapped in its own frame with its own nonce.

Verified 2026-05-10 against scratch/captures/inbound_apply_20260509_180003.jsonl:

    wire = "2c000000" + "<44 hex bytes>"
    length=0x2c=44 = 12 (nonce) + 16 (ct) + 16 (tag)  ✓
"""
from __future__ import annotations

import struct
from dataclasses import dataclass
from io import BytesIO
from typing import BinaryIO


HEADER_LEN = 4
NONCE_LEN = 12
TAG_LEN = 16
OVERHEAD = NONCE_LEN + TAG_LEN  # 28 bytes per frame on top of plaintext


@dataclass
class Frame:
    """One wire frame: an opaque GCM-encrypted chunk."""
    nonce: bytes
    ciphertext: bytes
    tag: bytes

    def __post_init__(self) -> None:
        if len(self.nonce) != NONCE_LEN:
            raise ValueError(f"nonce must be {NONCE_LEN} bytes")
        if len(self.tag) != TAG_LEN:
            raise ValueError(f"tag must be {TAG_LEN} bytes")


def pack_frame(frame: Frame) -> bytes:
    """Serialize a Frame to wire bytes."""
    body = frame.nonce + frame.ciphertext + frame.tag
    return struct.pack("<I", len(body)) + body


def unpack_frame(buf: bytes) -> Frame:
    """Parse one frame from a complete byte buffer.

    Raises ValueError if buf is too short or length prefix is inconsistent.
    """
    if len(buf) < HEADER_LEN + OVERHEAD:
        raise ValueError(f"frame too short: {len(buf)} bytes")
    (length,) = struct.unpack_from("<I", buf, 0)
    if HEADER_LEN + length != len(buf):
        raise ValueError(
            f"frame length mismatch: header says {length}, got {len(buf) - HEADER_LEN} body bytes"
        )
    if length < OVERHEAD:
        raise ValueError(f"frame body too short for nonce+tag: {length}")
    nonce = buf[HEADER_LEN : HEADER_LEN + NONCE_LEN]
    tag = buf[-TAG_LEN:]
    ciphertext = buf[HEADER_LEN + NONCE_LEN : -TAG_LEN]
    return Frame(nonce=nonce, ciphertext=ciphertext, tag=tag)


def read_frame(stream: BinaryIO) -> Frame:
    """Read exactly one frame from a blocking byte stream (e.g. a TCP socket).

    Raises EOFError if the stream closes mid-frame.
    """
    header = _read_exact(stream, HEADER_LEN)
    (length,) = struct.unpack("<I", header)
    if length < OVERHEAD:
        raise ValueError(f"frame body too short for nonce+tag: {length}")
    body = _read_exact(stream, length)
    nonce = body[:NONCE_LEN]
    tag = body[-TAG_LEN:]
    ciphertext = body[NONCE_LEN:-TAG_LEN]
    return Frame(nonce=nonce, ciphertext=ciphertext, tag=tag)


def _read_exact(stream: BinaryIO, n: int) -> bytes:
    buf = b""
    while len(buf) < n:
        chunk = stream.read(n - len(buf))
        if not chunk:
            raise EOFError(f"stream closed after {len(buf)}/{n} bytes")
        buf += chunk
    return buf
