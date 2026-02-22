import React from 'react';

const ArchitectureOverview = () => {
  const handleDownloadWord = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/api/docs/architecture-word`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white p-8 font-mono text-sm">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">INFUSE-AI PLATFORM</h1>
            <p className="text-gray-600">Architecture & Modularity Overview | v2.0.0</p>
          </div>
          <button
            onClick={handleDownloadWord}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Word
          </button>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="border-2 border-black p-4">
            <div className="text-4xl font-bold">67</div>
            <div>API Routes</div>
          </div>
          <div className="border-2 border-black p-4">
            <div className="text-4xl font-bold">72</div>
            <div>Backend Modules</div>
          </div>
          <div className="border-2 border-black p-4">
            <div className="text-4xl font-bold">60+</div>
            <div>DB Collections</div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="border-2 border-black p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 border-b border-black pb-2">SYSTEM ARCHITECTURE</h2>
          <pre className="text-xs leading-relaxed overflow-x-auto">
{`
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + Vite)                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ PUBLIC PAGES │  │  DASHBOARDS  │  │    ADMIN     │  │     COMPONENTS       │ │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────────────┤ │
│  │ Landing      │  │ Doctor       │  │ Unified      │  │ HealthTrack (14)     │ │
│  │ Login/Reg    │  │ Patient      │  │ Enterprise   │  │ SecureSphere (13)    │ │
│  │ Downloads    │  │ HealthTrack  │  │ Super Admin  │  │ Dashboard (15)       │ │
│  │ Developer    │  │ SecureSphere │  │ Config       │  │ UI/shadcn (40+)      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND (FastAPI + Python)                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                           API ROUTER (/api)                                  ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│         │                    │                    │                    │         │
│         ▼                    ▼                    ▼                    ▼         │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐ │
│  │    CORE     │      │ HEALTHTRACK │      │ SECURESPHERE│      │ ENTERPRISE  │ │
│  ├─────────────┤      ├─────────────┤      ├─────────────┤      ├─────────────┤ │
│  │ auth        │      │ patients    │      │ url_scanner │      │ sso         │ │
│  │ organization│      │ appointments│      │ sms_analyzer│      │ bulk_export │ │
│  │ subscription│      │ vitals      │      │ threat_score│      │ ip_whitelist│ │
│  │ billing     │      │ prescriptns │      │ devices     │      │ audit_logs  │ │
│  │ dashboard   │      │ lab_tests   │      │ iot_security│      │ api_keys    │ │
│  │ language    │      │ ai_analysis │      │ automotive  │      │ licenses    │ │
│  │ notifications│     │ video_consent│     │ gsm_fraud   │      │ analytics   │ │
│  └─────────────┘      │ telemedicine│      │ telecom     │      └─────────────┘ │
│                       │ abdm        │      │ vran        │                       │
│                       └─────────────┘      └─────────────┘                       │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │ INTEGRATIONS: webhooks | developer_portal | oem_sdk | feature_flags | alerts││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE (MongoDB)                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  users | doctors | patients | organizations | sessions | appointments           │
│  prescriptions | vitals | health_records | video_consents | drug_database       │
│  security_devices | url_scans | sms_analyses | threat_alerts | threat_scores    │
│  api_keys | audit_logs | webhooks | subscriptions | billing_records             │
└─────────────────────────────────────────────────────────────────────────────────┘
`}
          </pre>
        </div>

        {/* Two Products */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="border-2 border-red-500 p-4">
            <h3 className="text-lg font-bold text-red-600 border-b border-red-500 pb-2 mb-3">
              HEALTHTRACK PRO (Healthcare)
            </h3>
            <div className="space-y-1 text-xs">
              <div><strong>Routes:</strong> /api/healthtrack/*</div>
              <div><strong>Modules:</strong> 12 API endpoints</div>
              <div><strong>Components:</strong> 14 React components</div>
              <div><strong>Collections:</strong> 11 MongoDB collections</div>
              <div><strong>Roles:</strong> Admin, Doctor, Patient, Enterprise</div>
              <div className="pt-2 border-t mt-2">
                <strong>Features:</strong> Patients, Appointments, Vitals, 
                Prescriptions, Lab Tests, AI Analysis, Video Consent, 
                Telemedicine, ABDM Integration
              </div>
            </div>
          </div>
          <div className="border-2 border-orange-500 p-4">
            <h3 className="text-lg font-bold text-orange-600 border-b border-orange-500 pb-2 mb-3">
              SECURESPHERE (Cybersecurity)
            </h3>
            <div className="space-y-1 text-xs">
              <div><strong>Routes:</strong> /api/securesphere/*</div>
              <div><strong>Modules:</strong> 11 API endpoints</div>
              <div><strong>Components:</strong> 13 React components</div>
              <div><strong>Collections:</strong> 20 MongoDB collections</div>
              <div><strong>Tiers:</strong> Consumer, Enterprise, Telecom, Automotive</div>
              <div className="pt-2 border-t mt-2">
                <strong>Features:</strong> URL Scanner, SMS Analyzer, 
                Threat Scoring, Device Registry, IoT Security, 
                Automotive Security, GSM Fraud, vRAN Integration
              </div>
            </div>
          </div>
        </div>

        {/* Module Structure */}
        <div className="border-2 border-black p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 border-b border-black pb-2">MODULE STRUCTURE</h2>
          <div className="grid grid-cols-2 gap-8">
            <pre className="text-xs">
{`/app/backend/
├── server.py           # Main FastAPI app
├── dependencies.py     # Shared dependencies
├── routes/
│   ├── auth.py         # Authentication
│   ├── patients.py     # Patient CRUD
│   ├── appointments.py # Scheduling
│   ├── vitals.py       # Vitals recording
│   ├── ai_health_analysis.py
│   ├── video_consent.py
│   ├── securesphere/
│   │   ├── url_scanner.py
│   │   ├── sms_analyzer.py
│   │   ├── threat_scoring.py
│   │   ├── iot_security.py
│   │   └── automotive_security.py
│   ├── enterprise/
│   │   ├── sso.py
│   │   ├── bulk_export.py
│   │   └── audit_logs.py
│   └── admin/
│       ├── api_keys.py
│       └── license_management.py
└── services/
    └── alerts_service.py`}
            </pre>
            <pre className="text-xs">
{`/app/frontend/src/
├── App.js              # Router config
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── dashboard/
│   │   ├── DoctorDashboard.jsx
│   │   ├── PatientDashboard.jsx
│   │   ├── HealthTrackPro.jsx
│   │   └── SecureSphere.jsx
│   ├── admin/
│   │   ├── UnifiedAdminDashboard.jsx
│   │   ├── EnterpriseAdminDashboard.jsx
│   │   └── SuperAdminPanel.jsx
│   └── securesphere/
│       ├── SecureSphereDashboard.jsx
│       └── ThreatCenter.jsx
├── components/
│   ├── healthtrack/    # 14 components
│   ├── securesphere/   # 13 components
│   ├── dashboard/      # 15 components
│   └── ui/             # shadcn (40+)
└── contexts/
    ├── AuthContext.jsx
    └── LanguageContext.jsx`}
            </pre>
          </div>
        </div>

        {/* API Endpoints Summary */}
        <div className="border-2 border-black p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 border-b border-black pb-2">KEY API ENDPOINTS</h2>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <h4 className="font-bold mb-2">CORE</h4>
              <div className="space-y-1">
                <div>/api/auth/login</div>
                <div>/api/auth/register</div>
                <div>/api/organization</div>
                <div>/api/subscription</div>
                <div>/api/dashboard</div>
                <div>/api/language</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-red-600">HEALTHTRACK</h4>
              <div className="space-y-1">
                <div>/api/healthtrack/patients</div>
                <div>/api/healthtrack/appointments</div>
                <div>/api/healthtrack/vitals</div>
                <div>/api/healthtrack/prescriptions</div>
                <div>/api/healthtrack/ai-analysis</div>
                <div>/api/healthtrack/video-consent</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-orange-600">SECURESPHERE</h4>
              <div className="space-y-1">
                <div>/api/securesphere/url-scanner</div>
                <div>/api/securesphere/sms-analyzer</div>
                <div>/api/securesphere/threat-scoring</div>
                <div>/api/securesphere/devices</div>
                <div>/api/securesphere/iot</div>
                <div>/api/securesphere/automotive</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack & Integrations */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="border-2 border-black p-4">
            <h3 className="font-bold border-b border-black pb-2 mb-3">TECH STACK</h3>
            <div className="text-xs space-y-1">
              <div><strong>Frontend:</strong> React 18, Vite, TailwindCSS, shadcn/ui</div>
              <div><strong>Backend:</strong> FastAPI, Python 3.11, Pydantic</div>
              <div><strong>Database:</strong> MongoDB Atlas, Motor (async)</div>
              <div><strong>Auth:</strong> JWT, bcrypt, OAuth2</div>
              <div><strong>Charts:</strong> Recharts</div>
              <div><strong>Mobile:</strong> Capacitor (iOS/Android)</div>
              <div><strong>i18n:</strong> 6 languages supported</div>
            </div>
          </div>
          <div className="border-2 border-black p-4">
            <h3 className="font-bold border-b border-black pb-2 mb-3">3RD PARTY INTEGRATIONS</h3>
            <div className="text-xs space-y-1">
              <div>✓ OpenAI/Gemini (AI Analysis) - <span className="text-green-600">ACTIVE</span></div>
              <div>✓ Razorpay (Payments) - <span className="text-green-600">ACTIVE</span></div>
              <div>○ Twilio (SMS/WhatsApp) - <span className="text-yellow-600">MOCKED</span></div>
              <div>○ SendGrid (Email) - <span className="text-yellow-600">MOCKED</span></div>
              <div>✓ Recharts (Dashboards) - <span className="text-green-600">ACTIVE</span></div>
              <div>✓ Capacitor (Mobile) - <span className="text-green-600">ACTIVE</span></div>
            </div>
          </div>
        </div>

        {/* Feature Modularity */}
        <div className="border-2 border-black p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 border-b border-black pb-2">FEATURE MODULARITY</h2>
          <div className="grid grid-cols-4 gap-3 text-xs">
            {[
              { name: 'AI Health Analysis', module: 'ai_health_analysis.py', status: 'ON' },
              { name: 'Video Consent', module: 'video_consent.py', status: 'ON' },
              { name: 'ABDM Integration', module: 'abdm.py', status: 'ON' },
              { name: 'Wearable Sync', module: 'wearable_devices.py', status: 'ON' },
              { name: 'URL Scanner', module: 'url_scanner.py', status: 'ON' },
              { name: 'SMS Analyzer', module: 'sms_analyzer.py', status: 'ON' },
              { name: 'IoT Security', module: 'iot_security.py', status: 'ON' },
              { name: 'Automotive', module: 'automotive_security.py', status: 'ON' },
              { name: 'vRAN Integration', module: 'vran_api.py', status: 'ON' },
              { name: 'SSO Auth', module: 'sso.py', status: 'ON' },
              { name: 'Webhooks', module: 'webhooks.py', status: 'ON' },
              { name: 'Real Alerts', module: 'alerts.py', status: 'MOCK' },
            ].map((f, i) => (
              <div key={i} className={`p-2 border ${f.status === 'ON' ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
                <div className="font-bold">{f.name}</div>
                <div className="text-gray-500">{f.module}</div>
                <div className={f.status === 'ON' ? 'text-green-600' : 'text-yellow-600'}>[{f.status}]</div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Credentials */}
        <div className="border-2 border-black p-6 bg-gray-100">
          <h2 className="text-xl font-bold mb-4 border-b border-black pb-2">TEST CREDENTIALS</h2>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div>
              <div className="font-bold">Admin</div>
              <div>admin@infuse.demo</div>
              <div className="text-gray-500">admin1234</div>
            </div>
            <div>
              <div className="font-bold">Doctor</div>
              <div>doctor.priya@infuse.demo</div>
              <div className="text-gray-500">demo1234</div>
            </div>
            <div>
              <div className="font-bold">Enterprise</div>
              <div>enterprise@infuse.demo</div>
              <div className="text-gray-500">demo1234</div>
            </div>
            <div>
              <div className="font-bold">Patient</div>
              <div>patient.kumar@infuse.demo</div>
              <div className="text-gray-500">demo1234</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-black">
            <strong>URL:</strong> https://caretrack-68.preview.emergentagent.com
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs mt-8 pt-4 border-t">
          Infuse-AI Platform Architecture Document | Generated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureOverview;
