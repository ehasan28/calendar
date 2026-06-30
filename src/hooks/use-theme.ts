import { Colors, Gold, ModeAccent } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/store/useStore';

/** Resolved color mode honoring the user's Settings preference (light / dark / system). */
export function useColorMode(): 'light' | 'dark' {
  const device = useColorScheme();
  const pref = useStore((s) => s.settings.theme) ?? 'system';
  if (pref === 'system') return device === 'dark' ? 'dark' : 'light';
  return pref;
}

/** Theme palette with the active MODE's accent merged in. */
export function useTheme() {
  const mode = useColorMode();
  const appMode = useStore((s) => s.settings.mode);
  const base = Colors[mode];
  const accent = ModeAccent[appMode][mode];
  return {
    ...base,
    accent,
    accentSoft: accent + (mode === 'light' ? '1F' : '33'),
    gold: Gold[mode],
  };
}
