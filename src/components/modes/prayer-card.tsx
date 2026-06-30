import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Gold, Spacing, Tabular } from '@/constants/theme';
import { useColorMode, useTheme } from '@/hooks/use-theme';
import { Card, SectionLabel } from '@/components/ui';
import { usePrayerTimes } from '@/lib/prayer';

const PRAYERS: { key: keyof import('@/lib/prayer').PrayerTimes; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'Fajr', label: 'Fajr', icon: 'partly-sunny-outline' },
  { key: 'Sunrise', label: 'Sunrise', icon: 'sunny-outline' },
  { key: 'Dhuhr', label: 'Dhuhr', icon: 'sunny' },
  { key: 'Asr', label: 'Asr', icon: 'partly-sunny' },
  { key: 'Maghrib', label: 'Maghrib', icon: 'moon-outline' },
  { key: 'Isha', label: 'Isha', icon: 'moon' },
];

export function PrayerCard({ date, ramadan }: { date: Date; ramadan?: boolean }) {
  const theme = useTheme();
  const cm = useColorMode();
  const { times, location, status } = usePrayerTimes(date);

  return (
    <Card style={{ gap: Spacing.two }}>
      <View style={styles.head}>
        <SectionLabel>PRAYER TIMES</SectionLabel>
        {location ? (
          <View style={styles.loc}>
            <Ionicons name="location-outline" size={13} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{location.label}</Text>
          </View>
        ) : null}
      </View>

      {status === 'loading' && <Text style={{ color: theme.textSecondary }}>Loading…</Text>}
      {status === 'error' && !times && (
        <Text style={{ color: theme.textSecondary }}>Unavailable offline — connect once to cache today’s times.</Text>
      )}

      {times && (
        <View style={styles.grid}>
          {PRAYERS.map((p) => (
            <View key={p.key} style={[styles.cell, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name={p.icon} size={15} color={theme.accent} />
              <Text style={[styles.pLabel, { color: theme.textSecondary }]}>{p.label}</Text>
              <Text style={[styles.pTime, { color: theme.text }, Tabular]}>{times[p.key]}</Text>
            </View>
          ))}
        </View>
      )}

      {times && ramadan && (
        <View style={[styles.ramadan, { backgroundColor: Gold[cm] + '22' }]}>
          <Text style={[styles.rLabel, { color: Gold[cm] }]}>
            Sehri ends <Text style={Tabular}>{times.Fajr}</Text>
          </Text>
          <Text style={[styles.rLabel, { color: Gold[cm] }]}>
            Iftar <Text style={Tabular}>{times.Maghrib}</Text>
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  cell: { width: `${(100 - 6) / 3}%`, borderRadius: 12, padding: 10, gap: 2, alignItems: 'flex-start' },
  pLabel: { fontSize: 12, fontWeight: '500' },
  pTime: { fontSize: 16, fontWeight: '700' },
  ramadan: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, marginTop: 2 },
  rLabel: { fontSize: 14, fontWeight: '600' },
});
