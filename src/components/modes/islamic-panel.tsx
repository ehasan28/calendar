import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Gold, ModeAccent, ScriptFont, Spacing } from '@/constants/theme';
import { useColorMode, useTheme } from '@/hooks/use-theme';
import { formatHijri, toHijri, isRamadan, hijriMonthName } from '@/lib/calendars/hijri';
import { addDays } from '@/lib/calendars/gregorian';
import { occasionsForDate, type Occasion } from '@/lib/occasions';
import { Card, SectionLabel } from '@/components/ui';
import { PrayerCard } from '@/components/modes/prayer-card';

/** Next few Islamic occasions on/after `date`. */
function upcomingIslamic(date: Date, count = 4): { date: Date; occ: Occasion }[] {
  const out: { date: Date; occ: Occasion }[] = [];
  for (let i = 0; i < 400 && out.length < count; i++) {
    const d = addDays(date, i);
    for (const o of occasionsForDate(d)) {
      if (o.type === 'islamic') out.push({ date: d, occ: o });
    }
  }
  return out.slice(0, count);
}

/** Islamic mode: Hijri summary, prayer times, Ramadan status, upcoming occasions. */
export function IslamicPanel({ date }: { date: Date }) {
  const theme = useTheme();
  const cm = useColorMode();
  const accent = ModeAccent.islamic[cm];
  const gold = Gold[cm];
  const h = toHijri(date);
  const ramadan = isRamadan(date);

  return (
    <View style={{ gap: Spacing.three }}>
      <Card style={{ gap: 4 }}>
        <View style={styles.head}>
          <View>
            <SectionLabel>HIJRI · هجري</SectionLabel>
            <Text style={[styles.hijri, { color: theme.text, fontFamily: ScriptFont.arabic as any }]}>
              {formatHijri(h, 'ar')}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {h.day} {hijriMonthName(h.month, 'en')} {h.year} AH
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: accent + '22' }]}>
            <Ionicons name="moon" size={22} color={accent} />
          </View>
        </View>
        {ramadan && (
          <View style={[styles.ramadan, { backgroundColor: gold + '22' }]}>
            <Ionicons name="star" size={14} color={gold} />
            <Text style={{ color: gold, fontWeight: '600', fontSize: 13 }}>Ramadan Mubarak — fasting month</Text>
          </View>
        )}
      </Card>

      <PrayerCard date={date} ramadan={ramadan} />

      <Card style={{ gap: Spacing.two }}>
        <SectionLabel>UPCOMING OCCASIONS</SectionLabel>
        {upcomingIslamic(date).map(({ date: d, occ }, i) => (
          <View key={i} style={styles.occ}>
            <View style={[styles.occDot, { backgroundColor: accent }]} />
            <Text style={[styles.occTitle, { color: theme.text }]} numberOfLines={1}>
              {occ.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
            </Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  hijri: { fontSize: 22, fontWeight: '700', marginTop: 2 },
  badge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  ramadan: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, marginTop: 6 },
  occ: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  occDot: { width: 7, height: 7, borderRadius: 3.5 },
  occTitle: { fontSize: 14, fontWeight: '500', flex: 1 },
});
