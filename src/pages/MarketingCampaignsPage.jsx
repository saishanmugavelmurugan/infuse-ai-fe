/**
 * Marketing Campaigns Page - HealthTrack Pro
 * Displays campaign creatives and pricing for all platforms
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, ArrowLeft, MessageCircle, Facebook, Linkedin, Instagram,
  Play, Users, Building2, Globe, IndianRupee, DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const MarketingCampaignsPage = () => {
  const [activeTab, setActiveTab] = useState('campaigns');

  const campaigns = [
    {
      platform: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      budget: '$900/month',
      image: 'https://static.prod-images.emergentagent.com/jobs/8ec6f9ed-4ccd-47ea-80b6-b4d6b3c66127/images/246e09e8dc415c90592727780d26c27f178431fd7770d80e4f0f5c420f134638.png',
      strategy: 'Health reminders, appointment notifications, medication alerts, chatbot support',
      pricing: { usd: '$4.99', inr: '₹149' }
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]',
      budget: '$5,000/month',
      image: 'https://static.prod-images.emergentagent.com/jobs/8ec6f9ed-4ccd-47ea-80b6-b4d6b3c66127/images/fbe513f570b2a92716abd6f49925aa29beaac02a84f992357970d528d85558c8.png',
      strategy: 'Video ads, carousel features, lead gen quizzes, retargeting',
      pricing: { usd: '$9.99', inr: '₹349' }
    },
    {
      platform: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2]',
      budget: '$7,000/month',
      image: 'https://static.prod-images.emergentagent.com/jobs/8ec6f9ed-4ccd-47ea-80b6-b4d6b3c66127/images/4632ab9071c4331316330ad0db00b60e4ce1dcf9658efa92994e6d633fdc6a29.png',
      strategy: 'B2B leads, thought leadership, whitepapers, enterprise outreach',
      pricing: { usd: '$2/user', inr: '₹150/user' }
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-[#833AB4] via-[#E4405F] to-[#FCAF45]',
      budget: '$20,000/month',
      image: 'https://static.prod-images.emergentagent.com/jobs/8ec6f9ed-4ccd-47ea-80b6-b4d6b3c66127/images/0e030eece050da74d40c6bc363f40c790c88131befc01e729f4b9e37df8d2c0a.png',
      strategy: 'Influencer partnerships, Reels, health tips, user testimonials',
      pricing: { usd: '$9.99', inr: '₹349' }
    }
  ];

  const individualPricing = [
    { plan: 'Free', usd: '$0', inr: '₹0', features: ['3 lab reports/month', 'Basic AI insights', '1 device sync'] },
    { plan: 'Basic', usd: '$4.99/mo', inr: '₹149/mo', features: ['10 lab reports', '1 doctor consult', 'Ad-free'] },
    { plan: 'Pro', usd: '$9.99/mo', inr: '₹349/mo', features: ['Unlimited reports', '3 consults', '2 family members'] },
    { plan: 'Premium', usd: '$19.99/mo', inr: '₹699/mo', features: ['Everything unlimited', 'Predictive AI', '24/7 support'] }
  ];

  const enterprisePricing = [
    { plan: 'Starter', users: '100', usd: '$3/user', inr: '₹225/user', min: '$300/mo' },
    { plan: 'Business', users: '500', usd: '$2.50/user', inr: '₹188/user', min: '$1,000/mo' },
    { plan: 'Enterprise', users: '2,000', usd: '$2/user', inr: '₹150/user', min: '$3,000/mo' },
    { plan: 'Custom', users: 'Unlimited', usd: 'Contact Us', inr: 'Contact Us', min: '$10,000+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-[#E55A00] transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <a 
              href={`${API_URL}/api/marketing/campaigns-pricing-pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF9A3B] to-[#E55A00] text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              <Download className="w-4 h-4" />
              Download Full PDF
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#FF9A3B] to-[#E55A00] py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Marketing Campaigns & Pricing</h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Platform-specific marketing strategies and competitive pricing for HealthTrack Pro
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-6 py-3 font-medium transition ${activeTab === 'campaigns' ? 'text-[#E55A00] border-b-2 border-[#E55A00]' : 'text-gray-600'}`}
          >
            Campaign Creatives
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 py-3 font-medium transition ${activeTab === 'individual' ? 'text-[#E55A00] border-b-2 border-[#E55A00]' : 'text-gray-600'}`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Individual Pricing
          </button>
          <button
            onClick={() => setActiveTab('enterprise')}
            className={`px-6 py-3 font-medium transition ${activeTab === 'enterprise' ? 'text-[#E55A00] border-b-2 border-[#E55A00]' : 'text-gray-600'}`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Enterprise Pricing
          </button>
        </div>

        {/* Campaign Creatives */}
        {activeTab === 'campaigns' && (
          <div className="space-y-8">
            {/* Hero Image */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src="https://static.prod-images.emergentagent.com/jobs/8ec6f9ed-4ccd-47ea-80b6-b4d6b3c66127/images/2cfc2f380f79b1b11282563bdeebc8e5b66a591f2ab912e7133d939710797d89.png"
                  alt="All Your Health, One Place"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">All Your Health, One Place</h2>
                    <p>Unified health records for holistic wellbeing and predictive insights</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Platform Campaigns */}
            <div className="grid md:grid-cols-2 gap-6">
              {campaigns.map((campaign, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-lg transition">
                  <div className="relative h-48">
                    <img 
                      src={campaign.image} 
                      alt={`${campaign.platform} Campaign`}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-4 left-4 ${campaign.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}>
                      <campaign.icon className="w-4 h-4" />
                      {campaign.platform}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">Budget: {campaign.budget}</p>
                        <p className="text-sm text-gray-600">{campaign.strategy}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-green-600">
                        <DollarSign className="w-4 h-4" />{campaign.pricing.usd}
                      </span>
                      <span className="flex items-center gap-1 text-orange-600">
                        <IndianRupee className="w-4 h-4" />{campaign.pricing.inr}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Video Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-[#E55A00]" />
                  Promotional Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <a 
                    href={`${API_URL}/downloads/HealthTrackPro_Promo_Video.mp4`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#E55A00] text-white rounded-lg font-medium hover:bg-[#C64700] transition"
                  >
                    <Play className="w-5 h-5" />
                    Watch Promo Video
                  </a>
                  <p className="text-sm text-gray-500 mt-3">
                    "All Your Health, One Place" - 8 second promotional animation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Individual Pricing */}
        {activeTab === 'individual' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {individualPricing.map((plan, idx) => (
              <Card key={idx} className={`relative overflow-hidden ${plan.plan === 'Pro' ? 'border-2 border-[#E55A00] shadow-lg' : ''}`}>
                {plan.plan === 'Pro' && (
                  <div className="absolute top-0 right-0 bg-[#E55A00] text-white text-xs px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.plan}</CardTitle>
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                      <DollarSign className="w-5 h-5" />{plan.usd.replace('$', '').replace('/mo', '')}
                      {plan.usd.includes('/mo') && <span className="text-sm font-normal text-gray-500">/mo</span>}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-lg text-orange-600">
                      <IndianRupee className="w-4 h-4" />{plan.inr.replace('₹', '').replace('/mo', '')}
                      {plan.inr.includes('/mo') && <span className="text-sm font-normal">/mo</span>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-[#E55A00] rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enterprise Pricing */}
        {activeTab === 'enterprise' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {enterprisePricing.map((plan, idx) => (
                <Card key={idx} className={`${plan.plan === 'Enterprise' ? 'border-2 border-[#E55A00]' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle>{plan.plan}</CardTitle>
                    <p className="text-sm text-gray-500">Up to {plan.users} users</p>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-1 text-xl font-bold">
                      <DollarSign className="w-4 h-4" />{plan.usd.replace('$', '')}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-orange-600">
                      <IndianRupee className="w-4 h-4" />{plan.inr.replace('₹', '')}
                    </div>
                    <p className="text-xs text-gray-500">Min: {plan.min}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Industry-Specific Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'HealthTrack Hospital', price: '$5,000/mo', industry: 'Hospitals' },
                    { name: 'HealthTrack Corporate', price: '$2,000/mo', industry: 'Corporates' },
                    { name: 'HealthTrack Insure', price: '$3,000/mo', industry: 'Insurance' },
                    { name: 'HealthTrack Clinic', price: '$500/mo', industry: 'Clinics' },
                    { name: 'HealthTrack Labs', price: '$1,500/mo', industry: 'Diagnostics' },
                    { name: 'HealthTrack Pharma', price: '$10,000/mo', industry: 'Pharma' }
                  ].map((pkg, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900">{pkg.name}</p>
                      <p className="text-sm text-gray-500">{pkg.industry}</p>
                      <p className="text-[#E55A00] font-bold mt-2">{pkg.price}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingCampaignsPage;
