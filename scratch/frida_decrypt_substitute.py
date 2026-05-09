"""PATH B: hook BCryptDecrypt's onLeave, mutate the plaintext SetMatrixLED
in place so UserSessionHelper applies *our* color instead of what UWP UI
sent.

Strategy:
  - Detect SetMatrixLED by searching for the wstring 'SetMatrixLED' in the
    decrypted output buffer.
  - Walk the field stream (name_len:u8 | name | tag:u8 | payload_len:u32 |
    payload). Find TextColorR[0] and TextColorB[0]. Swap their payloads.
    This converts any color (R,G,B) to (B,G,R) — visibly different.
  - Same-length swap so we don't have to update buffer size.
  - Also rewrite each `"color":[r,g,b]` JSON array inside the embedded
    `fx` wstring with the swapped value, keeping byte-length identical.

If this works:
  Vlad clicks Apply with color (R,G,B) — let's say BLUE = (0,0,255).
  We swap it to (255,0,0) = RED in flight.
  Matrix shows RED.
"""
import sys, time, frida

JS = r"""
'use strict';

const TARGET_NAME = 'SetMatrixLED';
const TARGET_HEX = (() => {
    let h = '';
    for (let i = 0; i < TARGET_NAME.length; i++) {
        const c = TARGET_NAME.charCodeAt(i);
        h += (c & 0xff < 16 ? '0' : '') + (c & 0xff).toString(16);
        h += '00';
    }
    return h;
})();

function expByName(modName, fnName) {
    const mod = Process.findModuleByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e){ return null; }
}

const decAddr = expByName('bcrypt.dll', 'BCryptDecrypt');
if (!decAddr) {
    send({type:'log', msg:'no BCryptDecrypt!'});
} else {
    send({type:'log', msg:'hooked BCryptDecrypt @ '+decAddr});
}

let g_substitutionsDone = 0;

// Convert a NativePointer + length to a Uint8Array (copy)
function readBytes(ptr, n) {
    const ab = ptr.readByteArray(n);
    return new Uint8Array(ab);
}
function writeBytes(ptr, off, arr) {
    ptr.add(off).writeByteArray(Array.from(arr));
}

// Find substring of bytes in buffer
function findBytes(buf, needle, start) {
    start = start || 0;
    outer: for (let i = start; i <= buf.length - needle.length; i++) {
        for (let j = 0; j < needle.length; j++) {
            if (buf[i+j] !== needle[j]) continue outer;
        }
        return i;
    }
    return -1;
}

// Parse aura_proto field stream, return array of {nameOff, nameLen, tagOff, lenOff, payloadOff, payloadLen, name}
function parseFields(buf) {
    const fields = [];
    let off = 0;
    while (off + 6 <= buf.length) {
        const nameLen = buf[off];
        if (nameLen === 0 || nameLen > 64) break;
        if (off + 1 + nameLen + 1 + 4 > buf.length) break;
        const nameStart = off + 1;
        let name = '';
        let isAscii = true;
        for (let k = 0; k < nameLen; k++) {
            const c = buf[nameStart + k];
            if (c < 32 || c >= 127) { isAscii = false; break; }
            name += String.fromCharCode(c);
        }
        if (!isAscii) break;
        const tagOff = nameStart + nameLen;
        const tag = buf[tagOff];
        if (tag !== 0x02 && tag !== 0x04 && tag !== 0x05 && tag !== 0x10 && tag !== 0x20) break;
        const lenOff = tagOff + 1;
        const payloadLen = buf[lenOff] | (buf[lenOff+1]<<8) | (buf[lenOff+2]<<16) | (buf[lenOff+3]<<24);
        if (payloadLen < 0 || payloadLen > buf.length) break;
        const payloadOff = lenOff + 4;
        if (payloadOff + payloadLen > buf.length) break;
        fields.push({name, tag, nameOff: off, nameLen, tagOff, lenOff, payloadOff, payloadLen});
        off = payloadOff + payloadLen;
    }
    return fields;
}

// Find a color number wstring like "0" or "255" — same-length swap helper.
function findField(fields, name) {
    return fields.find(f => f.name === name);
}

if (decAddr) {
    Interceptor.attach(decAddr, {
        onEnter(args) {
            this.pPlain = args[6];
            this.pcbResult = args[8];
        },
        onLeave(retval) {
            if (retval.toInt32() !== 0) return;
            if (this.pcbResult.isNull()) return;
            const got = this.pcbResult.readU32();
            if (got <= 0 || got > 65536) return;
            const buf = readBytes(this.pPlain, got);
            // quick check: contains 'SetMatrixLED' wstring
            const needle = new Uint8Array(TARGET_NAME.length * 2);
            for (let i = 0; i < TARGET_NAME.length; i++) {
                needle[i*2] = TARGET_NAME.charCodeAt(i);
                needle[i*2+1] = 0;
            }
            if (findBytes(buf, needle) < 0) return;
            // parse
            const fields = parseFields(buf);
            const fR = findField(fields, 'TextColorR[0]');
            const fG = findField(fields, 'TextColorG[0]');
            const fB = findField(fields, 'TextColorB[0]');
            if (!fR || !fB) {
                send({type:'log', msg:'SetMatrixLED detected but R/B fields not found'});
                return;
            }
            // Swap R and B by rewriting the entire field stream.
            // Total byte count stays identical because swap is symmetric:
            //   was R(a)+G(b)+B(c) -> becomes B(c)+G(b)+R(a) at those positions
            //   sum of payload bytes unchanged.
            const R_payload = buf.slice(fR.payloadOff, fR.payloadOff + fR.payloadLen);
            const B_payload = buf.slice(fB.payloadOff, fB.payloadOff + fB.payloadLen);

            // Build new buffer, copying all fields but swapping R and B payloads
            const out = [];
            for (const f of fields) {
                out.push(f.name.length);
                for (let j = 0; j < f.name.length; j++) out.push(f.name.charCodeAt(j));
                out.push(f.tag);
                let plen, payload;
                if (f.name === 'TextColorR[0]') { plen = fB.payloadLen; payload = B_payload; }
                else if (f.name === 'TextColorB[0]') { plen = fR.payloadLen; payload = R_payload; }
                else { plen = f.payloadLen; payload = buf.slice(f.payloadOff, f.payloadOff + f.payloadLen); }
                out.push(plen & 0xff, (plen >> 8) & 0xff, (plen >> 16) & 0xff, (plen >> 24) & 0xff);
                for (let j = 0; j < payload.length; j++) out.push(payload[j]);
            }
            // Sanity check: total bytes unchanged
            if (out.length !== buf.length) {
                send({type:'log', msg:`size mismatch: out=${out.length} vs in=${buf.length} — refusing`});
                return;
            }
            this.pPlain.writeByteArray(out);
            g_substitutionsDone++;
            send({type:'log', msg:`SUBSTITUTED #${g_substitutionsDone}: R="${utf16le(R_payload)}"<->B="${utf16le(B_payload)}" (size ${out.length} preserved)`});
        }
    });
}

function utf16le(arr) {
    let s = '';
    for (let i = 0; i+1 < arr.length; i += 2) {
        s += String.fromCharCode(arr[i] | (arr[i+1] << 8));
    }
    return s.replace(/\x00+$/, '');
}

send({type:'log', msg:'decrypt-substitute hook armed'});
"""

if len(sys.argv) < 2: print("usage: <PID> [seconds]"); sys.exit(2)
pid = int(sys.argv[1])
dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60
session = frida.attach(pid)
script = session.create_script(JS)
def on_msg(m, d):
    if m['type']=='send' and m['payload'].get('type')=='log':
        print('[frida]', m['payload']['msg'])
    elif m['type']=='error':
        print('[!]', m.get('description'))
script.on('message', on_msg)
script.load()
print(f'[+] hook armed; ACTIVE for {dur}s')
print()
print('VLAD:')
print('  1. Pick a color in Armoury Crate that has DIFFERENT R and B values')
print('     (e.g., RED = R:255 G:0 B:0  -> after swap: BLUE = R:0 G:0 B:255)')
print('     (e.g., BLUE = R:0 G:0 B:255 -> after swap: RED = R:255 G:0 B:0)')
print('  2. Click Apply.')
print('  3. Watch matrix — should show the SWAPPED color, not what you picked!')
print()
time.sleep(dur)
session.detach()
print('[+] detached')
