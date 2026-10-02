import { useState, useCallback } from 'react';

/**
 * Hook for on-demand browser geolocation.
 * Never requests permission automatically on mount.
 */
export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);

  const requestLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error('Geolocation is not supported by your browser.');
        setError(err.message);
        reject(err);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoords(coordinates);
          setLoading(false);
          resolve(coordinates);
        },
        (geoError) => {
          let message = 'Unable to retrieve location.';
          if (geoError.code === geoError.PERMISSION_DENIED) {
            message = 'Location access was denied. Please select a city manually.';
          } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
            message = 'Location information is unavailable.';
          } else if (geoError.code === geoError.TIMEOUT) {
            message = 'The location request timed out. Please try again.';
          }
          setError(message);
          setLoading(false);
          reject(new Error(message));
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    coords,
    loading,
    error,
    requestLocation,
    clearError,
  };
};
