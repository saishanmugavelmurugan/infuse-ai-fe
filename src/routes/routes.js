/**
 * Application Routes Configuration
 * Centralizes all route definitions for better maintainability
 */
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// New Landing Pages
import CompanyLanding from '../pages/CompanyLanding';
import HealthTrackLanding from '../pages/HealthTrackLanding';
import SecureSphereLanding from '../pages/SecureSphereLanding';
import InfuseAdminDashboard from '../pages/admin/InfuseAdminDashboard';
import AcceptInvite from '../pages/AcceptInvite';

// Legacy Landing Pages
import NewLanding from '../pages/NewLanding';
import InfuseLanding from '../pages/InfuseLanding';

// Authentication Pages
import Login from '../pages/Login';
import HealthLogin from '../pages/HealthLogin';
import SecurityLogin from '../pages/SecurityLogin';
import SecureSphereLogin from '../pages/SecureSphereLogin';
import Register from '../pages/Register';
import HealthRegister from '../pages/HealthRegister';
import SecurityRegister from '../pages/SecurityRegister';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import MFASettings from '../pages/MFASettings';
import AccountSecurityDashboard from '../pages/AccountSecurityDashboard';

// Doctor Onboarding
import DoctorOnboarding from '../pages/DoctorOnboarding';

// Appointment Booking
import BookAppointment from '../pages/BookAppointment';

// App Download Pages
import AppDownload from '../pages/AppDownload';

// Public Pages
import AboutUs from '../pages/AboutUs';
import Careers from '../pages/Careers';
import TermsOfService from '../pages/TermsOfService';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import PitchDeck from '../pages/PitchDeck';
import Downloads from '../pages/Downloads';
import HealthSchemesPage from '../pages/HealthSchemesPage';
import DeveloperPortal from '../pages/DeveloperPortal';
import CompliancePage from '../pages/CompliancePage';
import MarketingCampaignsPage from '../pages/MarketingCampaignsPage';
import DownloadsHubPage from '../pages/DownloadsHubPage';
import DHACompliancePage from '../pages/DHACompliancePage';
import PrakritiAssessment from '../pages/PrakritiAssessment';
import HealthAnalysisPage from '../pages/HealthAnalysisPage';
import LabReportsPage from '../pages/LabReportsPage';
import PatientAIAnalysis from '../pages/PatientAIAnalysis';
import DoctorAIInsights from '../pages/DoctorAIInsights';

// Dashboard Pages
import MainDashboard from '../pages/dashboard/MainDashboard';
import HealthTrackPro from '../pages/dashboard/HealthTrackPro';
import SecureSphere from '../pages/dashboard/SecureSphere';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import AdminPanel from '../pages/dashboard/AdminPanel';

// Admin Pages
import SuperAdminPanel from '../pages/admin/SuperAdminPanel';
import AdminConsole from '../pages/admin/AdminConsole';
import InternalAdminDownloads from '../pages/admin/InternalAdminDownloads';
import UnifiedAdminDashboard from '../pages/admin/UnifiedAdminDashboard';
import EnterpriseAdminDashboard from '../pages/admin/EnterpriseAdminDashboard';
import ConfigurationOverview from '../pages/admin/ConfigurationOverview';
import ArchitectureOverview from '../pages/admin/ArchitectureOverview';
import FeatureFlagsAdmin from '../pages/admin/FeatureFlagsAdmin';

// AI Agents Pages
import AIAgentsDashboard from '../pages/AIAgentsDashboard';
import SupportAgentPage from '../pages/SupportAgentPage';
import MasterAgentPage from '../pages/MasterAgentPage';
import RoadmapAgentPage from '../pages/RoadmapAgentPage';

// Health Components
import AILifestylePlanner from '../components/health/AILifestylePlanner';

// SecureSphere Pages
import SecureSphereDashboard from '../pages/securesphere/SecureSphereDashboard';
import ThreatCenter from '../pages/securesphere/ThreatCenter';
import OEMSDKPortal from '../pages/securesphere/OEMSDKPortal';

/**
 * Public Routes - Accessible without authentication
 */
