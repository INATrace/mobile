import { Stack } from 'expo-router';

export default function FarmersLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="info/[id]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="view/[id]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
