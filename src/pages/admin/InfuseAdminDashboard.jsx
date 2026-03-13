import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Users, Brain, Settings, Database, Activity,
  Search, Plus, Edit, Trash2, Eye, RefreshCw, AlertCircle,
  CheckCircle, XCircle, Heart, Lock, LogOut, BarChart3,
  Server, Cpu, MessageSquare, FileText, Download, ToggleLeft,
  Radio, Car, Wifi, Network, Camera, Gauge, MonitorSmartphone,
  ExternalLink
} from 'lucide-react';
import FeatureFlagAdmin from '../../components/admin/FeatureFlagAdmin';

const InfuseAdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('users');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // API URL - auto-detects production vs development
  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'www.infuse.net.in' || hostname === 'infuse.net.in' || hostname.includes('preview.emergentagent.com')) {
        return window.location.origin;
      }
    }
    return process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
  };
  const API_URL = getApiUrl();

  // Validate Infuse email
  const isInfuseEmail = (email) => {
    return email.endsWith('@infuse.ai') || email.endsWith('@infuse.demo') || email.endsWith('@infuse.net.in');
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isInfuseEmail(email)) {
      setError('Access restricted to Infuse team members only (@infuse.ai, @infuse.demo, or @infuse.net.in)');
      return;
    }

    // For demo purposes, allow direct login with Infuse emails
    if (email === 'admin@infuse.demo' && password === 'admin1234') {
      localStorage.setItem('infuse_admin_token', 'infuse_demo_token');
      localStorage.setItem('infuse_admin_email', email);
      setIsAuthenticated(true);
      return;
    }
    
    // Allow ranjeetkoul@infuse.net.in admin access
    if (email.toLowerCase() === 'ranjeetkoul@infuse.net.in' && password === 'Ranjeet$03') {
      localStorage.setItem('infuse_admin_token', 'infuse_admin_token_ranjeet');
      localStorage.setItem('infuse_admin_email', email);
      setIsAuthenticated(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('infuse_admin_token', data.token);
        localStorage.setItem('infuse_admin_email', email);
        setIsAuthenticated(true);
      } else {
        setError(data.detail || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  // Check existing auth
  useEffect(() => {
    const token = localStorage.getItem('infuse_admin_token');
    const storedEmail = localStorage.getItem('infuse_admin_email');
    if (token && storedEmail && isInfuseEmail(storedEmail)) {
      setIsAuthenticated(true);
      setEmail(storedEmail);
    }
  }, []);

  // Fetch records
  const fetchRecords = async (collection) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('infuse_admin_token');
      const response = await fetch(`${API_URL}/api/internal-admin/records/${collection}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'database') {
      fetchRecords(selectedCollection);
    }
  }, [isAuthenticated, activeTab, selectedCollection]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('infuse_admin_token');
    localStorage.removeItem('infuse_admin_email');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  // Collections list
  const collections = [
    { name: 'users', label: 'Users', icon: Users },
    { name: 'doctors', label: 'Doctors', icon: Heart },
    { name: 'patients', label: 'Patients', icon: Users },
    { name: 'organizations', label: 'Organizations', icon: Server },
    { name: 'appointments', label: 'Appointments', icon: FileText },
    { name: 'security_devices', label: 'Devices', icon: Shield },
    { name: 'threat_alerts', label: 'Threats', icon: AlertCircle },
    { name: 'api_keys', label: 'API Keys', icon: Lock },
  ];

  // AI Agents
  const aiAgents = [
    { id: 1, name: 'Health Analysis Agent', status: 'active', requests: 1250, accuracy: '94.2%', product: 'HealthTrack' },
    { id: 2, name: 'Risk Assessment Agent', status: 'active', requests: 890, accuracy: '91.8%', product: 'HealthTrack' },
    { id: 3, name: 'URL Threat Scanner', status: 'active', requests: 45000, accuracy: '99.1%', product: 'SecureSphere' },
    { id: 4, name: 'SMS Fraud Detector', status: 'active', requests: 23000, accuracy: '97.5%', product: 'SecureSphere' },
    { id: 5, name: 'IoT Anomaly Detector', status: 'maintenance', requests: 12000, accuracy: '95.3%', product: 'SecureSphere' },
    { id: 6, name: 'Automotive Threat AI', status: 'active', requests: 8500, accuracy: '96.7%', product: 'SecureSphere' },
  ];

  // Support tickets mock
  const supportTickets = [
    { id: 'TKT-001', subject: 'Login issues', user: 'clinic@example.com', product: 'HealthTrack', status: 'open', priority: 'high' },
    { id: 'TKT-002', subject: 'API rate limit reached', user: 'enterprise@corp.com', product: 'SecureSphere', status: 'in_progress', priority: 'medium' },
    { id: 'TKT-003', subject: 'Data export not working', user: 'hospital@health.org', product: 'HealthTrack', status: 'resolved', priority: 'low' },
  ];

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Infuse Internal Admin</h1>
            <p className="text-gray-600 mt-2">Restricted access for Infuse team only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@infuse.net.in"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Must be @infuse.ai, @infuse.demo, or @infuse.net.in email</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs text-purple-600 text-center">
              <Lock className="w-4 h-4 inline mr-1" />
              This portal is restricted to authorized Infuse team members only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold">Infuse Admin</h1>
            <p className="text-xs text-gray-400">Internal Portal</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'ai-agents', label: 'AI/ML Agents', icon: Brain },
            { id: 'support', label: 'Support Tickets', icon: MessageSquare },
            { id: 'database', label: 'Database Records', icon: Database },
            { id: 'feature-flags', label: 'Feature Flags', icon: ToggleLeft },
            { id: 'securesphere', label: 'SecureSphere', icon: Shield },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-purple-600' : 'hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-3 bg-slate-800 rounded-lg mb-4">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-sm truncate">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
            
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="w-8 h-8 text-red-500" />
                  <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">+12%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">1,245</div>
                <div className="text-gray-600 text-sm">HealthTrack Users</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="w-8 h-8 text-orange-500" />
                  <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">+8%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">3,890</div>
                <div className="text-gray-600 text-sm">SecureSphere Users</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="w-8 h-8 text-purple-500" />
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">6 Active</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">89,640</div>
                <div className="text-gray-600 text-sm">AI Requests Today</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-green-500" />
                  <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">99.9%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">Online</div>
                <div className="text-gray-600 text-sm">System Status</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New user registered', product: 'HealthTrack', time: '2 min ago' },
                    { action: 'Threat blocked', product: 'SecureSphere', time: '5 min ago' },
                    { action: 'AI model updated', product: 'Platform', time: '15 min ago' },
                    { action: 'Support ticket resolved', product: 'HealthTrack', time: '1 hour ago' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm text-gray-900">{item.action}</p>
                        <p className="text-xs text-gray-500">{item.product}</p>
                      </div>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveTab('database')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 text-left transition"
                  >
                    <Users className="w-6 h-6 text-blue-500 mb-2" />
                    <p className="text-sm font-medium">Manage Users</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('ai-agents')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 text-left transition"
                  >
                    <Brain className="w-6 h-6 text-purple-500 mb-2" />
                    <p className="text-sm font-medium">AI Agents</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('support')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 text-left transition"
                  >
                    <MessageSquare className="w-6 h-6 text-green-500 mb-2" />
                    <p className="text-sm font-medium">Support</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('feature-flags')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 text-left transition"
                  >
                    <ToggleLeft className="w-6 h-6 text-orange-500 mb-2" />
                    <p className="text-sm font-medium">Feature Flags</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Agents Tab */}
        {activeTab === 'ai-agents' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI/ML Agents</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Plus className="w-4 h-4" />
                Add Agent
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Agent Name</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Product</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Requests</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Accuracy</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {aiAgents.map((agent) => (
                    <tr key={agent.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Brain className="w-5 h-5 text-purple-500" />
                          <span className="font-medium">{agent.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          agent.product === 'HealthTrack' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {agent.product}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1 text-sm ${
                          agent.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {agent.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          {agent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{agent.requests.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-600">{agent.accuracy}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-500"><Eye className="w-4 h-4" /></button>
                          <button className="p-2 text-gray-400 hover:text-green-500"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
              <div className="flex gap-3">
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>All Products</option>
                  <option>HealthTrack</option>
                  <option>SecureSphere</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>All Status</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Ticket ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Subject</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">User</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Product</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Priority</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supportTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{ticket.id}</td>
                      <td className="px-6 py-4 font-medium">{ticket.subject}</td>
                      <td className="px-6 py-4 text-gray-600">{ticket.user}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          ticket.product === 'HealthTrack' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {ticket.product}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          ticket.priority === 'high' ? 'bg-red-100 text-red-600' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1 text-sm ${
                          ticket.status === 'open' ? 'text-blue-600' :
                          ticket.status === 'in_progress' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {ticket.status === 'resolved' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded hover:bg-purple-200">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Database Records</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
                  />
                </div>
                <button 
                  onClick={() => fetchRecords(selectedCollection)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                  Add Record
                </button>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Collections Sidebar */}
              <div className="w-48 bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Collections</h3>
                <div className="space-y-1">
                  {collections.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedCollection(col.name)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCollection === col.name ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <col.icon className="w-4 h-4" />
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Records Table */}
              <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-gray-500">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    Loading records...
                  </div>
                ) : records.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No records found in {selectedCollection}</p>
                    <p className="text-sm mt-2">Try selecting a different collection or add new records.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">ID</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Data</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.slice(0, 10).map((record, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-mono text-sm">{record.id || record._id || idx}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-md">
                            {JSON.stringify(record).substring(0, 100)}...
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="p-2 text-gray-400 hover:text-blue-500"><Eye className="w-4 h-4" /></button>
                              <button className="p-2 text-gray-400 hover:text-green-500"><Edit className="w-4 h-4" /></button>
                              <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">System Configuration</h3>
              <div className="divide-y">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Temporarily disable access for maintenance</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">Off</button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Send alerts for critical events</p>
                  </div>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg">On</button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">API Rate Limiting</p>
                    <p className="text-sm text-gray-500">Current: 1000 req/min</p>
                  </div>
                  <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg">Configure</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Flags Tab */}
        {activeTab === 'feature-flags' && (
          <FeatureFlagAdmin />
        )}

        {/* SecureSphere Product Suite Tab */}
        {activeTab === 'securesphere' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">SecureSphere Product Suite</h2>
                <p className="text-gray-600">Enterprise IoT & Cybersecurity Platform - Admin Access</p>
              </div>
              <Link 
                to="/login/security"
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <ExternalLink className="w-4 h-4" />
                Open SecureSphere
              </Link>
            </div>

            {/* SecureSphere Stats */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="w-8 h-8 text-orange-500" />
                  <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">Active</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">50M+</div>
                <div className="text-gray-600 text-sm">Devices Secured</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">23 Active</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">1,245</div>
                <div className="text-gray-600 text-sm">Threats Blocked Today</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <Radio className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600 text-sm">Enterprise Clients</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-green-500" />
                  <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">99.9%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">Online</div>
                <div className="text-gray-600 text-sm">Platform Status</div>
              </div>
            </div>

            {/* SecureSphere Modules */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Modules</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* IoT Protection */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">IoT Device Protection</h4>
                    <p className="text-sm text-gray-500">Cameras, Meters, Sensors</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">IP Cameras</span>
                    <span className="font-medium">12,450 devices</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Smart Meters</span>
                    <span className="font-medium">8,230 devices</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dashcams</span>
                    <span className="font-medium">5,120 devices</span>
                  </div>
                </div>
                <Link to="/security/dashboard" className="mt-4 flex items-center gap-2 text-orange-600 text-sm font-medium hover:text-orange-700">
                  Manage Devices <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Telecom Security */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Radio className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Telecom Security</h4>
                    <p className="text-sm text-gray-500">Network & SMS Protection</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SMS Scans Today</span>
                    <span className="font-medium">2.3M messages</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Threats Blocked</span>
                    <span className="font-medium text-red-600">1,892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Networks Protected</span>
                    <span className="font-medium">45 carriers</span>
                  </div>
                </div>
                <Link to="/security/telecom" className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700">
                  View Analytics <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Automotive Security */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Automotive Security</h4>
                    <p className="text-sm text-gray-500">Connected Vehicle Protection</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicles Protected</span>
                    <span className="font-medium">125,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">OTA Updates Secured</span>
                    <span className="font-medium">45,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">OEMs Connected</span>
                    <span className="font-medium">12 brands</span>
                  </div>
                </div>
                <Link to="/security/automotive" className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium hover:text-green-700">
                  Fleet Dashboard <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Mobile Protection */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <MonitorSmartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mobile Protection</h4>
                    <p className="text-sm text-gray-500">Device & App Security</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Devices</span>
                    <span className="font-medium">890,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Apps Scanned</span>
                    <span className="font-medium">2.1M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Malware Blocked</span>
                    <span className="font-medium text-red-600">12,450</span>
                  </div>
                </div>
                <Link to="/security/mobile" className="mt-4 flex items-center gap-2 text-purple-600 text-sm font-medium hover:text-purple-700">
                  Security Console <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* CSP Operations */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">CSP Operations</h4>
                    <p className="text-sm text-gray-500">White-label Partner Management</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active CSP Partners</span>
                    <span className="font-medium">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tenant Accounts</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Revenue</span>
                    <span className="font-medium text-green-600">₹4.2Cr</span>
                  </div>
                </div>
                <Link to="/security/csp" className="mt-4 flex items-center gap-2 text-cyan-600 text-sm font-medium hover:text-cyan-700">
                  CSP Dashboard <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Threat Intelligence */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Threat Intelligence</h4>
                    <p className="text-sm text-gray-500">Real-time Security Analytics</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Threats</span>
                    <span className="font-medium text-red-600">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IOCs Tracked</span>
                    <span className="font-medium">1.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Detection Rate</span>
                    <span className="font-medium text-green-600">99.7%</span>
                  </div>
                </div>
                <Link to="/security/threats" className="mt-4 flex items-center gap-2 text-red-600 text-sm font-medium hover:text-red-700">
                  Threat Center <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">SecureSphere Quick Access</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/login/security" className="flex items-center gap-2 bg-white/20 px-4 py-3 rounded-lg hover:bg-white/30 transition">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Main Dashboard</span>
                </Link>
                <Link to="/securesphere-home" className="flex items-center gap-2 bg-white/20 px-4 py-3 rounded-lg hover:bg-white/30 transition">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Product Info</span>
                </Link>
                <Link to="/security/settings" className="flex items-center gap-2 bg-white/20 px-4 py-3 rounded-lg hover:bg-white/30 transition">
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
                <Link to="/security/reports" className="flex items-center gap-2 bg-white/20 px-4 py-3 rounded-lg hover:bg-white/30 transition">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm font-medium">Reports</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfuseAdminDashboard;
