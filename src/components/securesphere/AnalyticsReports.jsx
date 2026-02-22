import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Shield, Globe, FileText, 
  AlertTriangle, CheckCircle, BarChart3, PieChart, Map,
  Download, RefreshCw, Loader2, Target, Zap, Activity,
  ChevronRight, Calendar, Filter, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AnalyticsReports = () => {
  const [activeTab, setActiveTab] = useState('trends');
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState(null);
  const [vectorData, setVectorData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [executiveData, setExecutiveData] = useState(null);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [trends, vectors, geo, compliance, executive] = await Promise.all([
        fetch(`${API_URL}/api/securesphere/analytics/threat-trends?days=${period}`).then(r => r.json()),
        fetch(`${API_URL}/api/securesphere/analytics/attack-vectors?days=${period}`).then(r => r.json()),
        fetch(`${API_URL}/api/securesphere/analytics/geographic?days=${period}`).then(r => r.json()),
        fetch(`${API_URL}/api/securesphere/reports/compliance/summary`).then(r => r.json()),
        fetch(`${API_URL}/api/securesphere/reports/executive/summary?period_days=${period}`).then(r => r.json())
      ]);
      setTrendData(trends);
      setVectorData(vectors);
      setGeoData(geo);
      setComplianceData(compliance);
      setExecutiveData(executive);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'trends', name: 'Threat Trends', icon: TrendingUp },
    { id: 'vectors', name: 'Attack Vectors', icon: Target },
    { id: 'geographic', name: 'Geographic Map', icon: Globe },
    { id: 'compliance', name: 'Compliance', icon: Shield },
    { id: 'reports', name: 'Reports', icon: FileText }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Threat Trends Tab
  const renderTrends = () => {
    if (!trendData) return null;
    
    const maxTotal = Math.max(...trendData.daily_breakdown.map(d => d.total));
    
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">Total Threats</div>
            <div className="text-2xl font-bold">{trendData.summary.total_threats_detected.toLocaleString()}</div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${trendData.summary.trend_percentage > 0 ? 'text-red-200' : 'text-green-200'}`}>
              {trendData.summary.trend_percentage > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(trendData.summary.trend_percentage)}% vs previous
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">URL Threats</div>
            <div className="text-2xl font-bold">{trendData.summary.url_threats}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">SMS Fraud</div>
            <div className="text-2xl font-bold">{trendData.summary.sms_fraud}</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">IoT Anomalies</div>
            <div className="text-2xl font-bold">{trendData.summary.iot_anomalies}</div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Threat Activity</h3>
          <div className="h-64 flex items-end gap-1">
            {trendData.daily_breakdown.slice(-14).map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t transition-all hover:from-cyan-400 hover:to-blue-400"
                  style={{ height: `${(day.total / maxTotal) * 100}%`, minHeight: '4px' }}
                  title={`${day.date}: ${day.total} threats`}
                />
                <span className="text-xs text-gray-500 rotate-45 origin-left">{day.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
          <div className="space-y-3">
            {trendData.insights.map((insight, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${insight.severity === 'warning' ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-gray-700/50'}`}>
                <div className="flex items-start gap-3">
                  {insight.severity === 'warning' ? 
                    <AlertTriangle className="text-yellow-500 mt-0.5" size={18} /> :
                    <Activity className="text-cyan-500 mt-0.5" size={18} />
                  }
                  <div>
                    <div className="text-sm text-gray-300 capitalize">{insight.type}</div>
                    <div className="text-white">{insight.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Attack Vectors Tab
  const renderVectors = () => {
    if (!vectorData) return null;
    
    return (
      <div className="space-y-6">
        {/* Top Threats */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Attack Vectors</h3>
          <div className="space-y-4">
            {vectorData.top_threats.map((threat, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-500 w-8">#{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{threat.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getRiskColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getSeverityColor(threat.severity)} rounded-full transition-all`}
                      style={{ width: `${(threat.count / vectorData.total_attacks) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{threat.count.toLocaleString()} incidents</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">By Category</h3>
            <div className="space-y-3">
              {Object.entries(vectorData.by_category).map(([key, cat]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-white capitalize">{cat.name}</span>
                  <span className="text-cyan-400 font-semibold">{cat.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
            <div className="flex items-center justify-center h-48">
              <div className="relative w-40 h-40">
                {/* Simple donut chart representation */}
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="20" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="20" 
                    strokeDasharray={`${vectorData.severity_breakdown.critical * 25} 251`} />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F97316" strokeWidth="20" 
                    strokeDasharray={`${vectorData.severity_breakdown.high * 25} 251`} 
                    strokeDashoffset={`-${vectorData.severity_breakdown.critical * 25}`} />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#EAB308" strokeWidth="20" 
                    strokeDasharray={`${vectorData.severity_breakdown.medium * 25} 251`} 
                    strokeDashoffset={`-${(vectorData.severity_breakdown.critical + vectorData.severity_breakdown.high) * 25}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{vectorData.total_attacks}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Critical</span>
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 bg-orange-500 rounded-full"></span> High</span>
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Medium</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {vectorData.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-gray-300 text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Geographic Map Tab
  const renderGeographic = () => {
    if (!geoData) return null;
    
    return (
      <div className="space-y-6">
        {/* World Map Visualization */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Global Threat Distribution</h3>
          <div className="relative bg-gray-900 rounded-lg p-4 min-h-[400px]">
            {/* Simplified world map representation with hotspots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-4xl aspect-[2/1]">
                {/* World map placeholder */}
                <div className="absolute inset-0 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                  {/* Hotspot markers */}
                  {geoData.hotspots.map((spot, idx) => {
                    // Convert lat/lng to percentage positions (simplified)
                    const x = ((spot.lng + 180) / 360) * 100;
                    const y = ((90 - spot.lat) / 180) * 100;
                    return (
                      <div 
                        key={idx}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <div className={`w-4 h-4 rounded-full animate-ping absolute ${idx === 0 ? 'bg-red-500' : 'bg-orange-500'} opacity-50`}></div>
                        <div className={`w-4 h-4 rounded-full relative ${idx === 0 ? 'bg-red-500' : 'bg-orange-500'} cursor-pointer`}>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                              {spot.country}: {spot.threats.toLocaleString()} threats
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Source Countries */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Threat Sources</h3>
            <div className="space-y-3">
              {geoData.top_sources.slice(0, 8).map((country, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCountryFlag(country.code)}</span>
                    <span className="text-white">{country.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getRiskColor(country.risk_level)}`}>
                      {country.risk_level}
                    </span>
                  </div>
                  <span className="text-cyan-400 font-semibold">{country.threats.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Regional Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(geoData.regions).map(([key, region]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white">{region.name}</span>
                    <span className="text-gray-400">{region.percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{ width: `${region.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{region.threats.toLocaleString()} threats</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Compliance Tab
  const renderCompliance = () => {
    if (!complianceData) return null;
    
    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Overall Compliance Score</div>
              <div className="text-4xl font-bold">{complianceData.overall_compliance_score}%</div>
              <div className="text-sm mt-1 capitalize">{complianceData.overall_status.replace('_', ' ')}</div>
            </div>
            <Shield size={64} className="opacity-50" />
          </div>
        </div>

        {/* Frameworks */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(complianceData.frameworks).map(([key, fw]) => (
            <div key={key} className="bg-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{fw.name}</h4>
                <span className={`px-2 py-1 rounded text-xs ${fw.status === 'compliant' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                  {fw.status}
                </span>
              </div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">{fw.score}%</div>
              <div className="text-sm text-gray-400">{fw.description}</div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{fw.controls_passed}/{fw.controls_total} controls</span>
                <span>Next audit: {new Date(fw.next_audit).toLocaleDateString()}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: `${fw.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Audits */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Audits</h3>
          <div className="space-y-3">
            {complianceData.upcoming_audits.map((audit, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="text-cyan-500" size={20} />
                  <div>
                    <div className="text-white font-medium">{audit.name}</div>
                    <div className="text-sm text-gray-400">Scheduled Audit</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400">{new Date(audit.date).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">
                    {Math.ceil((new Date(audit.date) - new Date()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Reports Tab
  const renderReports = () => {
    if (!executiveData) return null;
    
    return (
      <div className="space-y-6">
        {/* Report Types */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Executive Summary', icon: BarChart3, type: 'executive' },
            { name: 'Compliance Report', icon: Shield, type: 'compliance' },
            { name: 'Technical Audit', icon: FileText, type: 'audit' },
            { name: 'Threat Analysis', icon: AlertTriangle, type: 'threat' }
          ].map((report, idx) => (
            <button 
              key={idx}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl p-5 text-left transition-colors group"
            >
              <report.icon className="text-cyan-500 mb-3" size={24} />
              <h4 className="font-semibold text-white mb-1">{report.name}</h4>
              <p className="text-sm text-gray-400 mb-3">Generate detailed {report.type} report</p>
              <div className="flex items-center text-cyan-400 text-sm group-hover:underline">
                <Download size={14} className="mr-1" /> Download PDF
              </div>
            </button>
          ))}
        </div>

        {/* Executive Summary Preview */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Executive Summary Preview</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
              <Download size={16} /> Export Full Report
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <div className="text-3xl font-bold text-cyan-400">{executiveData.key_metrics.overall_security_score}</div>
              <div className="text-sm text-gray-400">Security Score</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <div className="text-3xl font-bold text-green-400">{executiveData.key_metrics.threats_blocked}</div>
              <div className="text-sm text-gray-400">Threats Blocked</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">{executiveData.key_metrics.uptime_percentage}</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-3">ROI Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Threats Prevented Value</span>
                  <span className="text-green-400">{executiveData.roi_metrics.threats_prevented_value}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Breach Cost Avoided</span>
                  <span className="text-green-400">{executiveData.roi_metrics.breach_cost_avoided}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Productivity Saved</span>
                  <span className="text-cyan-400">{executiveData.roi_metrics.productivity_saved_hours} hours</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Key Recommendations</h4>
              <div className="space-y-2">
                {executiveData.recommendations.slice(0, 3).map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${rec.priority === 'high' ? 'bg-red-900/50 text-red-400' : rec.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-green-900/50 text-green-400'}`}>
                      {rec.priority}
                    </span>
                    <span className="text-gray-300">{rec.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper function for country flags
  const getCountryFlag = (code) => {
    const flags = {
      'US': '🇺🇸', 'CN': '🇨🇳', 'RU': '🇷🇺', 'IN': '🇮🇳', 'BR': '🇧🇷',
      'NG': '🇳🇬', 'VN': '🇻🇳', 'ID': '🇮🇩', 'PK': '🇵🇰', 'UA': '🇺🇦',
      'KP': '🇰🇵', 'IR': '🇮🇷', 'RO': '🇷🇴', 'DE': '🇩🇪', 'GB': '🇬🇧',
      'FR': '🇫🇷', 'NL': '🇳🇱', 'SG': '🇸🇬', 'AE': '🇦🇪', 'PH': '🇵🇭'
    };
    return flags[code] || '🏳️';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        <span className="ml-3 text-gray-400">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
          <p className="text-gray-400">Comprehensive security insights and compliance reporting</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button 
            onClick={loadData}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id 
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'trends' && renderTrends()}
      {activeTab === 'vectors' && renderVectors()}
      {activeTab === 'geographic' && renderGeographic()}
      {activeTab === 'compliance' && renderCompliance()}
      {activeTab === 'reports' && renderReports()}
    </div>
  );
};

export default AnalyticsReports;
