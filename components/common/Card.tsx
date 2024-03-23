import { View, Text, Pressable, Platform, TextInput } from 'react-native';
import {
  AlertCircle,
  ChevronDown,
  MoveDiagonal,
  Search,
  X,
} from 'lucide-react-native';
import { router } from 'expo-router';
import cn from '@/utils/cn';
import { AuthContext } from '@/context/AuthContext';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Farmer } from '@/types/farmer';
import { InputCard, InputCardDate } from './Input';
import { FullWindowOverlay } from 'react-native-screens';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Selector from './Selector';
import Colors from '@/constants/Colors';
import i18n from '@/locales/i18n';

export type CardProps = {
  items: Array<ItemProps>;
  title?: string;
  navigationPath?: string;
  navigationParams?: {
    type: 'farmer';
    data: Farmer;
  };
  synced?: boolean;
  canClose?: boolean;
  onClose?: () => void;
};

export type ItemProps = {
  type: 'view' | 'type' | 'select' | 'checkbox' | 'date';
  name: string;
  value: string | null;
  placeholder?: string;
  editable?: boolean;
  selectItems?: Array<{ label: string; value: string }>;
  setValue?: (text: string) => void;
  isSelectScrollable?: boolean;
  selectWithSearch?: boolean;
  updateSearch?: (search: string) => void;
  snapPoints?: string;
  isNumeric?: boolean;
  error?: boolean;
};

export default function Card({
  items,
  title,
  navigationPath,
  navigationParams,
  synced,
  canClose,
  onClose,
}: CardProps) {
  const { selectFarmer } = useContext(AuthContext);

  const navigateToDetails = () => {
    switch (navigationParams?.type) {
      case 'farmer':
        selectFarmer(navigationParams.data);
        break;
      default:
        break;
    }

    router.push(navigationPath as any);
  };

  return (
    <View className="flex flex-col m-5">
      {synced === false && (
        <View className="flex flex-row items-center justify-start mb-1">
          <AlertCircle className="mr-1 text-purple-300" size={14} />
          <Text className="text-purple-300">
            {i18n.t('synced.itemNotSynced')}
          </Text>
        </View>
      )}
      {title && (
        <View className="flex flex-row items-center justify-between p-4 bg-Green rounded-t-md">
          <Text className="text-White text-[18px] font-semibold">{title}</Text>
          {navigationPath && (
            <Pressable onPress={() => navigateToDetails()}>
              <MoveDiagonal className="text-White" />
            </Pressable>
          )}
          {canClose && (
            <Pressable onPress={onClose}>
              <X className="text-White" />
            </Pressable>
          )}
        </View>
      )}
      <View
        className={cn(
          title
            ? 'border-x border-x-LightGray border-b border-b-LightGray rounded-b-md'
            : 'border border-LightGray rounded-md',
          'bg-White'
        )}
      >
        {items?.map((item, index) => {
          switch (item.type) {
            case 'view':
              return (
                <ItemView
                  key={index}
                  item={item}
                  isLast={index === items.length - 1}
                />
              );
            case 'type':
              return (
                <ItemType
                  key={index}
                  item={item}
                  isLast={index === items.length - 1}
                />
              );
            case 'select':
              return (
                <ItemSelect
                  key={index}
                  item={item}
                  isLast={index === items.length - 1}
                />
              );
            case 'checkbox':
              return (
                <ItemCheckbox
                  key={index}
                  item={item}
                  isLast={index === items.length - 1}
                />
              );
            case 'date':
              return (
                <ItemDate
                  key={index}
                  item={item}
                  isLast={index === items.length - 1}
                />
              );
          }
        })}
      </View>
    </View>
  );
}

const ItemView = ({ item, isLast }: { item: ItemProps; isLast: boolean }) => {
  return (
    <View
      className={cn(
        'flex flex-row justify-between py-4 ml-4 pr-4 border-b border-b-LightGray',
        isLast && 'border-b-0'
      )}
    >
      <Text className="text-[16px] max-w-[45%]">{item.name}</Text>
      <Text className="text-DarkGray text-[16px]">{item.value}</Text>
    </View>
  );
};

