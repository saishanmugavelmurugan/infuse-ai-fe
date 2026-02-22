import React, { useState } from 'react';
import { 
  Download, Smartphone, Monitor, Chrome, Apple, 
  Code, FileCode, Coffee, Braces, CheckCircle,
  ExternalLink, Package, Cpu
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const DownloadCenter = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('apps');

  const apps = [
    {
      id: 'mobile-source',
      name: 'Mobile App Source',
      description: 'Complete Capacitor source code for building Android/iOS apps. Includes build instructions and all assets.',
      icon: Code,
      color: 'purple',
      version: '1.0.0',
      size: '2.5 MB',
      requirements: 'Android Studio or Xcode',
      features: ['Android Project', 'iOS Ready', 'Build Scripts', 'Full Source Code'],
      downloadUrl: '/downloads/mobile-app-source.zip',
      status: 'available'
    },
    {
      id: 'android',
      name: 'Android App',
      description: 'SecureSphere mobile app for Android devices. Protect your phone from threats in real-time.',
      icon: Smartphone,
      color: 'green',
      version: '1.0.0',
      size: '24 MB',
      requirements: 'Android 6.0+',
      features: ['URL Scanning', 'SMS Protection', 'Device Security', 'Push Alerts'],
      downloadUrl: '#',
      status: 'coming_soon'
    },
    {
      id: 'ios',
      name: 'iOS App',
      description: 'SecureSphere for iPhone and iPad. Enterprise-grade security for Apple devices.',
      icon: Apple,
      color: 'gray',
      version: '1.0.0',
      size: '18 MB',
      requirements: 'iOS 14.0+',
      features: ['URL Scanning', 'SMS Protection', 'Device Security', 'Push Alerts'],
      downloadUrl: '#',
      status: 'coming_soon'
    },
    {
      id: 'desktop',
      name: 'Desktop App',
      description: 'SecureSphere desktop application for Windows, Mac, and Linux.',
      icon: Monitor,
      color: 'blue',
      version: '1.0.0',
      size: '85 MB',
      requirements: 'Windows 10+, macOS 11+, Ubuntu 20.04+',
      features: ['System Tray', 'Auto Updates', 'Threat Notifications', 'Quick Actions'],
      downloadUrl: '/downloads/infuse-ai-desktop-app.zip',
      status: 'available'
    },
    {
      id: 'chrome',
      name: 'Chrome Extension',
      description: 'Browser extension for real-time URL scanning and phishing protection.',
      icon: Chrome,
      color: 'yellow',
      version: '1.0.0',
      size: '2.3 MB',
      requirements: 'Chrome 90+, Edge 90+',
      features: ['URL Scanning', 'Phishing Alerts', 'Safe Browsing', 'Context Menu'],
      downloadUrl: '/downloads/infuse-ai-chrome-extension.zip',
      status: 'available'
    }
  ];

  const sdks = [
    {
      id: 'javascript',
      name: 'JavaScript SDK',
      description: 'Official JavaScript/TypeScript SDK for web and Node.js applications.',
      icon: Braces,
      color: 'yellow',
      version: '1.0.0',
      installation: 'npm install @infuse-ai/sdk',
      docsUrl: '#',
      features: ['TypeScript Support', 'Promise-based', 'Tree Shakable', 'Browser & Node.js']
    },
    {
      id: 'python',
      name: 'Python SDK',
      description: 'Python SDK for backend integrations and data analysis pipelines.',
      icon: FileCode,
      color: 'blue',
      version: '1.0.0',
      installation: 'pip install infuse-ai-sdk',
      docsUrl: '#',
      features: ['Type Hints', 'Async Support', 'Django/Flask Ready', 'CLI Tools']
    },
    {
      id: 'java',
      name: 'Java SDK',
      description: 'Enterprise Java SDK for Spring and Android applications.',
      icon: Coffee,
      color: 'red',
      version: '1.0.0',
      installation: 'Maven: com.infuse.ai:sdk:1.0.0',
      docsUrl: '#',
      features: ['Android Compatible', 'Spring Integration', 'Reactive Support', 'Thread Safe']
    },
    {
      id: 'android-sdk',
      name: 'Android SDK',
      description: 'Native Android SDK for mobile app integration.',
      icon: Smartphone,
      color: 'green',
      version: '1.0.0',
      installation: "implementation 'com.infuse.ai:android-sdk:1.0.0'",
      docsUrl: '#',
      features: ['Kotlin Support', 'Coroutines', 'Jetpack Compatible', 'ProGuard Ready']
    },
    {
      id: 'ios-sdk',
      name: 'iOS SDK',
      description: 'Swift SDK for iOS and macOS applications.',
      icon: Apple,
      color: 'gray',
      version: '1.0.0',
      installation: 'pod "InfuseAISDK"',
      docsUrl: '#',
      features: ['Swift 5+', 'Combine Support', 'SwiftUI Ready', 'CocoaPods/SPM']
    },
    {
      id: 'php',
      name: 'PHP SDK',
      description: 'PHP SDK for Laravel, Symfony, and WordPress integrations.',
      icon: Code,
      color: 'purple',
      version: '1.0.0',
      installation: 'composer require infuse-ai/sdk',
      docsUrl: '#',
      features: ['PSR-4', 'Laravel Integration', 'Guzzle HTTP', 'PHP 8.0+']
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600 border-green-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      gray: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colors[color] || colors.blue;
  };

  const getBgColor = (color) => {
    const colors = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Download className="w-7 h-7 text-blue-600" />
            {t('download_center', 'Download Center')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('download_center_desc', 'Download apps, browser extensions, and SDKs for SecureSphere integration')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('apps')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'apps'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              {t('apps_extensions', 'Apps & Extensions')}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sdks')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'sdks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              {t('developer_sdks', 'Developer SDKs')}
            </div>
          </button>
        </nav>
      </div>

      {/* Apps & Extensions Tab */}
      {activeTab === 'apps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${getColorClasses(app.color)}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-500">v{app.version} • {app.size}</p>
                    </div>
                  </div>
                  {app.status === 'coming_soon' && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{app.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">{t('requirements', 'Requirements')}: {app.requirements}</p>
                  <div className="flex flex-wrap gap-2">
                    {app.features.map((feature, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  disabled={app.status === 'coming_soon'}
                  className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                    app.status === 'coming_soon'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : `${getBgColor(app.color)} text-white hover:opacity-90`
                  }`}
                >
                  <Download className="w-4 h-4" />
                  {app.status === 'coming_soon' ? t('coming_soon', 'Coming Soon') : t('download', 'Download')}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* SDKs Tab */}
      {activeTab === 'sdks' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">{t('oem_integration', 'OEM Integration')}</h4>
              <p className="text-sm text-blue-700 mt-1">
                {t('oem_integration_desc', 'All SDKs are designed for white-label integration. Contact us for OEM licensing and custom branding options.')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdks.map((sdk) => {
              const Icon = sdk.icon;
              return (
                <div key={sdk.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(sdk.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{sdk.name}</h3>
                      <p className="text-xs text-gray-500">v{sdk.version}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{sdk.description}</p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <code className="text-xs text-green-400 break-all">{sdk.installation}</code>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {sdk.features.map((feature, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      {t('documentation', 'Docs')}
                    </button>
                    <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      {t('download', 'Download')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadCenter;
