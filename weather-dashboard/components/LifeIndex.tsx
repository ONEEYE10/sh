'use client';

import { motion } from 'framer-motion';
import type { CurrentWeatherData } from '@/types/weather';

interface LifeIndexProps {
  current: CurrentWeatherData;
}

type Level = 'great' | 'good' | 'moderate' | 'poor' | 'bad';

interface IndexCard {
  icon: string;
  title: string;
  text: string;
  sub?: string;
  level: Level;
}

const LEVEL_COLOR: Record<Level, string> = {
  great:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  good:     'text-teal-400    bg-teal-400/10    border-teal-400/25',
  moderate: 'text-yellow-400  bg-yellow-400/10  border-yellow-400/25',
  poor:     'text-orange-400  bg-orange-400/10  border-orange-400/25',
  bad:      'text-red-400     bg-red-400/10     border-red-400/25',
};

const LEVEL_DOT: Record<Level, string> = {
  great:    'bg-emerald-400',
  good:     'bg-teal-400',
  moderate: 'bg-yellow-400',
  poor:     'bg-orange-400',
  bad:      'bg-red-400',
};

function exercise(c: CurrentWeatherData): IndexCard {
  const t = c.temperature;
  const w = c.wind_speed;
  const code = c.weather_code;
  const isRainyOrStormy = (code >= 51 && code <= 82) || code >= 95;

  if (isRainyOrStormy || w >= 50) {
    return { icon: '🏠', title: 'Exercise', text: 'Stay indoors', sub: isRainyOrStormy ? 'Bad weather' : 'High winds', level: 'bad' };
  }
  if (t < 0) {
    return { icon: '🥶', title: 'Exercise', text: 'Avoid outdoors', sub: 'Too cold', level: 'bad' };
  }
  if (t >= 20 && t < 32 && w < 20) {
    return { icon: '🏃', title: 'Exercise', text: 'Great for exercise', sub: 'Perfect conditions', level: 'great' };
  }
  if (t >= 32) {
    return { icon: '🌡️', title: 'Exercise', text: 'Heat caution', sub: 'Stay hydrated', level: 'poor' };
  }
  if (t >= 10 && w < 30) {
    return { icon: '🚶', title: 'Exercise', text: 'Good for exercise', sub: 'Light activity', level: 'good' };
  }
  return { icon: '🧘', title: 'Exercise', text: 'Indoor workout', sub: 'Cool outside', level: 'moderate' };
}

function clothing(c: CurrentWeatherData): IndexCard {
  const t = c.apparent_temperature;
  const rain = (c.weather_code >= 51 && c.weather_code <= 82);
  const wind = c.wind_speed > 15;

  let icon = '👕', text = '', sub = '', level: Level = 'good';

  if (t < 0)        { icon = '🧥'; text = 'Heavy winter coat'; sub = 'Scarf & gloves too'; level = 'bad'; }
  else if (t < 8)   { icon = '🧣'; text = 'Thick coat';        sub = 'Warm layers';         level = 'poor'; }
  else if (t < 15)  { icon = '🧥'; text = 'Jacket needed';     sub = 'Mid-layer';            level = 'moderate'; }
  else if (t < 22)  { icon = '👔'; text = 'Light jacket';      sub = 'Comfortable';          level = 'good'; }
  else if (t < 28)  { icon = '👕'; text = 'Light clothes';     sub = 'T-shirt weather';      level = 'great'; }
  else              { icon = '🩳'; text = 'Very light wear';   sub = 'Stay cool';            level = 'poor'; }

  if (wind && !text.includes('coat')) sub += ' + Windbreaker';
  if (rain) { icon = '☂️'; sub += ' + Umbrella'; }

  return { icon, title: 'Clothing', text, sub, level };
}

function travel(c: CurrentWeatherData): IndexCard {
  const code = c.weather_code;
  const vis = c.visibility;
  const wind = c.wind_speed;

  if (code >= 95) {
    return { icon: '⛈️', title: 'Travel', text: 'Avoid travel', sub: 'Thunderstorm', level: 'bad' };
  }
  if (vis < 500 || code === 45 || code === 48) {
    return { icon: '🌫️', title: 'Travel', text: 'Very low visibility', sub: 'Fog — use caution', level: 'bad' };
  }
  if (wind > 60) {
    return { icon: '💨', title: 'Travel', text: 'Hazardous winds', sub: 'Delay if possible', level: 'bad' };
  }
  if ((code >= 61 && code <= 65) || code === 80 || code === 81 || code === 82) {
    return { icon: '🌧️', title: 'Travel', text: 'Allow extra time', sub: 'Rain delays', level: 'poor' };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { icon: '❄️', title: 'Travel', text: 'Slow down', sub: 'Snow on roads', level: 'poor' };
  }
  if (code >= 51 && code <= 55) {
    return { icon: '🌦️', title: 'Travel', text: 'Minor delays', sub: 'Drizzle expected', level: 'moderate' };
  }
  return { icon: '🚗', title: 'Travel', text: 'Good conditions', sub: 'Safe to travel', level: 'great' };
}

