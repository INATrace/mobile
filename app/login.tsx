import LoginLowerBlobSvg from '@/components/svg/LoginLowerBlob';
import LoginUpperBlobSvg from '@/components/svg/LoginUpperBlob';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
  Linking,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import i18n from '@/locales/i18n';
import { Input, InputPassword } from '@/components/common/Input';
import { useState, useContext } from 'react';

import { AuthContext } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { logIn } = useContext(AuthContext);

  const resetPassword = async () => {
    const url = process.env.EXPO_PUBLIC_API_URI + '/en/reset-password';
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    } else {
      console.error('Cannot open URL:', url);
    }
  };

  const handleLogIn = async () => {
    setIsLoading(true);

    Keyboard.dismiss();

    const logInResult = await logIn(username, password);

    if (logInResult.success) {
      router.replace('/(app)/');
    } else {
      switch (logInResult.errorStatus) {
        case 'AUTH_ERROR':
          setLoginError(i18n.t('login.authError'));
          break;
        case 'GENERIC_ERROR':
          setLoginError(i18n.t('login.genericError'));
          break;
        default:
          setLoginError(i18n.t('login.genericError'));
          break;
      }
    }

    setIsLoading(false);
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
            <View className="self-start mt-3">
              <Pressable onPress={() => resetPassword()}>
                <Text className="underline text-Green">
                  {i18n.t('login.forgotPassword')}
                </Text>
              </Pressable>
            </View>
            {loginError && (
              <View className="my-3">
                <Text className="text-red-500">{loginError}</Text>
              </View>
            )}
            <View className="self-end">
              <Pressable
                onPress={() => handleLogIn()}
                className="px-5 py-3 rounded-md bg-Orange"
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-White font-semibold text-[16px]">
                    {i18n.t('login.login')}
                  </Text>
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
        <View className="flex items-end w-full">
          <LoginLowerBlobSvg />
        </View>

        <StatusBar barStyle="dark-content" />
      </View>
    </TouchableWithoutFeedback>
  );
}
