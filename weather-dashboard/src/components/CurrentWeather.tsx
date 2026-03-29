"use client";

import { motion } from "framer-motion";
import { Heart, RefreshCw } from "lucide-react";
import { formatTemperature } from "@/lib/utils";
import type { WeatherResponse, WeatherCondition } from "@/types/weather";

interface CurrentWeatherProps {
  data: WeatherResponse | null;
  loading: boolean;
  unit: "C" | "F";
  cityName: string;
  country: string;
  condition: WeatherCondition;
  onAddFavorite: () => void;
  isFavorite: boolean;
}

function SkeletonLoader() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="h-8 w-48 skeleton mb-2" />
          <div className="h-4 w-32 skeleton" />
        </div>
        <div className="h-8 w-8 skeleton rounded-full" />
      </div>
      <div className="flex items-end gap-4 mt-6">
        <div className="h-24 w-40 skeleton" />
        <div className="space-y-2">
          <div className="h-5 w-32 skeleton" />
          <div className="h-4 w-24 skeleton" />
        </div>
      </div>
    </div>
  );
}

export default function CurrentWeather({
  data,
  loading,
  unit,
  cityName,
  country,
  condition,
  onAddFavorite,
  isFavorite,
}: CurrentWeatherProps) {
  if (loading && !data) return <SkeletonLoader />;

  if (!data) return null;

  const { current } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-6 hover:ring-2 hover:ring-white/30 hover:shadow-2xl transition-all group"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-shadow">
            {cityName}
            {country && (
              <span className="text-white/60 text-base font-normal ml-2">
                {country}
              </span>
            )}
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {condition.label}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddFavorite}
            className={`p-2 rounded-full transition-all ${
              isFavorite
                ? "text-red-400 bg-red-400/20"
                : "text-white/60 hover:text-red-400 hover:bg-red-400/20"
            }`}
            title={isFavorite ? "Already in favorites" : "Add to favorites"}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </motion.button>
          {loading && (
            <RefreshCw size={18} className="text-white/40 animate-spin" />
          )}
        </div>
      </div>

      <div className="mt-6 flex items-end gap-6">
        <div>
          <div className="flex items-start">
            <span className="text-7xl sm:text-8xl font-thin text-white leading-none">
              {condition.emoji}
            </span>
          </div>
        </div>
        <div className="pb-1">
          <div className="text-5xl sm:text-6xl font-bold text-white leading-none">
            {formatTemperature(current.temperature_2m, unit, 0)}
          </div>
          <div className="text-white/60 text-sm mt-2">
            Feels like {formatTemperature(current.apparent_temperature, unit, 0)}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Humidity", value: `${current.relative_humidity_2m}%`, icon: "💧" },
          { label: "Wind", value: `${current.wind_speed_10m} km/h`, icon: "💨" },
          { label: "UV Index", value: String(current.uv_index), icon: "☀️" },
          { label: "Rain", value: `${current.precipitation} mm`, icon: "🌧️" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white/10 rounded-xl p-3 text-center"
          >
            <div className="text-xl mb-1">{item.icon}</div>
            <div className="text-white font-semibold text-sm">{item.value}</div>
            <div className="text-white/50 text-xs">{item.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
