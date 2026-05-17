# Stop + delete the PolyluxSensorDaemon Windows service. Requires elevation.
# Leaves the exe in place (just a build artifact).

$ErrorActionPreference = 'Continue'

$isAdmin = ([Security.Principal.WindowsPrincipal] `
    [Security.Principal.WindowsIdentity]::GetCurrent() `
    ).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Re-launching with elevation (UAC)..." -ForegroundColor Yellow
    $args = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $PSCommandPath)
    Start-Process -FilePath 'powershell.exe' -ArgumentList $args -Verb RunAs
    exit
}

$svc = 'PolyluxSensorDaemon'

Write-Host "Stopping $svc..." -ForegroundColor Cyan
sc.exe stop $svc 2>&1 | Out-Null
Start-Sleep -Seconds 2

Write-Host "Deleting $svc..." -ForegroundColor Cyan
$out = & sc.exe delete $svc 2>&1
Write-Host $out

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Read-Host 'Press Enter to close'
