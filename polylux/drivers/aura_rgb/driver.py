"""Thin wrapper around the openrgb-python SDK client.

Connects to a running OpenRGB SDK Server (default localhost:6742). The
user is responsible for installing and starting OpenRGB separately; we
detect at connect time and raise a clear error if it's not reachable.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Tuple


DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 6742


class AuraRGBError(RuntimeError):
    """Raised when the OpenRGB SDK is unavailable or rejects a command."""


RGB = Tuple[int, int, int]


@dataclass
class AuraRGB:
    """Thin wrapper around openrgb-python's client.

    Holds a connection to the OpenRGB SDK Server. Use `AuraRGB.connect()`
    to create one. Caller is responsible for `close()` (or use as a
    context manager).
    """
    _client: object = None    # openrgb.OpenRGBClient

    @classmethod
    def connect(cls, host: str = DEFAULT_HOST, port: int = DEFAULT_PORT) -> "AuraRGB":
        """Connect to an OpenRGB SDK Server. Default 127.0.0.1:6742.

        Raises AuraRGBError if the server isn't reachable. The user must
        have OpenRGB installed and running (with "Enable SDK Server" in
        OpenRGB settings, or `OpenRGB.exe --server` on the CLI).
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

        return cls(_client=client)

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
        """List of detected RGB devices (OpenRGB's `Device` objects)."""
        if self._client is None:
            raise AuraRGBError("not connected")
        return list(self._client.devices)

    def set_all(self, color: RGB) -> None:
        """Set every detected RGB device to the same color."""
        if self._client is None:
            raise AuraRGBError("not connected")
        from openrgb.utils import RGBColor
        rc = RGBColor(*color)
        for dev in self._client.devices:
            try:
                dev.set_color(rc)
            except Exception as ex:
                # Some devices may not accept solid-color writes; skip.
                continue

    def set_device(self, device_index: int, color: RGB) -> None:
        """Set one detected device by index to the given color."""
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
        """Set every device to black (effectively off)."""
        self.set_all((0, 0, 0))
