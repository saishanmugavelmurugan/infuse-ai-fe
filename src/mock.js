// Mock data for PrimeCore Health AI Platform

export const healthRiskPredictions = [
  {
    id: 1,
    userId: 'USR001',
    userName: 'Rajesh Kumar',
    riskCategory: 'Cardiovascular',
    riskLevel: 'High',
    probability: 87,
    timeframe: '6-9 months',
    recommendations: [
      'Regular cardio exercise 30 mins daily',
      'Reduce sodium intake to 1500mg/day',
      'Schedule ECG and lipid profile test',
      'Ayurvedic: Arjuna bark supplement'
    ],
    aiConfidence: 95,
    lastUpdated: '2025-01-15'
  },
  {
    id: 2,
    userId: 'USR002',
    userName: 'Priya Sharma',
    riskCategory: 'Diabetes',
    riskLevel: 'Medium',
    probability: 62,
    timeframe: '12-18 months',
    recommendations: [
      'Monitor blood glucose levels weekly',
      'Increase fiber intake',
      'Practice yoga and meditation',
      'Ayurvedic: Karela and Jamun juice'
    ],
    aiConfidence: 93,
    lastUpdated: '2025-01-14'
  },
  {
    id: 3,
    userId: 'USR003',
    userName: 'Amit Patel',
    riskCategory: 'Respiratory',
    riskLevel: 'Low',
    probability: 28,
    timeframe: '15-18 months',
    recommendations: [
      'Continue current healthy habits',
      'Practice pranayama breathing exercises',
      'Annual lung function test',
      'Ayurvedic: Tulsi and honey tea'
    ],
    aiConfidence: 91,
    lastUpdated: '2025-01-13'
  }
];

export const abdmRecords = [
  {
    id: 'ABDM001',
    patientName: 'Rajesh Kumar',
    abdmId: 'rajesh.kumar@abdm',
    recordType: 'Lab Report',
    facility: 'Apollo Hospital, Mumbai',
    date: '2025-01-10',
    status: 'Synced'
  },
  {
    id: 'ABDM002',
    patientName: 'Priya Sharma',
    abdmId: 'priya.sharma@abdm',
    recordType: 'Prescription',
    facility: 'Fortis Healthcare, Delhi',
    date: '2025-01-08',
    status: 'Synced'
  }
];

export const ayurvedicRecommendations = [
  {
    dosha: 'Vata',
    condition: 'Anxiety & Stress',
    herbs: ['Ashwagandha', 'Brahmi', 'Jatamansi'],
    lifestyle: 'Warm oil massage, regular sleep schedule',
    diet: 'Warm, cooked foods; avoid cold drinks'
  },
  {
    dosha: 'Pitta',
    condition: 'Acidity & Inflammation',
    herbs: ['Amla', 'Guduchi', 'Shatavari'],
    lifestyle: 'Cool environment, avoid excessive heat',
    diet: 'Cooling foods, fresh fruits, vegetables'
  },
  {
    dosha: 'Kapha',
    condition: 'Weight Management',
    herbs: ['Triphala', 'Guggul', 'Punarnava'],
    lifestyle: 'Regular exercise, early morning wake-up',
    diet: 'Light, warm, spicy foods'
  }
];

export const allopathicRecommendations = [
  {
    id: 1,
    condition: 'Cardiovascular Health',
    riskLevel: 'High',
    medications: [
      { name: 'Aspirin', dosage: '75mg daily', purpose: 'Blood thinner' },
      { name: 'Atorvastatin', dosage: '10mg daily', purpose: 'Cholesterol management' }
    ],
    lifestyle: [
      'Moderate aerobic exercise 150 mins/week',
      'Mediterranean diet',
      'Stress management techniques'
    ],
    diagnosticTests: [
      'Lipid Profile - Every 3 months',
      'ECG - Every 6 months',
      'Echocardiography - Annually'
    ],
    followUp: 'Monthly checkup recommended'
  },
  {
    id: 2,
    condition: 'Diabetes Prevention',
    riskLevel: 'Medium',
    medications: [
      { name: 'Metformin', dosage: '500mg twice daily', purpose: 'Blood sugar control' }
    ],
    lifestyle: [
      'Low glycemic index diet',
      'Daily 30-minute walk',
      'Weight reduction target: 5-7%'
    ],
    diagnosticTests: [
      'HbA1c - Every 3 months',
      'Fasting Blood Sugar - Monthly',
      'Kidney Function Test - Every 6 months'
    ],
    followUp: 'Bi-monthly checkup recommended'
  },
  {
    id: 3,
    condition: 'Respiratory Health',
    riskLevel: 'Low',
    medications: [],
    lifestyle: [
      'Avoid air pollution exposure',
      'Breathing exercises',
      'Maintain healthy weight'
    ],
    diagnosticTests: [
      'Chest X-ray - Annually',
      'Pulmonary Function Test - Annually'
    ],
    followUp: 'Annual checkup sufficient'
  }
];

