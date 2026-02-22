import React, { useState, useEffect } from 'react';
import {
  Download, Shield, Cpu, Wifi, Lock, CheckCircle, AlertTriangle,
  Key, CreditCard, Building2, Globe, Code, FileText, RefreshCw,
  Loader2, ChevronRight, Copy, ExternalLink, Zap, Brain, Server
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OEMSDKPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationForm, setRegistrationForm] = useState({
    company_name: '',
    contact_email: '',
    contact_name: '',
    device_types: [],
    estimated_devices: 100,
    interface_type: 'http',
    plan: 'starter'
  });
  const [registrationResult, setRegistrationResult] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const response = await fetch(`${API_URL}/api/oem-sdk/pricing`);
      if (response.ok) {
        const data = await response.json();
        setPricing(data);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/oem-sdk/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRegistrationResult(data);
        setShowRegistration(false);
      } else {
        alert(data.detail || 'Registration failed');
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deviceTypes = [
    { id: 'white_goods', label: 'White Goods', icon: '🏠', desc: 'Smart Home Appliances' },
    { id: 'cctv', label: 'CCTV', icon: '📹', desc: 'Surveillance Systems' },
    { id: 'automotive', label: 'Automotive', icon: '🚗', desc: 'Connected Vehicles' },
    { id: 'healthcare', label: 'Healthcare', icon: '🏥', desc: 'Medical Devices' },
    { id: 'industrial', label: 'Industrial', icon: '🏭', desc: 'IIoT Systems' },
    { id: 'mobile', label: 'Mobile', icon: '📱', desc: 'Smartphones & Tablets' }
  ];

  const interfaces = [
    { id: 'http', label: 'HTTP/REST', desc: 'Standard web API' },
    { id: 'mqtt', label: 'MQTT', desc: 'IoT messaging protocol' },
    { id: 'ble', label: 'BLE', desc: 'Bluetooth Low Energy' },
    { id: 'serial', label: 'Serial/UART', desc: 'Embedded systems' },
    { id: 'can_bus', label: 'CAN Bus', desc: 'Automotive/Industrial' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Backdoor Sealing',
      desc: 'AI-powered detection and sealing of system backdoors, debug ports, and unauthorized access points'
    },
    {
      icon: Brain,
      title: 'AI/ML Threat Detection',
      desc: 'Continuous learning from threat patterns across all connected devices'
    },
    {
      icon: Lock,
      title: 'Zero-Trust Architecture',
      desc: 'Every connection verified, every access authenticated'
    },
    {
      icon: Zap,
      title: 'Lightweight (<500KB)',
      desc: 'Minimal footprint for resource-constrained devices'
    },
    {
      icon: Globe,
      title: 'Multi-Protocol Support',
      desc: 'HTTP, MQTT, BLE, Serial, CAN Bus - your choice'
    },
    {
      icon: Server,
      title: 'Real-time Monitoring',
      desc: 'Live threat dashboard with instant alerts'
    }
  ];

  if (loading && !pricing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-300 text-sm mb-6">
              <Shield className="w-4 h-4" />
              Industry-Leading Device Protection
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              SecureSphere <span className="text-amber-400">OEM SDK</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              The world's first AI-powered, lightweight (&lt;500KB) security SDK for connected devices.
              Seal backdoors. Block threats. Protect everything.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowRegistration(true)}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Get SDK Access
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition"
              >
                View Pricing
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>487KB Package Size</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>5 Interface Types</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>AI/ML Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>₹150/month ($5 USD) Minimum</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900/50 border-y border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto">
            {['overview', 'features', 'pricing', 'integration', 'comparison'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 text-sm font-medium capitalize whitespace-nowrap transition border-b-2 ${
                  activeTab === tab
                    ? 'text-amber-400 border-amber-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {activeTab === 'overview' && (
          <div className="space-y-16">
            {/* Features Grid */}
            <div>
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Why OEMs Choose SecureSphere
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 transition">
                    <feature.icon className="w-10 h-10 text-amber-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Types */}
            <div>
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Supported Device Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {deviceTypes.map((device) => (
                  <div key={device.id} className="bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-white/10 hover:border-amber-500/50 transition">
                    <div className="text-4xl mb-2">{device.icon}</div>
                    <h4 className="font-bold text-white">{device.label}</h4>
                    <p className="text-xs text-gray-400">{device.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Complete Security Feature Set
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Backdoor Sealing */}
              <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-2xl p-8 border border-red-500/30">
                <Lock className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Backdoor Sealing</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Debug port detection & lockdown</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> JTAG/UART interface protection</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Default credential elimination</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Remote access vulnerability patching</li>
                </ul>
              </div>

              {/* AI/ML Tracking */}
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl p-8 border border-purple-500/30">
                <Brain className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">AI/ML Threat Intelligence</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Behavioral anomaly detection</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Pattern learning across device fleet</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Predictive threat scoring</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Automated response policies</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && pricing && (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Transparent, Flexible Pricing
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
              Starting from just ₹150/month ($5 USD). Scale as you grow.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(pricing.pricing_tiers || {}).slice(0, 4).map(([key, tier], idx) => (
                <div 
                  key={key}
                  className={`bg-white/5 backdrop-blur rounded-2xl p-6 border ${
                    idx === 1 ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-white/10'
                  }`}
                >
                  {idx === 1 && (
                    <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full mb-4 inline-block">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <div className="my-4">
                    <div className="flex flex-col">
                      <div>
                        <span className="text-4xl font-bold text-white">₹{tier.price_inr}</span>
                        <span className="text-gray-400">/month</span>
                      </div>
                      <span className="text-lg text-gray-400 mt-1">
                        ${Math.round(tier.price_inr * 3.5 / 100) || Math.round(tier.price_inr * 0.012)} USD/month
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{tier.devices} devices</p>
                  <ul className="space-y-2 mb-6">
                    {tier.features?.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      setRegistrationForm({ ...registrationForm, plan: key.replace('saas_individual_', '').replace('_', '') });
                      setShowRegistration(true);
                    }}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      idx === 1 
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center">
              <h4 className="text-xl font-bold text-white mb-2">Enterprise Bulk Purchase</h4>
              <p className="text-gray-300 mb-4">Need 1000+ devices? Get volume discounts up to 47% off!</p>
              <button className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600">
                Contact Sales
              </button>
            </div>
          </div>
        )}

        {activeTab === 'integration' && (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Easy Integration
            </h2>

            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Quick Start Code</h3>
              <pre className="bg-gray-900 rounded-lg p-6 overflow-x-auto text-sm">
                <code className="text-green-400">{`// SecureSphere SDK - C Integration Example
#include "securesphere_sdk.h"

int main() {
    // Initialize with your license key
    ss_init("LIC-XXXXXXXX-XXXXXXXX");
    
    // Enable AI-powered backdoor sealing
    ss_seal_backdoors();
    
    // Start continuous threat monitoring
    ss_start_monitoring();
    
    // Report device heartbeat
    while (1) {
        ss_heartbeat();
        sleep(300); // Every 5 minutes
    }
    
    return 0;
}`}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {interfaces.map((iface) => (
                <div key={iface.id} className="bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-white/10">
                  <Code className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white">{iface.label}</h4>
                  <p className="text-xs text-gray-400">{iface.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Industry Comparison
            </h2>

            <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead className="bg-amber-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-white">Feature</th>
                    <th className="px-6 py-4 text-center text-amber-400 font-bold">SecureSphere</th>
                    <th className="px-6 py-4 text-center text-gray-400">Competitor A</th>
                    <th className="px-6 py-4 text-center text-gray-400">Competitor B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { feature: 'SDK Size', us: '<500KB', a: '2MB+', b: '1.5MB' },
                    { feature: 'AI/ML Threat Detection', us: '✓', a: '✗', b: 'Limited' },
                    { feature: 'Backdoor Sealing', us: '✓', a: '✗', b: '✗' },
                    { feature: 'Multi-Protocol Support', us: '5 Types', a: '2 Types', b: '3 Types' },
                    { feature: 'Real-time Monitoring', us: '✓', a: '✓', b: '✓' },
                    { feature: 'OEM White-Label', us: '✓', a: '✗', b: 'Extra Cost' },
                    { feature: 'Starting Price', us: '₹150/mo ($5)', a: '₹500/mo ($18)', b: '₹350/mo ($12)' },
                    { feature: 'Device Limit', us: 'Unlimited', a: '100', b: '500' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-gray-300">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={row.us === '✓' ? 'text-green-400 text-xl' : 'text-amber-400 font-bold'}>
                          {row.us}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={row.a === '✗' ? 'text-red-400 text-xl' : 'text-gray-400'}>
                          {row.a}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={row.b === '✗' ? 'text-red-400 text-xl' : 'text-gray-400'}>
                          {row.b}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Register for SDK Access</h2>
            
            <form onSubmit={handleRegistration} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={registrationForm.company_name}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, company_name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                    placeholder="Acme Electronics"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={registrationForm.contact_email}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, contact_email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                    placeholder="contact@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={registrationForm.contact_name}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, contact_name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Device Types</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {deviceTypes.map((device) => (
                    <label
                      key={device.id}
                      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition ${
                        registrationForm.device_types.includes(device.id)
                          ? 'bg-amber-500/20 border-amber-500'
                          : 'bg-gray-800 border-gray-700'
                      } border`}
                    >
                      <input
                        type="checkbox"
                        checked={registrationForm.device_types.includes(device.id)}
                        onChange={(e) => {
                          const types = e.target.checked
                            ? [...registrationForm.device_types, device.id]
                            : registrationForm.device_types.filter(t => t !== device.id);
                          setRegistrationForm({ ...registrationForm, device_types: types });
                        }}
                        className="sr-only"
                      />
                      <span className="text-xl">{device.icon}</span>
                      <span className="text-white text-sm">{device.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Estimated Devices</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={registrationForm.estimated_devices}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, estimated_devices: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Interface Type</label>
                  <select
                    value={registrationForm.interface_type}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, interface_type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                  >
                    {interfaces.map((iface) => (
                      <option key={iface.id} value={iface.id}>{iface.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowRegistration(false)}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {registrationResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-lg w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">Your OEM ID:</p>
              <p className="text-amber-400 font-mono text-lg">{registrationResult.oem_id}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">API Key (save this!):</p>
              <p className="text-green-400 font-mono text-sm break-all">{registrationResult.credentials?.api_key}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">Master License:</p>
              <p className="text-white font-mono">{registrationResult.credentials?.master_license}</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <p className="text-amber-300 text-sm">
                <strong>Next Steps:</strong> Complete payment or request free trial from Infuse admin to activate SDK download.
              </p>
            </div>

            <button
              onClick={() => setRegistrationResult(null)}
              className="w-full py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OEMSDKPortal;
