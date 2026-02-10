/**
 * Clean up intermediate build files from electron-builder
 * Removes .7z and other temporary archive files that aren't needed
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.log('No dist directory found, nothing to clean.');
  process.exit(0);
}

const files = fs.readdirSync(distDir);
let deletedCount = 0;

files.forEach(file => {
  const filePath = path.join(distDir, file);
  const stat = fs.statSync(filePath);
  
  // Only delete files, not directories
  if (!stat.isFile()) {
    return;
  }
  
  // Delete .7z files (intermediate archives)
  if (file.endsWith('.7z')) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${file}`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Failed to delete ${file}:`, error.message);
    }
  }
  
  // Delete other intermediate archives (but keep the main .exe)
  if ((file.endsWith('.zip') || file.endsWith('.tar.gz')) && !file.includes('portable')) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${file}`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Failed to delete ${file}:`, error.message);
    }
  }
});

if (deletedCount === 0) {
  console.log('✨ No intermediate build files to clean.');
} else {
  console.log(`\n✨ Cleaned up ${deletedCount} intermediate build file(s).`);
}

