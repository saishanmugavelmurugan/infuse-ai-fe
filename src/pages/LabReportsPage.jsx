/**
 * Lab Reports Page - AI-Powered OCR Extraction
 * Upload lab reports (PDF/images) and get automatic AI analysis
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, FileText, BarChart3, TrendingUp, 
  Trash2, Eye, Download, AlertCircle, CheckCircle, Loader2,
  Heart, Activity, AlertTriangle, Clock, RefreshCw, X,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const LabReportsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedResults, setExpandedResults] = useState({});

  // Fetch existing reports
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/lab-ocr/reports?limit=50`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
    setLoading(false);
  };

  // Handle file upload with AI OCR
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or image file (JPG, PNG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);

      const response = await fetch(`${API_URL}/api/lab-ocr/upload-and-extract`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Successfully extracted ${data.extraction.results_count} test results!`);
        setSelectedReport(data);
        setActiveTab('results');
        fetchReports();
      } else {
        const errData = await response.json();
        setError(errData.detail || 'Failed to process lab report');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    }
    setUploading(false);
    setUploadProgress(0);
  };

  // Reanalyze a report
  const reanalyzeReport = async (reportId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/lab-ocr/reports/${reportId}/reanalyze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedReport(prev => ({
          ...prev,
          analysis: data.analysis
        }));
        setSuccess('Analysis updated!');
      }
    } catch (err) {
      setError('Failed to reanalyze');
    }
    setLoading(false);
  };

  // Delete a report
  const deleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/lab-ocr/reports/${reportId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Report deleted');
        setReports(prev => prev.filter(r => r.id !== reportId));
        if (selectedReport?.report_id === reportId) {
          setSelectedReport(null);
        }
      }
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  // View report details
  const viewReport = async (reportId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/lab-ocr/reports/${reportId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedReport({
          report_id: data.id,
          extraction: {
            test_type: data.test_type,
            test_date: data.test_date,
            patient_name: data.patient_name,
            lab_name: data.lab_name,
            results: data.results,
            results_count: data.results?.length || 0,
            confidence: data.confidence
          },
          analysis: {
            summary: data.ai_summary,
            recommendations: data.recommendations,
            concerns: data.concerns,
            ...data.ai_analysis
          }
        });
        setActiveTab('results');
      }
    } catch (err) {
      setError('Failed to load report');
    }
    setLoading(false);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Toggle result expansion
  const toggleExpand = (index) => {
    setExpandedResults(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const tabs = [
    { id: 'upload', label: 'Upload Report', icon: Upload },
    { id: 'history', label: 'My Reports', icon: FileText },
    { id: 'results', label: 'AI Analysis', icon: Sparkles },
    { id: 'trends', label: 'Health Trends', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              data-testid="back-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lab Reports</h1>
              <p className="text-sm text-gray-500">AI-powered report analysis & health tracking</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/health-analysis')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition shadow-md"
            data-testid="full-analysis-btn"
          >
            <Download className="w-4 h-4" />
            Full Health Report
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-orange-50 border border-orange-100'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {success && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700 flex-1">{success}</p>
            <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Lab Analysis</h2>
              <p className="text-gray-500 mb-8">
                Upload your lab report and our AI will automatically extract all test values, 
                analyze results, and provide personalized health recommendations.
              </p>

              <label className="relative cursor-pointer block">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                  data-testid="file-upload-input"
                />
                <div className={`border-2 border-dashed rounded-2xl p-12 transition ${
                  uploading 
                    ? 'border-orange-400 bg-orange-50' 
                    : 'border-orange-300 hover:border-orange-500 hover:bg-orange-50'
                }`}>
                  {uploading ? (
                    <div className="space-y-4">
                      <Loader2 className="w-12 h-12 text-orange-500 mx-auto animate-spin" />
                      <p className="text-lg font-medium text-gray-700">
                        Analyzing your report with AI...
                      </p>
                      <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Extracting test values and generating insights
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        PDF, JPG, or PNG (Max 10MB)
                      </p>
                    </>
                  )}
                </div>
              </label>

              {/* Features */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 text-left border border-orange-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart OCR</h3>
                  <p className="text-sm text-gray-600">
                    AI reads and extracts every test value from your report automatically
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-6 text-left border border-amber-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dual Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Get insights from both Allopathic and Ayurvedic medical perspectives
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-left border border-orange-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Track Trends</h3>
                  <p className="text-sm text-gray-600">
                    Upload multiple reports to track your health metrics over time
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Lab Reports</h2>
              <button
                onClick={fetchReports}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {loading && reports.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No reports yet</h3>
                <p className="text-gray-500 mb-6">Upload your first lab report to get started</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition shadow-md"
                >
                  Upload Report
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {report.test_type || 'Lab Report'}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {report.test_date || report.created_at?.split('T')[0]}
                          </span>
                          <span>•</span>
                          <span>{report.results?.length || 0} tests</span>
                          {report.confidence && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">
                                {Math.round(report.confidence * 100)}% confidence
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewReport(report.id)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 flex items-center gap-2 transition shadow-sm"
                        data-testid={`view-report-${report.id}`}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        data-testid={`delete-report-${report.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {selectedReport ? (
              <>
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedReport.extraction?.test_type || 'Lab Report'} Analysis
                        </h2>
                        <p className="text-gray-500">
                          {selectedReport.extraction?.test_date || 'Date not specified'} • 
                          {selectedReport.extraction?.lab_name || 'Lab not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {Math.round((selectedReport.extraction?.confidence || 0.8) * 100)}% Confidence
                      </span>
                      <button
                        onClick={() => reanalyzeReport(selectedReport.report_id)}
                        disabled={loading}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                      >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-6 border border-orange-100">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-500" />
                      AI Summary
                    </h3>
                    <p className="text-gray-700">{selectedReport.analysis?.summary || 'Analysis in progress...'}</p>
                  </div>

                  {/* Concerns */}
                  {selectedReport.analysis?.concerns?.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h3 className="font-semibold text-red-700">Attention Required</h3>
                      </div>
                      <ul className="space-y-1">
                        {selectedReport.analysis.concerns.map((concern, i) => (
                          <li key={i} className="text-red-700 flex items-start gap-2">
                            <span>•</span>
                            <span>{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Test Results */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Extracted Test Results ({selectedReport.extraction?.results_count || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedReport.extraction?.results?.map((result, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleExpand(index)}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                              {result.status || 'N/A'}
                            </span>
                            <div>
                              <h4 className="font-medium text-gray-900">{result.test_name}</h4>
                              <p className="text-sm text-gray-500">Normal: {result.normal_range}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">{result.value}</p>
                              <p className="text-sm text-gray-500">{result.unit}</p>
                            </div>
                            {expandedResults[index] ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        {expandedResults[index] && (
                          <div className="px-4 pb-4 pt-2 border-t bg-gray-50">
                            <p className="text-sm text-gray-600">
                              Your {result.test_name} level is <strong>{result.value} {result.unit}</strong>.
                              {result.status === 'normal' && ' This is within the normal range.'}
                              {result.status === 'high' && ' This is above the normal range.'}
                              {result.status === 'low' && ' This is below the normal range.'}
                              {result.status === 'critical' && ' This requires immediate attention.'}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Allopathic */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Allopathic Advice</h3>
                    </div>
                    <ul className="space-y-2">
                      {(selectedReport.analysis?.allopathic_recommendations || selectedReport.analysis?.recommendations || []).map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ayurvedic */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Ayurvedic Advice</h3>
                    </div>
                    <ul className="space-y-2">
                      {(selectedReport.analysis?.ayurvedic_recommendations || []).map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="text-amber-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Lifestyle Tips */}
                {selectedReport.analysis?.lifestyle_tips?.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Lifestyle Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedReport.analysis.lifestyle_tips.map((tip, i) => (
                        <div key={i} className="bg-orange-50 rounded-xl p-4">
                          <p className="text-gray-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Disclaimer:</strong> This AI-generated analysis is for informational purposes only. 
                    Always consult with a qualified healthcare professional for medical advice and treatment decisions.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Report Selected</h3>
                <p className="text-gray-500 mb-6">Upload a lab report or select one from history to view analysis</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition shadow-md"
                >
                  Upload Report
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Health Trends</h2>
                <p className="text-gray-500">Track your health metrics over time</p>
              </div>
            </div>

            {reports.length < 2 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Need More Data</h3>
                <p className="text-gray-500 mb-2">
                  Upload at least 2 lab reports to see your health trends
                </p>
                <p className="text-sm text-gray-400">
                  Current reports: {reports.length}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600">
                  You have {reports.length} reports. Trend analysis is available on the 
                  <button 
                    onClick={() => navigate('/health-analysis')}
                    className="text-orange-500 hover:underline mx-1"
                  >
                    Health Analysis
                  </button>
                  page with advanced forecasting.
                </p>
                
                <button
                  onClick={() => navigate('/health-analysis')}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 flex items-center justify-center gap-2 transition shadow-md"
                >
                  <TrendingUp className="w-5 h-5" />
                  View Full Health Trends & Forecasts
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LabReportsPage;
