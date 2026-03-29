'use client';

import type { TemperatureUnit } from '@/types/weather';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: () => void;
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <button
      onClick={onToggle}
      title={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
      className="relative flex items-center px-3 py-2 rounded-xl 
                 bg-white/10 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50
                 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
    >
      <div className="flex items-center gap-1 text-sm font-medium">
        <span className={unit === 'celsius' ? 'text-blue-400 font-bold' : 'text-gray-400'}>°C</span>
        <span className="text-gray-300 dark:text-gray-600 mx-0.5">/</span>
        <span className={unit === 'fahrenheit' ? 'text-orange-400 font-bold' : 'text-gray-400'}>°F</span>
      </div>
    </button>
  );
}
