@echo off
echo ========================================
echo   ExcelStarter Ultra - Quick Fix
echo ========================================
echo.
echo This script will:
echo 1. Kill any existing Node processes on ports 3000/5000
echo 2. Verify dependencies
echo 3. Start the application
echo.
pause

echo.
echo [1] Killing processes on ports 3000 and 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Killing process %%a on port 3000
    taskkill /F /PID %%a >nul 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
    echo Killing process %%a on port 5000
    taskkill /F /PID %%a >nul 2>nul
)

echo [OK] Ports cleared
echo.

echo [2] Checking dependencies...
if not exist "node_modules\concurrently" (
    echo Installing concurrently...
    call npm install concurrently --save-dev
)

if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    cd ..
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    cd ..
)
echo [OK] Dependencies checked
echo.

echo [3] Ensuring practice files are generated...
cd server
if not exist "practice-files" (
    echo Generating practice Excel files...
    node scripts/generate-practice-files.js
) else (
    echo Practice files directory exists
)
cd ..
echo.

echo [4] Starting application...
echo.
echo Opening in a new window. Check that window for status.
echo You should see messages about updating lessons with practice files.
echo.

start "ExcelStarter Ultra" cmd /k "npm run dev"

echo Waiting 15 seconds for servers to start...
timeout /t 15 /nobreak >nul

echo.
echo Checking if servers started...
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] React dev server is running on port 3000
) else (
    echo [X] React dev server may not be running yet
)

netstat -ano | findstr ":5000" | findstr "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend server is running on port 5000
) else (
    echo [X] Backend server may not be running yet
)

echo.
echo Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
echo If the browser didn't open or shows an error:
echo - Check the "ExcelStarter Ultra" window for error messages
echo - Wait 30-60 seconds for first-time compilation
echo - Try refreshing the browser page
echo.
pause

