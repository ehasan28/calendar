import { CalendarTint, ScriptFont } from '@/constants/theme';
import { toBangla } from '@/lib/calendars/bangla';
import { toHijri } from '@/lib/calendars/hijri';
import { toNumerals } from '@/lib/calendars/numerals';
import type { CalendarKey, Mode, Settings } from '@/store/useStore';

export type CalNum = { key: CalendarKey; value: string; color: string; font?: string };
export type CellLabel = { leading: CalNum; secondaries: CalNum[] };

/** Fixed display order; the mode's lead calendar is pulled to the front. */
const ORDER: CalendarKey[] = ['english', 'bangla', 'hijri'];

export const LEAD_BY_MODE: Record<Mode, CalendarKey> = {
  default: 'english',
  agricultural: 'bangla',
  islamic: 'hijri',
};

export const CALENDAR_NAME: Record<CalendarKey, string> = {
  english: 'English',
  bangla: 'Bangla',
  hijri: 'Arabic',
};

/**
 * One calendar's day number, in its NATIVE script/numerals so the three are
 * distinguishable by shape as well as color (English 0-9, Bangla ০-৯, Hijri ٠-٩).
 */
function calNum(date: Date, key: CalendarKey): CalNum {
  if (key === 'bangla') {
    return { key, value: toNumerals(toBangla(date).day, 'bangla'), color: CalendarTint.bangla, font: ScriptFont.bangla };
  }
  if (key === 'hijri') {
    return { key, value: toNumerals(toHijri(date).day, 'arabic'), color: CalendarTint.hijri, font: ScriptFont.arabic };
  }
  return { key, value: String(date.getDate()), color: CalendarTint.english };
}

/** Resolve which calendars a cell shows: the mode's lead first, then the other enabled ones. */
export function resolveCalendars(s: Settings): { lead: CalendarKey; secondaries: CalendarKey[] } {
  const enabled = ORDER.filter((k) => s.show[k]);
  const pool = enabled.length ? enabled : (['english'] as CalendarKey[]);
  const lead = pool.includes(LEAD_BY_MODE[s.mode]) ? LEAD_BY_MODE[s.mode] : pool[0];
  return { lead, secondaries: pool.filter((k) => k !== lead) };
}

/** Leading + color-coded secondary day numbers for a cell, driven by mode + visibility. */
export function cellLabels(date: Date, s: Settings): CellLabel {
  const { lead, secondaries } = resolveCalendars(s);
  return { leading: calNum(date, lead), secondaries: secondaries.map((k) => calNum(date, k)) };
}
