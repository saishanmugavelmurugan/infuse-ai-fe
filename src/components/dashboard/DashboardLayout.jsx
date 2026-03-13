import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../LanguageSelector';
import { 
  Home, Heart, Shield, LayoutDashboard, LogOut, Menu, X, 
  Settings, User, Bell, ChevronDown, FileText, Globe, Sliders,
  Brain, Stethoscope, Upload, Leaf
} from 'lucide-react';

// Admin email that has access to admin features
const ADMIN_EMAIL = 'ranjeetkoul@infuse.net.in';

const DashboardLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, setShowLanguageSelector, currentLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current user is the designated admin
  const isDesignatedAdmin = user?.email === ADMIN_EMAIL;

  // Navigation based on user role
  const getNavigation = () => {
    const baseNav = [
      { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    ];

    // Check user role for AI Analysis navigation
    const isDoctor = user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'superadmin';
    const isPatient = user?.role === 'patient' || user?.role === 'user';

    const healthNav = [
      { name: 'HealthTrack Pro', href: '/dashboard/health', icon: Heart },
      { name: 'Upload Lab Reports', href: '/lab-reports', icon: Upload },
      { name: 'Ayurvedic Assessment', href: '/prakriti-assessment', icon: Leaf },
    ];

    // Add role-specific AI Analysis navigation
    if (isDoctor) {
      healthNav.push({ name: 'AI Clinical Insights', href: '/doctor-insights', icon: Stethoscope });
    } else if (isPatient) {
      healthNav.push({ name: 'AI Health Analysis', href: '/patient-analysis', icon: Brain });
    }

    return [...baseNav, ...healthNav];
  };

  const navigation = getNavigation();

  // Admin navigation - only for designated admin email
  const adminNavigation = isDesignatedAdmin ? [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Feature Flags', href: '/admin/feature-flags', icon: Sliders },
    { name: 'SecureSphere', href: '/securesphere', icon: Shield },
  ] : [];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Mobile menu button */}
              <button
                className="px-4 text-gray-500 focus:outline-none lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <img 
                    src={process.env.REACT_APP_LOGO_URL} 
                    alt="Infuse-ai" 
                    className="h-8 w-8 object-contain"
                  />
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    Infuse-ai
                  </span>
                </Link>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-3 focus:outline-none"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* Dropdown menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      {t('profile')}
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      {t('settings')}
                    </Link>
                    <button
                      onClick={() => setShowLanguageSelector(true)}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      {t('change_language')}
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 pt-16 lg:pt-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full overflow-y-auto py-6">
            <nav className="space-y-1 px-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors`}
                  >
                    <Icon
                      className={`${
                        isActive(item.href) ? 'text-orange-600' : 'text-gray-400'
                      } mr-3 h-5 w-5`}
                    />
                    {item.name}
                  </Link>
                );
              })}

              {/* Admin Section - Only for designated admin email */}
              {isDesignatedAdmin && adminNavigation.length > 0 && (
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Admin
                  </p>
                  {adminNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          isActive(item.href)
                            ? 'bg-orange-50 text-orange-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        } group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors`}
                      >
                        <Icon
                          className={`${
                            isActive(item.href) ? 'text-orange-600' : 'text-gray-400'
                          } mr-3 h-5 w-5`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {title && (
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
