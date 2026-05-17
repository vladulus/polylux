@echo off
REM Stop + delete PolyluxSensorDaemon. Called from Inno [UninstallRun].

sc stop PolyluxSensorDaemon >nul 2>&1
timeout /t 2 /nobreak >nul
sc delete PolyluxSensorDaemon >nul 2>&1

exit /b 0
