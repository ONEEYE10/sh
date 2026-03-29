'use client';

import { useState, useCallback } from 'react';
import type { WeatherResponse, Location, GeocodingResult } from '@/types/weather';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

const CURRENT_PARAMS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'wind_speed_10m',
  'wind_direction_10m',
  'weather_code',
  'is_day',
  'precipitation',
  'surface_pressure',
  'visibility',
  'uv_index',
].join(',');

const HOURLY_PARAMS = [
  'temperature_2m',
  'precipitation_probability',
  'weather_code',
  'wind_speed_10m',
  'relative_humidity_2m',
].join(',');

const DAILY_PARAMS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'weather_code',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'sunrise',
  'sunset',
  'uv_index_max',
].join(',');

export interface WeatherState {
  data: WeatherResponse | null;
  location: Location | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    data: null,
    location: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchWeatherByCoords = useCallback(async (latitude: number, longitude: number, locationName?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const url = new URL(OPEN_METEO_BASE);
      url.searchParams.set('latitude', latitude.toFixed(4));
      url.searchParams.set('longitude', longitude.toFixed(4));
      url.searchParams.set('current', CURRENT_PARAMS);
      url.searchParams.set('hourly', HOURLY_PARAMS);
      url.searchParams.set('daily', DAILY_PARAMS);
      url.searchParams.set('timezone', 'auto');
      url.searchParams.set('forecast_days', '7');
      url.searchParams.set('wind_speed_unit', 'kmh');

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }
      const raw = await response.json();

      // Map API response to our typed structure
      const data: WeatherResponse = {
        latitude: raw.latitude,
        longitude: raw.longitude,
        timezone: raw.timezone,
        current: {
          temperature: raw.current.temperature_2m,
          apparent_temperature: raw.current.apparent_temperature,
          relative_humidity: raw.current.relative_humidity_2m,
          wind_speed: raw.current.wind_speed_10m,
          wind_direction: raw.current.wind_direction_10m,
          weather_code: raw.current.weather_code,
          is_day: raw.current.is_day,
          precipitation: raw.current.precipitation,
          surface_pressure: raw.current.surface_pressure,
          visibility: raw.current.visibility,
          uv_index: raw.current.uv_index,
          time: raw.current.time,
        },
        hourly: raw.hourly,
        daily: raw.daily,
      };

      setState(prev => ({
        data,
        location: {
          name: locationName ?? prev.location?.name ?? 'Your Location',
          latitude,
          longitude,
          country: prev.location?.country ?? '',
          country_code: prev.location?.country_code ?? '',
          admin1: prev.location?.admin1,
        },
        loading: false,
        error: null,
        lastUpdated: new Date(),
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch weather data.',
      }));
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (cityName: string): Promise<GeocodingResult | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const geoUrl = new URL(GEOCODING_BASE);
      geoUrl.searchParams.set('name', cityName);
      geoUrl.searchParams.set('count', '1');
      geoUrl.searchParams.set('language', 'en');
      geoUrl.searchParams.set('format', 'json');

      const geoRes = await fetch(geoUrl.toString());
      if (!geoRes.ok) {
        throw new Error(`Geocoding error: ${geoRes.status}`);
      }
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setState(prev => ({ ...prev, loading: false, error: `City "${cityName}" not found.` }));
        return null;
      }

      const result: GeocodingResult = geoData.results[0];

      // Temporarily set location before fetching weather
      setState(prev => ({
        ...prev,
        location: {
          name: result.name,
          latitude: result.latitude,
          longitude: result.longitude,
          country: result.country,
          country_code: result.country_code,
          admin1: result.admin1,
        },
      }));

      const weatherUrl = new URL(OPEN_METEO_BASE);
      weatherUrl.searchParams.set('latitude', result.latitude.toFixed(4));
      weatherUrl.searchParams.set('longitude', result.longitude.toFixed(4));
      weatherUrl.searchParams.set('current', CURRENT_PARAMS);
      weatherUrl.searchParams.set('hourly', HOURLY_PARAMS);
      weatherUrl.searchParams.set('daily', DAILY_PARAMS);
      weatherUrl.searchParams.set('timezone', 'auto');
      weatherUrl.searchParams.set('forecast_days', '7');
      weatherUrl.searchParams.set('wind_speed_unit', 'kmh');

      const weatherRes = await fetch(weatherUrl.toString());
      if (!weatherRes.ok) {
        throw new Error(`Weather API error: ${weatherRes.status}`);
      }
      const raw = await weatherRes.json();

      const data: WeatherResponse = {
        latitude: raw.latitude,
        longitude: raw.longitude,
        timezone: raw.timezone,
        current: {
          temperature: raw.current.temperature_2m,
          apparent_temperature: raw.current.apparent_temperature,
          relative_humidity: raw.current.relative_humidity_2m,
          wind_speed: raw.current.wind_speed_10m,
          wind_direction: raw.current.wind_direction_10m,
          weather_code: raw.current.weather_code,
          is_day: raw.current.is_day,
          precipitation: raw.current.precipitation,
          surface_pressure: raw.current.surface_pressure,
          visibility: raw.current.visibility,
          uv_index: raw.current.uv_index,
          time: raw.current.time,
        },
        hourly: raw.hourly,
        daily: raw.daily,
      };

      setState(() => ({
        data,
        location: {
          name: result.name,
          latitude: result.latitude,
          longitude: result.longitude,
          country: result.country,
          country_code: result.country_code,
          admin1: result.admin1,
        },
        loading: false,
        error: null,
        lastUpdated: new Date(),
      }));

      return result;
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch weather data.',
      }));
      return null;
    }
  }, []);

  const searchCities = useCallback(async (query: string): Promise<GeocodingResult[]> => {
    if (query.trim().length < 2) return [];
    try {
      const geoUrl = new URL(GEOCODING_BASE);
      geoUrl.searchParams.set('name', query);
      geoUrl.searchParams.set('count', '5');
      geoUrl.searchParams.set('language', 'en');
      geoUrl.searchParams.set('format', 'json');

      const res = await fetch(geoUrl.toString());
      if (!res.ok) return [];
      const data = await res.json();
      return data.results ?? [];
    } catch {
      return [];
    }
  }, []);

  const refresh = useCallback(() => {
    if (state.location) {
      fetchWeatherByCoords(state.location.latitude, state.location.longitude, state.location.name);
    }
  }, [state.location, fetchWeatherByCoords]);

  return {
    ...state,
    fetchWeatherByCoords,
    fetchWeatherByCity,
    searchCities,
    refresh,
  };
}
