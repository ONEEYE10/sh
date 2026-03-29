'use client';

import { motion } from 'framer-motion';
import { Droplets, Wind } from 'lucide-react';
import type { DailyData } from '@/types/weather';
import { getWeatherInfo, formatTemp } from '@/types/weather';
import type { TemperatureUnit } from '@/types/weather';
import WeatherIcon from '@/components/WeatherIcon';

interface ForecastCardProps {
  daily: DailyData;
  unit: TemperatureUnit;
}

export default function ForecastCard({ daily, unit }: ForecastCardProps) {
  const days = daily.time.slice(0, 7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl p-5 bg-white/10 dark:bg-gray-800/40 backdrop-blur-md 
                 border border-white/20 dark:border-gray-700/50"
    >
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        7-Day Forecast
      </h3>
      <div className="space-y-2">
        {days.map((dateStr, i) => {
          const date = new Date(dateStr);
          const isToday = i === 0;

          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between py-2 px-3 rounded-xl transition-colors
                          ${isToday ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-white/5 dark:hover:bg-gray-700/20'}`}
            >
              {/* Day */}
              <div className="w-16">
                <p className={`text-sm font-medium ${isToday ? 'text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {isToday ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' })}
                </p>
                <p className="text-xs text-gray-400">
                  {date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Icon */}
              <WeatherIcon code={daily.weather_code[i]} isDay size={28} />

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  {daily.precipitation_probability_max[i]}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-gray-400" />
                  {Math.round(daily.wind_speed_10m_max[i])}
                </span>
              </div>

              {/* Temp range */}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-gray-800 dark:text-white">
                  {formatTemp(daily.temperature_2m_max[i], unit)}
                </span>
                <span className="text-gray-400">
                  {formatTemp(daily.temperature_2m_min[i], unit)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
