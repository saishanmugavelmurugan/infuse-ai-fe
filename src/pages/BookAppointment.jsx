/**
 * Appointment Booking Page
 * Full-featured appointment booking with doctor selection, calendar, and reminders
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar, Clock, Bell, Check, ChevronLeft, ChevronRight,
  User, MapPin, Video, Phone, Building2, AlertCircle, Loader2,
  Search, Star, Filter, ArrowLeft, Heart, Stethoscope, X
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Time slot generator
const generateTimeSlots = (bookedSlots = []) => {
  const slots = [];
  for (let hour = 9; hour <= 20; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const label = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      slots.push({ 
        time, 
        label, 
        available: !bookedSlots.includes(time)
      });
    }
  }
  return slots;
};

// Calendar helpers
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');

  // State
  const [step, setStep] = useState(preselectedDoctorId ? 2 : 1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterType, setFilterType] = useState('');

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [consultationType, setConsultationType] = useState('video');

  // Reminder state
  const [reminders, setReminders] = useState({
    dayBefore: true,
    threeHoursBefore: true,
    oneHourBefore: false,
    thirtyMinBefore: false,
    reminderMethod: 'all'
  });

  // Patient info state
  const [patientInfo, setPatientInfo] = useState({
    reason: '',
    symptoms: '',
    notes: ''
  });

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const specialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'General Medicine', 'Gynecology', 'Neurology', 'Oncology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'Pulmonology',
    'Ayurveda', 'Panchakarma', 'Yoga Therapy'
  ];

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (filterSpecialty) params.append('specialty', filterSpecialty);
      if (filterType) params.append('type', filterType);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`${API_URL}/api/doctors/?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors || []);
        
        // If preselected doctor, find and select them
        if (preselectedDoctorId && !selectedDoctor) {
          const preselected = (data.doctors || []).find(d => d.id === preselectedDoctorId);
          if (preselected) {
            setSelectedDoctor(preselected);
            setStep(2);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  }, [filterSpecialty, filterType, searchQuery, preselectedDoctorId, selectedDoctor]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedDoctor]);

  const fetchAvailableSlots = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(
        `${API_URL}/api/healthtrack/appointments/slots/available?doctor_id=${selectedDoctor.id}&appointment_date=${dateStr}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const bookedTimes = data.available_slots
          ?.filter(s => !s.available)
          ?.map(s => s.time) || [];
        setTimeSlots(generateTimeSlots(bookedTimes));
      } else {
        // Fallback to generated slots if API fails
        setTimeSlots(generateTimeSlots([]));
      }
    } catch (err) {
      setTimeSlots(generateTimeSlots([]));
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isDateSelectable = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const handleDateSelect = (day) => {
    if (isDateSelectable(day)) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (slot) => {
    if (slot.available) {
      setSelectedTime(slot);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    setLoading(true);
    setError(null);

    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.time.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const appointmentData = {
        doctor_id: selectedDoctor.id,
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime.time,
        consultation_type: consultationType,
        reason: patientInfo.reason,
        symptoms: patientInfo.symptoms,
        notes: patientInfo.notes,
        reminders: {
          day_before: reminders.dayBefore,
          three_hours_before: reminders.threeHoursBefore,
          one_hour_before: reminders.oneHourBefore,
          thirty_min_before: reminders.thirtyMinBefore,
          method: reminders.reminderMethod
        }
      };

      const response = await fetch(`${API_URL}/api/healthtrack/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(appointmentData)
      });

      if (response.ok) {
        setStep(5); // Success step
      } else {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to book appointment');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render calendar grid
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;
      const isSelected = selectedDate?.getDate() === day &&
        selectedDate?.getMonth() === month;
      const selectable = isDateSelectable(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={!selectable}
          data-testid={`calendar-day-${day}`}
          className={`
            p-2 sm:p-3 rounded-lg text-sm font-medium transition-all
            ${isSelected ? 'bg-orange-500 text-white shadow-md' : ''}
            ${isToday && !isSelected ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-300' : ''}
            ${selectable && !isSelected ? 'hover:bg-gray-100 text-gray-900' : ''}
            ${!selectable ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Progress indicator
  const ProgressSteps = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[
        { num: 1, label: 'Doctor' },
        { num: 2, label: 'Date & Time' },
        { num: 3, label: 'Details' },
        { num: 4, label: 'Confirm' }
      ].map((s, idx) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step >= s.num ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s.num ? <Check className="w-5 h-5" /> : s.num}
            </div>
            <span className={`text-xs mt-1 hidden sm:block ${step >= s.num ? 'text-orange-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
          {idx < 3 && (
            <div className={`w-12 h-1 rounded ${step > s.num ? 'bg-orange-500' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Book Appointment</h1>
            <p className="text-sm text-gray-500">Schedule a consultation with our expert doctors</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressSteps />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-orange-500" />
              Select a Doctor
            </h2>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  data-testid="doctor-search-input"
                />
              </div>
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                data-testid="specialty-filter"
              >
                <option value="">All Specialties</option>
                {specialties.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                data-testid="type-filter"
              >
                <option value="">All Types</option>
                <option value="allopathic">Allopathic</option>
                <option value="ayurvedic">Ayurvedic</option>
              </select>
            </div>

            {/* Doctors Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No doctors found matching your criteria</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setStep(2);
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    data-testid={`doctor-card-${doctor.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-semibold">
                        {doctor.name?.charAt(0) || 'D'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{doctor.name}</h3>
                        <p className="text-sm text-orange-600">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doctor.experience || '5+'} years exp • {doctor.type || 'Allopathic'}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="text-sm font-medium">{doctor.rating || '4.5'}</span>
                          <span className="text-xs text-gray-400">({doctor.total_reviews || '50'} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        ₹{doctor.consultation_fee || '500'} / consultation
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        Available
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && selectedDoctor && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Selected Doctor Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Selected Doctor</h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Change
                </button>
              </div>
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl font-semibold">
                  {selectedDoctor.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedDoctor.name}</h3>
                  <p className="text-sm text-orange-600">{selectedDoctor.specialty}</p>
                  <p className="text-sm text-gray-500">{selectedDoctor.qualification}</p>
                </div>
              </div>

              {/* Consultation Type */}
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Consultation Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'video', icon: Video, label: 'Video', color: 'text-blue-600' },
                    { id: 'audio', icon: Phone, label: 'Audio', color: 'text-green-600' },
                    { id: 'in_person', icon: Building2, label: 'In-Person', color: 'text-purple-600' },
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setConsultationType(type.id)}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        consultationType === type.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      data-testid={`consultation-type-${type.id}`}
                    >
                      <type.icon className={`w-5 h-5 ${consultationType === type.id ? 'text-orange-500' : type.color}`} />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Select Date & Time
              </h2>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-semibold text-gray-900">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Week Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {renderCalendar()}
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    Available Times for {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'short', month: 'short', day: 'numeric' 
                    })}
                  </h3>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {timeSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTimeSelect(slot)}
                        disabled={!slot.available}
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime?.time === slot.time
                            ? 'bg-orange-500 text-white'
                            : slot.available
                              ? 'bg-gray-50 hover:bg-orange-100 text-gray-900'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                        }`}
                        data-testid={`time-slot-${slot.time}`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Button */}
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="w-full mt-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition"
                data-testid="continue-to-details-btn"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Patient Details & Reminders */}
        {step === 3 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Appointment Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h2>
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium">{selectedDoctor?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {selectedDate?.toLocaleDateString('en-US', {
                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{selectedTime?.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    {consultationType === 'video' && <Video className="w-5 h-5 text-purple-600" />}
                    {consultationType === 'audio' && <Phone className="w-5 h-5 text-purple-600" />}
                    {consultationType === 'in_person' && <Building2 className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">{consultationType?.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
              >
                ← Change Date/Time
              </button>
            </div>

            {/* Patient Info & Reminders */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <Heart className="w-5 h-5 text-orange-500 inline mr-2" />
                Visit Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Visit *
                  </label>
                  <input
                    type="text"
                    value={patientInfo.reason}
                    onChange={(e) => setPatientInfo(p => ({ ...p, reason: e.target.value }))}
                    placeholder="e.g., Annual checkup, Follow-up, New concern"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                    data-testid="reason-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms (Optional)
                  </label>
                  <textarea
                    value={patientInfo.symptoms}
                    onChange={(e) => setPatientInfo(p => ({ ...p, symptoms: e.target.value }))}
                    placeholder="Describe your symptoms..."
                    rows={3}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
                    data-testid="symptoms-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={patientInfo.notes}
                    onChange={(e) => setPatientInfo(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Any other information for the doctor..."
                    rows={2}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
                    data-testid="notes-input"
                  />
                </div>
              </div>

              {/* Reminders */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-orange-500" />
                  Appointment Reminders
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'dayBefore', label: '1 day before' },
                    { key: 'threeHoursBefore', label: '3 hours before' },
                    { key: 'oneHourBefore', label: '1 hour before' },
                    { key: 'thirtyMinBefore', label: '30 minutes before' },
                  ].map(rem => (
                    <label key={rem.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={reminders[rem.key]}
                        onChange={() => setReminders(r => ({ ...r, [rem.key]: !r[rem.key] }))}
                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{rem.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(4)}
                disabled={!patientInfo.reason}
                className="w-full mt-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition"
                data-testid="continue-to-confirm-btn"
              >
                Review & Confirm
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              Confirm Your Appointment
            </h2>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 mb-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-semibold text-gray-900">{selectedDoctor?.name}</p>
                  <p className="text-sm text-orange-600">{selectedDoctor?.specialty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600">{selectedTime?.label}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{consultationType?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="font-semibold text-gray-900">₹{selectedDoctor?.consultation_fee || '500'}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-orange-200">
                <p className="text-sm text-gray-500">Reason for Visit</p>
                <p className="font-medium text-gray-900">{patientInfo.reason}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleBookAppointment}
                disabled={loading}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                data-testid="confirm-booking-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment with {selectedDoctor?.name} has been confirmed.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium">{selectedTime?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium capitalize">{consultationType?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard/health')}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
                data-testid="go-to-dashboard-btn"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedDoctor(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setPatientInfo({ reason: '', symptoms: '', notes: '' });
                }}
                className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
