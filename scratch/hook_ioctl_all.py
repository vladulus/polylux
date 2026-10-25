"""Log every NtDeviceIoControlFile from all ASUS processes until a stop
flag file appears. Run elevated (services are SYSTEM). Used to find how AC
writes settings that never show up on USB (e.g. AniMe matrix S5 mode).

usage: python hook_ioctl_all.py <out.jsonl> <stopflag>
"""
import json, sys, time
from pathlib import Path

import frida
import psutil

NAMES = ("armourycrate", "lightingservice", "asus_framework", "aac", "armoury",
         "asuscertservice", "roglive", "asusns")

JS = r"""
'use strict';
function hex(buf) { const u = new Uint8Array(buf); let s='';
  for (let i=0;i<u.length;i++) s += (u[i]<16?'0':'') + u[i].toString(16); return s; }
const gfp = Process.getModuleByName('kernel32.dll').findExportByName('GetFinalPathNameByHandleW');
const gfpFn = gfp ? new NativeFunction(gfp, 'uint32', ['pointer','pointer','uint32','uint32']) : null;
const names = new Map();
function pathOf(h) {
  if (names.has(h)) return names.get(h);
  let p = '<?>';
  try { const b = Memory.alloc(2048); const r = gfpFn(ptr(h), b, 1024, 0);
        if (r > 0 && r < 1024) p = b.readUtf16String(r); } catch (e) {}
  names.set(h, p); return p;
}
const nd = Process.getModuleByName('ntdll.dll').findExportByName('NtDeviceIoControlFile');
Interceptor.attach(nd, {
  onEnter(a) { this.h = a[0].toString(); this.code = a[5].toUInt32();
               this.ib = a[6]; this.il = a[7].toUInt32(); this.ob = a[8]; this.ol = a[9].toUInt32(); },
  onLeave(r) {
    let inHex = '', outHex = '';
    try { if (this.il > 0 && this.il <= 4096) inHex = hex(this.ib.readByteArray(this.il)); } catch (e) {}
    try { if (this.ol > 0 && this.ol <= 256) outHex = hex(this.ob.readByteArray(this.ol)); } catch (e) {}
    send({ts: Date.now(), h: this.h, path: pathOf(this.h), ioctl: '0x' + this.code.toString(16),
          il: this.il, inHex, outHex, status: r.toInt32()});
  }
});
"""


def main():
    out, stop = Path(sys.argv[1]), Path(sys.argv[2])
    stop.unlink(missing_ok=True)
    f = out.open("w", encoding="utf-8")
    sessions = []
    for p in psutil.process_iter(["pid", "name"]):
        n = (p.info["name"] or "").lower()
        if not n.startswith(NAMES):
            continue
        try:
            s = frida.attach(p.info["pid"])
            sc = s.create_script(JS)
            name = p.info["name"]
            sc.on("message", lambda m, d, name=name: (
                f.write(json.dumps({"proc": name, **m["payload"]}) + "\n") if m["type"] == "send"
                else f.write(json.dumps({"proc": name, "error": m.get("description")}) + "\n")))
            sc.load()
            sessions.append(s)
            f.write(json.dumps({"attached": name, "pid": p.info["pid"]}) + "\n")
        except Exception as e:  # noqa: BLE001 — log and keep going
            f.write(json.dumps({"attach_failed": p.info["name"], "err": str(e)}) + "\n")
    f.flush()
    while not stop.exists():
        time.sleep(0.5)
        f.flush()
    for s in sessions:
        try:
            s.detach()
        except Exception:  # noqa: BLE001
            pass
    stop.unlink(missing_ok=True)
    f.close()


if __name__ == "__main__":
    main()
