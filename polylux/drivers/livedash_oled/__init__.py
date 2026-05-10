"""LiveDash OLED driver — drives the ROG Maximus motherboard OLED.

The OLED is on the same chip as the AniMe Matrix (USB VID 0B05 PID 1A21),
sharing iface 0 (vendor bulk) + iface 1 (HID). The matrix and OLED are
distinguished by the HID command prefix byte 1:

  byte 1 = 0x7F   ->  AniMe Matrix frame prep + bulk pixel data
  byte 1 = 0x53   ->  OLED set text (Hardware Monitor / Custom Banner style)
  byte 1 = 0x72/0x51/0x73/0x7F mode-2  ->  OLED Custom Image upload sequence

Usage::

    from polylux.drivers.livedash_oled import LiveDashOLED

    with LiveDashOLED.open() as oled:
        oled.set_text("CPU Temp.", "32.0 C")
        with open("anim.gif", "rb") as f:
            oled.upload_image(f.read())
"""
from .driver import (  # noqa: F401
    LiveDashOLED,
    LiveDashOLEDError,
    build_text_packet,
    build_image_prep_packets,
)
