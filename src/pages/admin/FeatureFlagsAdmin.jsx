import React, { useState, useEffect } from 'react';
import { 
  Settings, ToggleLeft, ToggleRight, Shield, Activity, 
  Users, Zap, ChevronDown, ChevronUp, Search, RefreshCw,
  AlertCircle, CheckCircle, Lock, Unlock, Package, LogIn, Eye, EyeOff
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';
const ADMIN_KEY = 'infuse_internal_2025_secret';

// Admin Credentials
const ADMIN_CREDENTIALS = {
  email: 'ranjeetkoul@infuse.net.in',
  password: 'Ranjeet$03'
};

const FeatureFlagsAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [togglingFeature, setTogglingFeature] = useState(null);
  const [notification, setNotification] = useState(null);

  // Check for existing session
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.email === ADMIN_CREDENTIALS.email && parsed.expiry > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch {
        localStorage.removeItem('admin_session');
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    // Simulate auth delay
    setTimeout(() => {
      if (loginForm.email === ADMIN_CREDENTIALS.email && loginForm.password === ADMIN_CREDENTIALS.password) {
        // Store session (expires in 24 hours)
        const session = {
          email: ADMIN_CREDENTIALS.email,
          expiry: Date.now() + 24 * 60 * 60 * 1000
        };
        localStorage.setItem('admin_session', JSON.stringify(session));
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Invalid email or password');
      }
      setLoginLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setLoginForm({ email: '', password: '' });
  };

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/features/admin/summary`, {
        headers: {
          'x-internal-key': ADMIN_KEY
        }
      });
      if (!response.ok) throw new Error('Failed to fetch features');
      const data = await response.json();
      setSummary(data);
      
      const expanded = {};
      data.products.forEach(p => { expanded[p.name] = true; });
      setExpandedProducts(expanded);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeatures();
    }
  }, [isAuthenticated]);

  const toggleFeature = async (productName, featureName, currentState) => {
    setTogglingFeature(`${productName}-${featureName}`);
    try {
      const response = await fetch(
        `${API_URL}/api/features/admin/${productName}/${featureName}/toggle`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-key': ADMIN_KEY
          },
          body: JSON.stringify({ enabled: !currentState })
        }
      );
      
      if (!response.ok) throw new Error('Failed to toggle feature');
      
      setSummary(prev => ({
        ...prev,
        products: prev.products.map(p => {
          if (p.name === productName) {
            return {
              ...p,
              features: p.features.map(f => {
                if (f.name === featureName) {
                  return { ...f, enabled: !currentState };
                }
                return f;
              }),
              enabled_count: currentState ? p.enabled_count - 1 : p.enabled_count + 1
            };
          }
          return p;
        }),
        enabled_features: currentState ? prev.enabled_features - 1 : prev.enabled_features + 1,
        disabled_features: currentState ? prev.disabled_features + 1 : prev.disabled_features - 1
      }));

      setNotification({
        type: 'success',
        message: `${featureName} ${!currentState ? 'enabled' : 'disabled'} successfully`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setTogglingFeature(null);
    }
  };

  const toggleProduct = async (productName, currentState) => {
    setTogglingFeature(productName);
    try {
      const response = await fetch(
        `${API_URL}/api/features/admin/${productName}/toggle`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-key': ADMIN_KEY
          },
          body: JSON.stringify({ enabled: !currentState })
        }
      );
      
      if (!response.ok) throw new Error('Failed to toggle product');
      
      setSummary(prev => ({
        ...prev,
        products: prev.products.map(p => {
          if (p.name === productName) {
            return { ...p, enabled: !currentState };
          }
          return p;
        })
      }));

      setNotification({
        type: 'success',
        message: `${productName} ${!currentState ? 'enabled' : 'disabled'} successfully`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setTogglingFeature(null);
    }
  };

  const getProductIcon = (name) => {
    switch (name) {
      case 'healthtrack': return <Activity className="w-5 h-5 text-emerald-500" />;
      case 'securesphere': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'platform': return <Zap className="w-5 h-5 text-purple-500" />;
      case 'admin': return <Users className="w-5 h-5 text-orange-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTierBadge = (tier) => {
    const colors = {
      free: 'bg-gray-100 text-gray-700',
      basic: 'bg-blue-100 text-blue-700',
      pro: 'bg-purple-100 text-purple-700',
      enterprise: 'bg-amber-100 text-amber-700'
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[tier] || colors.free}`}>
        {tier}
      </span>
    );
  };

  const filteredProducts = summary?.products?.filter(product => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return product.name.toLowerCase().includes(term) ||
      product.features.some(f => f.name.toLowerCase().includes(term));
  }) || [];

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-6" data-testid="admin-login">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/infuse_logo.jpg" 
              alt="Infuse AI" 
              className="h-16 mx-auto mb-4 rounded-lg"
            />
            <h1 className="text-2xl font-bold text-white">Admin Console</h1>
            <p className="text-emerald-400 text-sm mt-1 font-medium">Empowering Health Through Intelligence</p>
            <p className="text-slate-400 text-xs mt-1">Feature Flags Management</p>
          </div>

          {/* Login Form */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-600/20 rounded-xl">
                <Lock className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Secure Login</h2>
                <p className="text-sm text-slate-400">Enter your admin credentials</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="admin@infuse.net.in"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                  data-testid="admin-email"
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                    required
                    data-testid="admin-password"
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

              {loginError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="admin-login-btn"
              >
                {loginLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-700 text-center">
              <p className="text-xs text-slate-500">
                Powered by <span className="text-emerald-400">Infuse AI</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                info@infuse.net.in | www.infuse.net.in
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading feature flags...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchFeatures}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6" data-testid="feature-flags-admin">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/infuse_logo.jpg" alt="Infuse" className="h-10 rounded-lg" />
            <div className="p-3 bg-emerald-600/20 rounded-xl">
              <Settings className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Feature Flags Manager</h1>
              <p className="text-slate-400">Enable or disable features with a click</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">{ADMIN_CREDENTIALS.email}</span>
            <button 
              onClick={fetchFeatures}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4 rotate-180" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Features</span>
              <Package className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{summary?.total_features || 0}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Enabled</span>
              <Unlock className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold mt-2 text-emerald-500">{summary?.enabled_features || 0}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Disabled</span>
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold mt-2 text-red-500">{summary?.disabled_features || 0}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Products</span>
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{summary?.products?.length || 0}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products or features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400"
            data-testid="feature-search"
          />
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.name}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden"
              data-testid={`product-${product.name}`}
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
                onClick={() => setExpandedProducts(prev => ({ ...prev, [product.name]: !prev[product.name] }))}
              >
                <div className="flex items-center gap-3">
                  {getProductIcon(product.name)}
                  <div>
                    <h3 className="font-semibold capitalize">{product.name}</h3>
                    <p className="text-sm text-slate-400">
                      {product.enabled_count}/{product.feature_count} features enabled
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProduct(product.name, product.enabled);
                    }}
                    disabled={togglingFeature === product.name}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      product.enabled ? 'bg-emerald-600' : 'bg-slate-600'
                    } ${togglingFeature === product.name ? 'opacity-50' : ''}`}
                    data-testid={`toggle-product-${product.name}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      product.enabled ? 'left-8' : 'left-1'
                    }`} />
                  </button>
                  {expandedProducts[product.name] ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {expandedProducts[product.name] && (
                <div className="border-t border-slate-700">
                  {product.features
                    .filter(f => !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((feature) => (
                    <div 
                      key={feature.name}
                      className="flex items-center justify-between p-4 border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/20"
                      data-testid={`feature-${product.name}-${feature.name}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${feature.enabled ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                        <div>
                          <span className="font-medium capitalize">{feature.name.replace(/_/g, ' ')}</span>
                          <div className="flex items-center gap-2 mt-1">
                            {getTierBadge(feature.tier)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFeature(product.name, feature.name, feature.enabled)}
                        disabled={togglingFeature === `${product.name}-${feature.name}`}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                          feature.enabled 
                            ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30' 
                            : 'bg-slate-600/20 text-slate-400 hover:bg-slate-600/30'
                        } ${togglingFeature === `${product.name}-${feature.name}` ? 'opacity-50' : ''}`}
                        data-testid={`toggle-${product.name}-${feature.name}`}
                      >
                        {feature.enabled ? (
                          <>
                            <ToggleRight className="w-5 h-5" />
                            <span className="text-sm">Enabled</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5" />
                            <span className="text-sm">Disabled</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            Powered by <span className="text-emerald-400 font-semibold">Infuse AI</span>
          </p>
          <p className="text-xs text-slate-600 mt-1">
            info@infuse.net.in | www.infuse.net.in | +91-XXXX-XXXXXX
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureFlagsAdmin;
