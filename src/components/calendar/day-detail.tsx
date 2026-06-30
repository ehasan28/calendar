import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CalendarTint, Radius, ScriptFont, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { describe, formatBangla, formatHijri } from '@/lib/calendars';
import { seasonForDate } from '@/lib/calendars/bangla';
import { toNumerals } from '@/lib/calendars/numerals';
import { occasionsForDate, OCCASION_COLOR } from '@/lib/occasions';
import { Card } from '@/components/ui';
import { useStore } from '@/store/useStore';

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** One calendar's line with a colored dot + label. */
function Line({ color, label, value, font }: { color: string; label: string; value: string; font?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.line}>
      <View style={[styles.lineDot, { backgroundColor: color }]} />
      <Text style={[styles.lineLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.lineValue, { color: theme.text, fontFamily: font as any }]}>{value}</Text>
    </View>
  );
}

/** Detail card for the selected day: all three calendars, season, occasions, events. */
export function DayDetail({ date }: { date: Date }) {
  const theme = useTheme();
  const router = useRouter();
  const settings = useStore((s) => s.settings);
  const allEvents = useStore((s) => s.events);
  const iso = toISO(date);
  const events = useMemo(() => allEvents.filter((e) => e.date === iso), [allEvents, iso]);
  const t = describe(date);
  const season = seasonForDate(date);
  const occ = occasionsForDate(date);
  const n = settings.numerals;

  return (
    <Card style={{ gap: Spacing.two }}>
      <Text style={[styles.weekday, { color: theme.accent }]}>{t.english.weekday}</Text>

      {settings.show.english && (
        <Line color={CalendarTint.english} label="English" value={toNumerals(`${t.english.day} ${t.english.monthName} ${t.english.year}`, n)} />
      )}
      {settings.show.bangla && (
        <Line color={CalendarTint.bangla} label="Bangla" value={toNumerals(formatBangla(t.bangla, 'bn'), n === 'arabic' ? 'bangla' : n)} font={ScriptFont.bangla} />
      )}
      {settings.show.hijri && (
        <Line color={CalendarTint.hijri} label="Hijri" value={toNumerals(formatHijri(t.hijri, 'ar'), n === 'bangla' ? 'arabic' : n)} font={ScriptFont.arabic} />
      )}

      <View style={[styles.seasonRow, { borderTopColor: theme.separator }]}>
        <Ionicons name="leaf-outline" size={15} color={theme.textSecondary} />
        <Text style={[styles.seasonText, { color: theme.textSecondary }]}>
          {season.en} · <Text style={{ fontFamily: ScriptFont.bangla as any }}>{season.bn}</Text>
        </Text>
      </View>

      {occ.map((o, i) => (
        <View key={i} style={styles.occ}>
          <View style={[styles.lineDot, { backgroundColor: OCCASION_COLOR[o.type] }]} />
          <Text style={[styles.occText, { color: theme.text }]}>
            {o.title}
            {o.bn ? <Text style={{ color: theme.textSecondary, fontFamily: ScriptFont.bangla as any }}>{`  ${o.bn}`}</Text> : null}
          </Text>
        </View>
      ))}

      {events.map((e) => (
        <Pressable key={e.id} style={styles.occ} onPress={() => router.push(`/event?id=${e.id}`)}>
          <Ionicons name="ellipse" size={9} color={e.color ?? theme.accent} />
          <Text style={[styles.occText, { color: theme.text }]}>{e.title}</Text>
        </Pressable>
      ))}

      <Pressable
        onPress={() => router.push(`/event?date=${toISO(date)}`)}
        style={[styles.addBtn, { borderColor: theme.separator }]}>
        <Ionicons name="add" size={18} color={theme.accent} />
        <Text style={{ color: theme.accent, fontWeight: '600' }}>Add event</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  weekday: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3, textTransform: 'uppercase' },
  line: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  lineDot: { width: 8, height: 8, borderRadius: 4 },
  lineLabel: { fontSize: 13, fontWeight: '500', width: 56 },
  lineValue: { fontSize: 16, fontWeight: '600', flex: 1 },
  seasonRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: Spacing.two, borderTopWidth: StyleSheet.hairlineWidth },
  seasonText: { fontSize: 13, fontWeight: '500' },
  occ: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  occText: { fontSize: 14, fontWeight: '500', flex: 1 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: Radius.field,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.one,
  },
});
