/**
 * Compliance Page - HealthTrack Pro
 * Displays compliance certifications and allows PDF download
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Download, CheckCircle, Globe, Lock, FileText,
  ArrowLeft, ExternalLink, Award, Server, Key, Eye,
  Clock, Users, Database, AlertTriangle, ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const CompliancePage = () => {
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/compliance/summary`);
      if (response.ok) {
        const data = await response.json();
        setComplianceData(data);
      }
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    // Direct download using window.open for better browser compatibility
    const downloadUrl = `${API_URL}/api/compliance/pdf`;
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Infuse_HealthTrack_Pro_Compliance_2026.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset downloading state after a short delay
    setTimeout(() => setDownloading(false), 1000);
  };

  const complianceFrameworks = [
    {
      name: 'SOC 2 Type II',
      certId: 'soc2',
      region: 'Global',
      status: 'In Progress',
      icon: Server,
      color: 'bg-indigo-500',
      description: 'Service Organization Control for security, availability, and confidentiality'
    },
    {
      name: 'HIPAA',
      certId: 'hipaa',
      region: 'USA',
      status: 'In Progress',
      icon: Shield,
      color: 'bg-cyan-500',
      description: 'Health Insurance Portability and Accountability Act compliance for PHI protection'
    },
    {
      name: 'GDPR',
      certId: 'gdpr',
      region: 'Europe',
      status: 'In Progress',
      icon: Globe,
      color: 'bg-purple-500',
      description: 'General Data Protection Regulation for EU data subjects'
    },
    {
      name: 'ISO 27001:2022',
      certId: 'iso27001',
      region: 'Global',
      status: 'In Progress',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      description: 'Information Security Management System certification'
    },
    {
      name: 'DPDP Act 2023',
      certId: 'dpdp',
      region: 'India',
      status: 'In Progress',
      icon: Lock,
      color: 'bg-orange-500',
      description: 'Digital Personal Data Protection Act for Indian data principals'
    },
    {
      name: 'ABDM',
      certId: 'abdm',
      region: 'India',
      status: 'In Progress',
      icon: Award,
      color: 'bg-red-500',
      description: 'Ayushman Bharat Digital Mission integration for health data exchange'
    },
    {
      name: 'HL7 FHIR R4',
      certId: 'hl7fhir',
      region: 'Global',
      status: 'In Progress',
      icon: Database,
      color: 'bg-pink-500',
      description: 'Fast Healthcare Interoperability Resources R4 standard'
    },
    {
      name: 'Zero Trust',
      certId: 'zerotrust',
      region: 'Global',
      status: 'Implemented',
      icon: Key,
      color: 'bg-gray-700',
      description: 'Zero Trust Architecture - Never trust, always verify'
    }
  ];

  const securityFeatures = [
    { name: 'AES-256 Encryption', description: 'End-to-end encryption for all health data at rest', icon: Key },
    { name: 'TLS 1.3', description: 'Latest transport layer security for data in transit', icon: Lock },
    { name: 'Zero Trust Architecture', description: 'Every access request verified and authorized', icon: Shield },
    { name: 'Role-Based Access', description: 'Granular permissions ensure only authorized access', icon: Users },
    { name: '24/7 Monitoring', description: 'Continuous security monitoring and threat detection', icon: Eye },
    { name: 'Audit Logging', description: 'Immutable logs of all data access and modifications', icon: FileText }
  ];

  const patientRights = [
    { right: 'Right to Access', description: 'View and export all your health data' },
    { right: 'Right to Rectification', description: 'Correct any inaccurate personal data' },
    { right: 'Right to Erasure', description: 'Request deletion of your data' },
    { right: 'Right to Portability', description: 'Export data in standard formats (FHIR, PDF)' },
    { right: 'Right to Restrict', description: 'Limit how your data is processed' },
    { right: 'Right to Withdraw Consent', description: 'Withdraw consent at any time' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-[#E55A00] transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Button 
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-gradient-to-r from-[#FF9A3B] to-[#E55A00] hover:from-[#E55A00] hover:to-[#C64700] text-white"
              data-testid="download-compliance-pdf"
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF9A3B] to-[#E55A00] py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Compliance Roadmap</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Path to Compliance
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            HealthTrack Pro is actively working toward the highest standards of healthcare data protection. 
            We are committed to achieving compliance with global regulations to ensure your health information is secure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
              Working toward SOC 2 Type II
            </div>
            <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
              Working toward HIPAA
            </div>
            <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
              Working toward GDPR
            </div>
            <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
              Working toward ISO 27001
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Frameworks */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compliance Goals & Roadmap
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are actively working toward compliance with healthcare data regulations across multiple jurisdictions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceFrameworks.map((framework, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-t-4" style={{borderTopColor: framework.color.includes('indigo') ? '#4F46E5' : framework.color.includes('cyan') ? '#0891B2' : framework.color.includes('purple') ? '#7C3AED' : framework.color.includes('emerald') ? '#059669' : framework.color.includes('orange') ? '#EA580C' : framework.color.includes('red') ? '#DC2626' : framework.color.includes('pink') ? '#DB2777' : '#1F2937'}}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${framework.color}`}>
                      <framework.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      framework.status === 'Implemented' ? 'bg-green-100 text-green-700' :
                      framework.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {framework.status}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-3">{framework.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {framework.region}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{framework.description}</p>
                  <a 
                    href={`${API_URL}/api/certificates/${framework.certId}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#E55A00] hover:text-[#C64700] transition"
                    data-testid={`download-cert-${framework.certId}`}
                  >
                    <Download className="w-4 h-4" />
                    View Roadmap PDF
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How We Protect Your Data
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Industry-leading security measures to ensure your health information is always protected
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF9A3B] to-[#E55A00] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Rights */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Rights & Consent
              </h2>
              <p className="text-gray-600 mb-8">
                HealthTrack Pro respects your data rights. You have complete control over your health information 
                with OTP-based access control ensuring only authorized access.
              </p>
              
              <div className="space-y-4">
                {patientRights.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.right}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-2xl p-8 border border-[#FF9A3B]/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">OTP-Based Doctor Access</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#E55A00] rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <p className="font-medium text-gray-900">Doctor Requests Access</p>
                    <p className="text-sm text-gray-600">Doctor initiates access request</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#E55A00] rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <p className="font-medium text-gray-900">You Receive OTP</p>
                    <p className="text-sm text-gray-600">6-digit OTP sent to your mobile</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#E55A00] rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <p className="font-medium text-gray-900">Share When Ready</p>
                    <p className="text-sm text-gray-600">Share OTP only when you approve</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">One-Time Access</p>
                    <p className="text-sm text-gray-600">Access expires after session ends</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Status */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Certification Roadmap
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our planned timeline for achieving third-party certifications
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#FF9A3B] to-[#E55A00] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Certification</th>
                  <th className="px-6 py-4 text-left font-semibold">Certifying Body</th>
                  <th className="px-6 py-4 text-center font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Target Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">ISO 27001:2022</td>
                  <td className="px-6 py-4 text-gray-600">BSI Group</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">In Progress</span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">Q3 2026</td>
                </tr>
                <tr className="hover:bg-gray-50 bg-orange-50/30">
                  <td className="px-6 py-4 font-medium">SOC 2 Type II</td>
                  <td className="px-6 py-4 text-gray-600">Deloitte</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">In Progress</span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">Q4 2026</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">HIPAA Compliance</td>
                  <td className="px-6 py-4 text-gray-600">HITRUST</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">In Progress</span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">Q2 2026</td>
                </tr>
                <tr className="hover:bg-gray-50 bg-orange-50/30">
                  <td className="px-6 py-4 font-medium">ABDM Certification</td>
                  <td className="px-6 py-4 text-gray-600">NHA India</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">In Progress</span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">Q1 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#FF9A3B] to-[#E55A00] rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Have Compliance Questions?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Our dedicated compliance team is here to help with any questions about our 
              security measures, certifications, or data protection practices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:compliance@infuse.net.in" 
                className="px-6 py-3 bg-white text-[#E55A00] rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                compliance@infuse.net.in
              </a>
              <a 
                href="mailto:dpo@infuse.net.in" 
                className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                dpo@infuse.net.in
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Infuse-AI Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Document Version: 2026.01 | Last Updated: January 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CompliancePage;
