"""ASUS Aura plugin custom binary serialization protocol.

Reverse-engineered from BCryptDecrypt plaintext captured via Frida hooks
on ArmouryCrate.UserSessionHelper.exe (2026-05-09). See
``docs/PROJECT_STATE.md`` §8 for the discovery story.

Wire format
-----------

A "field" is the unit of serialization::

    name_len: u8
    name:     ascii[name_len]
    type_tag: u8
    payload_len: u32 little-endian
    payload:  bytes[payload_len]

A "message" is a sequence of fields concatenated. There is no explicit
end-of-message marker in the field stream itself — the outer framing
(at the BCrypt-encrypted wire layer) carries the length.

Type tags observed
------------------

::

    0x02  uint32 little-endian (4 bytes)
    0x04  raw byte array (variable, e.g. GUIDs and binary blobs)
    0x05  uint32 little-endian (4 bytes) — observed for enum/flag fields
    0x10  UTF-16 LE string (raw, may include trailing null-terminator)
    0x20  nested struct (recursively a sequence of fields)

The 0x02 vs 0x05 distinction is purely contextual — both serialize as a
4-byte uint32. We honor whichever the original message used so round-trips
are byte-identical.

Examples
--------

Encode a simple message::

    >>> from polylux.format import aura_proto as ap
    >>> msg = [
    ...     ap.U32("Area", 2),
    ...     ap.WStr("Cmd", "SetMatrixLED"),
    ...     ap.U32("ClockChecked", 1),
    ... ]
    >>> blob = ap.serialize(msg)
    >>> roundtrip = ap.deserialize(blob)
    >>> roundtrip == msg
    True
"""
from __future__ import annotations

import struct
from dataclasses import dataclass, field
from typing import Any, List, Sequence, Union

# ---- type tags ----
TAG_U32 = 0x02
TAG_BYTES = 0x04
TAG_U32_ENUM = 0x05
TAG_WSTR = 0x10
TAG_STRUCT = 0x20

VALID_TAGS = {TAG_U32, TAG_BYTES, TAG_U32_ENUM, TAG_WSTR, TAG_STRUCT}


# ---- field dataclasses ----


@dataclass
class Field:
    """Base field: name + type_tag + raw payload."""

    name: str
    tag: int
    payload: bytes  # serialized form of the value

    def value(self) -> Any:
        return _decode_payload(self.tag, self.payload)


def U32(name: str, value: int) -> Field:
    return Field(name=name, tag=TAG_U32, payload=struct.pack("<I", value & 0xFFFFFFFF))


def U32Enum(name: str, value: int) -> Field:
    return Field(name=name, tag=TAG_U32_ENUM, payload=struct.pack("<I", value & 0xFFFFFFFF))


def Bytes(name: str, raw: bytes) -> Field:
    return Field(name=name, tag=TAG_BYTES, payload=bytes(raw))


def WStr(name: str, text: str, *, null_terminated: bool = False) -> Field:
    """UTF-16 LE encoded string. Some captured fields include a trailing
    null character (e.g. ``"0\x00"``); set ``null_terminated=True`` to
    match that behaviour."""
    payload = text.encode("utf-16-le")
    if null_terminated:
        payload += b"\x00\x00"
    return Field(name=name, tag=TAG_WSTR, payload=payload)


def Struct(name: str, fields: Sequence[Field]) -> Field:
    return Field(name=name, tag=TAG_STRUCT, payload=serialize(fields))


# ---- decode / encode primitives ----


def _decode_payload(tag: int, raw: bytes) -> Any:
    if tag in (TAG_U32, TAG_U32_ENUM):
        if len(raw) != 4:
            raise ValueError(f"u32-tagged field has {len(raw)} bytes payload, expected 4")
        return struct.unpack("<I", raw)[0]
    if tag == TAG_WSTR:
        try:
            return raw.decode("utf-16-le").rstrip("\x00")
        except UnicodeDecodeError:
            return raw  # opaque
    if tag == TAG_BYTES:
        return raw
    if tag == TAG_STRUCT:
        return deserialize(raw)
    raise ValueError(f"unknown type tag 0x{tag:02x}")


# ---- ser / deser ----


def _encode_field(f: Field) -> bytes:
    name_b = f.name.encode("ascii")
    if len(name_b) > 0xFF:
        raise ValueError(f"field name '{f.name}' too long for u8 length prefix")
    if f.tag not in VALID_TAGS:
        raise ValueError(f"invalid type tag 0x{f.tag:02x}")
    if len(f.payload) > 0xFFFFFFFF:
        raise ValueError("payload exceeds u32 length")
    return (
        bytes([len(name_b)])
        + name_b
        + bytes([f.tag])
        + struct.pack("<I", len(f.payload))
        + f.payload
    )


def serialize(fields: Sequence[Field]) -> bytes:
    return b"".join(_encode_field(f) for f in fields)


def deserialize(buf: bytes, *, strict: bool = True) -> List[Field]:
    """Parse a sequence of fields. With ``strict=True`` (default), raises
    on truncation or unknown tags; with ``strict=False`` returns whatever
    parsed cleanly."""
    out: List[Field] = []
    off = 0
    n = len(buf)
    while off < n:
        if off + 1 > n:
            if strict:
                raise ValueError(f"truncated at {off}: missing name length byte")
            break
        name_len = buf[off]
        off += 1
        if off + name_len + 5 > n:
            if strict:
                raise ValueError(f"truncated at {off}: cannot read name + header")
            break
        name = buf[off:off + name_len].decode("ascii", errors="replace")
        off += name_len
        tag = buf[off]
        off += 1
        payload_len = struct.unpack("<I", buf[off:off + 4])[0]
        off += 4
        if off + payload_len > n:
            if strict:
                raise ValueError(
                    f"truncated at {off}: payload_len={payload_len} but only "
                    f"{n - off} bytes left"
                )
            break
        if tag not in VALID_TAGS and strict:
            raise ValueError(f"field {name!r} has unknown tag 0x{tag:02x}")
        payload = bytes(buf[off:off + payload_len])
        off += payload_len
        out.append(Field(name=name, tag=tag, payload=payload))
    return out


# ---- pretty-print helpers ----


def to_dict(fields: Sequence[Field]) -> dict:
    """Convert a parsed field list into a dict for inspection. Keeps types
    as decoded values; nested structs become nested dicts."""
    out = {}
    for f in fields:
        v = f.value()
        if f.tag == TAG_STRUCT:
            v = to_dict(v)
        elif f.tag == TAG_BYTES:
            v = v.hex()
        out[f.name] = v
    return out
