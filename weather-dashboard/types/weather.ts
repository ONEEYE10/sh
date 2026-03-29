export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

export interface CurrentWeatherData {
  temperature: number;
  apparent_temperature: number;
  relative_humidity: number;
  wind_speed: number;
  wind_direction: number;
  weather_code: number;
  is_day: number;
  precipitation: number;
  surface_pressure: number;
  visibility: number;
  uv_index: number;
  time: string;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  relative_humidity_2m: number[];
}

export interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeatherData;
  hourly: HourlyData;
  daily: DailyData;
}

export interface WeatherAlert {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type Theme = 'dark' | 'light';

export interface SearchHistoryItem {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  searchedAt: number;
}

// WMO Weather interpretation codes
export const WMO_CODES: Record<number, { label: string; icon: string; darkIcon?: string }> = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Icy Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  53: { label: 'Moderate Drizzle', icon: '🌦️' },
  55: { label: 'Dense Drizzle', icon: '🌧️' },
  61: { label: 'Slight Rain', icon: '🌧️' },
  63: { label: 'Moderate Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  71: { label: 'Slight Snow', icon: '🌨️' },
  73: { label: 'Moderate Snow', icon: '🌨️' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  77: { label: 'Snow Grains', icon: '🌨️' },
  80: { label: 'Slight Showers', icon: '🌦️' },
  81: { label: 'Moderate Showers', icon: '🌧️' },
  82: { label: 'Violent Showers', icon: '⛈️' },
  85: { label: 'Snow Showers', icon: '🌨️' },
  86: { label: 'Heavy Snow Showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm w/ Hail', icon: '⛈️' },
  99: { label: 'Thunderstorm w/ Heavy Hail', icon: '⛈️' },
};

export function getWeatherInfo(code: number): { label: string; icon: string } {
  return WMO_CODES[code] ?? { label: 'Unknown', icon: '🌡️' };
}

export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round(celsius * 9 / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  const value = convertTemp(celsius, unit);
  return `${value}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

export function generateAlerts(current: CurrentWeatherData): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  if (current.uv_index >= 8) {
    alerts.push({
      title: 'High UV Index',
      description: `UV index is ${current.uv_index}. Apply sunscreen and limit sun exposure.`,
      severity: current.uv_index >= 11 ? 'high' : 'medium',
    });
  }

  if (current.wind_speed >= 50) {
    alerts.push({
      title: 'Strong Winds',
      description: `Wind speeds of ${Math.round(current.wind_speed)} km/h. Take caution outdoors.`,
      severity: current.wind_speed >= 75 ? 'high' : 'medium',
    });
  }

  const code = current.weather_code;
  if (code === 95 || code === 96 || code === 99) {
    alerts.push({
      title: 'Thunderstorm Warning',
      description: 'Thunderstorm activity detected. Stay indoors if possible.',
      severity: 'high',
    });
  }

  if (current.precipitation > 10) {
    alerts.push({
      title: 'Heavy Precipitation',
      description: `${current.precipitation.toFixed(1)} mm of precipitation. Possible flooding.`,
      severity: 'medium',
    });
  }

  return alerts;
}