export const ayurvedicDoctors = [
  {
    id: 1,
    name: 'Dr. Ramesh Sharma',
    qualification: 'BAMS, MD (Ayurveda)',
    specialization: 'Panchakarma & Stress Management',
    experience: '15 years',
    hospital: 'Ayurvedic Wellness Center, Mumbai',
    rating: 4.8,
    consultationFee: 1500,
    availability: 'Mon, Wed, Fri',
    languages: ['Hindi', 'English', 'Marathi'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    name: 'Dr. Priya Nair',
    qualification: 'BAMS, PhD (Ayurveda)',
    specialization: 'Women\'s Health & Dosha Balancing',
    experience: '12 years',
    hospital: 'Kerala Ayurveda Hospital, Delhi',
    rating: 4.9,
    consultationFee: 2000,
    availability: 'Tue, Thu, Sat',
    languages: ['Hindi', 'English', 'Malayalam'],
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    name: 'Dr. Anil Desai',
    qualification: 'BAMS, MD (Kayachikitsa)',
    specialization: 'Digestive Disorders & Detoxification',
    experience: '20 years',
    hospital: 'Patanjali Ayurved, Bangalore',
    rating: 4.7,
    consultationFee: 1800,
    availability: 'Mon, Tue, Thu',
    languages: ['Hindi', 'English', 'Kannada', 'Gujarati'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop'
  }
];

export const allopathicDoctors = [
  {
    id: 1,
    name: 'Dr. Sunita Rao',
    qualification: 'MBBS, MD (Cardiology), FACC',
    specialization: 'Interventional Cardiology',
    experience: '18 years',
    hospital: 'Apollo Hospitals, Mumbai',
    rating: 4.9,
    consultationFee: 2500,
    availability: 'Mon, Wed, Fri',
    languages: ['Hindi', 'English', 'Marathi'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    name: 'Dr. Vikram Singh',
    qualification: 'MBBS, MD (Internal Medicine), DM (Endocrinology)',
    specialization: 'Diabetes & Metabolic Disorders',
    experience: '15 years',
    hospital: 'Fortis Healthcare, Delhi',
    rating: 4.8,
    consultationFee: 2200,
    availability: 'Tue, Thu, Sat',
    languages: ['Hindi', 'English', 'Punjabi'],
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    name: 'Dr. Meera Krishnan',
    qualification: 'MBBS, MD (Pulmonology)',
    specialization: 'Respiratory Medicine',
    experience: '14 years',
    hospital: 'Max Healthcare, Bangalore',
    rating: 4.7,
    consultationFee: 2000,
    availability: 'Mon, Wed, Thu, Sat',
    languages: ['Hindi', 'English', 'Tamil', 'Kannada'],
    image: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop'
  },
  {
    id: 4,
    name: 'Dr. Rajesh Kumar',
    qualification: 'MBBS, MD (General Medicine)',
    specialization: 'Preventive Medicine & Lifestyle Diseases',
    experience: '22 years',
    hospital: 'AIIMS, Delhi',
    rating: 4.9,
    consultationFee: 1800,
    availability: 'Tue, Wed, Fri',
    languages: ['Hindi', 'English'],
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop'
  }
];

export const corporateWellnessStats = [
  {
    company: 'TechCorp India',
    employees: 2500,
    riskReductionRate: 68,
    avgHealthScore: 82,
    programDuration: '12 months'
  },
  {
    company: 'InfoSystems Ltd',
    employees: 1800,
    riskReductionRate: 72,
    avgHealthScore: 85,
    programDuration: '18 months'
  },
  {
    company: 'FinanceHub Corp',
    employees: 3200,
    riskReductionRate: 65,
    avgHealthScore: 79,
    programDuration: '9 months'
  }
];

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
];

export const features = [
  {
    id: 1,
    title: 'AI-Powered Risk Prediction',
    description: '95%+ accuracy in predicting health risks 6-18 months in advance using advanced machine learning',
    icon: 'Brain',
    stats: '95% Accuracy'
  },
  {
    id: 2,
    title: 'ABDM Integration',
    description: 'Seamless integration with Ayushman Bharat Digital Mission for unified health records',
    icon: 'Database',
    stats: 'Full Compatibility'
  },
  {
    id: 3,
    title: 'Ayurvedic Integration',
    description: 'Combines modern medicine with traditional Indian wellness practices for holistic care',
    icon: 'Leaf',
    stats: '3000+ Remedies'
  },
  {
    id: 4,
    title: 'Multi-Language Support',
    description: 'Available in Hindi, Bengali, Tamil, Telugu, Gujarati, and Marathi',
    icon: 'Languages',
    stats: '7 Languages'
  },
  {
    id: 5,
    title: 'Corporate Wellness',
    description: 'B2B solutions for employee health management with detailed analytics',
    icon: 'Building2',
    stats: '500+ Companies'
  }
];

export const testimonials = [
  {
    name: 'Dr. Sunita Rao',
    role: 'Chief Medical Officer, Apollo Hospitals',
    content: 'PrimeCore has revolutionized preventive healthcare. The AI predictions are remarkably accurate.',
    rating: 5
  },
  {
    name: 'Vikram Singh',
    role: 'HR Director, TechCorp India',
    content: 'Our employee wellness scores improved by 68% in just 12 months with PrimeCore.',
    rating: 5
  },
  {
    name: 'Meera Krishnan',
    role: 'Ayurvedic Practitioner',
    content: 'The integration of Ayurveda with modern AI is brilliant. Best of both worlds.',
    rating: 5
  }
];

export const pricingPlans = [
  {
    name: 'Individual',
    price: '₹499',
    period: 'per month',
    features: [
      'AI Health Risk Predictions',
      'ABDM Integration',
      'Ayurvedic Recommendations',
      'Multi-language Support',
      '24/7 Chat Support'
    ],
    popular: false
  },
  {
    name: 'Family',
    price: '₹1,499',
    period: 'per month',
    features: [
      'Up to 5 family members',
      'All Individual features',
      'Family health dashboard',
      'Priority support',
      'Quarterly health reports'
    ],
    popular: true
  },
  {
    name: 'Corporate',
    price: 'Custom',
    period: 'contact us',
    features: [
      'Unlimited employees',
      'All Family features',
      'Advanced analytics dashboard',
      'Dedicated account manager',
      'Custom integrations',
      'API access'
    ],
    popular: false
  }
];