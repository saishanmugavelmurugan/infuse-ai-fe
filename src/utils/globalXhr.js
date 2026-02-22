/**
 * Global XHR API Utility - XMLHttpRequest-based API calls to avoid rrweb-recorder interference
 * This utility MUST be used by ALL components for API calls to prevent clone errors
 */

import { API_URL } from '../config/api';

// XMLHttpRequest-based request that is immune to rrweb-recorder interference
export const xhrFetch = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
    xhr.open(options.method || 'GET', fullUrl);
    
    // Set headers
    const token = localStorage.getItem('token');
    const headers = {
      ...(options.body && typeof options.body === 'string' && { 'Content-Type': 'application/json' }),
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };
    
    Object.keys(headers).forEach(key => {
      if (headers[key]) {
        xhr.setRequestHeader(key, headers[key]);
      }
    });
    
    xhr.onload = () => {
      let data;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch (e) {
        data = xhr.responseText || {};
      }
      
      // Create a response-like object
      const response = {
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        statusText: xhr.statusText,
        data: data,
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(xhr.responseText)
      };
      
      resolve(response);
    };
    
    xhr.onerror = () => {
      reject(new Error('Network error'));
    };
    
    xhr.ontimeout = () => {
      reject(new Error('Request timeout'));
    };
    
    xhr.timeout = options.timeout || 30000;
    
    // Handle body
    if (options.body) {
      xhr.send(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    } else {
      xhr.send();
    }
  });
};

// Simple GET request that returns JSON directly
export const xhrGet = async (url, options = {}) => {
  const response = await xhrFetch(url, { ...options, method: 'GET' });
  return response.data;
};

// Simple POST request that returns JSON directly  
export const xhrPost = async (url, data, options = {}) => {
  const response = await xhrFetch(url, { 
    ...options, 
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.data;
};

// File upload using XMLHttpRequest
export const xhrUpload = (url, formData, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
    xhr.open('POST', fullUrl);
    
    const token = localStorage.getItem('token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }
    
    xhr.onload = () => {
      let data;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch (e) {
        data = { detail: 'Invalid response' };
      }
      
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(new Error(data.detail || `Upload failed with status ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.ontimeout = () => reject(new Error('Upload timeout'));
    xhr.timeout = 120000; // 2 minute timeout for uploads
    xhr.send(formData);
  });
};

// Override global fetch to use XHR (for components that can't be easily modified)
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  
  window.fetch = async (url, options = {}) => {
    // Only intercept API calls to our backend
    const urlStr = typeof url === 'string' ? url : url.toString();
    if (urlStr.includes('/api/') || urlStr.includes(API_URL)) {
      try {
        const response = await xhrFetch(urlStr, options);
        // Return a fetch-like response
        return {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          json: () => Promise.resolve(response.data),
          text: () => Promise.resolve(JSON.stringify(response.data)),
          clone: function() { return this; }
        };
      } catch (error) {
        throw error;
      }
    }
    // For non-API calls, use original fetch
    return originalFetch(url, options);
  };
}

export default { xhrFetch, xhrGet, xhrPost, xhrUpload };
