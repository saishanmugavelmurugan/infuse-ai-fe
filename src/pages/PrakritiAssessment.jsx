/**
 * Prakriti Assessment Page
 * Interactive Ayurvedic constitution questionnaire with ML-powered analysis
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, Leaf, Heart, Wind, 
  Droplets, Flame, Moon, Sun, Activity, Brain, Sparkles,
  Download, Loader2, RefreshCw, ChevronRight, User
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress } from '../components/ui/progress';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const PrakritiAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [biometrics, setBiometrics] = useState({
    bmi: '',
    resting_heart_rate: '',
    sleep_hours_avg: ''
  });

  const questions = [
    {
      id: 'body_frame',
      question: 'What is your body frame and build?',
      icon: User,
      options: [
        { value: 1, label: 'Thin, light, hard to gain weight', dosha: 'Vata' },
        { value: 2, label: 'Medium, athletic, well-proportioned', dosha: 'Pitta' },
        { value: 3, label: 'Large, heavy, easy to gain weight', dosha: 'Kapha' }
      ]
    },
    {
      id: 'skin_type',
      question: 'How would you describe your skin?',
      icon: Droplets,
      options: [
        { value: 1, label: 'Dry, rough, thin, prone to cracking', dosha: 'Vata' },
        { value: 2, label: 'Warm, oily, prone to rashes/acne', dosha: 'Pitta' },
        { value: 3, label: 'Thick, moist, smooth, oily', dosha: 'Kapha' }
      ]
    },
    {
      id: 'appetite',
      question: 'How is your appetite?',
      icon: Flame,
      options: [
        { value: 1, label: 'Irregular, sometimes forget to eat', dosha: 'Vata' },
        { value: 2, label: 'Strong, get irritable if meals delayed', dosha: 'Pitta' },
        { value: 3, label: 'Steady, can easily skip meals', dosha: 'Kapha' }
      ]
    },
    {
      id: 'digestion',
      question: 'How is your digestion?',
      icon: Activity,
      options: [
        { value: 1, label: 'Irregular, gas, bloating, constipation', dosha: 'Vata' },
        { value: 2, label: 'Fast, acidic, heartburn prone', dosha: 'Pitta' },
        { value: 3, label: 'Slow, heavy feeling after meals', dosha: 'Kapha' }
      ]
    },
    {
      id: 'sleep_pattern',
      question: 'How do you typically sleep?',
      icon: Moon,
      options: [
        { value: 1, label: 'Light, interrupted, difficulty falling asleep', dosha: 'Vata' },
        { value: 2, label: 'Moderate, vivid dreams', dosha: 'Pitta' },
        { value: 3, label: 'Deep, long, hard to wake up', dosha: 'Kapha' }
      ]
    },
    {
      id: 'stress_response',
      question: 'How do you respond to stress?',
      icon: Brain,
      options: [
        { value: 1, label: 'Anxiety, worry, fear, nervousness', dosha: 'Vata' },
        { value: 2, label: 'Anger, irritation, frustration', dosha: 'Pitta' },
        { value: 3, label: 'Withdrawal, depression, avoidance', dosha: 'Kapha' }
      ]
    },
    {
      id: 'climate_preference',
      question: 'What climate do you prefer?',
      icon: Sun,
      options: [
        { value: 1, label: 'Warm, humid environments', dosha: 'Vata' },
        { value: 2, label: 'Cool, well-ventilated spaces', dosha: 'Pitta' },
        { value: 3, label: 'Warm, dry climates', dosha: 'Kapha' }
      ]
    },
    {
      id: 'activity_level',
      question: 'What is your natural activity style?',
      icon: Activity,
      options: [
        { value: 1, label: 'Very active, restless, multitasking', dosha: 'Vata' },
        { value: 2, label: 'Focused, goal-oriented, competitive', dosha: 'Pitta' },
        { value: 3, label: 'Steady, slow, methodical', dosha: 'Kapha' }
      ]
    },
    {
      id: 'memory',
      question: 'How would you describe your memory?',
      icon: Brain,
      options: [
        { value: 1, label: 'Quick to learn, quick to forget', dosha: 'Vata' },
        { value: 2, label: 'Sharp, clear, good recall', dosha: 'Pitta' },
        { value: 3, label: 'Slow to learn, but never forgets', dosha: 'Kapha' }
      ]
    },
    {
      id: 'emotional_nature',
      question: 'What is your emotional tendency?',
      icon: Heart,
      options: [
        { value: 1, label: 'Fearful, nervous, changeable moods', dosha: 'Vata' },
        { value: 2, label: 'Intense, passionate, perfectionist', dosha: 'Pitta' },
        { value: 3, label: 'Calm, attached, sentimental', dosha: 'Kapha' }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const biometricsData = {};
      if (biometrics.bmi) biometricsData.bmi = parseFloat(biometrics.bmi);
      if (biometrics.resting_heart_rate) biometricsData.resting_heart_rate = parseFloat(biometrics.resting_heart_rate);
      if (biometrics.sleep_hours_avg) biometricsData.sleep_hours_avg = parseFloat(biometrics.sleep_hours_avg);

      const response = await fetch(`${API_URL}/api/ml-health/prakriti/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: 'user-' + Date.now(),
          questionnaire: answers,
          biometrics: Object.keys(biometricsData).length > 0 ? biometricsData : null
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setShowResults(true);
      } else {
        throw new Error('Assessment failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setShowResults(false);
    setBiometrics({ bmi: '', resting_heart_rate: '', sleep_hours_avg: '' });
  };

  const progress = (Object.keys(answers).length / questions.length) * 100;
  const isComplete = Object.keys(answers).length === questions.length;

  const doshaColors = {
    'Vata': 'from-blue-500 to-purple-500',
    'Pitta': 'from-orange-500 to-red-500',
    'Kapha': 'from-green-500 to-teal-500',
    'Vata-Pitta': 'from-blue-500 to-orange-500',
    'Pitta-Kapha': 'from-orange-500 to-green-500',
    'Vata-Kapha': 'from-blue-500 to-green-500',
    'Tridosha': 'from-purple-500 to-teal-500'
  };

  const doshaIcons = {
    'Vata': Wind,
    'Pitta': Flame,
    'Kapha': Droplets
  };

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Your Prakriti Results</h1>
            <Button variant="outline" size="sm" onClick={resetAssessment} className="border-orange-200 hover:bg-orange-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Main Result Card */}
          <Card className={`mb-8 overflow-hidden bg-gradient-to-r ${doshaColors[result.prakriti] || doshaColors['Tridosha']} text-white`}>
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Your Constitution: {result.prakriti}</h2>
              <p className="text-white/80 text-lg mb-4">Confidence: {result.confidence}%</p>
              <div className="flex justify-center gap-4 flex-wrap">
                <span className="px-4 py-2 bg-white/20 rounded-full">Dominant: {result.dominant_dosha}</span>
                <span className="px-4 py-2 bg-white/20 rounded-full">Secondary: {result.secondary_dosha}</span>
              </div>
            </CardContent>
          </Card>

          {/* Dosha Breakdown */}
          <Card className="mb-8 border border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                Dosha Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(result.dosha_breakdown).map(([dosha, percentage]) => {
                  const Icon = doshaIcons[dosha] || Leaf;
                  return (
                    <div key={dosha}>
                      <div className="flex justify-between mb-1">
                        <span className="flex items-center gap-2 font-medium">
                          <Icon className="w-4 h-4" />
                          {dosha}
                        </span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-3" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {result.recommendations && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Diet */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Diet Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.diet?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Lifestyle */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    Lifestyle Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.lifestyle?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Herbs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-500" />
                    Recommended Herbs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.herbs?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Yoga */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Yoga Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.yoga?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Avoid Section */}
          {result.recommendations?.avoid && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                  <ArrowLeft className="w-5 h-5" />
                  Things to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-2">
                  {result.recommendations.avoid.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-red-700">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={() => navigate('/health-analysis')} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md">
              <Activity className="w-4 h-4 mr-2" />
              Get Full Health Analysis
            </Button>
            <Button variant="outline" onClick={() => navigate('/appointments/book')} className="border-orange-200 hover:bg-orange-50">
              <Heart className="w-4 h-4 mr-2" />
              Book Ayurvedic Consultation
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-gray-500 mt-8 max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This assessment is for informational purposes only and does not constitute medical advice. 
            Please consult a qualified Ayurvedic practitioner for personalized guidance.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-orange-500" />
              <h1 className="text-xl font-bold text-gray-800">Prakriti Assessment</h1>
            </div>
            <span className="text-sm text-gray-500">{Object.keys(answers).length}/{questions.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Introduction */}
        {currentQuestion === 0 && Object.keys(answers).length === 0 && (
          <Card className="mb-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-3">Discover Your Ayurvedic Constitution</h2>
              <p className="text-white/90 mb-4">
                Prakriti is your unique mind-body constitution determined at birth. Understanding your Prakriti 
                helps personalize diet, lifestyle, and wellness practices for optimal health.
              </p>
              <div className="flex gap-4 flex-wrap text-sm">
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <Wind className="w-4 h-4" /> Vata (Air)
                </span>
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <Flame className="w-4 h-4" /> Pitta (Fire)
                </span>
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <Droplets className="w-4 h-4" /> Kapha (Earth)
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Card */}
        <Card className="mb-6 border border-orange-100">
          <CardHeader>
            <div className="flex items-center gap-3">
              {React.createElement(questions[currentQuestion].icon, { className: 'w-8 h-8 text-orange-500' })}
              <div>
                <CardDescription>Question {currentQuestion + 1} of {questions.length}</CardDescription>
                <CardTitle className="text-lg">{questions[currentQuestion].question}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    answers[questions[currentQuestion].id] === option.value
                      ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      option.dosha === 'Vata' ? 'bg-blue-100 text-blue-700' :
                      option.dosha === 'Pitta' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {option.dosha}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentQuestion < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={!answers[questions[currentQuestion].id]}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>

        {/* Optional Biometrics & Submit */}
        {isComplete && (
          <Card className="mb-6 border border-orange-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Optional: Add Biometrics for Better Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">BMI</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 22.5"
                    value={biometrics.bmi}
                    onChange={(e) => setBiometrics(prev => ({ ...prev, bmi: e.target.value }))}
                    className="w-full p-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Resting Heart Rate (bpm)</label>
                  <input
                    type="number"
                    placeholder="e.g., 72"
                    value={biometrics.resting_heart_rate}
                    onChange={(e) => setBiometrics(prev => ({ ...prev, resting_heart_rate: e.target.value }))}
                    className="w-full p-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Avg Sleep (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g., 7"
                    value={biometrics.sleep_hours_avg}
                    onChange={(e) => setBiometrics(prev => ({ ...prev, sleep_hours_avg: e.target.value }))}
                    className="w-full p-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                data-testid="prakriti-submit-btn"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-lg py-6 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Prakriti...
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5 mr-2" />
                    Discover My Prakriti
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 flex-wrap">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentQuestion ? 'bg-gradient-to-r from-orange-500 to-amber-500 w-6' :
                answers[questions[idx].id] ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PrakritiAssessment;
