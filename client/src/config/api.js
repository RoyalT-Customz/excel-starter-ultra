/**
 * API Configuration
 * Centralized API base URL configuration for different environments
 */

const getApiBaseUrl = () => {
  // In production (Vercel), use relative URLs
  // Vercel will proxy /api/* to the serverless function
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  
  // In development, use localhost
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;

