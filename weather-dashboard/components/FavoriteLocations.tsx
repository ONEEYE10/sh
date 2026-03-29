'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, X, Star } from 'lucide-react';
import type { Location } from '@/types/weather';

interface FavoriteLocationsProps {
  favorites: Location[];
  currentLocation: Location | null;
  onSelect: (loc: Location) => void;
  onRemove: (loc: Location) => void;
}

export default function FavoriteLocations({
  favorites,
  currentLocation,
  onSelect,
  onRemove,
}: FavoriteLocationsProps) {
  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-3xl p-5 bg-white/10 dark:bg-gray-800/40 backdrop-blur-md 
                   border border-white/20 dark:border-gray-700/50"
      >
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Favorite Locations
        </h3>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Heart className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-400">No favorites yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Click the heart icon on a location to save it here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-3xl p-5 bg-white/10 dark:bg-gray-800/40 backdrop-blur-md 
                 border border-white/20 dark:border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          Favorites ({favorites.length})
        </h3>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {favorites.map((loc, i) => {
            const isActive =
              currentLocation?.latitude === loc.latitude &&
              currentLocation?.longitude === loc.longitude;

            return (
              <motion.div
                key={`${loc.latitude}-${loc.longitude}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors group
                            ${isActive
                              ? 'bg-blue-500/20 border border-blue-500/30'
                              : 'bg-white/5 dark:bg-gray-700/30 hover:bg-white/10 dark:hover:bg-gray-700/50 border border-transparent'
                            }`}
                onClick={() => onSelect(loc)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {loc.name}
                    </p>
                    {(loc.admin1 || loc.country) && (
                      <p className="text-xs text-gray-400 truncate">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); onRemove(loc); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-400 hover:text-red-400 
                             hover:bg-red-400/10 transition-all flex-shrink-0"
                  title="Remove from favorites"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
