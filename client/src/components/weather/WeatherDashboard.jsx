import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  CloudRain, 
  MapPin, 
  Navigation, 
  Sun, 
  Cloud, 
  AlertCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useWeather } from '../../hooks/useWeather';
import { useGeolocation } from '../../hooks/useGeolocation';

export const WeatherDashboard = () => {
  const { t } = useTranslation(['home']);
  const {
    weatherData,
    loading,
    error: weatherError,
    searchResults,
    searchLoading,
    fetchWeatherForCoords,
    searchCity,
    selectCity,
    clearSearchResults,
    refreshWeather,
  } = useWeather();

  const {
    loading: geoLoading,
    error: geoError,
    requestLocation,
    clearError: clearGeoError,
  } = useGeolocation();

  const [cityQuery, setCityQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  const handleUseMyLocation = async () => {
    clearGeoError();
    setSuccessNotice('');
    try {
      const coords = await requestLocation();
      await fetchWeatherForCoords(coords.latitude, coords.longitude);
      setSuccessNotice('Detected real-time meteorological data for your coordinates.');
      setTimeout(() => setSuccessNotice(''), 4500);
    } catch {
      // geoError hook catches permission denied or timeout
    }
  };

  const handleCitySearchInput = (e) => {
    const val = e.target.value;
    setCityQuery(val);
    searchCity(val);
  };

  const handleCitySelect = (item) => {
    selectCity(item);
    setCityQuery('');
    setShowSearch(false);
  };

  const getWeatherIcon = (iconName) => {
    switch (iconName) {
      case 'sunny':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'cloudy':
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'partly-cloudy':
      default:
        return <CloudSun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between border-agri-border/80 dark:border-[#21453A] shadow-card-subtle bg-white dark:bg-[#112D25] relative overflow-hidden transition-colors">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-agri-teal animate-pulse" />
              <h3 className="text-xl font-bold text-agri-textDark dark:text-[#F3FAF7]">
                {t('weather.title', { defaultValue: 'Weather Near You' })}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-agri-textSecondary dark:text-[#A8C2B8] mt-0.5">
              {t('weather.subtitle', { defaultValue: 'Real-time agro-meteorological forecast from Open-Meteo for better crop decisions.' })}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-xl border transition-colors ${
                showSearch
                  ? 'bg-agri-primary text-white border-agri-primary'
                  : 'text-agri-textSecondary hover:text-agri-primary hover:bg-agri-softGreen border-gray-200'
              }`}
              title="Search City"
              aria-label="Search City"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={handleUseMyLocation}
              disabled={geoLoading || loading}
              className="p-2 text-agri-textSecondary hover:text-agri-primary hover:bg-agri-softGreen rounded-xl border border-gray-200 transition-colors disabled:opacity-50"
              title="Detect GPS Location"
              aria-label="Detect GPS Location"
            >
              <Navigation className={`w-4 h-4 ${geoLoading ? 'animate-spin text-agri-primary' : ''}`} />
            </button>

            {weatherData && (
              <button
                onClick={refreshWeather}
                disabled={loading}
                className="p-2 text-agri-textSecondary hover:text-agri-primary hover:bg-agri-softGreen rounded-xl border border-gray-200 transition-colors"
                title="Refresh Live Forecast"
                aria-label="Refresh Live Forecast"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-agri-primary' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* City Search Bar Dropdown */}
        {showSearch && (
          <div className="relative mb-5 animate-fadeIn">
            <div className="flex items-center gap-2 p-2 bg-gray-50 border border-agri-border rounded-xl">
              <Search className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
              <input
                type="text"
                autoFocus
                placeholder="Type city name (e.g. Ahmedabad, Pune, Nashik, Karnal)..."
                value={cityQuery}
                onChange={handleCitySearchInput}
                className="w-full bg-transparent text-sm text-agri-textDark placeholder:text-gray-400 focus:outline-none"
              />
              {cityQuery && (
                <button
                  onClick={() => {
                    setCityQuery('');
                    clearSearchResults();
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {searchLoading && (
              <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border border-agri-border rounded-xl shadow-lg z-30 text-xs text-agri-textSecondary flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-agri-primary" />
                <span>Searching Open-Meteo geocoding database...</span>
              </div>
            )}

            {searchResults.length > 0 && !searchLoading && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-agri-border rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto divide-y divide-gray-100">
                {searchResults.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-agri-softGreen/60 text-agri-textDark flex items-center justify-between transition-colors"
                  >
                    <span className="font-semibold">{city.displayName}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notices and Error Messages */}
        {geoError && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-agri-orange shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{geoError}</p>
              <p className="mt-0.5 text-amber-700">
                {t('weather.permissionDenied', { defaultValue: 'Location access is disabled. Search for your city to see local weather.' })}
              </p>
            </div>
          </div>
        )}

        {successNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-agri-success shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {weatherError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-agri-danger shrink-0 mt-0.5" />
            <span>{weatherError}</span>
          </div>
        )}

        {/* SKELETON / LOADING STATE */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center text-agri-textSecondary">
            <RefreshCw className="w-8 h-8 text-agri-primary animate-spin mb-3" />
            <p className="text-sm font-semibold text-agri-textDark">
              {t('weather.loading', { defaultValue: 'Fetching live meteorological satellite telemetry...' })}
            </p>
            <p className="text-xs text-gray-400 mt-1">Connecting to Open-Meteo satellite feed</p>
          </div>
        )}

        {/* NO WEATHER DETECTED YET - PROMPT CARD */}
        {!loading && !weatherData && (
          <div className="bg-gradient-to-br from-agri-softGreen/50 via-white to-agri-softBlue/40 rounded-2xl p-7 text-center border border-agri-primary/20">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-agri-border mx-auto flex items-center justify-center text-agri-primary mb-4">
              <CloudSun className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-agri-textDark mb-1.5">
              Live Satellite Weather Telemetry
            </h4>
            <p className="text-xs text-agri-textSecondary max-w-sm mx-auto mb-6">
              AgriNova uses real-time GPS coordinate telemetry from Open-Meteo without any simulated data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                icon={Navigation}
                onClick={handleUseMyLocation}
                loading={geoLoading}
                className="font-bold shadow-sm"
              >
                {t('weather.useMyLocation', { defaultValue: 'Use My Location' })}
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Search}
                onClick={() => setShowSearch(true)}
              >
                Search City
              </Button>
            </div>
          </div>
        )}

        {/* LIVE REAL WEATHER DISPLAY */}
        {!loading && weatherData && (
          <div>
            <div className="bg-gradient-to-br from-agri-softGreen/80 via-white to-agri-softBlue/60 dark:from-[#0D241E] dark:via-[#112D25] dark:to-[#0D241E] rounded-2xl p-5 border border-agri-primary/15 dark:border-[#21453A] mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#071A16] shadow-sm border border-agri-border dark:border-[#21453A] flex items-center justify-center shrink-0">
                    <CloudSun className="w-10 h-10 text-agri-primary dark:text-[#27C58B]" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-agri-textDark dark:text-[#F3FAF7] tracking-tight">
                        {weatherData.temperature}°C
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-agri-dark dark:text-[#63DBAE] bg-agri-softGreen dark:bg-[#0D241E] px-2.5 py-0.5 rounded-md border border-agri-primary/20 dark:border-[#21453A]">
                        {weatherData.condition}
                      </span>
                    </div>
                    <p className="text-xs text-agri-textSecondary dark:text-[#A8C2B8] mt-1 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-agri-primary dark:text-[#27C58B] shrink-0" />
                      <span className="truncate max-w-[240px] sm:max-w-xs">{weatherData.location}</span>
                    </p>
                  </div>
                </div>

                {/* 3 Metrics: Humidity, Wind, Rain */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white/90 dark:bg-[#071A16]/90 backdrop-blur-sm p-3 rounded-xl border border-agri-border/60 dark:border-[#21453A]">
                  <div className="text-center px-1">
                    <div className="flex items-center justify-center text-blue-500 mb-1">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] text-agri-textSecondary dark:text-[#A8C2B8]">{t('weather.humidity', { defaultValue: 'Humidity' })}</div>
                    <div className="text-xs font-bold text-agri-textDark dark:text-[#F3FAF7]">{weatherData.humidity}%</div>
                  </div>
                  <div className="text-center px-1 border-x border-gray-100 dark:border-[#21453A]">
                    <div className="flex items-center justify-center text-teal-600 dark:text-[#63DBAE] mb-1">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] text-agri-textSecondary dark:text-[#A8C2B8]">{t('weather.wind', { defaultValue: 'Wind' })}</div>
                    <div className="text-xs font-bold text-agri-textDark dark:text-[#F3FAF7]">{weatherData.windSpeed} km/h</div>
                  </div>
                  <div className="text-center px-1">
                    <div className="flex items-center justify-center text-indigo-500 mb-1">
                      <CloudRain className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] text-agri-textSecondary dark:text-[#A8C2B8]">{t('weather.rainChance', { defaultValue: 'Rain Chance' })}</div>
                    <div className="text-xs font-bold text-agri-textDark dark:text-[#F3FAF7]">{weatherData.rainProbability}%</div>
                  </div>
                </div>
              </div>

              {/* Crop Advisory */}
              {weatherData.advisory && (
                <div className="mt-4 pt-3 border-t border-agri-primary/10 dark:border-[#21453A] flex items-start gap-2 text-xs text-agri-dark dark:text-[#63DBAE] font-medium">
                  <span className="px-1.5 py-0.5 bg-agri-primary dark:bg-[#27C58B] text-white dark:text-[#071A16] text-[10px] rounded font-bold uppercase shrink-0">
                    {t('weather.advisoryLabel', { defaultValue: 'Advisory' })}
                  </span>
                  <span>{weatherData.advisory}</span>
                </div>
              )}
            </div>

            {/* 5-Day Forecast Cards */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-agri-textSecondary dark:text-[#A8C2B8] mb-3">
                {t('weather.forecastTitle', { defaultValue: '5-Day Agricultural Forecast' })}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {weatherData.forecast?.map((dayItem, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center p-2.5 rounded-xl border transition-all text-center ${
                      index === 0
                        ? 'bg-agri-softGreen/50 dark:bg-[#0D241E] border-agri-primary/30 dark:border-[#27C58B]/40 shadow-xs'
                        : 'bg-gray-50/70 dark:bg-[#0D241E]/60 border-gray-100 dark:border-[#21453A] hover:bg-white dark:hover:bg-[#112D25]'
                    }`}
                  >
                    <span className="text-xs font-bold text-agri-textDark dark:text-[#F3FAF7] mb-1">
                      {index === 0 ? t('weather.today', { defaultValue: 'Today' }) : dayItem.day}
                    </span>
                    <div className="my-1">{getWeatherIcon(dayItem.icon)}</div>
                    <span className="text-sm font-extrabold text-agri-textDark dark:text-[#F3FAF7]">{dayItem.temp}°</span>
                    <span className="text-[10px] text-agri-textSecondary dark:text-[#A8C2B8] font-medium">{dayItem.minTemp}°</span>
                    <span className="text-[10px] text-blue-600 dark:text-[#63DBAE] font-semibold mt-1">
                      {dayItem.rain}% rain
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer attribution */}
      <div className="mt-6 pt-3 border-t border-agri-border/60 flex items-center justify-between text-[11px] text-agri-textSecondary">
        <span>Feed: Open-Meteo Satellite Model</span>
        <span className="text-agri-primary font-semibold">
          {weatherData ? `Updated ${weatherData.lastUpdated}` : 'GPS Telemetry'}
        </span>
      </div>
    </Card>
  );
};
