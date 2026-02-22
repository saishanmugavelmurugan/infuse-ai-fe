import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Heart, Shield, ArrowRight, Activity, AlertTriangle, 
  Users, TrendingUp, FileText, Download 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MainDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect admins and superadmins to admin dashboard (only if on main dashboard)
  useEffect(() => {
    if ((user?.role === 'admin' || user?.role === 'superadmin') && window.location.pathname === '/dashboard') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <DashboardLayout title="Dashboard Overview">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h2>
        <p className="text-orange-100 text-lg">
          Here's what's happening with your platforms today
        </p>
      </div>

      {/* Quick Stats - Health Only for Regular Users */}
      {(user?.role === 'user' || user?.role === 'doctor') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-3xl font-bold text-green-600">85%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-blue-600">24</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Appointments</p>
                  <p className="text-3xl font-bold text-purple-600">12</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lab Reports</p>
                  <p className="text-3xl font-bold text-orange-600">8</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin sees both health and security stats */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-3xl font-bold text-green-600">85%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Threats</p>
                  <p className="text-3xl font-bold text-red-600">3</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Devices</p>
                  <p className="text-3xl font-bold text-blue-600">12</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth</p>
                  <p className="text-3xl font-bold text-purple-600">+23%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* HealthTrack Pro Card - Show to all users */}
        {(user?.role === 'user' || user?.role === 'doctor' || user?.role === 'admin') && (
          <Card className="border-2 border-orange-200 hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-white">HealthTrack Pro</CardTitle>
                  <CardDescription className="text-orange-100">
                    AI-Powered Health Management
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Health Records</span>
                  <span className="font-semibold">12 records</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Upcoming Appointments</span>
                  <span className="font-semibold">2 pending</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lab Reports</span>
                  <span className="font-semibold">3 analyzed</span>
                </div>
                <Link to="/dashboard/health">
                  <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    Open Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SecureSphere Card - ONLY for Admin */}
        {user?.role === 'admin' && (
          <Card className="border-2 border-gray-300 hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <CardTitle className="text-white">SecureSphere</CardTitle>
                  <CardDescription className="text-gray-300">
                    Enterprise IT & IoT Security
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Network Devices</span>
                  <span className="font-semibold">12 active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Threats Detected</span>
                  <span className="font-semibold text-red-600">3 critical</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Security Score</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
                <Link to="/dashboard/security">
                  <Button className="w-full mt-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900">
                    Open Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pitch Deck - ONLY for Admin */}
            {user?.role === 'admin' && (
              <Link to="/pitch-deck">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span>View Pitch Deck</span>
                </Button>
              </Link>
            )}
            
            {/* Desktop Apps - For all users */}
            <Link to="/downloads">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Download className="w-6 h-6" />
                <span>Desktop Apps</span>
              </Button>
            </Link>
            
            {/* Upload Lab Report - For health users */}
            <Link to="/dashboard/health">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Heart className="w-6 h-6" />
                <span>Upload Lab Report</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default MainDashboard;
