import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, MessageSquare, Activity, Map, Shield, AlertTriangle,
  CheckCircle, Clock, TrendingUp, Users, Zap, Brain,
  ChevronRight, RefreshCw, Settings, Bell
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const AIAgentsDashboard = () => {
  const [supportStats, setSupportStats] = useState(null);
  const [masterSummary, setMasterSummary] = useState(null);
  const [roadmapSummary, setRoadmapSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [supportRes, masterRes, roadmapRes] = await Promise.all([
        fetch(`${API_BASE}/api/agents/support/analytics/summary`),
        fetch(`${API_BASE}/api/agents/master/dashboard/summary`),
        fetch(`${API_BASE}/api/agents/roadmap/dashboard/summary`)
      ]);

      const [support, master, roadmap] = await Promise.all([
        supportRes.json(),
        masterRes.json(),
        roadmapRes.json()
      ]);

      setSupportStats(support);
      setMasterSummary(master);
      setRoadmapSummary(roadmap);
    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
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

  const getStatusBadge = (status) => {
    const styles = {
      healthy: 'bg-green-100 text-green-700 border-green-300',
      degraded: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      critical: 'bg-red-100 text-red-700 border-red-300'
    };
    return styles[status] || styles.healthy;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#FF9A3B] animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading AI Agents Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white" data-testid="ai-agents-dashboard">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-[#8B4513]/30 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-[#FFDA7B] to-[#E55A00] rounded-xl">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Multi-Agent AI System</h1>
                <p className="text-[#FF9A3B] text-sm">Support • Monitoring • Roadmapping</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                to="/admin/feature-flags"
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Health Overview */}
        {masterSummary && (
          <div className="mb-8 bg-gradient-to-r from-slate-800/50 via-[#8B4513]/10 to-slate-900/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#FF9A3B]" />
                System Health Overview
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(masterSummary.status)}`}>
                {masterSummary.status?.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-[#FFDA7B]/10">
                <div className="text-sm text-slate-400 mb-1">Health Score</div>
                <div className={`text-3xl font-bold ${getHealthColor(masterSummary.health_score)}`}>
                  {masterSummary.health_score}%
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-[#FFDA7B]/10">
                <div className="text-sm text-slate-400 mb-1">API Latency (p95)</div>
                <div className="text-3xl font-bold text-[#FFDA7B]">
                  {masterSummary.metrics_summary?.api_latency || 'N/A'}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-[#FFDA7B]/10">
                <div className="text-sm text-slate-400 mb-1">Uptime</div>
                <div className="text-3xl font-bold text-green-400">
                  {masterSummary.metrics_summary?.uptime || 'N/A'}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-[#FFDA7B]/10">
                <div className="text-sm text-slate-400 mb-1">Active Alerts</div>
                <div className="text-3xl font-bold text-[#E55A00]">
                  {masterSummary.alerts?.total || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agent Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Support Agent Card */}
          <Link
            to="/ai-agents/support"
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-[#FF9A3B]/50 hover:shadow-lg hover:shadow-[#FF9A3B]/10 transition-all group"
            data-testid="support-agent-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-xl group-hover:from-[#FFDA7B]/30 group-hover:to-[#FF9A3B]/30 transition">
                <MessageSquare className="w-6 h-6 text-[#FFDA7B]" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#FF9A3B] transition" />
            </div>
            <h3 className="text-xl font-bold mb-2">Support Agent</h3>
            <p className="text-slate-400 text-sm mb-4">
              Customer & Ops support with AI-powered query resolution
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Today's Queries</span>
                <span className="font-medium">{supportStats?.today?.total_queries || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Resolution Rate</span>
                <span className="font-medium text-green-400">
                  {supportStats?.resolution_rate?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Conversations</span>
                <span className="font-medium">{supportStats?.total_conversations || 0}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Zap className="w-4 h-4 text-[#FFDA7B]" />
                Knowledge Base: 8 Topics
              </div>
            </div>
          </Link>

          {/* Master Agent Card */}
          <Link
            to="/ai-agents/master"
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-[#FF9A3B]/50 hover:shadow-lg hover:shadow-[#FF9A3B]/10 transition-all group"
            data-testid="master-agent-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-[#FF9A3B]/20 to-[#E55A00]/20 rounded-xl group-hover:from-[#FF9A3B]/30 group-hover:to-[#E55A00]/30 transition">
                <Brain className="w-6 h-6 text-[#FF9A3B]" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#FF9A3B] transition" />
            </div>
            <h3 className="text-xl font-bold mb-2">Master Agent</h3>
            <p className="text-slate-400 text-sm mb-4">
              Platform monitoring, anomaly detection & self-healing
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Critical Alerts</span>
                <span className={`font-medium ${masterSummary?.alerts?.critical > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {masterSummary?.alerts?.critical || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Warning Alerts</span>
                <span className="font-medium text-[#FFDA7B]">{masterSummary?.alerts?.warning || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Compliance</span>
                <span className="font-medium text-green-400">
                  HIPAA: {masterSummary?.compliance?.hipaa?.toFixed(0) || 'N/A'}%
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="w-4 h-4 text-[#FF9A3B]" />
                5 KPIs Monitored
              </div>
            </div>
          </Link>

          {/* Roadmap Agent Card */}
          <Link
            to="/ai-agents/roadmap"
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-[#FF9A3B]/50 hover:shadow-lg hover:shadow-[#FF9A3B]/10 transition-all group"
            data-testid="roadmap-agent-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-[#E55A00]/20 to-[#C64700]/20 rounded-xl group-hover:from-[#E55A00]/30 group-hover:to-[#C64700]/30 transition">
                <Map className="w-6 h-6 text-[#E55A00]" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#FF9A3B] transition" />
            </div>
            <h3 className="text-xl font-bold mb-2">Roadmap Agent</h3>
            <p className="text-slate-400 text-sm mb-4">
              Product strategy, feature proposals & PRD generation
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Roadmap Items</span>
                <span className="font-medium">{roadmapSummary?.roadmap?.total_items || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">In Progress</span>
                <span className="font-medium text-[#FFDA7B]">
                  {roadmapSummary?.roadmap?.by_status?.in_progress || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Feature Proposals</span>
                <span className="font-medium">{roadmapSummary?.proposals?.total || 0}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <TrendingUp className="w-4 h-4 text-[#E55A00]" />
                3-Year, 5-Year, 10-Year Horizons
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/ai-agents/support"
            className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-[#FFDA7B]/50 hover:bg-slate-800/50 transition"
          >
            <MessageSquare className="w-5 h-5 text-[#FFDA7B]" />
            <span>Chat with Support Agent</span>
          </Link>
          <Link
            to="/ai-agents/master"
            className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-[#FF9A3B]/50 hover:bg-slate-800/50 transition"
          >
            <Bell className="w-5 h-5 text-[#FF9A3B]" />
            <span>View Active Alerts</span>
          </Link>
          <Link
            to="/ai-agents/roadmap"
            className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-[#E55A00]/50 hover:bg-slate-800/50 transition"
          >
            <Map className="w-5 h-5 text-[#E55A00]" />
            <span>View Product Roadmap</span>
          </Link>
          <Link
            to="/ai-agents/roadmap"
            className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-[#FF9A3B]/50 hover:bg-slate-800/50 transition"
          >
            <Zap className="w-5 h-5 text-[#FFDA7B]" />
            <span>Generate PRD</span>
          </Link>
        </div>

        {/* Integration Status */}
        <div className="mt-8 bg-slate-800/30 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#FF9A3B]" />
            Integration Status
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Jira', status: 'mocked', icon: '🎫' },
              { name: 'Zendesk', status: 'mocked', icon: '🎧' },
              { name: 'Slack', status: 'mocked', icon: '💬' },
              { name: 'WhatsApp', status: 'mocked', icon: '📱' },
              { name: 'Email', status: 'active', icon: '📧' },
              { name: 'GPT-5.2', status: 'active', icon: '🤖' }
            ].map((integration, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  integration.status === 'active'
                    ? 'bg-[#FF9A3B]/10 border-[#FF9A3B]/30'
                    : 'bg-slate-700/30 border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{integration.icon}</span>
                  <div>
                    <div className="text-sm font-medium">{integration.name}</div>
                    <div className={`text-xs ${integration.status === 'active' ? 'text-[#FF9A3B]' : 'text-slate-500'}`}>
                      {integration.status === 'active' ? 'Active' : 'Mocked'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentsDashboard;
