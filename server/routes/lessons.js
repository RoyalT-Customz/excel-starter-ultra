/**
 * Lessons API Routes
 * Handles all lesson-related endpoints
 */

const express = require('express');
const router = express.Router();
const db = require('../db/sqlite');

// Get all lessons
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM lessons ORDER BY order_index ASC',
    [],
    (err, rows) => {
      if (err) {
        console.error('Error fetching lessons:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows || []);
    }
  );
});

// Get a single lesson by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM lessons WHERE id = ?',
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      res.json(row);
    }
  );
});

// Get user progress for lessons
router.get('/progress/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.all(
    `SELECT lesson_id, completed, completed_at 
     FROM user_progress 
     WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows || []);
    }
  );
});

// Mark a lesson as complete
router.post('/:id/complete', (req, res) => {
  const { id } = req.params;
  const { userId = 'default' } = req.body;
  
  db.get(
    'SELECT * FROM user_progress WHERE lesson_id = ? AND user_id = ?',
    [id, userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (row) {
        db.run(
          'UPDATE user_progress SET completed = 1, completed_at = CURRENT_TIMESTAMP WHERE lesson_id = ? AND user_id = ?',
          [id, userId],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Lesson marked as complete', lesson_id: id });
          }
        );
      } else {
        db.run(
          'INSERT INTO user_progress (lesson_id, user_id, completed, completed_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP)',
          [id, userId],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Lesson marked as complete', lesson_id: id });
          }
        );
      }
    }
  );
});

module.exports = router;
