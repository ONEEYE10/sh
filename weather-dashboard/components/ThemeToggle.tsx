'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import type { Theme } from '@/types/weather';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="relative flex items-center gap-2 px-3 py-2 rounded-xl 
                 bg-white/10 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50
                 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-yellow-400" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-400" />
        )}
      </motion.div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 hidden sm:block">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
