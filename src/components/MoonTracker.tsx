import React, { useState, useEffect, useMemo } from 'react';
import { Satellite, MapPin, Clock, Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { LunarCalculator } from '../utils/lunarCalculations';

interface MoonTrackerProps {
  onBack: () => void;
}

export function MoonTracker({ onBack }: MoonTrackerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060, name: 'New York' });
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const lunarData = useMemo(() => {
    return LunarCalculator.getAdvancedLunarData(currentTime, location.lat, location.lng);
  }, [currentTime, location]);

  const distanceHistory = useMemo(() => {
    return LunarCalculator.getMoonDistanceHistory(7);
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Current Location'
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const getCompassDirection = (azimuth: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(azimuth / 22.5) % 16;
    return directions[index];
  };

  const getMoonVisibility = () => {
    if (lunarData.moonTimes.alwaysUp) return 'Always visible';
    if (lunarData.moonTimes.alwaysDown) return 'Not visible';
    if (lunarData.moonPosition.altitude > 0) return 'Currently visible';
    return 'Below horizon';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <header className="border-b border-gray-700/50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                ←
              </Button>
              <div className="flex items-center space-x-2">
                <Satellite className="text-purple-400 w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Moon Tracker</h1>
                  <p className="text-sm text-gray-400">Real-time Lunar Position & Data</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={requestLocation} variant="secondary" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                Use My Location
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-time Data */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="text-blue-400 w-5 h-5" />
                  <span>Current Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-3xl mb-2">🌙</div>
                    <div className="text-lg font-bold text-white">
                      {lunarData.moonPhase.phaseName}
                    </div>
                    <div className="text-sm text-gray-400">
                      {Math.round(lunarData.moonPhase.illumination)}% illuminated
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl mb-2">📍</div>
                    <div className="text-lg font-bold text-white">
                      {getMoonVisibility()}
                    </div>
                    <div className="text-sm text-gray-400">
                      Alt: {lunarData.moonPosition.altitude.toFixed(1)}°
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Distance</span>
                    <span className="text-white font-mono">
                      {lunarData.moonPosition.distance.toFixed(0)} km
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Azimuth</span>
                    <span className="text-white font-mono">
                      {lunarData.moonPosition.azimuth.toFixed(1)}° ({getCompassDirection(lunarData.moonPosition.azimuth)})
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Altitude</span>
                    <span className="text-white font-mono">
                      {lunarData.moonPosition.altitude.toFixed(1)}°
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Compass className="text-green-400 w-5 h-5" />
                  <span>Moon Times Today</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Moonrise</span>
                    <span className="text-white font-mono">
                      {lunarData.moonTimes.rise?.toLocaleTimeString() || 'No rise today'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Moonset</span>
                    <span className="text-white font-mono">
                      {lunarData.moonTimes.set?.toLocaleTimeString() || 'No set today'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Next High Tide</span>
                    <span className="text-white font-mono">
                      {lunarData.tides.nextHigh?.toLocaleTimeString() || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Next Low Tide</span>
                    <span className="text-white font-mono">
                      {lunarData.tides.nextLow?.toLocaleTimeString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visual Tracking */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sky Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-64 bg-gradient-to-b from-blue-900 to-blue-950 rounded-lg overflow-hidden">
                  {/* Horizon line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-400"></div>
                  <div className="absolute bottom-0 left-4 text-xs text-gray-400">Horizon</div>
                  
                  {/* Cardinal directions */}
                  <div className="absolute bottom-2 left-2 text-xs text-gray-400">W</div>
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">E</div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">S</div>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">N</div>
                  
                  {/* Moon position */}
                  {lunarData.moonPosition.altitude > 0 && (
                    <div
                      className="absolute w-6 h-6 text-2xl transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${((lunarData.moonPosition.azimuth + 180) % 360) / 360 * 100}%`,
                        bottom: `${(lunarData.moonPosition.altitude / 90) * 100}%`,
                      }}
                    >
                      🌙
                    </div>
                  )}
                  
                  {lunarData.moonPosition.altitude <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🌙</div>
                        <div className="text-gray-400">Moon below horizon</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distance History (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {distanceHistory.slice(-7).map((data, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
                      <span className="text-sm text-gray-400">
                        {data.date.toLocaleDateString()}
                      </span>
                      <span className="text-sm text-white font-mono">
                        {data.distance.toFixed(0)} km
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Location</label>
                    <p className="text-white">{location.name}</p>
                    <p className="text-sm text-gray-400">
                      {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Latitude"
                      value={location.lat}
                      onChange={(e) => setLocation({...location, lat: parseFloat(e.target.value) || 0})}
                      className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Longitude"
                      value={location.lng}
                      onChange={(e) => setLocation({...location, lng: parseFloat(e.target.value) || 0})}
                      className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}