import type { GeocodingResponse, GeocodingResult } from "@/types/weather";

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchCities(
  query: string,
  count = 5
): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    name: query,
    count: String(count),
    language: "en",
    format: "json",
  });

  const res = await fetch(`${GEOCODING_BASE}?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Geocoding API error: ${res.status}`);
  }

  const data: GeocodingResponse = await res.json();
  return data.results ?? [];
}
