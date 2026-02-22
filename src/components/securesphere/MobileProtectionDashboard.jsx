import React, { useState, useEffect } from 'react';
import {
  Smartphone, QrCode, Shield, MessageSquare, Link as LinkIcon, 
  AlertTriangle, CheckCircle, RefreshCw, Plus, Eye, Trash2,
  Activity, Wifi, Lock, Unlock, Bell, Settings, ChevronRight,
  Download, Globe, Search, Filter, XCircle, Copy, Check,
  Zap, Radio, Signal, Phone, Mail, Key, Fingerprint
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Helper to get owner ID - uses auth context or falls back to session storage
const getOwnerId = (user) => {
  if (user?.id) return user.id;
  if (user?.email) return user.email;
  // Fallback to session-based ID for demo purposes
  let sessionId = sessionStorage.getItem('securesphere_owner_id');
  if (!sessionId) {
    sessionId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('securesphere_owner_id', sessionId);
  }
  return sessionId;
};

// Helper to get device ID for scanning (uses session storage for consistency)
const getDeviceId = () => {
  let deviceId = sessionStorage.getItem('securesphere_device_id');
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('securesphere_device_id', deviceId);
  }
  return deviceId;
};

const MobileProtectionDashboard = () => {
  // Get user from auth context
  const { user } = useAuth() || {};
  const ownerId = getOwnerId(user);
  const deviceId = getDeviceId();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [devices, setDevices] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [urlToScan, setUrlToScan] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [smsContent, setSmsContent] = useState('');
  const [smsScanResult, setSmsScanResult] = useState(null);
  const [sdkInfo, setSdkInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, devicesRes, sdkRes] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/mobile-protection/dashboard/overview`),
        fetch(`${API_URL}/api/securesphere/mobile-protection/devices`),
        fetch(`${API_URL}/api/securesphere/mobile-protection/sdk/info`)
      ]);

      const overviewData = await overviewRes.json();
      const devicesData = await devicesRes.json();
      const sdkData = await sdkRes.json();

      setOverview(overviewData);
      setDevices(devicesData.devices || []);
      setSdkInfo(sdkData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const response = await fetch(`${API_URL}/api/securesphere/mobile-protection/qr/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_id: ownerId,
          device_type: 'android'
        })
      });
      const data = await response.json();
      setQrData(data);
      setShowQRModal(true);
    } catch (error) {
      console.error('Error generating QR:', error);
    }
  };

  const scanURL = async () => {
    if (!urlToScan) return;
    try {
      const response = await fetch(`${API_URL}/api/securesphere/mobile-protection/scan/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceId,
          url: urlToScan,
          source: 'manual'
        })
      });
      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      console.error('Error scanning URL:', error);
    }
  };

  const scanSMS = async () => {
    if (!smsContent) return;
    try {
      const response = await fetch(`${API_URL}/api/securesphere/mobile-protection/scan/sms?device_id=${encodeURIComponent(deviceId)}&sms_content=${encodeURIComponent(smsContent)}&sender=unknown`, {
        method: 'POST'
      });
      const data = await response.json();
      setSmsScanResult(data);
    } catch (error) {
      console.error('Error scanning SMS:', error);
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'safe': return 'green';
      case 'potentially_unsafe': return 'yellow';
      case 'suspicious': return 'orange';
      case 'malicious': return 'red';
      default: return 'gray';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'devices', name: 'Devices', icon: Smartphone },
    { id: 'url-scanner', name: 'URL Scanner', icon: LinkIcon },
    { id: 'sms-analyzer', name: 'SMS Analyzer', icon: MessageSquare },
    { id: 'sdk', name: 'SDK & Setup', icon: Download }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mobile Protection</h2>
          <p className="text-gray-600">Protect mobile devices from SMS fraud, phishing & malware</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={generateQRCode} className="bg-orange-600 hover:bg-orange-700">
            <QrCode className="h-4 w-4 mr-2" />
            Link Device
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.summary?.total_devices || 0}</p>
                <p className="text-xs text-gray-500">Total Devices</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.summary?.active_devices || 0}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LinkIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.stats?.urls_scanned || 0}</p>
                <p className="text-xs text-gray-500">URLs Scanned</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.stats?.threats_blocked || 0}</p>
                <p className="text-xs text-gray-500">Threats Blocked</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.stats?.sms_analyzed || 0}</p>
                <p className="text-xs text-gray-500">SMS Analyzed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.protection_rate || 0}%</p>
                <p className="text-xs text-gray-500">Protection Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-orange-100 text-orange-700 border-b-2 border-orange-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="font-medium text-sm">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Threats */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Recent Threats
              </h3>
              {overview?.recent_threats?.length > 0 ? (
                <div className="space-y-3">
                  {overview.recent_threats.map((threat, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                      threat.verdict === 'malicious' ? 'bg-red-50 border-red-500' :
                      'bg-orange-50 border-orange-500'
                    }`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate max-w-[200px]">{threat.url}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          threat.verdict === 'malicious' ? 'bg-red-200 text-red-700' : 'bg-orange-200 text-orange-700'
                        }`}>
                          {threat.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Risk Score: {threat.risk_score}/100</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-300" />
                  <p>No recent threats detected</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={generateQRCode}
                  className="p-4 rounded-lg border hover:bg-orange-50 hover:border-orange-200 transition-all text-left"
                >
                  <QrCode className="h-8 w-8 text-orange-500 mb-2" />
                  <p className="font-medium text-sm">Link New Device</p>
                  <p className="text-xs text-gray-500">Scan QR to connect</p>
                </button>
                <button 
                  onClick={() => setActiveTab('url-scanner')}
                  className="p-4 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-all text-left"
                >
                  <LinkIcon className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="font-medium text-sm">Scan URL</p>
                  <p className="text-xs text-gray-500">Check link safety</p>
                </button>
                <button 
                  onClick={() => setActiveTab('sms-analyzer')}
                  className="p-4 rounded-lg border hover:bg-purple-50 hover:border-purple-200 transition-all text-left"
                >
                  <MessageSquare className="h-8 w-8 text-purple-500 mb-2" />
                  <p className="font-medium text-sm">Analyze SMS</p>
                  <p className="text-xs text-gray-500">Check message safety</p>
                </button>
                <button 
                  onClick={() => setActiveTab('sdk')}
                  className="p-4 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-all text-left"
                >
                  <Download className="h-8 w-8 text-green-500 mb-2" />
                  <p className="font-medium text-sm">Get SDK</p>
                  <p className="text-xs text-gray-500">Download mobile SDK</p>
                </button>
              </div>
            </div>

            {/* Protection Features */}
            <div className="bg-white rounded-xl border shadow-sm p-6 lg:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4">Protection Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-blue-900">SMS Protection</span>
                  </div>
                  <p className="text-sm text-blue-700">Real-time scanning of SMS messages for phishing links and scam content</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <LinkIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-purple-900">URL Blocking</span>
                  </div>
                  <p className="text-sm text-purple-700">Automatic blocking of malicious URLs and phishing websites</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-green-900">App Monitor</span>
                  </div>
                  <p className="text-sm text-green-700">Monitor app permissions and detect risky applications</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Wifi className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-orange-900">Network Analysis</span>
                  </div>
                  <p className="text-sm text-orange-700">Analyze network traffic for suspicious connections</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Protected Devices ({devices.length})</h3>
              <Button onClick={generateQRCode} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </div>
            
            {devices.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-700 mb-2">No devices protected yet</h4>
                <p className="text-sm text-gray-500 mb-4">Link your first device to start protection</p>
                <Button onClick={generateQRCode} className="bg-orange-600 hover:bg-orange-700">
                  <QrCode className="h-4 w-4 mr-2" />
                  Link Device
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <div key={device.id} className="bg-white rounded-xl border shadow-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${device.device_type === 'android' ? 'bg-green-100' : 'bg-blue-100'}`}>
                          <Smartphone className={`h-5 w-5 ${device.device_type === 'android' ? 'text-green-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{device.device_name}</h4>
                          <p className="text-xs text-gray-500">{device.manufacturer} {device.model}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        device.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {device.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-xs text-gray-500">URLs Scanned</p>
                        <p className="font-medium">{device.stats?.urls_scanned || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Threats Blocked</p>
                        <p className="font-medium text-red-600">{device.stats?.threats_blocked || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-3 border-t">
                      {Object.entries(device.features_enabled || {}).slice(0, 4).map(([feature, enabled]) => (
                        <div key={feature} className={`p-1.5 rounded ${enabled ? 'bg-green-100' : 'bg-gray-100'}`} title={feature.replace('_', ' ')}>
                          {feature === 'sms_protection' && <MessageSquare className={`h-3 w-3 ${enabled ? 'text-green-600' : 'text-gray-400'}`} />}
                          {feature === 'url_blocking' && <LinkIcon className={`h-3 w-3 ${enabled ? 'text-green-600' : 'text-gray-400'}`} />}
                          {feature === 'app_monitoring' && <Shield className={`h-3 w-3 ${enabled ? 'text-green-600' : 'text-gray-400'}`} />}
                          {feature === 'network_analysis' && <Wifi className={`h-3 w-3 ${enabled ? 'text-green-600' : 'text-gray-400'}`} />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* URL Scanner Tab */}
        {activeTab === 'url-scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-500" />
                URL Scanner
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter a URL to check if it&apos;s safe or potentially malicious
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlToScan}
                    onChange={(e) => setUrlToScan(e.target.value)}
                    placeholder="https://example.com/suspicious-link"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <Button onClick={scanURL} className="bg-orange-600 hover:bg-orange-700">
                    <Search className="h-4 w-4 mr-2" />
                    Scan
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500">
                  <p className="font-medium mb-1">Test URLs:</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setUrlToScan('https://secure-bank-login.com/verify')}
                      className="text-blue-600 hover:underline"
                    >
                      Phishing example
                    </button>
                    <button 
                      onClick={() => setUrlToScan('https://bit.ly/xyz123')}
                      className="text-blue-600 hover:underline"
                    >
                      Shortened URL
                    </button>
                    <button 
                      onClick={() => setUrlToScan('https://google.com')}
                      className="text-blue-600 hover:underline"
                    >
                      Safe URL
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scan Result */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Scan Result</h3>
              
              {scanResult ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border-2 ${
                    scanResult.verdict === 'safe' ? 'bg-green-50 border-green-200' :
                    scanResult.verdict === 'malicious' ? 'bg-red-50 border-red-200' :
                    'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-lg font-bold ${
                        scanResult.verdict === 'safe' ? 'text-green-700' :
                        scanResult.verdict === 'malicious' ? 'text-red-700' :
                        'text-orange-700'
                      }`}>
                        {scanResult.verdict.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        scanResult.risk_score < 20 ? 'bg-green-200 text-green-800' :
                        scanResult.risk_score < 50 ? 'bg-yellow-200 text-yellow-800' :
                        scanResult.risk_score < 70 ? 'bg-orange-200 text-orange-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        Risk: {scanResult.risk_score}/100
                      </span>
                    </div>
                    <p className="text-sm">{scanResult.recommendation}</p>
                  </div>
                  
                  {scanResult.threats?.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-2">Threats Detected:</p>
                      <div className="space-y-2">
                        {scanResult.threats.map((threat, idx) => (
                          <div key={idx} className="p-2 bg-red-50 rounded border-l-4 border-red-400">
                            <p className="text-sm font-medium text-red-800">{threat.type.replace('_', ' ')}</p>
                            <p className="text-xs text-red-600">{threat.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Action: <span className="font-medium">{scanResult.action}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <LinkIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Enter a URL and click Scan to check its safety</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SMS Analyzer Tab */}
        {activeTab === 'sms-analyzer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                SMS Analyzer
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Paste SMS content to analyze for scams, phishing, and threats
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={smsContent}
                  onChange={(e) => setSmsContent(e.target.value)}
                  placeholder="Paste the SMS message here..."
                  className="w-full h-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                />
                <Button onClick={scanSMS} className="w-full bg-orange-600 hover:bg-orange-700">
                  <Search className="h-4 w-4 mr-2" />
                  Analyze SMS
                </Button>
                
                <div className="text-xs text-gray-500">
                  <p className="font-medium mb-1">Test Messages:</p>
                  <button 
                    onClick={() => setSmsContent('URGENT: Your bank account has been suspended! Click here to verify: https://secure-bank-login.com/verify immediately to avoid account closure.')}
                    className="text-purple-600 hover:underline block"
                  >
                    Bank scam example
                  </button>
                  <button 
                    onClick={() => setSmsContent('Congratulations! You have won a prize of $10,000! Click here to claim: https://prize-winner.com/claim')}
                    className="text-purple-600 hover:underline block"
                  >
                    Prize scam example
                  </button>
                </div>
              </div>
            </div>
            
            {/* SMS Scan Result */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Analysis Result</h3>
              
              {smsScanResult ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border-2 ${
                    smsScanResult.verdict === 'safe' ? 'bg-green-50 border-green-200' :
                    smsScanResult.verdict === 'malicious' ? 'bg-red-50 border-red-200' :
                    'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-lg font-bold ${
                        smsScanResult.verdict === 'safe' ? 'text-green-700' :
                        smsScanResult.verdict === 'malicious' ? 'text-red-700' :
                        'text-orange-700'
                      }`}>
                        {smsScanResult.verdict.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        smsScanResult.risk_score < 30 ? 'bg-green-200 text-green-800' :
                        smsScanResult.risk_score < 60 ? 'bg-orange-200 text-orange-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        Risk: {smsScanResult.risk_score}/100
                      </span>
                    </div>
                    <p className="text-sm">{smsScanResult.recommendation}</p>
                  </div>
                  
                  {smsScanResult.extracted_urls?.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-2">Extracted URLs:</p>
                      <div className="space-y-1">
                        {smsScanResult.extracted_urls.map((url, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded text-sm truncate">
                            {url}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {smsScanResult.threats?.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-2">Issues Found:</p>
                      <div className="space-y-2">
                        {smsScanResult.threats.map((threat, idx) => (
                          <div key={idx} className="p-2 bg-red-50 rounded border-l-4 border-red-400">
                            <p className="text-sm font-medium text-red-800">{threat.type.replace('_', ' ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Paste an SMS message to analyze its content</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SDK Tab */}
        {activeTab === 'sdk' && sdkInfo && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Android SDK */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Smartphone className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Android SDK</h3>
                    <p className="text-sm text-gray-500">v{sdkInfo.android?.version}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Min SDK</span>
                    <span className="font-medium">{sdkInfo.android?.min_sdk}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Size</span>
                    <span className="font-medium">{sdkInfo.android?.size_mb} MB</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Features:</p>
                  <div className="space-y-1">
                    {sdkInfo.android?.features?.slice(0, 4).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download SDK
                </Button>
              </div>
              
              {/* iOS SDK */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Smartphone className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">iOS SDK</h3>
                    <p className="text-sm text-gray-500">v{sdkInfo.ios?.version}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Min iOS</span>
                    <span className="font-medium">{sdkInfo.ios?.min_ios}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Size</span>
                    <span className="font-medium">{sdkInfo.ios?.size_mb} MB</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Features:</p>
                  <div className="space-y-1">
                    {sdkInfo.ios?.features?.slice(0, 4).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="h-3 w-3 text-blue-500" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download SDK
                </Button>
              </div>
              
              {/* Web/Browser Protection */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Browser Protection</h3>
                    <p className="text-sm text-gray-500">v{sdkInfo.web_sdk?.version}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  {sdkInfo.web_sdk?.description}
                </p>
                
                <div className="p-3 bg-purple-50 rounded-lg mb-4">
                  <p className="text-xs font-medium text-purple-800">No app installation required!</p>
                  <p className="text-xs text-purple-600">Works with any mobile browser</p>
                </div>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Setup Guide
                </Button>
              </div>
            </div>

            {/* Connection Methods */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Device Connection Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-xl text-center hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer">
                  <QrCode className="h-10 w-10 mx-auto mb-2 text-orange-500" />
                  <p className="font-medium text-sm">QR Code Scan</p>
                  <p className="text-xs text-gray-500">Quick pairing</p>
                </div>
                <div className="p-4 border rounded-xl text-center hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                  <Phone className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium text-sm">SMS Verification</p>
                  <p className="text-xs text-gray-500">OTP confirmation</p>
                </div>
                <div className="p-4 border rounded-xl text-center hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                  <Globe className="h-10 w-10 mx-auto mb-2 text-green-500" />
                  <p className="font-medium text-sm">Browser Setup</p>
                  <p className="text-xs text-gray-500">No app needed</p>
                </div>
                <div className="p-4 border rounded-xl text-center hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer">
                  <Download className="h-10 w-10 mx-auto mb-2 text-purple-500" />
                  <p className="font-medium text-sm">SDK Integration</p>
                  <p className="text-xs text-gray-500">For developers</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && qrData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Link Mobile Device</h3>
              <button onClick={() => setShowQRModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              {/* QR Code Display */}
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <QrCode className="h-24 w-24 mx-auto text-gray-800" />
                  <p className="text-xs text-gray-500 mt-2">Scan with mobile</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Open SecureSphere app and scan this QR code
              </p>
              
              <div className="bg-orange-50 p-3 rounded-lg text-left">
                <p className="text-xs font-medium text-orange-800 mb-2">Link Token:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-white p-2 rounded border truncate">
                    {qrData.link_token}
                  </code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(qrData.link_token)}
                    className="p-2 hover:bg-orange-100 rounded"
                  >
                    <Copy className="h-4 w-4 text-orange-600" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-xs font-medium text-gray-700">Instructions:</p>
              {qrData.instructions?.map((inst, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="w-4 h-4 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  {inst}
                </div>
              ))}
            </div>
            
            <div className="text-center text-xs text-gray-500">
              Expires in {qrData.expires_in_minutes} minutes
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileProtectionDashboard;
