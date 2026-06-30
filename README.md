# Calendar

One calendar that shows **English (Gregorian)**, **Bangla (Bangabda)**, and **Arabic (Hijri)** dates together — plus a minimal full‑screen clock with time‑synced animated themes. Built as an installable PWA (iPhone, Android, Mac, Windows), offline‑first, with an Apple‑minimal design.

## Modes

The app is organized around a top‑level **mode** switch; each mode reframes the data and theme:

- **Default** — month grid across all three calendars, with a combined‑view toggle: English · English + Arabic · Bangla + English.
- **Agriculture** (Bangladesh) — current Bangla season (৬ ঋতু) with the best crops to grow, seasonal fruits, and seasonal flowers; nature theme.
- **Islamic** — Hijri‑led view with prayer times, Ramadan Sehri/Iftar, Qibla, and Islamic occasions; English national holidays alongside.

## Features

- Tri‑calendar month grid (Apple‑style), per‑calendar visibility toggles, "Today" hero.
- Full‑screen clock: digital‑seconds, analog, flip, and nightstand faces.
- Time‑synced themes: **Celestial Arc** (sun arcs by real sunrise→sunset, moon by phase at night), Gradient Sky, Aurora.
- Prayer times (Aladhan API, geolocation with Dhaka fallback), cached for offline.
- Date converter, Qibla direction, on‑device events/reminders.
- Native numerals toggle (123 / ১২৩ / ١٢٣), light/dark.

## Calendar accuracy

- **Bangla** — Bangladesh revised system (Pohela Boishakh fixed to 14 April; first six months 31 days, Falgun 29/30). Verified against fixed national anchors (16 Dec = 1 Poush, 21 Feb = 8 Falgun, 26 Mar = 12 Choitro).
- **Hijri** — Umm al‑Qura via the platform `Intl` API (offline), auto‑refined from the Aladhan API when online. No manual adjustment.

Run the conversion suite: `npm test`.

## Develop

```bash
npm install
npm run web        # Expo web / PWA dev server
npm run typecheck
npm test
```

## Deploy

Expo web → Vercel (`expo export -p web` → `dist/`), same as the Onylogy setup. Push to `main` to auto‑deploy. Bump the `CACHE` constant in `public/sw.js` when shipping asset changes so old PWA caches purge.
