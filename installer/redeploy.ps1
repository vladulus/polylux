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

# The elevated half runs from a file so robocopy's log survives a failure.
$log = Join-Path $env:TEMP 'polylux-redeploy.log'
$swapFile = Join-Path $env:TEMP 'polylux-redeploy-swap.ps1'
@"
# Config saves are debounced 2 s; wait that out after the window closes.
Get-Process Polylux -ErrorAction SilentlyContinue | ForEach-Object { `$_.CloseMainWindow() | Out-Null }
Start-Sleep 3
Get-Process Polylux -ErrorAction SilentlyContinue | Stop-Process -Force
# OpenRGB is Polylux's child but outlives it and locks _internal\tools\OpenRGB.
Get-Process OpenRGB -ErrorAction SilentlyContinue | Where-Object { `$_.Path -like '$dst\*' } | Stop-Process -Force
Get-Process Polylux, OpenRGB -ErrorAction SilentlyContinue | Wait-Process -Timeout 15 -ErrorAction SilentlyContinue
robocopy "$src" "$dst" /E /R:3 /W:2 /XD "$src\_internal\tools\PolyluxSensorDaemon" /NP /NJH /LOG:"$log"
exit [int](`$LASTEXITCODE -ge 8)
"@ | Set-Content -Encoding UTF8 $swapFile
$p = Start-Process powershell -Verb RunAs -Wait -PassThru -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $swapFile
if ($p.ExitCode -ne 0) { throw "copy into $dst failed, see $log" }

Start-Process (Join-Path $dst 'Polylux.exe') -ArgumentList '--config', $cfg
Write-Host "[OK] Polylux redeployed from $src" -ForegroundColor Green
