import React, { useState, useEffect } from 'react';
import {
  Car, Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Cpu, MapPin, Radio, Activity, Eye, Lock, Settings, Plus,
  ChevronDown, ChevronUp, Search, Zap, Server, Wifi, Navigation,
  Users, BarChart3, Clock, Target, Truck, AlertOctagon
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdvancedAutomotiveSecurity = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('can-monitor');
  const [ecuTypes, setEcuTypes] = useState([]);
  const [ecuVulnerabilities, setEcuVulnerabilities] = useState([]);
  const [threatDashboard, setThreatDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Results
  const [canMonitorSession, setCanMonitorSession] = useState(null);
  const [canAnalysisResult, setCanAnalysisResult] = useState(null);
  const [ecuScanResult, setEcuScanResult] = useState(null);
  const [gpsSpoofResult, setGpsSpoofResult] = useState(null);
  const [fleetOverview, setFleetOverview] = useState(null);

  // Forms
  const [ecuScanForm, setEcuScanForm] = useState({
    vehicle_id: 'VEHICLE-001',
    ecu_types: [],
    scan_depth: 'standard',
    include_firmware_analysis: true
  });

  const [gpsForm, setGpsForm] = useState({
    vehicle_id: 'VEHICLE-001',
    latitude: 19.0760,
    longitude: 72.8777,
    altitude: 14,
    speed: 60,
    heading: 180,
    satellites: 12,
    hdop: 1.2,
    signal_strength: -120,
    timestamp: new Date().toISOString()
  });

  const [fleetVehicleForm, setFleetVehicleForm] = useState({
    vehicle_id: '',
    vin: '',
    fleet_id: 'FLEET-001',
    vehicle_type: 'sedan',
    make: '',
    model: '',
    year: 2024,
    security_policy: 'standard'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ecuTypesRes, ecuVulnRes, threatRes] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/automotive-advanced/ecu/types`),
        fetch(`${API_URL}/api/securesphere/automotive-advanced/ecu/vulnerabilities`),
        fetch(`${API_URL}/api/securesphere/automotive-advanced/threats/dashboard`)
      ]);
      
      const ecuTypesData = await ecuTypesRes.json();
      const ecuVulnData = await ecuVulnRes.json();
      const threatData = await threatRes.json();
      
      setEcuTypes(ecuTypesData.ecu_types || []);
      setEcuVulnerabilities(ecuVulnData.vulnerabilities || []);
      setThreatDashboard(threatData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startCANMonitoring = async () => {
    try {
      const response = await fetch(`${API_URL}/api/securesphere/automotive-advanced/can-bus/monitor/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: 'VEHICLE-001',
          monitoring_mode: 'passive',
          alert_threshold: 5,
          baseline_enabled: true,
          anomaly_detection: true
        })
      });
      const data = await response.json();
      setCanMonitorSession(data);
    } catch (error) {
      console.error('Error starting CAN monitoring:', error);
    }
  };

  const analyzeCANStream = async () => {
    if (!canMonitorSession?.session_id) {
      alert('Please start monitoring first');
      return;
    }
    
    try {
      // Generate sample CAN messages
      const sampleMessages = [
        { arbitration_id: '0x7DF', data: 'deadbeef01020304', timestamp: new Date().toISOString(), dlc: 8 },
        { arbitration_id: '0x100', data: '0102030405060708', timestamp: new Date().toISOString(), dlc: 8 },
        { arbitration_id: '0x7E0', data: '02014100ffffffff', timestamp: new Date().toISOString(), dlc: 8 },
        { arbitration_id: '0x200', data: 'cafebabe11223344', timestamp: new Date().toISOString(), dlc: 8 },
        { arbitration_id: '0x300', data: '1122334455667788', timestamp: new Date().toISOString(), dlc: 8 }
      ];

      const response = await fetch(
        `${API_URL}/api/securesphere/automotive-advanced/can-bus/monitor/analyze-stream?session_id=${canMonitorSession.session_id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sampleMessages)
        }
      );
      const data = await response.json();
      setCanAnalysisResult(data);
    } catch (error) {
      console.error('Error analyzing CAN stream:', error);
    }
  };

  const scanECUVulnerabilities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/securesphere/automotive-advanced/ecu/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ecuScanForm)
      });
      const data = await response.json();
      setEcuScanResult(data);
    } catch (error) {
      console.error('Error scanning ECU:', error);
    }
  };

  const analyzeGPSData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/securesphere/automotive-advanced/gps/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gpsForm)
      });
      const data = await response.json();
      setGpsSpoofResult(data);
    } catch (error) {
      console.error('Error analyzing GPS:', error);
    }
  };

  const registerFleetVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/securesphere/automotive-advanced/fleet/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fleetVehicleForm)
      });
      if (response.ok) {
        fetchFleetOverview('FLEET-001');
        setFleetVehicleForm({
          ...fleetVehicleForm,
          vehicle_id: '',
          vin: '',
          make: '',
          model: ''
        });
      }
    } catch (error) {
      console.error('Error registering vehicle:', error);
    }
  };

  const fetchFleetOverview = async (fleetId) => {
    try {
      const response = await fetch(`${API_URL}/api/securesphere/automotive-advanced/fleet/${fleetId}/security-overview`);
      const data = await response.json();
      setFleetOverview(data);
    } catch (error) {
      console.error('Error fetching fleet overview:', error);
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
    { id: 'can-monitor', name: 'CAN Bus Monitor', icon: Cpu },
    { id: 'ecu-scan', name: 'ECU Vulnerability', icon: Shield },
    { id: 'gps-spoof', name: 'GPS Spoofing', icon: MapPin },
    { id: 'fleet', name: 'Fleet Security', icon: Truck },
    { id: 'threat-track', name: 'Threat Tracking', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Advanced Automotive Security</h2>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              ENTERPRISE
            </span>
          </div>
          <p className="text-gray-600">Deep vehicle security analysis and fleet management</p>
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

      {/* CAN Bus Monitor Tab */}
      {activeTab === 'can-monitor' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Real-Time CAN Bus Monitoring</h3>
            
            <div className="flex gap-4 mb-6">
              <Button onClick={startCANMonitoring} className="bg-green-600 hover:bg-green-700">
                <Zap className="h-4 w-4 mr-2" />
                Start Monitoring
              </Button>
              <Button 
                onClick={analyzeCANStream} 
                variant="outline"
                disabled={!canMonitorSession}
              >
                <Activity className="h-4 w-4 mr-2" />
                Analyze Stream
              </Button>
            </div>
            
            {canMonitorSession && (
              <div className="p-4 bg-green-50 rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Monitoring Active</span>
                </div>
                <p className="text-sm text-green-700">Session: {canMonitorSession.session_id?.slice(0, 8)}...</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(canMonitorSession.features_enabled || {}).map(([feature, enabled]) => (
                    <span key={feature} className={`px-2 py-0.5 rounded text-xs ${enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {feature.replace('_', ' ')}: {enabled ? '✓' : '✗'}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {canAnalysisResult && (
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <h4 className="font-medium text-gray-900">Analysis Results</h4>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{canAnalysisResult.messages_analyzed}</p>
                      <p className="text-xs text-blue-700">Messages Analyzed</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{canAnalysisResult.anomalies?.length || 0}</p>
                      <p className="text-xs text-yellow-700">Anomalies Detected</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{canAnalysisResult.alerts?.length || 0}</p>
                      <p className="text-xs text-red-700">Alerts Generated</p>
                    </div>
                  </div>
                  
                  {canAnalysisResult.anomalies?.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Detected Anomalies:</h5>
                      {canAnalysisResult.anomalies.map((anomaly, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{anomaly.type}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-white">{anomaly.severity}</span>
                          </div>
                          <p className="text-sm mt-1">{anomaly.description}</p>
                          <p className="text-xs mt-1 font-mono">ID: {anomaly.message_id}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ECU Vulnerability Tab */}
      {activeTab === 'ecu-scan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">ECU Vulnerability Scanner</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle ID</label>
                <input
                  type="text"
                  value={ecuScanForm.vehicle_id}
                  onChange={(e) => setEcuScanForm({ ...ecuScanForm, vehicle_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scan Depth</label>
                <select
                  value={ecuScanForm.scan_depth}
                  onChange={(e) => setEcuScanForm({ ...ecuScanForm, scan_depth: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="quick">Quick</option>
                  <option value="standard">Standard</option>
                  <option value="deep">Deep</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={scanECUVulnerabilities} className="bg-purple-600 hover:bg-purple-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Scan ECUs
                </Button>
              </div>
            </div>
            
            {/* ECU Types */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">ECU Types ({ecuTypes.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {ecuTypes.map((ecu) => (
                  <div key={ecu.id} className={`p-2 rounded-lg border text-center ${
                    ecu.criticality === 'critical' ? 'bg-red-50 border-red-200' :
                    ecu.criticality === 'high' ? 'bg-orange-50 border-orange-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <Cpu className={`h-5 w-5 mx-auto mb-1 ${
                      ecu.criticality === 'critical' ? 'text-red-600' :
                      ecu.criticality === 'high' ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                    <p className="text-xs font-medium truncate">{ecu.name.split('(')[0]}</p>
                    <span className={`text-xs px-1 py-0.5 rounded ${getSeverityColor(ecu.criticality)}`}>
                      {ecu.criticality}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scan Results */}
            {ecuScanResult && (
              <div className="border rounded-lg overflow-hidden">
                <div className={`p-4 ${getSeverityColor(ecuScanResult.risk_level)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Scan Results</h4>
                      <p className="text-sm">Risk Score: {ecuScanResult.risk_score}/100</p>
                    </div>
                    <span className="text-2xl font-bold">{ecuScanResult.total_vulnerabilities} Vulnerabilities</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-2 bg-red-50 rounded">
                      <p className="text-xl font-bold text-red-600">{ecuScanResult.critical_count}</p>
                      <p className="text-xs">Critical</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <p className="text-xl font-bold text-orange-600">{ecuScanResult.high_count}</p>
                      <p className="text-xs">High</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <p className="text-xl font-bold text-yellow-600">{ecuScanResult.medium_count}</p>
                      <p className="text-xs">Medium</p>
                    </div>
                  </div>
                  
                  {ecuScanResult.vulnerabilities_found?.length > 0 && (
                    <div className="space-y-2">
                      {ecuScanResult.vulnerabilities_found.slice(0, 5).map((vuln, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${getSeverityColor(vuln.severity)}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm">{vuln.cve_id}</span>
                            <span className="text-xs">CVSS: {vuln.cvss}</span>
                          </div>
                          <p className="font-medium mt-1">{vuln.name}</p>
                          <p className="text-sm mt-1">{vuln.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {ecuScanResult.recommendations?.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Recommendations:</h5>
                      {ecuScanResult.recommendations.filter(r => r).map((rec, i) => (
                        <p key={i} className="text-sm text-blue-700">✓ {rec}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Known Vulnerabilities */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Known ECU Vulnerabilities Database</h3>
            <div className="space-y-3">
              {ecuVulnerabilities.map((vuln) => (
                <div key={vuln.cve_id} className={`p-4 rounded-lg border ${getSeverityColor(vuln.severity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-medium">{vuln.cve_id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-white px-2 py-0.5 rounded">CVSS: {vuln.cvss}</span>
                      <span className={`text-xs px-2 py-0.5 rounded capitalize ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-medium">{vuln.name}</h4>
                  <p className="text-sm mt-1">{vuln.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {vuln.affected_ecus?.map((ecu) => (
                      <span key={ecu} className="px-2 py-0.5 bg-white/50 text-xs rounded border">
                        {ecu.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GPS Spoofing Tab */}
      {activeTab === 'gps-spoof' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">GPS Spoofing Detection</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={gpsForm.latitude}
                  onChange={(e) => setGpsForm({ ...gpsForm, latitude: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={gpsForm.longitude}
                  onChange={(e) => setGpsForm({ ...gpsForm, longitude: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Satellites</label>
                <input
                  type="number"
                  value={gpsForm.satellites}
                  onChange={(e) => setGpsForm({ ...gpsForm, satellites: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Signal (dBm)</label>
                <input
                  type="number"
                  value={gpsForm.signal_strength}
                  onChange={(e) => setGpsForm({ ...gpsForm, signal_strength: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speed (km/h)</label>
                <input
                  type="number"
                  value={gpsForm.speed}
                  onChange={(e) => setGpsForm({ ...gpsForm, speed: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HDOP</label>
                <input
                  type="number"
                  step="0.1"
                  value={gpsForm.hdop}
                  onChange={(e) => setGpsForm({ ...gpsForm, hdop: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex items-end col-span-2">
                <Button onClick={analyzeGPSData} className="bg-blue-600 hover:bg-blue-700">
                  <MapPin className="h-4 w-4 mr-2" />
                  Analyze GPS Data
                </Button>
              </div>
            </div>
            
            {gpsSpoofResult && (
              <div className={`p-4 rounded-lg border ${gpsSpoofResult.is_spoofed ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {gpsSpoofResult.is_spoofed ? (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                  <span className="text-lg font-semibold">
                    {gpsSpoofResult.is_spoofed ? 'GPS SPOOFING DETECTED!' : 'GPS Signal Legitimate'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(gpsSpoofResult.threat_level)}`}>
                    {gpsSpoofResult.threat_level?.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-2 bg-white rounded">
                    <p className="text-lg font-bold">{gpsSpoofResult.confidence}%</p>
                    <p className="text-xs text-gray-500">Confidence</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <p className="text-lg font-bold">{gpsSpoofResult.risk_score}</p>
                    <p className="text-xs text-gray-500">Risk Score</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <p className="text-lg font-bold">{gpsSpoofResult.gps_quality?.satellites}</p>
                    <p className="text-xs text-gray-500">Satellites</p>
                  </div>
                </div>
                
                {gpsSpoofResult.spoof_indicators?.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h5 className="font-medium">Spoof Indicators:</h5>
                    {gpsSpoofResult.spoof_indicators.map((ind, i) => (
                      <div key={i} className="p-2 bg-white rounded text-sm">
                        <span className="font-medium">{ind.indicator}:</span> {ind.description}
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-sm text-blue-600">{gpsSpoofResult.recommendation}</p>
              </div>
            )}
          </div>
          
          {/* GPS Quality Guide */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">GPS Signal Quality Guide</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">Good Signal</h4>
                <ul className="text-xs text-green-700 mt-2 space-y-1">
                  <li>• Satellites: 8-12</li>
                  <li>• HDOP: 1.0-2.0</li>
                  <li>• Signal: -120 to -130 dBm</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800">Moderate Signal</h4>
                <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                  <li>• Satellites: 4-7</li>
                  <li>• HDOP: 2.0-5.0</li>
                  <li>• Signal: -130 to -140 dBm</li>
                </ul>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800">Poor Signal</h4>
                <ul className="text-xs text-orange-700 mt-2 space-y-1">
                  <li>• Satellites: &lt;4</li>
                  <li>• HDOP: &gt;5.0</li>
                  <li>• Signal: &lt;-140 dBm</li>
                </ul>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800">Spoofing Signs</h4>
                <ul className="text-xs text-red-700 mt-2 space-y-1">
                  <li>• Satellites: &gt;20</li>
                  <li>• HDOP: &lt;0.5</li>
                  <li>• Signal: &gt;-100 dBm</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fleet Security Tab */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Fleet Security Management</h3>
              <Button onClick={() => fetchFleetOverview('FLEET-001')} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Fleet
              </Button>
            </div>
            
            {/* Register Vehicle Form */}
            <form onSubmit={registerFleetVehicle} className="p-4 bg-gray-50 rounded-lg mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Register Vehicle to Fleet</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle ID</label>
                  <input
                    type="text"
                    required
                    value={fleetVehicleForm.vehicle_id}
                    onChange={(e) => setFleetVehicleForm({ ...fleetVehicleForm, vehicle_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="VEH-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                  <input
                    type="text"
                    required
                    value={fleetVehicleForm.vin}
                    onChange={(e) => setFleetVehicleForm({ ...fleetVehicleForm, vin: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="1HGBH41JXMN109186"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={fleetVehicleForm.make}
                    onChange={(e) => setFleetVehicleForm({ ...fleetVehicleForm, make: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={fleetVehicleForm.model}
                    onChange={(e) => setFleetVehicleForm({ ...fleetVehicleForm, model: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Camry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select
                    value={fleetVehicleForm.vehicle_type}
                    onChange={(e) => setFleetVehicleForm({ ...fleetVehicleForm, vehicle_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Security Policy</label>
                  <select
                    value={fleetVehicleForm.security_policy}
                    onChange={(e) => setFleetVehicleForm({ ...fleetVehicleForm, security_policy: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="enhanced">Enhanced</option>
                    <option value="strict">Strict</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </div>
              </div>
            </form>
            
            {/* Fleet Overview */}
            {fleetOverview && fleetOverview.total_vehicles > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Fleet: {fleetOverview.fleet_id}</h4>
                      <p className="text-indigo-200 text-sm">{fleetOverview.total_vehicles} Vehicles</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{fleetOverview.fleet_risk_score}</p>
                      <p className="text-xs text-indigo-200">Risk Score</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {Object.entries(fleetOverview.threat_distribution || {}).map(([level, count]) => (
                      <div key={level} className={`text-center p-2 rounded ${getSeverityColor(level)}`}>
                        <p className="text-xl font-bold">{count}</p>
                        <p className="text-xs capitalize">{level}</p>
                      </div>
                    ))}
                  </div>
                  
                  {fleetOverview.recommendations?.filter(r => r).length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Recommendations:</h5>
                      {fleetOverview.recommendations.filter(r => r).map((rec, i) => (
                        <p key={i} className="text-sm text-blue-700">✓ {rec}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Threat Tracking Tab */}
      {activeTab === 'threat-track' && threatDashboard && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{threatDashboard.summary?.total_active || 0}</p>
                  <p className="text-xs text-gray-500">Active Threats</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{threatDashboard.summary?.total_resolved || 0}</p>
                  <p className="text-xs text-gray-500">Resolved</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{threatDashboard.summary?.resolution_rate || 0}%</p>
                  <p className="text-xs text-gray-500">Resolution Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* By Severity */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Threats by Severity</h3>
            <div className="grid grid-cols-4 gap-4">
              {['critical', 'high', 'medium', 'low'].map((severity) => (
                <div key={severity} className={`text-center p-4 rounded-lg ${getSeverityColor(severity)}`}>
                  <p className="text-3xl font-bold">{threatDashboard.by_severity?.[severity] || 0}</p>
                  <p className="text-sm capitalize">{severity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* By Type */}
          {Object.keys(threatDashboard.by_type || {}).length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Threats by Type</h3>
              <div className="space-y-2">
                {Object.entries(threatDashboard.by_type || {}).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize">{type.replace('_', ' ')}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Threats */}
          {threatDashboard.recent_threats?.length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Threats</h3>
              <div className="space-y-3">
                {threatDashboard.recent_threats.map((threat) => (
                  <div key={threat.id} className={`p-4 rounded-lg border ${getSeverityColor(threat.severity)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{threat.threat_type?.replace('_', ' ')}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(threat.severity)}`}>
                        {threat.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Vehicle: {threat.vehicle_id}</p>
                    <p className="text-xs text-gray-500 mt-1">Source: {threat.source}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedAutomotiveSecurity;
