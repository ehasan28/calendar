import { ScriptFont } from '@/constants/theme';
import { toBangla } from '@/lib/calendars/bangla';
import { toHijri } from '@/lib/calendars/hijri';
import { toNumerals } from '@/lib/calendars/numerals';
import type { Settings } from '@/store/useStore';

export type CellLabel = {
  primary: string;
  primaryFont?: string;
  secondary?: string;
  secondaryFont?: string;
};

/**
 * Decide what a day cell shows, given the active mode + combined-view toggle +
 * per-calendar visibility. Default mode keeps English primary; Agricultural
 * leads with Bangla; Islamic leads with Hijri.
 */
export function cellLabels(date: Date, s: Settings): CellLabel {
  const n = s.numerals;
  const eng = toNumerals(date.getDate(), n);
  const ban = toNumerals(toBangla(date).day, n);
  const hij = toNumerals(toHijri(date).day, n);

  if (s.mode === 'agricultural') {
    return { primary: ban, primaryFont: ScriptFont.bangla, secondary: s.show.english ? eng : undefined };
  }
  if (s.mode === 'islamic') {
    return { primary: hij, primaryFont: ScriptFont.arabic, secondary: s.show.english ? eng : undefined };
  }
  // default
  let secondary: string | undefined;
  let secondaryFont: string | undefined;
  if (s.combinedView === 'english-arabic' && s.show.hijri) {
    secondary = hij;
    secondaryFont = ScriptFont.arabic;
  } else if (s.combinedView === 'bangla-english' && s.show.bangla) {
    secondary = ban;
    secondaryFont = ScriptFont.bangla;
  }
  return { primary: eng, secondary, secondaryFont };
}
