"""Ryujin II 360 AIO LCD driver.

Talks to USB device PID 0x1988 ("ROG RYUJIN II"). Same USB layout as the
motherboard chip 1A21 (iface 0 BULK OUT + iface 1 HID INT OUT), but on
a different physical chip — so we can NOT reuse Chip1A21 here.

Image upload protocol (verified from matrix_p1.pcap, 358 bulk OUT
chunks of 4096B during a Ryujin LCD update session):
  - Each 4096B bulk chunk contains a portion of a GIF89a 320x240 file.
  - First chunk starts with the GIF89a magic "47 49 46 38 39 61 40 01
    f0 00" = "GIF89a" + width 0x0140 + height 0x00f0 = 320x240.

The HID prep packets observed in the same pcap (paired with bulk):
  - `ec dc 00`   heartbeats
  - `ec 52/53/...` hardware-monitor text overlay (shared with chip 1A21)

Pending: exact HID prep packet before bulk image transfers — we have
the bulk content but the immediately-preceding HID is dominated by text
overlay during continuous LCD refresh, so the actual "begin image
upload" HID may be a once-per-session command. For now, we send the
bulk chunks directly and rely on the LCD's firmware default state to
accept them. If that fails on a fresh boot, we'll need to add a prep
HID similar to OLED Custom Image upload.
"""
from __future__ import annotations

import os
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


VID = 0x0B05
PID = 0x1988

BULK_INTERFACE = 0
BULK_EP_OUT    = 0x01

HID_INTERFACE  = 1
HID_PACKET_SIZE = 65

LCD_BULK_CHUNK = 4096
LCD_WIDTH = 320
LCD_HEIGHT = 240


class RyujinLCDError(RuntimeError):
    """Raised for any failure interacting with the Ryujin LCD."""


def _libusb_dir() -> Path:
    import libusb
    return Path(libusb.__file__).parent / "_platform" / "windows" / "x86_64"


def _add_libusb_to_path() -> Path:
    p = _libusb_dir()
    if str(p) not in os.environ.get("PATH", ""):
        os.environ["PATH"] = str(p) + os.pathsep + os.environ.get("PATH", "")
    return p


