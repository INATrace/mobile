import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as Localization from 'expo-localization';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { I18n } from 'i18n-js';
import { useEffect } from 'react';

import de from '../locales/de.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import rw from '../locales/rw.json';
import { SessionProvider } from '@/context/AuthContext';

export const i18n = new I18n({
  en,
  es,
  de,
  rw,
});

i18n.locale = Localization.getLocales()[0].languageCode || 'en';
i18n.enableFallback = true;

export { ErrorBoundary } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
