# Back to Polylux after a capture session: the PowerShell twin of
# installer\neutralize-asus.cmd (same lists). The .cmd left the services on
# Automatic when run on 2026-10-25; this one checks and reports each step.
# Run elevated.

$log = Join-Path $env:TEMP 'polylux_asus_neutralize.log'
Start-Transcript -Path $log -Force | Out-Null

$procs = 'Aac3572MbHal_x86', 'Aac3572DramHal_x86', 'ArmouryCrate', 'ArmouryCrate.Service',
         'ArmouryCrate.UserSessionHelper', 'ArmouryCrateControlInterface', 'ArmouryHtmlDebugServer',
         'ArmourySocketServer', 'ArmourySwAgent', 'asus_framework', 'LightingService', 'ROGLiveService'
Stop-Process -Name $procs -Force -ErrorAction SilentlyContinue

$services = 'ArmouryCrateService', 'AsusCertService', 'AsusFanControlService',
            'LightingService', 'ROG Live Service', 'ROGLiveService', 'ROGLiveServiceV2', 'asComSvc'
foreach ($s in $services) {
    if (-not (Get-Service -Name $s -ErrorAction SilentlyContinue)) { continue }
    try { Stop-Service -Name $s -Force -ErrorAction Stop } catch { Write-Host "stop $s failed: $_" }
    try { Set-Service -Name $s -StartupType Disabled -ErrorAction Stop } catch { Write-Host "disable $s failed: $_" }
}

foreach ($t in 'ASUS\Armoury Crate Control Interface', 'ASUS\ArmouryCrate',
               'ASUS\ASUS Live Update', 'ASUS\AssistantTaskName', 'ArmouryCrateUpdater') {
    schtasks /Change /TN $t /Disable 2>&1 | Out-Null
}

Start-Sleep -Seconds 1
Stop-Process -Name 'Aac3572MbHal_x86', 'LightingService', 'ArmouryCrate', 'ROGLiveService' -Force -ErrorAction SilentlyContinue

Get-Service -Name $services -ErrorAction SilentlyContinue |
    Format-Table Name, Status, StartType -AutoSize | Out-Host
Stop-Transcript | Out-Null
