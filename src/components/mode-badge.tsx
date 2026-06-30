import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore, type Mode } from '@/store/useStore';

const LABEL: Record<Mode, { text: string; icon: keyof typeof Ionicons.glyphMap }> = {
  default: { text: 'Default', icon: 'calendar-outline' },
  agricultural: { text: 'Agriculture', icon: 'leaf-outline' },
  islamic: { text: 'Islamic', icon: 'moon-outline' },
};

/** Non-interactive chip showing the active mode (changed in Settings). */
export function ModeBadge() {
  const theme = useTheme();
  const mode = useStore((s) => s.settings.mode);
  const { text, icon } = LABEL[mode];
  return (
    <View style={[styles.badge, { backgroundColor: theme.accentSoft }]}>
      <Ionicons name={icon} size={13} color={theme.accent} />
      <Text style={[styles.text, { color: theme.accent }]}>{text} mode</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.pill },
  text: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
});
