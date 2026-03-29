# Weather Dashboard 🌤️

A modern, responsive weather dashboard built with **Next.js**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**. Powered by the free [Open-Meteo API](https://open-meteo.com) — no API key required!

## ✨ Features

- **Real-time Weather** — Current conditions including temperature, humidity, wind, UV index, and pressure
- **7-Day Forecast** — Daily high/low temperatures with precipitation and wind info
- **Hourly Forecast** — 24-hour scrollable forecast view
- **City Search** — Instant search with autocomplete suggestions
- **Geolocation** — Detect your current location automatically
- **Favorites** — Save and quickly switch between favorite locations
- **Search History** — Access your recent searches
- **Dark / Light Mode** — Toggle between themes, persisted in localStorage
- **Temperature Units** — Switch between Celsius and Fahrenheit
- **Weather Alerts** — Automatic alerts for high UV, strong winds, and thunderstorms
- **Sunrise / Sunset** — Daily sun schedule display
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Smooth Animations** — Powered by Framer Motion

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) | React framework with App Router |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://framer.com/motion) | Animations |
| [Lucide React](https://lucide.dev) | Icons |
| [Open-Meteo API](https://open-meteo.com) | Free weather data (no key needed) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to the project directory
cd weather-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

No environment variables are required! Open-Meteo is free and doesn't require an API key.

If you want to use an alternative API in the future, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

## 📁 Project Structure

```
weather-dashboard/
├── app/
│   ├── globals.css          # Global styles, Tailwind imports, dark mode
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── CurrentWeather.tsx   # Current conditions display
│   ├── ForecastCard.tsx     # 7-day forecast
│   ├── HourlyForecast.tsx   # Hourly scrollable forecast
│   ├── FavoriteLocations.tsx # Saved locations panel
│   ├── SearchBar.tsx        # Search with autocomplete
│   ├── ThemeToggle.tsx      # Dark/light mode toggle
│   ├── UnitToggle.tsx       # °C/°F toggle
│   ├── WeatherAlerts.tsx    # Weather alerts/warnings
│   └── LoadingSpinner.tsx   # Loading state
├── hooks/
│   ├── useWeather.ts        # Weather data fetching hook
│   ├── useGeolocation.ts    # Browser geolocation hook
│   └── useLocalStorage.ts   # Persistent localStorage hook
└── types/
    └── weather.ts           # TypeScript types, WMO codes, utilities
```

## 🌐 API Integration

This app uses the [Open-Meteo API](https://open-meteo.com):

- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
- **Weather**: `https://api.open-meteo.com/v1/forecast`

No API key needed. Rate limits are generous for personal use.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Set the root directory to `weather-dashboard`
4. Deploy!

### GitHub Pages

For static export, update `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/your-repo-name', // replace with your GitHub repository name
  images: { unoptimized: true },
};
```

Then run:

```bash
npm run build
# Deploy the `out/` directory to GitHub Pages
```

### Other Platforms

The app can be deployed to any platform supporting Node.js or static hosting (Netlify, Railway, Render, etc.).

## 🤝 Contributing

Pull requests are welcome! Please ensure:
- TypeScript types are maintained
- Components are modular and reusable
- Dark mode works for new UI elements

## 📄 License

MIT

