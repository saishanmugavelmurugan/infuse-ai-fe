import React, { useState, useEffect } from 'react';
import {
  Camera, Zap, Car, Plus, RefreshCw, Shield, AlertTriangle, CheckCircle,
  Activity, Wifi, MapPin, Eye, Trash2, Search, Filter, Settings,
  Video, Droplet, Flame, Sun, Battery, Factory, Globe, Navigation,
  Truck, Bus, Radio, Signal, Clock, HardDrive, Cloud, Play, Pause,
  ChevronRight, XCircle, BarChart3, TrendingUp, AlertCircle, Radar,
  Network, Bug, Lock, Unlock, Download, Upload, Server, Database
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

const SurveillanceIoTDashboard = () => {
  // Get user from auth context
  const { user } = useAuth() || {};
  const ownerId = getOwnerId(user);
  
  const [activeTab, setActiveTab] = useState('devices');
  const [activeCategory, setActiveCategory] = useState('cameras');
  const [devices, setDevices] = useState([]);
  const [overview, setOverview] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);
  const [netflowStats, setNetflowStats] = useState(null);
  
  // New state for enhanced features
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [trafficPatterns, setTrafficPatterns] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [botnetStatus, setBotnetStatus] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState(null);
  const [collectorStatus, setCollectorStatus] = useState(null);

  // Category configurations
  const categories = [
    {
      id: 'cameras',
      name: 'Cameras & CCTV',
      icon: Camera,
      color: 'blue',
      description: 'IP cameras, CCTV systems, security cameras'
    },
    {
      id: 'smart_meters',
      name: 'Smart Meters',
      icon: Zap,
      color: 'yellow',
      description: 'Electricity, water, and gas meters'
    },
    {
      id: 'dashcams',
      name: 'Dashcams',
      icon: Car,
      color: 'green',
      description: 'Vehicle dashboard cameras'
    }
  ];

  // Registration form state - uses dynamic owner ID
  const [registerForm, setRegisterForm] = useState({
    // Common fields
    device_name: '',
    device_type: '',
    manufacturer: '',
    model: '',
    firmware_version: '1.0.0',
    location: '',
    // Camera specific
    ip_address: '',
    mac_address: '',
    resolution: '1080p',
    has_night_vision: true,
    has_ptz: false,
    has_audio: true,
    stream_protocol: 'rtsp',
    // Smart meter specific
    meter_id: '',
    communication_type: 'nb_iot',
    reading_interval_minutes: 15,
    utility_provider: '',
    // Dashcam specific
    vehicle_id: '',
    vehicle_type: 'car',
    license_plate: '',
    sim_iccid: '',
    has_gps: true,
    has_cloud_backup: true,
    storage_gb: 64
  });

  const deviceTypeOptions = {
    cameras: [
      { id: 'ip_camera', name: 'IP Camera', icon: Camera },
      { id: 'cctv', name: 'CCTV System', icon: Video },
      { id: 'ptz_camera', name: 'PTZ Camera', icon: Eye },
      { id: 'dome_camera', name: 'Dome Camera', icon: Globe },
      { id: 'bullet_camera', name: 'Bullet Camera', icon: Camera },
      { id: 'thermal_camera', name: 'Thermal Camera', icon: Activity },
      { id: 'doorbell_camera', name: 'Doorbell Camera', icon: Camera },
      { id: 'body_camera', name: 'Body Camera', icon: Camera }
    ],
    smart_meters: [
      { id: 'electricity_meter', name: 'Electricity Meter', icon: Zap },
      { id: 'water_meter', name: 'Water Meter', icon: Droplet },
      { id: 'gas_meter', name: 'Gas Meter', icon: Flame },
      { id: 'solar_meter', name: 'Solar Meter', icon: Sun },
      { id: 'ev_charger_meter', name: 'EV Charger Meter', icon: Battery },
      { id: 'industrial_meter', name: 'Industrial Meter', icon: Factory }
    ],
    dashcams: [
      { id: 'front_dashcam', name: 'Front Dashcam', icon: Car },
      { id: 'dual_dashcam', name: 'Dual Channel Dashcam', icon: Video },
      { id: 'fleet_camera', name: 'Fleet Camera', icon: Truck },
      { id: '360_dashcam', name: '360° Dashcam', icon: Globe },
      { id: 'taxi_camera', name: 'Taxi/Ride Camera', icon: Navigation },
      { id: 'bus_camera', name: 'Bus/Transit Camera', icon: Bus }
    ]
  };

  const manufacturers = {
    cameras: ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Hanwha', 'Uniview', 'Vivotek', 'Pelco', 'Sony', 'Panasonic'],
    smart_meters: ['Itron', 'Landis+Gyr', 'Honeywell', 'Kamstrup', 'Sensus', 'Elster', 'Secure Meters', 'HPL', 'Genus Power'],
    dashcams: ['Viofo', 'Thinkware', 'BlackVue', 'Garmin', 'Nextbase', 'Vantrue', 'VAVA', 'Rexing', 'REDTIGER']
  };

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, devicesRes, alertsRes] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/surveillance-iot/dashboard/overview`),
        fetch(`${API_URL}/api/securesphere/surveillance-iot/devices?category=${activeCategory}`),
        fetch(`${API_URL}/api/securesphere/surveillance-iot/alerts?status=active`)
      ]);

      const overviewData = await overviewRes.json();
      const devicesData = await devicesRes.json();
      const alertsData = await alertsRes.json();

      setOverview(overviewData);
      setDevices(devicesData.devices || []);
      setAlerts(alertsData.alerts || []);

      // Fetch category-specific data
      const categoryRes = await fetch(`${API_URL}/api/securesphere/surveillance-iot/dashboard/category/${activeCategory}`);
      const categoryData = await categoryRes.json();
      setCategoryData(categoryData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerDevice = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '';
      let payload = {};

      if (activeCategory === 'cameras') {
        endpoint = `${API_URL}/api/securesphere/surveillance-iot/cameras/register`;
        payload = {
          device_name: registerForm.device_name,
          device_type: registerForm.device_type,
          manufacturer: registerForm.manufacturer,
          model: registerForm.model,
          ip_address: registerForm.ip_address,
          mac_address: registerForm.mac_address,
          location: registerForm.location,
          resolution: registerForm.resolution,
          has_night_vision: registerForm.has_night_vision,
          has_ptz: registerForm.has_ptz,
          has_audio: registerForm.has_audio,
          stream_protocol: registerForm.stream_protocol,
          firmware_version: registerForm.firmware_version,
          owner_id: ownerId
        };
      } else if (activeCategory === 'smart_meters') {
        endpoint = `${API_URL}/api/securesphere/surveillance-iot/smart-meters/register`;
        payload = {
          device_name: registerForm.device_name,
          device_type: registerForm.device_type,
          manufacturer: registerForm.manufacturer,
          model: registerForm.model,
          meter_id: registerForm.meter_id,
          ip_address: registerForm.ip_address,
          location: registerForm.location,
          communication_type: registerForm.communication_type,
          reading_interval_minutes: registerForm.reading_interval_minutes,
          firmware_version: registerForm.firmware_version,
          utility_provider: registerForm.utility_provider,
          owner_id: ownerId
        };
      } else if (activeCategory === 'dashcams') {
        endpoint = `${API_URL}/api/securesphere/surveillance-iot/dashcams/register`;
        payload = {
          device_name: registerForm.device_name,
          device_type: registerForm.device_type,
          manufacturer: registerForm.manufacturer,
          model: registerForm.model,
          vehicle_id: registerForm.vehicle_id,
          vehicle_type: registerForm.vehicle_type,
          license_plate: registerForm.license_plate,
          sim_iccid: registerForm.sim_iccid,
          resolution: registerForm.resolution,
          has_gps: registerForm.has_gps,
          has_cloud_backup: registerForm.has_cloud_backup,
          storage_gb: registerForm.storage_gb,
          firmware_version: registerForm.firmware_version,
          owner_id: ownerId
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowRegisterModal(false);
        fetchData();
        resetForm();
      }
    } catch (error) {
      console.error('Error registering device:', error);
    }
  };

  const resetForm = () => {
    setRegisterForm({
      device_name: '',
      device_type: '',
      manufacturer: '',
      model: '',
      firmware_version: '1.0.0',
      location: '',
      ip_address: '',
      mac_address: '',
      resolution: '1080p',
      has_night_vision: true,
      has_ptz: false,
      has_audio: true,
      stream_protocol: 'rtsp',
      meter_id: '',
      communication_type: 'nb_iot',
      reading_interval_minutes: 15,
      utility_provider: '',
      vehicle_id: '',
      vehicle_type: 'car',
      license_plate: '',
      sim_iccid: '',
      has_gps: true,
      has_cloud_backup: true,
      storage_gb: 64
    });
  };

  const viewDeviceDetails = async (device) => {
    setSelectedDevice(device);
    try {
      const [monitoringRes, netflowRes] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/surveillance-iot/monitoring/${device.id}`),
        fetch(`${API_URL}/api/securesphere/surveillance-iot/netflow/stats/${device.id}`)
      ]);
      const monitoringData = await monitoringRes.json();
      const netflowData = await netflowRes.json();
      setMonitoringData(monitoringData);
      setNetflowStats(netflowData);
    } catch (error) {
      console.error('Error fetching device details:', error);
    }
  };

  const scanDevice = async (deviceId) => {
    try {
      const response = await fetch(`${API_URL}/api/securesphere/surveillance-iot/threats/scan/${deviceId}`, {
        method: 'POST'
      });
      const data = await response.json();
      alert(`Scan complete: ${data.threats_found} threats found`);
      fetchData();
    } catch (error) {
      console.error('Error scanning device:', error);
    }
  };

  const deleteDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;
    try {
      await fetch(`${API_URL}/api/securesphere/surveillance-iot/devices/${deviceId}`, {
        method: 'DELETE'
      });
      fetchData();
      setSelectedDevice(null);
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  // New functions for auto-discovery and NetFlow
  const startNetworkScan = async (scanType = 'quick') => {
    setIsScanning(true);
    try {
      const response = await fetch(`${API_URL}/api/securesphere/surveillance-iot/discovery/scan?scan_type=${scanType}`, {
        method: 'POST'
      });
      const data = await response.json();
      setScanResults(data);
    } catch (error) {
      console.error('Error scanning network:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const registerDiscoveredDevice = async (scanId, deviceIp, deviceName, location) => {
    try {
      const response = await fetch(
        `${API_URL}/api/securesphere/surveillance-iot/discovery/register-discovered?scan_id=${scanId}&device_ip=${deviceIp}&device_name=${encodeURIComponent(deviceName)}&location=${encodeURIComponent(location)}&owner_id=${encodeURIComponent(ownerId)}`,
        { method: 'POST' }
      );
      const data = await response.json();
      alert(`Device registered: ${data.device_name}`);
      fetchData();
    } catch (error) {
      console.error('Error registering device:', error);
    }
  };

  const fetchNetFlowData = async () => {
    try {
      const [anomaliesRes, botnetRes, vulnsRes, collectorRes] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/surveillance-iot/netflow/anomalies`),
        fetch(`${API_URL}/api/securesphere/surveillance-iot/netflow/botnet-detection`),
        fetch(`${API_URL}/api/securesphere/surveillance-iot/netflow/firmware-vulnerabilities`),
        fetch(`${API_URL}/api/securesphere/surveillance-iot/collector/status`)
      ]);
      
      setAnomalies(await anomaliesRes.json());
      setBotnetStatus(await botnetRes.json());
      setVulnerabilities(await vulnsRes.json());
      setCollectorStatus(await collectorRes.json());
    } catch (error) {
      console.error('Error fetching NetFlow data:', error);
    }
  };

  const fetchTrafficPatterns = async (deviceId) => {
    try {
      const response = await fetch(`${API_URL}/api/securesphere/surveillance-iot/netflow/traffic-patterns/${deviceId}`);
      const data = await response.json();
      setTrafficPatterns(data);
    } catch (error) {
      console.error('Error fetching traffic patterns:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'netflow') {
      fetchNetFlowData();
    }
  }, [activeTab]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category) => {
    const colors = {
      cameras: 'blue',
      smart_meters: 'yellow',
      dashcams: 'green'
    };
    return colors[category] || 'gray';
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'green' : status === 'offline' ? 'red' : 'yellow';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Surveillance IoT Dashboard</h2>
          <p className="text-gray-600">Monitor and protect cameras, smart meters, and dashcams</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setShowRegisterModal(true)} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Camera className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.summary?.cameras || 0}</p>
                <p className="text-xs text-gray-500">Cameras</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.summary?.smart_meters || 0}</p>
                <p className="text-xs text-gray-500">Smart Meters</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Car className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.summary?.dashcams || 0}</p>
                <p className="text-xs text-gray-500">Dashcams</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.summary?.online || 0}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.security?.active_alerts || 0}</p>
                <p className="text-xs text-gray-500">Active Alerts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.security?.average_score || 100}</p>
                <p className="text-xs text-gray-500">Security Score</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg whitespace-nowrap transition-all ${
            activeTab === 'devices' ? 'bg-orange-100 text-orange-700 border-b-2 border-orange-500' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Camera className="h-4 w-4" />
          <span className="font-medium text-sm">Devices</span>
        </button>
        <button
          onClick={() => setActiveTab('discovery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg whitespace-nowrap transition-all ${
            activeTab === 'discovery' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Radar className="h-4 w-4" />
          <span className="font-medium text-sm">Auto-Discovery</span>
        </button>
        <button
          onClick={() => setActiveTab('netflow')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg whitespace-nowrap transition-all ${
            activeTab === 'netflow' ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-500' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Network className="h-4 w-4" />
          <span className="font-medium text-sm">NetFlow Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg whitespace-nowrap transition-all ${
            activeTab === 'security' ? 'bg-red-100 text-red-700 border-b-2 border-red-500' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Bug className="h-4 w-4" />
          <span className="font-medium text-sm">Vulnerabilities</span>
        </button>
      </div>

      {/* DEVICES TAB */}
      {activeTab === 'devices' && (
        <>
          {/* Category Tabs */}
          <div className="flex gap-4 border-b overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? `bg-${cat.color}-100 text-${cat.color}-700 border-b-2 border-${cat.color}-500`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <cat.icon className="h-5 w-5" />
                <span className="font-medium">{cat.name}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeCategory === cat.id ? `bg-${cat.color}-200` : 'bg-gray-200'
                }`}>
                  {overview?.summary?.[cat.id] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {categories.find(c => c.id === activeCategory)?.name} ({devices.length})
            </h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search devices..."
                  className="pl-9 pr-4 py-2 border rounded-lg text-sm w-48"
                />
              </div>
            </div>
          </div>

          {devices.length === 0 ? (
            <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {React.createElement(categories.find(c => c.id === activeCategory)?.icon || Camera, {
                  className: "h-8 w-8 text-gray-400"
                })}
              </div>
              <h4 className="font-medium text-gray-700 mb-2">No {categories.find(c => c.id === activeCategory)?.name} registered</h4>
              <p className="text-sm text-gray-500 mb-4">Add your first device to start monitoring</p>
              <Button onClick={() => setShowRegisterModal(true)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => viewDeviceDetails(device)}
                  className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all ${
                    selectedDevice?.id === device.id ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${getCategoryColor(device.category)}-100 rounded-lg`}>
                        {React.createElement(
                          deviceTypeOptions[device.category]?.find(t => t.id === device.device_type)?.icon || Camera,
                          { className: `h-5 w-5 text-${getCategoryColor(device.category)}-600` }
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{device.device_name}</h4>
                        <p className="text-xs text-gray-500">{device.manufacturer} {device.model}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      device.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {device.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-gray-700 truncate">{device.location || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Security Score</p>
                      <p className={`font-medium ${
                        device.security_score >= 80 ? 'text-green-600' :
                        device.security_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{device.security_score || 100}/100</p>
                    </div>
                    {device.category === 'cameras' && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500">Resolution</p>
                          <p className="text-gray-700">{device.resolution}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Stream</p>
                          <p className="text-gray-700 uppercase">{device.stream_protocol}</p>
                        </div>
                      </>
                    )}
                    {device.category === 'smart_meters' && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500">Reading</p>
                          <p className="text-gray-700">{device.current_reading} {device.reading_unit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Communication</p>
                          <p className="text-gray-700 uppercase">{device.communication_type?.replace('_', ' ')}</p>
                        </div>
                      </>
                    )}
                    {device.category === 'dashcams' && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500">Vehicle</p>
                          <p className="text-gray-700">{device.license_plate || device.vehicle_id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Storage</p>
                          <p className="text-gray-700">{device.storage_used_percent}% used</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Wifi className="h-3 w-3" />
                      <span>{formatBytes(device.bytes_in_24h || 0)}/24h</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); scanDevice(device.id); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Scan for threats"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteDevice(device.id); }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete device"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Details / Alerts Panel */}
        <div className="space-y-4">
          {selectedDevice && monitoringData ? (
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Device Details</h3>
                <button onClick={() => setSelectedDevice(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    monitoringData.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {monitoringData.status}
                  </span>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{monitoringData.health_score}</p>
                    <p className="text-xs text-blue-600">Health Score</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">{monitoringData.security_score}</p>
                    <p className="text-xs text-purple-600">Security Score</p>
                  </div>
                </div>

                {/* System Resources */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">System Resources</p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>CPU</span>
                        <span>{monitoringData.cpu_usage_percent}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${monitoringData.cpu_usage_percent}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Memory</span>
                        <span>{monitoringData.memory_usage_percent}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${monitoringData.memory_usage_percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network Stats */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Network (24h)</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">↓ Download</p>
                      <p className="font-medium">{formatBytes(monitoringData.network?.bytes_in_24h || 0)}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">↑ Upload</p>
                      <p className="font-medium">{formatBytes(monitoringData.network?.bytes_out_24h || 0)}</p>
                    </div>
                  </div>
                </div>

                {/* Category Specific Data */}
                {monitoringData.camera_specific && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Camera Status</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        {monitoringData.camera_specific.recording_status === 'recording' ? (
                          <Play className="h-4 w-4 text-red-500" />
                        ) : (
                          <Pause className="h-4 w-4 text-gray-400" />
                        )}
                        <span>{monitoringData.camera_specific.recording_status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-gray-500" />
                        <span>{monitoringData.camera_specific.fps} FPS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Signal className="h-4 w-4 text-gray-500" />
                        <span>{monitoringData.camera_specific.bitrate_kbps} kbps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-gray-500" />
                        <span>{monitoringData.camera_specific.storage_days_remaining}d storage</span>
                      </div>
                    </div>
                  </div>
                )}

                {monitoringData.meter_specific && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Meter Status</p>
                    <div className="p-3 bg-yellow-50 rounded-lg text-center mb-2">
                      <p className="text-3xl font-bold text-yellow-700">
                        {monitoringData.meter_specific.current_reading}
                      </p>
                      <p className="text-sm text-yellow-600">{monitoringData.meter_specific.reading_unit}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Signal className="h-4 w-4 text-gray-500" />
                        <span>{monitoringData.meter_specific.signal_strength_dbm} dBm</span>
                      </div>
                      {monitoringData.meter_specific.battery_level_percent && (
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-gray-500" />
                          <span>{monitoringData.meter_specific.battery_level_percent}%</span>
                        </div>
                      )}
                    </div>
                    {monitoringData.meter_specific.tamper_detected && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-red-700 text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Tamper detected!
                      </div>
                    )}
                  </div>
                )}

                {monitoringData.dashcam_specific && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Dashcam Status</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        {monitoringData.dashcam_specific.recording_status === 'recording' ? (
                          <Play className="h-4 w-4 text-red-500" />
                        ) : (
                          <Pause className="h-4 w-4 text-gray-400" />
                        )}
                        <span>{monitoringData.dashcam_specific.recording_status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-gray-500" />
                        <span>{monitoringData.dashcam_specific.storage_used_percent}% used</span>
                      </div>
                      {monitoringData.dashcam_specific.vehicle_speed_kmh !== null && (
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-gray-500" />
                          <span>{monitoringData.dashcam_specific.vehicle_speed_kmh} km/h</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4 text-gray-500" />
                        <span>{monitoringData.dashcam_specific.cloud_sync_status}</span>
                      </div>
                    </div>
                    {monitoringData.dashcam_specific.gps_location && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                        <div className="flex items-center gap-2 text-green-700">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {monitoringData.dashcam_specific.gps_location.lat.toFixed(4)}, 
                            {monitoringData.dashcam_specific.gps_location.lng.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Alerts Panel */
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Active Alerts</h3>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-300" />
                  <p>No active alerts</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                      alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                      alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{alert.alert_type?.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-gray-600">{alert.details}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          alert.severity === 'critical' ? 'bg-red-200 text-red-700' :
                          alert.severity === 'high' ? 'bg-orange-200 text-orange-700' :
                          'bg-yellow-200 text-yellow-700'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Stats */}
          {categoryData && (
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Category Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Online</span>
                  <span className="font-medium text-green-600">{categoryData.statistics?.online || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Offline</span>
                  <span className="font-medium text-red-600">{categoryData.statistics?.offline || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Health</span>
                  <span className="font-medium">{categoryData.statistics?.average_health_score || 100}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Alerts</span>
                  <span className="font-medium text-orange-600">{categoryData.statistics?.total_alerts || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
        </>
      )}

      {/* AUTO-DISCOVERY TAB */}
      {activeTab === 'discovery' && (
        <div className="space-y-6">
          {/* Scan Controls */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Radar className="h-5 w-5 text-blue-500" />
                  Network Auto-Discovery
                </h3>
                <p className="text-sm text-gray-600">Scan your network to automatically discover IoT devices</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => startNetworkScan('quick')}
                  disabled={isScanning}
                >
                  {isScanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="ml-2">Quick Scan</span>
                </Button>
                <Button 
                  onClick={() => startNetworkScan('deep')}
                  disabled={isScanning}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Radar className="h-4 w-4 mr-2" />
                  Deep Scan
                </Button>
              </div>
            </div>

            {isScanning && (
              <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                <span className="text-blue-700">Scanning network for IoT devices...</span>
              </div>
            )}
          </div>

          {/* Scan Results */}
          {scanResults && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Discovered Devices ({scanResults.devices_found})
                </h3>
                <div className="flex gap-2 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {scanResults.summary?.cameras || 0} Cameras
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                    {scanResults.summary?.smart_meters || 0} Meters
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                    {scanResults.summary?.with_security_issues || 0} With Issues
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {scanResults.devices?.map((device) => (
                  <div key={device.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${device.category === 'cameras' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                          {device.category === 'cameras' ? 
                            <Camera className="h-5 w-5 text-blue-600" /> : 
                            <Zap className="h-5 w-5 text-yellow-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{device.manufacturer} {device.model}</p>
                          <p className="text-sm text-gray-600">{device.ip_address} • {device.mac_address}</p>
                          <div className="flex gap-2 mt-1">
                            {device.open_ports?.map(port => (
                              <span key={port} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                Port {port}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {device.security_issues?.length > 0 ? (
                          <div className="mb-2">
                            {device.security_issues.map((issue, idx) => (
                              <span key={idx} className={`text-xs px-2 py-0.5 rounded mr-1 ${
                                issue.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                issue.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {issue.type.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 mb-2 inline-block">
                            No issues
                          </span>
                        )}
                        <Button 
                          size="sm"
                          onClick={() => {
                            const name = prompt('Enter device name:', `${device.manufacturer} ${device.device_type}`);
                            const location = prompt('Enter location:', 'Main Building');
                            if (name && location) {
                              registerDiscoveredDevice(scanResults.scan_id, device.ip_address, name, location);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Register
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!scanResults && !isScanning && (
            <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
              <Radar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h4 className="font-medium text-gray-700 mb-2">No scan results yet</h4>
              <p className="text-sm text-gray-500 mb-4">Run a network scan to discover IoT devices automatically</p>
            </div>
          )}
        </div>
      )}

      {/* NETFLOW ANALYTICS TAB */}
      {activeTab === 'netflow' && (
        <div className="space-y-6">
          {/* Collector Status */}
          {collectorStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collectorStatus.collectors?.map((collector, idx) => (
                <div key={idx} className="bg-white rounded-xl border shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Server className={`h-5 w-5 ${collector.status === 'active' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="font-medium">{collector.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      collector.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {collector.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Type</p>
                      <p className="font-medium uppercase">{collector.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">IP:Port</p>
                      <p className="font-medium">{collector.ip}:{collector.port}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">{collector.type === 'sflow' ? 'Samples/s' : 'Flows/s'}</p>
                      <p className="font-medium">{collector.type === 'sflow' ? collector.samples_per_second : collector.flows_per_second}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Anomalies */}
          {anomalies && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Traffic Anomalies ({anomalies.total_anomalies})
              </h3>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                  Critical: {anomalies.by_severity?.critical || 0}
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                  High: {anomalies.by_severity?.high || 0}
                </span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                  Medium: {anomalies.by_severity?.medium || 0}
                </span>
              </div>
              <div className="space-y-2">
                {anomalies.anomalies?.slice(0, 5).map((anomaly) => (
                  <div key={anomaly.id} className={`p-3 rounded-lg border-l-4 ${
                    anomaly.severity === 'critical' ? 'bg-red-50 border-red-500' :
                    anomaly.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                    'bg-yellow-50 border-yellow-500'
                  }`}>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-sm">{anomaly.type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-600">{anomaly.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {anomaly.details?.source_ip} → {anomaly.details?.dest_ip} • {formatBytes(anomaly.details?.bytes_involved || 0)}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 h-fit rounded text-xs ${
                        anomaly.status === 'active' ? 'bg-red-200 text-red-700' :
                        anomaly.status === 'investigating' ? 'bg-yellow-200 text-yellow-700' :
                        'bg-green-200 text-green-700'
                      }`}>
                        {anomaly.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botnet Detection */}
          {botnetStatus && (
            <div className={`bg-white rounded-xl border shadow-sm p-6 ${
              botnetStatus.botnet_detected ? 'border-red-300' : ''
            }`}>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-500" />
                Botnet Detection
              </h3>
              {botnetStatus.botnet_detected ? (
                <div className="space-y-3">
                  {botnetStatus.detections?.map((detection, idx) => (
                    <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="font-bold text-red-700">{detection.botnet_family.toUpperCase()} Detected</span>
                        <span className="px-2 py-0.5 bg-red-200 text-red-800 rounded text-xs">
                          {detection.risk_level}
                        </span>
                      </div>
                      <p className="text-sm text-red-600 mb-2">
                        {detection.indicators_found} indicators found • {detection.affected_devices} devices affected
                      </p>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-red-800 mb-1">Recommended Actions:</p>
                        <ul className="text-xs text-red-700 space-y-1">
                          {detection.recommended_actions?.map((action, i) => (
                            <li key={i}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium text-green-700">No Botnet Activity Detected</p>
                    <p className="text-sm text-green-600">{botnetStatus.devices_scanned} devices scanned</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VULNERABILITIES TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Firmware Vulnerabilities</h3>
            <Button variant="outline" onClick={fetchNetFlowData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Scan
            </Button>
          </div>

          {vulnerabilities && (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900">{vulnerabilities.devices_checked}</p>
                  <p className="text-sm text-gray-500">Devices Checked</p>
                </div>
                <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
                  <p className="text-3xl font-bold text-orange-600">{vulnerabilities.devices_vulnerable}</p>
                  <p className="text-sm text-gray-500">Vulnerable</p>
                </div>
                <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{vulnerabilities.total_vulnerabilities}</p>
                  <p className="text-sm text-gray-500">Total CVEs</p>
                </div>
                <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
                  <p className="text-3xl font-bold text-red-700">{vulnerabilities.critical_count}</p>
                  <p className="text-sm text-gray-500">Critical</p>
                </div>
              </div>

              {/* Vulnerable Devices */}
              <div className="space-y-4">
                {vulnerabilities.vulnerabilities?.map((device) => (
                  <div key={device.device_id} className="bg-white rounded-xl border shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{device.device_name}</p>
                        <p className="text-sm text-gray-500">{device.manufacturer} • Firmware: {device.current_firmware}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          device.risk_score >= 70 ? 'bg-red-100 text-red-700' :
                          device.risk_score >= 40 ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          Risk: {device.risk_score}/100
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {device.vulnerabilities?.map((vuln, idx) => (
                        <div key={idx} className={`p-3 rounded-lg ${
                          vuln.severity === 'critical' ? 'bg-red-50' :
                          vuln.severity === 'high' ? 'bg-orange-50' : 'bg-yellow-50'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-mono text-sm font-medium">{vuln.cve}</p>
                              <p className="text-sm text-gray-600">{vuln.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                vuln.severity === 'critical' ? 'bg-red-200 text-red-700' :
                                vuln.severity === 'high' ? 'bg-orange-200 text-orange-700' :
                                'bg-yellow-200 text-yellow-700'
                              }`}>
                                {vuln.severity}
                              </span>
                              {vuln.patch_available && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                  Patch Available
                                </span>
                              )}
                              {vuln.exploited_in_wild && (
                                <span className="px-2 py-0.5 bg-red-200 text-red-700 rounded text-xs">
                                  Active Exploit
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {vulnerabilities.vulnerabilities?.length === 0 && (
                  <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-300" />
                    <h4 className="font-medium text-gray-700 mb-2">No vulnerabilities detected</h4>
                    <p className="text-sm text-gray-500">All devices have up-to-date firmware</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Add {categories.find(c => c.id === activeCategory)?.name.slice(0, -1)}
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={registerDevice} className="p-6 space-y-6">
              {/* Common Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Name *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.device_name}
                    onChange={(e) => setRegisterForm({ ...registerForm, device_name: e.target.value })}
                    placeholder={activeCategory === 'cameras' ? 'e.g., Front Gate Camera' :
                      activeCategory === 'smart_meters' ? 'e.g., Main Electricity Meter' : 'e.g., Fleet Vehicle 001'}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Type *</label>
                  <select
                    required
                    value={registerForm.device_type}
                    onChange={(e) => setRegisterForm({ ...registerForm, device_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select type...</option>
                    {deviceTypeOptions[activeCategory]?.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
                  <select
                    required
                    value={registerForm.manufacturer}
                    onChange={(e) => setRegisterForm({ ...registerForm, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select manufacturer...</option>
                    {manufacturers[activeCategory]?.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.model}
                    onChange={(e) => setRegisterForm({ ...registerForm, model: e.target.value })}
                    placeholder="e.g., Pro 4K"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={registerForm.location}
                  onChange={(e) => setRegisterForm({ ...registerForm, location: e.target.value })}
                  placeholder="e.g., Building A, Floor 2, Room 201"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Camera-specific fields */}
              {activeCategory === 'cameras' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IP Address *</label>
                      <input
                        type="text"
                        required
                        value={registerForm.ip_address}
                        onChange={(e) => setRegisterForm({ ...registerForm, ip_address: e.target.value })}
                        placeholder="192.168.1.100"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">MAC Address</label>
                      <input
                        type="text"
                        value={registerForm.mac_address}
                        onChange={(e) => setRegisterForm({ ...registerForm, mac_address: e.target.value })}
                        placeholder="AA:BB:CC:DD:EE:FF"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                      <select
                        value={registerForm.resolution}
                        onChange={(e) => setRegisterForm({ ...registerForm, resolution: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="720p">720p HD</option>
                        <option value="1080p">1080p Full HD</option>
                        <option value="2k">2K QHD</option>
                        <option value="4k">4K Ultra HD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stream Protocol</label>
                      <select
                        value={registerForm.stream_protocol}
                        onChange={(e) => setRegisterForm({ ...registerForm, stream_protocol: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="rtsp">RTSP</option>
                        <option value="onvif">ONVIF</option>
                        <option value="http">HTTP</option>
                        <option value="rtmp">RTMP</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={registerForm.has_night_vision}
                        onChange={(e) => setRegisterForm({ ...registerForm, has_night_vision: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Night Vision</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={registerForm.has_ptz}
                        onChange={(e) => setRegisterForm({ ...registerForm, has_ptz: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">PTZ Control</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={registerForm.has_audio}
                        onChange={(e) => setRegisterForm({ ...registerForm, has_audio: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Audio</span>
                    </label>
                  </div>
                </>
              )}

              {/* Smart Meter-specific fields */}
              {activeCategory === 'smart_meters' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meter ID *</label>
                      <input
                        type="text"
                        required
                        value={registerForm.meter_id}
                        onChange={(e) => setRegisterForm({ ...registerForm, meter_id: e.target.value })}
                        placeholder="e.g., MTR-2024-001"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Communication Type</label>
                      <select
                        value={registerForm.communication_type}
                        onChange={(e) => setRegisterForm({ ...registerForm, communication_type: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="nb_iot">NB-IoT</option>
                        <option value="lora">LoRa</option>
                        <option value="zigbee">Zigbee</option>
                        <option value="cellular">Cellular (4G/5G)</option>
                        <option value="wifi">WiFi</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reading Interval (min)</label>
                      <select
                        value={registerForm.reading_interval_minutes}
                        onChange={(e) => setRegisterForm({ ...registerForm, reading_interval_minutes: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value={5}>Every 5 minutes</option>
                        <option value={15}>Every 15 minutes</option>
                        <option value={30}>Every 30 minutes</option>
                        <option value={60}>Every hour</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Utility Provider</label>
                      <input
                        type="text"
                        value={registerForm.utility_provider}
                        onChange={(e) => setRegisterForm({ ...registerForm, utility_provider: e.target.value })}
                        placeholder="e.g., BSES, Tata Power"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Dashcam-specific fields */}
              {activeCategory === 'dashcams' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle ID *</label>
                      <input
                        type="text"
                        required
                        value={registerForm.vehicle_id}
                        onChange={(e) => setRegisterForm({ ...registerForm, vehicle_id: e.target.value })}
                        placeholder="e.g., VEH-001"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                      <select
                        value={registerForm.vehicle_type}
                        onChange={(e) => setRegisterForm({ ...registerForm, vehicle_type: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="car">Car</option>
                        <option value="truck">Truck</option>
                        <option value="bus">Bus</option>
                        <option value="taxi">Taxi</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="van">Van</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                      <input
                        type="text"
                        value={registerForm.license_plate}
                        onChange={(e) => setRegisterForm({ ...registerForm, license_plate: e.target.value })}
                        placeholder="e.g., DL 01 AB 1234"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Storage (GB)</label>
                      <select
                        value={registerForm.storage_gb}
                        onChange={(e) => setRegisterForm({ ...registerForm, storage_gb: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value={32}>32 GB</option>
                        <option value={64}>64 GB</option>
                        <option value={128}>128 GB</option>
                        <option value={256}>256 GB</option>
                        <option value={512}>512 GB</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={registerForm.has_gps}
                        onChange={(e) => setRegisterForm({ ...registerForm, has_gps: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">GPS Tracking</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={registerForm.has_cloud_backup}
                        onChange={(e) => setRegisterForm({ ...registerForm, has_cloud_backup: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Cloud Backup</span>
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowRegisterModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
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

export default SurveillanceIoTDashboard;
