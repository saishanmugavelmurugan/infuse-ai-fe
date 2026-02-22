/**
 * Health Schemes and AI Comparator API Service
 * Uses XMLHttpRequest to avoid rrweb-recorder interference
 */

import { API_URL } from '../config/api';

// XMLHttpRequest-based request that is immune to rrweb-recorder interference
const xhrRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);
    
    // Set headers
    const headers = options.headers || { 'Content-Type': 'application/json' };
    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });
    
    xhr.onload = () => {
      let data;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } catch (e) {
        data = { detail: 'Invalid response' };
      }
      
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        resolve(data); // Return data even on error for error handling
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.ontimeout = () => reject(new Error('Request timeout'));
    xhr.timeout = 30000;
    xhr.send(options.body);
  });
};

// Get user's country from browser/IP
export const detectUserCountry = async () => {
  try {
    // Try ipapi.co first (free, no API key needed)
    const data = await xhrRequest('https://ipapi.co/json/');
    if (data && data.country_code) {
      return {
        country_code: data.country_code,
        country_name: data.country_name,
        region: data.region,
        city: data.city
      };
    }
  } catch (error) {
    console.warn('IP detection failed, using browser locale');
  }
  
  // Fallback to browser locale
  const locale = navigator.language || navigator.userLanguage;
  const countryMap = {
    'en-US': { country_code: 'US', country_name: 'United States' },
    'en-GB': { country_code: 'GB', country_name: 'United Kingdom' },
    'en-IN': { country_code: 'IN', country_name: 'India' },
    'hi-IN': { country_code: 'IN', country_name: 'India' },
    'en-CA': { country_code: 'CA', country_name: 'Canada' },
    'fr-FR': { country_code: 'FR', country_name: 'France' },
    'de-DE': { country_code: 'DE', country_name: 'Germany' },
    'ja-JP': { country_code: 'JP', country_name: 'Japan' },
    'en-AU': { country_code: 'AU', country_name: 'Australia' },
    'en-SG': { country_code: 'SG', country_name: 'Singapore' },
    'ar-AE': { country_code: 'AE', country_name: 'United Arab Emirates' }
  };
  
  return countryMap[locale] || { country_code: 'OTHER', country_name: 'Other' };
};

// Health Schemes API
export const healthSchemesApi = {
  // Get all supported regions
  getRegions: async () => {
    return xhrRequest(`${API_URL}/api/health-schemes/regions`);
  },
  
  // Get schemes by country code
  getSchemesByRegion: async (countryCode) => {
    return xhrRequest(`${API_URL}/api/health-schemes/by-region/${countryCode}`);
  },
  
  // Get scheme details
  getSchemeDetails: async (schemeId) => {
    return xhrRequest(`${API_URL}/api/health-schemes/scheme/${schemeId}`);
  },
  
  // Submit user health scheme
  submitScheme: async (submission) => {
    return xhrRequest(`${API_URL}/api/health-schemes/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    });
  },
  
  // Compare schemes
  compareSchemes: async (schemeIds) => {
    return xhrRequest(`${API_URL}/api/health-schemes/compare?scheme_ids=${schemeIds.join(',')}`);
  },
  
  // Get statistics
  getStatistics: async () => {
    return xhrRequest(`${API_URL}/api/health-schemes/statistics`);
  }
};

// AI Comparator API
export const aiComparatorApi = {
  // AI-powered scheme comparison
  compareSchemes: async (schemeIds, userContext = null, focusAreas = null) => {
    return xhrRequest(`${API_URL}/api/ai-comparator/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheme_ids: schemeIds,
        user_context: userContext,
        focus_areas: focusAreas
      })
    });
  },
  
  // Get best practices report
  getBestPractices: async (countryCode, schemeType = null, focusArea = null) => {
    return xhrRequest(`${API_URL}/api/ai-comparator/best-practices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country_code: countryCode,
        scheme_type: schemeType,
        focus_area: focusArea
      })
    });
  },
  
  // Get AI recommendation
  getRecommendation: async (userProfile, preferences = null) => {
    return xhrRequest(`${API_URL}/api/ai-comparator/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_profile: userProfile,
        preferences: preferences
      })
    });
  },
  
  // Get government consultation report
  getGovernmentConsultation: async (countryCode, focus = null) => {
    const url = focus 
      ? `${API_URL}/api/ai-comparator/government-consultation/${countryCode}?focus=${focus}`
      : `${API_URL}/api/ai-comparator/government-consultation/${countryCode}`;
    return xhrRequest(url);
  },
  
  // Get analytics
  getAnalytics: async () => {
    return xhrRequest(`${API_URL}/api/ai-comparator/analytics`);
  }
};

