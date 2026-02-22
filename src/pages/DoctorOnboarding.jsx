/**
 * Doctor Self-Onboarding Portal
 * Allows doctors (Allopathic & Ayurvedic) to register and join the network
 * Registration requires admin approval before activation
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, User, Building2, Phone, Mail, FileText, 
  GraduationCap, Globe, CheckCircle, AlertCircle, Loader2,
  ArrowLeft, Upload, MapPin, Clock, Award
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const ALLOPATHIC_SPECIALTIES = [
  "General Medicine", "Cardiology", "Dermatology", "Neurology", "Orthopedics",
  "Pediatrics", "Gynecology", "Psychiatry", "Ophthalmology", "ENT",
  "Gastroenterology", "Pulmonology", "Nephrology", "Oncology", "Endocrinology"
];

const AYURVEDIC_SPECIALTIES = [
  "Panchakarma", "Rasayana Therapy", "Kayachikitsa", "Shalya Tantra",
  "Shalakya Tantra", "Prasuti Tantra", "Kaumarabhritya", "Agada Tantra",
  "Yoga Therapy", "Marma Therapy"
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh"
];

const LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati",
  "Kannada", "Malayalam", "Punjabi", "Urdu", "Odia", "Sanskrit"
];

const DoctorOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredDoctor, setRegisteredDoctor] = useState(null);

  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    type: 'allopathic',
    qualification: '',
    registration_number: '',
    specialty: '',
    experience_years: '',
    
    // Contact
    email: '',
    phone: '',
    
    // Location
    clinic_name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Practice Details
    consultation_fee: '',
    languages: ['English', 'Hindi'],
    consultation_modes: ['video'],
    bio: '',
    
    // Branding (for prescription)
    clinic_logo: '',
    signature: '',
    header_text: '',
    footer_text: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'languages' || name === 'consultation_modes') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(v => v !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Reset specialty when type changes
      if (name === 'type') {
        setFormData(prev => ({ ...prev, specialty: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/doctors/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          qualification: formData.qualification,
          registration_number: formData.registration_number,
          specialty: formData.specialty,
          experience_years: parseInt(formData.experience_years) || 0,
          languages: formData.languages,
          city: formData.city,
          state: formData.state,
          consultation_fee: parseInt(formData.consultation_fee) || 0,
          bio: formData.bio,
          phone: formData.phone,
          email: formData.email,
          // Extended fields for prescription branding
          clinic_name: formData.clinic_name,
          address: formData.address,
          pincode: formData.pincode,
          clinic_logo: formData.clinic_logo,
          signature: formData.signature,
          header_text: formData.header_text,
          footer_text: formData.footer_text,
          consultation_modes: formData.consultation_modes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      setRegisteredDoctor(data);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const specialties = formData.type === 'allopathic' ? ALLOPATHIC_SPECIALTIES : AYURVEDIC_SPECIALTIES;

  // Success Screen
  if (success && registeredDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for registering with Infuse. Your application is pending verification.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-amber-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-amber-700 space-y-2">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5" />
                <span>Our team will verify your credentials within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5" />
                <span>You'll receive an email at <strong>{formData.email}</strong> once approved</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-4 h-4 mt-0.5" />
                <span>After approval, you can start accepting consultations</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">
              <strong>Doctor ID:</strong> {registeredDoctor.doctor_id}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong> <span className="text-amber-600">Pending Verification</span>
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/login/health"
              className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
            >
              Go to HealthTrack Pro Login
            </Link>
            <Link
              to="/"
              className="block w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Back to Home
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Powered by Infuse AI | www.infuse.net.in
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <img src={process.env.REACT_APP_LOGO_URL} alt="Infuse" className="h-8" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full mb-4">
            <Stethoscope className="w-5 h-5" />
            <span className="font-medium">Doctor Onboarding</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Join India's Growing Healthcare Network
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Register as an Allopathic or Ayurvedic practitioner and reach thousands of patients.
            Get verified and start consultations within 48 hours.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= s ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-emerald-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 text-sm text-gray-600 mb-8">
          <span className={step === 1 ? 'text-emerald-600 font-medium' : ''}>Basic Info</span>
          <span className={step === 2 ? 'text-emerald-600 font-medium' : ''}>Practice Details</span>
          <span className={step === 3 ? 'text-emerald-600 font-medium' : ''}>Branding</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Dr. Full Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    data-testid="doctor-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Practice Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    data-testid="doctor-type"
                  >
                    <option value="allopathic">Allopathic (MBBS/MD/MS)</option>
                    <option value="ayurvedic">Ayurvedic (BAMS/MD Ayurveda)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification *</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    placeholder={formData.type === 'allopathic' ? 'MBBS, MD (Specialty)' : 'BAMS, MD (Ayurveda)'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number * ({formData.type === 'allopathic' ? 'NMC/State Medical Council' : 'CCIM'})
                  </label>
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    required
                    placeholder={formData.type === 'allopathic' ? 'DMC-2020-12345' : 'CCIM-2020-12345'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    data-testid="registration-number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty *</label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    data-testid="specialty"
                  >
                    <option value="">Select Specialty</option>
                    {specialties.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    required
                    min="0"
                    max="60"
                    placeholder="e.g., 10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition"
                >
                  Next: Practice Details →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Practice Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Practice Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="doctor@clinic.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    data-testid="doctor-email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinic/Hospital Name</label>
                  <input
                    type="text"
                    name="clinic_name"
                    value={formData.clinic_name}
                    onChange={handleChange}
                    placeholder="e.g., City Care Hospital"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Mumbai"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="e.g., 400001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹) *</label>
                  <input
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="e.g., 500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                  <div className="flex flex-wrap gap-3">
                    {LANGUAGES.map(lang => (
                      <label key={lang} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="languages"
                          value={lang}
                          checked={formData.languages.includes(lang)}
                          onChange={handleChange}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Modes</label>
                  <div className="flex gap-6">
                    {['video', 'audio', 'in_person'].map(mode => (
                      <label key={mode} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="consultation_modes"
                          value={mode}
                          checked={formData.consultation_modes.includes(mode)}
                          onChange={handleChange}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{mode.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description of your practice and expertise..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition"
                >
                  Next: Branding →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Branding (for Prescriptions) */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Prescription Branding
              </h2>
              <p className="text-gray-600 text-sm">
                Customize how your prescriptions will look. This information will appear on all prescriptions you generate.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Logo URL (Optional)</label>
                  <input
                    type="url"
                    name="clinic_logo"
                    value={formData.clinic_logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 200x80 pixels, PNG or JPG</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prescription Header Text</label>
                  <input
                    type="text"
                    name="header_text"
                    value={formData.header_text}
                    onChange={handleChange}
                    placeholder="e.g., Dr. John's Medical Clinic - Excellence in Healthcare"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prescription Footer Text</label>
                  <input
                    type="text"
                    name="footer_text"
                    value={formData.footer_text}
                    onChange={handleChange}
                    placeholder="e.g., Get well soon! For emergencies call: +91-XXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Digital Signature URL (Optional)</label>
                  <input
                    type="url"
                    name="signature"
                    value={formData.signature}
                    onChange={handleChange}
                    placeholder="https://example.com/signature.png"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Transparent PNG recommended for signature</p>
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Prescription Preview</h3>
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="text-center border-b pb-4 mb-4">
                    <p className="font-semibold text-lg">{formData.name || 'Dr. Your Name'}</p>
                    <p className="text-sm text-gray-600">{formData.qualification || 'Qualifications'}</p>
                    <p className="text-sm text-gray-600">{formData.specialty || 'Specialty'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reg. No: {formData.registration_number || 'Registration Number'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>{formData.clinic_name || 'Clinic Name'}</p>
                    <p>{formData.address || 'Clinic Address'}</p>
                    <p>{formData.city || 'City'}, {formData.state || 'State'} - {formData.pincode || 'PIN'}</p>
                    <p>Phone: {formData.phone || '+91-XXXXX-XXXXX'}</p>
                  </div>
                  <div className="text-center text-xs text-gray-400 pt-4 border-t mt-4">
                    <p className="flex items-center justify-center gap-1">
                      Powered by <span className="text-orange-500 font-medium">Infuse</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                  data-testid="submit-registration"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Registration
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by 100+ doctors across India</p>
          <div className="flex items-center justify-center gap-6 text-gray-400">
            <span className="text-xs">NMC Verified</span>
            <span>•</span>
            <span className="text-xs">CCIM Approved</span>
            <span>•</span>
            <span className="text-xs">HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOnboarding;
