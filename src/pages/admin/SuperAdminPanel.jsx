import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Users, FileText, Settings, Bell, Shield, 
  TrendingUp, DollarSign, Brain, Ticket, Megaphone, UserCheck,
  Building2, CreditCard, ChevronRight, Loader2, RefreshCw,
  Eye, UserX, Check, X, AlertCircle, Search, Filter
} from 'lucide-react';
import { superAdminApi } from '../../services/healthSchemesApi';

const SuperAdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  
  // Reports data
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [schemeUsage, setSchemeUsage] = useState(null);
  const [claimsSummary, setClaimsSummary] = useState(null);
  const [revenueReport, setRevenueReport] = useState(null);
  const [aiUsage, setAiUsage] = useState(null);
  
  // Support data
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  
  // Management data
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [schemeConfigs, setSchemeConfigs] = useState([]);
  
  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [reportDays, setReportDays] = useState(30);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await superAdminApi.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const loadReports = async (type) => {
    try {
      setLoading(true);
      switch (type) {
        case 'users':
          const userData = await superAdminApi.getUserAnalytics(reportDays);
          setUserAnalytics(userData);
          break;
        case 'schemes':
          const schemeData = await superAdminApi.getHealthSchemeUsage();
          setSchemeUsage(schemeData);
          break;
        case 'claims':
          const claimsData = await superAdminApi.getClaimsSummary();
          setClaimsSummary(claimsData);
          break;
        case 'revenue':
          const revData = await superAdminApi.getRevenue(reportDays);
          setRevenueReport(revData);
          break;
        case 'ai':
          const aiData = await superAdminApi.getAIUsage();
          setAiUsage(aiData);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (userSearch) filters.search = userSearch;
      if (userRoleFilter) filters.role = userRoleFilter;
      const data = await superAdminApi.listUsers(filters);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await superAdminApi.listTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const data = await superAdminApi.listAnnouncements(false);
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    }
  };

  const loadManagementData = async () => {
    try {
      setLoading(true);
      const [doctors, plans, configs] = await Promise.all([
        superAdminApi.listPendingDoctors(),
        superAdminApi.listSubscriptionPlans(),
        superAdminApi.getSchemeConfigs()
      ]);
      setPendingDoctors(doctors.pending_doctors || []);
      setSubscriptionPlans(plans.plans || []);
      setSchemeConfigs(configs.configurations || []);
    } catch (error) {
      console.error('Failed to load management data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDoctor = async (doctorId, approved) => {
    try {
      await superAdminApi.approveDoctor(doctorId, approved);
      // Refresh pending doctors
      const doctors = await superAdminApi.listPendingDoctors();
      setPendingDoctors(doctors.pending_doctors || []);
    } catch (error) {
      console.error('Failed to approve doctor:', error);
    }
  };

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'support', label: 'Support', icon: Ticket },
    { id: 'management', label: 'Management', icon: Settings }
  ];

  const StatCard = ({ title, value, icon: Icon, color = 'blue', subtext }) => (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`bg-${color}-100 p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Super Admin Panel</h1>
              <p className="text-gray-400 text-sm">Infuse-AI Platform Management</p>
            </div>
          </div>
          <button 
            onClick={loadDashboard}
            className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-4 sticky top-6">
              <nav className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      if (section.id === 'support') loadUsers();
                      if (section.id === 'management') loadManagementData();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {loading && !dashboardData && (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {/* Dashboard Section */}
            {activeSection === 'dashboard' && dashboardData && (
              <>
                <h2 className="text-xl font-semibold text-gray-900">Platform Overview</h2>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <StatCard 
                    title="Total Users" 
                    value={dashboardData.users.total} 
                    icon={Users}
                    color="blue"
                  />
                  <StatCard 
                    title="Doctors" 
                    value={dashboardData.users.doctors} 
                    icon={UserCheck}
                    color="green"
                    subtext={`${dashboardData.users.pending_approval} pending`}
                  />
                  <StatCard 
                    title="Patients" 
                    value={dashboardData.users.patients} 
                    icon={Users}
                    color="purple"
                  />
                  <StatCard 
                    title="Open Tickets" 
                    value={dashboardData.support.open_tickets} 
                    icon={Ticket}
                    color="orange"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <StatCard 
                    title="Appointments" 
                    value={dashboardData.activity.appointments} 
                    icon={FileText}
                    color="indigo"
                  />
                  <StatCard 
                    title="Prescriptions" 
                    value={dashboardData.activity.prescriptions} 
                    icon={FileText}
                    color="pink"
                  />
                  <StatCard 
                    title="AI Operations" 
                    value={dashboardData.ai.total_operations} 
                    icon={Brain}
                    color="cyan"
                  />
                </div>

                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => { setActiveSection('reports'); loadReports('users'); }}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>View User Analytics</span>
                    </button>
                    <button 
                      onClick={() => { setActiveSection('support'); loadTickets(); }}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Ticket className="h-5 w-5 text-orange-600" />
                      <span>Manage Tickets</span>
                    </button>
                    <button 
                      onClick={() => { setActiveSection('management'); loadManagementData(); }}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <UserCheck className="h-5 w-5 text-green-600" />
                      <span>Approve Doctors</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Reports Section */}
            {activeSection === 'reports' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
                  <select
                    value={reportDays}
                    onChange={(e) => setReportDays(Number(e.target.value))}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 'users', label: 'User Analytics', icon: Users, color: 'blue' },
                    { id: 'schemes', label: 'Scheme Usage', icon: Building2, color: 'green' },
                    { id: 'claims', label: 'Claims Summary', icon: FileText, color: 'purple' },
                    { id: 'revenue', label: 'Revenue', icon: DollarSign, color: 'yellow' },
                    { id: 'ai', label: 'AI Usage', icon: Brain, color: 'pink' }
                  ].map(report => (
                    <button
                      key={report.id}
                      onClick={() => loadReports(report.id)}
                      className="bg-white rounded-xl border p-6 text-left hover:shadow-md transition-shadow"
                    >
                      <div className={`bg-${report.color}-100 p-3 rounded-lg w-fit mb-3`}>
                        <report.icon className={`h-6 w-6 text-${report.color}-600`} />
                      </div>
                      <h3 className="font-semibold text-gray-900">{report.label}</h3>
                      <p className="text-sm text-gray-500 mt-1">View detailed report</p>
                    </button>
                  ))}
                </div>

                {/* Report Display */}
                {userAnalytics && (
                  <div className="bg-white rounded-xl border p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">User Analytics ({userAnalytics.period_days} days)</h3>
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Total Users</p>
                        <p className="text-2xl font-bold text-blue-700">{userAnalytics.total_users}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">New Signups</p>
                        <p className="text-2xl font-bold text-green-700">{userAnalytics.new_signups}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600">Active Users</p>
                        <p className="text-2xl font-bold text-purple-700">{userAnalytics.active_users}</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-600">Growth Rate</p>
                        <p className="text-2xl font-bold text-orange-700">{userAnalytics.growth_rate}%</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">By Role</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span>Doctors</span>
                            <span className="font-medium">{userAnalytics.by_role.doctors}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span>Patients</span>
                            <span className="font-medium">{userAnalytics.by_role.patients}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">By Region</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {userAnalytics.by_region.map((region, idx) => (
                            <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                              <span>{region._id || 'Unknown'}</span>
                              <span className="font-medium">{region.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {aiUsage && (
                  <div className="bg-white rounded-xl border p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">AI Usage Metrics</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600">Health Analyses</p>
                        <p className="text-2xl font-bold text-purple-700">{aiUsage.ai_health_analyses}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Scheme Comparisons</p>
                        <p className="text-2xl font-bold text-blue-700">{aiUsage.scheme_comparisons}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">Recommendations</p>
                        <p className="text-2xl font-bold text-green-700">{aiUsage.ai_recommendations}</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total AI Operations</span>
                        <span className="font-bold text-gray-900">{aiUsage.total_ai_operations}</span>
                      </div>
                    </div>
                  </div>
                )}

                {claimsSummary && (
                  <div className="bg-white rounded-xl border p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Claims Summary</h3>
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Total Claims</p>
                        <p className="text-2xl font-bold text-blue-700">{claimsSummary.total_claims}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">Total Estimated</p>
                        <p className="text-xl font-bold text-green-700">₹{claimsSummary.financial_summary.total_estimated?.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600">Total Approved</p>
                        <p className="text-xl font-bold text-purple-700">₹{claimsSummary.financial_summary.total_approved?.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-600">Approval Rate</p>
                        <p className="text-2xl font-bold text-orange-700">{claimsSummary.financial_summary.approval_rate}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Support Section */}
            {activeSection === 'support' && (
              <>
                <h2 className="text-xl font-semibold text-gray-900">Support & Users</h2>

                {/* User Search */}
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">User Management</h3>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="border rounded-lg px-3 py-2"
                    >
                      <option value="">All Roles</option>
                      <option value="doctor">Doctors</option>
                      <option value="patient">Patients</option>
                    </select>
                    <button
                      onClick={loadUsers}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Search
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium text-gray-600">User</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-600">Role</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {users.map(user => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="p-3">
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'doctor' ? 'bg-green-100 text-green-700' :
                                user.role === 'patient' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === 'active' ? 'bg-green-100 text-green-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {user.status || 'active'}
                              </span>
                            </td>
                            <td className="p-3">
                              <button className="text-blue-600 hover:text-blue-700 text-sm">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tickets */}
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Support Tickets</h3>
                    <button
                      onClick={loadTickets}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Refresh
                    </button>
                  </div>
                  {tickets ? (
                    <div>
                      <div className="flex gap-4 mb-4">
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-600">Open</p>
                          <p className="text-xl font-bold text-red-700">{tickets.summary.open}</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-600">In Progress</p>
                          <p className="text-xl font-bold text-yellow-700">{tickets.summary.in_progress}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-600">Resolved</p>
                          <p className="text-xl font-bold text-green-700">{tickets.summary.resolved}</p>
                        </div>
                      </div>
                      {tickets.tickets.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No tickets found</p>
                      ) : (
                        <div className="space-y-2">
                          {tickets.tickets.map(ticket => (
                            <div key={ticket.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{ticket.subject}</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  ticket.status === 'open' ? 'bg-red-100 text-red-700' :
                                  ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {ticket.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={loadTickets}
                      className="w-full py-8 text-gray-500 hover:text-blue-600"
                    >
                      Click to load tickets
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Management Section */}
            {activeSection === 'management' && (
              <>
                <h2 className="text-xl font-semibold text-gray-900">Platform Management</h2>

                {/* Pending Doctor Approvals */}
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Pending Doctor Approvals</h3>
                  {pendingDoctors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <UserCheck className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No pending approvals</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingDoctors.map(doctor => (
                        <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{doctor.name}</p>
                            <p className="text-sm text-gray-500">{doctor.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveDoctor(doctor.id, true)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                              <Check className="h-4 w-4" /> Approve
                            </button>
                            <button
                              onClick={() => handleApproveDoctor(doctor.id, false)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                            >
                              <X className="h-4 w-4" /> Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subscription Plans */}
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Subscription Plans</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {subscriptionPlans.map(plan => (
                      <div key={plan.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{plan.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${
                            plan.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {plan.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {plan.currency} {plan.price}
                          <span className="text-sm font-normal text-gray-500">/month</span>
                        </p>
                        <ul className="mt-3 space-y-1">
                          {plan.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPanel;
