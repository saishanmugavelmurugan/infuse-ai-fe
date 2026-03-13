import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSelector';
import { InfuseLogo } from '../components/InfuseLogo';
import SEO from '../components/SEO';
import { 
  Heart, Users, Target, Lightbulb, Award,
  ArrowRight, Globe, Zap, CheckCircle, TrendingUp,
  Linkedin, Mail, Menu, X, Brain, Lock, Activity,
  Star, Stethoscope, Leaf, FileText, Watch, Shield,
  Smartphone, BarChart3, Settings, UserCheck, Key,
  Apple, Dumbbell, Moon, Utensils, Clock, BadgeCheck,
  Eye, EyeOff, AlertCircle, Loader2, Bot, Send, MessageCircle,
  Minimize2, Maximize2
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'ranjeetkoul@infuse.net.in',
  password: 'Ranjeet$03'
};

// Leadership Team Data - Matching infuse.net.in
const leadershipTeam = [
  {
    name: 'Rohini Koul',
    title: 'Chief Executive Officer',
    role: 'Founder & CEO',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-100',
    icon: Users,
    image: 'https://customer-assets.emergentagent.com/job_5320a067-ee93-485a-9948-ab1c08872fea/artifacts/hz2ljvy1_WhatsApp%20Image%202026-02-17%20at%206.40.20%20PM.jpeg',
    imagePosition: 'center 20%',
    bio: `With 20 years of distinguished experience in Academia, Rohini provides the visionary leadership that drives Infuse-ai's mission to make technology accessible across diverse populations. Her commitment to bridging the digital divide ensures that cutting-edge AI solutions reach underserved communities while maintaining the highest standards of security in the era of deepfakes and misinformation.`,
    extraBio: `Under her leadership, Infuse-ai is pioneering efforts to make healthcare a priority accessible globally, democratizing access to enterprise-grade health solutions.`
  },
  {
    name: 'Chief Growth Officer',
    title: 'Culture & Business',
    role: 'Founder',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-100',
    icon: TrendingUp,
    image: null,
    bio: `A seasoned executive with 30 years of distinguished experience in technology, driving organizational culture and business transformation across global enterprises. His strategic vision has been instrumental in scaling multiple technology ventures from inception to market leadership, establishing best practices in enterprise software delivery and customer success.`,
    extraBio: `As the driving force behind Infuse-ai's growth strategy, he leads initiatives to build sustainable partnerships and high-performance teams.`
  },
  {
    name: 'Chief Technology Officer',
    title: 'Technology & Innovation',
    role: 'CTO',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-100',
    icon: Settings,
    image: null,
    bio: `With 24 years of hands-on experience developing and leading enterprise SaaS and PaaS products, our CTO has been at the forefront of solving real-world problems through technology innovation. His technical leadership has resulted in platforms that process petabytes of data daily while maintaining 99.99% uptime.`,
    extraBio: `His expertise spans AI/ML, cloud architecture, and enterprise security, with a proven track record of building solutions that scale globally while adhering to the highest security standards.`
  },
  {
    name: 'Dr. Vishvas Koul',
    title: 'MBBS, MD (Anaesthesiology), Fellowship in Pain & Palliative Care',
    role: 'Director & Board Member',
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-100',
    icon: Stethoscope,
    image: 'https://customer-assets.emergentagent.com/job_5320a067-ee93-485a-9948-ab1c08872fea/artifacts/1hkgwkfu_WhatsApp%20Image%202026-02-13%20at%2010.16.51%20AM.jpeg',
    imagePosition: 'center top',
    bio: `Dr. Vishvas Koul is a highly experienced Anaesthesiologist and Critical Care specialist with over 10 years of dedicated clinical and academic experience. Currently serving as the Head of Anaesthesia & Critical Care at Oncolife Hospital, he leads a multidisciplinary team delivering advanced perioperative care, critical care management, and pain services.`,
    extraBio: `His areas of expertise include Onco-anaesthesia, Critical Care Medicine, Acute & Chronic Pain Management, Palliative Care, and Perioperative High-Risk Case Management.`
  },
  {
    name: 'Dr. Jyoti Mehta',
    title: 'MBBS, MD (Radiation Oncology), DrNB (Medical Oncology), MBA, FCPM, FICO',
    role: 'Director & Board Member',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-100',
    icon: Stethoscope,
    image: 'https://customer-assets.emergentagent.com/job_5320a067-ee93-485a-9948-ab1c08872fea/artifacts/duxd6qhw_image.png',
    imagePosition: 'center 15%',
    bio: `Senior Clinical Oncologist with dual specialization in Medical Oncology and Radiation Oncology, delivering comprehensive multimodality cancer care. Ex-AIIMS clinician with observership at Tata Memorial Centre and experience of managing over 5000 cancer cases. Currently Lead Clinical Oncologist at TGH OncoLife Cancer Centre.`,
    extraBio: `She delivers advanced radiation oncology including IMRT, IGRT, and VMAT alongside chemotherapy, immunotherapy, and targeted therapy.`
  }
];

