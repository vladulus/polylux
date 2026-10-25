"""The upload handshake: one 4 KB chunk per ee 14 request (AC capture 2026-10-25)."""
import pytest

from polylux.drivers import ec_transfer as ec
from polylux.drivers.ryujin_lcd.driver import RyujinLCD, RyujinSettings


class FakeDevice:
    """Replies like the Ryujin did in ryujin_steps_USBPcap1.pcap."""

    def __init__(self, ack_chunks=True):
        self.inbox, self.log, self.ack_chunks = [], [], ack_chunks

    def write(self, pkt):
        pkt = bytes(pkt)
        self.log.append(pkt[:2].hex())
        op = pkt[1]
        self.inbox.append(bytes([0xEC, op & 0x7F]) + b"\0" * 63)
        if pkt[:3] == b"\xec\x73\x01":
            self.inbox.append(b"\xee\x13\x00\x01" + b"\0" * 61)
        if pkt[:3] == b"\xec\x73\xff":
            self.inbox.append(b"\xee\x13\x00\xff" + b"\0" * 61)

    def bulk(self, data):
        self.log.append(f"bulk{len(data)}")
        if self.ack_chunks:
            self.inbox.append(b"\xee\x14\x00\x00\x10" + b"\0" * 60)
        return len(data)

    def read(self, _timeout_ms):
        return self.inbox.pop(0) if self.inbox else b""


def _lcd(dev):
    lcd = RyujinLCD()
    lcd.hid_write = dev.write
    lcd.hid_read = dev.read
    lcd.bulk_write = lambda d, timeout_ms=5000: dev.bulk(d)
    return lcd


def test_ryujin_upload_waits_for_every_ack():
    dev = FakeDevice()
    jpeg = bytes([0xFF, 0xD8, 0xFF]) + b"\0" * 9000        # 3 chunks
    _lcd(dev).upload_image(jpeg, RyujinSettings())
    assert dev.log == ["ec71", "ecf1", "ec72", "ec73", "ec7f",
                       "bulk4096", "bulk4096", "bulk4096",
                       "ec73", "ec5c", "ec5d", "ec51"]


def test_missing_chunk_ack_stops_the_upload():
    dev = FakeDevice(ack_chunks=False)
    with pytest.raises(ec.TransferError):
        ec.Channel(dev.write, dev.read).bulk_upload(dev.bulk, b"x" * 9000, timeout=0.05)
    assert dev.log == ["bulk4096"]


def test_event_before_reply_is_kept():
    """Live 2026-10-25: ee 13 00 01 arrived before the ec 73 reply and the
    old code dropped it while waiting, then timed out."""
    dev = FakeDevice()
    real_write = dev.write

    def write(pkt):
        real_write(pkt)
        if pkt[:3] == b"\xec\x73\x01":
            dev.inbox.insert(-2, dev.inbox.pop())    # event first, reply second
    dev.write = write
    jpeg = bytes([0xFF, 0xD8, 0xFF]) + b"\0" * 100
    _lcd(dev).upload_image(jpeg, RyujinSettings())
    assert dev.log[-3:] == ["ec5c", "ec5d", "ec51"]


def test_set_fans_bytes_match_full_speed_capture():
    dev = FakeDevice()
    sent = []
    lcd = _lcd(dev)
    lcd.hid_write = lambda p: (sent.append(bytes(p)), dev.write(p))
    lcd.set_fans(100, 100, 100)
    assert [p[:5].hex() for p in sent] == ["ec1a006464", "ec210000ff"]
