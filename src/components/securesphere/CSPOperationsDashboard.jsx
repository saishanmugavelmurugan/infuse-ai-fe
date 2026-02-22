import React, { useState, useEffect } from 'react';
import {
  Building2, Radio, Shield, Activity, Users, Database, Settings, RefreshCw,
  Globe, Server, Wifi, Zap, TrendingUp, AlertTriangle, CheckCircle, Clock,
  DollarSign, FileText, Key, Lock, Eye, BarChart3, PieChart, Layers,
  Smartphone, ScanLine, Network, ChevronRight, Plus, Search, Filter,
  XCircle, Copy, Download, Upload, Play, Pause, AlertCircle, Target,
  Cpu, HardDrive, Signal, MapPin, Calendar, CreditCard, Receipt
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Helper to get CSP ID
const getCspId = () => {
  let cspId = sessionStorage.getItem('csp_id');
  if (!cspId) {
    cspId = `csp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('csp_id', cspId);
  }
  return cspId;
};

const CSPOperationsDashboard = () => {
  const { user } = useAuth() || {};
  const cspId = getCspId();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [slaData, setSlaData] = useState(null);
  const [billingData, setBillingData] = useState(null);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [ranStatus, setRanStatus] = useState(null);
  const [usageData, setUsageData] = useState(null);

  // Demo CSP data
  const [demoCsp, setDemoCsp] = useState({
    id: cspId,
    company_name: 'TelecomCorp International',
    white_label_mode: 'full_white_label',
    integration_type: 'api_key'
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        realtimeRes,
        anomaliesRes,
        deploymentRes
      ] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/csp-operations/analytics/real-time/${cspId}`),
        fetch(`${API_URL}/api/securesphere/csp-operations/anomalies/${cspId}`),
        fetch(`${API_URL}/api/securesphere/csp-operations/deployment/status/${cspId}`)
      ]);

      setRealTimeData(await realtimeRes.json());
      setAnomalies(await anomaliesRes.json());
      setDeploymentStatus(await deploymentRes.json());

      // Generate demo dashboard data
      setDashboard({
        summary: {
          total_customers: 45,
          total_esim_profiles: 125000,
          active_policies: 28,
          ran_configurations: 3,
          total_devices: 89500,
          total_data_tb: 245.8
        },
        health: {
          platform_status: 'operational',
          api_latency_ms: 12,
          uptime_percent: 99.97
        }
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async (tab) => {
    try {
      switch (tab) {
        case 'customers':
          const custRes = await fetch(`${API_URL}/api/securesphere/csp-operations/customers/${cspId}`);
          const custData = await custRes.json();
          setCustomers(custData.customers || []);
          break;
        case 'sla':
          const slaRes = await fetch(`${API_URL}/api/securesphere/csp-operations/sla/dashboard/${cspId}`);
          setSlaData(await slaRes.json());
          break;
        case 'billing':
          const billRes = await fetch(`${API_URL}/api/securesphere/csp-operations/billing/report/${cspId}`);
          setBillingData(await billRes.json());
          break;
        case 'policies':
          const polRes = await fetch(`${API_URL}/api/securesphere/csp-operations/policies/${cspId}`);
          const polData = await polRes.json();
          setPolicies(polData.policies || []);
          break;
        case 'usage':
          const usageRes = await fetch(`${API_URL}/api/securesphere/csp-operations/usage/${cspId}`);
          setUsageData(await usageRes.json());
          break;
        case 'ran':
          const ranRes = await fetch(`${API_URL}/api/securesphere/csp-operations/ran/status/${cspId}`);
          setRanStatus(await ranRes.json());
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching tab data:', error);
    }
  };

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'realtime', name: 'Real-Time Analytics', icon: Activity },
    { id: 'anomalies', name: 'Anomaly Detection', icon: AlertTriangle },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'ran', name: 'RAN Sync', icon: Radio },
    { id: 'esim', name: 'eSIM Provisioning', icon: Smartphone },
    { id: 'policies', name: 'Policies', icon: Shield },
    { id: 'usage', name: 'Usage Control', icon: Database },
    { id: 'sla', name: 'SLA Monitoring', icon: Target },
    { id: 'billing', name: 'Billing', icon: Receipt }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Building2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">CSP Operations Center</h2>
              <p className="text-gray-600">{demoCsp.company_name} • {demoCsp.white_label_mode === 'full_white_label' ? 'White-Label' : 'Powered By'}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAllData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </Button>
        </div>
      </div>

      {/* Platform Health Banner */}
      {dashboard && (
        <div className={`p-4 rounded-xl flex items-center justify-between ${
          dashboard.health?.platform_status === 'operational' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle className={`h-5 w-5 ${dashboard.health?.platform_status === 'operational' ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`font-medium ${dashboard.health?.platform_status === 'operational' ? 'text-green-700' : 'text-red-700'}`}>
              Platform Status: {dashboard.health?.platform_status?.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>API Latency: {dashboard.health?.api_latency_ms}ms</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span>Uptime: {dashboard.health?.uptime_percent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboard.summary?.total_customers}</p>
                <p className="text-xs text-gray-500">Enterprise Customers</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboard.summary?.total_esim_profiles)}</p>
                <p className="text-xs text-gray-500">eSIM Profiles</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Cpu className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboard.summary?.total_devices)}</p>
                <p className="text-xs text-gray-500">Connected Devices</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboard.summary?.active_policies}</p>
                <p className="text-xs text-gray-500">Active Policies</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Radio className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboard.summary?.ran_configurations}</p>
                <p className="text-xs text-gray-500">RAN Configs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Database className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboard.summary?.total_data_tb} TB</p>
                <p className="text-xs text-gray-500">Data Processed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex gap-1 border-b overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-t-lg whitespace-nowrap transition-all text-sm ${
              activeTab === tab.id
                ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="font-medium">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agentless Deployment Status */}
            {deploymentStatus && (
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Server className="h-5 w-5 text-indigo-500" />
                  Agentless Deployment Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-700">Deployment Type</span>
                    <span className="text-green-800 font-mono text-sm">{deploymentStatus.deployment_type}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(deploymentStatus.integration_points || {}).map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase">{key.replace('_', ' ')}</p>
                        <p className="font-medium text-gray-900">{value.status}</p>
                        {value.throughput_gbps && (
                          <p className="text-xs text-gray-500">{value.throughput_gbps} Gbps</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="font-medium text-indigo-700 mb-2">Coverage</p>
                    <div className="flex justify-between text-sm">
                      <span>Cells Covered</span>
                      <span className="font-medium">{deploymentStatus.coverage?.covered_cells?.toLocaleString()} / {deploymentStatus.coverage?.total_cells?.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${deploymentStatus.coverage?.coverage_percent || 0}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-indigo-600 mt-1">{deploymentStatus.coverage?.coverage_percent}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Benefits */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Platform Benefits
              </h3>
              <div className="space-y-3">
                {deploymentStatus?.benefits?.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border shadow-sm p-6 lg:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 border rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all text-left">
                  <Smartphone className="h-8 w-8 text-indigo-500 mb-2" />
                  <p className="font-medium text-sm">Provision eSIMs</p>
                  <p className="text-xs text-gray-500">Zero-touch setup</p>
                </button>
                <button className="p-4 border rounded-xl hover:bg-green-50 hover:border-green-200 transition-all text-left">
                  <Radio className="h-8 w-8 text-green-500 mb-2" />
                  <p className="font-medium text-sm">Sync RAN</p>
                  <p className="text-xs text-gray-500">Trigger sync</p>
                </button>
                <button className="p-4 border rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all text-left">
                  <Shield className="h-8 w-8 text-orange-500 mb-2" />
                  <p className="font-medium text-sm">Create Policy</p>
                  <p className="text-xs text-gray-500">Automated rules</p>
                </button>
                <button className="p-4 border rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all text-left">
                  <Users className="h-8 w-8 text-purple-500 mb-2" />
                  <p className="font-medium text-sm">Add Customer</p>
                  <p className="text-xs text-gray-500">Multi-tenant</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REAL-TIME ANALYTICS TAB */}
        {activeTab === 'realtime' && realTimeData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <p className="text-blue-100 text-sm">Active Devices</p>
                <p className="text-3xl font-bold">{formatNumber(realTimeData.summary?.active_devices)}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                <p className="text-green-100 text-sm">Active Sessions</p>
                <p className="text-3xl font-bold">{formatNumber(realTimeData.summary?.active_sessions)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <p className="text-purple-100 text-sm">Throughput</p>
                <p className="text-3xl font-bold">{realTimeData.summary?.throughput_gbps} Gbps</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <p className="text-orange-100 text-sm">Packets/sec</p>
                <p className="text-3xl font-bold">{formatNumber(realTimeData.summary?.packets_per_second)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic by Protocol */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Traffic by Protocol</h3>
                <div className="space-y-3">
                  {Object.entries(realTimeData.traffic_by_protocol || {}).map(([protocol, data]) => (
                    <div key={protocol}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="uppercase font-medium">{protocol}</span>
                        <span>{data.percent}% ({data.bytes_gb} GB)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            protocol === 'tcp' ? 'bg-blue-500' :
                            protocol === 'udp' ? 'bg-green-500' :
                            protocol === 'icmp' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${data.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Ports */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Top Ports</h3>
                <div className="space-y-3">
                  {realTimeData.top_ports?.map((port, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm bg-gray-200 px-2 py-0.5 rounded">{port.port}</span>
                        <span className="text-sm font-medium">{port.protocol}</span>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{formatNumber(port.connections)} conn</p>
                        <p className="text-gray-500">{port.bytes_gb} GB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
                <div className="space-y-3">
                  {realTimeData.geographic_distribution?.map((region, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{region.region}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{formatNumber(region.devices)} devices</span>
                        <span className="text-sm font-medium w-12 text-right">{region.traffic_percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Types */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Device Types</h3>
                <div className="space-y-3">
                  {realTimeData.device_types?.map((device, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{device.type}</span>
                      <div className="text-right text-sm">
                        <p>{formatNumber(device.count)} devices</p>
                        <p className="text-gray-500">{device.data_gb} GB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANOMALY DETECTION TAB */}
        {activeTab === 'anomalies' && anomalies && (
          <div className="space-y-6">
            {/* Severity Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">Critical</p>
                <p className="text-3xl font-bold text-red-700">{anomalies.by_severity?.critical || 0}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-orange-600 text-sm">High</p>
                <p className="text-3xl font-bold text-orange-700">{anomalies.by_severity?.high || 0}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-600 text-sm">Medium</p>
                <p className="text-3xl font-bold text-yellow-700">{anomalies.by_severity?.medium || 0}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-600 text-sm">Low</p>
                <p className="text-3xl font-bold text-blue-700">{anomalies.by_severity?.low || 0}</p>
              </div>
            </div>

            {/* Anomaly List */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Detected Anomalies ({anomalies.total_anomalies})
              </h3>
              <div className="space-y-3">
                {anomalies.anomalies?.map((anomaly) => (
                  <div 
                    key={anomaly.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      anomaly.severity === 'critical' ? 'bg-red-50 border-red-500' :
                      anomaly.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                      anomaly.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{anomaly.type.replace(/_/g, ' ').toUpperCase()}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            anomaly.severity === 'critical' ? 'bg-red-200 text-red-700' :
                            anomaly.severity === 'high' ? 'bg-orange-200 text-orange-700' :
                            anomaly.severity === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                            'bg-blue-200 text-blue-700'
                          }`}>
                            {anomaly.severity}
                          </span>
                          <span className="text-xs text-gray-500">{anomaly.category}</span>
                        </div>
                        <p className="text-sm text-gray-600">Affected devices: {anomaly.affected_devices}</p>
                        {anomaly.ioc_indicators?.ip_addresses?.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            IoC IPs: {anomaly.ioc_indicators.ip_addresses.slice(0, 3).join(', ')}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        anomaly.status === 'active' ? 'bg-red-100 text-red-700' :
                        anomaly.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {anomaly.status}
                      </span>
                    </div>
                    {anomaly.recommended_actions?.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700">Recommended Actions:</p>
                        <ul className="text-xs text-gray-600 mt-1">
                          {anomaly.recommended_actions.map((action, idx) => (
                            <li key={idx}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLA MONITORING TAB */}
        {activeTab === 'sla' && (
          <div className="space-y-6">
            {slaData ? (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-green-700">{slaData.compliant}</p>
                    <p className="text-green-600 text-sm">Compliant</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-red-700">{slaData.breached}</p>
                    <p className="text-red-600 text-sm">Breached</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-700">{slaData.avg_sla_score}%</p>
                    <p className="text-blue-600 text-sm">Avg SLA Score</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">SLA Status by Customer</h3>
                  <div className="space-y-3">
                    {slaData.sla_details?.map((sla) => (
                      <div key={sla.sla_id} className={`p-4 rounded-lg border ${
                        sla.overall_status === 'compliant' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{sla.customer_name}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            sla.overall_status === 'compliant' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                          }`}>
                            {sla.overall_status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-xs">
                          {Object.entries(sla.compliance_details || {}).map(([key, value]) => (
                            <div key={key} className={`p-2 rounded text-center ${value ? 'bg-green-100' : 'bg-red-100'}`}>
                              <p className={value ? 'text-green-700' : 'text-red-700'}>{key.replace('_', ' ')}</p>
                              <p className="font-medium">{value ? '✓' : '✗'}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                          <span>SLA Score: {sla.sla_score}%</span>
                          <span>Uptime: {sla.current_performance?.uptime_percent}%</span>
                          <span>Latency: {sla.current_performance?.avg_latency_ms}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Loading SLA data...</p>
              </div>
            )}
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {billingData ? (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <DollarSign className="h-8 w-8 mb-2" />
                    <p className="text-green-100 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold">${billingData.total_revenue?.toLocaleString()}</p>
                    <p className="text-green-100 text-xs">{billingData.billing_period}</p>
                  </div>
                  <div className="bg-white rounded-xl border shadow-sm p-6">
                    <Users className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-gray-500 text-sm">Billing Customers</p>
                    <p className="text-3xl font-bold text-gray-900">{billingData.total_customers}</p>
                  </div>
                  <div className="bg-white rounded-xl border shadow-sm p-6">
                    <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                    <p className="text-gray-500 text-sm">Avg Revenue/Customer</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${Math.round(billingData.total_revenue / Math.max(1, billingData.total_customers)).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Customer Billing Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">Customer</th>
                          <th className="text-left py-2 px-3">Tier</th>
                          <th className="text-right py-2 px-3">Devices</th>
                          <th className="text-right py-2 px-3">Data (GB)</th>
                          <th className="text-right py-2 px-3">Base Fee</th>
                          <th className="text-right py-2 px-3">Usage</th>
                          <th className="text-right py-2 px-3 font-bold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billingData.billing_items?.map((item) => (
                          <tr key={item.customer_id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-3 font-medium">{item.customer_name}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                item.subscription_tier === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                                item.subscription_tier === 'standard' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.subscription_tier}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right">{item.usage?.devices?.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right">{item.usage?.data_gb}</td>
                            <td className="py-2 px-3 text-right">${item.charges?.base_fee}</td>
                            <td className="py-2 px-3 text-right">${(item.charges?.device_charges + item.charges?.data_charges).toFixed(2)}</td>
                            <td className="py-2 px-3 text-right font-bold">${item.charges?.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Loading billing data...</p>
              </div>
            )}
          </div>
        )}

        {/* Other tabs with placeholder content */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Enterprise Customers</h3>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
            {customers.length > 0 ? (
              <div className="space-y-3">
                {customers.map((customer) => (
                  <div key={customer.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{customer.customer_name}</p>
                        <p className="text-sm text-gray-500">{customer.industry} • {customer.customer_domain}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {customer.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No customers yet. Add your first enterprise customer.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ran' && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">RAN Synchronization</h3>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Add RAN Config
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['4G LTE', '5G NR', '5G SA'].map((type, idx) => (
                <div key={idx} className="p-4 border rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Radio className="h-6 w-6 text-cyan-500" />
                    <span className="font-medium">{type}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Vendor</span>
                      <span>Ericsson</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="text-green-600">Synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Sync</span>
                      <span>2 min ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'esim' && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Zero-Touch eSIM Provisioning</h3>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Provision eSIM
                </Button>
              </div>
            </div>
            <div className="text-center py-12 text-gray-500">
              <Smartphone className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">Zero-Touch eSIM Provisioning</p>
              <p className="text-sm">Provision eSIMs instantly without device-side configuration</p>
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Automated Policy Enforcement</h3>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </div>
            {policies.length > 0 ? (
              <div className="space-y-3">
                {policies.map((policy) => (
                  <div key={policy.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{policy.rule_name}</p>
                        <p className="text-sm text-gray-500">{policy.rule_type}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        policy.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {policy.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No policies configured. Create automated enforcement rules.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Data Usage Control & Overage Prevention</h3>
            {usageData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-blue-700">{usageData.total_customers}</p>
                    <p className="text-blue-600 text-sm">Total Customers</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-red-700">{usageData.customers_at_risk}</p>
                    <p className="text-red-600 text-sm">At Overage Risk</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-green-700">{usageData.total_data_used_gb} GB</p>
                    <p className="text-green-600 text-sm">Total Data Used</p>
                  </div>
                </div>
                {usageData.usage_details?.map((usage) => (
                  <div key={usage.customer_id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{usage.customer_name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        usage.overage_risk === 'critical' ? 'bg-red-100 text-red-700' :
                        usage.overage_risk === 'high' ? 'bg-orange-100 text-orange-700' :
                        usage.overage_risk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {usage.overage_risk} risk
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            usage.usage_percent > 90 ? 'bg-red-500' :
                            usage.usage_percent > 75 ? 'bg-orange-500' :
                            usage.usage_percent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, usage.usage_percent)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-16 text-right">{usage.usage_percent}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {usage.data_used_gb} GB / {usage.data_limit_gb} GB • {usage.devices_active} devices
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Loading usage data...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CSPOperationsDashboard;
