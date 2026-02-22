/**
 * SecureSphere Admin Login
 * Protected login requiring admin credentials
 * Same credentials as Feature Flags Admin
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Lock, Eye, EyeOff, AlertCircle, RefreshCw, 
  LogIn, ArrowLeft, Activity, AlertTriangle, Wifi
} from 'lucide-react';

// Admin Credentials (same as Feature Flags)
const ADMIN_CREDENTIALS = {
  email: 'ranjeetkoul@infuse.net.in',
  password: 'Ranjeet$03'
};

const SecureSphereLogin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for existing session
  useEffect(() => {
    const session = localStorage.getItem('securesphere_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.email === ADMIN_CREDENTIALS.email && parsed.expiry > Date.now()) {
          // Redirect to SecureSphere dashboard
          navigate('/securesphere');
        } else {
          localStorage.removeItem('securesphere_session');
        }
      } catch {
        localStorage.removeItem('securesphere_session');
      }
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate auth delay
    setTimeout(() => {
      if (loginForm.email === ADMIN_CREDENTIALS.email && loginForm.password === ADMIN_CREDENTIALS.password) {
        // Store session (expires in 24 hours)
        const session = {
          email: ADMIN_CREDENTIALS.email,
          expiry: Date.now() + 24 * 60 * 60 * 1000
        };
        localStorage.setItem('securesphere_session', JSON.stringify(session));
        navigate('/securesphere');
      } else {
        setError('Invalid admin credentials. Access restricted to authorized personnel only.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Security Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-lg text-white relative z-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/30 rounded-xl">
                <Shield className="w-12 h-12 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">SecureSphere</h1>
                <p className="text-blue-300">Enterprise Security Platform</p>
              </div>
            </div>
            <p className="text-xl text-slate-300">
              Advanced threat detection and network security for enterprises, telcos, and OEMs.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 bg-white/5 rounded-xl p-4 backdrop-blur">
              <div className="bg-red-500/20 rounded-lg p-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Real-Time Threat Detection</h3>
                <p className="text-slate-400">
                  AI-powered analysis of network anomalies and security threats
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white/5 rounded-xl p-4 backdrop-blur">
              <div className="bg-cyan-500/20 rounded-lg p-3">
                <Wifi className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">IoT/GSM Security</h3>
                <p className="text-slate-400">
                  Secure millions of IoT devices and GSM endpoints
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white/5 rounded-xl p-4 backdrop-blur">
              <div className="bg-green-500/20 rounded-lg p-3">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Network Analytics</h3>
                <p className="text-slate-400">
                  Deep visibility into network traffic and behavior patterns
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-slate-400">
              SOC 2 Type II Certified • ISO 27001 • Enterprise Grade Security
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-950 relative">
        {/* Back to Home */}
        <div className="absolute top-4 left-4">
          <Link 
            to="/login" 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>

        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/infuse_logo.jpg" 
              alt="Infuse" 
              className="h-16 mx-auto mb-4 rounded-xl"
            />
            <h2 className="text-2xl font-bold text-white">SecureSphere Admin</h2>
            <p className="text-blue-400 text-sm mt-1 font-medium">Empowering Health Through Intelligence</p>
            <p className="text-slate-500 text-xs mt-1">Restricted Access - Admin Only</p>
          </div>

          {/* Warning Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-amber-400 font-medium text-sm">Restricted Area</p>
                <p className="text-amber-300/70 text-xs mt-1">
                  This portal is for authorized Infuse administrators only. 
                  Unauthorized access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <Lock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Admin Login</h3>
                <p className="text-sm text-slate-400">Enter your admin credentials</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="admin@infuse.net.in"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  data-testid="securesphere-email"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    required
                    data-testid="securesphere-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="securesphere-login-btn"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Access SecureSphere
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                Powered by <span className="text-blue-400">Infuse AI</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                info@infuse.net.in | www.infuse.net.in
              </p>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Need healthcare access?{' '}
              <Link to="/login/health" className="text-green-500 hover:text-green-400">
                Login to HealthTrack Pro
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureSphereLogin;
