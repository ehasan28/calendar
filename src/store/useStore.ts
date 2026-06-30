import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type Mode = 'default' | 'agricultural' | 'islamic';
export type ThemePref = 'light' | 'dark' | 'system';
/** Which calendar pairing each day cell shows in Default mode. */
export type CombinedView = 'english' | 'english-arabic' | 'bangla-english';
export type NumeralStyle = 'western' | 'bangla' | 'arabic';
export type ClockFace = 'digital' | 'analog' | 'flip' | 'nightstand';
export type ClockTheme = 'celestial' | 'gradient' | 'aurora' | 'starfield' | 'seasonal' | 'islamic' | 'mono';

export type CalendarKey = 'english' | 'bangla' | 'hijri';

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  note?: string;
  color?: string;
};

export type Settings = {
  mode: Mode;
  theme: ThemePref;
  combinedView: CombinedView;
  /** Per-calendar visibility toggles (apply across views). */
  show: Record<CalendarKey, boolean>;
  numerals: NumeralStyle;
  clockFace: ClockFace;
  clockTheme: ClockTheme;
  /** Saved prayer-times location; null => auto-detect with Dhaka fallback. */
  location: { lat: number; lng: number; label: string } | null;
};

const DEFAULT_SETTINGS: Settings = {
  mode: 'default',
  theme: 'system',
  combinedView: 'english-arabic',
  show: { english: true, bangla: true, hijri: true },
  numerals: 'western',
  clockFace: 'digital',
  clockTheme: 'celestial',
  location: null,
};

type StoreState = {
  hydrated: boolean;
  settings: Settings;
  events: CalendarEvent[];
  tabBarHeight: number;
  setTabBarHeight: (h: number) => void;
  setMode: (m: Mode) => void;
  patchSettings: (p: Partial<Settings>) => void;
  toggleCalendar: (k: CalendarKey) => void;
  addEvent: (e: CalendarEvent) => void;
  removeEvent: (id: string) => void;
};

const KEY = 'universal-calendar/state-v1';

function persist(get: () => StoreState) {
  const { settings, events } = get();
  AsyncStorage.setItem(KEY, JSON.stringify({ settings, events })).catch(() => {});
}

export const useStore = create<StoreState>((set, get) => ({
  hydrated: false,
  settings: DEFAULT_SETTINGS,
  events: [],
  tabBarHeight: 72,
  setTabBarHeight: (h) => set({ tabBarHeight: h }),
  setMode: (mode) => {
    set((s) => ({ settings: { ...s.settings, mode } }));
    persist(get);
  },
  patchSettings: (p) => {
    set((s) => ({ settings: { ...s.settings, ...p } }));
    persist(get);
  },
  toggleCalendar: (k) => {
    set((s) => ({ settings: { ...s.settings, show: { ...s.settings.show, [k]: !s.settings.show[k] } } }));
    persist(get);
  },
  addEvent: (e) => {
    set((s) => ({ events: [...s.events, e] }));
    persist(get);
  },
  removeEvent: (id) => {
    set((s) => ({ events: s.events.filter((e) => e.id !== id) }));
    persist(get);
  },
}));

/** Load persisted state once at app start. */
export async function hydrateStore() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { settings?: Partial<Settings>; events?: CalendarEvent[] };
      useStore.setState((s) => ({
        settings: { ...s.settings, ...(parsed.settings ?? {}), show: { ...s.settings.show, ...(parsed.settings?.show ?? {}) } },
        events: parsed.events ?? [],
        hydrated: true,
      }));
      return;
    }
  } catch {
    // ignore — fall through to defaults
  }
  useStore.setState({ hydrated: true });
}
