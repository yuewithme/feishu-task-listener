@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -Command "$old = Get-CimInstance Win32_Process | Where-Object { ($_.CommandLine -like '*feishu_group_to_base.py*') -or ($_.CommandLine -like '*event*+subscribe*') -or ($_.CommandLine -like '*lark-cli*event*') }; foreach ($p in $old) { Stop-Process -Id $p.ProcessId -Force }; $old | Select-Object ProcessId,Name,CommandLine | ConvertTo-Json -Compress"
endlocal
