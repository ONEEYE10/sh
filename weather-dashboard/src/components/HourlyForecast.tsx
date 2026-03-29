"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getWeatherCondition, formatTemperature, formatTime } from "@/lib/utils";
import type { WeatherResponse } from "@/types/weather";

interface HourlyForecastProps {
  data: WeatherResponse | null;
  loading: boolean;
  unit: "C" | "F";
}

function SkeletonLoader() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      <div className="h-5 w-40 skeleton mb-4" />
      <div className="flex gap-3 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="shrink-0 w-16 h-24 skeleton rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function HourlyForecast({
  data,
  loading,
  unit,
}: HourlyForecastProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (loading && !data) return <SkeletonLoader />;
  if (!data) return null;

  const now = new Date();
  const currentHour = now.getHours();

  // Get next 24 hours starting from current hour
  const { hourly } = data;
  const startIdx = hourly.time.findIndex((t) => {
    const d = new Date(t);
    return d >= now;
  });
  const idx = startIdx === -1 ? 0 : startIdx;
  const hours = hourly.time.slice(idx, idx + 24);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass rounded-2xl p-5 hover:ring-2 hover:ring-white/30 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider opacity-70">
          Hourly Forecast
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/60 hover:text-white transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/60 hover:text-white transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {hours.map((time, i) => {
          const actualIdx = idx + i;
          const temp = hourly.temperature_2m[actualIdx];
          const precip = hourly.precipitation_probability[actualIdx];
          const wCode = hourly.weather_code[actualIdx];
          const hour = new Date(time).getHours();
          const condition = getWeatherCondition(wCode, hour);
          const isCurrentHour = hour === currentHour && i < 2;

          return (
            <motion.div
              key={time}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`shrink-0 flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-center transition-all ${
                isCurrentHour
                  ? "bg-white/25 ring-2 ring-white/40"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <span className="text-white/60 text-xs font-medium">
                {i === 0 ? "Now" : formatTime(time)}
              </span>
              <span className="text-xl">{condition.emoji}</span>
              <span className="text-white font-semibold text-sm">
                {formatTemperature(temp, unit, 0)}
              </span>
              {precip > 0 && (
                <span className="text-blue-300 text-xs">{precip}%</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
