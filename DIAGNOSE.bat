@echo off
echo ========================================
echo   ExcelStarter Ultra - Diagnostic Tool
echo ========================================
echo.

echo Checking system requirements...
echo.

REM Check Node.js
echo [1] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo    [X] Node.js is NOT installed
    echo    [ ] Solution: Install from https://nodejs.org/ (LTS version)
    set ERROR_FOUND=1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo    [OK] Node.js version: %%i
)

REM Check npm
echo.
echo [2] Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo    [X] npm is NOT found
    set ERROR_FOUND=1
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo    [OK] npm version: %%i
)

REM Check dependencies
echo.
echo [3] Checking dependencies...
if not exist "node_modules" (
    echo    [X] Root node_modules missing
    set ERROR_FOUND=1
) else (
    echo    [OK] Root node_modules found
)

if not exist "client\node_modules" (
    echo    [X] Client node_modules missing
    set ERROR_FOUND=1
) else (
    echo    [OK] Client node_modules found
)

if not exist "server\node_modules" (
    echo    [X] Server node_modules missing
    set ERROR_FOUND=1
) else (
    echo    [OK] Server node_modules found
)

REM Check concurrently
echo.
echo [4] Checking for concurrently...
npm list concurrently >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo    [X] concurrently package not found
    echo    [ ] This is required for npm run dev
    set ERROR_FOUND=1
) else (
    echo    [OK] concurrently package found
)

REM Check ports
echo.
echo [5] Checking ports...
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo    [!] Port 3000 is already in use
    echo    [ ] This will prevent the app from starting
    echo    [ ] Solution: Close other applications using port 3000
    set ERROR_FOUND=1
) else (
    echo    [OK] Port 3000 is available
)

netstat -ano | findstr ":5000" | findstr "LISTENING" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo    [!] Port 5000 is already in use
    echo    [ ] This will prevent the server from starting
    echo    [ ] Solution: Close other applications using port 5000
    set ERROR_FOUND=1
) else (
    echo    [OK] Port 5000 is available
)

REM Check required files
echo.
echo [6] Checking required files...
if not exist "package.json" (
    echo    [X] package.json missing
    set ERROR_FOUND=1
) else (
    echo    [OK] package.json found
)

if not exist "client\package.json" (
    echo    [X] client\package.json missing
    set ERROR_FOUND=1
) else (
    echo    [OK] client\package.json found
)

if not exist "server\package.json" (
    echo    [X] server\package.json missing
    set ERROR_FOUND=1
) else (
    echo    [OK] server\package.json found
)

if not exist "server\app.js" (
    echo    [X] server\app.js missing
    set ERROR_FOUND=1
) else (
    echo    [OK] server\app.js found
)

echo.
echo ========================================
if defined ERROR_FOUND (
    echo   DIAGNOSIS: Issues found!
    echo ========================================
    echo.
    echo RECOMMENDED ACTIONS:
    echo.
    echo 1. If Node.js is missing, install it from https://nodejs.org/
    echo    - Download the LTS version
    echo    - Run the installer and restart your computer
    echo.
    echo 2. If dependencies are missing, run:
    echo    npm install
    echo    cd server && npm install && cd ..
    echo    cd client && npm install && cd ..
    echo.
    echo 3. If concurrently is missing, run:
    echo    npm install --save-dev concurrently
    echo.
    echo 4. If ports are in use:
    echo    - Close other applications
    echo    - Or restart your computer
    echo.
) else (
    echo   DIAGNOSIS: All checks passed!
    echo ========================================
    echo.
    echo Your system appears to be ready.
    echo Try running START_APP.bat again.
    echo.
)
echo.
pause

