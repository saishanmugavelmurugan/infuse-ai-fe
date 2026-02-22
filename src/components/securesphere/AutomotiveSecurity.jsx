import React, { useState, useEffect } from 'react';
import {
  Car, Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Plus, Activity, Wifi, Battery, Cpu, Radio, MapPin, Lock,
  ChevronDown, ChevronUp, Zap, Server, Eye, Settings, Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AutomotiveSecurity = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [vehicles, setVehicles] = useState([]);
  const [threatCategories, setThreatCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCANModal, setShowCANModal] = useState(false);
  const [showOTAModal, setShowOTAModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [canAnalysisResult, setCanAnalysisResult] = useState(null);
  const [otaResult, setOtaResult] = useState(null);

  const [vehicleForm, setVehicleForm] = useState({
    vin: '',
    vehicle_type: 'bev',
    manufacturer: '',
    model: '',
    year: new Date().getFullYear(),
    owner_id: 'demo-user-001',
    telematics_provider: '',
    connectivity_type: '4g'
  });

  const [canForm, setCanForm] = useState({
    vehicle_id: '',
    can_messages: [],
    ecu_source: 'diagnostic_tool'
  });

  const [otaForm, setOtaForm] = useState({
    vehicle_id: '',
    update_hash: '',
    update_version: '',
    update_size: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, statsRes, vehiclesRes] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/automotive/threat-categories`),
        fetch(`${API_URL}/api/securesphere/automotive/stats`),
        fetch(`${API_URL}/api/securesphere/automotive/vehicles/owner/demo-user-001`)
      ]);
      
      const categoriesData = await categoriesRes.json();
      const statsData = await statsRes.json();
      const vehiclesData = await vehiclesRes.json();
      
      setThreatCategories(categoriesData.categories || []);
      setStats(statsData);
      setVehicles(vehiclesData.vehicles || []);
    } catch (error) {
      console.error('Error fetching automotive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/securesphere/automotive/vehicles/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleForm)
      });
      if (response.ok) {
        setShowRegisterModal(false);
        fetchData();
        setVehicleForm({
          vin: '',
          vehicle_type: 'bev',
          manufacturer: '',
          model: '',
          year: new Date().getFullYear(),
          owner_id: 'demo-user-001',
          telematics_provider: '',
          connectivity_type: '4g'
        });
      }
    } catch (error) {
      console.error('Error registering vehicle:', error);
    }
  };

  const analyzeCANBus = async (e) => {
    e.preventDefault();
    try {
      // Generate some sample CAN messages for demo
      const sampleMessages = [
        { id: '0x7DF', data: 'deadbeef', timestamp: new Date().toISOString() },
        { id: '0x7E0', data: '02014100', timestamp: new Date().toISOString() },
        { id: '0x100', data: 'normal123', timestamp: new Date().toISOString() },
        { id: '0x200', data: 'engine001', timestamp: new Date().toISOString() },
        { id: '0x300', data: 'brake0001', timestamp: new Date().toISOString() }
      ];

      const response = await fetch(`${API_URL}/api/securesphere/automotive/can-bus/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: canForm.vehicle_id || selectedVehicle?.id,
          can_messages: sampleMessages,
          ecu_source: canForm.ecu_source
        })
      });
      const data = await response.json();
      setCanAnalysisResult(data);
    } catch (error) {
      console.error('Error analyzing CAN bus:', error);
    }
  };

  const verifyOTAUpdate = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams({
        vehicle_id: otaForm.vehicle_id || selectedVehicle?.id,
        update_hash: otaForm.update_hash || 'a'.repeat(64),
        update_version: otaForm.update_version || '2024.12.1',
        update_size: otaForm.update_size || 500000000
      });

      const response = await fetch(
        `${API_URL}/api/securesphere/automotive/ota/verify?${params}`,
        { method: 'POST' }
      );
      const data = await response.json();
      setOtaResult(data);
    } catch (error) {
      console.error('Error verifying OTA update:', error);
    }
  };

  const vehicleTypes = {
    ice: { name: 'ICE', full: 'Internal Combustion', icon: '⛽' },
    bev: { name: 'BEV', full: 'Battery Electric', icon: '🔋' },
    phev: { name: 'PHEV', full: 'Plug-in Hybrid', icon: '🔌' },
    hev: { name: 'HEV', full: 'Hybrid Electric', icon: '♻️' },
    fcev: { name: 'FCEV', full: 'Fuel Cell', icon: '💧' }
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
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'vehicles', name: 'Vehicles', icon: Car },
    { id: 'threats', name: 'Threat Categories', icon: AlertTriangle },
    { id: 'diagnostics', name: 'Diagnostics', icon: Cpu }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Automotive Security</h2>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              ENTERPRISE
            </span>
          </div>
          <p className="text-gray-600">Connected vehicle security for OEMs and fleet operators</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowRegisterModal(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Register Vehicle
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
                ? 'bg-red-100 text-red-700'
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
                <div className="p-2 bg-red-100 rounded-lg">
                  <Car className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_vehicles_protected || 0}</p>
                  <p className="text-xs text-gray-500">Vehicles Protected</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_security_events || 0}</p>
                  <p className="text-xs text-gray-500">Security Events</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.critical_events || 0}</p>
                  <p className="text-xs text-gray-500">Critical Events</p>
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
                    {Object.keys(stats.by_vehicle_type || {}).length}
                  </p>
                  <p className="text-xs text-gray-500">Vehicle Types</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Types Breakdown */}
          {Object.keys(stats.by_vehicle_type || {}).length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Vehicles by Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(stats.by_vehicle_type || {}).map(([type, count]) => (
                  <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{vehicleTypes[type]?.icon || '🚗'}</span>
                    <p className="text-lg font-bold text-gray-900 mt-2">{count}</p>
                    <p className="text-xs text-gray-500">{vehicleTypes[type]?.name || type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Features */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Protection Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                <span className="text-sm">CAN Bus Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5" />
                <span className="text-sm">Telematics Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm">OTA Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="text-sm">GPS Integrity</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          {vehicles.length === 0 ? (
            <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
              <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="font-medium text-gray-700">No vehicles registered</h4>
              <p className="text-sm text-gray-500 mt-1">Register your first connected vehicle</p>
              <Button onClick={() => setShowRegisterModal(true)} className="mt-4 bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Register Vehicle
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <Car className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {vehicle.manufacturer} {vehicle.model}
                        </h4>
                        <p className="text-sm text-gray-500">{vehicle.year}</p>
                      </div>
                    </div>
                    <span className="text-2xl">{vehicleTypes[vehicle.vehicle_type]?.icon || '🚗'}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Type</p>
                      <p className="text-sm font-medium text-gray-700">
                        {vehicleTypes[vehicle.vehicle_type]?.full || vehicle.vehicle_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Connectivity</p>
                      <p className="text-sm font-medium text-gray-700 uppercase">{vehicle.connectivity_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Security Score</p>
                      <p className={`text-sm font-bold ${
                        vehicle.security_score >= 80 ? 'text-green-600' :
                        vehicle.security_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{vehicle.security_score || 100}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Threat Level</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        vehicle.threat_level === 'low' ? 'bg-green-100 text-green-700' :
                        vehicle.threat_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        vehicle.threat_level === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>{vehicle.threat_level || 'low'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowCANModal(true);
                      }}
                    >
                      <Cpu className="h-4 w-4 mr-1" />
                      CAN Analysis
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowOTAModal(true);
                      }}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      OTA Verify
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Threat Categories Tab */}
      {activeTab === 'threats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threatCategories.map((category) => (
            <div key={category.id} className={`bg-white rounded-xl border shadow-sm p-6 ${getSeverityColor(category.severity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-6 w-6 ${
                    category.severity === 'critical' ? 'text-red-600' :
                    category.severity === 'high' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize mt-1 ${getSeverityColor(category.severity)}`}>
                      {category.severity}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Affected Systems</p>
                <div className="flex flex-wrap gap-2">
                  {category.affected_systems?.map((system) => (
                    <span key={system} className="px-2 py-1 bg-white/50 text-gray-700 text-xs rounded-full border">
                      {system}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Diagnostics Tab */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CAN Bus Analysis */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Cpu className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">CAN Bus Analysis</h3>
                  <p className="text-sm text-gray-500">Detect injection attacks and anomalies</p>
                </div>
              </div>
              
              <form onSubmit={analyzeCANBus} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                  <select
                    value={canForm.vehicle_id}
                    onChange={(e) => setCanForm({ ...canForm, vehicle_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.manufacturer} {v.model} ({v.year})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ECU Source</label>
                  <select
                    value={canForm.ecu_source}
                    onChange={(e) => setCanForm({ ...canForm, ecu_source: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="diagnostic_tool">Diagnostic Tool</option>
                    <option value="obd_port">OBD-II Port</option>
                    <option value="telematics">Telematics Unit</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Run Analysis
                </Button>
              </form>
              
              {canAnalysisResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Threat Level</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                      canAnalysisResult.threat_level === 'none' ? 'bg-green-100 text-green-700' :
                      canAnalysisResult.threat_level === 'low' ? 'bg-yellow-100 text-yellow-700' :
                      canAnalysisResult.threat_level === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>{canAnalysisResult.threat_level}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Analyzed {canAnalysisResult.messages_analyzed} messages, 
                    found {canAnalysisResult.anomalies_detected} anomalies
                  </p>
                  {canAnalysisResult.anomalies?.length > 0 && (
                    <div className="mt-2">
                      {canAnalysisResult.anomalies.map((a, i) => (
                        <p key={i} className="text-xs text-red-600">⚠️ {a.description}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* OTA Verification */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">OTA Update Verification</h3>
                  <p className="text-sm text-gray-500">Verify update integrity before installation</p>
                </div>
              </div>
              
              <form onSubmit={verifyOTAUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                  <select
                    value={otaForm.vehicle_id}
                    onChange={(e) => setOtaForm({ ...otaForm, vehicle_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.manufacturer} {v.model} ({v.year})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Version</label>
                  <input
                    type="text"
                    value={otaForm.update_version}
                    onChange={(e) => setOtaForm({ ...otaForm, update_version: e.target.value })}
                    placeholder="e.g., 2024.12.1"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Verify Update
                </Button>
              </form>
              
              {otaResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {otaResult.verification_passed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      otaResult.verification_passed ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {otaResult.verification_passed ? 'Verification Passed' : 'Verification Failed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{otaResult.recommendation}</p>
                  <div className="mt-2 space-y-1">
                    {Object.entries(otaResult.checks || {}).map(([check, passed]) => (
                      <div key={check} className="flex items-center gap-2 text-xs">
                        {passed ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-gray-600 capitalize">{check.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Register Vehicle Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Register Connected Vehicle</h3>
            </div>
            <form onSubmit={registerVehicle} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                <input
                  type="text"
                  required
                  value={vehicleForm.vin}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, vin: e.target.value })}
                  placeholder="Vehicle Identification Number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.manufacturer}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, manufacturer: e.target.value })}
                    placeholder="e.g., Tesla"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    placeholder="e.g., Model 3"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, year: parseInt(e.target.value) })}
                    min="2015"
                    max="2030"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select
                    value={vehicleForm.vehicle_type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    {Object.entries(vehicleTypes).map(([key, val]) => (
                      <option key={key} value={key}>{val.icon} {val.full}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Connectivity</label>
                  <select
                    value={vehicleForm.connectivity_type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, connectivity_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="4g">4G LTE</option>
                    <option value="5g">5G</option>
                    <option value="wifi">WiFi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telematics</label>
                  <input
                    type="text"
                    value={vehicleForm.telematics_provider}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, telematics_provider: e.target.value })}
                    placeholder="e.g., OnStar"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowRegisterModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  Register Vehicle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomotiveSecurity;
