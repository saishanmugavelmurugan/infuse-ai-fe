import React, { useState, useEffect } from 'react';
import {
  Radio, Server, Smartphone, Shield, Activity, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Settings, Play, Pause,
  Globe, Wifi, Signal, MessageSquare, Link as LinkIcon,
  ChevronDown, ChevronUp, Plus, Trash2, Eye, Zap
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const TelecomIntegration = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [providers, setProviders] = useState([]);
  const [stats, setStats] = useState(null);
  const [iotDevices, setIotDevices] = useState([]);
  const [simulationResults, setSimulationResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showIotModal, setShowIotModal] = useState(false);

  const [configForm, setConfigForm] = useState({
    provider_id: 'airtel',
    api_key: '',
    webhook_url: '',
    features_enabled: ['sms_filtering', 'url_scanning']
  });

  const [iotForm, setIotForm] = useState({
    device_imei: '',
    device_type: 'sensor',
    subscriber_id: '',
    provider_id: 'airtel',
    security_profile: 'standard'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [providersRes, statsRes, iotRes] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/telecom/providers`),
        fetch(`${API_URL}/api/securesphere/telecom/stats`),
        fetch(`${API_URL}/api/securesphere/telecom/iot/devices`)
      ]);
      
      const providersData = await providersRes.json();
      const statsData = await statsRes.json();
      const iotData = await iotRes.json();
      
      setProviders(Object.entries(providersData.providers || {}));
      setStats(statsData);
      setIotDevices(iotData.devices || []);
    } catch (error) {
      console.error('Error fetching telecom data:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateEvent = async (eventType, count = 3) => {
    setSimulating(true);
    try {
      const response = await fetch(
        `${API_URL}/api/securesphere/telecom/ran/simulate?event_type=${eventType}&count=${count}`,
        { method: 'POST' }
      );
      const data = await response.json();
      setSimulationResults(data.events || []);
      fetchData(); // Refresh stats
    } catch (error) {
      console.error('Error simulating event:', error);
    } finally {
      setSimulating(false);
    }
  };

  const configureProvider = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/securesphere/telecom/providers/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configForm)
      });
      if (response.ok) {
        setShowConfigModal(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error configuring provider:', error);
    }
  };

  const registerIotDevice = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/securesphere/telecom/iot/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(iotForm)
      });
      if (response.ok) {
        setShowIotModal(false);
        fetchData();
        setIotForm({
          device_imei: '',
          device_type: 'sensor',
          subscriber_id: '',
          provider_id: 'airtel',
          security_profile: 'standard'
        });
      }
    } catch (error) {
      console.error('Error registering IoT device:', error);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'providers', name: 'Providers', icon: Globe },
    { id: 'simulation', name: 'RAN Simulation', icon: Zap },
    { id: 'iot', name: 'IoT Devices', icon: Smartphone }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Telecom Integration</h2>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              ENTERPRISE
            </span>
          </div>
          <p className="text-gray-600">CSP-level network security for telecom operators</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowConfigModal(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Settings className="h-4 w-4 mr-2" />
            Configure Provider
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Activity className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_events_processed || 0}</p>
                  <p className="text-xs text-gray-500">Events Processed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.threats_blocked || 0}</p>
                  <p className="text-xs text-gray-500">Threats Blocked</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.iot_devices_protected || 0}</p>
                  <p className="text-xs text-gray-500">IoT Devices</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.providers_configured || 0}</p>
                  <p className="text-xs text-gray-500">Providers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Events by Type */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Events by Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(stats.events_by_type || {}).map(([type, count]) => (
                <div key={type} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {type === 'sms_intercept' && <MessageSquare className="h-4 w-4 text-purple-600" />}
                      {type === 'url_request' && <LinkIcon className="h-4 w-4 text-blue-600" />}
                      {type === 'data_transfer' && <Server className="h-4 w-4 text-green-600" />}
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(stats.events_by_type || {}).length === 0 && (
                <p className="text-gray-500 text-sm col-span-3">No events recorded yet. Try running a simulation!</p>
              )}
            </div>
          </div>

          {/* Block Rate */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Threat Block Rate</p>
                <p className="text-4xl font-bold mt-1">{stats.block_rate || 0}%</p>
              </div>
              <Shield className="h-16 w-16 text-white/20" />
            </div>
            <p className="text-indigo-200 text-sm mt-4">
              Blocking malicious SMS, URLs, and suspicious data transfers at the network level
            </p>
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map(([id, provider]) => (
            <div key={id} className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    id === 'airtel' ? 'bg-red-100' :
                    id === 'jio' ? 'bg-blue-100' :
                    id === 'vodafone' ? 'bg-red-100' :
                    id === 'bsnl' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Radio className={`h-5 w-5 ${
                      id === 'airtel' ? 'text-red-600' :
                      id === 'jio' ? 'text-blue-600' :
                      id === 'vodafone' ? 'text-red-600' :
                      id === 'bsnl' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                    <p className="text-xs text-gray-500">{provider.country}</p>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {provider.api_version}
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Supported Features</p>
                <div className="flex flex-wrap gap-2">
                  {provider.supported_features?.map((feature) => (
                    <span key={feature} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                      {feature.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setConfigForm({ ...configForm, provider_id: id });
                  setShowConfigModal(true);
                }}
              >
                Configure
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* RAN Simulation Tab */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">RAN Event Simulation</h3>
            <p className="text-sm text-gray-600 mb-6">
              Simulate network events to test SecureSphere's threat detection capabilities
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => simulateEvent('sms_intercept', 5)}
                disabled={simulating}
                className="p-4 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors group"
              >
                <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">SMS Intercept</p>
                <p className="text-xs text-gray-500">Simulate 5 SMS events</p>
              </button>
              
              <button
                onClick={() => simulateEvent('url_request', 5)}
                disabled={simulating}
                className="p-4 border-2 border-dashed border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors group"
              >
                <LinkIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">URL Request</p>
                <p className="text-xs text-gray-500">Simulate 5 URL events</p>
              </button>
              
              <button
                onClick={() => simulateEvent('data_transfer', 3)}
                disabled={simulating}
                className="p-4 border-2 border-dashed border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors group"
              >
                <Server className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Data Transfer</p>
                <p className="text-xs text-gray-500">Simulate 3 transfer events</p>
              </button>
            </div>
            
            {simulating && (
              <div className="mt-6 flex items-center justify-center gap-2 text-indigo-600">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Simulating events...</span>
              </div>
            )}
          </div>

          {/* Simulation Results */}
          {simulationResults.length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900">Simulation Results</h3>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {simulationResults.map((result, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {result.action === 'blocked' ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : result.action === 'flagged' ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {result.event_type?.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-gray-500">Event ID: {result.event_id?.slice(0, 8)}...</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.action === 'blocked' ? 'bg-red-100 text-red-700' :
                        result.action === 'flagged' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {result.action?.toUpperCase()}
                      </span>
                    </div>
                    {result.threat_details && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg text-sm">
                        <p className="text-red-700">
                          Threat: {result.threat_details.type} | Score: {result.threat_details.risk_score}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* IoT Devices Tab */}
      {activeTab === 'iot' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Registered IoT Devices</h3>
            <Button onClick={() => setShowIotModal(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Register Device
            </Button>
          </div>

          {iotDevices.length === 0 ? (
            <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
              <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="font-medium text-gray-700">No IoT devices registered</h4>
              <p className="text-sm text-gray-500 mt-1">Register IoT devices to monitor their security</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {iotDevices.map((device) => (
                <div key={device.id} className="bg-white rounded-xl border shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Smartphone className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-900 capitalize">{device.device_type}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      device.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {device.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-500">Provider: <span className="text-gray-700">{device.provider_id}</span></p>
                    <p className="text-gray-500">Security: <span className="text-gray-700 capitalize">{device.security_profile}</span></p>
                    <p className="text-gray-500">Threat Score: <span className="text-gray-700">{device.threat_score || 0}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Configure Provider Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Configure Provider</h3>
            </div>
            <form onSubmit={configureProvider} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <select
                  value={configForm.provider_id}
                  onChange={(e) => setConfigForm({ ...configForm, provider_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {providers.map(([id, provider]) => (
                    <option key={id} value={id}>{provider.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="password"
                  required
                  value={configForm.api_key}
                  onChange={(e) => setConfigForm({ ...configForm, api_key: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter provider API key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL (Optional)</label>
                <input
                  type="url"
                  value={configForm.webhook_url}
                  onChange={(e) => setConfigForm({ ...configForm, webhook_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://your-server.com/webhook"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowConfigModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                  Save Configuration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register IoT Device Modal */}
      {showIotModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Register IoT Device</h3>
            </div>
            <form onSubmit={registerIotDevice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device IMEI</label>
                <input
                  type="text"
                  required
                  value={iotForm.device_imei}
                  onChange={(e) => setIotForm({ ...iotForm, device_imei: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter device IMEI"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                  <select
                    value={iotForm.device_type}
                    onChange={(e) => setIotForm({ ...iotForm, device_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="sensor">Sensor</option>
                    <option value="gateway">Gateway</option>
                    <option value="tracker">Tracker</option>
                    <option value="smart_meter">Smart Meter</option>
                    <option value="camera">Camera</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <select
                    value={iotForm.provider_id}
                    onChange={(e) => setIotForm({ ...iotForm, provider_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {providers.map(([id, provider]) => (
                      <option key={id} value={id}>{provider.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber ID</label>
                <input
                  type="text"
                  required
                  value={iotForm.subscriber_id}
                  onChange={(e) => setIotForm({ ...iotForm, subscriber_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter subscriber ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Security Profile</label>
                <select
                  value={iotForm.security_profile}
                  onChange={(e) => setIotForm({ ...iotForm, security_profile: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="standard">Standard</option>
                  <option value="enhanced">Enhanced</option>
                  <option value="critical">Critical Infrastructure</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowIotModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Register Device
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelecomIntegration;
