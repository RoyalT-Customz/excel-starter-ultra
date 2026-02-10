@echo off
echo ========================================
echo   Checking Excel Lesson Images
echo ========================================
echo.

echo Checking if all image files exist...
echo.

cd /d "%~dp0"
cd client\public\images

set "missing=0"
set "found=0"

if exist "excel-interface.png" (
    echo [✓] excel-interface.png exists
    set /a found+=1
) else (
    echo [✗] excel-interface.png MISSING
    set /a missing+=1
)

if exist "excel-ribbon.png" (
    echo [✓] excel-ribbon.png exists
    set /a found+=1
) else (
    echo [✗] excel-ribbon.png MISSING
    set /a missing+=1
)

if exist "entering-data.png" (
    echo [✓] entering-data.png exists
    set /a found+=1
) else (
    echo [✗] entering-data.png MISSING
    set /a missing+=1
)

if exist "formatting-tools.png" (
    echo [✓] formatting-tools.png exists
    set /a found+=1
) else (
    echo [✗] formatting-tools.png MISSING
    set /a missing+=1
)

if exist "creating-charts.png" (
    echo [✓] creating-charts.png exists
    set /a found+=1
) else (
    echo [✗] creating-charts.png MISSING
    set /a missing+=1
)

if exist "save-button.png" (
    echo [✓] save-button.png exists
    set /a found+=1
) else (
    echo [✗] save-button.png MISSING
    set /a missing+=1
)

echo.
echo ========================================
echo Results: %found% found, %missing% missing
echo ========================================
echo.

if %missing% GTR 0 (
    echo If images are missing, run:
    echo   node server\scripts\generate-images.js
    echo.
)

echo.
pause

