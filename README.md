# AYAB — Tricycle Booking Web App

A frontend-only Ionic + Angular web application for Tuguegarao City, Philippines. It implements commuter, driver, and administrator flows using mock data and browser LocalStorage — no backend, database, or API key required.

## Tech stack
- Angular 20 (standalone components, signals)
- Ionic 8 (web components)
- TypeScript
- LocalStorage for persistence, `qrcode` for QR generation

## Local development
```bash
npm install
npm start
```
The app runs at `http://localhost:4200`.

## Production build
```bash
npm run build
```
Output is written to `dist/ayab/browser`.

## Deploying to Vercel
This repo includes a `vercel.json` already configured for a static Angular SPA:
- Build command: `npm run build`
- Output directory: `dist/ayab/browser`
- SPA rewrite so client-side routes (e.g. `/commuter/home`) resolve correctly on refresh/direct visit
- Long-term caching for hashed static assets

To deploy:
1. Push this project to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the repo in the Vercel dashboard, or run `vercel` from this directory with the Vercel CLI.
3. No environment variables are required.

## Demo accounts
- Commuter: `commuter@ayab.com` / `123456`
- Driver: `driver@ayab.com` / `123456`
- Admin: `admin@ayab.com` / `123456`

## Features
- **Commuter:** booking flow, mock map, fare estimate, driver matching, QR verification demo, live tracking simulation, trip history, ratings, notifications, profile and settings.
- **Driver:** online/offline toggle, ride requests, active trip controls, personal QR code, trip history, profile.
- **Admin:** operations dashboard, driver verification, commuter directory, booking filters, incident management, announcements, and reports.

## Notes
- The map is an offline visual mock centered on real Tuguegarao landmarks — no map/geocoding API is used.
- Driver QR codes are generated locally with the `qrcode` package; camera scanning is simulated so the app works fully offline.
- Use **Settings → Reset Demo Data** (commuter) to clear local state and start fresh.
