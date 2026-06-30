/**
 * Sky/sun/moon math for the time-synced clock themes. Pure functions.
 * Times are "minutes from local midnight". Defaults assume 06:00 / 18:00 when
 * real sunrise/sunset (from prayer times) aren't available.
 */

export type SkyPhase = 'dawn' | 'day' | 'dusk' | 'night';

export function minutesNow(d: Date): number {
  return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
}

export function parseHHMM(hhmm?: string): number | null {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h)) return null;
  return h * 60 + (m || 0);
}

/**
 * Where the sun (day) or moon (night) sits along its horizon-to-horizon arc.
 * Returns { isDay, t } where t is 0→1 across the relevant arc (left→right).
 */
export function arcPosition(now: number, sunrise = 360, sunset = 1080): { isDay: boolean; t: number } {
  if (now >= sunrise && now <= sunset) {
    return { isDay: true, t: (now - sunrise) / Math.max(1, sunset - sunrise) };
  }
  // Night: from sunset (t=0) wrapping through midnight to next sunrise (t=1).
  const nightLen = 1440 - (sunset - sunrise);
  const since = now > sunset ? now - sunset : now + (1440 - sunset);
  return { isDay: false, t: Math.min(1, Math.max(0, since / Math.max(1, nightLen))) };
}

export function phaseOf(now: number, sunrise = 360, sunset = 1080): SkyPhase {
  if (now < sunrise - 60 || now > sunset + 60) return 'night';
  if (now < sunrise + 60) return 'dawn';
  if (now > sunset - 60) return 'dusk';
  return 'day';
}

/** Two-stop vertical sky gradient [top, bottom] for the current phase. */
export function skyGradient(phase: SkyPhase): [string, string] {
  switch (phase) {
    case 'dawn':
      return ['#F9C9A0', '#7FA7D9'];
    case 'day':
      return ['#5BA7E8', '#BFE3FF'];
    case 'dusk':
      return ['#E8915B', '#46365E'];
    case 'night':
    default:
      return ['#0B1026', '#1C2747'];
  }
}

/** Moon illuminated fraction (0=new, 0.5=quarter, 1=full) — Conway-style approximation. */
export function moonIllumination(date: Date): { phase: number; illum: number } {
  // Days since a known new moon (2000-01-06 18:14 UTC).
  const synodic = 29.530588853;
  const known = Date.UTC(2000, 0, 6, 18, 14) / 86_400_000;
  const days = date.getTime() / 86_400_000 - known;
  let phase = (days % synodic) / synodic;
  if (phase < 0) phase += 1;
  const illum = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  return { phase, illum };
}
