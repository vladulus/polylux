"""OLED packets must match what AC 6.5.7 sends (USBPcap captures, 2026-10-25)."""
from polylux.drivers.livedash_oled import (
    build_image_commit_packets,
    build_image_prep_packets,
    build_settings_packet,
)


def test_size_is_24_bit_little_endian():
    # 65603-byte preset GIF: AC sent ec 7f 02 43 00 01
    assert build_image_prep_packets(65603)[3][:6].hex() == "ec7f02430001"
    assert build_image_prep_packets(0x727A)[3][:6].hex() == "ec7f027a7200"


def test_settings_default_keeps_oled_dark_when_pc_off():
    assert build_settings_packet()[:9].hex() == "ec5c01000000000010"
    assert build_settings_packet(on_when_off=True, rotate_180=True)[:9].hex() == "ec5c01010000000110"


def test_commit_sequence_matches_ac():
    heads = [p[:5].hex() for p in build_image_commit_packets()]
    assert heads == ["ec73ff0000", "ec51100101", "ecdc000000", "ec5c010000"]
    assert all(len(p) == 65 for p in build_image_prep_packets(1) + build_image_commit_packets())
