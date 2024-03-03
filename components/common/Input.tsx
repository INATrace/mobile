import Colors from '@/constants/Colors';
import { Pressable, TextInput, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

type InputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
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
      className="border border-LightGray w-full h-12 mt-1 px-2 text-[16px] rounded-md"
      placeholderTextColor={Colors.darkGray}
    />
  );
};

export const InputPassword = (props: InputPasswordProps) => {
  return (
    <View className="border border-LightGray w-full h-12 mt-1 px-2 text-[16px] rounded-md">
      <TextInput
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        secureTextEntry={!props.isPasswordVisible}
        placeholderTextColor={Colors.darkGray}
      />
      {props.isPasswordVisible ? (
        <Pressable onPress={() => props.setIsPasswordVisible(false)}>
          <Eye className="absolute right-3 top-3" />
        </Pressable>
      ) : (
        <Pressable onPress={() => props.setIsPasswordVisible(true)}>
          <EyeOff className="absolute right-3 top-3" />
        </Pressable>
      )}
    </View>
  );
};
