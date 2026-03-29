import type { WeatherCondition } from "@/types/weather";

export const WMO_CODES: Record<number, { emoji: string; label: string }> = {
  0: { emoji: "☀️", label: "Clear sky" },
  1: { emoji: "🌤️", label: "Mainly clear" },
  2: { emoji: "⛅", label: "Partly cloudy" },
  3: { emoji: "☁️", label: "Overcast" },
  45: { emoji: "🌫️", label: "Foggy" },
  48: { emoji: "🌫️", label: "Icy fog" },
  51: { emoji: "🌦️", label: "Light drizzle" },
  53: { emoji: "🌦️", label: "Moderate drizzle" },
  55: { emoji: "🌦️", label: "Dense drizzle" },
  56: { emoji: "🌨️", label: "Freezing drizzle" },
  57: { emoji: "🌨️", label: "Heavy freezing drizzle" },
  61: { emoji: "🌧️", label: "Slight rain" },
  63: { emoji: "🌧️", label: "Moderate rain" },
  65: { emoji: "🌧️", label: "Heavy rain" },
  66: { emoji: "🌨️", label: "Freezing rain" },
  67: { emoji: "🌨️", label: "Heavy freezing rain" },
  71: { emoji: "🌨️", label: "Slight snow" },
  73: { emoji: "❄️", label: "Moderate snow" },
  75: { emoji: "❄️", label: "Heavy snow" },
  77: { emoji: "🌨️", label: "Snow grains" },
  80: { emoji: "🌦️", label: "Slight showers" },
  81: { emoji: "🌦️", label: "Moderate showers" },
  82: { emoji: "🌧️", label: "Violent showers" },
  85: { emoji: "🌨️", label: "Snow showers" },
  86: { emoji: "🌨️", label: "Heavy snow showers" },
  95: { emoji: "⛈️", label: "Thunderstorm" },
  96: { emoji: "⛈️", label: "Thunderstorm w/ hail" },
  99: { emoji: "⛈️", label: "Thunderstorm w/ heavy hail" },
};

export function getWeatherCondition(
  code: number,
  hour: number
): WeatherCondition {
  const isDay = hour >= 6 && hour < 20;
  const info = WMO_CODES[code] ?? { emoji: "🌡️", label: "Unknown" };

  let bgGradient = "";

  if (code === 0) {
    bgGradient = isDay
      ? "from-sky-400 via-blue-500 to-indigo-600"
      : "from-indigo-900 via-blue-950 to-slate-950";
  } else if (code <= 3) {
    bgGradient = isDay
      ? "from-slate-400 via-blue-400 to-indigo-500"
      : "from-slate-800 via-blue-900 to-indigo-950";
  } else if (code <= 48) {
    bgGradient = "from-slate-500 via-gray-600 to-slate-700";
  } else if (code <= 67) {
    bgGradient = "from-slate-600 via-blue-700 to-indigo-800";
  } else if (code <= 77) {
    bgGradient = "from-slate-300 via-blue-200 to-indigo-200";
  } else if (code <= 82) {
    bgGradient = "from-slate-500 via-blue-600 to-indigo-700";
  } else {
    bgGradient = "from-slate-800 via-purple-900 to-indigo-950";
  }

  return { emoji: info.emoji, label: info.label, bgGradient, isDay };
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(
  celsius: number,
  unit: "C" | "F",
  decimals = 1
): string {
  const value = unit === "F" ? celsiusToFahrenheit(celsius) : celsius;
  return `${value.toFixed(decimals)}°${unit}`;
}

export function getWindDirection(degrees: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export function formatDayOfWeek(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString([], { weekday: "short" });
}

export function getCurrentHour(): number {
  return new Date().getHours();
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
