@echo off
echo ========================================
echo   Full Reset - Delete Database
echo ========================================
echo.
echo This will:
echo 1. Stop any running servers
echo 2. Delete the database file
echo 3. Restart the server (which will recreate everything)
echo.
echo WARNING: This will delete all progress!
echo.
pause

echo.
echo [1] Stopping servers...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Killing process %%a on port 3000
    taskkill /F /PID %%a >nul 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
    echo Killing process %%a on port 5000
    taskkill /F /PID %%a >nul 2>nul
)

echo [OK] Servers stopped
echo.

echo [2] Deleting database...
if exist "server\db\excelstarter.db" (
    del "server\db\excelstarter.db"
    echo [OK] Database deleted
) else (
    echo [OK] Database doesn't exist (will be created)
)
echo.

echo [3] Starting server...
echo This will recreate the database with all lessons.
echo.
start "ExcelStarter Ultra" cmd /k "npm run dev"

echo.
echo Waiting 20 seconds for server to start...
timeout /t 20 /nobreak

echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
echo The database has been reset and the server restarted.
echo All lessons should now appear!
echo.
pause

