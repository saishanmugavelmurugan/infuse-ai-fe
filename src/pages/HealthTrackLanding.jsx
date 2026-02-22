import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Heart, Users, Calendar, Pill, FileText, Video, Brain,
  Activity, Smartphone, Shield, CheckCircle, ArrowRight,
  Star, Clock, Globe, Zap, Phone, Mail
} from 'lucide-react';

const HealthTrackLanding = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Complete patient records, history tracking, and family health management in one place.'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered appointment scheduling with automated reminders and conflict detection.'
    },
    {
      icon: Pill,
      title: 'Prescription Management',
      description: 'Digital prescriptions with drug interaction checks and pharmacy integration.'
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'Secure, HIPAA-compliant storage for all medical documents and lab reports.'
    },
    {
      icon: Video,
      title: 'Telemedicine',
      description: 'HD video consultations with screen sharing and recording capabilities.'
    },
    {
      icon: Brain,
      title: 'AI Health Analysis',
      description: 'Advanced AI algorithms for lab report analysis and health risk assessment.'
    },
    {
      icon: Activity,
      title: 'Vitals Monitoring',
      description: 'Real-time vitals recording with automatic alerts for abnormal readings.'
    },
    {
      icon: Smartphone,
      title: 'Wearable Integration',
      description: 'Sync data from popular health wearables for comprehensive health tracking.'
    }
  ];

  const plans = [
    {
      name: 'Starter',
      priceINR: '₹999',
      priceUSD: '$35',
      period: '/month',
      description: 'For individual practitioners',
      features: ['Up to 100 patients', 'Basic scheduling', 'Digital prescriptions', 'Email support'],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      priceINR: '₹2,999',
      priceUSD: '$105',
      period: '/month',
      description: 'For clinics and small hospitals',
      features: ['Up to 1,000 patients', 'AI Health Analysis', 'Telemedicine', 'Wearable sync', 'Priority support'],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      priceINR: 'Custom',
      priceUSD: 'Custom',
      period: '',
      description: 'For large healthcare networks',
      features: ['Unlimited patients', 'Custom integrations', 'ABDM Integration', 'Dedicated support', 'On-premise option'],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const testimonials = [
    {
      quote: "HealthTrack Pro has transformed how we manage our clinic. Patient wait times are down 40%.",
      author: "Dr. Meera Patel",
      role: "Apollo Clinic, Mumbai",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "The AI analysis feature caught a critical condition we might have missed. It literally saved a life.",
      author: "Dr. Suresh Kumar",
      role: "Max Healthcare, Delhi",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* SEO */}
      <SEO 
        title="HealthTrack Pro - AI-Powered Healthcare Management"
        description="Transform your healthcare practice with HealthTrack Pro. AI-powered patient management, smart scheduling, digital prescriptions, and telemedicine. Starting at ₹999/month ($35 USD)."
        keywords="healthcare management, patient management system, electronic health records, EHR, telemedicine, digital prescriptions, AI healthcare, medical practice software, ABDM integration"
        canonical="https://www.infuse.net.in/healthtrack"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "HealthTrack Pro",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "999",
            "priceCurrency": "INR"
          }
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">HealthTrack Pro</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <Link to="/login/health" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link 
              to="/register/health"
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-orange-50 via-amber-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-600 text-sm mb-6">
                <Shield className="w-4 h-4" />
                HIPAA Compliant & ABDM Ready
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Healthcare Management,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500"> Reimagined</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                HealthTrack Pro is the complete platform for modern healthcare providers. 
                Manage patients, appointments, prescriptions, and leverage AI-powered 
                insights—all in one secure, intuitive system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register/health"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                >
                  Start Free 14-Day Trial <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/login/health"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 flex items-center justify-center"
                >
                  Login to Dashboard
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Setup in 5 minutes
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl opacity-20 blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=500&fit=crop"
                alt="Healthcare professional using tablet"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run a Modern Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From patient intake to follow-up care, HealthTrack Pro streamlines every aspect of healthcare delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                  <feature.icon className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm mb-6">
                <Brain className="w-4 h-4" />
                AI-Powered
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Intelligent Health Analysis at Your Fingertips
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Our advanced AI analyzes lab reports, identifies risk factors, and provides 
                actionable insights—helping you make better clinical decisions faster.
              </p>
              <ul className="space-y-4">
                {['Lab Report Analysis', 'Risk Assessment', 'Drug Interaction Alerts', 'Predictive Health Scores'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-6 h-6 text-orange-400" />
                <span className="text-white font-semibold">AI Health Analysis</span>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Blood Glucose Analysis</div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">HbA1c: 6.8%</span>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">Pre-diabetic</span>
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Cardiovascular Risk</div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Score: 12%</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Low Risk</span>
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Recommendation</div>
                  <span className="text-gray-300 text-sm">Consider lifestyle modifications and retest in 3 months.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your practice size.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl p-8 ${plan.popular ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white scale-105 shadow-xl' : 'bg-white border border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.priceINR}</span>
                      <span className={plan.popular ? 'text-white/80' : 'text-gray-600'}>{plan.period}</span>
                    </div>
                    {plan.priceUSD !== 'Custom' && (
                      <span className={`text-lg mt-1 ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>
                        {plan.priceUSD} USD{plan.period}
                      </span>
                    )}
                  </div>
                </div>
                <p className={`mb-6 ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                      <span className={plan.popular ? 'text-white' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register/health"
                  className={`block text-center py-3 rounded-xl font-semibold ${
                    plan.popular 
                      ? 'bg-white text-orange-500 hover:bg-gray-100' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Healthcare Professionals</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8">
                <p className="text-lg text-gray-700 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.author} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-500 to-amber-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of healthcare providers using HealthTrack Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register/health"
              className="px-8 py-4 bg-white text-orange-500 font-semibold rounded-xl hover:bg-gray-100"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/login/health"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HealthTrack Pro</span>
          </Link>
          <p className="mb-4">A product of Infuse-AI</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/" className="hover:text-white">Back to Infuse-AI</Link>
          </div>
          <p className="mt-8 text-sm">© {new Date().getFullYear()} Infuse-AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HealthTrackLanding;
