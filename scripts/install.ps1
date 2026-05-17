# Polylux one-shot installer.
#   irm https://raw.githubusercontent.com/vladulus/polylux/main/scripts/install.ps1 | iex
#
# 1. Resolves the latest release tag from the GitHub API.
# 2. Downloads the Polylux-Setup-<version>.exe asset to %TEMP%.
# 3. Runs it silently with the recommended default tasks (autostart,
#    neutralize_asus, desktopicon). One UAC prompt total.
#
# Re-run any time to upgrade. The installer's [Code] section will
# remove the prior install before laying down the new one.

$ErrorActionPreference = 'Stop'

$repo = 'vladulus/polylux'
$api  = "https://api.github.com/repos/$repo/releases/latest"

Write-Host "Fetching latest Polylux release info..." -ForegroundColor Cyan
$release = Invoke-RestMethod -UseBasicParsing -Uri $api -Headers @{ 'User-Agent' = 'polylux-installer' }
$asset = $release.assets | Where-Object { $_.name -like 'Polylux-Setup-*.exe' } | Select-Object -First 1
if (-not $asset) {
    throw "No Polylux-Setup-*.exe asset found in release $($release.tag_name)."
}

$outPath = Join-Path $env:TEMP $asset.name
Write-Host "Downloading $($asset.name) ($([math]::Round($asset.size / 1MB, 1)) MB)..." -ForegroundColor Cyan
Invoke-WebRequest -UseBasicParsing -Uri $asset.browser_download_url -OutFile $outPath

Write-Host "Launching installer (UAC will prompt once)..." -ForegroundColor Cyan
$installArgs = @(
    '/SILENT',
    '/SUPPRESSMSGBOXES',
    '/TASKS=autostart,neutralize_asus,desktopicon'
)
$proc = Start-Process -FilePath $outPath -ArgumentList $installArgs -Verb RunAs -Wait -PassThru
if ($proc.ExitCode -ne 0) {
    throw "Installer exited with code $($proc.ExitCode). Log: $env:LOCALAPPDATA\Polylux\install.log"
}

Write-Host ""
Write-Host "[OK] Polylux $($release.tag_name) installed." -ForegroundColor Green
Write-Host "    It should already be running in your tray." -ForegroundColor Green
Write-Host "    Click the icon to open the window."
