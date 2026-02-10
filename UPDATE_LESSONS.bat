@echo off
echo ========================================
echo   Updating Lessons Database
echo ========================================
echo.
echo This will update existing lessons with:
echo - Practice Excel files
echo - Expanded lesson content
echo.
pause

cd /d "%~dp0"
cd server

echo.
echo Generating practice files...
node scripts/generate-practice-files.js

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
echo Now restart the server (START_APP.bat)
echo and the changes will be applied.
echo.
pause

