import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScriptFont, Tabular } from '@/constants/theme';
import { useNow } from '@/hooks/use-now';
import { describe, formatBangla, formatHijri } from '@/lib/calendars';
import { toNumerals } from '@/lib/calendars/numerals';
import { parseHHMM } from '@/lib/sun';
import { usePrayerTimes } from '@/lib/prayer';
import { useStore } from '@/store/useStore';
import { AnalogFace, DigitalSeconds, FlipFace } from '@/components/clock/faces';
import { ThemeBackground } from '@/themes';

/** Full clock surface: time-synced background + chosen face + the tri-date. */
export function ClockView({ fullscreen }: { fullscreen?: boolean }) {
  const now = useNow(1000);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const settings = useStore((s) => s.settings);
  const numerals = settings.numerals;
  const face = settings.clockFace;
  const nightstand = face === 'nightstand';

  // Sunrise/sunset drive the Celestial Arc; cached/offline-tolerant.
  const { times } = usePrayerTimes(now);
  const sunrise = parseHHMM(times?.Sunrise) ?? undefined;
  const sunset = parseHHMM(times?.Sunset ?? times?.Maghrib) ?? undefined;

  const t = describe(now);
  const n = numerals;
  const digitalSize = Math.min(72, Math.max(40, width * 0.16));

  return (
    <View style={styles.fill}>
      <ThemeBackground theme={nightstand ? 'celestial' : settings.clockTheme} now={now} sunrise={sunrise} sunset={sunset} />
      {nightstand ? <View style={styles.dim} /> : null}

      {/* Expand / collapse */}
      <Pressable
        onPress={() => (fullscreen ? router.back() : router.push('/clock-full'))}
        style={[styles.expand, { top: insets.top + 12 }]}
        accessibilityLabel={fullscreen ? 'Exit fullscreen' : 'Fullscreen clock'}>
        <Ionicons name={fullscreen ? 'contract-outline' : 'expand-outline'} size={22} color="rgba(255,255,255,0.9)" />
      </Pressable>

      <View style={styles.center}>
        {face === 'analog' ? (
          <AnalogFace now={now} size={Math.min(300, width * 0.7)} />
        ) : face === 'flip' ? (
          <FlipFace now={now} />
        ) : (
          <DigitalSeconds now={now} dim={nightstand} size={digitalSize} />
        )}

        {!nightstand && (
          <View style={styles.dates}>
            <Text style={[styles.dateMain, Tabular]}>
              {t.english.weekday}, {toNumerals(`${t.english.day} ${t.english.monthName} ${t.english.year}`, n)}
            </Text>
            {settings.show.bangla && (
              <Text style={[styles.dateSub, { fontFamily: ScriptFont.bangla as any }]}>
                {toNumerals(formatBangla(t.bangla, 'bn'), n === 'arabic' ? 'bangla' : n)}
              </Text>
            )}
            {settings.show.hijri && (
              <Text style={[styles.dateSub, { fontFamily: ScriptFont.arabic as any }]}>
                {toNumerals(formatHijri(t.hijri, 'ar'), n === 'bangla' ? 'arabic' : n)}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const shadow = {
  textShadowColor: 'rgba(0,0,0,0.4)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 8,
};

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#0B1026' },
  dim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)' },
  expand: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22, paddingHorizontal: 16 },
  dates: { alignItems: 'center', gap: 4 },
  dateMain: { color: '#fff', fontSize: 17, fontWeight: '600', ...shadow },
  dateSub: { color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '500', ...shadow },
});
