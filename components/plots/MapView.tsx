import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ViewSwitcher, { ViewSwitcherProps } from './ViewSwitcher';
import Mapbox from '@rnmapbox/maps';
import { useContext, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import * as Crypto from 'expo-crypto';
import * as Haptics from 'expo-haptics';
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
import { router, useNavigation, useSegments } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { uuid } from 'expo-modules-core';
import { FeatureInfo, Plot } from '@/types/plot';
import area from '@turf/area';
import realm from '@/realm/useRealm';
import { PlotSchema } from '@/realm/schemas';
import { Farmer, ProductTypeWithCompanyId } from '@/types/farmer';
import { User } from '@/types/user';
import Card, { CardProps } from '../common/Card';
import { S2CellId, S2LatLng } from 'nodes2ts';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');

export default function MapView({
  viewType,
  setViewType,
  type,
}: ViewSwitcherProps) {
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
  const {
    newPlot,
    setNewPlot,
    selectedFarmer,
    user,
    selectedCompany,
    productTypes,
  } = useContext(AuthContext) as {
    newPlot: Plot | null;
    selectedCompany: number;
    setNewPlot: (plot: Plot) => void;
    selectedFarmer: Farmer;
    user: User;
    productTypes: ProductTypeWithCompanyId[];
  };
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [cardInfoCollection, setCardInfoCollection] = useState<any[]>([]);
  const [cardInfo, setCardInfo] = useState<CardProps | null>(null);

  const navigation = useNavigation();

  const segments = useSegments();

  useEffect(() => {
    if (type === 'new') {
      setAddingNewPlot(true);
    }
  }, [type]);

  useEffect(() => {
    navigation.setOptions({
      title: addingNewPlot
        ? i18n.t('plots.addPlot.newPlot')
        : i18n.t('plots.title'),
    });

    const handleBeforeRemove = (e: any) => {
      e.preventDefault();
      Alert.alert(
        i18n.t('plots.addPlot.discardChangesTitle'),
        i18n.t('plots.addPlot.discardChangesMessage'),
        [
          {
            text: i18n.t('plots.addPlot.cancel'),
            style: 'cancel',
          },
          {
            text: i18n.t('plots.addPlot.discardChangesButton'),
            onPress: () => {
              setAddingNewPlot(false);
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    };

    if (addingNewPlot) {
      navigation.addListener('beforeRemove', handleBeforeRemove);
    } else {
      navigation.removeListener('beforeRemove', handleBeforeRemove);
    }

    return () => {
      navigation.removeListener('beforeRemove', handleBeforeRemove);
    };
  }, [addingNewPlot]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000 },
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

  useEffect(() => {
    if (selectedFarmer) {
      loadExistingPlots();
    }
  }, [selectedFarmer]);

  const loadExistingPlots = async () => {
    try {
      const offlinePlots = await realm.realmRead(
        PlotSchema,
        undefined,
        undefined,
        undefined,
        undefined,
        `farmerId == '${selectedFarmer?.id}' AND userId == '${user.id}'`
      );

      let features: GeoJSON.Feature[] = [];
      let cardInfos = [];

      if (offlinePlots && offlinePlots.length !== 0) {
        for (let plot of offlinePlots) {
          const plotData = JSON.parse(plot.data as any) as Plot;

          const products = productTypes?.find(
            (product: ProductTypeWithCompanyId) => {
              return product.companyId === selectedCompany;
            }
          );
          const crop = products?.productTypes.find(
            (product) => product.id.toString() === plotData.crop
          );

          features.push(plotData.featureInfo);
          cardInfos.push({
            id: plotData.featureInfo.id,
            plotName: plotData.plotName,
            crop: crop,
            numberOfPlants: plotData.numberOfPlants,
            size: plotData.size,
            geoId: plotData.geoId,
            certification: plotData.certification,
            organicStartOfTransition: plotData.organicStartOfTransition,
            synced: false,
          });
        }
      }

      if (selectedFarmer.plots && selectedFarmer.plots.length > 0) {
        for (let plot of selectedFarmer.plots as any) {
          const featureInfo = {
            type: 'Feature',
            properties: {},
            id: plot.id,
            geometry: {
              type: 'Polygon',
              coordinates: [
                plot?.coordinates.map((c: any) => [c.longitude, c.latitude]),
              ],
            },
          };

          features.push(featureInfo as any);
          cardInfos.push({
            id: plot.id,
            plotName: plot.plotName,
            crop: plot.crop,
            numberOfPlants: plot.numberOfPlants,
            size: plot.size + ' ' + plot.unit,
            geoId: plot.geoId,
            certification: plot.certification,
            organicStartOfTransition: plot.organicStartOfTransition,
            synced: true,
          });
        }
      }

      setCardInfoCollection(cardInfos);

      setFeatureCollection({
        type: 'FeatureCollection',
        features,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addLocationToLocations = () => {
    if (location) {
      if (!location?.coords?.accuracy || location?.coords?.accuracy > 10) {
        Alert.alert(
          i18n.t('plots.addPlot.GPSAccuracyTitle'),
          i18n.t('plots.addPlot.GPSAccuracyMessage'),
          [{ text: i18n.t('plots.addPlot.ok') }]
        );
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

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
  }, [locationsForFeature, segments]);

  const addPointToFeature = () => {
    if (locationsForFeature.length < 3) {
      const filteredFeatures = featureCollection.features.filter(
        (f: GeoJSON.Feature) =>
          f.id !== 'NewFeature' && f.id !== newPlot?.featureInfo.id
      ) as GeoJSON.Feature[];

      setFeatureCollection({
        type: 'FeatureCollection',
        features: filteredFeatures,
      });
      return;
    }

    let feature = featureCollection.features.find((f: GeoJSON.Feature) => {
      return f.id === 'NewFeature';
    }) as GeoJSON.Feature;

    if (!feature) {
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

    (feature.geometry as GeoJSON.Polygon).coordinates = [
      [...locationsForFeature, locationsForFeature[0]],
    ];

    const filteredFeatures = featureCollection.features.filter(
      (f: GeoJSON.Feature) =>
        f.id !== 'NewFeature' && f.id !== newPlot?.featureInfo.id
    ) as GeoJSON.Feature[];

    setFeatureCollection({
      type: 'FeatureCollection',
      features: [...filteredFeatures, feature],
    });
  };

  const savePlotShape = async () => {
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

    const s2CellIdentifiers = featureInfo.geometry.coordinates[0].map(
      (vertex) =>
        S2CellId.fromPoint(S2LatLng.fromDegrees(vertex[1], vertex[0]).toPoint())
    );

    const concatenatedPos = s2CellIdentifiers
      .slice(0, -1)
      .map((id) => {
        const match = id.toString().match(/pos=([a-f0-9]+)/);
        return match ? match[1] : '';
      })
      .join('_');

    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      concatenatedPos
    );

    featureInfo.id = uuid.v4();

    setNewPlot({
      id: uuid.v4(),
      plotName: '',
      crop: '',
      numberOfPlants: 0,
      size: (area(featureInfo.geometry) / 100).toFixed(2) + ' ha',
      geoId: hash,
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
        zoomLevel: 16,
        animationDuration: 500,
      });
    }
  };

  const handlePolygonPress = (e: any) => {
    const cardInfoId = e.features[0].id;
    const plot = cardInfoCollection.find((c) => c.id.toString() === cardInfoId);

    const products = productTypes?.find((product: ProductTypeWithCompanyId) => {
      return product.companyId === selectedCompany;
    });
    const crop = products?.productTypes.find(
      (product) => product.id === plot.crop.id
    );

    if (!plot) {
      return;
    }

    setCardInfo({
      canClose: true,
      onClose: () => setCardInfo(null),
      items: [
        {
          type: 'view',
          name: i18n.t('plots.addPlot.crop'),
          value: crop?.name,
          editable: false,
        },
        {
          type: 'view',
          name: i18n.t('plots.addPlot.numberOfPlants'),
          value: plot.numberOfPlants,
          editable: false,
        },
        {
          type: 'view',
          name: i18n.t('plots.addPlot.size'),
          value: plot.size,
          editable: false,
        },
        {
          type: 'view',
          name: i18n.t('plots.addPlot.geoId'),
          value: plot.geoId,
          editable: false,
        },
        {
          type: 'view',
          name: i18n.t('plots.addPlot.certification'),
          value: plot.certification,
          editable: false,
        },
        {
          type: 'view',
          name: i18n.t('plots.addPlot.organicStartOfTransition'),
          value: plot.organicStartOfTransition
            ? Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
              }).format(new Date(plot.organicStartOfTransition))
            : '',
          editable: false,
        },
      ],
      title: plot.plotName,
      synced: plot.synced,
    });
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

    const filteredFeatures = featureCollection.features.filter(
      (f: GeoJSON.Feature) =>
        f.id !== 'NewFeature' && f.id !== newPlot?.featureInfo.id
    ) as GeoJSON.Feature[];

    setFeatureCollection({
      type: 'FeatureCollection',
      features: [...filteredFeatures],
    });
  };

  return (
    <View className="relative flex-1">
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        {isMapLoading && (
          <View className="absolute flex flex-col items-center justify-center w-full h-full bg-White">
            <ActivityIndicator size="large" animating={isMapLoading} />
            <Text className="mt-2">{i18n.t('plots.mapLoading')}</Text>
          </View>
        )}
        {location && (
          <Mapbox.MapView
            className="flex-1"
            onDidFinishLoadingMap={() => setIsMapLoading(false)}
            styleURL={Mapbox.StyleURL.SatelliteStreet}
          >
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
              coordinate={[location.coords.longitude, location.coords.latitude]}
              id="current-location"
            >
              <View className="relative flex flex-row items-center justify-center w-5 h-5 bg-white rounded-full">
                <View className="w-4 h-4 bg-blue-500 rounded-full" />
              </View>
            </Mapbox.PointAnnotation>

            {locationsForFeature.length > 0 &&
              locationsForFeature.map((location, index) => (
                <Mapbox.MarkerView
                  coordinate={[location[0], location[1]]}
                  key={index}
                  id={`location-${index}`}
                >
                  <View className="relative z-10 mb-3">
                    <Text className="absolute z-20 left-[8.5px] top-[3px] text-White">
                      {index + 1}
                    </Text>
                    <MarkerSvg />
                  </View>
                </Mapbox.MarkerView>
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
          <View className="absolute bottom-0 flex flex-col w-full">
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
          {type === 'new' ? (
            <View />
          ) : (
            <ViewSwitcher viewType={viewType} setViewType={setViewType} />
          )}
          <View className="flex flex-col">
            {cardInfo && <Card {...cardInfo} />}
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
              onPress={() => {
                setAddingNewPlot(true);
                setCardInfo(null);
              }}
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
