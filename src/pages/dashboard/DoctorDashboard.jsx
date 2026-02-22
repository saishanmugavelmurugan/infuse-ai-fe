import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import {
  Users, Calendar, FileText, TrendingUp, Clock, Activity,
  Search, Plus, Eye, Pill, AlertCircle, CheckCircle, Brain, Watch, Beaker, BarChart3, Shield, Globe, Video, UserPlus, Stethoscope
} from 'lucide-react';
import { healthtrackApi } from '../../services/healthtrackApi';
import { detectUserCountry } from '../../services/healthSchemesApi';
import { useLanguage } from '../../contexts/LanguageContext';
import AddPatientModal from '../../components/dashboard/AddPatientModal';
import WritePrescriptionModal from '../../components/dashboard/WritePrescriptionModal';
import PatientDetailModal from '../../components/dashboard/PatientDetailModal';
import AIAnalyticsDashboard from '../../components/dashboard/AIAnalyticsDashboard';
import WearableDevicesPanel from '../../components/dashboard/WearableDevicesPanel';
import LabTestsPanel from '../../components/dashboard/LabTestsPanel';
import RecordVitalsModal from '../../components/dashboard/RecordVitalsModal';
import OrderLabTestModal from '../../components/dashboard/OrderLabTestModal';
import RevenueAnalyticsDashboard from '../../components/dashboard/RevenueAnalyticsDashboard';
import HealthInsightsAgent from '../../components/dashboard/HealthInsightsAgent';
import ABDMIntegration from '../../components/dashboard/ABDMIntegration';
import RegionalHealthSchemes from '../../components/dashboard/RegionalHealthSchemes';
import VideoConsentRecorder from '../../components/healthtrack/VideoConsentRecorder';
import TeamManagement from '../../components/TeamManagement';
import DoctorDirectory from '../../components/dashboard/DoctorDirectory';

