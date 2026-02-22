/**
 * Prescription Template Component
 * Editable white template with doctor branding
 * Print output includes Infuse watermark
 */

import React, { useState, useRef } from 'react';
import { 
  Printer, Download, Edit2, Save, X, User, Calendar, 
  Pill, FileText, Phone, Mail, MapPin, CheckCircle
} from 'lucide-react';

const PrescriptionTemplate = ({ 
  prescription, 
  doctor, 
  patient, 
  onSave,
  editable = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    diagnosis: prescription?.diagnosis || '',
    chief_complaint: prescription?.chief_complaint || '',
    medications: prescription?.medications || [],
    instructions: prescription?.instructions || '',
    follow_up: prescription?.follow_up || '',
    notes: prescription?.notes || ''
  });
  const printRef = useRef(null);

  // Doctor branding defaults
  const doctorInfo = {
    name: doctor?.name || 'Dr. Doctor Name',
    qualification: doctor?.qualification || 'MBBS, MD',
    specialty: doctor?.specialty || 'General Medicine',
    registration_number: doctor?.registration_number || 'REG-XXXXX',
    clinic_name: doctor?.clinic_name || 'Medical Clinic',
    address: doctor?.address || 'Clinic Address',
    city: doctor?.city || 'City',
    state: doctor?.state || 'State',
    pincode: doctor?.pincode || '000000',
    phone: doctor?.phone || '+91-XXXXX-XXXXX',
    email: doctor?.email || 'doctor@clinic.com',
    clinic_logo: doctor?.clinic_logo || '',
    header_text: doctor?.header_text || '',
    footer_text: doctor?.footer_text || ''
  };

  const patientInfo = {
    name: patient?.name || 'Patient Name',
    age: patient?.age || 'XX',
    gender: patient?.gender || 'M/F',
    patient_id: patient?.id || 'PID-XXXXX',
    phone: patient?.phone || ''
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=900,height=700');
    
    windowPrint.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription - ${patientInfo.name}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif; }
              .no-print { display: none !important; }
            }
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              margin: 0; 
              padding: 40px;
              background: white;
              position: relative;
            }
            .prescription-container {
              max-width: 800px;
              margin: 0 auto;
              position: relative;
              z-index: 1;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #E55A00;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .doctor-name {
              font-size: 24px;
              font-weight: bold;
              color: #1a1a2e;
              margin-bottom: 5px;
            }
            .qualification {
              color: #666;
              font-size: 14px;
            }
            .clinic-info {
              color: #888;
              font-size: 12px;
              margin-top: 10px;
            }
            .rx-symbol {
              font-size: 48px;
              font-weight: bold;
              color: #E55A00;
              margin: 20px 0;
            }
            .patient-info {
              background: #f8f8f8;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .patient-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-weight: bold;
              color: #E55A00;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .medication-item {
              padding: 10px;
              background: #fafafa;
              border-left: 3px solid #E55A00;
              margin-bottom: 10px;
            }
            .med-name {
              font-weight: bold;
              color: #1a1a2e;
            }
            .med-details {
              color: #666;
              font-size: 13px;
            }
            .signature-section {
              margin-top: 40px;
              text-align: right;
            }
            .signature-line {
              border-top: 1px solid #333;
              width: 200px;
              margin-left: auto;
              margin-top: 40px;
              padding-top: 5px;
              text-align: center;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              color: #888;
              font-size: 11px;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 120px;
              color: rgba(229, 90, 0, 0.05);
              font-weight: bold;
              pointer-events: none;
              z-index: 0;
              white-space: nowrap;
            }
            .powered-by {
              color: #E55A00;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="watermark">INFUSE</div>
          <div class="prescription-container">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    
    windowPrint.document.close();
    windowPrint.focus();
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 250);
  };

  const handleSave = () => {
    onSave?.(editedData);
    setIsEditing(false);
  };

  const addMedication = () => {
    setEditedData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    }));
  };

  const updateMedication = (index, field, value) => {
    setEditedData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const removeMedication = (index) => {
    setEditedData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b px-6 py-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-600" />
          <span className="font-semibold text-gray-900">Prescription</span>
          <span className="text-sm text-gray-500">#{prescription?.prescription_number || 'New'}</span>
        </div>
        <div className="flex items-center gap-3">
          {editable && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
          {isEditing && (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            data-testid="print-prescription-btn"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Prescription Content */}
      <div ref={printRef} className="p-8">
        {/* Header - Doctor Info */}
        <div className="header text-center border-b-2 border-orange-500 pb-6 mb-6">
          {doctorInfo.clinic_logo && (
            <img 
              src={doctorInfo.clinic_logo} 
              alt="Clinic Logo" 
              className="h-16 mx-auto mb-4 object-contain"
            />
          )}
          {doctorInfo.header_text && (
            <p className="text-sm text-gray-600 mb-2">{doctorInfo.header_text}</p>
          )}
          <h1 className="doctor-name text-2xl font-bold text-gray-900">{doctorInfo.name}</h1>
          <p className="qualification text-gray-600">{doctorInfo.qualification}</p>
          <p className="text-orange-600 font-medium">{doctorInfo.specialty}</p>
          <p className="text-xs text-gray-500 mt-2">Reg. No: {doctorInfo.registration_number}</p>
          
          <div className="clinic-info text-sm text-gray-500 mt-4">
            <p>{doctorInfo.clinic_name}</p>
            <p>{doctorInfo.address}, {doctorInfo.city}, {doctorInfo.state} - {doctorInfo.pincode}</p>
            <p className="flex items-center justify-center gap-4 mt-1">
              <span><Phone className="w-3 h-3 inline mr-1" />{doctorInfo.phone}</span>
              <span><Mail className="w-3 h-3 inline mr-1" />{doctorInfo.email}</span>
            </p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="patient-info bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Patient Name:</span>
              <p className="font-semibold text-gray-900">{patientInfo.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Age/Gender:</span>
              <p className="font-semibold text-gray-900">{patientInfo.age} / {patientInfo.gender}</p>
            </div>
            <div>
              <span className="text-gray-500">Patient ID:</span>
              <p className="font-semibold text-gray-900">{patientInfo.patient_id}</p>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>
              <p className="font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Rx Symbol */}
        <div className="rx-symbol text-5xl font-bold text-orange-500 mb-6">℞</div>

        {/* Chief Complaint */}
        <div className="section mb-6">
          <h3 className="section-title font-semibold text-orange-600 border-b pb-2 mb-3">Chief Complaint</h3>
          {isEditing ? (
            <textarea
              value={editedData.chief_complaint}
              onChange={(e) => setEditedData(prev => ({ ...prev, chief_complaint: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={2}
              placeholder="Enter chief complaint..."
            />
          ) : (
            <p className="text-gray-700">{editedData.chief_complaint || 'Not specified'}</p>
          )}
        </div>

        {/* Diagnosis */}
        <div className="section mb-6">
          <h3 className="section-title font-semibold text-orange-600 border-b pb-2 mb-3">Diagnosis</h3>
          {isEditing ? (
            <textarea
              value={editedData.diagnosis}
              onChange={(e) => setEditedData(prev => ({ ...prev, diagnosis: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={2}
              placeholder="Enter diagnosis..."
            />
          ) : (
            <p className="text-gray-700">{editedData.diagnosis || 'Not specified'}</p>
          )}
        </div>

        {/* Medications */}
        <div className="section mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title font-semibold text-orange-600 border-b pb-2 flex-1">Medications</h3>
            {isEditing && (
              <button
                onClick={addMedication}
                className="text-sm text-orange-600 hover:text-orange-700 no-print"
              >
                + Add Medication
              </button>
            )}
          </div>
          
          {editedData.medications.length === 0 ? (
            <p className="text-gray-500 italic">No medications prescribed</p>
          ) : (
            <div className="space-y-3">
              {editedData.medications.map((med, index) => (
                <div key={index} className="medication-item p-4 bg-gray-50 border-l-4 border-orange-500 rounded-r-lg">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          value={med.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          placeholder="Medication name"
                        />
                        <button
                          onClick={() => removeMedication(index)}
                          className="text-red-500 hover:text-red-700 no-print"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          className="px-3 py-2 border rounded-lg text-sm"
                          placeholder="Dosage (e.g., 500mg)"
                        />
                        <input
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          className="px-3 py-2 border rounded-lg text-sm"
                          placeholder="Frequency (e.g., BD)"
                        />
                        <input
                          value={med.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          className="px-3 py-2 border rounded-lg text-sm"
                          placeholder="Duration (e.g., 5 days)"
                        />
                      </div>
                      <input
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Special instructions (e.g., after food)"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="med-name font-semibold text-gray-900">
                        {index + 1}. {med.name || 'Medication'} - {med.dosage || 'Dosage'}
                      </p>
                      <p className="med-details text-gray-600 text-sm">
                        {med.frequency || 'Frequency'} × {med.duration || 'Duration'}
                        {med.instructions && ` — ${med.instructions}`}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="section mb-6">
          <h3 className="section-title font-semibold text-orange-600 border-b pb-2 mb-3">Instructions</h3>
          {isEditing ? (
            <textarea
              value={editedData.instructions}
              onChange={(e) => setEditedData(prev => ({ ...prev, instructions: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Enter instructions for patient..."
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-line">{editedData.instructions || 'No special instructions'}</p>
          )}
        </div>

        {/* Follow-up */}
        <div className="section mb-6">
          <h3 className="section-title font-semibold text-orange-600 border-b pb-2 mb-3">Follow-up</h3>
          {isEditing ? (
            <input
              type="text"
              value={editedData.follow_up}
              onChange={(e) => setEditedData(prev => ({ ...prev, follow_up: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., After 7 days or as needed"
            />
          ) : (
            <p className="text-gray-700">{editedData.follow_up || 'As needed'}</p>
          )}
        </div>

        {/* Signature */}
        <div className="signature-section text-right mt-10">
          {doctor?.signature && (
            <img src={doctor.signature} alt="Signature" className="h-12 ml-auto mb-2" />
          )}
          <div className="signature-line border-t border-gray-400 w-48 ml-auto pt-2">
            <p className="text-sm text-gray-600">Doctor's Signature</p>
          </div>
        </div>

        {/* Footer */}
        <div className="footer mt-10 pt-6 border-t text-center text-gray-500 text-xs">
          {doctorInfo.footer_text && (
            <p className="mb-2">{doctorInfo.footer_text}</p>
          )}
          <p className="flex items-center justify-center gap-1">
            Powered by <span className="powered-by text-orange-500 font-medium">Infuse</span> | www.infuse.net.in
          </p>
          <p className="mt-1">
            This prescription is valid for 30 days from date of issue. 
            For emergencies, contact the clinic directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionTemplate;
