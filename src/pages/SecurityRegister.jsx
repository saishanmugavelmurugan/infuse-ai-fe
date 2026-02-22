import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, Lock, Radio, Building2, Smartphone, Car,
  Mail, Phone, User, Globe, Server, AlertCircle, ArrowLeft,
  CheckCircle, Briefcase, MapPin, FileText, Network, Cpu
} from 'lucide-react';

const ROLES = [
  {
    id: 'telco',
    title: 'Telecom / Network Provider',
    description: 'GSM fraud detection, network security & SIM protection',
    icon: Radio,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600'
  },
  {
    id: 'enterprise',
    title: 'Enterprise / Corporate',
    description: 'IT security, threat monitoring & compliance',
    icon: Building2,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600'
  },
  {
    id: 'mobile',
    title: 'Mobile User / Individual',
    description: 'Personal device security & SMS fraud protection',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-600'
  },
  {
    id: 'automotive',
    title: 'Automotive / Fleet',
    description: 'Vehicle security, telematics & fleet protection',
    icon: Car,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-600'
  },
  {
    id: 'white_goods',
    title: 'IoT - Smart Home & White Goods',
    description: 'Connected appliances, smart home devices & automation',
    icon: Cpu,
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-600'
  },
  {
    id: 'cctv',
    title: 'IoT - CCTV & Surveillance',
    description: 'Camera systems, DVR/NVR security & stream protection',
    icon: Server,
    color: 'from-slate-500 to-gray-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-500',
    textColor: 'text-slate-600'
  },
  {
    id: 'healthcare_iot',
    title: 'IoT - Healthcare Devices',
    description: 'Medical IoT, patient monitors & healthcare equipment',
    icon: Network,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-600'
  },
  {
    id: 'industrial_iot',
    title: 'IoT - Industrial & Manufacturing',
    description: 'IIoT, SCADA systems, sensors & industrial automation',
    icon: Globe,
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-600'
  }
];

