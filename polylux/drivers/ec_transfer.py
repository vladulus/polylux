"""Handshaked `ec` command / bulk upload, shared by chip 1A21 (OLED) and
the Ryujin LCD (1988).

Both devices answer every `ec XX` HID command with an `ec (XX & 7f)`
input report and announce transfer progress with `ee` events (USBPcap of
AC 6.5.7, 2026-10-25):

    ec 73 01          -> ec 73 .. and ee 13 00 01     ready to receive
    BULK 4096 B       -> ee 14 00 00 10               next chunk please
    last BULK chunk   -> ee 14 00 80 ..               all received
    ec 73 ff          -> ec 73 .. and ee 13 00 ff     stored

AC waits for each of these before sending more. Sending the chunks back
to back hung the Ryujin firmware until it re-enumerated (2026-10-25).
The order of a reply and its event is not fixed, so reports that don't
match what we wait for are kept, not dropped.
"""
from __future__ import annotations

import time
from collections import deque
from typing import Callable, Optional

CHUNK = 4096
GROUP_PAUSE_S = 0.13   # after every 4 chunks, as AC does (ryujin_files_USBPcap1.pcap)


class TransferError(RuntimeError):
    pass


class Channel:
    """write/read pair plus the reports read while waiting for others."""

    def __init__(self, write: Callable[[bytes], None], read: Callable[[int], bytes]):
        self.write, self.read = write, read
        self.pending: deque[bytes] = deque()

    def drain(self) -> None:
        """Drop queued reports (acks of earlier fire-and-forget writes).

        1 ms, not 0: the `hid` package treats timeout 0 as a blocking read.
        """
        self.pending.clear()
        while self.read(1):
            pass

    def wait_for(self, head: bytes, timeout: float) -> bytes:
        return self._wait(lambda r: r[:len(head)] == head, head.hex(" "), timeout)

    def wait_for_event(self, code: int, state: int, timeout: float) -> bytes:
        """ee <code> <flags> <state>: the flags byte varies (00, 10 seen)."""
        return self._wait(lambda r: len(r) > 3 and r[0] == 0xEE and r[1] == code
                          and r[3] == state, f"ee {code:02x} ?? {state:02x}", timeout)

    def _wait(self, match, what: str, timeout: float) -> bytes:
        for rep in list(self.pending):
            if match(rep):
                self.pending.remove(rep)
                return rep
        end = time.monotonic() + timeout
        while True:
            left = end - time.monotonic()
            if left <= 0:
                seen = " ".join(r[:4].hex() for r in self.pending) or "nothing"
                raise TransferError(f"no {what} reply within {timeout:.1f}s (got: {seen})")
            rep = self.read(max(1, int(left * 1000)))
            if not rep:
                continue
            if match(rep):
                return rep
            self.pending.append(rep)

    def command(self, pkt: bytes, timeout: float = 1.0) -> bytes:
        """Send one `ec XX` command and return its `ec (XX & 7f)` reply:
        reads have the top bit set and the reply drops it (ec 99 -> ec 19,
        ec dc -> ec 5c, ec f1 -> ec 71)."""
        self.write(pkt)
        return self.wait_for(bytes([pkt[0], pkt[1] & 0x7F]), timeout)

    def bulk_upload(self, bulk_write: Callable[[bytes], int], data: bytes,
                    timeout: float = 3.0,
                    progress: Optional[Callable[[int, int], None]] = None) -> None:
        """Send `data` in 4 KB chunks, each after the device's ee 14 request."""
        padded = data + b"\x00" * (-len(data) % CHUNK)
        for off in range(0, len(padded), CHUNK):
            n = bulk_write(padded[off:off + CHUNK])
            if n != CHUNK:
                raise TransferError(f"bulk write short at {off}: {n}/{CHUNK}")
            self.wait_for(b"\xee\x14", timeout)
            # AC pauses ~130 ms after every 4th chunk (16 KB); without it the
            # Ryujin rebooted ~380 KB into a 1 MB GIF (2026-10-25).
            if (off // CHUNK) % 4 == 3:
                time.sleep(GROUP_PAUSE_S)
            if progress:
                progress(off + CHUNK, len(padded))
