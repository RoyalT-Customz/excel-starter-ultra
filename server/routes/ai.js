/**
 * AI API Routes
 * Handles all AI-related endpoints (coach, file analysis, practice sheet generation)
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import AI controllers
const aiCoach = require('../controllers/aiCoach');
const fileAnalyzer = require('../controllers/fileAnalyzer');
const practiceGenerator = require('../controllers/practiceGenerator');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  }
});

// AI Coach endpoint - chat with AI about Excel
router.post('/coach', async (req, res) => {
  try {
    const { message, simpleMode = true } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await aiCoach.getResponse(message, simpleMode);
    res.json({ response });
  } catch (error) {
    console.error('AI Coach error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      message: error.message 
    });
  }
});

// File analysis endpoint - upload Excel file and get AI explanation
router.post('/analyze-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = req.file.path;
    const analysis = await fileAnalyzer.analyzeFile(filePath);
    
    // Clean up uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
    
    res.json(analysis);
  } catch (error) {
    console.error('File analysis error:', error);
    
    // Clean up file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze file',
      message: error.message 
    });
  }
});

// Practice sheet generation endpoint
router.post('/generate-sheet', async (req, res) => {
  try {
    const { sheetType, options = {} } = req.body;
    
    if (!sheetType) {
      return res.status(400).json({ error: 'Sheet type is required' });
    }
    
    const result = await practiceGenerator.generateSheet(sheetType, options);
    
    // Send file as response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.buffer);
    
    // Clean up file after sending
    setTimeout(() => {
      if (fs.existsSync(result.filePath)) {
        fs.unlink(result.filePath, (err) => {
          if (err) console.error('Error deleting generated file:', err);
        });
      }
    }, 1000);
  } catch (error) {
    console.error('Sheet generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate practice sheet',
      message: error.message 
    });
  }
});

module.exports = router;

