import { TextInput } from "react-native";

type InputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function Input(props: InputProps) {
  return (
    <TextInput
      placeholder={props.placeholder}
      value={props.value}
      onChangeText={props.onChangeText}
    />
  );
}
