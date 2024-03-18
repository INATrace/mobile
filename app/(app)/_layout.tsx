import { Stack, router, useSegments } from 'expo-router';

import { useContext, useEffect, useRef, useState } from 'react';

import { AuthContext } from '@/context/AuthContext';
import i18n from '@/locales/i18n';

import MapboxGL from '@rnmapbox/maps';
import OfflinePack from '@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AppLayout() {
  const { checkAuth, accessToken } = useContext(AuthContext);

  const segments = useSegments();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasNavigatedToMapDownload = useRef<boolean>(false);

  useEffect(() => {
    handleAuthCheck();
  }, [segments, accessToken]);

  const handleAuthCheck = async () => {
    if (accessToken === 'none') {
      router.replace('/login');
      return;
    } else if (accessToken) {
      const isAuth = await checkAuth();

      if (!isAuth) {
        router.replace('/login');
      } else {
        setIsLoading(false);
        checkForOfflineMaps();
      }
    }
  };

  const checkForOfflineMaps = async () => {
    try {
      const packs: OfflinePack[] = await MapboxGL.offlineManager.getPacks();
      if (packs.length === 0 && !hasNavigatedToMapDownload.current) {
        hasNavigatedToMapDownload.current = true;
        router.push('/map-download');
      }
    } catch (error) {
      console.error('Error fetching offline packs:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="data-sync"
        options={{ presentation: 'modal', title: i18n.t('home.syncData') }}
      />
      <Stack.Screen name="(farmers)" options={{ headerShown: false }} />
      <Stack.Screen
        name="user-settings"
        options={{ presentation: 'modal', title: i18n.t('userSettings.title') }}
      />
    </Stack>
  );
}
