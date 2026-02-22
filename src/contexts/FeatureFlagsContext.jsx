import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config/api';

const FeatureFlagsContext = createContext(null);

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return context;
};

export const FeatureFlagsProvider = ({ children }) => {
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${API_URL}/api/features/`);
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setFeatures(JSON.parse(xhr.responseText));
        }
        setLoading(false);
      };
      
      xhr.onerror = () => {
        setError('Failed to load feature flags');
        setLoading(false);
      };
      
      xhr.send();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const isEnabled = (product, feature) => {
    if (!features || !features[product]) return true; // Default to enabled if not loaded
    
    const productConfig = features[product];
    if (!productConfig.enabled) return false;
    
    const featureConfig = productConfig.features?.[feature];
    return featureConfig?.enabled ?? true;
  };

  const getProductFeatures = (product) => {
    if (!features || !features[product]) return {};
    return features[product].features || {};
  };

  const getEnabledFeatures = (product, tier = 'free') => {
    const tierHierarchy = ['free', 'basic', 'pro', 'enterprise'];
    const tierIndex = tierHierarchy.indexOf(tier);
    
    const productFeatures = getProductFeatures(product);
    const enabled = [];
    
    for (const [name, config] of Object.entries(productFeatures)) {
      if (config.enabled) {
        const featureTierIndex = tierHierarchy.indexOf(config.tier || 'free');
        if (featureTierIndex <= tierIndex) {
          enabled.push(name);
        }
      }
    }
    
    return enabled;
  };

  const value = {
    features,
    loading,
    error,
    isEnabled,
    getProductFeatures,
    getEnabledFeatures,
    refresh: fetchFeatures
  };

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export default FeatureFlagsContext;
