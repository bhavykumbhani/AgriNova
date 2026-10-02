import { useState, useEffect, useCallback } from 'react';
import { weatherService } from '../services/weatherService';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(() => weatherService.getCachedWeather());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch weather for coordinates
  const fetchWeatherForCoords = useCallback(async (latitude, longitude, customName = null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.fetchLiveWeather(latitude, longitude, customName);
      setWeatherData(data);
      return data;
    } catch (err) {
      setError(err?.message || 'Failed to fetch live meteorological data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search city
  const searchCity = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setSearchLoading(true);
      const results = await weatherService.searchCity(query);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const selectCity = useCallback(
    async (cityItem) => {
      setSearchResults([]);
      await fetchWeatherForCoords(cityItem.latitude, cityItem.longitude, cityItem.displayName);
    },
    [fetchWeatherForCoords]
  );

  return {
    weatherData,
    loading,
    error,
    searchResults,
    searchLoading,
    fetchWeatherForCoords,
    searchCity,
    selectCity,
    clearSearchResults: () => setSearchResults([]),
    refreshWeather: () => {
      if (weatherData?.latitude && weatherData?.longitude) {
        fetchWeatherForCoords(weatherData.latitude, weatherData.longitude, weatherData.location);
      }
    },
  };
};
