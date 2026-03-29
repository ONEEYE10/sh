"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchWeather } from "@/lib/weather-api";
import type { WeatherResponse } from "@/types/weather";

interface UseWeatherReturn {
  data: WeatherResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useWeather(
  latitude: number | null,
  longitude: number | null
): UseWeatherReturn {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (latitude === null || longitude === null) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchWeather(latitude, longitude);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refresh: load };
}
