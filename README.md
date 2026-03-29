# sh
# 👋 Hi, I'm Mouad | Business & UI/UX Explorer

I’m a Business Administration student based in Istanbul, merging business logic with high-end digital aesthetics. I use the **GitHub Student Pack** and **AI-driven automation** to build "crazy" responsive websites inspired by anime-core UI and modern dark-mode design.

### ⚡ What I’m Building
- 🎨 **Anime-Inspired UI/UX:** Crafting immersive interfaces with glassmorphism and neon aesthetics.
- 🤖 **AI-Integrated Coding:** Leveraging tools like GitHub Copilot and Claude to scale development.
- 📱 **Mobile-First Design:** Ensuring every "crazy" design works perfectly on a 186cm-tall perspective or a small handheld screen.

### 🛠️ My Toolkit
- **Frontend:** HTML5, CSS3 (Tailwind CSS), JavaScript
- **Tools:** GitHub Student Developer Pack, Vercel, Figma
- **Style:** Dark Mode, Kinetic Typography, Bento Grids

### 🎯 Current Focus
I’m currently exploring automated workflows to turn high-fidelity UI designs into live, responsive websites instantly.

---
*“Business provides the structure; UI provides the soul.”*

---

## 🌤️ Weather Dashboard

A production-ready, animated weather dashboard built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

### 📁 Location
```
weather-dashboard/
```

### 🚀 Getting Started

```bash
cd weather-dashboard
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 🏗️ Production Build

```bash
cd weather-dashboard
npm run build
npm start
```

### 🌐 APIs Used

| API | Purpose | Auth |
|-----|---------|------|
| [Open-Meteo](https://open-meteo.com/) | Real-time weather + 7-day forecast | None (free) |
| [Open-Meteo Geocoding](https://geocoding-api.open-meteo.com/) | City search → lat/lon | None (free) |
| [Quotable](https://api.quotable.io/) | Inspirational quotes in footer | None (free) |

> The Quotable API is proxied via a Next.js API route (`/api/quote`) to avoid CORS issues.

### ✨ Features

- **Current weather** — temperature, feels like, humidity, wind, UV index, precipitation
- **7-day daily forecast** — min/max temps, condition icons
- **24-hour hourly forecast** — scrollable strip with precipitation probability
- **City search** — debounced (400ms) geocoding with dropdown suggestions
- **Geolocation** — "Use my location" via browser API
- **°C / °F toggle** — persisted to localStorage
- **Dark / Light mode** — system preference detection + manual toggle
- **Favourite cities** — up to 5, stored in localStorage
- **Dynamic backgrounds** — gradient changes with weather condition and time of day
- **Glassmorphism UI** — frosted-glass cards with neon hover effects
- **Framer Motion animations** — fade-in, slide-up transitions
- **Skeleton loaders** — while data is fetching
- **Error states** — with retry button
- **Weather cache** — 10-minute in-memory cache

### 🛠️ Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — animations
- **Lucide React** — icons
- **Open-Meteo** — free, no-API-key weather data
