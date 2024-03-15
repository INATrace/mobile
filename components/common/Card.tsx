import { View, Text, Pressable, Platform } from 'react-native';
import { ChevronDown, MoveDiagonal } from 'lucide-react-native';
import { router } from 'expo-router';
import cn from '@/utils/cn';
import { AuthContext } from '@/context/AuthContext';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { Farmer } from '@/types/farmer';
import { InputCard } from './Input';
import { FullWindowOverlay } from 'react-native-screens';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Selector from './Selector';

export type CardProps = {
  items: Array<ItemProps>;
  title?: string;
  navigationPath?: string;
  navigationParams?: {
    type: 'farmer';
    data: Farmer;
  };
};

export type ItemProps = {
  type: 'view' | 'type' | 'select' | 'checkbox';
  name: string;
  value: string | null;
  placeholder?: string;
  editable?: boolean;
  selectItems?: Array<{ label: string; value: string }>;
  setValue?: (text: string) => void;
  isSelectScrollable?: boolean;
};

export default function Card({
  items,
  title,
  navigationPath,
  navigationParams,
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
      {title && (
        <View className="flex flex-row items-center justify-between p-4 bg-Green rounded-t-md">
          <Text className="text-White text-[18px] font-semibold">{title}</Text>
          {navigationPath && (
            <Pressable onPress={() => navigateToDetails()}>
              <MoveDiagonal className="text-White" />
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
        {items.map((item, index) => {
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
      <Text className="text-[16px]">{item.name}</Text>
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
      <Text className="text-[16px] mr-3">{item.name}</Text>
      <InputCard
        value={item.value ?? ''}
        placeholder={item.placeholder}
        editable={item.editable}
        onChangeText={item.setValue ?? (() => {})}
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

  return (
    <View className="">
      <View
        className={cn(
          'flex flex-row items-center justify-between py-2 ml-4 pr-4 border-b border-b-LightGray',
          isLast && 'border-b-0'
        )}
      >
        <Text className="text-[16px] mr-3">{item.name}</Text>
        <Pressable
          onPress={handlePresentModalPress}
          className="flex flex-row items-center flex-shrink px-2 border-b border-b-LightGray"
        >
          <Text
            className={cn('text-[16px]', item.value ? '' : 'text-DarkGray')}
          >
            {item.value ? item.value : item.placeholder}
          </Text>
          <ChevronDown className="ml-1 text-DarkGray" />
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
