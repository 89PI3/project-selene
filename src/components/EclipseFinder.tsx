import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  MapPin, 
  Clock, 
  Eye,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { generateEclipseEvents } from '../utils/astronomical';

interface EclipseFinderProps {
  onBack: () => void;
}

export function EclipseFinder({ onBack }: EclipseFinderProps) {
  const [selectedType, setSelectedType] = useState<'all' | 'lunar' | 'solar'>('all');
  const [startYear, setStartYear] = useState(2024);
  const [endYear, setEndYear] = useState(2030);
  const [selectedEclipse, setSelectedEclipse] = useState<string | null>(null);

  const eclipseEvents = useMemo(() => {
    return generateEclipseEvents(startYear, endYear);
  }, [startYear, endYear]);

  const filteredEvents = useMemo(() => {
    if (selectedType === 'all') return eclipseEvents;
    return eclipseEvents.filter(event => event.type === selectedType);
  }, [eclipseEvents, selectedType]);

  const getEclipseIcon = (type: 'lunar' | 'solar') => {
    return type === 'lunar' ? Moon : Sun;
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'total': return 'success';
      case 'partial': return 'warning';
      case 'annular': return 'default';
      case 'penumbral': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Sun className="text-yellow-400 w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Eclipse Finder
                  </h1>
                  <p className="text-sm text-gray-400">
                    Solar & Lunar Eclipse Predictions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Badge variant="success">
                {filteredEvents.length} Events Found
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="text-blue-400 w-5 h-5" />
                <span>Filters & Options</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Eclipse Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Eclipses</option>
                    <option value="solar">Solar Only</option>
                    <option value="lunar">Lunar Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={startYear}
                    onChange={(e) => setStartYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={endYear}
                    onChange={(e) => setEndYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <Button className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Eclipse List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Eclipse Events ({startYear}-{endYear})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredEvents.map((eclipse, index) => {
                    const Icon = getEclipseIcon(eclipse.type);
                    const isSelected = selectedEclipse === eclipse.id;
                    
                    return (
                      <div
                        key={eclipse.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-600/20 border-blue-400' 
                            : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:scale-[1.02]'
                        }`}
                        onClick={() => setSelectedEclipse(eclipse.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-6 h-6 ${
                              eclipse.type === 'solar' ? 'text-yellow-400' : 'text-gray-300'
                            }`} />
                            <div>
                              <h4 className="text-white font-semibold">
                                {eclipse.type === 'solar' ? 'Solar' : 'Lunar'} Eclipse
                              </h4>
                              <p className="text-gray-300 text-sm">
                                {formatDate(eclipse.date)} UTC
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={getClassificationColor(eclipse.classification) as any}
                            >
                              {eclipse.classification}
                            </Badge>
                            <p className="text-xs text-gray-400 mt-1">
                              Mag: {eclipse.magnitude.toFixed(3)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {Math.floor(eclipse.duration / 60)}m {eclipse.duration % 60}s
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {eclipse.visibility.regions[0]}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            Global
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Eclipse Details */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Eclipse Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEclipse ? (
                  <div className="space-y-4">
                    {(() => {
                      const eclipse = eclipseEvents.find(e => e.id === selectedEclipse);
                      if (!eclipse) return null;
                      
                      const Icon = getEclipseIcon(eclipse.type);
                      
                      return (
                        <>
                          <div className="text-center pb-4 border-b border-gray-700">
                            <Icon className={`w-12 h-12 mx-auto mb-2 ${
                              eclipse.type === 'solar' ? 'text-yellow-400' : 'text-gray-300'
                            }`} />
                            <h3 className="text-xl font-bold text-white">
                              {eclipse.type === 'solar' ? 'Solar' : 'Lunar'} Eclipse
                            </h3>
                            <p className="text-gray-300">
                              {eclipse.date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-gray-400">Classification</label>
                              <p className="text-white font-medium capitalize">
                                {eclipse.classification}
                              </p>
                            </div>

                            <div>
                              <label className="text-sm text-gray-400">Magnitude</label>
                              <p className="text-white font-medium">
                                {eclipse.magnitude.toFixed(3)}
                              </p>
                            </div>

                            <div>
                              <label className="text-sm text-gray-400">Duration</label>
                              <p className="text-white font-medium">
                                {Math.floor(eclipse.duration / 60)}m {eclipse.duration % 60}s
                              </p>
                            </div>

                            <div>
                              <label className="text-sm text-gray-400">Visibility</label>
                              <div className="space-y-1">
                                {eclipse.visibility.regions.map((region, i) => (
                                  <Badge key={i} variant="secondary">
                                    {region}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {eclipse.contacts.c1 && (
                              <div>
                                <label className="text-sm text-gray-400">Contact Times (UTC)</label>
                                <div className="space-y-1 text-sm">
                                  <p>C1: {eclipse.contacts.c1.toLocaleTimeString('en-US', { hour12: false })}</p>
                                  {eclipse.contacts.c2 && (
                                    <p>C2: {eclipse.contacts.c2.toLocaleTimeString('en-US', { hour12: false })}</p>
                                  )}
                                  {eclipse.contacts.c3 && (
                                    <p>C3: {eclipse.contacts.c3.toLocaleTimeString('en-US', { hour12: false })}</p>
                                  )}
                                  {eclipse.contacts.c4 && (
                                    <p>C4: {eclipse.contacts.c4.toLocaleTimeString('en-US', { hour12: false })}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-4 border-t border-gray-700">
                            <Button className="w-full">
                              View Path Map
                            </Button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sun className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Select an eclipse from the list to view detailed information
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}