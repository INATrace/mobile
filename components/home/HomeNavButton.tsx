import { Href, Link } from 'expo-router'
import { FC } from 'react'
import { Pressable, View, Text } from 'react-native'

import { IconProps } from '@/types/svg'
import cn from '@/utils/cn'

type HomeNavButtonProps = {
  title: string
  icon: FC<IconProps>
  link: string
}

export default function HomeNavButton(props: HomeNavButtonProps) {
  return (
    <Link href={props.link as Href<string>} asChild>
      <Pressable>
        {({ pressed }) => (
          <View
            className={cn(
              pressed ? 'bg-green' : 'bg-green/80',
              'flex flex-row gap-5'
            )}
          >
            <props.icon />
            <Text>{props.title}</Text>
          </View>
        )}
      </Pressable>
    </Link>
  )
}
