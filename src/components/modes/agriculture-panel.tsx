import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ModeAccent, Radius, ScriptFont, Spacing } from '@/constants/theme';
import { useColorMode, useTheme } from '@/hooks/use-theme';
import { SEASONS, seasonForDate } from '@/lib/calendars/bangla';
import { AGRICULTURE } from '@/data/agriculture';
import { Card, SectionLabel } from '@/components/ui';

function Group({ icon, title, items, color }: { icon: keyof typeof Ionicons.glyphMap; title: string; items: string[]; color: string }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <View style={styles.groupHead}>
        <Ionicons name={icon} size={16} color={color} />
        <Text style={[styles.groupTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.chips}>
        {items.map((it) => (
          <View key={it} style={[styles.chip, { backgroundColor: theme.backgroundElement }]}>
            <Text style={{ color: theme.text, fontSize: 13 }}>{it}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Agricultural mode: current Bangla season + Bangladesh crops/fruits/flowers. */
export function AgriculturePanel({ date }: { date: Date }) {
  const theme = useTheme();
  const cm = useColorMode();
  const accent = ModeAccent.agricultural[cm];
  const season = seasonForDate(date);
  const data = AGRICULTURE[season.key];
  const idx = SEASONS.findIndex((s) => s.key === season.key);
  const next = SEASONS[(idx + 1) % 6];

  return (
    <View style={{ gap: Spacing.three }}>
      <Card style={{ gap: Spacing.two }}>
        <View style={styles.seasonHead}>
          <View>
            <SectionLabel>CURRENT SEASON · ঋতু</SectionLabel>
            <Text style={[styles.seasonName, { color: theme.text }]}>
              {season.en} <Text style={{ fontFamily: ScriptFont.bangla as any, color: accent }}>{season.bn}</Text>
            </Text>
          </View>
          <View style={[styles.seasonBadge, { backgroundColor: accent + '22' }]}>
            <Ionicons name="leaf" size={22} color={accent} />
          </View>
        </View>
        <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20 }}>{data.note}</Text>
        <Text style={{ color: theme.tertiary, fontSize: 12, marginTop: 2 }}>
          Next: {next.en} · <Text style={{ fontFamily: ScriptFont.bangla as any }}>{next.bn}</Text>
        </Text>
      </Card>

      <Card style={{ gap: Spacing.three }}>
        <Group icon="nutrition-outline" title="Best crops to grow" items={data.crops} color={accent} />
        <Group icon="leaf-outline" title="Seasonal fruits" items={data.fruits} color="#E8910C" />
        <Group icon="flower-outline" title="Seasonal flowers" items={data.flowers} color="#D6589F" />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  seasonHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seasonName: { fontSize: 22, fontWeight: '700', marginTop: 2 },
  seasonBadge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  groupTitle: { fontSize: 15, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: Radius.pill },
});