const ItemType = ({ item, isLast }: { item: ItemProps; isLast: boolean }) => {
  return (
    <View
      className={cn(
        'flex flex-row items-center justify-between py-2 ml-4 pr-4 border-b border-b-LightGray',
        isLast && 'border-b-0'
      )}
    >
      <Text className="text-[16px] mr-3 max-w-[45%]">{item.name}</Text>
      <InputCard
        value={item.value ?? ''}
        placeholder={item.placeholder}
        editable={item.editable}
        onChangeText={item.setValue ?? (() => {})}
        keyboardType={item.isNumeric ? 'numeric' : 'default'}
        error={item.error}
      />
    </View>
  );
};

const ItemSelect = ({ item, isLast }: { item: ItemProps; isLast: boolean }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['75%'], []);
  const handlePresentModalPress = () => {
    bottomSheetRef.current?.present();
  };
  const containerComponent = useCallback(
    (props: any) => <FullWindowOverlay>{props.children}</FullWindowOverlay>,
    []
  );

  const [search, setSearch] = useState<string>('');

  const handleChangeSearch = (search: string) => {
    setSearch(search);
    item.updateSearch?.(search);
  };

  const selected = item.selectItems?.find(
    (selected) => selected.value === item.value
  );

  return (
    <View className="">
      <View
        className={cn(
          'flex flex-row items-center justify-between py-2 ml-4 pr-4 border-b border-b-LightGray',
          isLast && 'border-b-0'
        )}
      >
        <Text className="text-[16px] mr-3 max-w-[45%]">{item.name}</Text>
        <Pressable
          onPress={handlePresentModalPress}
          className={cn(
            'flex flex-row items-center flex-shrink px-2 py-1 border-b border-b-LightGray',
            item.error && 'border-b-red-500'
          )}
        >
          <Text
            className={cn(
              'text-[16px]',
              item.value ? '' : 'text-DarkGray',
              item.error && 'text-red-500'
            )}
          >
            {selected ? selected.label : item.placeholder}
          </Text>
          <ChevronDown
            className={cn(
              'ml-1',
              item.error ? 'text-red-500' : 'text-DarkGray'
            )}
          />
        </Pressable>
      </View>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            onPress={() => bottomSheetRef.current?.close()}
            disappearsOnIndex={-1}
          />
        )}
        enableDismissOnClose={true}
        containerComponent={
          Platform.OS === 'ios' ? containerComponent : undefined
        }
      >
        <BottomSheetScrollView className="rounded-t-md">
          {item.selectWithSearch && (
            <View className="relative flex flex-row items-center justify-between h-12 mx-5 mt-1 border rounded-md border-LightGray bg-White">
              <Search className="absolute text-LightGray left-4" />
              <TextInput
                placeholder={i18n.t('farmers.search')}
                value={search}
                onChangeText={handleChangeSearch}
                placeholderTextColor={Colors.darkGray}
                className="text-[16px] h-12 px-2 pl-12 rounded-md w-full"
              />
            </View>
          )}
          <Selector
            items={item.selectItems ?? []}
            selected={item.value ?? ''}
            setSelected={item.setValue ?? (() => {})}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

const ItemDate = ({ item, isLast }: { item: ItemProps; isLast: boolean }) => {
  return (
    <View
      className={cn(
        'flex flex-row items-center justify-between py-2 ml-4 pr-4 border-b border-b-LightGray',
        isLast && 'border-b-0'
      )}
    >
      <Text className="text-[16px] mr-3 max-w-[45%]">{item.name}</Text>
      <InputCardDate
        value={item.value ?? ''}
        placeholder={item.placeholder}
        editable={item.editable}
        onChangeText={item.setValue ?? (() => {})}
        error={item.error}
      />
    </View>
  );
};

const ItemCheckbox = ({
  item,
  isLast,
}: {
  item: ItemProps;
  isLast: boolean;
}) => {
  return (
    <View>
      <Text>{item.name}</Text>
    </View>
  );
};
