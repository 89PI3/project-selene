import React from 'react';
import { 
  Moon, 
  Sun, 
  MapPin, 
  Clock, 
  Telescope, 
  Calendar,
  Globe2,
  Zap,
  Satellite
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { LunarGlobe } from './LunarGlobe';
import { useDateTime } from '../hooks/useDateTime';
import { useLocation } from '../hooks/useLocation';
import { calculateLunarPhase, calculateLunarPosition, getNextPhase } from '../utils/astronomical';
import { LunarPhase } from '../types/astronomical';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { dateTime } = useDateTime();
  const { location } = useLocation();
  
  const lunarPhase = calculateLunarPhase(dateTime.current);
  const lunarPosition = calculateLunarPosition(dateTime.current, location.latitude, location.longitude);
  const nextPhase = getNextPhase(lunarPhase, dateTime.current);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Moon className="text-blue-400 w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    PROJECT SELENE
                  </h1>
                  <p className="text-sm text-gray-400">
                    RACOONS UNIVERSE 89PI3
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">
                  {formatDate(dateTime.utc)} UTC
                </p>
                <p className="text-xs text-gray-500">
                  JD {dateTime.julianDay.toFixed(5)}
                </p>
              </div>
              <Badge variant="success">
                OPERATIONAL
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <Card hover gradient>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Moon className="text-blue-400 w-5 h-5" />
                  <span>Current Phase</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-white">
                    {lunarPhase.name}
                  </p>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>Age: {lunarPhase.age} days</p>
                    <p>Illumination: {lunarPhase.illumination}%</p>
                  </div>
                  <Badge variant="default">
                    Phase {(lunarPhase.phase * 100).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card hover gradient>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Telescope className="text-purple-400 w-5 h-5" />
                  <span>Position</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-white">
                    {lunarPosition.distance.toLocaleString()} km
                  </p>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>RA: {lunarPosition.ra.toFixed(2)}°</p>
                    <p>Dec: {lunarPosition.dec.toFixed(2)}°</p>
                  </div>
                  <Badge variant="secondary">
                    Parallax {lunarPosition.parallax.toFixed(2)}"
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card hover gradient>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="text-green-400 w-5 h-5" />
                  <span>Next Phase</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-white">
                    {nextPhase.name}
                  </p>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>{nextPhase.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                    <p>{nextPhase.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC</p>
                  </div>
                  <Badge variant="warning">
                    In {Math.ceil((nextPhase.date.getTime() - dateTime.current.getTime()) / (1000 * 60 * 60 * 24))} days
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card hover gradient>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="text-cyan-400 w-5 h-5" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-white">
                    {location.name}
                  </p>
                  <div className="space-y-1 text-xs text-gray-300">
                    <p>{location.latitude.toFixed(4)}°N</p>
                    <p>{location.longitude.toFixed(4)}°W</p>
                  </div>
                  <Badge variant="success">
                    {location.timezone}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe2 className="text-blue-400 w-5 h-5" />
                  <span>Lunar Visualization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LunarGlobe 
                  lunarPhase={lunarPhase} 
                  className="h-80 w-full rounded-lg overflow-hidden"
                />
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Angular Size</p>
                    <p className="text-white font-mono">{lunarPhase.angularSize}"</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Libration</p>
                    <p className="text-white font-mono">
                      {lunarPosition.libration.longitude.toFixed(2)}°, {lunarPosition.libration.latitude.toFixed(2)}°
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="text-yellow-400 w-5 h-5" />
                  <span>Quick Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    onClick={() => onNavigate('eclipses')}
                    className="justify-start h-14"
                  >
                    <Sun className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="font-semibold">Eclipse Finder</p>
                      <p className="text-sm opacity-70">Predict solar & lunar eclipses</p>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => onNavigate('calendar')}
                    variant="secondary"
                    className="justify-start h-14"
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="font-semibold">Lunar Calendar</p>
                      <p className="text-sm opacity-70">Interactive phase calendar</p>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => onNavigate('tracker')}
                    variant="secondary"
                    className="justify-start h-14"
                  >
                    <Satellite className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="font-semibold">Moon Tracker</p>
                      <p className="text-sm opacity-70">Real-time position tracking</p>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => onNavigate('predictor')}
                    variant="secondary"
                    className="justify-start h-14"
                  >
                    <Sun className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="font-semibold">Eclipse Predictor</p>
                      <p className="text-sm opacity-70">Advanced eclipse calculations</p>
                    </div>
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg border border-blue-500/20">
                  <h4 className="text-white font-semibold mb-2">System Status</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ephemeris</span>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Precision</span>
                      <Badge variant="success">High</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coverage</span>
                      <Badge variant="default">1900-2100</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Updates</span>
                      <Badge variant="secondary">Real-time</Badge>
                    </div>
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