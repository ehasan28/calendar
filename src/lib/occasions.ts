/**
 * Holidays, festivals & religious occasions across the three calendars.
 * - `gregorian`: fixed Gregorian MM-DD (Bangladesh national days + international).
 * - `bangla`: fixed Bangla month/day (cultural festivals).
 * - `hijri`: fixed Hijri month/day (Islamic occasions; dates are Umm al-Qura
 *   calculated and may shift ±1 day by local moon sighting).
 * Bangladesh-focused (India excluded), per project scope.
 */

import { toBangla } from '@/lib/calendars/bangla';
import { toHijri } from '@/lib/calendars/hijri';
import { CalendarTint, Gold } from '@/constants/theme';

export type OccasionType = 'national' | 'bangla' | 'islamic' | 'international';

export type Occasion = {
  title: string;
  bn?: string;
  type: OccasionType;
};

export const OCCASION_COLOR: Record<OccasionType, string> = {
  national: CalendarTint.english,
  bangla: CalendarTint.bangla,
  islamic: CalendarTint.hijri,
  international: '#8E8E93',
};

// Gregorian fixed (MM-DD) — Bangladesh national + a few international.
const GREGORIAN: Record<string, Occasion[]> = {
  '02-21': [{ title: 'International Mother Language Day', bn: 'আন্তর্জাতিক মাতৃভাষা দিবস', type: 'national' }],
  '03-17': [{ title: "Sheikh Mujib's Birthday / Children's Day", bn: 'জাতীয় শিশু দিবস', type: 'national' }],
  '03-26': [{ title: 'Independence Day', bn: 'স্বাধীনতা দিবস', type: 'national' }],
  '05-01': [{ title: 'May Day', bn: 'মে দিবস', type: 'international' }],
  '08-15': [{ title: 'National Mourning Day', bn: 'জাতীয় শোক দিবস', type: 'national' }],
  '12-16': [{ title: 'Victory Day', bn: 'বিজয় দিবস', type: 'national' }],
  '12-31': [{ title: "New Year's Eve", type: 'international' }],
  '01-01': [{ title: "New Year's Day", type: 'international' }],
};

// Bangla fixed (month-day, 1-based) — cultural festivals.
const BANGLA: Record<string, Occasion[]> = {
  '1-1': [{ title: 'Pohela Boishakh (Bengali New Year)', bn: 'পহেলা বৈশাখ', type: 'bangla' }],
  '8-1': [{ title: 'Nabanna (Harvest Festival)', bn: 'নবান্ন', type: 'bangla' }],
  '9-1': [{ title: 'Poush Parbon / Pithe', bn: 'পৌষ পার্বণ', type: 'bangla' }],
  '11-1': [{ title: 'Pohela Falgun (Spring Festival)', bn: 'পহেলা ফাল্গুন', type: 'bangla' }],
};

// Hijri fixed (month-day, 1-based) — Islamic occasions.
const HIJRI: Record<string, Occasion[]> = {
  '1-1': [{ title: 'Islamic New Year', bn: 'হিজরি নববর্ষ', type: 'islamic' }],
  '1-10': [{ title: 'Ashura', bn: 'আশুরা', type: 'islamic' }],
  '3-12': [{ title: 'Eid-e-Miladunnabi', bn: 'ঈদে মিলাদুন্নবী', type: 'islamic' }],
  '7-27': [{ title: "Shab-e-Mi'raj", bn: 'শবে মেরাজ', type: 'islamic' }],
  '8-15': [{ title: 'Shab-e-Barat', bn: 'শবে বরাত', type: 'islamic' }],
  '9-1': [{ title: 'First day of Ramadan', bn: 'রমজান শুরু', type: 'islamic' }],
  '9-27': [{ title: 'Shab-e-Qadr (Laylat al-Qadr)', bn: 'শবে কদর', type: 'islamic' }],
  '10-1': [{ title: 'Eid-ul-Fitr', bn: 'ঈদুল ফিতর', type: 'islamic' }],
  '12-10': [{ title: 'Eid-ul-Adha', bn: 'ঈদুল আযহা', type: 'islamic' }],
  '12-9': [{ title: 'Day of Arafah', bn: 'আরাফাহ দিবস', type: 'islamic' }],
};

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** All occasions falling on a given Gregorian date, across the three calendars. */
export function occasionsForDate(date: Date): Occasion[] {
  const out: Occasion[] = [];
  const g = `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  if (GREGORIAN[g]) out.push(...GREGORIAN[g]);
  const b = toBangla(date);
  if (BANGLA[`${b.month}-${b.day}`]) out.push(...BANGLA[`${b.month}-${b.day}`]);
  const h = toHijri(date);
  if (HIJRI[`${h.month}-${h.day}`]) out.push(...HIJRI[`${h.month}-${h.day}`]);
  return out;
}

/** Color for a single-dot marker on a calendar cell, or null when no occasion. */
export function markerColor(date: Date, opts?: { mode?: string; gold?: boolean }): string | null {
  const occ = occasionsForDate(date);
  if (occ.length === 0) return null;
  // Prefer the occasion most relevant to the active mode.
  const pref =
    opts?.mode === 'agricultural'
      ? occ.find((o) => o.type === 'bangla')
      : opts?.mode === 'islamic'
        ? occ.find((o) => o.type === 'islamic')
        : undefined;
  const chosen = pref ?? occ[0];
  if (chosen.type === 'islamic' && opts?.gold) return Gold.light;
  return OCCASION_COLOR[chosen.type];
}
