@echo off
setlocal
set "PROJECT=%~dp0"
call "%PROJECT%stop_listener.cmd" >nul 2>nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "$script = '%PROJECT%feishu_group_to_base.py'; $args = '-u \"' + $script + '\"'; Start-Process -FilePath 'python' -ArgumentList $args -WorkingDirectory '%PROJECT%' -RedirectStandardOutput '%PROJECT%feishu_group_to_base.out.log' -RedirectStandardError '%PROJECT%feishu_group_to_base.err.log' -WindowStyle Hidden"
echo Started Feishu listener. Check feishu_group_to_base.err.log for connection status.
endlocal
