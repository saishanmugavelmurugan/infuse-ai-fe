/**
 * API Configuration utility
 * Automatically detects the correct backend URL based on environment
 */

// In production, use the same domain for API calls
// In development, use the environment variable or localhost
const getApiUrl = () => {
  // If we're in production (on infuse.net.in), use the same origin
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production domains
    if (hostname === 'www.infuse.net.in' || hostname === 'infuse.net.in') {
      return window.location.origin;
    }
    
    // Preview/staging domains
    if (hostname.includes('preview.emergentagent.com')) {
      return window.location.origin;
    }
  }
  
  // Fallback to environment variable or localhost for development
  return process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
};

export const API_URL = getApiUrl();

export default API_URL;
