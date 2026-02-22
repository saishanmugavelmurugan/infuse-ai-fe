import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Beaker, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { healthtrackApi } from '../../services/healthtrackApi';

const OrderLabTestModal = ({ patient, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [priority, setPriority] = useState('routine');
  const [notes, setNotes] = useState('');

  const availableTests = [
    { id: 'cbc', name: 'Complete Blood Count (CBC)', category: 'Hematology' },
    { id: 'lipid', name: 'Lipid Profile', category: 'Biochemistry' },
    { id: 'hba1c', name: 'Diabetes Panel (HbA1c)', category: 'Biochemistry' },
    { id: 'thyroid', name: 'Thyroid Function Test', category: 'Endocrine' },
    { id: 'lft', name: 'Liver Function Test (LFT)', category: 'Biochemistry' },
    { id: 'kft', name: 'Kidney Function Test (KFT)', category: 'Biochemistry' },
    { id: 'vitamin', name: 'Vitamin D & B12 Panel', category: 'Vitamins' },
    { id: 'urine', name: 'Urine Analysis', category: 'Urinalysis' },
    { id: 'ecg', name: 'ECG/EKG', category: 'Cardiology' },
    { id: 'xray', name: 'Chest X-Ray', category: 'Radiology' },
  ];

  const toggleTest = (testId) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(t => t !== testId)
        : [...prev, testId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedTests.length === 0) {
      setError('Please select at least one test');
      return;
    }

    setLoading(true);

    try {
      // Order each selected test
      for (const testId of selectedTests) {
        const test = availableTests.find(t => t.id === testId);
        if (test) {
          await healthtrackApi.labTests.order({
            patient_id: patient.id,
            test_name: test.name,
            test_type: test.category.toLowerCase(),
            priority: priority,
            notes: notes
          });
        }
      }
      
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to order lab tests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Beaker className="w-5 h-5 text-blue-600" />
            Order Lab Tests
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Info */}
        <div className="px-4 py-3 bg-gray-50 border-b">
          <p className="font-medium">{patient.first_name} {patient.last_name}</p>
          <p className="text-sm text-gray-600">{patient.patient_number}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Test Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Tests to Order
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableTests.map((test) => (
                <div
                  key={test.id}
                  className={`p-3 border rounded-lg cursor-pointer transition ${
                    selectedTests.includes(test.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleTest(test.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{test.name}</p>
                      <p className="text-xs text-gray-500">{test.category}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      selectedTests.includes(test.id)
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {selectedTests.includes(test.id) && '✓'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Tests Summary */}
          {selectedTests.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                {selectedTests.length} test(s) selected
              </p>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex gap-3">
              {['routine', 'urgent', 'stat'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-4 py-2 rounded-lg border capitalize transition ${
                    priority === p
                      ? p === 'stat' ? 'bg-red-500 text-white border-red-500' :
                        p === 'urgent' ? 'bg-yellow-500 text-white border-yellow-500' :
                        'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinical Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Reason for ordering, clinical suspicion, etc."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading || selectedTests.length === 0}
            >
              {loading ? 'Ordering...' : `Order ${selectedTests.length} Test(s)`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderLabTestModal;
