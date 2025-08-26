import { useState, useEffect } from 'react';
import { GeographicLocation } from '../types/astronomical';

const DEFAULT_LOCATION: GeographicLocation = {
  latitude: 40.7128,
  longitude: -74.0060,
  elevation: 10,
  name: 'New York City',
  timezone: 'America/New_York',
};

export function useLocation() {
  const [location, setLocation] = useState<GeographicLocation>(DEFAULT_LOCATION);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          elevation: position.coords.altitude || 0,
          name: 'Current Location',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.warn('Failed to get location:', error);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  return {
    location,
    setLocation,
    requestLocation,
    isLoadingLocation,
  };
}