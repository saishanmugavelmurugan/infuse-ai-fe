import React, { useState, useEffect } from 'react';
import {
  Heart, Utensils, Dumbbell, Sparkles, Play, ChevronDown, ChevronUp,
  Target, Calendar, Clock, Flame, Droplets, Moon, Sun, Leaf,
  AlertCircle, CheckCircle, Loader2, Youtube, ExternalLink, Watch,
  Download, FileText, Printer
} from 'lucide-react';
import WearableIntegration from './WearableIntegration';
import { exportToPDF, exportToWord, exportToText } from '../../utils/reportExport';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const focusAreaOptions = [
  { id: 'weight_loss', label: 'Weight Loss', icon: '🏃' },
  { id: 'weight_gain', label: 'Weight Gain', icon: '💪' },
  { id: 'diabetes_control', label: 'Diabetes Control', icon: '🩸' },
  { id: 'cholesterol_management', label: 'Cholesterol Management', icon: '❤️' },
  { id: 'hypertension', label: 'Hypertension', icon: '🫀' },
  { id: 'stress_management', label: 'Stress Management', icon: '🧘' },
  { id: 'pcos_management', label: 'PCOS Management', icon: '👩' },
  { id: 'thyroid_management', label: 'Thyroid Management', icon: '🦋' },
  { id: 'back_pain', label: 'Back Pain Relief', icon: '🔙' },
  { id: 'sleep_improvement', label: 'Sleep Improvement', icon: '😴' },
  { id: 'general_wellness', label: 'General Wellness', icon: '✨' },
  { id: 'immunity_boost', label: 'Immunity Boost', icon: '🛡️' }
];

