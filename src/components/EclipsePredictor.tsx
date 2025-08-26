import React, { useState, useMemo } from 'react';
import { Sun, Moon, MapPin, Calendar, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { LunarCalculator } from '../utils/lunarCalculations';

interface EclipsePredictorProps {
  onBack: () => void;
}

export function EclipsePredictor({ onBack }: EclipsePredictorProps) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
  const [filterType, setFilterType] = useState<'all' | 'solar' | 'lunar'>('all');
  const [selectedEclipse, setSelectedEclipse] = useState<any>(null);

  const eclipses = useMemo(() => {
    const predictions = LunarCalculator.getEclipsePredictions(startDate, endDate);
    return filterType === 'all' ? predictions : predictions.filter(e => e.type === filterType);
  }, [startDate, endDate, filterType]);

  const getEclipseDetails = (eclipse: any) => {
    const isTotal = eclipse.magnitude > 1.0;
    const isPartial = eclipse.magnitude < 1.0 && eclipse.magnitude > 0.0;
    
    return {
      classification: isTotal ? 'Total' : isPartial ? 'Partial' : 'Annular',
      safetyLevel: eclipse.type === 'solar' ? 'DANGER - Use proper filters' : 'Safe to observe',
      bestViewingTime: new Date(eclipse.date.getTime() + eclipse.duration * 30000),
      photographyTips: eclipse.type === 'solar' 
        ? 'Use solar filters, never look directly at sun'
        : 'Use telephoto lens, tripod recommended',
    };
  };

  const exportEclipseData = () => {
    const data = eclipses.map(eclipse => ({
      date: eclipse.date.toISOString(),
      type: eclipse.type,
      magnitude: eclipse.magnitude,
      duration: eclipse.duration,
      visibility: eclipse.visibility,
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eclipse-predictions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-red-900">
      <header className="border-b border-gray-700/50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                ←
              </Button>
              <div className="flex items-center space-x-2">
                <Sun className="text-orange-400 w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Eclipse Predictor</h1>
                  <p className="text-sm text-gray-400">Advanced Eclipse Calculations & Predictions</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={exportEclipseData} variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Badge variant="success">{eclipses.length} Eclipses Found</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="text-blue-400 w-5 h-5" />
              <span>Search Parameters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate.toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate.toISOString().split('T')[0]}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Eclipse Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  <option value="all">All Eclipses</option>
                  <option value="solar">Solar Only</option>
                  <option value="lunar">Lunar Only</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full">Update Search</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Eclipse List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Predicted Eclipses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {eclipses.map((eclipse, index) => {
                    const details = getEclipseDetails(eclipse);
                    const Icon = eclipse.type === 'solar' ? Sun : Moon;
                    
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedEclipse(eclipse)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                          selectedEclipse === eclipse
                            ? 'bg-orange-600/20 border-orange-400'
                            : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-6 h-6 ${
                              eclipse.type === 'solar' ? 'text-orange-400' : 'text-gray-300'
                            }`} />
                            <div>
                              <h4 className="text-white font-semibold">
                                {eclipse.type === 'solar' ? 'Solar' : 'Lunar'} Eclipse
                              </h4>
                              <p className="text-gray-300 text-sm">
                                {eclipse.date.toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <Badge variant={details.classification === 'Total' ? 'success' : 'warning'}>
                            {details.classification}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                          <div>
                            <span className="block">Magnitude</span>
                            <span className="text-white">{eclipse.magnitude.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="block">Duration</span>
                            <span className="text-white">{Math.floor(eclipse.duration / 60)}m {eclipse.duration % 60}s</span>
                          </div>
                          <div>
                            <span className="block">Visibility</span>
                            <span className="text-white">{eclipse.visibility}</span>
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
                <CardTitle>Eclipse Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEclipse ? (
                  <div className="space-y-6">
                    {(() => {
                      const details = getEclipseDetails(selectedEclipse);
                      const Icon = selectedEclipse.type === 'solar' ? Sun : Moon;
                      
                      return (
                        <>
                          <div className="text-center pb-4 border-b border-gray-700">
                            <Icon className={`w-16 h-16 mx-auto mb-4 ${
                              selectedEclipse.type === 'solar' ? 'text-orange-400' : 'text-gray-300'
                            }`} />
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {details.classification} {selectedEclipse.type === 'solar' ? 'Solar' : 'Lunar'} Eclipse
                            </h3>
                            <p className="text-gray-300">
                              {selectedEclipse.date.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-gray-400">
                              {selectedEclipse.date.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZoneName: 'short'
                              })}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                              <h4 className="text-white font-semibold mb-2">Technical Data</h4>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-gray-400">Magnitude:</span>
                                  <span className="text-white ml-2">{selectedEclipse.magnitude.toFixed(3)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Duration:</span>
                                  <span className="text-white ml-2">
                                    {Math.floor(selectedEclipse.duration / 60)}m {selectedEclipse.duration % 60}s
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Type:</span>
                                  <span className="text-white ml-2">{details.classification}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Visibility:</span>
                                  <span className="text-white ml-2">{selectedEclipse.visibility}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-yellow-900/20 border border-yellow-600/30 p-4 rounded-lg">
                              <h4 className="text-yellow-300 font-semibold mb-2 flex items-center">
                                ⚠️ Safety Information
                              </h4>
                              <p className="text-yellow-200 text-sm">{details.safetyLevel}</p>
                            </div>

                            <div className="bg-blue-900/20 border border-blue-600/30 p-4 rounded-lg">
                              <h4 className="text-blue-300 font-semibold mb-2 flex items-center">
                                📸 Photography Tips
                              </h4>
                              <p className="text-blue-200 text-sm">{details.photographyTips}</p>
                            </div>

                            <div className="bg-green-900/20 border border-green-600/30 p-4 rounded-lg">
                              <h4 className="text-green-300 font-semibold mb-2">Best Viewing Time</h4>
                              <p className="text-green-200 text-sm">
                                {details.bestViewingTime.toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  timeZoneName: 'short'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-700">
                            <Button className="w-full mb-2">
                              <Calendar className="w-4 h-4 mr-2" />
                              Add to Calendar
                            </Button>
                            <Button variant="secondary" className="w-full">
                              <MapPin className="w-4 h-4 mr-2" />
                              Find Best Viewing Location
                            </Button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sun className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Select an eclipse to view detailed analysis</p>
                    <p className="text-sm text-gray-500">
                      Get technical data, safety information, and viewing recommendations
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