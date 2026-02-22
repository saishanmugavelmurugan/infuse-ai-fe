import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Camera, StopCircle, Play, 
  CheckCircle, AlertTriangle, FileText, Upload, X, Clock,
  User, UserCheck, Shield, Heart, Scissors, Pill, Brain,
  Baby, FileSignature, Eye, Lock, Activity, Stethoscope
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const CONSENT_CATEGORIES = {
  procedural: { name: 'Surgical & Procedural', icon: Scissors, color: 'blue' },
  high_risk: { name: 'High-Risk Procedures', icon: AlertTriangle, color: 'red' },
  emergency: { name: 'Emergency Care', icon: Activity, color: 'orange' },
  critical_care: { name: 'Critical Care', icon: Heart, color: 'pink' },
  end_of_life: { name: 'End of Life Care', icon: Shield, color: 'purple' },
  discharge: { name: 'Discharge & LAMA', icon: FileSignature, color: 'yellow' },
  refusal: { name: 'Treatment Refusal', icon: X, color: 'gray' },
  specialty: { name: 'Specialty Care', icon: Stethoscope, color: 'teal' },
  research: { name: 'Research & Trials', icon: Brain, color: 'indigo' },
  privacy: { name: 'Data & Privacy', icon: Lock, color: 'green' },
  general: { name: 'General Consents', icon: FileText, color: 'slate' }
};

