import { Stack } from 'expo-router';

export default function FarmersLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="farmer-info" options={{ presentation: 'modal' }} />
      <Stack.Screen name="view-plots" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
