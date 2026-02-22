import React, { useState, useEffect } from 'react';
import {
  Watch, Smartphone, Heart, Footprints, Moon, Flame, Activity,
  Link2, Unlink, RefreshCw, TrendingUp, TrendingDown, Minus,
  CheckCircle, AlertCircle, Loader2, ChevronRight, Zap, Brain
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const platformInfo = {
  fitbit: {
    name: 'Fitbit',
    icon: '⌚',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/20',
    borderColor: 'border-teal-500/50',
    description: 'Sync heart rate, steps, sleep, and activity data'
  },
  google_fit: {
    name: 'Google Fit',
    icon: '🏃',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    description: 'Connect your Android device health data'
  },
  apple_health: {
    name: 'Apple Health',
    icon: '🍎',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    description: 'Sync data from iPhone and Apple Watch'
  },
  samsung_health: {
    name: 'Samsung Health',
    icon: '📱',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
    description: 'Connect your Samsung Galaxy device'
  },
  garmin: {
    name: 'Garmin',
    icon: '🎯',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/50',
    description: 'Sync from Garmin fitness devices'
  },
  mi_fit: {
    name: 'Mi Fit',
    icon: '📊',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    description: 'Connect Xiaomi Mi Band and smart scales'
  }
};

const WearableIntegration = ({ patientId, onDataReady }) => {
  const [platforms, setPlatforms] = useState([]);
  const [connections, setConnections] = useState([]);
  const [healthScore, setHealthScore] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [syncing, setSyncing] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch available platforms
      const platformsRes = await fetch(`${API_URL}/api/wearable-integrations/platforms`);
      const platformsData = await platformsRes.json();
      setPlatforms(platformsData.platforms || []);

      // Fetch user's connections
      const connectionsRes = await fetch(`${API_URL}/api/wearable-integrations/connections/${patientId || 'demo_user'}`);
      const connectionsData = await connectionsRes.json();
      setConnections(connectionsData.connections || []);

      // Fetch health score if connected
      if (connectionsData.connections?.length > 0) {
        const scoreRes = await fetch(`${API_URL}/api/wearable-integrations/health-score/${patientId || 'demo_user'}`);
        const scoreData = await scoreRes.json();
        setHealthScore(scoreData);

        const summaryRes = await fetch(`${API_URL}/api/wearable-integrations/summary/${patientId || 'demo_user'}?period=weekly`);
        const summaryData = await summaryRes.json();
        setSummary(summaryData);
      }
    } catch (err) {
      console.error('Error fetching wearable data:', err);
    } finally {
      setLoading(false);
    }
  };

  const connectPlatform = async (platformId) => {
    setConnecting(platformId);
    try {
      const response = await fetch(`${API_URL}/api/wearable-integrations/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platformId,
          patient_id: patientId || 'demo_user'
        })
      });

      const data = await response.json();

      if (data.status === 'redirect' && data.auth_url) {
        window.location.href = data.auth_url;
      } else if (data.status === 'connected') {
        setNotification({ type: 'success', message: `${platformInfo[platformId]?.name || platformId} connected successfully!` });
        fetchData();
      } else if (data.status === 'already_connected') {
        setNotification({ type: 'info', message: 'This platform is already connected' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to connect platform' });
    } finally {
      setConnecting(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const disconnectPlatform = async (connectionId) => {
    try {
      await fetch(`${API_URL}/api/wearable-integrations/disconnect/${patientId || 'demo_user'}/${connectionId}`, {
        method: 'DELETE'
      });
      setNotification({ type: 'success', message: 'Platform disconnected' });
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to disconnect' });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const syncData = async (connectionId) => {
    setSyncing(connectionId);
    try {
      const response = await fetch(`${API_URL}/api/wearable-integrations/sync/${patientId || 'demo_user'}/${connectionId}`, {
        method: 'POST'
      });
      const data = await response.json();
      setNotification({ type: 'success', message: `Synced ${data.records_synced} records` });
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', message: 'Sync failed' });
    } finally {
      setSyncing(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const isConnected = (platformId) => {
    return connections.some(c => c.platform === platformId);
  };

  const getConnection = (platformId) => {
    return connections.find(c => c.platform === platformId);
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="wearable-integration">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-emerald-600' :
          notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-white">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
            <Watch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Wearable Devices</h2>
            <p className="text-sm text-slate-400">Connect your fitness trackers for personalized plans</p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Health Score Card (if connected) */}
      {healthScore && connections.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Health Score
            </h3>
            <div className={`text-4xl font-bold ${getScoreColor(healthScore.overall_health_score)}`}>
              {healthScore.overall_health_score}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Activity className="w-4 h-4" />
                Activity
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(healthScore.component_scores?.activity_score)}`}>
                {healthScore.component_scores?.activity_score || 0}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Moon className="w-4 h-4" />
                Sleep
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(healthScore.component_scores?.sleep_score)}`}>
                {healthScore.component_scores?.sleep_score || 0}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Heart className="w-4 h-4" />
                Heart
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(healthScore.component_scores?.heart_health_score)}`}>
                {healthScore.component_scores?.heart_health_score || 0}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Zap className="w-4 h-4" />
                Recovery
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(healthScore.component_scores?.recovery_score)}`}>
                {healthScore.component_scores?.recovery_score || 0}
              </p>
            </div>
          </div>

          {healthScore.recommendations && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-2">AI Recommendations</p>
              <ul className="space-y-1">
                {healthScore.recommendations.slice(0, 2).map((rec, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Weekly Summary (if connected) */}
      {summary && connections.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">This Week's Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-sm mb-1">
                <Footprints className="w-4 h-4" />
                Avg Steps
              </div>
              <p className="text-2xl font-bold text-white">{summary.avg_daily_steps?.toLocaleString() || 0}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-sm mb-1">
                <Moon className="w-4 h-4" />
                Avg Sleep
              </div>
              <p className="text-2xl font-bold text-white">{summary.avg_sleep_hours || 0}h</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-sm mb-1">
                <Heart className="w-4 h-4" />
                Avg HR
              </div>
              <p className="text-2xl font-bold text-white">{summary.avg_heart_rate || 0} bpm</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-sm mb-1">
                <Flame className="w-4 h-4" />
                Total Calories
              </div>
              <p className="text-2xl font-bold text-white">{summary.total_calories?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Connected Devices */}
      {connections.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            Connected Devices ({connections.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {connections.map((connection) => {
              const info = platformInfo[connection.platform] || {};
              return (
                <div
                  key={connection.id}
                  className={`bg-slate-800/50 border ${info.borderColor || 'border-slate-700'} rounded-xl p-4`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{info.icon || '📱'}</span>
                      <div>
                        <h4 className="font-semibold">{info.name || connection.platform}</h4>
                        <p className="text-xs text-slate-400">
                          Last sync: {new Date(connection.last_sync).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => syncData(connection.id)}
                        disabled={syncing === connection.id}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                        title="Sync now"
                      >
                        <RefreshCw className={`w-4 h-4 ${syncing === connection.id ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => disconnectPlatform(connection.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Disconnect"
                      >
                        <Unlink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {connection.is_mock && (
                    <p className="mt-2 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded inline-block">
                      Demo Mode - Simulated Data
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          {connections.length > 0 ? 'Connect More Devices' : 'Connect a Device'}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms
            .filter(p => !isConnected(p.id))
            .map((platform) => {
              const info = platformInfo[platform.id] || {};
              return (
                <div
                  key={platform.id}
                  className="bg-slate-800/30 border border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{info.icon || platform.icon}</span>
                      <div>
                        <h4 className="font-semibold">{info.name || platform.name}</h4>
                        <p className="text-xs text-slate-400">{platform.data_types?.length || 0} data types</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{info.description || ''}</p>
                  <button
                    onClick={() => connectPlatform(platform.id)}
                    disabled={connecting === platform.id}
                    className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      connecting === platform.id
                        ? 'bg-slate-600 cursor-not-allowed'
                        : `bg-gradient-to-r ${info.color || 'from-emerald-600 to-teal-600'} hover:opacity-90`
                    }`}
                    data-testid={`connect-${platform.id}`}
                  >
                    {connecting === platform.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* Use Data for AI Plan CTA */}
      {connections.length > 0 && onDataReady && (
        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Ready to Generate Your Plan!</h3>
          <p className="text-slate-400 mb-4">
            Your wearable data is connected. Generate a personalized AI lifestyle plan based on your real health metrics.
          </p>
          <button
            onClick={onDataReady}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-semibold transition-all inline-flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            Generate AI Lifestyle Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default WearableIntegration;