const SecurityRegister = () => {
  const [step, setStep] = useState(1); // 1 = role selection, 2 = form
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    jobTitle: '',
    // Telco-specific
    networkType: '',
    subscriberCount: '',
    licenseNumber: '',
    // Enterprise-specific
    companySize: '',
    industry: '',
    securityNeeds: [],
    itContactEmail: '',
    // Mobile User-specific
    deviceType: '',
    operatingSystem: '',
    // Automotive-specific
    fleetSize: '',
    vehicleTypes: '',
    telematicsProvider: '',
    // IoT - White Goods specific
    deviceCount: '',
    deviceCategories: [],
    smartHomeProtocol: '',
    // IoT - CCTV specific
    cameraCount: '',
    storageType: '',
    streamingProtocol: '',
    // IoT - Healthcare specific
    healthDeviceTypes: [],
    complianceNeeds: [],
    patientDataHandling: '',
    // IoT - Industrial specific
    scadaSystems: '',
    sensorCount: '',
    industrialProtocols: [],
    // Common
    country: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentNeeds = formData.securityNeeds || [];
      if (checked) {
        setFormData({ ...formData, securityNeeds: [...currentNeeds, value] });
      } else {
        setFormData({ ...formData, securityNeeds: currentNeeds.filter(n => n !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedRole(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Backend only accepts: user, doctor, admin
    const backendRole = selectedRole === 'enterprise' ? 'admin' : 
                        selectedRole === 'telco' ? 'admin' :
                        selectedRole === 'automotive' ? 'admin' :
                        selectedRole === 'white_goods' ? 'admin' :
                        selectedRole === 'cctv' ? 'admin' :
                        selectedRole === 'healthcare_iot' ? 'admin' :
                        selectedRole === 'industrial_iot' ? 'admin' : 'user';

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: backendRole,
      phone: formData.phone,
      user_type: selectedRole,
      platform: 'securesphere',
      ...formData
    });
    
    if (result.success) {
      navigate('/securesphere');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const getRoleInfo = () => ROLES.find(r => r.id === selectedRole);

  // Render role-specific fields
  const renderRoleFields = () => {
    switch (selectedRole) {
      case 'telco':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company / Operator Name *
              </label>
              <div className="relative">
                <Radio className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Telecom Operator Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network Type *
                </label>
                <select
                  name="networkType"
                  value={formData.networkType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Network Type</option>
                  <option value="gsm">GSM</option>
                  <option value="lte">LTE/4G</option>
                  <option value="5g">5G</option>
                  <option value="mvno">MVNO</option>
                  <option value="mixed">Mixed Network</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscriber Base
                </label>
                <select
                  name="subscriberCount"
                  value={formData.subscriberCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Range</option>
                  <option value="small">Under 100K</option>
                  <option value="medium">100K - 1M</option>
                  <option value="large">1M - 10M</option>
                  <option value="enterprise">10M+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telecom License Number
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="DOT/TRAI License Number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          </>
        );

      case 'enterprise':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Your Company Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Role / Title *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    placeholder="e.g., CISO, IT Manager"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size *
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Size</option>
                  <option value="1-50">1-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1001-5000">1001-5000 employees</option>
                  <option value="5000+">5000+ employees</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Select Industry</option>
                <option value="finance">Banking & Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="technology">Technology</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail & E-commerce</option>
                <option value="government">Government</option>
                <option value="telecom">Telecommunications</option>
                <option value="energy">Energy & Utilities</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Needs (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Threat Detection', 'Network Security', 'Endpoint Protection', 'Compliance', 'Incident Response', 'Security Training'].map((need) => (
                  <label key={need} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="securityNeeds"
                      value={need}
                      checked={formData.securityNeeds?.includes(need)}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    {need}
                  </label>
                ))}
              </div>
            </div>
          </>
        );

      case 'mobile':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Type
                </label>
                <select
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Device</option>
                  <option value="smartphone">Smartphone</option>
                  <option value="tablet">Tablet</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operating System
                </label>
                <select
                  name="operatingSystem"
                  value={formData.operatingSystem}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select OS</option>
                  <option value="android">Android</option>
                  <option value="ios">iOS</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">What you'll get:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ SMS Fraud Detection & Alerts</li>
                <li>✓ Malicious URL Scanner</li>
                <li>✓ Personal Threat Dashboard</li>
                <li>✓ Security Recommendations</li>
              </ul>
            </div>
          </>
        );

      case 'automotive':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company / Fleet Name *
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Fleet / Company Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fleet Size *
                </label>
                <select
                  name="fleetSize"
                  value={formData.fleetSize}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Fleet Size</option>
                  <option value="1-10">1-10 vehicles</option>
                  <option value="11-50">11-50 vehicles</option>
                  <option value="51-200">51-200 vehicles</option>
                  <option value="201-1000">201-1000 vehicles</option>
                  <option value="1000+">1000+ vehicles</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Types
                </label>
                <select
                  name="vehicleTypes"
                  value={formData.vehicleTypes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Type</option>
                  <option value="passenger">Passenger Cars</option>
                  <option value="commercial">Commercial Vehicles</option>
                  <option value="trucks">Trucks & Heavy</option>
                  <option value="mixed">Mixed Fleet</option>
                  <option value="ev">Electric Vehicles</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Telematics Provider
              </label>
              <div className="relative">
                <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="telematicsProvider"
                  value={formData.telematicsProvider}
                  onChange={handleChange}
                  placeholder="e.g., Geotab, Samsara, None"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          </>
        );

      case 'white_goods':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company / Home Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Smart Home / Company Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Devices *
                </label>
                <select
                  name="deviceCount"
                  value={formData.deviceCount}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="">Select Range</option>
                  <option value="1-10">1-10 devices</option>
                  <option value="11-50">11-50 devices</option>
                  <option value="51-200">51-200 devices</option>
                  <option value="201-1000">201-1000 devices</option>
                  <option value="1000+">1000+ devices</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Smart Home Protocol
                </label>
                <select
                  name="smartHomeProtocol"
                  value={formData.smartHomeProtocol}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="">Select Protocol</option>
                  <option value="zigbee">Zigbee</option>
                  <option value="zwave">Z-Wave</option>
                  <option value="wifi">WiFi</option>
                  <option value="matter">Matter</option>
                  <option value="bluetooth">Bluetooth/BLE</option>
                  <option value="mixed">Mixed Protocols</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Categories (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Smart TVs', 'Refrigerators', 'Washing Machines', 'Air Conditioners', 'Smart Speakers', 'Thermostats', 'Smart Locks', 'Lighting'].map((cat) => (
                  <label key={cat} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-cyan-50 cursor-pointer">
                    <input type="checkbox" className="rounded text-cyan-600" />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        );

      case 'cctv':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company / Property Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Company / Property Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Cameras *
                </label>
                <select
                  name="cameraCount"
                  value={formData.cameraCount}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="">Select Range</option>
                  <option value="1-10">1-10 cameras</option>
                  <option value="11-50">11-50 cameras</option>
                  <option value="51-100">51-100 cameras</option>
                  <option value="101-500">101-500 cameras</option>
                  <option value="500+">500+ cameras</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Type
                </label>
                <select
                  name="storageType"
                  value={formData.storageType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="">Select Type</option>
                  <option value="nvr">NVR (Network)</option>
                  <option value="dvr">DVR (Digital)</option>
                  <option value="cloud">Cloud Storage</option>
                  <option value="hybrid">Hybrid (Local + Cloud)</option>
                  <option value="edge">Edge Storage</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Streaming Protocol
              </label>
              <select
                name="streamingProtocol"
                value={formData.streamingProtocol}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="">Select Protocol</option>
                <option value="rtsp">RTSP</option>
                <option value="onvif">ONVIF</option>
                <option value="http">HTTP/HTTPS</option>
                <option value="webrtc">WebRTC</option>
                <option value="proprietary">Proprietary</option>
              </select>
            </div>
          </>
        );

      case 'healthcare_iot':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Healthcare Organization *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Hospital / Clinic Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Device Types (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Patient Monitors', 'Infusion Pumps', 'Ventilators', 'Imaging Systems', 'Wearable Devices', 'Remote Patient Monitors', 'Diagnostic Equipment', 'Surgical Robots'].map((type) => (
                  <label key={type} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-rose-50 cursor-pointer">
                    <input type="checkbox" className="rounded text-rose-600" />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compliance Requirements
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['HIPAA', 'FDA 21 CFR Part 11', 'IEC 62443', 'GDPR', 'ISO 27001', 'NABH (India)'].map((comp) => (
                  <label key={comp} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-rose-50 cursor-pointer">
                    <input type="checkbox" className="rounded text-rose-600" />
                    <span className="text-sm">{comp}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Data Handling
              </label>
              <select
                name="patientDataHandling"
                value={formData.patientDataHandling}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="">Select Approach</option>
                <option value="on_premise">On-Premise Only</option>
                <option value="private_cloud">Private Cloud</option>
                <option value="hybrid">Hybrid</option>
                <option value="encrypted_cloud">Encrypted Public Cloud</option>
              </select>
            </div>
          </>
        );

      case 'industrial_iot':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company / Facility Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Manufacturing Plant / Facility Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SCADA/ICS Systems
                </label>
                <select
                  name="scadaSystems"
                  value={formData.scadaSystems}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">Select Status</option>
                  <option value="yes_legacy">Yes - Legacy Systems</option>
                  <option value="yes_modern">Yes - Modern ICS</option>
                  <option value="planning">Planning to Implement</option>
                  <option value="no">No SCADA/ICS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Sensors/PLCs
                </label>
                <select
                  name="sensorCount"
                  value={formData.sensorCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">Select Range</option>
                  <option value="1-50">1-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-1000">201-1000</option>
                  <option value="1001-5000">1001-5000</option>
                  <option value="5000+">5000+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industrial Protocols Used
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Modbus', 'OPC-UA', 'MQTT', 'EtherNet/IP', 'PROFINET', 'BACnet', 'DNP3', 'CANbus'].map((protocol) => (
                  <label key={protocol} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-yellow-50 cursor-pointer">
                    <input type="checkbox" className="rounded text-yellow-600" />
                    <span className="text-sm">{protocol}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Messaging */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-amber-700 to-orange-800 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <div className="mb-8">
            <Shield className="w-16 h-16 mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Get Started with SecureSphere
            </h1>
            <p className="text-xl text-amber-100">
              Enterprise-grade security platform for modern threats
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">14-Day Free Trial</h3>
                <p className="text-amber-100">
                  Full access to all features, no credit card required
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Multi-Platform Support</h3>
                <p className="text-amber-100">
                  Telco, Enterprise, Mobile & Automotive security
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">AI-Powered Detection</h3>
                <p className="text-amber-100">
                  Advanced threat intelligence with real-time analysis
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm text-amber-100">
              Trusted by 200+ enterprises worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white py-8">
        <div className="max-w-lg w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center">
              <img 
                src={process.env.REACT_APP_LOGO_URL} 
                alt="Infuse-AI Logo" 
                className="h-14 w-auto object-contain"
              />
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Join SecureSphere
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {step === 1 ? 'Select your security profile' : `Register as ${getRoleInfo()?.title}`}
            </p>
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-4">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all hover:shadow-md ${
                    selectedRole === role.id 
                      ? `${role.borderColor} ${role.bgColor}` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${role.color}`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-900">{role.title}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                  <CheckCircle className={`w-5 h-5 ${selectedRole === role.id ? role.textColor : 'text-gray-300'}`} />
                </button>
              ))}

              <div className="pt-4 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login/security" className="font-medium text-amber-600 hover:text-amber-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Registration Form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Change profile type
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Common Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Role-specific Fields */}
              {renderRoleFields()}

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select Country</option>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AE">UAE</option>
                    <option value="SG">Singapore</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-amber-600 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-amber-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                {loading ? 'Creating Account...' : 'Start Free Trial'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login/security" className="font-medium text-amber-600 hover:text-amber-500">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityRegister;
