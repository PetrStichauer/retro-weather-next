# RetroWeather 3000 ☀️

> A nostalgic 90s dial-up weather app — **no API key required**

[![Live Demo](https://img.shields.io/badge/demo-retro--weather--next.vercel.app-00aaaa?style=for-the-badge)](https://retro-weather-next.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

RetroWeather 3000 brings back the neon-grid aesthetic of 1995 with modern weather data from [Open-Meteo](https://open-meteo.com/). Search any city, use your location, toggle °C/°F, and share bookmarkable links — all without signing up or configuring API keys.

## Features

- 🔍 **City search** with keyboard-navigable autocomplete
- 📍 **"Use my location"** — instant local weather
- 🌡️ **°C / °F toggle** — persisted in localStorage
- 🕐 **5-hour forecast** + **7-day daily forecast**
- 🔗 **Shareable URLs** — `?lat=&lon=&name=` for bookmarks and social
- 🏙️ **Recent cities** — quick re-access (max 5, localStorage)
- 📱 **Mobile-friendly** — horizontal scroll forecast on small screens
- 🎨 **Retro UI** — neon grid, blink text, marquee ticker

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Open-Meteo API](https://open-meteo.com/) — free, no API key

## Quick Start

```bash
git clone https://github.com/PetrStichauer/retro-weather-next.git
cd retro-weather-next
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Environment Variables

**None required.** See [`.env.example`](.env.example) for details.

## API Credit

Weather data provided by [Open-Meteo](https://open-meteo.com/) — thank you for the free, open API!

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome!

## License

MIT © 2026 [Petr Stichauer](https://github.com/PetrStichauer)

## Author

Created by **[Petr Stichauer](https://github.com/PetrStichauer)**
