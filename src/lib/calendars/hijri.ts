/**
 * Hijri (Islamic) calendar — Umm al-Qura via the platform's built-in
 * `Intl.DateTimeFormat`. Pure & offline; no React Native imports.
 *
 * Optional online refinement (Aladhan) lives in `src/lib/hijriSync.ts`, which
 * can override the day for a given Gregorian date via the `override` map below.
 */

export type HijriDate = { year: number; month: number; day: number }; // month 1-12

export const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
];

export const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

export const HIJRI_WEEKDAYS_AR = [
  'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت',
];

// Override map keyed by yyyy-mm-dd (Gregorian) -> HijriDate. Populated by hijriSync.
const override = new Map<string, HijriDate>();

function key(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function setHijriOverride(gregISO: string, h: HijriDate) {
  override.set(gregISO, h);
}

let fmt: Intl.DateTimeFormat | null = null;
function formatter(): Intl.DateTimeFormat {
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  }
  return fmt;
}

/** Convert a Gregorian Date to a Hijri date (Umm al-Qura), honoring any sync override. */
export function toHijri(date: Date): HijriDate {
  const o = override.get(key(date));
  if (o) return o;
  const parts = formatter().formatToParts(date);
  let year = 0;
  let month = 0;
  let day = 0;
  for (const p of parts) {
    if (p.type === 'year') year = parseInt(p.value, 10);
    else if (p.type === 'month') month = parseInt(p.value, 10);
    else if (p.type === 'day') day = parseInt(p.value, 10);
  }
  return { year, month, day };
}

export function hijriMonthName(month: number, lang: 'en' | 'ar' = 'en'): string {
  const arr = lang === 'ar' ? HIJRI_MONTHS_AR : HIJRI_MONTHS_EN;
  return arr[(month - 1 + 12) % 12];
}

export function formatHijri(h: HijriDate, lang: 'en' | 'ar' = 'en'): string {
  return `${h.day} ${hijriMonthName(h.month, lang)} ${h.year}`;
}

/** True when the date falls in Ramadan (Hijri month 9). */
export function isRamadan(date: Date): boolean {
  return toHijri(date).month === 9;
}
