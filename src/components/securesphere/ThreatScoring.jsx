import React, { useState } from 'react';
import {
  Activity, Shield, Wifi, Smartphone, Brain, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronUp,
  Lock, Unlock, Eye, Server, Globe
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ThreatScoring = () => {
  const { t } = useLanguage();
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [showFactors, setShowFactors] = useState(false);
  
  const [deviceContext, setDeviceContext] = useState({
    device_id: 'demo-device-001',
    platform: 'android',
    network_type: 'wifi',
    network_name: 'Home-WiFi',
    vpn_enabled: false,
    installed_apps: ['WhatsApp', 'Chrome', 'Gmail', 'Maps', 'Banking App'],
    security_updates: true,
    rooted: false,
    location_country: 'IN'
  });

  const calculateThreatScore = async () => {
    setCalculating(true);
    try {
      const response = await fetch(`${API_URL}/api/securesphere/threat-score/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceContext)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error calculating threat score:', error);
    } finally {
      setCalculating(false);
    }
  };

  const getThreatLevelColor = (level) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100'
    };
    return colors[level] || colors.medium;
  };

  const getScoreColor = (score) => {
    if (score <= 24) return 'text-green-600';
    if (score <= 49) return 'text-yellow-600';
    if (score <= 74) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score) => {
    if (score <= 24) return 'from-green-500 to-green-400';
    if (score <= 49) return 'from-yellow-500 to-yellow-400';
    if (score <= 74) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  const factors = [
    {
      id: 'network',
      name: 'Network Security',
      icon: Wifi,
      weight: '25%',
      description: 'Analyzes network type, VPN usage, and known network threats'
    },
    {
      id: 'apps',
      name: 'App Security',
      icon: Smartphone,
      weight: '25%',
      description: 'Checks installed apps for malware, permissions, and vulnerabilities'
    },
    {
      id: 'behavior',
      name: 'Behavior Analysis',
      icon: Activity,
      weight: '20%',
      description: 'Monitors unusual patterns and suspicious activities'
    },
    {
      id: 'ai_context',
      name: 'AI Context',
      icon: Brain,
      weight: '30%',
      description: 'AI-powered threat intelligence and pattern recognition'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Real-Time Threat Scoring</h2>
        <p className="text-gray-600">Calculate security risk score based on multiple factors</p>
      </div>

      {/* Device Context Form */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Context</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <select
              value={deviceContext.platform}
              onChange={(e) => setDeviceContext({ ...deviceContext, platform: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="android">Android</option>
              <option value="ios">iOS</option>
              <option value="windows">Windows</option>
              <option value="macos">macOS</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Network Type</label>
            <select
              value={deviceContext.network_type}
              onChange={(e) => setDeviceContext({ ...deviceContext, network_type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="wifi">WiFi</option>
              <option value="mobile">Mobile Data</option>
              <option value="public_wifi">Public WiFi</option>
              <option value="ethernet">Ethernet</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Network Name</label>
            <input
              type="text"
              value={deviceContext.network_name}
              onChange={(e) => setDeviceContext({ ...deviceContext, network_name: e.target.value })}
              placeholder="e.g., Home-WiFi"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deviceContext.vpn_enabled}
                onChange={(e) => setDeviceContext({ ...deviceContext, vpn_enabled: e.target.checked })}
                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700">VPN Enabled</span>
            </label>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deviceContext.security_updates}
                onChange={(e) => setDeviceContext({ ...deviceContext, security_updates: e.target.checked })}
                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700">Security Updates Enabled</span>
            </label>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deviceContext.rooted}
                onChange={(e) => setDeviceContext({ ...deviceContext, rooted: e.target.checked })}
                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700">Device Rooted/Jailbroken</span>
            </label>
          </div>
        </div>
        
        <div className="mt-4">
          <Button
            onClick={calculateThreatScore}
            disabled={calculating}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            {calculating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Calculate Threat Score
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Scoring Factors */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <button
          onClick={() => setShowFactors(!showFactors)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-cyan-600" />
            <span className="font-semibold text-gray-900">Scoring Factors</span>
          </div>
          {showFactors ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {showFactors && (
          <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            {factors.map((factor) => (
              <div key={factor.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <factor.icon className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{factor.name}</h4>
                    <span className="text-sm text-cyan-600 font-semibold">{factor.weight} weight</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className={`p-6 bg-gradient-to-r ${getScoreGradient(result.overall_threat_score)} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm uppercase tracking-wide">Overall Threat Score</p>
                <p className="text-5xl font-bold mt-1">{result.overall_threat_score}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-semibold`}>
                  {result.threat_level?.toUpperCase() || 'UNKNOWN'}
                </span>
                <p className="text-white/80 text-sm mt-2">
                  {result.threat_level === 'low' && 'Your device is secure'}
                  {result.threat_level === 'medium' && 'Some risks detected'}
                  {result.threat_level === 'high' && 'Immediate attention needed'}
                  {result.threat_level === 'critical' && 'Critical security threat'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Factor Analysis</h4>
            <div className="space-y-4">
              {result.factor_analysis && Object.entries(result.factor_analysis).map(([key, value]) => {
                const factorInfo = factors.find(f => f.id === key.replace('_security', '').replace('_analysis', '').replace('_context', ''));
                const Icon = factorInfo?.icon || Shield;
                const score = value?.score || value || 0;
                
                return (
                  <div key={key} className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                          {score}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(score)}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Threat Level Legend */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Threat Level Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Low (0-24)</span>
            </div>
            <p className="text-xs text-green-600">Secure - No immediate action needed</p>
          </div>
          
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Medium (25-49)</span>
            </div>
            <p className="text-xs text-yellow-600">Caution - Review recommendations</p>
          </div>
          
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-800">High (50-74)</span>
            </div>
            <p className="text-xs text-orange-600">Warning - Take action soon</p>
          </div>
          
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">Critical (75-100)</span>
            </div>
            <p className="text-xs text-red-600">Danger - Immediate action required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatScoring;
