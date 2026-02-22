import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { InfuseLogoIcon } from '../components/InfuseLogo';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ResetPassword = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/api/auth/reset-password`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = () => {
        setLoading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          setSuccess(true);
        } else {
          let errorMsg = 'Failed to reset password';
          try {
            const data = JSON.parse(xhr.responseText);
            errorMsg = data.detail || errorMsg;
          } catch (e) {}
          setError(errorMsg);
        }
      };
      
      xhr.onerror = () => {
        setLoading(false);
        setError('Network error. Please try again.');
      };
      
      xhr.send(JSON.stringify({ token, new_password: password }));
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
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
              {t('password_reset_success', 'Password Reset Successful!')}
            </h2>
            <p className="mt-4 text-gray-600">
              {t('password_reset_success_desc', 'Your password has been changed successfully. You can now login with your new password.')}
            </p>
          </div>

          <Link 
            to="/login" 
            className="block w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors text-center"
          >
            {t('go_to_login', 'Go to Login')}
          </Link>
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
            {t('reset_your_password', 'Reset your password')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('enter_new_password', 'Enter your new password below')}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('new_password', 'New Password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('confirm_new_password', 'Confirm New Password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('resetting', 'Resetting...') : t('reset_password', 'Reset Password')}
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

export default ResetPassword;
