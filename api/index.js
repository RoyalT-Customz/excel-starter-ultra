/**
 * Vercel Serverless Function Entry Point
 * Wraps the Express app for Vercel deployment
 */

const serverless = require('serverless-http');
const app = require('../server/app');

// Wrap the Express app for serverless environments
// This allows Vercel to handle the Express app as a serverless function
// The basePath is empty since Vercel already routes /api/* to this function
module.exports = serverless(app, {
  binary: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/octet-stream']
});

