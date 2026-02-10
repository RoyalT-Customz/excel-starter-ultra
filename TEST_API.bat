@echo off
echo ========================================
echo   Testing Lessons API
echo ========================================
echo.
echo Testing if the API is returning lessons...
echo.

REM Check if server is running
curl -s http://localhost:5000/api/lessons >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Server appears to be running!
    echo.
    echo Fetching lessons from API...
    curl http://localhost:5000/api/lessons
    echo.
    echo.
) else (
    echo ERROR: Server is not running or not accessible!
    echo.
    echo Please make sure:
    echo 1. QUICK_FIX.bat is running
    echo 2. The server window shows it's running on port 5000
    echo 3. There are no errors in the server console
    echo.
)

pause

