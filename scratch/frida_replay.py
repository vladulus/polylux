"""Replay an Apply via Frida RPC into UserSessionHelper.

Phase A — Frida side (loaded into UserSessionHelper):
  - Hook BCryptEncrypt to stash the key handle on first observed call.
  - Hook ws2_32!send to stash the active socket handle.
  - Expose RPC:
      state()                         -> {has_key, send_socket, ...}
      encrypt(hex)                    -> {ok, cipher_hex}
      send_raw(sock, hex)             -> {ok, n_written}

Phase B — Python driver:
  - Load the captured plaintext SetMatrixLED message
  - Mutate TextColorR/G/B to RED (255,0,0)
  - Call encrypt() through Frida RPC
  - Call send_raw() to push the ciphertext on the live socket
  - Vlad watches matrix to see if it turns RED

The captured wire shows that one full Apply is a sequence of small frames,
each `u32_LE_length || ciphertext`. We need to learn the framing for each
component (16-byte header / 4-byte length / payload). For now this script
sends ONE big encrypted blob and observes whether the server replies — that
tells us whether the framing assumption is correct.
"""
from __future__ import annotations

import argparse
import json
import struct
import sys
import time
from pathlib import Path

import frida

sys.path.insert(0, str(Path(__file__).parent.parent))
from polylux.format import aura_proto as ap


