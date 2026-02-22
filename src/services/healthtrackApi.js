// HealthTrack Pro API Service - Connects to backend /api/healthtrack/ endpoints
// Uses XMLHttpRequest fallback to avoid rrweb-recorder interference with fetch API
import { API_URL } from '../config/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// XMLHttpRequest-based request that is immune to rrweb-recorder interference
const xhrRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);
    
    // Set headers
    const headers = options.headers || getHeaders();
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
        resolve(data);
      } else {
        reject(new Error(data.detail || `Request failed with status ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.ontimeout = () => reject(new Error('Request timeout'));
    xhr.timeout = 30000; // 30 second timeout
    xhr.send(options.body);
  });
};

// Primary API request function - uses XMLHttpRequest to avoid monitoring tool conflicts
const apiRequest = async (url, options = {}) => {
  return xhrRequest(url, {
    ...options,
    headers: options.headers || getHeaders(),
  });
};

export const healthtrackApi = {
  // Patients
  patients: {
    list: async (skip = 0, limit = 50, search = '') => {
      const params = new URLSearchParams({ skip, limit });
      if (search) params.append('search', search);
      return apiRequest(`${API_URL}/api/healthtrack/patients?${params}`);
    },
    get: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/patients/${patientId}`);
    },
    create: async (patientData) => {
      return apiRequest(`${API_URL}/api/healthtrack/patients`, {
        method: 'POST',
        body: JSON.stringify(patientData),
      });
    },
    update: async (patientId, patientData) => {
      return apiRequest(`${API_URL}/api/healthtrack/patients/${patientId}`, {
        method: 'PUT',
        body: JSON.stringify(patientData),
      });
    },
    getMedicalHistory: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/patients/${patientId}/medical-history`);
    },
    getAppointments: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/patients/${patientId}/appointments`);
    },
    addVitals: async (patientId, vitalsData) => {
      return apiRequest(`${API_URL}/api/healthtrack/patients/${patientId}/vitals`, {
        method: 'POST',
        body: JSON.stringify(vitalsData),
      });
    },
  },

  // Appointments
  appointments: {
    list: async (skip = 0, limit = 50, statusFilter = '') => {
      const params = new URLSearchParams({ skip, limit });
      if (statusFilter) params.append('status_filter', statusFilter);
      return apiRequest(`${API_URL}/api/healthtrack/appointments?${params}`);
    },
    get: async (appointmentId) => {
      return apiRequest(`${API_URL}/api/healthtrack/appointments/${appointmentId}`);
    },
    create: async (appointmentData) => {
      return apiRequest(`${API_URL}/api/healthtrack/appointments`, {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });
    },
    update: async (appointmentId, appointmentData) => {
      return apiRequest(`${API_URL}/api/healthtrack/appointments/${appointmentId}`, {
        method: 'PUT',
        body: JSON.stringify(appointmentData),
      });
    },
    cancel: async (appointmentId, reason) => {
      return apiRequest(`${API_URL}/api/healthtrack/appointments/${appointmentId}?cancellation_reason=${encodeURIComponent(reason)}`, {
        method: 'DELETE',
      });
    },
    getAvailableSlots: async (doctorId, date) => {
      return apiRequest(`${API_URL}/api/healthtrack/appointments/slots/available?doctor_id=${doctorId}&appointment_date=${date}`);
    },
    getCalendar: async (month, year) => {
      return apiRequest(`${API_URL}/api/healthtrack/appointments/calendar/view?month=${month}&year=${year}`);
    },
  },

  // Prescriptions
  prescriptions: {
    list: async (skip = 0, limit = 50, patientId = '') => {
      const params = new URLSearchParams({ skip, limit });
      if (patientId) params.append('patient_id', patientId);
      return apiRequest(`${API_URL}/api/healthtrack/prescriptions?${params}`);
    },
    get: async (prescriptionId) => {
      return apiRequest(`${API_URL}/api/healthtrack/prescriptions/${prescriptionId}`);
    },
    create: async (prescriptionData) => {
      return apiRequest(`${API_URL}/api/healthtrack/prescriptions`, {
        method: 'POST',
        body: JSON.stringify(prescriptionData),
      });
    },
    getForPatient: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/prescriptions/patient/${patientId}`);
    },
    requestRefill: async (prescriptionId) => {
      return apiRequest(`${API_URL}/api/healthtrack/prescriptions/${prescriptionId}/refill`, {
        method: 'POST',
      });
    },
  },

  // Medical Records
  medicalRecords: {
    list: async (skip = 0, limit = 50, patientId = '') => {
      const params = new URLSearchParams({ skip, limit });
      if (patientId) params.append('patient_id', patientId);
      return apiRequest(`${API_URL}/api/healthtrack/medical-records?${params}`);
    },
    get: async (recordId) => {
      return apiRequest(`${API_URL}/api/healthtrack/medical-records/${recordId}`);
    },
    create: async (recordData) => {
      return apiRequest(`${API_URL}/api/healthtrack/medical-records`, {
        method: 'POST',
        body: JSON.stringify(recordData),
      });
    },
  },

  // Lab Tests
  labTests: {
    list: async (skip = 0, limit = 50, patientId = '') => {
      const params = new URLSearchParams({ skip, limit });
      if (patientId) params.append('patient_id', patientId);
      return apiRequest(`${API_URL}/api/healthtrack/lab-tests/orders?${params}`);
    },
    order: async (testData) => {
      return apiRequest(`${API_URL}/api/healthtrack/lab-tests/orders`, {
        method: 'POST',
        body: JSON.stringify(testData),
      });
    },
    getPatientResults: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/lab-tests/results/patient/${patientId}`);
    },
    getPatientTests: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/lab-tests/tests/patient/${patientId}`);
    },
  },

  // Drugs Database
  drugs: {
    search: async (query, skip = 0, limit = 20) => {
      const params = new URLSearchParams({ query, skip, limit });
      return apiRequest(`${API_URL}/api/healthtrack/drugs/search?${params}`);
    },
    get: async (drugId) => {
      return apiRequest(`${API_URL}/api/healthtrack/drugs/${drugId}`);
    },
  },

  // Drug Database (Extended with OpenFDA)
  drugDatabase: {
    search: async (query, limit = 20) => {
      const params = new URLSearchParams({ query, limit: limit.toString() });
      return apiRequest(`${API_URL}/api/healthtrack/drug-database/search?${params}`);
    },
    getDrug: async (drugId) => {
      return apiRequest(`${API_URL}/api/healthtrack/drug-database/drug/${drugId}`);
    },
    checkInteractions: async (drugIds) => {
      return apiRequest(`${API_URL}/api/healthtrack/drug-database/interactions?drug_ids=${drugIds.join(',')}`);
    },
    getByIndication: async (indication) => {
      return apiRequest(`${API_URL}/api/healthtrack/drug-database/by-indication/${encodeURIComponent(indication)}`);
    },
    getPregnancySafe: async (category = 'A') => {
      return apiRequest(`${API_URL}/api/healthtrack/drug-database/pregnancy-safe?category=${category}`);
    },
    // OpenFDA endpoints
    searchOpenFDA: async (query, limit = 10) => {
      const params = new URLSearchParams({ query, limit: limit.toString() });
      return apiRequest(`${API_URL}/api/healthtrack/drug-database/openfda/search?${params}`);
    },
    getAdverseEvents: async (drugName, limit = 10) => {
      const params = new URLSearchParams({ drug_name: drugName, limit: limit.toString() });
      return apiRequest(`${API_URL}/api/healthtrack/drug-database/openfda/adverse-events?${params}`);
    },
    combinedSearch: async (query, includeOpenFDA = true, limit = 20) => {
      const params = new URLSearchParams({ 
        query, 
        include_openfda: includeOpenFDA.toString(), 
        limit: limit.toString() 
      });
      return apiRequest(`${API_URL}/api/healthtrack/drug-database/combined-search?${params}`);
    },
  },

  // Billing
  billing: {
    list: async (skip = 0, limit = 50) => {
      const params = new URLSearchParams({ skip, limit });
      return apiRequest(`${API_URL}/api/healthtrack/billing?${params}`);
    },
    create: async (billingData) => {
      return apiRequest(`${API_URL}/api/healthtrack/billing`, {
        method: 'POST',
        body: JSON.stringify(billingData),
      });
    },
  },

  // Current User Info
  auth: {
    me: async () => {
      return apiRequest(`${API_URL}/api/auth/me`);
    },
  },

  // Organization
  organization: {
    getMy: async () => {
      return apiRequest(`${API_URL}/api/organizations/my-organization`);
    },
  },

  // AI Analytics
  aiAnalytics: {
    analyzeLabReport: async (labTestId, patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/ai-analytics/analyze-lab-report`, {
        method: 'POST',
        body: JSON.stringify({ lab_test_id: labTestId, patient_id: patientId }),
      });
    },
    analyzeWearableData: async (patientId, deviceType = 'apple_watch', days = 7) => {
      return apiRequest(`${API_URL}/api/healthtrack/ai-analytics/analyze-wearable-data`, {
        method: 'POST',
        body: JSON.stringify({ patient_id: patientId, device_type: deviceType, days }),
      });
    },
    getPatientAnalyses: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/ai-analytics/patient/${patientId}/analyses`);
    },
    getComprehensiveAnalysis: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/ai-analytics/comprehensive/${patientId}`);
    },
  },

  // Wearable Devices
  wearables: {
    getDevices: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/wearables/devices/${patientId}`);
    },
    connectDevice: async (patientId, deviceData) => {
      return apiRequest(`${API_URL}/api/healthtrack/wearables/devices/${patientId}/connect`, {
        method: 'POST',
        body: JSON.stringify(deviceData),
      });
    },
    disconnectDevice: async (patientId, deviceId) => {
      return apiRequest(`${API_URL}/api/healthtrack/wearables/devices/${patientId}/${deviceId}`, {
        method: 'DELETE',
      });
    },
    getData: async (patientId, deviceType = null, days = 7) => {
      const params = new URLSearchParams({ days });
      if (deviceType) params.append('device_type', deviceType);
      return apiRequest(`${API_URL}/api/healthtrack/wearables/data/${patientId}?${params}`);
    },
    syncData: async (patientId, deviceType) => {
      return apiRequest(`${API_URL}/api/healthtrack/wearables/data/${patientId}/sync?device_type=${deviceType}`, {
        method: 'POST',
      });
    },
    getTrends: async (patientId, metric = 'heart_rate', days = 30) => {
      return apiRequest(`${API_URL}/api/healthtrack/wearables/trends/${patientId}?metric=${metric}&days=${days}`);
    },
  },

  // ABDM (Ayushman Bharat Digital Mission)
  abdm: {
    // Status
    getStatus: async () => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/status`);
    },
    // ABHA Registration
    generateOtp: async (mobile) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/abha/generate-otp?mobile=${mobile}`, {
        method: 'POST',
      });
    },
    verifyOtp: async (mobile, otp, txnId) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/abha/verify-otp?mobile=${mobile}&otp=${otp}&txn_id=${txnId}`, {
        method: 'POST',
      });
    },
    registerAbha: async (registrationData) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/abha/register`, {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });
    },
    searchAbha: async (params) => {
      const queryParams = new URLSearchParams();
      if (params.mobile) queryParams.append('mobile', params.mobile);
      if (params.abha_number) queryParams.append('abha_number', params.abha_number);
      if (params.abha_address) queryParams.append('abha_address', params.abha_address);
      return apiRequest(`${API_URL}/api/healthtrack/abdm/abha/search?${queryParams}`);
    },
    linkPatient: async (linkData) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/abha/link-patient`, {
        method: 'POST',
        body: JSON.stringify(linkData),
      });
    },
    getPatientAbha: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/abha/patient/${patientId}`);
    },
    // Consent Management
    createConsentRequest: async (consentData) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/consent/request`, {
        method: 'POST',
        body: JSON.stringify(consentData),
      });
    },
    getPatientConsents: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/consent/patient/${patientId}`);
    },
    approveConsent: async (consentId) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/consent/${consentId}/approve`, {
        method: 'POST',
      });
    },
    denyConsent: async (consentId) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/consent/${consentId}/deny`, {
        method: 'POST',
      });
    },
    revokeConsent: async (consentId) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/consent/${consentId}/revoke`, {
        method: 'POST',
      });
    },
    // Health Records
    pushHealthRecord: async (recordData) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/health-records/push`, {
        method: 'POST',
        body: JSON.stringify(recordData),
      });
    },
    getPatientHealthRecords: async (patientId, recordType = null) => {
      const params = new URLSearchParams();
      if (recordType) params.append('record_type', recordType);
      return apiRequest(`${API_URL}/api/healthtrack/abdm/health-records/patient/${patientId}?${params}`);
    },
    getHealthRecord: async (recordId) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/health-records/${recordId}`);
    },
    // Facility Info
    getFacilityInfo: async () => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/facility/info`);
    },
    // Phase 2B: National Health Records
    fetchNationalRecords: async (fetchData) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/health-records/fetch`, {
        method: 'POST',
        body: JSON.stringify(fetchData),
      });
    },
    getNationalRecords: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/health-records/national/${patientId}`);
    },
    // Phase 2B: Ayushman Bharat Eligibility
    checkEligibility: async (eligibilityData) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/ayushman/eligibility/check`, {
        method: 'POST',
        body: JSON.stringify(eligibilityData),
      });
    },
    getEligibilityStatus: async (patientId) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/ayushman/eligibility/${patientId}`);
    },
    // Phase 2B: Claims Management
    submitClaim: async (claimData) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/ayushman/claims/submit`, {
        method: 'POST',
        body: JSON.stringify(claimData),
      });
    },
    getPatientClaims: async (patientId, status = null) => {
      const params = status ? `?status=${status}` : '';
      return apiRequest(`${API_URL}/api/healthtrack/abdm/ayushman/claims/patient/${patientId}${params}`);
    },
    getClaimDetails: async (claimId) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/ayushman/claims/${claimId}`);
    },
    updateClaimStatus: async (claimId, updateData) => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/ayushman/claims/${claimId}/update`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
    getClaimsDashboard: async () => {
      return apiRequest(`${API_URL}/api/healthtrack/abdm/ayushman/claims/dashboard/summary`);
    },
  },

  // AI Agents
  aiAgents: {
    // Health Insights AI Agent
    generateHealthInsights: async (patientId, analysisType = 'comprehensive', includeRecommendations = true) => {
      return apiRequest(`${API_URL}/api/healthtrack/ai-agents/health-insights`, {
        method: 'POST',
        body: JSON.stringify({
          patient_id: patientId,
          analysis_type: analysisType,
          include_recommendations: includeRecommendations
        }),
      });
    },
    getPatientInsights: async (patientId, limit = 10) => {
      return apiRequest(`${API_URL}/api/healthtrack/ai-agents/health-insights/patient/${patientId}?limit=${limit}`);
    },
    getCriticalAlerts: async (organizationId = null) => {
      const params = organizationId ? `?organization_id=${organizationId}` : '';
      return apiRequest(`${API_URL}/api/healthtrack/ai-agents/health-insights/critical-alerts${params}`);
    },
    // Revenue & Analytics AI Agent
    generateRevenueAnalytics: async (organizationId = null, timePeriod = '30d', analysisFocus = 'comprehensive') => {
      return apiRequest(`${API_URL}/api/healthtrack/ai-agents/revenue-analytics`, {
        method: 'POST',
        body: JSON.stringify({
          organization_id: organizationId,
          time_period: timePeriod,
          analysis_focus: analysisFocus
        }),
      });
    },
    getAnalyticsDashboard: async () => {
      return apiRequest(`${API_URL}/api/healthtrack/ai-agents/revenue-analytics/dashboard`);
    },
    getUsageReport: async (days = 30) => {
      return apiRequest(`${API_URL}/api/healthtrack/ai-agents/revenue-analytics/usage-report?days=${days}`);
    },
  },
};

export default healthtrackApi;
