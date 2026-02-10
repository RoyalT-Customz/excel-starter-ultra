@echo off
echo Testing if we can start the app...
echo.

echo [1] Testing npm run dev command...
echo This will try to start the app for 10 seconds then stop it.
echo.

timeout /t 2 /nobreak >nul

echo Starting server and client...
start "Test Window" cmd /k "npm run dev & timeout /t 10 /nobreak & taskkill /F /FI "WINDOWTITLE eq Test Window*""

timeout /t 5 /nobreak >nul

echo.
echo Checking if servers started...
netstat -ano | findstr ":3000" | findstr "LISTENING"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Port 3000 is listening!
) else (
    echo [X] Port 3000 is NOT listening - server may not have started
)

netstat -ano | findstr ":5000" | findstr "LISTENING"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Port 5000 is listening!
) else (
    echo [X] Port 5000 is NOT listening - server may not have started
)

echo.
pause

