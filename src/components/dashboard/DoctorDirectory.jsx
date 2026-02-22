import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Star, Search, Filter, Stethoscope, Leaf, MapPin, Clock,
  Phone, Video, Calendar, ChevronRight, Award, BadgeCheck,
  ThumbsUp, MessageSquare, X, User, Loader2
} from 'lucide-react';
import { API_URL } from '../../config/api';

const DoctorDirectory = ({ userRole = 'patient' }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [stats, setStats] = useState({ allopathic: 0, ayurvedic: 0 });
  const [specialties, setSpecialties] = useState({ allopathic: [], ayurvedic: [] });
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch doctors from API
  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, [selectedType, selectedSpecialty, searchQuery]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('doctor_type', selectedType);
      if (selectedSpecialty !== 'all') params.append('specialty', selectedSpecialty);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`${API_URL}/api/doctors/?${params.toString()}`);
      const data = await response.json();
      setDoctors(data.doctors || []);
      setStats({
        allopathic: data.allopathic_count || 0,
        ayurvedic: data.ayurvedic_count || 0
      });
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await fetch(`${API_URL}/api/doctors/specialties`);
      const data = await response.json();
      setSpecialties(data || { allopathic: [], ayurvedic: [] });
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const handleRateDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setUserRating(0);
    setUserReview('');
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (userRating === 0 || !selectedDoctor) return;
    
    setSubmittingRating(true);
    try {
      await fetch(`${API_URL}/api/doctors/${selectedDoctor.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: userRating,
          review: userReview
        })
      });

      // Refresh doctor list
      await fetchDoctors();
      setShowRatingModal(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderStars = (rating, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${size} ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const renderInteractiveStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => setUserRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || userRating) 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E55A00]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Find a Doctor</h2>
          <p className="text-gray-600">Browse verified Allopathic and Ayurvedic doctors</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search doctors by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedSpecialty('all');
                }}
                className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E55A00]"
              >
                <option value="all">All Types</option>
                <option value="allopathic">Allopathic</option>
                <option value="ayurvedic">Ayurvedic</option>
              </select>

              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E55A00]"
              >
                <option value="all">All Specialties</option>
                {selectedType === 'all' ? (
                  <>
                    <optgroup label="Allopathic">
                      {specialties.allopathic.map(s => <option key={s} value={s}>{s}</option>)}
                    </optgroup>
                    <optgroup label="Ayurvedic">
                      {specialties.ayurvedic.map(s => <option key={s} value={s}>{s}</option>)}
                    </optgroup>
                  </>
                ) : (
                  specialties[selectedType]?.map(s => <option key={s} value={s}>{s}</option>)
                )}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Type Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className={`cursor-pointer transition-all ${selectedType === 'allopathic' ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedType(selectedType === 'allopathic' ? 'all' : 'allopathic')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.allopathic}
              </p>
              <p className="text-sm text-gray-600">Allopathic Doctors</p>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${selectedType === 'ayurvedic' ? 'ring-2 ring-green-500' : ''}`}
              onClick={() => setSelectedType(selectedType === 'ayurvedic' ? 'all' : 'ayurvedic')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.ayurvedic}
              </p>
              <p className="text-sm text-gray-600">Ayurvedic Doctors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctor List */}
      <div className="grid gap-4">
        {doctors.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No doctors found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          doctors.map(doctor => (
            <Card key={doctor.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Doctor Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        doctor.type === 'allopathic' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-br from-green-500 to-green-600'
                      }`}>
                        {doctor.type === 'allopathic' 
                          ? <Stethoscope className="w-8 h-8 text-white" />
                          : <Leaf className="w-8 h-8 text-white" />
                        }
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                          {doctor.verified && (
                            <BadgeCheck className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{doctor.qualification}</p>
                        <p className="text-sm font-medium text-[#E55A00]">{doctor.specialty}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {doctor.experience_years ? `${doctor.experience_years} years` : doctor.experience || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {doctor.location?.city ? `${doctor.location.city}, ${doctor.location.country}` : doctor.location || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        {renderStars(doctor.rating || 0)}
                        <span className="font-bold text-gray-900">{doctor.rating || 'N/A'}</span>
                        <span className="text-sm text-gray-500">({doctor.total_ratings || 0} reviews)</span>
                      </div>
                      
                      {userRole === 'patient' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRateDoctor(doctor)}
                          className="text-[#E55A00] border-[#E55A00] hover:bg-[#E55A00] hover:text-white"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate
                        </Button>
                      )}
                    </div>

                    {/* Languages */}
                    {doctor.languages && doctor.languages.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs text-gray-500">Languages: {doctor.languages.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Booking Section */}
                  <div className="lg:w-64 space-y-3">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                      <p className="text-2xl font-bold text-gray-900">₹{doctor.consultation_fee || doctor.consultationFee || 'N/A'}</p>
                    </div>

                    <div className={`flex items-center gap-2 justify-center text-sm ${
                      doctor.available ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      <Clock className="w-4 h-4" />
                      <span>{doctor.next_available_slot || doctor.nextSlot || 'Contact for availability'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-center gap-1"
                      >
                        <Video className="w-4 h-4" />
                        Video
                      </Button>
                      <Button 
                        className="flex items-center justify-center gap-1 bg-[#E55A00] hover:bg-[#C64700]"
                      >
                        <Calendar className="w-4 h-4" />
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Rate {selectedDoctor.name}</CardTitle>
              <button onClick={() => setShowRatingModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">How was your consultation experience?</p>
                {renderInteractiveStars()}
                {userRating > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {userRating === 5 && 'Excellent!'}
                    {userRating === 4 && 'Very Good'}
                    {userRating === 3 && 'Good'}
                    {userRating === 2 && 'Fair'}
                    {userRating === 1 && 'Poor'}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Write a review (optional)
                </label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Share your experience with this doctor..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E55A00] min-h-[100px]"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRatingModal(false)}
                  disabled={submittingRating}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#E55A00] hover:bg-[#C64700]"
                  onClick={submitRating}
                  disabled={userRating === 0 || submittingRating}
                >
                  {submittingRating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Rating'
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500">
                Your review will be verified before publishing. Only patients who have consulted can review.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DoctorDirectory;
