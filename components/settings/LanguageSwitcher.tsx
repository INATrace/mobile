import i18n from '@/locales/i18n';
import { View, Text, Pressable } from 'react-native';

const locales = [
  { label: i18n.t('userSettings.english'), value: 'en' },
  { label: i18n.t('userSettings.german'), value: 'de' },
  { label: i18n.t('userSettings.spanish'), value: 'es' },
  { label: i18n.t('userSettings.kinyarwanda'), value: 'rw' },
];

export default function LanguageSwitcher() {
  return (
    <View>
      {locales.map((locale, index) => (
        <View key={index} className="flex flex-row justify-between">
          <Text>{locale.label}</Text>
          {i18n.locale === locale.value ? (
            <Pressable className="flex flex-row items-center justify-center w-5 h-5 rounded-full bg-DarkGray">
              <View className="flex flex-row items-center justify-center w-4 h-4 rounded-full bg-White">
                <View className="flex flex-row items-center justify-center w-2.5 h-2.5 rounded-full bg-DarkGray" />
              </View>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                i18n.locale = locale.value;
              }}
              className="flex flex-row items-center justify-center w-5 h-5 rounded-full bg-DarkGray"
            >
              <View className="flex flex-row items-center justify-center w-4 h-4 rounded-full bg-White" />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}
