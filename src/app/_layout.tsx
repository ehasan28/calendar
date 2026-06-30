import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorMode } from '@/hooks/use-theme';
import { hydrateStore, useStore } from '@/store/useStore';

export default function RootLayout() {
  const mode = useColorMode();
  const hydrated = useStore((s) => s.hydrated);

  useEffect(() => {
    hydrateStore();
  }, []);

  // Ask the browser to keep our data (exempt from automatic eviction). Web/PWA only.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const nav: any = typeof navigator !== 'undefined' ? navigator : null;
    nav?.storage?.persisted?.().then((already: boolean) => {
      if (!already) nav.storage.persist?.();
    }).catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Avoid a flash of default settings before persisted state loads. */}
        {!hydrated ? (
          <View style={{ flex: 1, backgroundColor: mode === 'dark' ? '#000' : '#fff' }} />
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="clock-full" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
            <Stack.Screen name="event" options={{ presentation: 'modal' }} />
          </Stack>
        )}
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
