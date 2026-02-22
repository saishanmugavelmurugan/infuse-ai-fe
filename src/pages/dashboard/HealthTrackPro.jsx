import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import SEO from '../../components/SEO';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';

const HealthTrackPro = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <DashboardLayout title="HealthTrack Pro">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Role-based dashboard rendering
  const isDoctor = user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <DashboardLayout title="HealthTrack Pro">
      <SEO
        title="HealthTrack Pro - AI-Powered Health Management | Infuse-AI"
        description="Manage patient records, appointments, and health insights with HealthTrack Pro"
        keywords="health management, patient records, appointments, healthcare platform"
      />
      {isDoctor ? <DoctorDashboard /> : <PatientDashboard />}
    </DashboardLayout>
  );
};

export default HealthTrackPro;
