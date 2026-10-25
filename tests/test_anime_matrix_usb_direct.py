"""Unit tests for polylux.drivers.anime_matrix.usb_direct.

Pure-logic tests only — no live USB. Live integration is exercised manually
via scratch/anime_proper_seq.py and the upcoming pixel-mapping derivation
script.
"""
import pytest

from polylux.drivers.anime_matrix.usb_direct import (
    AniMeMatrix,
    FRAME_SIZE,
    _HID_PREP_7F,
)
from polylux.drivers.chip_1a21 import PID, VID


class _FakeChip:
    """Records what the matrix sends instead of touching USB."""

    def __init__(self):
        import threading
        self.hid, self.bulk, self.inits = [], [], 0
        self.lock = threading.RLock()

    def init_for_matrix(self):
        self.inits += 1

    def hid_write(self, pkt):
        self.hid.append(bytes(pkt))

    def bulk_write(self, data):
        self.bulk.append(bytes(data))
        return len(data)


def test_constants():
    assert VID == 0x0B05
    assert PID == 0x1A21
    assert FRAME_SIZE == 768
    assert len(_HID_PREP_7F) == 65
    assert _HID_PREP_7F[:5] == bytes([0xEC, 0x7F, 0x04, 0x00, 0x03])
    assert all(b == 0 for b in _HID_PREP_7F[5:])


def _make_offline_matrix() -> AniMeMatrix:
    """Build an instance without touching USB — frame helpers don't need it."""
    return AniMeMatrix(chip=_FakeChip())


def test_clear_zeros_frame():
    m = _make_offline_matrix()
    m.fill(0xFF)
    m.clear()
    assert m.frame == bytes(FRAME_SIZE)


def test_fill_sets_all_bytes():
    m = _make_offline_matrix()
    m.fill(0x42)
    assert m.frame == bytes([0x42] * FRAME_SIZE)


def test_set_byte():
    m = _make_offline_matrix()
    m.set_byte(100, 0xFF)
    assert m.get_byte(100) == 0xFF
    assert m.get_byte(99) == 0
    assert m.get_byte(101) == 0


def test_set_byte_out_of_range():
    m = _make_offline_matrix()
    with pytest.raises(IndexError):
        m.set_byte(FRAME_SIZE, 0xFF)
    with pytest.raises(IndexError):
        m.set_byte(-1, 0xFF)


def test_set_byte_invalid_value():
    m = _make_offline_matrix()
    with pytest.raises(ValueError):
        m.set_byte(0, 256)
    with pytest.raises(ValueError):
        m.set_byte(0, -1)


def test_fill_invalid_value():
    m = _make_offline_matrix()
    with pytest.raises(ValueError):
        m.fill(256)


def test_send_frame_wrong_size_rejected():
    m = _make_offline_matrix()
    with pytest.raises(ValueError, match="must be 768"):
        m.send_frame(b"\x00" * 100)


def test_send_frame_sequence():
    m = _make_offline_matrix()
    m.send_frame(b"\x01" * FRAME_SIZE)
    assert m.chip.inits == 1
    assert [p[:2].hex() for p in m.chip.hid] == ["ecc1", "ec7f"]
    assert m.chip.bulk == [b"\x01" * FRAME_SIZE]


def test_close_idempotent():
    m = _make_offline_matrix()
    m.close()  # no-op
    m.close()  # no-op again
