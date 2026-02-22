import React, { useState, useEffect } from 'react';
import {
  Webhook, Plus, Trash2, RefreshCw, Play, Pause, Key, Copy, Check,
  ChevronRight, ChevronDown, Clock, CheckCircle, XCircle, AlertCircle,
  Settings, Activity, Globe, Shield, Heart, Loader2, Eye, EyeOff,
  RotateCcw, Send, Filter, Search
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const WebhookManager = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [eventTypes, setEventTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [deliveryLogs, setDeliveryLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('webhooks');
  const [copiedId, setCopiedId] = useState(null);

  // Create webhook form
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    description: '',
    events: []
  });

  useEffect(() => {
    loadWebhooks();
    loadEventTypes();
  }, []);

  const loadWebhooks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/webhooks/`);
      const data = await response.json();
      setWebhooks(data.webhooks || []);
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEventTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/webhooks/events/types`);
      const data = await response.json();
      setEventTypes(data.categories || {});
    } catch (error) {
      console.error('Failed to load event types:', error);
    }
  };

  const loadDeliveryLogs = async (webhookId) => {
    try {
      const response = await fetch(`${API_URL}/api/webhooks/${webhookId}/deliveries`);
      const data = await response.json();
      setDeliveryLogs(data.deliveries || []);
    } catch (error) {
      console.error('Failed to load delivery logs:', error);
    }
  };

  const createWebhook = async () => {
    try {
      const response = await fetch(`${API_URL}/api/webhooks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWebhook)
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(`Webhook created! Save this secret:\n\n${data.secret}\n\nIt won't be shown again.`);
        loadWebhooks();
        setShowCreateModal(false);
        setNewWebhook({ name: '', url: '', description: '', events: [] });
      }
    } catch (error) {
      console.error('Failed to create webhook:', error);
    }
  };

  const deleteWebhook = async (webhookId) => {
    if (!window.confirm('Are you sure you want to delete this webhook?')) return;
    
    try {
      await fetch(`${API_URL}/api/webhooks/${webhookId}`, { method: 'DELETE' });
      loadWebhooks();
      if (selectedWebhook?.id === webhookId) setSelectedWebhook(null);
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  };

  const toggleWebhook = async (webhookId, currentStatus) => {
    const action = currentStatus === 'active' ? 'pause' : 'resume';
    try {
      await fetch(`${API_URL}/api/webhooks/${webhookId}/${action}`, { method: 'POST' });
      loadWebhooks();
    } catch (error) {
      console.error(`Failed to ${action} webhook:`, error);
    }
  };

  const testWebhook = async (webhookId) => {
    try {
      const response = await fetch(`${API_URL}/api/webhooks/${webhookId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'threat.detected' })
      });
      const data = await response.json();
      alert(`Test webhook sent! Delivery ID: ${data.delivery_id}`);
      if (selectedWebhook?.id === webhookId) {
        setTimeout(() => loadDeliveryLogs(webhookId), 2000);
      }
    } catch (error) {
      console.error('Failed to test webhook:', error);
    }
  };

  const rotateSecret = async (webhookId) => {
    if (!window.confirm('Are you sure you want to rotate the secret? This will invalidate the current secret.')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/webhooks/${webhookId}/rotate-secret`, { method: 'POST' });
      const data = await response.json();
      alert(`New secret:\n\n${data.new_secret}\n\nSave it securely!`);
    } catch (error) {
      console.error('Failed to rotate secret:', error);
    }
  };

  const retryDelivery = async (deliveryId) => {
    try {
      const response = await fetch(`${API_URL}/api/webhooks/deliveries/${deliveryId}/retry`, { method: 'POST' });
      const data = await response.json();
      alert(`Retry scheduled! New delivery ID: ${data.new_delivery_id}`);
      if (selectedWebhook) {
        setTimeout(() => loadDeliveryLogs(selectedWebhook.id), 2000);
      }
    } catch (error) {
      console.error('Failed to retry delivery:', error);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'disabled': return 'bg-red-500';
      case 'success': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'pending': return 'bg-blue-500';
      case 'retrying': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'failed': return <XCircle size={16} className="text-red-500" />;
      case 'pending': return <Clock size={16} className="text-blue-500" />;
      case 'retrying': return <RefreshCw size={16} className="text-yellow-500 animate-spin" />;
      default: return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const toggleEventSelection = (eventType) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(eventType)
        ? prev.events.filter(e => e !== eventType)
        : [...prev.events, eventType]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Webhook className="text-cyan-500" />
            Webhook Management
          </h2>
          <p className="text-gray-400">Configure webhooks for real-time event notifications</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          Create Webhook
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        {[
          { id: 'webhooks', name: 'Webhooks', icon: Webhook },
          { id: 'events', name: 'Event Types', icon: Activity },
          { id: 'logs', name: 'Delivery Logs', icon: Clock }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Webhooks List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Your Webhooks ({webhooks.length})</h3>
            {webhooks.length === 0 ? (
              <div className="bg-gray-800 rounded-xl p-8 text-center">
                <Webhook className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">No webhooks configured yet</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 text-cyan-400 hover:underline"
                >
                  Create your first webhook →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-colors ${
                      selectedWebhook?.id === webhook.id ? 'ring-2 ring-cyan-500' : 'hover:bg-gray-750'
                    }`}
                    onClick={() => {
                      setSelectedWebhook(webhook);
                      loadDeliveryLogs(webhook.id);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(webhook.status)}`} />
                          <h4 className="font-medium text-white">{webhook.name}</h4>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 truncate">{webhook.url}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {webhook.events?.slice(0, 3).map((event, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                              {event}
                            </span>
                          ))}
                          {webhook.events?.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">
                              +{webhook.events.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); testWebhook(webhook.id); }}
                          className="p-2 hover:bg-gray-700 rounded transition-colors"
                          title="Test Webhook"
                        >
                          <Send size={16} className="text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWebhook(webhook.id, webhook.status); }}
                          className="p-2 hover:bg-gray-700 rounded transition-colors"
                          title={webhook.status === 'active' ? 'Pause' : 'Resume'}
                        >
                          {webhook.status === 'active' ? 
                            <Pause size={16} className="text-yellow-400" /> : 
                            <Play size={16} className="text-green-400" />
                          }
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteWebhook(webhook.id); }}
                          className="p-2 hover:bg-gray-700 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Webhook Details */}
          <div className="bg-gray-800 rounded-xl p-6">
            {selectedWebhook ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{selectedWebhook.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedWebhook.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {selectedWebhook.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Endpoint URL</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-gray-900 px-3 py-2 rounded text-sm text-cyan-400 truncate">
                        {selectedWebhook.url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedWebhook.url, 'url')}
                        className="p-2 hover:bg-gray-700 rounded"
                      >
                        {copiedId === 'url' ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Webhook ID</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-gray-900 px-3 py-2 rounded text-sm text-gray-300 truncate">
                        {selectedWebhook.id}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedWebhook.id, 'id')}
                        className="p-2 hover:bg-gray-700 rounded"
                      >
                        {copiedId === 'id' ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Subscribed Events ({selectedWebhook.events?.length || 0})</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedWebhook.events?.map((event, idx) => (
                        <span key={idx} className="px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded text-sm">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => testWebhook(selectedWebhook.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                    >
                      <Send size={16} /> Test Webhook
                    </button>
                    <button
                      onClick={() => rotateSecret(selectedWebhook.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                    >
                      <Key size={16} /> Rotate Secret
                    </button>
                  </div>
                </div>

                {/* Recent Deliveries */}
                <div>
                  <h4 className="font-medium text-white mb-3">Recent Deliveries</h4>
                  {deliveryLogs.length === 0 ? (
                    <p className="text-gray-500 text-sm">No deliveries yet</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {deliveryLogs.slice(0, 10).map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(log.status)}
                            <div>
                              <span className="text-sm text-white">{log.event_type}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(log.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {log.response_time_ms && (
                              <span className="text-xs text-gray-500">{log.response_time_ms}ms</span>
                            )}
                            {log.status === 'failed' && (
                              <button
                                onClick={() => retryDelivery(log.id)}
                                className="p-1 hover:bg-gray-600 rounded"
                                title="Retry"
                              >
                                <RotateCcw size={14} className="text-yellow-400" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Settings size={48} className="mb-4" />
                <p>Select a webhook to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Types Tab */}
      {activeTab === 'events' && (
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(eventTypes).map(([category, data]) => (
            <div key={category} className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                {category === 'securesphere' && <Shield className="text-cyan-500" />}
                {category === 'healthtrack' && <Heart className="text-green-500" />}
                {category === 'system' && <Activity className="text-purple-500" />}
                <h3 className="font-semibold text-white">{data.name}</h3>
              </div>
              <div className="space-y-2">
                {data.events?.map((event, idx) => (
                  <div key={idx} className="p-3 bg-gray-700/50 rounded-lg">
                    <code className="text-sm text-cyan-400">{event.type}</code>
                    <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delivery Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">All Delivery Logs</h3>
          <p className="text-gray-400 text-sm mb-4">Select a webhook to view its delivery history</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {webhooks.map((webhook) => (
              <button
                key={webhook.id}
                onClick={() => { setSelectedWebhook(webhook); loadDeliveryLogs(webhook.id); }}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedWebhook?.id === webhook.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {webhook.name}
              </button>
            ))}
          </div>
          
          {selectedWebhook && deliveryLogs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Event</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Response</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-700/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className="text-sm capitalize">{log.status}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <code className="text-sm text-cyan-400">{log.event_type}</code>
                      </td>
                      <td className="py-3 text-sm text-gray-400">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 text-sm">
                        {log.response_status ? (
                          <span className={log.response_status < 400 ? 'text-green-400' : 'text-red-400'}>
                            {log.response_status}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 text-sm text-gray-400">
                        {log.response_time_ms ? `${log.response_time_ms}ms` : '-'}
                      </td>
                      <td className="py-3">
                        {log.status === 'failed' && (
                          <button
                            onClick={() => retryDelivery(log.id)}
                            className="text-yellow-400 hover:underline text-sm"
                          >
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Create New Webhook</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  placeholder="My Security Webhook"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Endpoint URL *</label>
                <input
                  type="url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  placeholder="https://your-server.com/webhooks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={newWebhook.description}
                  onChange={(e) => setNewWebhook({ ...newWebhook, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  rows={2}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Events to Subscribe * ({newWebhook.events.length} selected)
                </label>
                <div className="max-h-64 overflow-y-auto space-y-4 bg-gray-900 rounded-lg p-4">
                  {Object.entries(eventTypes).map(([category, data]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">{data.name}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {data.events?.map((event, idx) => (
                          <label
                            key={idx}
                            className="flex items-center gap-2 p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-750"
                          >
                            <input
                              type="checkbox"
                              checked={newWebhook.events.includes(event.type)}
                              onChange={() => toggleEventSelection(event.type)}
                              className="rounded bg-gray-700 border-gray-600"
                            />
                            <span className="text-sm text-gray-300">{event.type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createWebhook}
                disabled={!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
              >
                Create Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookManager;
