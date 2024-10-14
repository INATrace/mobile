import { AuthContext } from '@/context/AuthContext';
import cn from '@/utils/cn';
import { Link } from 'expo-router';
import { ChevronLeft, Info, User2 } from 'lucide-react-native';
import { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';

export type TopbarProps = {
  title: string;
  goBack?: boolean;
};

export default function Topbar(props: TopbarProps) {
  const { setDocumentationModal } = useContext(AuthContext);

  return (
    <>
      <View className="flex flex-row items-center justify-between p-5">
        <View className="flex flex-row items-center">
          {props.goBack && (
            <>
              <Link href="/" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <ChevronLeft
                      size={24}
                      className={cn(pressed ? 'text-black/80' : 'text-black')}
                    />
                  )}
                </Pressable>
              </Link>
              <View className="w-4" />
            </>
          )}

          <Text className="font-bold text-[22px]">{props.title}</Text>
        </View>

        <View className="flex flex-row items-center space-x-3">
          <Pressable onPress={() => setDocumentationModal(true)}>
            <Info size={28} className="text-black" />
          </Pressable>
          <Link href="/user-settings" asChild>
            <Pressable>
              {({ pressed }) => (
                <View
                  className={cn(
                    pressed ? 'bg-Orange/80' : 'bg-Orange',
                    'rounded-full p-[6px]'
                  )}
                >
                  <User2 size={14} className="text-White" />
                </View>
              )}
            </Pressable>
          </Link>
        </View>
      </View>
    </>
  );
}
