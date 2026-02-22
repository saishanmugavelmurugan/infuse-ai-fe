/**
 * SecureSphere XHR API - XMLHttpRequest-based API calls to avoid rrweb-recorder interference
 * This utility should be used by all SecureSphere components for API calls
 */

import { API_URL } from '../config/api';

// XMLHttpRequest-based request that is immune to rrweb-recorder interference
export const xhrRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);
    
    // Set headers
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
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
        data = { detail: 'Invalid response' };
      }
      
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(new Error(data.detail || `Request failed with status ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.ontimeout = () => reject(new Error('Request timeout'));
    xhr.timeout = 30000;
    xhr.send(options.body);
  });
};

// File upload using XMLHttpRequest
export const xhrUpload = (url, formData, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    
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

// SecureSphere API endpoints
export const securesphereXhrApi = {
  // Devices
  devices: {
    getByUser: (userId) => xhrRequest(`${API_URL}/api/securesphere/devices/user/${userId}`),
    getStats: () => xhrRequest(`${API_URL}/api/securesphere/devices/stats/overview`),
    register: (deviceData) => xhrRequest(`${API_URL}/api/securesphere/devices/register`, {
      method: 'POST',
      body: JSON.stringify(deviceData)
    }),
    delete: (deviceId) => xhrRequest(`${API_URL}/api/securesphere/devices/${deviceId}`, {
      method: 'DELETE'
    }),
    heartbeat: (deviceId) => xhrRequest(`${API_URL}/api/securesphere/devices/${deviceId}/heartbeat`, {
      method: 'POST',
      body: JSON.stringify({})
    })
  },

  // URL Scanner
  urlScanner: {
    scan: (url, context = null) => xhrRequest(`${API_URL}/api/securesphere/url/scan`, {
      method: 'POST',
      body: JSON.stringify({ url, context })
    }),
    getStats: () => xhrRequest(`${API_URL}/api/securesphere/url/stats`),
    getHistory: (limit = 20) => xhrRequest(`${API_URL}/api/securesphere/url/history?limit=${limit}`)
  },

  // SMS Analyzer
  smsAnalyzer: {
    analyze: (message, sender = null) => xhrRequest(`${API_URL}/api/securesphere/sms/analyze`, {
      method: 'POST',
      body: JSON.stringify({ message, sender })
    }),
    getStats: () => xhrRequest(`${API_URL}/api/securesphere/sms/stats`),
    getHistory: (limit = 20) => xhrRequest(`${API_URL}/api/securesphere/sms/history?limit=${limit}`),
    getFraudTypes: () => xhrRequest(`${API_URL}/api/securesphere/sms/fraud-types`)
  },

  // Threat Scoring
  threatScoring: {
    calculate: (deviceData) => xhrRequest(`${API_URL}/api/securesphere/threat-score/calculate`, {
      method: 'POST',
      body: JSON.stringify(deviceData)
    }),
    getDeviceScore: (deviceId) => xhrRequest(`${API_URL}/api/securesphere/threat-score/device/${deviceId}`),
    getHistory: (deviceId, limit = 50) => xhrRequest(`${API_URL}/api/securesphere/threat-score/history/${deviceId}?limit=${limit}`),
    getAlerts: (deviceId) => xhrRequest(`${API_URL}/api/securesphere/threat-score/alerts/${deviceId}`),
    getPostureSummary: (userId = null) => {
      const params = userId ? `?user_id=${userId}` : '';
      return xhrRequest(`${API_URL}/api/securesphere/threat-score/posture/summary${params}`);
    }
  },

  // Dashboard
  dashboard: {
    getOverview: (userId = null) => {
      const params = userId ? `?user_id=${userId}` : '';
      return xhrRequest(`${API_URL}/api/securesphere/dashboard/overview${params}`);
    },
    getRecentThreats: (limit = 10) => xhrRequest(`${API_URL}/api/securesphere/dashboard/threats/recent?limit=${limit}`),
    getTimeline: (days = 7) => xhrRequest(`${API_URL}/api/securesphere/dashboard/stats/timeline?days=${days}`),
    getRecommendations: () => xhrRequest(`${API_URL}/api/securesphere/dashboard/recommendations`),
    getAIInsights: () => xhrRequest(`${API_URL}/api/securesphere/dashboard/ai-insights`)
  },

  // IoT Security
  iotSecurity: {
    getOverview: () => xhrRequest(`${API_URL}/api/securesphere/iot-security/dashboard/overview`),
    getEndpoints: (ownerId) => xhrRequest(`${API_URL}/api/securesphere/iot-security/endpoints?owner_id=${ownerId}`),
    getCategories: () => xhrRequest(`${API_URL}/api/securesphere/iot-security/categories`),
    getVulnerabilities: () => xhrRequest(`${API_URL}/api/securesphere/iot-security/firmware/vulnerabilities`),
    registerEndpoint: (data) => xhrRequest(`${API_URL}/api/securesphere/iot-security/endpoints/register`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    scanFirmware: (endpointId, firmwareVersion) => xhrRequest(`${API_URL}/api/securesphere/iot-security/firmware/scan`, {
      method: 'POST',
      body: JSON.stringify({ endpoint_id: endpointId, firmware_version: firmwareVersion })
    }),
    analyzeTraffic: (endpointId) => xhrRequest(`${API_URL}/api/securesphere/iot-security/traffic/analyze`, {
      method: 'POST',
      body: JSON.stringify({ endpoint_id: endpointId })
    }),
    updateProtection: (endpointId, settings) => xhrRequest(
      `${API_URL}/api/securesphere/iot-security/endpoints/${endpointId}/protection`,
      { method: 'PUT', body: JSON.stringify(settings) }
    )
  },

  // GSM Fraud Detection
  gsmFraud: {
    getOverview: () => xhrRequest(`${API_URL}/api/securesphere/gsm-fraud/dashboard/overview`),
    getFraudTypes: () => xhrRequest(`${API_URL}/api/securesphere/gsm-fraud/fraud-types`),
    getSimSwapAlerts: (limit = 10) => xhrRequest(`${API_URL}/api/securesphere/gsm-fraud/sim-swap/alerts?limit=${limit}`),
    getIMSIAlerts: (limit = 10) => xhrRequest(`${API_URL}/api/securesphere/gsm-fraud/imsi-catcher/alerts?limit=${limit}`),
    getPremiumRateAlerts: (limit = 10) => xhrRequest(`${API_URL}/api/securesphere/gsm-fraud/premium-rate/alerts?limit=${limit}`),
    getBypassAlerts: (limit = 10) => xhrRequest(`${API_URL}/api/securesphere/gsm-fraud/bypass/alerts?limit=${limit}`),
    validateSwap: (phoneNumber, userContext) => xhrRequest(`${API_URL}/api/securesphere/gsm-fraud/sim-swap/validate`, {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, user_context: userContext })
    }),
    detectIMSICatcher: (towerData) => xhrRequest(`${API_URL}/api/securesphere/gsm-fraud/imsi-catcher/detect`, {
      method: 'POST',
      body: JSON.stringify(towerData)
    }),
    analyzeCall: (callData) => xhrRequest(`${API_URL}/api/securesphere/gsm-fraud/premium-rate/analyze`, {
      method: 'POST',
      body: JSON.stringify(callData)
    }),
    detectBypass: (trafficData) => xhrRequest(`${API_URL}/api/securesphere/gsm-fraud/bypass/detect`, {
      method: 'POST',
      body: JSON.stringify(trafficData)
    })
  },

  // Telecom Integration
  telecom: {
    getProviders: () => xhrRequest(`${API_URL}/api/securesphere/telecom/providers`),
    getStats: () => xhrRequest(`${API_URL}/api/securesphere/telecom/stats`),
    getIotDevices: () => xhrRequest(`${API_URL}/api/securesphere/telecom/iot/devices`),
    simulateEvent: (eventType, count = 1) => xhrRequest(
      `${API_URL}/api/securesphere/telecom/ran/simulate?event_type=${eventType}&count=${count}`,
      { method: 'POST' }
    ),
    configureProvider: (config) => xhrRequest(`${API_URL}/api/securesphere/telecom/providers/configure`, {
      method: 'POST',
      body: JSON.stringify(config)
    }),
    registerIotDevice: (deviceData) => xhrRequest(`${API_URL}/api/securesphere/telecom/iot/register`, {
      method: 'POST',
      body: JSON.stringify(deviceData)
    })
  },

  // Automotive
  automotive: {
    getStats: () => xhrRequest(`${API_URL}/api/securesphere/automotive/stats`),
    getVehicle: (vehicleId) => xhrRequest(`${API_URL}/api/securesphere/automotive/vehicles/${vehicleId}`),
    getOwnerVehicles: (ownerId) => xhrRequest(`${API_URL}/api/securesphere/automotive/vehicles/owner/${ownerId}`),
    registerVehicle: (data) => xhrRequest(`${API_URL}/api/securesphere/automotive/vehicles/register`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    reportEvent: (event) => xhrRequest(`${API_URL}/api/securesphere/automotive/events/report`, {
      method: 'POST',
      body: JSON.stringify(event)
    }),
    getEvents: (vehicleId) => xhrRequest(`${API_URL}/api/securesphere/automotive/events/${vehicleId}`),
    analyzeCANBus: (data) => xhrRequest(`${API_URL}/api/securesphere/automotive/can-bus/analyze`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    verifyOTA: (params) => xhrRequest(`${API_URL}/api/securesphere/automotive/ota/verify?${new URLSearchParams(params)}`, {
      method: 'POST'
    }),
    getThreatCategories: () => xhrRequest(`${API_URL}/api/securesphere/automotive/threat-categories`)
  },

  // Webhooks
  webhooks: {
    list: () => xhrRequest(`${API_URL}/api/webhooks/`),
    getEventTypes: () => xhrRequest(`${API_URL}/api/webhooks/events/types`),
    getDeliveries: (webhookId) => xhrRequest(`${API_URL}/api/webhooks/${webhookId}/deliveries`),
    create: (webhookData) => xhrRequest(`${API_URL}/api/webhooks/`, {
      method: 'POST',
      body: JSON.stringify(webhookData)
    }),
    delete: (webhookId) => xhrRequest(`${API_URL}/api/webhooks/${webhookId}`, { method: 'DELETE' }),
    enable: (webhookId) => xhrRequest(`${API_URL}/api/webhooks/${webhookId}/enable`, { method: 'POST' }),
    disable: (webhookId) => xhrRequest(`${API_URL}/api/webhooks/${webhookId}/disable`, { method: 'POST' }),
    test: (webhookId) => xhrRequest(`${API_URL}/api/webhooks/${webhookId}/test`, { method: 'POST' }),
    rotateSecret: (webhookId) => xhrRequest(`${API_URL}/api/webhooks/${webhookId}/rotate-secret`, { method: 'POST' }),
    retryDelivery: (deliveryId) => xhrRequest(`${API_URL}/api/webhooks/deliveries/${deliveryId}/retry`, { method: 'POST' })
  },

  // VRAN (Threat Center)
  vran: {
    getStats: () => xhrRequest(`${API_URL}/api/vran/dashboard/stats`),
    analyze: (data) => xhrRequest(`${API_URL}/api/vran/analyze`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    uploadFile: (formData, segment) => xhrUpload(
      `${API_URL}/api/vran/bulk/upload/file?segment=${segment}&user_id=demo_user`,
      formData
    ),
    getResults: (segment, startDate = null, endDate = null) => {
      let url = `${API_URL}/api/vran/results/${segment}`;
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (params.toString()) url += `?${params}`;
      return xhrRequest(url);
    }
  },

  // OEM SDK Portal
  oemSdk: {
    getPricing: () => xhrRequest(`${API_URL}/api/oem-sdk/pricing`),
    register: (data) => xhrRequest(`${API_URL}/api/oem-sdk/register`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
};

export default securesphereXhrApi;
