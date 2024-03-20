import { View, StyleSheet, Pressable, Text } from 'react-native';
import ViewSwitcher, { ViewSwitcherProps } from './ViewSwitcher';
import Mapbox from '@rnmapbox/maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { MapPin, Plus } from 'lucide-react-native';
import i18n from '@/locales/i18n';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import Colors from '@/constants/Colors';
import uuid from 'react-native-uuid';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');

// random generated geojson feature
const GeoJson: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-18.984375, 35.460669951495305],
            [-11.953125, -41.50857729743933],
            [66.4453125, -38.272688535980954],
            [101.25, 18.646245142670608],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-15.984375, 35.460669951495305],
            [-11.953125, -41.50857729743933],
            [36.4453125, -38.272688535980954],
            [101.25, 18.646245142670608],
          ],
        ],
      },
    },
  ],
};

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

      // Clean up subscription when component unmounts
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
    console.log('locationsForFeature', locationsForFeature);

    const newFeature: GeoJSON.Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [locationsForFeature],
      },
    };

    console.log('newFeature', JSON.stringify(newFeature));
    setFeatureCollection({
      type: 'FeatureCollection',
      features: [...featureCollection.features, newFeature],
    });

    //setFeatureCollection(GeoJson);
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
            />

            {locationsForFeature.length > 0 &&
              locationsForFeature.map((location, index) => (
                <Mapbox.PointAnnotation
                  key={index.toString()}
                  id={`location-${index}`}
                  coordinate={[location[0], location[1]]}
                >
                  <View className="w-3 h-3 rounded-full bg-Green" />
                </Mapbox.PointAnnotation>
              ))}
            <Mapbox.ShapeSource id={'some-feature'} shape={featureCollection}>
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

            <Mapbox.PointAnnotation
              id="userLocation"
              coordinate={[location.coords.longitude, location.coords.latitude]}
            >
              <View className="flex flex-row items-center justify-center w-5 h-5 rounded-full bg-blue-500/70">
                <View className="w-3 h-3 bg-blue-500 rounded-full" />
              </View>
            </Mapbox.PointAnnotation>
            {/* <Mapbox.ShapeSource id={'some-feature'} shape={GeoJson}>
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
            </Mapbox.ShapeSource> */}
          </Mapbox.MapView>
        )}
      </View>
      {addingNewPlot ? (
        <View className="flex flex-col justify-between h-full p-5">
          <View></View>
          <View className="w-full p-5 bg-White rounded-t-md">
            <Pressable onPress={addLocationToLocations} className="bg-Green">
              <MapPin className="text-White" size={20} />
              <Text className="text-White font-semibold text-[16px]">
                {i18n.t('plots.addPlot.addCurrentLocation')}
              </Text>
            </Pressable>
            <View className="flex flex-row items-center justify-center">
              <Pressable
                onPress={() => setAddingNewPlot(false)}
                className="flex flex-row items-center justify-center border rounded-md bg-White border-LightGray"
              >
                <Text className="text-DarkGray font-semibold text-[16px]">
                  {i18n.t('plots.addPlot.cancel')}
                </Text>
              </Pressable>
              <Pressable
                onPress={savePlotShape}
                className="rounded-md bg-Orange"
              >
                <Text className="text-White font-semibold text-[16px]">
                  {i18n.t('plots.addPlot.savePlotShape')}
                </Text>
              </Pressable>
            </View>
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
