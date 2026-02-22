import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Calendar, Activity, FileText, Pill, Clock, TrendingUp, 
  Heart, AlertCircle, Watch, Brain, Video, Shield, Globe
} from 'lucide-react';
import { healthtrackApi } from '../../services/healthtrackApi';
import { detectUserCountry } from '../../services/healthSchemesApi';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import BookAppointmentModal from '../../components/dashboard/BookAppointmentModal';
import AIAnalyticsDashboard from '../../components/dashboard/AIAnalyticsDashboard';
import WearableDevicesPanel from '../../components/dashboard/WearableDevicesPanel';
import LabTestsPanel from '../../components/dashboard/LabTestsPanel';
import ABDMIntegration from '../../components/dashboard/ABDMIntegration';
import RegionalHealthSchemes from '../../components/dashboard/RegionalHealthSchemes';

const PatientDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookModal, setShowBookModal] = useState(false);
  const [userCountry, setUserCountry] = useState(null);
  
  // Data states
  const [patientInfo, setPatientInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [labTests, setLabTests] = useState([]);

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

      // Get current user info - API layer uses XMLHttpRequest to avoid monitoring tool conflicts
      const userData = await healthtrackApi.auth.me();
      
      // Try to get patient records
      const patientsData = await healthtrackApi.patients.list(0, 50, userData.email);
      const patient = patientsData.patients?.[0];
      
      if (patient) {
        setPatientInfo(patient);
        
        // Fetch patient-specific data in parallel
        const [apptsData, prescData, recordsData, labData] = await Promise.all([
          healthtrackApi.patients.getAppointments(patient.id).catch(() => ({ appointments: [] })),
          healthtrackApi.prescriptions.getForPatient(patient.id).catch(() => ({ prescriptions: [] })),
          healthtrackApi.patients.getMedicalHistory(patient.id).catch(() => ({ medical_records: [], lab_results: [] })),
          healthtrackApi.labTests.list(0, 50, patient.id).catch(() => ({ lab_tests: [] })),
        ]);

        setAppointments(apptsData.appointments || []);
        setPrescriptions(prescData.prescriptions || []);
        setMedicalRecords(recordsData.medical_records || []);
        setLabTests(labData.lab_tests || []);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleRefillRequest = async (prescriptionId) => {
    try {
      await healthtrackApi.prescriptions.requestRefill(prescriptionId);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to request refill: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading_dashboard', 'Loading your health dashboard...')}</p>
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

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled').slice(0, 5);
  const activePrescriptions = prescriptions.filter(p => p.status === 'active').slice(0, 5);
  const latestVitals = medicalRecords[0]?.vitals;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('my_health_overview', 'My Health Dashboard')}</h1>
          <p className="text-gray-600 mt-1">
            {patientInfo ? `${t('welcome_back', 'Welcome')}, ${patientInfo.first_name}` : t('view_health_summary', 'Track your health and manage appointments')}
          </p>
        </div>
        <Button 
          onClick={() => setShowBookModal(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {t('book_new_appointment', 'Book Appointment')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${isOutsideIndia ? 'grid-cols-8' : 'grid-cols-7'} lg:w-auto lg:inline-flex`}>
          <TabsTrigger value="overview">{t('dashboard.tabs.overview', 'Overview')}</TabsTrigger>
          <TabsTrigger value="analytics">
            <Brain className="w-4 h-4 mr-1 hidden sm:inline" />{t('dashboard.tabs.aiAnalytics', 'AI Analytics')}
          </TabsTrigger>
          <TabsTrigger value="wearables">
            <Watch className="w-4 h-4 mr-1 hidden sm:inline" />{t('dashboard.tabs.devices', 'Devices')}
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
          <TabsTrigger value="appointments">{t('dashboard.tabs.appointments', 'Appointments')}</TabsTrigger>
          <TabsTrigger value="prescriptions">{t('dashboard.tabs.prescriptions', 'Prescriptions')}</TabsTrigger>
          <TabsTrigger value="records">{t('dashboard.tabs.records', 'Records')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Health Vitals Summary */}
          {latestVitals && (
            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-orange-600" />
                  Latest Health Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Blood Pressure</div>
                    <div className="text-xl md:text-2xl font-bold text-blue-700">
                      {latestVitals.blood_pressure_systolic || '--'}/{latestVitals.blood_pressure_diastolic || '--'}
                    </div>
                    <div className="text-xs text-gray-500">mmHg</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Heart Rate</div>
                    <div className="text-xl md:text-2xl font-bold text-green-700">{latestVitals.heart_rate || '--'}</div>
                    <div className="text-xs text-gray-500">bpm</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Blood Sugar</div>
                    <div className="text-xl md:text-2xl font-bold text-purple-700">{latestVitals.blood_sugar || '--'}</div>
                    <div className="text-xs text-gray-500">mg/dL</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Temperature</div>
                    <div className="text-xl md:text-2xl font-bold text-orange-700">{latestVitals.temperature || '--'}</div>
                    <div className="text-xs text-gray-500">°F</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setActiveTab('analytics')}
            >
              <Brain className="w-6 h-6 mb-2 text-purple-600" />
              <span className="text-sm">AI Health Analysis</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setActiveTab('wearables')}
            >
              <Watch className="w-6 h-6 mb-2 text-orange-600" />
              <span className="text-sm">My Devices</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setActiveTab('records')}
            >
              <FileText className="w-6 h-6 mb-2 text-blue-600" />
              <span className="text-sm">Lab Reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setShowBookModal(true)}
            >
              <Calendar className="w-6 h-6 mb-2 text-green-600" />
              <span className="text-sm">Book Appointment</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Appointments Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                    Upcoming Appointments
                  </span>
                  <Button variant="link" className="text-orange-600 p-0" onClick={() => setActiveTab('appointments')}>
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appt) => (
                      <div key={appt.id} className="p-3 border rounded-lg hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-900">{appt.appointment_type || 'Consultation'}</div>
                            <div className="text-sm text-gray-600 mt-1">{appt.reason}</div>
                            <div className="text-xs text-gray-500 mt-2 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {appt.appointment_date} at {appt.appointment_time}
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>No upcoming appointments</p>
                    <Button 
                      onClick={() => setShowBookModal(true)}
                      className="mt-3 bg-orange-600 hover:bg-orange-700"
                    >
                      Book Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Prescriptions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-orange-600" />
                    Active Prescriptions
                  </span>
                  <Button variant="link" className="text-orange-600 p-0" onClick={() => setActiveTab('prescriptions')}>
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activePrescriptions.length > 0 ? (
                  <div className="space-y-3">
                    {activePrescriptions.map((presc) => (
                      <div key={presc.id} className="p-3 border rounded-lg hover:shadow-md transition">
                        <div className="font-semibold text-gray-900">
                          {presc.medications?.[0]?.drug_name || 'Medication'}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {presc.medications?.[0]?.dosage} - {presc.medications?.[0]?.frequency}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">Valid until: {presc.valid_until}</span>
                          {presc.max_refills > presc.refill_count && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-orange-600 border-orange-600 text-xs"
                              onClick={() => handleRefillRequest(presc.id)}
                            >
                              Request Refill
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Pill className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>No active prescriptions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {patientInfo && (
            <AIAnalyticsDashboard patientId={patientInfo.id} labTests={labTests} />
          )}
        </TabsContent>

        {/* Wearables Tab */}
        <TabsContent value="wearables" className="space-y-6">
          {patientInfo && (
            <WearableDevicesPanel patientId={patientInfo.id} />
          )}
        </TabsContent>

        {/* ABDM Tab */}
        <TabsContent value="abdm" className="space-y-6">
          {patientInfo ? (
            <ABDMIntegration patientId={patientInfo.id} isDoctor={false} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">Loading patient information...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Global Health Schemes Tab - Only for non-India users */}
        <TabsContent value="health-schemes" className="space-y-6">
          <RegionalHealthSchemes />
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Appointments</span>
                <Button onClick={() => setShowBookModal(true)} className="bg-orange-600 hover:bg-orange-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book New
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
                            <span className="font-semibold text-gray-900">{appt.appointment_type || 'Consultation'}</span>
                            {appt.appointment_type === 'telemedicine' && (
                              <Video className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{appt.reason}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{appt.appointment_date}</span>
                            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{appt.appointment_time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                            appt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No appointments found</p>
                  <p className="text-sm mt-1">Book your first appointment to get started</p>
                  <Button onClick={() => setShowBookModal(true)} className="mt-4 bg-orange-600 hover:bg-orange-700">
                    Book Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptions.length > 0 ? (
                <div className="space-y-4">
                  {prescriptions.map((presc) => (
                    <div key={presc.id} className="p-4 border rounded-lg hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-900">Rx #{presc.prescription_number}</div>
                          <div className="text-sm text-gray-600 mt-1">Date: {presc.prescription_date?.split('T')[0]}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          presc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {presc.status}
                        </span>
                      </div>
                      
                      {/* Medications List */}
                      <div className="mt-4 space-y-2">
                        {presc.medications?.map((med, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded">
                            <div className="font-medium">{med.drug_name}</div>
                            <div className="text-sm text-gray-600">
                              {med.dosage} - {med.frequency} - {med.duration}
                            </div>
                            {med.instructions && (
                              <div className="text-xs text-gray-500 mt-1">{med.instructions}</div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Valid until: {presc.valid_until}
                          {presc.max_refills > 0 && (
                            <span className="ml-4">Refills: {presc.refill_count}/{presc.max_refills}</span>
                          )}
                        </div>
                        {presc.status === 'active' && presc.max_refills > presc.refill_count && (
                          <Button 
                            size="sm" 
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => handleRefillRequest(presc.id)}
                          >
                            Request Refill
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Pill className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No prescriptions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Records Tab */}
        <TabsContent value="records" className="space-y-6">
          {/* Lab Tests Panel */}
          {patientInfo && (
            <LabTestsPanel patientId={patientInfo.id} />
          )}

          {/* Medical Records */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              {medicalRecords.length > 0 ? (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-900 capitalize">{record.record_type || 'Medical Record'}</div>
                          <div className="text-sm text-gray-600 mt-1">Date: {record.record_date}</div>
                        </div>
                        <Button size="sm" variant="outline" className="text-orange-600 border-orange-600">
                          <FileText className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                      {record.diagnosis && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-gray-700">Diagnosis:</div>
                          <div className="text-sm text-gray-600">{record.diagnosis}</div>
                        </div>
                      )}
                      {record.notes && (
                        <div className="mt-2">
                          <div className="text-sm font-medium text-gray-700">Notes:</div>
                          <div className="text-sm text-gray-600">{record.notes}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No medical records found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <BookAppointmentModal 
          onClose={() => setShowBookModal(false)} 
          onSuccess={() => {
            setShowBookModal(false);
            fetchDashboardData();
          }}
          patientId={patientInfo?.id}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