JS = r"""
'use strict';

let g_keyHandle = null;
let g_sendSocket = null;

function expByName(modName, fnName) {
    const mod = Process.findModuleByName(modName);
    if (!mod) return null;
    try { const a = mod.findExportByName(fnName); if (a) return a; } catch(e){}
    try { return mod.getExportByName(fnName); } catch(e) { return null; }
}

const encAddr = expByName('bcrypt.dll', 'BCryptEncrypt');
const sendAddr = expByName('ws2_32.dll', 'send') || expByName('WS2_32.dll', 'send');

if (encAddr) {
    Interceptor.attach(encAddr, {
        onEnter(args) {
            if (!g_keyHandle) {
                g_keyHandle = args[0];
                send({type:'log', msg:'KEY captured: ' + args[0].toString()});
            }
        }
    });
}

if (sendAddr) {
    Interceptor.attach(sendAddr, {
        onEnter(args) { this.s = args[0].toInt32(); this.len = args[2].toInt32(); },
        onLeave(retval) {
            if (retval.toInt32() > 0 && this.len >= 4) {
                if (g_sendSocket !== this.s) {
                    g_sendSocket = this.s;
                    send({type:'log', msg:'SEND socket: ' + this.s});
                }
            }
        }
    });
}

const encFn = encAddr ? new NativeFunction(encAddr, 'int', [
    'pointer','pointer','uint32','pointer','pointer','uint32',
    'pointer','uint32','pointer','uint32'
]) : null;

const sendFn = sendAddr ? new NativeFunction(sendAddr, 'int', [
    'int','pointer','int','int'
]) : null;

function bytesFromHex(hex) {
    const a = new Uint8Array(hex.length / 2);
    for (let i = 0; i < a.length; i++) a[i] = parseInt(hex.substr(i*2, 2), 16);
    return a;
}
function hexFromBytes(arr) {
    let h = '';
    for (let i = 0; i < arr.length; i++) {
        h += (arr[i] < 16 ? '0' : '') + arr[i].toString(16);
    }
    return h;
}

rpc.exports = {
    state() {
        return {
            has_key: g_keyHandle !== null,
            key_handle: g_keyHandle ? g_keyHandle.toString() : null,
            send_socket: g_sendSocket
        };
    },

    /**
     * Encrypt with AES-GCM using the stashed key. Allocates fresh
     * BCRYPT_AUTHENTICATED_CIPHER_MODE_INFO with 12-byte random nonce
     * and 16-byte tag buffer. Returns { ok, nonce_hex, cipher_hex, tag_hex }.
     */
    encrypt(plaintext_hex) {
        if (!g_keyHandle || !encFn) return {ok:false, error:'no key/fn'};
        const pt = bytesFromHex(plaintext_hex);
        const pBuf = Memory.alloc(pt.length || 1);
        if (pt.length) pBuf.writeByteArray(Array.from(pt));

        // Output buffer: AES-GCM ciphertext == plaintext length (stream cipher)
        const cBuf = Memory.alloc(pt.length || 1);
        const pcb = Memory.alloc(4);

        // Random 12-byte nonce
        const nonce = new Uint8Array(12);
        for (let i = 0; i < 12; i++) nonce[i] = Math.floor(Math.random() * 256);
        const noncePtr = Memory.alloc(12);
        noncePtr.writeByteArray(Array.from(nonce));

        // 16-byte tag output
        const tagPtr = Memory.alloc(16);
        tagPtr.writeByteArray(new Array(16).fill(0));

        // BCRYPT_AUTHENTICATED_CIPHER_MODE_INFO (88 bytes on x64)
        const infoSize = 88;
        const info = Memory.alloc(infoSize);
        // zero
        info.writeByteArray(new Array(infoSize).fill(0));
        // cbSize = 88 (u32 @ 0)
        info.writeU32(infoSize);
        // dwInfoVersion = 1 (u32 @ 4)
        info.add(4).writeU32(1);
        // pbNonce (ptr @ 8)
        info.add(8).writePointer(noncePtr);
        // cbNonce (u32 @ 16)
        info.add(16).writeU32(12);
        // pbAuthData (ptr @ 24) — null
        // cbAuthData (u32 @ 32) — 0
        // pbTag (ptr @ 40)
        info.add(40).writePointer(tagPtr);
        // cbTag (u32 @ 48)
        info.add(48).writeU32(16);
        // remainder (MacContext, AAD, cbData, flags) all zero

        const status = encFn(
            g_keyHandle,
            pBuf, pt.length,
            info,
            ptr(0), 0,                  // pbIV/cbIV unused for GCM
            cBuf, pt.length,
            pcb, 0
        );
        if (status !== 0) {
            return {ok:false, error:'BCryptEncrypt status=0x'+(status>>>0).toString(16)};
        }
        const got = pcb.readU32();
        const cipher = new Uint8Array(cBuf.readByteArray(got));
        const tag = new Uint8Array(tagPtr.readByteArray(16));
        return {
            ok:true,
            nonce_hex: hexFromBytes(nonce),
            cipher_hex: hexFromBytes(cipher),
            tag_hex: hexFromBytes(tag),
            cipher_len: got
        };
    },

    sendRaw(sock, hex) {
        if (!sendFn) return {ok:false, error:'no send fn'};
        const bytes = bytesFromHex(hex);
        const buf = Memory.alloc(bytes.length || 1);
        buf.writeByteArray(Array.from(bytes));
        const written = sendFn(sock, buf, bytes.length, 0);
        return {ok: written > 0, n_written: written};
    }
};

send({type:'log', msg:'replay RPC ready'});
"""


def mutate_color_to_red(plaintext: bytes) -> bytes:
    """Take a captured SetMatrixLED plaintext and rewrite TextColorR/G/B
    fields to (255, 0, 0). Returns new plaintext bytes.

    Also rewrites the per-layer "color":[r,g,b] arrays inside the embedded
    `fx` JSON to keep both representations consistent.
    """
    fields = ap.deserialize(plaintext, strict=False)
    new_fields = []
    for f in fields:
        if f.name == "TextColorR[0]":
            new_fields.append(ap.WStr("TextColorR[0]", "255"))
        elif f.name == "TextColorG[0]":
            new_fields.append(ap.WStr("TextColorG[0]", "0"))
        elif f.name == "TextColorB[0]":
            new_fields.append(ap.WStr("TextColorB[0]", "0"))
        elif f.name == "fx":
            # rewrite [r,g,b] arrays inside the JSON-encoded fx blob
            try:
                fx_str = f.payload.decode("utf-16-le").rstrip("\x00")
                import re as _re
                fx_str = _re.sub(
                    r'"color":\[\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\]',
                    '"color":[255,0,0]',
                    fx_str,
                )
                new_fields.append(ap.WStr("fx", fx_str))
            except Exception:
                new_fields.append(f)  # keep original if parse fails
        else:
            new_fields.append(f)
    return ap.serialize(new_fields)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("pid", type=int, help="UserSessionHelper PID")
    parser.add_argument(
        "--plaintext",
        default="scratch/captures/setmatrixled_plaintext.bin",
        help="captured SetMatrixLED plaintext to base the replay on",
    )
    parser.add_argument(
        "--mode",
        choices=("dryrun", "replay-exact", "replay-red"),
        default="dryrun",
    )
    parser.add_argument("--wait-for-key", type=int, default=20,
                        help="seconds to wait for first BCryptEncrypt observation")
    args = parser.parse_args()

    plain_path = Path(args.plaintext)
    if not plain_path.exists():
        print(f"[!] missing plaintext: {plain_path}")
        return 1
    captured_pt = plain_path.read_bytes()
    print(f"[+] captured plaintext: {len(captured_pt)} bytes")

    if args.mode == "replay-red":
        new_pt = mutate_color_to_red(captured_pt)
        print(f"[+] mutated to RED: {len(new_pt)} bytes (delta {len(new_pt) - len(captured_pt):+d})")
    elif args.mode == "replay-exact":
        new_pt = captured_pt
        print(f"[+] using captured plaintext byte-for-byte")
    else:
        print(f"[+] DRYRUN — won't send")
        new_pt = mutate_color_to_red(captured_pt)
        print(f"[+] mutated plaintext sample (first 200B): {new_pt[:200].hex()}")
        return 0

    print(f"[+] attaching to PID {args.pid}")
    session = frida.attach(args.pid)
    script = session.create_script(JS)
    def on_msg(m, d):
        if m["type"] == "send":
            p = m["payload"]
            if p.get("type") == "log":
                print(f"[frida] {p['msg']}")
        elif m["type"] == "error":
            print(f"[!] frida error: {m.get('description')}")
    script.on("message", on_msg)
    script.load()
    print("[+] script loaded — waiting for first BCryptEncrypt observation...")

    deadline = time.time() + args.wait_for_key
    while time.time() < deadline:
        s = script.exports_sync.state()
        if s["has_key"] and s["send_socket"]:
            break
        time.sleep(0.5)
    s = script.exports_sync.state()
    print(f"[+] state: {json.dumps(s, indent=2)}")
    if not s["has_key"]:
        print("[!] key not captured — UserSessionHelper hasn't done a BCryptEncrypt in this window.")
        print("    Tell Vlad to interact with Armoury Crate UI to provoke one, then retry.")
        session.detach()
        return 1

    # Encrypt
    enc = script.exports_sync.encrypt(new_pt.hex())
    if not enc["ok"]:
        print(f"[!] encrypt failed: {enc.get('error')}")
        session.detach()
        return 1
    nonce = bytes.fromhex(enc["nonce_hex"])
    cipher = bytes.fromhex(enc["cipher_hex"])
    tag = bytes.fromhex(enc["tag_hex"])
    print(f"[+] encrypted: nonce={len(nonce)}b cipher={len(cipher)}b tag={len(tag)}b")

    # Build wire frame: u32-LE total-length || nonce || cipher || tag
    body = nonce + cipher + tag
    wire = struct.pack("<I", len(body)) + body
    print(f"[+] wire frame: {len(wire)} bytes (4-byte length + {len(body)}-byte body)")

    # Send
    if not s["send_socket"]:
        print("[!] no send socket captured")
        session.detach()
        return 1
    res = script.exports_sync.send_raw(s["send_socket"], wire.hex())
    print(f"[+] send_raw -> {res}")
    print()
    print("VLAD: did the matrix change color in the last second?")
    time.sleep(2)
    session.detach()
    return 0


if __name__ == "__main__":
    sys.exit(main())
