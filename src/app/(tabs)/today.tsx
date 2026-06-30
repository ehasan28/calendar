import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ModeSwitcher } from '@/components/mode-switcher';
import { AgriculturePanel } from '@/components/modes/agriculture-panel';
import { IslamicPanel } from '@/components/modes/islamic-panel';
import { Screen } from '@/components/screen';
import { Card, ScreenTitle, SectionLabel } from '@/components/ui';
import { CalendarTint, ScriptFont, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { describe, formatBangla, formatHijri } from '@/lib/calendars';
import { BANGLA_WEEKDAYS_BN, seasonForDate } from '@/lib/calendars/bangla';
import { HIJRI_WEEKDAYS_AR } from '@/lib/calendars/hijri';
import { toNumerals } from '@/lib/calendars/numerals';
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

export default function TodayScreen() {
  const today = useMemo(() => new Date(), []);
  const theme = useTheme();
  const settings = useStore((s) => s.settings);
  const t = describe(today);
  const season = seasonForDate(today);
  const n = settings.numerals;

  return (
    <Screen>
      <View style={{ marginBottom: Spacing.three }}>
        <ModeSwitcher />
      </View>
      <ScreenTitle>Today</ScreenTitle>

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
              weekday={BANGLA_WEEKDAYS_BN[today.getDay()]}
              font={ScriptFont.bangla}
            />
          )}
          {settings.show.hijri && (
            <HeroLine
              color={CalendarTint.hijri}
              value={toNumerals(formatHijri(t.hijri, 'ar'), n === 'bangla' ? 'arabic' : n)}
              weekday={HIJRI_WEEKDAYS_AR[today.getDay()]}
              font={ScriptFont.arabic}
            />
          )}
        </View>
      </Card>

      <View style={{ height: Spacing.three }} />
      {settings.mode === 'agricultural' && <AgriculturePanel date={today} />}
      {settings.mode === 'islamic' && <IslamicPanel date={today} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  big: { fontSize: 40, fontWeight: '700', letterSpacing: 0.3, marginVertical: 2 },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  value: { fontSize: 19, fontWeight: '600' },
  weekday: { fontSize: 13, fontWeight: '500', marginTop: 1 },
});
