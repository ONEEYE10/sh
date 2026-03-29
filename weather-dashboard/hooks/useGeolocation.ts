'use client';

import { useState } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation is not supported by your browser.' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      position => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      err => {
        let message = 'Unable to retrieve your location.';
        if (err.code === 1) message = 'Location permission denied.';
        else if (err.code === 2) message = 'Location unavailable.';
        else if (err.code === 3) message = 'Location request timed out.';
        setState(prev => ({ ...prev, error: message, loading: false }));
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  };

  return { ...state, getLocation };
}
