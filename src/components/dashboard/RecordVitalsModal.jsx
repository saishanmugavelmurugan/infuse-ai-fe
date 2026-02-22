import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Activity, Heart, Thermometer, AlertCircle } from 'lucide-react';
import { healthtrackApi } from '../../services/healthtrackApi';

const RecordVitalsModal = ({ patient, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    temperature: '',
    blood_sugar: '',
    respiratory_rate: '',
    oxygen_saturation: '',
    weight: '',
    height: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create vitals object with only filled values
      const vitals = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== 'notes') {
          vitals[key] = parseFloat(value) || value;
        }
      });

      await healthtrackApi.patients.addVitals(patient.id, {
        vitals,
        notes: formData.notes,
        recorded_at: new Date().toISOString()
      });
      
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to record vitals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-600" />
            Record Vitals
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

          {/* Blood Pressure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Heart className="w-4 h-4 inline mr-1 text-red-500" />
              Blood Pressure (mmHg)
            </label>
            <div className="flex gap-3">
              <Input
                type="number"
                name="blood_pressure_systolic"
                value={formData.blood_pressure_systolic}
                onChange={handleChange}
                placeholder="Systolic (e.g., 120)"
                className="flex-1"
              />
              <span className="self-center text-gray-500">/</span>
              <Input
                type="number"
                name="blood_pressure_diastolic"
                value={formData.blood_pressure_diastolic}
                onChange={handleChange}
                placeholder="Diastolic (e.g., 80)"
                className="flex-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heart Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heart Rate (bpm)
              </label>
              <Input
                type="number"
                name="heart_rate"
                value={formData.heart_rate}
                onChange={handleChange}
                placeholder="e.g., 72"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Thermometer className="w-4 h-4 inline mr-1 text-orange-500" />
                Temperature (°F)
              </label>
              <Input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="e.g., 98.6"
              />
            </div>

            {/* Blood Sugar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Sugar (mg/dL)
              </label>
              <Input
                type="number"
                name="blood_sugar"
                value={formData.blood_sugar}
                onChange={handleChange}
                placeholder="e.g., 100"
              />
            </div>

            {/* Oxygen Saturation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oxygen Saturation (%)
              </label>
              <Input
                type="number"
                name="oxygen_saturation"
                value={formData.oxygen_saturation}
                onChange={handleChange}
                placeholder="e.g., 98"
              />
            </div>

            {/* Respiratory Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Respiratory Rate (breaths/min)
              </label>
              <Input
                type="number"
                name="respiratory_rate"
                value={formData.respiratory_rate}
                onChange={handleChange}
                placeholder="e.g., 16"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <Input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 70"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Any additional observations..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Vitals'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordVitalsModal;
