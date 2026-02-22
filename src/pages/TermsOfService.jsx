import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Home as HomeIcon } from 'lucide-react';
import SEO from '../components/SEO';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Terms of Service"
        description="Read Infuse-ai's Terms of Service governing the use of our enterprise SaaS platforms including HealthTrack Pro and SecureIT+IoT Enterprise Shield."
        keywords="Terms of Service, Legal Terms, User Agreement, SaaS Terms, Platform Terms"
        canonical="https://www.infuse.net.in/terms"
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-gray-600 mt-2">Last Updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the Infuse-ai platform ("Platform"), including HealthTrack Pro 
                and SecureIT+IoT Enterprise Shield (collectively, the "Services"), you agree to be bound by these Terms 
                of Service ("Terms"). These Terms constitute a legally binding agreement between you ("User," "you," or "your") 
                and Infuse-ai ("Company," "we," "us," or "our"). If you do not agree to these Terms, you must immediately 
                cease using the Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2.1 Proprietary Rights</h3>
              <p className="text-gray-700 leading-relaxed">
                All intellectual property rights in and to the Services, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>Software code, algorithms, and architecture</li>
                <li>Artificial Intelligence models and machine learning implementations</li>
                <li>User interfaces, design elements, and visual content</li>
                <li>Trademarks, service marks, trade names, and logos ("Infuse-ai," "HealthTrack Pro," "SecureIT+IoT Enterprise Shield")</li>
                <li>Documentation, technical specifications, and methodologies</li>
                <li>Database structures and data compilations</li>
                <li>Any derivative works or improvements thereof</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                are exclusively owned by Infuse-ai and/or its licensors and are protected by international copyright laws, 
                trademark laws, patent laws, trade secret laws, and other intellectual property rights and unfair competition laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2.2 License Grant</h3>
              <p className="text-gray-700 leading-relaxed">
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, 
                non-sublicensable, revocable license to access and use the Services solely for your internal business purposes. 
                This license does not include any right to: (a) resell or make commercial use of the Services; (b) modify, 
                adapt, or create derivative works; (c) copy, distribute, or disclose any part of the Services; (d) use any 
                data mining, robots, or similar data gathering or extraction methods; (e) reverse engineer or attempt to 
                extract the source code.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2.3 Restrictions on Use</h3>
              <p className="text-gray-700 leading-relaxed">
                You expressly agree NOT to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>Copy, reproduce, distribute, or create derivative works of any part of the Services</li>
                <li>Reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code or underlying algorithms</li>
                <li>Rent, lease, lend, sell, sublicense, assign, distribute, publish, transfer, or otherwise make available the Services</li>
                <li>Remove, alter, or obscure any proprietary notices (including trademark and copyright notices)</li>
                <li>Use the Services to develop competing products or services</li>
                <li>Frame, mirror, or otherwise incorporate any part of the Services into any other website or service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Copyright Protection</h2>
              <p className="text-gray-700 leading-relaxed">
                All content, materials, and services provided through the Platform are protected by copyright laws worldwide, 
                including but not limited to the Berne Convention for the Protection of Literary and Artistic Works, the 
                Universal Copyright Convention, and the WIPO Copyright Treaty. Unauthorized reproduction, distribution, 
                modification, or public display of copyrighted materials is strictly prohibited and may result in civil and 
                criminal penalties under applicable laws, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>United States: Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512</li>
                <li>European Union: Directive 2001/29/EC (InfoSoc Directive)</li>
                <li>India: Copyright Act, 1957 (as amended)</li>
                <li>International: WIPO Copyright Treaty (WCT)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Trademark Protection</h2>
              <p className="text-gray-700 leading-relaxed">
                "Infuse-ai," "HealthTrack Pro," "SecureIT+IoT Enterprise Shield," and all related logos, 
                product names, service names, designs, and slogans are trademarks or service marks of Infuse-ai ("Marks"). 
                You are not granted any right or license to use any Marks without our prior written permission. Any unauthorized 
                use of the Marks may violate trademark laws, unfair competition laws, and other applicable laws and may result 
                in criminal or civil penalties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Patent and Trade Secret Protection</h2>
              <p className="text-gray-700 leading-relaxed">
                The Services may be protected by issued or pending patents in various jurisdictions. Our proprietary algorithms, 
                methodologies, and business processes constitute valuable trade secrets protected under international law, 
                including the Agreement on Trade-Related Aspects of Intellectual Property Rights (TRIPS Agreement). Any 
                unauthorized use, disclosure, or misappropriation of our trade secrets is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Data and Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Your use of the Services is also governed by our Privacy Policy, which is incorporated into these Terms by 
                reference. We comply with applicable data protection laws, including the General Data Protection Regulation 
                (GDPR), California Consumer Privacy Act (CCPA), and India's Personal Data Protection Act.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Acceptable Use Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to use the Services only for lawful purposes and in accordance with these Terms. Prohibited activities include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>Violating any applicable local, state, national, or international law</li>
                <li>Infringing upon intellectual property rights of any third party</li>
                <li>Transmitting malicious code, viruses, or harmful components</li>
                <li>Attempting to gain unauthorized access to systems or networks</li>
                <li>Interfering with or disrupting the Services or servers</li>
                <li>Using the Services for any fraudulent or illegal purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed uppercase font-semibold">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND 
                NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed uppercase font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL INFUSE-AI, ITS AFFILIATES, OFFICERS, DIRECTORS, 
                EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE 
                DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, 
                ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF 
                SUCH DAMAGES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Infuse-ai and its affiliates, officers, directors, employees, 
                agents, and licensors from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees 
                (including reasonable attorneys' fees) arising from: (a) your violation of these Terms; (b) your violation of any 
                rights of another party; (c) your violation of any applicable laws; or (d) your use or misuse of the Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your access to the Services at any time, without notice, for conduct 
                that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason 
                in our sole discretion. Upon termination, all licenses and rights granted to you will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law and Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">12.1 Governing Law</h3>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its 
                conflict of law provisions. For international users, these Terms also incorporate relevant provisions of 
                international treaties and conventions, including the United Nations Convention on Contracts for the 
                International Sale of Goods (CISG), where applicable.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">12.2 Dispute Resolution</h3>
              <p className="text-gray-700 leading-relaxed">
                Any dispute arising out of or relating to these Terms or the Services shall be resolved through binding 
                arbitration in accordance with the Arbitration and Conciliation Act, 1996 (India), conducted in English, 
                with the seat of arbitration in [City], India. The arbitrator's award shall be final and binding.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. International Compliance</h2>
              <p className="text-gray-700 leading-relaxed">
                If you access the Services from outside India, you are responsible for compliance with all local laws, including 
                but not limited to export and import regulations. The Services may be subject to export control laws and regulations. 
                You agree not to export, re-export, or transfer the Services to prohibited countries or individuals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Modifications to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the 
                updated Terms on the Platform with a revised "Last Updated" date. Your continued use of the Services after such 
                modifications constitutes your acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue 
                in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid 
                and enforceable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms or to report intellectual property violations, please contact:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="font-semibold">Infuse-ai Legal Department</p>
                <p>General Inquiries: <a href="mailto:info@infuse.net.in" className="text-orange-600 hover:underline">info@infuse.net.in</a></p>
                <p>Legal Matters: <a href="mailto:info@infuse.net.in?subject=Legal Inquiry" className="text-orange-600 hover:underline">info@infuse.net.in</a></p>
                <p>Support: <a href="mailto:info@infuse.net.in?subject=Support Request" className="text-orange-600 hover:underline">info@infuse.net.in</a></p>
              </div>
            </section>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mt-8">
              <p className="font-semibold text-orange-900">Notice of Copyright Protection</p>
              <p className="text-orange-800 mt-2">
                © 2025 Infuse-ai. All Rights Reserved. All trademarks, service marks, trade names, and logos are proprietary 
                to Infuse-ai. Unauthorized copying, reproduction, modification, distribution, or use of any materials or 
                intellectual property is strictly prohibited and will be prosecuted to the fullest extent under applicable 
                international, federal, state, and local laws.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;