@echo off
REM Optional install-time hardening: stop + disable the Armoury Crate /
REM Aura / AsusCert service stack so Polylux owns the chips at every
REM boot. Fully reversible — re-enable via services.msc to roll back.
REM
REM We DISABLE rather than uninstall — uninstalling ASUS apps touches
REM kernel drivers and is known to leave a half-broken state across
REM the wider ASUS app family (Sonic Studio, AI Suite, etc.).
REM
REM Order matters: AsusCertService refuses to stop while its child
REM process Aac3572MbHal_x86 is running. Kill children FIRST, then
REM stop+disable services, then verify.
REM
REM List mirrors polylux/service/kill_asus_stack.py.

setlocal enabledelayedexpansion

REM ---- 1. Kill all ASUS userland processes (children of the services). ----
for %%P in (Aac3572MbHal_x86 Aac3572DramHal_x86 ArmouryCrate ArmouryCrate.Service ArmouryCrate.UserSessionHelper ArmouryCrateControlInterface ArmouryHtmlDebugServer ArmourySocketServer ArmourySwAgent asus_framework LightingService ROGLiveService) do (
    taskkill /F /IM %%P.exe >nul 2>&1
)

REM ---- 2. Stop + disable the supervising services. ----
REM PowerShell Stop-Service is more robust than sc.exe — it handles the
REM stop-pending state, waits for the SCM to acknowledge, and gives a
REM clearer pass/fail outcome. Set-Service for the start type.
set "SERVICES=ArmouryCrateService AsusCertService AsusFanControlService LightingService ROGLiveService ROGLiveServiceV2 asComSvc"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$svcs = '%SERVICES%' -split ' '; ^
   foreach ($s in $svcs) { ^
     try { Stop-Service -Name $s -Force -ErrorAction Stop } catch {} ^
     try { Set-Service -Name $s -StartupType Disabled -ErrorAction Stop } catch {} ^
   }"

REM ---- 3. Disable known ASUS scheduled tasks that re-launch at logon. ----
for %%T in ("ASUS\Armoury Crate Control Interface" "ASUS\ArmouryCrate" "ASUS\ASUS Live Update" "ASUS\AssistantTaskName" "ArmouryCrateUpdater") do (
    schtasks /Change /TN %%T /Disable >nul 2>&1
)

REM ---- 4. Final pass: re-kill anything the service tried to respawn. ----
timeout /t 1 /nobreak >nul
for %%P in (Aac3572MbHal_x86 LightingService ArmouryCrate ROGLiveService) do (
    taskkill /F /IM %%P.exe >nul 2>&1
)

exit /b 0
