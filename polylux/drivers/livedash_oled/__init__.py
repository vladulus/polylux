"""LiveDash OLED driver — drives the ROG Maximus motherboard OLED.

The OLED is on the same chip as the AniMe Matrix (USB VID 0B05 PID 1A21),
sharing iface 0 (vendor bulk) + iface 1 (HID). The matrix and OLED are
distinguished by the HID command prefix:

  Matrix (AniMeMatrix.send_frame):
    [0xEC, 0x7F, 0x04, 0x00, 0x03, ...]   prep
    + 768B bulk OUT pixel data

  OLED text (LiveDashOLED.set_text):
    [0xEC, 0x53, 0x00, <label-18B>, <value-44B>]
    No bulk follow-up.

Usage::

    from polylux.drivers.livedash_oled import LiveDashOLED

    with LiveDashOLED.open() as oled:
        oled.set_text("CPU Temp.", "32.0 \\u2103")
        oled.set_text("POLYLUX", "SHIPS")
"""
from .driver import LiveDashOLED, build_text_packet  # noqa: F401
