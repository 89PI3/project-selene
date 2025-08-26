import { useState, useEffect } from 'react';

export interface DateTimeState {
  current: Date;
  utc: Date;
  local: Date;
  timezone: string;
  julianDay: number;
}

export function useDateTime() {
  const [dateTime, setDateTime] = useState<DateTimeState>(() => {
    const now = new Date();
    return {
      current: now,
      utc: new Date(now.toISOString()),
      local: now,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      julianDay: 0, // Will be calculated
    };
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const jd = 2440587.5 + now.getTime() / 86400000; // Julian Day calculation
      
      setDateTime({
        current: now,
        utc: new Date(now.toISOString()),
        local: now,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        julianDay: jd,
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const setSpecificDate = (date: Date) => {
    const jd = 2440587.5 + date.getTime() / 86400000;
    setDateTime({
      current: date,
      utc: new Date(date.toISOString()),
      local: date,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      julianDay: jd,
    });
  };

  return {
    dateTime,
    setSpecificDate,
  };
}