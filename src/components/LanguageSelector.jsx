import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Check, ChevronDown, ChevronRight, X } from 'lucide-react';

const REGIONS = [
  { key: 'india', name: 'India', code: 'IN', flag: '🇮🇳' },
  { key: 'france', name: 'France', code: 'FR', flag: '🇫🇷' },
  { key: 'uae', name: 'UAE', code: 'AE', flag: '🇦🇪' },
  { key: 'thailand', name: 'Thailand', code: 'TH', flag: '🇹🇭' },
  { key: 'vietnam', name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
  { key: 'indonesia', name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  { key: 'malaysia', name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  { key: 'other', name: 'Other', code: 'OT', flag: '🌍' }
];

const LanguageSelector = ({ isModal = false, onClose }) => {
  const { languageConfig, setLanguage, currentLanguage, currentRegion, setShowLanguageSelector } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState(() => {
    return (currentRegion && currentRegion !== 'other') ? currentRegion : null;
  });

  const handleRegionSelect = (regionKey) => {
    setSelectedRegion(regionKey);
    setStep(2);
  };

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode, selectedRegion);
    // Auto-close after selection
    if (onClose) onClose();
    setShowLanguageSelector(false);
  };

  const handleClose = () => {
    if (onClose) onClose();
    setShowLanguageSelector(false);
  };

  const getLanguagesForRegion = (regionKey) => {
    if (!languageConfig) return [];
    return languageConfig.regions[regionKey]?.languages || [];
  };

  const content = (
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-white" />
            <h2 className="text-xl font-semibold text-white">
              {step === 1 ? 'Select Your Region' : 'Select Language'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="text-blue-100 text-sm hover:text-white mt-2 flex items-center gap-1"
          >
            ← Back to regions
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {step === 1 ? (
          <div className="grid gap-2">
            {REGIONS.map((region) => (
              <button
                key={region.key}
                onClick={() => handleRegionSelect(region.key)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:border-blue-400 hover:bg-blue-50 ${
                  selectedRegion === region.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{region.flag}</span>
                  <span className="font-medium text-gray-800">{region.name}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-2">
            {getLanguagesForRegion(selectedRegion).map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:border-blue-400 hover:bg-blue-50 ${
                  currentLanguage === lang.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-800">{lang.native_name}</span>
                  <span className="text-sm text-gray-500">{lang.name}</span>
                </div>
                {currentLanguage === lang.code && (
                  <Check className="h-5 w-5 text-blue-500" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <p className="text-xs text-gray-500 text-center">
          You can change your language preference anytime from Settings
        </p>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
        <div onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// Compact language switcher dropdown for header/navbar - auto-closes on selection
export const LanguageSwitcher = ({ darkMode = false }) => {
  const { currentLanguage, setLanguage, languageConfig, currentRegion, setShowLanguageSelector } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setExpandedRegion(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentLanguageInfo = () => {
    if (!languageConfig) return { name: 'English', native_name: 'English' };
    const languages = languageConfig.regions[currentRegion]?.languages || [];
    return languages.find(l => l.code === currentLanguage) || { name: 'English', native_name: 'English' };
  };

  const getCurrentRegionInfo = () => {
    return REGIONS.find(r => r.key === currentRegion) || REGIONS[REGIONS.length - 1];
  };

  const handleLanguageSelect = (langCode, regionKey) => {
    setLanguage(langCode, regionKey);
    // AUTO-CLOSE dropdown after selection
    setIsOpen(false);
    setExpandedRegion(null);
  };

  const handleRegionClick = (regionKey) => {
    if (expandedRegion === regionKey) {
      setExpandedRegion(null);
    } else {
      setExpandedRegion(regionKey);
    }
  };

  const getLanguagesForRegion = (regionKey) => {
    if (!languageConfig) return [];
    return languageConfig.regions[regionKey]?.languages || [];
  };

  const langInfo = getCurrentLanguageInfo();
  const regionInfo = getCurrentRegionInfo();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          darkMode 
            ? 'hover:bg-white/10 text-white' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <Globe className={`h-4 w-4 ${darkMode ? 'text-white/80' : 'text-gray-600'}`} />
        <span className="text-sm font-medium">{regionInfo.flag} {langInfo.native_name}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''} ${darkMode ? 'text-white/80' : 'text-gray-600'}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center gap-2 text-white">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">Select Region & Language</span>
            </div>
          </div>
          
          {/* Regions List */}
          <div className="max-h-80 overflow-y-auto">
            {REGIONS.map((region) => {
              const languages = getLanguagesForRegion(region.key);
              const isExpanded = expandedRegion === region.key;
              const isCurrentRegion = currentRegion === region.key;
              
              return (
                <div key={region.key} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => handleRegionClick(region.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                      isCurrentRegion ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{region.flag}</span>
                      <span className={`text-sm font-medium ${isCurrentRegion ? 'text-blue-700' : 'text-gray-800'}`}>
                        {region.name}
                      </span>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {/* Languages submenu */}
                  {isExpanded && languages.length > 0 && (
                    <div className="bg-gray-50 py-1">
                      {languages.map((lang) => {
                        const isCurrentLang = currentLanguage === lang.code && isCurrentRegion;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code, region.key)}
                            className={`w-full flex items-center justify-between px-6 py-2 hover:bg-gray-100 transition-colors ${
                              isCurrentLang ? 'bg-blue-100' : ''
                            }`}
                          >
                            <div className="flex flex-col items-start">
                              <span className={`text-sm ${isCurrentLang ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                                {lang.native_name}
                              </span>
                              <span className="text-xs text-gray-500">{lang.name}</span>
                            </div>
                            {isCurrentLang && (
                              <Check className="h-4 w-4 text-blue-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Language applies across all products
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
