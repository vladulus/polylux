"""LiveDash OLED high-level driver — depends on Chip1A21 for USB transport.

Drives the motherboard OLED on the ROG Maximus Z690 Extreme. The OLED
lives on the same chip (PID 0x1A21) as the AniMe Matrix; both share USB
interfaces via `polylux.drivers.chip_1a21.Chip1A21`.

Two operations are supported:

1. `set_text(label, value)` — set a 2-line label+value on the OLED.
   Single HID Output Report with prefix 0xEC 0x53 0x00. Used by the
   hardware-monitor mode in AC.

2. `upload_image(gif_bytes)` — upload a custom GIF87a animation
   (256×64 monochrome, ≤100KB) for the Custom Animation mode. The
   upload sequence is:

     HID ec 72 01 00 01 00 00 00      register upload
     HID ec 51 00 00 00 00 00 00      query / lock
     HID ec 73 01 00 00 00 00 00      start send
     HID ec 7f 02 <sizeLE_lo> <sizeLE_hi> 00 00 00   bulk prep
     BULK OUT iface 0 ep 0x01         GIF bytes + zero pad to 4096B

   Note: the OLED may need to be in "Custom Animation" mode in firmware
   for the uploaded image to actually be displayed (vs the default
   Hardware Monitor mode). Mode-switch protocol TBD.

Usage::

    from polylux.drivers.livedash_oled import LiveDashOLED

    with LiveDashOLED.open() as oled:
        oled.set_text("CPU Temp.", "32.0 \\u2103")

    # Shared with matrix:
    from polylux.drivers.chip_1a21 import Chip1A21
    from polylux.drivers.anime_matrix import AniMeMatrix
    with Chip1A21.open() as chip:
        matrix = AniMeMatrix(chip)
        oled = LiveDashOLED(chip)
        matrix.send_frame(...)
        oled.set_text("POLYLUX", "STANDALONE")
"""
from __future__ import annotations

from dataclasses import dataclass

from polylux.drivers.chip_1a21 import Chip1A21, Chip1A21Error


HID_PACKET_SIZE = 65
OLED_BULK_CHUNK = 4096

# OLED text-mode protocol fields
LABEL_OFFSET = 3
LABEL_MAX_BYTES = 18
VALUE_OFFSET = 21
VALUE_MAX_BYTES = 44

# OLED mode-switch back to text/Hardware Monitor mode. Required after
# upload_image() — Custom Animation upload silently puts the OLED into
# "Custom Animation" mode, where 0xEC 0x53 text writes are ignored.
# Verified live with Vlad 2026-05-11: of all candidates tried after a
# stuck image-mode state (ec 71/5c/5d/99/a0/a1/af/73), ec 51 09 was the
# ONLY one that restored text rendering.
_HID_OLED_TEXT_MODE = bytes([0xEC, 0x51, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00]) + b"\x00" * 57


class LiveDashOLEDError(Chip1A21Error):
    """Backwards-compat alias for the chip error."""


def build_text_packet(label: str, value: str) -> bytes:
    """Build a 65-byte HID Output Report that displays `label` + `value`.

    Both arguments are truncated to their max byte length (18 / 44) after
    UTF-8 encoding. Excess bytes are silently dropped.
    """
    pkt = bytearray(HID_PACKET_SIZE)
    pkt[0] = 0xEC
    pkt[1] = 0x53
    pkt[2] = 0x00
    label_bytes = label.encode("utf-8")[:LABEL_MAX_BYTES]
    pkt[LABEL_OFFSET:LABEL_OFFSET + len(label_bytes)] = label_bytes
    value_bytes = value.encode("utf-8")[:VALUE_MAX_BYTES]
    pkt[VALUE_OFFSET:VALUE_OFFSET + len(value_bytes)] = value_bytes
    return bytes(pkt)


