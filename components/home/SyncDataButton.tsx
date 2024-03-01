import { Link } from 'expo-router'
import { Pressable, View, Text } from 'react-native'
import { RefreshCw } from 'lucide-react-native'
import cn from '@/utils/cn'
import { i18n } from '@/app/_layout'

export default function SyncDataButton() {
  return (
    <Link href="/data-sync" className="mb-5" asChild>
      <Pressable>
        {({ pressed }) => (
          <View
            className={cn(
              pressed ? 'bg-Orange/80' : 'bg-Orange',
              'flex flex-row m-5 p-3 items-center justify-center rounded-md'
            )}
          >
            <RefreshCw className="text-White" />
            <View className="w-2" />
            <Text className="text-[16px] text-White font-semibold">
              {i18n.t('home.syncData')}
            </Text>
          </View>
        )}
      </Pressable>
    </Link>
  )
}
