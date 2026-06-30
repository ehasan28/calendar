/**
 * Universal Calendar — design tokens (Apple-minimal, near-monochrome).
 * Ported from the approved Onylogy design system: soft white cards, hairline
 * borders, whisper shadow (light only). One restrained accent that shifts per MODE.
 */

import '@/global.css';

import { Platform, type TextStyle } from 'react-native';

export const Colors = {
  light: {
    text: '#1C1C1E',
    background: '#FFFFFF',
    card: '#FFFFFF',
    cardBorder: '#ECECEF',
    backgroundElement: '#F2F2F7', // fill: inputs, chips, tracks
    backgroundSelected: '#E5E5EA',
    separator: '#E8E8EB',
    textSecondary: '#8E8E93',
    tertiary: '#C2C2C7',
    accent: '#2F6FED',
    accentSoft: 'rgba(47,111,237,0.12)',
    today: '#E5484D', // Apple Calendar "today" red
    danger: '#E5484D',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    card: '#1C1C1E',
    cardBorder: '#2C2C2E',
    backgroundElement: '#2C2C2E',
    backgroundSelected: '#3A3A3C',
    separator: '#2C2C2E',
    textSecondary: '#98989F',
    tertiary: '#48484A',
    accent: '#5B8DEF',
    accentSoft: 'rgba(91,141,239,0.22)',
    today: '#FF453A',
    danger: '#FF453A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Per-mode accent overrides — the one restrained color the UI leans on. */
export const ModeAccent = {
  default: { light: '#2F6FED', dark: '#5B8DEF' },
  agricultural: { light: '#2FA060', dark: '#3FBE74' },
  islamic: { light: '#1F8A70', dark: '#34B79A' },
} as const;

/** A warm secondary used sparingly in Islamic mode (gold). */
export const Gold = { light: '#B7892F', dark: '#D9B25A' } as const;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
    bangla: 'var(--font-bangla)',
    arabic: 'var(--font-arabic)',
  },
});

/** Script-specific font families (web uses the CSS vars above). */
export const ScriptFont = {
  bangla: Platform.select({ web: 'var(--font-bangla)', default: undefined }),
  arabic: Platform.select({ web: 'var(--font-arabic)', default: undefined }),
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 820;

/** Figures: crisp column alignment. */
export const Tabular: TextStyle = { fontVariant: ['tabular-nums'] };

/** iOS-like type scale. */
export const Type = {
  largeTitle: { fontSize: 32, fontWeight: '700' as const, letterSpacing: 0.2 },
  title: { fontSize: 24, fontWeight: '700' as const },
  headline: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  subhead: { fontSize: 15, fontWeight: '500' as const },
  footnote: { fontSize: 13, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
};

export const Radius = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  card: 18,
  field: 12,
  pill: 999,
} as const;

/** Whisper-soft card elevation (light mode only — dark uses a hairline border). */
export const CardShadow = (Platform.select({
  web: { boxShadow: '0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.05)' },
  default: {
    shadowColor: '#101828',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
}) ?? {}) as object;

/** Calendar-source tints (used for per-calendar dots/labels). */
export const CalendarTint = {
  english: '#2F6FED',
  bangla: '#2FA060',
  hijri: '#1F8A70',
} as const;
