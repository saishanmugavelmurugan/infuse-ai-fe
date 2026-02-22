import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { healthtrackApi } from '../../services/healthtrackApi';
import { 
  TrendingUp, Users, Calendar, FileText, Activity, 
  DollarSign, BarChart3, PieChart, ArrowUp, ArrowDown,
  RefreshCw, Download, Brain, Lightbulb, Target
} from 'lucide-react';
import { Button } from '../ui/button';

const RevenueAnalyticsDashboard = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [usageReport, setUsageReport] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [timePeriod, setTimePeriod] = useState('30d');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboard, usage] = await Promise.all([
        healthtrackApi.aiAgents.getAnalyticsDashboard(),
        healthtrackApi.aiAgents.getUsageReport(30)
      ]);
      setDashboardData(dashboard);
      setUsageReport(usage);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIAnalysis = async () => {
    setGenerating(true);
    try {
      const analysis = await healthtrackApi.aiAgents.generateRevenueAnalytics(null, timePeriod, 'comprehensive');
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Failed to generate analysis:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  const stats = dashboardData?.current_stats || {};
  const growth = dashboardData?.growth_metrics || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-orange-600" />
            {t('revenue_analytics')}
          </h2>
          <p className="text-gray-600 mt-1">AI-powered platform usage and revenue insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadDashboardData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700" onClick={generateAIAnalysis} disabled={generating}>
            <Brain className="w-4 h-4 mr-2" />
            {generating ? 'Generating...' : 'AI Analysis'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats.total_users || 0} 
          icon={Users}
          color="blue"
          change={growth.users_growth}
        />
        <StatCard 
          title="Total Patients" 
          value={stats.total_patients || 0} 
          icon={Activity}
          color="green"
          change={growth.patients_growth}
        />
        <StatCard 
          title="Appointments" 
          value={stats.total_appointments || 0} 
          icon={Calendar}
          color="purple"
          change={growth.appointments_growth}
        />
        <StatCard 
          title="Prescriptions" 
          value={stats.total_prescriptions || 0} 
          icon={FileText}
          color="orange"
          change={growth.prescriptions_growth}
        />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Platform Usage Trends
          </h3>
          <div className="space-y-4">
            <UsageBar label="AI Insights Generated" value={stats.ai_insights_generated || 0} max={100} color="blue" />
            <UsageBar label="Wearable Devices" value={stats.wearable_devices || 0} max={50} color="green" />
            <UsageBar label="Lab Tests Analyzed" value={stats.lab_tests_count || 0} max={200} color="purple" />
            <UsageBar label="Prescriptions Written" value={stats.total_prescriptions || 0} max={100} color="orange" />
          </div>
        </div>

        {/* Feature Adoption */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-500" />
            Feature Adoption
          </h3>
          <div className="space-y-3">
            <FeatureRow name="Patient Management" adoption={85} />
            <FeatureRow name="AI Analytics" adoption={62} />
            <FeatureRow name="Telemedicine" adoption={45} />
            <FeatureRow name="Wearable Integration" adoption={38} />
            <FeatureRow name="Lab Report Analysis" adoption={72} />
          </div>
        </div>
      </div>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI-Generated Revenue Insights</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Summary */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Summary
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {aiAnalysis.analysis?.summary || 'Analysis summary will appear here after generation.'}
              </p>
            </div>

            {/* Revenue Opportunities */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                Revenue Opportunities
              </h4>
              <ul className="space-y-2">
                {(aiAnalysis.analysis?.revenue_opportunities || [
                  'Premium AI diagnostics subscription',
                  'Telemedicine consultation fees',
                  'Wearable device partnerships',
                  'Enterprise health programs'
                ]).map((opp, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {opp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Recommendations */}
            <div className="bg-white rounded-lg p-4 md:col-span-2">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Growth Recommendations
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {(aiAnalysis.analysis?.recommendations || [
                  { title: 'Expand AI Features', description: 'Add predictive health analytics' },
                  { title: 'Partner Programs', description: 'Collaborate with insurance providers' },
                  { title: 'Mobile App', description: 'Launch dedicated mobile application' }
                ]).map((rec, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <h5 className="font-medium text-gray-800 text-sm">{rec.title || rec}</h5>
                    {rec.description && (
                      <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Report */}
      {usageReport && (
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Usage Report (Last 30 Days)</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniStat label="Report ID" value={usageReport.report_id?.slice(0, 8) || 'N/A'} />
            <MiniStat label="Period" value={`${usageReport.period_days || 30} days`} />
            <MiniStat label="Generated" value={new Date(usageReport.generated_at).toLocaleDateString()} />
            <MiniStat label="Status" value="Complete" highlight />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon: Icon, color, change }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <span className={`text-xs flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  );
};

const UsageBar = ({ label, value, max, color }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const FeatureRow = ({ name, adoption }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{name}</span>
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
          style={{ width: `${adoption}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600 w-10">{adoption}%</span>
    </div>
  </div>
);

const MiniStat = ({ label, value, highlight }) => (
  <div className="text-center">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-sm font-medium ${highlight ? 'text-green-600' : 'text-gray-900'}`}>{value}</p>
  </div>
);

export default RevenueAnalyticsDashboard;
