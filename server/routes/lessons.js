/**
 * Lessons API Routes
 * Handles all lesson-related endpoints
 */

const express = require('express');
const router = express.Router();
const db = require('../db/sqlite');

// Get all lessons
router.get('/', (req, res) => {
  const attemptFetch = (retryCount = 0) => {
    db.all(
      'SELECT * FROM lessons ORDER BY order_index ASC',
      [],
      (err, rows) => {
        if (err) {
          console.error('Error fetching lessons:', err);
          return res.status(500).json({ error: err.message });
        }
        // If no lessons found, wait for seeding (especially important on serverless Vercel)
        if (!rows || rows.length === 0) {
          if (retryCount < 8) {
            console.log(`No lessons found, retrying... (attempt ${retryCount + 1}/8)`);
            // Wait longer on each retry - seeding can take time on serverless cold starts
            // Exponential backoff: 1000ms, 2000ms, 3000ms, 4000ms, 5000ms, 6000ms, 7000ms, 8000ms
            setTimeout(() => {
              attemptFetch(retryCount + 1);
            }, 1000 * (retryCount + 1));
            return;
          } else {
            console.log('No lessons found after multiple retries, returning empty array');
            return res.json([]);
          }
        }
        res.json(rows);
      }
    );
  };
  
  attemptFetch();
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
      res.json(rows);
    }
  );
});

// Mark a lesson as complete
router.post('/:id/complete', (req, res) => {
  const { id } = req.params;
  const { userId = 'default' } = req.body;
  
  // Check if progress already exists
  db.get(
    'SELECT * FROM user_progress WHERE lesson_id = ? AND user_id = ?',
    [id, userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (row) {
        // Update existing progress
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
        // Insert new progress
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

