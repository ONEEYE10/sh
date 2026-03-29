"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "@/hooks/useWeather";
import { useGeolocation } from "@/hooks/useGeolocation";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import ForecastCard from "./ForecastCard";
import HourlyForecast from "./HourlyForecast";
import WeatherDetails from "./WeatherDetails";
import ThemeToggle from "./ThemeToggle";
import { getWeatherCondition, getCurrentHour, formatDate } from "@/lib/utils";
import type { FavoriteCity, GeocodingResult, Quote } from "@/types/weather";

const DEFAULT_CITY: FavoriteCity = {
  id: 745044,
  name: "Istanbul",
  country: "Turkey",
  latitude: 41.0082,
  longitude: 28.9784,
};

export default function WeatherDashboard() {
  const [selectedCity, setSelectedCity] = useState<FavoriteCity>(DEFAULT_CITY);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [favorites, setFavorites] = useState<FavoriteCity[]>([DEFAULT_CITY]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isDark, setIsDark] = useState(true);

  const { data, loading, error, refresh } = useWeather(
    selectedCity.latitude,
    selectedCity.longitude
  );

  const {
    latitude: geoLat,
    longitude: geoLon,
    loading: geoLoading,
    error: geoError,
    getLocation,
  } = useGeolocation();

  // Load persisted state
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem("favorites");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedCity = localStorage.getItem("lastCity");
      if (savedCity) setSelectedCity(JSON.parse(savedCity));

      const savedUnit = localStorage.getItem("unit");
      if (savedUnit === "F") setUnit("F");

      const theme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = theme === "dark" || (!theme && prefersDark);
      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
    } catch {}
  }, []);

  // Fetch quote
  useEffect(() => {
    fetch("/api/quote")
      .then((r) => r.json())
      .then((q: Quote) => setQuote(q))
      .catch(() => {});
  }, []);

  // Handle geolocation result
  useEffect(() => {
    if (geoLat !== null && geoLon !== null) {
      const geoCity: FavoriteCity = {
        id: -1,
        name: "My Location",
        country: "",
        latitude: geoLat,
        longitude: geoLon,
      };
      setSelectedCity(geoCity);
      localStorage.setItem("lastCity", JSON.stringify(geoCity));
    }
  }, [geoLat, geoLon]);

  const handleSelectCity = useCallback((result: GeocodingResult) => {
    const city: FavoriteCity = {
      id: result.id,
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
      admin1: result.admin1,
    };
    setSelectedCity(city);
    localStorage.setItem("lastCity", JSON.stringify(city));
  }, []);

  const addFavorite = useCallback(() => {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === selectedCity.id)) return prev;
      const updated = [...prev, selectedCity].slice(-5);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  }, [selectedCity]);

  const removeFavorite = useCallback(
    (id: number) => {
      setFavorites((prev) => {
        const updated = prev.filter((f) => f.id !== id);
        localStorage.setItem("favorites", JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === "C" ? "F" : "C";
      localStorage.setItem("unit", next);
      return next;
    });
  }, []);

  const condition = data
    ? getWeatherCondition(
        data.current.weather_code,
        getCurrentHour()
      )
    : { bgGradient: "from-slate-800 via-blue-900 to-indigo-950", emoji: "", label: "", isDay: false };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${condition.bgGradient} transition-all duration-1000`}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-shadow">
              🌤️ Weather Dashboard
            </h1>
            <p className="text-white/60 text-sm mt-0.5">
              {formatDate(new Date().toISOString().split("T")[0])}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleUnit}
              className="glass text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-white/20 transition-all"
            >
              °{unit === "C" ? "F" : "C"}
            </button>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </motion.header>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <SearchBar
            onSelectCity={handleSelectCity}
            onUseLocation={getLocation}
            geoLoading={geoLoading}
            geoError={geoError}
          />
        </motion.div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {favorites.map((fav) => (
              <button
                key={fav.id}
                onClick={() => setSelectedCity(fav)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedCity.id === fav.id
                    ? "bg-white/30 text-white ring-2 ring-white/50"
                    : "glass text-white/80 hover:bg-white/20"
                }`}
              >
                <span>{fav.name}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(fav.id);
                  }}
                  className="text-white/50 hover:text-white ml-1 cursor-pointer"
                  role="button"
                  aria-label={`Remove ${fav.name} from favorites`}
                >
                  ×
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl p-6 mb-6 text-center"
            >
              <p className="text-white text-lg mb-2">⚠️ {error}</p>
              <button
                onClick={refresh}
                className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <CurrentWeather
              data={data}
              loading={loading}
              unit={unit}
              cityName={selectedCity.name}
              country={selectedCity.country}
              condition={condition}
              onAddFavorite={addFavorite}
              isFavorite={favorites.some((f) => f.id === selectedCity.id)}
            />
            <HourlyForecast data={data} loading={loading} unit={unit} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WeatherDetails data={data} loading={loading} />
            <ForecastCard data={data} loading={loading} unit={unit} />
          </div>
        </div>

        {/* Quote Footer */}
        <AnimatePresence>
          {quote && (
            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="glass rounded-2xl p-4 inline-block max-w-xl">
                <p className="text-white/80 italic text-sm">
                  &ldquo;{quote.content}&rdquo;
                </p>
                <p className="text-white/50 text-xs mt-1">— {quote.author}</p>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
