"""Extract one full SetMatrixLED logical message from the live capture so
Polylux can replay it (re-encrypted with the current process's key) without
needing Vlad to click Apply again.

Reads scratch/captures/inbound_apply_20260509_180003.jsonl, finds the 2990-byte
plaintext chunk (the SetMatrixLED payload) and the 6 surrounding chunks that
together form one logical message:

    [16B header] [4B 183] [183B envelope] [4B 28] [28B Number-GUID]
    [4B 2990]    [2990B SetMatrixLED]

Saves chunks as scratch/captures/v0.2/setmatrixled_chunks.json so the TCP
client can iterate them, encrypt each with a fresh nonce, frame each with
pack_frame, and send.
"""
import json
from pathlib import Path

CAPTURE_PATH = Path("scratch/captures/inbound_apply_20260509_180003.jsonl")
OUT_PATH     = Path("scratch/captures/v0.2/setmatrixled_chunks.json")


def main():
    events = [
        json.loads(line)
        for line in CAPTURE_PATH.read_text().splitlines()
        if line.strip()
    ]
    # The capture has every dec event duplicated — the size-query call (empty
    # hex) and the actual decrypt. Keep only the non-empty ones.
    decs = [e for e in events if e["kind"] == "dec" and e["hex"]]

    sml_idx = next(i for i, e in enumerate(decs) if e["n"] == 2990)
    chunks = decs[sml_idx - 6 : sml_idx + 1]

    # Sanity: the 7 chunks must form a self-consistent length-prefixed message
    sizes = [c["n"] for c in chunks]
    assert sizes[0] == 16, f"first chunk should be 16B header, got {sizes[0]}"
    expected = (
        sizes[0]
        + sum(4 + sizes[2 + i * 2] for i in range(3))  # 4B prefix + payload trios
    )
    header = bytes.fromhex(chunks[0]["hex"])
    total = int.from_bytes(header[8:12], "little")
    assert total == expected, f"header total_len {total} != computed {expected}"
    seq = int.from_bytes(header[4:8], "little")
    print(f"[+] SetMatrixLED logical message: 7 chunks, header total={total}, seq={seq}")
    print(f"[+] chunk sizes: {sizes}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "source_capture": str(CAPTURE_PATH),
        "source_seq": seq,
        "total_len": total,
        "chunks": [{"size": c["n"], "hex": c["hex"]} for c in chunks],
        "notes": (
            "Replaying: build new 16B header with fresh seq counter and same "
            "total_len; keep the 6 inner chunks unchanged. Encrypt each with "
            "AuraCipher (fresh nonce per chunk). Frame each with pack_frame. "
            "Send sequentially over TCP to 127.0.0.1:51100."
        ),
    }
    OUT_PATH.write_text(json.dumps(payload, indent=2))
    print(f"[+] saved -> {OUT_PATH}")


if __name__ == "__main__":
    main()
