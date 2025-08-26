import SunCalc from 'suncalc';

export interface AdvancedLunarData {
  moonPhase: {
    phase: number;
    illumination: number;
    angle: number;
    fraction: number;
    phaseName: string;
  };
  moonPosition: {
    azimuth: number;
    altitude: number;
    distance: number;
    parallacticAngle: number;
  };
  moonTimes: {
    rise: Date | null;
    set: Date | null;
    alwaysUp: boolean;
    alwaysDown: boolean;
  };
  tides: {
    high: Date[];
    low: Date[];
    nextHigh: Date | null;
    nextLow: Date | null;
  };
}

export class LunarCalculator {
  static getAdvancedLunarData(date: Date, lat: number, lng: number): AdvancedLunarData {
    const moonIllumination = SunCalc.getMoonIllumination(date);
    const moonPosition = SunCalc.getMoonPosition(date, lat, lng);
    const moonTimes = SunCalc.getMoonTimes(date, lat, lng);

    // Calculate phase name
    const phaseName = this.getPhaseName(moonIllumination.phase);

    // Calculate tides (simplified tidal calculation)
    const tides = this.calculateTides(date, lat, lng);

    return {
      moonPhase: {
        phase: moonIllumination.phase,
        illumination: moonIllumination.fraction * 100,
        angle: moonIllumination.angle,
        fraction: moonIllumination.fraction,
        phaseName,
      },
      moonPosition: {
        azimuth: moonPosition.azimuth * 180 / Math.PI,
        altitude: moonPosition.altitude * 180 / Math.PI,
        distance: moonPosition.distance,
        parallacticAngle: moonPosition.parallacticAngle * 180 / Math.PI,
      },
      moonTimes: {
        rise: moonTimes.rise || null,
        set: moonTimes.set || null,
        alwaysUp: moonTimes.alwaysUp || false,
        alwaysDown: moonTimes.alwaysDown || false,
      },
      tides,
    };
  }

  static getPhaseName(phase: number): string {
    const phaseNames = [
      'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
      'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
    ];
    const index = Math.round(phase * 8) % 8;
    return phaseNames[index];
  }

  static calculateTides(date: Date, lat: number, lng: number) {
    const moonPosition = SunCalc.getMoonPosition(date, lat, lng);
    const sunPosition = SunCalc.getPosition(date, lat, lng);
    
    // Simplified tidal calculation based on moon and sun positions
    const tides = {
      high: [] as Date[],
      low: [] as Date[],
      nextHigh: null as Date | null,
      nextLow: null as Date | null,
    };

    // Calculate tidal times for the next 24 hours
    for (let hour = 0; hour < 24; hour += 6) {
      const tideTime = new Date(date.getTime() + hour * 60 * 60 * 1000);
      const moonPos = SunCalc.getMoonPosition(tideTime, lat, lng);
      
      // High tide occurs roughly when moon is overhead or opposite
      const moonAltitude = moonPos.altitude * 180 / Math.PI;
      
      if (hour % 12 === 0) {
        tides.high.push(tideTime);
        if (!tides.nextHigh && tideTime > date) {
          tides.nextHigh = tideTime;
        }
      } else if (hour % 12 === 6) {
        tides.low.push(tideTime);
        if (!tides.nextLow && tideTime > date) {
          tides.nextLow = tideTime;
        }
      }
    }

    return tides;
  }

  static getLunarCalendar(year: number, month: number) {
    const calendar = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const moonData = SunCalc.getMoonIllumination(date);
      
      calendar.push({
        date,
        day,
        phase: moonData.phase,
        illumination: moonData.fraction * 100,
        phaseName: this.getPhaseName(moonData.phase),
      });
    }
    
    return calendar;
  }

  static getEclipsePredictions(startDate: Date, endDate: Date) {
    const eclipses = [];
    const current = new Date(startDate);
    
    // Real eclipse calculation would be much more complex
    // This is a simplified version for demonstration
    while (current <= endDate) {
      const moonPhase = SunCalc.getMoonIllumination(current);
      
      // Check for potential eclipses (simplified)
      if (Math.abs(moonPhase.phase) < 0.05 || Math.abs(moonPhase.phase - 0.5) < 0.05) {
        const isLunar = Math.abs(moonPhase.phase - 0.5) < 0.05;
        
        eclipses.push({
          date: new Date(current),
          type: isLunar ? 'lunar' : 'solar',
          magnitude: 0.5 + Math.random() * 0.5,
          duration: 60 + Math.random() * 180,
          visibility: isLunar ? 'Global' : 'Regional',
        });
      }
      
      current.setDate(current.getDate() + 14); // Check every 2 weeks
    }
    
    return eclipses;
  }

  static getMoonDistanceHistory(days: number = 30) {
    const history = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const position = SunCalc.getMoonPosition(date, 0, 0);
      
      history.push({
        date,
        distance: position.distance,
        altitude: position.altitude * 180 / Math.PI,
      });
    }
    
    return history;
  }
}