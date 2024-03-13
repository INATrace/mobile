import { useNavigation } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';

export default function DataSync() {
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

  return (
    <View>
      <Text>Data Sync</Text>
    </View>
  );
}
