import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { X, User, Phone, Mail, Calendar, Heart, AlertCircle, Activity, Pill, FileText } from 'lucide-react';
import { healthtrackApi } from '../../services/healthtrackApi';

const PatientDetailModal = ({ patient, onClose, onWritePrescription }) => {
  const [loading, setLoading] = useState(true);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMedicalHistory();
  }, [patient.id]);

  const fetchMedicalHistory = async () => {
    try {
      const data = await healthtrackApi.patients.getMedicalHistory(patient.id);
      setMedicalHistory(data);
    } catch (err) {
      console.error('Error fetching medical history:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'records', label: 'Records', icon: FileText },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {patient.first_name?.[0]}{patient.last_name?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{patient.first_name} {patient.last_name}</h2>
              <p className="text-orange-100">{patient.patient_number}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'text-orange-600 border-b-2 border-orange-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Date of Birth</p>
                          <p className="font-medium">{patient.date_of_birth || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Gender</p>
                          <p className="font-medium capitalize">{patient.gender || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Blood Type</p>
                          <p className="font-medium">{patient.blood_type || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            patient.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {patient.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{patient.phone}</span>
                        </div>
                        {patient.address && (
                          <div className="text-gray-600">
                            {patient.address.street && <p>{patient.address.street}</p>}
                            <p>{patient.address.city}, {patient.address.state} {patient.address.zip_code}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div>
                    <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Medical History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                          <Heart className="w-4 h-4" /> Chronic Conditions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {patient.medical_history?.chronic_conditions?.length > 0 ? (
                            patient.medical_history.chronic_conditions.map((c, i) => (
                              <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">{c}</span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">None recorded</span>
                          )}
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Allergies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {patient.medical_history?.allergies?.length > 0 ? (
                            patient.medical_history.allergies.map((a, i) => (
                              <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">{a}</span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">None recorded</span>
                          )}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <Pill className="w-4 h-4" /> Current Medications
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {patient.medical_history?.current_medications?.length > 0 ? (
                            patient.medical_history.current_medications.map((m, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{m}</span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">None recorded</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  {medicalHistory && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-600">{medicalHistory.total_records || 0}</p>
                        <p className="text-sm text-gray-600">Medical Records</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-600">{medicalHistory.total_prescriptions || 0}</p>
                        <p className="text-sm text-gray-600">Prescriptions</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-600">{medicalHistory.total_lab_results || 0}</p>
                        <p className="text-sm text-gray-600">Lab Results</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Records Tab */}
              {activeTab === 'records' && (
                <div className="space-y-4">
                  {medicalHistory?.medical_records?.length > 0 ? (
                    medicalHistory.medical_records.map(record => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium capitalize">{record.record_type || 'Consultation'}</p>
                            <p className="text-sm text-gray-600">{record.record_date}</p>
                          </div>
                        </div>
                        {record.diagnosis && (
                          <div className="mt-3">
                            <p className="text-sm font-medium">Diagnosis:</p>
                            <p className="text-sm text-gray-600">{record.diagnosis}</p>
                          </div>
                        )}
                        {record.vitals && (
                          <div className="mt-3 flex gap-4 text-sm">
                            {record.vitals.blood_pressure_systolic && (
                              <span className="bg-blue-50 px-2 py-1 rounded">
                                BP: {record.vitals.blood_pressure_systolic}/{record.vitals.blood_pressure_diastolic}
                              </span>
                            )}
                            {record.vitals.heart_rate && (
                              <span className="bg-green-50 px-2 py-1 rounded">
                                HR: {record.vitals.heart_rate} bpm
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No medical records found</p>
                    </div>
                  )}
                </div>
              )}

              {/* Prescriptions Tab */}
              {activeTab === 'prescriptions' && (
                <div className="space-y-4">
                  {medicalHistory?.prescriptions?.length > 0 ? (
                    medicalHistory.prescriptions.map(presc => (
                      <div key={presc.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Rx #{presc.prescription_number}</p>
                            <p className="text-sm text-gray-600">{presc.prescription_date?.split('T')[0]}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            presc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {presc.status}
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {presc.medications?.map((med, idx) => (
                            <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                              <p className="font-medium">{med.drug_name}</p>
                              <p className="text-gray-600">{med.dosage} - {med.frequency} - {med.duration}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No prescriptions found</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t p-4 flex justify-end gap-3 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onWritePrescription} className="bg-orange-600 hover:bg-orange-700">
            <Pill className="w-4 h-4 mr-2" />
            Write Prescription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal;
