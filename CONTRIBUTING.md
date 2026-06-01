# Contributing to RetroWeather 3000

Thanks for your interest in contributing! This project is a nostalgic 90s-style weather app built with Next.js and the keyless Open-Meteo API.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/retro-weather-next.git`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Before Submitting a PR

Please run these commands and ensure they pass:

```bash
npm run lint
npm run build
```

## Pull Request Guidelines

- Create a feature branch from `main` (e.g. `feat/geolocation-improvements`)
- Keep changes focused — one feature or fix per PR
- Match the existing retro aesthetic (neon grid, monospace, blink animations)
- No API keys or `.env` files — Open-Meteo is keyless
- Update README if you add user-facing features

## Code Style

- TypeScript for all new code
- Put API logic in `lib/`, UI components in `components/`
- Use existing Tailwind retro color tokens (`retro-teal`, `retro-pink`, etc.)
- Use `.retro-btn` and `.retro-input` classes for interactive elements

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) on GitHub Issues.

## Questions?

Open a GitHub Discussion or Issue — happy to help!

Created by [Petr Stichauer](https://github.com/PetrStichauer)
