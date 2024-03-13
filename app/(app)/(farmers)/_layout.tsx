import i18n from '@/locales/i18n';
import { Stack } from 'expo-router';

export default function FarmersLayout() {
  return (
    <Stack>
      <Stack.Screen name="[type]" options={{ headerShown: false }} />
      <Stack.Screen name="new-farmer" options={{ presentation: 'modal' }} />
      <Stack.Screen name="info/[id]" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="view/[id]"
        options={{ presentation: 'modal', title: i18n.t('plots.title') }}
      />
    </Stack>
  );
}