export const publicRoutes = [
  // Landing Pages
  { path: '/', element: <CompanyLanding /> },
  { path: '/healthtrack', element: <HealthTrackLanding /> },
  { path: '/securesphere-home', element: <SecureSphereLanding /> },
  { path: '/infuse-admin', element: <InfuseAdminDashboard /> },
  { path: '/accept-invite', element: <AcceptInvite /> },
  
  // Legacy Landing Pages
  { path: '/old-landing', element: <NewLanding /> },
  { path: '/infuse-landing', element: <InfuseLanding /> },
  
  // Authentication Routes
  { path: '/login', element: <Login /> },
  { path: '/login/health', element: <HealthLogin /> },
  { path: '/login/security', element: <SecurityLogin /> },
  { path: '/login/securesphere', element: <SecureSphereLogin /> },
  { path: '/register', element: <Register /> },
  { path: '/register/health', element: <HealthRegister /> },
  { path: '/register/security', element: <SecurityRegister /> },
  { path: '/register/doctor', element: <DoctorOnboarding /> },
  { path: '/doctor-onboarding', element: <DoctorOnboarding /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  
  // Information Pages
  { path: '/about', element: <AboutUs /> },
  { path: '/careers', element: <Careers /> },
  { path: '/terms', element: <TermsOfService /> },
  { path: '/privacy', element: <PrivacyPolicy /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/downloads', element: <Downloads /> },
  { path: '/downloads/:platform', element: <AppDownload /> },
  { path: '/health-schemes', element: <HealthSchemesPage /> },
  { path: '/compliance', element: <CompliancePage /> },
  { path: '/dha-compliance', element: <DHACompliancePage /> },
  { path: '/marketing', element: <MarketingCampaignsPage /> },
  { path: '/downloads-hub', element: <DownloadsHubPage /> },
  { path: '/prakriti-assessment', element: <PrakritiAssessment /> },
  { path: '/health-analysis', element: <HealthAnalysisPage /> },
  { path: '/lab-reports', element: <LabReportsPage /> },
  { path: '/patient-analysis', element: <PatientAIAnalysis /> },
  { path: '/doctor-insights', element: <DoctorAIInsights /> },
  
  // Developer Portal
  { path: '/developers', element: <DeveloperPortal /> },
  
  // Architecture & Configuration
  { path: '/architecture', element: <ArchitectureOverview /> },
  
  // SecureSphere Public Routes
  { path: '/securesphere', element: <SecureSphereDashboard /> },
  { path: '/securesphere/*', element: <SecureSphereDashboard /> },
  { path: '/threat-center', element: <ThreatCenter /> },
  { path: '/oem-sdk', element: <OEMSDKPortal /> },
  { path: '/securesphere/oem-sdk', element: <OEMSDKPortal /> },
  
  // Admin Public Routes (with internal auth)
  { path: '/admin/unified', element: <UnifiedAdminDashboard /> },
  { path: '/admin/enterprise', element: <EnterpriseAdminDashboard /> },
  { path: '/admin/config', element: <ConfigurationOverview /> },
  { path: '/admin/feature-flags', element: <FeatureFlagsAdmin /> },
  
  // AI Lifestyle Planner (public for demo)
  { path: '/wellness', element: <AILifestylePlanner /> },
  { path: '/lifestyle-plan', element: <AILifestylePlanner /> },
  
  // Appointment Booking (public for demo access)
  { path: '/book-appointment', element: <BookAppointment /> },
  { path: '/appointments/book', element: <BookAppointment /> },
  
  // AI Agents Dashboard (public for demo)
  { path: '/ai-agents', element: <AIAgentsDashboard /> },
  { path: '/ai-agents/support', element: <SupportAgentPage /> },
  { path: '/ai-agents/master', element: <MasterAgentPage /> },
  { path: '/ai-agents/roadmap', element: <RoadmapAgentPage /> },
];

/**
 * Protected Routes - Require authentication
 */
export const protectedRoutes = [
  { path: '/dashboard', element: <MainDashboard /> },
  { path: '/dashboard/health', element: <HealthTrackPro /> },
  { path: '/settings/mfa', element: <MFASettings /> },
  { path: '/account/security', element: <AccountSecurityDashboard /> },
  { path: '/security-dashboard', element: <AccountSecurityDashboard /> },
];

/**
 * Admin Only Routes - Require admin role
 */
export const adminRoutes = [
  { path: '/pitch-deck', element: <PitchDeck /> },
  { path: '/dashboard/security', element: <SecureSphere /> },
  { path: '/admin/dashboard', element: <AdminDashboard /> },
  { path: '/admin/panel', element: <AdminPanel /> },
  { path: '/admin/super', element: <SuperAdminPanel /> },
  { path: '/admin/console', element: <AdminConsole /> },
  { path: '/admin/downloads', element: <InternalAdminDownloads /> },
];

/**
 * Render public routes
 */
export const renderPublicRoutes = () => {
  return publicRoutes.map((route, index) => (
    <Route key={`public-${index}`} path={route.path} element={route.element} />
  ));
};

/**
 * Render protected routes with authentication wrapper
 */
export const renderProtectedRoutes = () => {
  return protectedRoutes.map((route, index) => (
    <Route 
      key={`protected-${index}`} 
      path={route.path} 
      element={
        <ProtectedRoute>
          {route.element}
        </ProtectedRoute>
      } 
    />
  ));
};

/**
 * Render admin-only routes with admin authentication wrapper
 */
export const renderAdminRoutes = () => {
  return adminRoutes.map((route, index) => (
    <Route 
      key={`admin-${index}`} 
      path={route.path} 
      element={
        <ProtectedRoute adminOnly={true}>
          {route.element}
        </ProtectedRoute>
      } 
    />
  ));
};

/**
 * Get all routes for use in App.js
 */
export const getAllRoutes = () => {
  return [
    ...renderPublicRoutes(),
    ...renderProtectedRoutes(),
    ...renderAdminRoutes(),
  ];
};

export default {
  publicRoutes,
  protectedRoutes,
  adminRoutes,
  renderPublicRoutes,
  renderProtectedRoutes,
  renderAdminRoutes,
  getAllRoutes,
};
