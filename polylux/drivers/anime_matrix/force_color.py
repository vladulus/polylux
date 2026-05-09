"""Force AniMe Matrix to display a Polylux-chosen RGB color, regardless of
what Armoury Crate UI sends. Frida hook attached to UserSessionHelper.

The Frida JS rewrites the decrypted SetMatrixLED plaintext in place so
UserSessionHelper applies our color instead of UI's. Mutation is bounded
by the BCryptDecrypt-allocated output buffer; if our new plaintext would
overflow we silently skip and let the user's color through.
"""
from __future__ import annotations

import logging
import time
from typing import Optional

import frida

log = logging.getLogger(__name__)


def _build_js(r: int, g: int, b: int) -> str:
    return JS_TEMPLATE.replace("__R__", str(r)).replace("__G__", str(g)).replace("__B__", str(b))


JS_TEMPLATE = r"""
'use strict';

const TARGET_R = "__R__";
const TARGET_G = "__G__";
const TARGET_B = "__B__";

function expByName(modName, fnName) {
    const mod = Process.findModuleByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e){ return null; }
}

const decAddr = expByName('bcrypt.dll', 'BCryptDecrypt');
let g_count = 0;

function readBytes(ptr, n) { return new Uint8Array(ptr.readByteArray(n)); }

function findBytes(buf, needle) {
    outer: for (let i = 0; i <= buf.length - needle.length; i++) {
        for (let j = 0; j < needle.length; j++)
            if (buf[i+j] !== needle[j]) continue outer;
        return i;
    }
    return -1;
}

function utf16leEncode(s) {
    const out = new Uint8Array(s.length * 2);
    for (let i = 0; i < s.length; i++) {
        out[i*2] = s.charCodeAt(i) & 0xff;
        out[i*2+1] = (s.charCodeAt(i) >> 8) & 0xff;
    }
    return out;
}

function parseFields(buf) {
    const fields = [];
    let off = 0;
    while (off + 6 <= buf.length) {
        const nameLen = buf[off];
        if (nameLen === 0 || nameLen > 64) break;
        if (off + 1 + nameLen + 5 > buf.length) break;
        let name = ''; let isAscii = true;
        for (let k = 0; k < nameLen; k++) {
            const c = buf[off+1+k];
            if (c < 32 || c >= 127) { isAscii = false; break; }
            name += String.fromCharCode(c);
        }
        if (!isAscii) break;
        const tagOff = off + 1 + nameLen;
        const tag = buf[tagOff];
        if (![0x02,0x04,0x05,0x10,0x20].includes(tag)) break;
        const lenOff = tagOff + 1;
        const pl = buf[lenOff] | (buf[lenOff+1]<<8) | (buf[lenOff+2]<<16) | (buf[lenOff+3]<<24);
        if (pl < 0 || pl > buf.length) break;
        const payloadOff = lenOff + 4;
        if (payloadOff + pl > buf.length) break;
        const payload = buf.slice(payloadOff, payloadOff + pl);
        fields.push({name, tag, payload, payloadLen: pl});
        off = payloadOff + pl;
    }
    return fields;
}

if (decAddr) {
    Interceptor.attach(decAddr, {
        onEnter(args) {
            this.pPlain = args[6];
            this.cbOutput = args[7].toInt32();
            this.pcbResult = args[8];
        },
        onLeave(retval) {
            if (retval.toInt32() !== 0) return;
            if (this.pcbResult.isNull()) return;
            const got = this.pcbResult.readU32();
            if (got <= 0 || got > 65536) return;
            const buf = readBytes(this.pPlain, got);
            const needle = utf16leEncode('SetMatrixLED');
            if (findBytes(buf, needle) < 0) return;

            const fields = parseFields(buf);
            const fR = fields.find(f => f.name === 'TextColorR[0]');
            const fG = fields.find(f => f.name === 'TextColorG[0]');
            const fB = fields.find(f => f.name === 'TextColorB[0]');
            if (!fR || !fG || !fB) return;

            const out = [];
            for (const f of fields) {
                out.push(f.name.length);
                for (let j = 0; j < f.name.length; j++) out.push(f.name.charCodeAt(j));
                out.push(f.tag);
                let payload, plen;
                if (f.name === 'TextColorR[0]')      { payload = utf16leEncode(TARGET_R); plen = payload.length; }
                else if (f.name === 'TextColorG[0]') { payload = utf16leEncode(TARGET_G); plen = payload.length; }
                else if (f.name === 'TextColorB[0]') { payload = utf16leEncode(TARGET_B); plen = payload.length; }
                else                                  { payload = f.payload; plen = f.payloadLen; }
                out.push(plen & 0xff, (plen >> 8) & 0xff, (plen >> 16) & 0xff, (plen >> 24) & 0xff);
                for (let j = 0; j < payload.length; j++) out.push(payload[j]);
            }
            if (out.length > this.cbOutput) {
                send({type:'log', level:'warn', msg:'overflow refused: out='+out.length+' cap='+this.cbOutput});
                return;
            }
            this.pPlain.writeByteArray(out);
            this.pcbResult.writeU32(out.length);
            g_count++;
            send({type:'forced', n: g_count, new_size: out.length, orig_size: buf.length});
        }
    });
    send({type:'log', level:'info', msg:'matrix force-color hook armed: ('+TARGET_R+','+TARGET_G+','+TARGET_B+')'});
}
"""


