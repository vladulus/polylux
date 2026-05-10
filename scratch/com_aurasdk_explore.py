"""Explore the ASUS AURA SDK / Aac3572MbHal COM interfaces.

Findings from this session (2026-05-10):

1. The motherboard HAL is registered as a COM LocalServer:
     CLSID = {E7C8DA76-C9B9-4297-8681-DD878330AFE7}
     ProgID = ASUSAuraMBHal.Hal.1
     LocalServer32 = C:\\Program Files\\ASUS\\AacMB\\Aac3572MbHal_x64.exe
     (WOW6432Node points to _x86.exe)

   Note: this CLSID is the SAME UUID as the matrix device path used in the
   AURA_3.0 XML (`E7C8DA76-...`) — so the COM CLSID and the device PID are
   intentionally identical.

2. CoCreateInstance against this CLSID FAILS with E_UNEXPECTED (0x8000FFFF)
   from a regular user. Probably AppID launch permission requires SYSTEM
   or a specific account. Both x86 and x64 LocalServer paths fail the same.

3. AuraSdk top-level COM works without elevation:
     CLSID = {05921124-5057-483E-A037-E9497B523590}  "aura sdk Class"
     IAuraSdk methods: SwitchMode, Enumerate(devType), ReleaseControl(reserve),
                       RequireTokenByType(types[], numberOftypes),
                       RequireDeviceControlState(Type)

4. But Enumerate() returns 0 devices for every devType tested
   (1, 2, 4, 8, 0x10000, 0x20000, 0x40000, 0xFFFFFFFF). RequireTokenByType
   returns None for all. Likely cause: AURA RGB is disabled in BIOS on
   Vlad's machine, so the SDK sees no controllable RGB devices. Matrix is
   separate hardware (motherboard chipset, not RGB-strip), so even if BIOS
   RGB were enabled, AuraSdk might not expose it.

Other CLSIDs of interest (not yet explored):
  {662181CB-F1F8-4AD8-ABDD-3661A51A85C7}  ASUSAuraExtCardHal
  {D152D981-D7D7-4794-9602-73CFC80D6478}  AacKingstonDramHal
  {E1120EAD-71E1-48C8-91CD-C405A22F8B7C}  ASUSAuraAmbientHal
  {34B707DC-1133-4EBC-B380-21387A50A89D}  AuraDevelopement Class
  {CA5171D0-95CB-3DA8-A095-A70B39FD6EE0}  AsusAuraColorGenerator.HSLColor

Next session: try AuraDevelopement Class — looks like a richer dev-mode
interface. Or hook the live LightingService process to find what COM
calls IT makes when matrix Apply happens (ITypeLib resolves IAuraSdk2
or similar internal interfaces).
"""
import sys
import win32com.client


CLSIDS = {
    'ASUSAuraMBHal':            '{E7C8DA76-C9B9-4297-8681-DD878330AFE7}',
    'aura sdk Class':           '{05921124-5057-483E-A037-E9497B523590}',
    'AuraDevelopement Class':   '{34B707DC-1133-4EBC-B380-21387A50A89D}',
    'AsusAuraExtCardHal':       '{662181CB-F1F8-4AD8-ABDD-3661A51A85C7}',
    'AacKingstonDramHal':       '{D152D981-D7D7-4794-9602-73CFC80D6478}',
    'ASUSAuraAmbientHal':       '{E1120EAD-71E1-48C8-91CD-C405A22F8B7C}',
    'AsusAuraColorGenerator':   '{CA5171D0-95CB-3DA8-A095-A70B39FD6EE0}',
}


def explore(label: str, clsid: str) -> None:
    print(f"\n=== {label} {clsid} ===")
    try:
        obj = win32com.client.Dispatch(clsid)
    except Exception as ex:
        print(f"  Dispatch failed: {ex}")
        return

    try:
        ti = obj._oleobj_.GetTypeInfo()
        attr = ti.GetTypeAttr()
        print(f"  IID: {attr.iid}")
        print(f"  Functions: {attr.cFuncs}")
        for i in range(attr.cFuncs):
            fd = ti.GetFuncDesc(i)
            names = ti.GetNames(fd.memid)
            if names[0] in ('QueryInterface', 'AddRef', 'Release',
                            'GetTypeInfoCount', 'GetTypeInfo',
                            'GetIDsOfNames', 'Invoke'):
                continue  # IUnknown/IDispatch boilerplate
            sig = f"{names[0]}({', '.join(names[1:])})"
            print(f"    {sig}")
    except Exception as ex:
        print(f"  type info failed: {ex}")


def main():
    for label, clsid in CLSIDS.items():
        explore(label, clsid)


if __name__ == '__main__':
    main()
