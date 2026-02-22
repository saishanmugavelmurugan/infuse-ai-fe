import React, { useState, useEffect } from 'react';
import { 
  Shield, ShieldCheck, ShieldAlert, ShieldX, AlertTriangle,
  TrendingUp, TrendingDown, Loader2, RefreshCw, Bell,
  Smartphone, Wifi, Activity, Brain, ChevronRight,
  CheckCircle, XCircle, Clock, Info
} from 'lucide-react';
import { dashboardApi, threatScoringApi } from '../../services/secureSphereApi';
import { useLanguage } from '../../contexts/LanguageContext';

const SecurityDashboard = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [threats, setThreats] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [overviewData, threatsData, recsData, aiData] = await Promise.all([
        dashboardApi.getOverview(),
        dashboardApi.getRecentThreats(10),
        dashboardApi.getRecommendations(),
        dashboardApi.getAIInsights()
      ]);
      
      setOverview(overviewData);
      setThreats(threatsData.threats || []);
      setRecommendations(recsData.recommendations || []);
      setAiInsights(aiData);
    } catch (err) {
      setError('Failed to load security dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-500';
      case 'B': return 'text-blue-500';
      case 'C': return 'text-yellow-500';
      case 'D': return 'text-orange-500';
      case 'F': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">{t('ss_loading_dashboard', 'Loading security dashboard...')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadDashboard}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          {t('retry', 'Retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Score Card */}
      <div className={`bg-gradient-to-r ${getScoreGradient(overview?.security_score || 0)} rounded-xl p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Shield className="h-10 w-10" />
              <div>
                <h2 className="text-2xl font-bold">{t('ss_security_posture', 'Security Posture')}</h2>
                <p className="text-white/80">{t('ss_overall_status', 'Overall platform security status')}</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-end gap-4">
              <div>
                <p className="text-6xl font-bold">{overview?.security_score || 0}</p>
                <p className="text-white/80">{t('ss_security_score', 'Security Score')}</p>
              </div>
              <div className="mb-2">
                <span className={`text-4xl font-bold px-3 py-1 bg-white/20 rounded-lg`}>
                  {overview?.security_grade || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <Smartphone className="h-6 w-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{overview?.devices?.total || 0}</p>
                <p className="text-sm text-white/80">{t('ss_devices', 'Devices')}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <Bell className="h-6 w-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{overview?.alerts?.active || 0}</p>
                <p className="text-sm text-white/80">{t('ss_active_alerts', 'Active Alerts')}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <ShieldCheck className="h-6 w-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{overview?.threats?.urls_scanned || 0}</p>
                <p className="text-sm text-white/80">{t('ss_urls_scanned', 'URLs Scanned')}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <ShieldAlert className="h-6 w-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{overview?.threats?.malicious_urls_blocked || 0}</p>
                <p className="text-sm text-white/80">{t('ss_blocked', 'Blocked')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={loadDashboard}
          className="mt-4 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> {t('refresh', 'Refresh')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('ss_secure_devices', 'Secure Devices')}</p>
              <p className="text-2xl font-bold text-green-600">{overview?.devices?.secure || 0}</p>
            </div>
            <ShieldCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('ss_at_risk', 'At Risk')}</p>
              <p className="text-2xl font-bold text-orange-600">{overview?.devices?.at_risk || 0}</p>
            </div>
            <ShieldAlert className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('status_critical', 'Critical')}</p>
              <p className="text-2xl font-bold text-red-600">{overview?.devices?.critical || 0}</p>
            </div>
            <ShieldX className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('ss_critical_alerts', 'Critical Alerts')}</p>
              <p className="text-2xl font-bold text-red-600">{overview?.alerts?.critical || 0}</p>
            </div>
            <Bell className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Threats */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t('ss_recent_threats', 'Recent Threats')}
          </h3>
          
          {threats.length > 0 ? (
            <div className="space-y-3">
              {threats.slice(0, 5).map((threat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {threat.type === 'url' ? (
                      <ShieldAlert className="h-5 w-5 text-orange-500" />
                    ) : (
                      <ShieldX className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {threat.type === 'url' ? t('ss_malicious_url', 'Malicious URL') : t('ss_fraud_sms', 'Fraud SMS')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {threat.url || threat.message_preview || t('ss_details_unavailable', 'Details unavailable')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(threat.threat_level)}`}>
                    {threat.risk_score}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShieldCheck className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>{t('ss_no_threats', 'No recent threats detected')}</p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            {t('ss_security_recommendations', 'Security Recommendations')}
          </h3>
          
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((rec, idx) => (
                <div key={idx} className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start gap-3">
                    {rec.priority === 'critical' ? (
                      <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    ) : rec.priority === 'high' ? (
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{rec.recommendation}</p>
                      <p className="text-xs opacity-80 mt-1">{rec.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>{t('ss_all_recommendations_addressed', 'All security recommendations addressed!')}</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">{t('ss_ai_security_intelligence', 'AI Security Intelligence')}</h3>
              <p className="text-purple-100 text-sm">{t('ss_powered_by', 'Powered by')} {aiInsights.ai_engine?.model}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {aiInsights.insights?.map((insight, idx) => (
              <div key={idx} className="bg-white/10 rounded-lg p-4">
                <h4 className="font-medium mb-2">{insight.title}</h4>
                <p className="text-sm text-purple-100">{insight.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex items-center gap-6 text-sm">
            <span>{t('ss_total_analyses', 'Total Analyses')}: {aiInsights.ai_engine?.total_analyses || 0}</span>
            <span>Threat Memory: {aiInsights.ai_engine?.threat_memory_size || 0} patterns</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