const AILifestylePlanner = ({ patientId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(null);
  const [showWearables, setShowWearables] = useState(false);
  const [wearableData, setWearableData] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    diet: true,
    workout: true,
    yoga: true,
    schedule: false
  });
  
  // Form state
  const [formData, setFormData] = useState({
    focus_areas: ['general_wellness'],
    plan_duration: '4_weeks',
    activity_level: 'moderate',
    age: '',
    gender: 'male',
    current_weight_kg: '',
    target_weight_kg: '',
    dietary_preferences: [],
    health_conditions: [],
    allergies: []
  });

  // Fetch wearable data on mount
  useEffect(() => {
    fetchWearableData();
  }, [patientId]);

  const fetchWearableData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/wearable-integrations/lifestyle-data/${patientId || 'demo_user'}`);
      if (response.ok) {
        const data = await response.json();
        if (data.connected_devices > 0) {
          setWearableData(data);
          // Auto-fill form with wearable data
          if (data.ai_ready_data) {
            setFormData(prev => ({
              ...prev,
              activity_level: data.ai_ready_data.activity_level || prev.activity_level,
              focus_areas: data.focus_area_suggestions || prev.focus_areas
            }));
          }
        }
      }
    } catch (err) {
      console.log('No wearable data available');
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/ai-wellness/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_id: patientId || 'demo_patient',
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
          current_weight_kg: formData.current_weight_kg ? parseFloat(formData.current_weight_kg) : null,
          target_weight_kg: formData.target_weight_kg ? parseFloat(formData.target_weight_kg) : null
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate plan');
      
      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFocusArea = (areaId) => {
    setFormData(prev => ({
      ...prev,
      focus_areas: prev.focus_areas.includes(areaId)
        ? prev.focus_areas.filter(id => id !== areaId)
        : [...prev.focus_areas, areaId]
    }));
  };

  // Export handlers
  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportToPDF(plan, { name: patientId || 'Patient' });
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportWord = () => {
    exportToWord(plan, { name: patientId || 'Patient' });
  };

  const handlePrint = () => {
    const content = exportToText(plan, { name: patientId || 'Patient' });
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Infuse Wellness Plan</title>
          <style>
            body { font-family: 'Courier New', monospace; white-space: pre-wrap; padding: 20px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white p-6" data-testid="ai-lifestyle-planner">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">AI-Powered</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Lifestyle Correction Plan</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get a personalized diet, workout, and yoga plan based on your health goals.
            Includes YouTube video demonstrations for yoga asanas.
          </p>
        </div>

        {/* Wearable Integration Toggle */}
        {!plan && (
          <div className="mb-6">
            <button
              onClick={() => setShowWearables(!showWearables)}
              className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                showWearables || wearableData?.connected_devices > 0
                  ? 'bg-emerald-600/20 border-emerald-500'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Watch className="w-6 h-6 text-emerald-500" />
                <div className="text-left">
                  <h3 className="font-semibold">
                    {wearableData?.connected_devices > 0 
                      ? `${wearableData.connected_devices} Device(s) Connected` 
                      : 'Connect Wearable Devices'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {wearableData?.connected_devices > 0 
                      ? 'Using real health data for personalized recommendations'
                      : 'Sync Fitbit, Apple Watch, Google Fit for better plans'}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showWearables ? 'rotate-180' : ''}`} />
            </button>

            {showWearables && (
              <div className="mt-4 bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                <WearableIntegration 
                  patientId={patientId || 'demo_user'} 
                  onDataReady={() => {
                    setShowWearables(false);
                    fetchWearableData();
                  }}
                />
              </div>
            )}

            {/* Wearable Data Summary */}
            {wearableData?.ai_ready_data && !showWearables && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400">Avg Steps</p>
                  <p className="text-lg font-bold text-emerald-400">{wearableData.ai_ready_data.avg_daily_steps?.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400">Avg Sleep</p>
                  <p className="text-lg font-bold text-blue-400">{wearableData.ai_ready_data.avg_sleep_hours}h</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400">Avg Heart Rate</p>
                  <p className="text-lg font-bold text-red-400">{wearableData.ai_ready_data.avg_heart_rate} bpm</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400">Activity Level</p>
                  <p className="text-lg font-bold text-purple-400 capitalize">{wearableData.ai_ready_data.activity_level}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Plan Generator Form */}
        {!plan && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              Select Your Goals
            </h2>
            
            {/* Focus Areas */}
            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-3">Focus Areas (select multiple)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {focusAreaOptions.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => toggleFocusArea(area.id)}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      formData.focus_areas.includes(area.id)
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                    }`}
                    data-testid={`focus-area-${area.id}`}
                  >
                    <span className="text-xl mr-2">{area.icon}</span>
                    <span className="text-sm font-medium">{area.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter age"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Activity Level</label>
                <select
                  value={formData.activity_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, activity_level: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Activity</option>
                  <option value="moderate">Moderate Activity</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Current Weight (kg)</label>
                <input
                  type="number"
                  value={formData.current_weight_kg}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_weight_kg: e.target.value }))}
                  placeholder="e.g., 70"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Target Weight (kg)</label>
                <input
                  type="number"
                  value={formData.target_weight_kg}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_weight_kg: e.target.value }))}
                  placeholder="e.g., 65"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Plan Duration</label>
                <select
                  value={formData.plan_duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, plan_duration: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="2_weeks">2 Weeks</option>
                  <option value="4_weeks">4 Weeks</option>
                  <option value="8_weeks">8 Weeks</option>
                  <option value="12_weeks">12 Weeks</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePlan}
              disabled={loading || formData.focus_areas.length === 0}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="generate-plan-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Lifestyle Plan
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Generated Plan Display */}
        {plan && (
          <div className="space-y-6">
            {/* Plan Header */}
            <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/infuse_logo.jpg" alt="Infuse" className="h-8 rounded" />
                    <span className="text-xs text-emerald-400 font-medium">Powered by Infuse AI</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Your Personalized Plan</h2>
                  <div className="flex flex-wrap gap-2">
                    {plan.focus_areas.map((area) => (
                      <span key={area} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                        {area.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Export Buttons */}
                  <button
                    onClick={handleExportPDF}
                    disabled={exporting}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors disabled:opacity-50"
                    data-testid="export-pdf-btn"
                  >
                    {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    PDF
                  </button>
                  <button
                    onClick={handleExportWord}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    data-testid="export-word-btn"
                  >
                    <FileText className="w-4 h-4" />
                    Word
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    data-testid="print-btn"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    onClick={() => setPlan(null)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    New Plan
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm">Daily Calories</span>
                  </div>
                  <p className="text-2xl font-bold">{plan.diet_plan.daily_calorie_target}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm">Hydration</span>
                  </div>
                  <p className="text-2xl font-bold">{plan.diet_plan.hydration_target_liters}L</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Dumbbell className="w-4 h-4" />
                    <span className="text-sm">Weekly Exercise</span>
                  </div>
                  <p className="text-2xl font-bold">{plan.workout_plan.total_weekly_minutes} min</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Leaf className="w-4 h-4" />
                    <span className="text-sm">Daily Yoga</span>
                  </div>
                  <p className="text-2xl font-bold">{plan.yoga_plan.total_duration_minutes} min</p>
                </div>
              </div>
            </div>

            {/* Diet Plan Section */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('diet')}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Utensils className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold">Diet Plan</h3>
                    <p className="text-slate-400 text-sm">{plan.diet_plan.daily_calorie_target} kcal/day • {plan.diet_plan.meals.length} meals</p>
                  </div>
                </div>
                {expandedSections.diet ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {expandedSections.diet && (
                <div className="p-6 pt-0 border-t border-slate-700">
                  {/* Macro Distribution */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Macro Distribution</h4>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-blue-500/20 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-400">{plan.diet_plan.macro_distribution.carbs}%</p>
                        <p className="text-sm text-slate-400">Carbs</p>
                      </div>
                      <div className="flex-1 bg-red-500/20 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-400">{plan.diet_plan.macro_distribution.protein}%</p>
                        <p className="text-sm text-slate-400">Protein</p>
                      </div>
                      <div className="flex-1 bg-yellow-500/20 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-yellow-400">{plan.diet_plan.macro_distribution.fats}%</p>
                        <p className="text-sm text-slate-400">Fats</p>
                      </div>
                    </div>
                  </div>

                  {/* Meal Plan */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Daily Meals</h4>
                    <div className="space-y-3">
                      {plan.diet_plan.meals.map((meal, idx) => (
                        <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="font-medium capitalize">{meal.meal_type.replace(/_/g, ' ')}</span>
                              <span className="text-slate-400">• {meal.time}</span>
                            </div>
                            <span className="text-emerald-400 font-medium">{meal.calories} kcal</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {meal.foods.map((food, i) => (
                              <span key={i} className="px-2 py-1 bg-slate-600 rounded text-sm">{food}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Foods to Include/Avoid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4" /> Foods to Include
                      </h4>
                      <ul className="space-y-1">
                        {plan.diet_plan.foods_to_include.slice(0, 6).map((food, i) => (
                          <li key={i} className="text-sm text-slate-300">• {food}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4" /> Foods to Avoid
                      </h4>
                      <ul className="space-y-1">
                        {plan.diet_plan.foods_to_avoid.slice(0, 6).map((food, i) => (
                          <li key={i} className="text-sm text-slate-300">• {food}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Ayurvedic Recommendations */}
                  {plan.diet_plan.ayurvedic_recommendations && (
                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-amber-400">
                        <Leaf className="w-4 h-4" /> Ayurvedic Recommendations
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li>• {plan.diet_plan.ayurvedic_recommendations.warm_water}</li>
                        <li>• {plan.diet_plan.ayurvedic_recommendations.timing}</li>
                        <li>• Recommended spices: {plan.diet_plan.ayurvedic_recommendations.spices?.join(', ')}</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Workout Plan Section */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('workout')}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Dumbbell className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold">Workout Plan</h3>
                    <p className="text-slate-400 text-sm">{plan.workout_plan.total_weekly_minutes} min/week • {plan.workout_plan.exercises.length} exercises</p>
                  </div>
                </div>
                {expandedSections.workout ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {expandedSections.workout && (
                <div className="p-6 pt-0 border-t border-slate-700">
                  {/* Weekly Schedule */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Weekly Schedule</h4>
                    <div className="grid grid-cols-7 gap-2">
                      {Object.entries(plan.workout_plan.weekly_schedule).map(([day, exercises]) => (
                        <div key={day} className={`p-3 rounded-lg text-center ${
                          plan.workout_plan.rest_days.includes(day) 
                            ? 'bg-slate-700/30' 
                            : 'bg-blue-500/10 border border-blue-500/30'
                        }`}>
                          <p className="text-xs font-medium mb-1">{day.slice(0, 3)}</p>
                          <p className="text-xs text-slate-400">
                            {plan.workout_plan.rest_days.includes(day) ? 'Rest' : `${exercises.length} ex`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exercises */}
                  <div className="space-y-3">
                    {plan.workout_plan.exercises.map((exercise, idx) => (
                      <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{exercise.name}</h5>
                          <span className={`px-2 py-1 rounded text-xs ${
                            exercise.intensity === 'high' ? 'bg-red-500/20 text-red-400' :
                            exercise.intensity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {exercise.intensity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{exercise.instructions}</p>
                        <div className="flex gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {exercise.duration_minutes} min
                          </span>
                          {exercise.calories_burned && (
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3" /> {exercise.calories_burned} kcal
                            </span>
                          )}
                          <span className="capitalize">{exercise.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-sm text-slate-400 italic">
                    {plan.workout_plan.progression_notes}
                  </p>
                </div>
              )}
            </div>

            {/* Yoga Plan Section */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('yoga')}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Leaf className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold">Yoga & Meditation</h3>
                    <p className="text-slate-400 text-sm">{plan.yoga_plan.total_duration_minutes} min/day • {plan.yoga_plan.asanas.length} asanas</p>
                  </div>
                </div>
                {expandedSections.yoga ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {expandedSections.yoga && (
                <div className="p-6 pt-0 border-t border-slate-700">
                  {/* Daily Routine */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <h4 className="font-medium flex items-center gap-2 text-amber-400 mb-2">
                        <Sun className="w-4 h-4" /> Morning Routine
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {plan.yoga_plan.daily_routine.morning?.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                      <h4 className="font-medium flex items-center gap-2 text-indigo-400 mb-2">
                        <Moon className="w-4 h-4" /> Evening Routine
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {plan.yoga_plan.daily_routine.evening?.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Asanas with YouTube Videos */}
                  <h4 className="font-medium mb-3">Recommended Asanas</h4>
                  <div className="space-y-4">
                    {plan.yoga_plan.asanas.map((asana, idx) => (
                      <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium text-lg">{asana.name}</h5>
                            <p className="text-purple-400 text-sm italic">{asana.sanskrit_name}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            asana.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            asana.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {asana.difficulty}
                          </span>
                        </div>
                        
                        {/* Benefits */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {asana.benefits.map((benefit, i) => (
                            <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                              {benefit}
                            </span>
                          ))}
                        </div>

                        {/* Duration */}
                        <div className="flex gap-4 text-sm text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {asana.duration_minutes} min
                          </span>
                          {asana.repetitions && (
                            <span>{asana.repetitions} repetitions</span>
                          )}
                        </div>

                        {/* Contraindications */}
                        {asana.contraindications?.length > 0 && (
                          <div className="mb-3 p-2 bg-red-500/10 rounded text-xs text-red-400">
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                            Avoid if: {asana.contraindications.join(', ')}
                          </div>
                        )}

                        {/* YouTube Videos */}
                        {asana.youtube_videos?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-600">
                            <p className="text-sm text-slate-400 mb-2 flex items-center gap-1">
                              <Youtube className="w-4 h-4 text-red-500" /> Video Demonstrations
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {asana.youtube_videos.map((video, vIdx) => (
                                <a
                                  key={vIdx}
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
                                >
                                  <Play className="w-4 h-4 text-red-500" />
                                  <span className="text-sm truncate max-w-[200px]">{video.title}</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pranayama */}
                  {plan.yoga_plan.pranayama?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Pranayama (Breathing Exercises)</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {plan.yoga_plan.pranayama.map((p, idx) => (
                          <div key={idx} className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                            <h5 className="font-medium text-teal-400">{p.name}</h5>
                            <p className="text-sm text-slate-400 mt-1">{p.technique}</p>
                            <p className="text-xs text-slate-500 mt-2">{p.duration_minutes} minutes</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meditation */}
                  {plan.yoga_plan.meditation?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Meditation Practices</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {plan.yoga_plan.meditation.map((m, idx) => (
                          <div key={idx} className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                            <h5 className="font-medium text-indigo-400">{m.name}</h5>
                            <p className="text-sm text-slate-400 mt-1">{m.technique}</p>
                            <p className="text-xs text-slate-500 mt-2">{m.duration_minutes} minutes</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-500" /> Daily Recommendations
              </h3>
              <ul className="grid md:grid-cols-2 gap-3">
                {plan.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress Milestones */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" /> Progress Milestones
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700"></div>
                <div className="space-y-4">
                  {plan.progress_milestones.map((milestone, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-8">
                      <div className="absolute left-2 w-4 h-4 bg-purple-500 rounded-full border-4 border-slate-900"></div>
                      <div className="flex-1 bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Week {milestone.week}</span>
                          <span className="text-xs text-purple-400">{milestone.metric}</span>
                        </div>
                        <p className="text-sm text-slate-400">{milestone.goal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILifestylePlanner;