const DoctorDashboard = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [userCountry, setUserCountry] = useState(null);
  
  // Modal states
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [showRecordVitals, setShowRecordVitals] = useState(false);
  const [showOrderLabTest, setShowOrderLabTest] = useState(false);
  const [showVideoConsent, setShowVideoConsent] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Data states
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedToday: 0
  });

  // Detect user country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const country = await detectUserCountry();
        setUserCountry(country);
      } catch (err) {
        console.error('Failed to detect country:', err);
      }
    };
    detectCountry();
  }, []);

  const isOutsideIndia = userCountry && userCountry.country_code !== 'IN';

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel
      const [patientsData, apptsData, prescData] = await Promise.all([
        healthtrackApi.patients.list(0, 100).catch(() => ({ patients: [], total: 0 })),
        healthtrackApi.appointments.list(0, 100).catch(() => ({ appointments: [], total: 0 })),
        healthtrackApi.prescriptions.list(0, 50).catch(() => ({ prescriptions: [], total: 0 })),
      ]);

      setPatients(patientsData.patients || []);
      setAppointments(apptsData.appointments || []);
      setPrescriptions(prescData.prescriptions || []);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = (apptsData.appointments || []).filter(a => a.appointment_date === today);
      const upcoming = (apptsData.appointments || []).filter(a => a.status === 'scheduled');
      const completed = todayAppts.filter(a => a.status === 'completed');

      setStats({
        totalPatients: patientsData.total || patientsData.patients?.length || 0,
        todayAppointments: todayAppts.length,
        upcomingAppointments: upcoming.length,
        completedToday: completed.length
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      await fetchDashboardData();
    };
    initData();
  }, []);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetail(true);
  };

  const handleWritePrescription = (patient) => {
    setSelectedPatient(patient);
    setShowPrescription(true);
  };

  const handleRecordVitals = (patient) => {
    setSelectedPatient(patient);
    setShowRecordVitals(true);
  };

  const handleOrderLabTest = (patient) => {
    setSelectedPatient(patient);
    setShowOrderLabTest(true);
  };

  const filteredPatients = patients.filter(p => 
    !searchQuery || 
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.patient_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading_dashboard', 'Loading dashboard...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">{t('error_loading_dashboard', 'Error loading dashboard')}</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <Button onClick={fetchDashboardData} className="mt-4 bg-red-600 hover:bg-red-700">
              {t('retry', 'Retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todayAppointments = appointments.filter(
    a => a.appointment_date === new Date().toISOString().split('T')[0]
  ).slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('doctor_dashboard', 'Doctor Dashboard')}</h1>
          <p className="text-gray-600 mt-1">{t('manage_patients_appointments', 'Manage your patients and appointments')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setShowAddPatient(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('add_patient', 'Add Patient')}
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Calendar className="w-4 h-4 mr-2" />
            {t('new_appointment', 'New Appointment')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{t('total_patients', 'Total Patients')}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stats.totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{t('todays_appointments', "Today's Appointments")}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stats.todayAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{t('upcoming', 'Upcoming')}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stats.upcomingAppointments}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{t('completed_today', 'Completed Today')}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stats.completedToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full grid-cols-5 ${isOutsideIndia ? 'lg:grid-cols-11' : 'lg:grid-cols-10'} lg:w-auto lg:inline-flex`}>
          <TabsTrigger value="overview">{t('dashboard.tabs.overview', 'Overview')}</TabsTrigger>
          <TabsTrigger value="patients">{t('dashboard.tabs.patients', 'Patients')}</TabsTrigger>
          <TabsTrigger value="appointments">{t('dashboard.tabs.appointments', 'Appointments')}</TabsTrigger>
          <TabsTrigger value="prescriptions">{t('dashboard.tabs.prescriptions', 'Prescriptions')}</TabsTrigger>
          <TabsTrigger value="analytics">
            <Brain className="w-4 h-4 mr-1 hidden sm:inline" />{t('dashboard.tabs.analytics', 'Analytics')}
          </TabsTrigger>
          <TabsTrigger value="lab-tests">{t('dashboard.tabs.labTests', 'Lab Tests')}</TabsTrigger>
          <TabsTrigger value="health-insights">
            <Brain className="w-4 h-4 mr-1 hidden sm:inline" />{t('dashboard.tabs.insights', 'Insights')}
          </TabsTrigger>
          {/* Show ABDM for India users */}
          {!isOutsideIndia && (
            <TabsTrigger value="abdm">
              <Shield className="w-4 h-4 mr-1 hidden sm:inline" />ABDM
            </TabsTrigger>
          )}
          {/* Show Global Health Schemes for non-India users */}
          {isOutsideIndia && (
            <TabsTrigger value="health-schemes">
              <Globe className="w-4 h-4 mr-1 hidden sm:inline" />Health Schemes
            </TabsTrigger>
          )}
          <TabsTrigger value="consents" className="text-red-600">
            <Video className="w-4 h-4 mr-1 hidden sm:inline" />Consents
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <BarChart3 className="w-4 h-4 mr-1 hidden sm:inline" />{t('dashboard.tabs.revenue', 'Revenue')}
          </TabsTrigger>
          <TabsTrigger value="team">
            <UserPlus className="w-4 h-4 mr-1 hidden sm:inline" />{t('dashboard.tabs.team', 'Team')}
          </TabsTrigger>
          <TabsTrigger value="doctors">
            <Stethoscope className="w-4 h-4 mr-1 hidden sm:inline" />Doctors
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                    {t('todays_schedule', "Today's Schedule")}
                  </span>
                  <Button variant="link" className="text-orange-600 p-0" onClick={() => setActiveTab('appointments')}>
                    {t('view_all', 'View All')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {todayAppointments.map((appt) => (
                      <div key={appt.id} className="p-3 border rounded-lg hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{appt.appointment_time}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                appt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {appt.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{appt.reason}</div>
                          </div>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">{t('view', 'View')}</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>{t('no_appointments_today', 'No appointments today')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-orange-600" />
                    {t('recent_patients', 'Recent Patients')}
                  </span>
                  <Button variant="link" className="text-orange-600 p-0" onClick={() => setActiveTab('patients')}>
                    {t('view_all', 'View All')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patients.length > 0 ? (
                  <div className="space-y-3">
                    {patients.slice(0, 5).map((patient) => (
                      <div key={patient.id} className="p-3 border rounded-lg hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {patient.first_name} {patient.last_name}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {patient.patient_number}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {patient.medical_history?.chronic_conditions?.slice(0, 2).map((condition, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                  {condition}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-orange-600 border-orange-600"
                            onClick={() => handleViewPatient(patient)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>No patients yet</p>
                    <Button onClick={() => setShowAddPatient(true)} className="mt-3 bg-orange-600 hover:bg-orange-700">
                      Add Patient
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => setShowPrescription(true)}
                >
                  <Pill className="w-6 h-6 mb-2 text-orange-600" />
                  <span className="text-sm">Write Prescription</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => {
                    if (patients.length > 0) {
                      setSelectedPatient(patients[0]);
                      setShowRecordVitals(true);
                    } else {
                      alert('Please add a patient first');
                    }
                  }}
                >
                  <Activity className="w-6 h-6 mb-2 text-orange-600" />
                  <span className="text-sm">Record Vitals</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => {
                    if (patients.length > 0) {
                      setSelectedPatient(patients[0]);
                      setShowOrderLabTest(true);
                    } else {
                      alert('Please add a patient first');
                    }
                  }}
                >
                  <Beaker className="w-6 h-6 mb-2 text-orange-600" />
                  <span className="text-sm">Order Lab Tests</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => setActiveTab('analytics')}
                >
                  <Brain className="w-6 h-6 mb-2 text-purple-600" />
                  <span className="text-sm">AI Analytics</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => setActiveTab('lab-tests')}
                >
                  <TrendingUp className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-sm">View Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col md:flex-row justify-between gap-4">
                <span>Patient Management</span>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={() => setShowAddPatient(true)} className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Patient
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPatients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-medium">Patient</th>
                        <th className="text-left p-3 font-medium">ID</th>
                        <th className="text-left p-3 font-medium hidden md:table-cell">Contact</th>
                        <th className="text-left p-3 font-medium hidden lg:table-cell">Conditions</th>
                        <th className="text-right p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                            <div className="text-sm text-gray-500">{patient.gender}, {patient.date_of_birth}</div>
                          </td>
                          <td className="p-3 text-sm text-gray-600">{patient.patient_number}</td>
                          <td className="p-3 hidden md:table-cell">
                            <div className="text-sm">{patient.email}</div>
                            <div className="text-sm text-gray-500">{patient.phone}</div>
                          </td>
                          <td className="p-3 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {patient.medical_history?.chronic_conditions?.slice(0, 2).map((c, i) => (
                                <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewPatient(patient)}
                                title="View Patient"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleWritePrescription(patient)}
                                title="Write Prescription"
                              >
                                <Pill className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRecordVitals(patient)}
                                title="Record Vitals"
                              >
                                <Activity className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleOrderLabTest(patient)}
                                title="Order Lab Test"
                              >
                                <Beaker className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setShowVideoConsent(true);
                                }}
                                title="Record Video Consent"
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Video className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No patients found</p>
                  <Button onClick={() => setShowAddPatient(true)} className="mt-4 bg-orange-600 hover:bg-orange-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Patient
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>All Appointments</span>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appt) => (
                    <div key={appt.id} className="p-4 border rounded-lg hover:shadow-md transition">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{appt.appointment_type || 'Consultation'}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                              appt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                              appt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {appt.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{appt.reason}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{appt.appointment_date}</span>
                            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{appt.appointment_time}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {appt.status === 'scheduled' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">Complete</Button>
                          )}
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No appointments found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Recent Prescriptions</span>
                <Button onClick={() => setShowPrescription(true)} className="bg-orange-600 hover:bg-orange-700">
                  <Pill className="w-4 h-4 mr-2" />
                  Write New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptions.length > 0 ? (
                <div className="space-y-4">
                  {prescriptions.map((presc) => (
                    <div key={presc.id} className="p-4 border rounded-lg hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">Rx #{presc.prescription_number}</div>
                          <div className="text-sm text-gray-600 mt-1">Date: {presc.prescription_date?.split('T')[0]}</div>
                          <div className="mt-2">
                            {presc.medications?.map((med, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded mr-2 mb-1">
                                {med.drug_name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          presc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {presc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Pill className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No prescriptions found</p>
                  <Button onClick={() => setShowPrescription(true)} className="mt-4 bg-orange-600 hover:bg-orange-700">
                    Write First Prescription
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {selectedPatient ? (
            <AIAnalyticsDashboard patientId={selectedPatient.id} labTests={labTests} />
          ) : patients.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Select Patient for AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Choose a patient to view their AI-powered health analytics:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.slice(0, 6).map((patient) => (
                    <div 
                      key={patient.id} 
                      className="p-4 border rounded-lg hover:shadow-md cursor-pointer hover:border-purple-500 transition"
                      onClick={async () => {
                        setSelectedPatient(patient);
                        // Also fetch lab tests for this patient
                        try {
                          const data = await healthtrackApi.labTests.getPatientTests(patient.id);
                          setLabTests(data.lab_tests || []);
                        } catch (e) {
                          console.error('Error fetching lab tests:', e);
                        }
                      }}
                    >
                      <div className="font-semibold">{patient.first_name} {patient.last_name}</div>
                      <div className="text-sm text-gray-500">{patient.patient_number}</div>
                      <div className="flex gap-1 mt-2">
                        {patient.medical_history?.chronic_conditions?.slice(0, 2).map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Brain className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">Add patients to access AI Analytics</p>
                  <Button onClick={() => setShowAddPatient(true)} className="mt-4 bg-orange-600 hover:bg-orange-700">
                    Add Patient
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Lab Tests Tab */}
        <TabsContent value="lab-tests" className="space-y-6">
          {selectedPatient ? (
            <LabTestsPanel 
              patientId={selectedPatient.id} 
              onAnalyze={(labTestId) => {
                // Switch to analytics tab and trigger analysis
                setActiveTab('analytics');
              }}
            />
          ) : patients.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Select Patient for Lab Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Choose a patient to view their lab test results:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.slice(0, 6).map((patient) => (
                    <div 
                      key={patient.id} 
                      className="p-4 border rounded-lg hover:shadow-md cursor-pointer hover:border-blue-500 transition"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="font-semibold">{patient.first_name} {patient.last_name}</div>
                      <div className="text-sm text-gray-500">{patient.patient_number}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">Add patients to view lab reports</p>
                  <Button onClick={() => setShowAddPatient(true)} className="mt-4 bg-orange-600 hover:bg-orange-700">
                    Add Patient
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Health Insights AI Agent Tab */}
        <TabsContent value="health-insights" className="space-y-6">
          <HealthInsightsAgent 
            patientId={selectedPatient?.id} 
            isDoctor={true}
          />
          
          {/* Patient Selection for Insights */}
          {!selectedPatient && (
            <Card>
              <CardHeader>
                <CardTitle>Select a Patient for AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.slice(0, 6).map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className="p-4 border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left"
                    >
                      <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                      <div className="text-sm text-gray-500">{patient.patient_number}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Video Consents Tab */}
        <TabsContent value="consents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-600" />
                  Video Consent Management
                </span>
                <Button 
                  onClick={() => setShowVideoConsent(true)}
                  disabled={!selectedPatient}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record New Consent
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedPatient ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient First</h3>
                  <p className="text-gray-500 mb-4">Choose a patient from the Patients tab to record video consent</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-xl mx-auto">
                    <h4 className="font-medium text-blue-800 mb-2">Available Consent Types (24 Types):</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                      <div>• Surgical Consent</div>
                      <div>• Anesthesia Consent</div>
                      <div>• Blood Transfusion</div>
                      <div>• High-Risk Surgery</div>
                      <div>• ICU Admission</div>
                      <div>• DNR/DNAR</div>
                      <div>• LAMA (Against Advice)</div>
                      <div>• Maternity/Delivery</div>
                      <div>• Pediatric Treatment</div>
                      <div>• Clinical Trial</div>
                      <div>• Organ Donation</div>
                      <div>• And 13 more...</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800">Selected Patient: {selectedPatient.name || `${selectedPatient.first_name} ${selectedPatient.last_name}`}</h4>
                    <p className="text-sm text-green-600">Click "Record New Consent" to begin video consent recording</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="text-3xl font-bold text-red-600">24</div>
                      <div className="text-sm text-gray-600">Consent Types Available</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="text-3xl font-bold text-blue-600">11</div>
                      <div className="text-sm text-gray-600">Categories Covered</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="text-3xl font-bold text-green-600">100%</div>
                      <div className="text-sm text-gray-600">Legally Valid</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Consent Categories:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: 'Procedural', desc: 'Surgery, Anesthesia', color: 'blue' },
                        { name: 'High-Risk', desc: 'Complex procedures', color: 'red' },
                        { name: 'Critical Care', desc: 'ICU, Emergency', color: 'orange' },
                        { name: 'End of Life', desc: 'DNR, Palliative', color: 'purple' },
                        { name: 'Discharge', desc: 'LAMA, Discharge', color: 'yellow' },
                        { name: 'Specialty', desc: 'Maternity, Pediatric', color: 'teal' },
                        { name: 'Research', desc: 'Clinical Trials', color: 'indigo' },
                        { name: 'Privacy', desc: 'Data, Recording', color: 'green' }
                      ].map((cat) => (
                        <div key={cat.name} className={`p-3 rounded-lg border bg-${cat.color}-50 border-${cat.color}-200`}>
                          <div className="font-medium text-gray-800">{cat.name}</div>
                          <div className="text-xs text-gray-500">{cat.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Analytics Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <RevenueAnalyticsDashboard />
        </TabsContent>

        {/* ABDM Integration Tab */}
        <TabsContent value="abdm" className="space-y-6">
          {selectedPatient ? (
            <ABDMIntegration patientId={selectedPatient.id} isDoctor={true} />
          ) : patients.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Select Patient for ABDM Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Choose a patient to manage their ABDM (Ayushman Bharat Digital Mission) integration:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.slice(0, 6).map((patient) => (
                    <div 
                      key={patient.id} 
                      className="p-4 border rounded-lg hover:shadow-md cursor-pointer hover:border-green-500 transition"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="font-semibold">{patient.first_name} {patient.last_name}</div>
                      <div className="text-sm text-gray-500">{patient.patient_number}</div>
                      <div className="flex gap-1 mt-2">
                        {patient.abdm_linked ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">ABHA Linked</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">Not Linked</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">Add patients to access ABDM Integration</p>
                  <Button onClick={() => setShowAddPatient(true)} className="mt-4 bg-orange-600 hover:bg-orange-700">
                    Add Patient
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Global Health Schemes Tab - Only for non-India users */}
        <TabsContent value="health-schemes" className="space-y-6">
          <RegionalHealthSchemes />
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value="team" className="space-y-6">
          <TeamManagement platform="healthtrack" />
        </TabsContent>

        {/* Doctor Directory Tab */}
        <TabsContent value="doctors" className="space-y-6">
          <DoctorDirectory userRole="doctor" />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showAddPatient && (
        <AddPatientModal 
          onClose={() => setShowAddPatient(false)} 
          onSuccess={() => {
            setShowAddPatient(false);
            fetchDashboardData();
          }}
        />
      )}

      {showPrescription && (
        <WritePrescriptionModal 
          onClose={() => {
            setShowPrescription(false);
            setSelectedPatient(null);
          }} 
          onSuccess={() => {
            setShowPrescription(false);
            setSelectedPatient(null);
            fetchDashboardData();
          }}
          patient={selectedPatient}
          patients={patients}
        />
      )}

      {showPatientDetail && selectedPatient && (
        <PatientDetailModal 
          patient={selectedPatient}
          onClose={() => {
            setShowPatientDetail(false);
            setSelectedPatient(null);
          }}
          onWritePrescription={() => {
            setShowPatientDetail(false);
            setShowPrescription(true);
          }}
        />
      )}

      {showRecordVitals && selectedPatient && (
        <RecordVitalsModal
          patient={selectedPatient}
          onClose={() => {
            setShowRecordVitals(false);
            setSelectedPatient(null);
          }}
          onSuccess={() => {
            setShowRecordVitals(false);
            setSelectedPatient(null);
            fetchDashboardData();
          }}
        />
      )}

      {showOrderLabTest && selectedPatient && (
        <OrderLabTestModal
          patient={selectedPatient}
          onClose={() => {
            setShowOrderLabTest(false);
            setSelectedPatient(null);
          }}
          onSuccess={() => {
            setShowOrderLabTest(false);
            setSelectedPatient(null);
            fetchDashboardData();
          }}
        />
      )}

      {/* Video Consent Recorder */}
      {showVideoConsent && selectedPatient && (
        <VideoConsentRecorder
          patientId={selectedPatient.id}
          patientName={selectedPatient.name}
          onConsentRecorded={(data) => {
            console.log('Consent recorded:', data);
            setShowVideoConsent(false);
            setSelectedPatient(null);
          }}
          onClose={() => {
            setShowVideoConsent(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
