"""Capture (plaintext, nonce, ciphertext, tag) tuples from BCryptEncrypt.

Confirms:
  1. The extracted AES-256 key from frida_export_key.py works
  2. Cipher mode is AES-GCM (12B nonce, 16B tag, no AAD)
  3. Polylux can encrypt/decrypt UserSessionHelper traffic from pure Python

Output: scratch/captures/v0.2/gcm_pairs.jsonl with tuples we can verify offline.
"""
import sys, time, json, frida, pathlib


JS = r"""
'use strict';

let count = 0;
const MAX = 8;

const fn = Process.findModuleByName('bcrypt.dll').findExportByName('BCryptEncrypt');

Interceptor.attach(fn, {
    onEnter(args) {
        // Skip size-query calls (cbOutput=0 means querying required size)
        const cbOut = args[7].toInt32();
        if (cbOut === 0) { this.skip = true; return; }

        // Need padding info for GCM
        if (args[3].isNull()) { this.skip = true; return; }

        this.skip = false;
        this.pPlain = args[1];
        this.cbPlain = args[2].toInt32();
        this.pCipher = args[6];
        this.cbCipher = cbOut;
        this.pcbResult = args[8];

        // Parse BCRYPT_AUTHENTICATED_CIPHER_MODE_INFO at args[3]
        const pPad = args[3];
        const cbInfo = pPad.readU32();
        if (cbInfo !== 0x58) { this.skip = true; return; }

        const pNonce = pPad.add(8).readPointer();
        const cbNonce = pPad.add(16).readU32();
        const pAuth   = pPad.add(24).readPointer();
        const cbAuth  = pPad.add(32).readU32();
        const pTag    = pPad.add(40).readPointer();
        const cbTag   = pPad.add(48).readU32();
        const dwFlags = pPad.add(72).readU32();  // BCRYPT_AUTH_MODE_*_FLAG

        this.nonce = pNonce.isNull() ? null : pNonce.readByteArray(cbNonce);
        this.aad   = (pAuth.isNull() || cbAuth === 0) ? null : pAuth.readByteArray(cbAuth);
        this.pTag  = pTag;
        this.cbTag = cbTag;
        this.dwFlags = dwFlags;

        // Snapshot plaintext now (input buffer)
        this.plain = this.pPlain.readByteArray(this.cbPlain);
    },
    onLeave(retval) {
        if (this.skip) return;
        if (retval.toInt32() !== 0) return;
        if (count >= MAX) return;

        const got = this.pcbResult.readU32();
        const cipher = this.pCipher.readByteArray(got);
        const tag = this.pTag.isNull() ? null : this.pTag.readByteArray(this.cbTag);

        count++;
        send({
            type: 'pair',
            n: count,
            cbPlain: this.cbPlain,
            cbCipher: got,
            dwFlags: this.dwFlags
        }, /* binary */ concat4(this.nonce, this.plain, cipher, tag));
    }
});

function concat4(a, b, c, d) {
    const ua = new Uint8Array(a || []);
    const ub = new Uint8Array(b || []);
    const uc = new Uint8Array(c || []);
    const ud = new Uint8Array(d || []);
    // Frame as 4x u32-LE lengths followed by each blob
    const total = 16 + ua.length + ub.length + uc.length + ud.length;
    const out = new Uint8Array(total);
    const dv = new DataView(out.buffer);
    dv.setUint32(0,  ua.length, true);
    dv.setUint32(4,  ub.length, true);
    dv.setUint32(8,  uc.length, true);
    dv.setUint32(12, ud.length, true);
    out.set(ua, 16);
    out.set(ub, 16 + ua.length);
    out.set(uc, 16 + ua.length + ub.length);
    out.set(ud, 16 + ua.length + ub.length + uc.length);
    return out.buffer;
}

send({type:'log', msg:'GCM pair-capture hook armed'});
"""


def main():
    if len(sys.argv) < 2:
        print("usage: <PID>"); sys.exit(2)
    pid = int(sys.argv[1])
    out_path = pathlib.Path("scratch/captures/v0.2/gcm_pairs.jsonl")
    out_path.parent.mkdir(parents=True, exist_ok=True)

    session = frida.attach(pid)
    script = session.create_script(JS)
    pairs = []

    def on_msg(m, data):
        if m['type'] != 'send': return
        p = m['payload']
        if p.get('type') == 'log':
            print('[frida]', p['msg']); return
        if p.get('type') == 'pair':
            # Parse 4 length-prefixed blobs from data
            import struct
            ln = struct.unpack_from('<4I', data, 0)
            off = 16
            nonce  = data[off:off+ln[0]]; off += ln[0]
            plain  = data[off:off+ln[1]]; off += ln[1]
            cipher = data[off:off+ln[2]]; off += ln[2]
            tag    = data[off:off+ln[3]]; off += ln[3]
            entry = {
                'n': p['n'],
                'cbPlain': p['cbPlain'],
                'cbCipher': p['cbCipher'],
                'dwFlags': p['dwFlags'],
                'nonce_hex':  nonce.hex(),
                'plain_hex':  plain.hex(),
                'cipher_hex': cipher.hex(),
                'tag_hex':    tag.hex(),
            }
            pairs.append(entry)
            print(f"[+] pair #{p['n']}: plain={ln[1]}B cipher={ln[2]}B nonce={ln[0]}B tag={ln[3]}B flags=0x{p['dwFlags']:x}")

    script.on('message', on_msg)
    script.load()
    print(f'[+] capturing 15s on PID {pid}')
    time.sleep(15)
    session.detach()

    with out_path.open('w') as f:
        for entry in pairs:
            f.write(json.dumps(entry) + '\n')
    print(f'[+] wrote {len(pairs)} pairs to {out_path}')


if __name__ == "__main__":
    main()
