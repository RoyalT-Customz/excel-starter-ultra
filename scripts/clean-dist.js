/**
 * Clean up the dist folder before building
 * Removes win-unpacked and other build artifacts that might be locked
 * Also closes any running Electron/ExcelStarter processes on Windows
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// DON'T automatically close running processes - this was closing the app while the user was using it!
// If files are locked, the user should close the app manually before building
console.log('ℹ️  Note: If you see "Access Denied" errors, please close ExcelStarter Ultra first, then try building again.');

const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.log('No dist directory found, nothing to clean.');
  process.exit(0);
}

function deleteRecursive(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  
  try {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      const stat = fs.statSync(curPath);
      
      if (stat.isDirectory()) {
        deleteRecursive(curPath);
      } else {
        // Try to delete file, but don't fail if it's locked
        try {
          fs.unlinkSync(curPath);
        } catch (error) {
          // File might be locked, that's okay - we'll try again
          console.warn(`⚠️  Could not delete ${curPath}: ${error.message}`);
        }
      }
    });
    
    // Try to remove directory
    try {
      fs.rmdirSync(dirPath);
    } catch (error) {
      // Directory might not be empty if files were locked
      console.warn(`⚠️  Could not remove directory ${dirPath}: ${error.message}`);
    }
  } catch (error) {
    console.warn(`⚠️  Error cleaning ${dirPath}: ${error.message}`);
  }
}

// Remove win-unpacked folder (this is often locked)
const winUnpacked = path.join(distDir, 'win-unpacked');
if (fs.existsSync(winUnpacked)) {
  console.log('🧹 Cleaning win-unpacked folder...');
  deleteRecursive(winUnpacked);
}

// Remove mac-unpacked if it exists
const macUnpacked = path.join(distDir, 'mac-unpacked');
if (fs.existsSync(macUnpacked)) {
  console.log('🧹 Cleaning mac-unpacked folder...');
  deleteRecursive(macUnpacked);
}

// Remove linux-unpacked if it exists
const linuxUnpacked = path.join(distDir, 'linux-unpacked');
if (fs.existsSync(linuxUnpacked)) {
  console.log('🧹 Cleaning linux-unpacked folder...');
  deleteRecursive(linuxUnpacked);
}

console.log('✨ Pre-build cleanup complete.');

