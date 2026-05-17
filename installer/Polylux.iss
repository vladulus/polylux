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
Name: "autostart"; Description: "Start Polylux automatically when I sign in (minimized to tray)"; GroupDescription: "Startup:"
Name: "neutralize_asus"; Description: "Disable Armoury Crate / Aura / AsusCert services (Polylux replaces them — fully reversible)"; GroupDescription: "ASUS stack:"
Name: "desktopicon"; Description: "Create a &desktop icon"; GroupDescription: "Additional icons:"

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

; Service control + ASUS neutralize helpers.
Source: "register-service.cmd"; DestDir: "{app}"; Flags: ignoreversion
Source: "unregister-service.cmd"; DestDir: "{app}"; Flags: ignoreversion
Source: "neutralize-asus.cmd"; DestDir: "{app}"; Flags: ignoreversion

; Default config — placed in per-user AppData on first install, never overwritten.
Source: "..\polylux.yaml"; DestDir: "{userappdata}\{#MyAppName}"; \
    DestName: "polylux.yaml"; Flags: onlyifdoesntexist uninsneveruninstall

[Icons]
; Drop the shortcut directly under Start Menu\Programs (no Polylux\
; subfolder) so it shows up under "All apps → P → Polylux" with one
; click, not nested. Uninstall shortcut next to it for discoverability.
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; \
    Parameters: "--config ""{userappdata}\{#MyAppName}\polylux.yaml"""; \
    Comment: "Open Polylux (ASUS Armoury Crate replacement)"; \
    WorkingDir: "{app}"
Name: "{autoprograms}\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; \
    Parameters: "--config ""{userappdata}\{#MyAppName}\polylux.yaml"""; \
    Comment: "Open Polylux (ASUS Armoury Crate replacement)"; \
    WorkingDir: "{app}"; Tasks: desktopicon

[Registry]
; Run-on-logon (per-user). --minimized starts tray-only at boot so the
; full window doesn't pop on the user's face every login.
; Manual launches via Start menu / desktop shortcut omit --minimized,
; so a click on the shortcut opens the window like any normal app.
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; \
    ValueType: string; ValueName: "{#MyAppName}"; \
    ValueData: """{app}\{#MyAppExeName}"" --minimized --config ""{userappdata}\{#MyAppName}\polylux.yaml"""; \
    Flags: uninsdeletevalue; Tasks: autostart

[Run]
; Disable Armoury Crate stack (optional task). Runs before service
; install so AsusCertService is dead before PolyluxSensorDaemon starts
; — avoids the LHM-port-8085 collision scenario.
Filename: "{app}\neutralize-asus.cmd"; \
    StatusMsg: "Disabling Armoury Crate / Aura services..."; \
    Flags: runhidden waituntilterminated; \
    Tasks: neutralize_asus

; Install sensor daemon as a Windows service. The .cmd handles
; kill-legacy-LHM, stop-existing-service, create, configure, start.
Filename: "{app}\register-service.cmd"; \
    Parameters: """{app}\_internal\tools\PolyluxSensorDaemon\publish\PolyluxSensorDaemon.exe"""; \
    StatusMsg: "Installing Polylux Sensor Daemon service..."; \
    Flags: runhidden waituntilterminated

; Optional: launch Polylux right after install completes. Window opens
; (no --minimized) so the user actually sees something happen.
Filename: "{app}\{#MyAppExeName}"; \
    Parameters: "--config ""{userappdata}\{#MyAppName}\polylux.yaml"""; \
    Description: "Launch {#MyAppName} now"; \
    Flags: postinstall nowait skipifsilent unchecked

[UninstallRun]
Filename: "{app}\unregister-service.cmd"; \
    RunOnceId: "RemovePolyluxSensorDaemon"; \
    Flags: runhidden waituntilterminated

[Code]
// AppId from [Setup] above. Hardcoded here (rather than via the
// {#SetupSetting("AppId")} preprocessor) because Pascal-side string
// concatenation with the preprocessor leaks the outer brace escaping
// inconsistently across Inno versions.
const
  POLYLUX_UNINST_KEY =
    'Software\Microsoft\Windows\CurrentVersion\Uninstall\' +
    '{B9F1A2C8-4E1B-4D5C-B2C3-A1D4E5F6B7C8}_is1';

// Detect a prior Polylux install via the Inno-generated Uninstall key.
// Returns the absolute path to its unins000.exe, or '' if no prior
// install was found.
function PriorInstallUninstaller(): String;
var
  sUninstStr: String;
begin
  Result := '';
  // Inno writes the uninstall key under HKLM for admin installs (our
  // case) and HKCU for per-user installs — check both for resilience.
  if RegQueryStringValue(HKLM, POLYLUX_UNINST_KEY, 'UninstallString', sUninstStr) or
     RegQueryStringValue(HKCU, POLYLUX_UNINST_KEY, 'UninstallString', sUninstStr) then
  begin
    // Inno stores the value as: "C:\Program Files\Polylux\unins000.exe"
    // Strip the quotes for direct Exec().
    sUninstStr := RemoveQuotes(sUninstStr);
    if FileExists(sUninstStr) then
      Result := sUninstStr;
  end;
end;

// Run the prior install's uninstaller silently before we copy new files.
// Fresh-install behavior: every Polylux-Setup invocation produces a
// pristine {app} tree, no leftover dlls / stale Python bytecode / etc.
procedure CurStepChanged(CurStep: TSetupStep);
var
  sUninstaller: String;
  iResultCode: Integer;
begin
  if CurStep = ssInstall then
  begin
    Log('[Polylux] ssInstall: checking for prior install at ' + POLYLUX_UNINST_KEY);
    sUninstaller := PriorInstallUninstaller();
    if sUninstaller <> '' then
    begin
      Log('[Polylux] Prior install detected; running ' + sUninstaller);
      // /VERYSILENT hides the uninstall UI entirely.
      // /SUPPRESSMSGBOXES suppresses the "remove all settings?" prompt.
      // /NORESTART avoids reboot prompts during the chained install.
      if not Exec(sUninstaller,
                  '/VERYSILENT /SUPPRESSMSGBOXES /NORESTART',
                  '', SW_HIDE, ewWaitUntilTerminated, iResultCode) then
      begin
        Log('[Polylux] Prior uninstaller exec failed; continuing as overwrite install.');
      end
      else
      begin
        Log('[Polylux] Prior uninstaller exit code: ' + IntToStr(iResultCode));
        // Uninstaller deletes files asynchronously; give SCM + FS a
        // moment to settle before we start writing into the same dir.
        Sleep(1500);
      end;
    end
    else
    begin
      Log('[Polylux] No prior install detected; proceeding with fresh install.');
    end;
  end;
end;
