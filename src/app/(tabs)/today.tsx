import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DayPager } from '@/components/day-pager';
import { ModeBadge } from '@/components/mode-badge';
import { AgriculturePanel } from '@/components/modes/agriculture-panel';
import { IslamicPanel } from '@/components/modes/islamic-panel';
import { Screen } from '@/components/screen';
import { Card, ScreenTitle, SectionLabel } from '@/components/ui';
import { CalendarTint, Radius, ScriptFont, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { describe, formatBangla, formatHijri } from '@/lib/calendars';
import { BANGLA_WEEKDAYS_BN, seasonForDate } from '@/lib/calendars/bangla';
import { HIJRI_WEEKDAYS_AR } from '@/lib/calendars/hijri';
import { addDays, isSameDay, startOfDay } from '@/lib/calendars/gregorian';
import { toNumerals } from '@/lib/calendars/numerals';
import { tap } from '@/lib/haptics';
import { useStore } from '@/store/useStore';

function HeroLine({ color, value, weekday, font }: { color: string; value: string; weekday: string; font?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.line}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.value, { color: theme.text, fontFamily: font as any }]}>{value}</Text>
        <Text style={[styles.weekday, { color: theme.textSecondary, fontFamily: font as any }]}>{weekday}</Text>
      </View>
    </View>
  );
}

/** Full per-day content: hero card with all three calendars + the mode panel. */
function DayCard({ date }: { date: Date }) {
  const theme = useTheme();
  const settings = useStore((s) => s.settings);
  const t = describe(date);
  const season = seasonForDate(date);
  const n = settings.numerals;

  return (
    <View>
      <Card style={{ gap: Spacing.three }}>
        <View>
          <SectionLabel>{t.english.weekday.toUpperCase()}</SectionLabel>
          <Text style={[styles.big, { color: theme.text }]}>
            {toNumerals(t.english.day, n)} {t.english.monthName}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
            {season.en} season · <Text style={{ fontFamily: ScriptFont.bangla as any }}>{season.bn} ঋতু</Text>
          </Text>
        </View>

        <View style={{ gap: Spacing.three }}>
          {settings.show.english && (
            <HeroLine color={CalendarTint.english} value={toNumerals(`${t.english.day} ${t.english.monthName} ${t.english.year}`, n)} weekday={t.english.weekday} />
          )}
          {settings.show.bangla && (
            <HeroLine
              color={CalendarTint.bangla}
              value={toNumerals(formatBangla(t.bangla, 'bn'), n === 'arabic' ? 'bangla' : n)}
              weekday={BANGLA_WEEKDAYS_BN[date.getDay()]}
              font={ScriptFont.bangla}
            />
          )}
          {settings.show.hijri && (
            <HeroLine
              color={CalendarTint.hijri}
              value={toNumerals(formatHijri(t.hijri, 'ar'), n === 'bangla' ? 'arabic' : n)}
              weekday={HIJRI_WEEKDAYS_AR[date.getDay()]}
              font={ScriptFont.arabic}
            />
          )}
        </View>
      </Card>

      <View style={{ height: Spacing.three }} />
      {settings.mode === 'agricultural' && <AgriculturePanel date={date} />}
      {settings.mode === 'islamic' && <IslamicPanel date={date} />}
    </View>
  );
}

export default function TodayScreen() {
  const theme = useTheme();
  const [focused, setFocused] = useState(() => startOfDay(new Date()));
  const isToday = isSameDay(focused, new Date());

  return (
    <Screen>
      <View style={{ marginBottom: Spacing.two }}>
        <ModeBadge />
      </View>

      <View style={styles.titleRow}>
        <ScreenTitle style={{ marginBottom: 0 }}>{isToday ? 'Today' : 'Day'}</ScreenTitle>
        {!isToday && (
          <Pressable
            onPress={() => {
              tap();
              setFocused(startOfDay(new Date()));
            }}
            style={[styles.todayChip, { backgroundColor: theme.accent }]}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Today</Text>
          </Pressable>
        )}
      </View>
      <Text style={[styles.hint, { color: theme.textSecondary }]}>Swipe left for the next day, right for the previous.</Text>

      <DayPager onChange={(delta) => setFocused((prev) => addDays(prev, delta))}>
        <DayCard date={focused} />
      </DayPager>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  todayChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.pill },
  hint: { fontSize: 12, fontWeight: '500', marginTop: 4, marginBottom: Spacing.three },
  big: { fontSize: 40, fontWeight: '700', letterSpacing: 0.3, marginVertical: 2 },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  value: { fontSize: 19, fontWeight: '600' },
  weekday: { fontSize: 13, fontWeight: '500', marginTop: 1 },
});
