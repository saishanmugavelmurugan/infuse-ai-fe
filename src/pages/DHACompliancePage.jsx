/**
 * DHA Compliance Documents Page
 * Dubai Health Authority compliance assessment and partnership materials
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, ArrowLeft, FileText, Shield, Building2, 
  CheckCircle, Clock, AlertCircle, Loader2, Server,
  Globe, Lock, Users, FileCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const DHACompliancePage = () => {
  const [downloading, setDownloading] = useState({});

  const triggerDownload = async (url, filename, key) => {
    setDownloading(prev => ({ ...prev, [key]: true }));
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      setDownloading(prev => ({ ...prev, [key]: 'done' }));
      setTimeout(() => {
        setDownloading(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Download error:', error);
      setDownloading(prev => ({ ...prev, [key]: false }));
      alert('Download failed. Please try again.');
    }
  };

  const complianceStatus = [
    { requirement: "TLS 1.3 Transport Security", status: "implemented", icon: Lock },
    { requirement: "Role-Based Access Control (RBAC)", status: "implemented", icon: Users },
    { requirement: "HL7 FHIR R4 Support", status: "partial", icon: FileCheck },
    { requirement: "Patient Consent Management", status: "implemented", icon: CheckCircle },
    { requirement: "Audit Logging", status: "implemented", icon: FileText },
    { requirement: "AES-256 Encryption at Rest", status: "planned", icon: Shield },
    { requirement: "Multi-Factor Authentication", status: "planned", icon: Lock },
    { requirement: "NABIDH Integration", status: "planned", icon: Globe },
    { requirement: "UAE Data Residency", status: "planned", icon: Server },
    { requirement: "Arabic Language Support", status: "partial", icon: Globe },
  ];

  const documents = [
    {
      key: 'compliance',
      name: 'DHA Compliance Assessment',
      description: 'Honest assessment of current compliance status, gap analysis, and roadmap',
      filename: 'DHA_Compliance_Assessment_2026.pdf',
      url: `${API_URL}/api/direct-download/dha-compliance`,
      icon: Shield,
      color: 'bg-blue-500',
      pages: '4 pages'
    },
    {
      key: 'architecture',
      name: 'Technical Architecture Document',
      description: 'Software architecture, security layers, data flow, and FHIR integration details',
      filename: 'DHA_Technical_Architecture_2026.pdf',
      url: `${API_URL}/api/direct-download/dha-architecture`,
      icon: Server,
      color: 'bg-purple-500',
      pages: '5 pages'
    },
    {
      key: 'pitch',
      name: 'DHA Partnership Pitch',
      description: 'Presentation slides for DHA partnership enrollment and NABIDH integration',
      filename: 'DHA_Partnership_Pitch_2026.pdf',
      url: `${API_URL}/api/direct-download/dha-pitch`,
      icon: Building2,
      color: 'bg-green-500',
      pages: '7 slides'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'implemented':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Implemented
        </span>;
      case 'partial':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" /> Partial
        </span>;
      case 'planned':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Planned
        </span>;
      default:
        return null;
    }
  };

  const DownloadButton = ({ onClick, state, label }) => (
    <Button
      onClick={onClick}
      disabled={state === true}
      data-testid={`download-btn-${label.toLowerCase().replace(/\s/g, '-')}`}
      className={`w-full ${state === 'done' ? 'bg-green-500 hover:bg-green-600' : 'bg-[#1a365d] hover:bg-[#2d4a7c]'}`}
    >
      {state === true ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Downloading...
        </>
      ) : state === 'done' ? (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Downloaded!
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-[#1a365d] transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2 text-[#1a365d]">
              <Shield className="w-5 h-5" />
              <span className="font-bold">DHA Compliance</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] py-12 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">Dubai Health Authority Compliance</h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Transparent compliance assessment and partnership materials for DHA enrollment. 
            All documents reflect our actual implementation status - no fake claims.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Compliance Status Overview */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Current Compliance Status
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {complianceStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium">{item.requirement}</span>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This status reflects our honest assessment. Items marked as "Planned" 
                  are in our roadmap for Q2-Q4 2026 as part of UAE market entry.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Downloadable Documents */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1a365d]" />
            DHA Submission Documents
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card key={doc.key} className="hover:shadow-lg transition" data-testid={`doc-card-${doc.key}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-lg ${doc.color}`}>
                      <doc.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{doc.name}</CardTitle>
                      <p className="text-xs text-gray-500">{doc.pages}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-sm">{doc.description}</CardDescription>
                  <DownloadButton
                    onClick={() => triggerDownload(doc.url, doc.filename, doc.key)}
                    state={downloading[doc.key]}
                    label="Download PDF"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Requirements Reference */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#1a365d]" />
            DHA Key Requirements Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-[#1a365d]">Data & Security</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Store data in UAE (AES-256 at rest, TLS 1.3 in transit)</p>
                <p>• Implement RBAC and MFA access controls</p>
                <p>• Support HL7/FHIR for NABIDH integration</p>
                <p>• Cybersecurity audits and penetration testing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-[#1a365d]">Partnership Process</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Register with DHA Health Regulation Department (HRD)</p>
                <p>• Submit data flows and security architecture</p>
                <p>• Test in NABIDH sandbox environment</p>
                <p>• Licensing via Sheryan portal (3-6 months)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-[#1a365d]">Relevant Standards</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• DHA Telehealth Standards (Version 2)</p>
                <p>• Health Data Protection Policy</p>
                <p>• Health Informatics Standards</p>
                <p>• Patient consent management requirements</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-[#1a365d]">AI Features</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Clinical validation required for AI features</p>
                <p>• Approval from DHA Digital Health team</p>
                <p>• Deployment only in licensed facilities</p>
                <p>• Arabic language support prioritized</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Ready for DHA Partnership</h3>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Contact us for technical discussions and to begin the NABIDH integration process.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:partnerships@infuse.net.in" className="px-6 py-2 bg-white text-[#1a365d] rounded-lg font-medium hover:bg-gray-100 transition">
              partnerships@infuse.net.in
            </a>
            <a href="https://infuse-ai.in" target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition">
              Visit infuse-ai.in
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DHACompliancePage;
