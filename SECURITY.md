# Security Policy

## Overview

RetroWeather 3000 is a client-side Next.js app that fetches weather data directly from the public [Open-Meteo API](https://open-meteo.com/). **No API keys, secrets, or server-side credentials are required or used.**

## Reporting a Vulnerability

If you discover a security issue, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Email or open a private security advisory on [GitHub](https://github.com/PetrStichauer/retro-weather-next/security/advisories/new).
3. Include steps to reproduce, expected vs. actual behavior, and impact assessment.

We aim to acknowledge reports within 48 hours.

## Scope

- Cross-site scripting (XSS) in the app UI
- Dependency vulnerabilities affecting production builds
- Privacy issues related to localStorage (recent cities, unit preference)

Out of scope: vulnerabilities in third-party services (Open-Meteo, Vercel hosting infrastructure).

## Best Practices for Contributors

- Never commit `.env` files or API keys — this project does not need them.
- Run `npm audit` before submitting PRs with dependency changes.
- Keep user data in `localStorage` minimal (city names and coordinates only).
