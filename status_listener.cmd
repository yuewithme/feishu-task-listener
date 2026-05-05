@echo off
setlocal
set "PROJECT=%~dp0"
cd /d "%PROJECT%"
python feishu_group_to_base.py --status
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Get-CimInstance Win32_Process -ErrorAction Stop | Where-Object { ($_.CommandLine -like '*feishu_group_to_base.py*') -or ($_.CommandLine -like '*event*+subscribe*') -or ($_.CommandLine -like '*lark-cli*event*') } | Select-Object ProcessId,Name,CommandLine | ConvertTo-Json -Compress } catch { Write-Output ('Process query unavailable: ' + $_.Exception.Message) }"
endlocal
