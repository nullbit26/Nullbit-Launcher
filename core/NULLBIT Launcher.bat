@echo off
cd /d "%~dp0"

:: Create desktop shortcut with icon on first run
if not exist "%~dp0NULLBIT.lnk" (
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ws = New-Object -ComObject WScript.Shell; ^
     $s = $ws.CreateShortcut('%~dp0NULLBIT.lnk'); ^
     $s.TargetPath = 'wscript.exe'; ^
     $s.Arguments = '\"%~dp0_launch.vbs\"'; ^
     $s.WorkingDirectory = '%~dp0'; ^
     $s.IconLocation = '%~dp0assets\icon.ico,0'; ^
     $s.Description = 'NULLBIT AI Bot Launcher'; ^
     $s.Save()"
)

:: Launch without console window
wscript.exe "%~dp0_launch.vbs"
