import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, Shield, Settings, Bell, Key, LogOut,
  Plus, Trash2, Edit, CheckCircle, XCircle, RefreshCw, Loader2,
  TrendingUp, AlertTriangle, Lock, Unlock, Globe, Server,
  ChevronRight, Download, Upload, FileText, BarChart3, MapPin
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import IPWhitelistManager from './IPWhitelistManager';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const EnterpriseAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ orgId: '', adminToken: '' });
  const [loginError, setLoginError] = useState('');
  const [orgInfo, setOrgInfo] = useState(null);

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [ssoConfig, setSsoConfig] = useState(null);
  const [bulkOptions, setBulkOptions] = useState(null);

  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showSSOSetup, setShowSSOSetup] = useState(false);

  const headers = {
    'x-org-id': loginForm.orgId,
    'x-admin-token': loginForm.adminToken,
    'Content-Type': 'application/json'
  };

  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers }
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  }, [headers]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    const [dashboard, userList, deviceList, policyList, bulk] = await Promise.all([
      fetchWithAuth('/api/enterprise-admin/dashboard'),
      fetchWithAuth('/api/enterprise-admin/users'),
      fetchWithAuth('/api/enterprise-admin/devices'),
      fetchWithAuth('/api/enterprise-admin/policies'),
      fetchWithAuth('/api/oem-sdk/enterprise/bulk-options')
    ]);

    if (dashboard) {
      setDashboardData(dashboard);
      setOrgInfo(dashboard.organization);
    }
    if (userList) setUsers(userList.users || []);
    if (deviceList) setDevices(deviceList.devices || []);
    if (policyList) setPolicies(policyList.policies || []);
    if (bulk) setBulkOptions(bulk);
    setLoading(false);
  }, [fetchWithAuth]);

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
    }
  }, [isLoggedIn, loadDashboardData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const response = await fetch(`${API_URL}/api/enterprise-admin/dashboard`, {
        headers: {
          'x-org-id': loginForm.orgId,
          'x-admin-token': loginForm.adminToken
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setOrgInfo(data.organization);
        localStorage.setItem('enterprise_org_id', loginForm.orgId);
        localStorage.setItem('enterprise_admin_token', loginForm.adminToken);
      } else {
        setLoginError('Invalid organization ID or admin token');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setOrgInfo(null);
    localStorage.removeItem('enterprise_org_id');
    localStorage.removeItem('enterprise_admin_token');
  };

  // Sidebar items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'devices', label: 'Device Registry', icon: Server },
    { id: 'policies', label: 'Security Policies', icon: Shield },
    { id: 'ip-whitelist', label: 'IP Whitelisting', icon: MapPin },
    { id: 'sso', label: 'SSO Configuration', icon: Key },
    { id: 'bulk', label: 'Bulk Purchase', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Admin</h1>
            <p className="text-gray-500 mt-2">Manage your organization's security</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
              <input
                type="text"
                value={loginForm.orgId}
                onChange={(e) => setLoginForm({ ...loginForm, orgId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="test-enterprise-org"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Token</label>
              <input
                type="password"
                value={loginForm.adminToken}
                onChange={(e) => setLoginForm({ ...loginForm, adminToken: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 transition"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              <strong>Demo Credentials:</strong><br />
              Org ID: test-enterprise-org<br />
              Token: test-token
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-4 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm">{orgInfo?.name || 'Enterprise'}</h1>
              <p className="text-xs text-indigo-300">{orgInfo?.tier || 'Standard'} Plan</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? 'bg-indigo-500 text-white'
                  : 'text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-indigo-300 hover:text-white hover:bg-indigo-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {navItems.find(n => n.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-500">Organization: {orgInfo?.id}</p>
            </div>
            <button
              onClick={loadDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </header>

        <div className="p-6">
          {loading && !dashboardData ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'devices' && renderDevices()}
              {activeTab === 'policies' && renderPolicies()}
              {activeTab === 'ip-whitelist' && <IPWhitelistManager orgId={loginForm.orgId} adminToken={loginForm.adminToken} />}
              {activeTab === 'sso' && renderSSO()}
              {activeTab === 'bulk' && renderBulkPurchase()}
              {activeTab === 'settings' && renderSettings()}
            </>
          )}
        </div>
      </main>
    </div>
  );

  function renderDashboard() {
    if (!dashboardData) return null;
    const summary = dashboardData.summary || {};
    const security = dashboardData.security_overview || {};

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Users" value={summary.total_users || 0} color="indigo" />
          <StatCard icon={Server} label="Total Devices" value={summary.total_devices || 0} color="green" />
          <StatCard icon={Shield} label="Active Policies" value={summary.active_policies || 0} color="purple" />
          <StatCard icon={AlertTriangle} label="Threats Blocked" value={security.threats_blocked_24h || 0} color="red" />
        </div>

        {/* Security Score */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Security Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-5xl font-bold text-green-600">{security.security_score || 85}</div>
              <p className="text-gray-600 mt-2">Security Score</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-5xl font-bold text-blue-600">{security.protection_rate?.toFixed(1) || 0}%</div>
              <p className="text-gray-600 mt-2">Protection Rate</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
              <div className="text-5xl font-bold text-orange-600">{security.threats_detected_24h || 0}</div>
              <p className="text-gray-600 mt-2">Threats Detected (24h)</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardData.quick_actions?.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (action.action === 'add_device') setActiveTab('devices');
                  else if (action.action === 'view_threats') setActiveTab('dashboard');
                  else if (action.action === 'configure_policy') setActiveTab('policies');
                }}
                className="p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition text-left"
              >
                <ChevronRight className="w-5 h-5 text-indigo-500 mb-2" />
                <p className="font-medium text-gray-900">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderUsers() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Organization Users</h3>
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No users found. Add your first user.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name || user.email}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-500" /></button>
                        <button className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderDevices() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Registered Devices</h3>
          <button
            onClick={() => setShowAddDevice(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            <Plus className="w-4 h-4" />
            Register Device
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.length === 0 ? (
            <div className="col-span-3 bg-white rounded-xl border p-8 text-center text-gray-500">
              No devices registered. Add your first device.
            </div>
          ) : (
            devices.map((device, idx) => (
              <div key={idx} className="bg-white rounded-xl border p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <Server className="w-8 h-8 text-indigo-500" />
                  <span className={`px-2 py-1 rounded text-xs ${
                    device.status === 'protected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {device.status || 'active'}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900">{device.name || device.identifier}</h4>
                <p className="text-sm text-gray-500">{device.device_type}</p>
                <p className="text-xs text-gray-400 mt-2">ID: {device.identifier?.slice(0, 20)}...</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  function renderPolicies() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Security Policies</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            <Plus className="w-4 h-4" />
            Create Policy
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.length === 0 ? (
            <>
              {/* Default Policies */}
              {['URL Threat Detection', 'SMS Phishing Protection', 'Device Monitoring', 'Backdoor Prevention'].map((policy, idx) => (
                <div key={idx} className="bg-white rounded-xl border p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-indigo-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">{policy}</h4>
                        <p className="text-sm text-gray-500">Default Policy</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              ))}
            </>
          ) : (
            policies.map((policy, idx) => (
              <div key={idx} className="bg-white rounded-xl border p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{policy.policy_name}</h4>
                    <p className="text-sm text-gray-500">Segment: {policy.segment}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    policy.auto_enforce ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {policy.auto_enforce ? 'Auto-Enforce' : 'Manual'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  function renderSSO() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Single Sign-On (SSO) Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {['SAML 2.0', 'OAuth 2.0', 'OpenID Connect'].map((provider) => (
              <div key={provider} className="p-4 border rounded-lg hover:border-indigo-500 cursor-pointer transition">
                <Key className="w-8 h-8 text-indigo-500 mb-2" />
                <h4 className="font-medium">{provider}</h4>
                <p className="text-sm text-gray-500">Enterprise SSO</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-medium text-indigo-900 mb-2">SSO Integration Guide</h4>
            <ol className="list-decimal list-inside text-sm text-indigo-700 space-y-1">
              <li>Choose your identity provider (Okta, Azure AD, Google Workspace)</li>
              <li>Configure SAML or OAuth2 settings</li>
              <li>Test SSO login flow</li>
              <li>Enable for all organization users</li>
            </ol>
          </div>

          <button
            onClick={() => setShowSSOSetup(true)}
            className="mt-4 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Configure SSO Provider
          </button>
        </div>
      </div>
    );
  }

  function renderBulkPurchase() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">OEM SDK Bulk Purchase</h3>
          <p className="text-gray-600 mb-6">Purchase device protection licenses for your organization's IoT devices.</p>

          {bulkOptions && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(bulkOptions.bulk_tiers || {}).map(([key, tier]) => (
                <div key={key} className={`p-4 border rounded-xl ${key === 'tier_5000' ? 'border-indigo-500 ring-2 ring-indigo-200' : ''}`}>
                  {key === 'tier_5000' && (
                    <span className="px-2 py-1 bg-indigo-500 text-white text-xs rounded mb-2 inline-block">Popular</span>
                  )}
                  <h4 className="font-bold text-lg">{tier.devices} Devices</h4>
                  <p className="text-2xl font-bold text-indigo-600 my-2">
                    ₹{typeof tier.price_per_device_inr === 'number' ? tier.price_per_device_inr : '--'}/device
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Total: ₹{typeof tier.total_inr === 'number' ? tier.total_inr.toLocaleString() : 'Contact Sales'}
                  </p>
                  <p className="text-sm text-green-600 mb-4">{tier.discount} off</p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    {tier.features?.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                    Purchase
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Minimum Order:</strong> ₹150/month per license. Contact enterprise@infuse.ai for custom pricing on 10,000+ devices.
            </p>
          </div>
        </div>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Organization Settings</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
              <input
                type="text"
                defaultValue={orgInfo?.name}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Security Level</label>
              <select className="w-full px-4 py-2 border rounded-lg">
                <option value="standard">Standard</option>
                <option value="enhanced">Enhanced</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Auto Enforcement</label>
                  <p className="text-xs text-gray-500">Automatically enforce security policies</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          <button className="mt-6 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            Save Settings
          </button>
        </div>
      </div>
    );
  }
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseAdminDashboard;
