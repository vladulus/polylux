"""Low-level USB driver for the ASUS "OLED Controller" chip (VID 0B05 PID 1A21).

This chip is shared between three logical displays on the ROG Maximus Z690
Extreme motherboard:

  - AniMe Matrix (36×7 pixel staircase, full RGB)
  - LiveDash OLED (256×64 monochrome)
  - the hardware-monitor text overlay on either display

Only ONE process / handle can claim this USB device at a time. To avoid
having `AniMeMatrix` and `LiveDashOLED` step on each other's USB claim,
both high-level classes depend on a single `Chip1A21` instance passed in
by the caller (dependency injection).

Convenience: `AniMeMatrix.open()` and `LiveDashOLED.open()` internally
create a private `Chip1A21` if the caller doesn't supply one. Use the
shared form when you need both displays in the same process::

    with Chip1A21.open() as chip:
        matrix = AniMeMatrix(chip)
        oled = LiveDashOLED(chip)
        matrix.send_frame(...)
        oled.set_text(...)
"""
from __future__ import annotations

import os
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


VID = 0x0B05
PID = 0x1A21

# Interface 0: vendor-specific class, bulk OUT ep 0x01 + bulk IN ep 0x81 (pixel data).
BULK_INTERFACE = 0
BULK_EP_OUT    = 0x01

# Interface 1: HID class, interrupt OUT ep 0x02 + interrupt IN ep 0x82 (commands).
HID_INTERFACE  = 1

# HID Output Report size (1 report ID byte + 64 bytes payload, padded).
HID_PACKET_SIZE = 65

# Initialization packets observed in matrix_p1.pcap at t=0..1.7s and t=83.32s.
# Without these the chip silently drops the first BULK frame after a cold
# start. Polylux's matrix went black after AC was uninstalled before we
# discovered this sequence.
_HID_HEARTBEAT  = bytes([0xEC, 0xDC, 0x00]) + b"\x00" * 62
_HID_CONTROL_82 = bytes([0xEC, 0x82, 0x00]) + b"\x00" * 62
_HID_PREP_C1    = bytes([0xEC, 0xC1, 0x00]) + b"\x00" * 62
_HID_ENABLE_42  = bytes([0xEC, 0x42, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]) + b"\x00" * 57


class Chip1A21Error(RuntimeError):
    """Raised for any failure interacting with the chip."""


def _libusb_dir() -> Path:
    import libusb
    return Path(libusb.__file__).parent / "_platform" / "windows" / "x86_64"


def _add_libusb_to_path() -> Path:
    p = _libusb_dir()
    if str(p) not in os.environ.get("PATH", ""):
        os.environ["PATH"] = str(p) + os.pathsep + os.environ.get("PATH", "")
    return p


