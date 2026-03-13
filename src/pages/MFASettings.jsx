/**
 * MFA Settings Page
 * Allows users to enable/disable Two-Factor Authentication
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, ArrowLeft, Smartphone, Key, CheckCircle, 
  AlertTriangle, Copy, RefreshCw, Loader2, Lock, X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const MFASettings = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState('status'); // status, setup, verify, backup
  const [backupCodes, setBackupCodes] = useState([]);
  const [disabling, setDisabling] = useState(false);
  const [disableCode, setDisableCode] = useState('');

  useEffect(() => {
    fetchMFAStatus();
  }, []);

  const fetchMFAStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/mfa/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMfaEnabled(data.mfa_enabled);
        setBackupCodes(data.backup_codes_remaining || []);
      }
    } catch (err) {
      console.error('Failed to fetch MFA status:', err);
    }
    setLoading(false);
  };

  const initiateSetup = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/mfa/setup`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSetupData(data);
        setStep('setup');
      } else {
        const err = await response.json();
        setError(err.detail || 'Failed to initiate MFA setup');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const verifyAndEnable = async (e) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/mfa/verify`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackupCodes(data.backup_codes || []);
        setMfaEnabled(true);
        setStep('backup');
        setSuccess('MFA has been enabled successfully!');
      } else {
        const err = await response.json();
        setError(err.detail || 'Invalid verification code');
        setVerificationCode('');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const disableMFA = async (e) => {
    e.preventDefault();
    if (disableCode.length < 6) {
      setError('Please enter your MFA code');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/mfa/disable`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: disableCode })
      });
      
      if (response.ok) {
        setMfaEnabled(false);
        setDisabling(false);
        setDisableCode('');
        setStep('status');
        setSuccess('MFA has been disabled.');
      } else {
        const err = await response.json();
        setError(err.detail || 'Invalid code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const downloadBackupCodes = () => {
    const text = `HealthTrack Pro - MFA Backup Codes\n${'='.repeat(40)}\n\nUser: ${user?.email}\nGenerated: ${new Date().toISOString()}\n\nBackup Codes (each can only be used once):\n\n${backupCodes.map((code, i) => `${i + 1}. ${code}`).join('\n')}\n\nStore these codes in a safe place!`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'healthtrack-backup-codes.txt';
    a.click();
  };

  if (loading && step === 'status') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50" data-testid="mfa-settings-page">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-orange-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-orange-50 rounded-full transition"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-500" />
                Two-Factor Authentication
              </h1>
              <p className="text-sm text-gray-500">Secure your account with MFA</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Status Card */}
        {step === 'status' && (
          <Card className="border border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-500" />
                MFA Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`p-6 rounded-xl ${mfaEnabled ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${mfaEnabled ? 'bg-green-500' : 'bg-amber-500'}`}>
                    {mfaEnabled ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {mfaEnabled ? 'MFA is Enabled' : 'MFA is Not Enabled'}
                    </h3>
                    <p className="text-gray-600">
                      {mfaEnabled 
                        ? 'Your account is protected with two-factor authentication.'
                        : 'Enable MFA to add an extra layer of security to your account.'}
                    </p>
                  </div>
                </div>
              </div>

              {mfaEnabled ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-gray-500" />
                      <span>Backup codes remaining</span>
                    </div>
                    <span className="font-semibold">{backupCodes.length || 0}</span>
                  </div>
                  
                  {!disabling ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setDisabling(true)}
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Disable MFA
                    </Button>
                  ) : (
                    <form onSubmit={disableMFA} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter your MFA code to disable
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={disableCode}
                          onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full p-3 text-center text-xl tracking-widest border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300"
                          placeholder="000000"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => { setDisabling(false); setDisableCode(''); }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={loading || disableCode.length < 6}
                          className="flex-1 bg-red-500 hover:bg-red-600"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Disable'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <Button 
                  onClick={initiateSetup}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md"
                  data-testid="enable-mfa-btn"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                  Enable Two-Factor Authentication
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Setup Step */}
        {step === 'setup' && setupData && (
          <Card className="border border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-orange-500" />
                Step 1: Scan QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, or similar):
              </p>

              <div className="flex justify-center">
                <div className="p-4 bg-white border-2 border-orange-200 rounded-xl">
                  <img 
                    src={setupData.qr_code} 
                    alt="MFA QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Can't scan? Enter this code manually:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-sm">
                    {setupData.secret}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(setupData.secret)}
                    className="p-2 hover:bg-orange-50 rounded-lg transition"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={verifyAndEnable} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Step 2: Enter verification code from your app
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-4 text-center text-2xl tracking-[0.5em] font-mono border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                    placeholder="000000"
                    autoFocus
                    data-testid="verify-code-input"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => { setStep('status'); setSetupData(null); }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading || verificationCode.length < 6}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    data-testid="verify-enable-btn"
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Verify & Enable'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Backup Codes Step */}
        {step === 'backup' && (
          <Card className="border border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                MFA Enabled Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800">Save Your Backup Codes</h4>
                    <p className="text-sm text-amber-700">
                      Save these backup codes in a secure place. You can use them to access your account if you lose your authenticator device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {backupCodes.map((code, i) => (
                  <div 
                    key={i}
                    className="p-3 bg-white border border-gray-200 rounded-lg font-mono text-center cursor-pointer hover:bg-orange-50 transition"
                    onClick={() => copyToClipboard(code)}
                  >
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(backupCodes.join('\n'))}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
                <Button 
                  variant="outline"
                  onClick={downloadBackupCodes}
                  className="flex-1"
                >
                  Download
                </Button>
              </div>

              <Button 
                onClick={() => setStep('status')}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Done
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <div className="mt-8 p-6 bg-white rounded-xl border border-orange-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            About Two-Factor Authentication
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Two-factor authentication (2FA) adds an extra layer of security to your account by requiring a second form of verification when logging in.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Even if someone knows your password, they can't access your account without the second factor</li>
              <li>Uses time-based one-time passwords (TOTP) compatible with any authenticator app</li>
              <li>Backup codes let you recover access if you lose your device</li>
              <li>Compliant with HIPAA, DHA, and NABIDH security requirements</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MFASettings;
