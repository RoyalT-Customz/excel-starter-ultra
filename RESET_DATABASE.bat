@echo off
echo ========================================
echo   Resetting Database for Updated Lessons
echo ========================================
echo.

REM Stop any running Node processes
echo Stopping any running servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Delete the database file
if exist "database.sqlite" (
    echo Deleting old database...
    del "database.sqlite"
    echo ✅ Database deleted
) else (
    echo ℹ️  No database file found
)

echo.
echo ✅ Database reset complete!
echo.
echo The database will be recreated with updated lessons when you start the server.
echo.
pause
