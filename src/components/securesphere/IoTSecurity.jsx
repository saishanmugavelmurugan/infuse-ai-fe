import React, { useState, useEffect } from 'react';
import {
  Cpu, Shield, Activity, AlertTriangle, CheckCircle, XCircle,
  RefreshCw, Plus, Wifi, Radio, Server, Eye, Lock, Unlock,
  ChevronDown, ChevronUp, Search, Filter, Zap, BarChart3,
  Monitor, Smartphone, Home, Factory, Heart, Car, Building
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const IoTSecurity = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [endpoints, setEndpoints] = useState([]);
  const [categories, setCategories] = useState({});
  const [overview, setOverview] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showTrafficModal, setShowTrafficModal] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [trafficResult, setTrafficResult] = useState(null);
  const [anomalyResult, setAnomalyResult] = useState(null);

  const [registerForm, setRegisterForm] = useState({
    device_name: '',
    device_type: 'sensor',
    category: 'smart_home',
    manufacturer: '',
    model: '',
    firmware_version: '1.0.0',
    ip_address: '',
    mac_address: '',
    location: '',
    owner_id: 'demo-user-001',
    protocols: ['mqtt', 'https'],
    capabilities: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [overviewRes, endpointsRes, categoriesRes, vulnRes] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/iot-security/dashboard/overview`),
        fetch(`${API_URL}/api/securesphere/iot-security/endpoints?owner_id=demo-user-001`),
        fetch(`${API_URL}/api/securesphere/iot-security/categories`),
        fetch(`${API_URL}/api/securesphere/iot-security/firmware/vulnerabilities`)
      ]);
      
      const overviewData = await overviewRes.json();
      const endpointsData = await endpointsRes.json();
      const categoriesData = await categoriesRes.json();
      const vulnData = await vulnRes.json();
      
      setOverview(overviewData);
      setEndpoints(endpointsData.endpoints || []);
      setCategories(categoriesData.categories || {});
      setVulnerabilities(vulnData.vulnerabilities || []);
    } catch (error) {
      console.error('Error fetching IoT data:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerEndpoint = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/securesphere/iot-security/endpoints/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      if (response.ok) {
        setShowRegisterModal(false);
        fetchData();
        setRegisterForm({
          device_name: '',
          device_type: 'sensor',
          category: 'smart_home',
          manufacturer: '',
          model: '',
          firmware_version: '1.0.0',
          ip_address: '',
          mac_address: '',
          location: '',
          owner_id: 'demo-user-001',
          protocols: ['mqtt', 'https'],
          capabilities: []
        });
      }
    } catch (error) {
      console.error('Error registering endpoint:', error);
    }
  };

  const scanFirmware = async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}/api/securesphere/iot-security/firmware/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: endpoint.id,
          firmware_version: endpoint.firmware_version,
          manufacturer: endpoint.manufacturer
        })
      });
      const data = await response.json();
      setScanResult(data);
      setShowScanModal(true);
      fetchData();
    } catch (error) {
      console.error('Error scanning firmware:', error);
    }
  };

  const analyzeTraffic = async (endpoint) => {
    try {
      // Generate sample traffic data
      const sampleTraffic = Array.from({ length: 10 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        bytes_in: Math.floor(Math.random() * 10000),
        bytes_out: Math.floor(Math.random() * 5000),
        protocol: ['mqtt', 'https', 'http'][Math.floor(Math.random() * 3)],
        destination: ['cloud.iot.aws', 'api.device.local', 'telemetry.service'][Math.floor(Math.random() * 3)],
        port: [443, 8883, 80][Math.floor(Math.random() * 3)]
      }));

      const response = await fetch(`${API_URL}/api/securesphere/iot-security/traffic/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: endpoint.id,
          traffic_samples: sampleTraffic,
          duration_minutes: 60
        })
      });
      const data = await response.json();
      setTrafficResult(data);
      setShowTrafficModal(true);
    } catch (error) {
      console.error('Error analyzing traffic:', error);
    }
  };

  const detectAnomalies = async (endpoint) => {
    try {
      // Generate sample data points
      const dataPoints = Array.from({ length: 5 }, (_, i) => ({
        type: ['cpu', 'memory', 'network', 'temperature'][Math.floor(Math.random() * 4)],
        value: Math.floor(Math.random() * 150),
        threshold: 100
      }));

      const response = await fetch(
        `${API_URL}/api/securesphere/iot-security/anomalies/detect?device_id=${endpoint.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPoints)
        }
      );
      const data = await response.json();
      setAnomalyResult(data);
      fetchData();
    } catch (error) {
      console.error('Error detecting anomalies:', error);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      smart_home: Home,
      industrial: Factory,
      healthcare: Heart,
      automotive: Car,
      infrastructure: Building
    };
    return icons[category] || Cpu;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return colors[severity] || colors.medium;
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'endpoints', name: 'Endpoints', icon: Cpu },
    { id: 'monitoring', name: 'Monitoring', icon: Activity },
    { id: 'vulnerabilities', name: 'Vulnerabilities', icon: AlertTriangle },
    { id: 'access-control', name: 'Access Control', icon: Lock }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">IoT Security</h2>
            <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full">
              ADVANCED
            </span>
          </div>
          <p className="text-gray-600">Comprehensive IoT endpoint monitoring and protection</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowRegisterModal(true)} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="h-4 w-4 mr-2" />
            Register Endpoint
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
                ? 'bg-cyan-100 text-cyan-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Cpu className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overview.summary?.total_endpoints || 0}</p>
                  <p className="text-xs text-gray-500">Total Endpoints</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overview.summary?.healthy_endpoints || 0}</p>
                  <p className="text-xs text-gray-500">Healthy</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overview.summary?.active_anomalies || 0}</p>
                  <p className="text-xs text-gray-500">Anomalies</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overview.summary?.vulnerable_devices || 0}</p>
                  <p className="text-xs text-gray-500">Vulnerable</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overview.summary?.firmware_scans || 0}</p>
                  <p className="text-xs text-gray-500">Scans Run</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overview.summary?.health_percentage || 0}%</p>
                  <p className="text-xs text-gray-500">Health Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Endpoints by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(overview.by_category || {}).map(([category, count]) => {
                const CategoryIcon = getCategoryIcon(category);
                return (
                  <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                    <CategoryIcon className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500 capitalize">{category.replace('_', ' ')}</p>
                  </div>
                );
              })}
              {Object.keys(overview.by_category || {}).length === 0 && (
                <p className="text-gray-500 text-sm col-span-5">No endpoints registered yet</p>
              )}
            </div>
          </div>

          {/* Features Banner */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">IoT Security Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                <span className="text-sm">Endpoint Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                <span className="text-sm">Traffic Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <span className="text-sm">Anomaly Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Firmware Scanning</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <span className="text-sm">Access Control</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="space-y-4">
          {endpoints.length === 0 ? (
            <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
              <Cpu className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="font-medium text-gray-700">No endpoints registered</h4>
              <p className="text-sm text-gray-500 mt-1">Register your first IoT endpoint</p>
              <Button onClick={() => setShowRegisterModal(true)} className="mt-4 bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Register Endpoint
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {endpoints.map((endpoint) => {
                const CategoryIcon = getCategoryIcon(endpoint.category);
                return (
                  <div key={endpoint.id} className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <CategoryIcon className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{endpoint.device_name}</h4>
                          <p className="text-xs text-gray-500">{endpoint.manufacturer} {endpoint.model}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        endpoint.health_status === 'healthy' ? 'bg-green-100 text-green-700' :
                        endpoint.health_status === 'degraded' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {endpoint.health_status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="text-gray-700 capitalize">{endpoint.category?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Firmware</p>
                        <p className="text-gray-700">{endpoint.firmware_version}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Security Score</p>
                        <p className={`font-medium ${
                          endpoint.security_score >= 80 ? 'text-green-600' :
                          endpoint.security_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>{endpoint.security_score || 100}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Anomalies</p>
                        <p className="text-gray-700">{endpoint.anomaly_count || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {endpoint.protocols?.map((protocol) => (
                        <span key={protocol} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {protocol}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scanFirmware(endpoint)}
                        className="flex-1"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Scan
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => analyzeTraffic(endpoint)}
                        className="flex-1"
                      >
                        <Wifi className="h-3 w-3 mr-1" />
                        Traffic
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => detectAnomalies(endpoint)}
                        className="flex-1"
                      >
                        <Activity className="h-3 w-3 mr-1" />
                        Detect
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Real-Time Monitoring</h3>
            <p className="text-gray-600 mb-4">Select an endpoint to view monitoring data</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traffic Analysis Results */}
              {trafficResult && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Latest Traffic Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Samples Analyzed</span>
                      <span className="font-medium">{trafficResult.samples_analyzed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Bytes In</span>
                      <span className="font-medium">{(trafficResult.summary?.total_bytes_in / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Bytes Out</span>
                      <span className="font-medium">{(trafficResult.summary?.total_bytes_out / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Threat Level</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(trafficResult.threat_level)}`}>
                        {trafficResult.threat_level}
                      </span>
                    </div>
                    {trafficResult.suspicious_patterns?.length > 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded">
                        <p className="text-xs font-medium text-yellow-700">Suspicious Patterns:</p>
                        {trafficResult.suspicious_patterns.map((p, i) => (
                          <p key={i} className="text-xs text-yellow-600">• {p.description}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Anomaly Detection Results */}
              {anomalyResult && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Latest Anomaly Detection</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Data Points Analyzed</span>
                      <span className="font-medium">{anomalyResult.data_points_analyzed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Anomalies Found</span>
                      <span className="font-medium">{anomalyResult.anomalies_found}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Risk Level</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(anomalyResult.risk_level)}`}>
                        {anomalyResult.risk_level}
                      </span>
                    </div>
                    {anomalyResult.anomalies?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {anomalyResult.anomalies.slice(0, 3).map((a, i) => (
                          <div key={i} className="p-2 bg-red-50 rounded text-xs">
                            <span className="font-medium text-red-700">{a.type}:</span>
                            <span className="text-red-600 ml-1">Value {a.value} exceeded threshold {a.threshold}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {!trafficResult && !anomalyResult && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Run traffic analysis or anomaly detection on an endpoint to see results</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vulnerabilities Tab */}
      {activeTab === 'vulnerabilities' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Known IoT Vulnerabilities Database</h3>
            <div className="space-y-3">
              {vulnerabilities.map((vuln) => (
                <div key={vuln.cve_id} className={`p-4 rounded-lg border ${
                  vuln.severity === 'critical' ? 'border-red-200 bg-red-50' :
                  vuln.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                  'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-5 w-5 ${
                        vuln.severity === 'critical' ? 'text-red-600' :
                        vuln.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'
                      }`} />
                      <span className="font-mono text-sm font-medium">{vuln.cve_id}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">{vuln.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{vuln.description}</p>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Affected Firmware: </span>
                    <span className="text-xs text-gray-700">{vuln.affected_firmware?.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scan Results */}
          {scanResult && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Latest Firmware Scan Result</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Firmware Version</span>
                  <span className="font-mono">{scanResult.firmware_version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Overall Risk</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getSeverityColor(scanResult.overall_risk)}`}>
                    {scanResult.overall_risk}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vulnerabilities Found</span>
                  <span className="font-bold text-red-600">{scanResult.vulnerabilities_found}</span>
                </div>
                
                {scanResult.vulnerabilities?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-900">Detected Vulnerabilities:</h4>
                    {scanResult.vulnerabilities.map((v, i) => (
                      <div key={i} className="p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{v.cve_id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(v.severity)}`}>
                            {v.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{v.description}</p>
                        <p className="text-xs text-blue-600 mt-1">🔧 {v.remediation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Access Control Tab */}
      {activeTab === 'access-control' && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Access Control Management</h3>
          <p className="text-gray-600 mb-6">
            Define and manage access control rules for your IoT endpoints
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">Default Allow Rules</h4>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• MQTT to cloud broker (port 8883)</li>
                <li>• HTTPS to API endpoints (port 443)</li>
                <li>• NTP synchronization (port 123)</li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <h4 className="font-medium text-red-800">Default Deny Rules</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Telnet access (port 23)</li>
                <li>• FTP access (port 21)</li>
                <li>• Unknown outbound connections</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Best Practices</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✓ Implement network segmentation for IoT devices</li>
              <li>✓ Use encrypted protocols (TLS/SSL) for all communications</li>
              <li>✓ Regularly audit and update access control rules</li>
              <li>✓ Enable logging for all access attempts</li>
              <li>✓ Implement rate limiting to prevent DoS attacks</li>
            </ul>
          </div>
        </div>
      )}

      {/* Register Endpoint Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Register IoT Endpoint</h3>
            </div>
            <form onSubmit={registerEndpoint} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
                  <input
                    type="text"
                    required
                    value={registerForm.device_name}
                    onChange={(e) => setRegisterForm({ ...registerForm, device_name: e.target.value })}
                    placeholder="e.g., Living Room Thermostat"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={registerForm.category}
                    onChange={(e) => setRegisterForm({ ...registerForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  >
                    {Object.keys(categories).map((cat) => (
                      <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={registerForm.manufacturer}
                    onChange={(e) => setRegisterForm({ ...registerForm, manufacturer: e.target.value })}
                    placeholder="e.g., Nest"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={registerForm.model}
                    onChange={(e) => setRegisterForm({ ...registerForm, model: e.target.value })}
                    placeholder="e.g., Learning Thermostat"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Firmware Version</label>
                  <input
                    type="text"
                    required
                    value={registerForm.firmware_version}
                    onChange={(e) => setRegisterForm({ ...registerForm, firmware_version: e.target.value })}
                    placeholder="e.g., 1.2.3"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                  <input
                    type="text"
                    value={registerForm.ip_address}
                    onChange={(e) => setRegisterForm({ ...registerForm, ip_address: e.target.value })}
                    placeholder="e.g., 192.168.1.100"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={registerForm.location}
                  onChange={(e) => setRegisterForm({ ...registerForm, location: e.target.value })}
                  placeholder="e.g., Building A, Floor 2"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowRegisterModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                  Register Endpoint
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Traffic Analysis Modal */}
      {showTrafficModal && trafficResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Traffic Analysis Results</h3>
              <button onClick={() => setShowTrafficModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-lg font-bold">{trafficResult.duration_minutes} min</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Samples</p>
                  <p className="text-lg font-bold">{trafficResult.samples_analyzed}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Bandwidth</p>
                  <p className="text-lg font-bold">{trafficResult.summary?.bandwidth_utilization} KB/s</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Destinations</p>
                  <p className="text-lg font-bold">{trafficResult.summary?.unique_destinations}</p>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                trafficResult.threat_level === 'low' ? 'bg-green-50' :
                trafficResult.threat_level === 'medium' ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-2">
                  {trafficResult.threat_level === 'low' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className="font-medium capitalize">{trafficResult.threat_level} Threat Level</span>
                </div>
                {trafficResult.suspicious_patterns?.length > 0 && (
                  <div className="mt-2">
                    {trafficResult.suspicious_patterns.map((p, i) => (
                      <p key={i} className="text-sm">⚠️ {p.description}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Firmware Scan Modal */}
      {showScanModal && scanResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Firmware Scan Results</h3>
              <button onClick={() => setShowScanModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Firmware Version</p>
                  <p className="font-mono font-bold">{scanResult.firmware_version}</p>
                </div>
                <span className={`px-3 py-1 rounded-full font-medium ${getSeverityColor(scanResult.overall_risk)}`}>
                  {scanResult.overall_risk.toUpperCase()} RISK
                </span>
              </div>
              
              <div className="text-center p-4">
                <p className="text-4xl font-bold text-red-600">{scanResult.vulnerabilities_found}</p>
                <p className="text-gray-500">Vulnerabilities Found</p>
              </div>
              
              {scanResult.vulnerabilities?.length > 0 && (
                <div className="space-y-2">
                  {scanResult.vulnerabilities.map((v, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm">{v.cve_id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(v.severity)}`}>
                          {v.severity}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{v.name}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {scanResult.recommendations && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {scanResult.recommendations.map((rec, i) => (
                      <li key={i}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IoTSecurity;
