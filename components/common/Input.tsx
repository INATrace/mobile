import Colors from '@/constants/Colors';
import { Pressable, TextInput, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import cn from '@/utils/cn';

type InputProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
};

type InputPasswordProps = {
  isPasswordVisible: boolean;
  setIsPasswordVisible: (visible: boolean) => void;
} & InputProps;

export const Input = (props: InputProps) => {
  return (
    <TextInput
      placeholder={props.placeholder}
      value={props.value}
      onChangeText={props.onChangeText}
      className={cn(
        'border border-LightGray w-full h-12 mt-1 px-2 text-[16px] rounded-md',
        props.editable ? '' : 'text-DarkGray'
      )}
      placeholderTextColor={Colors.darkGray}
      editable={props.editable}
    />
  );
};

export const InputPassword = (props: InputPasswordProps) => {
  return (
    <View className="flex flex-row items-center justify-between w-full h-12 mt-1 border rounded-md border-LightGray">
      <TextInput
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        secureTextEntry={!props.isPasswordVisible}
        placeholderTextColor={Colors.darkGray}
        className="text-[16px] h-12 px-2 rounded-md w-[85%]"
      />
      <View className="mr-2" />
      {props.isPasswordVisible ? (
        <Pressable onPress={() => props.setIsPasswordVisible(false)}>
          <Eye className="mr-3 text-LightGray" />
        </Pressable>
      ) : (
        <Pressable onPress={() => props.setIsPasswordVisible(true)}>
          <EyeOff className="mr-3 text-LightGray" />
        </Pressable>
      )}
    </View>
  );
};
