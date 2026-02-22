import React, { useState } from 'react';
import { Activity, Shield, Users, Bell, TrendingUp, FileText, Calendar, Video, CheckCircle, AlertTriangle, Play } from 'lucide-react';

const VirtualDemo = () => {
  const [activeProduct, setActiveProduct] = useState('healthtrack');
  const [demoStep, setDemoStep] = useState(1);

  const healthtrackSteps = [
    {
      title: 'Unified Health Dashboard',
      description: 'All your health data in one place - from smartwatches, doctors, and manual entries',
      image: (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 h-96 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">My Health Dashboard</h3>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Heart Rate</p>
              <p className="text-3xl font-bold text-orange-600">72</p>
              <p className="text-xs text-gray-500">bpm - Normal</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Blood Pressure</p>
              <p className="text-3xl font-bold text-green-600">120/80</p>
              <p className="text-xs text-gray-500">mmHg - Normal</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Steps Today</p>
              <p className="text-3xl font-bold text-blue-600">8,432</p>
              <p className="text-xs text-gray-500">Goal: 10,000</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md flex-1">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h4 className="font-bold text-gray-900">7-Day Health Trend</h4>
            </div>
            <div className="flex items-end gap-2 h-32">
              {[65, 72, 68, 75, 70, 72, 78].map((height, i) => (
                <div key={i} className="flex-1 bg-orange-400 rounded-t-lg" style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'AI-Powered Health Insights',
      description: 'Get personalized recommendations and early warnings based on your health data',
      image: (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 h-96 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">AI Health Analysis</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Excellent Heart Health</p>
                  <p className="text-sm text-gray-600">Your heart rate variability is in the optimal range. Keep up the good work!</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-yellow-500">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Sleep Improvement Needed</p>
                  <p className="text-sm text-gray-600">You've averaged 5.5 hours of sleep. Aim for 7-8 hours for optimal health.</p>
                  <button className="text-sm text-blue-600 hover:underline mt-2">View Sleep Tips →</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Preventive Care Reminder</p>
                  <p className="text-sm text-gray-600">Your annual health checkup is due next month. Book an appointment.</p>
                  <button className="text-sm text-blue-600 hover:underline mt-2">Find Doctors →</button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 mb-1">Your Health Score</p>
                  <p className="text-sm text-gray-600">Based on 30 days of data</p>
                </div>
                <div className="text-5xl font-bold text-orange-600">8.4<span className="text-2xl">/10</span></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Doctor Network & Appointments',
      description: 'Find verified doctors, book appointments, and conduct video consultations',
      image: (
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 h-96 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Find Doctors</h3>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">Book Now</button>
          </div>

          <div className="space-y-3 overflow-auto">
            {[
              { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.9, price: '$99', available: 'Today 3:00 PM' },
              { name: 'Dr. Michael Chen', specialty: 'General Physician', rating: 4.8, price: '$49', available: 'Today 4:30 PM' },
              { name: 'Dr. Priya Sharma', specialty: 'Endocrinologist', rating: 4.9, price: '$129', available: 'Tomorrow 10:00 AM' }
            ].map((doctor, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-md flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
                  {doctor.name.charAt(4)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{doctor.name}</p>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-yellow-600">★ {doctor.rating}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{doctor.price}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-semibold">{doctor.available}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200">
                      <Video className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 bg-green-100 rounded-lg hover:bg-green-200">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const secureitSteps = [
    {
      title: 'Real-Time Threat Detection',
      description: 'Monitor all IoT devices and detect threats in under 100ms with 99.8% accuracy',
      image: (
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 h-96 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Security Dashboard</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-600">Live Monitoring</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Active Devices</p>
              <p className="text-3xl font-bold text-blue-600">8,432</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Threats Blocked</p>
              <p className="text-3xl font-bold text-green-600">1,247</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Active Threats</p>
              <p className="text-3xl font-bold text-red-600">3</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Uptime</p>
              <p className="text-3xl font-bold text-purple-600">99.999%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md flex-1">
            <h4 className="font-bold text-gray-900 mb-4">Recent Threats</h4>
            <div className="space-y-2">
              {[
                { type: 'Botnet Attack', severity: 'Critical', status: 'Blocked', time: '2 min ago' },
                { type: 'Data Exfiltration', severity: 'High', status: 'Quarantined', time: '15 min ago' },
                { type: 'Malware Detected', severity: 'Medium', status: 'Investigating', time: '1 hour ago' }
              ].map((threat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      threat.severity === 'Critical' ? 'text-red-600' :
                      threat.severity === 'High' ? 'text-orange-600' : 'text-yellow-600'
                    }`} />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{threat.type}</p>
                      <p className="text-xs text-gray-500">{threat.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    threat.status === 'Blocked' ? 'bg-green-100 text-green-700' :
                    threat.status === 'Quarantined' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {threat.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Automated Enforcement',
      description: 'Automatic threat mitigation with configurable policies - no manual intervention needed',
      image: (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 h-96 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Enforcement Policies</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900">Critical Threats</p>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Auto-Quarantine</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Instantly isolate devices showing critical threat patterns</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>247 devices protected today</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900">High-Risk Traffic</p>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Auto-Block</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Block connections to malicious IPs and domains</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>1,543 connections blocked today</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900">Suspicious Behavior</p>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Alert & Log</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Monitor and alert on unusual device patterns</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>89 anomalies detected and logged</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Operational Excellence',
      description: 'Network optimization, cost reduction, and compliance management in one platform',
      image: (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 h-96 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Operations Dashboard</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-2">Network Performance</p>
              <div className="flex items-end gap-1 h-16 mb-2">
                {[80, 85, 75, 90, 88, 92, 95].map((height, i) => (
                  <div key={i} className="flex-1 bg-blue-400 rounded-t" style={{ height: `${height}%` }} />
                ))}
              </div>
              <p className="text-xs text-gray-500">Avg latency: 45ms</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 mb-2">Cost Optimization</p>
              <p className="text-3xl font-bold text-green-600 mb-1">$2.3M</p>
              <p className="text-xs text-gray-500">Saved this year</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md flex-1">
            <h4 className="font-bold text-gray-900 mb-3">Key Metrics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">NOC Workload Reduction</span>
                <span className="font-bold text-blue-600">40%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Fraud Prevention Savings</span>
                <span className="font-bold text-green-600">$10M+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Customer Churn Reduction</span>
                <span className="font-bold text-purple-600">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Incident Response Time</span>
                <span className="font-bold text-orange-600">60% Faster</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSteps = activeProduct === 'healthtrack' ? healthtrackSteps : secureitSteps;

  return (
    <div className="p-8">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Interactive Product Demo</h2>
        <p className="text-xl text-gray-600 mb-6">Explore how Infuse-ai transforms healthcare and security</p>
        
        {/* Product Selector */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => { setActiveProduct('healthtrack'); setDemoStep(1); }}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 ${
              activeProduct === 'healthtrack'
                ? 'bg-orange-600 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400'
            }`}
          >
            <Activity className="w-6 h-6" />
            HealthTrack Pro
          </button>
          <button
            onClick={() => { setActiveProduct('secureit'); setDemoStep(1); }}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 ${
              activeProduct === 'secureit'
                ? 'bg-gray-700 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-500'
            }`}
          >
            <Shield className="w-6 h-6" />
            SecureIT+IoT
          </button>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Step Header */}
          <div className={`p-6 ${
            activeProduct === 'healthtrack'
              ? 'bg-gradient-to-r from-orange-600 to-orange-500'
              : 'bg-gradient-to-r from-gray-700 to-gray-600'
          } text-white`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">{currentSteps[demoStep - 1].title}</h3>
              <span className="text-sm opacity-75">Step {demoStep} of {currentSteps.length}</span>
            </div>
            <p className="text-lg opacity-90">{currentSteps[demoStep - 1].description}</p>
          </div>

          {/* Step Content */}
          <div className="p-8">
            {currentSteps[demoStep - 1].image}
          </div>

          {/* Navigation */}
          <div className="p-6 bg-gray-50 border-t-2 border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setDemoStep(Math.max(1, demoStep - 1))}
              disabled={demoStep === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                demoStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : activeProduct === 'healthtrack'
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-700 text-white hover:bg-gray-800'
              }`}
            >
              Previous
            </button>

            {/* Step Indicators */}
            <div className="flex gap-2">
              {currentSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setDemoStep(index + 1)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index + 1 === demoStep
                      ? (activeProduct === 'healthtrack' ? 'bg-orange-600 w-8' : 'bg-gray-700 w-8')
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setDemoStep(Math.min(currentSteps.length, demoStep + 1))}
              disabled={demoStep === currentSteps.length}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                demoStep === currentSteps.length
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : activeProduct === 'healthtrack'
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-700 text-white hover:bg-gray-800'
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Ready to experience the full platform?</p>
          <button className={`px-8 py-4 rounded-xl font-semibold text-lg text-white shadow-xl transition-all ${
            activeProduct === 'healthtrack'
              ? 'bg-orange-600 hover:bg-orange-700'
              : 'bg-gray-700 hover:bg-gray-800'
          }`}>
            <Play className="w-5 h-5 inline mr-2" />
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualDemo;