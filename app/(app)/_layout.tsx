import { Redirect, Stack } from 'expo-router';

import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '@/context/AuthContext';
import { View, Text } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AppLayout() {
  const { logIn, isLoading } = useContext(AuthContext);

  const [isStartupLoading, setIsStartupLoading] = useState<boolean>(true);

  useEffect(() => {}, []);
  const handleLogIn = async () => {
    await logIn('username', 'password');
  };

  if (isStartupLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
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