@dataclass
class Chip1A21:
    """Open handle to the chip. Holds both USB interfaces for as long as the
    Polylux process is running. Last-writer-wins on the actual displays.
    """
    _usb_dev: object = None      # pyusb Device
    _hid_dev: object = None      # hid.device
    _initialized: bool = False
    # Reference count so that AniMeMatrix + LiveDashOLED can be opened
    # and closed independently without releasing the chip until both are done.
    _refcount: int = field(default=0)

    @classmethod
    def open(cls) -> "Chip1A21":
        """Open the chip. Claims interface 0 (bulk) and opens HID iface 1."""
        libusb_dir = _add_libusb_to_path()
        try:
            import usb.core, usb.util, usb.backend.libusb1
            import hid
        except ImportError as ex:
            raise Chip1A21Error(f"required deps not installed: {ex}")

        backend = usb.backend.libusb1.get_backend(
            find_library=lambda n: str(libusb_dir / "libusb-1.0.dll")
        )
        usb_dev = usb.core.find(idVendor=VID, idProduct=PID, backend=backend)
        if usb_dev is None:
            raise Chip1A21Error(
                f"chip not found: VID 0x{VID:04x} PID 0x{PID:04x}. "
                f"Is the motherboard plugged in / device powered?"
            )
        try:
            usb.util.claim_interface(usb_dev, BULK_INTERFACE)
        except Exception as ex:
            raise Chip1A21Error(
                f"could not claim bulk interface: {ex}. "
                f"Is ASUS LightingService / Aac3572MbHal holding it?"
            ) from ex

        hid_devs = list(hid.enumerate(VID, PID))
        if not hid_devs:
            usb.util.release_interface(usb_dev, BULK_INTERFACE)
            raise Chip1A21Error("HID interface not enumerated by Windows")
        hid_dev = hid.device()
        try:
            hid_dev.open_path(hid_devs[0]["path"])
        except OSError as ex:
            usb.util.release_interface(usb_dev, BULK_INTERFACE)
            raise Chip1A21Error(f"failed to open HID interface: {ex}") from ex

        # Note: we do NOT call _init_for_matrix() here. The matrix-enable
        # command (ec 42 01) puts the chip into matrix display mode and
        # appears to suppress OLED text writes until power-cycled. So
        # init is lazy: AniMeMatrix calls it before its first frame.
        return cls(_usb_dev=usb_dev, _hid_dev=hid_dev)

    # --- lifecycle ---

    def close(self) -> None:
        """Release the chip. Idempotent."""
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

    def __enter__(self) -> "Chip1A21":
        self._refcount += 1
        return self

    def __exit__(self, *_):
        self._refcount -= 1
        if self._refcount <= 0:
            self.close()

    # --- low-level transports ---

    def hid_write(self, packet: bytes) -> None:
        """Write a 65-byte HID Output Report on iface 1 ep 0x02.

        Raises Chip1A21Error on short write or device error.
        """
        if self._hid_dev is None:
            raise Chip1A21Error("chip not open")
        if len(packet) != HID_PACKET_SIZE:
            # Pad or truncate. The chip's report descriptor expects exactly
            # HID_PACKET_SIZE; mismatched lengths land in WriteFile error.
            if len(packet) < HID_PACKET_SIZE:
                packet = packet + b"\x00" * (HID_PACKET_SIZE - len(packet))
            else:
                raise ValueError(
                    f"HID packet too long: {len(packet)} > {HID_PACKET_SIZE}"
                )
        n = self._hid_dev.write(packet)
        if n < 0:
            raise Chip1A21Error(
                f"HID write failed (prefix={packet[:8].hex()}): {self._hid_dev.error()}"
            )

    def bulk_write(self, data: bytes, timeout_ms: int = 5000) -> int:
        """Write bytes to iface 0 BULK OUT ep 0x01.

        Returns the actual number of bytes written. The chip's max packet
        on this endpoint is 64 bytes; libusb handles fragmentation.
        """
        if self._usb_dev is None:
            raise Chip1A21Error("chip not open")
        return self._usb_dev.write(BULK_EP_OUT, data, timeout=timeout_ms)

    # --- matrix initialization (called lazily by AniMeMatrix) ---

    def init_for_matrix(self) -> None:
        """Send the matrix-enable init sequence so the chip accepts the
        ec 7f + bulk frame protocol.

        Decoded from AC's first-launch USB capture (matrix_p1.pcap):
          ec dc 00 × 3   heartbeats (~500ms apart)
          ec 82 00       control packet
          ec c1 00       frame companion (paired with ec 7f)
          ec 42 01       ENABLE MATRIX DISPLAY MODE — the key command

        Idempotent in the lifetime of this Chip1A21 instance — re-sending
        these against an already-initialized chip has no visible effect.

        NOTE: calling this also seems to suppress OLED text writes (ec 53)
        until the chip is power-cycled. If you need both matrix and OLED
        in the same session, send the OLED commands FIRST, then init the
        matrix. We don't currently know a "switch to OLED-only mode"
        command to re-enable text after matrix-enable.
        """
        if self._initialized:
            return
        for _ in range(3):
            self.hid_write(_HID_HEARTBEAT)
            time.sleep(0.05)
        self.hid_write(_HID_CONTROL_82)
        time.sleep(0.05)
        self.hid_write(_HID_PREP_C1)
        self.hid_write(_HID_ENABLE_42)
        time.sleep(0.05)
        self._initialized = True
