"""Aura RGB driver — drives motherboard / RAM / GPU / AIO RGB lighting.

Polylux delegates RGB control to OpenRGB (https://openrgb.org), an MIT-
licensed open-source RGB lighting controller that already supports the
ROG Maximus Z690 Extreme's Aura LED controller (PID 0x18F3) plus the
vast majority of RAM, GPU, fan, and AIO RGB hardware on the market.

We attempted to drive the Aura controller directly via the same approach
as the matrix/OLED chip, but the Aura's HID interface is bound to
Windows' HID stack and rejects raw libusb ctrl_transfer (STALL/Pipe
error). Microsoft Dynamic Lighting also doesn't recognize Aura because
ASUS uses a proprietary vendor-specific HID usage page (0xFF72) instead
of the standard LampArray usage page (0x59). OpenRGB has solved all of
this; we don't reinvent the wheel.

# How it works

Polylux talks to an OpenRGB SDK Server (port 6742 by default) over
TCP. The server can either be:
  - the user's own OpenRGB installation (recommended), or
  - a binary bundled with Polylux (planned for v0.3+).

If no OpenRGB server is reachable, Polylux logs a warning at startup
and disables RGB control. Matrix, OLED, and LCD continue to work
unaffected.

# Usage

    from polylux.drivers.aura_rgb import AuraRGB

    with AuraRGB.connect() as rgb:
        rgb.set_all((0xFF, 0, 0))         # everything red
        rgb.set_device(0, (0, 0xFF, 0))   # first detected device green
"""
from .driver import AuraRGB, AuraRGBError  # noqa: F401
