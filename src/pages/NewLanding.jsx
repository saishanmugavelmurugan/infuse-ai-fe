import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSelector';
import { InfuseLogo } from '../components/InfuseLogo';
import { 
  Heart, Shield, Activity, TrendingUp, Users, Globe, 
  Lock, CheckCircle, ArrowRight, Menu, X, Target, 
  Lightbulb, Award, Zap, Cloud, Database, ChevronRight,
  Mail, Linkedin, Brain, Cpu, Radio, Building2, Smartphone,
  BarChart3, Server, Network, Car, Wifi
} from 'lucide-react';

const NewLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '50M+', label: 'Devices Secured' },
    { value: '500+', label: 'Enterprise Clients' },
    { value: '99.9%', label: 'Platform Uptime' },
    { value: '25+', label: 'Countries' }
  ];

  const industries = [
    { icon: Heart, name: 'Healthcare', color: 'from-rose-500 to-pink-600' },
    { icon: Radio, name: 'Telecom', color: 'from-indigo-500 to-purple-600' },
    { icon: Car, name: 'Automotive', color: 'from-cyan-500 to-blue-600' },
    { icon: Building2, name: 'Enterprise', color: 'from-emerald-500 to-teal-600' },
    { icon: Wifi, name: 'Smart Cities', color: 'from-amber-500 to-orange-600' },
    { icon: Server, name: 'Manufacturing', color: 'from-slate-500 to-gray-600' }
  ];

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link to="/" className="flex items-center space-x-2">
              <InfuseLogo size={40} darkMode={!scrolled} />
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              <a href="#products" className={`font-medium hover:text-orange-500 transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                Products
              </a>
              <a href="#solutions" className={`font-medium hover:text-orange-500 transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                Solutions
              </a>
              <a href="#about" className={`font-medium hover:text-orange-500 transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                About
              </a>
              <a href="#leadership" className={`font-medium hover:text-orange-500 transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                Leadership
              </a>
              <Link to="/careers" className={`font-medium hover:text-orange-500 transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                Careers
              </Link>
              <LanguageSwitcher darkMode={!scrolled} />
              <Link 
                to="/login" 
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-orange-500/25 transition-all"
              >
                Sign In
              </Link>
            </div>

            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className={scrolled ? 'text-gray-900' : 'text-white'} size={24} />
              ) : (
                <Menu className={scrolled ? 'text-gray-900' : 'text-white'} size={24} />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-xl">
            <div className="px-4 py-6 space-y-4">
              <a href="#products" className="block text-gray-700 font-medium py-2">Products</a>
              <a href="#solutions" className="block text-gray-700 font-medium py-2">Solutions</a>
              <a href="#about" className="block text-gray-700 font-medium py-2">About</a>
              <a href="#leadership" className="block text-gray-700 font-medium py-2">Leadership</a>
              <Link to="/careers" className="block text-gray-700 font-medium py-2">Careers</Link>
              <div className="py-2"><LanguageSwitcher /></div>
              <Link to="/login" className="block px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-center font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Modern Enterprise Style */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1644325349124-d1756b79dd42?auto=format&fit=crop&w=1920&q=80" 
            alt="Digital Innovation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-orange-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(251,146,60,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Enterprise Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20 text-white/90 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Enterprise-Grade Platform • SOC 2 Compliant • HIPAA Ready
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Powering the Future of
              <span className="block mt-2 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Healthcare & IoT Security
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Infuse delivers enterprise SaaS solutions that transform healthcare delivery and secure connected ecosystems across industries worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a 
                href="#products"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Explore Our Products
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#solutions"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 border border-white/20 transition flex items-center justify-center gap-2"
              >
                View Solutions
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Our Products
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Two Platforms. Infinite Possibilities.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built solutions for healthcare transformation and IoT security that scale with your enterprise needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* HealthTrack Pro Card */}
            <div className="group relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 lg:p-10 border border-orange-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">HealthTrack Pro</h3>
                    <p className="text-orange-600 font-medium">Healthcare Management Platform</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  AI-powered healthcare platform enabling providers to deliver personalized patient care, streamline operations, and achieve better outcomes through intelligent insights.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Brain, text: 'AI Diagnostics' },
                    { icon: Activity, text: 'Vitals Monitoring' },
                    { icon: Users, text: 'Patient Portal' },
                    { icon: Smartphone, text: 'Telemedicine' }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                      <feature.icon className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Link 
                    to="/healthtrack"
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/login/health" className="text-orange-600 font-semibold hover:text-orange-700 transition">
                    Access Platform →
                  </Link>
                </div>
              </div>
            </div>

            {/* SecureSphere Card */}
            <div className="group relative bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl p-8 lg:p-10 border border-slate-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">SecureSphere</h3>
                    <p className="text-indigo-600 font-medium">IoT & Cybersecurity Platform</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  Enterprise-grade IoT security platform protecting connected ecosystems across telecom, automotive, smart cities, and industrial environments with AI-driven threat intelligence.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Radio, text: 'Telecom Security' },
                    { icon: Car, text: 'Automotive IoT' },
                    { icon: Network, text: 'Network Protection' },
                    { icon: Cpu, text: 'Edge Security' }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                      <feature.icon className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Link 
                    to="/securesphere-landing"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/login/security" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                    Access Platform →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / Industries Section */}
      <section id="solutions" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-white/80 text-sm font-medium mb-4">
              <Globe className="w-4 h-4" />
              Industry Solutions
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Trusted Across Industries
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              From healthcare providers to telecom operators, our platforms power digital transformation at scale.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry, idx) => (
              <div 
                key={idx}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center"
              >
                <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${industry.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <industry.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-white">{industry.name}</h3>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <Cloud className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Cloud-Native Architecture</h3>
              <p className="text-gray-400">Scalable infrastructure that grows with your business. Deploy on-premises, cloud, or hybrid environments.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <Lock className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-gray-400">SOC 2 Type II certified. HIPAA compliant. Zero-trust architecture with end-to-end encryption.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <Database className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Data Sovereignty</h3>
              <p className="text-gray-400">Keep your data where it needs to be. Regional deployment options ensure compliance with local regulations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 text-sm font-medium mb-6">
                About Infuse
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Building Technology That <span className="text-orange-500">Transforms Lives</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Infuse was founded with a singular vision: to bridge the gap between cutting-edge technology and real-world impact. We believe that healthcare should be accessible to every citizen, and that connected devices should be secure by design.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Today, our platforms serve millions of users across 25+ countries, from rural health clinics to Fortune 500 enterprises. We&apos;re not just building software—we&apos;re building a more connected, secure, and healthy world.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600 mb-1">2019</div>
                  <div className="text-gray-600 text-sm">Founded</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl">
                  <div className="text-3xl font-bold text-amber-600 mb-1">200+</div>
                  <div className="text-gray-600 text-sm">Team Members</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1573285750682-05689540dfbc?auto=format&fit=crop&w=800&q=80" 
                alt="Modern Technology Workspace"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-8 h-8 text-orange-500" />
                  <span className="font-bold text-gray-900">Industry Recognition</span>
                </div>
                <p className="text-gray-600 text-sm">Named a Leader in Healthcare IT and IoT Security by leading analyst firms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="mission" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be the global leader in enterprise platforms that make healthcare accessible to every citizen and IoT ecosystems secure by default—creating a world where technology serves humanity&apos;s greatest needs.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Democratize healthcare through AI-powered solutions that reach every last mile.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Secure the connected world with intelligent threat protection at scale.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Empower enterprises with interoperable, compliant, and future-ready platforms.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Leadership
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experienced leaders from healthcare, technology, and cybersecurity driving our vision forward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Dr. Rajesh Kumar', role: 'CEO & Co-Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', bg: 'from-orange-500 to-amber-500' },
              { name: 'Priya Sharma', role: 'CTO & Co-Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face', bg: 'from-indigo-500 to-purple-500' },
              { name: 'Michael Chen', role: 'Chief Security Officer', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', bg: 'from-emerald-500 to-teal-500' }
            ].map((leader, idx) => (
              <div key={idx} className="group text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${leader.bg} rounded-2xl rotate-6 group-hover:rotate-12 transition-transform`}></div>
                  <img 
                    src={leader.image}
                    alt={leader.name}
                    className="relative w-full h-full object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{leader.name}</h3>
                <p className="text-gray-600">{leader.role}</p>
                <div className="flex justify-center gap-3 mt-4">
                  <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-orange-100 transition">
                    <Linkedin className="w-5 h-5 text-gray-600 hover:text-orange-500" />
                  </a>
                  <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-orange-100 transition">
                    <Mail className="w-5 h-5 text-gray-600 hover:text-orange-500" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Enterprise?
          </h2>
          <p className="text-lg text-orange-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of organizations already using Infuse to deliver better healthcare outcomes and secure their connected ecosystems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:shadow-2xl transition flex items-center justify-center gap-2"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="mailto:contact@infuse.ai"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 border border-white/30 transition flex items-center justify-center gap-2"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <InfuseLogo size={36} darkMode={true} />
              <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                Enterprise platforms for healthcare and IoT security. Transforming how organizations deliver care and secure connected ecosystems.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/healthtrack" className="hover:text-orange-400 transition">HealthTrack Pro</Link></li>
                <li><Link to="/securesphere-landing" className="hover:text-orange-400 transition">SecureSphere</Link></li>
                <li><Link to="/login" className="hover:text-orange-400 transition">Platform Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#about" className="hover:text-orange-400 transition">About Us</a></li>
                <li><a href="#leadership" className="hover:text-orange-400 transition">Leadership</a></li>
                <li><Link to="/careers" className="hover:text-orange-400 transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li>contact@infuse.ai</li>
                <li>+1 (555) 123-4567</li>
                <li>San Francisco, CA</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Infuse Technologies. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-gray-500 text-sm">
              <a href="#" className="hover:text-orange-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-orange-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-orange-400 transition">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLanding;
