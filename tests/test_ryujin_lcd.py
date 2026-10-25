"""Ryujin packets must match AC 6.5.7 (USBPcap 2026-10-25), images must
come out in the format the LCD took from AC."""
import io

from PIL import Image

from polylux.drivers.ryujin_lcd.driver import (
    RyujinSettings,
    build_animation_packets,
    build_upload_prep_packets,
)
from polylux.drivers.ryujin_lcd.render import ryujin_image
from polylux.drivers.livedash_oled.render import MAX_BYTES, oled_gif


def test_settings_match_captured_blocks():
    # brightness 100, standby on, 2nd animation, portrait (ryujin_steps 01:23:06)
    assert RyujinSettings(animation=1, standby=True).packet()[:16].hex() == \
        "ec5c010064010064140001006414" "0001"
    # standby off zeroes b12/b13 (01:22:47, s5_retry)
    assert RyujinSettings(animation=1).packet()[12:14] == b"\x00\x00"
    # landscape (01:23:28) and display off (01:23:50)
    p = RyujinSettings(portrait=False, display_on=False, animation=1).packet()
    assert p[5:9].hex() == "00016400"


def test_upload_prep_matches_capture():
    jpeg = bytes([0xFF, 0xD8, 0xFF]) + b"\0" * 11840          # 11843 bytes, as captured
    pkts = [p[:6].hex() for p, _ in build_upload_prep_packets(jpeg)]
    assert pkts == ["ec7101010000", "ecf100000000", "ec7201010100",
                    "ec7301000000", "ec7f02432e00"]
    assert build_upload_prep_packets(b"GIF89a" + b"\0" * 10)[2][0][:5].hex() == "ec72010201"


def test_animation_index():
    assert [p[:8].hex() for p in build_animation_packets(2)] == \
        ["ec5d000114000205", "ec51140002000000"]


def _gif(path, size, n):
    frames = [Image.new("RGB", size, (i * 40, 80, 200)) for i in range(n)]
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=50, loop=0)


def test_ryujin_still_is_320x240_jpeg(tmp_path):
    src = tmp_path / "a.png"
    Image.new("RGB", (1000, 500), "red").save(src)
    data = ryujin_image(src)
    assert data[:3] == b"\xff\xd8\xff"
    assert Image.open(io.BytesIO(data)).size == (320, 240)


def test_ryujin_animation_stays_gif(tmp_path):
    src = tmp_path / "a.gif"
    _gif(src, (498, 498), 5)
    im = Image.open(io.BytesIO(ryujin_image(src, stretch=True)))
    assert (im.format, im.size, im.n_frames) == ("GIF", (320, 240), 5)


def test_oled_gif_is_256x64_and_fits(tmp_path):
    src = tmp_path / "a.gif"
    _gif(src, (400, 300), 6)
    data = oled_gif(src)
    im = Image.open(io.BytesIO(data))
    assert data[:6] == b"GIF89a" and im.size == (256, 64) and len(data) <= MAX_BYTES
