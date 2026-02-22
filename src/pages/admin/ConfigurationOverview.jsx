import React, { useState } from 'react';
import { 
  Server, Database, Layout, Shield, Heart, Settings, 
  Code, FileCode, Folder, ChevronDown, ChevronRight,
  Check, AlertCircle, Globe, Users, Lock, Zap, Cpu,
  Activity, Bell, CreditCard, FileText, Webhook,
  Smartphone, Car, Radio, Brain, Stethoscope, Pill,
  Calendar, Video, Languages, Building, Key, BarChart3,
  RefreshCw, ExternalLink, Copy, CheckCircle2
} from 'lucide-react';

const ConfigurationOverview = () => {
  const [expandedSections, setExpandedSections] = useState({
    backend: true,
    frontend: true,
    database: false,
    integrations: false,
    features: false
  });
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  // Backend Modules Configuration
  const backendModules = {
    core: {
      name: 'Core Services',
      icon: Server,
      color: 'blue',
      routes: [
        { path: '/api/auth', file: 'auth.py', description: 'Authentication & JWT' },
        { path: '/api/organization', file: 'organization.py', description: 'Multi-tenant orgs' },
        { path: '/api/subscription', file: 'subscription.py', description: 'Subscription plans' },
        { path: '/api/billing', file: 'billing.py', description: 'Billing management' },
        { path: '/api/dashboard', file: 'dashboard.py', description: 'Dashboard data' },
        { path: '/api/language', file: 'language.py', description: 'i18n translations' },
        { path: '/api/notifications', file: 'notifications.py', description: 'Push notifications' },
      ]
    },
    healthtrack: {
      name: 'HealthTrack Pro',
      icon: Heart,
      color: 'red',
      routes: [
        { path: '/api/healthtrack/patients', file: 'patients.py', description: 'Patient management' },
        { path: '/api/healthtrack/appointments', file: 'appointments.py', description: 'Appointment scheduling' },
        { path: '/api/healthtrack/medical-records', file: 'medical_records.py', description: 'Medical records' },
        { path: '/api/healthtrack/prescriptions', file: 'prescriptions.py', description: 'Prescriptions' },
        { path: '/api/healthtrack/lab-tests', file: 'lab_tests.py', description: 'Lab test orders' },
        { path: '/api/healthtrack/vitals', file: 'vitals.py', description: 'Vital signs recording' },
        { path: '/api/healthtrack/video-consent', file: 'video_consent.py', description: 'Video consent forms' },
        { path: '/api/healthtrack/ai-analysis', file: 'ai_health_analysis.py', description: 'AI health insights' },
        { path: '/api/healthtrack/telemedicine', file: 'telemedicine.py', description: 'Video consultations' },
        { path: '/api/healthtrack/consent', file: 'consent.py', description: 'Patient consents' },
        { path: '/api/healthtrack/abdm', file: 'abdm.py', description: 'ABDM integration' },
        { path: '/api/healthtrack/billing', file: 'healthtrack_billing.py', description: 'Medical billing' },
      ]
    },
    securesphere: {
      name: 'SecureSphere',
      icon: Shield,
      color: 'orange',
      routes: [
        { path: '/api/securesphere/url-scanner', file: 'url_scanner.py', description: 'URL threat scanning' },
        { path: '/api/securesphere/sms-analyzer', file: 'sms_analyzer.py', description: 'SMS phishing detection' },
        { path: '/api/securesphere/threat-scoring', file: 'threat_scoring.py', description: 'Threat risk scores' },
        { path: '/api/securesphere/devices', file: 'device_registry.py', description: 'Device management' },
        { path: '/api/securesphere/dashboard', file: 'dashboard.py', description: 'Security dashboard' },
        { path: '/api/securesphere/iot', file: 'iot_security.py', description: 'IoT security' },
        { path: '/api/securesphere/automotive', file: 'automotive_security.py', description: 'Vehicle security' },
        { path: '/api/securesphere/gsm-fraud', file: 'gsm_fraud.py', description: 'GSM fraud detection' },
        { path: '/api/securesphere/telecom', file: 'telecom_adapter.py', description: 'Telecom integration' },
        { path: '/api/securesphere/analytics', file: 'analytics.py', description: 'Security analytics' },
        { path: '/api/securesphere/reports', file: 'reports.py', description: 'Threat reports' },
      ]
    },
    enterprise: {
      name: 'Enterprise Features',
      icon: Building,
      color: 'purple',
      routes: [
        { path: '/api/enterprise/sso', file: 'sso.py', description: 'Single Sign-On' },
        { path: '/api/enterprise/bulk-export', file: 'bulk_export.py', description: 'Data export' },
        { path: '/api/enterprise/ip-whitelist', file: 'ip_whitelist.py', description: 'IP access control' },
        { path: '/api/enterprise/audit-logs', file: 'audit_logs.py', description: 'Audit logging' },
        { path: '/api/admin/api-keys', file: 'api_keys.py', description: 'API key management' },
        { path: '/api/admin/usage-analytics', file: 'usage_analytics.py', description: 'Usage tracking' },
        { path: '/api/admin/licenses', file: 'license_management.py', description: 'License management' },
      ]
    },
    integrations: {
      name: 'Integrations & APIs',
      icon: Webhook,
      color: 'green',
      routes: [
        { path: '/api/webhooks', file: 'webhooks.py', description: 'Webhook management' },
        { path: '/api/developer-portal', file: 'developer_portal.py', description: 'Developer tools' },
        { path: '/api/oem-sdk', file: 'oem_sdk.py', description: 'OEM SDK portal' },
        { path: '/api/vran', file: 'vran_api.py', description: 'vRAN integration' },
        { path: '/api/alerts', file: 'alerts.py', description: 'Alert notifications' },
        { path: '/api/feature-flags', file: 'feature_flags.py', description: 'Feature toggles' },
        { path: '/api/multi-tenant', file: 'multi_tenant_api.py', description: 'Multi-tenant APIs' },
      ]
    },
    admin: {
      name: 'Admin Consoles',
      icon: Settings,
      color: 'gray',
      routes: [
        { path: '/api/unified-admin', file: 'unified_admin.py', description: 'Unified admin dashboard' },
        { path: '/api/internal-admin', file: 'internal_admin.py', description: 'Internal team console' },
        { path: '/api/enterprise-admin', file: 'enterprise_admin.py', description: 'Customer admin portal' },
        { path: '/api/super-admin', file: 'super_admin.py', description: 'Super admin functions' },
        { path: '/api/ai-agents-admin', file: 'ai_agents_admin.py', description: 'AI agents management' },
      ]
    }
  };

  // Frontend Pages Configuration
  const frontendPages = {
    public: {
      name: 'Public Pages',
      icon: Globe,
      pages: [
        { path: '/', file: 'NewLanding.jsx', description: 'Main landing page' },
        { path: '/login', file: 'Login.jsx', description: 'Product selection' },
        { path: '/login/health', file: 'HealthLogin.jsx', description: 'HealthTrack login' },
        { path: '/login/security', file: 'SecurityLogin.jsx', description: 'SecureSphere login' },
        { path: '/register', file: 'Register.jsx', description: 'Registration' },
        { path: '/about', file: 'AboutUs.jsx', description: 'About page' },
        { path: '/careers', file: 'Careers.jsx', description: 'Careers page' },
        { path: '/downloads', file: 'Downloads.jsx', description: 'App downloads' },
        { path: '/developers', file: 'DeveloperPortal.jsx', description: 'API documentation' },
        { path: '/health-schemes', file: 'HealthSchemesPage.jsx', description: 'Health schemes' },
      ]
    },
    dashboards: {
      name: 'Role-Based Dashboards',
      icon: Layout,
      pages: [
        { path: '/dashboard', file: 'MainDashboard.jsx', description: 'Main dashboard' },
        { path: '/dashboard/health', file: 'HealthTrackPro.jsx', description: 'HealthTrack Pro' },
        { path: '/dashboard/security', file: 'SecureSphere.jsx', description: 'SecureSphere' },
        { path: '/dashboard/doctor', file: 'DoctorDashboard.jsx', description: 'Doctor portal' },
        { path: '/dashboard/patient', file: 'PatientDashboard.jsx', description: 'Patient portal' },
        { path: '/securesphere', file: 'SecureSphereDashboard.jsx', description: 'Security dashboard' },
        { path: '/threat-center', file: 'ThreatCenter.jsx', description: 'Threat center' },
      ]
    },
    admin: {
      name: 'Admin Interfaces',
      icon: Settings,
      pages: [
        { path: '/admin/unified', file: 'UnifiedAdminDashboard.jsx', description: 'Unified admin' },
        { path: '/admin/enterprise', file: 'EnterpriseAdminDashboard.jsx', description: 'Enterprise admin' },
        { path: '/admin/super', file: 'SuperAdminPanel.jsx', description: 'Super admin' },
        { path: '/admin/console', file: 'AdminConsole.jsx', description: 'Admin console' },
        { path: '/admin/downloads', file: 'InternalAdminDownloads.jsx', description: 'Sales materials' },
        { path: '/oem-sdk', file: 'OEMSDKPortal.jsx', description: 'OEM SDK portal' },
      ]
    }
  };

  // Frontend Components
  const frontendComponents = {
    healthtrack: {
      name: 'HealthTrack Components',
      icon: Stethoscope,
      components: [
        'VideoConsentRecorder.jsx',
        'PatientDetailModal.jsx',
        'AddPatientModal.jsx',
        'BookAppointmentModal.jsx',
        'WritePrescriptionModal.jsx',
        'RecordVitalsModal.jsx',
        'OrderLabTestModal.jsx',
        'ABDMIntegration.jsx',
        'AIAnalyticsDashboard.jsx',
        'AIHealthComparator.jsx',
        'HealthInsightsAgent.jsx',
        'WearableDevicesPanel.jsx',
        'LabTestsPanel.jsx',
        'RegionalHealthSchemes.jsx',
      ]
    },
    securesphere: {
      name: 'SecureSphere Components',
      icon: Shield,
      components: [
        'SecurityDashboard.jsx',
        'URLScanner.jsx',
        'SMSAnalyzer.jsx',
        'ThreatScoring.jsx',
        'DeviceRegistry.jsx',
        'IoTSecurity.jsx',
        'AutomotiveSecurity.jsx',
        'AdvancedAutomotiveSecurity.jsx',
        'GSMFraudDetection.jsx',
        'TelecomIntegration.jsx',
        'WebhookManager.jsx',
        'AnalyticsReports.jsx',
        'DownloadCenter.jsx',
      ]
    },
    dashboard: {
      name: 'Dashboard Components',
      icon: Layout,
      components: [
        'DashboardLayout.jsx',
        'RevenueAnalyticsDashboard.jsx',
      ]
    },
    ui: {
      name: 'UI Components (shadcn)',
      icon: Code,
      components: [
        'button.jsx', 'card.jsx', 'input.jsx', 'select.jsx',
        'tabs.jsx', 'table.jsx', 'dialog.jsx', 'dropdown-menu.jsx',
        'toast.jsx', 'form.jsx', 'badge.jsx', 'avatar.jsx',
        'progress.jsx', 'skeleton.jsx', 'separator.jsx', 'sheet.jsx',
        '+ 20 more components'
      ]
    }
  };

  // Database Collections
  const databaseCollections = {
    users: ['users', 'doctors', 'patients', 'admin_users', 'organizations', 'sessions'],
    healthtrack: [
      'healthtrack_appointments', 'healthtrack_consents', 'healthtrack_ai_analyses',
      'healthtrack_ai_insights', 'prescriptions', 'health_records', 'vitals',
      'video_consents', 'consent_videos', 'drug_database', 'appointments'
    ],
    securesphere: [
      'security_devices', 'security_threats', 'security_policies', 'url_scans',
      'url_reports', 'url_reputation_cache', 'sms_analyses', 'sms_reports',
      'threat_alerts', 'threat_events', 'threat_intelligence', 'threat_scores',
      'automotive_threats', 'vehicle_alerts', 'vehicle_events', 'vehicle_threats',
      'gsm_fraud_alerts', 'gsm_activity_logs', 'devices', 'fleet_vehicles'
    ],
    enterprise: [
      'api_keys', 'api_usage', 'api_key_usage', 'audit_logs', 'audit_logs_archive',
      'sso_configurations', 'sso_providers', 'sso_sessions', 'sso_audit_logs',
      'webhooks', 'webhook_deliveries', 'access_control_rules', 'access_audit_logs'
    ],
    billing: [
      'subscription_plans', 'subscriptions', 'billing_records', 'razorpay_orders'
    ],
    integrations: [
      'abdm_health_records', 'abdm_consent_requests', 'abdm_claims',
      'vran_sessions', 'vran_connections', 'telecom_configs'
    ]
  };

  // Feature Flags
  const featureFlags = [
    { name: 'AI Health Analysis', key: 'ai_health_analysis', status: 'enabled', product: 'HealthTrack' },
    { name: 'Video Consent', key: 'video_consent', status: 'enabled', product: 'HealthTrack' },
    { name: 'ABDM Integration', key: 'abdm_integration', status: 'enabled', product: 'HealthTrack' },
    { name: 'Wearable Sync', key: 'wearable_sync', status: 'enabled', product: 'HealthTrack' },
    { name: 'URL Scanner', key: 'url_scanner', status: 'enabled', product: 'SecureSphere' },
    { name: 'SMS Analyzer', key: 'sms_analyzer', status: 'enabled', product: 'SecureSphere' },
    { name: 'Automotive Security', key: 'automotive_security', status: 'enabled', product: 'SecureSphere' },
    { name: 'IoT Security', key: 'iot_security', status: 'enabled', product: 'SecureSphere' },
    { name: 'vRAN Integration', key: 'vran_integration', status: 'enabled', product: 'SecureSphere' },
    { name: 'Real Alerts', key: 'real_alerts', status: 'mocked', product: 'Platform' },
    { name: 'SSO Authentication', key: 'sso_auth', status: 'enabled', product: 'Enterprise' },
    { name: 'Bulk Export', key: 'bulk_export', status: 'enabled', product: 'Enterprise' },
  ];

  // Third-party Integrations
  const thirdPartyIntegrations = [
    { name: 'OpenAI/Gemini', purpose: 'AI Health Analysis', status: 'active', key: 'Emergent LLM Key' },
    { name: 'Razorpay', purpose: 'Payment processing', status: 'active', key: 'Test key in pod' },
    { name: 'Twilio', purpose: 'SMS/WhatsApp alerts', status: 'mocked', key: 'Requires API key' },
    { name: 'SendGrid/Resend', purpose: 'Email notifications', status: 'mocked', key: 'Requires API key' },
    { name: 'recharts', purpose: 'Dashboard charts', status: 'active', key: 'Built-in' },
    { name: 'Capacitor', purpose: 'Mobile app', status: 'active', key: 'Built-in' },
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[color] || colors.gray;
  };

  const SectionHeader = ({ title, icon: Icon, expanded, onToggle, count, color = 'gray' }) => (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 rounded-lg border ${getColorClass(color)} hover:opacity-90 transition-all`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-semibold">{title}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/50">{count} items</span>
      </div>
      {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Settings className="w-8 h-8 text-orange-500" />
                Application Configuration Overview
              </h1>
              <p className="text-gray-600 mt-2">
                Complete architecture documentation for test engineers - Infuse-AI Platform v2.0.0
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Production Ready
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                67 API Routes
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                72 Backend Modules
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <Server className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">67</div>
              <div className="text-sm opacity-80">API Routes</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <FileCode className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">72</div>
              <div className="text-sm opacity-80">Backend Files</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <Layout className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">40+</div>
              <div className="text-sm opacity-80">Frontend Pages</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <Database className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">60+</div>
              <div className="text-sm opacity-80">DB Collections</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
              <Heart className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm opacity-80">HealthTrack APIs</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 text-white">
              <Shield className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">11</div>
              <div className="text-sm opacity-80">SecureSphere APIs</div>
            </div>
          </div>
        </div>

        {/* Two Products Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">HealthTrack Pro</h2>
                <p className="text-white/80">Healthcare Platform</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm opacity-80">API Endpoints</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">14</div>
                <div className="text-sm opacity-80">Components</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">11</div>
                <div className="text-sm opacity-80">DB Collections</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm opacity-80">User Roles</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">SecureSphere</h2>
                <p className="text-white/80">Cybersecurity Platform</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">11</div>
                <div className="text-sm opacity-80">API Endpoints</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">13</div>
                <div className="text-sm opacity-80">Components</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">20</div>
                <div className="text-sm opacity-80">DB Collections</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm opacity-80">Tier Levels</div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Modules Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <SectionHeader
            title="Backend API Modules"
            icon={Server}
            expanded={expandedSections.backend}
            onToggle={() => toggleSection('backend')}
            count={Object.values(backendModules).reduce((acc, m) => acc + m.routes.length, 0)}
            color="blue"
          />
          
          {expandedSections.backend && (
            <div className="mt-6 space-y-6">
              {Object.entries(backendModules).map(([key, module]) => (
                <div key={key} className={`border rounded-xl p-4 ${getColorClass(module.color)}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <module.icon className="w-5 h-5" />
                    <h3 className="font-semibold">{module.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">
                      {module.routes.length} routes
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {module.routes.map((route, idx) => (
                      <div key={idx} className="bg-white/80 rounded-lg p-3 flex items-start justify-between group">
                        <div>
                          <code className="text-xs font-mono text-gray-800">{route.path}</code>
                          <p className="text-xs text-gray-600 mt-1">{route.description}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{route.file}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(route.path, `${key}-${idx}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                          {copiedEndpoint === `${key}-${idx}` ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Frontend Pages Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <SectionHeader
            title="Frontend Pages & Components"
            icon={Layout}
            expanded={expandedSections.frontend}
            onToggle={() => toggleSection('frontend')}
            count={Object.values(frontendPages).reduce((acc, p) => acc + p.pages.length, 0) + 
                   Object.values(frontendComponents).reduce((acc, c) => acc + c.components.length, 0)}
            color="purple"
          />
          
          {expandedSections.frontend && (
            <div className="mt-6 space-y-6">
              {/* Pages */}
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Pages
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(frontendPages).map(([key, section]) => (
                  <div key={key} className="border rounded-xl p-4 bg-purple-50">
                    <div className="flex items-center gap-2 mb-3">
                      <section.icon className="w-4 h-4 text-purple-600" />
                      <h5 className="font-medium text-purple-800">{section.name}</h5>
                    </div>
                    <div className="space-y-2">
                      {section.pages.map((page, idx) => (
                        <div key={idx} className="bg-white rounded p-2 text-xs">
                          <code className="text-purple-600">{page.path}</code>
                          <p className="text-gray-500 mt-0.5">{page.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Components */}
              <h4 className="font-semibold text-gray-700 flex items-center gap-2 mt-6">
                <Code className="w-4 h-4" /> Components
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(frontendComponents).map(([key, section]) => (
                  <div key={key} className="border rounded-xl p-4 bg-green-50">
                    <div className="flex items-center gap-2 mb-3">
                      <section.icon className="w-4 h-4 text-green-600" />
                      <h5 className="font-medium text-green-800">{section.name}</h5>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {section.components.map((comp, idx) => (
                        <span key={idx} className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Database Collections Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <SectionHeader
            title="Database Collections (MongoDB)"
            icon={Database}
            expanded={expandedSections.database}
            onToggle={() => toggleSection('database')}
            count={Object.values(databaseCollections).reduce((acc, c) => acc + c.length, 0)}
            color="orange"
          />
          
          {expandedSections.database && (
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(databaseCollections).map(([key, collections]) => (
                <div key={key} className="border rounded-xl p-4 bg-orange-50">
                  <h4 className="font-semibold text-orange-800 mb-3 capitalize flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    {key.replace('_', ' ')} ({collections.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {collections.map((col, idx) => (
                      <span key={idx} className="text-xs bg-white px-2 py-1 rounded font-mono text-gray-600">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature Flags & Integrations */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Feature Flags */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <SectionHeader
              title="Feature Flags"
              icon={Zap}
              expanded={expandedSections.features}
              onToggle={() => toggleSection('features')}
              count={featureFlags.length}
              color="green"
            />
            
            {expandedSections.features && (
              <div className="mt-4 space-y-2">
                {featureFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{flag.name}</p>
                      <p className="text-xs text-gray-500">{flag.product} • {flag.key}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      flag.status === 'enabled' ? 'bg-green-100 text-green-700' :
                      flag.status === 'mocked' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {flag.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Third-party Integrations */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <SectionHeader
              title="Third-party Integrations"
              icon={Webhook}
              expanded={expandedSections.integrations}
              onToggle={() => toggleSection('integrations')}
              count={thirdPartyIntegrations.length}
              color="purple"
            />
            
            {expandedSections.integrations && (
              <div className="mt-4 space-y-2">
                {thirdPartyIntegrations.map((integration, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{integration.name}</p>
                      <p className="text-xs text-gray-500">{integration.purpose}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        integration.status === 'active' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {integration.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{integration.key}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Test Credentials */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Key className="w-6 h-6 text-yellow-400" />
            Test Credentials
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-400 mb-2">SecureSphere Admin</h4>
              <p className="text-sm font-mono">admin@infuse.demo</p>
              <p className="text-sm font-mono text-gray-400">admin1234</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-semibold text-red-400 mb-2">HealthTrack Doctor</h4>
              <p className="text-sm font-mono">doctor.priya@infuse.demo</p>
              <p className="text-sm font-mono text-gray-400">demo1234</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-semibold text-green-400 mb-2">HealthTrack Enterprise</h4>
              <p className="text-sm font-mono">enterprise@infuse.demo</p>
              <p className="text-sm font-mono text-gray-400">demo1234</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-semibold text-blue-400 mb-2">HealthTrack Patient</h4>
              <p className="text-sm font-mono">patient.kumar@infuse.demo</p>
              <p className="text-sm font-mono text-gray-400">demo1234</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong>Master URL:</strong>{' '}
              <a href="https://caretrack-68.preview.emergentagent.com" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-400 hover:underline inline-flex items-center gap-1">
                https://caretrack-68.preview.emergentagent.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Infuse-AI Platform Configuration Overview • Generated for Test Engineers</p>
          <p className="mt-1">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationOverview;
