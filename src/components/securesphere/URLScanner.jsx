import React, { useState, useEffect } from 'react';
import { 
  Shield, Link as LinkIcon, AlertTriangle, Check, X, Search, 
  Loader2, History, Flag, ChevronRight, ExternalLink, Copy,
  ShieldCheck, ShieldAlert, ShieldX, Info
} from 'lucide-react';
import { urlScannerApi } from '../../services/secureSphereApi';

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
    loadHistory();
  }, []);

  const loadStats = async () => {
    try {
      const data = await urlScannerApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await urlScannerApi.getHistory(null, 10);
      setHistory(data.scans || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to scan');
      return;
    }

    setError(null);
    setScanning(true);
    setResult(null);

    try {
      const data = await urlScannerApi.scan(url, 'Manual scan from dashboard');
      setResult(data);
      loadHistory();
      loadStats();
    } catch (err) {
      setError('Failed to scan URL. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const getThreatIcon = (level) => {
    switch (level) {
      case 'low': return <ShieldCheck className="h-6 w-6 text-green-500" />;
      case 'medium': return <Shield className="h-6 w-6 text-yellow-500" />;
      case 'high': return <ShieldAlert className="h-6 w-6 text-orange-500" />;
      case 'critical': return <ShieldX className="h-6 w-6 text-red-500" />;
      default: return <Shield className="h-6 w-6 text-gray-500" />;
    }
  };

  const getThreatColor = (level) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <LinkIcon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">URL Scanner</h2>
            <p className="text-blue-100 mt-1">Detect phishing, malware, and suspicious links</p>
          </div>
        </div>
        
        {stats && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm text-blue-100">Total Scans</p>
              <p className="text-2xl font-bold">{stats.total_scans}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm text-blue-100">Threats Detected</p>
              <p className="text-2xl font-bold">{stats.malicious_detected}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm text-blue-100">Detection Rate</p>
              <p className="text-2xl font-bold">{stats.detection_rate}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Scanner Input */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter URL to scan (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleScan}
            disabled={scanning}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {scanning ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Scanning...</>
            ) : (
              <><Search className="h-5 w-5" /> Scan URL</>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}
      </div>

      {/* Scan Result */}
      {result && (
        <div className={`rounded-xl border p-6 ${getThreatColor(result.threat_level)}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getThreatIcon(result.threat_level)}
              <div>
                <h3 className="text-lg font-semibold capitalize">
                  {result.threat_level} Risk
                </h3>
                <p className="text-sm opacity-80 truncate max-w-md">{result.url}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{result.risk_score}</p>
              <p className="text-sm opacity-80">Risk Score</p>
            </div>
          </div>
          
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium capitalize">{result.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Confidence:</span>
                  <span className="font-medium">{(result.ai_confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Safe to Visit:</span>
                  <span className="font-medium">
                    {result.safe_to_visit ? (
                      <span className="text-green-600 flex items-center gap-1"><Check className="h-4 w-4" /> Yes</span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1"><X className="h-4 w-4" /> No</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Threats Detected</h4>
              {result.threats_detected?.length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {result.threats_detected.map((threat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      {threat}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <Check className="h-4 w-4" /> No threats detected
                </p>
              )}
            </div>
          </div>
          
          {result.recommendations?.length > 0 && (
            <div className="mt-4 bg-white/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1 text-sm">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recent Scans */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5 text-gray-500" />
            Recent Scans
          </h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 text-sm hover:underline"
          >
            {showHistory ? 'Hide' : 'Show All'}
          </button>
        </div>
        
        <div className="space-y-2">
          {history.slice(0, showHistory ? 10 : 3).map((scan) => (
            <div 
              key={scan.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setUrl(scan.url);
                setResult(scan.result);
              }}
            >
              <div className="flex items-center gap-3">
                {getThreatIcon(scan.result?.threat_level)}
                <div>
                  <p className="font-medium truncate max-w-xs">{scan.url}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(scan.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getThreatColor(scan.result?.threat_level)}`}>
                  {scan.result?.risk_score || 0}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
          
          {history.length === 0 && (
            <p className="text-center text-gray-500 py-8">No scans yet. Enter a URL above to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default URLScanner;
