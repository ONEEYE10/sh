"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Loader2 } from "lucide-react";
import { searchCities } from "@/lib/geocoding-api";
import { debounce } from "@/lib/utils";
import type { GeocodingResult } from "@/types/weather";

interface SearchBarProps {
  onSelectCity: (result: GeocodingResult) => void;
  onUseLocation: () => void;
  geoLoading: boolean;
  geoError: string | null;
}

export default function SearchBar({
  onSelectCity,
  onUseLocation,
  geoLoading,
  geoError,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setOpen(false);
        return;
      }
      setSearching(true);
      try {
        const found = await searchCities(q);
        setResults(found);
        setOpen(found.length > 0);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    doSearch(query);
  }, [query, doSearch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (result: GeocodingResult) => {
    onSelectCity(result);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative flex gap-2">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
          {searching ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full glass text-white placeholder-white/40 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm"
        />

        <AnimatePresence>
          {open && results.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute top-full left-0 right-0 mt-1 glass rounded-xl overflow-hidden z-50 shadow-2xl"
            >
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => handleSelect(r)}
                    className="w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-colors flex items-center gap-2 text-sm"
                  >
                    <MapPin size={14} className="text-white/60 shrink-0" />
                    <span className="font-medium">{r.name}</span>
                    {r.admin1 && (
                      <span className="text-white/50">{r.admin1},</span>
                    )}
                    <span className="text-white/50">{r.country}</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onUseLocation}
        disabled={geoLoading}
        title={geoError ?? "Use my location"}
        className="glass text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 text-sm disabled:opacity-60 shrink-0"
      >
        {geoLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <MapPin size={18} />
        )}
        <span className="hidden sm:inline">My Location</span>
      </button>
    </div>
  );
}
