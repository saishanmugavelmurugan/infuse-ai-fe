// Mock data for Infuse-ai Multi-Product Platform

// Product 1: Health Tracking
export const healthUsers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    age: 45,
    healthScore: 78,
    lastCheckup: '2025-01-10',
    primaryDoctor: 'Dr. Sunita Rao',
    activeConditions: ['Hypertension', 'Pre-diabetes'],
    recordsCount: 24
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    age: 32,
    healthScore: 92,
    lastCheckup: '2025-01-15',
    primaryDoctor: 'Dr. Meera Krishnan',
    activeConditions: [],
    recordsCount: 12
  }
];

export const enrolledDoctors = [
  {
    id: 1,
    name: 'Dr. Sunita Rao',
    specialization: 'Cardiology',
    country: 'India',
    patientsCount: 156,
    rating: 4.9,
    revenue: 450000,
    joinDate: '2024-03-15'
  },
  {
    id: 2,
    name: 'Dr. John Smith',
    specialization: 'General Medicine',
    country: 'USA',
    patientsCount: 203,
    rating: 4.8,
    revenue: 680000,
    joinDate: '2024-01-20'
  },
  {
    id: 3,
    name: 'Dr. Meera Krishnan',
    specialization: 'Pulmonology',
    country: 'India',
    patientsCount: 124,
    rating: 4.7,
    revenue: 380000,
    joinDate: '2024-06-10'
  }
];

export const billingRecords = [
  {
    id: 1,
    patientName: 'Rajesh Kumar',
    doctorName: 'Dr. Sunita Rao',
    amount: 2500,
    date: '2025-01-15',
    status: 'Paid',
    services: ['Consultation', 'ECG', 'Blood Test']
  },
  {
    id: 2,
    patientName: 'Priya Sharma',
    doctorName: 'Dr. Meera Krishnan',
    amount: 1800,
    date: '2025-01-14',
    status: 'Pending',
    services: ['Consultation', 'X-Ray']
  }
];

export const medicineInventory = [
  {
    id: 1,
    name: 'Aspirin 75mg',
    category: 'Cardiovascular',
    stock: 5000,
    price: 150,
    expiryDate: '2026-12-31',
    supplier: 'PharmaCorp India'
  },
  {
    id: 2,
    name: 'Metformin 500mg',
    category: 'Diabetes',
    stock: 3200,
    price: 180,
    expiryDate: '2026-08-15',
    supplier: 'MediSupply Ltd'
  },
  {
    id: 3,
    name: 'Ashwagandha Extract',
    category: 'Ayurvedic',
    stock: 1500,
    price: 250,
    expiryDate: '2025-12-31',
    supplier: 'Himalaya Wellness'
  }
];

// Product 2: Marketing Data Lake
export const marketingCampaigns = [
  {
    id: 1,
    name: 'Summer Sale 2025',
    company: 'TechCorp Solutions',
    status: 'Active',
    budget: 500000,
    spent: 287000,
    reach: 1250000,
    conversions: 8500,
    roi: 3.2,
    startDate: '2025-01-01',
    endDate: '2025-03-31'
  },
  {
    id: 2,
    name: 'Product Launch - SmartWatch Pro',
    company: 'WearableTech Inc',
    status: 'Planning',
    budget: 750000,
    spent: 0,
    reach: 0,
    conversions: 0,
    roi: 0,
    startDate: '2025-02-15',
    endDate: '2025-05-15'
  },
  {
    id: 3,
    name: 'Black Friday Campaign',
    company: 'E-Commerce Giant',
    status: 'Completed',
    budget: 1000000,
    spent: 980000,
    reach: 5600000,
    conversions: 45000,
    roi: 5.8,
    startDate: '2024-11-01',
    endDate: '2024-12-31'
  }
];

export const customerSegments = [
  {
    id: 1,
    name: 'High-Value Tech Enthusiasts',
    size: 45000,
    avgSpend: 15000,
    conversionRate: 8.5,
    demographics: 'Age 25-40, Urban, High Income',
    interests: ['Technology', 'Gadgets', 'Innovation']
  },
  {
    id: 2,
    name: 'Budget-Conscious Shoppers',
    size: 125000,
    avgSpend: 3500,
    conversionRate: 12.3,
    demographics: 'Age 18-35, Mixed Urban/Rural',
    interests: ['Deals', 'Value Products', 'Reviews']
  },
  {
    id: 3,
    name: 'Luxury Buyers',
    size: 12000,
    avgSpend: 45000,
    conversionRate: 4.2,
    demographics: 'Age 35-55, Metropolitan, Very High Income',
    interests: ['Premium Brands', 'Exclusivity', 'Quality']
  }
];

