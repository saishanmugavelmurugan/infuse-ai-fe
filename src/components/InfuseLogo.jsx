import React from 'react';

/**
 * InfuseLogo - Official Infuse.AI Logo
 * 🚀 Bridging Healthcare & Security with AI
 */

const LOGO_URL = "https://customer-assets.emergentagent.com/job_securesphere-2/artifacts/3mq3uka4_Logo%20Infuse.jpg";

export const InfuseLogo = ({ 
  size = 40, 
  variant = 'full', // 'full', 'icon', 'text'
  className = '',
  darkMode = false 
}) => {
  const textColor = darkMode ? '#FFFFFF' : '#1F2937';
  const primaryColor = darkMode ? '#F59E0B' : '#F59E0B'; // Orange/Gold
  
  const LogoIcon = () => (
    <img 
      src={LOGO_URL}
      alt="Infuse.AI Logo"
      style={{ 
        width: size, 
        height: size, 
        objectFit: 'contain',
        borderRadius: '4px'
      }}
      className={className}
    />
  );

  const LogoText = ({ showTagline = false }) => (
    <div className="flex flex-col">
      <div className="flex items-baseline">
        <span 
          className="font-bold tracking-tight"
          style={{ 
            color: textColor,
            fontSize: size * 0.5,
            fontFamily: "'Inter', 'Segoe UI', sans-serif"
          }}
        >
          Infuse
        </span>
        <span 
          className="font-light"
          style={{ 
            color: primaryColor,
            fontSize: size * 0.5,
            fontFamily: "'Inter', 'Segoe UI', sans-serif"
          }}
        >
          .AI
        </span>
        <sup 
          style={{ 
            color: textColor,
            fontSize: size * 0.18,
            opacity: 0.8,
            marginLeft: '2px'
          }}
        >
          ™
        </sup>
      </div>
      {showTagline && (
        <span 
          className="text-xs tracking-wider opacity-70"
          style={{ 
            color: textColor,
            fontSize: size * 0.2
          }}
        >
          Healthcare × Security × AI
        </span>
      )}
    </div>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText showTagline={true} />;
  }

  // Full variant - icon + text
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
};

/**
 * Compact Logo for headers/nav
 */
export const InfuseLogoCompact = ({ size = 32, darkMode = false, className = '' }) => (
  <InfuseLogo size={size} variant="full" darkMode={darkMode} className={className} />
);

/**
 * Icon-only Logo for favicons/small spaces
 */
export const InfuseLogoIcon = ({ size = 32, darkMode = false, className = '' }) => (
  <InfuseLogo size={size} variant="icon" darkMode={darkMode} className={className} />
);

/**
 * Full Logo with Tagline
 */
export const InfuseLogoFull = ({ size = 48, darkMode = false, className = '' }) => {
  const primaryColor = darkMode ? '#F59E0B' : '#F59E0B';
  const textColor = darkMode ? '#FFFFFF' : '#1F2937';
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <InfuseLogo size={size} variant="full" darkMode={darkMode} />
      <div 
        className="mt-1 text-center tracking-widest uppercase"
        style={{ 
          fontSize: size * 0.18,
          color: textColor,
          opacity: 0.7,
          letterSpacing: '0.15em'
        }}
      >
        <span style={{ color: primaryColor }}>🚀</span> Bridging Healthcare & Security with AI
      </div>
    </div>
  );
};

export default InfuseLogo;
