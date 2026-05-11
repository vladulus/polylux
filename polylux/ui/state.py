"""Shared service state — single source of truth for what each device is doing.

Drivers READ this state every iteration to know what to render. UI WRITES
to it when the user changes scene/color/etc. Mutation is thread-safe via
a single RLock.

Persistence: changes are persisted to polylux.yaml on a debounce timer
(2 seconds after last change) so the user's configuration survives
restart without writing on every keystroke.
"""
from __future__ import annotations

import logging
import threading
import time
from dataclasses import asdict
from pathlib import Path
from typing import Any, Callable, Optional

from polylux.config import PolyluxConfig, load as load_config


log = logging.getLogger(__name__)


class ServiceState:
    """Thread-safe wrapper around PolyluxConfig + per-device runtime status.

    The drivers read config snapshots via `snapshot()`. The UI mutates
    via `update_device(...)` which takes the lock, applies the patch,
    bumps a revision counter, and schedules a debounced YAML write.

    Runtime status (per device): last_update_unix, last_error.
    """

    def __init__(self, cfg: PolyluxConfig, yaml_path: Path,
                 debounce_seconds: float = 2.0):
        self._cfg = cfg
        self._yaml_path = yaml_path
        self._debounce = debounce_seconds
        self._lock = threading.RLock()
        self._revision = 0
        self._status: dict[str, dict] = {
            "matrix": {"last_update": 0.0, "last_error": None},
            "oled": {"last_update": 0.0, "last_error": None},
            "ryujin_lcd": {"last_update": 0.0, "last_error": None},
            "aura_rgb": {"last_update": 0.0, "last_error": None},
        }
        self._save_timer: Optional[threading.Timer] = None
        self._listeners: list[Callable[[], None]] = []

    # --- read API ---

    def snapshot(self) -> PolyluxConfig:
        """Return current config. Read-only — callers should not mutate."""
        with self._lock:
            return self._cfg

    @property
    def revision(self) -> int:
        with self._lock:
            return self._revision

    def status(self) -> dict:
        """Return per-device runtime status dict (copies)."""
        with self._lock:
            return {k: dict(v) for k, v in self._status.items()}

    def to_dict(self) -> dict:
        """Full state for the UI (config + status)."""
        with self._lock:
            return {
                "revision": self._revision,
                "config": {
                    "service": asdict(self._cfg.service),
                    "matrix": asdict(self._cfg.matrix),
                    "oled": asdict(self._cfg.oled),
                    "ryujin_lcd": asdict(self._cfg.ryujin_lcd),
                    "aura_rgb": asdict(self._cfg.aura_rgb),
                },
                "status": {k: dict(v) for k, v in self._status.items()},
            }

    # --- write API ---

    def update_device(self, device: str, patch: dict[str, Any]) -> None:
        """Patch one device's config fields. Validates + schedules save."""
        with self._lock:
            obj = getattr(self._cfg, device, None)
            if obj is None:
                raise ValueError(f"unknown device: {device}")
            for k, v in patch.items():
                if not hasattr(obj, k):
                    raise ValueError(f"unknown field {device}.{k}")
                # Coerce color lists/tuples
                if k == "color" and isinstance(v, list):
                    v = tuple(v)
                setattr(obj, k, v)
            self._cfg.validate()
            self._revision += 1
            self._schedule_save()
        for fn in self._listeners:
            try:
                fn()
            except Exception:
                log.exception("listener failed")

    def mark_update(self, device: str, error: Optional[str] = None) -> None:
        """Driver calls this after each render cycle so UI can show liveness."""
        with self._lock:
            if device in self._status:
                self._status[device]["last_update"] = time.time()
                self._status[device]["last_error"] = error

    def add_listener(self, fn: Callable[[], None]) -> None:
        """Register a callback invoked after any config change."""
        self._listeners.append(fn)

    # --- persistence ---

    def _schedule_save(self) -> None:
        if self._save_timer is not None:
            self._save_timer.cancel()
        self._save_timer = threading.Timer(self._debounce, self._do_save)
        self._save_timer.daemon = True
        self._save_timer.start()

    def _do_save(self) -> None:
        try:
            import yaml
        except ImportError:
            log.error("PyYAML not available — config changes not persisted")
            return
        with self._lock:
            data = {
                "service": asdict(self._cfg.service),
                "matrix": asdict(self._cfg.matrix),
                "oled": asdict(self._cfg.oled),
                "ryujin_lcd": asdict(self._cfg.ryujin_lcd),
                "aura_rgb": asdict(self._cfg.aura_rgb),
            }
        # Drop class-level constants
        for d in data.values():
            for key in ("SCENES", "VALUE_SOURCES"):
                d.pop(key, None)
        try:
            self._yaml_path.write_text(
                yaml.safe_dump(data, sort_keys=False, default_flow_style=False),
                encoding="utf-8",
            )
            log.info("config saved to %s", self._yaml_path)
        except Exception:
            log.exception("failed to save config")


def build_state(yaml_path: Path) -> ServiceState:
    """Load config from disk + wrap in a ServiceState."""
    cfg = load_config(yaml_path)
    return ServiceState(cfg=cfg, yaml_path=yaml_path)
