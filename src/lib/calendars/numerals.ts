/** Digit transliteration between Western, Bangla, and Arabic-Indic numerals. */

export type NumeralStyle = 'western' | 'bangla' | 'arabic';

const BANGLA = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ARABIC = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** Convert every ASCII digit in `input` to the requested numeral style. */
export function toNumerals(input: string | number, style: NumeralStyle): string {
  const s = String(input);
  if (style === 'western') return s;
  const map = style === 'bangla' ? BANGLA : ARABIC;
  return s.replace(/[0-9]/g, (d) => map[Number(d)]);
}
