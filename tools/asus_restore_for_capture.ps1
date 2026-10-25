# Undo installer/neutralize-asus.cmd so Armoury Crate can drive the hardware
# for a USBPcap capture session. Run elevated. Re-neutralize afterwards with
# installer\neutralize-asus.cmd (also elevated).
#
# Polylux is stopped too: it holds the chips and its startup kill_asus_stack()
# would kill AC again. It comes back at next logon (HKCU Run key) and kills AC
# then, so capture before rebooting.

$log = Join-Path $env:TEMP 'polylux_asus_restore.log'
Start-Transcript -Path $log -Force | Out-Null

Stop-Process -Name Polylux, OpenRGB -Force -ErrorAction SilentlyContinue

$services = 'ArmouryCrateService', 'AsusCertService', 'AsusFanControlService',
            'LightingService', 'ROG Live Service', 'ROGLiveService', 'ROGLiveServiceV2', 'asComSvc'
foreach ($s in $services) {
    if (-not (Get-Service -Name $s -ErrorAction SilentlyContinue)) { continue }
    Set-Service -Name $s -StartupType Automatic
    try { Start-Service -Name $s -ErrorAction Stop } catch { Write-Host "start $s failed: $_" }
}

foreach ($t in 'ASUS\Armoury Crate Control Interface', 'ASUS\ArmouryCrate',
               'ASUS\ASUS Live Update', 'ASUS\AssistantTaskName', 'ArmouryCrateUpdater') {
    schtasks /Change /TN $t /Enable 2>&1 | Out-Null
}

Get-Service -Name $services -ErrorAction SilentlyContinue |
    Format-Table Name, Status, StartType -AutoSize | Out-Host
Stop-Transcript | Out-Null
