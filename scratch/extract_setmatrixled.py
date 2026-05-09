"""Extract the full plaintext SetMatrixLED message from a Frida bcrypt
capture, hex-dump it, and try to fully decode the field structure.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

CAPTURE = Path(r"C:/Users/vlad/AppData/Local/Temp/claude/C--Users-vlad-Desktop-restu/f2fcafe3-fa93-4de9-b390-885902919c0c/tasks/bexp08400.output")


TYPE_TAGS = {
    0x02: "u32",
    0x04: "bytes",
    0x05: "u32_5",  # observed for some uint32 fields too
    0x10: "wstr",
    0x20: "struct",
}


def decode_field(buf: bytes, off: int) -> tuple[dict, int]:
    """Decode one field starting at off. Returns (field_dict, new_offset)."""
    name_len = buf[off]
    off += 1
    name = buf[off:off + name_len].decode("latin-1", errors="replace")
    off += name_len
    type_tag = buf[off]
    off += 1
    payload_len = int.from_bytes(buf[off:off + 4], "little")
    off += 4
    raw = buf[off:off + payload_len]
    off += payload_len

    if type_tag == 0x02 and payload_len == 4:
        value = int.from_bytes(raw, "little", signed=False)
    elif type_tag == 0x05 and payload_len == 4:
        value = int.from_bytes(raw, "little", signed=False)
    elif type_tag == 0x10:
        # UTF-16 LE wstring (some have trailing null terminator)
        try:
            value = raw.decode("utf-16-le").rstrip("\x00")
        except Exception:
            value = raw.hex()
    elif type_tag == 0x04:
        value = raw.hex()  # GUID etc.
    else:
        value = raw.hex()

    return {"name": name, "type_tag": type_tag, "type": TYPE_TAGS.get(type_tag, "?"), "len": payload_len, "value": value}, off


def find_setmatrixled_blobs(text: str) -> list[bytes]:
    target = bytes("SetMatrixLED", "utf-16-le").hex()
    out = []
    for direction, size, hexstr in re.findall(r"\[((?:enc|dec)) (\d+)b BIN\]: ([0-9a-f]+)", text):
        if target in hexstr:
            out.append(bytes.fromhex(hexstr))
    return out


def main() -> int:
    text = CAPTURE.read_text(encoding="utf-8", errors="replace")
    blobs = find_setmatrixled_blobs(text)
    print(f"found {len(blobs)} SetMatrixLED-bearing blobs")

    if not blobs:
        return 1

    # Take the largest blob (most complete)
    largest = max(blobs, key=len)
    print(f"\nlargest blob: {len(largest)} bytes")
    print()

    fields = []
    off = 0
    while off < len(largest):
        try:
            f, new = decode_field(largest, off)
        except Exception as e:
            print(f"  decode error at {off}: {e}")
            break
        if new == off:
            break
        fields.append(f)
        # Friendly print
        v = f["value"]
        if isinstance(v, str) and len(v) > 80:
            v = v[:80] + "..."
        print(f"  @{off:04x}  {f['name']:<28}  type={f['type']:<6}  value={v}")
        off = new

    print(f"\ntotal fields decoded: {len(fields)}")
    print(f"bytes consumed: {off}/{len(largest)}")

    # Save the raw blob too for replay reference
    out = Path(__file__).parent / "captures" / "setmatrixled_plaintext.bin"
    out.parent.mkdir(exist_ok=True)
    out.write_bytes(largest)
    print(f"saved plaintext blob -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
