import { Redirect, Stack } from 'expo-router';

import { useContext } from 'react';

import { AuthContext } from '@/context/AuthContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AppLayout() {
  const { user } = useContext(AuthContext);

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
