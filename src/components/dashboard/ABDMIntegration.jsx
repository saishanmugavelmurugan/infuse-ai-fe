import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { healthtrackApi } from '../../services/healthtrackApi';
import {
  Shield, Link, FileText, CheckCircle, XCircle, Clock,
  AlertCircle, User, Phone, Calendar, ChevronRight, Search,
  RefreshCw, Key, Unlock, Lock, Database, ArrowRight,
  CreditCard, IndianRupee, FileCheck, Building2, Activity,
  Download, Eye, Send, Stethoscope, Heart
} from 'lucide-react';

const ABDMIntegration = ({ patientId, isDoctor = false }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [abdmStatus, setAbdmStatus] = useState(null);
  const [linkedAbha, setLinkedAbha] = useState(null);
  const [consents, setConsents] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [claims, setClaims] = useState([]);
  const [nationalRecords, setNationalRecords] = useState([]);
  const [claimsDashboard, setClaimsDashboard] = useState(null);
  
  // Modal states
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLinking, setShowLinking] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showNationalRecords, setShowNationalRecords] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [txnId, setTxnId] = useState('');
  
  const [registrationForm, setRegistrationForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'M',
    mobile: '',
    email: ''
  });

  const [linkForm, setLinkForm] = useState({
    abha_number: '',
    abha_address: ''
  });

  const [claimForm, setClaimForm] = useState({
    claim_type: 'preauth',
    diagnosis_codes: ['I10'],
    procedure_codes: ['99213'],
    package_code: 'HBP-01',
    package_name: 'General Medicine',
    estimated_amount: 25000,
    treatment_details: {
      admission_date: new Date().toISOString().split('T')[0],
      treatment_type: 'OPD'
    }
  });

  useEffect(() => {
    loadABDMData();
  }, [patientId]);

  const loadABDMData = async () => {
    setLoading(true);
    try {
      // Get ABDM status
      const status = await healthtrackApi.abdm.getStatus();
      setAbdmStatus(status);

      // Get patient's linked ABHA if patient context
      if (patientId) {
        try {
          const abhaData = await healthtrackApi.abdm.getPatientAbha(patientId);
          if (abhaData.linked) {
            setLinkedAbha(abhaData);
            
            // Load eligibility
            try {
              const eligData = await healthtrackApi.abdm.getEligibilityStatus(patientId);
              if (eligData.is_eligible !== undefined) {
                setEligibility(eligData);
              }
            } catch (e) { console.log('Eligibility not checked yet'); }
            
            // Load claims
            try {
              const claimsData = await healthtrackApi.abdm.getPatientClaims(patientId);
              setClaims(claimsData.claims || []);
            } catch (e) { console.log('No claims yet'); }
            
            // Load national records
            try {
              const recordsData = await healthtrackApi.abdm.getNationalRecords(patientId);
              setNationalRecords(recordsData.records || []);
            } catch (e) { console.log('No national records yet'); }
          }

          // Get consents
          const consentData = await healthtrackApi.abdm.getPatientConsents(patientId);
          setConsents(consentData.consents || []);
        } catch (e) {
          console.log('No ABHA linked yet');
        }
      }
      
      // Load claims dashboard for doctors
      if (isDoctor) {
        try {
          const dashboard = await healthtrackApi.abdm.getClaimsDashboard();
          setClaimsDashboard(dashboard);
        } catch (e) { console.log('Could not load claims dashboard'); }
      }
    } catch (error) {
      console.error('Failed to load ABDM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOTP = async () => {
    try {
      const result = await healthtrackApi.abdm.generateOtp(registrationForm.mobile);
      setTxnId(result.txn_id);
      setOtpSent(true);
      alert(`OTP sent! Demo OTP: ${result.demo_otp}`);
    } catch (error) {
      alert('Failed to send OTP');
    }
  };

  const handleRegisterABHA = async () => {
    try {
      const result = await healthtrackApi.abdm.registerAbha(registrationForm);
      alert(`ABHA Created!\nNumber: ${result.abha_number}\nAddress: ${result.abha_address}`);
      setShowRegistration(false);
      
      if (patientId) {
        await healthtrackApi.abdm.linkPatient({
          patient_id: patientId,
          abha_number: result.abha_number,
          abha_address: result.abha_address
        });
        loadABDMData();
      }
    } catch (error) {
      alert('Failed to register ABHA');
    }
  };

  const handleLinkABHA = async () => {
    try {
      await healthtrackApi.abdm.linkPatient({
        patient_id: patientId,
        ...linkForm
      });
      alert('ABHA linked successfully!');
      setShowLinking(false);
      loadABDMData();
    } catch (error) {
      alert('Failed to link ABHA');
    }
  };

  const handleConsentAction = async (consentId, action) => {
    try {
      if (action === 'approve') {
        await healthtrackApi.abdm.approveConsent(consentId);
      } else if (action === 'deny') {
        await healthtrackApi.abdm.denyConsent(consentId);
      } else if (action === 'revoke') {
        await healthtrackApi.abdm.revokeConsent(consentId);
      }
      loadABDMData();
    } catch (error) {
      alert(`Failed to ${action} consent`);
    }
  };

  const handleCheckEligibility = async () => {
    try {
      const result = await healthtrackApi.abdm.checkEligibility({
        patient_id: patientId,
        abha_number: linkedAbha?.abha_number,
        scheme: 'PMJAY'
      });
      setEligibility(result);
      alert(result.is_eligible ? 'Patient is eligible for Ayushman Bharat!' : 'Patient is not eligible');
    } catch (error) {
      alert('Failed to check eligibility');
    }
  };

  const handleFetchNationalRecords = async () => {
    if (!linkedAbha || consents.filter(c => c.status === 'GRANTED').length === 0) {
      alert('Need linked ABHA and active consent to fetch records');
      return;
    }
    
    try {
      const grantedConsent = consents.find(c => c.status === 'GRANTED');
      const result = await healthtrackApi.abdm.fetchNationalRecords({
        patient_id: patientId,
        abha_number: linkedAbha.abha_number,
        consent_id: grantedConsent.id,
        hi_types: ['OPConsultation', 'Prescription', 'DiagnosticReport']
      });
      setNationalRecords(result.records || []);
      setShowNationalRecords(true);
    } catch (error) {
      alert('Failed to fetch national records');
    }
  };

  const handleSubmitClaim = async () => {
    try {
      const result = await healthtrackApi.abdm.submitClaim({
        patient_id: patientId,
        abha_number: linkedAbha.abha_number,
        ...claimForm
      });
      alert(`Claim submitted!\nClaim Number: ${result.claim_number}\nStatus: ${result.status}`);
      setShowClaimForm(false);
      loadABDMData();
    } catch (error) {
      alert('Failed to submit claim: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'abha', label: 'ABHA', icon: Key },
    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
    { id: 'records', label: 'Health Records', icon: FileText },
    { id: 'claims', label: 'Claims', icon: CreditCard },
    { id: 'consents', label: 'Consents', icon: Unlock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">ABDM Integration</h2>
              <p className="text-green-100">Ayushman Bharat Digital Mission</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white/20"
            onClick={loadABDMData}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{linkedAbha ? '✓' : '✗'}</div>
            <div className="text-sm text-green-100">ABHA Linked</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{eligibility?.is_eligible ? '✓' : '?'}</div>
            <div className="text-sm text-green-100">PMJAY Eligible</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{consents.filter(c => c.status === 'GRANTED').length}</div>
            <div className="text-sm text-green-100">Active Consents</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{nationalRecords.length}</div>
            <div className="text-sm text-green-100">Health Records</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{claims.length}</div>
            <div className="text-sm text-green-100">Claims</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex overflow-x-auto border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* ABHA Status Card */}
                <div className={`p-6 rounded-xl border-2 ${linkedAbha ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Key className={`w-6 h-6 ${linkedAbha ? 'text-green-600' : 'text-yellow-600'}`} />
                    <h3 className="font-semibold text-lg">ABHA Status</h3>
                  </div>
                  {linkedAbha ? (
                    <div>
                      <p className="text-green-800 font-medium">{linkedAbha.abha_number}</p>
                      <p className="text-green-600 text-sm">{linkedAbha.abha_address}</p>
                    </div>
                  ) : (
                    <p className="text-yellow-700">No ABHA linked. Click to setup.</p>
                  )}
                </div>

                {/* Eligibility Card */}
                <div className={`p-6 rounded-xl border-2 ${eligibility?.is_eligible ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className={`w-6 h-6 ${eligibility?.is_eligible ? 'text-green-600' : 'text-gray-500'}`} />
                    <h3 className="font-semibold text-lg">Ayushman Bharat</h3>
                  </div>
                  {eligibility?.is_eligible ? (
                    <div>
                      <p className="text-green-800 font-medium">Eligible for PMJAY</p>
                      <p className="text-green-600 text-sm">Coverage: ₹{(eligibility.eligibility_details?.coverage_amount || 0).toLocaleString()}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600">Check eligibility</p>
                      <Button size="sm" onClick={handleCheckEligibility} disabled={!linkedAbha}>
                        Check Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col"
                    onClick={() => setActiveTab('records')}
                    disabled={!linkedAbha}
                  >
                    <Download className="w-5 h-5 mb-2" />
                    <span className="text-xs">Fetch Records</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col"
                    onClick={() => setShowClaimForm(true)}
                    disabled={!eligibility?.is_eligible}
                  >
                    <Send className="w-5 h-5 mb-2" />
                    <span className="text-xs">Submit Claim</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col"
                    onClick={() => setActiveTab('consents')}
                  >
                    <Unlock className="w-5 h-5 mb-2" />
                    <span className="text-xs">Manage Consent</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col"
                    onClick={() => setActiveTab('claims')}
                  >
                    <Eye className="w-5 h-5 mb-2" />
                    <span className="text-xs">Track Claims</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ABHA Tab */}
          {activeTab === 'abha' && (
            <div className="space-y-6">
              {linkedAbha ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">ABHA Linked</p>
                      <p className="text-2xl font-bold text-gray-900">{linkedAbha.abha_number}</p>
                      <p className="text-gray-600">{linkedAbha.abha_address}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">No ABHA Linked</p>
                      <p className="text-sm text-yellow-600">Link or create an ABHA to enable ABDM features</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowRegistration(true)}>
                      <User className="w-4 h-4 mr-2" />
                      Create New ABHA
                    </Button>
                    <Button variant="outline" onClick={() => setShowLinking(true)}>
                      <Link className="w-4 h-4 mr-2" />
                      Link Existing ABHA
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Eligibility Tab */}
          {activeTab === 'eligibility' && (
            <div className="space-y-6">
              {eligibility?.is_eligible ? (
                <>
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-green-800">Eligible for Ayushman Bharat</h3>
                          <p className="text-green-600">Pradhan Mantri Jan Arogya Yojana (PMJAY)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Beneficiary ID</p>
                        <p className="font-mono font-bold">{eligibility.eligibility_details?.beneficiary_id}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-500">Coverage Amount</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{(eligibility.eligibility_details?.coverage_amount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-500">Remaining Balance</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{(eligibility.eligibility_details?.remaining_amount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-500">Valid Until</p>
                        <p className="text-2xl font-bold text-gray-700">
                          {eligibility.eligibility_details?.valid_until}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Covered Packages</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {eligibility.covered_packages?.map((pkg, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 border">
                          <p className="font-medium">{pkg.name}</p>
                          <p className="text-sm text-gray-500">Code: {pkg.code}</p>
                          <p className="text-green-600 font-semibold">Up to ₹{pkg.limit.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Check Ayushman Bharat Eligibility</h3>
                  <p className="text-gray-500 mb-6">Verify if the patient is eligible for PMJAY scheme benefits</p>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleCheckEligibility}
                    disabled={!linkedAbha}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Check Eligibility
                  </Button>
                  {!linkedAbha && (
                    <p className="text-sm text-yellow-600 mt-3">Link ABHA first to check eligibility</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Health Records Tab */}
          {activeTab === 'records' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">National Health Records</h3>
                <Button onClick={handleFetchNationalRecords} disabled={!linkedAbha}>
                  <Download className="w-4 h-4 mr-2" />
                  Fetch Records
                </Button>
              </div>

              {nationalRecords.length > 0 ? (
                <div className="space-y-4">
                  {nationalRecords.map((record, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            record.type === 'OPConsultation' ? 'bg-blue-100 text-blue-600' :
                            record.type === 'Prescription' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {record.type === 'OPConsultation' ? <Stethoscope className="w-5 h-5" /> :
                             record.type === 'Prescription' ? <FileText className="w-5 h-5" /> :
                             <Activity className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-medium">{record.type}</p>
                            <p className="text-sm text-gray-500">{record.source_hip} • {record.date}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {record.source_hip}
                        </span>
                      </div>
                      {record.diagnosis && (
                        <p className="mt-3 text-sm text-gray-700"><strong>Diagnosis:</strong> {record.diagnosis}</p>
                      )}
                      {record.medications && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Medications:</p>
                          <ul className="text-sm text-gray-600 ml-4 list-disc">
                            {record.medications.map((med, i) => (
                              <li key={i}>{med.name} - {med.dosage}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {record.results && (
                        <div className="mt-3 bg-gray-50 rounded p-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">{record.test_name} Results:</p>
                          {Object.entries(record.results).map(([key, value]) => (
                            <p key={key} className="text-sm text-gray-600">{key}: {value}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No national health records fetched yet</p>
                  <p className="text-sm">Click "Fetch Records" to retrieve records from other facilities</p>
                </div>
              )}
            </div>
          )}

          {/* Claims Tab */}
          {activeTab === 'claims' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Claims Tracking</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setShowClaimForm(true)}
                  disabled={!eligibility?.is_eligible}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit New Claim
                </Button>
              </div>

              {/* Claims Summary */}
              {claims.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{claims.length}</p>
                    <p className="text-sm text-blue-700">Total Claims</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {claims.filter(c => c.status === 'SUBMITTED').length}
                    </p>
                    <p className="text-sm text-yellow-700">Pending</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {claims.filter(c => c.status === 'APPROVED' || c.status === 'SETTLED').length}
                    </p>
                    <p className="text-sm text-green-700">Approved</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-600">
                      ₹{claims.reduce((sum, c) => sum + (c.amounts?.approved || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700">Total Approved</p>
                  </div>
                </div>
              )}

              {/* Claims List */}
              {claims.length > 0 ? (
                <div className="space-y-3">
                  {claims.map((claim) => (
                    <div 
                      key={claim.id}
                      className={`border rounded-lg p-4 ${
                        claim.status === 'APPROVED' ? 'border-green-200 bg-green-50' :
                        claim.status === 'SETTLED' ? 'border-blue-200 bg-blue-50' :
                        claim.status === 'SUBMITTED' ? 'border-yellow-200 bg-yellow-50' :
                        claim.status === 'REJECTED' ? 'border-red-200 bg-red-50' :
                        'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              claim.status === 'APPROVED' ? 'bg-green-200 text-green-800' :
                              claim.status === 'SETTLED' ? 'bg-blue-200 text-blue-800' :
                              claim.status === 'SUBMITTED' ? 'bg-yellow-200 text-yellow-800' :
                              claim.status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {claim.status}
                            </span>
                            <span className="font-mono font-semibold">{claim.claim_number}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {claim.claim_type.toUpperCase()} • {claim.package?.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Submitted: {new Date(claim.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Estimated</p>
                          <p className="font-semibold">₹{claim.amounts?.estimated?.toLocaleString()}</p>
                          {claim.amounts?.approved && (
                            <>
                              <p className="text-sm text-green-600 mt-1">Approved</p>
                              <p className="font-semibold text-green-700">₹{claim.amounts.approved.toLocaleString()}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No claims submitted yet</p>
                </div>
              )}
            </div>
          )}

          {/* Consents Tab */}
          {activeTab === 'consents' && (
            <div className="space-y-6">
              <h3 className="font-semibold">Consent Management</h3>
              
              {consents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No consent requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {consents.map((consent) => (
                    <div 
                      key={consent.id} 
                      className={`border rounded-lg p-4 ${
                        consent.status === 'GRANTED' ? 'border-green-200 bg-green-50' :
                        consent.status === 'REQUESTED' ? 'border-yellow-200 bg-yellow-50' :
                        consent.status === 'DENIED' ? 'border-red-200 bg-red-50' :
                        'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              consent.status === 'GRANTED' ? 'bg-green-200 text-green-800' :
                              consent.status === 'REQUESTED' ? 'bg-yellow-200 text-yellow-800' :
                              consent.status === 'DENIED' ? 'bg-red-200 text-red-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {consent.status}
                            </span>
                            <span className="font-medium text-gray-800">{consent.purpose}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Requester: {consent.requester?.name} ({consent.requester?.type})
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Data: {consent.hi_types?.join(', ')}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          {consent.status === 'REQUESTED' && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleConsentAction(consent.id, 'approve')}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleConsentAction(consent.id, 'deny')}
                              >
                                Deny
                              </Button>
                            </>
                          )}
                          {consent.status === 'GRANTED' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleConsentAction(consent.id, 'revoke')}
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ABHA Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create ABHA (Health ID)</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <Input
                    value={registrationForm.first_name}
                    onChange={(e) => setRegistrationForm({...registrationForm, first_name: e.target.value})}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <Input
                    value={registrationForm.last_name}
                    onChange={(e) => setRegistrationForm({...registrationForm, last_name: e.target.value})}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                <Input
                  type="date"
                  value={registrationForm.date_of_birth}
                  onChange={(e) => setRegistrationForm({...registrationForm, date_of_birth: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender *</label>
                <select
                  value={registrationForm.gender}
                  onChange={(e) => setRegistrationForm({...registrationForm, gender: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number *</label>
                <div className="flex gap-2">
                  <Input
                    value={registrationForm.mobile}
                    onChange={(e) => setRegistrationForm({...registrationForm, mobile: e.target.value})}
                    placeholder="10-digit mobile"
                    maxLength={10}
                  />
                  {!otpSent && (
                    <Button onClick={handleGenerateOTP} disabled={registrationForm.mobile.length !== 10}>
                      Send OTP
                    </Button>
                  )}
                </div>
              </div>

              {otpSent && (
                <div className="bg-green-50 p-3 rounded-lg text-sm text-green-700">
                  OTP sent! Use demo OTP: 123456
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowRegistration(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleRegisterABHA}
                disabled={!otpSent}
              >
                Create ABHA
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Link ABHA Modal */}
      {showLinking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Link Existing ABHA</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ABHA Number</label>
                <Input
                  value={linkForm.abha_number}
                  onChange={(e) => setLinkForm({...linkForm, abha_number: e.target.value})}
                  placeholder="XX-XXXX-XXXX-XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ABHA Address</label>
                <Input
                  value={linkForm.abha_address}
                  onChange={(e) => setLinkForm({...linkForm, abha_address: e.target.value})}
                  placeholder="username@abdm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowLinking(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleLinkABHA}
              >
                Link ABHA
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Claim Modal */}
      {showClaimForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Submit Ayushman Bharat Claim</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Claim Type</label>
                <select
                  value={claimForm.claim_type}
                  onChange={(e) => setClaimForm({...claimForm, claim_type: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="preauth">Pre-Authorization</option>
                  <option value="claim">Final Claim</option>
                  <option value="enhancement">Enhancement Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Package</label>
                <select
                  value={claimForm.package_code}
                  onChange={(e) => {
                    const pkg = eligibility?.covered_packages?.find(p => p.code === e.target.value);
                    setClaimForm({
                      ...claimForm, 
                      package_code: e.target.value,
                      package_name: pkg?.name || ''
                    });
                  }}
                  className="w-full p-2 border rounded-lg"
                >
                  {eligibility?.covered_packages?.map(pkg => (
                    <option key={pkg.code} value={pkg.code}>
                      {pkg.name} (Up to ₹{pkg.limit.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estimated Amount (₹)</label>
                <Input
                  type="number"
                  value={claimForm.estimated_amount}
                  onChange={(e) => setClaimForm({...claimForm, estimated_amount: parseFloat(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Primary Diagnosis (ICD-10)</label>
                <Input
                  value={claimForm.diagnosis_codes[0]}
                  onChange={(e) => setClaimForm({...claimForm, diagnosis_codes: [e.target.value]})}
                  placeholder="e.g., I10 for Hypertension"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                <p className="font-medium">Demo Mode</p>
                <p>Pre-authorization requests will be auto-approved at 90% of estimated amount.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowClaimForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleSubmitClaim}
              >
                Submit Claim
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ABDMIntegration;
