"""Unit tests for polylux.drivers.anime_matrix.usb_direct.

Pure-logic tests only — no live USB. Live integration is exercised manually
via scratch/anime_proper_seq.py and the upcoming pixel-mapping derivation
script.
"""
import pytest

from polylux.drivers.anime_matrix.usb_direct import (
    AniMeMatrix,
    AniMeMatrixError,
    FRAME_SIZE,
    HID_PREP,
    PID,
    VID,
)


def test_constants():
    assert VID == 0x0B05
    assert PID == 0x1A21
    assert FRAME_SIZE == 768
    assert len(HID_PREP) == 65
    assert HID_PREP[:5] == bytes([0xEC, 0x7F, 0x04, 0x00, 0x03])
    assert all(b == 0 for b in HID_PREP[5:])


def _make_offline_matrix() -> AniMeMatrix:
    """Build an instance without touching USB — frame helpers don't need it."""
    return AniMeMatrix(_usb_dev=None, _hid_dev=None, _frame=bytearray(FRAME_SIZE))


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


def test_send_frame_no_handle():
    m = _make_offline_matrix()
    with pytest.raises(AniMeMatrixError, match="not open"):
        m.send_frame(b"\x00" * FRAME_SIZE)


def test_close_idempotent():
    m = _make_offline_matrix()
    m.close()  # no-op
    m.close()  # no-op again
