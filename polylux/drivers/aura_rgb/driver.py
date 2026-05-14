"""Thin wrapper around the openrgb-python SDK client.

Connects to a running OpenRGB SDK Server (default localhost:6742). The
user is responsible for installing and starting OpenRGB separately; we
detect at connect time and raise a clear error if it's not reachable.

By default, Polylux only controls devices of type MOTHERBOARD — not
keyboards / mice / headsets / other peripherals OpenRGB detects.
Users can opt in to other types via the `types` filter on connect().
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional, Tuple


DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 6742

# Default-safe device types — Polylux only touches the motherboard.
# Users opt in to others (keyboard, mouse, etc.) explicitly.
DEFAULT_TYPES = ("MOTHERBOARD",)
ALL_TYPES = (
    "MOTHERBOARD", "DRAM", "GPU", "COOLER", "LEDSTRIP", "KEYBOARD",
    "MOUSE", "MOUSEMAT", "HEADSET", "HEADSET_STAND", "GAMEPAD",
    "LIGHT", "SPEAKER", "VIRTUAL", "STORAGE", "CASE", "MICROPHONE",
    "ACCESSORY", "KEYPAD", "LAPTOP", "MONITOR", "CHAIR", "UNKNOWN",
)


class AuraRGBError(RuntimeError):
    """Raised when the OpenRGB SDK is unavailable or rejects a command."""


RGB = Tuple[int, int, int]


@dataclass
class AuraRGB:
    """Thin wrapper around openrgb-python's client.

    Holds a connection to the OpenRGB SDK Server. Use `AuraRGB.connect()`
    to create one. Caller is responsible for `close()` (or use as a
    context manager).

    A `types` filter restricts which OpenRGB device types Polylux is
    willing to control. Default: MOTHERBOARD only — leaves keyboards,
    mice, headsets, etc. untouched so we don't override the user's other
    RGB software (Logitech G-Hub, Razer Synapse, etc).
    """
    _client: object = None    # openrgb.OpenRGBClient
    _types: tuple[str, ...] = DEFAULT_TYPES

    @classmethod
    def connect(cls, host: str = DEFAULT_HOST, port: int = DEFAULT_PORT,
                types: tuple[str, ...] = DEFAULT_TYPES) -> "AuraRGB":
        """Connect to an OpenRGB SDK Server. Default 127.0.0.1:6742.

        Args:
          types: tuple of OpenRGB device type names to control. Default
                 ("MOTHERBOARD",) — keyboards/mice/etc are filtered out.
                 Use ALL_TYPES (or a custom tuple) to opt in to others.

        Raises AuraRGBError if the server isn't reachable.
        """
        try:
            from openrgb import OpenRGBClient
        except ImportError as ex:
            raise AuraRGBError(
                f"openrgb-python not installed: {ex}. "
                f"Run: pip install openrgb-python"
            ) from ex

        try:
            client = OpenRGBClient(address=host, port=port, name="Polylux")
        except Exception as ex:
            raise AuraRGBError(
                f"could not reach OpenRGB SDK Server at {host}:{port}: {ex}. "
                f"Install OpenRGB from https://openrgb.org and enable the "
                f"SDK server in Settings, or launch with `--server`."
            ) from ex

        return cls(_client=client, _types=tuple(types))

    def close(self) -> None:
        if self._client is not None:
            try: self._client.disconnect()
            except Exception: pass
            self._client = None

    def __enter__(self) -> "AuraRGB":
        return self

    def __exit__(self, *_):
        self.close()

    # --- public API ---

    @property
    def devices(self) -> list:
        """All detected devices (no type filter applied)."""
        if self._client is None:
            raise AuraRGBError("not connected")
        return list(self._client.devices)

    @property
    def controlled_devices(self) -> list:
        """Devices matching the current type filter — these are the
        ones set_all() / turn_off() will actually touch."""
        if self._client is None:
            raise AuraRGBError("not connected")
        return [d for d in self._client.devices if d.type.name in self._types]

    def set_all(self, color: RGB) -> None:
        """Set every controlled device (per `types` filter) to one color.

        Devices outside the filter are left untouched.
        """
        if self._client is None:
            raise AuraRGBError("not connected")
        from openrgb.utils import RGBColor
        rc = RGBColor(*color)
        for dev in self.controlled_devices:
            try:
                dev.set_color(rc)
            except Exception:
                continue

    def set_device(self, device_index: int, color: RGB) -> None:
        """Set one detected device by index to the given color.

        NOTE: index is into `self.devices` (all detected), not the
        filtered list. This is for advanced use — UI usually drives
        set_all() with the type filter doing the right thing.
        """
        if self._client is None:
            raise AuraRGBError("not connected")
        from openrgb.utils import RGBColor
        devs = self._client.devices
        if not 0 <= device_index < len(devs):
            raise IndexError(
                f"device_index {device_index} out of range "
                f"(0..{len(devs) - 1})"
            )
        devs[device_index].set_color(RGBColor(*color))

    def turn_off(self) -> None:
        """Set every controlled device to black (effectively off)."""
        self.set_all((0, 0, 0))

    def available_modes(self) -> list[str]:
        """OpenRGB modes supported by every controlled device.

        Returns the intersection — if Vlad has a MB (9 modes) and a keyboard
        (7 modes), the intersection (~5 modes) is what UI exposes so picking
        one always works for all controlled devices. Ordered to match the
        primary device's mode order so 'Direct' / 'Static' / 'Off' come
        first as they do natively.
        """
        if self._client is None:
            return []
        devs = self.controlled_devices
        if not devs:
            return []
        primary = [m.name for m in devs[0].modes]
        if len(devs) == 1:
            return primary
        common = set(primary)
        for d in devs[1:]:
            common &= {m.name for m in d.modes}
        return [m for m in primary if m in common]

    def set_mode(self, mode_name: str, color: Optional[RGB] = None) -> None:
        """Switch every controlled device to ``mode_name`` and, if the mode
        accepts a per-mode colour, apply ``color`` afterwards.

        Modes like 'Spectrum Cycle' / 'Rainbow' ignore the colour (cycle
        through the wheel themselves); 'Static' / 'Direct' / 'Breathing'
        / 'Flashing' all use it. We always try ``set_color`` — devices
        that don't care no-op.
        """
        if self._client is None:
            raise AuraRGBError("not connected")
        from openrgb.utils import RGBColor
        target_name = mode_name.lower()
        rc = RGBColor(*color) if color is not None else None
        for dev in self.controlled_devices:
            try:
                # set_mode accepts a name or an index — most openrgb-python
                # builds resolve name in modes[]. Fall back to indexed lookup.
                try:
                    dev.set_mode(mode_name)
                except Exception:
                    for i, m in enumerate(dev.modes):
                        if m.name.lower() == target_name:
                            dev.set_mode(i)
                            break
                if rc is not None:
                    try:
                        dev.set_color(rc)
                    except Exception:
                        pass
            except Exception:
                continue
