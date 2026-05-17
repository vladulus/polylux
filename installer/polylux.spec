# PyInstaller spec for Polylux. Build with:
#   .venv\Scripts\pyinstaller.exe installer\polylux.spec --noconfirm
#
# Produces dist\Polylux\Polylux.exe + dist\Polylux\_internal\ with the
# Python runtime + Qt6 + all runtime deps. ~250 MB folder. Inno Setup
# (see installer/Polylux.iss) packages this folder into a single .exe
# installer.
# -*- mode: python ; coding: utf-8 -*-
import os
from PyInstaller.utils.hooks import copy_metadata, collect_all

block_cipher = None
SPEC_DIR = os.path.dirname(os.path.abspath(SPEC))
REPO_ROOT = os.path.abspath(os.path.join(SPEC_DIR, '..'))

# Bundle the entire polylux/ui tree (skins, fonts, icons) so runtime
# Path(__file__) lookups still find them once frozen.
ui_datas = [(os.path.join(REPO_ROOT, 'polylux', 'ui'), 'polylux/ui')]

# libusb (and its transitive deps pkg_about / py-utlx) introspect their
# own dist-info metadata at import time via importlib.metadata. PyInstaller
# strips .dist-info by default — pull it back in for the full chain.
metadata_datas = (
    copy_metadata('libusb')
    + copy_metadata('pkg_about')
    + copy_metadata('py-utlx')
    + copy_metadata('packaging')
    + copy_metadata('build')
    + copy_metadata('typing_extensions')
    + copy_metadata('charset-normalizer')
)

# Grab every submodule of libusb so the platform-specific loader (e.g.
# libusb._platform._windows._lib) is bundled even though it's imported
# via runtime sys.platform dispatch.
libusb_datas, libusb_bins, libusb_hiddens = collect_all('libusb')

a = Analysis(
    [os.path.join(REPO_ROOT, 'polylux', 'service', '__main__.py')],
    pathex=[REPO_ROOT],
    binaries=libusb_bins,
    datas=ui_datas + metadata_datas + libusb_datas,
    hiddenimports=libusb_hiddens + [
        # PyQt6 plugins / openrgb subpackages PyInstaller's static
        # analysis can miss when loaded via getattr / importlib.
        'PyQt6.sip',
        'openrgb',
        'openrgb.utils',
        'openrgb.orgb',
        'pystray._win32',
        # libusb's transitive metadata-introspecting deps.
        'pkg_about',
        'pkg_about._about',
        'utlx',
        'build',
        'build.util',
        'packaging.version',
    ],
    hookspath=[],
    runtime_hooks=[],
    excludes=[
        # Dev-only deps — Polylux runtime never touches these.
        'frida',
        'frida_tools',
        'opencv',
        'cv2',
        'pytest',
        'pytest_qt',
        'PyInstaller',
        'pyinstaller',
        'pip',
        'setuptools',
        'wheel',
        'tkinter',
        # Qt6 modules we don't use — strips ~150 MB.
        'PyQt6.QtWebEngineCore',
        'PyQt6.QtWebEngineWidgets',
        'PyQt6.QtMultimedia',
        'PyQt6.QtMultimediaWidgets',
        'PyQt6.Qt3DCore',
        'PyQt6.Qt3DRender',
        'PyQt6.QtCharts',
        'PyQt6.QtDataVisualization',
        'PyQt6.QtNetworkAuth',
        'PyQt6.QtPdf',
        'PyQt6.QtPdfWidgets',
        'PyQt6.QtPositioning',
        'PyQt6.QtQml',
        'PyQt6.QtQuick',
        'PyQt6.QtQuick3D',
        'PyQt6.QtQuickWidgets',
        'PyQt6.QtRemoteObjects',
        'PyQt6.QtSensors',
        'PyQt6.QtSerialPort',
        'PyQt6.QtTextToSpeech',
    ],
    cipher=block_cipher,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='Polylux',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    # console=True for v0.5 MVP so stdout logs from polylux.service stay
    # visible. v0.6 polish: switch to console=False + file-based logging
    # so Run-on-logon doesn't pop a black window every boot.
    console=True,
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=False,
    upx_exclude=[],
    name='Polylux',
)
