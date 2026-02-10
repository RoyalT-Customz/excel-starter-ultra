# PowerShell script to resize icon.ico to 256x256
# Usage: .\scripts\resize-icon.ps1

$iconPath = "electron\assets\icon.ico"
$tempPngPath = "electron\assets\icon_temp.png"
$outputPath = "electron\assets\icon.ico"

Write-Host "Resizing icon to 256x256..." -ForegroundColor Cyan

try {
    # Load System.Drawing assembly
    Add-Type -AssemblyName System.Drawing
    
    # Load the icon
    $originalIcon = New-Object System.Drawing.Icon($iconPath)
    $bitmap = $originalIcon.ToBitmap()
    
    Write-Host "Current size: $($bitmap.Width) x $($bitmap.Height)" -ForegroundColor Yellow
    
    # Create a new bitmap at 256x256
    $resizedBitmap = New-Object System.Drawing.Bitmap(256, 256)
    $graphics = [System.Drawing.Graphics]::FromImage($resizedBitmap)
    
    # Set high quality rendering
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Draw the resized image
    $graphics.DrawImage($bitmap, 0, 0, 256, 256)
    
    # Save as PNG first (ICO conversion is complex, so we'll use a workaround)
    $resizedBitmap.Save($tempPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host "Resized image saved as PNG. Converting to ICO..." -ForegroundColor Yellow
    
    # For ICO conversion, we'll need to use an online tool or ImageMagick
    # For now, let's try to create a simple ICO using the PNG
    # Note: This is a simplified approach - for best results, use an online converter
    
    # Clean up
    $graphics.Dispose()
    $resizedBitmap.Dispose()
    $bitmap.Dispose()
    $originalIcon.Dispose()
    
    Write-Host "`n✅ Resized PNG created at: $tempPngPath" -ForegroundColor Green
    Write-Host "`n⚠️  Note: ICO conversion requires additional tools." -ForegroundColor Yellow
    Write-Host "`nTo complete the conversion:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://www.icoconverter.com/" -ForegroundColor White
    Write-Host "2. Upload: $tempPngPath" -ForegroundColor White
    Write-Host "3. Convert to ICO format" -ForegroundColor White
    Write-Host "4. Download and replace: $outputPath" -ForegroundColor White
    Write-Host "`nOr use ImageMagick (if installed):" -ForegroundColor Cyan
    Write-Host "magick convert $tempPngPath -resize 256x256 $outputPath" -ForegroundColor White
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nAlternative: Use an online tool to resize the ICO file directly" -ForegroundColor Yellow
    exit 1
}

