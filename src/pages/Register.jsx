import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Mail, Lock, User, AlertCircle, Building, Heart, Shield, CheckCircle } from 'lucide-react';
import { InfuseLogoIcon } from '../components/InfuseLogo';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // Step 1: Product selection, Step 2: Account details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    accountType: 'individual',
    product: '' // 'healthtrack' or 'securesphere'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProductSelect = (product) => {
    setFormData({
      ...formData,
      product,
      // Set default role based on product - use 'user' for all as backend validates
      role: 'user'
    });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      product: formData.product,
      account_type: formData.accountType
    });
    
    if (result.success) {
      // Redirect based on selected product
      if (formData.product === 'healthtrack') {
        navigate('/dashboard/health');
      } else if (formData.product === 'securesphere') {
        navigate('/securesphere');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  // Step 1: Product Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Logo & Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2">
              <InfuseLogoIcon size={48} />
              <span className="text-3xl font-bold text-gray-900">
                Infuse-AI<sup className="text-sm">™</sup>
              </span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {t('choose_your_product', 'Choose Your Product')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('select_product_to_get_started', 'Select the product you want to get started with')}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {t('already_have_account', 'Already have an account?')}{' '}
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                {t('sign_in', 'Sign in')}
              </Link>
            </p>
          </div>

          {/* Product Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* HealthTrack Pro */}
            <button
              onClick={() => handleProductSelect('healthtrack')}
              className="p-6 border-2 border-gray-200 rounded-2xl text-left transition-all hover:border-orange-500 hover:shadow-lg group bg-white"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                  <Heart className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">HealthTrack Pro</h3>
                  <p className="text-sm text-gray-500">{t('healthcare_platform', 'Healthcare Platform')}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {t('healthtrack_desc', 'Complete healthcare management solution for patients, doctors, and healthcare providers.')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t('patient_records', 'Patient Records Management')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t('appointment_scheduling', 'Appointment Scheduling')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t('prescription_management', 'Prescription Management')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t('lab_reports', 'Lab Reports & Analytics')}
                </li>
              </ul>
              <div className="mt-4 text-orange-600 font-medium flex items-center gap-2">
                {t('get_started', 'Get Started')} →
              </div>
            </button>

            {/* SecureSphere */}
            <button
              onClick={() => handleProductSelect('securesphere')}
              className="p-6 border-2 border-gray-200 rounded-2xl text-left transition-all hover:border-blue-500 hover:shadow-lg group bg-white"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">SecureSphere</h3>
                  <p className="text-sm text-gray-500">{t('security_platform', 'Security Platform')}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {t('securesphere_desc', 'Advanced cybersecurity platform for threat detection, device protection, and fraud prevention.')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t('url_scanning', 'URL & Phishing Detection')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t('sms_analysis', 'SMS Fraud Analysis')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t('device_protection', 'Device Protection')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t('threat_scoring', 'Real-time Threat Scoring')}
                </li>
              </ul>
              <div className="mt-4 text-blue-600 font-medium flex items-center gap-2">
                {t('get_started', 'Get Started')} →
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Account Details Form
  const isHealthTrack = formData.product === 'healthtrack';
  const primaryColor = isHealthTrack ? 'orange' : 'blue';

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
          
          {/* Product Badge */}
          <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            isHealthTrack ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {isHealthTrack ? <Heart className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            <span className="font-medium">{isHealthTrack ? 'HealthTrack Pro' : 'SecureSphere'}</span>
          </div>
          
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {t('create_your_account', 'Create your account')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            <button 
              onClick={() => setStep(1)} 
              className={`font-medium ${isHealthTrack ? 'text-orange-600 hover:text-orange-500' : 'text-blue-600 hover:text-blue-500'}`}
            >
              ← {t('change_product', 'Change product')}
            </button>
          </p>
        </div>

        {/* Registration Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Account Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('account_type', 'Account Type')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, accountType: 'individual'})}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    formData.accountType === 'individual'
                      ? `border-${primaryColor}-500 bg-${primaryColor}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={formData.accountType === 'individual' ? {
                    borderColor: isHealthTrack ? '#f97316' : '#3b82f6',
                    backgroundColor: isHealthTrack ? '#fff7ed' : '#eff6ff'
                  } : {}}
                >
                  <User className={`w-5 h-5 mx-auto mb-1 ${isHealthTrack ? 'text-orange-600' : 'text-blue-600'}`} />
                  <div className="font-medium text-sm">{t('individual', 'Individual')}</div>
                  <div className="text-xs text-gray-500">{t('personal_use', 'Personal use')}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, accountType: 'enterprise'})}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    formData.accountType === 'enterprise'
                      ? `border-${primaryColor}-500 bg-${primaryColor}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={formData.accountType === 'enterprise' ? {
                    borderColor: isHealthTrack ? '#f97316' : '#3b82f6',
                    backgroundColor: isHealthTrack ? '#fff7ed' : '#eff6ff'
                  } : {}}
                >
                  <Building className={`w-5 h-5 mx-auto mb-1 ${isHealthTrack ? 'text-orange-600' : 'text-blue-600'}`} />
                  <div className="font-medium text-sm">{t('enterprise', 'Enterprise')}</div>
                  <div className="text-xs text-gray-500">{t('business', 'Business')}</div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('full_name', 'Full Name')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500`}
                  style={{ '--tw-ring-color': isHealthTrack ? '#f97316' : '#3b82f6' }}
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
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
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Role Selection - Different options based on product */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                {t('i_am_a', 'I am a')}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {isHealthTrack ? (
                  <>
                    <option value="user">{t('patient', 'Patient')}</option>
                    <option value="doctor">{t('doctor', 'Doctor / Healthcare Provider')}</option>
                  </>
                ) : (
                  <>
                    <option value="user">{t('mobile_user', 'Mobile User')}</option>
                    <option value="user">{t('enterprise_user', 'Enterprise User')}</option>
                    <option value="admin">{t('security_admin', 'Security Administrator')}</option>
                  </>
                )}
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('password', 'Password')}
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
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('confirm_password', 'Confirm Password')}
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className={`h-4 w-4 mt-1 ${isHealthTrack ? 'text-orange-600' : 'text-blue-600'} focus:ring-${primaryColor}-500 border-gray-300 rounded`}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              {t('i_agree_to', 'I agree to the')}{' '}
              <Link to="/terms" className={`${isHealthTrack ? 'text-orange-600 hover:text-orange-500' : 'text-blue-600 hover:text-blue-500'}`}>
                {t('terms_of_service', 'Terms of Service')}
              </Link>
              {' '}{t('and', 'and')}{' '}
              <Link to="/privacy" className={`${isHealthTrack ? 'text-orange-600 hover:text-orange-500' : 'text-blue-600 hover:text-blue-500'}`}>
                {t('privacy_policy', 'Privacy Policy')}
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full py-3 ${
              isHealthTrack 
                ? 'bg-orange-600 hover:bg-orange-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white rounded-lg font-medium`}
          >
            {loading ? t('creating_account', 'Creating account...') : t('create_account', 'Create Account')}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {t('already_have_account', 'Already have an account?')}{' '}
          <Link 
            to={isHealthTrack ? '/login/health' : '/login/security'} 
            className={`font-medium ${isHealthTrack ? 'text-orange-600 hover:text-orange-500' : 'text-blue-600 hover:text-blue-500'}`}
          >
            {t('sign_in', 'Sign in')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
