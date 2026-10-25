# Capture all USB traffic on every USBPcap root hub until a stop flag appears.
# Run elevated (USBPcap needs admin). Stop from a normal shell with:
#   New-Item "$env:TEMP\polylux_capture.stop"
# Output: scratch\captures\<Name>_USBPcapN.pcap

param([Parameter(Mandatory)][string]$Name, [string]$StopFlag)

$cmd  = 'C:\Program Files\USBPcap\USBPcapCMD.exe'
$out  = Join-Path $PSScriptRoot '..\scratch\captures'
if (-not $StopFlag) { $StopFlag = Join-Path $env:TEMP 'polylux_capture.stop' }
Remove-Item $StopFlag -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $out | Out-Null

$ifaces = & $cmd --extcap-interfaces | ForEach-Object {
    if ($_ -match 'value=(\\\\\.\\USBPcap\d+)') { $Matches[1] }
}
$procs = foreach ($i in $ifaces) {
    $file = Join-Path $out ("{0}_{1}.pcap" -f $Name, ($i -replace '.*\\', ''))
    Start-Process $cmd -ArgumentList '-d', $i, '-o', "`"$file`"", '-A' -WindowStyle Hidden -PassThru
}

while (-not (Test-Path $StopFlag)) { Start-Sleep -Milliseconds 500 }
$procs | Stop-Process -Force -ErrorAction SilentlyContinue
Remove-Item $StopFlag -ErrorAction SilentlyContinue
