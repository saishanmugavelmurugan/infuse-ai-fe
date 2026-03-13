import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Map, Plus, ChevronRight, RefreshCw, FileText,
  Calendar, Target, TrendingUp, Zap, Clock, CheckCircle,
  AlertCircle, Edit, Trash2, Vote, Lightbulb
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const RoadmapAgentPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [backlog, setBacklog] = useState(null);
  const [proposals, setProposals] = useState(null);
  const [themes, setThemes] = useState(null);
  const [quarterlyDeck, setQuarterlyDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roadmap');
  const [activeHorizon, setActiveHorizon] = useState('3_year');
  const [showPRDModal, setShowPRDModal] = useState(false);
  const [prdForm, setPrdForm] = useState({ title: '', description: '', target_users: '', success_metrics: '' });
  const [generatingPRD, setGeneratingPRD] = useState(false);
  const [generatedPRD, setGeneratedPRD] = useState(null);

  const fetchData = async () => {
    try {
      const [roadmapRes, backlogRes, proposalsRes, themesRes, deckRes] = await Promise.all([
        fetch(`${API_BASE}/api/agents/roadmap/roadmap`),
        fetch(`${API_BASE}/api/agents/roadmap/backlog`),
        fetch(`${API_BASE}/api/agents/roadmap/proposals`),
        fetch(`${API_BASE}/api/agents/roadmap/analysis/support-themes`),
        fetch(`${API_BASE}/api/agents/roadmap/quarterly-deck`)
      ]);

      const [roadmapData, backlogData, proposalsData, themesData, deckData] = await Promise.all([
        roadmapRes.json(),
        backlogRes.json(),
        proposalsRes.json(),
        themesRes.json(),
        deckRes.json()
      ]);

      setRoadmap(roadmapData);
      setBacklog(backlogData);
      setProposals(proposalsData);
      setThemes(themesData);
      setQuarterlyDeck(deckData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generatePRD = async () => {
    setGeneratingPRD(true);
    try {
      const response = await fetch(`${API_BASE}/api/agents/roadmap/prd/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prdForm)
      });
      const data = await response.json();
      setGeneratedPRD(data);
    } catch (error) {
      console.error('Error generating PRD:', error);
    } finally {
      setGeneratingPRD(false);
    }
  };

  const getSizeColor = (size) => {
    const colors = {
      'XS': 'bg-green-500/20 text-green-400',
      'S': 'bg-blue-500/20 text-blue-400',
      'M': 'bg-yellow-500/20 text-yellow-400',
      'L': 'bg-orange-500/20 text-orange-400',
      'XL': 'bg-red-500/20 text-red-400'
    };
    return colors[size] || colors['M'];
  };

  const getStatusColor = (status) => {
    const colors = {
      'in_progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'planned': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'backlog': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
      'vision': 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return colors[status] || colors['backlog'];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'P0': 'bg-red-500 text-white',
      'P1': 'bg-orange-500 text-white',
      'P2': 'bg-yellow-500 text-black',
      'P3': 'bg-slate-500 text-white'
    };
    return colors[priority] || colors['P2'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#FF9A3B] animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading Roadmap Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white" data-testid="roadmap-agent-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-[#8B4513]/30 to-slate-900 border-b border-[#FF9A3B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/ai-agents" className="p-2 hover:bg-slate-800 rounded-lg transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="p-2 bg-gradient-to-br from-[#FFDA7B]/20 to-[#E55A00]/20 rounded-xl">
                <Map className="w-6 h-6 text-[#E55A00]" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Roadmap Agent</h1>
                <p className="text-[#FF9A3B] text-sm">Product Strategy & Planning</p>
              </div>
            </div>
            <button
              onClick={() => setShowPRDModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] hover:from-[#FFE49B] hover:to-[#FF6A10] rounded-lg transition"
            >
              <FileText className="w-4 h-4" />
              Generate PRD
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#FF9A3B]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            {['roadmap', 'backlog', 'insights', 'quarterly'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium transition border-b-2 ${
                  activeTab === tab
                    ? 'border-[#FF9A3B] text-[#FFDA7B]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'roadmap' && roadmap && (
          <div className="space-y-6">
            {/* Horizon Selector */}
            <div className="flex gap-4 bg-slate-800/50 p-2 rounded-xl w-fit">
              {['3_year', '5_year', '10_year'].map((horizon) => (
                <button
                  key={horizon}
                  onClick={() => setActiveHorizon(horizon)}
                  className={`px-4 py-2 rounded-lg transition ${
                    activeHorizon === horizon
                      ? 'bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {roadmap.roadmap[horizon]?.info?.name || horizon}
                </button>
              ))}
            </div>

            {/* Horizon Info */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-[#FF9A3B]/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{roadmap.roadmap[activeHorizon]?.info?.name}</h2>
                  <p className="text-slate-400">{roadmap.roadmap[activeHorizon]?.info?.timeframe}</p>
                </div>
                <div className="px-4 py-2 bg-[#FF9A3B]/20 text-[#FFDA7B] rounded-lg">
                  {roadmap.roadmap[activeHorizon]?.items?.length || 0} Items
                </div>
              </div>
              <p className="text-slate-300">{roadmap.roadmap[activeHorizon]?.info?.focus}</p>
            </div>

            {/* Roadmap Items */}
            <div className="space-y-4">
              {roadmap.roadmap[activeHorizon]?.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 rounded-xl p-6 border border-[#FF9A3B]/20 hover:border-[#FF9A3B]/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getSizeColor(item.size)}`}>
                          {item.size}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(item.status)}`}>
                          {item.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm mb-3">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.quarter}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                        <Edit className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sizing Guide */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-[#FF9A3B]/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FF9A3B]" />
                T-Shirt Sizing Guide
              </h3>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(roadmap.sizing_guide || {}).map(([size, info]) => (
                  <div key={size} className={`p-3 rounded-lg ${getSizeColor(size)}`}>
                    <div className="font-bold text-lg">{size}</div>
                    <div className="text-xs opacity-80">{info.days}</div>
                    <div className="text-xs mt-1">{info.points} pts</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backlog' && backlog && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Prioritized Backlog</h2>
              <div className="flex gap-2">
                {['P0', 'P1', 'P2', 'P3'].map((p) => (
                  <span key={p} className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(p)}`}>
                    {p}: {backlog.by_priority?.[p] || 0}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {backlog.backlog?.length > 0 ? (
                backlog.backlog.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-[#FF9A3B]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getSizeColor(item.size)}`}>
                          {item.size}
                        </span>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">{item.votes || 0} votes</span>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                          <Vote className="w-4 h-4 text-[#FFDA7B]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-800/30 rounded-xl">
                  <p className="text-slate-400">No backlog items yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'insights' && themes && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-[#FFDA7B]" />
              Support Theme Analysis
            </h2>
            <p className="text-slate-400">Feature opportunities derived from support conversation patterns</p>

            <div className="grid md:grid-cols-2 gap-6">
              {themes.opportunities?.map((opp, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-[#FF9A3B]/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-[#FF9A3B]/20 text-[#FF9A3B] rounded-full text-sm capitalize">
                      {opp.category}
                    </span>
                    <span className="text-sm text-slate-400">{opp.query_count} queries</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{opp.suggested_feature}</h3>
                  <p className="text-slate-400 text-sm mb-4">{opp.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-500">Unresolved Rate: </span>
                      <span className={opp.unresolved_rate > 20 ? 'text-red-400' : 'text-green-400'}>
                        {opp.unresolved_rate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-500">Priority Score: </span>
                      <span className="text-[#FFDA7B]">{opp.priority_score.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="col-span-2 text-center py-12 bg-slate-800/30 rounded-xl">
                  <p className="text-slate-400">No support themes analyzed yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'quarterly' && quarterlyDeck && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#8B4513]/30 to-slate-800/30 rounded-xl p-8 border border-[#FF9A3B]/30">
              <h2 className="text-2xl font-bold mb-2">{quarterlyDeck.deck_title}</h2>
              <p className="text-slate-400">Generated: {new Date(quarterlyDeck.generated_at).toLocaleString()}</p>
            </div>

            {/* Executive Summary */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-[#FF9A3B]/20">
                <div className="text-slate-400 text-sm">Total Items</div>
                <div className="text-2xl font-bold">{quarterlyDeck.sections?.executive_summary?.total_items}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-[#FF9A3B]/20">
                <div className="text-slate-400 text-sm">In Progress</div>
                <div className="text-2xl font-bold text-[#FF9A3B]">{quarterlyDeck.sections?.executive_summary?.in_progress}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-[#FF9A3B]/20">
                <div className="text-slate-400 text-sm">Planned</div>
                <div className="text-2xl font-bold text-[#FFDA7B]">{quarterlyDeck.sections?.executive_summary?.planned}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-[#FF9A3B]/20">
                <div className="text-slate-400 text-sm">Completed</div>
                <div className="text-2xl font-bold text-green-400">{quarterlyDeck.sections?.executive_summary?.completed}</div>
              </div>
            </div>

            {/* Current Quarter */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-[#FF9A3B]/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FF9A3B]" />
                Current Quarter Focus
              </h3>
              <p className="text-lg text-white mb-4">{quarterlyDeck.sections?.current_quarter?.focus}</p>
              <div className="space-y-2">
                {quarterlyDeck.sections?.current_quarter?.key_deliverables?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[#FFDA7B]" />
                    <span>{item.title}</span>
                    <span className={`ml-auto px-2 py-1 rounded text-xs ${getSizeColor(item.size)}`}>{item.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Quarter */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-[#FF9A3B]/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#E55A00]" />
                Next Quarter Preview
              </h3>
              <p className="text-lg text-white mb-4">{quarterlyDeck.sections?.next_quarter?.focus}</p>
              <div className="space-y-2">
                {quarterlyDeck.sections?.next_quarter?.planned_items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#FF9A3B]" />
                    <span>{item.title}</span>
                    <span className={`ml-auto px-2 py-1 rounded text-xs ${getSizeColor(item.size)}`}>{item.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRD Generation Modal */}
      {showPRDModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-[#FF9A3B]/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#FF9A3B]/20">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#FFDA7B]" />
                Generate PRD with AI
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {!generatedPRD ? (
                <>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Feature Title</label>
                    <input
                      type="text"
                      value={prdForm.title}
                      onChange={(e) => setPrdForm({ ...prdForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-[#FF9A3B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A3B]"
                      placeholder="e.g., AI-Powered Symptom Checker"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Description</label>
                    <textarea
                      value={prdForm.description}
                      onChange={(e) => setPrdForm({ ...prdForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-[#FF9A3B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A3B] h-24"
                      placeholder="Describe the feature in detail..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Target Users</label>
                    <input
                      type="text"
                      value={prdForm.target_users}
                      onChange={(e) => setPrdForm({ ...prdForm, target_users: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-[#FF9A3B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A3B]"
                      placeholder="e.g., Patients seeking initial health guidance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Success Metrics (optional)</label>
                    <input
                      type="text"
                      value={prdForm.success_metrics}
                      onChange={(e) => setPrdForm({ ...prdForm, success_metrics: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-[#FF9A3B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9A3B]"
                      placeholder="e.g., 80% user satisfaction, 50% reduction in trivial appointments"
                    />
                  </div>
                </>
              ) : (
                <div className="bg-slate-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{generatedPRD.content}</pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-[#FF9A3B]/20 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPRDModal(false);
                  setGeneratedPRD(null);
                  setPrdForm({ title: '', description: '', target_users: '', success_metrics: '' });
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                Close
              </button>
              {!generatedPRD && (
                <button
                  onClick={generatePRD}
                  disabled={generatingPRD || !prdForm.title || !prdForm.description}
                  className="px-4 py-2 bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] hover:from-[#FFE49B] hover:to-[#FF6A10] disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition flex items-center gap-2"
                >
                  {generatingPRD ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate PRD
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

export default RoadmapAgentPage;
