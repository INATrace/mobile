import { View, Text, Pressable } from 'react-native';
import { Scaling } from 'lucide-react-native';

type CardProps = {
  items: Array<{
    type: 'type' | 'select' | 'checkbox';
    name: string;
    value: string | null;
    placeholder: string;
    editable?: boolean;
    setValue?: (value: string) => void;
  }>;
  title?: string;
  navigationPath?: string;
  navigationParams?: any;
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
        return (
          <View key={index}>
            <Text>{item.name}</Text>
          </View>
        );
      })}
    </View>
  );
}
