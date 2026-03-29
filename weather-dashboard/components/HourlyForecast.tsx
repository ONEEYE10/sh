'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import type { HourlyData } from '@/types/weather';
import { getWeatherInfo, formatTemp } from '@/types/weather';
import type { TemperatureUnit } from '@/types/weather';
import WeatherIcon from '@/components/WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyData;
  unit: TemperatureUnit;
  timezone: string;
}

export default function HourlyForecast({ hourly, unit }: HourlyForecastProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
    }
  };

  // Show next 24 hours starting from current hour
  const now = new Date();
  const currentHour = now.getHours();
  const todayStr = now.toISOString().split('T')[0];

  const startIdx = hourly.time.findIndex(t => t >= `${todayStr}T${String(currentHour).padStart(2, '0')}:00`);
  const slice = startIdx >= 0 ? hourly.time.slice(startIdx, startIdx + 24) : hourly.time.slice(0, 24);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl p-5 bg-white/10 dark:bg-gray-800/40 backdrop-blur-md 
                 border border-white/20 dark:border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Hourly Forecast
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-white/10 dark:bg-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-600/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-white/10 dark:bg-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-600/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {slice.map((timeStr, i) => {
          const realIdx = startIdx >= 0 ? startIdx + i : i;
          const time = new Date(timeStr);
          const isNow = i === 0;

          return (
            <motion.div
              key={timeStr}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-2xl min-w-[72px]
                          ${isNow
                            ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                            : 'bg-white/5 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                          }`}
            >
              <p className="text-xs font-medium">
                {isNow ? 'Now' : time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
              <WeatherIcon
                code={hourly.weather_code[realIdx]}
                isDay={new Date(timeStr).getHours() >= 6 && new Date(timeStr).getHours() < 20}
                size={28}
              />
              <p className="text-sm font-semibold">
                {formatTemp(hourly.temperature_2m[realIdx], unit)}
              </p>
              <div className="flex items-center gap-0.5 text-xs text-blue-400">
                <Droplets className="w-3 h-3" />
                <span>{hourly.precipitation_probability[realIdx] ?? 0}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
