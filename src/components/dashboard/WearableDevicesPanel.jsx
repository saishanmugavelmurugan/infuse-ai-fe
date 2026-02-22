import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Watch, Smartphone, Activity, Moon, Footprints, Flame,
  Heart, RefreshCw, Plus, Trash2, TrendingUp, Wifi, WifiOff
} from 'lucide-react';
import { healthtrackApi } from '../../services/healthtrackApi';

const WearableDevicesPanel = ({ patientId }) => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [devices, setDevices] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('heart_rate');
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    if (patientId) {
      fetchDevicesAndData();
    }
  }, [patientId]);

  const fetchDevicesAndData = async () => {
    try {
      setLoading(true);
      const [devicesData, wearableData] = await Promise.all([
        healthtrackApi.wearables.getDevices(patientId).catch(() => ({ devices: [] })),
        healthtrackApi.wearables.getData(patientId, null, 7).catch(() => null)
      ]);
      
      setDevices(devicesData.devices || []);
      setHealthData(wearableData);
      
      // Fetch trends
      if (wearableData && wearableData.data?.length > 0) {
        const trendsData = await healthtrackApi.wearables.getTrends(patientId, 'heart_rate', 7).catch(() => null);
        if (trendsData) setTrends(trendsData.trends || []);
      }
    } catch (err) {
      console.error('Error fetching wearable data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncDevice = async (deviceType) => {
    try {
      setSyncing(true);
      await healthtrackApi.wearables.syncData(patientId, deviceType);
      await fetchDevicesAndData();
    } catch (err) {
      alert('Failed to sync: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleConnectDevice = async (deviceType, deviceName) => {
    try {
      await healthtrackApi.wearables.connectDevice(patientId, {
        device_type: deviceType,
        device_name: deviceName,
        is_connected: true
      });
      setShowAddDevice(false);
      await fetchDevicesAndData();
    } catch (err) {
      alert('Failed to connect device: ' + err.message);
    }
  };

  const handleDisconnectDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to disconnect this device?')) return;
    try {
      await healthtrackApi.wearables.disconnectDevice(patientId, deviceId);
      await fetchDevicesAndData();
    } catch (err) {
      alert('Failed to disconnect: ' + err.message);
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'apple_watch': return <Watch className="w-8 h-8 text-gray-800" />;
      case 'fitbit': return <Activity className="w-8 h-8 text-teal-600" />;
      case 'garmin': return <Watch className="w-8 h-8 text-blue-600" />;
      case 'samsung_health': return <Smartphone className="w-8 h-8 text-blue-800" />;
      default: return <Watch className="w-8 h-8 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Watch className="w-5 h-5 text-orange-600" />
              Connected Devices
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddDevice(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Device
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {devices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((device) => (
                <div key={device.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(device.device_type)}
                      <div>
                        <div className="font-semibold">{device.device_name}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {device.device_type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {device.is_connected ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Last sync: {device.last_sync ? new Date(device.last_sync).toLocaleString() : 'Never'}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleSyncDevice(device.device_type)}
                      disabled={syncing}
                    >
                      <RefreshCw className={`w-3 h-3 mr-1 ${syncing ? 'animate-spin' : ''}`} />
                      Sync
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 border-red-200"
                      onClick={() => handleDisconnectDevice(device.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Watch className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600">No devices connected</p>
              <Button 
                onClick={() => setShowAddDevice(true)}
                className="mt-3 bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-1" /> Connect Your First Device
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Summary from Wearables */}
      {healthData && healthData.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              7-Day Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Heart Rate */}
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">Avg Heart Rate</span>
                </div>
                <div className="text-2xl font-bold text-red-700">
                  {healthData.summary.heart_rate?.average || '--'}
                </div>
                <div className="text-xs text-gray-500">
                  Range: {healthData.summary.heart_rate?.min || '--'} - {healthData.summary.heart_rate?.max || '--'} bpm
                </div>
              </div>

              {/* Steps */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Footprints className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Daily Steps</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {healthData.summary.steps?.daily_average?.toLocaleString() || '--'}
                </div>
                <div className="text-xs text-gray-500">
                  Total: {healthData.summary.steps?.total?.toLocaleString() || '--'}
                </div>
              </div>

              {/* Sleep */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-600">Avg Sleep</span>
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {healthData.summary.sleep?.average_hours || '--'}
                </div>
                <div className="text-xs text-gray-500">hours/night</div>
              </div>

              {/* Calories */}
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Daily Calories</span>
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {healthData.summary.calories?.daily_average?.toLocaleString() || '--'}
                </div>
                <div className="text-xs text-gray-500">
                  Total: {healthData.summary.calories?.total?.toLocaleString() || '--'}
                </div>
              </div>
            </div>

            {/* Trend Chart Placeholder */}
            {trends.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Heart Rate Trend (7 Days)</h4>
                <div className="h-32 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg flex items-end p-4 gap-1">
                  {trends.slice(-14).map((point, idx) => (
                    <div 
                      key={idx}
                      className="bg-red-500 rounded-t flex-1 min-w-[8px] transition-all hover:bg-red-600"
                      style={{ height: `${Math.min(100, (point.value / 100) * 100)}%` }}
                      title={`${point.date}: ${point.value} bpm`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{trends[0]?.date}</span>
                  <span>{trends[trends.length - 1]?.date}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Device Modal */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Connect a Wearable Device</h3>
            </div>
            <div className="p-4 space-y-3">
              <div 
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                onClick={() => handleConnectDevice('apple_watch', 'Apple Watch Series 9')}
              >
                <Watch className="w-10 h-10 text-gray-800" />
                <div>
                  <div className="font-medium">Apple Watch</div>
                  <div className="text-sm text-gray-500">Connect via Health app</div>
                </div>
              </div>
              <div 
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                onClick={() => handleConnectDevice('fitbit', 'Fitbit Charge 6')}
              >
                <Activity className="w-10 h-10 text-teal-600" />
                <div>
                  <div className="font-medium">Fitbit</div>
                  <div className="text-sm text-gray-500">Sync your Fitbit data</div>
                </div>
              </div>
              <div 
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                onClick={() => handleConnectDevice('garmin', 'Garmin Venu 3')}
              >
                <Watch className="w-10 h-10 text-blue-600" />
                <div>
                  <div className="font-medium">Garmin</div>
                  <div className="text-sm text-gray-500">Connect Garmin Connect</div>
                </div>
              </div>
              <div 
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                onClick={() => handleConnectDevice('samsung_health', 'Samsung Galaxy Watch 6')}
              >
                <Smartphone className="w-10 h-10 text-blue-800" />
                <div>
                  <div className="font-medium">Samsung Health</div>
                  <div className="text-sm text-gray-500">Sync Samsung Health data</div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowAddDevice(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WearableDevicesPanel;
