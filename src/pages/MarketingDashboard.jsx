import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import {
  TrendingUp,
  DollarSign,
  Target,
  Database,
  Users,
  BarChart3,
  Eye,
  MousePointer,
  Home as HomeIcon,
  Calendar,
  TrendingDown
} from 'lucide-react';
import { marketingCampaigns, customerSegments, adPrototypes, dataLakeStats } from '../infuse-mock';
import SEO from '../components/SEO';

const MarketingDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="MarketLake AI - Marketing Data Lake & Analytics"
        description="MarketLake AI provides enterprise-grade marketing data lake for campaign management, customer segmentation, and AI-powered advertising prototypes. Make data-driven marketing decisions at scale."
        keywords="Marketing Data Lake, Marketing Analytics, Customer Segmentation, Campaign Management, Advertising Platform, Marketing Intelligence, Data-Driven Marketing, AI Marketing Tools"
        canonical="https://www.infuse.net.in/marketing"
      />
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={process.env.REACT_APP_LOGO_URL} 
                alt="Infuse-ai Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="text-xl font-bold text-gray-900">MarketLake AI</span>
                <Badge className="ml-2 bg-orange-100 text-orange-700 text-xs">Marketing PaaS</Badge>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="outline">Company Settings</Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Data Lake Dashboard</h1>
          <p className="text-gray-600">AI-powered marketing intelligence and campaign optimization platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Companies</CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{dataLakeStats.totalCompanies}</div>
              <p className="text-xs text-gray-600 mt-1">Active clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Campaigns</CardTitle>
              <Target className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{dataLakeStats.activeCampaigns}</div>
              <p className="text-xs text-gray-600 mt-1">Across all clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Data Processed</CardTitle>
              <Database className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{dataLakeStats.dataProcessed}</div>
              <p className="text-xs text-gray-600 mt-1">Total volume</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Insights</CardTitle>
              <BarChart3 className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{dataLakeStats.aiInsightsGenerated.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">Generated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg ROI</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{dataLakeStats.avgROI}x</div>
              <p className="text-xs text-gray-600 mt-1">Return on investment</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="segments">Customer Segments</TabsTrigger>
            <TabsTrigger value="prototypes">Ad Prototypes</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Marketing Campaign Management
                </CardTitle>
                <CardDescription>
                  Create, test, and optimize campaigns with AI-powered insights
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {marketingCampaigns.map((campaign) => (
                <Card key={campaign.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{campaign.company}</p>
                        </div>
                        <Badge className={
                          campaign.status === 'Active' ? 'bg-green-100 text-green-700' :
                          campaign.status === 'Planning' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {campaign.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Budget</div>
                          <div className="text-xl font-bold text-blue-600">₹{(campaign.budget/100000).toFixed(1)}L</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Spent</div>
                          <div className="text-xl font-bold text-purple-600">₹{(campaign.spent/100000).toFixed(1)}L</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Reach</div>
                          <div className="text-xl font-bold text-green-600">{(campaign.reach/1000000).toFixed(2)}M</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Conversions</div>
                          <div className="text-xl font-bold text-orange-600">{campaign.conversions.toLocaleString()}</div>
                        </div>
                      </div>

                      {campaign.spent > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Budget Utilization</span>
                            <span className="text-sm font-bold">{((campaign.spent/campaign.budget)*100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(campaign.spent/campaign.budget)*100} className="h-2" />
                        </div>
                      )}

                      {campaign.roi > 0 && (
                        <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">ROI:</span>
                          <span className="text-lg font-bold text-green-600">{campaign.roi}x</span>
                          <span className="text-sm text-gray-600 ml-auto">{campaign.startDate} - {campaign.endDate}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" className="flex-1">View Analytics</Button>
                        <Button size="sm" variant="outline" className="flex-1">Edit Campaign</Button>
                        {campaign.status === 'Planning' && (
                          <Button size="sm" variant="outline" className="flex-1">Launch</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Customer Segments Tab */}
          <TabsContent value="segments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Customer Segmentation Research
                </CardTitle>
                <CardDescription>
                  AI-powered audience analysis and targeting insights
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {customerSegments.map((segment) => (
                <Card key={segment.id} className="border-2 hover:border-blue-600 hover:shadow-xl transition-all">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{segment.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{segment.demographics}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600">Size</div>
                          <div className="text-lg font-bold text-blue-600">{(segment.size/1000).toFixed(0)}K</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600">Avg Spend</div>
                          <div className="text-lg font-bold text-purple-600">₹{(segment.avgSpend/1000).toFixed(1)}K</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600">Conv. Rate</div>
                          <div className="text-lg font-bold text-green-600">{segment.conversionRate}%</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-2">Interests</div>
                        <div className="flex flex-wrap gap-2">
                          {segment.interests.map((interest, index) => (
                            <Badge key={index} variant="outline">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">Target Segment</Button>
                        <Button size="sm" variant="outline" className="flex-1">View Insights</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ad Prototypes Tab */}
          <TabsContent value="prototypes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  Ad Prototype Testing & Pre-Launch Analysis
                </CardTitle>
                <CardDescription>
                  Test messaging and creative before full campaign launch
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {adPrototypes.map((prototype) => (
                <Card key={prototype.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{prototype.name}</h3>
                            <Badge className="mt-2" variant="outline">{prototype.type}</Badge>
                            <Badge className="ml-2 bg-blue-100 text-blue-700">{prototype.platform}</Badge>
                          </div>
                          <Badge className={
                            prototype.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }>
                            {prototype.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-600 mb-1" />
                            <div className="text-lg font-bold text-gray-900">{(prototype.testReach/1000).toFixed(0)}K</div>
                            <div className="text-xs text-gray-600">Test Reach</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-purple-600 mb-1" />
                            <div className="text-lg font-bold text-purple-600">{prototype.engagementRate}%</div>
                            <div className="text-xs text-gray-600">Engagement</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <MousePointer className="w-4 h-4 text-blue-600 mb-1" />
                            <div className="text-lg font-bold text-blue-600">{prototype.ctr}%</div>
                            <div className="text-xs text-gray-600">CTR</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">AI Recommendation:</span>
                          <span className="text-sm text-gray-700">
                            {prototype.status === 'Approved' ? 'Ready for full launch' : 'Continue A/B testing'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button size="sm" className="flex-1">View Creative</Button>
                      <Button size="sm" variant="outline" className="flex-1">Analytics</Button>
                      {prototype.status === 'Testing' && (
                        <Button size="sm" variant="outline" className="flex-1">Create Variant</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketingDashboard;