/**
 * Fix Database Schema
 * Adds missing practice_file column to lessons table
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db', 'excelstarter.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');
  
  fixSchema();
});

function fixSchema() {
  console.log('\n🔧 Fixing database schema...\n');
  
  // Check if column exists by trying to select it
  db.run(`ALTER TABLE lessons ADD COLUMN practice_file TEXT`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
        console.log('✅ practice_file column already exists');
      } else {
        console.error('❌ Error adding column:', err.message);
        db.close();
        process.exit(1);
      }
    } else {
      console.log('✅ Added practice_file column');
    }
    
    // Now check lessons
    db.get('SELECT COUNT(*) as count FROM lessons', (err, row) => {
      if (err) {
        console.error('❌ Error checking lessons:', err);
        db.close();
        process.exit(1);
      }
      
      console.log(`\n📊 Database has ${row.count} lessons`);
      
      if (row.count === 0) {
        console.log('\n⚠️  No lessons found. Please restart the server to insert default lessons.');
      } else {
        console.log('✅ Database is ready! Restart the server to see lessons with practice files.');
      }
      
      db.close();
      process.exit(0);
    });
  });
}

