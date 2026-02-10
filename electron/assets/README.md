# App Icons

Place your app icons here:

- `icon.png` - 512x512 PNG (for Linux)
- `icon.ico` - Windows icon file (multiple sizes)
- `icon.icns` - Mac icon file

## Creating Icons

You can create icons from a single image using online tools:
- https://www.icoconverter.com/
- https://convertio.co/png-ico/
- https://cloudconvert.com/png-to-icns

Or use ImageMagick:
```bash
# Create ICO (Windows)
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico

# Create ICNS (Mac) - requires iconutil
mkdir icon.iconset
# Then add different sizes and run:
iconutil -c icns icon.iconset
```

For now, the app will use default Electron icons if these files don't exist.

