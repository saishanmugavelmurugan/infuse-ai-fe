/**
 * SecureSphere API Service
 * Comprehensive cybersecurity platform API client
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

// URL Scanner API
export const urlScannerApi = {
  scan: async (url, context = null, deviceId = null, source = 'manual') => {
    return xhrRequest(`${API_URL}/api/securesphere/url/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, context, device_id: deviceId, source })
    });
  },
  
  scanBulk: async (urls, deviceId = null) => {
    return xhrRequest(`${API_URL}/api/securesphere/url/scan/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls, device_id: deviceId })
    });
  },
  
  checkReputation: async (urlHash) => {
    return xhrRequest(`${API_URL}/api/securesphere/url/check/${urlHash}`);
  },
  
  getHistory: async (deviceId = null, limit = 20, threatLevel = null) => {
    const params = new URLSearchParams({ limit });
    if (deviceId) params.append('device_id', deviceId);
    if (threatLevel) params.append('threat_level', threatLevel);
    return xhrRequest(`${API_URL}/api/securesphere/url/history?${params}`);
  },
  
  reportMalicious: async (url, reason, reporterId = null) => {
    const params = new URLSearchParams({ url, reason });
    if (reporterId) params.append('reporter_id', reporterId);
    return xhrRequest(`${API_URL}/api/securesphere/url/report?${params}`, {
      method: 'POST'
    });
  },
  
  getStats: async () => {
    return xhrRequest(`${API_URL}/api/securesphere/url/stats`);
  }
};

// SMS Analyzer API
export const smsAnalyzerApi = {
  analyze: async (message, sender = null, deviceId = null) => {
    return xhrRequest(`${API_URL}/api/securesphere/sms/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sender, device_id: deviceId })
    });
  },
  
  analyzeBulk: async (messages, deviceId = null) => {
    return xhrRequest(`${API_URL}/api/securesphere/sms/analyze/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, device_id: deviceId })
    });
  },
  
  getFraudTypes: async () => {
    return xhrRequest(`${API_URL}/api/securesphere/sms/fraud-types`);
  },
  
  getHistory: async (deviceId = null, limit = 20, fraudType = null) => {
    const params = new URLSearchParams({ limit });
    if (deviceId) params.append('device_id', deviceId);
    if (fraudType) params.append('fraud_type', fraudType);
    return xhrRequest(`${API_URL}/api/securesphere/sms/history?${params}`);
  },
  
  reportFraud: async (message, sender, fraudType, reporterId = null) => {
    const params = new URLSearchParams({ message, fraud_type: fraudType });
    if (sender) params.append('sender', sender);
    if (reporterId) params.append('reporter_id', reporterId);
    return xhrRequest(`${API_URL}/api/securesphere/sms/report?${params}`, {
      method: 'POST'
    });
  },
  
  checkSenderReputation: async (sender) => {
    return xhrRequest(`${API_URL}/api/securesphere/sms/sender/reputation/${encodeURIComponent(sender)}`);
  },
  
  getStats: async () => {
    return xhrRequest(`${API_URL}/api/securesphere/sms/stats`);
  }
};

// Threat Scoring API
export const threatScoringApi = {
  calculate: async (deviceData) => {
    return xhrRequest(`${API_URL}/api/securesphere/threat-score/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceData)
    });
  },
  
  getDeviceScore: async (deviceId) => {
    return xhrRequest(`${API_URL}/api/securesphere/threat-score/device/${deviceId}`);
  },
  
  getHistory: async (deviceId, limit = 50) => {
    return xhrRequest(`${API_URL}/api/securesphere/threat-score/history/${deviceId}?limit=${limit}`);
  },
  
  createAlert: async (deviceId, alertType, severity, details) => {
    return xhrRequest(`${API_URL}/api/securesphere/threat-score/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_id: deviceId, alert_type: alertType, severity, details })
    });
  },
  
  getAlerts: async (deviceId, status = null, severity = null) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (severity) params.append('severity', severity);
    return xhrRequest(`${API_URL}/api/securesphere/threat-score/alerts/${deviceId}?${params}`);
  },
  
  dismissAlert: async (alertId) => {
    return xhrRequest(`${API_URL}/api/securesphere/threat-score/alerts/${alertId}/dismiss`, {
      method: 'PUT'
    });
  },
  
  getPostureSummary: async (userId = null) => {
    const params = userId ? `?user_id=${userId}` : '';
    return xhrRequest(`${API_URL}/api/securesphere/threat-score/posture/summary${params}`);
  },
  
  getScoringFactors: async () => {
    return xhrRequest(`${API_URL}/api/securesphere/threat-score/factors`);
  }
};

// Device Registry API
export const deviceRegistryApi = {
  register: async (deviceData) => {
    return xhrRequest(`${API_URL}/api/securesphere/devices/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceData)
    });
  },
  
  getDevice: async (deviceId) => {
    return xhrRequest(`${API_URL}/api/securesphere/devices/${deviceId}`);
  },
  
  updateDevice: async (deviceId, updateData) => {
    return xhrRequest(`${API_URL}/api/securesphere/devices/${deviceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
  },
  
  deregisterDevice: async (deviceId) => {
    return xhrRequest(`${API_URL}/api/securesphere/devices/${deviceId}`, {
      method: 'DELETE'
    });
  },
  
  getUserDevices: async (userId) => {
    return xhrRequest(`${API_URL}/api/securesphere/devices/user/${userId}`);
  },
  
  heartbeat: async (deviceId, metadata = null) => {
    return xhrRequest(`${API_URL}/api/securesphere/devices/${deviceId}/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata || {})
    });
  },
  
  updateTrustLevel: async (deviceId, trustLevel) => {
    return xhrRequest(`${API_URL}/api/securesphere/devices/${deviceId}/trust-level?trust_level=${trustLevel}`, {
      method: 'PUT'
    });
  },
  
  getStats: async () => {
    return xhrRequest(`${API_URL}/api/securesphere/devices/stats/overview`);
  }
};

// Dashboard API
export const dashboardApi = {
  getOverview: async (userId = null) => {
    const params = userId ? `?user_id=${userId}` : '';
    return xhrRequest(`${API_URL}/api/securesphere/dashboard/overview${params}`);
  },
  
  getRecentThreats: async (limit = 10, threatType = null) => {
    const params = new URLSearchParams({ limit });
    if (threatType) params.append('threat_type', threatType);
    return xhrRequest(`${API_URL}/api/securesphere/dashboard/threats/recent?${params}`);
  },
  
  getTimeline: async (days = 7) => {
    return xhrRequest(`${API_URL}/api/securesphere/dashboard/stats/timeline?days=${days}`);
  },
  
  getRecommendations: async (userId = null) => {
    const params = userId ? `?user_id=${userId}` : '';
    return xhrRequest(`${API_URL}/api/securesphere/dashboard/recommendations${params}`);
  },
  
  getAIInsights: async () => {
    return xhrRequest(`${API_URL}/api/securesphere/dashboard/ai-insights`);
  },
  
  getTierDashboard: async (tierName) => {
    return xhrRequest(`${API_URL}/api/securesphere/dashboard/tier/${tierName}`);
  }
};

// Telecom API
export const telecomApi = {
  getProviders: async () => {
    return xhrRequest(`${API_URL}/api/securesphere/telecom/providers`);
  },
  
  configureProvider: async (config) => {
    return xhrRequest(`${API_URL}/api/securesphere/telecom/providers/configure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
  },
  
  processRANEvent: async (event, providerId = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (providerId) headers['X-Provider-Id'] = providerId;
    return xhrRequest(`${API_URL}/api/securesphere/telecom/ran/event`, {
      method: 'POST',
      headers,
      body: JSON.stringify(event)
    });
  },
  
  simulateRANEvent: async (eventType, count = 1) => {
    return xhrRequest(`${API_URL}/api/securesphere/telecom/ran/simulate?event_type=${eventType}&count=${count}`, {
      method: 'POST'
    });
  },
  
  registerIoTDevice: async (deviceData) => {
    return xhrRequest(`${API_URL}/api/securesphere/telecom/iot/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceData)
    });
  },
  
  listIoTDevices: async (providerId = null, deviceType = null) => {
    const params = new URLSearchParams();
    if (providerId) params.append('provider_id', providerId);
    if (deviceType) params.append('device_type', deviceType);
    return xhrRequest(`${API_URL}/api/securesphere/telecom/iot/devices?${params}`);
  },
  
  getStats: async () => {
    return xhrRequest(`${API_URL}/api/securesphere/telecom/stats`);
  }
};

// Automotive API
export const automotiveApi = {
  registerVehicle: async (vehicleData) => {
    return xhrRequest(`${API_URL}/api/securesphere/automotive/vehicles/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData)
    });
  },
  
  getVehicle: async (vehicleId) => {
    return xhrRequest(`${API_URL}/api/securesphere/automotive/vehicles/${vehicleId}`);
  },
  
  getOwnerVehicles: async (ownerId) => {
    return xhrRequest(`${API_URL}/api/securesphere/automotive/vehicles/owner/${ownerId}`);
  },
  
  reportEvent: async (event) => {
    return xhrRequest(`${API_URL}/api/securesphere/automotive/events/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
  },
  
  getEvents: async (vehicleId, severity = null) => {
    const params = severity ? `?severity=${severity}` : '';
    return xhrRequest(`${API_URL}/api/securesphere/automotive/events/${vehicleId}${params}`);
  },
  
  analyzeCANBus: async (data) => {
    return xhrRequest(`${API_URL}/api/securesphere/automotive/can-bus/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  
  verifyOTAUpdate: async (vehicleId, updateHash, updateVersion, updateSize) => {
    const params = new URLSearchParams({
      vehicle_id: vehicleId,
      update_hash: updateHash,
      update_version: updateVersion,
      update_size: updateSize
    });
    return xhrRequest(`${API_URL}/api/securesphere/automotive/ota/verify?${params}`, {
      method: 'POST'
    });
  },
  
  getThreatCategories: async () => {
    return xhrRequest(`${API_URL}/api/securesphere/automotive/threat-categories`);
  },
  
  getStats: async () => {
    return xhrRequest(`${API_URL}/api/securesphere/automotive/stats`);
  }
};

export default {
  urlScanner: urlScannerApi,
  smsAnalyzer: smsAnalyzerApi,
  threatScoring: threatScoringApi,
  deviceRegistry: deviceRegistryApi,
  dashboard: dashboardApi,
  telecom: telecomApi,
  automotive: automotiveApi
};
