import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import {
  Brain,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileText,
  Leaf,
  BarChart3,
  Users,
  Home as HomeIcon,
  Stethoscope,
  Star,
  MapPin,
  Clock,
  Phone,
  Video,
  Pill
} from 'lucide-react';
import {
  healthRiskPredictions,
  abdmRecords,
  ayurvedicRecommendations,
  allopathicRecommendations,
  ayurvedicDoctors,
  allopathicDoctors,
  corporateWellnessStats,
  languages
} from '../mock';

const Dashboard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const getRiskColor = (level) => {
    switch (level) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={process.env.REACT_APP_LOGO_URL} 
                alt="PrimeCore Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                PrimeCore
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
              <Button variant="outline">Profile</Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Dashboard</h1>
          <p className="text-gray-600">AI-powered insights for your health journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Health Score</CardTitle>
              <Activity className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">82/100</div>
              <p className="text-xs text-gray-600 mt-1">Good health overall</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Predictions</CardTitle>
              <Brain className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">3</div>
              <p className="text-xs text-gray-600 mt-1">AI risk assessments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">ABDM Records</CardTitle>
              <FileText className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">12</div>
              <p className="text-xs text-gray-600 mt-1">Synced documents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Confidence</CardTitle>
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">95%</div>
              <p className="text-xs text-gray-600 mt-1">Prediction accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="predictions">Risk Predictions</TabsTrigger>
            <TabsTrigger value="abdm">ABDM Records</TabsTrigger>
            <TabsTrigger value="ayurvedic">Ayurvedic</TabsTrigger>
            <TabsTrigger value="allopathic">Allopathic</TabsTrigger>
            <TabsTrigger value="doctors">Find Doctors</TabsTrigger>
            <TabsTrigger value="corporate">Corporate</TabsTrigger>
          </TabsList>

          {/* Risk Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Health Risk Predictions
                </CardTitle>
                <CardDescription>
                  Advanced AI analysis predicting potential health risks 6-18 months in advance
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {healthRiskPredictions.map((prediction) => (
                <Card key={prediction.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl">{prediction.riskCategory}</CardTitle>
                          <Badge className={getRiskColor(prediction.riskLevel)}>
                            {prediction.riskLevel} Risk
                          </Badge>
                        </div>
                        <CardDescription>Patient: {prediction.userName}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{prediction.probability}%</div>
                        <div className="text-sm text-gray-600">Risk Probability</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">AI Confidence</span>
                        <span className="text-sm font-bold text-blue-600">{prediction.aiConfidence}%</span>
                      </div>
                      <Progress value={prediction.aiConfidence} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Predicted timeframe: {prediction.timeframe}</span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Recommended Actions
                      </h4>
                      <ul className="space-y-2">
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">View Details</Button>
                      <Button size="sm" variant="outline" className="flex-1">Book Consultation</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ABDM Records Tab */}
          <TabsContent value="abdm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Ayushman Bharat Digital Mission Records
                </CardTitle>
                <CardDescription>
                  Your health records synced with India's national health stack
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {abdmRecords.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{record.recordType}</div>
                            <div className="text-sm text-gray-600">{record.facility}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 ml-15">
                          ABDM ID: <span className="font-mono">{record.abdmId}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className="bg-green-100 text-green-700">{record.status}</Badge>
                        <div className="text-sm text-gray-600">{record.date}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-dashed border-2">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Connect More Records</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Link additional health records from your ABDM account
                  </p>
                  <Button>Connect ABDM</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ayurvedic Care Tab */}
          <TabsContent value="ayurvedic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Personalized Ayurvedic Recommendations
                </CardTitle>
                <CardDescription>
                  Traditional Indian wellness practices tailored to your constitution
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              {ayurvedicRecommendations.map((rec, index) => (
                <Card key={index} className="border-2 hover:border-green-600 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{rec.dosha} Dosha</CardTitle>
                    <Badge variant="outline" className="w-fit">{rec.condition}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Recommended Herbs</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.herbs.map((herb, i) => (
                          <Badge key={i} className="bg-green-100 text-green-700">
                            {herb}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">Lifestyle</h4>
                      <p className="text-sm text-gray-600">{rec.lifestyle}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">Diet</h4>
                      <p className="text-sm text-gray-600">{rec.diet}</p>
                    </div>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Allopathic Recommendations Tab */}
          <TabsContent value="allopathic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  Allopathic (Modern Medicine) Recommendations
                </CardTitle>
                <CardDescription>
                  Evidence-based medical treatments and lifestyle modifications
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-6">
              {allopathicRecommendations.map((rec) => (
                <Card key={rec.id} className="border-2 hover:border-blue-600 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{rec.condition}</CardTitle>
                            <Badge className={
                              rec.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                              rec.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }>
                              {rec.riskLevel} Priority
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Medications */}
                    {rec.medications.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Pill className="w-4 h-4 text-blue-600" />
                          Prescribed Medications
                        </h4>
                        <div className="space-y-2">
                          {rec.medications.map((med, index) => (
                            <div key={index} className="bg-blue-50 p-3 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-semibold text-blue-900">{med.name}</div>
                                  <div className="text-sm text-blue-700">{med.dosage}</div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {med.purpose}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lifestyle Modifications */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-600" />
                        Lifestyle Modifications
                      </h4>
                      <ul className="space-y-2">
                        {rec.lifestyle.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Diagnostic Tests */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        Recommended Tests
                      </h4>
                      <ul className="space-y-2">
                        {rec.diagnosticTests.map((test, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5 flex-shrink-0" />
                            {test}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Follow-up */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="font-semibold text-gray-900">Follow-up:</span>
                        <span className="text-gray-700">{rec.followUp}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">Book Lab Tests</Button>
                      <Button size="sm" variant="outline" className="flex-1">Consult Doctor</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Find Doctors Tab */}
          <TabsContent value="doctors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  Find Best Doctors - Ayurvedic & Allopathic
                </CardTitle>
                <CardDescription>
                  Connect with top specialists from both traditional and modern medicine
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Allopathic Doctors */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                Allopathic Specialists
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {allopathicDoctors.map((doctor) => (
                  <Card key={doctor.id} className="border-2 hover:border-blue-600 hover:shadow-xl transition-all">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <div>
                            <h4 className="font-bold text-lg text-gray-900">{doctor.name}</h4>
                            <p className="text-sm text-gray-600">{doctor.qualification}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{doctor.rating}</span>
                            <span className="text-sm text-gray-600">({doctor.experience} exp)</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <Badge className="bg-blue-100 text-blue-700 mb-2">
                            {doctor.specialization}
                          </Badge>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{doctor.hospital}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Available: {doctor.availability}</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {doctor.languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee}</span>
                            <span className="text-sm text-gray-600 ml-1">/ session</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Phone className="w-4 h-4 mr-1" />
                            Book Visit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Video className="w-4 h-4 mr-1" />
                            Video Call
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Ayurvedic Doctors */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                Ayurvedic Practitioners
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {ayurvedicDoctors.map((doctor) => (
                  <Card key={doctor.id} className="border-2 hover:border-green-600 hover:shadow-xl transition-all">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <div>
                            <h4 className="font-bold text-lg text-gray-900">{doctor.name}</h4>
                            <p className="text-sm text-gray-600">{doctor.qualification}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{doctor.rating}</span>
                            <span className="text-sm text-gray-600">({doctor.experience} exp)</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <Badge className="bg-green-100 text-green-700 mb-2">
                            {doctor.specialization}
                          </Badge>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{doctor.hospital}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Available: {doctor.availability}</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {doctor.languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee}</span>
                            <span className="text-sm text-gray-600 ml-1">/ session</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <Phone className="w-4 h-4 mr-1" />
                            Book Visit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Video className="w-4 h-4 mr-1" />
                            Video Call
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Corporate Wellness Tab */}
          <TabsContent value="corporate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Corporate Wellness Programs
                </CardTitle>
                <CardDescription>
                  Enterprise health management with comprehensive analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              {corporateWellnessStats.map((stat, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {stat.programDuration}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-4">{stat.company}</CardTitle>
                    <CardDescription>{stat.employees} employees</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Risk Reduction</span>
                        <span className="text-sm font-bold text-green-600">{stat.riskReductionRate}%</span>
                      </div>
                      <Progress value={stat.riskReductionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Avg Health Score</span>
                        <span className="text-sm font-bold text-blue-600">{stat.avgHealthScore}/100</span>
                      </div>
                      <Progress value={stat.avgHealthScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Transform Your Workforce Health
                    </h3>
                    <p className="text-gray-600">
                      Reduce healthcare costs by 40% with AI-powered employee wellness programs
                    </p>
                  </div>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 whitespace-nowrap">
                    Schedule Enterprise Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;