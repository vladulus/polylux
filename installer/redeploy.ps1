# Rebuild the frozen app and swap it into Program Files, then relaunch.
#
#   powershell -ExecutionPolicy Bypass -File installer\redeploy.ps1 [-NoBuild]
#
# The running Polylux is the PyInstaller build in C:\Program Files\Polylux,
# not the repo source, so every source change needs this. One UAC prompt
# (Program Files). The sensor daemon is skipped: its service holds the exe
# open; it is swapped separately (tools\build_sensor_daemon.ps1 + a service
# stop/copy/start).
param([switch]$NoBuild)
$ErrorActionPreference = 'Stop'

$repo = Split-Path $PSScriptRoot -Parent
$src = Join-Path $repo 'installer\dist\Polylux'
$dst = 'C:\Program Files\Polylux'
$cfg = Join-Path $env:APPDATA 'Polylux\polylux.yaml'

if (-not $NoBuild) {
    & (Join-Path $repo '.venv\Scripts\pyinstaller.exe') (Join-Path $repo 'installer\polylux.spec') `
        --noconfirm --distpath (Join-Path $repo 'installer\dist') --workpath (Join-Path $repo 'installer\build')
    if ($LASTEXITCODE -ne 0) { throw "pyinstaller failed (exit $LASTEXITCODE)" }
}

# Config saves are debounced 2 s; wait that out after the window closes.
$swap = @"
Get-Process Polylux -ErrorAction SilentlyContinue | ForEach-Object { `$_.CloseMainWindow() | Out-Null }
Start-Sleep 3
Get-Process Polylux -ErrorAction SilentlyContinue | Stop-Process -Force
# OpenRGB is Polylux's child but outlives it and locks _internal\tools\OpenRGB.
Get-Process OpenRGB -ErrorAction SilentlyContinue | Where-Object { `$_.Path -like '$dst\*' } | Stop-Process -Force
Start-Sleep 1
robocopy "$src" "$dst" /E /XD "$src\_internal\tools\PolyluxSensorDaemon" /NFL /NDL /NJH /NJS /NP | Out-Null
exit [int](`$LASTEXITCODE -ge 8)
"@
$p = Start-Process powershell -Verb RunAs -Wait -PassThru -ArgumentList '-NoProfile', '-Command', $swap
if ($p.ExitCode -ne 0) { throw "copy into $dst failed" }

Start-Process (Join-Path $dst 'Polylux.exe') -ArgumentList '--config', $cfg
Write-Host "[OK] Polylux redeployed from $src" -ForegroundColor Green
