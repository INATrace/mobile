import {
  View,
  Text,
  Pressable,
  ScrollView,
  Linking,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from '@/context/AuthContext';
import { router, useNavigation } from 'expo-router';
import i18n from '@/locales/i18n';
import { Input } from '@/components/common/Input';
import LanguageSwitcher from '@/components/settings/LanguageSwitcher';
import { ChevronLeft, LogOut } from 'lucide-react-native';
import { NetInfoState } from '@react-native-community/netinfo';
import { CompanyInfo } from '@/types/company';
import { User } from '@/types/user';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Selector from '@/components/common/Selector';
import { FullWindowOverlay } from 'react-native-screens';

export default function UserSettings() {
  const [connection, setConnection] = useState<NetInfoState | null>(null);
  const [company, setCompany] = useState<CompanyInfo | undefined>(undefined);
  const {
    logOut,
    user,
    selectedCompany,
    companies,
    getConnection,
    selectCompany,
  } = useContext(AuthContext);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['75%'], []);
  const handlePresentModalPress = () => {
    bottomSheetRef.current?.present();
  };
  const containerComponent = useCallback(
    (props: any) => <FullWindowOverlay>{props.children}</FullWindowOverlay>,
    []
  );

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex flex-row items-center justify-center mr-3"
        >
          <ChevronLeft className="text-Orange" />
          <Text className="font-medium text-Orange text-[18px]">Back</Text>
        </Pressable>
      ),
    });
  }, []);

  useEffect(() => {
    if (
      selectedCompany &&
      typeof selectedCompany !== 'string' &&
      companies &&
      typeof companies !== 'string'
    ) {
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
        <View className="flex flex-row items-center justify-between w-full mt-3">
          <View className="flex flex-row items-center justify-center w-20 h-20 border rounded-full border-LightGray">
            <Image
              source={{
                uri: company?.logo,
              }}
              className="w-20 h-20 rounded-full"
            />
          </View>
          <View className="flex flex-col items-start w-full ml-4">
            <Text className="text-[16px]">
              {i18n.t('userSettings.company')}
            </Text>
            {connection?.isConnected ? (
              <>
                <Pressable
                  className="px-2 py-3 mt-2 border rounded-md border-LightGray"
                  style={{ width: Dimensions.get('window').width - 136 }}
                  onPress={handlePresentModalPress}
                >
                  <Text className=" text-DarkGray">{company?.name}</Text>
                </Pressable>
                <BottomSheetModal
                  ref={bottomSheetRef}
                  index={0}
                  snapPoints={snapPoints}
                  backdropComponent={(props) => (
                    <BottomSheetBackdrop
                      {...props}
                      onPress={() => bottomSheetRef.current?.close()}
                      disappearsOnIndex={-1}
                    />
                  )}
                  enableDismissOnClose={true}
                  containerComponent={
                    Platform.OS === 'ios' ? containerComponent : undefined
                  }
                >
                  <BottomSheetView className="rounded-t-md">
                    {typeof companies !== 'string' && (
                      <Selector
                        items={
                          companies?.map((company) => ({
                            label: company?.name ?? '',
                            value: company?.id ?? 0,
                          })) ?? []
                        }
                        selected={company?.id ?? 0}
                        setSelected={selectCompany}
                      />
                    )}
                  </BottomSheetView>
                </BottomSheetModal>
              </>
            ) : (
              <View>
                <Text className="font-semibold text-Blue">{company?.name}</Text>
              </View>
            )}
          </View>
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
