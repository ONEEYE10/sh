'use client';

import { motion } from 'framer-motion';
import type { CurrentWeatherData } from '@/types/weather';

interface AllergyOutlookProps {
  current: CurrentWeatherData;
}

interface AllergenEntry {
  icon: string;
  name: string;
  level: number;   // 0–100
  label: string;   // Low / Moderate / High / Very High
}

type LabelKey = 'low' | 'moderate' | 'high' | 'very-high';

const LABEL_STYLE: Record<LabelKey, { bar: string; text: string }> = {
  'low':      { bar: 'bg-emerald-500',  text: 'text-emerald-400' },
  'moderate': { bar: 'bg-yellow-400',   text: 'text-yellow-400'  },
  'high':     { bar: 'bg-orange-400',   text: 'text-orange-400'  },
  'very-high':{ bar: 'bg-red-500',      text: 'text-red-400'     },
};

function labelFromLevel(level: number): { label: string; key: LabelKey } {
  if (level < 25)  return { label: 'Low',       key: 'low' };
  if (level < 50)  return { label: 'Moderate',  key: 'moderate' };
  if (level < 75)  return { label: 'High',       key: 'high' };
  return               { label: 'Very High',  key: 'very-high' };
}

function clamp(val: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}

function computeAllergens(current: CurrentWeatherData): AllergenEntry[] {
  const month = new Date().getMonth(); // 0=Jan … 11=Dec
  const humidity = current.relative_humidity;
  const wind = current.wind_speed;
  const isRaining = current.weather_code >= 51 && current.weather_code <= 82;
  const rainPenalty = isRaining ? 30 : 0;

  // Season base levels (approximate Northern Hemisphere)
  // Spring (Mar–May): month 2–4, Summer (Jun–Aug): 5–7, Fall (Sep–Nov): 8–10, Winter: 11,0,1
  const inSpring  = month >= 2  && month <= 4;
  const inSummer  = month >= 5  && month <= 7;
  const inFall    = month >= 8  && month <= 10;

  const grassBase   = inSpring ? 75 : inSummer ? 70 : inFall ? 25 : 5;
  const treeBase    = inSpring ? 80 : inSummer ? 30 : inFall ? 20 : 5;
  const weedBase    = inFall   ? 75 : inSummer ? 60 : inSpring ? 20 : 5;
  const moldBase    = (humidity > 70 ? 55 : humidity > 50 ? 35 : 20)
                    + (inSummer ? 15 : inFall ? 10 : 0);
  const dustBase    = Math.max(5, (wind > 20 ? 40 : wind > 10 ? 25 : 10)
                    + (humidity < 40 ? 20 : 0));
  const pm25Base    = inSummer ? 45 : inFall ? 35 : inSpring ? 30 : 20;

  const raw: Omit<AllergenEntry, 'label'>[] = [
    { icon: '🌿', name: 'Grass Pollen', level: clamp(grassBase + (humidity < 45 ? 10 : 0) - rainPenalty) },
    { icon: '🌳', name: 'Tree Pollen',  level: clamp(treeBase  + (humidity < 45 ? 10 : 0) - rainPenalty) },
    { icon: '🌾', name: 'Weed Pollen',  level: clamp(weedBase  + (wind > 15 ? 10 : 0)    - rainPenalty) },
    { icon: '🍄', name: 'Mold Spores',  level: clamp(moldBase  + (humidity > 80 ? 20 : 0)) },
    { icon: '💨', name: 'Dust & Particles', level: clamp(dustBase) },
    { icon: '🏭', name: 'Air Particles',    level: clamp(pm25Base + (wind < 5 ? 15 : 0)) },
  ];

  return raw.map(a => {
    const { label } = labelFromLevel(a.level);
    return { ...a, label };
  });
}

export default function AllergyOutlook({ current }: AllergyOutlookProps) {
  const allergens = computeAllergens(current);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-3xl p-5 bg-white/10 dark:bg-gray-800/40 backdrop-blur-md
                 border border-white/20 dark:border-gray-700/50"
    >
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
        Allergy Outlook
      </h3>
      <p className="text-xs text-gray-500 mb-4">Simulated · Season + Humidity based</p>

      <div className="space-y-3">
        {allergens.map((a, i) => {
          const { key } = labelFromLevel(a.level);
          const styles = LABEL_STYLE[key];

          return (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-3"
            >
              {/* Icon */}
              <span className="text-lg w-6 flex-shrink-0 text-center">{a.icon}</span>

              {/* Name + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                    {a.name}
                  </p>
                  <p className={`text-xs font-semibold ml-2 flex-shrink-0 ${styles.text}`}>
                    {a.label}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-white/10 dark:bg-gray-700/50 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${styles.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${a.level}%` }}
                    transition={{ duration: 0.8, delay: 0.05 * i, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
