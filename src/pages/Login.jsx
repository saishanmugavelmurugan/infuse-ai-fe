import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Mail, Lock, AlertCircle, ArrowLeft, Heart, Shield, Download, Monitor, Smartphone, Chrome } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // App download links - Coming Soon pages
  const APP_DOWNLOADS = {
    windows: '/downloads/windows',
    mac: '/downloads/mac',
    android: '/downloads/android',
    ios: '/downloads/ios',
    chrome: '/downloads/chrome-extension',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back to Home Link */}
      <div className="absolute top-4 left-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-gray-600 hover:text-[#E55A00] transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-4xl w-full">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img 
              src="/logo192.png"
              alt="Infuse-AI Logo" 
              className="h-12 w-auto object-contain"
            />
            <span className="text-3xl font-bold text-gray-900">
              Infuse-AI<sup className="text-sm">™</sup>
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Choose Your Platform
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select the product you want to access
          </p>
        </div>

        {/* Product Selection Cards */}
        <div className="max-w-lg mx-auto mb-8">
          {/* HealthTrack Pro Card */}
          <Link to="/login/health" className="block">
            <div className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl p-8 transition-all hover:shadow-lg group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-500 transition">
                  <Heart className="w-8 h-8 text-green-600 group-hover:text-white transition" />
                </div>
                <span className="text-sm font-medium text-green-600">Healthcare</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">HealthTrack Pro</h3>
              <p className="text-gray-600 mb-4">
                For doctors, clinics, and healthcare providers managing patient health data
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Patient Management
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  AI Lab Report Analysis
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Health Analytics
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  AI Wellness Plans
                </div>
              </div>
              <div className="mt-6 text-green-600 font-medium group-hover:text-green-700">
                Login to HealthTrack Pro →
              </div>
            </div>
          </Link>
        </div>

        {/* Alternative Options */}
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
              Register now
            </Link>
          </p>
          <p className="mt-3 text-sm text-gray-600">
            Are you a Doctor?{' '}
            <Link to="/doctor-onboarding" className="font-medium text-emerald-600 hover:text-emerald-500">
              Join our Network →
            </Link>
          </p>
        </div>

        {/* App Download Section */}
        <div className="mt-10 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Get Infuse on All Your Devices</h3>
            <p className="text-sm text-gray-600 mt-1">Download our apps for the best experience</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Windows */}
            <Link 
              to={APP_DOWNLOADS.windows}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all group"
              data-testid="download-windows"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition">
                <Monitor className="w-6 h-6 text-blue-600 group-hover:text-white transition" />
              </div>
              <span className="text-sm font-medium text-gray-700">Windows</span>
              <span className="text-xs text-orange-500">Coming Soon</span>
            </Link>

            {/* Mac */}
            <Link 
              to={APP_DOWNLOADS.mac}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all group"
              data-testid="download-mac"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-800 transition">
                <svg className="w-6 h-6 text-gray-700 group-hover:text-white transition" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">macOS</span>
              <span className="text-xs text-orange-500">Coming Soon</span>
            </Link>

            {/* Android */}
            <Link 
              to={APP_DOWNLOADS.android}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all group"
              data-testid="download-android"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-500 transition">
                <Smartphone className="w-6 h-6 text-green-600 group-hover:text-white transition" />
              </div>
              <span className="text-sm font-medium text-gray-700">Android</span>
              <span className="text-xs text-orange-500">Coming Soon</span>
            </Link>

            {/* iOS */}
            <Link 
              to={APP_DOWNLOADS.ios}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all group"
              data-testid="download-ios"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-800 transition">
                <svg className="w-6 h-6 text-gray-700 group-hover:text-white transition" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">iOS</span>
              <span className="text-xs text-orange-500">Coming Soon</span>
            </Link>

            {/* Chrome Extension */}
            <Link 
              to={APP_DOWNLOADS.chrome}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all group"
              data-testid="download-chrome"
            >
              <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-500 transition">
                <Chrome className="w-6 h-6 text-yellow-600 group-hover:text-white transition" />
              </div>
              <span className="text-sm font-medium text-gray-700">Chrome</span>
              <span className="text-xs text-orange-500">Coming Soon</span>
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-orange-600 mb-2">
            "Empowering Health Through Intelligence"
          </p>
          <div className="text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Back to Home</Link>
            {' · '}
            <Link to="/terms" className="hover:text-orange-600">Terms</Link>
            {' · '}
            <Link to="/privacy" className="hover:text-orange-600">Privacy</Link>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            © {new Date().getFullYear()} Infuse AI. All rights reserved. | www.infuse.net.in
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
