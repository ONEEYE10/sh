"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Wind,
  Eye,
  Thermometer,
  Sun,
  Compass,
  Sunrise,
  Sunset,
} from "lucide-react";
import { getWindDirection, formatTime } from "@/lib/utils";
import type { WeatherResponse } from "@/types/weather";

interface WeatherDetailsProps {
  data: WeatherResponse | null;
  loading: boolean;
}

function SkeletonLoader() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      <div className="h-5 w-40 skeleton mb-4" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-20 skeleton rounded-xl" />
        ))}
      </div>
    </div>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  delay?: number;
}

function DetailItem({ icon, label, value, sub, delay = 0 }: DetailItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white/10 rounded-xl p-3 hover:bg-white/15 hover:ring-1 hover:ring-white/30 transition-all"
    >
      <div className="flex items-center gap-2 mb-1 text-white/60">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-white font-semibold text-base">{value}</div>
      {sub && <div className="text-white/40 text-xs mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function getUvLabel(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

export default function WeatherDetails({ data, loading }: WeatherDetailsProps) {
  if (loading && !data) return <SkeletonLoader />;
  if (!data) return null;

  const { current, daily } = data;
  const todaySunrise = daily.sunrise[0];
  const todaySunset = daily.sunset[0];

  const details: DetailItemProps[] = [
    {
      icon: <Droplets size={14} />,
      label: "Humidity",
      value: `${current.relative_humidity_2m}%`,
      sub:
        current.relative_humidity_2m > 80
          ? "Very humid"
          : current.relative_humidity_2m > 60
          ? "Humid"
          : "Comfortable",
      delay: 0.05,
    },
    {
      icon: <Wind size={14} />,
      label: "Wind Speed",
      value: `${current.wind_speed_10m} km/h`,
      sub: `${getWindDirection(current.wind_direction_10m)} direction`,
      delay: 0.1,
    },
    {
      icon: <Compass size={14} />,
      label: "Wind Direction",
      value: getWindDirection(current.wind_direction_10m),
      sub: `${current.wind_direction_10m}°`,
      delay: 0.15,
    },
    {
      icon: <Sun size={14} />,
      label: "UV Index",
      value: String(current.uv_index),
      sub: getUvLabel(current.uv_index),
      delay: 0.2,
    },
    {
      icon: <Thermometer size={14} />,
      label: "Feels Like",
      value: `${current.apparent_temperature.toFixed(1)}°C`,
      sub:
        current.apparent_temperature < current.temperature_2m
          ? "Cooler than actual"
          : "Warmer than actual",
      delay: 0.25,
    },
    {
      icon: <Eye size={14} />,
      label: "Precipitation",
      value: `${current.precipitation} mm`,
      sub: current.rain > 0 ? `Rain: ${current.rain} mm` : "No rain",
      delay: 0.3,
    },
    {
      icon: <Sunrise size={14} />,
      label: "Sunrise",
      value: formatTime(todaySunrise),
      delay: 0.35,
    },
    {
      icon: <Sunset size={14} />,
      label: "Sunset",
      value: formatTime(todaySunset),
      delay: 0.4,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-5 hover:ring-2 hover:ring-white/30 transition-all"
    >
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">
        Weather Details
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {details.map((item) => (
          <DetailItem key={item.label} {...item} />
        ))}
      </div>
    </motion.div>
  );
}
