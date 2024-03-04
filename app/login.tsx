import LoginLowerBlobSvg from '@/components/svg/LoginLowerBlob';
import LoginUpperBlobSvg from '@/components/svg/LoginUpperBlob';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { i18n } from './_layout';
import { Input, InputPassword } from '@/components/common/Input';
import { useState } from 'react';

import { useSession } from '@/context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const session = useSession();

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex flex-col justify-between h-full">
        <LoginUpperBlobSvg />
        <SafeAreaView className="px-5">
          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={300}
          >
            <Text className="text-[24px] font-semibold">
              {i18n.t('login.welcomeBack')}
            </Text>
            <Text className="text-[20px]">
              {i18n.t('login.welcomeBackSubtitle')}
            </Text>
            <View className="mt-5">
              <Text>{i18n.t('login.username')}</Text>
              <Input
                placeholder={i18n.t('login.usernamePlaceholder')}
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View className="mt-3">
              <Text>{i18n.t('login.password')}</Text>
              <InputPassword
                placeholder={i18n.t('login.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                isPasswordVisible={isPasswordVisible}
                setIsPasswordVisible={setIsPasswordVisible}
              />
            </View>
            <View className="mt-3">
              <Pressable onPress={() => resetPassword()}>
                <Text className="underline text-Green">
                  {i18n.t('login.forgotPassword')}
                </Text>
              </Pressable>
            </View>
            <View className="self-end">
              <Pressable
                onPress={() => session.logIn(username, password)}
                className="px-5 py-3 rounded-md bg-Orange"
              >
                <Text className="text-White font-semibold text-[18px]">
                  {i18n.t('login.login')}
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
        <View className="flex items-end w-full">
          <LoginLowerBlobSvg />
        </View>

        <StatusBar barStyle={'dark-content'} />
      </View>
    </TouchableWithoutFeedback>
  );
}
