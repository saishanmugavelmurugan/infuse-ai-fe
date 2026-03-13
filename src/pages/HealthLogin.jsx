import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Activity, Heart, Stethoscope, TrendingUp, AlertCircle, Watch, Home, ArrowLeft, Shield, Key, Loader2 } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSelector';

const HealthLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaUserId, setMfaUserId] = useState(null);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, mfaRequired ? mfaCode : null);
    
    if (result.success) {
      navigate('/dashboard/health');
    } else if (result.mfaRequired) {
      // MFA is required - show MFA input
      setMfaRequired(true);
      setMfaUserId(result.userId);
      setLoading(false);
    } else {
      setError(result.error);
      setLoading(false);
      // Reset MFA code if it was invalid
      if (mfaRequired) {
        setMfaCode('');
      }
    }
  };

  const handleBackToLogin = () => {
    setMfaRequired(false);
    setMfaCode('');
    setMfaUserId(null);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white relative">
        {/* Top Navigation - Back to Home & Language Switcher */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div>
            <div className="flex items-center justify-center">
              <img 
                src={process.env.REACT_APP_LOGO_URL} 
                alt="Infuse-AI Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t('healthtrack_title')}<sup className="text-sm">™</sup>
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {mfaRequired ? 'Two-Factor Authentication' : t('healthtrack_subtitle')}
            </p>
          </div>

          {/* MFA Step */}
          {mfaRequired ? (
            <div className="mt-8 space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Required</h3>
                <p className="text-gray-600 text-sm">
                  Enter the 6-digit code from your authenticator app to continue.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="mfa-code" className="block text-sm font-medium text-gray-700 mb-2">
                    Authentication Code
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="mfa-code"
                      name="mfa-code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoComplete="one-time-code"
                      autoFocus
                      required
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="appearance-none block w-full pl-12 pr-4 py-4 text-center text-2xl tracking-[0.5em] font-mono border border-orange-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="000000"
                      data-testid="mfa-code-input"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Or enter a backup code if you don't have access to your authenticator
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || mfaCode.length < 6}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition"
                  data-testid="mfa-verify-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full py-2 text-sm text-gray-600 hover:text-orange-500 transition"
                >
                  ← Back to login
                </button>
              </form>
            </div>
          ) : (
            /* Standard Login Form */
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="doctor@example.com"
                    data-testid="email-input"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('password')}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                  required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder={t('enter_password')}
                    data-testid="password-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    {t('remember_me')}
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-orange-600 hover:text-amber-500">
                    {t('forgot_password')}
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition"
                  data-testid="login-submit-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('loading')}
                    </>
                  ) : (
                    t('secure_login_health')
                  )}
                </button>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  {t('new_to_healthtrack')}
                </p>
                <Link 
                  to="/register/health" 
                  className="block w-full py-3 px-4 border-2 border-orange-500 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-colors"
                >
                  {t('create_account')}
                </Link>
                <p className="text-xs text-gray-500">
                  {t('for_doctors_patients')}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Side - Health Messaging */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 to-amber-600 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <div className="mb-8">
            <Activity className="w-16 h-16 mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              {t('health_command_center')}
            </h1>
            <p className="text-xl text-orange-100">
              {t('health_command_desc')}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{t('patient_management_feat')}</h3>
                <p className="text-orange-100">
                  {t('patient_management_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{t('ai_health_analysis')}</h3>
                <p className="text-orange-100">
                  {t('ai_health_analysis_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{t('telemedicine_feat')}</h3>
                <p className="text-orange-100">
                  {t('telemedicine_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Watch className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{t('wearable_integration')}</h3>
                <p className="text-orange-100">
                  {t('wearable_integration_desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm text-orange-100">
              {t('ai_powered')} • {t('healthcare_solutions')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthLogin;
