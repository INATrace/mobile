import NetInfo from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'
import { View, Text } from 'react-native'

export default function Connection() {
  const [connectionType, setConnectionType] = useState('none')
  const [isConnected, setIsConnected] = useState(false)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnectionType(state.type)
      setIsConnected(state.isConnected || false)
    })

    return () => {
      unsubscribe()
    }
  }, [])
  return (
    <View>
      <Text>Connection type: {connectionType}</Text>
      <Text>Is connected: {isConnected ? 'yes' : 'no'}</Text>
    </View>
  )
}
