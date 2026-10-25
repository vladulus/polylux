"""Ryujin II 360 AIO LCD driver.

Talks to USB device PID 0x1988 ("ROG RYUJIN II"): iface 0 BULK OUT for
image data, iface 1 HID for `ec` commands. Every sequence here is what
AC 6.5.7 sends (USBPcap, 2026-10-25, docs/PROJECT_STATE.md §9.3).

  image upload:  ec 71 01 01, ec f1, ec 72 01 <kind> 01, ec 73 01,
                 ec 7f 02 <size 24-bit LE>, BULK file bytes padded to
                 4 KB, ec 73 ff, ec 5c <settings>,
                 ec 5d 00 01 11 01 01 05, ec 51 11 01 01
                 kind 01 = JPEG (seen), 02 = GIF (seen in matrix_p1.pcap)
  settings:      ec 5c 01 00 64 <portrait> <display_off> 64 <14|00> 00
                 <anim> 00 <standby_brightness> <14|00> 00 <anim>
  firmware animation:  ec 5d 00 01 14 00 <idx> 05, ec 51 14 00 <idx>
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

    def hid_read(self, timeout_ms: int) -> bytes:
        """One HID input report (ec/ee reply), or b"" on timeout."""
        if self._hid_dev is None:
            raise RyujinLCDError("LCD not open")
        return bytes(self._hid_dev.read(HID_PACKET_SIZE, timeout_ms))

    def _channel(self):
        from polylux.drivers.ec_transfer import Channel
        if getattr(self, "_ch", None) is None:
            self._ch = Channel(lambda p: self.hid_write(p), lambda t: self.hid_read(t))
        return self._ch

    def command(self, pkt: bytes, timeout: float = 1.0) -> bytes:
        """Send one ec command and wait for its reply, like AC does."""
        return self._channel().command(pkt, timeout)

    # --- public API ---

    def upload_image(self, image_bytes: bytes, settings: "RyujinSettings") -> None:
        """Upload a 320x240 JPEG or GIF and show it (AC's Image mode).

        Every step waits for the device's reply (ec_transfer docstring).
        """
        ch = self._channel()
        p71, pf1, p72, p73, p7f = (p for p, _ in build_upload_prep_packets(image_bytes))
        ch.drain()
        # AC first frees the slot it writes to (AIOFanSDK log: MediaDelete
        # Type:0 index:1, then MediaTransfer Type:1 index:1): ec 72 01 <kind>
        # <slot> + ec 73 03 -> ee 13 00 03. A 10 in the flags byte
        # (ee 13 10 ..) is what every file operation answered while the LCD
        # was wedged by the un-acked uploads of 2026-10-25; only a power
        # cycle cleared it, so stop instead of making it worse.
        ch.command(p72)
        ch.write(_pad([0xEC, 0x73, 0x03]))
        ev = ch.wait_for_event(0x13, 0x03, 3.0)
        if ev[2] & 0x10:
            raise RyujinLCDError("LCD refuses file operations (ee 13 10 03): "
                                 "power the PC off fully, then retry")
        time.sleep(0.5)
        ch.drain()
        ch.command(p71)
        ch.command(pf1)
        ch.command(p72)
        ch.write(p73)                   # the ec 73 reply sometimes never comes
        try:
            ch.wait_for_event(0x13, 0x01, 2.0)
        except Exception:
            # After an aborted upload the LCD stays in "receiving" until
            # ec 73 ff closes that session.
            ch.write(_pad([0xEC, 0x73, 0xFF]))
            time.sleep(0.5)
            ch.drain()
            ch.write(p73)
            ch.wait_for_event(0x13, 0x01, 2.0)
        ch.command(p7f)
        ch.bulk_upload(lambda d: self.bulk_write(d), image_bytes, timeout=6.0)
        ch.write(_pad([0xEC, 0x73, 0xFF]))
        ch.wait_for_event(0x13, 0xFF, 5.0)
        mode = MODE_GIF if image_bytes[:4] == b"GIF8" else MODE_IMAGE
        for pkt in (settings.packet(), *mode):
            ch.command(pkt)

    def apply_settings(self, settings: "RyujinSettings") -> None:
        self._channel().drain()
        self.command(settings.packet())

    def set_fans(self, pump_pct: int, embedded_pct: int, aio_pct: float) -> None:
        """ec 1a 00 <pump%> <embedded fan%> + ec 21 00 00 <AIO duty 0..255>
        (AC's Full Speed preset sent 64 64 / ff)."""
        self.command(_pad([0xEC, 0x1A, 0x00, pump_pct, embedded_pct]))
        self.command(_pad([0xEC, 0x21, 0x00, 0x00, round(max(0.0, min(100.0, aio_pct)) * 2.55)]))

    def read_status(self) -> dict:
        """ec 99 / ec a0 / ec 9a readings, decoded as far as captured."""
        s = self.command(_pad([0xEC, 0x99]))
        a = self.command(_pad([0xEC, 0xA0]))
        f = self.command(_pad([0xEC, 0x9A]))
        return {
            "liquid_c": s[3] + s[4] / 10,                       # [Probabil] liquid temp
            "rpm_1": int.from_bytes(s[5:7], "little"),          # [Ghicesc] pump
            "rpm_2": int.from_bytes(s[7:9], "little"),          # [Ghicesc] embedded fan
            "aio_rpm": int.from_bytes(a[5:7], "little"),
            "pump_pct": f[4], "embedded_pct": f[5],
        }

    def show_animation(self, index: int) -> None:
        """One of the three firmware animations (AC's Default Animation)."""
        for pkt in build_animation_packets(index):
            self.command(pkt)


def _pad(head) -> bytes:
    return bytes(head) + b"\x00" * (HID_PACKET_SIZE - len(head))


MODE_IMAGE = (_pad([0xEC, 0x5D, 0x00, 0x01, 0x11, 0x01, 0x01, 0x05]),   # JPEG still
              _pad([0xEC, 0x51, 0x11, 0x01, 0x01]))
MODE_GIF = (_pad([0xEC, 0x5D, 0x00, 0x01, 0x10, 0x01, 0x01, 0x05]),     # animated GIF
            _pad([0xEC, 0x51, 0x10, 0x01, 0x01]))


@dataclass(frozen=True)
class RyujinSettings:
    """The ec 5c block. AC resends all of it on every change."""
    portrait: bool = True
    display_on: bool = True
    animation: int = 0             # 0..2, also the standby animation
    standby: bool = False          # False = LCD dark with the PC off
    standby_brightness: int = 100  # 0..100

    def packet(self) -> bytes:
        on = 0x14 if self.display_on else 0x00
        sb_bright = max(0, min(100, self.standby_brightness)) if self.standby else 0
        sb_time = 0x14 if self.standby else 0x00
        return _pad([0xEC, 0x5C, 0x01, 0x00, 0x64, int(self.portrait),
                     int(not self.display_on), 0x64, on, 0x00, self.animation, 0x00,
                     sb_bright, sb_time, 0x00, self.animation])


def build_upload_prep_packets(image_bytes: bytes) -> list[tuple[bytes, float]]:
    """HID packets before the bulk transfer, with the pause after each."""
    if image_bytes[:3] == bytes([0xFF, 0xD8, 0xFF]):
        kind = 0x01
    elif image_bytes[:4] == b"GIF8":
        kind = 0x02
    else:
        raise ValueError("Ryujin image must be a JPEG or GIF file")
    if len(image_bytes) >= 1 << 24:
        raise ValueError(f"image too large for the 24-bit size field: {len(image_bytes)}")
    size = len(image_bytes).to_bytes(3, "little")
    return [
        (_pad([0xEC, 0x71, 0x01, 0x01]), 0.05),
        (_pad([0xEC, 0xF1]), 0.2),
        (_pad([0xEC, 0x72, 0x01, kind, 0x01]), 0.15),
        (_pad([0xEC, 0x73, 0x01]), 0.5),
        (_pad([0xEC, 0x7F, 0x02, *size]), 0.5),
    ]


# Hardware Monitor: AC resends 4 slots + the layout every ~6 s; the firmware
# shows 0 until it gets them. Label at byte 3, value (UTF-8, unit glyph
# included, e.g. "45.0℃") at byte 39 — ryujin_USBPcap1.pcap.
MONITOR_LABEL_AT, MONITOR_VALUE_AT = 3, 39
MONITOR_LAYOUT_QUAD = _pad([0xEC, 0x52, 0x00, 0x03, 0x02, 0x02, 0x00, 0x00, 0x00, 0x00,
                            0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF])


def build_monitor_packet(slot: int, label: str, value: str) -> bytes:
    pkt = bytearray(_pad([0xEC, 0x53, slot]))
    lab = label.encode("utf-8")[:MONITOR_VALUE_AT - MONITOR_LABEL_AT - 1]
    val = value.encode("utf-8")[:HID_PACKET_SIZE - MONITOR_VALUE_AT]
    pkt[MONITOR_LABEL_AT:MONITOR_LABEL_AT + len(lab)] = lab
    pkt[MONITOR_VALUE_AT:MONITOR_VALUE_AT + len(val)] = val
    return bytes(pkt)


def build_animation_packets(index: int) -> tuple[bytes, bytes]:
    if not 0 <= index <= 2:
        raise ValueError(f"animation index must be 0..2, got {index}")
    return (_pad([0xEC, 0x5D, 0x00, 0x01, 0x14, 0x00, index, 0x05]),
            _pad([0xEC, 0x51, 0x14, 0x00, index]))
