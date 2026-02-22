import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code, Book, Terminal, Play, Copy, Check, ChevronRight,
  ExternalLink, Zap, Shield, Activity, Globe, FileJson,
  Webhook, Clock, History, ArrowRight, Search
} from 'lucide-react';
import { InfuseLogo } from '../components/InfuseLogo';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const DeveloperPortal = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [codeExample, setCodeExample] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('docs');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/developer/categories`);
      const data = await response.json();
      setCategories(data.categories || []);
      if (data.categories?.length > 0) {
        loadCategoryEndpoints(data.categories[0].id);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryEndpoints = async (categoryId) => {
    try {
      const response = await fetch(`${API_URL}/api/developer/categories/${categoryId}`);
      const data = await response.json();
      setSelectedCategory(data);
      setEndpoints(data.endpoints || []);
      if (data.endpoints?.length > 0) {
        selectEndpoint(data.endpoints[0]);
      }
    } catch (error) {
      console.error('Failed to load endpoints:', error);
    }
  };

  const selectEndpoint = async (endpoint) => {
    setSelectedEndpoint(endpoint);
    try {
      const response = await fetch(
        `${API_URL}/api/developer/code-example?endpoint=${encodeURIComponent(endpoint.path)}&method=${endpoint.method}&language=${codeLanguage}&description=${encodeURIComponent(endpoint.description)}`
      );
      const data = await response.json();
      setCodeExample(data.code || '');
    } catch (error) {
      console.error('Failed to load code example:', error);
    }
  };

  const changeLanguage = async (lang) => {
    setCodeLanguage(lang);
    if (selectedEndpoint) {
      try {
        const response = await fetch(
          `${API_URL}/api/developer/code-example?endpoint=${encodeURIComponent(selectedEndpoint.path)}&method=${selectedEndpoint.method}&language=${lang}&description=${encodeURIComponent(selectedEndpoint.description)}`
        );
        const data = await response.json();
        setCodeExample(data.code || '');
      } catch (error) {
        console.error('Failed to load code example:', error);
      }
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-600';
      case 'POST': return 'bg-blue-600';
      case 'PUT': return 'bg-yellow-600';
      case 'DELETE': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const tabs = [
    { id: 'docs', name: 'API Documentation', icon: Book },
    { id: 'playground', name: 'Playground', icon: Play },
    { id: 'sdks', name: 'SDKs & Libraries', icon: Code },
    { id: 'webhooks', name: 'Webhooks', icon: Webhook }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <InfuseLogo size={32} darkMode={true} />
              </Link>
              <div className="hidden md:flex items-center gap-1 text-gray-400">
                <ChevronRight size={16} />
                <span className="text-white font-medium">Developer Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href={`${API_URL}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <FileJson size={18} />
                <span className="hidden md:inline">OpenAPI Spec</span>
              </a>
              <Link 
                to="/securesphere"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-12 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Infuse.AI Developer Portal
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Integrate powerful security and healthcare APIs into your applications. 
              Start building with SecureSphere and HealthTrack Pro.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-300">
                <Shield className="text-cyan-500" size={20} />
                <span>SecureSphere APIs</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-300">
                <Activity className="text-green-500" size={20} />
                <span>HealthTrack Pro APIs</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-300">
                <Globe className="text-purple-500" size={20} />
                <span>RESTful Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-cyan-400 border-b-2 border-cyan-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'docs' && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-4 sticky top-24">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  API Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => loadCategoryEndpoints(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory?.name === cat.name
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-medium">{cat.name}</div>
                      <div className="text-xs opacity-70">{cat.endpoint_count} endpoints</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Endpoints */}
            <div className="lg:col-span-3 space-y-6">
              {selectedCategory && (
                <>
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedCategory.name}</h2>
                    <p className="text-gray-400">{selectedCategory.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Endpoints List */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Endpoints</h3>
                      <div className="space-y-2">
                        {endpoints.map((endpoint, idx) => (
                          <button
                            key={idx}
                            onClick={() => selectEndpoint(endpoint)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              selectedEndpoint?.path === endpoint.path
                                ? 'bg-gray-700 border border-cyan-500'
                                : 'bg-gray-700/50 hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getMethodColor(endpoint.method)}`}>
                                {endpoint.method}
                              </span>
                              <code className="text-sm text-cyan-400">{endpoint.path}</code>
                            </div>
                            <p className="text-sm text-gray-400">{endpoint.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Code Example */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Code Example</h3>
                        <div className="flex gap-1">
                          {['python', 'javascript', 'curl'].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => changeLanguage(lang)}
                              className={`px-3 py-1 rounded text-sm transition-colors ${
                                codeLanguage === lang
                                  ? 'bg-cyan-600 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {lang === 'javascript' ? 'JS' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300">
                          <code>{codeExample}</code>
                        </pre>
                        <button
                          onClick={copyCode}
                          className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">API Playground</h2>
            <p className="text-gray-400 mb-6">
              Test API endpoints interactively. Select an endpoint and send requests directly from your browser.
            </p>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <select className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
                <input 
                  type="text"
                  placeholder="/api/securesphere/analytics/threat-trends"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                />
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors">
                  Send Request
                </button>
              </div>
              <div className="text-gray-400 text-sm">
                <p>💡 Tip: Use the interactive Swagger UI at <a href={`${API_URL}/docs`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">/docs</a> for full playground features.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sdks' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">SDKs & Client Libraries</h2>
              <p className="text-gray-400 mb-6">
                Use our official SDKs to integrate Infuse.AI APIs into your applications quickly. All SDKs are production-ready with full feature support.
              </p>
              
              {/* Server SDKs */}
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Terminal size={20} className="text-cyan-400" />
                Server SDKs
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { lang: 'Python', cmd: 'pip install infuse-ai-sdk', status: 'available', icon: '🐍', downloadId: 'python', version: '1.0.0' },
                  { lang: 'JavaScript/Node.js', cmd: 'npm install @infuse-ai/sdk', status: 'available', icon: '⚡', downloadId: 'javascript', version: '1.0.0' },
                  { lang: 'Java', cmd: 'Maven: ai.infuse:infuse-sdk:1.0.0', status: 'available', icon: '☕', downloadId: 'java', version: '1.0.0' },
                  { lang: 'PHP', cmd: 'composer require infuse-ai/sdk', status: 'available', icon: '🐘', downloadId: 'php', version: '1.0.0' }
                ].map((sdk, idx) => (
                  <div key={idx} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{sdk.icon}</span>
                        <span className="font-medium text-white">{sdk.lang}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">v{sdk.version}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          sdk.status === 'available' 
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {sdk.status === 'available' ? 'Available' : 'Coming Soon'}
                        </span>
                      </div>
                    </div>
                    <code className="text-sm text-cyan-400 bg-gray-900 px-2 py-1 rounded block mb-3">
                      {sdk.cmd}
                    </code>
                    <div className="flex gap-2">
                      <a 
                        href={`${API_URL}/api/developer/sdk/${sdk.downloadId}/download`}
                        className="flex-1 text-center px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded transition-colors"
                      >
                        Download SDK
                      </a>
                      <a 
                        href={`${API_URL}/api/developer/sdk/${sdk.downloadId}/docs`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors"
                      >
                        Docs
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile SDKs */}
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity size={20} className="text-green-400" />
                Mobile SDKs
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { lang: 'Android (Kotlin)', cmd: "implementation 'ai.infuse:android-sdk:1.0.0'", status: 'available', icon: '🤖', downloadId: 'android', version: '1.0.0' },
                  { lang: 'iOS (Swift)', cmd: '.package(url: "github.com/infuse-ai/ios-sdk")', status: 'available', icon: '🍎', downloadId: 'ios', version: '1.0.0' }
                ].map((sdk, idx) => (
                  <div key={idx} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{sdk.icon}</span>
                        <span className="font-medium text-white">{sdk.lang}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">v{sdk.version}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          sdk.status === 'available' 
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {sdk.status === 'available' ? 'Available' : 'Coming Soon'}
                        </span>
                      </div>
                    </div>
                    <code className="text-sm text-cyan-400 bg-gray-900 px-2 py-1 rounded block mb-3 break-all">
                      {sdk.cmd}
                    </code>
                    <div className="flex gap-2">
                      <a 
                        href={`${API_URL}/api/developer/sdk/${sdk.downloadId}/download`}
                        className="flex-1 text-center px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded transition-colors"
                      >
                        Download SDK
                      </a>
                      <a 
                        href={`${API_URL}/api/developer/sdk/${sdk.downloadId}/docs`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors"
                      >
                        Docs
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Other Resources</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a 
                  href={`${API_URL}/openapi.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FileJson className="text-cyan-500" size={24} />
                  <div>
                    <div className="font-medium text-white">OpenAPI Spec</div>
                    <div className="text-sm text-gray-400">JSON schema</div>
                  </div>
                </a>
                <a 
                  href={`${API_URL}/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Book className="text-green-500" size={24} />
                  <div>
                    <div className="font-medium text-white">Swagger UI</div>
                    <div className="text-sm text-gray-400">Interactive docs</div>
                  </div>
                </a>
                <a 
                  href={`${API_URL}/api/developer/postman-collection`}
                  className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Zap className="text-orange-500" size={24} />
                  <div>
                    <div className="font-medium text-white">Postman</div>
                    <div className="text-sm text-gray-400">Collection</div>
                  </div>
                </a>
                <a 
                  href="https://github.com/infuse-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Code className="text-purple-500" size={24} />
                  <div>
                    <div className="font-medium text-white">GitHub</div>
                    <div className="text-sm text-gray-400">Source code</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Webhook Integration</h2>
            <p className="text-gray-400 mb-6">
              Receive real-time notifications for security events, compliance alerts, and more.
            </p>
            <div className="space-y-4">
              {[
                { event: 'threat.detected', desc: 'New threat detected (URL, SMS, IoT)', severity: 'high' },
                { event: 'compliance.alert', desc: 'Compliance status change', severity: 'medium' },
                { event: 'device.registered', desc: 'New device registered', severity: 'low' }
              ].map((webhook, idx) => (
                <div key={idx} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-cyan-400 font-medium">{webhook.event}</code>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      webhook.severity === 'high' ? 'bg-red-900/50 text-red-400' :
                      webhook.severity === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-green-900/50 text-green-400'
                    }`}>
                      {webhook.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{webhook.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperPortal;
