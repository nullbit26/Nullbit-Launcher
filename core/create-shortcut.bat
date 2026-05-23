@echo off
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $s = $ws.CreateShortcut('%~dp0NULLBIT.lnk'); ^
   $s.TargetPath = 'wscript.exe'; ^
   $s.Arguments = '\"%~dp0NULLBIT.vbs\"'; ^
   $s.WorkingDirectory = '%~dp0'; ^
   $s.IconLocation = '%~dp0assets\icon.ico'; ^
   $s.Description = 'NULLBIT Launcher'; ^
   $s.Save()"

echo [OK] Shortcut NULLBIT.lnk created.
echo You can now copy NULLBIT.lnk anywhere (desktop, taskbar, etc.)
pause