const VideoConsentRecorder = ({ patientId, patientName, onConsentRecorded, onClose }) => {
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  
  const [consentTypes, setConsentTypes] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [step, setStep] = useState(1); // 1: Select Type, 2: Fill Details, 3: Record, 4: Review
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [consentId, setConsentId] = useState(null);
  
  const [formData, setFormData] = useState({
    procedure_name: '',
    procedure_date: '',
    attending_physician: '',
    witness_name: '',
    witness_relationship: '',
    interpreter_used: false,
    interpreter_language: '',
    patient_language: 'English',
    mental_capacity_confirmed: true,
    risks_explained: [],
    benefits_explained: [],
    alternatives_explained: [],
    questions_answered: true,
    patient_questions: '',
    additional_notes: ''
  });

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchConsentTypes();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const fetchConsentTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/healthtrack/video-consent/types`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setConsentTypes(data.categories || {});
    } catch (err) {
      console.error('Error fetching consent types:', err);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera/microphone. Please grant permissions.');
    }
  };

  const startRecording = () => {
    if (!stream) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const createConsentRecord = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/healthtrack/video-consent/record`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_id: patientId,
          consent_type: selectedType,
          ...formData
        })
      });
      
      const data = await response.json();
      if (data.consent_id) {
        setConsentId(data.consent_id);
        setStep(3);
        await startCamera();
      } else {
        setError(data.detail || 'Failed to create consent record');
      }
    } catch (err) {
      setError('Failed to create consent record');
    }
    setLoading(false);
  };

  const uploadVideo = async () => {
    if (!recordedBlob || !consentId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      formDataUpload.append('video', recordedBlob, 'consent_video.webm');
      formDataUpload.append('duration_seconds', recordingTime.toString());
      
      const response = await fetch(`${API_URL}/api/healthtrack/video-consent/${consentId}/upload-video`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      });
      
      const data = await response.json();
      if (data.legally_valid) {
        setStep(5); // Success
        if (onConsentRecorded) {
          onConsentRecorded(data);
        }
      } else {
        setError(data.detail || 'Failed to upload video');
      }
    } catch (err) {
      setError('Failed to upload video');
    }
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeInfo = () => {
    for (const [cat, types] of Object.entries(consentTypes)) {
      const found = types.find(t => t.type === selectedType);
      if (found) return found;
    }
    return null;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3, 4, 5].map((s) => (
        <React.Fragment key={s}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === s ? 'bg-blue-600 text-white' : 
            step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step > s ? <CheckCircle className="h-5 w-5" /> : s}
          </div>
          {s < 5 && <div className={`w-12 h-1 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Consent Type</h3>
      <p className="text-sm text-gray-600">Choose the type of consent to record for {patientName}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {Object.entries(consentTypes).map(([category, types]) => {
          const catInfo = CONSENT_CATEGORIES[category] || { name: category, icon: FileText, color: 'gray' };
          const Icon = catInfo.icon;
          
          return (
            <div key={category} className="border rounded-lg p-3">
              <div className={`flex items-center gap-2 mb-2 text-${catInfo.color}-700`}>
                <Icon className="h-5 w-5" />
                <span className="font-medium text-sm">{catInfo.name}</span>
              </div>
              <div className="space-y-1">
                {types.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setSelectedType(type.type)}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      selectedType === type.type
                        ? 'bg-blue-100 border-blue-500 border'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <div className="font-medium">{type.name}</div>
                    <div className="text-xs text-gray-500 truncate">{type.description}</div>
                    {type.video_recommended && (
                      <span className="inline-flex items-center text-xs text-green-600 mt-1">
                        <Video className="h-3 w-3 mr-1" /> Video Recommended
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={() => setStep(2)}
          disabled={!selectedType}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Fill Details
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const typeInfo = getTypeInfo();
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Consent Details</h3>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {typeInfo?.name}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Procedure/Treatment Name *</label>
            <input
              type="text"
              value={formData.procedure_name}
              onChange={(e) => setFormData({...formData, procedure_name: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Appendectomy, Chemotherapy"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
            <input
              type="date"
              value={formData.procedure_date}
              onChange={(e) => setFormData({...formData, procedure_date: e.target.value})}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attending Physician *</label>
            <input
              type="text"
              value={formData.attending_physician}
              onChange={(e) => setFormData({...formData, attending_physician: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="Dr. Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Language</label>
            <select
              value={formData.patient_language}
              onChange={(e) => setFormData({...formData, patient_language: e.target.value})}
              className="w-full p-2 border rounded-lg"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Bengali">Bengali</option>
              <option value="Marathi">Marathi</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {typeInfo?.witness_required && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Witness Name *</label>
                <input
                  type="text"
                  value={formData.witness_name}
                  onChange={(e) => setFormData({...formData, witness_name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Full name of witness"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Witness Relationship</label>
                <select
                  value={formData.witness_relationship}
                  onChange={(e) => setFormData({...formData, witness_relationship: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select...</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="sibling">Sibling</option>
                  <option value="relative">Other Relative</option>
                  <option value="friend">Friend</option>
                  <option value="staff">Hospital Staff</option>
                </select>
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="interpreter"
              checked={formData.interpreter_used}
              onChange={(e) => setFormData({...formData, interpreter_used: e.target.checked})}
              className="rounded"
            />
            <label htmlFor="interpreter" className="text-sm">Interpreter used</label>
            {formData.interpreter_used && (
              <input
                type="text"
                value={formData.interpreter_language}
                onChange={(e) => setFormData({...formData, interpreter_language: e.target.value})}
                className="ml-2 p-1 border rounded text-sm"
                placeholder="Language"
              />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="capacity"
              checked={formData.mental_capacity_confirmed}
              onChange={(e) => setFormData({...formData, mental_capacity_confirmed: e.target.checked})}
              className="rounded"
            />
            <label htmlFor="capacity" className="text-sm">Patient has mental capacity to consent</label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="questions"
              checked={formData.questions_answered}
              onChange={(e) => setFormData({...formData, questions_answered: e.target.checked})}
              className="rounded"
            />
            <label htmlFor="questions" className="text-sm">All patient questions have been answered</label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
          <textarea
            value={formData.additional_notes}
            onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={2}
            placeholder="Any additional notes..."
          />
        </div>
        
        <div className="flex justify-between">
          <button onClick={() => setStep(1)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Back
          </button>
          <button
            onClick={createConsentRecord}
            disabled={!formData.procedure_name || !formData.attending_physician || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Next: Record Video'}
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Record Video Consent</h3>
      <p className="text-sm text-gray-600">
        Record the patient giving their informed consent. Ensure the patient's face is clearly visible and they verbally confirm their consent.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
        <div className="font-medium text-yellow-800 mb-1">📋 Script for Recording:</div>
        <ol className="list-decimal list-inside text-yellow-700 space-y-1">
          <li>State patient's full name and date of birth</li>
          <li>Confirm the procedure: "{formData.procedure_name}"</li>
          <li>Confirm risks and benefits have been explained</li>
          <li>Confirm all questions have been answered</li>
          <li>Ask patient to verbally state: "I give my consent"</li>
        </ol>
      </div>
      
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="font-mono">{formatTime(recordingTime)}</span>
          </div>
        )}
        
        {!stream && !recordedBlob && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Camera className="h-5 w-5" />
              Start Camera
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-4">
        {stream && !isRecording && !recordedBlob && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Video className="h-5 w-5" />
            Start Recording
          </button>
        )}
        
        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            <StopCircle className="h-5 w-5" />
            Stop Recording
          </button>
        )}
        
        {recordedBlob && (
          <button
            onClick={() => setStep(4)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CheckCircle className="h-5 w-5" />
            Review Recording
          </button>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
      <p className="text-sm text-gray-600">Review the recorded video before submitting.</p>
      
      <div className="bg-black rounded-lg overflow-hidden aspect-video">
        <video
          src={recordedBlob ? URL.createObjectURL(recordedBlob) : ''}
          controls
          className="w-full h-full"
        />
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Recording Summary</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">Duration:</span> {formatTime(recordingTime)}</div>
          <div><span className="text-gray-500">Consent Type:</span> {getTypeInfo()?.name}</div>
          <div><span className="text-gray-500">Procedure:</span> {formData.procedure_name}</div>
          <div><span className="text-gray-500">Physician:</span> {formData.attending_physician}</div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => {
            setRecordedBlob(null);
            setStep(3);
            startCamera();
          }}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Re-record
        </button>
        <button
          onClick={uploadVideo}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? (
            <>Uploading...</>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Submit Consent
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Consent Recorded Successfully!</h3>
      <p className="text-gray-600 mb-4">
        The video consent has been securely stored and is legally valid.
      </p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 mb-6">
        <div className="font-medium">Consent ID: {consentId}</div>
        <div>This ID can be used for legal reference and audit purposes.</div>
      </div>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {step < 5 ? 'Record Video Consent' : 'Consent Complete'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {step < 5 && renderStepIndicator()}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>
      </div>
    </div>
  );
};

export default VideoConsentRecorder;
