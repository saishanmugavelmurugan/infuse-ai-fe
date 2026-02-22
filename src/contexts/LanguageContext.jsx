import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Comprehensive default translations (English)
const defaultTranslations = {
  // Common
  welcome: "Welcome",
  login: "Login",
  logout: "Logout",
  sign_in: "Sign In",
  sign_up: "Sign Up",
  get_started: "Get Started",
  learn_more: "Learn More",
  dashboard: "Dashboard",
  settings: "Settings",
  profile: "Profile",
  save: "Save",
  cancel: "Cancel",
  submit: "Submit",
  loading: "Loading...",
  error: "Error",
  success: "Success",
  email: "Email",
  password: "Password",
  confirm_password: "Confirm Password",
  remember_me: "Keep me signed in",
  forgot_password: "Forgot password?",
  no_account: "Don't have an account?",
  have_account: "Already have an account?",
  register: "Register",
  create_account: "Create Account",
  full_name: "Full Name",
  phone: "Phone Number",
  organization: "Organization",
  
  // SecureSphere Login & Register
  securesphere_title: "Infuse-AI SecureSphere",
  securesphere_subtitle: "Enterprise Security & Threat Intelligence",
  enterprise_command_center: "Enterprise Security Command Center",
  enterprise_command_desc: "Telco-grade security monitoring and threat analysis platform for enterprises",
  secure_login: "Secure Login to SecureSphere",
  secure_register: "Register for SecureSphere",
  corporate_email: "Corporate Email",
  enter_password: "Enter your secure password",
  start_free_trial: "Start Your Free Trial",
  new_to_securesphere: "New to SecureSphere?",
  for_telco_enterprise: "For Telco, Enterprise, Mobile & Automotive",
  need_healthcare: "Need healthcare solutions?",
  login_healthtrack: "Login to HealthTrack Pro",
  secure_authentication: "Secure Authentication",
  
  // SecureSphere Features
  real_time_threat: "Real-Time Threat Detection",
  real_time_threat_desc: "Monitor and respond to security threats across your network infrastructure",
  iot_gsm_security: "IoT/GSM Endpoint Security",
  iot_gsm_security_desc: "Secure your IoT devices and GSM endpoints with advanced protection",
  network_security_analytics: "Network Security Analytics",
  network_security_analytics_desc: "Deep analytics on network traffic, vulnerabilities, and attack patterns",
  automotive_security: "Automotive Security",
  automotive_security_desc: "Protect connected vehicles and automotive systems from cyber threats",
  
  // HealthTrack Pro Login & Register
  healthtrack_title: "Infuse-AI HealthTrack Pro",
  healthtrack_subtitle: "AI-Powered Health Management",
  health_command_center: "Healthcare Command Center",
  health_command_desc: "AI-powered health management and patient care platform",
  secure_login_health: "Secure Login to HealthTrack Pro",
  secure_register_health: "Register for HealthTrack Pro",
  start_health_trial: "Start Your Healthcare Journey",
  new_to_healthtrack: "New to HealthTrack Pro?",
  for_doctors_patients: "For Doctors, Clinics & Patients",
  need_security: "Need enterprise security?",
  login_securesphere: "Login to SecureSphere",
  
  // HealthTrack Features
  ai_health_analysis: "AI Health Analysis",
  ai_health_analysis_desc: "Advanced AI analysis of health records and lab reports",
  patient_management_feat: "Patient Management",
  patient_management_desc: "Comprehensive patient records and appointment management",
  telemedicine_feat: "Telemedicine",
  telemedicine_desc: "Remote consultations and virtual healthcare services",
  wearable_integration: "Wearable Integration",
  wearable_integration_desc: "Connect smartwatches and health monitoring devices",
  
  // Dashboard Navigation
  nav_overview: "Overview",
  nav_patients: "Patients",
  nav_appointments: "Appointments",
  nav_prescriptions: "Prescriptions",
  nav_analytics: "Analytics",
  nav_lab_tests: "Lab Tests",
  nav_insights: "Insights",
  nav_revenue: "Revenue",
  nav_devices: "Devices",
  nav_records: "Records",
  nav_threats: "Threats",
  nav_policies: "Policies",
  nav_reports: "Reports",
  
  // Forms
  form_required: "This field is required",
  form_invalid_email: "Please enter a valid email",
  form_password_min: "Password must be at least 8 characters",
  form_passwords_match: "Passwords must match",
  form_select_option: "Select an option",
  form_enter_value: "Enter a value",
  
  // Actions
  action_search: "Search",
  action_filter: "Filter",
  action_export: "Export",
  action_import: "Import",
  action_delete: "Delete",
  action_edit: "Edit",
  action_view: "View",
  action_add: "Add",
  action_refresh: "Refresh",
  action_download: "Download",
  action_upload: "Upload",
  
  // Status
  status_active: "Active",
  status_inactive: "Inactive",
  status_pending: "Pending",
  status_completed: "Completed",
  status_cancelled: "Cancelled",
  status_critical: "Critical",
  status_warning: "Warning",
  status_safe: "Safe",
  
  // Time
  time_today: "Today",
  time_yesterday: "Yesterday",
  time_this_week: "This Week",
  time_this_month: "This Month",
  time_last_month: "Last Month",
  
  // Landing Page
  about: "About",
  products: "Products",
  mission: "Mission",
  careers: "Careers",
  hero_tagline: "Bridging Healthcare & Security with AI",
  hero_title: "Quality Healthcare & Data Security for",
  hero_title_highlight: "Every Citizen",
  hero_description: "Infuse-AI brings connected, cloud-based AI platforms to deliver quality care and strong data protection to the last mile of society in India and emerging markets.",
  explore_products: "Explore Our Products",
  ai_powered: "AI-Powered",
  healthcare_solutions: "Healthcare Solutions",
  last_mile: "Last-Mile",
  community_focus: "Community Focus",
  enterprise: "Enterprise",
  grade_security: "Grade Security",
  
  // About Section
  about_us: "About Us",
  about_title: "Building the Future of Enterprise Technology",
  about_subtitle: "We combine cutting-edge AI with deep industry expertise to deliver solutions that transform how businesses operate.",
  about_infuse: "About Infuse-AI",
  passionate_team: "A Passionate Team Building Tomorrow's Solutions",
  about_description_1: "Founded with a vision to bridge the gap between cutting-edge technology and real-world applications, Infuse-AI brings together experts in healthcare, cybersecurity, and artificial intelligence.",
  about_description_2: "Our team combines decades of industry experience with fresh perspectives to create solutions that not only meet today's challenges but anticipate tomorrow's needs.",
  about_description_3: "We believe in technology that empowers people, protects data, and drives meaningful outcomes for businesses and communities alike.",
  interoperability: "Interoperability First",
  interoperability_desc: "Seamless integration with existing systems and workflows, ensuring our solutions enhance rather than disrupt.",
  security_by_design: "Security by Design",
  security_desc: "Built-in security at every layer, protecting sensitive data while enabling powerful functionality.",
  last_mile_focus: "Last Mile Focus",
  last_mile_desc: "Reaching underserved communities and bringing enterprise-grade solutions to everyone, everywhere.",
  
  // Vision & Mission
  our_vision: "Our Vision",
  vision_text: "To become the trusted technology partner for enterprises worldwide, enabling them to harness the power of AI while maintaining the highest standards of security and privacy.",
  our_mission: "Our Mission",
  mission_1: "Democratize access to AI-powered healthcare and security solutions",
  mission_2: "Build technology that respects privacy while delivering powerful insights",
  mission_3: "Create sustainable business models that benefit all stakeholders",
  
  // Who We Serve
  who_we_serve: "Who We Serve",
  serve_subtitle: "Empowering organizations across industries with intelligent solutions",
  healthcare_providers: "Healthcare Providers",
  providers_desc: "Hospitals, clinics, and healthcare networks looking to digitize and optimize patient care.",
  health_tech_platforms: "Health-Tech Platforms",
  platforms_desc: "Digital health companies seeking to integrate AI-powered analytics and security.",
  regulated_enterprises: "Regulated Enterprises",
  enterprises_desc: "Organizations in finance, telecom, and government requiring robust security solutions.",
  
  // Products
  our_products: "Our Products",
  products_subtitle: "Comprehensive solutions for healthcare and security",
  healthtrack_pro: "HealthTrack Pro",
  healthtrack_tagline: "AI-Powered Health Management Platform",
  healthtrack_desc: "Integrate clinics, diagnostics, teleconsultation, and remote monitoring to close the urban–rural care gap.",
  access_healthtrack: "Access HealthTrack Pro",
  securesphere: "SecureSphere",
  securesphere_tagline: "Enterprise Security & Threat Intelligence",
  securesphere_desc: "AI-driven security monitoring, threat detection, and policy enforcement for enterprises across verticals.",
  access_securesphere: "Access SecureSphere",
  
  // Features
  ai_lab_analysis: "AI-powered lab report analysis",
  patient_management: "Patient management & health records",
  smartwatch_integration: "Smartwatch & device integration",
  telemedicine: "Telemedicine & remote consultations",
  abdm_aligned: "ABDM-aligned digital health data",
  threat_detection: "Real-time threat detection & monitoring",
  iot_security: "IoT/GSM endpoint security",
  network_analytics: "Network security analytics",
  automotive_security: "Automotive security interface",
  compliance_tools: "Compliance & governance tools",
  
  // Who We Serve
  who_we_serve: "Who We Serve",
  serve_subtitle: "Empowering healthcare providers and enterprises",
  healthcare_providers: "Healthcare Providers",
  providers_desc: "Hospitals, clinics, and diagnostic networks scaling digital health and telemedicine",
  health_tech_platforms: "Health-Tech Platforms",
  platforms_desc: "ABDM-aligned digital health platforms seeking secure AI infrastructure",
  regulated_enterprises: "Regulated Enterprises",
  enterprises_desc: "Organizations in finance, insurance, and SaaS needing AI governance and data protection",
  
  // CTA
  cta_title: "Ready to Transform Healthcare & Security?",
  cta_subtitle: "Join us in building the next generation of inclusive healthcare and secure AI solutions",
  join_team: "Join Our Team",
  
  // Footer
  company: "Company",
  legal: "Legal",
  privacy_policy: "Privacy Policy",
  terms_of_service: "Terms of Service",
  downloads: "Downloads",
  footer_tagline: "Inclusive healthcare & secure AI for every citizen",
  all_rights_reserved: "All rights reserved",
  
  // Healthcare specific
  patients: "Patients",
  appointments: "Appointments",
  prescriptions: "Prescriptions",
  lab_tests: "Lab Tests",
  medical_records: "Medical Records",
  health_vitals: "Health Vitals",
  blood_pressure: "Blood Pressure",
  heart_rate: "Heart Rate",
  blood_sugar: "Blood Sugar",
  temperature: "Temperature",
  doctor: "Doctor",
  patient: "Patient",
  diagnosis: "Diagnosis",
  medication: "Medication",
  dosage: "Dosage",
  
  // AI Analytics
  ai_analytics: "AI Analytics",
  health_insights: "Health Insights",
  revenue_analytics: "Revenue Analytics",
  recommendations: "Recommendations",
  modern_medicine: "Modern Medicine",
  ayurvedic: "Ayurvedic",
  lifestyle_tips: "Lifestyle Tips",
  disclaimer: "Disclaimer",
  critical_alerts: "Critical Alerts",
  platform_usage: "Platform Usage",
  revenue_insights: "Revenue Insights",
  
  // Wearables
  wearable_devices: "Wearable Devices",
  connected_devices: "Connected Devices",
  sync_data: "Sync Data",
  daily_steps: "Daily Steps",
  sleep_hours: "Sleep Hours",
  calories: "Calories",
  
  // Navigation
  overview: "Overview",
  analytics: "Analytics",
  devices: "Devices",
  records: "Records",
  
  // Actions
  book_appointment: "Book Appointment",
  write_prescription: "Write Prescription",
  add_patient: "Add Patient",
  view_details: "View Details",
  ai_analyze: "AI Analyze",
  generate_report: "Generate Report",
  export_data: "Export Data",
  
  // Language
  select_region: "Select Your Region",
  select_language: "Select Language",
  change_language: "Change Language"
};

