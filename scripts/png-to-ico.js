/**
 * Convert PNG to ICO
 * Uses to-ico library to convert PNG to ICO format
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pngPath = path.join(__dirname, '..', 'electron', 'assets', 'icon_256.png');
const icoPath = path.join(__dirname, '..', 'electron', 'assets', 'icon.ico');

// Check if to-ico is installed
let toIco;
try {
  toIco = require('to-ico');
} catch (e) {
  console.log('Installing to-ico...');
  try {
    execSync('npm install to-ico --save-dev', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    toIco = require('to-ico');
  } catch (err) {
    console.error('Failed to install to-ico. Please run: npm install to-ico --save-dev');
    console.log('\nAlternative: Use online converter:');
    console.log('1. Go to: https://convertio.co/png-ico/');
    console.log(`2. Upload: ${pngPath}`);
    console.log(`3. Download and replace: ${icoPath}`);
    process.exit(1);
  }
}

async function convertToIco() {
  try {
    if (!fs.existsSync(pngPath)) {
      console.error(`PNG file not found: ${pngPath}`);
      console.log('Please run resize-icon-simple.ps1 first!');
      process.exit(1);
    }

    console.log('Converting PNG to ICO...');
    
    const pngBuffer = fs.readFileSync(pngPath);
    // to-ico v1.1.5 API: toIco(input, options)
    const icoBuffer = await toIco(pngBuffer);
    
    fs.writeFileSync(icoPath, icoBuffer);
    
    console.log(`✅ Successfully converted to ICO!`);
    console.log(`   Output: ${icoPath}`);
    
    // Verify the size
    try {
      const { execSync } = require('child_process');
      const result = execSync(`powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('${icoPath}'); Write-Host $img.Width 'x' $img.Height; $img.Dispose()"`, { encoding: 'utf-8' });
      console.log(`   Verified size: ${result.trim()}`);
    } catch (e) {
      // Ignore verification errors
    }
    
    // Clean up temp PNG
    if (fs.existsSync(pngPath)) {
      fs.unlinkSync(pngPath);
      console.log('   Cleaned up temporary PNG file');
    }
    
  } catch (error) {
    console.error('Error converting to ICO:', error.message);
    console.log('\nAlternative: Use online converter:');
    console.log('1. Go to: https://convertio.co/png-ico/');
    console.log(`2. Upload: ${pngPath}`);
    console.log(`3. Download and replace: ${icoPath}`);
    process.exit(1);
  }
}

convertToIco();

