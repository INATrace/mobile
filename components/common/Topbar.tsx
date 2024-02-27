import { Link } from "expo-router";
import { ChevronLeft, User2 } from "lucide-react-native";
import { View, Text, Pressable } from "react-native";

type TopbarProps = {
  title: string;
  goBack?: boolean;
};

export default function Topbar(props: TopbarProps) {
  return (
    <View>
      {props.goBack && (
        <Link href="/" asChild>
          <Pressable>
            {({ pressed }) => (
              <ChevronLeft size={24} color={pressed ? "blue" : "black"} />
            )}
          </Pressable>
        </Link>
      )}
      <Text>{props.title}</Text>
      <Link href="/user-settings" asChild>
        <Pressable>
          {({ pressed }) => (
            <User2 size={24} color={pressed ? "blue" : "black"} />
          )}
        </Pressable>
      </Link>
    </View>
  );
}
