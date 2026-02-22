import React, { useState, useEffect } from 'react';
import {
  Phone, Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Radio, Lock, Unlock, Eye, Activity, BarChart3, Bell, Send,
  PhoneCall, MessageSquare, Smartphone, UserX, AlertOctagon,
  ChevronDown, ChevronUp, Search, Filter, Clock, TrendingUp
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const GSMFraudDetection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [fraudTypes, setFraudTypes] = useState([]);
  const [simSwapAlerts, setSimSwapAlerts] = useState([]);
  const [otpAlerts, setOtpAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Test forms
  const [showSimSwapTest, setShowSimSwapTest] = useState(false);
  const [showOtpTest, setShowOtpTest] = useState(false);
  const [showCallerIdTest, setShowCallerIdTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const [simSwapForm, setSimSwapForm] = useState({
    subscriber_id: 'SUB-001',
    phone_number: '+919876543210',
    old_imsi: '404100123456789',
    new_imsi: '404200987654321',
    old_imei: '123456789012345',
    new_imei: '543210987654321',
    carrier_change: true,
    location_before: 'Mumbai',
    location_after: 'Delhi'
  });

  const [otpForm, setOtpForm] = useState({
    subscriber_id: 'SUB-001',
    phone_number: '+919876543210',
    otp_type: 'sms',
    service_provider: 'bank',
    delivery_status: 'delayed',
    delivery_time_ms: 35000,
    source_ip: '185.220.101.45'
  });

  const [callerIdForm, setCallerIdForm] = useState({
    calling_number: '+911800123456',
    called_number: '+919876543210',
    ani: '+441onal234567',
    originating_carrier: 'international_voip',
    call_type: 'voice'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardRes, typesRes, simSwapRes, otpRes] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/gsm-fraud/dashboard/overview`),
        fetch(`${API_URL}/api/securesphere/gsm-fraud/fraud-types`),
        fetch(`${API_URL}/api/securesphere/gsm-fraud/sim-swap/alerts?limit=10`),
        fetch(`${API_URL}/api/securesphere/gsm-fraud/otp/alerts?limit=10`)
      ]);
      
      const dashboardData = await dashboardRes.json();
      const typesData = await typesRes.json();
      const simSwapData = await simSwapRes.json();
      const otpData = await otpRes.json();
      
      setDashboard(dashboardData);
      setFraudTypes(typesData.fraud_types || []);
      setSimSwapAlerts(simSwapData.alerts || []);
      setOtpAlerts(otpData.alerts || []);
    } catch (error) {
      console.error('Error fetching GSM fraud data:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSimSwapDetection = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/securesphere/gsm-fraud/sim-swap/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simSwapForm)
      });
      const data = await response.json();
      setTestResult({ type: 'sim_swap', data });
      fetchData();
    } catch (error) {
      console.error('Error testing SIM swap:', error);
    }
  };

  const testOtpInterception = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/securesphere/gsm-fraud/otp/monitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(otpForm)
      });
      const data = await response.json();
      setTestResult({ type: 'otp', data });
      fetchData();
    } catch (error) {
      console.error('Error testing OTP:', error);
    }
  };

  const testCallerIdSpoof = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/securesphere/gsm-fraud/caller-id/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callerIdForm)
      });
      const data = await response.json();
      setTestResult({ type: 'caller_id', data });
      fetchData();
    } catch (error) {
      console.error('Error testing caller ID:', error);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[severity] || colors.medium;
  };

  const tabs = [
    { id: 'dashboard', name: 'Fraud Dashboard', icon: BarChart3 },
    { id: 'sim-swap', name: 'SIM Swap', icon: Smartphone },
    { id: 'otp', name: 'OTP Interception', icon: Lock },
    { id: 'caller-id', name: 'Caller ID Spoofing', icon: PhoneCall },
    { id: 'fraud-types', name: 'Fraud Types', icon: AlertOctagon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">GSM Fraud Detection</h2>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              TELECOM
            </span>
          </div>
          <p className="text-gray-600">Detect SIM swap, OTP interception, and caller ID spoofing</p>
        </div>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && dashboard && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboard.summary?.total_fraud_events || 0}</p>
                  <p className="text-xs text-gray-500">Total Fraud Events</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bell className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboard.summary?.active_alerts || 0}</p>
                  <p className="text-xs text-gray-500">Active Alerts</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboard.summary?.pending_reports || 0}</p>
                  <p className="text-xs text-gray-500">Pending Reports</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboard.caller_id_spoofing?.detection_rate || 0}%
                  </p>
                  <p className="text-xs text-gray-500">Detection Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fraud Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SIM Swap */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">SIM Swap Attacks</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Alerts</span>
                  <span className="font-bold">{dashboard.sim_swap?.total_alerts || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Critical</span>
                  <span className="font-bold text-red-600">{dashboard.sim_swap?.critical_alerts || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last 24h</span>
                  <span className="font-bold text-orange-600">{dashboard.sim_swap?.last_24h || 0}</span>
                </div>
              </div>
            </div>

            {/* OTP Interception */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">OTP Interception</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Events</span>
                  <span className="font-bold">{dashboard.otp_interception?.total_events || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">High Risk</span>
                  <span className="font-bold text-red-600">{dashboard.otp_interception?.high_risk_events || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last 24h</span>
                  <span className="font-bold text-orange-600">{dashboard.otp_interception?.last_24h || 0}</span>
                </div>
              </div>
            </div>

            {/* Caller ID Spoofing */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <PhoneCall className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Caller ID Spoofing</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Checks</span>
                  <span className="font-bold">{dashboard.caller_id_spoofing?.total_checks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Spoofed Detected</span>
                  <span className="font-bold text-red-600">{dashboard.caller_id_spoofing?.spoofed_detected || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last 24h</span>
                  <span className="font-bold text-orange-600">{dashboard.caller_id_spoofing?.last_24h || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* High Risk Destinations */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">High Risk Destinations</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(dashboard.high_risk_destinations || {}).map(([country, prefix]) => (
                <span key={country} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-200">
                  {country.replace('_', ' ')} ({prefix})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SIM Swap Tab */}
      {activeTab === 'sim-swap' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">SIM Swap Attack Detection</h3>
              <Button onClick={() => setShowSimSwapTest(!showSimSwapTest)} variant="outline">
                {showSimSwapTest ? 'Hide Test' : 'Test Detection'}
              </Button>
            </div>
            
            {showSimSwapTest && (
              <form onSubmit={testSimSwapDetection} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber ID</label>
                    <input
                      type="text"
                      value={simSwapForm.subscriber_id}
                      onChange={(e) => setSimSwapForm({ ...simSwapForm, subscriber_id: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={simSwapForm.phone_number}
                      onChange={(e) => setSimSwapForm({ ...simSwapForm, phone_number: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Old IMSI</label>
                    <input
                      type="text"
                      value={simSwapForm.old_imsi}
                      onChange={(e) => setSimSwapForm({ ...simSwapForm, old_imsi: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New IMSI</label>
                    <input
                      type="text"
                      value={simSwapForm.new_imsi}
                      onChange={(e) => setSimSwapForm({ ...simSwapForm, new_imsi: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Before</label>
                    <input
                      type="text"
                      value={simSwapForm.location_before}
                      onChange={(e) => setSimSwapForm({ ...simSwapForm, location_before: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location After</label>
                    <input
                      type="text"
                      value={simSwapForm.location_after}
                      onChange={(e) => setSimSwapForm({ ...simSwapForm, location_after: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={simSwapForm.carrier_change}
                      onChange={(e) => setSimSwapForm({ ...simSwapForm, carrier_change: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Carrier Changed</span>
                  </label>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Run Detection
                  </Button>
                </div>
              </form>
            )}
            
            {/* Test Result */}
            {testResult?.type === 'sim_swap' && (
              <div className={`p-4 rounded-lg mb-4 ${
                testResult.data.is_sim_swap_detected ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {testResult.data.is_sim_swap_detected ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <span className="font-semibold">
                    {testResult.data.is_sim_swap_detected ? 'SIM SWAP DETECTED!' : 'No SIM Swap Detected'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(testResult.data.threat_level)}`}>
                    {testResult.data.threat_level?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm">Risk Score: <strong>{testResult.data.risk_score}</strong></p>
                {testResult.data.risk_factors?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Risk Factors:</p>
                    {testResult.data.risk_factors.map((f, i) => (
                      <p key={i} className="text-xs text-gray-600">• {f.description}</p>
                    ))}
                  </div>
                )}
                {testResult.data.recommended_actions?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Recommended Actions:</p>
                    {testResult.data.recommended_actions.map((a, i) => (
                      <p key={i} className="text-xs text-blue-600">✓ {a}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recent Alerts */}
            <h4 className="font-medium text-gray-900 mb-3">Recent SIM Swap Alerts</h4>
            {simSwapAlerts.length === 0 ? (
              <p className="text-gray-500 text-sm">No SIM swap alerts detected yet</p>
            ) : (
              <div className="space-y-2">
                {simSwapAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.threat_level)}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Alert #{alert.id?.slice(0, 8)}</span>
                      <span className="text-xs">{alert.threat_level?.toUpperCase()} - Score: {alert.risk_score}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTP Interception Tab */}
      {activeTab === 'otp' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">OTP Interception Detection</h3>
              <Button onClick={() => setShowOtpTest(!showOtpTest)} variant="outline">
                {showOtpTest ? 'Hide Test' : 'Test Detection'}
              </Button>
            </div>
            
            {showOtpTest && (
              <form onSubmit={testOtpInterception} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber ID</label>
                    <input
                      type="text"
                      value={otpForm.subscriber_id}
                      onChange={(e) => setOtpForm({ ...otpForm, subscriber_id: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OTP Type</label>
                    <select
                      value={otpForm.otp_type}
                      onChange={(e) => setOtpForm({ ...otpForm, otp_type: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="sms">SMS</option>
                      <option value="voice">Voice Call</option>
                      <option value="authenticator">Authenticator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
                    <select
                      value={otpForm.service_provider}
                      onChange={(e) => setOtpForm({ ...otpForm, service_provider: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="bank">Bank</option>
                      <option value="social_media">Social Media</option>
                      <option value="email">Email</option>
                      <option value="ecommerce">E-Commerce</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Status</label>
                    <select
                      value={otpForm.delivery_status}
                      onChange={(e) => setOtpForm({ ...otpForm, delivery_status: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="delivered">Delivered</option>
                      <option value="delayed">Delayed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (ms)</label>
                    <input
                      type="number"
                      value={otpForm.delivery_time_ms}
                      onChange={(e) => setOtpForm({ ...otpForm, delivery_time_ms: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source IP</label>
                    <input
                      type="text"
                      value={otpForm.source_ip}
                      onChange={(e) => setOtpForm({ ...otpForm, source_ip: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Run Detection
                </Button>
              </form>
            )}
            
            {/* Test Result */}
            {testResult?.type === 'otp' && (
              <div className={`p-4 rounded-lg mb-4 ${
                testResult.data.interception_suspected ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {testResult.data.interception_suspected ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <span className="font-semibold">
                    {testResult.data.interception_suspected ? 'OTP INTERCEPTION SUSPECTED!' : 'OTP Delivery Normal'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(testResult.data.threat_level)}`}>
                    {testResult.data.threat_level?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm">Risk Score: <strong>{testResult.data.risk_score}</strong></p>
                <p className="text-sm text-blue-600 mt-1">{testResult.data.recommendation}</p>
              </div>
            )}

            {/* Recent Alerts */}
            <h4 className="font-medium text-gray-900 mb-3">Recent OTP Alerts</h4>
            {otpAlerts.length === 0 ? (
              <p className="text-gray-500 text-sm">No high-risk OTP events detected yet</p>
            ) : (
              <div className="space-y-2">
                {otpAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.threat_level)}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{alert.service_provider} - {alert.otp_type}</span>
                      <span className="text-xs">Score: {alert.risk_score}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Caller ID Spoofing Tab */}
      {activeTab === 'caller-id' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Caller ID Spoofing Detection</h3>
              <Button onClick={() => setShowCallerIdTest(!showCallerIdTest)} variant="outline">
                {showCallerIdTest ? 'Hide Test' : 'Test Detection'}
              </Button>
            </div>
            
            {showCallerIdTest && (
              <form onSubmit={testCallerIdSpoof} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calling Number</label>
                    <input
                      type="text"
                      value={callerIdForm.calling_number}
                      onChange={(e) => setCallerIdForm({ ...callerIdForm, calling_number: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="+911800123456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Called Number</label>
                    <input
                      type="text"
                      value={callerIdForm.called_number}
                      onChange={(e) => setCallerIdForm({ ...callerIdForm, called_number: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ANI (Actual Number)</label>
                    <input
                      type="text"
                      value={callerIdForm.ani}
                      onChange={(e) => setCallerIdForm({ ...callerIdForm, ani: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Different from calling number if spoofed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Originating Carrier</label>
                    <select
                      value={callerIdForm.originating_carrier}
                      onChange={(e) => setCallerIdForm({ ...callerIdForm, originating_carrier: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="domestic">Domestic Carrier</option>
                      <option value="international_voip">International VoIP</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Call Type</label>
                    <select
                      value={callerIdForm.call_type}
                      onChange={(e) => setCallerIdForm({ ...callerIdForm, call_type: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="voice">Voice</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Verify Caller ID
                </Button>
              </form>
            )}
            
            {/* Test Result */}
            {testResult?.type === 'caller_id' && (
              <div className={`p-4 rounded-lg mb-4 ${
                testResult.data.is_spoofed ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {testResult.data.is_spoofed ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <span className="font-semibold">
                    {testResult.data.is_spoofed ? 'CALLER ID SPOOFED!' : 'Caller ID Legitimate'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(testResult.data.threat_level)}`}>
                    {testResult.data.threat_level?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm">Confidence: <strong>{testResult.data.confidence}%</strong></p>
                <p className="text-sm text-blue-600 mt-1">{testResult.data.recommendation}</p>
                {testResult.data.spoof_indicators?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Spoof Indicators:</p>
                    {testResult.data.spoof_indicators.map((ind, i) => (
                      <p key={i} className="text-xs text-red-600">⚠️ {ind.description}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fraud Types Tab */}
      {activeTab === 'fraud-types' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fraudTypes.map((type) => (
            <div key={type.id} className={`bg-white rounded-xl border shadow-sm p-6 ${getSeverityColor(type.severity)}`}>
              <div className="flex items-center gap-3 mb-3">
                <AlertOctagon className={`h-6 w-6 ${
                  type.severity === 'critical' ? 'text-red-600' :
                  type.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'
                }`} />
                <div>
                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded capitalize ${getSeverityColor(type.severity)}`}>
                    {type.severity}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{type.description}</p>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Indicators</p>
                <div className="flex flex-wrap gap-1">
                  {type.indicators?.map((ind) => (
                    <span key={ind} className="px-2 py-0.5 bg-white/50 text-gray-700 text-xs rounded border">
                      {ind.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GSMFraudDetection;
