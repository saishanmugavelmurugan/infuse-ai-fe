import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Code,
  Heart,
  Coffee,
  Plane,
  GraduationCap,
  Shield,
  Home as HomeIcon,
  Mail,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import SEO from '../components/SEO';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: 'Enterprise Sales Executive',
      department: 'Sales',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₹6 LPA + Performance Incentives (Up to ₹3 LPA)',
      posted: '2 days ago',
      summary: 'Drive enterprise growth by selling our AI-powered HealthTrack Pro and SecureSphere solutions to healthcare and enterprise clients',
      responsibilities: [
        'Identify and qualify enterprise leads for HealthTrack Pro and SecureSphere platforms',
        'Manage complete sales cycle from initial contact to deal closure with healthcare providers and enterprises',
        'Build and maintain strong relationships with key decision-makers in healthcare, IT, and security sectors',
        'Conduct product demonstrations and presentations showcasing AI-powered health management and security solutions',
        'Collaborate with technical teams to develop customized solutions and proposals',
        'Meet and exceed quarterly sales targets with performance-based incentives',
        'Negotiate contracts, service agreements, and terms with clients',
        'Maintain accurate sales forecasts and pipeline reports in CRM system',
        'Represent Infuse-ai at industry events, trade shows, and networking forums',
        'Provide market feedback and customer insights to product teams for improvement',
        'Generate leads through cold calling, email campaigns, and social media outreach',
        'Prepare and deliver sales proposals, quotes, and presentations'
      ],
      requirements: [
        '2-4 years of B2B SaaS/software sales experience with proven track record',
        'Experience in healthcare IT, enterprise software, or security solutions preferred',
        'Understanding of B2B sales cycles and enterprise client requirements',
        'Excellent communication, presentation, and interpersonal skills',
        'Proficiency with CRM tools (Salesforce, HubSpot, or similar)',
        'Bachelor\'s degree in Business, Sales, Marketing, or related field',
        'Strong negotiation and deal-closing abilities',
        'Self-motivated, target-driven, and results-oriented mindset',
        'Willingness to travel for client meetings (20-30% of time)',
        'Good understanding of AI/ML and healthcare technology trends'
      ],
      niceToHave: [
        'Existing network of enterprise contacts in target industries',
        'Experience selling security or healthcare technology solutions',
        'Understanding of data privacy regulations (GDPR, HIPAA)',
        'Multilingual capabilities (Hindi, English + regional language)'
      ]
    },
    {
      id: 2,
      title: 'Full Stack Development Engineer',
      department: 'Engineering',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹10 LPA + Annual Increment',
      posted: '1 week ago',
      summary: 'Build and scale our AI-powered health management and security platforms using modern full-stack technologies',
      responsibilities: [
        'Develop and maintain features for HealthTrack Pro and SecureSphere platforms',
        'Build responsive user interfaces using React.js with modern UI libraries',
        'Design and implement RESTful APIs using FastAPI/Python',
        'Work with MongoDB for database design, queries, and optimization',
        'Integrate AI/ML APIs (Google Gemini, OpenAI) for health analysis and security threat detection',
        'Write clean, maintainable, and well-documented code following best practices',
        'Participate in code reviews and provide constructive feedback to team members',
        'Debug and resolve technical issues reported by QA or users',
        'Optimize application performance and implement caching strategies',
        'Collaborate with product managers and designers to implement new features',
        'Write unit tests and integration tests to ensure code quality',
        'Deploy applications to cloud platforms and monitor production systems',
        'Stay updated with latest technologies and recommend improvements'
      ],
      requirements: [
        '3-5 years of full-stack development experience with React and Python',
        'Strong proficiency in React.js, JavaScript/TypeScript, HTML, CSS, and Tailwind CSS',
        'Solid experience with Python and FastAPI or Django for backend development',
        'Hands-on experience with MongoDB or other NoSQL databases',
        'Understanding of RESTful API design and implementation',
        'Experience with Git version control and collaborative development workflows',
        'Familiarity with AI/ML API integration (OpenAI, Google Gemini, Anthropic)',
        'Knowledge of JWT authentication and security best practices',
        'Experience with responsive design and cross-browser compatibility',
        'Strong problem-solving skills and attention to detail',
        'Good communication skills for team collaboration',
        'Bachelor\'s degree in Computer Science, Engineering, or related field'
      ],
      niceToHave: [
        'Experience with Electron for desktop application development',
        'Knowledge of healthcare IT systems or medical software',
        'Understanding of cybersecurity principles and threat detection',
        'Experience with cloud platforms (AWS, Azure, GCP)',
        'Familiarity with Docker and containerization',
        'Knowledge of CI/CD pipelines and DevOps practices',
        'Experience with testing frameworks (Jest, Pytest)',
        'Contributions to open-source projects'
      ]
    }
  ];

  const benefits = [
    { icon: Heart, title: 'Health Insurance', description: 'Comprehensive medical coverage for you and family' },
    { icon: DollarSign, title: 'Performance Bonus', description: 'Quarterly bonuses based on individual & company performance' },
    { icon: Plane, title: 'Flexible Time Off', description: 'Unlimited PTO policy with 25+ days encouraged annually' },
    { icon: Coffee, title: 'Remote-First', description: 'Work from anywhere with flexible hours' },
    { icon: GraduationCap, title: 'Learning & Development', description: '₹50K annual budget for courses, conferences, certifications' },
    { icon: TrendingUp, title: 'Stock Options (ESOP)', description: 'Share in company growth with employee stock ownership' },
    { icon: Shield, title: 'Life & Disability Insurance', description: 'Comprehensive coverage and support' },
    { icon: Users, title: 'Team Retreats', description: 'Quarterly off-sites and annual international trips' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={process.env.REACT_APP_LOGO_URL} 
                alt="Infuse-ai Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Infuse-ai
              </span>
            </Link>

            <div className="flex items-center space-x-4">
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

      <SEO
        title="Careers - Join Our Team"
        description="Join Infuse-ai and work on cutting-edge AI solutions. We're hiring Enterprise Sales Executives and Software Architects. Explore career opportunities at our innovative SaaS company."
        keywords="Jobs, Careers, Enterprise Sales, Software Architect, AI Jobs, SaaS Jobs, Technology Careers, Software Engineering Jobs"
        canonical="https://www.infuse.net.in/careers"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-yellow-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Badge className="bg-white/20 text-white border-white/30 mb-4">
            We're Hiring!
          </Badge>
          <h1 className="text-5xl font-bold mb-6">Join the Future of Enterprise AI</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
            Build cutting-edge AI solutions with a team that has 100+ years of collective experience. 
            Shape the future of healthcare and cybersecurity.
          </p>
          <div className="flex items-center justify-center gap-8 text-lg">
            <div>
              <div className="text-3xl font-bold">{jobs.length}</div>
              <div className="text-orange-100">Open Positions</div>
            </div>
            <div>
              <div className="text-3xl font-bold">23</div>
              <div className="text-orange-100">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold">450+</div>
              <div className="text-orange-100">Team Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join Infuse-ai?</h2>
            <p className="text-xl text-gray-600">Modern benefits for modern professionals</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="border-2 hover:shadow-lg transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Open Positions</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {jobs.map((job) => (
              <Card key={job.id} className="border-2 hover:shadow-xl transition-all cursor-pointer" onClick={() => setSelectedJob(job)}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-orange-100 text-orange-700">{job.department}</Badge>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {job.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    {job.experience} experience
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Posted {job.posted}
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-orange-600 to-yellow-600">
                    View Details & Apply
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Detail Modal (simplified - you can enhance with a proper modal) */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-orange-100 text-orange-700">{selectedJob.department}</Badge>
                    <Badge variant="outline">{selectedJob.type}</Badge>
                    <Badge variant="outline">{selectedJob.location}</Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedJob(null)}>✕</Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedJob.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Required Qualifications</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nice to Have</h3>
                <ul className="space-y-2">
                  {selectedJob.niceToHave.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Compensation & Benefits</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <span><strong>Salary:</strong> {selectedJob.salary}</span>
                  </div>
                  <p className="mt-4">Plus all standard benefits including health insurance, unlimited PTO, learning budget, ESOP, and more!</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700" size="lg">
                  <Mail className="mr-2 w-5 h-5" />
                  Apply Now: careers@infuse.in.net
                </Button>
                <Button variant="outline" size="lg" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-yellow-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-xl text-orange-100 mb-6">
            We're always looking for exceptional talent. Send us your resume and let's talk!
          </p>
          <a href="mailto:info@infuse.net.in?subject=Career Inquiry">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              <Mail className="mr-2 w-5 h-5" />
              Email: info@infuse.net.in
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Careers;
