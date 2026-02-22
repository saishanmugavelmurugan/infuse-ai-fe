/**
 * Video Consulting Component
 * Placeholder for future Hospital HMS API integration
 * Includes video consultation and video consent features
 */

import React, { useState } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, 
  Settings, Users, MessageSquare, Shield, FileText,
  Clock, Calendar, CheckCircle, AlertCircle, Loader2,
  Camera, MonitorPlay, ExternalLink
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Mock Video Consultation Component
const VideoConsulting = ({ appointmentId, patientId, doctorId, onEnd }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsent, setShowConsent] = useState(true);

  const handleStartCall = async () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  const handleEndCall = () => {
    setIsConnected(false);
    onEnd?.();
  };

  const handleGiveConsent = () => {
    setConsentGiven(true);
    setShowConsent(false);
  };

  // Consent Screen
  if (showConsent && !consentGiven) {
    return (
      <div className="bg-slate-900 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Video Consultation Consent</h2>
          <p className="text-slate-400">Please review and accept before starting the consultation</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-white mb-4">By proceeding, you consent to:</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Video and audio recording of this consultation for medical records</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Storage of consultation data in compliance with HIPAA and DPDP Act 2023</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Telemedicine treatment as per applicable regulations</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Sharing of medical information with the consulting doctor</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-amber-400 font-medium">Important Notice</p>
              <p className="text-amber-300/70 text-sm mt-1">
                This is not a substitute for in-person emergency care. 
                If you're experiencing a medical emergency, please call 112 or visit the nearest hospital.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowConsent(false)}
            className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleGiveConsent}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
            data-testid="consent-accept-btn"
          >
            <CheckCircle className="w-5 h-5" />
            I Accept & Continue
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          Powered by Infuse AI | Video Consent ID: VC-{Date.now().toString(36).toUpperCase()}
        </p>
      </div>
    );
  }

  // Connected Call Screen
  if (isConnected) {
    return (
      <div className="bg-slate-900 rounded-2xl overflow-hidden">
        {/* Video Area */}
        <div className="relative aspect-video bg-slate-800">
          {/* Main Video (Doctor) - Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-16 h-16 text-slate-500" />
              </div>
              <p className="text-slate-400">Video Stream Placeholder</p>
              <p className="text-xs text-slate-500 mt-1">HMS API Integration Required</p>
            </div>
          </div>

          {/* Self Video (Patient) - Small */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-700 rounded-xl border-2 border-slate-600 flex items-center justify-center">
            {isVideoOff ? (
              <VideoOff className="w-8 h-8 text-slate-500" />
            ) : (
              <Camera className="w-8 h-8 text-slate-500" />
            )}
          </div>

          {/* Call Duration */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-mono">00:00:00</span>
          </div>

          {/* Recording Indicator */}
          <div className="absolute top-4 right-4 bg-red-500/20 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs">Recording</span>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-slate-900">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition ${
                isMuted ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-4 rounded-full transition ${
                isVideoOff ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>

            <button
              onClick={handleEndCall}
              className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
              data-testid="end-call-btn"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

            <button className="p-4 bg-slate-700 text-slate-300 rounded-full hover:bg-slate-600 transition">
              <MessageSquare className="w-6 h-6" />
            </button>

            <button className="p-4 bg-slate-700 text-slate-300 rounded-full hover:bg-slate-600 transition">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pre-call Screen
  return (
    <div className="bg-slate-900 rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Ready to Start Consultation</h2>
        <p className="text-slate-400">Consent recorded. You can now start the video call.</p>
      </div>

      {/* Pre-call Checklist */}
      <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Pre-Call Checklist</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Camera access granted</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Microphone access granted</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Video consent recorded</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Stable internet connection</span>
          </div>
        </div>
      </div>

      {/* HMS Integration Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <MonitorPlay className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-blue-400 font-medium">HMS API Integration</p>
            <p className="text-blue-300/70 text-sm mt-1">
              This video consultation feature is designed to integrate with Hospital Management Systems 
              via API. Contact support for HMS integration setup.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleStartCall}
        disabled={isConnecting}
        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
        data-testid="start-call-btn"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Phone className="w-5 h-5" />
            Start Video Consultation
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-500 mt-4">
        Powered by Infuse AI | Telemedicine Compliant
      </p>
    </div>
  );
};

// Video Consent Recording Component
export const VideoConsentRecorder = ({ patientId, consentType, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleStartRecording = () => {
    setIsRecording(true);
    setCountdown(10); // 10 second consent recording

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRecording(false);
          setRecordingComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleComplete = () => {
    onComplete?.({
      consent_id: `VC-${Date.now().toString(36).toUpperCase()}`,
      consent_type: consentType,
      patient_id: patientId,
      recorded_at: new Date().toISOString(),
      status: 'recorded'
    });
  };

  if (recordingComplete) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Consent Recorded</h3>
        <p className="text-slate-400 text-sm mb-4">
          Your video consent has been successfully recorded and stored securely.
        </p>
        <button
          onClick={handleComplete}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Record Video Consent</h3>
        <p className="text-slate-400 text-sm">
          Please record a short video consent for: <strong className="text-white">{consentType}</strong>
        </p>
      </div>

      {/* Camera Preview Placeholder */}
      <div className="aspect-video bg-slate-700 rounded-xl mb-6 flex items-center justify-center relative">
        {isRecording ? (
          <>
            <div className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-sm">Recording...</span>
            </div>
            <div className="text-center">
              <p className="text-6xl font-bold text-white">{countdown}</p>
              <p className="text-slate-400 mt-2">Please state your consent</p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Camera className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">Camera preview will appear here</p>
            <p className="text-xs text-slate-500 mt-1">HMS API Integration Required</p>
          </div>
        )}
      </div>

      {!isRecording && (
        <button
          onClick={handleStartRecording}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          data-testid="record-consent-btn"
        >
          <Video className="w-5 h-5" />
          Start Recording Consent
        </button>
      )}

      <p className="text-center text-xs text-slate-500 mt-4">
        Recording will last 10 seconds. Please clearly state your consent.
      </p>
    </div>
  );
};

export default VideoConsulting;
