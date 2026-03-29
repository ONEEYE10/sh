'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, Bell } from 'lucide-react';
import type { WeatherAlert } from '@/types/weather';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const severityConfig = {
  high: {
    icon: AlertTriangle,
    bg: 'bg-red-500/10 border-red-500/30',
    text: 'text-red-500',
    badge: 'bg-red-500/20 text-red-400',
  },
  medium: {
    icon: AlertCircle,
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    text: 'text-yellow-500',
    badge: 'bg-yellow-500/20 text-yellow-400',
  },
  low: {
    icon: Info,
    bg: 'bg-blue-500/10 border-blue-500/30',
    text: 'text-blue-500',
    badge: 'bg-blue-500/20 text-blue-400',
  },
};

export default function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Weather Alerts
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">
          {alerts.length}
        </span>
      </div>

      <AnimatePresence>
        {alerts.map((alert, i) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <motion.div
              key={`${alert.title}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-sm ${config.bg}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.text}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-semibold ${config.text}`}>{alert.title}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${config.badge}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
