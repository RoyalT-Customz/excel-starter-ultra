/**
 * Database Initialization Script
 * Manually initialize the database with default data
 * Run with: node scripts/init-db.js
 */

const db = require('../db/sqlite');
const path = require('path');
const fs = require('fs');

// Wait for database to be ready
setTimeout(() => {
  console.log('Checking database status...');
  
  // Check lessons
  db.get('SELECT COUNT(*) as count FROM lessons', (err, row) => {
    if (err) {
      console.error('Error checking lessons:', err);
      console.log('Database might not be initialized. Please restart the server.');
      process.exit(1);
    }
    
    console.log(`Lessons in database: ${row.count}`);
    
    if (row.count === 0) {
      console.log('No lessons found. Please restart the server to initialize the database.');
    } else {
      console.log('✅ Database is initialized correctly!');
    }
    
    // Check quiz questions
    db.get('SELECT COUNT(*) as count FROM quiz_questions', (err, row) => {
      if (err) {
        console.error('Error checking quiz questions:', err);
      } else {
        console.log(`Quiz questions in database: ${row.count}`);
      }
      
      process.exit(0);
    });
  });
}, 2000);

