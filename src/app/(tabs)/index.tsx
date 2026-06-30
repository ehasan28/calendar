import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { MonthGrid, MonthHeader } from '@/components/calendar/month-grid';
import { CalendarLegend } from '@/components/calendar/calendar-legend';
import { DayDetail } from '@/components/calendar/day-detail';
import { ModeBadge } from '@/components/mode-badge';
import { AgriculturePanel } from '@/components/modes/agriculture-panel';
import { IslamicPanel } from '@/components/modes/islamic-panel';
import { Screen } from '@/components/screen';
import { Spacing } from '@/constants/theme';
import { MONTHS_EN, addMonths, startOfDay } from '@/lib/calendars/gregorian';
import { banglaMonthName, toBangla } from '@/lib/calendars/bangla';
import { hijriMonthName, toHijri } from '@/lib/calendars/hijri';
import { useStore } from '@/store/useStore';

export default function CalendarScreen() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);
  const mode = useStore((s) => s.settings.mode);

  const year = cursor.getFullYear();
  const month = cursor.getMonth() + 1;

  // Cross-calendar context for the month's midpoint.
  const mid = new Date(year, month - 1, 15);
  const subtitle = `${banglaMonthName(toBangla(mid).month, 'en')} · ${hijriMonthName(toHijri(mid).month, 'en')}`;

  return (
    <Screen>
      <View style={{ marginBottom: Spacing.two }}>
        <ModeBadge />
      </View>

      <MonthHeader
        title={`${MONTHS_EN[month - 1]} ${year}`}
        subtitle={subtitle}
        onPrev={() => setCursor(addMonths(cursor, -1))}
        onNext={() => setCursor(addMonths(cursor, 1))}
        onToday={() => {
          setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
          setSelected(today);
        }}
      />

      <CalendarLegend />
      <MonthGrid year={year} month={month} selected={selected} onSelect={setSelected} />

      <View style={{ height: Spacing.three }} />
      <DayDetail date={selected} />

      <View style={{ height: Spacing.three }} />
      {mode === 'agricultural' && <AgriculturePanel date={selected} />}
      {mode === 'islamic' && <IslamicPanel date={selected} />}
    </Screen>
  );
}