// Super Admin API
export const superAdminApi = {
  // Dashboard
  getDashboard: async () => {
    return xhrRequest(`${API_URL}/api/admin/dashboard`);
  },
  
  // Reports
  getUserAnalytics: async (days = 30) => {
    return xhrRequest(`${API_URL}/api/admin/reports/user-analytics?days=${days}`);
  },
  
  getHealthSchemeUsage: async () => {
    return xhrRequest(`${API_URL}/api/admin/reports/health-scheme-usage`);
  },
  
  getClaimsSummary: async () => {
    return xhrRequest(`${API_URL}/api/admin/reports/claims-summary`);
  },
  
  getRevenue: async (days = 30) => {
    return xhrRequest(`${API_URL}/api/admin/reports/revenue?days=${days}`);
  },
  
  getAIUsage: async () => {
    return xhrRequest(`${API_URL}/api/admin/reports/ai-usage`);
  },
  
  // Support
  listUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return xhrRequest(`${API_URL}/api/admin/support/users?${params}`);
  },
  
  getUserDetails: async (userId) => {
    return xhrRequest(`${API_URL}/api/admin/support/users/${userId}`);
  },
  
  createImpersonationToken: async (userId, adminId) => {
    return xhrRequest(`${API_URL}/api/admin/support/impersonate/${userId}?admin_id=${adminId}`, {
      method: 'POST'
    });
  },
  
  listTickets: async (status = null, priority = null) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    return xhrRequest(`${API_URL}/api/admin/support/tickets?${params}`);
  },
  
  updateTicket: async (ticketId, update) => {
    return xhrRequest(`${API_URL}/api/admin/support/tickets/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
  },
  
  createAnnouncement: async (announcement) => {
    return xhrRequest(`${API_URL}/api/admin/support/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcement)
    });
  },
  
  listAnnouncements: async (activeOnly = true) => {
    return xhrRequest(`${API_URL}/api/admin/support/announcements?active_only=${activeOnly}`);
  },
  
  // Management
  listPendingDoctors: async () => {
    return xhrRequest(`${API_URL}/api/admin/management/doctors/pending`);
  },
  
  approveDoctor: async (doctorId, approved, rejectionReason = null) => {
    return xhrRequest(`${API_URL}/api/admin/management/doctors/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctor_id: doctorId,
        approved: approved,
        rejection_reason: rejectionReason
      })
    });
  },
  
  getSchemeConfigs: async () => {
    return xhrRequest(`${API_URL}/api/admin/management/health-schemes/config`);
  },
  
  updateSchemeConfig: async (config) => {
    return xhrRequest(`${API_URL}/api/admin/management/health-schemes/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
  },
  
  listSubscriptionPlans: async () => {
    return xhrRequest(`${API_URL}/api/admin/management/subscription-plans`);
  },
  
  updateSubscriptionPlan: async (planId, plan) => {
    return xhrRequest(`${API_URL}/api/admin/management/subscription-plans/${planId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
  }
};

export default { healthSchemesApi, aiComparatorApi, superAdminApi, detectUserCountry };
