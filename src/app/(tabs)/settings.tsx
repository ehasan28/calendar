import { Switch, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, Row, ScreenTitle, SectionLabel, SegmentedControl } from '@/components/ui';
import { CalendarTint, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DHAKA } from '@/lib/prayer';
import {
  useStore,
  type ClockFace,
  type ClockTheme,
  type NumeralStyle,
  type ThemePref,
} from '@/store/useStore';

export default function SettingsScreen() {
  const theme = useTheme();
  const s = useStore((st) => st.settings);
  const patch = useStore((st) => st.patchSettings);
  const toggle = useStore((st) => st.toggleCalendar);

  return (
    <Screen>
      <ScreenTitle>Settings</ScreenTitle>

      <SectionLabel>APPEARANCE</SectionLabel>
      <Card style={{ gap: Spacing.three, marginBottom: Spacing.four }}>
        <View style={{ gap: 6 }}>
          <Row label="Theme" />
          <SegmentedControl<ThemePref>
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'system' },
            ]}
            value={s.theme}
            onChange={(v) => patch({ theme: v })}
          />
        </View>
        <View style={{ gap: 6 }}>
          <Row label="Numerals" />
          <SegmentedControl<NumeralStyle>
            options={[
              { label: '123', value: 'western' },
              { label: '১২৩', value: 'bangla' },
              { label: '١٢٣', value: 'arabic' },
            ]}
            value={s.numerals}
            onChange={(v) => patch({ numerals: v })}
          />
        </View>
      </Card>

      <SectionLabel>CALENDARS SHOWN</SectionLabel>
      <Card style={{ marginBottom: Spacing.four }}>
        <Row icon="calendar-outline" iconColor={CalendarTint.english} label="English (Gregorian)">
          <Switch value={s.show.english} onValueChange={() => toggle('english')} trackColor={{ true: theme.accent }} />
        </Row>
        <Row icon="leaf-outline" iconColor={CalendarTint.bangla} label="Bangla (Bangabda)">
          <Switch value={s.show.bangla} onValueChange={() => toggle('bangla')} trackColor={{ true: theme.accent }} />
        </Row>
        <Row icon="moon-outline" iconColor={CalendarTint.hijri} label="Arabic (Hijri)">
          <Switch value={s.show.hijri} onValueChange={() => toggle('hijri')} trackColor={{ true: theme.accent }} />
        </Row>
      </Card>

      <SectionLabel>CLOCK</SectionLabel>
      <Card style={{ gap: Spacing.three, marginBottom: Spacing.four }}>
        <View style={{ gap: 6 }}>
          <Row label="Face" />
          <SegmentedControl<ClockFace>
            options={[
              { label: 'Digital', value: 'digital' },
              { label: 'Analog', value: 'analog' },
              { label: 'Flip', value: 'flip' },
              { label: 'Night', value: 'nightstand' },
            ]}
            value={s.clockFace}
            onChange={(v) => patch({ clockFace: v })}
          />
        </View>
        <View style={{ gap: 6 }}>
          <Row label="Theme" />
          <SegmentedControl<ClockTheme>
            options={[
              { label: 'Celestial', value: 'celestial' },
              { label: 'Gradient', value: 'gradient' },
              { label: 'Aurora', value: 'aurora' },
            ]}
            value={s.clockTheme === 'starfield' || s.clockTheme === 'seasonal' || s.clockTheme === 'islamic' || s.clockTheme === 'mono' ? 'celestial' : s.clockTheme}
            onChange={(v) => patch({ clockTheme: v })}
          />
        </View>
      </Card>

      <SectionLabel>PRAYER LOCATION</SectionLabel>
      <Card>
        <Row icon="navigate-outline" label={s.location ? s.location.label : 'Auto-detect (Dhaka fallback)'}>
          <View style={{ width: 150 }}>
            <SegmentedControl
              options={[
                { label: 'Auto', value: 'auto' },
                { label: 'Dhaka', value: 'dhaka' },
              ]}
              value={s.location ? 'dhaka' : 'auto'}
              onChange={(v) => patch({ location: v === 'dhaka' ? DHAKA : null })}
            />
          </View>
        </Row>
      </Card>
    </Screen>
  );
}
