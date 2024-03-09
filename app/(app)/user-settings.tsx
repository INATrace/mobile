import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { router } from 'expo-router';
import i18n from '@/locales/i18n';
import { Input } from '@/components/common/Input';

export default function UserSettings() {
  const { logOut, user, selectedCompany } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView className="h-full p-5 bg-White">
      <ScrollView className="h-full">
        <Text className="text-[18px] font-medium">
          {i18n.t('userSettings.userInformation')}
        </Text>
        <View className="flex flex-row items-center mx-1.5 mt-5 justify-evenly">
          <View className="w-1/2">
            <Text>{i18n.t('userSettings.name')}</Text>
            <Input
              value={user?.name || ''}
              onChangeText={() => {}}
              editable={false}
            />
          </View>
          <View className="mx-2.5" />
          <View className="w-1/2">
            <Text>{i18n.t('userSettings.surname')}</Text>
            <Input
              value={user?.surname || ''}
              onChangeText={() => {}}
              editable={false}
            />
          </View>
        </View>
        <View className="mt-3">
          <Text>{i18n.t('userSettings.username')}</Text>
          <Input
            value={user?.email || ''}
            onChangeText={() => {}}
            editable={false}
          />
        </View>
        <Text className="text-[18px] font-medium mt-5">
          {i18n.t('userSettings.companyInformation')}
        </Text>
        {/* <Pressable onPress={() => handleLogOut()}>
          <Text>Log Out</Text>
        </Pressable> */}
      </ScrollView>
    </SafeAreaView>
  );
}
