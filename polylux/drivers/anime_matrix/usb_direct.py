"""Direct-to-USB driver for the AniMe Matrix on ROG Maximus Z690 Extreme.

This module bypasses ALL of ASUS's user-space stack (Armoury Crate UI,
UserSessionHelper, ArmouryCrate.Service, LightingService, Aac3572MbHal)
and talks straight to the OLED Controller chip on the motherboard via
its USB endpoints.

Hardware details (verified empirically 2026-05-10):

  USB device:   VID 0x0B05 PID 0x1A21
                ("OLED Controller" — AniMe Matrix is on this chip)
  Driver:       WinUSB (already bound by Windows; no driver swap needed)

  Per-frame protocol:
    1. HID Output Report on iface 1 mi_01 (INT ep 0x02), 65 bytes:
         [0xEC, 0x7F, 0x04, 0x00, 0x03] + 60 zeros
       This is the "frame begin" signal. Without it, the bulk write that
       follows is silently ignored by the firmware.
    2. Bulk OUT on iface 0 mi_00 (ep 0x01), 768 bytes pixel data:
         each byte is one dot, 0x00 = off, any non-zero = on
         (the device firmware appears to threshold; we have not yet
         confirmed it supports per-pixel grayscale on this PID)

  Matrix dimensions:
    36 columns × 21 rows, with `slash_h = 20` (a staircase / dimetric
    layout — every other row is shifted half a column). Pixel-to-byte
    mapping inside the 768-byte buffer is per-PID; see scratch/lut_*.py
    for derivation.

This protocol is DIFFERENT from the laptop AniMe Matrix (PID 0x193b),
which uses report ID 0x5e and 640-byte feature reports. Reference
projects (asusctl, Starlight, g-helper) only target the laptop PID;
Polylux is the first known driver for PID 0x1A21.

Usage::

    with AniMeMatrix.open() as m:
        m.fill(0xff)
        m.flush()                # all dots ON
        m.clear()
        m.flush()                # all dots OFF
        m.set_byte(100, 0xff)
        m.flush()                # one dot ON

    # Or pass a fully-built frame buffer:
    m.send_frame(my_768_byte_buffer)
"""
from __future__ import annotations

import os
import sys
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


VID = 0x0B05
PID = 0x1A21

FRAME_SIZE = 768
HID_PREP = bytes([0xEC, 0x7F, 0x04, 0x00, 0x03]) + b"\x00" * 60   # 65 bytes

# Init sequence captured from AC startup (matrix_p1.pcap, dev 7, t=0..1.7s+83.3s).
# Without these the chip ignores frame writes silently — found by Vlad after
# AC was uninstalled and matrix went dark despite USB writes succeeding.
HID_HEARTBEAT  = bytes([0xEC, 0xDC, 0x00]) + b"\x00" * 62          # x3 at startup
HID_CONTROL_82 = bytes([0xEC, 0x82, 0x00]) + b"\x00" * 62          # x1 after heartbeats
HID_ENABLE_42  = bytes([0xEC, 0x42, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]) + b"\x00" * 57
# ^^^ THIS is the magic "enable matrix display mode" command. Once-per-session,
#     before the first frame. Without it the chip ignores ec 7f + bulk writes.

# Companion prep packet sent before every matrix frame. AC always pairs
# ec c1 + ec 7f. We were skipping ec c1 before discovering the init sequence —
# it now appears to be required after a fresh init.
HID_PREP_C1    = bytes([0xEC, 0xC1, 0x00]) + b"\x00" * 62

BULK_INTERFACE = 0       # mi_00, vendor specific
BULK_EP_OUT    = 0x01

HID_INTERFACE  = 1       # mi_01, HID class — for the prep INT OUT


def _libusb_dir() -> Path:
    """Return the directory that contains the bundled libusb-1.0.dll."""
    import libusb
    return Path(libusb.__file__).parent / "_platform" / "windows" / "x86_64"


def _add_libusb_to_path() -> Path:
    p = _libusb_dir()
    if str(p) not in os.environ.get("PATH", ""):
        os.environ["PATH"] = str(p) + os.pathsep + os.environ.get("PATH", "")
    return p


class AniMeMatrixError(RuntimeError):
    pass


