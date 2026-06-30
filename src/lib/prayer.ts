/**
 * Prayer times via the free Aladhan API (no auth). Geolocation on web with a
 * Dhaka fallback; results cached per day+location in AsyncStorage so the PWA
 * works offline after the first online fetch.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { useStore } from '@/store/useStore';

export const DHAKA = { lat: 23.8103, lng: 90.4125, label: 'Dhaka' };

export type Coords = { lat: number; lng: number; label: string };

export type PrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunset: string;
};

function ddmmyyyy(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function clean(t: string): string {
  // Aladhan returns e.g. "04:21 (+06)"; keep HH:MM.
  return (t || '').split(' ')[0];
}

/** Best-effort current location: saved setting → browser geolocation → Dhaka. */
function getBrowserLocation(): Promise<Coords> {
  return new Promise((resolve) => {
    const g: any = typeof navigator !== 'undefined' ? (navigator as any).geolocation : null;
    if (!g) return resolve(DHAKA);
    g.getCurrentPosition(
      (pos: any) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'Your location' }),
      () => resolve(DHAKA),
      { timeout: 8000, maximumAge: 3_600_000 }
    );
  });
}

async function fetchTimings(date: Date, loc: Coords): Promise<PrayerTimes> {
  const cacheKey = `prayer/${ddmmyyyy(date)}/${loc.lat.toFixed(2)},${loc.lng.toFixed(2)}`;
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {
    /* ignore */
  }
  // method=1: University of Islamic Sciences, Karachi (common in Bangladesh).
  const url = `https://api.aladhan.com/v1/timings/${ddmmyyyy(date)}?latitude=${loc.lat}&longitude=${loc.lng}&method=1`;
  const res = await fetch(url);
  const json = await res.json();
  const t = json?.data?.timings ?? {};
  const out: PrayerTimes = {
    Fajr: clean(t.Fajr),
    Sunrise: clean(t.Sunrise),
    Dhuhr: clean(t.Dhuhr),
    Asr: clean(t.Asr),
    Maghrib: clean(t.Maghrib),
    Isha: clean(t.Isha),
    Sunset: clean(t.Sunset ?? t.Maghrib),
  };
  AsyncStorage.setItem(cacheKey, JSON.stringify(out)).catch(() => {});
  return out;
}

export function usePrayerTimes(date: Date) {
  const saved = useStore((s) => s.settings.location);
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loc, setLoc] = useState<Coords | null>(saved ?? null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const iso = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    (async () => {
      const location = saved ?? (await getBrowserLocation());
      if (!alive) return;
      setLoc(location);
      try {
        const t = await fetchTimings(date, location);
        if (!alive) return;
        setTimes(t);
        setStatus('ready');
      } catch {
        if (alive) setStatus('error');
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iso, saved?.lat, saved?.lng]);

  return { times, location: loc, status };
}

/** Parse "HH:MM" on `base` date into a Date. */
export function timeOn(base: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h || 0, m || 0, 0);
}
