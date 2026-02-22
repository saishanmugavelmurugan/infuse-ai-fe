import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Activity, Shield, Users, TrendingUp, DollarSign, Globe, Award, Zap, Check, X, Play, Phone, Mail, Linkedin, Download } from 'lucide-react';
import VirtualDemo from '../components/VirtualDemo';

const PitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  const slides = [
    // Slide 1: Title
    {
      type: 'title',
      content: (
        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 text-white p-12">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#ea580c', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#f97316', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <path d="M20 50 L50 20 L80 50 L50 80 Z" fill="url(#logoGradient)" />
                  <circle cx="50" cy="50" r="8" fill="white" />
                  <path d="M50 35 L50 50 M50 50 L65 50" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="text-7xl font-bold tracking-tight">Infuse-ai</h1>
            </div>
          </div>
          <p className="text-3xl font-light mb-8 text-orange-50">Enterprise Healthcare & Security Solutions</p>
          <p className="text-xl text-orange-100 max-w-3xl text-center leading-relaxed">
            Transforming Healthcare Management and IoT Security with AI-Powered Intelligence
          </p>
          <div className="mt-12 flex gap-6">
            <button 
              onClick={() => setShowDemo(true)}
              className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-all shadow-xl flex items-center gap-2"
            >
              <Play className="w-5 h-5" /> Watch Demo
            </button>
          </div>
        </div>
      )
    },

    // Slide 2: Problem Statement
    {
      type: 'content',
      title: 'The Problem',
      subtitle: 'Critical Gaps in Healthcare & Security',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-10 h-10 text-red-600" />
              <h3 className="text-2xl font-bold text-red-900">Healthcare Crisis</h3>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <span><strong>Fragmented Records:</strong> Patient data scattered across multiple providers</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <span><strong>Expensive Care:</strong> Specialist consultations cost $199-$999</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <span><strong>Poor Insurance Integration:</strong> Manual claims, no real-time verification</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <span><strong>Urban-Centric:</strong> Limited reach in rural areas</span>
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 rounded-2xl p-8 border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-10 h-10 text-orange-600" />
              <h3 className="text-2xl font-bold text-orange-900">Security Challenges</h3>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                <span><strong>Vendor Lock-in:</strong> Telcos trapped with specific RAN vendors</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                <span><strong>Detection-Only:</strong> Security systems alert but don't mitigate</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                <span><strong>Revenue Losses:</strong> $10M+/year in fraud and security breaches</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                <span><strong>Complex Operations:</strong> Multiple systems, high operational overhead</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // Slide 3: Our Solution
    {
      type: 'content',
      title: 'Our Solution',
      subtitle: 'Two Revolutionary Products',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border-2 border-orange-300 hover:shadow-2xl transition-all">
            <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Activity className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-3xl font-bold text-orange-900 mb-4">HealthTrack Pro</h3>
            <p className="text-gray-700 mb-6 text-lg">Unified AI-Powered Health Management Platform</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>Unified Health Vault:</strong> One place for all medical records</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>Smart Watch Integration:</strong> Real-time health monitoring</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>AI Analytics:</strong> Predictive health insights (80% accuracy)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>Doctor Network:</strong> 10,000+ verified healthcare providers</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>Insurance Integration:</strong> One-click claims, real-time verification</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t-2 border-orange-300">
              <p className="text-sm text-gray-600 mb-2">Target Market:</p>
              <p className="font-semibold text-orange-900">10,000+ paying users • $1.26M Year 1 Revenue</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-300 hover:shadow-2xl transition-all">
            <div className="bg-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">SecureIT+IoT</h3>
            <p className="text-gray-700 mb-6 text-lg">Enterprise Telco-Grade Security Platform</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>RAN Independent:</strong> Works with ANY vendor (Ericsson, Nokia, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>Real-Time Enforcement:</strong> Auto-mitigate threats in &lt;100ms</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>Threat Detection:</strong> 99.8% accuracy with ML-powered engine</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>Operational Excellence:</strong> 40% NOC workload reduction</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>Global Scale:</strong> 10M+ devices, 99.999% uptime</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t-2 border-gray-300">
              <p className="text-sm text-gray-600 mb-2">Target Market:</p>
              <p className="font-semibold text-gray-900">Tier 1 Telcos & MNOs • $5.18M Year 1 Revenue</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Competitive Advantage
    {
      type: 'content',
      title: 'Competitive Advantage',
      subtitle: 'Why We Win',
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-orange-600 mb-6">HealthTrack Pro vs. Competition</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="pb-4 text-gray-700 font-semibold">Feature</th>
                    <th className="pb-4 text-gray-700 font-semibold text-center">Practo</th>
                    <th className="pb-4 text-gray-700 font-semibold text-center">Tata 1mg</th>
                    <th className="pb-4 text-orange-600 font-bold text-center">HealthTrack Pro</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-100">
                    <td className="py-4">Unified Health Records</td>
                    <td className="py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4">Insurance Integration</td>
                    <td className="py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4">Corporate Wellness</td>
                    <td className="py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4">Pricing</td>
                    <td className="py-4 text-center text-red-600 font-semibold">$199-$999</td>
                    <td className="py-4 text-center text-red-600 font-semibold">$200-$800</td>
                    <td className="py-4 text-center text-green-600 font-bold">$99-$299</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-700 mb-6">SecureIT+IoT Unique Differentiators</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">RAN Independence</h4>
                <p className="text-sm text-gray-600">Works with ANY RAN vendor - future-proof solution</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Auto Enforcement</h4>
                <p className="text-sm text-gray-600">Real-time threat mitigation, not just detection</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Telco-Grade</h4>
                <p className="text-sm text-gray-600">99.999% uptime, global scale ready</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Market & Business Model
    {
      type: 'content',
      title: 'Market Opportunity',
      subtitle: 'Massive TAM with Proven Revenue Model',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-10 h-10" />
                <h3 className="text-2xl font-bold">Market Size</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Digital Health Market</p>
                  <p className="text-4xl font-bold">$639B</p>
                  <p className="text-orange-100 text-sm">by 2026 (CAGR 27.7%)</p>
                </div>
                <div className="pt-4 border-t border-orange-400">
                  <p className="text-orange-100 text-sm mb-1">IoT Security Market</p>
                  <p className="text-4xl font-bold">$36.6B</p>
                  <p className="text-orange-100 text-sm">by 2027 (CAGR 21.2%)</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Target Customers</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">HealthTrack Pro</p>
                    <p className="text-sm text-gray-600">Individual consumers, families, enterprises with 100+ employees</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-700 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">SecureIT+IoT</p>
                    <p className="text-sm text-gray-600">Tier 1 telcos, regional MNOs, MVNOs, private 5G networks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-10 h-10 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">Revenue Model</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-orange-600 mb-3">HealthTrack Pro</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Free Tier</span>
                      <span className="font-semibold text-gray-900">$0/month</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-700">Premium</span>
                      <span className="font-semibold text-orange-600">$99/month</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg">
                      <span className="text-gray-700">Enterprise</span>
                      <span className="font-semibold text-orange-700">$299/month</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-3">SecureIT+IoT</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">30-Day Trial</span>
                      <span className="font-semibold text-gray-900">Free</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="text-gray-700">Starter</span>
                      <span className="font-semibold text-gray-700">$9,600/mo</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-200 rounded-lg">
                      <span className="text-gray-700">Professional</span>
                      <span className="font-semibold text-gray-800">$24,000/mo</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-300 rounded-lg">
                      <span className="text-gray-700">Enterprise</span>
                      <span className="font-semibold text-gray-900">$60,000+/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: Financial Projections
    {
      type: 'content',
      title: 'Financial Projections',
      subtitle: '3-Year Revenue Growth with 300% Margin',
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl">
              <p className="text-green-100 text-sm mb-2">Year 1 (Conservative)</p>
              <p className="text-5xl font-bold mb-2">$6.44M</p>
              <div className="space-y-1 text-sm text-green-100">
                <p>• HealthTrack: $1.26M</p>
                <p>• SecureIT: $5.18M</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
              <p className="text-orange-100 text-sm mb-2">Year 2 (Target)</p>
              <p className="text-5xl font-bold mb-2">$23M</p>
              <div className="space-y-1 text-sm text-orange-100">
                <p>• 300% margin target</p>
                <p>• Break-even achieved</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
              <p className="text-blue-100 text-sm mb-2">Year 3 (Aggressive)</p>
              <p className="text-5xl font-bold mb-2">$52.56M</p>
              <div className="space-y-1 text-sm text-blue-100">
                <p>• HealthTrack: $12.24M</p>
                <p>• SecureIT: $40.32M</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Metrics & Unit Economics</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-orange-600 mb-4">HealthTrack Pro</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-700">Free to Premium Conversion</span>
                    <span className="font-semibold text-orange-600">2%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-700">ARPU (Premium)</span>
                    <span className="font-semibold text-orange-600">$99/month</span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-700">Target Users (Year 1)</span>
                    <span className="font-semibold text-orange-600">50,000 free + 1,000 paid</span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-700">Customer Acquisition Cost</span>
                    <span className="font-semibold text-orange-600">$50</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-4">SecureIT+IoT</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Trial to Paid Conversion</span>
                    <span className="font-semibold text-gray-700">10%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">ARPU (Starter)</span>
                    <span className="font-semibold text-gray-700">$9,600/month</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Target Customers (Year 1)</span>
                    <span className="font-semibold text-gray-700">27 paying</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Sales Cycle</span>
                    <span className="font-semibold text-gray-700">60-90 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border-2 border-green-300">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-green-900">Business Benefits</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-bold text-green-900 mb-2">Revenue Protection</p>
                <p className="text-gray-700">$10M+/year saved in fraud prevention for telcos</p>
              </div>
              <div>
                <p className="font-bold text-green-900 mb-2">Operational Efficiency</p>
                <p className="text-gray-700">40% reduction in NOC workload via automation</p>
              </div>
              <div>
                <p className="font-bold text-green-900 mb-2">Customer Satisfaction</p>
                <p className="text-gray-700">20% churn reduction, 30% NPS increase</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: Technology Stack
    {
      type: 'content',
      title: 'Technology & Architecture',
      subtitle: 'Built for Scale, Security, and Performance',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-orange-600 mb-6">Tech Stack</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Frontend</p>
                <p className="text-sm text-gray-700">React, Tailwind CSS, Progressive Web App</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Backend</p>
                <p className="text-sm text-gray-700">Python (FastAPI), Go (high-performance services)</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Database</p>
                <p className="text-sm text-gray-700">MongoDB, PostgreSQL, Redis, TimescaleDB</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">ML/AI</p>
                <p className="text-sm text-gray-700">TensorFlow, PyTorch for threat detection & health insights</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Infrastructure</p>
                <p className="text-sm text-gray-700">Kubernetes, AWS/Azure/GCP, Edge Computing</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
              <h4 className="font-bold text-orange-900 mb-4">Performance Metrics</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Threat Detection Speed</span>
                  <span className="font-bold text-orange-600">&lt;100ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">System Uptime</span>
                  <span className="font-bold text-orange-600">99.999%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Concurrent Devices</span>
                  <span className="font-bold text-orange-600">10M+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">AI Accuracy</span>
                  <span className="font-bold text-orange-600">99.8%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">Security & Compliance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">HIPAA Compliant (Healthcare)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">GDPR & CCPA Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">3GPP Standards Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">End-to-End Encryption (AES-256)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">SOC 2 Type II Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: Call to Action
    {
      type: 'content',
      title: 'Join the Revolution',
      subtitle: "Let's Transform Healthcare & Security Together",
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-12 text-white text-center shadow-2xl">
            <h3 className="text-4xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Whether you're an investor, partner, or potential customer - we'd love to connect and show you how Infuse-ai can transform your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setShowDemo(true)}
                className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-all shadow-xl flex items-center gap-2"
              >
                <Play className="w-5 h-5" /> Watch Demo
              </button>
              <a 
                href="mailto:contact@infuse.net.in"
                className="px-8 py-4 bg-orange-700 text-white rounded-xl font-semibold text-lg hover:bg-orange-800 transition-all shadow-xl flex items-center gap-2"
              >
                <Mail className="w-5 h-5" /> Contact Us
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border-2 border-gray-200">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Phone</h4>
              <p className="text-gray-700">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border-2 border-gray-200">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-700">contact@infuse.net.in</p>
              <p className="text-sm text-gray-500 mt-2">Response within 24h</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border-2 border-gray-200">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Linkedin className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">LinkedIn</h4>
              <p className="text-gray-700">linkedin.com/company/infuse-ai</p>
              <p className="text-sm text-gray-500 mt-2">Follow for updates</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              © 2025 Infuse-ai. All rights reserved. | www.infuse.net.in
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-auto relative">
            <button 
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <VirtualDemo />
          </div>
        </div>
      )}

      {/* Slide Container */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Slide Content */}
          <div className="relative" style={{ minHeight: '600px' }}>
            {slides[currentSlide].type === 'title' ? (
              slides[currentSlide].content
            ) : (
              <div className="p-12">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">{slides[currentSlide].title}</h2>
                  <p className="text-xl text-gray-600">{slides[currentSlide].subtitle}</p>
                </div>
                {slides[currentSlide].content}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-12 py-6 flex items-center justify-between border-t-2 border-gray-200">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                currentSlide === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {/* Slide Indicators */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-orange-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                currentSlide === slides.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg'
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Counter and Download Button */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex-1"></div>
          <div className="text-center text-gray-600">
            Slide {currentSlide + 1} of {slides.length}
          </div>
          <div className="flex-1 flex justify-end">
            <a
              href={`${process.env.REACT_APP_BACKEND_URL}/api/generate-pitch-deck`}
              download="Infuse-ai-Pitch-Deck.pptx"
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download as PPT
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeck;