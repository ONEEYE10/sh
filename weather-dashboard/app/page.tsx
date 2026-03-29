'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudSun, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import SearchBar from '@/components/SearchBar';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastCard from '@/components/ForecastCard';
import HourlyForecast from '@/components/HourlyForecast';
import FavoriteLocations from '@/components/FavoriteLocations';
import WeatherAlerts from '@/components/WeatherAlerts';
import ThemeToggle from '@/components/ThemeToggle';
import UnitToggle from '@/components/UnitToggle';
import LoadingSpinner from '@/components/LoadingSpinner';
import LifeIndex from '@/components/LifeIndex';
import AllergyOutlook from '@/components/AllergyOutlook';

import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import type { Location, TemperatureUnit, Theme, SearchHistoryItem, GeocodingResult } from '@/types/weather';
import { generateAlerts } from '@/types/weather';

// Inline sunrise/sunset component
function SunriseSunset({ sunrise, sunset }: { sunrise: string; sunset: string }) {
  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '--';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-3xl p-5 bg-white/10 dark:bg-gray-800/40 backdrop-blur-md 
                 border border-white/20 dark:border-gray-700/50"
    >
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Sun Schedule
      </h3>
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl">🌅</span>
          <p className="text-xs text-gray-400">Sunrise</p>
          <p className="text-sm font-semibold text-orange-400">{fmt(sunrise)}</p>
        </div>
        <div className="h-px flex-1 mx-4 bg-gradient-to-r from-orange-400/30 via-yellow-400/50 to-orange-400/30" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl">🌇</span>
          <p className="text-xs text-gray-400">Sunset</p>
          <p className="text-sm font-semibold text-orange-600">{fmt(sunset)}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function WeatherDashboard() {
  const weather = useWeather();
  const geo = useGeolocation();

  const [theme, setTheme, themeLoaded] = useLocalStorage<Theme>('weather-theme', 'dark');
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>('weather-unit', 'celsius');
  const [favorites, setFavorites] = useLocalStorage<Location[]>('weather-favorites', []);
  const [searchHistory, setSearchHistory] = useLocalStorage<SearchHistoryItem[]>('weather-history', []);
  const [searchSuggestions, setSearchSuggestions] = useState<GeocodingResult[]>([]);

  // Apply theme to document
  useEffect(() => {
    if (!themeLoaded) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, themeLoaded]);

  // Auto-fetch on geolocation change
  useEffect(() => {
    if (geo.latitude && geo.longitude && !geo.loading) {
      weather.fetchWeatherByCoords(geo.latitude, geo.longitude, 'Your Location');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.latitude, geo.longitude]);

  // Default location on first load (London) if no geolocation
  useEffect(() => {
    if (!weather.data && !weather.loading) {
      weather.fetchWeatherByCoords(51.5074, -0.1278, 'London');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToHistory = useCallback((item: SearchHistoryItem) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(
        h => !(h.latitude === item.latitude && h.longitude === item.longitude)
      );
      return [item, ...filtered].slice(0, 10);
    });
  }, [setSearchHistory]);

  const handleSearch = async (city: string) => {
    const result = await weather.fetchWeatherByCity(city);
    if (result) {
      addToHistory({
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        country_code: result.country_code,
        admin1: result.admin1,
        searchedAt: Date.now(),
      });
    }
  };

  const handleSelectSuggestion = async (result: GeocodingResult) => {
    await weather.fetchWeatherByCoords(result.latitude, result.longitude, result.name);
    addToHistory({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      country_code: result.country_code,
      admin1: result.admin1,
      searchedAt: Date.now(),
    });
    setSearchSuggestions([]);
  };

  const handleSelectHistory = (item: SearchHistoryItem) => {
    weather.fetchWeatherByCoords(item.latitude, item.longitude, item.name);
  };

  const handleSelectFavorite = (loc: Location) => {
    weather.fetchWeatherByCoords(loc.latitude, loc.longitude, loc.name);
  };

  const toggleFavorite = () => {
    if (!weather.location) return;
    const loc = weather.location;
    const exists = favorites.some(
      f => f.latitude === loc.latitude && f.longitude === loc.longitude
    );
    if (exists) {
      setFavorites(prev => prev.filter(f => !(f.latitude === loc.latitude && f.longitude === loc.longitude)));
    } else {
      setFavorites(prev => [...prev, loc]);
    }
  };

  const removeFavorite = (loc: Location) => {
    setFavorites(prev => prev.filter(f => !(f.latitude === loc.latitude && f.longitude === loc.longitude)));
  };

  const isFavorite =
    weather.location
      ? favorites.some(f => f.latitude === weather.location!.latitude && f.longitude === weather.location!.longitude)
      : false;

  const handleSearchSuggestions = useCallback(async (query: string) => {
    const results = await weather.searchCities(query);
    setSearchSuggestions(results);
  }, [weather]);

  const alerts = weather.data ? generateAlerts(weather.data.current) : [];

  const bgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950'
    : 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500`}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/10 dark:bg-gray-900/60 border-b border-white/10 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
            title="Home"
          >
            <CloudSun className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-gray-800 dark:text-white text-lg hidden sm:block">
              86° Weather
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <SearchBar
              onSearch={handleSearch}
              onSelectSuggestion={handleSelectSuggestion}
              onSelectHistory={handleSelectHistory}
              onLocationClick={geo.getLocation}
              searchSuggestions={searchSuggestions}
              searchHistory={searchHistory}
              onSearchSuggestions={handleSearchSuggestions}
              locationLoading={geo.loading}
              clearHistory={() => setSearchHistory([])}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <UnitToggle
              unit={unit}
              onToggle={() => setUnit(u => u === 'celsius' ? 'fahrenheit' : 'celsius')}
            />
            <ThemeToggle
              theme={theme}
              onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Geolocation error */}
        <AnimatePresence>
          {geo.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{geo.error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather error */}
        <AnimatePresence>
          {weather.error && !weather.loading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{weather.error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {weather.loading && !weather.data && <LoadingSpinner />}

        {/* Dashboard */}
        {weather.data && weather.location && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Alerts */}
              {alerts.length > 0 && <WeatherAlerts alerts={alerts} />}

              {/* Current weather */}
              <CurrentWeather
                data={weather.data}
                location={weather.location}
                unit={unit}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onRefresh={weather.refresh}
                lastUpdated={weather.lastUpdated}
              />

              {/* Hourly forecast */}
              <HourlyForecast
                hourly={weather.data.hourly}
                unit={unit}
                timezone={weather.data.timezone}
              />

              {/* 7-day forecast */}
              <ForecastCard daily={weather.data.daily} unit={unit} />
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Sunrise/Sunset info */}
              <SunriseSunset
                sunrise={weather.data.daily.sunrise[0]}
                sunset={weather.data.daily.sunset[0]}
              />

              {/* Life Index */}
              <LifeIndex current={weather.data.current} />

              {/* Allergy Outlook */}
              <AllergyOutlook current={weather.data.current} />

              {/* Favorites */}
              <FavoriteLocations
                favorites={favorites}
                currentLocation={weather.location}
                onSelect={handleSelectFavorite}
                onRemove={removeFavorite}
              />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!weather.loading && !weather.data && !weather.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <CloudSun className="w-16 h-16 text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Search for a city to get started
            </h2>
            <p className="text-sm text-gray-400 max-w-sm">
              Enter a city name in the search bar above, or click the location button to use your current location.
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 pb-6 text-center text-xs text-gray-400 space-y-1">
        <div>
          <a
            href="https://oneeye10.github.io/sh/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline font-medium"
          >
            🌐 View Live Demo
          </a>
        </div>
        <div>
          Powered by{' '}
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Open-Meteo
          </a>{' '}
          • Free &amp; Open Source Weather API
        </div>
      </footer>
    </div>
  );
}
