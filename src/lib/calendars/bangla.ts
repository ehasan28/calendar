/**
 * Bangla (Bengali) calendar — **Bangladesh revised** system only.
 * Per the Bangladesh Bangla Academy reform (2019 amendment): Pohela Boishakh is
 * fixed to 14 April; the first five months are 31 days, the rest 30, and Falgun
 * gains a day in years aligned with the Gregorian leap. Pure & node-testable.
 */

export type BanglaDate = {
  year: number; // Bongabda
  month: number; // 1-12
  day: number;
};

export const BANGLA_MONTHS_EN = [
  'Boishakh', 'Joishtho', 'Asharh', 'Srabon', 'Bhadro', 'Ashwin',
  'Kartik', 'Ogrohayon', 'Poush', 'Magh', 'Falgun', 'Choitro',
];

export const BANGLA_MONTHS_BN = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
  'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র',
];

export const BANGLA_WEEKDAYS_BN = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার',
];
export const BANGLA_WEEKDAYS_BN_SHORT = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

/** Six seasons (ঋতু), two Bengali months each. */
export type Season = {
  key: string;
  en: string;
  bn: string;
  months: [number, number]; // 1-based Bengali month numbers
};

export const SEASONS: Season[] = [
  { key: 'grishmo', en: 'Summer', bn: 'গ্রীষ্ম', months: [1, 2] },
  { key: 'borsha', en: 'Monsoon', bn: 'বর্ষা', months: [3, 4] },
  { key: 'sharat', en: 'Autumn', bn: 'শরৎ', months: [5, 6] },
  { key: 'hemanto', en: 'Late Autumn', bn: 'হেমন্ত', months: [7, 8] },
  { key: 'sheet', en: 'Winter', bn: 'শীত', months: [9, 10] },
  { key: 'boshonto', en: 'Spring', bn: 'বসন্ত', months: [11, 12] },
];

function isGregLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/**
 * Month lengths for the Bengali year that *starts* in Gregorian year `gStart`
 * (Bangladesh revised, 2019 amendment): first six months 31 days, Kartik–Magh
 * (7–10) 30 days, Falgun (11) 29 days — 30 in a leap year — and Choitro (12) 30.
 * This keeps the fixed national anchors exact: 16 Dec = 1 Poush, 21 Feb = 8
 * Falgun, 26 Mar = 12 Choitro. Falgun gains its day when the February inside this
 * Bengali year (Gregorian gStart+1) is a leap February.
 */
function monthLengths(gStart: number): number[] {
  const falgunLeap = isGregLeap(gStart + 1);
  return [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, falgunLeap ? 30 : 29, 30];
}

/** Gregorian Date → Bangla date (Bangladesh revised). */
export function toBangla(date: Date): BanglaDate {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const y = d.getFullYear();
  // Pohela Boishakh = 14 April. Find the April-14 on or before `d`.
  const apr14 = new Date(y, 3, 14);
  const gStart = d.getTime() >= apr14.getTime() ? y : y - 1;
  const start = new Date(gStart, 3, 14);
  let dayOfYear = Math.round((d.getTime() - start.getTime()) / 86_400_000); // 0-based
  const lengths = monthLengths(gStart);
  let month = 1;
  for (let i = 0; i < 12; i++) {
    if (dayOfYear < lengths[i]) {
      month = i + 1;
      break;
    }
    dayOfYear -= lengths[i];
  }
  return { year: gStart - 593, month, day: dayOfYear + 1 };
}

export function banglaMonthName(month: number, lang: 'en' | 'bn' = 'bn'): string {
  const arr = lang === 'en' ? BANGLA_MONTHS_EN : BANGLA_MONTHS_BN;
  return arr[(month - 1 + 12) % 12];
}

export function seasonForMonth(month: number): Season {
  return SEASONS.find((s) => s.months.includes(month)) ?? SEASONS[0];
}

export function seasonForDate(date: Date): Season {
  return seasonForMonth(toBangla(date).month);
}

export function formatBangla(b: BanglaDate, lang: 'en' | 'bn' = 'bn'): string {
  return `${b.day} ${banglaMonthName(b.month, lang)} ${b.year}`;
}
