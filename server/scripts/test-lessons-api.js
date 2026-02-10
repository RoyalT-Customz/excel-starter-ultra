/**
 * Test Lessons API
 * Check if lessons can be queried correctly
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db', 'excelstarter.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database\n');
  
  testQuery();
});

function testQuery() {
  console.log('Testing query: SELECT * FROM lessons ORDER BY order_index ASC\n');
  
  db.all(
    'SELECT * FROM lessons ORDER BY order_index ASC',
    [],
    (err, rows) => {
      if (err) {
        console.error('❌ Error querying lessons:', err);
        console.error('Error details:', err.message);
        db.close();
        process.exit(1);
      }
      
      console.log(`✅ Query successful! Found ${rows.length} lessons:\n`);
      
      if (rows.length === 0) {
        console.log('⚠️  No lessons found in database!');
        console.log('This means lessons need to be inserted.');
      } else {
        rows.forEach((lesson, index) => {
          console.log(`${index + 1}. Lesson ${lesson.order_index}: ${lesson.title}`);
          console.log(`   ID: ${lesson.id}`);
          console.log(`   Has practice_file: ${lesson.practice_file ? '✅ Yes (' + lesson.practice_file + ')' : '❌ No'}`);
          console.log(`   Content length: ${lesson.content ? lesson.content.length : 0} characters\n`);
        });
      }
      
      db.close();
      process.exit(0);
    }
  );
}

