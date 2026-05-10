"""LiveDash OLED USB driver.

Drives the motherboard OLED on the ROG Maximus Z690 Extreme via the same
USB chip (VID 0B05 PID 1A21) that hosts the AniMe Matrix. The chip routes
commands to the OLED or the matrix based on the HID command prefix byte 1:

  byte 1 = 0x7F   ->  AniMe Matrix frame prep (followed by bulk pixel data)
  byte 1 = 0x53   ->  OLED set text command (this module)
  byte 1 = 0xC1   ->  matrix related (observed in capture, paired with bulk)
  byte 1 = 0xD0   ->  control / power / refresh (untested)
  byte 1 = 0x51, 0x5C, 0xDC   ->  control packets (untested)

Protocol for OLED text (verified by USBPcap capture of AC hardware monitor,
then byte-for-byte replay confirmed live on Vlad's board 2026-05-10):

  65-byte HID Output Report on iface 1 (INT ep 0x02):
    pos 0      = 0xEC                       magic
    pos 1      = 0x53                       'S' — set OLED text
    pos 2      = 0x00                       reserved/param
    pos 3..20  = label  (ASCII, 18 bytes max, null-padded)
    pos 21..64 = value  (UTF-8, 44 bytes max, null-padded — supports
                          unit symbols like \\u2103 (℃),
                          \\u3393 (㎓), \\u2193 (↓))

The OLED shows the label on one line and the value on another. Calling
set_text() overwrites whatever was shown previously.
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


VID = 0x0B05
PID = 0x1A21

HID_PACKET_SIZE = 65
LABEL_OFFSET = 3
LABEL_MAX_BYTES = 18
VALUE_OFFSET = 21
VALUE_MAX_BYTES = 44

HID_INTERFACE = 1   # mi_01


def _libusb_dir() -> Path:
    import libusb
    return Path(libusb.__file__).parent / "_platform" / "windows" / "x86_64"


def _add_libusb_to_path() -> Path:
    p = _libusb_dir()
    if str(p) not in os.environ.get("PATH", ""):
        os.environ["PATH"] = str(p) + os.pathsep + os.environ.get("PATH", "")
    return p


class LiveDashOLEDError(RuntimeError):
    pass


def build_text_packet(label: str, value: str) -> bytes:
    """Build a 65-byte HID Output Report that displays `label` + `value`.

    Both arguments are truncated to their max byte length (18 for label,
    44 for value) after UTF-8 encoding. Excess bytes are silently dropped.
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


@dataclass
class LiveDashOLED:
    """Open handle to the motherboard OLED.

    Hold one of these for the duration of your service. The OLED chip
    is shared with the AniMe Matrix (last writer wins on this device),
    so own it for the entire Polylux uptime.
    """
    _hid_dev: object = None   # hid.device

    @classmethod
    def open(cls) -> "LiveDashOLED":
        """Open the HID interface for OLED text commands.

        Raises LiveDashOLEDError if the device isn't present or is held
        by another process (typically ASUS LightingService / AC).
        """
        _add_libusb_to_path()
        try:
            import hid
        except ImportError as ex:
            raise LiveDashOLEDError(f"required deps not installed: {ex}")

        hid_devs = list(hid.enumerate(VID, PID))
        if not hid_devs:
            raise LiveDashOLEDError(
                f"OLED Controller VID 0x{VID:04x} PID 0x{PID:04x} not found "
                f"(no HID interface enumerated)"
            )
        hid_dev = hid.device()
        try:
            hid_dev.open_path(hid_devs[0]["path"])
        except OSError as ex:
            raise LiveDashOLEDError(f"failed to open HID interface: {ex}") from ex
        return cls(_hid_dev=hid_dev)

    def close(self) -> None:
        """Release the HID interface. Idempotent."""
        if self._hid_dev is not None:
            try:
                self._hid_dev.close()
            except Exception:
                pass
            self._hid_dev = None

    def __enter__(self) -> "LiveDashOLED":
        return self

    def __exit__(self, *_):
        self.close()

    # --- public API ---

    def set_text(self, label: str, value: str) -> None:
        """Display `label` / `value` on the OLED.

        Args:
          label: top text, ASCII, up to 18 bytes after UTF-8 encode.
          value: bottom text, UTF-8, up to 44 bytes; supports unit
                 glyphs like '\\u2103' (℃), '\\u3393' (㎓).
        """
        if self._hid_dev is None:
            raise LiveDashOLEDError("OLED not open")
        pkt = build_text_packet(label, value)
        n = self._hid_dev.write(pkt)
        if n < 0:
            raise LiveDashOLEDError(f"HID write failed: {self._hid_dev.error()}")
        if n != HID_PACKET_SIZE:
            raise LiveDashOLEDError(f"short HID write: {n}/{HID_PACKET_SIZE}")

    def send_raw_hid(self, packet: bytes) -> None:
        """Send a raw 65-byte HID Output Report.

        Use for experimental commands (control prefixes 0xD0, 0x51, 0x5C,
        0xDC, etc.) that we haven't fully decoded yet.
        """
        if self._hid_dev is None:
            raise LiveDashOLEDError("OLED not open")
        if len(packet) != HID_PACKET_SIZE:
            raise ValueError(f"packet must be {HID_PACKET_SIZE} bytes, got {len(packet)}")
        n = self._hid_dev.write(packet)
        if n < 0:
            raise LiveDashOLEDError(f"HID write failed: {self._hid_dev.error()}")