function driving(c: CurrentWeatherData): IndexCard {
  const code = c.weather_code;
  const vis = c.visibility;
  const wind = c.wind_speed;

  if (code >= 95) {
    return { icon: '⛈️', title: 'Driving', text: 'Dangerous', sub: 'Avoid driving', level: 'bad' };
  }
  if (code === 75 || code === 86 || code === 82) {
    return { icon: '🚨', title: 'Driving', text: 'Very hazardous', sub: 'Ice/flood risk', level: 'bad' };
  }
  if ((code >= 71 && code <= 77) || code === 85) {
    return { icon: '⚠️', title: 'Driving', text: 'Drive carefully', sub: 'Snow/icy roads', level: 'poor' };
  }
  if (vis < 1000 || code === 45 || code === 48) {
    return { icon: '🌫️', title: 'Driving', text: 'Reduce speed', sub: 'Low visibility', level: 'poor' };
  }
  if (wind > 60) {
    return { icon: '💨', title: 'Driving', text: 'Strong crosswinds', sub: 'Hold steering firmly', level: 'poor' };
  }
  if (code >= 61 && code <= 65) {
    return { icon: '🌧️', title: 'Driving', text: 'Wet roads', sub: 'Increase distance', level: 'moderate' };
  }
  return { icon: '✅', title: 'Driving', text: 'Normal conditions', sub: 'Safe to drive', level: 'great' };
}

function fluRisk(c: CurrentWeatherData): IndexCard {
  const t = c.temperature;
  const h = c.relative_humidity;

  if (t < 5 || (t < 10 && h < 40)) {
    return { icon: '🤧', title: 'Flu Risk', text: 'High risk', sub: 'Cold & dry air', level: 'bad' };
  }
  if (t < 10) {
    return { icon: '😷', title: 'Flu Risk', text: 'Elevated risk', sub: 'Cold weather', level: 'poor' };
  }
  if (h > 80) {
    return { icon: '😮‍💨', title: 'Flu Risk', text: 'Moderate risk', sub: 'High humidity', level: 'moderate' };
  }
  if (t >= 10 && t < 20) {
    return { icon: '🌡️', title: 'Flu Risk', text: 'Low-moderate risk', sub: 'Seasonal', level: 'moderate' };
  }
  return { icon: '💪', title: 'Flu Risk', text: 'Low risk', sub: 'Warm weather', level: 'great' };
}

function moisturizer(c: CurrentWeatherData): IndexCard {
  const h = c.relative_humidity;
  const wind = c.wind_speed;
  const t = c.temperature;

  const effectiveHumidity = h - (wind > 20 ? 10 : 0) - (t > 30 ? 5 : 0);

  if (effectiveHumidity < 25) {
    return { icon: '💧', title: 'Moisturizer', text: 'Urgently needed', sub: 'Very dry air', level: 'bad' };
  }
  if (effectiveHumidity < 40) {
    return { icon: '🧴', title: 'Moisturizer', text: 'Apply moisturizer', sub: 'Dry conditions', level: 'poor' };
  }
  if (effectiveHumidity < 55) {
    return { icon: '🧴', title: 'Moisturizer', text: 'Recommended', sub: 'Slightly dry', level: 'moderate' };
  }
  if (effectiveHumidity < 70) {
    return { icon: '✨', title: 'Moisturizer', text: 'Optional', sub: 'Good humidity', level: 'good' };
  }
  return { icon: '💦', title: 'Moisturizer', text: 'Not needed', sub: 'Humid air', level: 'great' };
}

export default function LifeIndex({ current }: LifeIndexProps) {
  const cards: IndexCard[] = [
    exercise(current),
    clothing(current),
    travel(current),
    driving(current),
    fluRisk(current),
    moisturizer(current),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl p-5 bg-white/10 dark:bg-gray-800/40 backdrop-blur-md
                 border border-white/20 dark:border-gray-700/50"
    >
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Life Index
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i }}
            className={`flex flex-col gap-1.5 p-3 rounded-2xl border ${LEVEL_COLOR[card.level]} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{card.icon}</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${LEVEL_DOT[card.level]}`} />
                <p className="text-xs font-semibold">{card.title}</p>
              </div>
            </div>
            <p className="text-xs font-medium leading-tight">{card.text}</p>
            {card.sub && <p className="text-xs opacity-70 leading-tight">{card.sub}</p>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
