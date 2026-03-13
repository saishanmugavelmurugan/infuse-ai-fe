import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// XMLHttpRequest-based request that is immune to rrweb-recorder interference
const xhrRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);
    
    // Set headers
    const headers = options.headers || {};
    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });
    
    xhr.onload = () => {
      let data;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch (e) {
        data = { detail: 'Invalid response' };
      }
      
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ ok: true, data });
      } else {
        resolve({ ok: false, data });
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.ontimeout = () => reject(new Error('Request timeout'));
    xhr.timeout = 30000;
    xhr.send(options.body);
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // API_URL is now imported from config/api.js

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const result = await xhrRequest(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (result.ok) {
        setUser(result.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, mfaCode = null, platform = null) => {
    try {
      const requestBody = { email, password };
      if (mfaCode) {
        requestBody.mfa_code = mfaCode;
      }
      
      const result = await xhrRequest(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!result.ok) {
        throw new Error(result.data.detail || 'Login failed');
      }

      const data = result.data;
      
      // Check if MFA is required
      if (data.mfa_required) {
        return { 
          success: false, 
          mfaRequired: true, 
          userId: data.user_id,
          message: data.message || 'Please enter your 6-digit MFA code'
        };
      }
      
      // Login successful
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('token', data.access_token);
      
      // Return success without auto-navigation - let the caller handle it
      // This allows SecurityLogin and HealthLogin to navigate to their respective dashboards
      return { success: true, user: data.user, mfaEnabled: data.user?.mfa_enabled };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await xhrRequest(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!result.ok) {
        throw new Error(result.data.detail || 'Registration failed');
      }

      // Store token and user from registration response if provided
      if (result.data.access_token) {
        setToken(result.data.access_token);
        setUser(result.data.user);
        localStorage.setItem('token', result.data.access_token);
        return { success: true, user: result.data.user };
      }

      // If no token in response, try to login
      const loginResult = await xhrRequest(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userData.email, password: userData.password })
      });

      if (!loginResult.ok) {
        throw new Error(loginResult.data.detail || 'Auto-login failed');
      }

      setToken(loginResult.data.access_token);
      setUser(loginResult.data.user);
      localStorage.setItem('token', loginResult.data.access_token);
      
      return { success: true, user: loginResult.data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    isSuperAdmin: user?.role === 'superadmin',
    isDoctor: user?.role === 'doctor',
    isPatient: user?.role === 'user' || user?.role === 'patient'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
