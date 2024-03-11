import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import QRCode from 'react-native-qrcode-svg';
import i18n from '@/locales/i18n';
import Card from '@/components/common/Card';
import { ChevronLeft } from 'lucide-react-native';

export default function FarmersInfo() {
  const { selectedFarmer } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: `${selectedFarmer?.name} ${selectedFarmer?.surname}`,
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex flex-row items-center justify-center mr-3"
        >
          <ChevronLeft className="text-Orange" />
          <Text className="font-medium text-Orange">Back</Text>
        </Pressable>
      ),
    });
  }, [selectedFarmer]);

  return (
    <ScrollView className="h-full border-t bg-White border-t-LightGray">
      <View className="flex flex-col items-center justify-center pt-5 mx-5">
        <QRCode value={selectedFarmer?.id.toString()} />
        <Text className="mt-3 mb-5">{selectedFarmer?.id}</Text>
        <Pressable className="flex flex-row items-center justify-center w-full px-5 py-3 rounded-md bg-Orange">
          <Text className="text-[16px] text-White font-semibold">
            {i18n.t('farmers.info.viewAllPlots')}
          </Text>
        </Pressable>
      </View>
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.basicInformation.title')}
      </Text>
      <Card
        items={[
          {
            type: 'view',
            name: i18n.t('farmers.info.basicInformation.firstName'),
            value: selectedFarmer?.name ?? '',
          },
          {
            type: 'view',
            name: i18n.t('farmers.info.basicInformation.lastName'),
            value: selectedFarmer?.surname ?? '',
          },
          {
            type: 'view',
            name: i18n.t('farmers.info.basicInformation.gender'),
            value: selectedFarmer?.gender ?? '',
          },
          {
            type: 'view',
            name: i18n.t('farmers.info.basicInformation.userId'),
            value: selectedFarmer?.id.toString() ?? '',
          },
          {
            type: 'view',
            name: i18n.t(
              'farmers.info.basicInformation.companyInternalFarmerId'
            ),
            value: selectedFarmer?.farmerCompanyInternalId ?? '',
          },
        ]}
      />
    </ScrollView>
  );
}
