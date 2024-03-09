import { Stack, router, useSegments } from 'expo-router';

import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '@/context/AuthContext';
import i18n from '@/locales/i18n';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AppLayout() {
  const { checkAuth, accessToken } = useContext(AuthContext);

  const segments = useSegments();

  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="data-sync" options={{ presentation: 'modal' }} />
      <Stack.Screen name="(farmers)" options={{ headerShown: false }} />
      <Stack.Screen
        name="user-settings"
        options={{ presentation: 'modal', title: i18n.t('userSettings.title') }}
      />
    </Stack>
  );
}
