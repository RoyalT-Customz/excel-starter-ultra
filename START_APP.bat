@echo off
setlocal enabledelayedexpansion
echo ========================================
echo   ExcelStarter Ultra - Starting...
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Make sure to download the LTS version and restart your computer after installation.
    pause
    exit /b 1
)

REM Display Node.js and npm versions
echo Checking Node.js installation...
node --version >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo Node.js version: !NODE_VERSION!
)

npm --version >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo npm version: !NPM_VERSION!
)
echo.

REM Check if dependencies are installed
echo Checking dependencies...
set MISSING_DEPS=0

if not exist "node_modules" (
    echo [X] Root node_modules missing
    set MISSING_DEPS=1
) else (
    echo [OK] Root node_modules found
)

if not exist "client\node_modules" (
    echo [X] Client node_modules missing
    set MISSING_DEPS=1
) else (
    echo [OK] Client node_modules found
)

if not exist "server\node_modules" (
    echo [X] Server node_modules missing
    set MISSING_DEPS=1
) else (
    echo [OK] Server node_modules found
)
echo.

if %MISSING_DEPS% EQU 1 (
    echo Installing missing dependencies... This may take a few minutes.
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install root dependencies!
        pause
        exit /b 1
    )
    
    echo Installing server dependencies...
    cd server
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install server dependencies!
        cd ..
        pause
        exit /b 1
    )
    cd ..
    
    echo Installing client dependencies...
    cd client
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install client dependencies!
        cd ..
        pause
        exit /b 1
    )
    cd ..
    
    echo.
    echo Dependencies installed successfully!
    echo.
)

REM Check if concurrently is installed (needed for dev script)
echo Checking for concurrently package...
where concurrently >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    npm list concurrently >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Installing concurrently...
        call npm install --save-dev concurrently
        if %ERRORLEVEL% NEQ 0 (
            echo ERROR: Failed to install concurrently!
            pause
            exit /b 1
        )
    )
)
echo.

REM Check if ports are available
echo Checking if ports are available...
netstat -ano | findstr ":3000" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo WARNING: Port 3000 is already in use!
    echo This might prevent the app from starting.
    echo.
    echo You can either:
    echo 1. Close the application using port 3000
    echo 2. Continue anyway (the app might fail to start)
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "!CONTINUE!"=="y" (
        echo Exiting...
        exit /b 1
    )
)

netstat -ano | findstr ":5000" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo WARNING: Port 5000 is already in use!
    echo This might prevent the server from starting.
    echo.
)
echo.

echo ========================================
echo Starting the application...
echo ========================================
echo.
echo Please wait for "Compiled successfully" message in the new window.
echo The app will open in your browser automatically.
echo.
echo To stop the app, close the application window or press Ctrl+C
echo.
echo.

REM Start the app in a new window
start "ExcelStarter Ultra - Server" cmd /k "npm run dev"

REM Wait for the server to start - React typically needs 10-20 seconds
echo Waiting for server to start (this may take 15-30 seconds)...
echo Please check the new window for compilation progress.
echo.

REM Wait a bit longer for initial compilation
timeout /t 12 /nobreak >nul
echo Checking if server is ready...
timeout /t 5 /nobreak >nul

REM Try to check if ports are listening (simpler check)
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Port 3000 is listening - server should be ready!
    goto OPEN_BROWSER
)

netstat -ano | findstr ":5000" | findstr "LISTENING" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Port 5000 is listening - server is starting...
    timeout /t 5 /nobreak >nul
    goto OPEN_BROWSER
)

echo Server may still be compiling. Opening browser anyway...
echo If the page doesn't load, wait a bit longer and refresh.
echo.

:OPEN_BROWSER
REM Open browser
start http://localhost:3000

echo.
echo ========================================
echo   Application window opened!
echo ========================================
echo.
echo If the browser didn't open automatically:
echo   1. Wait a few more seconds for compilation to complete
echo   2. Open your browser and go to: http://localhost:3000
echo.
echo The server runs on: http://localhost:5000
echo.
echo To stop the app, close the "ExcelStarter Ultra - Server" window.
echo.
pause

