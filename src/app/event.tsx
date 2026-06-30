import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, PrimaryButton, ScreenTitle } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { describe, formatBangla, formatHijri } from '@/lib/calendars';
import { uid } from '@/lib/id';
import { success } from '@/lib/haptics';
import { useStore } from '@/store/useStore';

export default function EventScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; date?: string }>();
  const events = useStore((s) => s.events);
  const addEvent = useStore((s) => s.addEvent);
  const removeEvent = useStore((s) => s.removeEvent);

  const existing = params.id ? events.find((e) => e.id === params.id) : undefined;
  const isoDate = existing?.date ?? params.date ?? new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [note, setNote] = useState(existing?.note ?? '');

  const tri = useMemo(() => {
    const [y, m, d] = isoDate.split('-').map(Number);
    return describe(new Date(y, m - 1, d));
  }, [isoDate]);

  const save = () => {
    if (!title.trim()) return;
    if (existing) removeEvent(existing.id);
    addEvent({ id: existing?.id ?? uid(), title: title.trim(), date: isoDate, note: note.trim() || undefined });
    success();
    router.back();
  };

  return (
    <View style={[styles.fill, { backgroundColor: theme.background, paddingTop: insets.top + Spacing.three }]}>
      <View style={styles.inner}>
        <ScreenTitle>{existing ? 'Edit event' : 'New event'}</ScreenTitle>

        <Card style={{ gap: Spacing.three }}>
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
            {tri.english.weekday}, {tri.english.day} {tri.english.monthName} {tri.english.year}
            {'  ·  '}
            {formatBangla(tri.bangla, 'en')}
            {'  ·  '}
            {formatHijri(tri.hijri, 'en')}
          </Text>

          <TextInput
            placeholder="Title"
            placeholderTextColor={theme.tertiary}
            value={title}
            onChangeText={setTitle}
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
            autoFocus
          />
          <TextInput
            placeholder="Note (optional)"
            placeholderTextColor={theme.tertiary}
            value={note}
            onChangeText={setNote}
            multiline
            style={[styles.input, styles.note, { color: theme.text, backgroundColor: theme.backgroundElement }]}
          />
        </Card>

        <View style={{ height: Spacing.four }} />
        <PrimaryButton title={existing ? 'Save changes' : 'Add event'} onPress={save} disabled={!title.trim()} />
        <View style={{ height: Spacing.two }} />
        {existing ? (
          <PrimaryButton
            title="Delete"
            variant="ghost"
            color={theme.danger}
            onPress={() => {
              removeEvent(existing.id);
              router.back();
            }}
          />
        ) : (
          <PrimaryButton title="Cancel" variant="ghost" onPress={() => router.back()} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  inner: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: Spacing.three },
  input: { borderRadius: Radius.field, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  note: { minHeight: 80, textAlignVertical: 'top' },
});
