import cn from '@/utils/cn'
import { Link } from 'expo-router'
import { ChevronLeft, User2 } from 'lucide-react-native'
import { View, Text, Pressable } from 'react-native'

export type TopbarProps = {
  title: string
  goBack?: boolean
}

export default function Topbar(props: TopbarProps) {
  return (
    <View className="flex flex-row items-center justify-between p-5">
      <View className="flex flex-row items-center">
        {props.goBack && (
          <>
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <ChevronLeft size={24} color={pressed ? 'blue' : 'black'} />
                )}
              </Pressable>
            </Link>
            <View className="w-4" />
          </>
        )}

        <Text className="font-bold text-[22px]">{props.title}</Text>
      </View>

      <Link href="/user-settings" asChild>
        <Pressable>
          {({ pressed }) => (
            <View
              className={cn(
                pressed ? 'bg-orange/80' : 'bg-orange',
                'rounded-full p-[6px]'
              )}
            >
              <User2 size={14} color={'white'} />
            </View>
          )}
        </Pressable>
      </Link>
    </View>
  )
}
