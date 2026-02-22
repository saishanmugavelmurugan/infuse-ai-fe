import React, { useState, useEffect } from 'react';
import {
  Shield, Wifi, Lock, Eye, AlertTriangle, CheckCircle,
  TrendingUp, Server, Globe, Zap, Radio, Activity,
  DollarSign, FileText, Search, RefreshCw, ChevronRight,
  BarChart3, PieChart, Target, Cpu, Network, Layers
} from 'lucide-react';

const IoT5GSecurityDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/securesphere/5g-iot/dashboard/single-source-of-truth?organization_id=default&time_range=${timeRange}`
      );
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, subValue, trend, color = 'orange' }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-100 text-green-700' :
            trend === 'down' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {subValue}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );

  const ComplianceCard = ({ standard, data }) => (
    <div className={`p-4 rounded-lg border-2 ${
      data.compliant ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{standard}</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          data.compliant ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
        }`}>
          {data.score}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${data.compliant ? 'bg-green-500' : 'bg-yellow-500'}`}
          style={{ width: `${data.score}%` }}
        />
      </div>
      {data.gaps && (
        <p className="text-xs text-yellow-700 mt-2">{data.gaps} gaps to address</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-orange-500" />
            5G-IoT Security Command Center
          </h1>
          <p className="text-gray-600 mt-1">
            Single source of truth for network visibility, compliance, and threat detection
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="1h">Last 1 Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button 
            onClick={fetchDashboardData}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'network', label: 'Network Visibility', icon: Network },
          { id: 'threats', label: 'Threat Detection', icon: AlertTriangle },
          { id: 'compliance', label: 'Compliance', icon: FileText },
          { id: 'costs', label: 'Cost Analysis', icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-orange-500 text-orange-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              icon={Server}
              label="Total Devices"
              value={dashboardData.device_overview?.total_devices || 0}
              subValue={`${dashboardData.device_overview?.active_devices || 0} active`}
              color="orange"
            />
            <StatCard
              icon={Shield}
              label="Security Score"
              value={`${dashboardData.security_posture?.overall_score || 0}%`}
              subValue="Good"
              trend="up"
              color="green"
            />
            <StatCard
              icon={AlertTriangle}
              label="Active Threats"
              value={dashboardData.security_posture?.threats_detected - dashboardData.security_posture?.threats_mitigated || 0}
              subValue={`${dashboardData.security_posture?.threats_mitigated || 0} mitigated`}
              color="red"
            />
            <StatCard
              icon={FileText}
              label="Compliance Score"
              value={`${dashboardData.compliance_status?.overall_score || 0}%`}
              subValue="Compliant"
              color="blue"
            />
          </div>

          {/* Network Health & Security */}
          <div className="grid grid-cols-2 gap-6">
            {/* Network Health */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-orange-500" />
                Network Health
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overall Score</span>
                  <span className="text-2xl font-bold text-green-600">
                    {dashboardData.network_health?.overall_score}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Latency</p>
                    <p className="font-semibold">{dashboardData.network_health?.latency_avg_ms}ms</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Packet Loss</p>
                    <p className="font-semibold">{dashboardData.network_health?.packet_loss_percent}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Encrypted Traffic</p>
                    <p className="font-semibold text-green-600">{dashboardData.network_health?.encrypted_traffic_percent}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">5G Coverage</p>
                    <p className="font-semibold">{dashboardData.network_health?.['5g_coverage_percent']}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Device Risk Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Device Risk Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(dashboardData.device_overview?.devices_by_risk || {}).map(([level, count]) => (
                  <div key={level} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      level === 'critical' ? 'bg-red-500' :
                      level === 'high' ? 'bg-orange-500' :
                      level === 'medium' ? 'bg-yellow-500' :
                      level === 'low' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <span className="text-gray-600 capitalize flex-1">{level}</span>
                    <span className="font-semibold">{count}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          level === 'critical' ? 'bg-red-500' :
                          level === 'high' ? 'bg-orange-500' :
                          level === 'medium' ? 'bg-yellow-500' :
                          level === 'low' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(count / dashboardData.device_overview.total_devices) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-orange-500" />
              Regulatory Compliance Status
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(dashboardData.compliance_status?.standards || {}).map(([standard, data]) => (
                <ComplianceCard key={standard} standard={standard.replace(/_/g, ' ')} data={data} />
              ))}
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                {dashboardData.compliance_status?.potential_penalty_exposure}
              </p>
            </div>
          </div>

          {/* Zero Blind Spots */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Zero Blind Spots Coverage
                </h3>
                <p className="text-orange-100 mt-1">Complete visibility across your IoT infrastructure</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{dashboardData.blind_spots_analysis?.coverage_percent}%</p>
                <p className="text-orange-100">Network Coverage</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-2xl font-bold">{dashboardData.blind_spots_analysis?.unmonitored_segments}</p>
                <p className="text-sm text-orange-100">Unmonitored Segments</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-2xl font-bold">{dashboardData.blind_spots_analysis?.shadow_iot_detected}</p>
                <p className="text-sm text-orange-100">Shadow IoT Detected</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-2xl font-bold">
                  {dashboardData.blind_spots_analysis?.recommendations?.length || 0}
                </p>
                <p className="text-sm text-orange-100">Recommendations</p>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              Cost Overview
            </h3>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{dashboardData.cost_metrics?.monthly_total}</p>
                <p className="text-sm text-gray-600">Monthly Total</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-xl font-bold text-blue-600">{dashboardData.cost_metrics?.bandwidth_cost}</p>
                <p className="text-sm text-gray-600">Bandwidth</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-xl font-bold text-purple-600">{dashboardData.cost_metrics?.storage_cost}</p>
                <p className="text-sm text-gray-600">Storage</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-xl font-bold text-green-600">{dashboardData.cost_metrics?.compute_cost}</p>
                <p className="text-sm text-gray-600">Compute</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-xl font-bold text-orange-600">{dashboardData.cost_metrics?.projected_savings}</p>
                <p className="text-sm text-gray-600">Potential Savings</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Visibility Tab */}
      {activeTab === 'network' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4">Deep Network Visibility</h3>
          <p className="text-gray-600">Real-time packet inspection, protocol analysis, and 5G slice monitoring.</p>
          {/* Add more network visibility content here */}
        </div>
      )}

      {/* Threats Tab */}
      {activeTab === 'threats' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4">AI-Powered Threat Detection</h3>
          <p className="text-gray-600">Real-time breach detection with ML-powered anomaly analysis.</p>
          {/* Add threat detection content here */}
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4">Regulatory Compliance</h3>
          <p className="text-gray-600">ETSI EN 303 645, UK PSTI Act, EU Cyber Resilience Act compliance.</p>
          {/* Add compliance content here */}
        </div>
      )}

      {/* Costs Tab */}
      {activeTab === 'costs' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4">Cost Analysis & Optimization</h3>
          <p className="text-gray-600">Identify cost overruns and optimization opportunities.</p>
          {/* Add cost analysis content here */}
        </div>
      )}
    </div>
  );
};

export default IoT5GSecurityDashboard;
