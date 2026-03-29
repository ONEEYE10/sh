export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  timezone: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface CurrentWeatherData {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  uv_index: number;
  time: string;
  interval: number;
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
}

export interface DailyWeatherData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weather_code: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: CurrentWeatherData;
  hourly_units: Record<string, string>;
  hourly: HourlyWeatherData;
  daily_units: Record<string, string>;
  daily: DailyWeatherData;
}

export interface WeatherCondition {
  emoji: string;
  label: string;
  bgGradient: string;
  isDay: boolean;
}

export interface FavoriteCity {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

export interface Quote {
  content: string;
  author: string;
}