export const adPrototypes = [
  {
    id: 1,
    campaignId: 1,
    name: 'Summer Vibes Video Ad',
    type: 'Video',
    platform: 'YouTube',
    duration: 30,
    testReach: 50000,
    engagementRate: 6.5,
    ctr: 3.2,
    status: 'Testing'
  },
  {
    id: 2,
    campaignId: 2,
    name: 'SmartWatch Hero Image',
    type: 'Image',
    platform: 'Instagram',
    testReach: 25000,
    engagementRate: 8.9,
    ctr: 4.5,
    status: 'Approved'
  }
];

export const dataLakeStats = {
  totalCompanies: 156,
  activeCampaigns: 342,
  dataProcessed: '45.6 TB',
  aiInsightsGenerated: 12500,
  avgROI: 4.2
};

// Product 3: AI Security
export const securityAlerts = [
  {
    id: 1,
    type: 'Critical',
    category: 'IoT Device Breach',
    device: 'Smart Camera - Office 3F',
    timestamp: '2025-01-20 14:32:15',
    status: 'Active',
    threat: 'Unauthorized Access Attempt',
    location: 'Mumbai, India',
    ipAddress: '192.168.1.45'
  },
  {
    id: 2,
    type: 'High',
    category: 'GSM Data Interception',
    device: 'IoT Sensor Network',
    timestamp: '2025-01-20 13:15:42',
    status: 'Mitigated',
    threat: 'Man-in-the-Middle Attack',
    location: 'Delhi, India',
    ipAddress: '10.0.0.234'
  },
  {
    id: 3,
    type: 'Medium',
    category: 'Unusual Network Activity',
    device: 'Enterprise Router',
    timestamp: '2025-01-20 12:05:30',
    status: 'Investigating',
    threat: 'Port Scanning Detected',
    location: 'Bangalore, India',
    ipAddress: '172.16.0.100'
  }
];

export const protectedDevices = [
  {
    id: 1,
    name: 'IoT Sensor Network - Manufacturing',
    type: 'Industrial IoT',
    count: 450,
    location: 'Pune Factory',
    status: 'Protected',
    lastScan: '2025-01-20 15:00:00',
    threatsBlocked: 23
  },
  {
    id: 2,
    name: 'Smart Building System',
    type: 'Building Automation',
    count: 125,
    location: 'Mumbai Office Tower',
    status: 'Protected',
    lastScan: '2025-01-20 14:45:00',
    threatsBlocked: 8
  },
  {
    id: 3,
    name: 'GSM Gateway Cluster',
    type: 'Communication',
    count: 45,
    location: 'Multi-location',
    status: 'Protected',
    lastScan: '2025-01-20 15:10:00',
    threatsBlocked: 156
  }
];

export const securityMetrics = {
  devicesProtected: 15420,
  threatsBlocked: 8956,
  gsmDataEncrypted: '234 TB',
  uptime: 99.98,
  avgResponseTime: '0.8 seconds'
};

export const threatIntelligence = [
  {
    id: 1,
    threatType: 'Zero-Day Exploit',
    severity: 'Critical',
    affectedSystems: 'IoT Devices running Firmware v2.3.1',
    discovered: '2025-01-19',
    mitigation: 'Patch deployed to all devices',
    status: 'Resolved'
  },
  {
    id: 2,
    threatType: 'GSM Jamming Attempt',
    severity: 'High',
    affectedSystems: 'Industrial GSM Gateways',
    discovered: '2025-01-18',
    mitigation: 'Frequency hopping enabled',
    status: 'Monitoring'
  }
];

// Company-wide data
export const infuseProducts = [
  {
    id: 1,
    name: 'HealthTrack Pro',
    category: 'Healthcare SaaS',
    description: 'AI-powered health management with smart watch integration and doctor recommendations',
    icon: 'Activity',
    clients: '10,000+',
    growth: 145
  },
  {
    id: 3,
    name: 'SecureIT+IoT Enterprise Shield',
    category: 'Security SaaS',
    description: 'AI-powered unified security across IT infrastructure and IoT devices with GSM protection',
    icon: 'Shield',
    clients: '100+',
    growth: 180
  }
];

export const companyStats = {
  totalClients: 734,
  totalRevenue: '$23M+',
  avgGrowth: 163,
  employeeCount: 380,
  countries: 23
};