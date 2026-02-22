/**
 * Appointment Calendar with Date/Time Selection
 * Smart booking with reminder customization
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Bell, BellOff, Check, X, ChevronLeft, ChevronRight,
  User, MapPin, Video, Phone, Building2, AlertCircle, Loader2
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Generate time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 20; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const label = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      slots.push({ time, label, available: Math.random() > 0.3 }); // Simulated availability
    }
  }
  return slots;
};

// Calendar helper functions
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const AppointmentCalendar = ({ 
  doctorId, 
  doctor,
  onBookingComplete,
  existingAppointment = null
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultationType, setConsultationType] = useState('video');
  const [step, setStep] = useState(1); // 1: Date, 2: Time, 3: Reminders, 4: Confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  
  // Reminder settings
  const [reminders, setReminders] = useState({
    dayBefore: true,
    threeHoursBefore: true,
    customReminders: [],
    reminderMethod: 'all' // 'sms', 'email', 'push', 'all'
  });

  // Custom reminder options
  const reminderOptions = [
    { id: 'week_before', label: '1 week before', minutes: 10080 },
    { id: 'day_before', label: '1 day before', minutes: 1440 },
    { id: 'three_hours', label: '3 hours before', minutes: 180 },
    { id: 'one_hour', label: '1 hour before', minutes: 60 },
    { id: 'thirty_min', label: '30 minutes before', minutes: 30 },
    { id: 'fifteen_min', label: '15 minutes before', minutes: 15 },
  ];

  useEffect(() => {
    if (selectedDate) {
      // Generate time slots for selected date
      setTimeSlots(generateTimeSlots());
    }
  }, [selectedDate]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
      setStep(2);
    }
  };

  const handleTimeSelect = (slot) => {
    if (slot.available) {
      setSelectedTime(slot);
      setStep(3);
    }
  };

  const toggleReminder = (reminderId) => {
    setReminders(prev => {
      const isSelected = prev.customReminders.includes(reminderId);
      return {
        ...prev,
        customReminders: isSelected
          ? prev.customReminders.filter(id => id !== reminderId)
          : [...prev.customReminders, reminderId]
      };
    });
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setLoading(true);
    setError(null);

    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.time.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const appointmentData = {
        doctor_id: doctorId,
        appointment_date: appointmentDateTime.toISOString(),
        consultation_type: consultationType,
        reminders: {
          enabled: true,
          day_before: reminders.dayBefore,
          three_hours_before: reminders.threeHoursBefore,
          custom_reminders: reminders.customReminders.map(id => {
            const option = reminderOptions.find(o => o.id === id);
            return { type: id, minutes_before: option?.minutes || 60 };
          }),
          method: reminders.reminderMethod
        },
        notes: ''
      };

      // In production, this would call the actual API
      // const response = await fetch(`${API_URL}/api/healthtrack/appointments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(appointmentData)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep(4);
      onBookingComplete?.({
        ...appointmentData,
        id: `apt_${Date.now()}`,
        status: 'confirmed',
        doctor
      });
      
    } catch (err) {
      setError(err.message || 'Failed to book appointment');
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
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }
    
    // Days of month
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
          className={`
            p-2 rounded-lg text-sm font-medium transition-all
            ${isSelected ? 'bg-orange-500 text-white' : ''}
            ${isToday && !isSelected ? 'bg-orange-100 text-orange-600' : ''}
            ${selectable && !isSelected ? 'hover:bg-gray-100 text-gray-900' : ''}
            ${!selectable ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
          `}
          data-testid={`calendar-day-${day}`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
        <h2 className="text-xl font-bold">Book Appointment</h2>
        {doctor && (
          <p className="text-orange-100 mt-1">{doctor.name} - {doctor.specialty}</p>
        )}
        
        {/* Progress Steps */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= s ? 'bg-white text-orange-500' : 'bg-orange-400 text-orange-200'
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 4 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-white' : 'bg-orange-400'}`} />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between text-xs mt-2 text-orange-100">
          <span>Date</span>
          <span>Time</span>
          <span>Reminders</span>
          <span>Confirm</span>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Step 1: Date Selection */}
        {step === 1 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Select Date
            </h3>
            
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
            
            {/* Week Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Select Time
              </h3>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                ← Change Date
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {selectedDate?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>

            {/* Consultation Type */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Consultation Type</label>
              <div className="flex gap-3">
                {[
                  { id: 'video', icon: Video, label: 'Video Call' },
                  { id: 'audio', icon: Phone, label: 'Audio Call' },
                  { id: 'in_person', icon: Building2, label: 'In-Person' },
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setConsultationType(type.id)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      consultationType === type.id
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {timeSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTimeSelect(slot)}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
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

        {/* Step 3: Reminder Settings */}
        {step === 3 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                Set Reminders
              </h3>
              <button
                onClick={() => setStep(2)}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                ← Change Time
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                {' at '}
                <span className="font-medium text-gray-900">{selectedTime?.label}</span>
                {' • '}
                <span className="capitalize">{consultationType.replace('_', ' ')}</span>
              </p>
            </div>

            {/* Default Reminders */}
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border cursor-pointer hover:border-orange-300 transition">
                <input
                  type="checkbox"
                  checked={reminders.dayBefore}
                  onChange={() => setReminders(prev => ({ ...prev, dayBefore: !prev.dayBefore }))}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <div>
                  <p className="font-medium text-gray-900">1 Day Before</p>
                  <p className="text-xs text-gray-500">Get reminded the day before your appointment</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border cursor-pointer hover:border-orange-300 transition">
                <input
                  type="checkbox"
                  checked={reminders.threeHoursBefore}
                  onChange={() => setReminders(prev => ({ ...prev, threeHoursBefore: !prev.threeHoursBefore }))}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <div>
                  <p className="font-medium text-gray-900">3 Hours Before</p>
                  <p className="text-xs text-gray-500">Get reminded 3 hours before your appointment</p>
                </div>
              </label>
            </div>

            {/* Custom Reminders */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Add More Reminders (Optional)</p>
              <div className="flex flex-wrap gap-2">
                {reminderOptions.filter(o => o.id !== 'day_before' && o.id !== 'three_hours').map(option => (
                  <button
                    key={option.id}
                    onClick={() => toggleReminder(option.id)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      reminders.customReminders.includes(option.id)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Method */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Reminder Method</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'sms', label: 'SMS' },
                  { id: 'email', label: 'Email' },
                  { id: 'push', label: 'Push' },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setReminders(prev => ({ ...prev, reminderMethod: method.id }))}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      reminders.reminderMethod === method.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
            >
              Continue to Confirmation
            </button>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && !loading && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h3>
            <p className="text-gray-600 mb-6">
              Your appointment has been booked successfully.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium text-gray-900">{doctor?.name || 'Dr. Doctor'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-gray-900">{selectedTime?.label}</span>
                </p>
                <p className="flex items-center gap-2">
                  {consultationType === 'video' && <Video className="w-4 h-4 text-gray-400" />}
                  {consultationType === 'audio' && <Phone className="w-4 h-4 text-gray-400" />}
                  {consultationType === 'in_person' && <Building2 className="w-4 h-4 text-gray-400" />}
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900 capitalize">{consultationType.replace('_', ' ')}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Reminders:</span>
                  <span className="font-medium text-gray-900">
                    {[
                      reminders.dayBefore && '1 day before',
                      reminders.threeHoursBefore && '3 hours before',
                      ...reminders.customReminders.map(id => 
                        reminderOptions.find(o => o.id === id)?.label
                      )
                    ].filter(Boolean).join(', ') || 'None'}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/dashboard/health'}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Confirming your appointment...</p>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 3 && step !== 4 && (
          <div className="mt-6 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}
          </div>
        )}

        {step === 3 && (
          <button
            onClick={handleBookAppointment}
            disabled={loading}
            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            data-testid="confirm-booking-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Confirm Booking
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCalendar;
