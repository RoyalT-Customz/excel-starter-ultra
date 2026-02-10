@echo off
REM Simple startup script that works without PowerShell
echo Starting ExcelStarter Ultra...
echo.

REM Change to the correct directory
cd /d "%~dp0"

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Show versions
echo Node.js version:
node --version
echo npm version:
npm --version
echo.

REM Start the app
echo Starting application...
echo Look for a new window that will open.
echo.
echo If you see errors, please copy them and share them.
echo.

start "ExcelStarter Ultra" cmd /k "npm run dev"

echo.
echo Waiting 20 seconds for servers to start...
timeout /t 20 /nobreak

echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo Check the "ExcelStarter Ultra" window
echo for any error messages.
echo ========================================
echo.
echo If the browser shows an error:
echo - Wait 30-60 seconds for first compilation
echo - Refresh the page
echo - Check the server window for errors
echo.
pause

