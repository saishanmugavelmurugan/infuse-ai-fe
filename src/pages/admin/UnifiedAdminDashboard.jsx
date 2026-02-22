import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Users, Shield, Heart, Bell,
  TrendingUp, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Settings, LogOut, ChevronRight, Loader2, Bot, Brain,
  Smartphone, Server, Radio, Car, Cpu, Globe, Mail, MessageSquare,
  BarChart3, PieChart, LineChart, Calendar, Clock, Zap
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const INTERNAL_KEY = 'infuse_internal_2025_secret';

const COLORS = {
  healthtrack: '#10B981',
  securesphere: '#F59E0B',
  primary: '#6366F1',
  secondary: '#8B5CF6',
  success: '#22C55E',
  warning: '#EAB308',
  danger: '#EF4444',
  info: '#3B82F6'
};

const UnifiedAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [adminInfo, setAdminInfo] = useState(null);

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [userChartData, setUserChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [threatChartData, setThreatChartData] = useState([]);
  const [appointmentChartData, setAppointmentChartData] = useState([]);
  const [healthtrackStats, setHealthtrackStats] = useState(null);
  const [securesphereStats, setSecuresphereStats] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [aiAgentsData, setAiAgentsData] = useState(null);

  const fetchWithAuth = useCallback(async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'x-internal-key': INTERNAL_KEY }
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    const [overview, users, revenue, threats, appointments] = await Promise.all([
      fetchWithAuth('/api/unified-admin/dashboard/overview'),
      fetchWithAuth('/api/unified-admin/dashboard/charts/users'),
      fetchWithAuth('/api/unified-admin/dashboard/charts/revenue'),
      fetchWithAuth('/api/unified-admin/dashboard/charts/threats'),
      fetchWithAuth('/api/unified-admin/dashboard/charts/appointments')
    ]);

    if (overview) setDashboardData(overview.overview);
    if (users) setUserChartData(users.chart_data);
    if (revenue) setRevenueChartData(revenue.chart_data);
    if (threats) setThreatChartData(threats.chart_data);
    if (appointments) setAppointmentChartData(appointments.chart_data);
    setLoading(false);
  }, [fetchWithAuth]);

  const loadHealthtrackData = useCallback(async () => {
    setLoading(true);
    const stats = await fetchWithAuth('/api/unified-admin/healthtrack/stats');
    if (stats) setHealthtrackStats(stats.stats);
    setLoading(false);
  }, [fetchWithAuth]);

  const loadSecuresphereData = useCallback(async () => {
    setLoading(true);
    const stats = await fetchWithAuth('/api/unified-admin/securesphere/stats');
    if (stats) setSecuresphereStats(stats.stats);
    setLoading(false);
  }, [fetchWithAuth]);

  const loadAlertsData = useCallback(async () => {
    setLoading(true);
    const [config, alerts] = await Promise.all([
      fetchWithAuth('/api/unified-admin/alerts/config'),
      fetchWithAuth('/api/unified-admin/alerts/recent')
    ]);
    if (config) setAlertConfig(config);
    if (alerts) setRecentAlerts(alerts.alerts);
    setLoading(false);
  }, [fetchWithAuth]);

  const loadAiAgentsData = useCallback(async () => {
    setLoading(true);
    const data = await fetchWithAuth('/api/unified-admin/ai-agents/overview');
    if (data) setAiAgentsData(data);
    setLoading(false);
  }, [fetchWithAuth]);

  useEffect(() => {
    if (isLoggedIn) {
      switch (activeTab) {
        case 'overview':
          loadDashboardData();
          break;
        case 'healthtrack':
          loadHealthtrackData();
          break;
        case 'securesphere':
          loadSecuresphereData();
          break;
        case 'alerts':
          loadAlertsData();
          break;
        case 'ai-agents':
          loadAiAgentsData();
          break;
        default:
          break;
      }
    }
  }, [activeTab, isLoggedIn, loadDashboardData, loadHealthtrackData, loadSecuresphereData, loadAlertsData, loadAiAgentsData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const response = await fetch(`${API_URL}/api/unified-admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsLoggedIn(true);
        setAdminInfo(data.admin);
        localStorage.setItem('unified_admin_token', data.token);
      } else {
        setLoginError(data.detail || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminInfo(null);
    localStorage.removeItem('unified_admin_token');
  };

  // Sidebar navigation items
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'healthtrack', label: 'HealthTrack Pro', icon: Heart, color: 'text-emerald-500' },
    { id: 'securesphere', label: 'SecureSphere', icon: Shield, color: 'text-amber-500' },
    { id: 'alerts', label: 'Alert Management', icon: Bell },
    { id: 'ai-agents', label: 'AI Agents', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Infuse Internal Admin</h1>
            <p className="text-gray-500 mt-2">Unified Dashboard for HealthTrack Pro & SecureSphere</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="admin@infuse.demo"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              <strong>Demo Credentials:</strong><br />
              Email: admin@infuse.demo<br />
              Password: admin1234
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold">Infuse Admin</h1>
              <p className="text-xs text-gray-400">Unified Dashboard</p>
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
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.color || ''}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{adminInfo?.email}</p>
              <p className="text-xs text-gray-400">{adminInfo?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {navItems.find(n => n.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-500">
                Manage both HealthTrack Pro and SecureSphere from one place
              </p>
            </div>
            <button
              onClick={() => {
                switch (activeTab) {
                  case 'overview': loadDashboardData(); break;
                  case 'healthtrack': loadHealthtrackData(); break;
                  case 'securesphere': loadSecuresphereData(); break;
                  case 'alerts': loadAlertsData(); break;
                  case 'ai-agents': loadAiAgentsData(); break;
                  default: break;
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {loading && !dashboardData ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'healthtrack' && renderHealthtrack()}
              {activeTab === 'securesphere' && renderSecuresphere()}
              {activeTab === 'alerts' && renderAlerts()}
              {activeTab === 'ai-agents' && renderAiAgents()}
              {activeTab === 'settings' && renderSettings()}
            </>
          )}
        </div>
      </main>
    </div>
  );

  // Render Overview Tab
  function renderOverview() {
    if (!dashboardData) return null;

    return (
      <div className="space-y-6">
        {/* Platform Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HealthTrack Pro Card */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-lg">HealthTrack Pro</h3>
                    <p className="text-emerald-100 text-sm">Healthcare Platform</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {dashboardData.platforms?.healthtrack_pro?.status}
                </span>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{dashboardData.platforms?.healthtrack_pro?.doctors || 0}</p>
                <p className="text-sm text-gray-600">Doctors</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{dashboardData.platforms?.healthtrack_pro?.patients || 0}</p>
                <p className="text-sm text-gray-600">Patients</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-700">{dashboardData.platforms?.healthtrack_pro?.appointments_today || 0}</p>
                <p className="text-sm text-gray-600">Appointments</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-700">{dashboardData.platforms?.healthtrack_pro?.uptime}</p>
                <p className="text-sm text-gray-600">Uptime</p>
              </div>
            </div>
          </div>

          {/* SecureSphere Card */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-lg">SecureSphere</h3>
                    <p className="text-amber-100 text-sm">Security Platform</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {dashboardData.platforms?.securesphere?.status}
                </span>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{dashboardData.platforms?.securesphere?.devices_protected || 0}</p>
                <p className="text-sm text-gray-600">Devices</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{dashboardData.platforms?.securesphere?.threats_blocked || 0}</p>
                <p className="text-sm text-gray-600">Threats Blocked</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-700">{dashboardData.platforms?.securesphere?.security_score || 0}</p>
                <p className="text-sm text-gray-600">Security Score</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-700">{dashboardData.platforms?.securesphere?.uptime}</p>
                <p className="text-sm text-gray-600">Uptime</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">API Latency</p>
                <p className="text-lg font-bold text-gray-900">{dashboardData.system_health?.api_latency_ms}ms</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Database</p>
                <p className="text-lg font-bold text-green-600">{dashboardData.system_health?.database_status}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cache Hit Rate</p>
                <p className="text-lg font-bold text-gray-900">{dashboardData.system_health?.cache_hit_rate}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Error Rate</p>
                <p className="text-lg font-bold text-gray-900">{dashboardData.system_health?.error_rate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">User Growth (30 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={userChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="healthtrack" stackId="1" stroke={COLORS.healthtrack} fill={COLORS.healthtrack} fillOpacity={0.6} name="HealthTrack" />
                <Area type="monotone" dataKey="securesphere" stackId="1" stroke={COLORS.securesphere} fill={COLORS.securesphere} fillOpacity={0.6} name="SecureSphere" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Revenue (12 Months)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="healthtrack" fill={COLORS.healthtrack} name="HealthTrack" />
                <Bar dataKey="securesphere" fill={COLORS.securesphere} name="SecureSphere" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threats and Appointments Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Threat Detection Chart */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Threat Detection (7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsLineChart data={threatChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="detected" stroke={COLORS.warning} strokeWidth={2} name="Detected" />
                <Line type="monotone" dataKey="blocked" stroke={COLORS.success} strokeWidth={2} name="Blocked" />
                <Line type="monotone" dataKey="false_positive" stroke={COLORS.danger} strokeWidth={2} name="False Positive" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>

          {/* Appointments Chart */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Appointments (7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={appointmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scheduled" fill={COLORS.info} name="Scheduled" />
                <Bar dataKey="completed" fill={COLORS.success} name="Completed" />
                <Bar dataKey="cancelled" fill={COLORS.danger} name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  // Render HealthTrack Tab
  function renderHealthtrack() {
    if (!healthtrackStats) return <div className="text-center py-8">Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Doctors" value={healthtrackStats.users?.doctors || 0} color="emerald" />
          <StatCard icon={Users} label="Total Patients" value={healthtrackStats.users?.patients || 0} color="blue" />
          <StatCard icon={Calendar} label="Appointments Today" value={healthtrackStats.appointments?.today || 0} color="purple" />
          <StatCard icon={CheckCircle} label="Completion Rate" value={healthtrackStats.appointments?.completion_rate || '0%'} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Medical Records</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Health Records</span>
                <span className="font-bold">{healthtrackStats.records?.health_records || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Prescriptions</span>
                <span className="font-bold">{healthtrackStats.records?.prescriptions || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Lab Reports</span>
                <span className="font-bold">{healthtrackStats.records?.lab_reports || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">AI Analytics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="text-gray-600">Predictions Made</span>
                <span className="font-bold text-emerald-600">{healthtrackStats.ai_analytics?.predictions_made || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-bold text-emerald-600">{healthtrackStats.ai_analytics?.accuracy || '0%'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="text-gray-600">Active Models</span>
                <span className="font-bold text-emerald-600">{healthtrackStats.ai_analytics?.active_models || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render SecureSphere Tab
  function renderSecuresphere() {
    if (!securesphereStats) return <div className="text-center py-8">Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={Smartphone} label="Total Devices" value={securesphereStats.devices?.total || 0} color="amber" />
          <StatCard icon={AlertTriangle} label="Threats Detected" value={securesphereStats.threats?.total_detected || 0} color="red" />
          <StatCard icon={Globe} label="URLs Scanned" value={securesphereStats.scans?.urls_scanned || 0} color="blue" />
          <StatCard icon={Radio} label="Active vRAN Sessions" value={securesphereStats.vran?.active_sessions || 0} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Device Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Mobile Devices</span>
                </div>
                <span className="font-bold">{securesphereStats.devices?.mobile || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-500" />
                  <span className="text-gray-600">IoT Devices</span>
                </div>
                <span className="font-bold">{securesphereStats.devices?.iot || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-600">Enterprise</span>
                </div>
                <span className="font-bold">{securesphereStats.devices?.enterprise || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">vRAN Integration</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="text-gray-600">Active Sessions</span>
                <span className="font-bold text-amber-600">{securesphereStats.vran?.active_sessions || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="text-gray-600">AI Patterns Learned</span>
                <span className="font-bold text-amber-600">{securesphereStats.vran?.ai_patterns_learned || 0}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Active Segments</p>
                <div className="flex flex-wrap gap-2">
                  {securesphereStats.vran?.segments_active?.map((seg) => (
                    <span key={seg} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                      {seg}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Alerts Tab
  function renderAlerts() {
    return (
      <div className="space-y-6">
        {/* Alert Config */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Alert Configuration</h3>
          {alertConfig?.note && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              ⚠️ {alertConfig.note}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {alertConfig?.config && Object.entries(alertConfig.config).map(([key, value]) => (
              <div key={key} className={`p-4 rounded-lg border ${value.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {key === 'email' && <Mail className="w-5 h-5" />}
                  {key === 'sms' && <MessageSquare className="w-5 h-5" />}
                  {key === 'webhook' && <Globe className="w-5 h-5" />}
                  {key === 'in_app' && <Bell className="w-5 h-5" />}
                  <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                </div>
                <p className="text-sm text-gray-500">{value.provider || value.status}</p>
                <span className={`text-xs px-2 py-1 rounded ${value.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {value.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-500' :
                    alert.severity === 'high' ? 'bg-orange-500' :
                    alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{alert.type}</p>
                    <p className="text-xs text-gray-500">{alert.platform} • {new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {alert.acknowledged ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render AI Agents Tab
  function renderAiAgents() {
    if (!aiAgentsData) return <div className="text-center py-8">Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={Bot} label="Total Queries" value={aiAgentsData.total_queries || 0} color="purple" />
          <StatCard icon={Brain} label="Patterns Learned" value={aiAgentsData.total_patterns || 0} color="blue" />
          <StatCard icon={Cpu} label="Memory Usage" value={`${aiAgentsData.memory_usage_mb?.toFixed(1) || 0} MB`} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Support Agents */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              Support Agents
            </h3>
            <div className="space-y-3">
              {aiAgentsData.agents?.support?.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-gray-500">Queries: {agent.queries_handled}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Agents */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              Learning Agents
            </h3>
            <div className="space-y-3">
              {aiAgentsData.agents?.learning?.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-gray-500">Patterns: {agent.patterns_learned}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Settings Tab
  function renderSettings() {
    return (
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">System Settings</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Platform Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Name:</span> Infuse Platform</div>
              <div><span className="text-gray-500">Version:</span> 2.0.0</div>
              <div><span className="text-gray-500">Environment:</span> Production</div>
              <div><span className="text-gray-500">Debug:</span> Disabled</div>
            </div>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-2">Alerting Status</h4>
            <p className="text-sm text-amber-700">
              Real alerting (Twilio SMS & SendGrid Email) is currently <strong>MOCKED</strong>. 
              Configure API keys to enable real notifications.
            </p>
          </div>
        </div>
      </div>
    );
  }
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color] || 'bg-gray-100 text-gray-600'}`}>
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

export default UnifiedAdminDashboard;
