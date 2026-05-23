@echo off
cd /d "%~dp0"
npx electron . 2>nul
if errorlevel 1 (
    echo.
    echo [ERR] Failed to start. Run "npm install" first.
    pause
)
