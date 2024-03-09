import { View, Text, Pressable } from 'react-native';
import { Scaling } from 'lucide-react-native';
import router from 'expo-router';

export type CardProps = {
  items: Array<ItemProps>;
  title?: string;
  navigationPath?: string;
  navigationParams?: any;
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
  return (
    <View className="flex flex-col p-5 rounded-md">
      {title && (
        <View className="flex flex-row items-center justify-between p-4 bg-Green rounded-t-md">
          <Text className="text-White">{title}</Text>
          {navigationPath && (
            <Pressable onPress={() => {}}>
              <Scaling className="text-White" />
            </Pressable>
          )}
        </View>
      )}
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
  );
}

const ItemView = ({ item, isLast }: { item: ItemProps; isLast: boolean }) => {
  return (
    <View className="flex flex-row items-center justify-between">
      <Text>{item.name}</Text>
      <Text>{item.value}</Text>
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