// Helper function to load translations
// Safe JSON parse to avoid "Response body already used" error from monitoring tools
const safeJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

const fetchTranslations = async (langCode) => {
  try {
    const response = await fetch(`${API_URL}/api/language/translations/${langCode}`);
    if (response.ok) {
      const data = await safeJson(response);
      return data?.translations || defaultTranslations;
    }
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
  return defaultTranslations;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentRegion, setCurrentRegion] = useState('other');
  const [translations, setTranslations] = useState(defaultTranslations);
  const [languageConfig, setLanguageConfig] = useState(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);

  // Load language config on mount
  useEffect(() => {
    const loadLanguageConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/api/language/config`);
        if (response.ok) {
          const config = await safeJson(response);
          if (config) setLanguageConfig(config);
        }
      } catch (error) {
        console.error('Failed to load language config:', error);
      }
    };

    loadLanguageConfig();
  }, []);

  // Check for saved preference - only run once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const checkLanguagePreference = async () => {
      setIsLoading(true);
      
      // First check localStorage
      const savedLanguage = localStorage.getItem('preferredLanguage');
      const savedRegion = localStorage.getItem('preferredRegion');
      
      if (savedLanguage && savedRegion) {
        setCurrentLanguage(savedLanguage);
        setCurrentRegion(savedRegion);
        const trans = await fetchTranslations(savedLanguage);
        setTranslations(trans);
        setIsLoading(false);
        return;
      }

      // Load default English translations
      const trans = await fetchTranslations('en');
      setTranslations(trans);
      
      // Set default to English without showing modal
      // User can change language via the language switcher in the navbar
      setCurrentLanguage('en');
      setCurrentRegion('india');
      localStorage.setItem('preferredLanguage', 'en');
      localStorage.setItem('preferredRegion', 'india');
      
      // Don't show language selector automatically - user can access it from navbar
      setShowLanguageSelector(false);
      setIsLoading(false);
    };

    checkLanguagePreference();
  }, []);

  const setLanguage = useCallback(async (langCode, region) => {
    setCurrentLanguage(langCode);
    setCurrentRegion(region);
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', langCode);
    localStorage.setItem('preferredRegion', region);
    
    // Load translations
    const trans = await fetchTranslations(langCode);
    setTranslations(trans);
    
    // Save to backend if user is logged in
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        await fetch(`${API_URL}/api/language/user-preference`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            region: region,
            language_code: langCode
          })
        });
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    }
    
    setShowLanguageSelector(false);
  }, []);

  const t = useCallback((key, fallback = null) => {
    return translations[key] || defaultTranslations[key] || fallback || key;
  }, [translations]);

  const getAvailableLanguages = useCallback(() => {
    if (!languageConfig) return [];
    return languageConfig.regions[currentRegion]?.languages || [];
  }, [languageConfig, currentRegion]);

  const isRTL = currentLanguage === 'ar';

  const value = {
    currentLanguage,
    currentRegion,
    translations,
    languageConfig,
    showLanguageSelector,
    setShowLanguageSelector,
    setLanguage,
    t,
    getAvailableLanguages,
    isRTL,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
