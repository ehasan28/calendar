/** Unified entry point for the three calendars. Pure & node-testable. */

import { GregDate, MONTHS_EN, WEEKDAYS_EN, isLeap } from './gregorian';
import { BanglaDate, formatBangla, seasonForDate, toBangla, BANGLA_WEEKDAYS_BN } from './bangla';
import { HijriDate, formatHijri, toHijri, HIJRI_WEEKDAYS_AR } from './hijri';
import { toNumerals, type NumeralStyle } from './numerals';

export * from './gregorian';
export * from './bangla';
export * from './hijri';
export * from './numerals';

export type TriDate = {
  date: Date;
  english: GregDate & { weekday: string; monthName: string };
  bangla: BanglaDate;
  hijri: HijriDate;
};

/** Describe a single day across all three calendars. */
export function describe(date: Date): TriDate {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return {
    date: d,
    english: {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      weekday: WEEKDAYS_EN[d.getDay()],
      monthName: MONTHS_EN[d.getMonth()],
    },
    bangla: toBangla(d),
    hijri: toHijri(d),
  };
}

/** Localized weekday label for the active calendar emphasis. */
export function weekdayNames(lang: 'en' | 'bn' | 'ar'): string[] {
  if (lang === 'bn') return BANGLA_WEEKDAYS_BN;
  if (lang === 'ar') return HIJRI_WEEKDAYS_AR;
  return WEEKDAYS_EN;
}

/** Pretty one-line strings per calendar, with numerals applied. */
export function formatTri(date: Date, numerals: NumeralStyle = 'western') {
  const t = describe(date);
  return {
    english: toNumerals(`${t.english.day} ${t.english.monthName} ${t.english.year}`, numerals),
    bangla: toNumerals(formatBangla(t.bangla, 'bn'), numerals === 'arabic' ? 'bangla' : numerals),
    hijri: toNumerals(formatHijri(t.hijri, 'ar'), numerals === 'bangla' ? 'arabic' : numerals),
    season: seasonForDate(date),
    isEnglishLeap: isLeap(t.english.year),
  };
}
