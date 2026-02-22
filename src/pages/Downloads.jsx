import React from 'react';
import { Download, Monitor, Shield, CheckCircle, RefreshCw, HardDrive, Wifi, Apple, Chrome, Bell, Clock, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';

const Downloads = () => {
  const handleDownload = (platform, app) => {
    // In production, these would be actual download links
    const message = `The ${app} for ${platform} will be available for download soon. 
    
For developers: 
1. Navigate to /app/desktop-app
2. Run 'yarn install' 
3. Run 'yarn build:${platform === 'Windows' ? 'win' : 'mac'}' to generate the installer`;
    
    alert(message);
  };

  const handleChromeExtension = () => {
    const message = `Chrome Extension Installation:

For developers:
1. Open Chrome and go to chrome://extensions/
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the /app/chrome-extension folder

The extension will be published to Chrome Web Store soon!`;
    
    alert(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Download Infuse-AI Apps
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-3xl mx-auto">
            Get the full power of Infuse-AI on your desktop and browser. Available for Windows, Mac, and Chrome.
          </p>
        </div>
      </div>

      {/* Desktop Apps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Desktop Applications</h2>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Windows App */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-200 hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 md:p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center">
                  <Monitor className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">Windows</h3>
                  <p className="text-blue-100">Desktop Application</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-semibold">1.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Size</span>
                  <span className="font-semibold">~80 MB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="font-semibold">Windows 10/11 (64-bit)</span>
                </div>
              </div>

              <div className="border-t pt-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Includes:</h4>
                <ul className="space-y-2">
                  {['Full HealthTrack Pro features', 'System tray integration', 'Auto-updates', 'Desktop notifications', 'Keyboard shortcuts'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => handleDownload('Windows', 'Infuse-AI')}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg hover:from-blue-700 hover:to-blue-800"
              >
                <Download className="w-5 h-5 mr-2" />
                Download for Windows (.exe)
              </Button>
            </div>
          </div>

          {/* Mac App */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-300 hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 md:p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center">
                  <Apple className="w-8 h-8 md:w-10 md:h-10 text-gray-800" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">macOS</h3>
                  <p className="text-gray-300">Desktop Application</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-semibold">1.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Size</span>
                  <span className="font-semibold">~85 MB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="font-semibold">macOS 11+ (Intel & Apple Silicon)</span>
                </div>
              </div>

              <div className="border-t pt-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Includes:</h4>
                <ul className="space-y-2">
                  {['Full HealthTrack Pro features', 'Menu bar integration', 'Auto-updates', 'Native notifications', 'Touch Bar support'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => handleDownload('Mac', 'Infuse-AI')}
                className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-lg hover:from-gray-900 hover:to-black"
              >
                <Download className="w-5 h-5 mr-2" />
                Download for Mac (.dmg)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chrome Extension Section */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Browser Extension</h2>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-200">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 md:p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center">
                    <Chrome className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold">Chrome Extension</h3>
                    <p className="text-green-100">Infuse-AI Health Assistant</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <p className="text-gray-600 mb-6">
                  Quick access to your health dashboard, real-time notifications, and background data sync - all from your browser toolbar.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="font-medium text-sm">Quick Access</div>
                    <div className="text-xs text-gray-500">One-click dashboard</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Bell className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="font-medium text-sm">Notifications</div>
                    <div className="text-xs text-gray-500">Health alerts</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="font-medium text-sm">Background Sync</div>
                    <div className="text-xs text-gray-500">Auto data sync</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="font-medium text-sm">Reminders</div>
                    <div className="text-xs text-gray-500">Medication alerts</div>
                  </div>
                </div>

                <div className="border-t pt-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {[
                      'Quick access to health dashboard',
                      'View appointments and prescriptions',
                      'Background health data synchronization',
                      'Critical health alert notifications',
                      'AI-powered health insights'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={handleChromeExtension}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white text-lg hover:from-green-700 hover:to-teal-700"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  Add to Chrome
                </Button>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Free • Works with Chrome, Edge, Brave
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            Why Download Our Apps?
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: RefreshCw, color: 'blue', title: 'Auto-Updates', desc: 'Always get the latest features' },
              { icon: Monitor, color: 'green', title: 'Native Experience', desc: 'Smooth OS integration' },
              { icon: HardDrive, color: 'purple', title: 'Lightweight', desc: 'Small download size' },
              { icon: Wifi, color: 'orange', title: 'Always Connected', desc: 'Real-time cloud sync' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-14 h-14 md:w-16 md:h-16 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                  <item.icon className={`w-7 h-7 md:w-8 md:h-8 text-${item.color}-600`} />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Requirements */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">System Requirements</h2>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  Windows
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>OS:</strong> Windows 10/11 (64-bit)</li>
                  <li>• <strong>RAM:</strong> 4 GB minimum</li>
                  <li>• <strong>Disk:</strong> 500 MB free space</li>
                  <li>• <strong>Internet:</strong> Required</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Apple className="w-5 h-5 text-gray-800" />
                  macOS
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>OS:</strong> macOS 11 Big Sur or later</li>
                  <li>• <strong>RAM:</strong> 4 GB minimum</li>
                  <li>• <strong>Disk:</strong> 500 MB free space</li>
                  <li>• <strong>Chip:</strong> Intel or Apple Silicon</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="py-12 md:py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Having trouble with installation? Contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:info@infuse.net.in"
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all"
            >
              Email Support
            </a>
            <a 
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
