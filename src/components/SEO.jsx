import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  type = 'website',
  jsonLd
}) => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://www.infuse.net.in';
  const defaultImage = process.env.REACT_APP_LOGO_URL || `${baseUrl}/logo.png`;
  
  return (
    <Helmet prioritizeSeoTags>
      {/* Primary Meta Tags */}
      <title>{title} | Infuse-ai</title>
      <meta name="title" content={`${title} | Infuse-ai`} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical || baseUrl} />
      <meta property="og:title" content={`${title} | Infuse-ai`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:site_name" content="Infuse-ai" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical || baseUrl} />
      <meta property="twitter:title" content={`${title} | Infuse-ai`} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage || defaultImage} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;