import i18n from '@/locales/i18n';
import cn from '@/utils/cn';
import { Map, Scroll } from 'lucide-react-native';
import { Pressable, View, Text } from 'react-native';

export type ViewSwitcherProps = {
  viewType: 'list' | 'map';
  setViewType: (viewType: 'list' | 'map') => void;
};

export default function ViewSwitcher({
  viewType,
  setViewType,
}: ViewSwitcherProps) {
  return (
    <View className="flex flex-row items-center justify-between p-5">
      <Pressable
        onPress={() => setViewType('list')}
        className={cn(
          viewType === 'list'
            ? 'bg-Orange border-Orange'
            : 'bg-White border-DarkGray',
          'flex flex-row items-center justify-center w-[48%] rounded-md border py-2'
        )}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.45,
          shadowRadius: 3.84,
          elevation: 14,
        }}
      >
        <Scroll
          className={cn(
            viewType === 'list' ? 'text-White' : 'text-black',
            'mr-2'
          )}
        />
        <Text
          className={cn(
            viewType === 'list' ? 'text-White' : 'text-black',
            'font-semibold'
          )}
        >
          {i18n.t('plots.listView')}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setViewType('map')}
        className={cn(
          viewType === 'map'
            ? 'bg-Orange border-Orange'
            : 'bg-White border-DarkGray',
          'flex flex-row items-center justify-center w-[48%] rounded-md border py-2'
        )}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.45,
          shadowRadius: 3.84,
          elevation: 14,
        }}
      >
        <Map
          className={cn(
            viewType === 'map' ? 'text-White' : 'text-black',
            'mr-2'
          )}
        />
        <Text
          className={cn(
            viewType === 'map' ? 'text-White' : 'text-black',
            'font-semibold'
          )}
        >
          {i18n.t('plots.mapView')}
        </Text>
      </Pressable>
    </View>
  );
}
