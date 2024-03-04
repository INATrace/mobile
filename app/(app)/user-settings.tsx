import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function UserSettings() {
  const { logOut } = useContext(AuthContext);
  return (
    <SafeAreaView>
      <Text>User Settings</Text>
      <Pressable onPress={() => logOut()}>
        <Text>Log Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}
