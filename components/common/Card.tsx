import { View, Text, Pressable } from 'react-native';
import { MoveDiagonal } from 'lucide-react-native';
import { router } from 'expo-router';
import cn from '@/utils/cn';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Farmer } from '@/types/farmer';

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
  setValue?: (value: string) => void;
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
        'flex flex-row justify-between py-4 ml-4 pr-4 ml border-b border-b-LightGray',
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
    <View>
      <Text>{item.name}</Text>
    </View>
  );
};

const ItemSelect = ({ item, isLast }: { item: ItemProps; isLast: boolean }) => {
  return (
    <View>
      <Text>{item.name}</Text>
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
