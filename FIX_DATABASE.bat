@echo off
echo ========================================
echo   Fixing Database Schema
echo ========================================
echo.
echo This will fix the database by adding the
echo missing practice_file column.
echo.
pause

cd /d "%~dp0"
cd server

echo.
echo Checking database...
node scripts/check-database.js

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
echo Now restart the server (QUICK_FIX.bat)
echo and the lessons should appear.
echo.
pause

