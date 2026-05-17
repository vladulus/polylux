"""Polylux → PolyluxSensorDaemon fan-control client + curve interpolator.

The daemon owns the LHM ``IControl`` API; this module just translates
the user's per-fan ``FanConfig`` into HTTP POSTs the daemon understands.

  - mode ``auto``  → POST {"mode":"default"}     (release to BIOS)
  - mode ``off``   → POST {"mode":"software","value":0}
  - mode ``silent``→ POST {"mode":"software","value":30}
  - mode ``medium``→ POST {"mode":"software","value":60}
  - mode ``full``  → POST {"mode":"software","value":100}
  - mode ``curve`` → POST {"mode":"software","value":<linear-interp(temp)>}

``apply_once()`` is meant to be called on a periodic timer; the chip
remembers the last PWM write, so even if the daemon is slow or the
network blips, fan state survives until the next tick.
"""
from __future__ import annotations

import json
import logging
import urllib.parse
import urllib.request
from typing import Iterable, Optional

from polylux.config import FanConfig


log = logging.getLogger(__name__)


DEFAULT_DAEMON_URL = "http://127.0.0.1:8085"


def interpolate_curve(curve: Iterable[tuple[float, float]], temp_c: float) -> float:
    """Linear interpolation across (temp, duty) anchor points.

    Below the first anchor → first anchor's duty; above the last →
    last anchor's duty. Anchors are sorted by temp here so the user is
    free to enter them in any order.
    """
    pts = sorted(curve, key=lambda p: p[0])
    if not pts:
        return 0.0
    if temp_c <= pts[0][0]:
        return float(pts[0][1])
    if temp_c >= pts[-1][0]:
        return float(pts[-1][1])
    for i in range(len(pts) - 1):
        t0, d0 = pts[i]
        t1, d1 = pts[i + 1]
        if t0 <= temp_c <= t1:
            if t1 == t0:
                return float(d0)
            frac = (temp_c - t0) / (t1 - t0)
            return float(d0 + (d1 - d0) * frac)
    return float(pts[-1][1])


def resolve_duty(fan: FanConfig, temps: dict[str, float]) -> Optional[float]:
    """Translate the fan's mode + current temperature reading into a PWM%.

    Returns ``None`` when the runner should NOT send a software override
    (i.e. mode='auto') — the chip stays under BIOS control.
    """
    mode = fan.mode
    if mode == "auto":
        return None
    if mode == "curve":
        t = temps.get(fan.temp_source.lower())
        if t is None:
            log.warning("fan %s: temp source %r not available, falling back to silent",
                        fan.name or fan.sensor_id, fan.temp_source)
            return FanConfig.PRESET_DUTY["silent"]
        return interpolate_curve(fan.curve, t)
    preset = FanConfig.PRESET_DUTY.get(mode)
    if preset is None:
        log.warning("fan %s: unknown mode %r, skipping", fan.name or fan.sensor_id, mode)
        return None
    return preset


def _post(daemon_url: str, sensor_id: str, payload: dict, timeout: float) -> bool:
    encoded = urllib.parse.quote(sensor_id, safe="")
    url = f"{daemon_url.rstrip('/')}/control/fan/{encoded}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status == 200
    except Exception as ex:
        log.warning("fan POST %s failed: %s", url, ex)
        return False


def apply_fan(fan: FanConfig, temps: dict[str, float],
              daemon_url: str = DEFAULT_DAEMON_URL,
              timeout: float = 2.0) -> bool:
    """Resolve the fan's target duty and POST it to the daemon."""
    duty = resolve_duty(fan, temps)
    if duty is None:
        return _post(daemon_url, fan.sensor_id, {"mode": "default"}, timeout)
    return _post(daemon_url, fan.sensor_id,
                 {"mode": "software", "value": float(duty)}, timeout)


def apply_all(fans: Iterable[FanConfig], temps: dict[str, float],
              daemon_url: str = DEFAULT_DAEMON_URL,
              timeout: float = 2.0) -> dict[str, bool]:
    """Apply every configured fan in sequence. Returns per-fan ok/fail."""
    out: dict[str, bool] = {}
    for fan in fans:
        out[fan.sensor_id] = apply_fan(fan, temps, daemon_url=daemon_url, timeout=timeout)
    return out
