/**
 * App Downloads - Coming Soon Page
 * Platform-specific download pages with email signup
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Monitor, Smartphone, Chrome, Apple, Mail, Bell, 
  CheckCircle, ArrowLeft, ExternalLink, QrCode
} from 'lucide-react';

const platformData = {
  windows: {
    name: 'Windows Desktop',
    icon: Monitor,
    color: 'bg-blue-500',
    description: 'Full-featured desktop application for Windows 10/11',
    features: [
      'Offline access to medical records',
      'Desktop notifications',
      'Integration with Windows Hello',
      'Automatic sync when online'
    ],
    requirements: 'Windows 10 or later, 4GB RAM, 500MB storage',
    eta: 'Q2 2026'
  },
  mac: {
    name: 'macOS Desktop',
    icon: Apple,
    color: 'bg-gray-800',
    description: 'Native macOS application with full Apple ecosystem integration',
    features: [
      'Apple Health sync',
      'Touch ID support',
      'iCloud backup',
      'Siri shortcuts'
    ],
    requirements: 'macOS 12 Monterey or later',
    eta: 'Q2 2026'
  },
  android: {
    name: 'Android App',
    icon: Smartphone,
    color: 'bg-green-500',
    description: 'Full mobile experience for Android devices',
    features: [
      'Google Fit integration',
      'Samsung Health sync',
      'Biometric login',
      'Offline mode',
      'Push notifications'
    ],
    requirements: 'Android 8.0 or later',
    eta: 'Q1 2026'
  },
  ios: {
    name: 'iOS App',
    icon: Apple,
    color: 'bg-gray-800',
    description: 'Native iOS app for iPhone and iPad',
    features: [
      'Apple Health integration',
      'Face ID / Touch ID',
      'Apple Watch companion',
      'Siri shortcuts',
      'Widget support'
    ],
    requirements: 'iOS 15 or later',
    eta: 'Q1 2026'
  },
  'chrome-extension': {
    name: 'Chrome Extension',
    icon: Chrome,
    color: 'bg-yellow-500',
    description: 'Quick access browser extension for Chrome',
    features: [
      'One-click appointment booking',
      'Medication reminders',
      'Quick prescription view',
      'Lab report notifications'
    ],
    requirements: 'Chrome 90 or later',
    eta: 'Q1 2026'
  }
};

const AppDownload = () => {
  const { platform } = useParams();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const data = platformData[platform] || platformData.android;
  const IconComponent = data.icon;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubscribed(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
          <img src="/infuse_logo.jpg" alt="Infuse" className="h-8 rounded" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className={`w-24 h-24 ${data.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
            <IconComponent className="w-12 h-12 text-white" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full mb-4">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {data.name}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* Email Signup */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-12">
          {subscribed ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">You're on the list!</h3>
              <p className="text-slate-400">
                We'll notify you at <span className="text-white">{email}</span> when the {data.name} is ready.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                Get Notified When It's Ready
              </h3>
              <p className="text-slate-400 text-center mb-6">
                Be the first to know when we launch the {data.name}.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    data-testid="notify-email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
                  data-testid="notify-submit"
                >
                  {loading ? 'Subscribing...' : 'Notify Me'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-3">
              {data.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Expected Launch</p>
                <p className="text-white font-medium">{data.eta}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Requirements</p>
                <p className="text-white">{data.requirements}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Price</p>
                <p className="text-green-400 font-semibold">Free</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Now Section */}
        <div className="text-center">
          <p className="text-slate-400 mb-4">Can't wait? Try our web app now!</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition"
          >
            <ExternalLink className="w-5 h-5" />
            Open Web App
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center border-t border-slate-700/50 pt-8">
          <p className="text-orange-400 font-medium mb-2">Empowering Health Through Intelligence</p>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Infuse AI. All rights reserved. | www.infuse.net.in
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
