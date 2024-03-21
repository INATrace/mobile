import { View, StyleSheet, Pressable, Text } from 'react-native';
import ViewSwitcher, { ViewSwitcherProps } from './ViewSwitcher';
import Mapbox from '@rnmapbox/maps';
import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { LocateFixed, MapPin, Navigation, Plus } from 'lucide-react-native';
import i18n from '@/locales/i18n';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import Colors from '@/constants/Colors';
import MarkerSvg from '../svg/MarkerSvg';
import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');

export default function MapView({ viewType, setViewType }: ViewSwitcherProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [addingNewPlot, setAddingNewPlot] = useState<boolean>(false);
  const [locationsForFeature, setLocationsForFeature] = useState<Position[]>(
    []
  );
  const [featureCollection, setFeatureCollection] =
    useState<GeoJSON.FeatureCollection>({
      type: 'FeatureCollection',
      features: [],
    });

  const cameraRef = useRef<CameraRef>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000 },
        (newLocation) => {
          setLocation(newLocation);
        }
      );

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, []);

  const addLocationToLocations = () => {
    if (location) {
      setLocationsForFeature([
        ...locationsForFeature,
        [location.coords.longitude, location.coords.latitude],
      ]);
    }
  };

  const savePlotShape = () => {
    if (locationsForFeature.length < 3) {
      return;
    }

    const newFeature: GeoJSON.Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[...locationsForFeature, locationsForFeature[0]]],
      },
    };

    console.log('newFeature', JSON.stringify(newFeature));
    setFeatureCollection({
      type: 'FeatureCollection',
      features: [...featureCollection.features, newFeature],
    });
  };

  const focusOnCurrentLocation = () => {
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: 14,
        animationDuration: 500,
      });
    }
  };

  const handlePolygonPress = (e: any) => {
    console.log('Polygon clicked', e.features);
  };

  return (
    <View className="relative flex-1">
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        {location && (
          <Mapbox.MapView className="flex-1">
            <Mapbox.Camera
              defaultSettings={{
                centerCoordinate: [
                  location.coords.longitude,
                  location.coords.latitude,
                ],
                zoomLevel: 14,
              }}
              ref={cameraRef}
            />
            <Mapbox.PointAnnotation
              id="userLocation"
              coordinate={[location.coords.longitude, location.coords.latitude]}
            >
              <View className="relative z-0 flex flex-row items-center justify-center w-5 h-5 bg-white rounded-full">
                <View className="w-4 h-4 bg-blue-500 rounded-full" />
              </View>
            </Mapbox.PointAnnotation>

            {locationsForFeature.length > 0 &&
              locationsForFeature.map((location, index) => (
                <Mapbox.PointAnnotation
                  coordinate={[location[0], location[1]]}
                  key={index.toString()}
                  id={`location-${index}`}
                >
                  <View className="relative z-10">
                    <Text className="absolute z-20 left-[8.5px] top-[3px] text-White">
                      {index + 1}
                    </Text>
                    <MarkerSvg />
                  </View>
                </Mapbox.PointAnnotation>
              ))}
            <Mapbox.ShapeSource
              id={'some-feature'}
              shape={featureCollection}
              onPress={handlePolygonPress}
            >
              <Mapbox.LineLayer
                sourceID="some-feature"
                id="some-feature-line"
                style={{
                  lineColor: Colors.green,
                  lineWidth: 1,
                }}
              />
              <Mapbox.FillLayer
                sourceID="some-feature"
                id="some-feature-fill"
                style={{
                  fillColor: Colors.green,
                  fillOpacity: 0.5,
                }}
              />
            </Mapbox.ShapeSource>
          </Mapbox.MapView>
        )}
      </View>

      {addingNewPlot ? (
        <View className="flex flex-col justify-between h-full">
          {location?.coords.accuracy && (
            <View className="flex flex-row self-start px-3 py-2 mx-5 mt-5 rounded-md bg-White">
              {location.coords.accuracy < 10 ? (
                <View className="flex flex-row items-center self-start justify-start">
                  <LocateFixed className="mr-2 text-Green" size={20} />
                  <Text className="text-Green">
                    {i18n.t('plots.addPlot.highGPSAccuracy', {
                      accuracy: Math.round(location.coords.accuracy),
                    })}
                  </Text>
                </View>
              ) : location.coords.accuracy < 30 ? (
                <View className="flex flex-row items-center justify-start">
                  <LocateFixed className="mr-2 text-Orange" size={20} />
                  <Text className="text-Orange">
                    {i18n.t('plots.addPlot.mediumGPSAccuracy', {
                      accuracy: Math.round(location.coords.accuracy),
                    })}
                  </Text>
                </View>
              ) : (
                <View className="flex flex-row items-center justify-start">
                  <LocateFixed className="mr-2 text-red-500" size={20} />
                  <Text className="text-red-500">
                    {i18n.t('plots.addPlot.lowGPSAccuracy', {
                      accuracy: Math.round(location.coords.accuracy),
                    })}
                  </Text>
                </View>
              )}
            </View>
          )}
          <View className="flex flex-col">
            <Pressable
              className="flex flex-row items-center self-end justify-center w-16 h-16 mb-5 mr-5 border border-blue-500 rounded-full bg-White"
              onPress={focusOnCurrentLocation}
            >
              <Navigation className="text-blue-500" size={30} />
            </Pressable>
            <View className="w-full p-5 bg-White rounded-t-md">
              <Pressable
                onPress={addLocationToLocations}
                className="flex flex-row items-center justify-center px-5 py-3 rounded-md bg-Green"
              >
                <MapPin className="mr-2 text-White" size={20} />
                <Text className="text-White font-semibold text-[16px]">
                  {i18n.t('plots.addPlot.addCurrentLocation')}
                </Text>
              </Pressable>
              <View className="flex flex-row items-center justify-center mt-2">
                <Pressable
                  onPress={() => setAddingNewPlot(false)}
                  className="flex flex-row items-center justify-center flex-grow px-5 py-3 mr-2 border rounded-md bg-White border-LightGray"
                >
                  <Text className="text-black/60 font-semibold text-[16px]">
                    {i18n.t('plots.addPlot.cancel')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={savePlotShape}
                  className="flex flex-row items-center justify-center flex-grow px-5 py-3 rounded-md bg-Orange"
                >
                  <Text className="text-White font-semibold text-[16px]">
                    {i18n.t('plots.addPlot.savePlotShape')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex flex-col justify-between h-full p-5">
          <ViewSwitcher viewType={viewType} setViewType={setViewType} />
          <View className="flex flex-col">
            <Pressable
              className="flex flex-row items-center self-end justify-center w-16 h-16 mb-5 border border-blue-500 rounded-full bg-White"
              onPress={focusOnCurrentLocation}
            >
              <Navigation className="text-blue-500" size={30} />
            </Pressable>
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
        </View>
      )}
    </View>
  );
}
