'use client';

import type { ReactElement } from 'react';

export type WeatherIconVariant =
  | 'sunny'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy-rain'
  | 'snow'
  | 'heavy-snow'
  | 'thunderstorm'
  | 'thunderstorm-hail';

export function getIconVariant(code: number, isDay: boolean): WeatherIconVariant {
  if (code === 0)              return isDay ? 'sunny'              : 'clear-night';
  if (code === 1 || code === 2) return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
  if (code === 3)              return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 55)   return 'drizzle';
  if (code === 61 || code === 63 || code === 80 || code === 81) return 'rain';
  if (code === 65 || code === 82) return 'heavy-rain';
  if (code === 71 || code === 73 || code === 77 || code === 85) return 'snow';
  if (code === 75 || code === 86) return 'heavy-snow';
  if (code === 95)             return 'thunderstorm';
  if (code === 96 || code === 99) return 'thunderstorm-hail';
  return isDay ? 'sunny' : 'clear-night';
}

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: number;
  className?: string;
}

/* ── Individual SVG icon renderers ──────────────────────────── */

function SunnyIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {/* Glow */}
      <circle cx="20" cy="20" r="13" fill="#FCD34D" className="wi-pulse-glow" />
      {/* Rays */}
      <g className="wi-spin">
        <line x1="20" y1="2"  x2="20" y2="7"  stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="33" x2="20" y2="38" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="2"  y1="20" x2="7"  y2="20" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33" y1="20" x2="38" y2="20" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="6.1"  y1="6.1"  x2="9.6"  y2="9.6"  stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30.4" y1="30.4" x2="33.9" y2="33.9" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="6.1"  y1="33.9" x2="9.6"  y2="30.4" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30.4" y1="9.6"  x2="33.9" y2="6.1"  stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* Disc */}
      <circle cx="20" cy="20" r="8.5" fill="#FBBF24" />
      <circle cx="20" cy="20" r="6.5" fill="#F59E0B" />
    </svg>
  );
}

function ClearNightIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {/* Stars */}
      <circle cx="8"  cy="10" r="1.5" fill="#E0E7FF" className="wi-star-1" />
      <circle cx="32" cy="8"  r="1"   fill="#E0E7FF" className="wi-star-2" />
      <circle cx="35" cy="22" r="1.5" fill="#E0E7FF" className="wi-star-3" />
      {/* Moon */}
      <path
        d="M26 20 A10 10 0 1 1 20 10 A7 7 0 1 0 26 20 Z"
        fill="#FCD34D"
      />
      <path
        d="M26 20 A10 10 0 1 1 20 10 A7 7 0 1 0 26 20 Z"
        fill="#F59E0B"
        opacity="0.5"
      />
    </svg>
  );
}

function CloudBase({ cx = 22, cy = 24, fill = '#94A3B8' }: { cx?: number; cy?: number; fill?: string }) {
  return (
    <>
      <ellipse cx={cx - 6} cy={cy}     rx="5"   ry="4.5" fill={fill} />
      <ellipse cx={cx + 2} cy={cy - 3} rx="6"   ry="5.5" fill={fill} />
      <ellipse cx={cx + 9} cy={cy}     rx="4.5" ry="4"   fill={fill} />
      <rect x={cx - 11} y={cy - 1} width={25} height={8} rx="3" fill={fill} />
    </>
  );
}

function PartlyCloudyDayIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {/* Sun behind */}
      <g opacity="0.9">
        <g className="wi-spin">
          <line x1="10" y1="3"  x2="10" y2="7"  stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="19" x2="10" y2="23" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
          <line x1="2"  y1="12" x2="6"  y2="12" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="12" x2="18" y2="12" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
          <line x1="4.3" y1="5.3" x2="7"  y2="8"   stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
          <line x1="13" y1="16" x2="15.7" y2="18.7" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
          <line x1="4.3" y1="18.7" x2="7"  y2="16"  stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
          <line x1="13" y1="8"   x2="15.7" y2="5.3" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="10" cy="12" r="5.5" fill="#FBBF24" />
      </g>
      {/* Cloud */}
      <g className="wi-float">
        <CloudBase cx={22} cy={27} fill="#CBD5E1" />
      </g>
    </svg>
  );
}

function PartlyCloudyNightIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {/* Moon behind */}
      <path
        d="M18 8 A8 8 0 1 1 12 18 A5.5 5.5 0 1 0 18 8 Z"
        fill="#FCD34D"
        opacity="0.85"
      />
      {/* Cloud */}
      <g className="wi-float">
        <CloudBase cx={22} cy={28} fill="#94A3B8" />
      </g>
    </svg>
  );
}

function CloudyIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {/* Back cloud */}
      <g className="wi-float" style={{ animationDelay: '0.8s' }}>
        <ellipse cx="14" cy="22" rx="5"   ry="4.5" fill="#94A3B8" opacity="0.5" />
        <ellipse cx="22" cy="19" rx="6"   ry="5.5" fill="#94A3B8" opacity="0.5" />
        <ellipse cx="29" cy="22" rx="4.5" ry="4"   fill="#94A3B8" opacity="0.5" />
        <rect x="9" y="21" width="25" height="8" rx="3" fill="#94A3B8" opacity="0.5" />
      </g>
      {/* Front cloud */}
      <g className="wi-float">
        <CloudBase cx={20} cy={26} fill="#CBD5E1" />
      </g>
    </svg>
  );
}

function OvercastIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <g className="wi-float">
        <ellipse cx="14" cy="23" rx="6"   ry="5.5" fill="#64748B" />
        <ellipse cx="22" cy="19" rx="7"   ry="6.5" fill="#64748B" />
        <ellipse cx="30" cy="23" rx="5.5" ry="5"   fill="#64748B" />
        <rect x="8" y="21" width="26" height="9" rx="4" fill="#64748B" />
      </g>
    </svg>
  );
}

function FogIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <line x1="4"  y1="14" x2="36" y2="14" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" className="wi-fog-1" />
      <line x1="7"  y1="20" x2="33" y2="20" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" className="wi-fog-2" />
      <line x1="4"  y1="26" x2="30" y2="26" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" className="wi-fog-3" />
      <line x1="10" y1="32" x2="36" y2="32" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" className="wi-fog-1" />
    </svg>
  );
}

function DrizzleIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <g className="wi-float">
        <CloudBase cx={20} cy={18} fill="#94A3B8" />
      </g>
      <line x1="13" y1="29" x2="11" y2="35" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" className="wi-rain-1" />
      <line x1="20" y1="28" x2="18" y2="34" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" className="wi-rain-2" />
      <line x1="27" y1="29" x2="25" y2="35" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" className="wi-rain-3" />
    </svg>
  );
}

function RainIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <g className="wi-float">
        <CloudBase cx={20} cy={17} fill="#64748B" />
      </g>
      <line x1="12" y1="27" x2="9"  y2="35" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" className="wi-rain-1" />
      <line x1="19" y1="26" x2="16" y2="34" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" className="wi-rain-2" />
      <line x1="26" y1="27" x2="23" y2="35" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" className="wi-rain-3" />
      <line x1="33" y1="26" x2="30" y2="34" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" className="wi-rain-4" />
    </svg>
  );
}

function HeavyRainIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <g className="wi-float">
        <CloudBase cx={20} cy={15} fill="#475569" />
      </g>
      <line x1="10" y1="25" x2="7"  y2="33" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" className="wi-rain-1" />
      <line x1="16" y1="24" x2="13" y2="32" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" className="wi-rain-2" />
      <line x1="22" y1="25" x2="19" y2="33" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" className="wi-rain-3" />
      <line x1="28" y1="24" x2="25" y2="32" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" className="wi-rain-4" />
      <line x1="34" y1="25" x2="31" y2="33" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" className="wi-rain-5" />
      <line x1="13" y1="32" x2="10" y2="38" stroke="#1D4ED8" strokeWidth="2"   strokeLinecap="round" className="wi-rain-6" />
      <line x1="25" y1="32" x2="22" y2="38" stroke="#1D4ED8" strokeWidth="2"   strokeLinecap="round" className="wi-rain-5" />
    </svg>
  );
}

