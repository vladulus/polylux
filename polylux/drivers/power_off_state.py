"""Keep the motherboard dark while the PC is off (S5 / sleep).

Both writes are what AC 6.5.7 sends for "Shutdown Effect → Off" and
AniMe Matrix "When system is in sleep, hibernate or soft off states → OFF"
(docs/PROJECT_STATE.md §9.4.0). They are stored by the controllers, so
one write per Polylux start is enough. Verified by a power-off 2026-10-25
when AC sent them.

The Ryujin and OLED equivalents live in their ec 5c settings blocks
(RyujinSettings.standby, build_settings_packet(on_when_off=...)).
"""
from __future__ import annotations

import logging

log = logging.getLogger(__name__)

AURA_VID, AURA_PID, AURA_INTERFACE = 0x0B05, 0x18F3, 2
HID_PACKET_SIZE = 65


def _pad(head) -> bytes:
    return bytes(head) + b"\x00" * (HID_PACKET_SIZE - len(head))


# ec 36 <ch> <mask> <slot 01 = shutdown> + black; ec 35 static on slot 01; ec 3f 55 save
AURA_SHUTDOWN_OFF = (
    _pad([0xEC, 0x36, 0x00, 0xFF, 0x01]),
    _pad([0xEC, 0x35, 0x00, 0x00, 0x01, 0x01]),
    _pad([0xEC, 0x3F, 0x55]),
)

MATRIX_S5_OFF = (
    _pad([0xEC, 0x42, 0x02, 0x00]),
    _pad([0xEC, 0x44, 0x01, 0x02]),
)


def aura_shutdown_off() -> None:
    """Shutdown effect = black on the motherboard Aura controller (18F3)."""
    import hid

    paths = [d["path"] for d in hid.enumerate(AURA_VID, AURA_PID)
             if d.get("interface_number") == AURA_INTERFACE]
    if not paths:
        raise RuntimeError("Aura controller 0B05:18F3 interface 2 not found")
    dev = hid.device()
    dev.open_path(paths[0])
    try:
        for pkt in AURA_SHUTDOWN_OFF:
            if dev.write(pkt) < 0:
                raise RuntimeError(f"Aura write failed: {dev.error()}")
    finally:
        dev.close()


def matrix_s5_off(chip) -> None:
    """Matrix dark in sleep / soft-off, on an open Chip1A21."""
    for pkt in MATRIX_S5_OFF:
        chip.hid_write(pkt)


def apply(chip) -> None:
    """Best effort: each failure is logged, none stops Polylux."""
    try:
        aura_shutdown_off()
        log.info("power-off state: Aura shutdown effect set to off")
    except Exception as ex:  # noqa: BLE001
        log.warning("power-off state: Aura write failed: %s", ex)
    if chip is not None:
        try:
            matrix_s5_off(chip)
            log.info("power-off state: matrix S5 set to off")
        except Exception as ex:  # noqa: BLE001
            log.warning("power-off state: matrix write failed: %s", ex)
