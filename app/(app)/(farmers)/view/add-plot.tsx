import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { View, Text } from 'react-native';

export default function AddPlot() {
  const { newPlot } = useContext(AuthContext);
  console.log(newPlot);
  return (
    <View>
      <Text>Add Plot</Text>
    </View>
  );
}
