/**
 * Comprehensive Health Analysis Page
 * Integrates ML analysis, trends, anomaly detection, and Ayurvedic insights
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Activity, Heart, Brain, Leaf, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, FileText, Download, Loader2,
  Wind, Flame, Droplets, ChevronRight, Plus, RefreshCw, Sparkles,
  Upload, BarChart3, Target, Shield, Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress } from '../components/ui/progress';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const HealthAnalysisPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [prakritiResult, setPrakritiResult] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [reportGenerating, setReportGenerating] = useState(false);

  // Sample data for demonstration
  const [vitals, setVitals] = useState({
    heart_rate: 78,
    blood_pressure_systolic: 125,
    blood_pressure_diastolic: 82,
    spo2: 97,
    temperature: 36.8,
    respiratory_rate: 16
  });

  const [historicalData, setHistoricalData] = useState([
    { date: '2026-02-17', value: 72 },
    { date: '2026-02-18', value: 75 },
    { date: '2026-02-19', value: 78 },
    { date: '2026-02-20', value: 76 },
    { date: '2026-02-21', value: 80 },
    { date: '2026-02-22', value: 82 },
    { date: '2026-02-23', value: 78 }
  ]);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // Run anomaly detection
      const anomalyResponse = await fetch(`${API_URL}/api/ml-health/anomaly/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: 'current-user',
          current_vitals: vitals
        })
      });
      
      if (anomalyResponse.ok) {
        const data = await anomalyResponse.json();
        setAnalysisResult(data);
      }

      // Run trend forecast
      const trendResponse = await fetch(`${API_URL}/api/ml-health/trend/forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: 'current-user',
          metric: 'heart_rate',
          historical_data: historicalData,
          forecast_days: 7
        })
      });

      if (trendResponse.ok) {
        const trendResult = await trendResponse.json();
        setTrendData(trendResult);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setReportGenerating(true);
    try {
      const response = await fetch(`${API_URL}/api/ml-health/report/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: 'current-user',
          patient_info: {
            name: 'User',
            age: 35,
            gender: 'Not specified',
            report_id: 'RPT-' + Date.now()
          },
          health_data: {
            summary: {
              overall_status: analysisResult?.status || 'good',
              text: 'Comprehensive health analysis based on your vitals and health data.',
              findings: analysisResult?.recommendations || []
            },
            vitals: vitals,
            trends: trendData ? [trendData] : [],
            anomalies: analysisResult,
            prakriti: prakritiResult,
            ayurvedic_recommendations: prakritiResult?.recommendations,
            lifestyle_tips: [
              'Maintain regular sleep schedule',
              'Stay hydrated with 8 glasses of water daily',
              'Practice mindfulness for 10 minutes daily',
              'Take regular breaks during work'
            ]
          },
          language: 'en'
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Open download link
        window.open(`${API_URL}${result.download_url}`, '_blank');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      alert('Failed to generate report');
    } finally {
      setReportGenerating(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-500 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'vitals', label: 'Vitals', icon: Heart },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'ayurveda', label: 'Ayurveda', icon: Leaf }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  Health Analysis
                </h1>
                <p className="text-sm text-gray-500">ML-powered comprehensive analysis</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={runAnalysis} disabled={loading} data-testid="refresh-analysis-btn" className="border-orange-200 hover:bg-orange-50">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                size="sm" 
                onClick={generateReport} 
                disabled={reportGenerating}
                data-testid="download-report-btn"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md"
              >
                {reportGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Report
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Status Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className={`${getStatusColor(analysisResult?.status)}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  {analysisResult?.status === 'normal' ? (
                    <CheckCircle className="w-10 h-10" />
                  ) : (
                    <AlertTriangle className="w-10 h-10" />
                  )}
                  <div>
                    <p className="text-sm opacity-70">Overall Status</p>
                    <p className="text-xl font-bold capitalize">{analysisResult?.status || 'Analyzing...'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Heart className="w-10 h-10 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Heart Rate</p>
                    <p className="text-xl font-bold">{vitals.heart_rate} <span className="text-sm font-normal">bpm</span></p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Activity className="w-10 h-10 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Blood Pressure</p>
                    <p className="text-xl font-bold">{vitals.blood_pressure_systolic}/{vitals.blood_pressure_diastolic}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Target className="w-10 h-10 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">SpO2</p>
                    <p className="text-xl font-bold">{vitals.spo2}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card 
                className="cursor-pointer hover:shadow-lg transition border-2 border-transparent hover:border-orange-300"
                onClick={() => navigate('/prakriti-assessment')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Prakriti Assessment</h3>
                      <p className="text-sm text-gray-500">Discover your Ayurvedic constitution</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition border-2 border-transparent hover:border-orange-300"
                onClick={() => navigate('/lab-reports')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl shadow-md">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Lab Report Analysis</h3>
                      <p className="text-sm text-gray-500">AI-powered report insights</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition border-2 border-transparent hover:border-orange-300"
                onClick={() => navigate('/appointments/book')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl shadow-md">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Book Consultation</h3>
                      <p className="text-sm text-gray-500">Consult with expert doctors</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts & Recommendations */}
            {analysisResult && (
              <Card className="border border-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" />
                    Health Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisResult.critical_alerts?.length > 0 && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-bold text-red-700 flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        Critical Alerts
                      </h4>
                      {analysisResult.critical_alerts.map((alert, i) => (
                        <p key={i} className="text-red-600 text-sm">{alert.message}</p>
                      ))}
                    </div>
                  )}

                  {analysisResult.warnings?.length > 0 && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-bold text-yellow-700 flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5" />
                        Warnings
                      </h4>
                      {analysisResult.warnings.map((warning, i) => (
                        <p key={i} className="text-yellow-700 text-sm">{warning.message}</p>
                      ))}
                    </div>
                  )}

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-bold text-green-700 flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {analysisResult.recommendations?.map((rec, i) => (
                        <li key={i} className="text-green-700 text-sm flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Vitals Tab */}
        {activeTab === 'vitals' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Vital Signs</CardTitle>
                <CardDescription>Real-time monitoring with anomaly detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(vitals).map(([key, value]) => {
                    const labels = {
                      heart_rate: { label: 'Heart Rate', unit: 'bpm', icon: Heart, color: 'red' },
                      blood_pressure_systolic: { label: 'BP Systolic', unit: 'mmHg', icon: Activity, color: 'blue' },
                      blood_pressure_diastolic: { label: 'BP Diastolic', unit: 'mmHg', icon: Activity, color: 'blue' },
                      spo2: { label: 'Oxygen Saturation', unit: '%', icon: Target, color: 'green' },
                      temperature: { label: 'Temperature', unit: '°C', icon: Flame, color: 'orange' },
                      respiratory_rate: { label: 'Respiratory Rate', unit: '/min', icon: Wind, color: 'purple' }
                    };
                    const info = labels[key] || { label: key, unit: '', icon: Activity, color: 'gray' };
                    
                    return (
                      <div key={key} className="p-4 border rounded-lg hover:shadow transition">
                        <div className="flex items-center gap-3 mb-2">
                          <info.icon className={`w-6 h-6 text-${info.color}-500`} />
                          <span className="text-sm text-gray-500">{info.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold">{value}</span>
                          <span className="text-gray-400">{info.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Input New Vitals */}
            <Card>
              <CardHeader>
                <CardTitle>Update Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={vitals.heart_rate}
                      onChange={(e) => setVitals(prev => ({ ...prev, heart_rate: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">BP Systolic</label>
                    <input
                      type="number"
                      value={vitals.blood_pressure_systolic}
                      onChange={(e) => setVitals(prev => ({ ...prev, blood_pressure_systolic: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">BP Diastolic</label>
                    <input
                      type="number"
                      value={vitals.blood_pressure_diastolic}
                      onChange={(e) => setVitals(prev => ({ ...prev, blood_pressure_diastolic: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">SpO2 (%)</label>
                    <input
                      type="number"
                      value={vitals.spo2}
                      onChange={(e) => setVitals(prev => ({ ...prev, spo2: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Temperature (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0 }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={runAnalysis} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            {trendData && (
              <Card className="border border-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    Heart Rate Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Trend Direction</p>
                      <div className="flex items-center gap-2">
                        {trendData.trend_direction === 'increasing' ? (
                          <TrendingUp className="w-5 h-5 text-red-500" />
                        ) : trendData.trend_direction === 'decreasing' ? (
                          <TrendingDown className="w-5 h-5 text-green-500" />
                        ) : (
                          <Activity className="w-5 h-5 text-blue-500" />
                        )}
                        <span className="font-bold capitalize">{trendData.trend_direction}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Current Value</p>
                      <p className="text-2xl font-bold">{trendData.current_value} <span className="text-sm font-normal">bpm</span></p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Average</p>
                      <p className="text-2xl font-bold">{trendData.mean_value} <span className="text-sm font-normal">bpm</span></p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Change</p>
                      <p className={`text-2xl font-bold ${trendData.change_percentage > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {trendData.change_percentage > 0 ? '+' : ''}{trendData.change_percentage}%
                      </p>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg mb-6 border border-orange-100">
                    <h4 className="font-bold text-orange-700 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Insights
                    </h4>
                    <ul className="space-y-1">
                      {trendData.insights?.map((insight, i) => (
                        <li key={i} className="text-orange-700 text-sm flex items-start gap-2">
                          <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Forecast */}
                  <h4 className="font-bold mb-3">7-Day Forecast</h4>
                  <div className="overflow-x-auto">
                    <div className="flex gap-2 pb-2">
                      {trendData.forecast?.map((day, i) => (
                        <div key={i} className="flex-shrink-0 p-3 bg-gradient-to-b from-orange-50 to-amber-50 border border-orange-100 rounded-lg text-center min-w-[100px]">
                          <p className="text-xs text-gray-500">{day.date}</p>
                          <p className="text-lg font-bold text-orange-600">{day.predicted_value}</p>
                          <p className="text-xs text-gray-400">bpm</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Ayurveda Tab */}
        {activeTab === 'ayurveda' && (
          <div className="space-y-6">
            {/* Prakriti Card */}
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md">
                      <Leaf className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Discover Your Prakriti</h3>
                      <p className="text-gray-600">Take the assessment to get personalized Ayurvedic recommendations</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/prakriti-assessment')}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md"
                  >
                    Start Assessment
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dosha Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border border-blue-100">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                    <Wind className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Vata</h3>
                  <p className="text-sm text-gray-500 mb-4">Air & Space</p>
                  <p className="text-xs text-gray-600">
                    Governs movement, breathing, circulation. Characteristics: Creative, quick-thinking, energetic.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-orange-100">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pitta</h3>
                  <p className="text-sm text-gray-500 mb-4">Fire & Water</p>
                  <p className="text-xs text-gray-600">
                    Governs digestion, metabolism, transformation. Characteristics: Intelligent, focused, driven.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-amber-100">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Kapha</h3>
                  <p className="text-sm text-gray-500 mb-4">Earth & Water</p>
                  <p className="text-xs text-gray-600">
                    Governs structure, stability, lubrication. Characteristics: Calm, nurturing, steady.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthAnalysisPage;
