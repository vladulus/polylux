"""AES-256-GCM cipher used by ArmouryCrate.UserSessionHelper.exe on port 51100.

Cipher parameters (verified 2026-05-10 against captured live traffic, PID 14624):

    Algorithm : AES-256-GCM
    Key       : 32 bytes (extracted via BCryptExportKey on the running process,
                blob type "KeyDataBlob")
    Nonce     : 12 bytes, fresh per BCryptEncrypt call (likely a counter — to
                be confirmed by capturing a sequence)
    Tag       : 16 bytes, appended after ciphertext on the wire
    AAD       : empty (cbAuthData=0 in BCRYPT_AUTHENTICATED_CIPHER_MODE_INFO)
    Flags     : 0 (no chained streaming — each chunk is a standalone GCM op)

The key is per-process: every fresh UserSessionHelper.exe start generates a
new key. Polylux v0.2 extracts it once at service startup via Frida, then
runs the runtime crypto in pure Python (no Frida runtime dependency for the
hot path).
"""
from __future__ import annotations

from dataclasses import dataclass

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


NONCE_LEN = 12
TAG_LEN = 16


@dataclass
class AuraCipher:
    """AES-256-GCM with the wire layout used by UserSessionHelper.

    Wire layout for one chunk (no length prefix — that lives one layer up):

        [nonce: 12 bytes] [ciphertext: N bytes] [tag: 16 bytes]

    The ciphertext length equals the plaintext length (GCM is a stream cipher).
    """

    key: bytes

    def __post_init__(self) -> None:
        if len(self.key) != 32:
            raise ValueError(f"AES-256 key must be 32 bytes, got {len(self.key)}")
        self._aes = AESGCM(self.key)

    def encrypt(self, plaintext: bytes, nonce: bytes) -> tuple[bytes, bytes]:
        """Encrypt one chunk. Returns (ciphertext, tag)."""
        if len(nonce) != NONCE_LEN:
            raise ValueError(f"nonce must be {NONCE_LEN} bytes, got {len(nonce)}")
        out = self._aes.encrypt(nonce, plaintext, None)
        return out[:-TAG_LEN], out[-TAG_LEN:]

    def decrypt(self, ciphertext: bytes, nonce: bytes, tag: bytes) -> bytes:
        """Decrypt one chunk. Raises InvalidTag on auth failure."""
        if len(nonce) != NONCE_LEN:
            raise ValueError(f"nonce must be {NONCE_LEN} bytes, got {len(nonce)}")
        if len(tag) != TAG_LEN:
            raise ValueError(f"tag must be {TAG_LEN} bytes, got {len(tag)}")
        return self._aes.decrypt(nonce, ciphertext + tag, None)
