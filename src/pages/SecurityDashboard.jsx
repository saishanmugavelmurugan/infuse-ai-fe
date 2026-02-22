import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Wifi,
  Lock,
  MapPin,
  Clock,
  Server,
  Radio,
  Home as HomeIcon,
  TrendingUp,
  XCircle,
  Calendar
} from 'lucide-react';
import { securityAlerts, protectedDevices, securityMetrics, threatIntelligence } from '../infuse-mock';
import SEO from '../components/SEO';

const SecurityDashboard = () => {
  const getAlertColor = (type) => {
    switch(type) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="SecureSphere - IT & IoT Security Platform"
        description="SecureSphere provides enterprise-grade IT and IoT security with NetFlow-based threat detection, AI-powered prevention, and automated enforcement. Reduce operational overhead with intelligent security."
        keywords="IoT Security, IT Security, NetFlow Analysis, Threat Detection, Cybersecurity Platform, Network Security, AI Security, Automated Threat Prevention, Enterprise Security, Security Automation"
        canonical="https://www.infuse.net.in/security"
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
                <span className="text-xl font-bold text-gray-900">SecureIT+IoT Enterprise Shield</span>
                <Badge className="ml-2 bg-orange-100 text-orange-700 text-xs">Security SaaS</Badge>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="outline">Security Settings</Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Security Operations Center</h1>
          <p className="text-gray-600">Unified IT & IoT security with AI-powered threat detection and GSM protection</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Devices Protected</CardTitle>
              <Shield className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{securityMetrics.devicesProtected.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">Active monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Threats Blocked</CardTitle>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{securityMetrics.threatsBlocked.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">GSM Data Encrypted</CardTitle>
              <Radio className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{securityMetrics.gsmDataEncrypted}</div>
              <p className="text-xs text-gray-600 mt-1">Total volume</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Uptime</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{securityMetrics.uptime}%</div>
              <p className="text-xs text-gray-600 mt-1">System availability</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Response Time</CardTitle>
              <Activity className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{securityMetrics.avgResponseTime}s</div>
              <p className="text-xs text-gray-600 mt-1">Average</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
            <TabsTrigger value="devices">Protected Devices</TabsTrigger>
            <TabsTrigger value="intelligence">Threat Intelligence</TabsTrigger>
          </TabsList>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Real-Time Security Alerts
                </CardTitle>
                <CardDescription>
                  AI-powered threat detection across IT and IoT infrastructure
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {securityAlerts.map((alert) => (
                <Card key={alert.id} className="border-2 border-l-4 hover:shadow-lg transition-shadow" style={{
                  borderLeftColor: alert.type === 'Critical' ? '#dc2626' : alert.type === 'High' ? '#ea580c' : '#eab308'
                }}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getAlertColor(alert.type)}>
                              {alert.type}
                            </Badge>
                            <Badge className={
                              alert.status === 'Active' ? 'bg-red-100 text-red-700' :
                              alert.status === 'Mitigated' ? 'bg-green-100 text-green-700' :
                              'bg-yellow-100 text-yellow-700'
                            }>
                              {alert.status}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{alert.category}</h3>
                          <p className="text-sm text-gray-600 mt-1">{alert.threat}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <Server className="w-4 h-4 text-gray-600 mb-1" />
                          <div className="text-sm font-medium text-gray-900">{alert.device}</div>
                          <div className="text-xs text-gray-600">Device</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <MapPin className="w-4 h-4 text-gray-600 mb-1" />
                          <div className="text-sm font-medium text-gray-900">{alert.location}</div>
                          <div className="text-xs text-gray-600">Location</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <Wifi className="w-4 h-4 text-gray-600 mb-1" />
                          <div className="text-sm font-medium text-gray-900">{alert.ipAddress}</div>
                          <div className="text-xs text-gray-600">IP Address</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <Clock className="w-4 h-4 text-gray-600 mb-1" />
                          <div className="text-sm font-medium text-gray-900">{alert.timestamp.split(' ')[1]}</div>
                          <div className="text-xs text-gray-600">{alert.timestamp.split(' ')[0]}</div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" className="flex-1" variant={alert.status === 'Active' ? 'default' : 'outline'}>
                          {alert.status === 'Active' ? 'Take Action' : 'View Details'}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">Analyze Threat</Button>
                        <Button size="sm" variant="outline" className="flex-1">Create Report</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Protected Device Networks
                </CardTitle>
                <CardDescription>
                  Real-time monitoring of IT infrastructure and IoT device networks
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {protectedDevices.map((device) => (
                <Card key={device.id} className="border-2 hover:border-blue-600 hover:shadow-xl transition-all">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{device.name}</h3>
                          <Badge className="mt-2 bg-blue-100 text-blue-700">{device.type}</Badge>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {device.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{device.count}</div>
                          <div className="text-xs text-gray-600">Devices</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{device.threatsBlocked}</div>
                          <div className="text-xs text-gray-600">Threats Blocked</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <span className="font-medium">Location:</span>
                          <span className="text-gray-600">{device.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="font-medium">Last Scan:</span>
                          <span className="text-gray-600">{device.lastScan}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">All systems secure</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">View Network</Button>
                        <Button size="sm" variant="outline" className="flex-1">Run Scan</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Threat Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-600" />
                  Threat Intelligence & Mitigation
                </CardTitle>
                <CardDescription>
                  AI-powered threat analysis and automated security responses
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {threatIntelligence.map((threat) => (
                <Card key={threat.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{threat.threatType}</h3>
                          <Badge className={getAlertColor(threat.severity)} >
                            {threat.severity}
                          </Badge>
                        </div>
                        <Badge className={
                          threat.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }>
                          {threat.status}
                        </Badge>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Affected Systems:</span>
                          <p className="text-sm text-gray-600 mt-1">{threat.affectedSystems}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">Mitigation:</span>
                          <p className="text-sm text-gray-600 mt-1">{threat.mitigation}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Discovered: {threat.discovered}</span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="outline" className="flex-1">Full Report</Button>
                        <Button size="sm" variant="outline" className="flex-1">Apply Patch</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      GSM Data Protection Active
                    </h3>
                    <p className="text-gray-600">
                      All IoT communications over GSM networks are encrypted and monitored for security threats
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    View GSM Analytics
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

export default SecurityDashboard;