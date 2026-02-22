// API utility functions - Uses XMLHttpRequest to avoid rrweb-recorder interference
import { API_URL } from '../config/api';

// XMLHttpRequest-based request that is immune to rrweb-recorder interference
const xhrRequest = (url, options = {}) => {
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
    xhr.timeout = 30000;
    xhr.send(options.body);
  });
};

export const api = {
  // Generic request handler using XMLHttpRequest
  async request(endpoint, options = {}) {
    return xhrRequest(`${API_URL}${endpoint}`, options);
  },

  // Health endpoints
  health: {
    getUsers: (skip = 0, limit = 50) => 
      api.request(`/api/health/users?skip=${skip}&limit=${limit}`),
    
    getUser: (userId) => 
      api.request(`/api/health/users/${userId}`),
    
    createUser: (userData) => 
      api.request('/api/health/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    updateUser: (userId, userData) => 
      api.request(`/api/health/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),
    
    deleteUser: (userId) => 
      api.request(`/api/health/users/${userId}`, {
        method: 'DELETE',
      }),

    // Health Records
    getRecords: (userId = null, skip = 0, limit = 50) => {
      const params = new URLSearchParams({ skip, limit });
      if (userId) params.append('user_id', userId);
      return api.request(`/api/health/records?${params}`);
    },
    
    getRecord: (recordId) => 
      api.request(`/api/health/records/${recordId}`),
    
    createRecord: (recordData) => 
      api.request('/api/health/records', {
        method: 'POST',
        body: JSON.stringify(recordData),
      }),

    // Doctors
    getDoctors: (practiceType = null, skip = 0, limit = 50) => {
      const params = new URLSearchParams({ skip, limit });
      if (practiceType) params.append('practice_type', practiceType);
      return api.request(`/api/health/doctors?${params}`);
    },
    
    getDoctor: (doctorId) => 
      api.request(`/api/health/doctors/${doctorId}`),
    
    createDoctor: (doctorData) => 
      api.request('/api/health/doctors', {
        method: 'POST',
        body: JSON.stringify(doctorData),
      }),

    // Medicines
    getMedicines: (type = null, skip = 0, limit = 50) => {
      const params = new URLSearchParams({ skip, limit });
      if (type) params.append('type', type);
      return api.request(`/api/health/medicines?${params}`);
    },
    
    createMedicine: (medicineData) => 
      api.request('/api/health/medicines', {
        method: 'POST',
        body: JSON.stringify(medicineData),
      }),
    
    updateMedicineStock: (medicineId, stock) => 
      api.request(`/api/health/medicines/${medicineId}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ stock }),
      }),

    // Billing
    getBilling: (userId = null, status = null, skip = 0, limit = 50) => {
      const params = new URLSearchParams({ skip, limit });
      if (userId) params.append('user_id', userId);
      if (status) params.append('status', status);
      return api.request(`/api/health/billing?${params}`);
    },
    
    createBilling: (billingData) => 
      api.request('/api/health/billing', {
        method: 'POST',
        body: JSON.stringify(billingData),
      }),
    
    updateBillingStatus: (billingId, status) => 
      api.request(`/api/health/billing/${billingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  },

  // Lab Reports
  labReports: {
    upload: async (file) => {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem('token');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/api/lab-reports/upload`);
        
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.onload = () => {
          let data;
          try {
            data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
          } catch (e) {
            data = { detail: 'Upload failed' };
          }
          
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
          } else {
            reject(new Error(data.detail || 'Upload failed'));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.ontimeout = () => reject(new Error('Upload timeout'));
        xhr.timeout = 60000; // 60 second timeout for uploads
        
        const formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);
      });
    },

    analyze: (fileId) => 
      api.request(`/api/lab-reports/analyze/${fileId}`, {
        method: 'POST',
      }),

    getDoctors: () => 
      api.request('/api/doctors'),
  },
};

export default api;
