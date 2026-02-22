import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Shield, Lock, Wifi, Car, Radio, Server, Globe,
  CheckCircle, ArrowRight, Star, Smartphone, Eye,
  AlertTriangle, BarChart3, Zap, Users, Phone
} from 'lucide-react';

const SecureSphereLanding = () => {
  const features = [
    {
      icon: Globe,
      title: 'URL & Phishing Scanner',
      description: 'Real-time detection of malicious URLs, phishing attempts, and unsafe websites.'
    },
    {
      icon: Smartphone,
      title: 'SMS Fraud Detection',
      description: 'AI-powered analysis of SMS messages to identify scams and fraudulent content.'
    },
    {
      icon: AlertTriangle,
      title: 'Threat Scoring',
      description: 'Comprehensive risk assessment with actionable threat intelligence.'
    },
    {
      icon: Server,
      title: 'Device Registry',
      description: 'Complete inventory and security management for all connected devices.'
    },
    {
      icon: Wifi,
      title: 'IoT Security',
      description: 'Protect smart home devices, industrial IoT, and edge computing systems.'
    },
    {
      icon: Car,
      title: 'Automotive Security',
      description: 'Connected vehicle protection with CAN bus monitoring and ECU scanning.'
    },
    {
      icon: Radio,
      title: 'GSM Fraud Detection',
      description: 'Identify SIM swap attacks, caller ID spoofing, and telecom fraud.'
    },
    {
      icon: BarChart3,
      title: 'Security Analytics',
      description: 'Deep insights into security posture with customizable dashboards and reports.'
    }
  ];

  const tiers = [
    {
      name: 'Consumer',
      tagline: 'Mobile Protection',
      priceINR: '₹299',
      priceUSD: '$10',
      period: '/month',
      description: 'Personal device security for individuals and families.',
      features: ['URL Scanner', 'SMS Analyzer', 'Up to 5 devices', 'Mobile app', 'Email support'],
      color: 'blue'
    },
    {
      name: 'Enterprise',
      tagline: 'Fleet Management',
      priceINR: '₹9,999',
      priceUSD: '$350',
      period: '/month',
      description: 'Comprehensive security for business networks.',
      features: ['All Consumer features', 'Unlimited devices', 'IoT Security', 'Threat Intelligence', 'API Access', 'Priority support'],
      color: 'orange',
      popular: true
    },
    {
      name: 'Telecom (CSP)',
      tagline: 'Network Integration',
      priceINR: 'Custom',
      priceUSD: 'Custom',
      period: '',
      description: 'Deep integration for telecom service providers.',
      features: ['All Enterprise features', 'GSM Fraud Detection', 'vRAN Integration', 'Bulk API', 'White-label option', 'Dedicated support'],
      color: 'purple'
    },
    {
      name: 'Automotive',
      tagline: 'Connected Vehicles',
      priceINR: 'Custom',
      priceUSD: 'Custom',
      period: '',
      description: 'Protection for connected and autonomous vehicles.',
      features: ['All Enterprise features', 'CAN Bus Monitoring', 'ECU Scanning', 'V2X Security', 'OTA Protection', '24/7 SOC'],
      color: 'green'
    }
  ];

  const stats = [
    { value: '10B+', label: 'Threats Blocked' },
    { value: '50M+', label: 'Devices Protected' },
    { value: '99.99%', label: 'Detection Rate' },
    { value: '<10ms', label: 'Response Time' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* SEO */}
      <SEO 
        title="SecureSphere - Enterprise IoT & Network Security"
        description="Comprehensive security for IoT devices, connected vehicles, and enterprise networks. URL scanning, SMS fraud detection, 5G/IoT compliance, and threat intelligence. Starting at ₹299/month ($10 USD)."
        keywords="IoT security, network security, cybersecurity, URL scanner, phishing detection, SMS fraud detection, 5G security, connected vehicle security, enterprise security, threat detection"
        canonical="https://www.infuse.net.in/securesphere-home"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "SecureSphere",
          "applicationCategory": "SecurityApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "299",
            "priceCurrency": "INR"
          }
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SecureSphere</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#tiers" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <Link to="/login/security" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link 
              to="/register/security"
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm mb-6">
                <Lock className="w-4 h-4" />
                Enterprise-Grade Security
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Protect Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400"> Digital World</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                SecureSphere delivers advanced threat protection for devices, networks, 
                and connected systems. From consumer mobile protection to enterprise 
                IoT security and automotive systems—we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register/security"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                >
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/login/security"
                  className="px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-gray-500 flex items-center justify-center"
                >
                  Login to Dashboard
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl opacity-20 blur-3xl"></div>
              <div className="relative bg-gray-800/80 rounded-3xl p-8 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-orange-400" />
                    <span className="text-white font-semibold">Security Status</span>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Protected</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">847</div>
                    <div className="text-gray-400 text-sm">Threats Blocked Today</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">12</div>
                    <div className="text-gray-400 text-sm">Devices Protected</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Security Score</span>
                    <span className="text-green-400">98/100</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-[98%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Security Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From URL scanning to automotive security, SecureSphere provides multi-layered 
              protection for the modern connected world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                  <feature.icon className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How SecureSphere Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Devices</h3>
              <p className="text-gray-600">Register your devices, networks, or integrate via API in minutes.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Monitors Threats</h3>
              <p className="text-gray-600">Our AI continuously scans for threats, vulnerabilities, and suspicious activity.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Stay Protected</h3>
              <p className="text-gray-600">Get instant alerts, automated responses, and detailed security reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="tiers" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Protection Level</h2>
            <p className="text-xl text-gray-600">From individual consumers to enterprise networks, we have the right solution.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl p-6 ${
                  tier.popular 
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white scale-105 shadow-xl' 
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-1 ${tier.popular ? 'text-white' : 'text-gray-900'}`}>{tier.name}</h3>
                <p className={`text-sm mb-4 ${tier.popular ? 'text-white/80' : 'text-gray-500'}`}>{tier.tagline}</p>
                <div className="mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${tier.popular ? 'text-white' : 'text-gray-900'}`}>{tier.priceINR}</span>
                      <span className={tier.popular ? 'text-white/80' : 'text-gray-600'}>{tier.period}</span>
                    </div>
                    {tier.priceUSD !== 'Custom' && (
                      <span className={`text-sm mt-1 ${tier.popular ? 'text-white/70' : 'text-gray-500'}`}>
                        {tier.priceUSD} USD{tier.period}
                      </span>
                    )}
                  </div>
                </div>
                <p className={`text-sm mb-6 ${tier.popular ? 'text-white/80' : 'text-gray-600'}`}>{tier.description}</p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 ${tier.popular ? 'text-white' : 'text-green-500'}`} />
                      <span className={tier.popular ? 'text-white' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register/security"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm ${
                    tier.popular 
                      ? 'bg-white text-orange-500 hover:bg-gray-100' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {tier.priceINR === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-orange-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Digital Infrastructure?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of organizations protecting their assets with SecureSphere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register/security"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:opacity-90"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/login/security"
              className="px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-gray-500"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SecureSphere</span>
          </Link>
          <p className="mb-4">A product of Infuse-AI</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/" className="hover:text-white">Back to Infuse-AI</Link>
          </div>
          <p className="mt-8 text-sm">© {new Date().getFullYear()} Infuse-AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SecureSphereLanding;
