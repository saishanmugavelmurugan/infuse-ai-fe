import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { InfuseLogoIcon } from '../components/InfuseLogo';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/api/auth/forgot-password`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = () => {
        setLoading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            setSuccess(true);
            if (data.reset_link) {
              setResetLink(data.reset_link);
            }
          } catch (e) {
            setSuccess(true);
          }
        } else {
          setSuccess(true); // Show success anyway for security
        }
      };
      
      xhr.onerror = () => {
        setLoading(false);
        setSuccess(true); // Show success anyway for security
      };
      
      xhr.send(JSON.stringify({ email }));
    } catch (err) {
      setLoading(false);
      setSuccess(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('check_your_email', 'Check your email')}
            </h2>
            <p className="mt-4 text-gray-600">
              {t('password_reset_sent', "If an account exists with")} <strong>{email}</strong>{t('password_reset_sent_2', ", we've sent a password reset link.")}
            </p>
          </div>

          {/* Show reset link for testing */}
          {resetLink && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm font-medium text-blue-800 mb-2">
                🔧 For Testing: Your reset link
              </p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={resetLink} 
                  readOnly 
                  className="flex-1 text-xs bg-white border border-blue-200 rounded px-2 py-1.5 text-blue-700"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
              )}
              <a 
                href={resetLink}
                className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Click here to reset password
              </a>
              <p className="text-xs text-gray-500 mt-2">
                Note: In production, this link would be sent via email only.
              </p>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <button
              onClick={() => { setSuccess(false); setEmail(''); setResetLink(''); }}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('try_another_email', 'Try another email')}
            </button>
            
            <Link 
              to="/login" 
              className="block w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors text-center"
            >
              {t('back_to_login', 'Back to login')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo & Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <InfuseLogoIcon size={48} />
            <span className="text-3xl font-bold text-gray-900">
              Infuse-AI<sup className="text-sm">™</sup>
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {t('forgot_password_title', 'Forgot your password?')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('forgot_password_desc', "No worries! Enter your email and we'll send you a reset link.")}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('email_address', 'Email address')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('sending', 'Sending...') : t('send_reset_link', 'Send reset link')}
          </button>

          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back_to_login', 'Back to login')}
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
