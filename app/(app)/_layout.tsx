import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/context/AuthContext';
import { useEffect } from 'react';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AppLayout() {
  const { user, isLoading } = useSession();

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="data-sync" options={{ presentation: 'modal' }} />
      <Stack.Screen name="(farmers)" options={{ headerShown: false }} />
      <Stack.Screen name="user-settings" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