@dataclass
class RyujinLCD:
    """Open handle to the Ryujin II LCD."""
    _usb_dev: object = None      # pyusb Device
    _hid_dev: object = None      # hid.device

    @classmethod
    def open(cls) -> "RyujinLCD":
        """Open the LCD. Claims iface 0 (bulk) + opens HID iface 1."""
        libusb_dir = _add_libusb_to_path()
        try:
            import usb.core, usb.util, usb.backend.libusb1
            import hid
        except ImportError as ex:
            raise RyujinLCDError(f"required deps not installed: {ex}")

        backend = usb.backend.libusb1.get_backend(
            find_library=lambda n: str(libusb_dir / "libusb-1.0.dll")
        )
        usb_dev = usb.core.find(idVendor=VID, idProduct=PID, backend=backend)
        if usb_dev is None:
            raise RyujinLCDError(
                f"Ryujin II LCD not found: VID 0x{VID:04x} PID 0x{PID:04x}. "
                f"Is the AIO USB plugged in?"
            )
        try:
            usb.util.claim_interface(usb_dev, BULK_INTERFACE)
        except Exception as ex:
            raise RyujinLCDError(
                f"could not claim bulk interface: {ex}. "
                f"Is LightingService / Aac3572MbHal holding it?"
            ) from ex

        hid_devs = list(hid.enumerate(VID, PID))
        if not hid_devs:
            usb.util.release_interface(usb_dev, BULK_INTERFACE)
            raise RyujinLCDError("HID interface not enumerated")
        hid_dev = hid.device()
        try:
            hid_dev.open_path(hid_devs[0]["path"])
        except OSError as ex:
            usb.util.release_interface(usb_dev, BULK_INTERFACE)
            raise RyujinLCDError(f"failed to open HID interface: {ex}") from ex

        return cls(_usb_dev=usb_dev, _hid_dev=hid_dev)

    def close(self) -> None:
        if self._hid_dev is not None:
            try: self._hid_dev.close()
            except Exception: pass
            self._hid_dev = None
        if self._usb_dev is not None:
            try:
                import usb.util
                usb.util.release_interface(self._usb_dev, BULK_INTERFACE)
                usb.util.dispose_resources(self._usb_dev)
            except Exception: pass
            self._usb_dev = None

    def __enter__(self) -> "RyujinLCD":
        return self

    def __exit__(self, *_):
        self.close()

    # --- low-level ---

    def hid_write(self, packet: bytes) -> None:
        if self._hid_dev is None:
            raise RyujinLCDError("LCD not open")
        if len(packet) < HID_PACKET_SIZE:
            packet = packet + b"\x00" * (HID_PACKET_SIZE - len(packet))
        elif len(packet) > HID_PACKET_SIZE:
            raise ValueError(
                f"HID packet too long: {len(packet)} > {HID_PACKET_SIZE}"
            )
        n = self._hid_dev.write(packet)
        if n < 0:
            raise RyujinLCDError(
                f"HID write failed (prefix={packet[:8].hex()}): {self._hid_dev.error()}"
            )

    def bulk_write(self, data: bytes, timeout_ms: int = 5000) -> int:
        if self._usb_dev is None:
            raise RyujinLCDError("LCD not open")
        return self._usb_dev.write(BULK_EP_OUT, data, timeout=timeout_ms)

    # --- public API ---

    def upload_image(self, image_bytes: bytes) -> None:
        """Upload a GIF (320x240 color, animated or single-frame) to the LCD.

        Args:
          image_bytes: raw GIF file contents. Native LCD resolution is
                       320x240; smaller/larger get scaled by the LCD
                       firmware (or letterboxed — TBD). Max size ~2MB
                       (per ec 7f 02 24-bit size field).

        Wire protocol decoded from matrix_p1.pcap (Ryujin LCD on dev 20),
        events 285..290+:

          ec 71 01 01 00 00 00 00     switch to Custom Image mode
          ec f1 00 00 00 00 00 00     unknown control (always present)
          ec 72 01 02 01 00 00 00     register upload (byte 3 = 0x02
                                       distinguishes LCD from OLED 0x00)
          ec 73 01 00 00 00 00 00     start send
          ec 7f 02 sLO sMID sHI 00 00 00   bulk prep with 24-bit LE size
                                            of the IMAGE BYTES (not padded)
          BULK OUT 4096B × N           image data, padded to next 4KB
        """
        if not image_bytes.startswith(b"GIF8"):
            raise ValueError("image_bytes must be a GIF file (magic 'GIF8...')")
        if len(image_bytes) == 0:
            raise ValueError("image_bytes is empty")
        if len(image_bytes) >= (1 << 24):
            raise ValueError(
                f"image_bytes too large: {len(image_bytes)} >= 16MB (24-bit size field)"
            )

        size = len(image_bytes)
        size_lo  = size & 0xFF
        size_mid = (size >> 8) & 0xFF
        size_hi  = (size >> 16) & 0xFF

        # HID prep packets in order
        p71 = bytes([0xEC, 0x71, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00])
        pf1 = bytes([0xEC, 0xF1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        p72 = bytes([0xEC, 0x72, 0x01, 0x02, 0x01, 0x00, 0x00, 0x00])
        p73 = bytes([0xEC, 0x73, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00])
        p7f = bytes([0xEC, 0x7F, 0x02, size_lo, size_mid, size_hi, 0x00, 0x00])
        for pkt in (p71, pf1, p72, p73, p7f):
            self.hid_write(pkt)
            time.sleep(0.05)

        # Pad image to next 4096B boundary, send chunked
        padded_len = ((size + LCD_BULK_CHUNK - 1) // LCD_BULK_CHUNK) * LCD_BULK_CHUNK
        padded = image_bytes + b"\x00" * (padded_len - size)
        for offset in range(0, padded_len, LCD_BULK_CHUNK):
            chunk = padded[offset:offset + LCD_BULK_CHUNK]
            n = self.bulk_write(chunk, timeout_ms=5000)
            if n != LCD_BULK_CHUNK:
                raise RyujinLCDError(
                    f"LCD bulk write incomplete at offset {offset}: "
                    f"{n}/{LCD_BULK_CHUNK}"
                )
