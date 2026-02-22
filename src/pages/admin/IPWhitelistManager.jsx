import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Globe, Clock, Plus, Trash2, Edit, CheckCircle, XCircle,
  AlertTriangle, RefreshCw, Loader2, MapPin, Save, Lock, Unlock
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const IPWhitelistManager = ({ orgId, adminToken }) => {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [rules, setRules] = useState([]);
  const [geoRestrictions, setGeoRestrictions] = useState({ enabled: false, allowed_countries: [], blocked_countries: [] });
  const [timeRestrictions, setTimeRestrictions] = useState({ enabled: false, allowed_hours_start: 0, allowed_hours_end: 23, allowed_days: [] });
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({ ip_or_cidr: '', description: '', rule_type: 'allow', expires_at: '' });
  const [testIp, setTestIp] = useState('');
  const [testResult, setTestResult] = useState(null);

  const headers = {
    'x-org-id': orgId || 'test-enterprise-org',
    'x-admin-token': adminToken || 'test-token',
    'Content-Type': 'application/json'
  };

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ip-whitelist/config`, { headers });
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
        setRules(data.config?.rules || []);
        setGeoRestrictions(data.config?.geo_restrictions || { enabled: false, allowed_countries: [], blocked_countries: [] });
        setTimeRestrictions(data.config?.time_restrictions || { enabled: false, allowed_hours_start: 0, allowed_hours_end: 23, allowed_days: [] });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  }, [orgId, adminToken]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const toggleEnabled = async () => {
    const newEnabled = !config?.enabled;
    const updatedConfig = { ...config, enabled: newEnabled, rules, geo_restrictions: geoRestrictions, time_restrictions: timeRestrictions };
    
    try {
      const response = await fetch(`${API_URL}/api/ip-whitelist/config`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          enabled: newEnabled,
          default_action: config?.default_action || 'deny',
          rules: rules.map(r => ({ ip_or_cidr: r.ip_or_cidr, description: r.description, rule_type: r.rule_type, expires_at: r.expires_at })),
          geo_restrictions: geoRestrictions,
          time_restrictions: timeRestrictions
        })
      });
      
      if (response.ok) {
        setConfig({ ...config, enabled: newEnabled });
      }
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const addRule = async () => {
    if (!newRule.ip_or_cidr) return;
    
    try {
      const response = await fetch(`${API_URL}/api/ip-whitelist/rules`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newRule)
      });
      
      if (response.ok) {
        const data = await response.json();
        setRules([...rules, data.rule]);
        setNewRule({ ip_or_cidr: '', description: '', rule_type: 'allow', expires_at: '' });
        setShowAddRule(false);
      }
    } catch (error) {
      console.error('Error adding rule:', error);
    }
  };

  const deleteRule = async (ruleId) => {
    try {
      const response = await fetch(`${API_URL}/api/ip-whitelist/rules/${ruleId}`, {
        method: 'DELETE',
        headers
      });
      
      if (response.ok) {
        setRules(rules.filter(r => r.id !== ruleId));
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const testIpAccess = async () => {
    if (!testIp) return;
    
    try {
      const response = await fetch(`${API_URL}/api/ip-whitelist/validate?ip_address=${testIp}`, {
        method: 'POST',
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(data);
      }
    } catch (error) {
      console.error('Error testing IP:', error);
    }
  };

  const updateGeoRestrictions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ip-whitelist/geo`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(geoRestrictions)
      });
      
      if (response.ok) {
        alert('Geo restrictions updated successfully!');
      }
    } catch (error) {
      console.error('Error updating geo restrictions:', error);
    }
  };

  const countries = ['US', 'IN', 'GB', 'DE', 'FR', 'JP', 'AU', 'CA', 'BR', 'CN', 'RU', 'KR', 'SG', 'AE'];
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">IP Whitelisting</h2>
          <p className="text-gray-500 text-sm">Control access based on IP addresses, geo-location, and time</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchConfig}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{config?.enabled ? 'Enabled' : 'Disabled'}</span>
            <button
              onClick={toggleEnabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                config?.enabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config?.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* IP Rules */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            IP Rules
          </h3>
          <button
            onClick={() => setShowAddRule(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        {/* Add Rule Form */}
        {showAddRule && (
          <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="IP or CIDR (e.g., 192.168.1.0/24)"
                value={newRule.ip_or_cidr}
                onChange={(e) => setNewRule({ ...newRule, ip_or_cidr: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newRule.rule_type}
                onChange={(e) => setNewRule({ ...newRule, rule_type: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="allow">Allow</option>
                <option value="deny">Deny</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={addRule}
                  className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddRule(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rules List */}
        <div className="space-y-2">
          {rules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No IP rules configured. All access is {config?.default_action === 'allow' ? 'allowed' : 'denied'} by default.
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {rule.rule_type === 'allow' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <span className="font-mono text-gray-900">{rule.ip_or_cidr}</span>
                    {rule.description && (
                      <span className="text-gray-500 text-sm ml-2">- {rule.description}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    rule.rule_type === 'allow' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {rule.rule_type}
                  </span>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Geo Restrictions */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" />
            Geo Restrictions
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{geoRestrictions.enabled ? 'Enabled' : 'Disabled'}</span>
            <button
              onClick={() => setGeoRestrictions({ ...geoRestrictions, enabled: !geoRestrictions.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                geoRestrictions.enabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  geoRestrictions.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Countries</label>
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    const allowed = geoRestrictions.allowed_countries || [];
                    if (allowed.includes(country)) {
                      setGeoRestrictions({ ...geoRestrictions, allowed_countries: allowed.filter(c => c !== country) });
                    } else {
                      setGeoRestrictions({ ...geoRestrictions, allowed_countries: [...allowed, country] });
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    (geoRestrictions.allowed_countries || []).includes(country)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blocked Countries</label>
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    const blocked = geoRestrictions.blocked_countries || [];
                    if (blocked.includes(country)) {
                      setGeoRestrictions({ ...geoRestrictions, blocked_countries: blocked.filter(c => c !== country) });
                    } else {
                      setGeoRestrictions({ ...geoRestrictions, blocked_countries: [...blocked, country] });
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    (geoRestrictions.blocked_countries || []).includes(country)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={updateGeoRestrictions}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          <Save className="w-4 h-4" />
          Save Geo Settings
        </button>
      </div>

      {/* Time Restrictions */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Time-Based Access
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{timeRestrictions.enabled ? 'Enabled' : 'Disabled'}</span>
            <button
              onClick={() => setTimeRestrictions({ ...timeRestrictions, enabled: !timeRestrictions.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                timeRestrictions.enabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  timeRestrictions.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Hour</label>
            <select
              value={timeRestrictions.allowed_hours_start}
              onChange={(e) => setTimeRestrictions({ ...timeRestrictions, allowed_hours_start: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Hour</label>
            <select
              value={timeRestrictions.allowed_hours_end}
              onChange={(e) => setTimeRestrictions({ ...timeRestrictions, allowed_hours_end: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Days</label>
            <div className="flex flex-wrap gap-1">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    const allowed = timeRestrictions.allowed_days || [];
                    if (allowed.includes(day)) {
                      setTimeRestrictions({ ...timeRestrictions, allowed_days: allowed.filter(d => d !== day) });
                    } else {
                      setTimeRestrictions({ ...timeRestrictions, allowed_days: [...allowed, day] });
                    }
                  }}
                  className={`px-2 py-1 rounded text-xs uppercase transition ${
                    (timeRestrictions.allowed_days || []).includes(day)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* IP Test Tool */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-indigo-500" />
          Test IP Access
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter IP address to test"
            value={testIp}
            onChange={(e) => setTestIp(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={testIpAccess}
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Test
          </button>
        </div>
        
        {testResult && (
          <div className={`mt-4 p-4 rounded-lg ${testResult.allowed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {testResult.allowed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-medium ${testResult.allowed ? 'text-green-700' : 'text-red-700'}`}>
                {testResult.allowed ? 'Access Allowed' : 'Access Denied'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Reason: {testResult.reason}</p>
            <p className="text-sm text-gray-500">IP: {testResult.ip_address}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPWhitelistManager;
