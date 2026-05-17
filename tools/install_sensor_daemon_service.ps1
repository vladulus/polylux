# Register PolyluxSensorDaemon as a Windows service running as LocalSystem.
# Requires elevation (UAC). One-time setup; afterwards the service auto-starts
# at boot with no UI / no tray / zero prompts.
#
# Also removes the legacy PolyluxLHM scheduled task left over from v0.4 if
# present, since the new daemon supersedes the LibreHardwareMonitor.exe path.

$ErrorActionPreference = 'Stop'

# Self-elevate if not already admin.
$isAdmin = ([Security.Principal.WindowsPrincipal] `
    [Security.Principal.WindowsIdentity]::GetCurrent() `
    ).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Re-launching with elevation (UAC)..." -ForegroundColor Yellow
    $args = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $PSCommandPath)
    Start-Process -FilePath 'powershell.exe' -ArgumentList $args -Verb RunAs
    exit
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$exe = Join-Path $repoRoot 'tools\PolyluxSensorDaemon\publish\PolyluxSensorDaemon.exe'

if (-not (Test-Path $exe)) {
    Write-Host "ERROR: $exe missing." -ForegroundColor Red
    Write-Host "Build it first:" -ForegroundColor Red
    Write-Host "  powershell -ExecutionPolicy Bypass -File tools\build_sensor_daemon.ps1"
    Read-Host 'Press Enter to close'
    exit 1
}

$svc = 'PolyluxSensorDaemon'

Write-Host "Stopping existing $svc service if present..." -ForegroundColor Cyan
sc.exe stop $svc 2>&1 | Out-Null
Start-Sleep -Seconds 1

Write-Host "Removing existing $svc service if present..." -ForegroundColor Cyan
sc.exe delete $svc 2>&1 | Out-Null
Start-Sleep -Seconds 1

Write-Host "Creating $svc service..." -ForegroundColor Cyan
# Quoting note: sc.exe binPath= requires the trailing space after = and the
# whole value wrapped in quotes if it contains spaces.
$binPath = "`"$exe`""
$rc = & sc.exe create $svc binPath= $binPath start= auto DisplayName= "Polylux Sensor Daemon"
if ($LASTEXITCODE -ne 0) { throw "sc create failed: $rc" }

Write-Host "Setting service description..." -ForegroundColor Cyan
sc.exe description $svc "Headless LibreHardwareMonitor wrapper for Polylux. Serves /data.json on 127.0.0.1:8085." | Out-Null

Write-Host "Setting failure recovery (restart on crash)..." -ForegroundColor Cyan
sc.exe failure $svc reset= 86400 actions= restart/5000/restart/5000/restart/30000 | Out-Null

Write-Host "Starting $svc..." -ForegroundColor Cyan
$rc = & sc.exe start $svc
if ($LASTEXITCODE -ne 0) { throw "sc start failed: $rc" }
Start-Sleep -Seconds 2

# Cleanup legacy v0.4 scheduled task.
$legacyTask = 'PolyluxLHM'
$task = Get-ScheduledTask -TaskName $legacyTask -ErrorAction SilentlyContinue
if ($task) {
    Write-Host "Removing legacy scheduled task $legacyTask (v0.4 cleanup)..." -ForegroundColor Cyan
    Unregister-ScheduledTask -TaskName $legacyTask -Confirm:$false
}

# Verify.
$state = (sc.exe query $svc | Select-String 'STATE').ToString()
Write-Host ""
Write-Host "[OK] $svc installed. Current state: $state" -ForegroundColor Green
Write-Host "Smoke test:" -ForegroundColor Cyan
try {
    $resp = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:8085/health' -TimeoutSec 5
    Write-Host "  /health -> $($resp.Content)" -ForegroundColor Green
} catch {
    Write-Host "  /health request failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "  Service may still be starting. Re-check in a few seconds with: curl http://127.0.0.1:8085/health"
}

Write-Host ""
Write-Host "Done. The daemon will auto-start on boot from now on." -ForegroundColor Green
Read-Host 'Press Enter to close'
