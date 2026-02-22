import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, AlertTriangle, Check, X, Loader2, 
  Shield, ShieldAlert, ShieldX, ShieldCheck, Send,
  History, Info, Phone, Link as LinkIcon
} from 'lucide-react';
import { smsAnalyzerApi } from '../../services/secureSphereApi';

const SMSAnalyzer = () => {
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [fraudTypes, setFraudTypes] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFraudTypes();
    loadStats();
  }, []);

  const loadFraudTypes = async () => {
    try {
      const data = await smsAnalyzerApi.getFraudTypes();
      setFraudTypes(data.fraud_types || []);
    } catch (err) {
      console.error('Failed to load fraud types:', err);
    }
  };

  const loadStats = async () => {
    try {
      const data = await smsAnalyzerApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Please enter an SMS message to analyze');
      return;
    }

    setError(null);
    setAnalyzing(true);
    setResult(null);

    try {
      const data = await smsAnalyzerApi.analyze(message, sender || null);
      setResult(data);
      loadStats();
    } catch (err) {
      setError('Failed to analyze SMS. Please try again.');
    } finally {
      setAnalyzing(false);
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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <ShieldX className="h-5 w-5 text-red-500" />;
      case 'high': return <ShieldAlert className="h-5 w-5 text-orange-500" />;
      case 'medium': return <Shield className="h-5 w-5 text-yellow-500" />;
      default: return <ShieldCheck className="h-5 w-5 text-green-500" />;
    }
  };

  // Sample messages for testing
  const sampleMessages = [
    { label: 'Phishing', message: 'Your account has been suspended. Click here to verify: http://fake-bank.com/verify', sender: 'ALERT' },
    { label: 'OTP Scam', message: 'This is your bank calling. Please share your OTP 123456 to complete the verification.', sender: '+919876543210' },
    { label: 'Prize Scam', message: 'Congratulations! You won Rs.50 lakhs in lottery. Pay Rs.500 to claim: bit.ly/claim', sender: 'PRIZE' },
    { label: 'Legitimate', message: 'Your order #12345 has been shipped. Track at amazon.in/track', sender: 'AMAZON' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">SMS Fraud Analyzer</h2>
            <p className="text-purple-100 mt-1">Detect phishing, financial fraud, and scam messages</p>
          </div>
        </div>
        
        {stats && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm text-purple-100">Analyzed</p>
              <p className="text-2xl font-bold">{stats.total_analyses}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm text-purple-100">Fraud Detected</p>
              <p className="text-2xl font-bold">{stats.fraud_detected}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm text-purple-100">Spam Blocked</p>
              <p className="text-2xl font-bold">{stats.spam_detected}</p>
            </div>
          </div>
        )}
      </div>

      {/* Analyzer Input */}
      <div className="bg-white rounded-xl border p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sender (optional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., HDFC-BK, +919876543210"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMS Message *</label>
            <textarea
              placeholder="Paste the suspicious SMS message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {sampleMessages.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => { setMessage(sample.message); setSender(sample.sender); }}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                >
                  Try: {sample.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              {analyzing ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing...</>
              ) : (
                <><Send className="h-5 w-5" /> Analyze</>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}
      </div>

      {/* Analysis Result */}
      {result && (
        <div className={`rounded-xl border p-6 ${getThreatColor(result.threat_level)}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {result.is_fraud ? (
                <ShieldX className="h-8 w-8 text-red-500" />
              ) : result.is_spam ? (
                <ShieldAlert className="h-8 w-8 text-orange-500" />
              ) : (
                <ShieldCheck className="h-8 w-8 text-green-500" />
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  {result.is_fraud ? 'Fraud Detected!' : result.is_spam ? 'Spam Detected' : 'Message Appears Safe'}
                </h3>
                <p className="text-sm opacity-80 capitalize">Type: {result.fraud_type?.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{result.risk_score}</p>
              <p className="text-sm opacity-80">Risk Score</p>
            </div>
          </div>
          
          <div className="mt-4 bg-white/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">AI Analysis</h4>
            <p className="text-sm">{result.ai_analysis}</p>
          </div>
          
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {result.pattern_matches?.length > 0 && (
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Pattern Matches</h4>
                <ul className="space-y-1 text-sm">
                  {result.pattern_matches.map((match, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      {match}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {(result.extracted_urls?.length > 0 || result.extracted_phones?.length > 0) && (
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Extracted Data</h4>
                {result.extracted_urls?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">URLs:</p>
                    {result.extracted_urls.map((url, idx) => (
                      <p key={idx} className="text-sm flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" /> {url}
                      </p>
                    ))}
                  </div>
                )}
                {result.extracted_phones?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone Numbers:</p>
                    {result.extracted_phones.map((phone, idx) => (
                      <p key={idx} className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {phone}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
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

      {/* Fraud Types Reference */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4">Common Fraud Types</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fraudTypes.map((type) => (
            <div key={type.type} className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getSeverityIcon(type.severity)}
                <span className="font-medium">{type.name}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{type.description}</p>
              <div className="text-xs text-gray-400 italic">
                "{type.examples?.[0]?.substring(0, 50)}..."
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SMSAnalyzer;
