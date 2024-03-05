import Topbar from '@/components/common/Topbar';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '@/locales/i18n';
import SearchInput from '@/components/common/SearchInput';
import { useState } from 'react';

export default function Farmers() {
  const [search, setSearch] = useState<string>('');
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex flex-col h-full bg-Background">
        <Topbar title={i18n.t('farmers.title')} goBack />
        <SearchInput input={search} setInput={setSearch} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
