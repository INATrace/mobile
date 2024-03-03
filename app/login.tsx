import LoginLowerBlobSvg from '@/components/svg/LoginLowerBlob';
import LoginUpperBlobSvg from '@/components/svg/LoginUpperBlob';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { i18n } from './_layout';
import { Input, InputPassword } from '@/components/common/Input';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <KeyboardAvoidingView
      className="flex flex-col justify-between h-full"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LoginUpperBlobSvg />
      <SafeAreaView className="px-5">
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
          <Pressable>
            <Text className="underline text-Green">
              {i18n.t('login.forgotPassword')}
            </Text>
          </Pressable>
        </View>
        <View className="self-end">
          <Pressable className="px-5 py-3 rounded-md bg-Orange">
            <Text className="text-White font-semibold text-[18px]">
              {i18n.t('login.login')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
      <LoginLowerBlobSvg />
      <StatusBar barStyle={'dark-content'} />
    </KeyboardAvoidingView>
  );
}
