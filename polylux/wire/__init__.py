"""Wire-format primitives for ArmouryCrate.UserSessionHelper.exe traffic.

The TCP socket between ArmouryCrate.exe (UWP UI) and UserSessionHelper.exe
on port 51100 carries length-prefixed encrypted frames. Each frame contains
exactly one AES-256-GCM chunk.
"""
from polylux.wire.frame import Frame, pack_frame, read_frame, unpack_frame

__all__ = ["Frame", "pack_frame", "read_frame", "unpack_frame"]
