import { View, Text, Pressable } from 'react-native';
import { Farmer } from '@/types/farmer';
import i18n from '@/locales/i18n';
import { ChevronLeft, Pen } from 'lucide-react-native';
import { router, useNavigation } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function EditFarmerInfo() {
  const { selectedFarmer } = useContext(AuthContext) as {
    selectedFarmer: Farmer;
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

  return (
    <>
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.farmerInfo')}
      </Text>
      <View className="flex flex-row items-center justify-between px-5 py-3 mx-5 mt-3 border rounded-md border-LightGray">
        <Text className="text-[16px]">{`${selectedFarmer?.name}${selectedFarmer?.name && ' '}${selectedFarmer?.surname}`}</Text>
        <Pressable
          className="flex flex-row items-center justify-center"
          onPress={() => router.push('info/edit-guest' as any)}
        >
          <Pen className="mr-2 text-Orange" size={18} />
          <Text className="text-[16px] text-Orange font-semibold">
            {i18n.t('farmers.edit')}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
