import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Plus, Trash2, Search, AlertCircle, Info, AlertTriangle, Pill } from 'lucide-react';
import { healthtrackApi } from '../../services/healthtrackApi';

const WritePrescriptionModal = ({ onClose, onSuccess, patient, patients }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(patient);
  const [selectedDrugInfo, setSelectedDrugInfo] = useState(null);
  const [drugInteractions, setDrugInteractions] = useState([]);
  const [searchingFDA, setSearchingFDA] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);
  
  const [formData, setFormData] = useState({
    patient_id: patient?.id || '',
    diagnosis: '',
    medications: [
      { drug_name: '', drug_id: '', dosage: '', frequency: '', duration: '', instructions: '', quantity: 1 }
    ],
    follow_up_date: '',
    notes: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData(prev => ({ ...prev, patient_id: patient.id }));
    }
  }, [patient]);

  // Check for drug interactions when medications change
  useEffect(() => {
    const checkInteractions = async () => {
      const drugIds = formData.medications
        .filter(m => m.drug_id && m.drug_id.startsWith('drug-'))
        .map(m => m.drug_id);
      
      if (drugIds.length >= 2) {
        try {
          const result = await healthtrackApi.drugDatabase.checkInteractions(drugIds);
          setDrugInteractions(result.interactions || []);
        } catch (err) {
          console.error('Error checking interactions:', err);
        }
      } else {
        setDrugInteractions([]);
      }
    };
    
    checkInteractions();
  }, [formData.medications]);

  const handleDrugSearch = async (query, index) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setActiveSearchIndex(index);
    setSearchingFDA(true);
    
    try {
      // Use combined search for both internal and OpenFDA
      const results = await healthtrackApi.drugDatabase.combinedSearch(query, true, 15);
      
      // Combine internal and OpenFDA results
      const combinedResults = [
        ...(results.internal_results?.drugs || []),
        ...(results.openfda_results?.drugs || [])
      ];
      
      setSearchResults(combinedResults);
    } catch (err) {
      console.error('Drug search error:', err);
      // Fallback to internal search
      try {
        const results = await healthtrackApi.drugDatabase.search(query);
        setSearchResults(results.drugs || []);
      } catch (e) {
        setSearchResults([]);
      }
    } finally {
      setSearchingFDA(false);
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMeds = [...formData.medications];
    updatedMeds[index][field] = value;
    setFormData(prev => ({ ...prev, medications: updatedMeds }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { drug_name: '', drug_id: '', dosage: '', frequency: '', duration: '', instructions: '', quantity: 1 }]
    }));
  };

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      const updatedMeds = formData.medications.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, medications: updatedMeds }));
    }
  };

  const selectDrug = (index, drug) => {
    handleMedicationChange(index, 'drug_name', drug.name);
    handleMedicationChange(index, 'drug_id', drug.id);
    
    // Set default dosage if available
    if (drug.strengths && drug.strengths.length > 0) {
      handleMedicationChange(index, 'dosage', drug.strengths[0]);
    }
    
    setSelectedDrugInfo(drug);
    setSearchResults([]);
    setActiveSearchIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.patient_id) {
      setError('Please select a patient');
      return;
    }

    if (!formData.medications[0]?.drug_name) {
      setError('Please add at least one medication');
      return;
    }

    setLoading(true);

    try {
      await healthtrackApi.prescriptions.create(formData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Pill className="w-5 h-5 text-orange-600" />
            Write Prescription
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Drug Interactions Warning */}
          {drugInteractions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Potential Drug Interactions Detected</span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1">
                {drugInteractions.map((interaction, i) => (
                  <li key={i}>
                    <span className="font-medium">{interaction.drug1}</span> + <span className="font-medium">{interaction.drug2}</span>: {interaction.interaction}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Patient Selection */}
          {!patient && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient *</label>
              <select
                value={formData.patient_id}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, patient_id: e.target.value }));
                  const found = patients.find(p => p.id === e.target.value);
                  setSelectedPatient(found);
                }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select a patient</option>
                {patients?.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} - {p.patient_number}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Selected Patient Info */}
          {selectedPatient && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">{selectedPatient.first_name} {selectedPatient.last_name}</p>
              <p className="text-sm text-gray-600">{selectedPatient.patient_number}</p>
            </div>
          )}

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
            <Input
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              placeholder="Enter diagnosis"
              required
            />
          </div>

          {/* Medications */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Medications *</label>
              <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                <Plus className="w-4 h-4 mr-1" /> Add Medication
              </Button>
            </div>

            {formData.medications.map((med, index) => (
              <div key={index} className="border rounded-lg p-4 mb-3 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-sm">Medication #{index + 1}</span>
                  {formData.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm text-gray-600 mb-1">Drug Name * (Search from Database)</label>
                    <div className="relative">
                      <Input
                        value={med.drug_name}
                        onChange={(e) => {
                          handleMedicationChange(index, 'drug_name', e.target.value);
                          handleDrugSearch(e.target.value, index);
                        }}
                        placeholder="Search drug name..."
                        required
                        className="pr-10"
                      />
                      {searchingFDA && activeSearchIndex === index && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                    {searchResults.length > 0 && activeSearchIndex === index && (
                      <div className="absolute z-20 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                        {searchResults.map((drug, i) => (
                          <button
                            key={`${drug.id}-${i}`}
                            type="button"
                            onClick={() => selectDrug(index, drug)}
                            className="w-full text-left px-3 py-2 hover:bg-orange-50 border-b last:border-b-0"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-medium text-gray-800">{drug.name}</span>
                                <span className="text-sm text-gray-500 ml-2">({drug.generic_name})</span>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded ${drug.source === 'openfda' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                {drug.source === 'openfda' ? 'FDA' : 'Local'}
                              </span>
                            </div>
                            {drug.drug_class && (
                              <p className="text-xs text-gray-500 mt-0.5">{drug.drug_class}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Dosage *</label>
                    <Input
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                      placeholder="e.g., 500mg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Frequency *</label>
                    <select
                      value={med.frequency}
                      onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="As needed">As needed</option>
                      <option value="Every 4 hours">Every 4 hours</option>
                      <option value="Every 6 hours">Every 6 hours</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Duration *</label>
                    <Input
                      value={med.duration}
                      onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                      placeholder="e.g., 7 days"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                    <Input
                      type="number"
                      min="1"
                      value={med.quantity}
                      onChange={(e) => handleMedicationChange(index, 'quantity', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Instructions</label>
                    <Input
                      value={med.instructions}
                      onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                      placeholder="e.g., Take after meals"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Drug Information */}
          {selectedDrugInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Drug Information: {selectedDrugInfo.name}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {selectedDrugInfo.drug_class && (
                  <div>
                    <span className="font-medium text-gray-700">Class:</span>
                    <span className="ml-2 text-gray-600">{selectedDrugInfo.drug_class}</span>
                  </div>
                )}
                {selectedDrugInfo.strengths && selectedDrugInfo.strengths.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Available Strengths:</span>
                    <span className="ml-2 text-gray-600">{selectedDrugInfo.strengths.join(', ')}</span>
                  </div>
                )}
                {selectedDrugInfo.warnings && selectedDrugInfo.warnings.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-red-600">Warnings:</span>
                    <span className="ml-2 text-gray-600">{selectedDrugInfo.warnings.slice(0, 2).join('; ')}</span>
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setSelectedDrugInfo(null)}
                className="text-blue-600 text-sm mt-2 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Follow-up Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
            <Input
              type="date"
              value={formData.follow_up_date}
              onChange={(e) => setFormData(prev => ({ ...prev, follow_up_date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Any additional instructions or notes..."
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
              {loading ? 'Creating...' : 'Create Prescription'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WritePrescriptionModal;
