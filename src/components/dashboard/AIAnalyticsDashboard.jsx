import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Brain, Activity, AlertTriangle, Leaf, Heart, FileText, 
  RefreshCw, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { healthtrackApi } from '../../services/healthtrackApi';

const AIAnalyticsDashboard = ({ patientId, labTests = [] }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    allopathic: true,
    ayurvedic: true,
    lifestyle: true,
    warnings: true
  });
  const [selectedLabTest, setSelectedLabTest] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchExistingAnalysis();
    }
  }, [patientId]);

  const fetchExistingAnalysis = async () => {
    try {
      setLoading(true);
      const data = await healthtrackApi.aiAnalytics.getPatientAnalyses(patientId);
      if (data.analyses && data.analyses.length > 0) {
        setAnalysis(data.analyses[0]);
      }
    } catch (err) {
      console.error('Error fetching analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const runComprehensiveAnalysis = async () => {
    try {
      setAnalyzing(true);
      const data = await healthtrackApi.aiAnalytics.getComprehensiveAnalysis(patientId);
      setAnalysis(data);
    } catch (err) {
      console.error('Error running analysis:', err);
      alert('Failed to run analysis: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeLabTest = async (labTestId) => {
    try {
      setAnalyzing(true);
      setSelectedLabTest(labTestId);
      const data = await healthtrackApi.aiAnalytics.analyzeLabReport(labTestId, patientId);
      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing lab test:', err);
      alert('Failed to analyze lab test: ' + err.message);
    } finally {
      setAnalyzing(false);
      setSelectedLabTest(null);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="border-l-4 border-l-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              AI-Powered Health Analytics
            </span>
            <Button 
              onClick={runComprehensiveAnalysis}
              disabled={analyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {analyzing ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Run AI Analysis</>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">
            Get comprehensive health insights powered by AI, including both modern medicine (Allopathic) 
            and traditional Ayurvedic recommendations.
          </p>
        </CardContent>
      </Card>

      {/* Lab Test Quick Analysis */}
      {labTests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Analyze Lab Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {labTests.slice(0, 6).map((test) => (
                <div key={test.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="font-medium text-sm">{test.test_name}</div>
                  <div className="text-xs text-gray-500 mt-1">{test.result_date?.split('T')[0]}</div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-2 w-full text-purple-600 border-purple-600"
                    onClick={() => analyzeLabTest(test.id)}
                    disabled={analyzing && selectedLabTest === test.id}
                  >
                    {analyzing && selectedLabTest === test.id ? 'Analyzing...' : 'AI Analyze'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Summary */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg">Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{analysis.summary}</p>
              {analysis.data_sources && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.data_sources.vitals && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Vitals Data</span>
                  )}
                  {analysis.data_sources.lab_tests > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {analysis.data_sources.lab_tests} Lab Tests
                    </span>
                  )}
                  {analysis.data_sources.wearable_data_points > 0 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {analysis.data_sources.wearable_data_points} Wearable Data Points
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allopathic Recommendations */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => toggleSection('allopathic')}
            >
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Modern Medicine Recommendations
                </span>
                {expandedSections.allopathic ? <ChevronUp /> : <ChevronDown />}
              </CardTitle>
            </CardHeader>
            {expandedSections.allopathic && (
              <CardContent>
                <ul className="space-y-2">
                  {analysis.allopathic_recommendations?.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>

          {/* Ayurvedic Recommendations */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => toggleSection('ayurvedic')}
            >
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Ayurvedic & Natural Recommendations
                </span>
                {expandedSections.ayurvedic ? <ChevronUp /> : <ChevronDown />}
              </CardTitle>
            </CardHeader>
            {expandedSections.ayurvedic && (
              <CardContent>
                <ul className="space-y-2">
                  {analysis.ayurvedic_recommendations?.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>

          {/* Lifestyle Tips */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => toggleSection('lifestyle')}
            >
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Lifestyle Tips
                </span>
                {expandedSections.lifestyle ? <ChevronUp /> : <ChevronDown />}
              </CardTitle>
            </CardHeader>
            {expandedSections.lifestyle && (
              <CardContent>
                <ul className="space-y-2">
                  {analysis.lifestyle_tips?.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-pink-100 text-pink-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>

          {/* Warning Signs */}
          {analysis.warning_signs?.length > 0 && (
            <Card className="border-l-4 border-l-red-500">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50" 
                onClick={() => toggleSection('warnings')}
              >
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    Warning Signs to Watch
                  </span>
                  {expandedSections.warnings ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
              {expandedSections.warnings && (
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.warning_signs?.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          )}

          {/* Medical Disclaimer */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-800">Important Medical Disclaimer</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {analysis.disclaimer || "This AI-generated analysis is for informational purposes only and should NOT be considered as medical advice. Always consult with a qualified healthcare professional before making any health-related decisions or starting any treatment."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Analysis Yet */}
      {!analysis && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Brain className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No AI analysis available yet</p>
              <p className="text-sm text-gray-500 mt-1">Click "Run AI Analysis" to get comprehensive health insights</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAnalyticsDashboard;
