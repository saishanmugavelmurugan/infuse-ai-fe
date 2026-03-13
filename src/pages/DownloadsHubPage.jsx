/**
 * Downloads Hub Page - All Marketing Assets
 * Direct download links for all campaign materials
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, ArrowLeft, FileText, Video, Image, 
  MessageCircle, Facebook, Linkedin, Instagram, Package,
  CheckCircle, Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const DownloadsHubPage = () => {
  const [downloading, setDownloading] = useState({});

  // Direct download using fetch + blob for reliable file saving
  const triggerDownload = async (url, filename, key) => {
    setDownloading(prev => ({ ...prev, [key]: true }));
    
    try {
      // Fetch the file as blob
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      
      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      // Show success state
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

  const documents = [
    {
      key: 'marketing_pdf',
      name: 'Marketing Campaigns & Pricing Guide',
      description: 'Complete 17-page PDF with all campaign strategies and pricing',
      filename: 'HealthTrack_Pro_Marketing_Campaigns_Pricing_2026.pdf',
      url: `${API_URL}/api/direct-download/marketing-pdf`,
      icon: FileText,
      size: '23 KB',
      color: 'bg-red-500'
    },
    {
      key: 'promo_video',
      name: 'Promotional Video (Short)',
      description: '8-second animation - Quick intro',
      filename: 'HealthTrackPro_Promo_Video.mp4',
      url: `${API_URL}/api/direct-download/video`,
      icon: Video,
      size: '1.5 MB',
      color: 'bg-purple-500'
    },
    {
      key: 'full_video',
      name: 'Full Promotional Video (NEW)',
      description: '12-sec video - Visit infuse-ai.in | Download on App Store & Play Store | infuse.net.in',
      filename: 'HealthTrackPro_Full_Promo_Video.mp4',
      url: `${API_URL}/api/direct-download/full-video`,
      icon: Video,
      size: '2.4 MB',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      key: 'compliance_pdf',
      name: 'Compliance Documentation',
      description: 'HIPAA, GDPR, ISO 27001, SOC 2 compliance roadmap',
      filename: 'Infuse_HealthTrack_Pro_Compliance_2026.pdf',
      url: `${API_URL}/api/direct-download/compliance-pdf`,
      icon: FileText,
      size: '22 KB',
      color: 'bg-green-500'
    }
  ];

  const campaignImages = [
    {
      key: 'whatsapp',
      platform: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      filename: 'HealthTrackPro_WhatsApp_Campaign.png',
      url: `${API_URL}/api/direct-download/image/whatsapp`,
      preview: 'https://static.prod-images.emergentagent.com/jobs/8ec6f9ed-4ccd-47ea-80b6-b4d6b3c66127/images/246e09e8dc415c90592727780d26c27f178431fd7770d80e4f0f5c420f134638.png'
    },
    {
      key: 'facebook',
      platform: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]',
      filename: 'HealthTrackPro_Facebook_Campaign.png',
      url: `${API_URL}/api/direct-download/image/facebook`,
      preview: 'https://static.prod-images.emergentagent.com/jobs/8ec6f9ed-4ccd-47ea-80b6-b4d6b3c66127/images/fbe513f570b2a92716abd6f49925aa29beaac02a84f992357970d528d85558c8.png'
    },
    {
      key: 'linkedin',
      platform: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2]',
      filename: 'HealthTrackPro_LinkedIn_Campaign.png',
      url: `${API_URL}/api/direct-download/image/linkedin`,
      preview: 'https://static.prod-images.emergentagent.com/jobs/8ec6f9ed-4ccd-47ea-80b6-b4d6b3c66127/images/4632ab9071c4331316330ad0db00b60e4ce1dcf9658efa92994e6d633fdc6a29.png'
    },
    {
      key: 'instagram',
      platform: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-[#833AB4] via-[#E4405F] to-[#FCAF45]',
      filename: 'HealthTrackPro_Instagram_Campaign.png',
      url: `${API_URL}/api/direct-download/image/instagram`,
      preview: 'https://static.prod-images.emergentagent.com/jobs/8ec6f9ed-4ccd-47ea-80b6-b4d6b3c66127/images/0e030eece050da74d40c6bc363f40c790c88131befc01e729f4b9e37df8d2c0a.png'
    },
    {
      key: 'hero',
      platform: 'Hero Banner',
      icon: Image,
      color: 'bg-[#E55A00]',
      filename: 'HealthTrackPro_Hero_AllInOne.png',
      url: `${API_URL}/api/direct-download/image/hero`,
      preview: 'https://static.prod-images.emergentagent.com/jobs/8ec6f9ed-4ccd-47ea-80b6-b4d6b3c66127/images/2cfc2f380f79b1b11282563bdeebc8e5b66a591f2ab912e7133d939710797d89.png'
    }
  ];

  const DownloadButton = ({ onClick, state, label, testId }) => (
    <Button
      onClick={onClick}
      disabled={state === true}
      data-testid={testId}
      className={`w-full ${state === 'done' ? 'bg-green-500 hover:bg-green-600' : 'bg-[#E55A00] hover:bg-[#C64700]'}`}
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
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-[#E55A00] transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2 text-[#E55A00]">
              <Package className="w-5 h-5" />
              <span className="font-bold">Downloads Hub</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#FF9A3B] to-[#E55A00] py-10 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Marketing Assets Download Center</h1>
          <p className="text-white/90">Click any download button to save files directly to your computer</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Documents Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E55A00]" />
            Documents & Videos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {documents.map((doc) => (
              <Card key={doc.key} className="hover:shadow-lg transition" data-testid={`doc-card-${doc.key}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${doc.color}`}>
                      <doc.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{doc.name}</CardTitle>
                      <p className="text-xs text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 mb-3">{doc.description}</p>
                  <DownloadButton
                    onClick={() => triggerDownload(doc.url, doc.filename, doc.key)}
                    state={downloading[doc.key]}
                    label="Download"
                    testId={`download-btn-${doc.key}`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Campaign Images Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-[#E55A00]" />
            Campaign Creative Images
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaignImages.map((img) => (
              <Card key={img.key} className="overflow-hidden hover:shadow-lg transition" data-testid={`img-card-${img.key}`}>
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img 
                    src={img.preview} 
                    alt={img.platform}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded ${img.color}`}>
                      <img.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{img.platform}</span>
                  </div>
                  <DownloadButton
                    onClick={() => triggerDownload(img.url, img.filename, img.key)}
                    state={downloading[img.key]}
                    label="Download Image"
                    testId={`download-btn-${img.key}`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Download All */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Need Everything?</h3>
          <p className="text-gray-300 mb-4">Download the complete marketing PDF which includes all campaigns and pricing</p>
          <Button
            onClick={() => triggerDownload(
              `${API_URL}/api/direct-download/marketing-pdf`,
              'HealthTrack_Pro_Complete_Marketing_Guide.pdf',
              'all'
            )}
            disabled={downloading['all'] === true}
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            {downloading['all'] === true ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Preparing...
              </>
            ) : downloading['all'] === 'done' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Complete Guide (PDF)
              </>
            )}
          </Button>
        </section>

        {/* Instructions */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Download Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click any <strong>Download</strong> button to save the file</li>
            <li>• Files will save to your browser's default download folder</li>
            <li>• If download doesn't start, check your browser's popup blocker</li>
            <li>• For images: Right-click → "Save Image As" also works</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DownloadsHubPage;