@dataclass
class AniMeMatrix:
    """Open handle to the matrix display.

    Hold one of these for the duration of your service. The OLED Controller
    chip stops responding to ASUS's daemon while we hold it (last writer
    wins on this device), so own it for as long as Polylux runs.
    """
    _usb_dev: object = None     # pyusb Device
    _hid_dev: object = None     # hid.device
    _frame: bytearray = None    # working frame buffer

    @classmethod
    def open(cls) -> "AniMeMatrix":
        """Open and claim both interfaces. Raises AniMeMatrixError on failure."""
        libusb_dir = _add_libusb_to_path()
        try:
            import usb.core, usb.util, usb.backend.libusb1
            import hid
        except ImportError as ex:
            raise AniMeMatrixError(f"required deps not installed: {ex}")

        backend = usb.backend.libusb1.get_backend(
            find_library=lambda n: str(libusb_dir / "libusb-1.0.dll")
        )
        usb_dev = usb.core.find(idVendor=VID, idProduct=PID, backend=backend)
        if usb_dev is None:
            raise AniMeMatrixError(
                f"OLED Controller VID 0x{VID:04x} PID 0x{PID:04x} not found"
            )
        try:
            usb.util.claim_interface(usb_dev, BULK_INTERFACE)
        except Exception as ex:
            raise AniMeMatrixError(f"failed to claim bulk interface: {ex}") from ex

        hid_devs = list(hid.enumerate(VID, PID))
        if not hid_devs:
            usb.util.release_interface(usb_dev, BULK_INTERFACE)
            raise AniMeMatrixError("HID interface not enumerated")
        hid_dev = hid.device()
        try:
            hid_dev.open_path(hid_devs[0]["path"])
        except OSError as ex:
            usb.util.release_interface(usb_dev, BULK_INTERFACE)
            raise AniMeMatrixError(f"failed to open HID interface: {ex}") from ex

        instance = cls(_usb_dev=usb_dev, _hid_dev=hid_dev, _frame=bytearray(FRAME_SIZE))
        # Send the init sequence so the chip accepts subsequent frame writes
        # even after AC has never run / is uninstalled / matrix is in cold state.
        # Empirically validated 2026-05-11 — without this the matrix is silent.
        instance._init_chip()
        return instance

    def _init_chip(self) -> None:
        """Wake up the matrix chip with the AC-discovered init sequence.

        Idempotent — if the chip is already initialized (AC ran earlier in
        this boot session), re-sending these commands has no effect on
        display state.
        """
        import time
        # 3 heartbeats at 500ms intervals (AC sends these on startup).
        for _ in range(3):
            self._hid_dev.write(HID_HEARTBEAT)
            time.sleep(0.05)
        # Control packet 0x82 (purpose unknown but always present in init).
        self._hid_dev.write(HID_CONTROL_82)
        time.sleep(0.05)
        # Enable matrix display mode — the magic command. Pair with ec c1
        # like AC does.
        self._hid_dev.write(HID_PREP_C1)
        self._hid_dev.write(HID_ENABLE_42)
        time.sleep(0.05)

    def close(self) -> None:
        """Release both interfaces. Idempotent."""
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

    def __enter__(self) -> "AniMeMatrix":
        return self

    def __exit__(self, *_):
        self.close()

    # --- Frame buffer helpers ---

    def clear(self) -> None:
        """Set the working frame buffer to all-off (0x00)."""
        for i in range(FRAME_SIZE):
            self._frame[i] = 0

    def fill(self, value: int = 0xFF) -> None:
        """Set every byte of the working frame to `value`."""
        if not 0 <= value <= 0xFF:
            raise ValueError(f"value must be 0..255, got {value}")
        for i in range(FRAME_SIZE):
            self._frame[i] = value

    def set_byte(self, index: int, value: int = 0xFF) -> None:
        """Set one byte in the working frame buffer.

        `index` is the buffer offset (0..767), NOT a (row, col) pixel
        coordinate. Coordinate-space helpers will land once the
        pixel-to-byte mapping LUT is derived.
        """
        if not 0 <= index < FRAME_SIZE:
            raise IndexError(f"frame index out of range: {index}")
        if not 0 <= value <= 0xFF:
            raise ValueError(f"value must be 0..255, got {value}")
        self._frame[index] = value

    def get_byte(self, index: int) -> int:
        if not 0 <= index < FRAME_SIZE:
            raise IndexError(f"frame index out of range: {index}")
        return self._frame[index]

    @property
    def frame(self) -> bytes:
        return bytes(self._frame)

    # --- Wire transfer ---

    def flush(self) -> None:
        """Push the current working frame buffer to the device."""
        self.send_frame(self._frame)

    def send_frame(self, buf: bytes) -> None:
        """Push an arbitrary 768-byte frame buffer to the device.

        Writes (matching the per-frame sequence AC uses, observed in
        matrix_p1.pcap):
          1. HID companion prep ec c1 00 — paired with ec 7f at every frame.
          2. HID prep packet ec 7f 04 00 03 — frame begin signal.
          3. Bulk frame (BULK OUT 768B) — pixel data.
        """
        if len(buf) != FRAME_SIZE:
            raise ValueError(f"frame must be {FRAME_SIZE}B, got {len(buf)}")
        if self._usb_dev is None or self._hid_dev is None:
            raise AniMeMatrixError("matrix not open")

        n = self._hid_dev.write(HID_PREP_C1)
        if n < 0:
            raise AniMeMatrixError(f"HID ec c1 prep write failed: {self._hid_dev.error()}")

        n = self._hid_dev.write(HID_PREP)
        if n < 0:
            raise AniMeMatrixError(f"HID ec 7f prep write failed: {self._hid_dev.error()}")

        n = self._usb_dev.write(BULK_EP_OUT, bytes(buf), timeout=2000)
        if n != FRAME_SIZE:
            raise AniMeMatrixError(f"bulk write incomplete: {n}/{FRAME_SIZE}")
