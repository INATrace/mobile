import Topbar from '@/components/common/Topbar';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '@/locales/i18n';
import SearchInput from '@/components/common/SearchInput';

export default function Farmers() {
  return (
    <SafeAreaView className="flex flex-col justify-between h-full">
      <Topbar title={i18n.t('farmers.title')} goBack />
      <SearchInput />
    </SafeAreaView>
  );
}
