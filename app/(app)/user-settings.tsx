import {
  View,
  Text,
  Pressable,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { router } from 'expo-router';
import i18n from '@/locales/i18n';
import { Input } from '@/components/common/Input';
import LanguageSwitcher from '@/components/settings/LanguageSwitcher';
import { LogOut } from 'lucide-react-native';
import { NetInfoState } from '@react-native-community/netinfo';
import { CompanyInfo } from '@/types/company';
import { User } from '@/types/user';

export default function UserSettings() {
  const [connection, setConnection] = useState<NetInfoState | null>(null);
  const [company, setCompany] = useState<CompanyInfo | undefined>(undefined);
  const { logOut, user, selectedCompany, companies, getConnection } =
    useContext(AuthContext);

  useEffect(() => {
    if (
      selectedCompany &&
      typeof selectedCompany !== 'string' &&
      companies &&
      typeof companies !== 'string'
    ) {
      const cmp = companies.find((c) => c?.id === selectedCompany);
      console.log(cmp);
      setCompany(companies.find((c) => c?.id === selectedCompany));
    }
  }, [selectedCompany, companies]);

  useEffect(() => {
    getConnection.then((res) => setConnection(res));
  }, []);

  const handleLogOut = () => {
    logOut();
    router.replace('/login');
  };

  const resetPassword = async () => {
    const url = 'https://test.inatrace.org/en/reset-password';
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    } else {
      console.error('Cannot open URL:', url);
    }
  };

  return (
    <View className="h-full p-5 border-t bg-White border-t-LightGray">
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
        <View>
          {connection?.isConnected ? (
            <Image
              source={{
                uri: company?.logo,
              }}
              className="w-20 h-20 rounded-full bg-LightGray"
            />
          ) : (
            <View>
              <Text>{company?.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        <Text className="text-[18px] font-medium mt-5 mb-3">
          {i18n.t('userSettings.language')}
        </Text>
        <LanguageSwitcher />
        <View className="flex flex-row items-center justify-between mt-5">
          <Pressable
            onPress={() => resetPassword()}
            className="w-[55%] px-5 py-3 rounded-md bg-Green flex flex-row items-center justify-center"
          >
            <Text className="text-White font-semibold text-[16px]">
              {i18n.t('userSettings.resetPassword')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleLogOut()}
            className="flex flex-row items-center justify-center w-[40%] px-5 py-3 rounded-md bg-Orange"
          >
            <LogOut className="text-White" size={20} />
            <View className="w-2" />
            <Text className="text-White font-semibold text-[16px]">
              {i18n.t('userSettings.logOut')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
