/**
 * Resize Icon Script
 * Resizes icon.ico to 256x256 pixels
 * 
 * Usage: node scripts/resize-icon.js
 */

const fs = require('fs');
const path = require('path');

// Try to use sharp if available, otherwise provide instructions
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not found. Installing...');
  console.log('Please run: npm install sharp --save-dev');
  console.log('\nOr use an online tool:');
  console.log('1. Go to https://www.icoconverter.com/');
  console.log('2. Upload your icon.ico file');
  console.log('3. Resize to 256x256');
  console.log('4. Download and replace electron/assets/icon.ico');
  process.exit(1);
}

const iconPath = path.join(__dirname, '..', 'electron', 'assets', 'icon.ico');
const outputPath = iconPath;

async function resizeIcon() {
  try {
    if (!fs.existsSync(iconPath)) {
      console.error(`Icon file not found at: ${iconPath}`);
      process.exit(1);
    }

    console.log('Resizing icon to 256x256...');
    
    // Read the icon, resize it, and save
    await sharp(iconPath)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 255, g: 182, b: 193, alpha: 0 } // Transparent background
      })
      .toFile(outputPath + '.tmp');

    // Replace original with resized version
    fs.renameSync(outputPath + '.tmp', outputPath);
    
    console.log('✅ Icon resized successfully to 256x256!');
    console.log(`   Location: ${iconPath}`);
  } catch (error) {
    console.error('Error resizing icon:', error.message);
    console.log('\nAlternative: Use an online tool:');
    console.log('1. Go to https://www.icoconverter.com/');
    console.log('2. Upload your icon.ico file');
    console.log('3. Resize to 256x256');
    console.log('4. Download and replace electron/assets/icon.ico');
    process.exit(1);
  }
}

resizeIcon();

