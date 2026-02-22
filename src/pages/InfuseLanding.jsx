import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Activity,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
  Globe,
  Users,
  Zap,
  Menu,
  X,
  BarChart3,
  Heart,
  Lock,
  Brain,
  Mail
} from 'lucide-react';
import { infuseProducts, companyStats } from '../infuse-mock';
import SEO from '../components/SEO';

const iconMap = {
  Activity,
  TrendingUp,
  Shield
};

const InfuseLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // JSON-LD Structured Data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Infuse-ai",
    "url": "https://www.infuse.net.in",
    "logo": process.env.REACT_APP_LOGO_URL,
    "description": "AI-Powered Enterprise SaaS Solutions for Healthcare and IoT Security",
    "sameAs": [
      "https://www.linkedin.com/company/infuse-ai"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["English"]
    },
    "offers": [
      {
        "@type": "Product",
        "name": "HealthTrack Pro",
        "description": "Enterprise health tracking platform combining Ayurvedic and allopathic practices"
      },
      {
        "@type": "Product",
        "name": "SecureSphere",
        "description": "Enterprise IT & IoT security with AI-powered threat detection"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <SEO
        title="AI-Powered Enterprise Healthcare & Security Solutions"
        description="Transform your business with Infuse-ai's integrated platform for Healthcare (HealthTrack Pro) and IoT Security (SecureSphere). Trusted by 730+ enterprises worldwide."
        keywords="Enterprise AI, SaaS, Healthcare Management, IoT Security, AI Solutions, Cybersecurity, Ayurvedic Healthcare, NetFlow Security, Health Tracking, Smart Security"
        canonical="https://www.infuse.net.in/"
        jsonLd={organizationSchema}
      />
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={process.env.REACT_APP_LOGO_URL} 
                alt="Infuse-ai Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Infuse-ai
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="text-gray-700 hover:text-orange-600 transition-colors">
                About Us
              </Link>
              <a href="#products" className="text-gray-700 hover:text-orange-600 transition-colors">
                Products
              </a>
              <a href="#leadership" className="text-gray-700 hover:text-orange-600 transition-colors">
                Leadership
              </a>
              <Link to="/downloads" className="text-gray-700 hover:text-orange-600 transition-colors">
                Downloads
              </Link>
              <Link to="/login">
                <Button variant="outline" className="mr-2">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <Link to="/about" className="block text-gray-700">
                About Us
              </Link>
              <a href="#products" className="block text-gray-700">
                Products
              </a>
              <a href="#leadership" className="block text-gray-700">
                Leadership
              </a>
              <Link to="/downloads" className="block text-gray-700">
                Downloads
              </Link>
              <div className="flex flex-col space-y-2">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-yellow-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1920&q=80" 
            alt="AI Technology Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/75"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left space-y-8">
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30">
                Enterprise Healthcare & Security Solutions
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Bridging Healthcare
                </span>
                <br />
                <span className="text-white">& Security with AI</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl">
                Transform your enterprise with our integrated AI-powered platform. 
                <strong className="text-orange-400"> HealthTrack Pro</strong> for comprehensive healthcare management and 
                <strong className="text-cyan-400"> SecureSphere</strong> for next-gen IoT security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white text-lg px-8 shadow-lg shadow-orange-500/25">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 text-lg px-8" onClick={() => window.location.href = 'mailto:info@infuse.net.in'}>
                  Contact Sales
                </Button>
              </div>
            </div>

            {/* Right Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-orange-400">{companyStats.totalClients}+</div>
                <div className="text-gray-300 mt-2">Enterprise Clients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-cyan-400">{companyStats.countries}+</div>
                <div className="text-gray-300 mt-2">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-yellow-400">99.8%</div>
                <div className="text-gray-300 mt-2">Uptime SLA</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-green-400">24/7</div>
                <div className="text-gray-300 mt-2">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
              Our Products
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900">
              Two Industry-Leading Platforms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade solutions that outperform the competition
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {infuseProducts.map((product) => {
              const IconComponent = iconMap[product.icon];
              return (
                <Card
                  key={product.id}
                  className="border-2 hover:border-orange-600 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-600/10 to-yellow-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <Badge variant="outline" className="w-fit mt-2">
                      {product.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">
                      {product.description}
                    </CardDescription>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{product.clients}</div>
                        <div className="text-xs text-gray-600">Active Users</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">99.9%</div>
                        <div className="text-xs text-gray-600">Success Rate</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-semibold">Trusted by {product.clients} users</span>
                    </div>
                    <Link to={product.id === 1 ? '/register' : '/register'}>
                      <Button className="w-full mt-4 group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-yellow-600">
                        Get Started
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Competitive Advantages Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
              Why Choose Infuse-ai
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900">
              Outperforming the Competition
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our solutions stack up against industry leaders
            </p>
          </div>

          {/* HealthTrack Pro Advantages */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-8 h-8 text-orange-600" />
              <h3 className="text-3xl font-bold text-gray-900">HealthTrack Pro</h3>
              <Badge className="bg-green-100 text-green-700">Better Than Today's Best</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                <CardHeader>
                  <CheckCircle2 className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Unified Health Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Complete health vault with family profiles. Industry leaders have 
                    fragmented records scattered across multiple providers.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                <CardHeader>
                  <CheckCircle2 className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Insurance Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    One-click claims with real-time verification. Others require 
                    lengthy manual claims processing and documentation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                <CardHeader>
                  <CheckCircle2 className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Affordable Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    <strong>₹99-₹299/month ($3-$10 USD)</strong> for unlimited access. Market leaders 
                    charge ₹200-₹1000 per consultation. Save up to 70%.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                <CardHeader>
                  <CheckCircle2 className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Corporate Wellness</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Complete employee wellness suite with analytics. Leading platforms 
                    lack comprehensive enterprise B2B solutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SecureIT+IoT Advantages */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-blue-600" />
              <h3 className="text-3xl font-bold text-gray-900">SecureIT+IoT Enterprise Shield</h3>
              <Badge className="bg-blue-100 text-blue-700">Beyond Industry Standards</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CheckCircle2 className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Unified IT & IoT</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Single platform for both IT infrastructure and IoT devices. 
                    Market leaders require separate, expensive solutions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CheckCircle2 className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">AI Threat Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Real-time AI-powered threat intelligence with 99.8% accuracy. 
                    Detects threats 3x faster than traditional security systems.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CheckCircle2 className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">GSM Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    NetFlow security for GSM networks and cellular IoT. 
                    Industry-unique feature not available in existing solutions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CheckCircle2 className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Telco-Grade Scale</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Enterprise telco infrastructure handling millions of devices. 
                    Built for massive scale from day one, not retrofitted.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>


      {/* About Us Section */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 mb-4">
                About Infuse-ai
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Pioneering Enterprise AI Solutions Since Inception
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  At Infuse-ai, we harness over <strong>100+ years of collective experience</strong> to deliver 
                  transformative AI-powered solutions for healthcare and cybersecurity. Our multi-disciplinary team 
                  brings together deep expertise in artificial intelligence, enterprise software architecture, and 
                  industry-specific innovation.
                </p>
                <p>
                  Founded by visionaries with decades of hands-on experience, Infuse-ai emerged from a singular 
                  mission: to democratize enterprise-grade AI capabilities for businesses of all sizes. We believe 
                  that cutting-edge technology should be accessible, intuitive, and purpose-built to solve real-world 
                  operational challenges.
                </p>
                <p>
                  Our two flagship platforms—<strong>HealthTrack Pro</strong> and <strong>SecureIT+IoT Enterprise Shield</strong>—represent 
                  the convergence of advanced machine learning, telco-grade infrastructure, and user-centric design. Each solution is 
                  engineered to not just meet industry standards, but to set new benchmarks for performance, security, and operational efficiency.
                </p>
                <p>
                  Today, we proudly serve <strong>730+ enterprise clients across 23 countries</strong>, processing 
                  petabytes of data daily while maintaining 99.99% uptime. Our commitment to innovation, security, 
                  and customer success drives everything we do.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <Link to="/about">
                  <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700">
                    Our Story
                  </Button>
                </Link>
                <Button variant="outline" asChild>
                  <a href="https://www.linkedin.com/company/infuse-ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Follow Us
                  </a>
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-10 h-10 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-gray-900">100+</div>
                      <div className="text-gray-600 mt-1">Years Collective Experience</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Globe className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-gray-900">730+</div>
                      <div className="text-gray-600 mt-1">Enterprise Clients Worldwide</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="w-10 h-10 text-green-600" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-gray-900">163%</div>
                      <div className="text-gray-600 mt-1">Average Growth Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
              Meet Our Leadership
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900">
              Visionary Leaders Driving Innovation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A world-class team with 74+ years of combined experience steering Infuse-ai toward a future of intelligent automation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* CEO - Rohini Koul */}
            <Card className="border-2 hover:shadow-xl transition-all group">
              <CardContent className="pt-8 text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Users className="w-16 h-16 text-purple-600" />
                  </div>
                  <div className="absolute bottom-0 right-1/2 translate-x-16 translate-y-2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      CEO
                    </Badge>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Rohini Koul</h3>
                <p className="text-purple-600 font-semibold mb-4">Chief Executive Officer</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  With <strong>20 years of distinguished experience in Academia</strong>, Rohini provides the visionary leadership 
                  that drives Infuse-ai's mission to make technology accessible across diverse populations. Her commitment to 
                  bridging the digital divide ensures that cutting-edge AI solutions reach underserved communities while maintaining 
                  the highest standards of security in the era of deepfakes and misinformation.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Under her leadership, Infuse-ai is pioneering efforts to make healthcare a priority across all social strata 
                  globally, democratizing access to enterprise-grade technology solutions that were previously available only to 
                  large corporations.
                </p>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 font-medium">EDUCATION</p>
                  <p className="text-sm text-gray-700">MSc Chemistry | Graduate Studies</p>
                </div>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.linkedin.com/in/rohini-koul" target="_blank" rel="noopener noreferrer">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chief Growth Officer */}
            <Card className="border-2 hover:shadow-xl transition-all group">
              <CardContent className="pt-8 text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-16 h-16 text-orange-600" />
                  </div>
                  <div className="absolute bottom-0 right-1/2 translate-x-16 translate-y-2">
                    <Badge className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white">
                      Founder
                    </Badge>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chief Growth Officer</h3>
                <p className="text-orange-600 font-semibold mb-4">Culture & Business</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  A seasoned executive with <strong>30 years of distinguished experience in technology</strong>, driving 
                  organizational culture and business transformation across global enterprises. His strategic vision has 
                  been instrumental in scaling multiple technology ventures from inception to market leadership, establishing 
                  best practices in enterprise software delivery and customer success.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  As the driving force behind Infuse-ai's growth strategy, he brings unparalleled expertise in market 
                  expansion, strategic partnerships, and building high-performance teams that deliver exceptional results 
                  in competitive markets.
                </p>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 font-medium">EDUCATION</p>
                  <p className="text-sm text-gray-700">B.E. (Engineering), BIT | MBA, University of Arizona</p>
                </div>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chief Technology Officer */}
            <Card className="border-2 hover:shadow-xl transition-all group">
              <CardContent className="pt-8 text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Brain className="w-16 h-16 text-cyan-600" />
                  </div>
                  <div className="absolute bottom-0 right-1/2 translate-x-16 translate-y-2">
                    <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                      CTO
                    </Badge>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chief Technology Officer</h3>
                <p className="text-cyan-600 font-semibold mb-4">Technology & Innovation</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  With <strong>24 years of hands-on experience</strong> developing and leading enterprise SaaS and PaaS 
                  products, our CTO has been at the forefront of solving real-world problems through technology innovation. 
                  His technical leadership has resulted in platforms that process petabytes of data daily while maintaining 
                  99.99% uptime.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Under his technical stewardship, Infuse-ai has built a robust, scalable architecture that powers both 
                  HealthTrack Pro and SecureSphere, enabling enterprises worldwide to leverage AI-powered solutions with 
                  enterprise-grade reliability and security.
                </p>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 font-medium">EDUCATION</p>
                  <p className="text-sm text-gray-700">B.E. (Engineering), BIT | MBA, University of Pennsylvania</p>
                </div>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Join our world-class team</p>
            <Link to="/careers">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                View Open Positions
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              Platform Features
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900">Why Choose Infuse-ai?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <Brain className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>AI-First Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Every product is powered by advanced AI and machine learning for intelligent automation
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Globe className="w-12 h-12 text-yellow-600 mb-4" />
                <CardTitle>Global Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Deployed across 23+ countries with multi-region support and localization
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Lock className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Bank-grade encryption, compliance certifications, and privacy-first architecture
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Zap className="w-12 h-12 text-yellow-600 mb-4" />
                <CardTitle>Real-time Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Process millions of data points in real-time with sub-second latency
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Users className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Dedicated support team available round the clock across all time zones
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-yellow-600 mb-4" />
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Deep insights and predictive analytics to drive data-driven decisions
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Client Apps Download Section */}
      <section id="downloads" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
              Client Applications
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900">
              Download Enterprise Client Apps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desktop and mobile applications for seamless access to all three platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* HealthTrack Pro Client */}
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">HealthTrack Pro Client</CardTitle>
                <CardDescription>
                  Secure healthcare management application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Desktop Applications</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                      </svg>
                      Windows (.exe)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.67 3.955l.52.07c.058.082.047.165 0 .247v15.466c.02.083.037.166 0 .25l-.52.07-9.45-8.05zm-4.5-.006c.037-.001.073.002.11.002.015 0 .03-.002.046-.002h3.66c.075.008.14.041.21.08l-3.625 3.607zm0 15.993l3.625 3.606c-.069.039-.134.072-.21.08h-3.66l-.046-.002c-.036 0-.072.003-.11.002zM8.417 5.667l9.45 2.13-4.5 4.5zm9.45 10.536l-9.45 2.13 4.5-4.5z"/>
                      </svg>
                      macOS (.dmg)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.415 1.721-.415 2.642 0 1.173.242 2.339.726 3.448.484 1.109 1.155 2.107 2.01 2.96.854.854 1.852 1.526 2.96 2.01 1.109.484 2.275.726 3.448.726s2.339-.242 3.448-.726c1.109-.484 2.107-1.156 2.96-2.01.854-.853 1.526-1.851 2.01-2.96.484-1.109.726-2.275.726-3.448 0-.921-.137-1.802-.415-2.642-.589-1.771-1.831-3.47-2.716-4.521-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021z"/>
                      </svg>
                      Linux (.deb/.rpm)
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Mobile Applications</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      iOS App Store
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                      </svg>
                      Google Play
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SecureIoT Shield Client */}
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">SecureIT+IoT Enterprise Shield Client</CardTitle>
                <CardDescription>
                  Unified IT & IoT security monitoring with automated enforcement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Desktop Applications</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                      </svg>
                      Windows (.exe)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.67 3.955l.52.07c.058.082.047.165 0 .247v15.466c.02.083.037.166 0 .25l-.52.07-9.45-8.05zm-4.5-.006c.037-.001.073.002.11.002.015 0 .03-.002.046-.002h3.66c.075.008.14.041.21.08l-3.625 3.607zm0 15.993l3.625 3.606c-.069.039-.134.072-.21.08h-3.66l-.046-.002c-.036 0-.072.003-.11.002zM8.417 5.667l9.45 2.13-4.5 4.5zm9.45 10.536l-9.45 2.13 4.5-4.5z"/>
                      </svg>
                      macOS (.dmg)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.415 1.721-.415 2.642 0 1.173.242 2.339.726 3.448.484 1.109 1.155 2.107 2.01 2.96.854.854 1.852 1.526 2.96 2.01 1.109.484 2.275.726 3.448.726s2.339-.242 3.448-.726c1.109-.484 2.107-1.156 2.96-2.01.854-.853 1.526-1.851 2.01-2.96.484-1.109.726-2.275.726-3.448 0-.921-.137-1.802-.415-2.642-.589-1.771-1.831-3.47-2.716-4.521-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021z"/>
                      </svg>
                      Linux (.deb/.rpm)
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Network Appliances</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-5 h-5 mr-2" />
                      Virtual Appliance (OVA)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-5 h-5 mr-2" />
                      Docker Container
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link to="/downloads">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-lg px-12 py-6">
                View All Downloads & Installation Guide
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Need Help Installing?
                    </h3>
                    <p className="text-gray-600">
                      Our support team is available 24/7 to assist with installation and setup
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      Documentation
                    </Button>
                    <a href="mailto:info@infuse.net.in">
                      <Button className="bg-gradient-to-r from-orange-600 to-yellow-600">
                        Contact Support
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-yellow-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-orange-100">
            Join 890+ enterprises already using Infuse-ai to accelerate their digital transformation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-8">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={process.env.REACT_APP_LOGO_URL} 
                  alt="Infuse-ai Logo" 
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold">Infuse-ai</span>
              </div>
              <p className="text-gray-400">
                Enterprise SaaS & PaaS solutions powered by AI
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/health" className="hover:text-white">HealthTrack Pro</Link></li>
                <li><Link to="/security" className="hover:text-white">SecureIT+IoT Shield</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 Infuse-ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InfuseLanding;