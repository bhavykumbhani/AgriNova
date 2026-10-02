import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Check, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { weatherService } from '../../services/weatherService';
import { useGeolocation } from '../../hooks/useGeolocation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet standard marker icon paths in Vite bundles
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const LocationPicker = ({
  locationData = {},
  onChange,
  required = false,
  error,
}) => {
  const { t } = useTranslation(['auth']);
  const { loading: geoLoading, error: geoError, requestLocation } = useGeolocation();

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Current coords (defaults to central India if empty)
  const currentLat = locationData.latitude || 22.2587;
  const currentLng = locationData.longitude || 71.1924;

  // Handle GPS detection
  const handleDetectGPS = async () => {
    try {
      setReverseLoading(true);
      const coords = await requestLocation();
      const geoInfo = await weatherService.reverseGeocode(coords.latitude, coords.longitude);
      
      const newLoc = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        city: geoInfo.city || '',
        state: geoInfo.state || '',
        country: geoInfo.country || 'India',
        formatted_address: geoInfo.formatted || '',
      };

      onChange(newLoc);

      if (mapInstanceRef.current && markerRef.current) {
        mapInstanceRef.current.setView([coords.latitude, coords.longitude], 13);
        markerRef.current.setLatLng([coords.latitude, coords.longitude]);
      }
    } catch {
      // geoError handled in hook
    } finally {
      setReverseLoading(false);
    }
  };

  // Initialize Leaflet Map when modal opens
  useEffect(() => {
    if (!isMapOpen || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([currentLat, currentLng], locationData.latitude ? 13 : 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const customLeafletIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color:#149966;width:24px;height:24px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([currentLat, currentLng], {
        draggable: true,
        icon: customLeafletIcon,
      }).addTo(map);

      // On marker drag end
      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        setReverseLoading(true);
        const geoInfo = await weatherService.reverseGeocode(pos.lat, pos.lng);
        onChange({
          latitude: pos.lat,
          longitude: pos.lng,
          city: geoInfo.city || '',
          state: geoInfo.state || '',
          country: geoInfo.country || 'India',
          formatted_address: geoInfo.formatted || '',
        });
        setReverseLoading(false);
      });

      // On map click
      map.on('click', async (e) => {
        marker.setLatLng(e.latlng);
        setReverseLoading(true);
        const geoInfo = await weatherService.reverseGeocode(e.latlng.lat, e.latlng.lng);
        onChange({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          city: geoInfo.city || '',
          state: geoInfo.state || '',
          country: geoInfo.country || 'India',
          formatted_address: geoInfo.formatted || '',
        });
        setReverseLoading(false);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.invalidateSize();
      mapInstanceRef.current.setView([currentLat, currentLng], 13);
      markerRef.current.setLatLng([currentLat, currentLng]);
    }

    return () => {
      // clean up on unmount
    };
  }, [isMapOpen, currentLat, currentLng, locationData.latitude, onChange]);

  // Clean map instance when modal unmounts
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Search city / village in map modal
  const handleMapSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const results = await weatherService.searchCity(searchQuery.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectSearchResult = async (item) => {
    setSearchResults([]);
    setSearchQuery('');
    setReverseLoading(true);
    const geoInfo = await weatherService.reverseGeocode(item.latitude, item.longitude);
    onChange({
      latitude: item.latitude,
      longitude: item.longitude,
      city: item.name || geoInfo.city || '',
      state: item.admin1 || geoInfo.state || '',
      country: item.country || 'India',
      formatted_address: item.displayName || geoInfo.formatted || '',
    });
    setReverseLoading(false);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([item.latitude, item.longitude], 13);
      markerRef.current.setLatLng([item.latitude, item.longitude]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-semibold text-agri-textDark flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-agri-primary" />
          <span>Farm Location {required && <span className="text-agri-danger">*</span>}</span>
        </label>
      </div>

      {/* Action Buttons: GPS + Map Picker */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          icon={Navigation}
          onClick={handleDetectGPS}
          loading={geoLoading || reverseLoading}
          className="flex-1 justify-center py-2.5 font-bold border-agri-primary text-agri-primary hover:bg-agri-softGreen"
        >
          {t('farmerReg.useGps', { defaultValue: 'Use My Current Location' })}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="md"
          icon={MapPin}
          onClick={() => setIsMapOpen(true)}
          className="flex-1 justify-center py-2.5 font-bold"
        >
          {t('farmerReg.chooseOnMap', { defaultValue: 'Choose on Map' })}
        </Button>
      </div>

      {/* Detected Location Info Card */}
      {locationData.formatted_address ? (
        <div className="p-3.5 rounded-xl bg-agri-softGreen/40 border border-agri-primary/30 flex items-start justify-between gap-3 animate-fadeIn">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-agri-dark">
              {t('farmerReg.detectedLocation', { defaultValue: 'Detected Location' })}
            </div>
            <p className="text-sm font-bold text-agri-textDark mt-0.5">
              {locationData.formatted_address}
            </p>
            {locationData.latitude && (
              <p className="text-xs text-agri-textSecondary mt-0.5 font-mono">
                {locationData.latitude.toFixed(4)}°N, {locationData.longitude.toFixed(4)}°E
              </p>
            )}
          </div>
          <span className="w-6 h-6 rounded-full bg-agri-primary text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        </div>
      ) : null}

      {/* GPS Error */}
      {geoError && (
        <p className="text-xs text-agri-danger flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {geoError}
        </p>
      )}

      {error && !geoError && (
        <p className="text-xs text-agri-danger font-medium">{error}</p>
      )}

      {/* Interactive Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-agri-textDark/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-agri-border overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-agri-border">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-agri-primary" />
                <h3 className="text-base font-bold text-agri-textDark">
                  Select Location on Map
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className="p-1 text-gray-400 hover:text-agri-textDark rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Search Bar */}
            <div className="p-4 border-b border-agri-border bg-gray-50 relative">
              <form onSubmit={handleMapSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search village, taluka, district or city (e.g. Nashik, Junagadh)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-agri-border bg-white focus:outline-none focus:ring-2 focus:ring-agri-primary"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  loading={searching}
                  className="font-bold px-4"
                >
                  Search
                </Button>
              </form>

              {/* Autocomplete List */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-agri-border rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto divide-y divide-gray-100">
                  {searchResults.map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => selectSearchResult(res)}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-agri-softGreen flex items-center justify-between text-agri-textDark"
                    >
                      <span className="font-semibold">{res.displayName}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Map Canvas */}
            <div className="relative flex-1 min-h-[320px] w-full">
              <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
              {reverseLoading && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 px-3 py-1.5 rounded-full shadow-md text-xs font-semibold text-agri-primary flex items-center gap-1.5 z-10 border border-agri-border">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating address details...</span>
                </div>
              )}
            </div>

            {/* Footer with confirmation */}
            <div className="p-4 bg-gray-50 border-t border-agri-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-agri-textSecondary text-left w-full sm:w-auto">
                <span className="font-semibold text-agri-textDark block truncate max-w-sm">
                  {locationData.formatted_address || 'Click anywhere on map or drag pin'}
                </span>
              </div>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setIsMapOpen(false)}
                className="w-full sm:w-auto font-bold px-6"
              >
                Confirm Location
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
