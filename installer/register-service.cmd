@echo off
REM Idempotent: re-register PolyluxSensorDaemon to bin path passed as %1.
REM Called from Inno [Run] with %1 = full path to PolyluxSensorDaemon.exe.

setlocal
set "EXE=%~1"
if "%EXE%"=="" set "EXE=%~dp0PolyluxSensorDaemon.exe"

REM Kill any leftover LHM.exe from the legacy v0.4 path so port 8085 is free.
taskkill /F /IM LibreHardwareMonitor.exe >nul 2>&1

sc stop PolyluxSensorDaemon >nul 2>&1
timeout /t 1 /nobreak >nul
sc delete PolyluxSensorDaemon >nul 2>&1
timeout /t 1 /nobreak >nul

sc create PolyluxSensorDaemon binPath= "\"%EXE%\"" start= auto DisplayName= "Polylux Sensor Daemon"
if errorlevel 1 (
    echo Failed to create service.
    exit /b 1
)

sc description PolyluxSensorDaemon "Headless LibreHardwareMonitor wrapper for Polylux. Serves /data.json on 127.0.0.1:8085."
sc failure PolyluxSensorDaemon reset= 86400 actions= restart/5000/restart/5000/restart/30000

sc start PolyluxSensorDaemon
if errorlevel 1 (
    echo Failed to start service.
    exit /b 1
)

REM Remove legacy v0.4 scheduled task if present.
schtasks /Delete /TN PolyluxLHM /F >nul 2>&1

exit /b 0
