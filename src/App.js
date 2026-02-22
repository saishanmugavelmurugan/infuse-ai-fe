import React from 'react';
import './App.css';
import { BrowserRouter, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// Import route configurations
import { 
  renderPublicRoutes, 
  renderProtectedRoutes, 
  renderAdminRoutes 
} from './routes';

// Language Selector Wrapper - Must be inside LanguageProvider
const LanguageSelectorWrapper = () => {
  const { showLanguageSelector } = useLanguage();
  if (!showLanguageSelector) return null;
  return <LanguageSelector isModal={true} />;
};


// Inner App with access to Language Context
const AppContent = () => {
  return (
    <>
      <LanguageSelectorWrapper />
      <Routes>
        {/* Public Routes - No authentication required */}
        {renderPublicRoutes()}
        
        {/* Protected Routes - Require authentication */}
        {renderProtectedRoutes()}
        
        {/* Admin Routes - Require admin role */}
        {renderAdminRoutes()}
      </Routes>
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <LanguageProvider>
            <AuthProvider>
              <AppContent />
              <PWAInstallPrompt />
            </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
