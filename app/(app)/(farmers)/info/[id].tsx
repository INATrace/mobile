import { View, Text, Pressable, ScrollView } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import QRCode from 'react-native-qrcode-svg';
import i18n from '@/locales/i18n';
import Card, { ItemProps } from '@/components/common/Card';
import { ChevronLeft, Map, Plus } from 'lucide-react-native';
import { Farmer } from '@/types/farmer';
import FarmerInformationGuest from '@/components/farmers/info/FarmerInformationGuest';
import FarmerInformation from '@/components/farmers/info/FarmerInformation';

export default function FarmersInfo() {
  const { selectedFarmer, guestAccess } = useContext(AuthContext) as {
    selectedFarmer: Farmer;
    guestAccess: boolean;
  };
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: `${selectedFarmer?.name ?? ''} ${selectedFarmer?.surname}`,
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
  }, [selectedFarmer]);

  const navigateToPlots = () => {
    router.push(`view/${selectedFarmer?.id?.toString()}` as any);
  };

  const navigateToPlotsMapping = () => {
    router.push('view/new' as any);
  };

  if (guestAccess) {
    return (
      <FarmerInformationGuest
        selectedFarmer={selectedFarmer}
        navigateToPlots={navigateToPlots}
        navigateToPlotsMapping={navigateToPlotsMapping}
      />
    );
  }

  return (
    <FarmerInformation
      selectedFarmer={selectedFarmer}
      navigateToPlots={navigateToPlots}
      navigateToPlotsMapping={navigateToPlotsMapping}
    />
  );
}
