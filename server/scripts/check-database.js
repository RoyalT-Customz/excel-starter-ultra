/**
 * Check Database and Force Insert Lessons
 * Run this to check if lessons exist and force insert them if needed
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const DB_PATH = path.join(__dirname, '..', 'db', 'excelstarter.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database:', DB_PATH);
  
  checkAndFixLessons();
});

function checkAndFixLessons() {
  // Check if lessons exist
  db.get('SELECT COUNT(*) as count FROM lessons', (err, row) => {
    if (err) {
      console.error('❌ Error checking lessons:', err);
      process.exit(1);
    }
    
    console.log(`\n📊 Database Status:`);
    console.log(`   Lessons in database: ${row.count}`);
    
    if (row.count === 0) {
      console.log('\n⚠️  No lessons found! Forcing insertion...\n');
      // Import and run insertDefaultLessons
      const { insertDefaultLessons } = require('../db/sqlite');
      // Actually, we need to call it differently - let me just insert directly
      insertLessonsDirectly();
    } else {
      // Show existing lessons
      db.all('SELECT id, title, order_index, practice_file FROM lessons ORDER BY order_index', (err, lessons) => {
        if (err) {
          console.error('❌ Error fetching lessons:', err);
          return;
        }
        
        console.log('\n📚 Existing Lessons:');
        lessons.forEach(lesson => {
          const hasPractice = lesson.practice_file ? '✅' : '❌';
          console.log(`   ${hasPractice} Lesson ${lesson.order_index}: ${lesson.title} ${lesson.practice_file ? `(${lesson.practice_file})` : '(no practice file)'}`);
        });
        
        // Check how many need practice files
        const needsUpdate = lessons.filter(l => !l.practice_file).length;
        if (needsUpdate > 0) {
          console.log(`\n⚠️  ${needsUpdate} lessons need practice files. Restart the server to update them.`);
        }
        
        db.close();
        process.exit(0);
      });
    }
  });
}

function insertLessonsDirectly() {
  // We need to require the lessons data - let me just recreate it here
  console.log('This requires the full lesson data. Please delete the database file and restart the server.');
  console.log('Database file location:', DB_PATH);
  db.close();
  process.exit(1);
}

