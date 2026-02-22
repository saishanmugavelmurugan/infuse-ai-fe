import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({ 
  title = 'Infuse-ai - Enterprise AI Solutions for Healthcare, Marketing & Security',
  description = 'AI-powered SaaS and PaaS solutions across healthcare, marketing intelligence, and cybersecurity. 100+ years collective experience serving 890+ enterprises in 23 countries.',
  keywords = 'AI healthcare, marketing data lake, IoT security, enterprise SaaS, health risk prediction, campaign analytics, network security, ABDM integration, NetFlow analysis',
  canonical = 'https://www.infuse.in.net',
  image = 'https://customer-assets.emergentagent.com/job_healthrisk-ai-1/artifacts/5ibqv2sf_Logo%20Infuse.jpg'
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Infuse-ai" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Infuse-ai" />
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Infuse-ai",
          "url": "https://www.infuse.in.net",
          "logo": image,
          "description": description,
          "sameAs": [
            "https://www.linkedin.com/company/infuse-ai"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "info@infuse.in.net",
            "availableLanguage": ["English", "Hindi"]
          }
        })}
      </script>
      
      {/* Structured Data - Products */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "SoftwareApplication",
              "name": "HealthTrack Pro",
              "applicationCategory": "HealthApplication",
              "description": "AI-powered healthcare management with 95%+ accuracy in health risk prediction",
              "operatingSystem": "Web, Windows, macOS, Linux, iOS, Android"
            },
            {
              "@type": "SoftwareApplication",
              "name": "MarketLake AI",
              "applicationCategory": "BusinessApplication",
              "description": "Marketing data lake and campaign intelligence platform",
              "operatingSystem": "Web, Windows, macOS, Linux"
            },
            {
              "@type": "SoftwareApplication",
              "name": "SecureIT+IoT Enterprise Shield",
              "applicationCategory": "SecurityApplication",
              "description": "AI-powered unified security across IT and IoT infrastructure",
              "operatingSystem": "Web, Windows, macOS, Linux"
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;