import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { WEEKDAYS_EN_SHORT, isSameDay, monthGrid } from '@/lib/calendars/gregorian';
import { cellLabels } from '@/lib/cellLabels';
import { markerColor } from '@/lib/occasions';
import { tap } from '@/lib/haptics';
import { useStore } from '@/store/useStore';

type Props = {
  year: number;
  month: number; // 1-12
  selected: Date;
  onSelect: (d: Date) => void;
};

function Cell({
  date,
  inMonth,
  isToday,
  isSelected,
  onPress,
}: {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const settings = useStore((s) => s.settings);
  const { leading, secondaries } = cellLabels(date, settings);
  const dot = markerColor(date, { mode: settings.mode, gold: settings.mode === 'islamic' });

  const leadColor = isToday ? '#fff' : inMonth ? theme.text : theme.tertiary;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.cell, isSelected && !isToday && { backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.dayNum, isToday && { backgroundColor: theme.today }]}>
        <Text style={[styles.primary, { color: leadColor, fontFamily: leading.font as any }]}>{leading.value}</Text>
      </View>
      <View style={styles.secRow}>
        {secondaries.map((s) => (
          <Text
            key={s.key}
            style={[styles.secondary, { color: inMonth ? s.color : theme.tertiary, fontFamily: s.font as any }]}
            numberOfLines={1}>
            {s.value}
          </Text>
        ))}
      </View>
      <View style={[styles.dot, dot ? { backgroundColor: dot } : { backgroundColor: 'transparent' }]} />
    </Pressable>
  );
}

const MemoCell = memo(Cell);

export function MonthGrid({ year, month, selected, onSelect }: Props) {
  const theme = useTheme();
  const today = new Date();
  const cells = monthGrid(year, month);

  return (
    <View>
      <View style={styles.weekHeader}>
        {WEEKDAYS_EN_SHORT.map((w, i) => (
          <Text key={w} style={[styles.weekDay, { color: i === 0 || i === 6 ? theme.textSecondary : theme.textSecondary }]}>
            {w}
          </Text>
        ))}
      </View>
      <View style={[styles.grid, { borderColor: theme.separator }]}>
        {cells.map((d) => (
          <MemoCell
            key={d.toISOString()}
            date={d}
            inMonth={d.getMonth() === month - 1}
            isToday={isSameDay(d, today)}
            isSelected={isSameDay(d, selected)}
            onPress={() => {
              tap();
              onSelect(d);
            }}
          />
        ))}
      </View>
    </View>
  );
}

/** Month header with title + prev/next + Today. */
export function MonthHeader({
  title,
  subtitle,
  onPrev,
  onNext,
  onToday,
}: {
  title: string;
  subtitle?: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.headerSub, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      <Pressable onPress={onToday} style={[styles.todayBtn, { backgroundColor: theme.backgroundElement }]}>
        <Text style={{ color: theme.accent, fontWeight: '600', fontSize: 13 }}>Today</Text>
      </Pressable>
      <Pressable onPress={onPrev} style={styles.navBtn} accessibilityLabel="Previous month">
        <Ionicons name="chevron-back" size={22} color={theme.accent} />
      </Pressable>
      <Pressable onPress={onNext} style={styles.navBtn} accessibilityLabel="Next month">
        <Ionicons name="chevron-forward" size={22} color={theme.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginBottom: Spacing.three },
  headerTitle: { fontSize: 26, fontWeight: '700', letterSpacing: 0.2 },
  headerSub: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  todayBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.pill, marginRight: Spacing.one },
  navBtn: { padding: 6 },
  weekHeader: { flexDirection: 'row', marginBottom: Spacing.one },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 0.82,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
    borderRadius: Radius.sm,
  },
  dayNum: { minWidth: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  primary: { fontSize: 16, fontWeight: '600' },
  secRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1, height: 14 },
  secondary: { fontSize: 11, fontWeight: '700' },
  dot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 2 },
});
