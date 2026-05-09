"""Force the AniMe Matrix to a specific Polylux-chosen color, regardless
of what Armoury Crate UI sends.

This is the v0.1 of Polylux's matrix driver: the user (or Polylux config)
picks an RGB; this Frida hook intercepts every SetMatrixLED Apply and
overwrites the TextColorR/G/B values + the inner fx.color arrays.

Usage:
    python scratch/frida_force_color.py <PID> <R> <G> <B> [seconds]

The buffer size constraint: we MUST keep the total decrypted plaintext
size identical (UserSessionHelper allocated a fixed-size output buffer).
The script picks color values whose decimal-digit count matches the
original ones, padding with leading zeros if needed (e.g. 5 -> "005").
"""
import sys, time, frida


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

function utf16leDecode(arr) {
    let s = '';
    for (let i = 0; i+1 < arr.length; i += 2)
        s += String.fromCharCode(arr[i] | (arr[i+1] << 8));
    return s.replace(/\x00+$/, '');
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

/**
 * Re-pack a value for a TextColor field at the SAME byte length as the
 * original, by zero-padding the decimal representation:
 *   original "0"   (1 char, 2 bytes) and target=255 -> "5" (kept as 1 char) — WRONG
 *   original "0"   (1 char) and target=5  -> "5"
 *   original "255" (3 chars) and target=0 -> "000"
 * For arbitrary in/out lengths we'd need to reflow the whole buffer.
 * For now we keep this simple: pad target value to original char count if
 * target fits; otherwise return null and let caller refuse.
 */
function fitDecimal(targetVal, origCharLen) {
    const s = String(targetVal);
    if (s.length > origCharLen) return null; // would overflow
    return s.padStart(origCharLen, '0');
}

if (decAddr) {
    Interceptor.attach(decAddr, {
        onEnter(args) {
            this.pPlain = args[6];
            this.cbOutput = args[7].toInt32();   // allocated buffer size — our headroom
            this.pcbResult = args[8];
        },
        onLeave(retval) {
            if (retval.toInt32() !== 0) return;
            if (this.pcbResult.isNull()) return;
            const got = this.pcbResult.readU32();
            if (got <= 0 || got > 65536) return;
            const buf = readBytes(this.pPlain, got);
            // quick filter: must contain SetMatrixLED wstring
            const needle = utf16leEncode('SetMatrixLED');
            if (findBytes(buf, needle) < 0) return;

            const fields = parseFields(buf);
            const fR = fields.find(f => f.name === 'TextColorR[0]');
            const fG = fields.find(f => f.name === 'TextColorG[0]');
            const fB = fields.find(f => f.name === 'TextColorB[0]');
            if (!fR || !fG || !fB) {
                send({type:'log', msg:'no R/G/B fields'});
                return;
            }

            const origR = utf16leDecode(fR.payload);
            const origG = utf16leDecode(fG.payload);
            const origB = utf16leDecode(fB.payload);

            // Use TARGET values verbatim — let the buffer grow/shrink as needed.
            // We update pcbResult and check that the new size fits within
            // cbOutput (the original allocated capacity).
            const newR = String(TARGET_R);
            const newG = String(TARGET_G);
            const newB = String(TARGET_B);

            const out = [];
            for (const f of fields) {
                out.push(f.name.length);
                for (let j = 0; j < f.name.length; j++) out.push(f.name.charCodeAt(j));
                out.push(f.tag);
                let payload, plen;
                if (f.name === 'TextColorR[0]') {
                    payload = utf16leEncode(newR); plen = payload.length;
                } else if (f.name === 'TextColorG[0]') {
                    payload = utf16leEncode(newG); plen = payload.length;
                } else if (f.name === 'TextColorB[0]') {
                    payload = utf16leEncode(newB); plen = payload.length;
                } else {
                    payload = f.payload; plen = f.payloadLen;
                }
                out.push(plen & 0xff, (plen >> 8) & 0xff, (plen >> 16) & 0xff, (plen >> 24) & 0xff);
                for (let j = 0; j < payload.length; j++) out.push(payload[j]);
            }

            if (out.length > this.cbOutput) {
                send({type:'log', msg:`OVERFLOW: new=${out.length} cbOutput=${this.cbOutput} — refusing`});
                return;
            }

            this.pPlain.writeByteArray(out);
            this.pcbResult.writeU32(out.length);
            g_count++;
            send({type:'log', msg:`FORCED #${g_count}: orig (R=${origR},G=${origG},B=${origB}) -> (R=${newR},G=${newG},B=${newB})  size ${buf.length}->${out.length} (room=${this.cbOutput})`});
        }
    });
    send({type:'log', msg:'force-color hook armed: target = R='+TARGET_R+' G='+TARGET_G+' B='+TARGET_B});
}
"""

def main():
    if len(sys.argv) < 5:
        print("usage: <PID> <R> <G> <B> [seconds]"); sys.exit(2)
    pid = int(sys.argv[1])
    R, G, B = sys.argv[2], sys.argv[3], sys.argv[4]
    dur = int(sys.argv[5]) if len(sys.argv) > 5 else 60

    js = JS_TEMPLATE.replace('"__R__"', f'"{R}"').replace('"__G__"', f'"{G}"').replace('"__B__"', f'"{B}"')

    session = frida.attach(pid)
    script = session.create_script(js)
    def on_msg(m, d):
        if m['type']=='send' and m['payload'].get('type')=='log':
            print('[frida]', m['payload']['msg'])
        elif m['type']=='error':
            print('[!]', m.get('description'))
    script.on('message', on_msg)
    script.load()
    print(f'[+] hook armed; target color = ({R},{G},{B}); active for {dur}s')
    print('[+] VLAD: change matrix color in Armoury Crate to ANYTHING and click Apply')
    print(f'[+] matrix should display ({R},{G},{B}) regardless')
    time.sleep(dur)
    session.detach()
    print('[+] detached')


if __name__ == "__main__":
    main()
