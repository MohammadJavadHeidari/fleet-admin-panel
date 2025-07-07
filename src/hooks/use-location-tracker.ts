import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface LocationError {
  code: number;
  message: string;
}

export interface UseLocationTrackerOptions {
  intervalMs?: number;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface GetLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

// Simple async function to get current location once
export const getCurrentLocationAsync = async (options: GetLocationOptions = {}): Promise<LocationData> => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
  } = options;

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        
        console.log('📍 User Location:', {
          lat: locationData.latitude,
          lng: locationData.longitude,
          accuracy: `${locationData.accuracy}m`,
          time: new Date(locationData.timestamp).toLocaleTimeString(),
        });

        resolve(locationData);
      },
      (error) => {
        console.error('❌ Location Error:', error);
        reject(error);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  });
};

export function useLocationTracker(options: UseLocationTrackerOptions = {}) {
  const {
    intervalMs = 5000, // 5 seconds default
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
  } = options;

  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError({
        code: -1,
        message: 'Geolocation is not supported by this browser.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        
        setLocation(locationData);
        setError(null);
        
        // Log to console as requested
        console.log('📍 User Location:', {
          lat: locationData.latitude,
          lng: locationData.longitude,
          accuracy: `${locationData.accuracy}m`,
          time: new Date(locationData.timestamp).toLocaleTimeString(),
        });
      },
      (geoError) => {
        const locationError: LocationError = {
          code: geoError.code,
          message: geoError.message,
        };
        
        setError(locationError);
        console.error('❌ Location Error:', locationError);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge]);

  const startTracking = useCallback(() => {
    setIsTracking(true);
    // Get location immediately
    getCurrentLocation();
  }, [getCurrentLocation]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isTracking) {
      intervalId = setInterval(getCurrentLocation, intervalMs);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTracking, intervalMs, getCurrentLocation]);

  return {
    location,
    error,
    isTracking,
    startTracking,
    stopTracking,
    getCurrentLocation,
  };
} 