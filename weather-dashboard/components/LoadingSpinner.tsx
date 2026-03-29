'use client';

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Fetching weather data...' }: LoadingSpinnerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <RefreshCw className="w-10 h-10 text-blue-400" />
      </motion.div>
      <div className="text-center">
        <p className="text-base font-medium text-gray-600 dark:text-gray-300">{message}</p>
        <p className="text-sm text-gray-400 mt-1">Powered by Open-Meteo</p>
      </div>
    </motion.div>
  );
}
