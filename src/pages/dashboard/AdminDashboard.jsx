import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Activity, Settings, BarChart } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminTools = [
    {
      title: 'Admin Panel',
      description: 'Comprehensive user management, system stats, and audit logs',
      icon: Shield,
      color: 'bg-purple-500',
      path: '/admin/panel'
    },
    {
      title: 'HealthTrack Pro',
      description: 'Manage health platform features and data',
      icon: Activity,
      color: 'bg-green-500',
      path: '/dashboard/health'
    },
    {
      title: 'SecureSphere',
      description: 'Monitor security operations and threats',
      icon: Users,
      color: 'bg-blue-500',
      path: '/dashboard/security'
    }
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Admin Control Center</h2>
          <p className="text-gray-600 mt-2">Manage users, monitor system health, and access all platform features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminTools.map((tool, index) => (
            <div
              key={index}
              onClick={() => navigate(tool.path)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h3>
              <p className="text-gray-600 text-sm">{tool.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/panel')}
              className="bg-white px-6 py-4 rounded-lg shadow-sm hover:shadow-md transition text-left"
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 text-indigo-600 mr-3" />
                <span className="font-medium text-gray-900">Manage Users</span>
              </div>
            </button>
            <button
              onClick={() => navigate('/admin/panel')}
              className="bg-white px-6 py-4 rounded-lg shadow-sm hover:shadow-md transition text-left"
            >
              <div className="flex items-center">
                <BarChart className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-medium text-gray-900">View System Stats</span>
              </div>
            </button>
            <button
              onClick={() => navigate('/admin/panel')}
              className="bg-white px-6 py-4 rounded-lg shadow-sm hover:shadow-md transition text-left"
            >
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Audit Logs</span>
              </div>
            </button>
            <button
              onClick={() => navigate('/pitch-deck')}
              className="bg-white px-6 py-4 rounded-lg shadow-sm hover:shadow-md transition text-left"
            >
              <div className="flex items-center">
                <Settings className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium text-gray-900">View Pitch Deck</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
