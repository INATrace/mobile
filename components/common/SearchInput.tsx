import { Pressable, TextInput, View, Text, Platform } from 'react-native';
import { ArrowDownUp, Filter, Search } from 'lucide-react-native';
import i18n from '@/locales/i18n';
import ContextMenu from 'react-native-context-menu-view';

export default function SearchInput() {
  return (
    <View className="flex flex-row items-center">
      <View className="flex flex-row items-center">
        <Search />
        <TextInput placeholder={i18n.t('farmers.search')} />
      </View>

      <ContextMenu
        actions={[{ title: 'Title 1' }, { title: 'Title 2' }]}
        onPress={(e) => {
          console.warn(
            `Pressed ${e.nativeEvent.name} at index ${e.nativeEvent.index}`
          );
        }}
      >
        <View>
          <Text>Long press me</Text>
        </View>
      </ContextMenu>
    </View>
  );
}
