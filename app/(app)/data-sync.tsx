import { Farmer } from '@/types/farmer';
import { useNavigation } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import realm from '@/realm/useRealm';
import { FarmerSchema, PlotSchema } from '@/realm/schemas';

export default function DataSync() {
  const navigation = useNavigation();

  const [farmersToSync, setFarmersToSync] = useState<Farmer[]>([]);
  const [plotsToSync, setPlotsToSync] = useState<Farmer[]>([]);

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

    getItemsToSync();
  }, []);

  const getItemsToSync = async () => {
    const farmers = await realm.realmRead(
      FarmerSchema,
      undefined,
      undefined,
      undefined,
      undefined,
      'synced = false'
    );
    const plots = await realm.realmRead(
      PlotSchema,
      undefined,
      undefined,
      undefined,
      undefined,
      'synced = false'
    );

    console.log(farmers);
    console.log(plots);
  };

  return <ScrollView className="h-full bg-White"></ScrollView>;
}
