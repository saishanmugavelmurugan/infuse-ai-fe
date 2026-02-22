import React, { useState } from 'react';
import { Globe, Brain, ArrowLeft, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import RegionalHealthSchemes from '../components/dashboard/RegionalHealthSchemes';
import AIHealthComparator from '../components/dashboard/AIHealthComparator';
import { LanguageSwitcher } from '../components/LanguageSelector';

const HealthSchemesPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('schemes');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="https://res.cloudinary.com/dq8h1bxlw/image/upload/v1749491693/infuse_gfdagm.png" 
                  alt="Infuse-AI" 
                  className="h-8 w-auto"
                />
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">Global Health Schemes</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setActiveTab('schemes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'schemes'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Globe className="h-4 w-4" />
                Regional Schemes
              </button>
              <button
                onClick={() => setActiveTab('comparator')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'comparator'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Brain className="h-4 w-4" />
                AI Comparator
              </button>
              <div className="border-l pl-4">
                <LanguageSwitcher />
              </div>
              <Link
                to="/login/health"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white p-4 space-y-2">
            <button
              onClick={() => { setActiveTab('schemes'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg ${
                activeTab === 'schemes' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
              }`}
            >
              <Globe className="h-4 w-4" />
              Regional Schemes
            </button>
            <button
              onClick={() => { setActiveTab('comparator'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg ${
                activeTab === 'comparator' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
              }`}
            >
              <Brain className="h-4 w-4" />
              AI Comparator
            </button>
            <div className="pt-2 border-t">
              <Link
                to="/login/health"
                className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'schemes' ? (
          <RegionalHealthSchemes />
        ) : (
          <AIHealthComparator />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <img 
                src="https://res.cloudinary.com/dq8h1bxlw/image/upload/v1749491693/infuse_gfdagm.png" 
                alt="Infuse-AI" 
                className="h-6 w-auto opacity-50"
              />
              <span>© {new Date().getFullYear()} Infuse-AI. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-700">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-700">Terms of Service</Link>
              <Link to="/about" className="text-gray-500 hover:text-gray-700">About Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HealthSchemesPage;
