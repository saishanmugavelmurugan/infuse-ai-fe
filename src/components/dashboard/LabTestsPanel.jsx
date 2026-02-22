import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  FileText, Download, Eye, AlertCircle, CheckCircle, 
  AlertTriangle, Brain
} from 'lucide-react';
import { healthtrackApi } from '../../services/healthtrackApi';

const LabTestsPanel = ({ patientId, onAnalyze }) => {
  const [loading, setLoading] = useState(true);
  const [labTests, setLabTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchLabTests();
    }
  }, [patientId]);

  const fetchLabTests = async () => {
    try {
      setLoading(true);
      // Fetch lab tests from the new endpoint
      const data = await healthtrackApi.labTests.getPatientTests(patientId);
      setLabTests(data.lab_tests || []);
    } catch (err) {
      console.error('Error fetching lab tests:', err);
      // Fallback: try to get from patient medical history
      try {
        const historyData = await healthtrackApi.patients.getMedicalHistory(patientId);
        setLabTests(historyData.lab_results || historyData.lab_tests || []);
      } catch (e) {
        console.error('Fallback fetch failed:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'normal': return 'bg-green-100 text-green-700';
      case 'high': 
      case 'low': 
      case 'deficient': return 'bg-red-100 text-red-700';
      case 'borderline_high':
      case 'borderline_low':
      case 'pre_diabetic': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'normal': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'high': 
      case 'low': 
      case 'deficient': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Lab Test Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {labTests.length > 0 ? (
            <div className="space-y-4">
              {labTests.map((test) => (
                <div key={test.id} className="border rounded-lg overflow-hidden">
                  {/* Test Header */}
                  <div 
                    className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{test.test_name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {test.result_date ? new Date(test.result_date).toLocaleDateString() : 'Pending'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {test.status}
                        </span>
                        {onAnalyze && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-purple-600 border-purple-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAnalyze(test.id);
                            }}
                          >
                            <Brain className="w-3 h-3 mr-1" />
                            AI Analyze
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Test Results (Expanded) */}
                  {selectedTest === test.id && test.results && (
                    <div className="p-4 border-t">
                      <h5 className="font-medium mb-3">Test Results</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(test.results).map(([key, value]) => (
                          <div key={key} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-sm text-gray-600 capitalize">
                                  {key.replace(/_/g, ' ')}
                                </span>
                                <div className="text-lg font-semibold mt-1">
                                  {value.value} <span className="text-sm font-normal text-gray-500">{value.unit}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Reference: {value.reference_range}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(value.status)}
                                <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(value.status)}`}>
                                  {value.status?.replace(/_/g, ' ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {test.notes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Doctor's Notes:</strong> {test.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600">No lab test reports available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LabTestsPanel;
