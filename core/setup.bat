@echo off
cd /d "%~dp0"
title NULLBIT Setup

:: Parent folder (NULLBIT/)
set "ROOT=%~dp0..\"

echo.
echo  [NULLBIT] First-time setup...
echo.

:: Install dependencies if needed
if not exist "%~dp0node_modules" (
  echo  [SYS] Installing dependencies...
  npm install --silent
  echo  [OK]  Done.
)

:: Create NULLBIT.lnk in the ROOT folder with icon
echo  [SYS] Creating launcher shortcut...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $lnkPath = (Get-Item '%~dp0..').FullName + '\NULLBIT.lnk'; $s = $ws.CreateShortcut($lnkPath); $s.TargetPath = 'wscript.exe'; $s.Arguments = '/nologo \"%~dp0_launch.vbs\"'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = (Get-Item '%~dp0..\assets\icon.ico').FullName + ',0'; $s.Description = 'NULLBIT AI Bot Launcher'; $s.WindowStyle = 1; $s.Save()"

echo  [OK]  NULLBIT.lnk created in root folder.
echo.
echo  ================================================
echo   Double-click NULLBIT.lnk to start the launcher
echo  ================================================
echo.
pause
