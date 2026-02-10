/**
 * Quizzes API Routes
 * Handles all quiz-related endpoints
 */

const express = require('express');
const router = express.Router();
const db = require('../db/sqlite');

// Get all quiz questions for a lesson
router.get('/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  
  db.all(
    `SELECT id, lesson_id, question, option_a, option_b, option_c, option_d 
     FROM quiz_questions 
     WHERE lesson_id = ? 
     ORDER BY id ASC`,
    [lessonId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Submit quiz answers and get results
router.post('/:lessonId/submit', (req, res) => {
  const { lessonId } = req.params;
  const { answers, userId = 'default' } = req.body;
  
  // Get all questions for this lesson with correct answers
  db.all(
    'SELECT id, correct_answer FROM quiz_questions WHERE lesson_id = ?',
    [lessonId],
    (err, questions) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Calculate score
      let score = 0;
      const results = questions.map(question => {
        const userAnswer = answers[question.id];
        const isCorrect = userAnswer === question.correct_answer;
        if (isCorrect) score++;
        
        return {
          questionId: question.id,
          userAnswer,
          correctAnswer: question.correct_answer,
          isCorrect
        };
      });
      
      // Get explanations for all questions
      db.all(
        'SELECT id, question, correct_answer, explanation FROM quiz_questions WHERE lesson_id = ?',
        [lessonId],
        (err, questionsWithExplanations) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Add explanations to results
          const detailedResults = results.map(result => {
            const question = questionsWithExplanations.find(q => q.id === result.questionId);
            return {
              ...result,
              question: question.question,
              explanation: question.explanation
            };
          });
          
          // Save quiz result to database
          db.run(
            'INSERT INTO quiz_results (lesson_id, user_id, score, total_questions) VALUES (?, ?, ?, ?)',
            [lessonId, userId, score, questions.length],
            (err) => {
              if (err) {
                console.error('Error saving quiz result:', err);
              }
            }
          );
          
          res.json({
            score,
            totalQuestions: questions.length,
            percentage: Math.round((score / questions.length) * 100),
            results: detailedResults
          });
        }
      );
    }
  );
});

// Get quiz results history for a user
router.get('/results/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.all(
    `SELECT qr.*, l.title as lesson_title 
     FROM quiz_results qr
     JOIN lessons l ON qr.lesson_id = l.id
     WHERE qr.user_id = ?
     ORDER BY qr.completed_at DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router;

