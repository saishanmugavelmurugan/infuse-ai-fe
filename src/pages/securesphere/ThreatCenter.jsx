import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, Radio, Building2, Smartphone, Car, Plus, Upload,
  Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Wifi, Signal, Globe, Server, Cpu, TrendingUp, Eye, 
  FileText, Download, Filter, Search, ChevronRight, Loader2,
  Bell, Settings, BarChart3, Lock, Zap
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const SEGMENTS = [
  { id: 'telco', name: 'Telecom', icon: Radio, color: 'blue', description: 'GSM/SIM monitoring' },
  { id: 'mobile', name: 'Mobile', icon: Smartphone, color: 'green', description: 'Device protection' },
  { id: 'enterprise', name: 'Enterprise', icon: Building2, color: 'purple', description: 'IT security' },
  { id: 'automotive', name: 'Automotive', icon: Car, color: 'amber', description: 'Vehicle security' },
  { id: 'white_goods', name: 'White Goods', icon: Cpu, color: 'cyan', description: 'IoT appliances' },
  { id: 'cctv', name: 'CCTV', icon: Eye, color: 'red', description: 'Surveillance cameras' }
];

const ThreatCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSegment, setSelectedSegment] = useState('mobile');
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [connections, setConnections] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [bulkJobs, setBulkJobs] = useState([]);
  
  // Form states
  const [connectionForm, setConnectionForm] = useState({
    connectionType: 'mobile_number',
    identifier: '',
    apn: ''
  });
  const [bulkFile, setBulkFile] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/vran/dashboard/stats`);
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardStats]);

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = connectionForm.connectionType === 'apn' 
        ? '/api/vran/connect/apn' 
        : '/api/vran/connect/mobile';
      
      const body = connectionForm.connectionType === 'apn'
        ? { apn: connectionForm.apn, segment: selectedSegment, user_id: 'demo_user' }
        : { mobile_number: connectionForm.identifier, segment: selectedSegment, user_id: 'demo_user' };
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        const data = await response.json();
        setConnections([data.connection, ...connections]);
        setConnectionForm({ connectionType: 'mobile_number', identifier: '', apn: '' });
        
        // Auto-analyze
        await handleAnalyze(data.connection.identifier);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
    
    setLoading(false);
  };

  const handleAnalyze = async (identifier) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/vran/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          segment: selectedSegment,
          connection_type: connectionForm.connectionType
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    }
    setLoading(false);
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', bulkFile);
      formData.append('segment', selectedSegment);
      
      const response = await fetch(`${API_URL}/api/vran/bulk/upload/file?segment=${selectedSegment}&user_id=demo_user`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setBulkJobs([data.job, ...bulkJobs]);
        setBulkFile(null);
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
    }
    setLoading(false);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300',
      minimal: 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[severity] || colors.minimal;
  };

  const getActionColor = (action) => {
    const colors = {
      enforce: 'bg-red-500 text-white',
      protect: 'bg-orange-500 text-white',
      detect: 'bg-blue-500 text-white'
    };
    return colors[action] || colors.detect;
  };

  // Render Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Wifi className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardStats?.total_active_sessions || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Cpu className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">AI Patterns</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardStats?.threat_patterns_active || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">External Feeds</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardStats?.external_feeds_connected || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Patterns Learned</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardStats?.ai_stats?.patterns_learned || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Segment Selection */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Segment</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEGMENTS.map((seg) => (
            <button
              key={seg.id}
              onClick={() => setSelectedSegment(seg.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedSegment === seg.id
                  ? `border-${seg.color}-500 bg-${seg.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <seg.icon className={`w-8 h-8 mb-2 ${
                selectedSegment === seg.id ? `text-${seg.color}-600` : 'text-gray-400'
              }`} />
              <h4 className="font-semibold text-gray-900">{seg.name}</h4>
              <p className="text-xs text-gray-500">{seg.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Analysis Result */}
      {analysisResult && (
        <div className={`rounded-xl border-2 p-6 ${getSeverityColor(analysisResult.severity)}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Threat Analysis Result</h3>
              <p className="text-sm opacity-75">{analysisResult.identifier}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-bold ${getActionColor(analysisResult.recommended_action)}`}>
              {analysisResult.recommended_action?.toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm opacity-75">Threat Score</p>
              <p className="text-2xl font-bold">{analysisResult.threat_score}/100</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Severity</p>
              <p className="text-xl font-bold capitalize">{analysisResult.severity}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Threats Found</p>
              <p className="text-xl font-bold">{analysisResult.threats_found?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Analysis Time</p>
              <p className="text-xl font-bold">{analysisResult.analysis_time_ms}ms</p>
            </div>
          </div>
          
          <div className="bg-white/50 rounded-lg p-4">
            <p className="text-sm font-medium mb-1">AI Summary</p>
            <p className="text-sm">{analysisResult.ai_summary}</p>
          </div>
        </div>
      )}

      {/* Active Connections */}
      {connections.length > 0 && (
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Connections</h3>
          <div className="space-y-3">
            {connections.slice(0, 5).map((conn, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Wifi className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{conn.identifier}</p>
                    <p className="text-xs text-gray-500">{conn.connection_type} • {conn.segment}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAnalyze(conn.identifier)}
                  className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
                >
                  Analyze
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render Connect Tab
  const renderConnect = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect to vRAN</h3>
        
        {/* Connection Type Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setConnectionForm({...connectionForm, connectionType: 'mobile_number'})}
            className={`flex-1 p-4 rounded-xl border-2 transition ${
              connectionForm.connectionType === 'mobile_number'
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200'
            }`}
          >
            <Smartphone className="w-6 h-6 mb-2 mx-auto text-amber-600" />
            <p className="font-medium">Mobile Number</p>
            <p className="text-xs text-gray-500">MSISDN/Phone</p>
          </button>
          <button
            onClick={() => setConnectionForm({...connectionForm, connectionType: 'apn'})}
            className={`flex-1 p-4 rounded-xl border-2 transition ${
              connectionForm.connectionType === 'apn'
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200'
            }`}
          >
            <Globe className="w-6 h-6 mb-2 mx-auto text-amber-600" />
            <p className="font-medium">APN</p>
            <p className="text-xs text-gray-500">Access Point Name</p>
          </button>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          {connectionForm.connectionType === 'mobile_number' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number / MSISDN
              </label>
              <input
                type="text"
                value={connectionForm.identifier}
                onChange={(e) => setConnectionForm({...connectionForm, identifier: e.target.value})}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Point Name (APN)
              </label>
              <input
                type="text"
                value={connectionForm.apn}
                onChange={(e) => setConnectionForm({...connectionForm, apn: e.target.value})}
                placeholder="internet.provider.com"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Segment</label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              {SEGMENTS.map(seg => (
                <option key={seg.id} value={seg.id}>{seg.name} - {seg.description}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wifi className="w-5 h-5" />}
            Connect & Analyze
          </button>
        </form>
      </div>

      {/* Segment-specific fields info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h4 className="font-medium text-amber-800 mb-2">
          {SEGMENTS.find(s => s.id === selectedSegment)?.name} Identifiers
        </h4>
        <div className="text-sm text-amber-700">
          {selectedSegment === 'telco' && (
            <ul className="list-disc list-inside space-y-1">
              <li>MSISDN (Phone Number)</li>
              <li>IMSI (SIM Identity)</li>
              <li>ICCID (SIM Serial)</li>
              <li>APN Configuration</li>
            </ul>
          )}
          {selectedSegment === 'mobile' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Phone Number</li>
              <li>IMEI (Device ID)</li>
              <li>APN Settings</li>
            </ul>
          )}
          {selectedSegment === 'enterprise' && (
            <ul className="list-disc list-inside space-y-1">
              <li>IP Address / CIDR Range</li>
              <li>Domain Name</li>
              <li>Enterprise APN</li>
            </ul>
          )}
          {selectedSegment === 'automotive' && (
            <ul className="list-disc list-inside space-y-1">
              <li>VIN (Vehicle ID)</li>
              <li>eSIM ICCID</li>
              <li>Telematics APN</li>
            </ul>
          )}
          {selectedSegment === 'white_goods' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Device ID / Serial Number</li>
              <li>MAC Address</li>
              <li>IMEI (cellular devices)</li>
              <li>APN Configuration</li>
              <li>Device Type: Fridge, AC, Washer, TV, etc.</li>
            </ul>
          )}
          {selectedSegment === 'cctv' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Camera ID</li>
              <li>IP Address / MAC Address</li>
              <li>RTSP Stream URL</li>
              <li>IMEI / APN (cellular cameras)</li>
              <li>Type: Public or Private</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  // Render Bulk Upload Tab
  const renderBulkUpload = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Upload</h3>
        <p className="text-sm text-gray-500 mb-6">
          Upload CSV or JSON file with identifiers for bulk processing. 
          Supports millions of records with async processing.
        </p>
        
        <form onSubmit={handleBulkUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Segment</label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              {SEGMENTS.map(seg => (
                <option key={seg.id} value={seg.id}>{seg.name}</option>
              ))}
            </select>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <input
              type="file"
              accept=".csv,.json"
              onChange={(e) => setBulkFile(e.target.files[0])}
              className="hidden"
              id="bulk-file"
            />
            <label htmlFor="bulk-file" className="cursor-pointer">
              <p className="text-gray-600 mb-2">
                {bulkFile ? bulkFile.name : 'Click to upload CSV or JSON file'}
              </p>
              <p className="text-xs text-gray-400">Max 10MB • Supports CSV, JSON</p>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={!bulkFile || loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            Upload & Process
          </button>
        </form>
      </div>

      {/* Bulk Jobs List */}
      {bulkJobs.length > 0 && (
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Jobs</h3>
          <div className="space-y-3">
            {bulkJobs.map((job, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{job.job_id}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.status === 'completed' ? 'bg-green-100 text-green-700' :
                    job.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {job.total_records} records • {job.segment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSV Template */}
      <div className="bg-gray-50 border rounded-xl p-4">
        <h4 className="font-medium text-gray-800 mb-2">CSV Template Format</h4>
        <div className="bg-white rounded p-3 font-mono text-xs overflow-x-auto">
          {selectedSegment === 'telco' && 'msisdn,imsi,apn\n+919876543210,405011234567890,internet.telco.com'}
          {selectedSegment === 'mobile' && 'phone_number,imei,device_id\n+919876543210,123456789012345,device_001'}
          {selectedSegment === 'enterprise' && 'ip_address,domain,apn\n192.168.1.0/24,example.com,enterprise.apn'}
          {selectedSegment === 'automotive' && 'vin,esim_iccid,apn\n1HGBH41JXMN109186,8991234567890,auto.apn'}
          {selectedSegment === 'white_goods' && 'device_id,mac_address,device_type,manufacturer,apn\nDEV001,AA:BB:CC:DD:EE:FF,refrigerator,Samsung,iot.apn.com'}
          {selectedSegment === 'cctv' && 'camera_id,camera_type,ip_address,mac_address,location,apn\nCAM001,private,192.168.1.100,AA:BB:CC:DD:EE:01,Office Lobby,cctv.apn.com'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-amber-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Threat Center</h1>
              <p className="text-sm text-gray-500">vRAN Integration & AI Threat Detection</p>
            </div>
          </div>
          <button 
            onClick={fetchDashboardStats}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'connect', label: 'Connect Device', icon: Wifi },
              { id: 'bulk', label: 'Bulk Upload', icon: Upload },
              { id: 'alerts', label: 'Alerts', icon: Bell },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === item.id 
                    ? 'bg-amber-50 text-amber-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Segment Quick Select */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-xs font-medium text-gray-500 mb-3">ACTIVE SEGMENT</p>
            <div className="space-y-2">
              {SEGMENTS.map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => setSelectedSegment(seg.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    selectedSegment === seg.id 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <seg.icon className="w-4 h-4" />
                  {seg.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'connect' && renderConnect()}
          {activeTab === 'bulk' && renderBulkUpload()}
          {activeTab === 'alerts' && (
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Configuration</h3>
              <p className="text-gray-500">Configure alerts for In-App, Email, SMS, and Webhook notifications.</p>
              <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-700">
                  ⚠️ Alert channels are currently mocked. Integration with real notification services will be enabled when API keys are provided.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ThreatCenter;
