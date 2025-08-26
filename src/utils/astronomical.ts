import { LunarPhase, LunarPosition, EclipseEvent } from '../types/astronomical';

// Astronomical constants
export const CONSTANTS = {
  LUNAR_CYCLE: 29.530588853, // days
  EARTH_RADIUS: 6371, // km
  MOON_RADIUS: 1737.4, // km
  ASTRONOMICAL_UNIT: 149597870.7, // km
  DEGREES_TO_RADIANS: Math.PI / 180,
  RADIANS_TO_DEGREES: 180 / Math.PI,
};

// Convert date to Julian Day Number
export function dateToJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;
  
  const jdn = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
              Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  const jd = jdn + (date.getHours() - 12) / 24 + date.getMinutes() / 1440 + 
             date.getSeconds() / 86400 + date.getMilliseconds() / 86400000;
  
  return jd;
}

// Calculate lunar age in days since new moon
export function calculateLunarAge(date: Date): number {
  const jd = dateToJulianDay(date);
  const newMoonJD = 2451549.5; // J2000.0 reference new moon
  const daysSince = jd - newMoonJD;
  const cycles = daysSince / CONSTANTS.LUNAR_CYCLE;
  return (cycles - Math.floor(cycles)) * CONSTANTS.LUNAR_CYCLE;
}

// Calculate moon phase and illumination
export function calculateLunarPhase(date: Date): LunarPhase {
  const age = calculateLunarAge(date);
  const phase = age / CONSTANTS.LUNAR_CYCLE; // 0 to 1
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2 * 100;
  
  // Determine phase name
  let phaseName: string;
  if (phase < 0.0625 || phase >= 0.9375) phaseName = 'New Moon';
  else if (phase < 0.1875) phaseName = 'Waxing Crescent';
  else if (phase < 0.3125) phaseName = 'First Quarter';
  else if (phase < 0.4375) phaseName = 'Waxing Gibbous';
  else if (phase < 0.5625) phaseName = 'Full Moon';
  else if (phase < 0.6875) phaseName = 'Waning Gibbous';
  else if (phase < 0.8125) phaseName = 'Last Quarter';
  else phaseName = 'Waning Crescent';
  
  // Calculate approximate distance (simplified)
  const meanDistance = 384400; // km
  const distance = meanDistance + 20000 * Math.sin(2 * Math.PI * phase);
  const angularSize = 2 * Math.atan(CONSTANTS.MOON_RADIUS / distance) * CONSTANTS.RADIANS_TO_DEGREES * 3600; // arcseconds
  
  return {
    name: phaseName,
    illumination: Math.round(illumination * 10) / 10,
    age: Math.round(age * 10) / 10,
    phase: Math.round(phase * 1000) / 1000,
    distance: Math.round(distance),
    angularSize: Math.round(angularSize * 10) / 10,
  };
}

// Calculate lunar position (simplified)
export function calculateLunarPosition(date: Date, latitude: number, longitude: number): LunarPosition {
  const jd = dateToJulianDay(date);
  const t = (jd - 2451545.0) / 36525; // centuries since J2000.0
  
  // Simplified lunar position calculation (more complex algorithms needed for high precision)
  const l = 218.3164477 + 481267.88123421 * t; // mean longitude
  const m = 134.9633964 + 477198.8675055 * t; // mean anomaly
  
  const longitude_deg = l + 6.288774 * Math.sin(m * CONSTANTS.DEGREES_TO_RADIANS);
  const latitude_deg = 5.128122 * Math.sin((93.2720950 + 483202.0175233 * t) * CONSTANTS.DEGREES_TO_RADIANS);
  
  // Convert to RA/Dec (simplified)
  const ra = longitude_deg % 360;
  const dec = latitude_deg;
  
  // Approximate distance
  const distance = 385000 - 20905 * Math.cos(m * CONSTANTS.DEGREES_TO_RADIANS);
  
  return {
    ra: ra,
    dec: dec,
    azimuth: 0, // Would need full coordinate transformation
    elevation: 0,
    distance: Math.round(distance),
    parallax: Math.asin(CONSTANTS.EARTH_RADIUS / distance) * CONSTANTS.RADIANS_TO_DEGREES,
    libration: {
      longitude: 0, // Simplified
      latitude: 0,
    },
  };
}

// Generate sample eclipse events
export function generateEclipseEvents(startYear: number, endYear: number): EclipseEvent[] {
  const events: EclipseEvent[] = [];
  
  // Sample eclipse data (in real implementation, this would use precise calculations)
  const sampleEclipses = [
    {
      date: new Date('2024-03-25T07:00:00Z'),
      type: 'lunar' as const,
      classification: 'penumbral' as const,
      magnitude: 0.95,
      duration: 280,
    },
    {
      date: new Date('2024-04-08T18:17:00Z'),
      type: 'solar' as const,
      classification: 'total' as const,
      magnitude: 1.057,
      duration: 268,
    },
    {
      date: new Date('2024-09-18T02:44:00Z'),
      type: 'lunar' as const,
      classification: 'partial' as const,
      magnitude: 0.083,
      duration: 183,
    },
    {
      date: new Date('2024-10-02T18:45:00Z'),
      type: 'solar' as const,
      classification: 'annular' as const,
      magnitude: 0.932,
      duration: 445,
    },
  ];
  
  sampleEclipses.forEach((eclipse, index) => {
    if (eclipse.date.getFullYear() >= startYear && eclipse.date.getFullYear() <= endYear) {
      events.push({
        id: `eclipse-${index + 1}`,
        ...eclipse,
        visibility: {
          regions: eclipse.type === 'solar' ? ['North America', 'Pacific'] : ['Global'],
        },
        contacts: {
          c1: new Date(eclipse.date.getTime() - 60 * 60000),
          c2: eclipse.classification === 'total' ? new Date(eclipse.date.getTime() - 30 * 60000) : undefined,
          c3: eclipse.classification === 'total' ? new Date(eclipse.date.getTime() + 30 * 60000) : undefined,
          c4: new Date(eclipse.date.getTime() + 60 * 60000),
        },
      });
    }
  });
  
  return events;
}

// Calculate next phase
export function getNextPhase(currentPhase: LunarPhase, currentDate: Date): { name: string; date: Date } {
  const phases = ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'];
  const currentIndex = phases.findIndex(p => currentPhase.name.includes(p.split(' ')[0]) || currentPhase.name.includes(p.split(' ')[1]));
  const nextIndex = (currentIndex + 1) % 4;
  const nextPhaseName = phases[nextIndex];
  
  const daysToNext = CONSTANTS.LUNAR_CYCLE / 4 - (currentPhase.age % (CONSTANTS.LUNAR_CYCLE / 4));
  const nextDate = new Date(currentDate.getTime() + daysToNext * 24 * 60 * 60 * 1000);
  
  return {
    name: nextPhaseName,
    date: nextDate,
  };
}