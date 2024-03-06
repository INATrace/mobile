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
    <View className="flex flex-col rounded-md">
      {title && (
        <View className="flex flex-row items-center justify-between bg-Green">
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
            return <ItemView key={index} item={item} />;
          case 'type':
            return <ItemType key={index} item={item} />;
          case 'select':
            return <ItemSelect key={index} item={item} />;
          case 'checkbox':
            return <ItemCheckbox key={index} item={item} />;
        }
      })}
    </View>
  );
}

const ItemView = ({ item }: { item: ItemProps }) => {
  return (
    <View>
      <Text>{item.name}</Text>
    </View>
  );
};

const ItemType = ({ item }: { item: ItemProps }) => {
  return (
    <View>
      <Text>{item.name}</Text>
    </View>
  );
};

const ItemSelect = ({ item }: { item: ItemProps }) => {
  return (
    <View>
      <Text>{item.name}</Text>
    </View>
  );
};

const ItemCheckbox = ({ item }: { item: ItemProps }) => {
  return (
    <View>
      <Text>{item.name}</Text>
    </View>
  );
};
