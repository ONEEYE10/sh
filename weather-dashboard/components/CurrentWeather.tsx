'use client';

import { motion } from 'framer-motion';
import {
  Droplets,
  Wind,
  Eye,
  Thermometer,
  Gauge,
  Sun,
  RefreshCw,
  Heart,
  MapPin,
} from 'lucide-react';
import type { WeatherResponse, Location } from '@/types/weather';
import { getWeatherInfo, formatTemp, getWindDirection } from '@/types/weather';
import type { TemperatureUnit } from '@/types/weather';

interface CurrentWeatherProps {
  data: WeatherResponse;
  location: Location;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
}

const statItem = (icon: React.ReactNode, label: string, value: string) => (
  <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm">
    <div className="text-blue-400">{icon}</div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-semibold text-gray-800 dark:text-white">{value}</p>
  </div>
);

export default function CurrentWeather({
  data,
  location,
  unit,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  lastUpdated,
}: CurrentWeatherProps) {
  const { current } = data;
  const weather = getWeatherInfo(current.weather_code);

  const bgGradient = current.is_day
    ? 'from-blue-400/20 via-sky-300/10 to-transparent'
    : 'from-indigo-800/30 via-violet-900/20 to-transparent';

  const lat = location.latitude;
  const lon = location.longitude;
  const validCoords =
    typeof lat === 'number' && isFinite(lat) && lat >= -90 && lat <= 90 &&
    typeof lon === 'number' && isFinite(lon) && lon >= -180 && lon <= 180;
  const mapsUrl = validCoords
    ? `https://maps.google.com/?q=${lat.toFixed(6)},${lon.toFixed(6)}`
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl p-6 bg-gradient-to-br ${bgGradient} 
                  border border-white/20 dark:border-gray-700/50 
                  backdrop-blur-md overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-purple-400/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        {validCoords ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-75 transition-opacity"
            title="View on Google Maps"
          >
            <MapPin className="w-4 h-4 text-blue-400" />
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                {location.name}
              </h2>
              {(location.admin1 || location.country) && (
                <p className="text-xs text-gray-400">
                  {[location.admin1, location.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </a>
        ) : (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                {location.name}
              </h2>
              {(location.admin1 || location.country) && (
                <p className="text-xs text-gray-400">
                  {[location.admin1, location.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-xl transition-colors ${
              isFavorite
                ? 'text-red-400 bg-red-400/10 hover:bg-red-400/20'
                : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
            }`}
          >
            <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={onRefresh}
            title="Refresh weather"
            className="p-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main temperature display */}
      <div className="flex items-center gap-6 mb-6">
        <div className="text-7xl leading-none select-none" role="img" aria-label={weather.label}>
          {weather.icon}
        </div>
        <div>
          <div className="text-6xl font-thin text-gray-800 dark:text-white leading-none">
            {formatTemp(current.temperature, unit)}
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-1">{weather.label}</p>
          <p className="text-sm text-gray-400">
            Feels like {formatTemp(current.apparent_temperature, unit)}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {statItem(<Droplets className="w-4 h-4" />, 'Humidity', `${current.relative_humidity}%`)}
        {statItem(
          <Wind className="w-4 h-4" />,
          'Wind',
          `${Math.round(current.wind_speed)} km/h ${getWindDirection(current.wind_direction)}`
        )}
        {statItem(<Eye className="w-4 h-4" />, 'Visibility', `${(current.visibility / 1000).toFixed(1)} km`)}
        {statItem(<Thermometer className="w-4 h-4" />, 'UV Index', current.uv_index.toFixed(1))}
        {statItem(<Gauge className="w-4 h-4" />, 'Pressure', `${Math.round(current.surface_pressure)} hPa`)}
        {statItem(<Sun className="w-4 h-4" />, 'Precipitation', `${current.precipitation.toFixed(1)} mm`)}
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-400 mt-3 text-right">
          Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </motion.div>
  );
}
