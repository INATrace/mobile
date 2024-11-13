import { Text, Pressable } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ChevronLeft } from 'lucide-react-native';
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
    console.log(selectedFarmer);
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
    return <FarmerInformationGuest />;
  }

  return (
    <FarmerInformation
      selectedFarmer={selectedFarmer}
      navigateToPlots={navigateToPlots}
      navigateToPlotsMapping={navigateToPlotsMapping}
    />
  );
}
