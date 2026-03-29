"use client";

import { motion } from "framer-motion";
import { getWeatherCondition, formatTemperature, formatDayOfWeek } from "@/lib/utils";
import type { WeatherResponse } from "@/types/weather";

interface ForecastCardProps {
  data: WeatherResponse | null;
  loading: boolean;
  unit: "C" | "F";
}

function SkeletonLoader() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      <div className="h-5 w-32 skeleton mb-4" />
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex justify-between items-center py-2">
          <div className="h-4 w-16 skeleton" />
          <div className="h-6 w-6 skeleton rounded-full" />
          <div className="h-4 w-24 skeleton" />
        </div>
      ))}
    </div>
  );
}

export default function ForecastCard({
  data,
  loading,
  unit,
}: ForecastCardProps) {
  if (loading && !data) return <SkeletonLoader />;
  if (!data) return null;

  const { daily } = data;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass rounded-2xl p-5 hover:ring-2 hover:ring-white/30 transition-all"
    >
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">
        7-Day Forecast
      </h3>

      <div className="space-y-1">
        {daily.time.map((date, i) => {
          const condition = getWeatherCondition(daily.weather_code[i], 12);
          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-white/80 text-sm w-20">
                {formatDayOfWeek(date)}
              </span>
              <span className="text-xl" title={condition.label}>
                {condition.emoji}
              </span>
              <div className="text-right">
                <span className="text-white text-sm font-semibold">
                  {formatTemperature(daily.temperature_2m_max[i], unit, 0)}
                </span>
                <span className="text-white/40 text-sm mx-1">/</span>
                <span className="text-white/60 text-sm">
                  {formatTemperature(daily.temperature_2m_min[i], unit, 0)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
