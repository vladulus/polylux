; Polylux Windows installer — Inno Setup 6 script.
;
; Build: "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer\Polylux.iss
; Output: installer\Output\Polylux-Setup-<version>.exe
;
; Layout inside the bundle:
;   {app}\Polylux.exe                          PyInstaller-frozen entry
;   {app}\_internal\                           Python runtime + Qt + deps
;   {app}\_internal\tools\PolyluxSensorDaemon\PolyluxSensorDaemon.exe
;       (path matches polylux.service.external._SENSOR_DAEMON_EXE for the
;        subprocess fallback path; the Windows service uses the same binary)
;   {app}\_internal\tools\OpenRGB\OpenRGB Windows 64-bit\OpenRGB.exe
;       (path matches polylux.service.external._OPENRGB_EXE)
;   {app}\register-service.cmd                 [Run] helper
;   {app}\unregister-service.cmd               [UninstallRun] helper
;
; Per-user config (writeable without admin):
;   {userappdata}\Polylux\polylux.yaml         seeded from bundled default

#define MyAppName "Polylux"
#define MyAppVersion "0.5.0"
#define MyAppPublisher "Polylux"
#define MyAppURL "https://github.com/vladulus/polylux"
#define MyAppExeName "Polylux.exe"

[Setup]
AppId={{B9F1A2C8-4E1B-4D5C-B2C3-A1D4E5F6B7C8}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
PrivilegesRequired=admin
OutputBaseFilename=Polylux-Setup-{#MyAppVersion}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayName={#MyAppName} {#MyAppVersion}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "autostart"; Description: "Start Polylux automatically when I sign in"; GroupDescription: "Startup:"
Name: "desktopicon"; Description: "Create a &desktop icon"; GroupDescription: "Additional icons:"; Flags: unchecked

[Files]
; PyInstaller-frozen app — the whole dist/Polylux/ tree.
Source: "dist\Polylux\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

; Sensor daemon — installed under _internal/tools/ to match the path
; polylux.service.external resolves in dev mode.
Source: "..\tools\PolyluxSensorDaemon\publish\PolyluxSensorDaemon.exe"; \
    DestDir: "{app}\_internal\tools\PolyluxSensorDaemon\publish"; Flags: ignoreversion

; OpenRGB portable.
Source: "..\tools\OpenRGB\OpenRGB Windows 64-bit\*"; \
    DestDir: "{app}\_internal\tools\OpenRGB\OpenRGB Windows 64-bit"; Flags: ignoreversion recursesubdirs createallsubdirs

; Service control helpers.
Source: "register-service.cmd"; DestDir: "{app}"; Flags: ignoreversion
Source: "unregister-service.cmd"; DestDir: "{app}"; Flags: ignoreversion

; Default config — placed in per-user AppData on first install, never overwritten.
Source: "..\polylux.yaml"; DestDir: "{userappdata}\{#MyAppName}"; \
    DestName: "polylux.yaml"; Flags: onlyifdoesntexist uninsneveruninstall

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; \
    Parameters: "--config ""{userappdata}\{#MyAppName}\polylux.yaml"""
Name: "{group}\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; \
    Parameters: "--config ""{userappdata}\{#MyAppName}\polylux.yaml"""; \
    Tasks: desktopicon

[Registry]
; Run-on-logon (per-user). Removed cleanly on uninstall.
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; \
    ValueType: string; ValueName: "{#MyAppName}"; \
    ValueData: """{app}\{#MyAppExeName}"" --config ""{userappdata}\{#MyAppName}\polylux.yaml"""; \
    Flags: uninsdeletevalue; Tasks: autostart

[Run]
; Install sensor daemon as a Windows service. The .cmd handles
; kill-legacy-LHM, stop-existing-service, create, configure, start.
Filename: "{app}\register-service.cmd"; \
    Parameters: """{app}\_internal\tools\PolyluxSensorDaemon\publish\PolyluxSensorDaemon.exe"""; \
    StatusMsg: "Installing Polylux Sensor Daemon service..."; \
    Flags: runhidden waituntilterminated

; Optional: launch Polylux right after install completes.
Filename: "{app}\{#MyAppExeName}"; \
    Parameters: "--config ""{userappdata}\{#MyAppName}\polylux.yaml"""; \
    Description: "Launch {#MyAppName} now"; \
    Flags: postinstall nowait skipifsilent unchecked

[UninstallRun]
Filename: "{app}\unregister-service.cmd"; \
    RunOnceId: "RemovePolyluxSensorDaemon"; \
    Flags: runhidden waituntilterminated
