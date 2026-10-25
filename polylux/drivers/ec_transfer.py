"""Handshaked `ec` command / bulk upload, shared by chip 1A21 (OLED) and
the Ryujin LCD (1988).

Both devices answer every `ec XX` HID command with an `ec XX ...` input
report and announce transfer progress with `ee` events (USBPcap of AC
6.5.7, 2026-10-25):

    ec 73 01          -> ec 73 .., then ee 13 00 01   ready to receive
    BULK 4096 B       -> ee 14 00 00 10               next chunk please
    last BULK chunk   -> ee 14 00 80 ..               all received
    ec 73 ff          -> ec 73 .., then ee 13 00 ff   stored

AC waits for each of these before sending more. Sending the chunks back
to back hung the Ryujin firmware until it re-enumerated (2026-10-25).
"""
from __future__ import annotations

import time
from typing import Callable, Optional

CHUNK = 4096


class TransferError(RuntimeError):
    pass


def drain(read: Callable[[int], bytes]) -> None:
    """Drop queued input reports (acks of earlier fire-and-forget writes)."""
    while read(0):
        pass


def wait_for(read: Callable[[int], bytes], head: bytes, timeout: float) -> bytes:
    """Read input reports until one starts with `head`."""
    end = time.monotonic() + timeout
    while True:
        left = end - time.monotonic()
        if left <= 0:
            raise TransferError(f"no {head.hex(' ')} reply within {timeout:.1f}s")
        rep = read(max(1, int(left * 1000)))
        if rep and rep[:len(head)] == head:
            return rep


def command(write: Callable[[bytes], None], read: Callable[[int], bytes],
            pkt: bytes, timeout: float = 1.0) -> bytes:
    """Send one `ec XX` command and return its `ec XX` reply."""
    write(pkt)
    return wait_for(read, pkt[:2], timeout)


def bulk_upload(bulk_write: Callable[[bytes], int], read: Callable[[int], bytes],
                data: bytes, timeout: float = 3.0,
                progress: Optional[Callable[[int, int], None]] = None) -> None:
    """Send `data` in 4 KB chunks, each after the device's ee 14 request."""
    padded = data + b"\x00" * (-len(data) % CHUNK)
    for off in range(0, len(padded), CHUNK):
        n = bulk_write(padded[off:off + CHUNK])
        if n != CHUNK:
            raise TransferError(f"bulk write short at {off}: {n}/{CHUNK}")
        wait_for(read, b"\xee\x14", timeout)
        if progress:
            progress(off + CHUNK, len(padded))
