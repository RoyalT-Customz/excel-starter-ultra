# Simple PowerShell script to resize icon using .NET
# This creates a new ICO file at 256x256

$iconPath = "electron\assets\icon.ico"
$outputPath = "electron\assets\icon_new.ico"

Write-Host "Resizing icon to 256x256..." -ForegroundColor Cyan

Add-Type -AssemblyName System.Drawing

try {
    # Load original icon
    $icon = New-Object System.Drawing.Icon($iconPath)
    $bitmap = $icon.ToBitmap()
    
    Write-Host "Original size: $($bitmap.Width) x $($bitmap.Height)" -ForegroundColor Yellow
    
    # Create resized bitmap
    $newBitmap = New-Object System.Drawing.Bitmap(256, 256)
    $graphics = [System.Drawing.Graphics]::FromImage($newBitmap)
    
    # High quality settings
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Draw resized image
    $graphics.DrawImage($bitmap, 0, 0, 256, 256)
    
    # Save as PNG first (we'll convert to ICO manually)
    $pngPath = "electron\assets\icon_256.png"
    $newBitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host "✅ Resized image saved as: $pngPath" -ForegroundColor Green
    Write-Host "Size: 256 x 256 pixels" -ForegroundColor Green
    
    # Clean up
    $graphics.Dispose()
    $newBitmap.Dispose()
    $bitmap.Dispose()
    $icon.Dispose()
    
    Write-Host "`nTo convert PNG to ICO:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://convertio.co/png-ico/" -ForegroundColor White
    Write-Host "2. Upload: $pngPath" -ForegroundColor White
    Write-Host "3. Download the ICO file" -ForegroundColor White
    Write-Host "4. Replace: $iconPath" -ForegroundColor White
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

