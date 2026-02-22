import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Search, ArrowRight, Check, FileText, Users, Globe, Loader2, ChevronDown, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { healthSchemesApi, aiComparatorApi, detectUserCountry } from '../../services/healthSchemesApi';
import ReactMarkdown from 'react-markdown';

const AIHealthComparator = () => {
  const [regions, setRegions] = useState([]);
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const [schemesForRegion, setSchemesForRegion] = useState({});
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('compare');
  const [userContext, setUserContext] = useState('');
  const [focusAreas, setFocusAreas] = useState([]);
  const [userCountry, setUserCountry] = useState(null);
  
  // Recommendation form
  const [userProfile, setUserProfile] = useState({
    age: '',
    income_level: '',
    family_size: '',
    health_conditions: '',
    country: ''
  });
  const [preferences, setPreferences] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  
  // Best practices
  const [bestPracticesCountry, setBestPracticesCountry] = useState('');
  const [bestPracticesFocus, setBestPracticesFocus] = useState('');
  const [bestPractices, setBestPractices] = useState(null);

  const focusOptions = ['cost', 'coverage', 'accessibility', 'quality', 'eligibility', 'digital_services'];
  const preferenceOptions = ['low_cost', 'comprehensive', 'digital_first', 'family_friendly', 'chronic_care', 'preventive_care'];
  const incomeOptions = ['low', 'middle', 'upper_middle', 'high'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [regionsData, country] = await Promise.all([
        healthSchemesApi.getRegions(),
        detectUserCountry()
      ]);
      setRegions(regionsData.regions || []);
      setUserCountry(country);
      setUserProfile(prev => ({ ...prev, country: country?.country_code || '' }));
      setBestPracticesCountry(country?.country_code || '');
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchemesForRegion = async (countryCode) => {
    if (schemesForRegion[countryCode]) return;
    try {
      const data = await healthSchemesApi.getSchemesByRegion(countryCode);
      setSchemesForRegion(prev => ({
        ...prev,
        [countryCode]: data.schemes || []
      }));
    } catch (error) {
      console.error('Failed to load schemes:', error);
    }
  };

  const toggleScheme = (schemeId) => {
    setSelectedSchemes(prev => 
      prev.includes(schemeId) 
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId]
    );
  };

  const toggleFocusArea = (area) => {
    setFocusAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const togglePreference = (pref) => {
    setPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const handleCompare = async () => {
    if (selectedSchemes.length < 2) {
      alert('Please select at least 2 schemes to compare');
      return;
    }
    
    try {
      setAnalyzing(true);
      const result = await aiComparatorApi.compareSchemes(
        selectedSchemes,
        userContext || null,
        focusAreas.length > 0 ? focusAreas : null
      );
      setAnalysis(result);
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGetRecommendation = async () => {
    if (!userProfile.country || !userProfile.age) {
      alert('Please fill in at least country and age');
      return;
    }
    
    try {
      setAnalyzing(true);
      const result = await aiComparatorApi.getRecommendation(
        userProfile,
        preferences.length > 0 ? preferences : null
      );
      setRecommendation(result);
    } catch (error) {
      console.error('Recommendation failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGetBestPractices = async () => {
    if (!bestPracticesCountry) {
      alert('Please select a country');
      return;
    }
    
    try {
      setAnalyzing(true);
      const result = await aiComparatorApi.getBestPractices(
        bestPracticesCountry,
        null,
        bestPracticesFocus || null
      );
      setBestPractices(result);
    } catch (error) {
      console.error('Best practices failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading AI Comparator...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Health Scheme Comparator</h2>
            <p className="text-purple-100 mt-1">
              Powered by GPT-4o for intelligent analysis and recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: 'compare', label: 'Compare Schemes', icon: Search },
          { id: 'recommend', label: 'Get Recommendation', icon: Users },
          { id: 'best-practices', label: 'Best Practices', icon: Sparkles }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Compare Tab */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          {/* Scheme Selection */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Schemes to Compare</h3>
            
            <div className="space-y-4">
              {regions.map(region => (
                <div key={region.country_code} className="border rounded-lg">
                  <button
                    onClick={() => loadSchemesForRegion(region.country_code)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <span className="font-medium">{region.country_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{region.schemes_count} schemes</span>
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </button>
                  
                  {schemesForRegion[region.country_code] && (
                    <div className="border-t p-4 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-2">
                        {schemesForRegion[region.country_code].map(scheme => (
                          <button
                            key={scheme.id}
                            onClick={() => toggleScheme(scheme.id)}
                            className={`text-left p-3 rounded-lg border transition-all ${
                              selectedSchemes.includes(scheme.id)
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 bg-white hover:border-purple-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{scheme.name}</span>
                              {selectedSchemes.includes(scheme.id) && (
                                <Check className="h-4 w-4 text-purple-600" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{scheme.coverage_type}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {selectedSchemes.length > 0 && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-purple-700">
                  {selectedSchemes.length} scheme{selectedSchemes.length !== 1 ? 's' : ''} selected
                </span>
              </div>
            )}
          </div>

          {/* Context & Focus */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison Context (Optional)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Situation</label>
                <textarea
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  placeholder="e.g., Family of 4 with chronic conditions, looking for affordable coverage..."
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Focus Areas</label>
                <div className="flex flex-wrap gap-2">
                  {focusOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => toggleFocusArea(option)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        focusAreas.includes(option)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compare Button */}
          <button
            onClick={handleCompare}
            disabled={selectedSchemes.length < 2 || analyzing}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5" />
                Compare with AI
              </>
            )}
          </button>

          {/* Analysis Result */}
          {analysis && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI Analysis
                </h3>
                <span className="text-xs text-gray-500">ID: {analysis.comparison_id}</span>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{analysis.ai_analysis}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommend Tab */}
      {activeTab === 'recommend' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tell Us About Yourself</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <select
                  value={userProfile.country}
                  onChange={(e) => setUserProfile({...userProfile, country: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select country</option>
                  {regions.map(r => (
                    <option key={r.country_code} value={r.country_code}>{r.country_name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                  placeholder="e.g., 35"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Income Level</label>
                <select
                  value={userProfile.income_level}
                  onChange={(e) => setUserProfile({...userProfile, income_level: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select income level</option>
                  {incomeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt.replace('_', ' ').charAt(0).toUpperCase() + opt.replace('_', ' ').slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Family Size</label>
                <input
                  type="number"
                  value={userProfile.family_size}
                  onChange={(e) => setUserProfile({...userProfile, family_size: e.target.value})}
                  placeholder="e.g., 4"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Health Conditions</label>
                <input
                  type="text"
                  value={userProfile.health_conditions}
                  onChange={(e) => setUserProfile({...userProfile, health_conditions: e.target.value})}
                  placeholder="e.g., Diabetes, Hypertension"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
              <div className="flex flex-wrap gap-2">
                {preferenceOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => togglePreference(option)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      preferences.includes(option)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGetRecommendation}
            disabled={!userProfile.country || !userProfile.age || analyzing}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              <>
                <Users className="h-5 w-5" />
                Get Personalized Recommendation
              </>
            )}
          </button>

          {recommendation && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Your Personalized Recommendation
                </h3>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{recommendation.recommendation}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Best Practices Tab */}
      {activeTab === 'best-practices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Best Practices Report</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country/Region *</label>
                <select
                  value={bestPracticesCountry}
                  onChange={(e) => setBestPracticesCountry(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select country</option>
                  {regions.map(r => (
                    <option key={r.country_code} value={r.country_code}>{r.country_name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Focus Area (Optional)</label>
                <input
                  type="text"
                  value={bestPracticesFocus}
                  onChange={(e) => setBestPracticesFocus(e.target.value)}
                  placeholder="e.g., chronic care, maternal health"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleGetBestPractices}
            disabled={!bestPracticesCountry || analyzing}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                Generate Best Practices Report
              </>
            )}
          </button>

          {bestPractices && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Best Practices Report
                </h3>
                <span className="text-xs text-gray-500">ID: {bestPractices.report_id}</span>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{bestPractices.best_practices}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIHealthComparator;
