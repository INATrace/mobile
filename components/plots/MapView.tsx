import { View, StyleSheet, Pressable, Text, Alert } from 'react-native';
import ViewSwitcher, { ViewSwitcherProps } from './ViewSwitcher';
import Mapbox from '@rnmapbox/maps';
import { useContext, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import {
  LocateFixed,
  MapPin,
  Navigation,
  Plus,
  Redo2,
  Undo2,
} from 'lucide-react-native';
import i18n from '@/locales/i18n';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import Colors from '@/constants/Colors';
import MarkerSvg from '../svg/MarkerSvg';
import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import cn from '@/utils/cn';
import { router } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { uuid } from 'expo-modules-core';
import { FeatureInfo } from '@/types/plot';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');

export default function MapView({ viewType, setViewType }: ViewSwitcherProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [addingNewPlot, setAddingNewPlot] = useState<boolean>(false);
  const [locationsForFeature, setLocationsForFeature] = useState<Position[]>(
    []
  );
  const [locationsForFeatureCache, setLocationsForFeatureCache] = useState<
    Position[]
  >([]);
  const [featureCollection, setFeatureCollection] =
    useState<GeoJSON.FeatureCollection>({
      type: 'FeatureCollection',
      features: [],
    });

  const cameraRef = useRef<CameraRef>(null);
  const { setNewPlot } = useContext(AuthContext);

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
      setLocationsForFeatureCache([]);
      setLocationsForFeature([
        ...locationsForFeature,
        [location.coords.longitude, location.coords.latitude],
      ]);
    }
  };

  useEffect(() => {
    if (locationsForFeature.length > 0) {
      addPointToFeature();
    }
  }, [locationsForFeature]);

  const addPointToFeature = () => {
    if (locationsForFeature.length < 3) {
      const filteredFeatures = featureCollection.features.filter(
        (f: GeoJSON.Feature) => f.id !== 'NewFeature'
      ) as GeoJSON.Feature[];

      setFeatureCollection({
        type: 'FeatureCollection',
        features: filteredFeatures,
      });
      return;
    }

    let feature: GeoJSON.Feature;
    if (featureCollection.features.length === 0) {
      feature = {
        type: 'Feature',
        properties: {},
        id: 'NewFeature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...locationsForFeature, locationsForFeature[0]]],
        },
      };
      setFeatureCollection({
        type: 'FeatureCollection',
        features: [...featureCollection.features, feature],
      });
      return;
    }
    feature = featureCollection.features.find((f: GeoJSON.Feature) => {
      return f.id === 'NewFeature';
    }) as GeoJSON.Feature;

    if (!feature) {
      return;
    }

    (feature.geometry as GeoJSON.Polygon).coordinates = [
      [...locationsForFeature, locationsForFeature[0]],
    ];

    const filteredFeatures = featureCollection.features.filter(
      (f: GeoJSON.Feature) => f.id !== 'NewFeature'
    ) as GeoJSON.Feature[];

    setFeatureCollection({
      type: 'FeatureCollection',
      features: [...filteredFeatures, feature],
    });
  };

  const savePlotShape = () => {
    if (locationsForFeature.length < 3) {
      Alert.alert(
        i18n.t('plots.addPlot.notEnoughPointsTitle'),
        i18n.t('plots.addPlot.notEnoughPointsMessage')
      );
      return;
    }

    let featureInfo = featureCollection.features.find(
      (f: GeoJSON.Feature) => f.id === 'NewFeature'
    ) as FeatureInfo;

    if (!featureInfo || featureInfo.id !== 'NewFeature') {
      return;
    }

    featureInfo.id = uuid.v4();

    setNewPlot({
      id: uuid.v4(),
      plotName: '',
      crop: '',
      numberOfPlants: 0,
      size: '',
      geoId: 'XXXXXXXXXXXX',
      certification: '',
      organicStartOfTransition: '',
      featureInfo,
    });

    router.push('/(app)/(farmers)/view/add-plot');
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

  const undo = () => {
    if (locationsForFeature.length > 0) {
      const lastLocation = locationsForFeature[locationsForFeature.length - 1];
      setLocationsForFeature(locationsForFeature.slice(0, -1));
      setLocationsForFeatureCache([...locationsForFeatureCache, lastLocation]);
    }
  };

  const redo = () => {
    if (locationsForFeatureCache.length > 0) {
      const lastLocation =
        locationsForFeatureCache[locationsForFeatureCache.length - 1];
      setLocationsForFeatureCache(locationsForFeatureCache.slice(0, -1));
      setLocationsForFeature([...locationsForFeature, lastLocation]);
    }
  };

  const cancelNewPlot = () => {
    setAddingNewPlot(false);
    setLocationsForFeature([]);
    setLocationsForFeatureCache([]);
    setFeatureCollection({
      type: 'FeatureCollection',
      features: [],
    });
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
            <View
              className="flex flex-row self-start px-3 py-2 mx-5 mt-5 rounded-md bg-White"
              style={style.shadowMedium}
            >
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
            <View className="flex flex-row items-center justify-between mx-5">
              <View className="flex flex-row items-center">
                {/* Undo */}
                <Pressable
                  className="flex flex-row items-center justify-center px-3 py-2 mr-2 rounded-md bg-White"
                  style={style.shadowMedium}
                  disabled={locationsForFeature.length === 0}
                  onPress={undo}
                >
                  <Undo2
                    className={cn(
                      'mr-2',
                      locationsForFeature.length === 0
                        ? 'text-DarkGray'
                        : 'text-black'
                    )}
                    size={20}
                  />
                  <Text
                    className={cn(
                      'font-semibold text-[16px]',
                      locationsForFeature.length === 0
                        ? 'text-DarkGray'
                        : 'text-black'
                    )}
                  >
                    {i18n.t('plots.addPlot.undo')}
                  </Text>
                </Pressable>
                {/* Redo */}
                <Pressable
                  className="flex flex-row items-center justify-center px-3 py-2 rounded-md bg-White"
                  style={style.shadowMedium}
                  disabled={locationsForFeatureCache.length === 0}
                  onPress={redo}
                >
                  <Text
                    className={cn(
                      'font-semibold text-[16px]',
                      locationsForFeatureCache.length === 0
                        ? 'text-DarkGray'
                        : 'text-black'
                    )}
                  >
                    {i18n.t('plots.addPlot.redo')}
                  </Text>
                  <Redo2
                    className={cn(
                      'ml-2',
                      locationsForFeatureCache.length === 0
                        ? 'text-DarkGray'
                        : 'text-black'
                    )}
                    size={20}
                  />
                </Pressable>
              </View>
              {/* Location button */}
              <Pressable
                className="flex flex-row items-center self-end justify-center w-16 h-16 mb-5 border-2 border-blue-500 rounded-full bg-White"
                onPress={focusOnCurrentLocation}
                style={style.shadowMedium}
              >
                <Navigation className="text-blue-500" size={30} />
              </Pressable>
            </View>
            <View className="w-full p-5 bg-White rounded-t-md">
              {/* Add location button */}
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
                  onPress={cancelNewPlot}
                  className="flex flex-row items-center justify-center flex-grow px-5 py-3 mr-2 border rounded-md bg-White border-LightGray"
                >
                  <Text className="text-black/60 font-semibold text-[16px]">
                    {i18n.t('plots.addPlot.cancel')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={savePlotShape}
                  className={cn(
                    'flex flex-row items-center justify-center flex-grow px-5 py-3 rounded-md bg-Orange',
                    featureCollection.features.find(
                      (f: GeoJSON.Feature) => f.id === 'NewFeature'
                    ) === undefined
                      ? 'opacity-50'
                      : ''
                  )}
                  disabled={
                    featureCollection.features.find(
                      (f: GeoJSON.Feature) => f.id === 'NewFeature'
                    ) === undefined
                  }
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
            {/* Location button */}
            <Pressable
              className="flex flex-row items-center self-end justify-center w-16 h-16 mb-5 border-2 border-blue-500 rounded-full bg-White"
              onPress={focusOnCurrentLocation}
              style={style.shadowMedium}
            >
              <Navigation className="text-blue-500" size={30} />
            </Pressable>
            {/* New plot button */}
            <Pressable
              onPress={() => setAddingNewPlot(true)}
              className="flex flex-row items-center justify-center w-full h-12 px-5 mb-10 rounded-md bg-Orange"
              style={style.shadowLarge}
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

const style = StyleSheet.create({
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    elevation: 8,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
});
