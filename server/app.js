/**
 * ExcelStarter Ultra - Backend Server
 * Main Express server file that handles all API routes
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize database (this will create tables if they don't exist)
require('./db/sqlite');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}


// Import route handlers
const lessonsRoutes = require('./routes/lessons');
const quizzesRoutes = require('./routes/quizzes');
const xlookupRoutes = require('./routes/xlookup');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve uploaded files (if any)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes (must come before static file serving)
// In serverless environments, these routes are accessed via /api/*
app.use('/api/lessons', lessonsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/xlookup', xlookupRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ExcelStarter Ultra API is running' });
});

// In production (Electron), serve the React app
// This must come AFTER API routes
if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
  if (require('fs').existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ExcelStarter Ultra API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

// Start server (only if not already started)
// In Electron, the server might be required multiple times, so we check if it's already listening
// Skip server startup in serverless environments (Vercel, etc.)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

let server;

console.log('=== SERVER STARTUP ===');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ELECTRON_USER_DATA:', process.env.ELECTRON_USER_DATA);
console.log('Serverless:', isServerless);

// Use a global to track if server is already started
// Don't start server in serverless environments
if (!isServerless && !global.__EXCELSTARTER_SERVER_STARTED__) {
  console.log('Starting new server instance...');
  try {
    // Listen on all interfaces (0.0.0.0) so both IPv4 and IPv6 work
    // This ensures localhost, 127.0.0.1, and ::1 all work
    console.log(`Attempting to start server on port ${PORT}...`);
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 ExcelStarter Ultra server running on port ${PORT}`);
      console.log(`📚 API available at http://localhost:${PORT}/api`);
      console.log(`💾 Database location: ${process.env.ELECTRON_USER_DATA ? path.join(process.env.ELECTRON_USER_DATA, 'db', 'excelstarter.db') : 'local'}`);
      global.__EXCELSTARTER_SERVER_STARTED__ = true;
      console.log('✅ Server startup complete!');
    });
    
    server.on('error', (err) => {
      console.error('❌ Server error event fired!');
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Is another instance running?`);
      } else {
        console.error('❌ Server error:', err);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      }
    });
    
    // Make sure server actually starts
    server.on('listening', () => {
      const addr = server.address();
      console.log('✅ Server is now listening and ready to accept connections');
      console.log('Server address:', addr);
    });
    
    // Store server in global immediately
    global.__EXCELSTARTER_SERVER__ = server;
    console.log('Server object created, waiting for listen callback...');
    
  } catch (error) {
    console.error('❌ Exception during server startup:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    // Don't set the flag if there was an error
  }
} else {
  console.log(`✅ Server already running on port ${PORT}`);
  server = global.__EXCELSTARTER_SERVER__;
  if (!server) {
    console.error('⚠️  Global flag set but server object missing! Resetting...');
    global.__EXCELSTARTER_SERVER_STARTED__ = false;
    // Try to start again
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 ExcelStarter Ultra server running on port ${PORT}`);
      global.__EXCELSTARTER_SERVER_STARTED__ = true;
      global.__EXCELSTARTER_SERVER__ = server;
    });
  }
}

// Store server in global for reuse
if (server) {
  global.__EXCELSTARTER_SERVER__ = server;
}

// Export the app and server for use in Electron
module.exports = app;
module.exports.server = server;

