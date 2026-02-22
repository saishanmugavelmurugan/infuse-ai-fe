import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Home as HomeIcon } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Privacy Policy"
        description="Infuse-ai's Privacy Policy explains how we collect, use, and protect your data across our enterprise platforms. We prioritize data security and user privacy."
        keywords="Privacy Policy, Data Protection, GDPR, Data Privacy, User Privacy, Information Security"
        canonical="https://www.infuse.net.in/privacy"
        type="article"
      />
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
            <Link to="/">
              <Button variant="ghost">
                <HomeIcon className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-gray-600 mt-2">Last Updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Infuse-ai ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                Services. This policy applies globally and complies with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>General Data Protection Regulation (GDPR) - European Union</li>
                <li>California Consumer Privacy Act (CCPA) - United States</li>
                <li>Personal Data Protection Act - India</li>
                <li>Other applicable international data protection laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2.1 Personal Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Name, email address, phone number, and business information</li>
                <li>Account credentials and authentication data</li>
                <li>Payment and billing information</li>
                <li>Company name, industry, and organizational details</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2.2 Health Data (HealthTrack Pro)</h3>
              <p className="text-gray-700 leading-relaxed">
                For healthcare services, we collect Protected Health Information (PHI) including medical records, health metrics, 
                diagnoses, and treatment information. This data is subject to HIPAA (US), GDPR (EU), and applicable healthcare 
                privacy regulations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2.3 Technical Data</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>IP addresses, browser types, and device information</li>
                <li>Usage data, log files, and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide, maintain, and improve our Services</li>
                <li>Process transactions and send transactional communications</li>
                <li>Personalize user experience and deliver relevant content</li>
                <li>Conduct research, analytics, and AI model training (anonymized)</li>
                <li>Detect, prevent, and address security threats and fraud</li>
                <li>Comply with legal obligations and enforce our Terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>AES-256 encryption for data at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>Multi-factor authentication (MFA)</li>
                <li>Regular security audits and penetration testing</li>
                <li>ISO 27001 and SOC 2 Type II compliance</li>
                <li>Role-based access controls and audit logs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights (GDPR & CCPA)</h2>
              <p className="text-gray-700 leading-relaxed">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your data ("Right to be Forgotten")</li>
                <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Opt-Out:</strong> Opt-out of marketing communications and data sales</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, contact: privacy@infuse.net.in
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain personal data only as long as necessary for the purposes outlined in this policy or as required by law. 
                Health data is retained according to applicable healthcare regulations (minimum 7 years post-treatment in most jurisdictions).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your data may be transferred to and processed in countries other than your country of residence. We ensure adequate 
                protection through Standard Contractual Clauses (SCCs) approved by the European Commission and other appropriate 
                safeguards compliant with GDPR Article 46.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We use essential cookies for platform functionality and optional cookies for analytics and personalization. 
                You can manage cookie preferences through your browser settings or our cookie consent tool.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our Services are not directed to individuals under 18 years of age. We do not knowingly collect personal data 
                from children. If we become aware of such collection, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of material changes via email or prominent 
                notice on our Platform at least 30 days before the effective date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="font-semibold">Data Protection Officer</p>
                <p>Email: <a href="mailto:info@infuse.net.in" className="text-orange-600 hover:underline">info@infuse.net.in</a></p>
                <p>Privacy Inquiries: <a href="mailto:info@infuse.net.in?subject=Privacy Inquiry" className="text-orange-600 hover:underline">info@infuse.net.in</a></p>
                <p className="mt-4">
                  <strong>EU Representative:</strong> [To be appointed if required under GDPR Article 27]
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;