"""ROG Ryujin II 360 AIO LCD driver.

Drives the 320x240 color LCD on the Ryujin II 360 AIO pump (USB VID 0x0B05
PID 0x1988). USB layout is identical to the motherboard chip 1A21:
  iface 0 vendor: BULK OUT ep 0x01 (max 512B) + BULK IN ep 0x81
  iface 1 HID:    INT OUT ep 0x02 + INT IN ep 0x82

Image upload protocol decoded from matrix_p1.pcap (358 bulk OUT chunks
each 4096B, all GIF89a 320x240). Detailed wire format:
  Each upload = one or more 4096B bulk OUT chunks containing a GIF89a
  file split across chunks (first chunk starts with GIF89a magic).

Usage::

    from polylux.drivers.ryujin_lcd import RyujinLCD
    with RyujinLCD.open() as lcd:
        with open("my_anim.gif", "rb") as f:
            lcd.upload_image(f.read())
"""
from .driver import RyujinLCD, RyujinLCDError  # noqa: F401
