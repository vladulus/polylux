"""Probe TLS handshake on 127.0.0.1:9012.

Extract the server cert + the CA hints in the CertificateRequest message
(if any). That tells us which CA must have signed a usable client cert.
"""
from __future__ import annotations

import socket
import ssl
import sys


def probe(host: str, port: int) -> None:
    print(f"=== {host}:{port} ===")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    # accept self-signed
    raw = socket.create_connection((host, port), timeout=5)
    try:
        sock = ctx.wrap_socket(raw, server_hostname=host)
    except ssl.SSLError as e:
        print(f"  TLS error: {e}")
        return
    print(f"  TLS version: {sock.version()}")
    print(f"  cipher: {sock.cipher()}")
    cert_der = sock.getpeercert(binary_form=True)
    print(f"  server cert: {len(cert_der)} bytes (DER)")
    # Try to send a HTTP GET to trigger application layer
    try:
        sock.sendall(b"GET / HTTP/1.1\r\nHost: 127.0.0.1\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Version: 13\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n\r\n")
        sock.settimeout(3)
        data = sock.recv(2048)
        print(f"  recv ({len(data)}): {data[:600]!r}")
    except Exception as e:
        print(f"  recv error: {type(e).__name__}: {e}")
    finally:
        try: sock.close()
        except: pass

    # Parse cert subject/issuer
    import datetime
    try:
        # use cryptography if available
        from cryptography import x509
        from cryptography.hazmat.backends import default_backend
        cert = x509.load_der_x509_certificate(cert_der, default_backend())
        print(f"  subject: {cert.subject.rfc4514_string()}")
        print(f"  issuer:  {cert.issuer.rfc4514_string()}")
        print(f"  not_before: {cert.not_valid_before_utc}")
        print(f"  not_after:  {cert.not_valid_after_utc}")
        print(f"  serial: {cert.serial_number:x}")
    except ImportError:
        import ssl as _ssl
        print(_ssl.DER_cert_to_PEM_cert(cert_der)[:600])


if __name__ == "__main__":
    probe("127.0.0.1", 9012)