class MatrixForceColorDriver:
    """Attach to UserSessionHelper.exe via Frida and keep the matrix at a
    fixed RGB color forever. Re-attaches if the helper process restarts.
    """

    TARGET_PROCESS = "ArmouryCrate.UserSessionHelper.exe"

    def __init__(self, color: tuple[int, int, int]):
        self.color = color
        self.session: Optional[frida.core.Session] = None
        self.script: Optional[frida.core.Script] = None
        self._device = frida.get_local_device()

    def _find_pid(self) -> Optional[int]:
        # frida.enumerate_processes() omits processes whose tokens our
        # current user can't query; UserSessionHelper has restricted ACLs
        # despite running in the user's session. Fall back to tasklist.
        for proc in self._device.enumerate_processes():
            if proc.name.startswith("ArmouryCrate.UserSessionH"):
                return proc.pid
        # Tasklist-based fallback. Names get truncated to 25 chars in the
        # legacy table, so we match the truncated prefix.
        import subprocess
        try:
            out = subprocess.check_output(
                ["tasklist", "/fo", "csv", "/nh"],
                text=True,
                stderr=subprocess.DEVNULL,
            )
        except Exception:
            return None
        for line in out.splitlines():
            if "UserSessionH" in line and "ArmouryCrate" in line:
                # CSV: "ImageName","PID","SessionName","Session#","MemUsage"
                parts = [p.strip().strip('"') for p in line.split(",")]
                if len(parts) >= 2:
                    try:
                        return int(parts[1])
                    except ValueError:
                        continue
        return None

    def attach(self) -> bool:
        pid = self._find_pid()
        if pid is None:
            log.warning("UserSessionHelper not running; will retry")
            return False
        log.info("attaching to PID %d", pid)
        try:
            self.session = frida.attach(pid)
        except frida.ProcessNotRespondingError as e:
            log.warning("attach failed: %s", e)
            return False
        js = _build_js(*self.color)
        self.script = self.session.create_script(js)
        self.script.on("message", self._on_message)
        self.script.load()
        log.info("matrix force-color hook loaded; target=%s", self.color)
        return True

    def detach(self) -> None:
        if self.session is not None:
            try:
                self.session.detach()
            except Exception:
                pass
        self.session = None
        self.script = None

    def _on_message(self, message: dict, _data: object) -> None:
        if message.get("type") != "send":
            if message.get("type") == "error":
                log.error("frida script error: %s", message.get("description"))
            return
        p = message.get("payload", {})
        kind = p.get("type")
        if kind == "log":
            level = p.get("level", "info")
            getattr(log, level, log.info)("frida: %s", p.get("msg"))
        elif kind == "forced":
            log.info("matrix forced #%d (size %d -> %d)",
                     p.get("n"), p.get("orig_size"), p.get("new_size"))

    def run_forever(self, poll_interval: float = 5.0) -> None:
        """Block, keeping the hook attached. Re-attaches if the target
        process disappears (e.g., user restarts Armoury Crate)."""
        while True:
            if self.session is None:
                if not self.attach():
                    time.sleep(poll_interval)
                    continue
            time.sleep(poll_interval)
            # Cheap liveness probe: check that the PID is still ours
            try:
                pid = self.session._impl.pid  # noqa: SLF001  (frida-python internal)
            except Exception:
                pid = None
            current = self._find_pid()
            if current is None or (pid is not None and current != pid):
                log.warning("UserSessionHelper PID changed (%s -> %s); re-attaching", pid, current)
                self.detach()
