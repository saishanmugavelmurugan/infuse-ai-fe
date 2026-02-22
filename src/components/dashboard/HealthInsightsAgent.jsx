import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { healthtrackApi } from '../../services/healthtrackApi';
import { 
  Brain, AlertTriangle, Activity, Heart, Thermometer,
  TrendingUp, TrendingDown, Clock, User, FileText,
  RefreshCw, Zap, Shield, CheckCircle, XCircle,
  ChevronRight, Lightbulb, Stethoscope
} from 'lucide-react';
import { Button } from '../ui/button';

const HealthInsightsAgent = ({ patientId, isDoctor = false }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('comprehensive');

  useEffect(() => {
    if (patientId) {
      loadPatientInsights();
    }
    if (isDoctor) {
      loadCriticalAlerts();
    }
  }, [patientId, isDoctor]);

  const loadPatientInsights = async () => {
    setLoading(true);
    try {
      const data = await healthtrackApi.aiAgents.getPatientInsights(patientId);
      setAnalysisHistory(data.insights || []);
      if (data.insights?.length > 0) {
        setInsights(data.insights[0]);
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCriticalAlerts = async () => {
    try {
      const data = await healthtrackApi.aiAgents.getCriticalAlerts();
      setCriticalAlerts(data.alerts || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  const generateNewInsights = async () => {
    if (!patientId) return;
    setGenerating(true);
    try {
      const result = await healthtrackApi.aiAgents.generateHealthInsights(
        patientId, 
        selectedAnalysisType, 
        true
      );
      setInsights(result);
      await loadPatientInsights();
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-600" />
            {t('health_insights')}
          </h2>
          <p className="text-gray-600 mt-1">AI-powered health analysis and recommendations</p>
        </div>
        
        {patientId && (
          <div className="flex gap-3">
            <select
              value={selectedAnalysisType}
              onChange={(e) => setSelectedAnalysisType(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="comprehensive">Comprehensive Analysis</option>
              <option value="vitals">Vitals Focus</option>
              <option value="lab_results">Lab Results Focus</option>
              <option value="lifestyle">Lifestyle Assessment</option>
            </select>
            <Button 
              className="bg-purple-600 hover:bg-purple-700" 
              onClick={generateNewInsights}
              disabled={generating}
            >
              <Zap className="w-4 h-4 mr-2" />
              {generating ? 'Analyzing...' : 'Generate Insights'}
            </Button>
          </div>
        )}
      </div>

      {/* Critical Alerts (Doctor View) */}
      {isDoctor && criticalAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5" />
            {t('critical_alerts')} ({criticalAlerts.length})
          </h3>
          <div className="space-y-2">
            {criticalAlerts.map((alert, i) => (
              <div key={i} className="bg-white rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium text-gray-800">{alert.patient_name}</p>
                    <p className="text-sm text-red-600">{alert.alert_message}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Critical Alerts */}
      {isDoctor && criticalAlerts.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">No Critical Alerts</h3>
              <p className="text-sm text-green-600">All patients are within normal health parameters</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      {/* Insights Display */}
      {insights && !loading && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Health Score */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">AI Generated</span>
            </div>
            <div className="text-5xl font-bold mb-2">
              {insights.health_score || 85}
              <span className="text-2xl">/100</span>
            </div>
            <p className="text-purple-100">Overall Health Score</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              {(insights.health_score || 85) >= 70 ? (
                <><TrendingUp className="w-4 h-4" /> Good condition</>
              ) : (
                <><TrendingDown className="w-4 h-4" /> Needs attention</>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Key Health Metrics
            </h3>
            <div className="space-y-3">
              <MetricRow 
                label="Blood Pressure" 
                value={insights.metrics?.blood_pressure || "120/80"} 
                status="normal" 
              />
              <MetricRow 
                label="Heart Rate" 
                value={insights.metrics?.heart_rate || "72 bpm"} 
                status="normal" 
              />
              <MetricRow 
                label="Blood Sugar" 
                value={insights.metrics?.blood_sugar || "95 mg/dL"} 
                status="normal" 
              />
              <MetricRow 
                label="BMI" 
                value={insights.metrics?.bmi || "24.5"} 
                status="normal" 
              />
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              Risk Assessment
            </h3>
            <div className="space-y-3">
              <RiskRow label="Cardiovascular" level="low" />
              <RiskRow label="Diabetes" level="moderate" />
              <RiskRow label="Hypertension" level="low" />
              <RiskRow label="Respiratory" level="low" />
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {insights && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Modern Medicine Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-500" />
              {t('modern_medicine')} Recommendations
            </h3>
            <ul className="space-y-3">
              {(insights.recommendations?.modern || [
                'Schedule annual health checkup',
                'Consider cholesterol screening',
                'Maintain current medication regimen',
                'Follow up with cardiologist in 6 months'
              ]).map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayurvedic Recommendations */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-green-600" />
              {t('ayurvedic')} Recommendations
            </h3>
            <ul className="space-y-3">
              {(insights.recommendations?.ayurvedic || [
                'Practice Pranayama (breathing exercises) daily',
                'Include turmeric and ginger in diet',
                'Maintain regular sleep schedule (10pm-6am)',
                'Warm water with honey and lemon in morning'
              ]).map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-green-500 mt-0.5">✨</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Lifestyle Tips */}
      {insights && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600" />
            {t('lifestyle_tips')}
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <LifestyleTip 
              icon="🏋️" 
              title="Exercise" 
              tip="30 mins moderate activity daily" 
            />
            <LifestyleTip 
              icon="🥗" 
              title="Diet" 
              tip="Balanced meals, reduce processed foods" 
            />
            <LifestyleTip 
              icon="😴" 
              title="Sleep" 
              tip="7-8 hours of quality sleep" 
            />
            <LifestyleTip 
              icon="🧘" 
              title="Stress" 
              tip="Practice mindfulness & meditation" 
            />
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
        <p className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <span>
            <strong>{t('disclaimer')}:</strong> These AI-generated insights are for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment.
          </span>
        </p>
      </div>

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="font-semibold text-gray-800 mb-4">Previous Analyses</h3>
          <div className="space-y-2">
            {analysisHistory.slice(0, 5).map((analysis, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {analysis.analysis_type || 'Comprehensive'}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const MetricRow = ({ label, value, status }) => {
  const statusColors = {
    normal: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    critical: 'text-red-600 bg-red-100'
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900">{value}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

const RiskRow = ({ label, level }) => {
  const levelConfig = {
    low: { color: 'bg-green-500', width: '25%', text: 'Low' },
    moderate: { color: 'bg-yellow-500', width: '50%', text: 'Moderate' },
    high: { color: 'bg-red-500', width: '75%', text: 'High' }
  };

  const config = levelConfig[level];

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className={`font-medium ${level === 'low' ? 'text-green-600' : level === 'moderate' ? 'text-yellow-600' : 'text-red-600'}`}>
          {config.text}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${config.color} rounded-full`} style={{ width: config.width }} />
      </div>
    </div>
  );
};

const LifestyleTip = ({ icon, title, tip }) => (
  <div className="bg-white rounded-lg p-4 text-center">
    <span className="text-2xl">{icon}</span>
    <h4 className="font-medium text-gray-800 mt-2">{title}</h4>
    <p className="text-xs text-gray-600 mt-1">{tip}</p>
  </div>
);

export default HealthInsightsAgent;
