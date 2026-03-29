'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, X } from 'lucide-react';
import type { GeocodingResult } from '@/types/weather';
import type { SearchHistoryItem } from '@/types/weather';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onSelectSuggestion: (result: GeocodingResult) => void;
  onSelectHistory: (item: SearchHistoryItem) => void;
  onLocationClick: () => void;
  searchSuggestions: GeocodingResult[];
  searchHistory: SearchHistoryItem[];
  onSearchSuggestions: (query: string) => void;
  locationLoading: boolean;
  clearHistory: () => void;
}

export default function SearchBar({
  onSearch,
  onSelectSuggestion,
  onSelectHistory,
  onLocationClick,
  searchSuggestions,
  searchHistory,
  onSearchSuggestions,
  locationLoading,
  clearHistory,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        onSearchSuggestions(query);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearchSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setFocused(false);
    }
  };

  const showDropdown = focused && (query.length >= 2 ? searchSuggestions.length > 0 : searchHistory.length > 0);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search city..."
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white/10 dark:bg-gray-800/60 
                       backdrop-blur-md border border-white/20 dark:border-gray-700/50
                       text-gray-900 dark:text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50
                       transition-all duration-200 text-sm"
          />
          <div className="absolute right-3 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onLocationClick}
              disabled={locationLoading}
              title="Use my location"
              className="p-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 
                         transition-colors disabled:opacity-50"
            >
              <MapPin className={`w-4 h-4 ${locationLoading ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full z-50 rounded-2xl bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
          >
            {query.length >= 2 ? (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                  Suggestions
                </div>
                {searchSuggestions.map(result => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      onSelectSuggestion(result);
                      setQuery('');
                      setFocused(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700/50 
                               transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{result.name}</p>
                      <p className="text-xs text-gray-400">
                        {[result.admin1, result.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <span>Recent Searches</span>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-xs text-red-400 hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                {searchHistory.slice(0, 5).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onSelectHistory(item);
                      setFocused(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700/50 
                               transition-colors text-left"
                  >
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {[item.admin1, item.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
