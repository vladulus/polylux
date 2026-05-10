"""USB-direct force-color driver for the AniMe Matrix.

Replaces the v0.1 Frida-based MatrixForceColorDriver. Opens the matrix
chip directly via WinUSB + HID and holds it at a fixed fill value. The
ASUS daemon can be running, killed, or absent — irrelevant. Last writer
to the chip wins, and we refresh periodically to stay last writer.

This is the v0.2 production matrix driver.

Note: the matrix's COLOR (HSL) is set by chip firmware, NOT per-pixel
in our buffer. Our buffer is INTENSITY per channel (R/G/B planar). For
true RGB we'd need the full pixel-byte LUT (work in progress). For now
this driver just sends a uniform brightness — useful as a "Polylux is
alive" indicator and to verify USB ownership.
"""
from __future__ import annotations

import logging
import threading
import time
from typing import Optional

from polylux.drivers.anime_matrix.usb_direct import (
    AniMeMatrix,
    AniMeMatrixError,
    FRAME_SIZE,
)

log = logging.getLogger(__name__)


class UsbForceColorDriver:
    """Open the matrix, hold a static fill, refresh every `refresh_s`.

    The refresh is what keeps us as last writer if any other process
    (ASUS daemon, etc.) tries to push frames. At 1 Hz refresh the chip
    rarely flickers since each write replaces the buffer atomically.
    """

    def __init__(
        self,
        color: tuple[int, int, int] = (255, 255, 255),
        refresh_s: float = 1.0,
        retry_open_s: float = 5.0,
    ) -> None:
        self.color = color  # currently unused (LUT pending); reserved for v0.3
        self.refresh_s = refresh_s
        self.retry_open_s = retry_open_s
        self._matrix: Optional[AniMeMatrix] = None
        self._stop = threading.Event()
        self._frame: bytes = self._build_frame()

    @staticmethod
    def _build_frame() -> bytes:
        """All pixels bright. Future: render config color via LUT."""
        return b"\xff" * FRAME_SIZE

    def attach(self) -> bool:
        try:
            self._matrix = AniMeMatrix.open()
            log.info("usb_direct: matrix opened")
            return True
        except AniMeMatrixError as ex:
            log.warning("usb_direct open failed: %s", ex)
            return False

    def detach(self) -> None:
        if self._stop is not None:
            self._stop.set()
        if self._matrix is not None:
            try:
                self._matrix.close()
            except Exception:
                pass
            self._matrix = None
            log.info("usb_direct: matrix closed")

    def run_forever(self) -> None:
        """Block. Refreshes every `refresh_s`. Re-opens on errors."""
        while not self._stop.is_set():
            if self._matrix is None:
                if not self.attach():
                    if self._stop.wait(self.retry_open_s):
                        return
                    continue
            try:
                self._matrix.send_frame(self._frame)
            except Exception as ex:
                log.warning("usb_direct: send_frame failed (%s); will reopen", ex)
                try: self._matrix.close()
                except Exception: pass
                self._matrix = None
                if self._stop.wait(self.retry_open_s):
                    return
                continue
            if self._stop.wait(self.refresh_s):
                return
