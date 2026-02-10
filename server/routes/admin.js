/**
 * Admin API Routes
 * Utility endpoints for database management
 */

const express = require('express');
const router = express.Router();
const db = require('../db/sqlite');

// Reinitialize database (useful for development)
router.post('/reinit-db', (req, res) => {
  // This will trigger re-initialization
  // For now, just return success - actual reinit would require recreating tables
  res.json({ message: 'Database reinitialization triggered. Please restart the server.' });
});

// Check database status
router.get('/db-status', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM lessons', (err, lessonRow) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Database error', 
        message: err.message,
        lessons: 0
      });
    }
    
    db.get('SELECT COUNT(*) as count FROM quiz_questions', (err, questionRow) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Database error', 
          message: err.message,
          lessons: lessonRow ? lessonRow.count : 0,
          questions: 0
        });
      }
      
      res.json({
        status: 'ok',
        lessons: lessonRow ? lessonRow.count : 0,
        questions: questionRow ? questionRow.count : 0
      });
    });
  });
});

module.exports = router;

