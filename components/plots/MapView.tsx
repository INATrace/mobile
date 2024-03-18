import { View, StyleSheet } from 'react-native';
import ViewSwitcher, { ViewSwitcherProps } from './ViewSwitcher';
import Mapbox from '@rnmapbox/maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');

export default function MapView({ viewType, setViewType }: ViewSwitcherProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  return (
    <View className="relative flex-1">
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        <Mapbox.MapView className="flex-1">
          {location && (
            <Mapbox.PointAnnotation
              id="userLocation"
              coordinate={[location.coords.longitude, location.coords.latitude]}
            >
              <View className="flex flex-row items-center justify-center w-20 h-20 rounded-md">
                <View className="w-20 h-20 rounded-md bg-Orange" />
              </View>
            </Mapbox.PointAnnotation>
          )}
        </Mapbox.MapView>
      </View>

      <ViewSwitcher viewType={viewType} setViewType={setViewType} />
    </View>
  );
}
