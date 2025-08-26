import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { LunarCalculator } from '../utils/lunarCalculations';

interface LunarCalendarProps {
  onBack: () => void;
}

export function LunarCalendar({ onBack }: LunarCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const calendarData = useMemo(() => {
    return LunarCalculator.getLunarCalendar(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
  }, [currentDate]);

  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    return LunarCalculator.getAdvancedLunarData(selectedDate, 40.7128, -74.0060);
  }, [selectedDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getMoonIcon = (illumination: number) => {
    if (illumination < 12.5) return '🌑';
    if (illumination < 37.5) return '🌒';
    if (illumination < 62.5) return '🌓';
    if (illumination < 87.5) return '🌔';
    if (illumination < 100) return '🌕';
    return '🌕';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <header className="border-b border-gray-700/50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Calendar className="text-blue-400 w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Lunar Calendar</h1>
                  <p className="text-sm text-gray-400">Interactive Moon Phase Calendar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="ghost" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
                    <div key={i} className="h-16"></div>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarData.map((dayData) => (
                    <button
                      key={dayData.day}
                      onClick={() => setSelectedDate(dayData.date)}
                      className={`h-16 p-2 rounded-lg border transition-all hover:scale-105 ${
                        selectedDate?.toDateString() === dayData.date.toDateString()
                          ? 'bg-blue-600 border-blue-400'
                          : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="text-sm font-medium text-white">{dayData.day}</div>
                      <div className="text-xs">{getMoonIcon(dayData.illumination)}</div>
                      <div className="text-xs text-gray-400">{Math.round(dayData.illumination)}%</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Day Details */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Day Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDayData ? (
                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-gray-700">
                      <div className="text-4xl mb-2">
                        {getMoonIcon(selectedDayData.moonPhase.illumination)}
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {selectedDayData.moonPhase.phaseName}
                      </h3>
                      <p className="text-gray-300">
                        {selectedDate?.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400">Illumination</label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${selectedDayData.moonPhase.illumination}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">
                            {Math.round(selectedDayData.moonPhase.illumination)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Moon Rise/Set</label>
                        <div className="space-y-1 text-sm">
                          <p className="text-white">
                            Rise: {selectedDayData.moonTimes.rise?.toLocaleTimeString() || 'N/A'}
                          </p>
                          <p className="text-white">
                            Set: {selectedDayData.moonTimes.set?.toLocaleTimeString() || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Position</label>
                        <div className="space-y-1 text-sm">
                          <p className="text-white">
                            Altitude: {selectedDayData.moonPosition.altitude.toFixed(1)}°
                          </p>
                          <p className="text-white">
                            Azimuth: {selectedDayData.moonPosition.azimuth.toFixed(1)}°
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Tides</label>
                        <div className="space-y-1 text-sm">
                          <p className="text-white">
                            Next High: {selectedDayData.tides.nextHigh?.toLocaleTimeString() || 'N/A'}
                          </p>
                          <p className="text-white">
                            Next Low: {selectedDayData.tides.nextLow?.toLocaleTimeString() || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Moon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Select a date to view detailed lunar information
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