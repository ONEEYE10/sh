import type { WeatherResponse } from "@/types/weather";

const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";

const CACHE = new Map<string, { data: WeatherResponse; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const cached = CACHE.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "rain",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "uv_index",
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "weather_code",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
  });

  const res = await fetch(`${WEATHER_BASE}?${params}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }

  const data: WeatherResponse = await res.json();
  CACHE.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}
