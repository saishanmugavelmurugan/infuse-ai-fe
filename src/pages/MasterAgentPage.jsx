import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Brain, Activity, Shield, AlertTriangle, CheckCircle,
  RefreshCw, Bell, Zap, Server, Database, TrendingUp, Clock,
  AlertCircle, Wrench, Eye, BarChart3
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const MasterAgentPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [selfHealing, setSelfHealing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    try {
      const [dashboardRes, metricsRes, kpisRes, alertsRes, anomaliesRes, selfHealingRes] = await Promise.all([
        fetch(`${API_BASE}/api/agents/master/dashboard/summary`),
        fetch(`${API_BASE}/api/agents/master/metrics/current`),
        fetch(`${API_BASE}/api/agents/master/kpis`),
        fetch(`${API_BASE}/api/agents/master/alerts`),
        fetch(`${API_BASE}/api/agents/master/anomaly/detect`),
        fetch(`${API_BASE}/api/agents/master/self-healing/suggestions`)
      ]);

      const [dashboardData, metricsData, kpisData, alertsData, anomaliesData, selfHealingData] = await Promise.all([
        dashboardRes.json(),
        metricsRes.json(),
        kpisRes.json(),
        alertsRes.json(),
        anomaliesRes.json(),
        selfHealingRes.json()
      ]);

      setDashboard(dashboardData);
      setMetrics(metricsData);
      setKpis(kpisData);
      setAlerts(alertsData);
      setAnomalies(anomaliesData);
      setSelfHealing(selfHealingData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBg = (status) => {
    const styles = {
      healthy: 'bg-green-500/20 border-green-500/30 text-green-400',
      warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
      critical: 'bg-red-500/20 border-red-500/30 text-red-400',
      degraded: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
    };
    return styles[status] || styles.healthy;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#FF9A3B] animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading Master Agent Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white" data-testid="master-agent-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-[#8B4513]/30 to-slate-900 border-b border-[#FF9A3B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/ai-agents" className="p-2 hover:bg-slate-800 rounded-lg transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="p-2 bg-gradient-to-br from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-xl">
                <Brain className="w-6 h-6 text-[#FF9A3B]" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Master Agent</h1>
                <p className="text-[#FF9A3B] text-sm">Observability & Self-Learning</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg border ${getStatusBg(dashboard?.status)}`}>
                {dashboard?.status?.toUpperCase() || 'UNKNOWN'}
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-[#FF9A3B]/30"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#FF9A3B]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            {['overview', 'kpis', 'alerts', 'self-healing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium transition border-b-2 ${
                  activeTab === tab
                    ? 'border-[#FF9A3B] text-[#FFDA7B]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Health Score Card */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Health Score</span>
                  <Activity className="w-5 h-5 text-[#FFDA7B]" />
                </div>
                <div className={`text-4xl font-bold ${getHealthColor(dashboard?.health_score)}`}>
                  {dashboard?.health_score || 0}%
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">API Latency (p95)</span>
                  <Zap className="w-5 h-5 text-[#FF9A3B]" />
                </div>
                <div className="text-4xl font-bold text-[#FFDA7B]">
                  {dashboard?.metrics_summary?.api_latency || 'N/A'}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Uptime</span>
                  <Server className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-4xl font-bold text-green-400">
                  {dashboard?.metrics_summary?.uptime || 'N/A'}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Active Alerts</span>
                  <Bell className="w-5 h-5 text-[#E55A00]" />
                </div>
                <div className="text-4xl font-bold text-[#E55A00]">
                  {dashboard?.alerts?.total || 0}
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* App Stability */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#FFDA7B]" />
                  App Stability
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Crash Rate</span>
                    <span className={`font-medium ${
                      metrics?.metrics?.app_stability?.crash_rate < 0.1 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metrics?.metrics?.app_stability?.crash_rate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Bug-free Rate</span>
                    <span className="font-medium text-green-400">
                      {metrics?.metrics?.app_stability?.bug_free_rate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Error Count</span>
                    <span className="font-medium">{metrics?.metrics?.app_stability?.error_count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FF9A3B]" />
                  Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Latency p50</span>
                    <span className="font-medium">{metrics?.metrics?.performance?.api_latency_p50 || 0}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Latency p95</span>
                    <span className={`font-medium ${
                      metrics?.metrics?.performance?.api_latency_p95 < 200 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {metrics?.metrics?.performance?.api_latency_p95 || 0}ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">RPS</span>
                    <span className="font-medium">{metrics?.metrics?.performance?.requests_per_second || 0}</span>
                  </div>
                </div>
              </div>

              {/* Booking Reliability */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FFDA7B]" />
                  Booking Reliability
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Success Rate</span>
                    <span className={`font-medium ${
                      metrics?.metrics?.booking_reliability?.booking_success_rate > 99.5 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {metrics?.metrics?.booking_reliability?.booking_success_rate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Payment Success</span>
                    <span className="font-medium text-green-400">
                      {metrics?.metrics?.booking_reliability?.payment_gateway_success || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Abandoned</span>
                    <span className="font-medium">{metrics?.metrics?.booking_reliability?.abandoned_bookings || 0}</span>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#E55A00]" />
                  Security
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Data Breaches</span>
                    <span className={`font-medium ${
                      metrics?.metrics?.security?.data_breaches === 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metrics?.metrics?.security?.data_breaches || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Encryption (Rest)</span>
                    <span className="font-medium text-green-400">
                      {metrics?.metrics?.security?.encryption_at_rest || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Failed Logins</span>
                    <span className="font-medium">{metrics?.metrics?.security?.failed_login_attempts || 0}</span>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FF9A3B]" />
                  Compliance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">HIPAA Score</span>
                    <span className="font-medium text-green-400">
                      {metrics?.metrics?.compliance?.hipaa_score || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">ABDM Score</span>
                    <span className="font-medium text-green-400">
                      {metrics?.metrics?.compliance?.abdm_score || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">GDPR Score</span>
                    <span className="font-medium text-green-400">
                      {metrics?.metrics?.compliance?.gdpr_score || 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Infrastructure */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#FFDA7B]" />
                  Infrastructure
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">CPU Usage</span>
                    <span className={`font-medium ${
                      metrics?.metrics?.infrastructure?.cpu_usage < 80 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {metrics?.metrics?.infrastructure?.cpu_usage || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Memory Usage</span>
                    <span className="font-medium">
                      {metrics?.metrics?.infrastructure?.memory_usage || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Cache Hit Rate</span>
                    <span className="font-medium text-green-400">
                      {metrics?.metrics?.infrastructure?.cache_hit_rate || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic Context */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#FF9A3B]" />
                Traffic Context (Self-Learning)
              </h3>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-400">Current Multiplier:</span>
                  <span className="ml-2 font-bold text-lg">{metrics?.traffic_multiplier || 1}x</span>
                </div>
                <div className="text-slate-400">
                  {metrics?.traffic_multiplier > 2 && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      Monday Morning Spike Pattern Detected
                    </span>
                  )}
                  {metrics?.traffic_multiplier < 0.7 && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      Weekend Traffic Pattern
                    </span>
                  )}
                  {metrics?.traffic_multiplier >= 0.7 && metrics?.traffic_multiplier <= 2 && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Normal Traffic Pattern
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kpis' && kpis && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Key Performance Indicators</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(kpis.kpis || {}).map(([category, items]) => (
                <div key={category} className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                  <h3 className="font-semibold mb-4 capitalize">{category.replace('_', ' ')}</h3>
                  <div className="space-y-3">
                    {Object.entries(items).map(([key, item]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            item.status === 'healthy' ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
                          </span>
                          {item.status === 'healthy' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Active Alerts</h2>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                  Critical: {alerts?.current_alerts?.filter(a => a.severity === 'critical').length || 0}
                </span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  Warning: {alerts?.current_alerts?.filter(a => a.severity === 'warning').length || 0}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {alerts?.current_alerts?.length > 0 ? (
                alerts.current_alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      alert.severity === 'critical'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-yellow-500/10 border-yellow-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {alert.severity === 'critical' ? (
                          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        )}
                        <div>
                          <div className="font-medium">{alert.metric_name?.replace('_', ' ')}</div>
                          <div className="text-sm text-slate-400 mt-1">{alert.message}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {alert.severity?.toUpperCase()}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">{alert.alert_id}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-800/30 rounded-xl">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-slate-400">No active alerts - System healthy</p>
                </div>
              )}
            </div>

            {/* Anomaly Detection */}
            {anomalies && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#FF9A3B]" />
                  Anomaly Detection
                </h3>
                {anomalies.anomalies_detected > 0 ? (
                  <div className="space-y-4">
                    {anomalies.anomalies?.map((anomaly, idx) => (
                      <div key={idx} className="p-4 bg-[#FF9A3B]/10 border border-[#FF9A3B]/30 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{anomaly.metric_name?.replace('_', ' ')}</div>
                            <div className="text-sm text-slate-400 mt-1">{anomaly.context}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[#FF9A3B] font-medium">
                              Current: {anomaly.current_value?.toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">
                              Expected: {anomaly.expected_range?.min?.toFixed(2)} - {anomaly.expected_range?.max?.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-800/30 rounded-xl">
                    <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                    <p className="text-slate-400">No anomalies detected</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'self-healing' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wrench className="w-6 h-6 text-[#FFDA7B]" />
              Self-Healing Suggestions
            </h2>
            
            {selfHealing?.suggestions?.length > 0 ? (
              <div className="space-y-4">
                {selfHealing.suggestions.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-[#FF9A3B]/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {item.related_alert?.metric_name?.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-red-400">{item.related_alert?.message}</p>
                      </div>
                      <span className="px-3 py-1 bg-[#FFDA7B]/20 text-[#FFDA7B] rounded-full text-sm">
                        Confidence: {(item.suggestion?.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                      <div className="text-sm text-slate-400 mb-2">Suggested Action:</div>
                      <p className="text-white">{item.suggestion?.suggestion}</p>
                    </div>
                    
                    {item.suggestion?.command && (
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-2">Command:</div>
                        <code className="text-[#FFDA7B] font-mono text-sm">{item.suggestion?.command}</code>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                      {item.suggestion?.based_on_history && (
                        <span className="px-2 py-1 bg-[#FF9A3B]/20 text-[#FF9A3B] rounded">
                          Based on Historical Data
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-slate-400">No self-healing actions needed - All systems nominal</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterAgentPage;
