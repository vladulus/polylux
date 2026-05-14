"""LibreHardwareMonitor (LHM) sensor bridge — HTTP/JSON variant.

LHM 0.9.5+ removed the WMI provider in favor of a built-in Remote Web
Server that serves the whole sensor tree as JSON at::

    http://127.0.0.1:8085/data.json

This module fetches that JSON, walks the tree, and exposes the fans +
temperatures Polylux needs. If LHM isn't running, the web server isn't
enabled, or the port is firewalled, ``health()`` reports the problem
and the data accessors return empty defaults — never raises.

Enable in LHM: Options → Remote Web Server → Run (default port 8085).
"""
from __future__ import annotations

import json
import logging
import re
import urllib.request
from dataclasses import dataclass
from typing import Any, Optional


log = logging.getLogger(__name__)


DEFAULT_URL = "http://127.0.0.1:8085/data.json"
_FAN_PATH = "/fan/"
_TEMP_PATH = "/temperature/"


@dataclass
class Fan:
    name: str
    rpm: int


# Hand-rolled fake JSON tree so UI dev / tests can proceed without LHM running.
FAKE_TREE_FOR_TEST = {
    "id": 0,
    "Text": "Sensor",
    "Children": [
        {
            "id": 1,
            "Text": "TEST-PC",
            "Children": [
                {
                    "id": 2,
                    "Text": "ASUS ROG MAXIMUS Z690 EXTREME",
                    "Children": [
                        {
                            "id": 3,
                            "Text": "Temperatures",
                            "Children": [
                                {"id": 4, "Text": "CPU Package", "Value": "23.0 °C",
                                 "Min": "21.0 °C", "Max": "45.0 °C",
                                 "SensorId": "/intelcpu/0/temperature/0"},
                                {"id": 5, "Text": "GPU Hot Spot", "Value": "53.0 °C",
                                 "SensorId": "/nvidiagpu/0/temperature/1"},
                                {"id": 6, "Text": "Motherboard", "Value": "31.0 °C",
                                 "SensorId": "/lpc/nct6798d/temperature/0"},
                            ],
                        },
                        {
                            "id": 7,
                            "Text": "Fans",
                            "Children": [
                                {"id": 8, "Text": "CPU Fan", "Value": "1240 RPM",
                                 "SensorId": "/lpc/nct6798d/fan/1"},
                                {"id": 9, "Text": "Chassis #1", "Value": "880 RPM",
                                 "SensorId": "/lpc/nct6798d/fan/2"},
                                {"id": 10, "Text": "Chassis #2", "Value": "920 RPM",
                                 "SensorId": "/lpc/nct6798d/fan/3"},
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}


class LHMSensors:
    """HTTP/JSON wrapper around LHM's Remote Web Server.

    Pass ``_injected_tree`` to feed a static JSON tree in tests; in
    production the constructor stores the URL and fetches on each call.
    All public methods are safe to call without LHM running — they
    return empty defaults and surface the problem via ``health()``.
    """

    def __init__(
        self,
        url: str = DEFAULT_URL,
        _injected_tree: Optional[dict] = None,
        timeout: float = 1.0,
    ) -> None:
        self._url = url
        self._injected = _injected_tree
        self._timeout = timeout
        self._last_error: Optional[str] = None

    def _fetch(self) -> Optional[dict]:
        if self._injected is not None:
            return self._injected
        try:
            with urllib.request.urlopen(self._url, timeout=self._timeout) as resp:
                data = resp.read().decode("utf-8")
            return json.loads(data)
        except Exception as ex:
            self._last_error = str(ex)
            return None

    def health(self) -> tuple[bool, Optional[str]]:
        data = self._fetch()
        if data is None:
            return (False, self._last_error or "LHM web server not reachable")
        return (True, None)

    def _walk(self, node: Any, out_fans: list, out_temps: dict) -> None:
        if not isinstance(node, dict):
            return
        sid = node.get("SensorId") or ""
        val = node.get("Value") or ""
        name = node.get("Text") or ""
        if isinstance(sid, str) and isinstance(val, str):
            if _FAN_PATH in sid:
                m = re.match(r"\s*(\d+)", val)
                if m:
                    out_fans.append(Fan(name=name, rpm=int(m.group(1))))
            elif _TEMP_PATH in sid:
                m = re.match(r"\s*([\-\d.]+)", val)
                if m:
                    try:
                        out_temps[name.lower()] = float(m.group(1))
                    except ValueError:
                        pass
        for child in node.get("Children", []) or []:
            self._walk(child, out_fans, out_temps)

    def fans(self) -> list[Fan]:
        data = self._fetch()
        if data is None:
            return []
        fans: list[Fan] = []
        self._walk(data, fans, {})
        return fans

    def temps(self) -> dict[str, float]:
        data = self._fetch()
        if data is None:
            return {}
        temps: dict[str, float] = {}
        self._walk(data, [], temps)
        return temps

    @property
    def last_error(self) -> Optional[str]:
        return self._last_error


# Backwards-compat alias for tests that imported the WMI-era fixture name.
FAKE_SENSORS_FOR_TEST = FAKE_TREE_FOR_TEST
