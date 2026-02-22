import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Key, BarChart3, FileKey, Shield, Globe, 
  FileText, Settings, RefreshCw, Loader2, Plus, Trash2, 
  ToggleLeft, ToggleRight, Download, Search, Copy, Eye, 
  EyeOff, ChevronRight, AlertCircle, CheckCircle, XCircle,
  Clock, Activity, Users, TrendingUp, Filter, Calendar
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminConsole = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [realtimeMetrics, setRealtimeMetrics] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [licenseTiers, setLicenseTiers] = useState([]);
  const [ipWhitelist, setIpWhitelist] = useState([]);
  const [ipConfig, setIpConfig] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditSummary, setAuditSummary] = useState(null);
  const [ssoProviders, setSsoProviders] = useState([]);
  const [exportDataTypes, setExportDataTypes] = useState([]);
  
  // Form states
  const [newApiKey, setNewApiKey] = useState({ name: '', description: '', permissions: ['read'], rate_limit: 1000 });
  const [newIpEntry, setNewIpEntry] = useState({ ip_address: '', description: '' });
  const [showNewApiKey, setShowNewApiKey] = useState(null);
  
  // Filters
  const [auditFilter, setAuditFilter] = useState({ category: '', severity: '', days: 7 });

  const fetchData = useCallback(async (endpoint, setter, key = null) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        setter(key ? data[key] : data);
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  }, []);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchData('/api/admin/analytics/overview', setAnalyticsOverview, 'overview'),
      fetchData('/api/admin/analytics/realtime', setRealtimeMetrics, 'metrics'),
      fetchData('/api/admin/licenses/tiers', setLicenseTiers, 'tiers'),
    ]);
    setLoading(false);
  }, [fetchData]);

  const loadApiKeys = useCallback(async () => {
    setLoading(true);
    await fetchData('/api/admin/api-keys', setApiKeys, 'api_keys');
    setLoading(false);
  }, [fetchData]);

  const loadIpWhitelist = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchData('/api/enterprise/ip-whitelist/config', setIpConfig, 'config'),
      fetchData('/api/enterprise/ip-whitelist/entries', setIpWhitelist, 'entries'),
    ]);
    setLoading(false);
  }, [fetchData]);

  const loadAuditLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (auditFilter.category) params.append('category', auditFilter.category);
    if (auditFilter.severity) params.append('severity', auditFilter.severity);
    params.append('days', auditFilter.days);
    
    await Promise.all([
      fetchData(`/api/enterprise/audit/logs?${params}`, setAuditLogs, 'logs'),
      fetchData('/api/enterprise/audit/summary', setAuditSummary, 'summary'),
    ]);
    setLoading(false);
  }, [fetchData, auditFilter]);

  const loadEnterprise = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchData('/api/enterprise/sso/providers/templates', setSsoProviders, 'providers'),
      fetchData('/api/enterprise/export/data-types', setExportDataTypes, 'data_types'),
    ]);
    setLoading(false);
  }, [fetchData]);

  useEffect(() => {
    switch (activeSection) {
      case 'overview':
        loadOverview();
        break;
      case 'api-keys':
        loadApiKeys();
        break;
      case 'ip-whitelist':
        loadIpWhitelist();
        break;
      case 'audit':
        loadAuditLogs();
        break;
      case 'enterprise':
        loadEnterprise();
        break;
      default:
        break;
    }
  }, [activeSection, loadOverview, loadApiKeys, loadIpWhitelist, loadAuditLogs, loadEnterprise]);

  // API Key Management
  const createApiKey = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/api-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApiKey),
      });
      if (response.ok) {
        const data = await response.json();
        setShowNewApiKey(data);
        setNewApiKey({ name: '', description: '', permissions: ['read'], rate_limit: 1000 });
        loadApiKeys();
      }
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const toggleApiKey = async (keyId) => {
    try {
      await fetch(`${API_URL}/api/admin/api-keys/${keyId}/toggle`, { method: 'POST' });
      loadApiKeys();
    } catch (error) {
      console.error('Error toggling API key:', error);
    }
  };

  const deleteApiKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this API key?')) return;
    try {
      await fetch(`${API_URL}/api/admin/api-keys/${keyId}`, { method: 'DELETE' });
      loadApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  // IP Whitelist Management
  const addIpEntry = async () => {
    try {
      await fetch(`${API_URL}/api/enterprise/ip-whitelist/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIpEntry),
      });
      setNewIpEntry({ ip_address: '', description: '' });
      loadIpWhitelist();
    } catch (error) {
      console.error('Error adding IP entry:', error);
    }
  };

  const deleteIpEntry = async (entryId) => {
    try {
      await fetch(`${API_URL}/api/enterprise/ip-whitelist/entries/${entryId}`, { method: 'DELETE' });
      loadIpWhitelist();
    } catch (error) {
      console.error('Error deleting IP entry:', error);
    }
  };

  // Sidebar Navigation
  const sidebarItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'api-keys', label: 'API Key Management', icon: Key },
    { id: 'analytics', label: 'Usage Analytics', icon: BarChart3 },
    { id: 'ip-whitelist', label: 'IP Whitelisting', icon: Globe },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'enterprise', label: 'Enterprise Features', icon: Shield },
    { id: 'licenses', label: 'License Management', icon: FileKey },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Render Overview Section
  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <button 
          onClick={loadOverview}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Realtime Metrics */}
      {realtimeMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">System Status</p>
                <p className={`text-lg font-bold ${realtimeMetrics.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {realtimeMetrics.status?.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-lg font-bold text-gray-900">{realtimeMetrics.active_users}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Requests (5min)</p>
                <p className="text-lg font-bold text-gray-900">{realtimeMetrics.requests_last_5min}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Error Rate</p>
                <p className="text-lg font-bold text-gray-900">{realtimeMetrics.error_rate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overview */}
      {analyticsOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Users</span>
                <span className="font-bold text-gray-900">{analyticsOverview.users?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users</span>
                <span className="font-bold text-green-600">{analyticsOverview.users?.active || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Users (30d)</span>
                <span className="font-bold text-blue-600">{analyticsOverview.users?.new || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Growth Rate</span>
                <span className="font-bold text-purple-600">{analyticsOverview.users?.growth_rate || 0}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Usage</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total API Calls</span>
                <span className="font-bold text-gray-900">{analyticsOverview.api?.total_calls || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Daily Calls</span>
                <span className="font-bold text-gray-900">{analyticsOverview.api?.avg_daily || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">HealthTrack Pro</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Patients</span>
                <span className="font-bold">{analyticsOverview.products?.healthtrack?.patients || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Appointments</span>
                <span className="font-bold">{analyticsOverview.products?.healthtrack?.appointments || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Prescriptions</span>
                <span className="font-bold">{analyticsOverview.products?.healthtrack?.prescriptions || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SecureSphere</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">URL Scans</span>
                <span className="font-bold">{analyticsOverview.products?.securesphere?.url_scans || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Threats Detected</span>
                <span className="font-bold text-red-600">{analyticsOverview.products?.securesphere?.threats_detected || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">SMS Analyses</span>
                <span className="font-bold">{analyticsOverview.products?.securesphere?.sms_analyses || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Threat Rate</span>
                <span className="font-bold text-orange-600">{analyticsOverview.products?.securesphere?.threat_rate || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* License Tiers */}
      {licenseTiers?.length > 0 && (
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">License Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {licenseTiers.map((tier, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:border-orange-300 transition">
                <h4 className="font-bold text-gray-900">{tier.name}</h4>
                <p className="text-2xl font-bold text-orange-500 mt-2">
                  {tier.price === 0 ? 'Free' : `$${tier.price}/mo`}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  {tier.features?.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render API Keys Section
  const renderApiKeys = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">API Key Management</h2>
        <button 
          onClick={loadApiKeys}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* New API Key Modal */}
      {showNewApiKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">API Key Created!</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800 mb-2">⚠️ Save this key now! It won't be shown again.</p>
              <div className="flex items-center gap-2 bg-white rounded p-2">
                <code className="flex-1 text-sm break-all">{showNewApiKey.api_key}</code>
                <button 
                  onClick={() => copyToClipboard(showNewApiKey.api_key)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowNewApiKey(null)}
              className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              I've Saved the Key
            </button>
          </div>
        </div>
      )}

      {/* Create New API Key */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New API Key</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Key Name"
            value={newApiKey.name}
            onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newApiKey.description}
            onChange={(e) => setNewApiKey({ ...newApiKey, description: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <select
            multiple
            value={newApiKey.permissions}
            onChange={(e) => setNewApiKey({ ...newApiKey, permissions: Array.from(e.target.selectedOptions, o => o.value) })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="read">Read</option>
            <option value="write">Write</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="number"
            placeholder="Rate Limit (per hour)"
            value={newApiKey.rate_limit}
            onChange={(e) => setNewApiKey({ ...newApiKey, rate_limit: parseInt(e.target.value) })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <button
          onClick={createApiKey}
          disabled={!newApiKey.name}
          className="mt-4 flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 transition"
        >
          <Plus className="w-4 h-4" /> Generate API Key
        </button>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Active API Keys ({apiKeys.length})</h3>
        </div>
        {apiKeys.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Key className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No API keys created yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{key.name}</h4>
                    <p className="text-sm text-gray-500">{key.description || 'No description'}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Prefix: {key.key_prefix}</span>
                      <span>Rate: {key.rate_limit}/hr</span>
                      <span>Permissions: {key.permissions?.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleApiKey(key.id)}
                      className={`p-2 rounded-lg ${key.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      {key.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={() => deleteApiKey(key.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Render IP Whitelist Section
  const renderIpWhitelist = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">IP Whitelisting</h2>
        <button 
          onClick={loadIpWhitelist}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Config Status */}
      {ipConfig && (
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${ipConfig.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {ipConfig.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">Mode:</span>
              <span className="font-medium text-gray-900 capitalize">{ipConfig.enforcement_mode}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">Applied to:</span>
              <span className="font-medium text-gray-900">{ipConfig.apply_to?.join(', ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add New IP */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add IP Address</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="IP Address or CIDR (e.g., 192.168.1.0/24)"
            value={newIpEntry.ip_address}
            onChange={(e) => setNewIpEntry({ ...newIpEntry, ip_address: e.target.value })}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <input
            type="text"
            placeholder="Description"
            value={newIpEntry.description}
            onChange={(e) => setNewIpEntry({ ...newIpEntry, description: e.target.value })}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <button
            onClick={addIpEntry}
            disabled={!newIpEntry.ip_address}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* IP Whitelist Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Whitelisted IPs ({ipWhitelist.length})</h3>
        </div>
        {ipWhitelist.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No IP addresses whitelisted</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">IP Address</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Created</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ipWhitelist.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{entry.ip_address}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{entry.description || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${entry.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {entry.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteIpEntry(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // Render Audit Logs Section
  const renderAuditLogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
        <button 
          onClick={loadAuditLogs}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary Stats */}
      {auditSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">{auditSummary.total_events}</p>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-sm text-gray-500">By Severity</p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Info: {auditSummary.by_severity?.info || 0}</span>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Warn: {auditSummary.by_severity?.warning || 0}</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Error: {auditSummary.by_severity?.error || 0}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-sm text-gray-500">Period</p>
            <p className="text-lg font-bold text-gray-900">{auditSummary.period_days} days</p>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-sm text-gray-500">Top Events</p>
            <p className="text-lg font-bold text-gray-900">{auditSummary.top_events?.length || 0} types</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={auditFilter.category}
            onChange={(e) => setAuditFilter({ ...auditFilter, category: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="">All Categories</option>
            <option value="authentication">Authentication</option>
            <option value="authorization">Authorization</option>
            <option value="data_access">Data Access</option>
            <option value="security">Security</option>
            <option value="configuration">Configuration</option>
            <option value="api">API</option>
            <option value="compliance">Compliance</option>
          </select>
          <select
            value={auditFilter.severity}
            onChange={(e) => setAuditFilter({ ...auditFilter, severity: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={auditFilter.days}
            onChange={(e) => setAuditFilter({ ...auditFilter, days: parseInt(e.target.value) })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button 
            onClick={loadAuditLogs}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Recent Logs ({auditLogs.length})</h3>
        </div>
        {auditLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No audit logs found for the selected filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Timestamp</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Event</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Severity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.event_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.category || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        log.severity === 'error' || log.severity === 'critical' ? 'bg-red-100 text-red-700' :
                        log.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        log.outcome === 'success' ? 'bg-green-100 text-green-700' :
                        log.outcome === 'failure' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {log.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Render Enterprise Features Section
  const renderEnterprise = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Enterprise Features</h2>

      {/* SSO Providers */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SSO Configuration Templates</h3>
        <p className="text-sm text-gray-500 mb-4">Pre-configured templates for enterprise single sign-on integration.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ssoProviders.map((provider, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {provider.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{provider.name}</h4>
                  <p className="text-xs text-gray-500">{provider.type}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{provider.description}</p>
              <button className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium">
                Configure →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Data Export</h3>
        <p className="text-sm text-gray-500 mb-4">Export platform data for compliance and reporting needs.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {exportDataTypes.map((dataType, idx) => (
            <div key={idx} className="border rounded-lg p-3 text-center hover:border-orange-300 transition cursor-pointer">
              <Download className="w-5 h-5 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">{dataType.name || dataType}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
          Start Export Wizard
        </button>
      </div>

      {/* Feature Status */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium">SSO Integration</span>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Available</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-green-600" />
              <span className="font-medium">Bulk Export</span>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Available</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-green-600" />
              <span className="font-medium">IP Whitelisting</span>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Available</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium">Audit Logging</span>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Available</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render content based on active section
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'api-keys':
        return renderApiKeys();
      case 'analytics':
        return renderOverview(); // Reuse overview for analytics
      case 'ip-whitelist':
        return renderIpWhitelist();
      case 'audit':
        return renderAuditLogs();
      case 'enterprise':
        return renderEnterprise();
      case 'licenses':
        return renderOverview(); // License info is in overview
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold"
            >
              <span className="text-gray-900">Infuse</span>
              <span className="text-orange-500">.AI</span>
            </button>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
              Admin Console
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => navigate('/admin/super')}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Super Admin
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeSection === item.id 
                    ? 'bg-orange-50 text-orange-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminConsole;
