import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Shield, AlertTriangle, Activity, Download, Server, Lock,
  Wifi, Eye, TrendingUp, AlertCircle, CheckCircle, XCircle,
  Network, Cpu, HardDrive, Zap, Globe, FileText, BarChart3,
  Plus, X, Smartphone, Car, Camera, Tv, Users, Radio
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SEO from '../../components/SEO';
import IoT5GSecurityDashboard from '../../components/securesphere/IoT5GSecurityDashboard';
import SurveillanceIoTDashboard from '../../components/securesphere/SurveillanceIoTDashboard';
import TeamManagement from '../../components/TeamManagement';

// XMLHttpRequest-based request that is immune to rrweb-recorder interference
const xhrRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);
    
    // Set headers
    const headers = options.headers || {};
    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });
    
    xhr.onload = () => {
      let data;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch (e) {
        data = { detail: 'Invalid response' };
      }
      
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ ok: true, data });
      } else {
        resolve({ ok: false, data });
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.ontimeout = () => reject(new Error('Request timeout'));
    xhr.timeout = 30000;
    xhr.send(options.body);
  });
};

const SecureSphere = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [devices, setDevices] = useState([]);
  const [threats, setThreats] = useState([]);
  const [iotEndpoints, setIotEndpoints] = useState([]);
  const [gsmAlerts, setGsmAlerts] = useState([]);
  const [automotiveDevices, setAutomotiveDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [addingDevice, setAddingDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'server',
    ip: '',
    os: '',
    segment: 'enterprise'
  });

  // Mock data for demo
  const mockDevices = [
    { id: 1, name: 'Server-01', type: 'server', ip: '192.168.1.100', status: 'active', os: 'Ubuntu 22.04', lastSeen: '2 min ago', threats: 0 },
    { id: 2, name: 'Router-Main', type: 'router', ip: '192.168.1.1', status: 'active', os: 'RouterOS', lastSeen: '1 min ago', threats: 2 },
    { id: 3, name: 'IoT-Camera-01', type: 'iot', ip: '192.168.1.150', status: 'warning', os: 'Embedded Linux', lastSeen: '5 min ago', threats: 1 },
    { id: 4, name: 'Workstation-05', type: 'workstation', ip: '192.168.1.45', status: 'active', os: 'Windows 11', lastSeen: '30 sec ago', threats: 0 },
    { id: 5, name: 'Smart-Thermostat', type: 'iot', ip: '192.168.1.201', status: 'active', os: 'IoT OS', lastSeen: '1 min ago', threats: 0, gsmData: '2.5GB/5GB' },
    { id: 6, name: 'Vehicle-ECU-Tesla', type: 'automotive', ip: '10.0.0.45', status: 'active', os: 'Automotive Linux', lastSeen: '10 sec ago', threats: 0, nfcStatus: 'authorized' },
  ];

  const mockIotEndpoints = [
    { id: 1, name: 'Smart Home Hub', endpoint: 'https://api.smarthome.local/v1', status: 'secured', lastAccess: '2 min ago', authorizedIPs: ['192.168.1.1'], gsmUsage: '1.2GB/5GB' },
    { id: 2, name: 'Industrial Sensor Array', endpoint: 'https://sensor.factory.local/data', status: 'secured', lastAccess: '30 sec ago', authorizedIPs: ['10.0.0.1'], gsmUsage: '3.8GB/10GB' },
    { id: 3, name: 'Vehicle Telemetry', endpoint: 'https://vehicle.telemetry.local/api', status: 'alert', lastAccess: '5 sec ago', authorizedIPs: ['172.16.0.1'], gsmUsage: '4.9GB/5GB' },
  ];

  const mockGsmAlerts = [
    { id: 1, type: 'CRITICAL', message: 'Unauthorized GSM data usage detected', device: 'Smart-Thermostat', dataUsed: '500MB', timestamp: '1 min ago', blockedIP: '185.220.101.45' },
    { id: 2, type: 'WARNING', message: 'GSM data limit approaching (90%)', device: 'Vehicle-ECU-Tesla', dataUsed: '4.5GB/5GB', timestamp: '5 min ago', blockedIP: null },
  ];

  const mockAutomotiveDevices = [
    { id: 1, name: 'Tesla Model 3', vin: 'TESLA123XYZ', status: 'secure', nfcStatus: 'authorized', digitalCluster: true, threats: 0, gsmData: '2.1GB/5GB' },
    { id: 2, name: 'BMW iX', vin: 'BMW456ABC', status: 'alert', nfcStatus: 'unauthorized_attempt', digitalCluster: true, threats: 1, gsmData: '3.2GB/5GB' },
  ];

  const mockThreats = [
    { id: 1, type: 'CRITICAL', title: 'Suspicious Port Scan', device: 'Router-Main', timestamp: '2 min ago', status: 'active' },
    { id: 2, type: 'HIGH', title: 'Unauthorized Access Attempt', device: 'IoT-Camera-01', timestamp: '15 min ago', status: 'investigating' },
    { id: 3, type: 'MEDIUM', title: 'Unusual Network Traffic', device: 'Router-Main', timestamp: '1 hour ago', status: 'resolved' },
    { id: 4, type: 'LOW', title: 'Firmware Update Available', device: 'Server-01', timestamp: '3 hours ago', status: 'pending' },
  ];

  const fetchDevices = async () => {
    try {
      const result = await xhrRequest(`${process.env.REACT_APP_BACKEND_URL}/api/security/devices`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (result.ok) {
        setDevices(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  const fetchThreats = async () => {
    try {
      const result = await xhrRequest(`${process.env.REACT_APP_BACKEND_URL}/api/security/threats`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (result.ok) {
        setThreats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch threats:', error);
    }
  };

  const fetchIotDevices = async () => {
    try {
      const result = await xhrRequest(`${process.env.REACT_APP_BACKEND_URL}/api/security/iot/endpoints`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (result.ok) {
        setIotEndpoints(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch IoT devices:', error);
    }
  };

  const fetchGsmAlerts = async () => {
    try {
      const result = await xhrRequest(`${process.env.REACT_APP_BACKEND_URL}/api/security/gsm/alerts`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (result.ok) {
        setGsmAlerts(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch GSM alerts:', error);
    }
  };

  const fetchAutomotiveDevices = async () => {
    try {
      const result = await xhrRequest(`${process.env.REACT_APP_BACKEND_URL}/api/security/automotive/devices`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (result.ok) {
        setAutomotiveDevices(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch automotive devices:', error);
    }
  };

  // Handle Add Device
  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.ip) {
      alert('Please fill in device name and IP address');
      return;
    }
    
    setAddingDevice(true);
    try {
      const result = await xhrRequest(`${process.env.REACT_APP_BACKEND_URL}/api/security/devices`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newDevice.name,
          device_type: newDevice.type,
          ip_address: newDevice.ip,
          os: newDevice.os || 'Unknown',
          segment: newDevice.segment
        })
      });
      
      if (result.ok) {
        const addedDevice = result.data;
        // Add to local state immediately for instant feedback
        setDevices(prev => [...prev, {
          id: addedDevice.device_id || Date.now(),
          name: newDevice.name,
          type: newDevice.type,
          ip: newDevice.ip,
          os: newDevice.os || 'Unknown',
          status: 'active',
          threats: 0,
          lastSeen: 'Just now'
        }]);
        setShowAddDeviceModal(false);
        setNewDevice({ name: '', type: 'server', ip: '', os: '', segment: 'enterprise' });
      } else {
        // Still add locally for demo purposes
        setDevices(prev => [...prev, {
          id: Date.now(),
          name: newDevice.name,
          type: newDevice.type,
          ip: newDevice.ip,
          os: newDevice.os || 'Unknown',
          status: 'active',
          threats: 0,
          lastSeen: 'Just now'
        }]);
        setShowAddDeviceModal(false);
        setNewDevice({ name: '', type: 'server', ip: '', os: '', segment: 'enterprise' });
      }
    } catch (error) {
      console.error('Error adding device:', error);
      // Add locally anyway for demo
      setDevices(prev => [...prev, {
        id: Date.now(),
        name: newDevice.name,
        type: newDevice.type,
        ip: newDevice.ip,
        os: newDevice.os || 'Unknown',
        status: 'active',
        threats: 0,
        lastSeen: 'Just now'
      }]);
      setShowAddDeviceModal(false);
      setNewDevice({ name: '', type: 'server', ip: '', os: '', segment: 'enterprise' });
    } finally {
      setAddingDevice(false);
    }
  };

  useEffect(() => {
    // Fetch real data from backend
    fetchDevices();
    fetchThreats();
    fetchIotDevices();
    fetchGsmAlerts();
    fetchAutomotiveDevices();
  }, []);

  const getThreatColor = (type) => {
    switch(type) {
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDeviceIcon = (type) => {
    switch(type) {
      case 'server': return Server;
      case 'router': return Wifi;
      case 'iot': return Cpu;
      case 'workstation': return HardDrive;
      default: return Network;
    }
  };

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className="text-3xl font-bold text-green-600">92%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Threats</p>
                <p className="text-3xl font-bold text-red-600">{threats.filter(t => t.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Protected Devices</p>
                <p className="text-3xl font-bold text-blue-600">{devices.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Network className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Detection Rate</p>
                <p className="text-3xl font-bold text-purple-600">99.8%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common security management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => setActiveTab('agents')}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600"
            >
              <Download className="w-6 h-6" />
              <span>Download Agent</span>
            </Button>
            <Button 
              onClick={() => setActiveTab('threats')}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600"
            >
              <AlertTriangle className="w-6 h-6" />
              <span>View Threats</span>
            </Button>
            <Button 
              onClick={() => setActiveTab('devices')}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600"
            >
              <Network className="w-6 h-6" />
              <span>Manage Devices</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Threats */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Threats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {threats.slice(0, 4).map((threat) => (
              <div key={threat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getThreatColor(threat.type)}>{threat.type}</Badge>
                  <div>
                    <p className="font-medium">{threat.title}</p>
                    <p className="text-sm text-gray-600">{threat.device} • {threat.timestamp}</p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">{threat.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Add Device Modal
  const AddDeviceModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Add New Device</h3>
          <button 
            onClick={() => setShowAddDeviceModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="deviceName">Device Name *</Label>
            <Input 
              id="deviceName"
              placeholder="e.g., Server-02"
              value={newDevice.name}
              onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="deviceType">Device Type</Label>
            <select 
              id="deviceType"
              className="w-full px-3 py-2 border rounded-md"
              value={newDevice.type}
              onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
            >
              <option value="server">Server</option>
              <option value="router">Router</option>
              <option value="workstation">Workstation</option>
              <option value="iot">IoT Device</option>
              <option value="automotive">Automotive</option>
              <option value="cctv">CCTV Camera</option>
              <option value="white_goods">White Goods (IoT)</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="deviceIP">IP Address *</Label>
            <Input 
              id="deviceIP"
              placeholder="e.g., 192.168.1.100"
              value={newDevice.ip}
              onChange={(e) => setNewDevice({...newDevice, ip: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="deviceOS">Operating System</Label>
            <Input 
              id="deviceOS"
              placeholder="e.g., Ubuntu 22.04"
              value={newDevice.os}
              onChange={(e) => setNewDevice({...newDevice, os: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="segment">Security Segment</Label>
            <select 
              id="segment"
              className="w-full px-3 py-2 border rounded-md"
              value={newDevice.segment}
              onChange={(e) => setNewDevice({...newDevice, segment: e.target.value})}
            >
              <option value="enterprise">Enterprise</option>
              <option value="telco">Telco</option>
              <option value="mobile">Mobile</option>
              <option value="automotive">Automotive</option>
              <option value="white_goods">White Goods</option>
              <option value="cctv">CCTV</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setShowAddDeviceModal(false)}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"
            onClick={handleAddDevice}
            disabled={addingDevice}
          >
            {addingDevice ? 'Adding...' : 'Add Device'}
          </Button>
        </div>
      </div>
    </div>
  );

  // Devices Tab
  const DevicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Network Devices</h2>
          <p className="text-gray-600">Monitor and manage all protected devices</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-500 to-blue-600"
          onClick={() => setShowAddDeviceModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.map((device) => {
          const DeviceIcon = getDeviceIcon(device.type);
          return (
            <Card key={device.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DeviceIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <CardDescription className="capitalize">{device.type}</CardDescription>
                    </div>
                  </div>
                  <Badge className={device.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {device.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">IP Address:</span>
                    <span className="font-mono">{device.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">OS:</span>
                    <span>{device.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Seen:</span>
                    <span>{device.lastSeen}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Threats:</span>
                    <Badge variant={device.threats > 0 ? 'destructive' : 'default'}>
                      {device.threats}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Activity className="w-4 h-4 mr-1" />
                    Monitor
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Lock className="w-4 h-4 mr-1" />
                    Secure
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Agents Tab
  const AgentsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Security Agents</h2>
        <p className="text-gray-600">Download and deploy SecureSphere agents for comprehensive protection</p>
      </div>

      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle>SecureSphere Agent for IT Administrators</CardTitle>
          <CardDescription className="text-blue-100">
            Telco-grade security for enterprise environments and AI workloads
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Windows Agent */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Windows Agent</CardTitle>
                  <CardDescription>For Windows Servers & Workstations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Windows 10/11, Server 2016+</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Real-time threat detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>AI workload protection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Size: ~50MB</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download Windows Agent
                  </Button>
                </CardContent>
              </Card>

              {/* Mac Agent */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">macOS Agent</CardTitle>
                  <CardDescription>For Mac Servers & Workstations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>macOS 10.15+ (Intel & Apple Silicon)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Endpoint protection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Network monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Size: ~45MB</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download macOS Agent
                  </Button>
                </CardContent>
              </Card>

              {/* Linux Agent */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Linux Agent</CardTitle>
                  <CardDescription>For Linux Servers & IoT</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Ubuntu, RHEL, CentOS, Debian</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Container security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Cloud-native protection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Size: ~30MB</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download Linux Agent
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Installation Instructions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>Quick Installation Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-semibold">Download Agent</p>
                      <p className="text-sm text-gray-600">Select the appropriate agent for your platform</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-semibold">Install on Target System</p>
                      <p className="text-sm text-gray-600">Run installer with admin privileges</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-semibold">Configure & Connect</p>
                      <p className="text-sm text-gray-600">Agent auto-registers with SecureSphere platform</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-semibold">Monitor & Protect</p>
                      <p className="text-sm text-gray-600">Real-time protection starts automatically</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* AI Environment Protection */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardTitle>AI Environment Protection</CardTitle>
          <CardDescription className="text-purple-100">
            Specialized security for AI/ML workloads and infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">GPU Monitoring</h3>
              <p className="text-sm text-gray-600">Track and secure GPU resources for AI training</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">Model Protection</h3>
              <p className="text-sm text-gray-600">Secure ML models from theft and tampering</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">API Security</h3>
              <p className="text-sm text-gray-600">Protect AI endpoints and inference APIs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Threats Tab
  const ThreatsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Threat Dashboard</h2>
        <p className="text-gray-600">Real-time threat detection and response</p>
      </div>

      <div className="space-y-4">
        {threats.map((threat) => (
          <Card key={threat.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getThreatColor(threat.type)}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{threat.title}</h3>
                      <Badge className={getThreatColor(threat.type)}>{threat.type}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Device: <span className="font-medium">{threat.device}</span> • {threat.timestamp}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Lock className="w-4 h-4 mr-1" />
                        Block
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">{threat.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // IoT Security Tab
  const IoTSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">IoT Endpoint & GSM Security</h2>
        <p className="text-gray-600">Protect IoT endpoints and monitor GSM data usage</p>
      </div>

      {/* GSM Alerts */}
      <Card className="border-2 border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            GSM Security Alerts
          </CardTitle>
          <CardDescription className="text-red-100">
            Unauthorized access and data usage alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {gsmAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <div className="flex gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getThreatColor(alert.type)}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold">{alert.message}</h3>
                      <Badge className={getThreatColor(alert.type)}>{alert.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Device: <span className="font-medium">{alert.device}</span> • {alert.timestamp}
                    </p>
                    {alert.blockedIP && (
                      <p className="text-sm text-red-600 font-medium">
                        🚫 Blocked IP: {alert.blockedIP}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Data Used: <span className="font-medium">{alert.dataUsed}</span>
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="destructive">
                  Block Device
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* IoT Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>Protected IoT Endpoints</CardTitle>
          <CardDescription>Monitor and secure IoT API endpoints and GSM data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {iotEndpoints.map((endpoint) => (
              <Card key={endpoint.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{endpoint.name}</h3>
                        <p className="text-sm text-gray-600 font-mono mb-3">{endpoint.endpoint}</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Status:</p>
                            <Badge className={endpoint.status === 'secured' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                              {endpoint.status === 'secured' ? '✓ Secured' : '⚠ Alert'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Last Access:</p>
                            <p className="font-medium">{endpoint.lastAccess}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">GSM Usage:</p>
                            <p className="font-medium">{endpoint.gsmUsage}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Authorized IPs:</p>
                            <p className="font-mono text-xs">{endpoint.authorizedIPs.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Monitor
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Lock className="w-4 h-4 mr-1" />
                        Add IP
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Shield className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>IoT Security Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">IP Whitelisting</h3>
              <p className="text-sm text-gray-600">Only authorized IPs can access endpoints</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">GSM Monitoring</h3>
              <p className="text-sm text-gray-600">Real-time data usage tracking and alerts</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Auto-Block</h3>
              <p className="text-sm text-gray-600">Automatic blocking of unauthorized access</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Automotive Tab
  const AutomotiveTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Automotive IoT Security</h2>
        <p className="text-gray-600">Connected vehicle security with digital cluster integration</p>
      </div>

      {/* Automotive Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automotiveDevices.map((vehicle) => (
          <Card key={vehicle.id} className={`hover:shadow-lg transition-shadow ${vehicle.status === 'alert' ? 'border-2 border-red-300' : ''}`}>
            <CardHeader className={vehicle.status === 'alert' ? 'bg-red-50' : 'bg-blue-50'}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${vehicle.status === 'alert' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <Cpu className={`w-6 h-6 ${vehicle.status === 'alert' ? 'text-red-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">VIN: {vehicle.vin}</CardDescription>
                  </div>
                </div>
                <Badge className={vehicle.status === 'secure' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {vehicle.status === 'secure' ? '✓ Secure' : '⚠ Alert'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Digital Cluster Preview */}
                {vehicle.digitalCluster && (
                  <div className="bg-gray-900 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <img src={process.env.REACT_APP_LOGO_URL} alt="Infuse-ai" className="w-8 h-8" />
                        <span className="text-sm font-medium">SecureSphere Active</span>
                      </div>
                      <Badge className={vehicle.nfcStatus === 'authorized' ? 'bg-green-500' : 'bg-red-500'}>
                        {vehicle.nfcStatus === 'authorized' ? 'NFC ✓' : 'NFC ✗'}
                      </Badge>
                    </div>
                    
                    {vehicle.nfcStatus !== 'authorized' && (
                      <div className="bg-red-500 p-3 rounded mb-3 animate-pulse">
                        <p className="text-sm font-bold">🚨 SECURITY ALERT</p>
                        <p className="text-xs">Unauthorized NFC access attempt detected</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Security Status</p>
                        <p className="font-medium">{vehicle.status === 'secure' ? 'Protected' : 'Alert Active'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">GSM Data</p>
                        <p className="font-medium">{vehicle.gsmData}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Threats Blocked</p>
                        <p className="font-medium">{vehicle.threats} today</p>
                      </div>
                      <div>
                        <p className="text-gray-400">NFC Status</p>
                        <p className="font-medium capitalize">{vehicle.nfcStatus.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Monitor
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Shield className="w-4 h-4 mr-1" />
                    Configure NFC
                  </Button>
                  {vehicle.status === 'alert' && (
                    <Button size="sm" variant="destructive" className="flex-1">
                      Block Access
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automotive Security Features */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle>Automotive Security Features</CardTitle>
          <CardDescription>Comprehensive protection for connected vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-bold mb-2">NFC Authentication</h3>
              <p className="text-sm text-gray-600">Secure vehicle access with NFC monitoring</p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• Real-time NFC validation</li>
                <li>• Unauthorized access alerts</li>
                <li>• Digital cluster integration</li>
              </ul>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">ECU Protection</h3>
              <p className="text-sm text-gray-600">Secure electronic control units from tampering</p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• Firmware integrity checks</li>
                <li>• CAN bus monitoring</li>
                <li>• OBD-II port security</li>
              </ul>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">Digital Cluster Alerts</h3>
              <p className="text-sm text-gray-600">Real-time security status on dashboard</p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• Infuse-ai logo display</li>
                <li>• Threat notifications</li>
                <li>• GSM usage tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout title="SecureSphere - Enterprise Security">
      <SEO
        title="SecureSphere - Telco-Grade Enterprise Security | Infuse-ai"
        description="Enterprise-grade network security, IoT protection, and AI workload security with real-time threat detection"
        keywords="enterprise security, network security, IoT security, AI security, threat detection, telco-grade security"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-9 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="surveillance" className="flex items-center gap-1">
            <Camera className="w-3 h-3" />
            Surveillance
          </TabsTrigger>
          <TabsTrigger value="iot">IoT Security</TabsTrigger>
          <TabsTrigger value="5g-iot" className="flex items-center gap-1">
            <Radio className="w-3 h-3" />
            5G-IoT
          </TabsTrigger>
          <TabsTrigger value="automotive">Automotive</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="devices">
          <DevicesTab />
        </TabsContent>

        <TabsContent value="agents">
          <AgentsTab />
        </TabsContent>

        <TabsContent value="threats">
          <ThreatsTab />
        </TabsContent>

        <TabsContent value="iot">
          <IoTSecurityTab />
        </TabsContent>

        <TabsContent value="surveillance">
          <SurveillanceIoTDashboard />
        </TabsContent>

        <TabsContent value="5g-iot">
          <IoT5GSecurityDashboard />
        </TabsContent>

        <TabsContent value="automotive">
          <AutomotiveTab />
        </TabsContent>

        <TabsContent value="team">
          <TeamManagement platform="securesphere" />
        </TabsContent>
      </Tabs>
      
      {/* Add Device Modal */}
      {showAddDeviceModal && <AddDeviceModal />}
    </DashboardLayout>
  );
};

export default SecureSphere;