function SnowflakeGroup({ offsets }: { offsets: [number, number, string][] }) {
  return (
    <>
      {offsets.map(([x, y, cls]) => (
        <g key={cls} className={cls}>
          <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
          <line x1={x - 4} y1={y} x2={x + 4} y2={y} stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
          <line x1={x - 2.8} y1={y - 2.8} x2={x + 2.8} y2={y + 2.8} stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={x + 2.8} y1={y - 2.8} x2={x - 2.8} y2={y + 2.8} stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
    </>
  );
}

function SnowIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <g className="wi-float">
        <CloudBase cx={20} cy={16} fill="#94A3B8" />
      </g>
      <SnowflakeGroup offsets={[[13, 30, 'wi-snow-1'], [20, 28, 'wi-snow-2'], [27, 30, 'wi-snow-3']]} />
    </svg>
  );
}

function HeavySnowIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <g className="wi-float">
        <CloudBase cx={20} cy={14} fill="#64748B" />
      </g>
      <SnowflakeGroup offsets={[
        [11, 27, 'wi-snow-1'],
        [19, 25, 'wi-snow-2'],
        [27, 27, 'wi-snow-3'],
        [15, 34, 'wi-snow-4'],
      ]} />
    </svg>
  );
}

function ThunderstormIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <g className="wi-float">
        <CloudBase cx={20} cy={14} fill="#374151" />
      </g>
      {/* Rain */}
      <line x1="11" y1="25" x2="9"  y2="31" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" className="wi-rain-1" />
      <line x1="29" y1="25" x2="27" y2="31" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" className="wi-rain-2" />
      {/* Lightning bolt */}
      <path
        d="M22 24 L18 31 L21 31 L17 38 L24 29 L21 29 Z"
        fill="#FDE047"
        className="wi-lightning"
      />
    </svg>
  );
}

function ThunderstormHailIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <g className="wi-float">
        <CloudBase cx={20} cy={13} fill="#374151" />
      </g>
      {/* Hail drops */}
      <circle cx="13" cy="29" r="2" fill="#BAE6FD" className="wi-rain-1" />
      <circle cx="20" cy="27" r="2" fill="#BAE6FD" className="wi-rain-2" />
      <circle cx="27" cy="29" r="2" fill="#BAE6FD" className="wi-rain-3" />
      {/* Lightning */}
      <path
        d="M21 23 L17.5 30 L20.5 30 L17 37 L23 28 L20 28 Z"
        fill="#FDE047"
        className="wi-lightning"
      />
    </svg>
  );
}

const ICON_MAP: Record<WeatherIconVariant, (size: number) => ReactElement> = {
  'sunny':              (s) => <SunnyIcon size={s} />,
  'clear-night':        (s) => <ClearNightIcon size={s} />,
  'partly-cloudy-day':  (s) => <PartlyCloudyDayIcon size={s} />,
  'partly-cloudy-night':(s) => <PartlyCloudyNightIcon size={s} />,
  'cloudy':             (s) => <CloudyIcon size={s} />,
  'overcast':           (s) => <OvercastIcon size={s} />,
  'fog':                (s) => <FogIcon size={s} />,
  'drizzle':            (s) => <DrizzleIcon size={s} />,
  'rain':               (s) => <RainIcon size={s} />,
  'heavy-rain':         (s) => <HeavyRainIcon size={s} />,
  'snow':               (s) => <SnowIcon size={s} />,
  'heavy-snow':         (s) => <HeavySnowIcon size={s} />,
  'thunderstorm':       (s) => <ThunderstormIcon size={s} />,
  'thunderstorm-hail':  (s) => <ThunderstormHailIcon size={s} />,
};

export default function WeatherIcon({ code, isDay = true, size = 40, className = '' }: WeatherIconProps) {
  const variant = getIconVariant(code, isDay);
  const render = ICON_MAP[variant];
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      role="img"
      aria-label={variant.replace(/-/g, ' ')}
    >
      {render(size)}
    </span>
  );
}
