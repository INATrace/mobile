import cn from '@/utils/cn';
import { Check, LucideIcon } from 'lucide-react-native';
import { Pressable, View, Text } from 'react-native';

type SelectorProps = {
  selected: string | number;
  setSelected: (selected: string | number) => void;
  items: { label: string; value: string | number; icon?: LucideIcon }[];
};

export default function Selector(props: SelectorProps) {
  return (
    <View className="m-5 border rounded-md border-LightGray">
      {props.items.map((item, index) => {
        const IconComponent = item?.icon;
        return (
          <Pressable
            key={index}
            onPress={() => {
              props.setSelected(item.value);
            }}
            className={cn(
              'flex flex-row justify-between py-4 ml-4 pr-4 ml border-b border-b-LightGray',
              index === props.items.length - 1 && 'border-b-0'
            )}
          >
            <View className="flex flex-row items-center">
              <Text className="text-[16px] text-Black">{item.label}</Text>
              {IconComponent && (
                <IconComponent className="ml-2 text-black" size={20} />
              )}
            </View>

            {props.selected === item.value && (
              <Check className="text-black" size={20} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
