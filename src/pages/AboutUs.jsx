import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Heart, Shield, Users, Target, Eye, Zap, Globe, 
  TrendingUp, CheckCircle, ArrowRight, Building, MapPin
} from 'lucide-react';
import SEO from '../components/SEO';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="About Infuse-AI - Bringing Quality Healthcare & Security to Last-Mile Communities"
        description="Infuse-AI combines AI, secure cloud infrastructure, and connected devices to make quality healthcare accessible to underserved communities while building AI-driven security for enterprises."
        keywords="digital health, healthcare AI, last-mile healthcare, Ayushman Bharat, health security, ABDM, telemedicine India"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-white/20 text-white mb-4">Our Story</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Making Quality Healthcare & Security Accessible to All
            </h1>
            <p className="text-xl text-orange-100 max-w-4xl mx-auto">
              A healthcare-focused AI and security company bringing quality care and strong data protection 
              to the last mile of society in India and emerging markets
            </p>
          </div>
        </div>
      </div>

      {/* Main Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <Badge className="bg-orange-100 text-orange-700 mb-4">About Infuse-AI</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Passionate Technology Enthusiasts on a Mission
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Infuse-AI is a team of passionate technology enthusiasts on a mission to make quality healthcare 
              accessible to every citizen, especially in underserved and last-mile communities.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              By combining <span className="font-semibold text-orange-600">AI</span>, 
              <span className="font-semibold text-orange-600"> secure cloud infrastructure</span>, and 
              <span className="font-semibold text-orange-600"> connected devices</span>, Infuse-AI helps 
              healthcare providers, digital health platforms, and public programs deliver timely, 
              data-driven care at scale.
            </p>
            <p className="text-lg text-gray-600">
              Our solutions align with national digital health initiatives such as India's 
              <span className="font-semibold text-blue-600"> Ayushman Bharat Digital Mission (ABDM)</span>, 
              building an integrated digital health ecosystem with strong standards for interoperability, 
              privacy, and data security.
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900">734+</div>
                <div className="text-sm text-gray-600">Healthcare Partners</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900">23+</div>
                <div className="text-sm text-gray-600">States Covered</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900">1M+</div>
                <div className="text-sm text-gray-600">Lives Touched</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900">99.8%</div>
                <div className="text-sm text-gray-600">Security Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg text-gray-700">
                To become the <span className="font-semibold text-orange-600">trusted AI backbone</span> for 
                inclusive, secure, and connected healthcare that reaches every last-mile citizen while setting 
                new benchmarks for security across industries.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Reach the Last Mile</p>
                    <p className="text-sm text-gray-600">Fill the critical healthcare gap by delivering affordable and accessible quality care to the "last mile" of humanity in every region we operate.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Bridge Traditions</p>
                    <p className="text-sm text-gray-600">Connect Allopathic and Ayurvedic healthcare under one platform.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">AI Empowerment</p>
                    <p className="text-sm text-gray-600">Offer AI-powered health insights from labs & wearables.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Total Privacy</p>
                    <p className="text-sm text-gray-600">Ensure user-controlled OTP-based access.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Trusted Network</p>
                    <p className="text-sm text-gray-600">Feature verified doctor profiles and genuine reviews.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What We Do */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-700 mb-4">What We Do</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transforming Healthcare & Security with AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three pillars powering inclusive care and enterprise-grade security
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>AI-Powered Healthcare Connectivity</CardTitle>
                <CardDescription>Closing the urban–rural care gap</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Integrate clinics, diagnostics, teleconsultation, and remote monitoring to deliver 
                  quality care to underserved communities.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Last-mile telemedicine connectivity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Remote patient monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Digital diagnostics integration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Digital Health Data Platforms</CardTitle>
                <CardDescription>ABDM-aligned interoperability</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Enable secure, standards-based health records supporting continuity of care and 
                  data-driven decision-making.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Consent-based data sharing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Unified patient identity (ABHA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Standards-based interoperability</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>AI-Driven Security</CardTitle>
                <CardDescription>Cross-vertical protection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Monitoring, threat detection, and policy enforcement for AI and SaaS applications 
                  across regulated industries.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time threat detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Compliance & governance (HIPAA, GDPR)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>IoT & automotive security</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Who We Serve */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-12 mb-20">
          <div className="text-center mb-12">
            <Badge className="bg-orange-600 text-white mb-4">Who We Serve</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Partners in Digital Transformation
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Healthcare Providers</h3>
              <p className="text-gray-600">
                Hospitals, clinics, and diagnostic networks scaling digital health and telemedicine
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Health-Tech Platforms</h3>
              <p className="text-gray-600">
                ABDM-aligned digital health platforms looking for secure AI infrastructure
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Regulated Enterprises</h3>
              <p className="text-gray-600">
                Finance, insurance, and SaaS companies needing to govern AI and protect data
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Join Us in Transforming Healthcare & Security
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            If you share our passion for inclusive healthcare and secure AI, we welcome collaborations 
            with healthcare providers, ecosystem partners, and innovators building the next generation 
            of digital health and security solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="mailto:info@infuse.net.in">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                Partner With Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