// Leader Card Component matching infuse.net.in style
const LeaderCard = ({ leader, index }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Circular Avatar */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 mb-3 border-4 border-white shadow-lg">
          {leader.image ? (
            <img 
              src={leader.image} 
              alt={leader.name}
              className="w-full h-full object-cover"
              style={{objectPosition: leader.imagePosition || 'center'}}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-full h-full ${leader.bgColor} flex items-center justify-center`} 
            style={{display: leader.image ? 'none' : 'flex'}}
          >
            <leader.icon className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        
        {/* Role Badge */}
        <span className={`px-4 py-1.5 bg-gradient-to-r ${leader.color} text-white text-xs font-semibold rounded-full shadow-md`}>
          {leader.role}
        </span>
      </div>

      {/* Name & Title */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
        <p className="text-gray-600 text-sm">{leader.title}</p>
      </div>

      {/* Bio */}
      <div className="text-gray-600 text-sm leading-relaxed text-center">
        <p className={expanded ? '' : 'line-clamp-3'}>{leader.bio}</p>
        {expanded && leader.extraBio && (
          <p className="mt-2 text-gray-500">{leader.extraBio}</p>
        )}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-[#E55A00] font-medium hover:text-[#C64700] transition-colors inline-flex items-center gap-1"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      </div>
    </div>
  );
};

const CompanyLanding = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const { t, isRTL } = useLanguage();
  
  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(null);
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

  // End session and cleanup
  const endChatSession = async (reason = 'user_closed') => {
    if (chatSessionId) {
      try {
        await fetch(`${API_BASE}/api/agents/support/session/end`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: chatSessionId,
            reason: reason
          })
        });
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
    // Reset all chat state
    setChatSessionId(null);
    setChatMessages([]);
    setChatInput('');
    setChatLoading(false);
    setLastActivityTime(null);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  };

  // Start fresh session
  const startNewSession = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/agents/support/session/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setChatSessionId(data.session_id);
      setLastActivityTime(Date.now());
      return data.session_id;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    setLastActivityTime(Date.now());
    
    inactivityTimerRef.current = setTimeout(async () => {
      if (chatOpen && chatSessionId) {
        // Auto-close session due to inactivity
        setChatMessages(prev => [...prev, {
          role: 'system',
          content: 'Chat ended due to inactivity. Click to start a new conversation.',
          timestamp: new Date().toISOString(),
          isTimeout: true
        }]);
        await endChatSession('timeout');
      }
    }, SESSION_TIMEOUT_MS);
  };

  // Handle window/tab close - cleanup session
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chatSessionId) {
        // Use sendBeacon for reliable cleanup on page unload
        navigator.sendBeacon(
          `${API_BASE}/api/agents/support/session/end`,
          JSON.stringify({ session_id: chatSessionId, reason: 'navigation' })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Cleanup on component unmount
      if (chatSessionId) {
        endChatSession('navigation');
      }
    };
  }, [chatSessionId]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Focus input after chat opens or after response
  useEffect(() => {
    if (chatOpen && !chatMinimized && chatInputRef.current && !chatLoading) {
      chatInputRef.current.focus();
    }
  }, [chatOpen, chatMinimized, chatLoading, chatMessages]);

  // Handle chat open - always start fresh
  const handleOpenChat = async () => {
    // Always start with a fresh session when opening chat
    if (chatSessionId) {
      await endChatSession('new_conversation');
    }
    await startNewSession();
    setChatOpen(true);
    setChatMinimized(false);
    resetInactivityTimer();
  };

  // Handle chat close
  const handleCloseChat = async () => {
    await endChatSession('user_closed');
    setChatOpen(false);
    setChatMinimized(false);
  };

  // Send chat message - handles multi-turn conversations
  const sendChatMessage = async (messageText = null) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim() || chatLoading) return;
    
    // Reset inactivity timer on user action
    resetInactivityTimer();
    
    const userMessage = {
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);
    
    try {
      // Ensure we have a session
      let currentSessionId = chatSessionId;
      if (!currentSessionId) {
        currentSessionId = await startNewSession();
      }
      
      const response = await fetch(`${API_BASE}/api/agents/support/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          session_id: currentSessionId
        })
      });
      
      const data = await response.json();
      
      // Update session ID if backend assigned a new one
      if (data.session_id !== currentSessionId) {
        setChatSessionId(data.session_id);
      }
      
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
        resolved: !data.escalation_required,
        category: data.category
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle admin login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (adminLoginForm.email === ADMIN_CREDENTIALS.email && 
          adminLoginForm.password === ADMIN_CREDENTIALS.password) {
        // Store admin session
        const session = {
          email: ADMIN_CREDENTIALS.email,
          expiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        };
        localStorage.setItem('admin_landing_session', JSON.stringify(session));
        setShowAdminLogin(false);
        setShowAdminAccess(true);
        setAdminLoginForm({ email: '', password: '' });
      } else {
        setLoginError('Invalid credentials. Access denied.');
      }
      setLoginLoading(false);
    }, 500);
  };

  // Check if admin is already authenticated
  const isAdminAuthenticated = () => {
    const session = localStorage.getItem('admin_landing_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.email === ADMIN_CREDENTIALS.email && parsed.expiry > Date.now()) {
          return true;
        }
        localStorage.removeItem('admin_landing_session');
      } catch {
        localStorage.removeItem('admin_landing_session');
      }
    }
    return false;
  };

  // Handle admin button click
  const handleAdminButtonClick = () => {
    if (isAdminAuthenticated()) {
      setShowAdminAccess(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem('admin_landing_session');
    setShowAdminAccess(false);
  };

  const stats = [
    { value: '1M+', label: t('lab_reports_analyzed', 'Lab Reports Analyzed') },
    { value: '500K+', label: t('active_users', 'Active Users') },
    { value: '5000+', label: t('verified_doctors', 'Verified Doctors') },
    { value: '25+', label: t('countries', 'Countries') }
  ];

  const features = [
    { 
      icon: FileText, 
      title: t('lab_report_analysis', 'Lab Report Analysis'), 
      description: t('lab_report_analysis_desc', 'AI pulls and analyzes 100+ parameters from any diagnostic lab report automatically'),
      color: 'from-[#FF9A3B] to-[#E55A00]'
    },
    { 
      icon: Watch, 
      title: t('wearable_integration', 'Wearable Integration'), 
      description: t('wearable_integration_desc', 'Sync Apple Health, Samsung Health & Google Fit for complete health tracking'),
      color: 'from-[#FFDA7B] to-[#FF9A3B]'
    },
    { 
      icon: Leaf, 
      title: t('ayurvedic_wellness', 'Ayurvedic Wellness'), 
      description: t('ayurvedic_wellness_desc', 'Personalized yoga, diet plans, and daily routines based on ancient wisdom'),
      color: 'from-[#10B981] to-[#059669]'
    },
    { 
      icon: Stethoscope, 
      title: t('doctor_consultations', 'Doctor Consultations'), 
      description: t('doctor_consultations_desc', 'Connect with verified Allopathic & Ayurvedic doctors, rate and review them'),
      color: 'from-[#3B82F6] to-[#1D4ED8]'
    }
  ];

  const doctorTypes = [
    {
      type: t('allopathic_doctors', 'Allopathic Doctors'),
      icon: Stethoscope,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      qualifications: ['MBBS', 'MD', 'MS', 'DM', 'MCh'],
      specialties: ['General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology'],
      features: [t('evidence_based', 'Evidence-based treatment'), t('modern_diagnostics', 'Modern diagnostics'), t('prescription_medicines', 'Prescription medicines'), t('surgical_consultations', 'Surgical consultations')]
    },
    {
      type: t('ayurvedic_doctors', 'Ayurvedic Doctors'),
      icon: Leaf,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      qualifications: ['BAMS', 'MD Ayurveda', 'PhD Ayurveda'],
      specialties: ['Panchakarma', 'Rasayana', 'Kayachikitsa', 'Shalya Tantra', 'Yoga Therapy'],
      features: [t('holistic_healing', 'Holistic healing'), t('natural_remedies', 'Natural remedies'), t('lifestyle_guidance', 'Lifestyle guidance'), t('preventive_care', 'Preventive care')]
    }
  ];

  const wearableData = [
    { icon: Moon, label: t('sleep_analysis', 'Sleep Analysis'), desc: t('sleep_analysis_desc', 'REM, Deep, Light Sleep stages') },
    { icon: Heart, label: t('heart_health', 'Heart Health'), desc: t('heart_health_desc', 'HR, HRV, SpO2 monitoring') },
    { icon: Dumbbell, label: t('activity_tracking', 'Activity Tracking'), desc: t('activity_tracking_desc', 'Steps, Calories, Workouts') },
    { icon: Brain, label: t('stress_levels', 'Stress Levels'), desc: t('stress_levels_desc', 'Mental wellness tracking') }
  ];

  const otpAccessFeatures = [
    { icon: Key, title: t('otp_based_access', 'OTP-Based Access'), desc: t('otp_based_access_desc', 'Doctors request access via secure OTP') },
    { icon: Clock, title: t('time_limited', 'Time-Limited'), desc: t('time_limited_desc', 'One-time access expires after session') },
    { icon: Shield, title: t('user_controlled', 'User Controlled'), desc: t('user_controlled_desc', 'You approve every access request') },
    { icon: UserCheck, title: t('audit_trail', 'Audit Trail'), desc: t('audit_trail_desc', 'Complete log of who accessed what') }
  ];

  const complianceBadges = [
    { 
      name: 'SOC 2 Type II', 
      desc: 'Certified', 
      icon: Shield,
      color: 'from-blue-600 to-blue-700'
    },
    { 
      name: 'HIPAA', 
      desc: 'Compliant', 
      icon: Lock,
      color: 'from-green-600 to-green-700'
    },
    { 
      name: 'GDPR', 
      desc: 'Ready', 
      icon: Globe,
      color: 'from-purple-600 to-purple-700'
    },
    { 
      name: 'ISO 27001', 
      desc: 'Certified', 
      icon: BadgeCheck,
      color: 'from-indigo-600 to-indigo-700'
    },
    { 
      name: 'DPDP Act', 
      desc: 'India', 
      icon: Shield,
      color: 'from-orange-600 to-orange-700'
    },
    { 
      name: 'HL7 FHIR', 
      desc: 'Interoperable', 
      icon: Activity,
      color: 'from-teal-600 to-teal-700'
    }
  ];

  const globalCompliance = [
    { region: 'USA', laws: ['HIPAA', 'HITECH Act', '21st Century Cures Act'] },
    { region: 'Europe', laws: ['GDPR', 'EU MDR', 'ePrivacy Directive'] },
    { region: 'India', laws: ['DPDP Act 2023', 'IT Act 2000', 'ABDM Standards'] },
    { region: 'UK', laws: ['UK GDPR', 'Data Protection Act 2018'] },
    { region: 'Middle East', laws: ['UAE PDPL', 'Saudi PDPL', 'ADHICS (UAE)'] },
    { region: 'Asia Pacific', laws: ['PDPA (Singapore)', 'PDPA (Thailand)', 'APPI (Japan)'] }
  ];

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO 
        title="HealthTrack Pro - AI-Powered Health Analysis & Doctor Consultations"
        description="Analyze lab reports, sync wearable data, consult verified Allopathic & Ayurvedic doctors. Your complete health companion."
      />

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link to="/" className="flex items-center space-x-2">
              <InfuseLogo size={40} darkMode={!scrolled} />
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className={`font-medium hover:text-[#E55A00] transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                {t('features', 'Features')}
              </a>
              <a href="#doctors" className={`font-medium hover:text-[#E55A00] transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                {t('doctors', 'Doctors')}
              </a>
              <a href="#wearables" className={`font-medium hover:text-[#E55A00] transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                {t('wearables', 'Wearables')}
              </a>
              <a href="#security" className={`font-medium hover:text-[#E55A00] transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                {t('security', 'Security')}
              </a>
              <Link to="/compliance" className={`font-medium hover:text-[#E55A00] transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                Compliance
              </Link>
              <a href="#about" className={`font-medium hover:text-[#E55A00] transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                {t('about', 'About')}
              </a>
              <LanguageSwitcher darkMode={!scrolled} />
              <Link 
                to="/login/health" 
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF9A3B] to-[#E55A00] text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-[#E55A00]/25 transition-all"
              >
                Sign In
              </Link>
            </div>

            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className={scrolled ? 'text-gray-900' : 'text-white'} size={24} />
              ) : (
                <Menu className={scrolled ? 'text-gray-900' : 'text-white'} size={24} />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-xl">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-700 font-medium py-2">{t('features', 'Features')}</a>
              <a href="#doctors" className="block text-gray-700 font-medium py-2">{t('doctors', 'Doctors')}</a>
              <a href="#wearables" className="block text-gray-700 font-medium py-2">{t('wearables', 'Wearables')}</a>
              <a href="#security" className="block text-gray-700 font-medium py-2">{t('security', 'Security')}</a>
              <Link to="/compliance" className="block text-gray-700 font-medium py-2">Compliance</Link>
              <a href="#about" className="block text-gray-700 font-medium py-2">{t('about', 'About')}</a>
              <div className="py-2"><LanguageSwitcher /></div>
              <Link to="/login/health" className="block px-6 py-3 bg-gradient-to-r from-[#FF9A3B] to-[#E55A00] text-white rounded-lg text-center font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Health Focused */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80" 
            alt="Healthcare Technology" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-[#C64700]/60 to-[#E55A00]/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/30"></div>
        </div>

        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,154,59,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,154,59,0.15) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-[#FFDA7B]/30 text-white/90 mb-8">
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              {t('health_companion', 'Your Complete Health Companion')} • {t('ai_powered_wellness', 'AI-Powered Wellness')}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              <span className="bg-gradient-to-r from-[#FFDA7B] via-[#FF9A3B] to-[#E55A00] bg-clip-text text-transparent">
                HealthTrack Pro
              </span>
              <span className="block mt-2 text-3xl md:text-4xl lg:text-5xl">
                {t('lab_analysis', 'Lab Analysis')} • {t('doctors', 'Doctors')} • {t('wellness', 'Wellness')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-6 leading-relaxed">
              {t('hero_description_health', 'AI-powered lab report analysis, wearable health data integration, and consultations with verified')} 
              <span className="text-blue-300 font-semibold"> {t('allopathic', 'Allopathic')}</span> & 
              <span className="text-green-300 font-semibold"> {t('ayurvedic', 'Ayurvedic')}</span> {t('doctors_platform', 'doctors - all in one platform.')}
            </p>

            <p className="text-sm text-[#FFDA7B]/80 max-w-2xl mx-auto mb-10 italic">
              {t('rate_doctors_track', 'Rate doctors, track your health journey, and get personalized lifestyle recommendations.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                to="/login/health"
                className="px-8 py-4 bg-gradient-to-r from-[#FF9A3B] to-[#E55A00] text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-[#E55A00]/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {t('get_started_free', 'Get Started Free')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#doctors"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 border border-[#FFDA7B]/30 transition flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-5 h-5" />
                {t('find_doctor', 'Find a Doctor')}
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-[#FFDA7B]/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFDA7B]/20 rounded-full text-[#E55A00] text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              {t('core_features', 'Core Features')}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('everything_you_need', 'Everything You Need for')} <span className="text-[#E55A00]">{t('better_health', 'Better Health')}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('features_subtitle', "From AI-powered diagnostics to doctor consultations, we've got your health journey covered.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-[#FF9A3B]/30 transition-all">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section - Allopathic & Ayurvedic */}
      <section id="doctors" className="py-24 bg-gradient-to-br from-slate-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-[#E55A00] text-sm font-medium mb-4 shadow-sm">
              <Stethoscope className="w-4 h-4" />
              {t('doctor_network', 'Doctor Network')}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('two_streams_of', 'Two Streams of')} <span className="text-[#E55A00]">{t('medical_excellence', 'Medical Excellence')}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('doctors_section_desc', 'Choose from verified Allopathic specialists or experienced Ayurvedic practitioners. Rate and review doctors to help others.')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {doctorTypes.map((doctor, idx) => (
              <div key={idx} className={`${doctor.bgColor} rounded-3xl p-8 border-2 ${doctor.borderColor} hover:shadow-xl transition-all`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${doctor.color} rounded-2xl flex items-center justify-center`}>
                    <doctor.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{doctor.type}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">{t('verified_rated', 'Verified & Rated')}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('qualifications', 'Qualifications')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.qualifications.map((qual, i) => (
                      <span key={i} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('popular_specialties', 'Popular Specialties')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specialties.map((spec, i) => (
                      <span key={i} className="px-3 py-1 bg-white/80 rounded-full text-sm text-gray-600">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {doctor.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">{feat}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/login/health"
                  className={`mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${doctor.color} text-white rounded-xl font-semibold hover:shadow-lg transition`}
                >
                  {t('find_doctors_type', 'Find')} {doctor.type.split(' ')[0]} {t('doctors', 'Doctors')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Doctor Rating Info */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Star className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('rate_review_doctors', 'Rate & Review Your Doctors')}</h3>
                <p className="text-gray-600">
                  {t('rate_review_desc', 'After each consultation, rate your experience and leave a review. Help other patients find the best doctors while doctors build their reputation on our platform. All reviews are verified from actual consultations.')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">{t('verified_reviews_only', 'Verified Reviews Only')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor OTP Access Security Section */}
      <section id="security" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-[#C64700]/30 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFDA7B]/20 rounded-full text-[#FFDA7B] text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                {t('secure_doctor_access', 'Secure Doctor Access')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('otp_protected', 'OTP-Protected')} <span className="text-[#FFDA7B]">{t('health_records_access', 'Health Records Access')}</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                {t('otp_security_desc', 'Your health data is yours. When a doctor needs to view your records, they must request access. You receive an OTP on your registered mobile - share it only when you\'re ready. Access is one-time and expires after the session.')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {otpAccessFeatures.map((item, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-[#FFDA7B]/10">
                    <item.icon className="w-8 h-8 text-[#FF9A3B] mb-2" />
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-[#FF9A3B]/20 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{t('how_it_works', 'How It Works')}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                    <div className="w-10 h-10 bg-[#FF9A3B] rounded-full flex items-center justify-center font-bold text-white flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-white">{t('doctor_requests_access', 'Doctor Requests Access')}</h4>
                      <p className="text-sm text-gray-400">{t('doctor_requests_access_desc', 'Doctor initiates access request for your health records')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                    <div className="w-10 h-10 bg-[#FF9A3B] rounded-full flex items-center justify-center font-bold text-white flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-white">{t('you_receive_otp', 'You Receive OTP')}</h4>
                      <p className="text-sm text-gray-400">{t('you_receive_otp_desc', '6-digit OTP sent to your registered mobile number')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                    <div className="w-10 h-10 bg-[#FF9A3B] rounded-full flex items-center justify-center font-bold text-white flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-white">{t('share_when_ready', 'Share When Ready')}</h4>
                      <p className="text-sm text-gray-400">{t('share_when_ready_desc', 'Share OTP with doctor only when you approve access')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0">✓</div>
                    <div>
                      <h4 className="font-semibold text-white">{t('one_time_access', 'One-Time Access')}</h4>
                      <p className="text-sm text-gray-400">{t('one_time_access_desc', 'Access expires after session ends - fully audited')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wearables Section */}
      <section id="wearables" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFDA7B]/20 rounded-full text-[#E55A00] text-sm font-medium mb-4">
              <Watch className="w-4 h-4" />
              {t('wearable_integration', 'Wearable Integration')}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('sync_your', 'Sync Your')} <span className="text-[#E55A00]">{t('health_data', 'Health Data')}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('wearables_desc', 'Connect your favorite health apps and wearables. We analyze everything to give you complete health insights.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {wearableData.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                <item.icon className="w-10 h-10 text-[#E55A00] mb-4" />
                <h3 className="font-bold text-gray-900 mb-1">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-2xl p-8 border border-[#FF9A3B]/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('supported_platforms', 'Supported Platforms')}</h3>
                <p className="text-gray-600">{t('connect_all_platforms', 'Connect with all major health platforms')}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm flex items-center gap-2">
                  <Apple className="w-6 h-6 text-gray-800" />
                  <span className="font-medium">Apple Health</span>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-green-600" />
                  <span className="font-medium">Samsung Health</span>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">Google Fit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-[#FFDA7B]/10 to-[#FF9A3B]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-[#FFDA7B]/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF9A3B] to-[#E55A00] rounded-xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('our_vision', 'Our Vision')}</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('vision_desc', 'To create a unified health platform where modern medicine meets traditional wisdom. We believe in giving users the choice between Allopathic and Ayurvedic care, empowered by AI-driven insights and complete control over their health data.')}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-lg border border-[#FF9A3B]/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#E55A00] to-[#C64700] rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('our_mission', 'Our Mission')}</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="w-4 h-4 text-[#E55A00]" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{t('reach_last_mile', 'Reach the Last Mile')}</span>
                    <p className="text-sm text-gray-600">{t('reach_last_mile_desc', 'Fill the critical healthcare gap by delivering affordable and accessible quality care to the "last mile" of humanity in every region we operate.')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{t('bridge_traditions', 'Bridge Traditions')}</span>
                    <p className="text-sm text-gray-600">{t('bridge_traditions_desc', 'Connect Allopathic and Ayurvedic healthcare under one platform.')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{t('ai_empowerment', 'AI Empowerment')}</span>
                    <p className="text-sm text-gray-600">{t('ai_empowerment_desc', 'Offer AI-powered health insights from labs & wearables.')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{t('total_privacy', 'Total Privacy')}</span>
                    <p className="text-sm text-gray-600">{t('total_privacy_desc', 'Ensure user-controlled OTP-based access.')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <UserCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{t('trusted_network', 'Trusted Network')}</span>
                    <p className="text-sm text-gray-600">{t('trusted_network_desc', 'Feature verified doctor profiles and genuine reviews.')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section id="leadership" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-full text-[#E55A00] text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              {t('our_leaders', 'Our Leaders')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('know_our', 'Know Our')} <span className="bg-gradient-to-r from-[#FFDA7B] via-[#FF9A3B] to-[#E55A00] bg-clip-text text-transparent">{t('leadership_team', 'Leadership Team')}</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('leadership_desc', 'Guided by experience, driven by innovation. Meet the visionaries leading Infuse-ai towards a healthier future.')}
            </p>
          </div>

          {/* First Row - 3 Leaders */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {leadershipTeam.slice(0, 3).map((leader, idx) => (
              <LeaderCard key={idx} leader={leader} index={idx} />
            ))}
          </div>

          {/* Second Row - 2 Directors Centered */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {leadershipTeam.slice(3, 5).map((leader, idx) => (
              <LeaderCard key={idx + 3} leader={leader} index={idx + 3} />
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Security Section */}
      <section id="compliance" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/20 rounded-full text-green-400 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Enterprise-Grade Security
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-green-400">SOC 2</span> Compliant • <span className="text-blue-400">HIPAA</span> Ready
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Your health data deserves the highest level of protection. We comply with global healthcare data protection regulations.
            </p>
          </div>

          {/* Compliance Badges */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {complianceBadges.map((badge, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/30 transition text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <badge.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-white text-sm">{badge.name}</h4>
                <p className="text-xs text-gray-400">{badge.desc}</p>
              </div>
            ))}
          </div>

          {/* Global Compliance Grid */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Global Healthcare Data Protection Compliance</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {globalCompliance.map((region, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-[#FF9A3B]" />
                    <h4 className="font-semibold text-white">{region.region}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {region.laws.map((law, i) => (
                      <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                        {law}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">AES-256 Encryption</h4>
              <p className="text-sm text-gray-400">End-to-end encryption for all health data at rest and in transit</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Zero Trust Architecture</h4>
              <p className="text-sm text-gray-400">Every access request is verified, validated, and authorized</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Role-Based Access</h4>
              <p className="text-sm text-gray-400">Granular permissions ensure only authorized access</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">24/7 Monitoring</h4>
              <p className="text-sm text-gray-400">Continuous security monitoring and threat detection</p>
            </div>
          </div>

          {/* Trust Statement */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              HealthTrack Pro undergoes regular third-party security audits and penetration testing. 
              Our infrastructure is hosted on SOC 2 certified cloud providers with 99.99% uptime SLA.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFDA7B] via-[#FF9A3B] to-[#E55A00] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Take Control of Your Health Today
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust HealthTrack Pro for their health journey. 
            Consult verified doctors, track your vitals, and get personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login/health"
              className="px-8 py-4 bg-white text-[#E55A00] rounded-lg font-semibold hover:shadow-2xl transition flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="mailto:info@infuse.net.in"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 border border-white/30 transition flex items-center justify-center gap-2"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <InfuseLogo size={36} darkMode={true} />
              <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                HealthTrack Pro - Your complete health companion. AI-powered analysis, verified doctors, and secure health records.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-[#FF9A3B] transition">Lab Analysis</a></li>
                <li><a href="#wearables" className="hover:text-[#FF9A3B] transition">Wearable Sync</a></li>
                <li><a href="#doctors" className="hover:text-[#FF9A3B] transition">Doctor Network</a></li>
                <li><a href="#security" className="hover:text-[#FF9A3B] transition">OTP Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#about" className="hover:text-[#FF9A3B] transition">About Us</a></li>
                <li><Link to="/careers" className="hover:text-[#FF9A3B] transition">Careers</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-[#FF9A3B] transition">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="mailto:info@infuse.net.in" className="hover:text-[#FF9A3B] transition">
                    info@infuse.net.in
                  </a>
                </li>
                <li>
                  <a href="tel:+919599960663" className="hover:text-[#FF9A3B] transition">
                    +91-9599960663
                  </a>
                </li>
                <li>India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Infuse Technologies. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-gray-500 text-sm">
              <Link to="/privacy-policy" className="hover:text-[#FF9A3B] transition">Privacy</Link>
              <Link to="/terms" className="hover:text-[#FF9A3B] transition">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#FFDA7B]/20 via-[#FF9A3B]/20 to-[#E55A00]/20 p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#FFDA7B]/30 to-[#E55A00]/30 rounded-lg">
                    <Lock className="w-6 h-6 text-[#FF9A3B]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Admin Authentication</h3>
                    <p className="text-xs text-slate-400">Restricted access only</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowAdminLogin(false);
                    setLoginError('');
                    setAdminLoginForm({ email: '', password: '' });
                  }}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
              {/* Warning Banner */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-400">
                  This area is restricted to authorized Infuse administrators only. 
                  Unauthorized access attempts are logged.
                </p>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={adminLoginForm.email}
                  onChange={(e) => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })}
                  placeholder="admin@infuse.net.in"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF9A3B] focus:border-transparent"
                  required
                  data-testid="admin-landing-email"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminLoginForm.password}
                    onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF9A3B] focus:border-transparent pr-12"
                    required
                    data-testid="admin-landing-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {loginError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-[#FFDA7B] via-[#FF9A3B] to-[#E55A00] hover:from-[#FFE49A] hover:via-[#FFAD5C] hover:to-[#FF7A2E] text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-[#E55A00]/30"
                data-testid="admin-landing-login-btn"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Authenticate
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500">
                Powered by Infuse Security
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Super Admin Access Tab */}
      <div className="fixed bottom-6 right-6 z-50">
        {showAdminAccess && isAdminAuthenticated() ? (
          <div className="bg-slate-900 rounded-xl shadow-2xl p-4 border border-slate-700 w-72">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="text-white font-semibold text-sm">Admin Access</h4>
              </div>
              <button onClick={() => setShowAdminAccess(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <Link 
                to="/ai-agents" 
                className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-[#FF9A3B] rounded-lg hover:from-yellow-500/30 hover:to-orange-500/30 transition text-sm border border-[#FF9A3B]/30"
                data-testid="admin-ai-agents-link"
              >
                <Bot className="w-4 h-4" />
                AI Agents Dashboard
              </Link>
              <Link 
                to="/admin/feature-flags" 
                className="flex items-center gap-3 px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition text-sm"
              >
                <Settings className="w-4 h-4" />
                Feature Flags
              </Link>
              <Link 
                to="/infuse-admin" 
                className="flex items-center gap-3 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition text-sm"
              >
                <Shield className="w-4 h-4" />
                Infuse Internal Admin
              </Link>
              <Link 
                to="/securesphere" 
                className="flex items-center gap-3 px-3 py-2 bg-orange-600/20 text-orange-400 rounded-lg hover:bg-orange-600/30 transition text-sm"
              >
                <Lock className="w-4 h-4" />
                SecureSphere Platform
              </Link>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700">
              <button
                onClick={handleAdminLogout}
                className="w-full text-xs text-slate-500 hover:text-red-400 transition flex items-center justify-center gap-1"
              >
                <X className="w-3 h-3" />
                Logout Admin Session
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Logged in as Admin</p>
          </div>
        ) : (
          <button 
            onClick={handleAdminButtonClick}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 backdrop-blur-sm text-gray-400 rounded-lg hover:bg-slate-800 hover:text-white border border-slate-700 transition text-sm shadow-lg"
            data-testid="admin-button"
          >
            <Settings className="w-4 h-4" />
            Admin
          </button>
        )}
      </div>

      {/* Floating Support Chatbot */}
      {!chatOpen ? (
        /* Floating Chat Button */
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
          data-testid="chat-bot-button"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          </span>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Need help? Chat with us!
          </div>
        </button>
      ) : (
        /* Chat Widget */
        <div 
          className={`fixed z-50 bg-slate-900 rounded-2xl shadow-2xl border border-[#FF9A3B]/30 overflow-hidden transition-all duration-300 ${
            chatMinimized 
              ? 'bottom-6 right-6 w-72 h-14' 
              : 'bottom-6 right-6 w-96 h-[500px] max-h-[80vh]'
          }`}
          data-testid="chat-widget"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#FFDA7B] via-[#FF9A3B] to-[#E55A00] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Support Assistant</h3>
                {!chatMinimized && (
                  <p className="text-white/80 text-xs">AI-powered help</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setChatMinimized(!chatMinimized)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                {chatMinimized ? (
                  <Maximize2 className="w-4 h-4 text-white" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-white" />
                )}
              </button>
              <button 
                onClick={handleCloseChat}
                className="p-2 hover:bg-white/20 rounded-lg transition"
                data-testid="chat-close-button"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Chat Body - Hidden when minimized */}
          {!chatMinimized && (
            <>
              {/* Messages Area */}
              <div className="h-[calc(100%-130px)] overflow-y-auto p-4 space-y-4 bg-slate-800/50">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-4 bg-gradient-to-br from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-[#FFDA7B]" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Hi! How can I help?</h4>
                    <p className="text-slate-400 text-sm mb-4">Ask me anything about HealthTrack Pro</p>
                    
                    {/* Quick Questions */}
                    <div className="space-y-2">
                      {[
                        'How do I book an appointment?',
                        'Where can I view my lab reports?',
                        'How do I connect my fitness tracker?'
                      ].map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendChatMessage(q)}
                          className="block w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition border border-[#FF9A3B]/20"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
                      >
                        {/* System message (timeout, etc.) */}
                        {msg.role === 'system' && (
                          <div 
                            className="bg-yellow-500/20 text-yellow-300 text-xs px-4 py-2 rounded-lg border border-yellow-500/30 cursor-pointer hover:bg-yellow-500/30 transition"
                            onClick={handleOpenChat}
                          >
                            <Clock className="w-3 h-3 inline mr-1" />
                            {msg.content}
                          </div>
                        )}
                        {/* Assistant message */}
                        {msg.role === 'assistant' && (
                          <div className="p-1.5 bg-gradient-to-br from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-lg h-fit flex-shrink-0">
                            <Bot className="w-4 h-4 text-[#FFDA7B]" />
                          </div>
                        )}
                        {msg.role !== 'system' && (
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] text-white'
                                : 'bg-slate-700/80 text-slate-200 border border-[#FF9A3B]/20'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            {msg.role === 'assistant' && msg.resolved !== undefined && (
                              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-600/50">
                                <CheckCircle className={`w-3 h-3 ${msg.resolved ? 'text-green-400' : 'text-yellow-400'}`} />
                                <span className="text-xs text-slate-400">
                                  {msg.resolved ? 'Resolved' : 'May need follow-up'}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-[#FFDA7B]/20 to-[#FF9A3B]/20 rounded-lg h-fit">
                          <Bot className="w-4 h-4 text-[#FFDA7B]" />
                        </div>
                        <div className="bg-slate-700/80 rounded-2xl px-4 py-3 border border-[#FF9A3B]/20">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-[#FF9A3B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-[#FF9A3B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-[#FF9A3B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900 border-t border-[#FF9A3B]/20">
                <div className="flex gap-2">
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 bg-slate-800 border border-[#FF9A3B]/30 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9A3B] focus:border-transparent"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={() => sendChatMessage()}
                    disabled={chatLoading || !chatInput.trim()}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#FFDA7B] to-[#E55A00] hover:from-[#FFE49B] hover:to-[#FF6A10] disabled:opacity-50 rounded-xl transition flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyLanding;
