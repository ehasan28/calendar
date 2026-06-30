import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CALENDAR_NAME, resolveCalendars } from '@/lib/cellLabels';
import { CalendarTint } from '@/constants/theme';
import { useStore } from '@/store/useStore';

/** Key mapping cell colors → calendars: "Big: <lead> · ● Bangla · ● Arabic" (enabled only). */
export function CalendarLegend() {
  const theme = useTheme();
  const settings = useStore((s) => s.settings);
  const { lead, secondaries } = resolveCalendars(settings);

  return (
    <View style={styles.row}>
      <Text style={[styles.lead, { color: theme.textSecondary }]}>
        Big: <Text style={{ color: theme.text, fontWeight: '700' }}>{CALENDAR_NAME[lead]}</Text>
      </Text>
      {secondaries.map((k) => (
        <View key={k} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: CalendarTint[k] }]} />
          <Text style={[styles.name, { color: theme.textSecondary }]}>{CALENDAR_NAME[k]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.three, marginBottom: Spacing.two },
  lead: { fontSize: 12, fontWeight: '500' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  name: { fontSize: 12, fontWeight: '600' },
});
