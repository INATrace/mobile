import LoginLowerBlobSvg from '@/components/svg/LoginLowerBlob';
import LoginUpperBlobSvg from '@/components/svg/LoginUpperBlob';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  return (
    <View>
      <LoginUpperBlobSvg />
      <SafeAreaView>
        <Text>Login</Text>
      </SafeAreaView>
      <LoginLowerBlobSvg />
    </View>
  );
}
