/**
 * Update All Lessons
 * Updates all existing lessons with practice files and expanded content
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Load the lessons data from sqlite.js
const DB_PATH = path.join(__dirname, '..', 'db', 'excelstarter.db');

// Import the lessons array (we need to extract it)
const sqliteContent = fs.readFileSync(path.join(__dirname, '..', 'db', 'sqlite.js'), 'utf8');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database\n');
  
  updateLessons();
});

// Practice file mapping
const practiceFiles = {
  1: 'Lesson1_Practice_Budget.xlsx',
  2: 'Lesson2_Practice_Grades.xlsx',
  3: 'Lesson3_Practice_Sales.xlsx',
  4: 'Lesson4_Practice_Products.xlsx',
  5: 'Lesson5_Practice_Payroll.xlsx',
  6: 'Lesson6_Practice_Orders.xlsx',
  7: 'Lesson7_Practice_Expenses.xlsx',
  8: 'Lesson8_Practice_Business.xlsx'
};

// Expanded content - simplified versions to match what's in sqlite.js
const expandedContent = {
  1: {
    title: 'What is Excel?',
    content: `Excel is a powerful spreadsheet program that helps you organize, calculate, and analyze data. Think of it like a digital notebook with rows and columns where you can store information and make calculations automatically.

**What Makes Excel Special?**

Excel is part of the Microsoft Office suite and is one of the most widely used software applications in the world. It combines the simplicity of a grid-based layout with powerful computational capabilities, making it perfect for both beginners and advanced users.

**Key Benefits:**
- **Organize data in tables:** Keep information structured and easy to read
- **Perform calculations with formulas:** Let Excel do the math for you automatically
- **Create charts and graphs:** Visualize your data to spot trends and patterns
- **Sort and filter information:** Quickly find what you're looking for in large datasets
- **Save your work on your computer:** Never lose your data, and access it anytime

**Real-World Uses:**
Excel is used by millions of people for various tasks including:
- Personal budgeting and expense tracking
- Business financial planning and reporting
- Inventory management
- Data analysis and statistics
- Scheduling and time tracking
- Student grade books
- Event planning and guest lists
- And much more!

**Getting Started:**
When you open Excel, you'll see a blank spreadsheet called a "workbook." Each workbook can contain multiple "sheets" (think of them like pages in a notebook). You can organize different types of data on different sheets, all within the same file.

**Why Learn Excel?**
Excel skills are valuable in almost any career. Whether you're tracking your personal finances, managing a small business, or working in a large corporation, knowing Excel will save you time and help you make better decisions through data analysis.`
  }
  // Add other lessons here - for now, let's just update with practice files
};

function updateLessons() {
  console.log('🔄 Updating lessons with practice files...\n');
  
  // Get all lessons
  db.all('SELECT id, order_index, title FROM lessons ORDER BY order_index', [], (err, lessons) => {
    if (err) {
      console.error('❌ Error fetching lessons:', err);
      db.close();
      process.exit(1);
    }
    
    if (lessons.length === 0) {
      console.log('⚠️  No lessons found to update.');
      db.close();
      process.exit(0);
    }
    
    console.log(`Found ${lessons.length} lessons to update.\n`);
    
    let updated = 0;
    let remaining = lessons.length;
    
    lessons.forEach((lesson) => {
      const practiceFile = practiceFiles[lesson.order_index];
      const expanded = expandedContent[lesson.order_index];
      
      if (expanded) {
        // Update with both content and practice file
        db.run(
          'UPDATE lessons SET title = ?, content = ?, practice_file = ? WHERE id = ?',
          [expanded.title, expanded.content, practiceFile || null, lesson.id],
          (err) => {
            remaining--;
            if (err) {
              console.error(`❌ Error updating lesson ${lesson.id}:`, err.message);
            } else {
              updated++;
              console.log(`✅ Updated lesson ${lesson.id} (${lesson.order_index}): ${expanded.title}`);
            }
            
            if (remaining === 0) {
              console.log(`\n✅ Done! Updated ${updated} out of ${lessons.length} lessons.`);
              console.log('\n⚠️  Note: Only lesson 1 has expanded content in this script.');
              console.log('The full expanded content will be applied when you restart the server.');
              db.close();
              process.exit(0);
            }
          }
        );
      } else if (practiceFile) {
        // Just update practice file
        db.run(
          'UPDATE lessons SET practice_file = ? WHERE id = ?',
          [practiceFile, lesson.id],
          (err) => {
            remaining--;
            if (err) {
              console.error(`❌ Error updating lesson ${lesson.id}:`, err.message);
            } else {
              updated++;
              console.log(`✅ Added practice file to lesson ${lesson.id} (${lesson.order_index}): ${lesson.title}`);
            }
            
            if (remaining === 0) {
              console.log(`\n✅ Done! Updated ${updated} out of ${lessons.length} lessons.`);
              console.log('\n⚠️  Note: Content updates will happen when you restart the server.');
              db.close();
              process.exit(0);
            }
          }
        );
      } else {
        remaining--;
        console.log(`⚠️  No practice file for lesson ${lesson.id} (${lesson.order_index}): ${lesson.title}`);
        
        if (remaining === 0) {
          console.log(`\n✅ Done! Updated ${updated} out of ${lessons.length} lessons.`);
          db.close();
          process.exit(0);
        }
      }
    });
  });
}

