import React, { useState } from 'react';
import { 
  Shield, Link as LinkIcon, MessageSquare, Activity, 
  Smartphone, Radio, Car, BarChart3, Settings, Menu, X,
  ChevronRight, Globe, Brain, Bell, Cpu, PieChart, FileText, Webhook, Code, Download,
  Camera, Zap, QrCode, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../../components/LanguageSelector';
import { InfuseLogoIcon } from '../../components/InfuseLogo';

// Import SecureSphere components
import SecurityDashboard from '../../components/securesphere/SecurityDashboard';
import URLScanner from '../../components/securesphere/URLScanner';
import SMSAnalyzer from '../../components/securesphere/SMSAnalyzer';
import DeviceRegistry from '../../components/securesphere/DeviceRegistry';
import ThreatScoring from '../../components/securesphere/ThreatScoring';
import TelecomIntegration from '../../components/securesphere/TelecomIntegration';
import AutomotiveSecurity from '../../components/securesphere/AutomotiveSecurity';
import IoTSecurity from '../../components/securesphere/IoTSecurity';
import GSMFraudDetection from '../../components/securesphere/GSMFraudDetection';
import AdvancedAutomotiveSecurity from '../../components/securesphere/AdvancedAutomotiveSecurity';
import AnalyticsReports from '../../components/securesphere/AnalyticsReports';
import WebhookManager from '../../components/securesphere/WebhookManager';
import OEMSDKPortal from './OEMSDKPortal';
import DownloadCenter from '../../components/securesphere/DownloadCenter';
import SurveillanceIoTDashboard from '../../components/securesphere/SurveillanceIoTDashboard';
import MobileProtectionDashboard from '../../components/securesphere/MobileProtectionDashboard';
import CSPOperationsDashboard from '../../components/securesphere/CSPOperationsDashboard';

const SecureSphereDashboard = () => {
  const { t } = useLanguage();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('consumer');

  const tiers = [
    { id: 'consumer', name: t('ss_consumer', 'Consumer'), description: t('ss_mobile_protection', 'Mobile protection'), color: 'blue' },
    { id: 'enterprise', name: t('enterprise', 'Enterprise'), description: t('ss_fleet_management', 'Fleet management'), color: 'purple' },
    { id: 'telecom', name: t('ss_telecom', 'Telecom (CSP)'), description: t('ss_csp_integration', 'CSP integration'), color: 'indigo' },
    { id: 'automotive', name: t('ss_automotive', 'Automotive'), description: t('ss_connected_vehicles', 'Connected vehicles'), color: 'red' }
  ];

  const modules = [
    { id: 'dashboard', name: t('ss_security_dashboard', 'Security Dashboard'), icon: BarChart3, color: 'blue', tiers: ['consumer', 'enterprise', 'telecom', 'automotive'] },
    { id: 'url-scanner', name: t('ss_url_scanner', 'URL Scanner'), icon: LinkIcon, color: 'cyan', tiers: ['consumer', 'enterprise', 'telecom', 'automotive'] },
    { id: 'sms-analyzer', name: t('ss_sms_analyzer', 'SMS Analyzer'), icon: MessageSquare, color: 'purple', tiers: ['consumer', 'enterprise', 'telecom', 'automotive'] },
    { id: 'mobile-protection', name: 'Mobile Protection', icon: QrCode, color: 'indigo', description: 'QR linking & SMS fraud', tiers: ['consumer', 'enterprise', 'telecom'] },
    { id: 'threat-scoring', name: t('ss_threat_scoring', 'Threat Scoring'), icon: Activity, color: 'orange', tiers: ['consumer', 'enterprise', 'telecom', 'automotive'] },
    { id: 'device-registry', name: t('ss_device_registry', 'Device Registry'), icon: Smartphone, color: 'green', tiers: ['consumer', 'enterprise', 'telecom', 'automotive'] },
    { id: 'surveillance-iot', name: 'Surveillance IoT', icon: Camera, color: 'rose', description: 'Cameras, Meters, Dashcams', tiers: ['enterprise', 'telecom', 'automotive'] },
    { id: 'iot-security', name: t('ss_iot_security', 'IoT Security'), icon: Cpu, color: 'cyan', tiers: ['enterprise', 'telecom', 'automotive'] },
    { id: 'gsm-fraud', name: t('ss_gsm_fraud', 'GSM Fraud'), icon: Radio, color: 'red', tiers: ['telecom'] },
    { id: 'analytics', name: t('ss_analytics', 'Analytics & Reports'), icon: PieChart, color: 'emerald', tiers: ['consumer', 'enterprise', 'telecom', 'automotive'] },
    { id: 'webhooks', name: t('ss_webhooks', 'Webhooks'), icon: Webhook, color: 'violet', tiers: ['enterprise', 'telecom', 'automotive'] },
    { id: 'downloads', name: t('ss_downloads', 'Downloads'), icon: Download, color: 'teal', tiers: ['consumer', 'enterprise', 'telecom', 'automotive'] },
    { id: 'oem-sdk', name: t('ss_oem_sdk', 'OEM SDK Portal'), icon: Code, color: 'amber', tiers: ['enterprise', 'automotive'] },
    { id: 'csp-operations', name: 'CSP Operations', icon: Building2, color: 'indigo', description: 'White-label & Multi-tenant', tiers: ['telecom'] },
    { id: 'telecom', name: t('ss_telecom', 'Telecom (CSP)'), icon: Radio, color: 'indigo', tiers: ['telecom'] },
    { id: 'automotive', name: t('ss_automotive', 'Automotive'), icon: Car, color: 'red', tiers: ['automotive'] },
    { id: 'automotive-advanced', name: t('ss_automotive_advanced', 'Auto Advanced'), icon: Car, color: 'purple', tiers: ['automotive'] }
  ];

  // Filter modules based on selected tier
  const filteredModules = modules.filter(m => m.tiers.includes(selectedTier));

  // Get the default/main module for each tier
  const getTierDefaultModule = (tier) => {
    switch(tier) {
      case 'consumer': return 'dashboard';
      case 'enterprise': return 'dashboard';
      case 'telecom': return 'telecom';
      case 'automotive': return 'automotive';
      default: return 'dashboard';
    }
  };

  const handleTierChange = (tierId) => {
    setSelectedTier(tierId);
    // Navigate to the main module for this tier
    const defaultModule = getTierDefaultModule(tierId);
    setActiveModule(defaultModule);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <SecurityDashboard />;
      case 'url-scanner':
        return <URLScanner />;
      case 'sms-analyzer':
        return <SMSAnalyzer />;
      case 'mobile-protection':
        return <MobileProtectionDashboard />;
      case 'threat-scoring':
        return <ThreatScoring />;
      case 'device-registry':
        return <DeviceRegistry />;
      case 'surveillance-iot':
        return <SurveillanceIoTDashboard />;
      case 'csp-operations':
        return <CSPOperationsDashboard />;
      case 'iot-security':
        return <IoTSecurity />;
      case 'gsm-fraud':
        return <GSMFraudDetection />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'webhooks':
        return <WebhookManager />;
      case 'downloads':
        return <DownloadCenter />;
      case 'oem-sdk':
        return <OEMSDKPortal />;
      case 'telecom':
        return <TelecomIntegration />;
      case 'automotive':
        return <AutomotiveSecurity />;
      case 'automotive-advanced':
        return <AdvancedAutomotiveSecurity />;
      default:
        return <SecurityDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className="flex items-center gap-3">
                <InfuseLogoIcon size={36} darkMode={true} />
                <div>
                  <span className="text-xl font-bold">SecureSphere</span>
                  <span className="text-xs text-gray-400 block">by Infuse.AI</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-800 rounded-lg relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <LanguageSwitcher />
              <Link
                to="/login"
                className="hidden md:block bg-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                {t('sign_in', 'Sign In')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r lg:border lg:rounded-xl
            transform transition-transform lg:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            pt-20 lg:pt-0
          `}>
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {t('ss_security_modules', 'Security Modules')}
              </h3>
              <nav className="space-y-1">
                {filteredModules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => {
                      setActiveModule(module.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      activeModule === module.id
                        ? `bg-${module.color}-50 text-${module.color}-700`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <module.icon className={`h-5 w-5 ${
                        activeModule === module.id ? `text-${module.color}-600` : 'text-gray-400'
                      }`} />
                      <span className="text-sm font-medium">{module.name}</span>
                    </div>
                    {module.coming && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Soon</span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {t('ss_tier_selection', 'Tier Selection')}
                </h3>
                <div className="space-y-2">
                  {tiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => handleTierChange(tier.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedTier === tier.id
                          ? `bg-${tier.color}-50 border-${tier.color}-300 ring-2 ring-${tier.color}-200`
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <p className={`text-sm font-medium ${
                        selectedTier === tier.id ? `text-${tier.color}-800` : 'text-gray-700'
                      }`}>{tier.name}</p>
                      <p className={`text-xs ${
                        selectedTier === tier.id ? `text-${tier.color}-600` : 'text-gray-500'
                      }`}>{tier.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Backdrop for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {renderModule()}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-cyan-400" />
              <span className="font-bold">SecureSphere</span>
              <span className="text-gray-400">by Infuse-AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <Link to="/terms" className="hover:text-white">Terms</Link>
              <Link to="/contact" className="hover:text-white">Contact</Link>
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Infuse-AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecureSphereDashboard;
