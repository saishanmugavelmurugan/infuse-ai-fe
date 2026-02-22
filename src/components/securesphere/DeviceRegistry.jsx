import React, { useState, useEffect } from 'react';
import {
  Smartphone, Tablet, Laptop, Monitor, Plus, Trash2, Shield,
  CheckCircle, AlertTriangle, XCircle, RefreshCw, Settings,
  ChevronDown, ChevronUp, Search, Filter, MoreVertical
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const DeviceRegistry = () => {
  const { t } = useLanguage();
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');

  const [registerForm, setRegisterForm] = useState({
    user_id: 'demo-user-001',
    device_name: '',
    platform: 'android',
    os_version: '',
    device_model: '',
    device_manufacturer: '',
    biometric_enabled: false,
    encryption_enabled: true,
    screen_lock_enabled: true
  });

  useEffect(() => {
    fetchDevices();
    fetchStats();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/securesphere/devices/user/demo-user-001`);
      const data = await response.json();
      setDevices(data.devices || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/securesphere/devices/stats/overview`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const registerDevice = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/securesphere/devices/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await response.json();
      if (response.ok) {
        setShowRegisterModal(false);
        fetchDevices();
        fetchStats();
        setRegisterForm({
          user_id: 'demo-user-001',
          device_name: '',
          platform: 'android',
          os_version: '',
          device_model: '',
          device_manufacturer: '',
          biometric_enabled: false,
          encryption_enabled: true,
          screen_lock_enabled: true
        });
      }
    } catch (error) {
      console.error('Error registering device:', error);
    }
  };

  const deregisterDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to remove this device?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/securesphere/devices/${deviceId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchDevices();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deregistering device:', error);
    }
  };

  const getDeviceIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'ios':
      case 'android':
        return Smartphone;
      case 'tablet':
      case 'ipad':
        return Tablet;
      case 'macos':
      case 'windows':
        return Laptop;
      default:
        return Monitor;
    }
  };

  const getTrustLevelBadge = (level) => {
    const badges = {
      verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      trusted: { color: 'bg-blue-100 text-blue-800', icon: Shield },
      new: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      compromised: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    return badges[level] || badges.new;
  };

  const getSecurityScore = (device) => {
    let score = 50;
    if (device.security_features?.encryption_enabled) score += 20;
    if (device.security_features?.biometric_enabled) score += 15;
    if (device.security_features?.screen_lock_enabled) score += 15;
    return Math.min(score, 100);
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.device_model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || device.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Device Registry</h2>
          <p className="text-gray-600">Manage and monitor your registered devices</p>
        </div>
        <Button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="h-4 w-4" />
          Register Device
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total_devices || 0}</p>
                <p className="text-xs text-gray-500">Total Devices</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.by_trust_level?.trusted || 0) + (stats.by_trust_level?.verified || 0)}
                </p>
                <p className="text-xs text-gray-500">Trusted</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.by_trust_level?.new || 0}</p>
                <p className="text-xs text-gray-500">Pending Review</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.by_security_posture?.secure || 0}
                </p>
                <p className="text-xs text-gray-500">Secure</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        >
          <option value="all">All Platforms</option>
          <option value="android">Android</option>
          <option value="ios">iOS</option>
          <option value="windows">Windows</option>
          <option value="macos">macOS</option>
        </select>
        <Button variant="outline" onClick={() => { fetchDevices(); fetchStats(); }}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Devices List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-cyan-600 mx-auto" />
            <p className="text-gray-500 mt-2">Loading devices...</p>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="p-8 text-center">
            <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No devices found</h3>
            <p className="text-gray-500 mt-1">Register your first device to get started</p>
            <Button
              onClick={() => setShowRegisterModal(true)}
              className="mt-4 bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Register Device
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {filteredDevices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.platform);
              const trustBadge = getTrustLevelBadge(device.trust_level);
              const TrustIcon = trustBadge.icon;
              const securityScore = getSecurityScore(device);
              
              return (
                <div
                  key={device.device_id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        device.platform === 'ios' ? 'bg-gray-100' :
                        device.platform === 'android' ? 'bg-green-100' :
                        'bg-blue-100'
                      }`}>
                        <DeviceIcon className={`h-6 w-6 ${
                          device.platform === 'ios' ? 'text-gray-600' :
                          device.platform === 'android' ? 'text-green-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{device.device_name}</h4>
                        <p className="text-sm text-gray-500">
                          {device.device_manufacturer} {device.device_model} • {device.platform} {device.os_version}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Security Score */}
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              securityScore >= 80 ? 'bg-green-500' :
                              securityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${securityScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{securityScore}%</span>
                      </div>
                      
                      {/* Trust Level Badge */}
                      <span className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trustBadge.color}`}>
                        <TrustIcon className="h-3 w-3" />
                        {device.trust_level}
                      </span>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDevice(selectedDevice === device.device_id ? null : device.device_id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {selectedDevice === device.device_id ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() => deregisterDevice(device.device_id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {selectedDevice === device.device_id && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Device ID</p>
                        <p className="text-sm font-mono text-gray-700">{device.device_id?.slice(0, 8)}...</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Registered</p>
                        <p className="text-sm text-gray-700">
                          {device.registered_at ? new Date(device.registered_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Last Seen</p>
                        <p className="text-sm text-gray-700">
                          {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Threat Score</p>
                        <p className={`text-sm font-medium ${
                          device.latest_threat_score <= 30 ? 'text-green-600' :
                          device.latest_threat_score <= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {device.latest_threat_score || 50}
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-4">
                        <p className="text-xs text-gray-500 uppercase mb-2">Security Features</p>
                        <div className="flex flex-wrap gap-2">
                          {device.security_features?.encryption_enabled && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              🔒 Encryption
                            </span>
                          )}
                          {device.security_features?.biometric_enabled && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              👆 Biometric
                            </span>
                          )}
                          {device.security_features?.screen_lock_enabled && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              🔐 Screen Lock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Register Device Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Register New Device</h3>
              <p className="text-sm text-gray-500 mt-1">Add a device to SecureSphere protection</p>
            </div>
            
            <form onSubmit={registerDevice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., My iPhone 15"
                  value={registerForm.device_name}
                  onChange={(e) => setRegisterForm({ ...registerForm, device_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select
                    value={registerForm.platform}
                    onChange={(e) => setRegisterForm({ ...registerForm, platform: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="android">Android</option>
                    <option value="ios">iOS</option>
                    <option value="windows">Windows</option>
                    <option value="macos">macOS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OS Version</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 17.2"
                    value={registerForm.os_version}
                    onChange={(e) => setRegisterForm({ ...registerForm, os_version: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g., Apple"
                    value={registerForm.device_manufacturer}
                    onChange={(e) => setRegisterForm({ ...registerForm, device_manufacturer: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="e.g., iPhone 15 Pro"
                    value={registerForm.device_model}
                    onChange={(e) => setRegisterForm({ ...registerForm, device_model: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Security Features</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={registerForm.encryption_enabled}
                      onChange={(e) => setRegisterForm({ ...registerForm, encryption_enabled: e.target.checked })}
                      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Device Encryption Enabled</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={registerForm.biometric_enabled}
                      onChange={(e) => setRegisterForm({ ...registerForm, biometric_enabled: e.target.checked })}
                      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Biometric Authentication</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={registerForm.screen_lock_enabled}
                      onChange={(e) => setRegisterForm({ ...registerForm, screen_lock_enabled: e.target.checked })}
                      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Screen Lock Enabled</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
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

export default DeviceRegistry;
