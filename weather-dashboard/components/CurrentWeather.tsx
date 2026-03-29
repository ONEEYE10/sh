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
import { formatTemp, getWindDirection, getWeatherInfo } from '@/types/weather';
import type { TemperatureUnit } from '@/types/weather';
import WeatherIcon from '@/components/WeatherIcon';

interface CurrentWeatherProps {
  data: WeatherResponse;
  location: Location;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
}

function tempGradient(celsius: number): { bg: string; border: string; glow: string } {
  if (celsius < 0) {
    return {
      bg: 'from-blue-950/70 via-blue-900/50 to-cyan-900/40',
      border: 'border-blue-400/25',
      glow: 'bg-blue-400/15',
    };
  }
  if (celsius < 10) {
    return {
      bg: 'from-blue-700/50 via-sky-600/30 to-cyan-600/20',
      border: 'border-sky-400/25',
      glow: 'bg-sky-400/15',
    };
  }
  if (celsius < 20) {
    return {
      bg: 'from-teal-600/40 via-emerald-500/25 to-sky-500/20',
      border: 'border-teal-400/25',
      glow: 'bg-teal-400/15',
    };
  }
  if (celsius < 28) {
    return {
      bg: 'from-amber-500/40 via-orange-400/25 to-yellow-400/15',
      border: 'border-amber-400/30',
      glow: 'bg-amber-400/15',
    };
  }
  return {
    bg: 'from-orange-600/50 via-red-500/30 to-rose-400/20',
    border: 'border-orange-400/30',
    glow: 'bg-orange-400/15',
  };
}

const statItem = (icon: React.ReactNode, label: string, value: string) => (
  <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/15 dark:border-white/8">
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
  const { bg, border, glow } = tempGradient(current.temperature);

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
      className={`relative rounded-3xl p-6 bg-gradient-to-br ${bg}
                  border ${border}
                  backdrop-blur-xl overflow-hidden
                  shadow-2xl`}
    >
      {/* Glassmorphism inner highlight */}
      <div className="absolute inset-0 rounded-3xl bg-white/5 dark:bg-white/3 pointer-events-none" />

      {/* Background glow blobs */}
      <div className={`absolute -top-14 -right-14 w-56 h-56 rounded-full ${glow} blur-3xl pointer-events-none`} />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-purple-400/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
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
      <div className="relative flex items-center gap-6 mb-6">
        <WeatherIcon
          code={current.weather_code}
          isDay={Boolean(current.is_day)}
          size={80}
        />
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
      <div className="relative grid grid-cols-3 sm:grid-cols-6 gap-2">
        {statItem(<Droplets className="w-4 h-4" />, 'Humidity', `${current.relative_humidity}%`)}
        {statItem(
          <Wind className="w-4 h-4" />,
          'Wind',
          `${Math.round(current.wind_speed)} km/h ${getWindDirection(current.wind_direction)}`
        )}
        {statItem(<Eye className="w-4 h-4" />, 'Visibility', `${(current.visibility / 1000).toFixed(1)} km`)}
        {statItem(<Thermometer className="w-4 h-4" />, 'UV Index', current.uv_index.toFixed(1))}
        {statItem(<Gauge className="w-4 h-4" />, 'Pressure', `${Math.round(current.surface_pressure)} hPa`)}
        {statItem(<Sun className="w-4 h-4" />, 'Precip.', `${current.precipitation.toFixed(1)} mm`)}
      </div>

      {lastUpdated && (
        <p className="relative text-xs text-gray-400 mt-3 text-right">
          Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </motion.div>
  );
}
