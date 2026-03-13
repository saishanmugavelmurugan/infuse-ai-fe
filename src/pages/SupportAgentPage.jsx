import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Send, Bot, User, RefreshCw, MessageSquare,
  AlertCircle, CheckCircle, Clock, Tag, BarChart3,
  FileText, Ticket, ThumbsUp, ThumbsDown, Mail, Plus,
  Trash2, Edit, Book, X, Save
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const SupportAgentPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [knowledgeBase, setKnowledgeBase] = useState({});
  const [showKBModal, setShowKBModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState(null);
  const [kbForm, setKbForm] = useState({ key: '', keywords: '', answer: '', category: '' });
  const [editingKB, setEditingKB] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, reportRes, kbRes] = await Promise.all([
        fetch(`${API_BASE}/api/agents/support/analytics/summary`),
        fetch(`${API_BASE}/api/agents/support/report/weekly`),
        fetch(`${API_BASE}/api/agents/support/knowledge-base`)
      ]);
      
      const [analyticsData, reportData, kbData] = await Promise.all([
        analyticsRes.json(),
        reportRes.json(),
        kbRes.json()
      ]);

      setAnalytics(analyticsData);
      setWeeklyReport(reportData);
      setKnowledgeBase(kbData.entries || {});
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const sendEmailReport = async () => {
    setEmailSending(true);
    try {
      const response = await fetch(`${API_BASE}/api/agents/support/report/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_email: 'support.infuse.net.in',
          report_type: 'weekly'
        })
      });
      const data = await response.json();
      setEmailResult(data);
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailResult({ status: 'error', message: 'Failed to send email report' });
    } finally {
      setEmailSending(false);
    }
  };

  const saveKBEntry = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/agents/support/knowledge-base`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: kbForm.key,
          keywords: kbForm.keywords.split(',').map(k => k.trim()),
          answer: kbForm.answer,
          category: kbForm.category
        })
      });
      
      if (response.ok) {
        fetchAnalytics();
        setShowKBModal(false);
        setKbForm({ key: '', keywords: '', answer: '', category: '' });
        setEditingKB(null);
      }
    } catch (error) {
      console.error('Error saving KB entry:', error);
    }
  };

  const deleteKBEntry = async (key) => {
    if (!window.confirm(`Delete knowledge entry "${key}"?`)) return;
    try {
      await fetch(`${API_BASE}/api/agents/support/knowledge-base/${key}`, {
        method: 'DELETE'
      });
      fetchAnalytics();
    } catch (error) {
      console.error('Error deleting KB entry:', error);
    }
  };

  const editKBEntry = (key, entry) => {
    setKbForm({
      key: key,
      keywords: entry.keywords?.join(', ') || '',
      answer: entry.answer || '',
      category: entry.category || ''
    });
    setEditingKB(key);
    setShowKBModal(true);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/agents/support/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: input,
          user_context: { platform: 'web' }
        })
      });

      const data = await response.json();
      
      if (!sessionId) {
        setSessionId(data.session_id);
      }

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
        resolved: data.resolved,
        confidence: data.confidence,
        category: data.category,
        escalation_required: data.escalation_required,
        suggested_actions: data.suggested_actions
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'How do I book an appointment?',
    'How to upload lab reports?',
    'How do I sync my wearable?',
    'I have a payment issue',
    'How to download prescriptions?',
    'What about my data privacy?'
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white" data-testid="support-agent-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-[#8B4513]/30 to-slate-900 border-b border-[#FF9A3B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/ai-agents" className="p-2 hover:bg-slate-800 rounded-lg transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="p-2 bg-gradient-to-br from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-xl">
                <MessageSquare className="w-6 h-6 text-[#FFDA7B]" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Support Agent</h1>
                <p className="text-[#FF9A3B] text-sm">AI-powered customer support</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-lg transition ${activeTab === 'chat' ? 'bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg transition ${activeTab === 'analytics' ? 'bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`px-4 py-2 rounded-lg transition ${activeTab === 'knowledge' ? 'bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                Knowledge Base
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'chat' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden h-[600px] flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <Bot className="w-16 h-16 text-[#FFDA7B] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Welcome to Support</h3>
                      <p className="text-slate-400 mb-6">
                        Ask me anything about HealthTrack Pro
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {quickQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInput(q)}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="p-2 bg-gradient-to-br from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-lg h-fit">
                            <Bot className="w-5 h-5 text-[#FFDA7B]" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] text-white'
                              : 'bg-slate-700/50 border border-[#FF9A3B]/20'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          
                          {msg.role === 'assistant' && !msg.error && (
                            <div className="mt-3 pt-3 border-t border-slate-600">
                              <div className="flex items-center gap-4 text-xs">
                                {msg.resolved ? (
                                  <span className="flex items-center gap-1 text-green-400">
                                    <CheckCircle className="w-3 h-3" />
                                    Resolved
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-yellow-400">
                                    <Clock className="w-3 h-3" />
                                    May need follow-up
                                  </span>
                                )}
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Tag className="w-3 h-3" />
                                  {msg.category}
                                </span>
                                <span className="text-slate-500">
                                  Confidence: {(msg.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                              
                              {msg.escalation_required && (
                                <div className="mt-2 p-2 bg-yellow-500/20 rounded-lg text-yellow-400 text-xs flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  Complex query - Human escalation available
                                </div>
                              )}

                              {msg.suggested_actions?.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {msg.suggested_actions.map((action, idx) => (
                                    <button
                                      key={idx}
                                      className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs transition"
                                    >
                                      {action}
                                    </button>
                                  ))}
                                </div>
                              )}

                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-slate-500">Was this helpful?</span>
                                <button className="p-1 hover:bg-slate-600 rounded transition">
                                  <ThumbsUp className="w-4 h-4 text-slate-400" />
                                </button>
                                <button className="p-1 hover:bg-slate-600 rounded transition">
                                  <ThumbsDown className="w-4 h-4 text-slate-400" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <div className="p-2 bg-slate-700 rounded-lg h-fit">
                            <User className="w-5 h-5 text-slate-300" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="p-2 bg-gradient-to-br from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-lg h-fit">
                        <Bot className="w-5 h-5 text-[#FFDA7B]" />
                      </div>
                      <div className="bg-slate-700/50 rounded-2xl p-4 border border-[#FF9A3B]/20">
                        <RefreshCw className="w-5 h-5 animate-spin text-[#FF9A3B]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask a question..."
                      className="flex-1 px-4 py-3 bg-slate-700/50 border border-[#FF9A3B]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9A3B] focus:border-transparent"
                      disabled={loading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading || !input.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] hover:from-[#FFE49B] hover:to-[#FF6A10] disabled:bg-slate-700 disabled:text-slate-500 rounded-xl transition flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#FFDA7B]" />
                  Today's Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Queries</span>
                    <span className="font-medium">{analytics?.today?.total_queries || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Resolved</span>
                    <span className="font-medium text-green-400">{analytics?.today?.resolved_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Escalated</span>
                    <span className="font-medium text-yellow-400">{analytics?.today?.escalated_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Resolution Rate</span>
                    <span className="font-medium">{analytics?.resolution_rate?.toFixed(1) || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Top Issues */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#FF9A3B]" />
                  Top Issues
                </h3>
                <div className="space-y-2">
                  {analytics?.top_issues?.slice(0, 5).map((issue, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-slate-400 capitalize">{issue.category}</span>
                      <span className="px-2 py-1 bg-slate-700 rounded text-xs">{issue.count}</span>
                    </div>
                  )) || (
                    <p className="text-slate-500 text-sm">No issues recorded yet</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition border border-[#FFDA7B]/10">
                    <Ticket className="w-5 h-5 text-[#FFDA7B]" />
                    <span>Create Support Ticket</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition border border-[#FF9A3B]/10">
                    <AlertCircle className="w-5 h-5 text-[#FF9A3B]" />
                    <span>Escalate to Human</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition border border-[#E55A00]/10">
                    <FileText className="w-5 h-5 text-[#E55A00]" />
                    <span>View Knowledge Base</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          /* Analytics Tab */
          <div className="space-y-6">
            {/* Weekly Report */}
            {weeklyReport && (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-[#FF9A3B]/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Weekly Support Report</h3>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] rounded-lg hover:opacity-90 transition"
                  >
                    <Mail className="w-4 h-4" />
                    Email Report
                  </button>
                </div>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="text-sm text-slate-400">Total Queries</div>
                    <div className="text-2xl font-bold">{weeklyReport.summary?.total_queries || 0}</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="text-sm text-slate-400">Resolved</div>
                    <div className="text-2xl font-bold text-green-400">{weeklyReport.summary?.resolved || 0}</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="text-sm text-slate-400">Resolution Rate</div>
                    <div className="text-2xl font-bold text-[#FFDA7B]">{weeklyReport.summary?.resolution_rate?.toFixed(1) || 0}%</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="text-sm text-slate-400">Period</div>
                    <div className="text-sm font-medium">{new Date(weeklyReport.period?.start).toLocaleDateString()} - {new Date(weeklyReport.period?.end).toLocaleDateString()}</div>
                  </div>
                </div>

                <h4 className="font-semibold mb-3">Issues by Category</h4>
                <div className="space-y-2">
                  {weeklyReport.top_issues?.map((issue, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-32 text-slate-400 capitalize">{issue._id}</div>
                      <div className="flex-1 bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FFDA7B] to-[#E55A00]"
                          style={{ width: `${(issue.count / weeklyReport.summary.total_queries) * 100}%` }}
                        />
                      </div>
                      <div className="w-16 text-right">{issue.count}</div>
                      <div className="w-24 text-right text-green-400">{issue.resolved} resolved</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Knowledge Base Tab */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Book className="w-6 h-6 text-[#FFDA7B]" />
                Knowledge Base
              </h2>
              <button
                onClick={() => {
                  setKbForm({ key: '', keywords: '', answer: '', category: '' });
                  setEditingKB(null);
                  setShowKBModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] rounded-lg hover:opacity-90 transition"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(knowledgeBase).map(([key, entry]) => (
                <div key={key} className="bg-slate-800/50 rounded-xl p-4 border border-[#FF9A3B]/20">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-[#FFDA7B] capitalize">{key.replace(/_/g, ' ')}</h4>
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-400 capitalize">{entry.category}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => editKBEntry(key, entry)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        onClick={() => deleteKBEntry(key)}
                        className="p-2 hover:bg-red-900/50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{entry.answer?.slice(0, 150)}...</p>
                  <div className="flex flex-wrap gap-1">
                    {entry.keywords?.slice(0, 5).map((kw, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-[#FF9A3B]/20 text-[#FF9A3B] rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Knowledge Base Modal */}
      {showKBModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-[#FF9A3B]/30 w-full max-w-lg">
            <div className="p-6 border-b border-[#FF9A3B]/20 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Book className="w-5 h-5 text-[#FFDA7B]" />
                {editingKB ? 'Edit Entry' : 'Add Knowledge Entry'}
              </h2>
              <button onClick={() => setShowKBModal(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Key (unique identifier)</label>
                <input
                  type="text"
                  value={kbForm.key}
                  onChange={(e) => setKbForm({ ...kbForm, key: e.target.value })}
                  disabled={!!editingKB}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-[#FF9A3B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A3B] disabled:opacity-50"
                  placeholder="e.g., appointment_booking"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={kbForm.keywords}
                  onChange={(e) => setKbForm({ ...kbForm, keywords: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-[#FF9A3B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A3B]"
                  placeholder="e.g., book, appointment, schedule"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Category</label>
                <select
                  value={kbForm.category}
                  onChange={(e) => setKbForm({ ...kbForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-[#FF9A3B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A3B]"
                >
                  <option value="">Select category</option>
                  <option value="appointments">Appointments</option>
                  <option value="lab_reports">Lab Reports</option>
                  <option value="payments">Payments</option>
                  <option value="prescriptions">Prescriptions</option>
                  <option value="wearables">Wearables</option>
                  <option value="security">Security</option>
                  <option value="account">Account</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Answer</label>
                <textarea
                  value={kbForm.answer}
                  onChange={(e) => setKbForm({ ...kbForm, answer: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-[#FF9A3B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A3B] h-32"
                  placeholder="Enter the answer or response for this knowledge entry..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-[#FF9A3B]/20 flex justify-end gap-3">
              <button
                onClick={() => setShowKBModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={saveKBEntry}
                disabled={!kbForm.key || !kbForm.answer || !kbForm.category}
                className="px-4 py-2 bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Report Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-[#FF9A3B]/30 w-full max-w-md">
            <div className="p-6 border-b border-[#FF9A3B]/20 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#FFDA7B]" />
                Send Weekly Report
              </h2>
              <button onClick={() => { setShowEmailModal(false); setEmailResult(null); }} className="p-2 hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {emailResult ? (
                <div className={`p-4 rounded-xl ${emailResult.status === 'success' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {emailResult.status === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    )}
                    <span className="font-semibold">{emailResult.status === 'success' ? 'Report Sent!' : 'Error'}</span>
                  </div>
                  <p className="text-sm text-slate-300">{emailResult.message}</p>
                  {emailResult.email_status?.mocked && (
                    <p className="text-xs text-yellow-400 mt-2">⚠️ Email is mocked (SendGrid not configured)</p>
                  )}
                  {emailResult.report_summary && (
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <p className="text-sm text-slate-400">Report Summary:</p>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="text-center">
                          <div className="text-lg font-bold">{emailResult.report_summary.total_queries}</div>
                          <div className="text-xs text-slate-400">Queries</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{emailResult.report_summary.resolved}</div>
                          <div className="text-xs text-slate-400">Resolved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#FFDA7B]">{emailResult.report_summary.resolution_rate}%</div>
                          <div className="text-xs text-slate-400">Rate</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="p-4 bg-slate-700/50 rounded-xl mb-4">
                    <p className="text-slate-300">Weekly report will be sent to:</p>
                    <p className="text-[#FFDA7B] font-semibold mt-1">support.infuse.net.in</p>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">
                    This will generate and email the weekly support analytics report including top issues, resolution rates, and category breakdown.
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-[#FF9A3B]/20 flex justify-end gap-3">
              <button
                onClick={() => { setShowEmailModal(false); setEmailResult(null); }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                {emailResult ? 'Close' : 'Cancel'}
              </button>
              {!emailResult && (
                <button
                  onClick={sendEmailReport}
                  disabled={emailSending}
                  className="px-4 py-2 bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {emailSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Report
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportAgentPage;
