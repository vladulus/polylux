"""Extract the AES-256 session key from a running ArmouryCrate.UserSessionHelper.exe.

The helper generates a fresh symmetric key inside its own process address space
on every start (via `BCryptGenerateSymmetricKey`). To talk to its TCP listener,
Polylux needs that key — there is no on-disk persistence and no key-derivation
function we can replicate without it.

The strategy is one-shot at service startup:

  1. Find the helper's PID (auto by name, or pass explicit).
  2. Frida-attach.
  3. Hook `bcrypt.dll!BCryptEncrypt`. The first call carries the key handle as
     `args[0]`. Stash it and detach the hook.
  4. Call `BCryptExportKey(handle, "KeyDataBlob")` from inside Frida. The
     KeyDataBlob layout is documented (4 B magic "KDBM" + 4 B version + 4 B
     keysize + keysize B raw key).
  5. Detach Frida. Return the 32-byte key.

Frida is a startup-only dependency — the runtime crypto path is pure Python
(`polylux.crypto.AuraCipher`) so latency, allocations, and process attachment
overhead are all gone after `extract_key()` returns.
"""
from __future__ import annotations

import time
from typing import Optional

import frida
import psutil


HELPER_NAME = "ArmouryCrate.UserSessionHelper.exe"
KEY_LEN = 32
KDBM_MAGIC = b"KDBM"


# Frida agent JS — minimal: hook BCryptEncrypt onEnter to grab the key handle,
# then expose an RPC that calls BCryptExportKey with that handle.
_AGENT_JS = r"""
'use strict';

let g_keyHandle = null;
let g_hookHandle = null;

function expByName(modName, fnName) {
    const mod = Process.findModuleByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e){ return null; }
}

const encAddr    = expByName('bcrypt.dll', 'BCryptEncrypt');
const exportAddr = expByName('bcrypt.dll', 'BCryptExportKey');

if (encAddr) {
    g_hookHandle = Interceptor.attach(encAddr, {
        onEnter(args) {
            if (g_keyHandle) return;
            g_keyHandle = args[0];
            // detach so we don't pay the hook tax forever
            if (g_hookHandle) { g_hookHandle.detach(); g_hookHandle = null; }
            send({type: 'log', msg: 'key handle captured: ' + g_keyHandle.toString()});
        }
    });
}

const exportFn = exportAddr ? new NativeFunction(exportAddr, 'int', [
    'pointer','pointer','pointer','pointer','uint32','pointer','uint32'
]) : null;

function utf16zString(s) {
    const buf = Memory.alloc((s.length + 1) * 2);
    buf.writeUtf16String(s);
    return buf;
}

rpc.exports = {
    haveKey() { return g_keyHandle !== null; },

    exportKey() {
        if (!g_keyHandle) return {ok: false, error: 'no key handle captured yet'};
        if (!exportFn)    return {ok: false, error: 'BCryptExportKey unavailable'};

        const blobName = utf16zString('KeyDataBlob');
        const pcb = Memory.alloc(4);
        let st = exportFn(g_keyHandle, ptr(0), blobName, ptr(0), 0, pcb, 0);
        // STATUS_SUCCESS = 0; STATUS_BUFFER_TOO_SMALL = 0xC0000023 = -1073741789
        if (st !== 0 && (st >>> 0) !== 0xC0000023) {
            return {ok: false, error: 'size query 0x' + (st >>> 0).toString(16)};
        }
        const need = pcb.readU32();
        if (need === 0 || need > 65536) return {ok: false, error: 'unexpected size ' + need};

        const out = Memory.alloc(need);
        st = exportFn(g_keyHandle, ptr(0), blobName, out, need, pcb, 0);
        if (st !== 0) return {ok: false, error: 'export 0x' + (st >>> 0).toString(16)};

        const got = pcb.readU32();
        const u8 = new Uint8Array(out.readByteArray(got));
        let hex = '';
        for (let i = 0; i < u8.length; i++) hex += (u8[i] < 16 ? '0' : '') + u8[i].toString(16);
        return {ok: true, hex};
    }
};
"""


class KeyExtractionError(RuntimeError):
    """Raised when the AES key cannot be extracted."""


def find_helper_pid(name: str = HELPER_NAME) -> Optional[int]:
    """Return the PID of the first matching process, or None."""
    for proc in psutil.process_iter(["pid", "name"]):
        if proc.info["name"] and proc.info["name"].lower() == name.lower():
            return int(proc.info["pid"])
    return None


def extract_key(pid: Optional[int] = None, *, timeout: float = 30.0) -> bytes:
    """Extract the AES-256 session key from a running UserSessionHelper.exe.

    Args:
        pid: explicit PID; if None, auto-discover by process name.
        timeout: seconds to wait for the first BCryptEncrypt call to fire.
            UserSessionHelper polls QuerySMTCInfo every few seconds when idle,
            so this normally returns within ~5 s.

    Returns:
        32-byte raw AES-256 key.

    Raises:
        KeyExtractionError on missing process, no encrypt activity, or
        unexpected blob format.
    """
    if pid is None:
        pid = find_helper_pid()
        if pid is None:
            raise KeyExtractionError(f"{HELPER_NAME} not running")

    try:
        session = frida.attach(pid)
    except frida.ProcessNotFoundError as ex:
        raise KeyExtractionError(f"frida.attach({pid}) failed: {ex}") from ex

    try:
        script = session.create_script(_AGENT_JS)
        script.load()

        deadline = time.time() + timeout
        while time.time() < deadline:
            if script.exports_sync.have_key():
                break
            time.sleep(0.25)
        else:
            raise KeyExtractionError(
                f"no BCryptEncrypt fired within {timeout}s (helper idle?)"
            )

        resp = script.exports_sync.export_key()
        if not resp.get("ok"):
            raise KeyExtractionError(f"BCryptExportKey failed: {resp.get('error')}")

        blob = bytes.fromhex(resp["hex"])
    finally:
        session.detach()

    return _parse_keydata_blob(blob)


def _parse_keydata_blob(blob: bytes) -> bytes:
    """Parse a Microsoft BCRYPT_KEY_DATA_BLOB and return the raw key bytes.

    Layout: u32 magic 'KDBM' | u32 version | u32 cbKeyData | cbKeyData bytes.
    """
    if len(blob) < 12:
        raise KeyExtractionError(f"blob too short: {len(blob)} bytes")
    if blob[:4] != KDBM_MAGIC:
        raise KeyExtractionError(f"unexpected magic {blob[:4]!r}, want {KDBM_MAGIC!r}")
    version = int.from_bytes(blob[4:8], "little")
    if version != 1:
        raise KeyExtractionError(f"unsupported KeyDataBlob version {version}")
    keysize = int.from_bytes(blob[8:12], "little")
    if keysize != KEY_LEN:
        raise KeyExtractionError(
            f"unexpected key size {keysize}, want {KEY_LEN} (AES-256)"
        )
    if len(blob) < 12 + keysize:
        raise KeyExtractionError(
            f"blob truncated: have {len(blob)} bytes, need {12 + keysize}"
        )
    return blob[12 : 12 + keysize]