def build_image_prep_packets(image_size: int) -> tuple[bytes, bytes, bytes, bytes]:
    """Return the 4 HID prep packets that precede a bulk OUT image upload.

    Each is 65 bytes (full HID Output Report length).
    Sequence: (register, query/lock, start, bulk-prep-with-size).
    """
    size_lo = image_size & 0xFF
    size_hi = (image_size >> 8) & 0xFF
    p72 = bytes([0xEC, 0x72, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00]) + b"\x00" * 57
    p51 = bytes([0xEC, 0x51, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) + b"\x00" * 57
    p73 = bytes([0xEC, 0x73, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]) + b"\x00" * 57
    p7f = bytes([0xEC, 0x7F, 0x02, size_lo, size_hi, 0x00, 0x00, 0x00]) + b"\x00" * 57
    return p72, p51, p73, p7f


@dataclass
class LiveDashOLED:
    """High-level driver for the motherboard OLED.

    Args:
      chip: an open `Chip1A21`. Use `LiveDashOLED.open()` to create one
            on the fly for the simple single-display case.
    """
    chip: Chip1A21
    _owns_chip: bool = False
    _text_mode_armed: bool = False     # have we sent ec 51 09 this session?

    @classmethod
    def open(cls) -> "LiveDashOLED":
        """Open a private Chip1A21 and return an OLED bound to it."""
        chip = Chip1A21.open()
        instance = cls(chip=chip, _owns_chip=True)
        chip._refcount += 1
        return instance

    def close(self) -> None:
        if self._owns_chip and self.chip is not None:
            self.chip._refcount -= 1
            if self.chip._refcount <= 0:
                self.chip.close()
            self._owns_chip = False

    def __enter__(self) -> "LiveDashOLED":
        return self

    def __exit__(self, *_):
        self.close()

    # --- public API ---

    def set_text(self, label: str, value: str) -> None:
        """Display `label` / `value` on the OLED (text / Hardware Monitor mode).

        Args:
          label: top line, ASCII, up to 18 bytes after UTF-8 encode.
          value: bottom line, UTF-8, up to 44 bytes; supports unit glyphs.

        Sends `ec 51 09` (switch to text mode) once per LiveDashOLED
        instance so that text rendering keeps working even after a prior
        `upload_image()` switched the OLED into Custom Animation mode.
        Idempotent.
        """
        if not self._text_mode_armed:
            self.chip.hid_write(_HID_OLED_TEXT_MODE)
            self._text_mode_armed = True
        pkt = build_text_packet(label, value)
        self.chip.hid_write(pkt)

    def upload_image(self, image_bytes: bytes) -> None:
        """Upload a GIF87a custom animation to the OLED (256×64, mono).

        Args:
          image_bytes: raw GIF87a file contents. Max ~100KB per AC UI docs.

        Note: this only uploads the image to firmware. The OLED may be
        in Hardware Monitor mode and won't display the custom image
        until switched to Custom Animation mode. Mode-switch is TBD —
        document for users that they may need to reboot or apply
        Custom Animation in AC at least once.
        """
        if not image_bytes.startswith(b"GIF8"):
            raise ValueError("image_bytes must be a GIF file (magic 'GIF8...')")
        if len(image_bytes) == 0:
            raise ValueError("image_bytes is empty")
        if len(image_bytes) > 100 * 1024:
            raise ValueError(
                f"image_bytes too large: {len(image_bytes)} > 100KB max"
            )

        import time
        size = len(image_bytes)
        p72, p51, p73, p7f = build_image_prep_packets(size)
        for pkt in (p72, p51, p73, p7f):
            self.chip.hid_write(pkt)
            time.sleep(0.05)

        # Pad to next 4KB boundary, send as one bulk transfer.
        padded_len = ((size + OLED_BULK_CHUNK - 1) // OLED_BULK_CHUNK) * OLED_BULK_CHUNK
        padded = image_bytes + b"\x00" * (padded_len - size)
        n = self.chip.bulk_write(padded, timeout_ms=5000)
        if n != padded_len:
            raise LiveDashOLEDError(
                f"OLED bulk write incomplete: {n}/{padded_len}"
            )

    def send_raw_hid(self, packet: bytes) -> None:
        """Send a raw HID Output Report. For experimenting with undecoded
        commands (ec d0, ec 51 09, ec 5c 01 01, etc.).
        """
        self.chip.hid_write(packet)
