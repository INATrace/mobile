import { View, StyleSheet, Pressable, Text } from 'react-native';
import ViewSwitcher, { ViewSwitcherProps } from './ViewSwitcher';
import Mapbox from '@rnmapbox/maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { MapPin, Plus } from 'lucide-react-native';
import i18n from '@/locales/i18n';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');

export default function MapView({ viewType, setViewType }: ViewSwitcherProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [addingNewPlot, setAddingNewPlot] = useState<boolean>(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState<number[][]>([]);

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

  const addLocationToPolygon = () => {
    if (location) {
      setPolygonCoordinates([
        ...polygonCoordinates,
        [location.coords.longitude, location.coords.latitude],
      ]);
    }
  };

  return (
    <View className="relative flex-1">
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        {location && (
          <Mapbox.MapView className="flex-1">
            <Mapbox.Camera
              zoomLevel={16}
              centerCoordinate={[
                location.coords.longitude,
                location.coords.latitude,
              ]}
            />

            <Mapbox.PointAnnotation
              id="userLocation"
              coordinate={[location.coords.longitude, location.coords.latitude]}
            >
              <View className="flex flex-row items-center justify-center w-5 h-5 rounded-full bg-blue-500/70">
                <View className="w-3 h-3 bg-blue-500 rounded-full" />
              </View>
            </Mapbox.PointAnnotation>

            <Mapbox.ShapeSource
              id="polygonSource"
              shape={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [polygonCoordinates],
                },
              }}
            >
              <Mapbox.FillLayer
                id="polygonFill"
                style={{
                  fillColor: 'blue',
                  fillOpacity: 0.5,
                  fillOutlineColor: 'black',
                }}
              />
            </Mapbox.ShapeSource>
          </Mapbox.MapView>
        )}
      </View>
      {addingNewPlot ? (
        <View className="flex flex-col justify-between h-full p-5">
          <View></View>
          <View className="w-full p-5 bg-White rounded-t-md">
            <Pressable onPress={() => {}}>
              <MapPin className="text-White" size={20} />
              <Text className="text-White font-semibold text-[16px]">
                {i18n.t('plots.addPlot.addCurrentLocation')}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View className="flex flex-col justify-between h-full p-5">
          <ViewSwitcher viewType={viewType} setViewType={setViewType} />
          <Pressable
            onPress={() => setAddingNewPlot(true)}
            className="flex flex-row items-center justify-center w-full h-12 px-5 mb-10 rounded-md bg-Orange"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.45,
              shadowRadius: 3.84,
              elevation: 8,
            }}
          >
            <Plus className="mr-2 text-White" size={20} />
            <Text className="text-White font-semibold text-[16px]">
              {i18n.t('plots.addPlot.newPlot')}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
