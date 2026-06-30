import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, ScreenTitle, SectionLabel } from '@/components/ui';
import { CalendarTint, Radius, ScriptFont, Spacing, Tabular } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { describe, formatBangla, formatHijri } from '@/lib/calendars';
import { MONTHS_EN, addDays, addMonths, startOfDay } from '@/lib/calendars/gregorian';
import { toNumerals } from '@/lib/calendars/numerals';
import { DHAKA } from '@/lib/prayer';
import { compassLabel, qiblaBearing } from '@/lib/qibla';
import { useStore } from '@/store/useStore';

function ConvLine({ color, label, value, font }: { color: string; label: string; value: string; font?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.line}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text, fontFamily: font as any }]}>{value}</Text>
    </View>
  );
}

function Stepper({ icon, onPress, label }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; label: string }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} style={[styles.step, { backgroundColor: theme.backgroundElement }]}>
      <Ionicons name={icon} size={20} color={theme.accent} />
    </Pressable>
  );
}

export default function ToolsScreen() {
  const theme = useTheme();
  const n = useStore((s) => s.settings.numerals);
  const loc = useStore((s) => s.settings.location) ?? DHAKA;
  const [date, setDate] = useState(() => startOfDay(new Date()));
  const t = describe(date);
  const qibla = useMemo(() => qiblaBearing(loc.lat, loc.lng), [loc.lat, loc.lng]);

  return (
    <Screen>
      <ScreenTitle>Tools</ScreenTitle>

      <SectionLabel>DATE CONVERTER</SectionLabel>
      <Card style={{ gap: Spacing.three, marginBottom: Spacing.four }}>
        <Text style={[styles.convTitle, { color: theme.text }]}>
          {MONTHS_EN[date.getMonth()]} {toNumerals(date.getDate(), n)}, {toNumerals(date.getFullYear(), n)}
        </Text>
        <View style={styles.stepRow}>
          <Stepper icon="chevron-back" label="Previous month" onPress={() => setDate(startOfDay(addMonths(date, -1)))} />
          <Stepper icon="remove" label="Previous day" onPress={() => setDate(addDays(date, -1))} />
          <Pressable onPress={() => setDate(startOfDay(new Date()))} style={[styles.todayPill, { backgroundColor: theme.accent }]}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Today</Text>
          </Pressable>
          <Stepper icon="add" label="Next day" onPress={() => setDate(addDays(date, 1))} />
          <Stepper icon="chevron-forward" label="Next month" onPress={() => setDate(startOfDay(addMonths(date, 1)))} />
        </View>
        <View style={{ gap: Spacing.two }}>
          <ConvLine color={CalendarTint.english} label="English" value={`${t.english.weekday}, ${toNumerals(`${t.english.day} ${t.english.monthName} ${t.english.year}`, n)}`} />
          <ConvLine color={CalendarTint.bangla} label="Bangla" value={toNumerals(formatBangla(t.bangla, 'bn'), n === 'arabic' ? 'bangla' : n)} font={ScriptFont.bangla} />
          <ConvLine color={CalendarTint.hijri} label="Hijri" value={toNumerals(formatHijri(t.hijri, 'ar'), n === 'bangla' ? 'arabic' : n)} font={ScriptFont.arabic} />
        </View>
      </Card>

      <SectionLabel>QIBLA DIRECTION</SectionLabel>
      <Card style={{ alignItems: 'center', gap: Spacing.two }}>
        <View style={[styles.compass, { borderColor: theme.separator }]}>
          <View style={[styles.needle, { transform: [{ rotate: `${qibla}deg` }] }]}>
            <Ionicons name="navigate" size={40} color={theme.accent} />
          </View>
        </View>
        <Text style={[styles.qiblaDeg, { color: theme.text }, Tabular]}>
          {toNumerals(Math.round(qibla), n)}° {compassLabel(qibla)}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 13 }}>From {loc.label} toward the Kaaba</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  convTitle: { fontSize: 20, fontWeight: '700' },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  step: { width: 44, height: 40, borderRadius: Radius.field, alignItems: 'center', justifyContent: 'center' },
  todayPill: { flex: 1, height: 40, borderRadius: Radius.field, alignItems: 'center', justifyContent: 'center' },
  line: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 13, fontWeight: '500', width: 56 },
  value: { fontSize: 15, fontWeight: '600', flex: 1 },
  compass: { width: 160, height: 160, borderRadius: 80, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.two },
  needle: { alignItems: 'center', justifyContent: 'center' },
  qiblaDeg: { fontSize: 22, fontWeight: '700', marginTop: Spacing.two },
});
