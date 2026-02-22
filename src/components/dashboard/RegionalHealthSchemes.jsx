import React, { useState, useEffect } from 'react';
import { Globe, Shield, FileText, ChevronRight, Check, AlertCircle, Plus, Search, MapPin, Building2, Heart, Loader2, ExternalLink } from 'lucide-react';
import { healthSchemesApi, detectUserCountry } from '../../services/healthSchemesApi';
import { useLanguage } from '../../contexts/LanguageContext';

const RegionalHealthSchemes = () => {
  const { t } = useLanguage();
  const [userCountry, setUserCountry] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [supportedRegions, setSupportedRegions] = useState([]);
  const [manualCountry, setManualCountry] = useState('');
  const [submission, setSubmission] = useState({
    country_code: '',
    country_name: '',
    scheme_name: '',
    description: '',
    coverage_details: '',
    personal_experience: '',
    rating: 3
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Detect user's country
      const country = await detectUserCountry();
      setUserCountry(country);
      
      // Load supported regions
      const regionsData = await healthSchemesApi.getRegions();
      setSupportedRegions(regionsData.regions || []);
      
      // Load schemes for user's country
      if (country?.country_code) {
        const schemesData = await healthSchemesApi.getSchemesByRegion(country.country_code);
        setSchemes(schemesData.schemes || []);
      }
    } catch (error) {
      console.error('Failed to load health schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = async (countryCode) => {
    try {
      setLoading(true);
      const region = supportedRegions.find(r => r.country_code === countryCode);
      setUserCountry({
        country_code: countryCode,
        country_name: region?.country_name || countryCode
      });
      const schemesData = await healthSchemesApi.getSchemesByRegion(countryCode);
      setSchemes(schemesData.schemes || []);
    } catch (error) {
      console.error('Failed to load schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitScheme = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await healthSchemesApi.submitScheme(submission);
      setSubmitSuccess(true);
      setShowSubmitForm(false);
      setSubmission({
        country_code: '',
        country_name: '',
        scheme_name: '',
        description: '',
        coverage_details: '',
        personal_experience: '',
        rating: 3
      });
    } catch (error) {
      console.error('Failed to submit scheme:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isIndia = userCountry?.country_code === 'IN';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Detecting your region...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Country Detection */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Regional Health Schemes
            </h2>
            <p className="mt-1 text-blue-100">
              {userCountry?.country_name 
                ? `Showing health schemes for ${userCountry.country_name}`
                : 'Select your region to view available health schemes'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={userCountry?.country_code || ''}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="bg-white/20 text-white rounded-lg px-4 py-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="" className="text-gray-800">Select Country</option>
              {supportedRegions.map(region => (
                <option key={region.country_code} value={region.country_code} className="text-gray-800">
                  {region.country_name} ({region.schemes_count} schemes)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ABDM Integration Banner for India */}
      {isIndia && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">Ayushman Bharat Digital Mission (ABDM)</h3>
              <p className="mt-1 text-orange-100">
                As an Indian citizen, you have access to India's national digital health ecosystem.
                Link your ABHA ID to access unified health records and scheme benefits.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="/login/health" className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors">
                  Access ABDM Dashboard
                </a>
                <a href="https://healthid.ndhm.gov.in/" target="_blank" rel="noopener noreferrer" 
                   className="border border-white/50 px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                  Create ABHA ID <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-green-600" />
          <p className="text-green-800">Thank you! Your health scheme information has been submitted for review.</p>
        </div>
      )}

      {/* Schemes List */}
      {schemes.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      scheme.scheme_type === 'government' ? 'bg-blue-100 text-blue-700' :
                      scheme.scheme_type === 'hybrid' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {scheme.scheme_type?.charAt(0).toUpperCase() + scheme.scheme_type?.slice(1)}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">{scheme.name}</h3>
                    <p className="text-sm text-gray-500">{scheme.country_name}</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                
                <p className="mt-4 text-gray-600 text-sm line-clamp-3">{scheme.description}</p>
                
                {scheme.coverage_details && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-gray-600">Coverage Type:</span>
                      <span className="font-medium text-gray-900">{scheme.coverage_type}</span>
                    </div>
                    {scheme.coverage_details.annual_limit && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Annual Limit:</span>
                        <span className="font-medium text-green-600">
                          {scheme.coverage_details.currency} {scheme.coverage_details.annual_limit?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {scheme.benefits && scheme.benefits.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {scheme.benefits.slice(0, 3).map((benefit, idx) => (
                        <span key={idx} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                          {benefit.length > 30 ? benefit.substring(0, 30) + '...' : benefit}
                        </span>
                      ))}
                      {scheme.benefits.length > 3 && (
                        <span className="text-xs text-gray-500">+{scheme.benefits.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <button
                    onClick={() => setSelectedScheme(scheme)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                  >
                    View Details <ChevronRight className="h-4 w-4" />
                  </button>
                  {scheme.official_website && (
                    <a 
                      href={scheme.official_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                    >
                      Official Site <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Health Schemes Found</h3>
          <p className="mt-2 text-gray-600">
            We don't have health scheme information for {userCountry?.country_name || 'your region'} yet.
            Help us by submitting information about your country's health schemes.
          </p>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="h-4 w-4" /> Submit Health Scheme
          </button>
        </div>
      )}

      {/* Submit Form for Unknown Countries */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Submit Health Scheme Information</h3>
              <p className="mt-1 text-sm text-gray-500">Help us build a global database of health schemes</p>
              
              <form onSubmit={handleSubmitScheme} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                    <input
                      type="text"
                      required
                      maxLength={3}
                      placeholder="e.g., US, GB, CA"
                      value={submission.country_code}
                      onChange={(e) => setSubmission({...submission, country_code: e.target.value.toUpperCase()})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., United States"
                      value={submission.country_name}
                      onChange={(e) => setSubmission({...submission, country_name: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., National Health Insurance"
                    value={submission.scheme_name}
                    onChange={(e) => setSubmission({...submission, scheme_name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Brief description of the health scheme..."
                    value={submission.description}
                    onChange={(e) => setSubmission({...submission, description: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Details</label>
                  <textarea
                    rows={2}
                    placeholder="What does it cover? (hospitals, medications, etc.)"
                    value={submission.coverage_details}
                    onChange={(e) => setSubmission({...submission, coverage_details: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Experience (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Share your personal experience with this scheme..."
                    value={submission.personal_experience}
                    onChange={(e) => setSubmission({...submission, personal_experience: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSubmission({...submission, rating: num})}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          submission.rating === num 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSubmitForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    selectedScheme.scheme_type === 'government' ? 'bg-blue-100 text-blue-700' :
                    selectedScheme.scheme_type === 'hybrid' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedScheme.scheme_type?.charAt(0).toUpperCase() + selectedScheme.scheme_type?.slice(1)}
                  </span>
                  <h2 className="mt-2 text-xl font-bold text-gray-900">{selectedScheme.name}</h2>
                  <p className="text-gray-500">{selectedScheme.country_name}</p>
                </div>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p className="mt-1 text-gray-600">{selectedScheme.description}</p>
                </div>
                
                {selectedScheme.eligibility_criteria && (
                  <div>
                    <h3 className="font-medium text-gray-900">Eligibility Criteria</h3>
                    <p className="mt-1 text-gray-600">{selectedScheme.eligibility_criteria}</p>
                  </div>
                )}
                
                {selectedScheme.enrollment_process && (
                  <div>
                    <h3 className="font-medium text-gray-900">Enrollment Process</h3>
                    <p className="mt-1 text-gray-600">{selectedScheme.enrollment_process}</p>
                  </div>
                )}
                
                {selectedScheme.benefits && selectedScheme.benefits.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900">Benefits</h3>
                    <ul className="mt-2 space-y-2">
                      {selectedScheme.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedScheme.limitations && selectedScheme.limitations.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900">Limitations</h3>
                    <ul className="mt-2 space-y-2">
                      {selectedScheme.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedScheme.contact_info && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                    {selectedScheme.contact_info.helpline && (
                      <p className="text-sm text-gray-600">Helpline: {selectedScheme.contact_info.helpline}</p>
                    )}
                    {selectedScheme.contact_info.email && (
                      <p className="text-sm text-gray-600">Email: {selectedScheme.contact_info.email}</p>
                    )}
                  </div>
                )}
                
                {selectedScheme.official_website && (
                  <a 
                    href={selectedScheme.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Visit Official Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Scheme Button */}
      {schemes.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setShowSubmitForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mx-auto"
          >
            <Plus className="h-4 w-4" /> Submit Another Health Scheme
          </button>
        </div>
      )}
    </div>
  );
};

export default RegionalHealthSchemes;
