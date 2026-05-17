# Build the Polylux Sensor Daemon as a self-contained single-file exe.
# No admin required. Output: tools/PolyluxSensorDaemon/publish/PolyluxSensorDaemon.exe (~37 MB).
#
# If .NET 8 SDK is not on PATH, falls back to the per-user install at
# %LOCALAPPDATA%\Microsoft\dotnet\dotnet.exe. If neither exists, runs
# dotnet-install.ps1 to put one there (per-user, no UAC).

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$proj = Join-Path $repoRoot 'tools\PolyluxSensorDaemon\PolyluxSensorDaemon.csproj'
$out  = Join-Path $repoRoot 'tools\PolyluxSensorDaemon\publish'

function Resolve-Dotnet {
    $cmd = Get-Command dotnet -ErrorAction SilentlyContinue
    if ($cmd) {
        $sdks = & $cmd.Source --list-sdks 2>$null
        if ($sdks -match '^8\.') { return $cmd.Source }
    }
    $userDotnet = Join-Path $env:LOCALAPPDATA 'Microsoft\dotnet\dotnet.exe'
    if (Test-Path $userDotnet) {
        $sdks = & $userDotnet --list-sdks 2>$null
        if ($sdks -match '^8\.') { return $userDotnet }
    }
    Write-Host "Installing .NET 8 LTS SDK per-user (no UAC)..." -ForegroundColor Yellow
    $tmp = Join-Path $env:TEMP 'dotnet-install.ps1'
    Invoke-WebRequest -UseBasicParsing 'https://dot.net/v1/dotnet-install.ps1' -OutFile $tmp
    & $tmp -Channel '8.0' -Quality 'GA' -InstallDir (Split-Path $userDotnet -Parent) -NoPath
    if (-not (Test-Path $userDotnet)) { throw "dotnet-install failed" }
    return $userDotnet
}

$dotnet = Resolve-Dotnet
Write-Host "Using $dotnet" -ForegroundColor Cyan

& $dotnet publish $proj -c Release -o $out
if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed (exit $LASTEXITCODE)" }

$exe = Join-Path $out 'PolyluxSensorDaemon.exe'
if (-not (Test-Path $exe)) { throw "Expected $exe to exist after publish" }

$size = [math]::Round((Get-Item $exe).Length / 1MB, 1)
Write-Host ""
Write-Host "[OK] Built $exe ($size MB)" -ForegroundColor Green
Write-Host "Next: register as a Windows service with"
Write-Host "  powershell -ExecutionPolicy Bypass -File tools\install_sensor_daemon_service.ps1"
Write-Host "(needs elevation; one-time UAC)."
