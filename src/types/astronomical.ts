export interface LunarPhase {
  name: string;
  illumination: number;
  age: number;
  phase: number;
  distance: number;
  angularSize: number;
  nextPhase?: {
    name: string;
    date: Date;
  };
}

export interface EclipseEvent {
  id: string;
  type: 'lunar' | 'solar';
  classification: 'total' | 'partial' | 'annular' | 'hybrid' | 'penumbral';
  date: Date;
  magnitude: number;
  duration: number;
  visibility: {
    regions: string[];
    coordinates?: [number, number][];
  };
  contacts: {
    c1?: Date;
    c2?: Date;
    c3?: Date;
    c4?: Date;
  };
}

export interface GeographicLocation {
  latitude: number;
  longitude: number;
  elevation: number;
  name: string;
  timezone: string;
}

export interface LunarPosition {
  ra: number; // Right ascension
  dec: number; // Declination
  azimuth: number;
  elevation: number;
  distance: number; // km
  parallax: number;
  libration: {
    longitude: number;
    latitude: number;
  };
}

export interface TimeData {
  utc: Date;
  local: Date;
  jd: number; // Julian Day
  deltaT: number;
}