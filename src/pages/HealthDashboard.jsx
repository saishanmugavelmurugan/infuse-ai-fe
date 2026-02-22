import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import {
  Activity,
  Users,
  DollarSign,
  Heart,
  FileText,
  Package,
  Stethoscope,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Home as HomeIcon
} from 'lucide-react';
import { healthUsers, enrolledDoctors, billingRecords, medicineInventory } from '../infuse-mock';
import SEO from '../components/SEO';

const HealthDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="HealthTrack Pro - Enterprise Healthcare Management"
        description="HealthTrack Pro combines Ayurvedic and allopathic practices for comprehensive healthcare management. Manage health records, doctor portals, billing, and medicine inventory with enterprise-grade security."
        keywords="Healthcare Management, Electronic Health Records, EHR, Ayurvedic Healthcare, Allopathic Medicine, Doctor Portal, Medical Billing, Health Data Privacy, HIPAA Compliant"
        canonical="https://www.infuse.net.in/health"
      />
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={process.env.REACT_APP_LOGO_URL} 
                alt="Infuse-ai Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="text-xl font-bold text-gray-900">HealthTrack Pro</span>
                <Badge className="ml-2 bg-green-100 text-green-700 text-xs">Healthcare SaaS</Badge>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="outline">Admin Settings</Button>
              <Link to="/">
                <Button variant="ghost">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Management Dashboard</h1>
          <p className="text-gray-600">Holistic health monitoring with Ayurvedic & Allopathic integration</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">2,483</div>
              <p className="text-xs text-gray-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Enrolled Doctors</CardTitle>
              <Stethoscope className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{enrolledDoctors.length}</div>
              <p className="text-xs text-gray-600 mt-1">Across {new Set(enrolledDoctors.map(d => d.country)).size} countries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue (MTD)</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">₹12.5L</div>
              <p className="text-xs text-gray-600 mt-1">+28% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Health Score</CardTitle>
              <Heart className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">85/100</div>
              <p className="text-xs text-gray-600 mt-1">Excellent health trend</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="medicines">Medicine Inventory</TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Patient Records with Privacy Protection
                </CardTitle>
                <CardDescription>
                  All health records centralized with sub-account based privacy controls
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {healthUsers.map((user) => (
                <Card key={user.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <Activity className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <Badge variant="outline" className="mt-1">Age: {user.age}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <div className="text-sm text-gray-600">Health Score</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={user.healthScore} className="h-2 flex-1" />
                              <span className="text-lg font-bold text-blue-600">{user.healthScore}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Last Checkup</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium">{user.lastCheckup}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Stethoscope className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">Primary Doctor:</span>
                          <span className="text-gray-600">{user.primaryDoctor}</span>
                        </div>

                        {user.activeConditions.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-2">Active Conditions</div>
                            <div className="flex flex-wrap gap-2">
                              {user.activeConditions.map((condition, index) => (
                                <Badge key={index} className="bg-yellow-100 text-yellow-700">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>{user.recordsCount} health records on file</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button size="sm" className="flex-1">View Full Profile</Button>
                      <Button size="sm" variant="outline" className="flex-1">Schedule Appointment</Button>
                      <Button size="sm" variant="outline" className="flex-1">Access Records</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  Global Doctor Enrollment
                </CardTitle>
                <CardDescription>
                  Doctors from around the world enrolled to expand their practice
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {enrolledDoctors.map((doctor) => (
                <Card key={doctor.id} className="border-2 hover:border-purple-600 hover:shadow-xl transition-all">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                          <Badge className="mt-2 bg-purple-100 text-purple-700">
                            {doctor.specialization}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-lg">{doctor.rating}</span>
                          </div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{doctor.patientsCount}</div>
                          <div className="text-xs text-gray-600">Patients</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">₹{(doctor.revenue/1000).toFixed(1)}K</div>
                          <div className="text-xs text-gray-600">Revenue</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span>{doctor.country}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Joined: {doctor.joinDate}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">View Profile</Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Billing & Payment Management
                </CardTitle>
                <CardDescription>
                  Automated billing system with transparent payment tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {billingRecords.map((record) => (
                <Card key={record.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{record.patientName}</h3>
                            <p className="text-sm text-gray-600">Doctor: {record.doctorName}</p>
                          </div>
                          <Badge className={
                            record.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }>
                            {record.status}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-gray-900">₹{record.amount}</div>
                            <div className="text-sm text-gray-600">{record.date}</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-2">Services</div>
                          <div className="flex flex-wrap gap-2">
                            {record.services.map((service, index) => (
                              <Badge key={index} variant="outline">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button size="sm" variant="outline" className="flex-1">Download Invoice</Button>
                      {record.status === 'Pending' && (
                        <Button size="sm" className="flex-1">Process Payment</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medicine Inventory Tab */}
          <TabsContent value="medicines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Medicine Inventory Management
                </CardTitle>
                <CardDescription>
                  Real-time inventory tracking for both Allopathic and Ayurvedic medicines
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {medicineInventory.map((medicine) => (
                <Card key={medicine.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{medicine.name}</h3>
                          <Badge className={
                            medicine.category === 'Ayurvedic' 
                              ? 'bg-green-100 text-green-700 mt-2'
                              : 'bg-blue-100 text-blue-700 mt-2'
                          }>
                            {medicine.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">₹{medicine.price}</div>
                          <div className="text-xs text-gray-600">per unit</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xl font-bold text-gray-900">{medicine.stock}</div>
                          <div className="text-xs text-gray-600">Units in Stock</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-gray-900">{medicine.expiryDate}</div>
                          <div className="text-xs text-gray-600">Expiry Date</div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Supplier:</span> {medicine.supplier}
                      </div>

                      {medicine.stock < 2000 && (
                        <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                          <AlertCircle className="w-4 h-4" />
                          <span>Low stock - Reorder recommended</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">Reorder</Button>
                        <Button size="sm" variant="outline" className="flex-1">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthDashboard;