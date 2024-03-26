import { useNavigation } from 'expo-router';
import { Check, ChevronLeft, Download, Trash, X } from 'lucide-react-native';
import { createRef, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import i18n from '@/locales/i18n';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import * as turf from '@turf/turf';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { Input } from '@/components/common/Input';
import Modal from 'react-native-modalbox';

type OfflinePack = {
  name: string;
  state: string;
  percentage: number;
  completedResourceSize: number;
  expires: string;
};

export default function MapDownload() {
  const navigation = useNavigation();

  const [location, setLocation] = useState<LocationObject | null>(null);

  const [offlinePacks, setOfflinePacks] = useState<OfflinePack[]>([]);
  const [bounds, setBounds] = useState<any | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<number>(0);
  const [selectingMap, setSelectingMap] = useState<boolean>(false);
  const [downloadConfirm, setDownloadConfirm] = useState<boolean>(false);
  const [packName, setPackName] = useState<string>('');
  const [hasInputError, setHasInputError] = useState<boolean>(false);

  const mapRef = createRef<Mapbox.MapView>();

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t('plots.mapDownload'),
      headerLeft: () => (
        <Pressable
          onPress={() =>
            selectingMap ? setSelectingMap(false) : navigation.goBack()
          }
          className="flex flex-row items-center justify-center mr-3"
        >
          <ChevronLeft className="text-Orange" />
          <Text className="font-medium text-Orange text-[18px]">Back</Text>
        </Pressable>
      ),
    });
  }, [selectingMap]);

  useEffect(() => {
    checkForOfflineMaps();
    askForLocationPermission();
  }, []);

  const checkForOfflineMaps = async () => {
    try {
      const packs = await Mapbox.offlineManager.getPacks();
      let completeCount = 0;
      const displayPacks = packs.map((pack: any) => {
        if (pack.pack.state === 'complete') {
          completeCount++;
        }

        return {
          name: pack.name,
          state: pack.pack?.state ?? 'unknown',
          percentage: pack.pack?.percentage ?? 0,
          completedResourceSize: pack.pack?.completedResourceSize ?? 0,
          expires: pack.pack?.expires ?? 'unknown',
        };
      });

      setOfflinePacks(displayPacks);

      if (completeCount === packs.length) {
        return;
      }

      setTimeout(() => {
        checkForOfflineMaps();
      }, 1000);
    } catch (error) {
      console.error('Error fetching offline packs:', error);
    }
  };

  const askForLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        i18n.t('plots.offlineMapsScreen.locationPermissionDeniedAlert')
      );
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
  };

  const onRegionDidChange = async () => {
    if (mapRef.current) {
      const visibleBounds = await mapRef.current.getVisibleBounds();
      const zoomLevel = await mapRef.current.getZoom();
      console.log('Visible bounds:', visibleBounds);
      console.log('Zoom level:', zoomLevel);
      setBounds(visibleBounds);
      estimateOfflinePackSize(zoomLevel, visibleBounds);
    }
  };

  function deg2num(latLon: Position, zoom: number): [number, number] {
    const latRad = (latLon[0] * Math.PI) / 180;
    const n = Math.pow(2, zoom);
    const xTile = Math.floor(((latLon[1] + 180) / 360) * n);
    const yTile = Math.floor(
      ((1 -
        Math.abs(Math.log(Math.abs(Math.tan(latRad) + 1 / Math.cos(latRad)))) /
          Math.PI) /
        2) *
        n
    );
    return [xTile, yTile];
  }

  function getTotalTileCount(
    leftBottom: Position,
    rightTop: Position,
    fromZoom: number,
    toZoom: number
  ): number {
    let totalTileCount = 0;
    for (let zoom = fromZoom; zoom <= toZoom; zoom++) {
      const leftBottomTiles = deg2num(leftBottom, zoom);
      const rightTopTiles = deg2num(rightTop, zoom);

      const currentTileCount =
        (rightTopTiles[0] - leftBottomTiles[0] + 1) *
        (leftBottomTiles[1] - rightTopTiles[1] + 1);

      totalTileCount += currentTileCount;
    }

    return totalTileCount;
  }

  const estimateOfflinePackSize = (
    zoomLevel: number,
    bounds: [Position, Position]
  ) => {
    const sw: Position = bounds[0];
    const ne: Position = bounds[1];

    const leftBottom: Position = [sw[0], sw[1]];
    const rightTop: Position = [ne[0], ne[1]];

    const totalTiles = getTotalTileCount(leftBottom, rightTop, zoomLevel, 20);
    console.log('Total estimated tiles:', totalTiles);

    const estimatedSizeMB = (totalTiles * 32.5) / 1024;

    console.log('Estimated size:', estimatedSizeMB.toFixed(2));

    setEstimatedSize(parseFloat(estimatedSizeMB.toFixed(2)));
  };

  const onDownloadArea = async () => {
    if (!packName) {
      setHasInputError(true);
      return;
    }

    if (!bounds) {
      Alert.alert(
        i18n.t('plots.offlineMapsScreen.noAreaSelected'),
        i18n.t('plots.offlineMapsScreen.noAreaSelectedMessage')
      );
      return;
    }

    const metadata = { name: packName, date: new Date().toISOString() };

    setDownloadConfirm(false);

    try {
      await Mapbox.offlineManager.createPack(
        {
          name: packName,
          styleURL: Mapbox.StyleURL.Street,
          bounds: [
            [bounds[0][0], bounds[0][1]],
            [bounds[1][0], bounds[1][1]],
          ],
          minZoom: 14,
          maxZoom: 20,
          metadata,
        },
        (progress: any) => {
          checkForOfflineMaps();
        }
      );

      setSelectingMap(false);
    } catch (error) {
      console.error('Error starting offline pack download:', error);
      Alert.alert(
        i18n.t('plots.offlineMapsScreen.errorDownloadingTitle'),
        i18n.t('plots.offlineMapsScreen.errorDownloading')
      );
    }
  };

  const deleteOfflinePack = async (packName: string) => {
    try {
      await Mapbox.offlineManager.deletePack(packName);
      checkForOfflineMaps();
    } catch (error) {
      console.error('Error deleting offline pack:', error);
      Alert.alert(
        i18n.t('plots.offlineMapsScreen.errorTitle'),
        i18n.t('plots.offlineMapsScreen.errorDeleting')
      );
    }
  };

  const deletePack = async (packName: string) => {
    Alert.alert(
      i18n.t('plots.offlineMapsScreen.delete'),
      i18n.t('plots.offlineMapsScreen.deleteAlert'),
      [
        {
          text: i18n.t('plots.offlineMapsScreen.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('plots.offlineMapsScreen.delete'),
          onPress: () => deleteOfflinePack(packName),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView className="h-full bg-White" behavior="padding">
      <Modal
        isOpen={downloadConfirm}
        onClosed={() => setDownloadConfirm(false)}
        position={'center'}
        backdropPressToClose={true}
        style={{
          height: 200,
          width: '90%',
          marginRight: 250,
          borderRadius: 8,
          padding: 20,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <View className="flex flex-row items-center justify-between mb-2">
            <Text className="text-[18px] font-medium">
              {i18n.t('plots.mapTitle')}
            </Text>
            <Pressable onPress={() => setDownloadConfirm(false)} className="">
              <X size={20} className="text-black" />
            </Pressable>
          </View>

          <Input
            value={packName}
            onChangeText={(text: string) => {
              setHasInputError(false);
              setPackName(text);
            }}
            placeholder={i18n.t('input.type')}
            error={hasInputError}
          />
        </View>

        <View className="flex flex-row items-center justify-between">
          <Pressable
            onPress={() => setDownloadConfirm(false)}
            className="bg-Green w-[48%] px-5 py-3 rounded-md flex flex-col items-center justify-center"
          >
            <Text className="text-White font-semibold text-[16px]">
              {i18n.t('plots.offlineMapsScreen.cancel')}
            </Text>
          </Pressable>
          <Pressable
            onPress={onDownloadArea}
            className="bg-Orange w-[48%] px-5 py-3 rounded-md flex flex-col items-center justify-center"
          >
            <Text className="text-White font-semibold text-[16px]">
              {i18n.t('plots.offlineMapsScreen.confirm')}
            </Text>
          </Pressable>
        </View>
      </Modal>
      {selectingMap ? (
        <View className="flex-1 h-full">
          <View className="flex-row items-center justify-center w-full p-5 bg-White flew">
            <Text className="text-[20px]">
              {i18n.t('plots.offlineMapsScreen.downloadThisMap')}
            </Text>
          </View>
          {location ? (
            <Mapbox.MapView
              className="border-[5px] border-blue-500"
              style={{ height: Dimensions.get('window').height - 254 }}
              ref={mapRef}
              onMapIdle={onRegionDidChange}
              styleURL={Mapbox.StyleURL.SatelliteStreet}
            >
              <Mapbox.Camera
                zoomLevel={14}
                centerCoordinate={[
                  location.coords.longitude,
                  location.coords.latitude,
                ]}
              />
              <Mapbox.PointAnnotation
                coordinate={[
                  location.coords.longitude,
                  location.coords.latitude,
                ]}
                id="current-location"
              >
                <View className="relative flex flex-row items-center justify-center w-5 h-5 bg-white rounded-full">
                  <View className="w-4 h-4 bg-blue-500 rounded-full" />
                </View>
              </Mapbox.PointAnnotation>
            </Mapbox.MapView>
          ) : (
            <View className="flex flex-col items-center justify-center flex-1 w-full h-full bg-White">
              <ActivityIndicator size="large" animating={true} />
              <Text className="mt-2">{i18n.t('plots.mapLoading')}</Text>
            </View>
          )}
          <Text className="px-5 my-3 bg-White">
            {i18n.t('plots.offlineMapsScreen.sizeWarning', {
              size: estimatedSize,
            })}
          </Text>
          <View className="flex flex-row items-center justify-between px-5 pb-5 bg-White">
            <Pressable
              onPress={() => setSelectingMap(false)}
              className="w-[48%] px-5 py-3 rounded-md bg-Green flex flex-row items-center justify-center"
            >
              <Text className="text-White font-semibold text-[16px]">
                {i18n.t('plots.offlineMapsScreen.cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setPackName('');
                setDownloadConfirm(true);
              }}
              className="flex flex-row items-center justify-center w-[48%] px-5 py-3 rounded-md bg-Orange"
            >
              <Download className="mr-2 text-White" size={20} />
              <Text className="text-White font-semibold text-[16px]">
                {i18n.t('plots.offlineMapsScreen.download')}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View className="m-5">
          <Pressable
            onPress={() => setSelectingMap(true)}
            className="flex flex-row items-center justify-center h-12 px-2 rounded-md bg-Orange"
          >
            <Download className="mr-2 text-White" size={20} />
            <Text className="font-semibold text-[16px] text-White">
              {i18n.t('plots.offlineMapsScreen.selectYourOwnMap')}
            </Text>
          </Pressable>
          {offlinePacks.length > 0 ? (
            <ScrollView className="mt-5">
              <Text className="text-[18px] font-medium mb-2">
                {i18n.t('plots.offlineMapsScreen.downloadedMaps')}
              </Text>
              {offlinePacks.map((pack: any, index: number) => {
                const date = pack?.expires?.split(' ');
                return (
                  <View
                    key={index}
                    className="flex flex-row items-center justify-between mt-4"
                  >
                    <View className="flex flex-row items-center justify-center">
                      {pack?.state === 'complete' &&
                      pack?.percentage === 100 ? (
                        <View className="flex flex-row items-center justify-center w-[24] h-[24] p-[2px] bg-blue-500 rounded-full">
                          <Check className="text-White" size={16} />
                        </View>
                      ) : (
                        <View className="w-[24] h-[24] p-[2px] bg-Orange rounded-full flex items-center justify-center">
                          <Text className="text-White text-[8px]">
                            {Math.round(pack?.percentage)}%
                          </Text>
                        </View>
                      )}
                      <View className="ml-2">
                        <Text>{pack?.name}</Text>
                        <View className="flex flex-row items-center">
                          <Text>
                            {(pack?.completedResourceSize / 1048576).toFixed(1)}{' '}
                            MB
                          </Text>
                          <View className="w-[4] h-[4] rounded-full bg-black mx-2" />
                          <Text>
                            {i18n.t('plots.offlineMapsScreen.expires', {
                              date:
                                date[0] === 'unknown'
                                  ? '-'
                                  : date[2] + ' ' + date[1] + ' ' + date[5],
                            })}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => deletePack(pack.name)}
                      className="flex-row"
                    >
                      <Trash className="text-black" size={20} />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View className="mt-5">
              <Text className="text-[18px] font-medium">
                {i18n.t('plots.offlineMapsScreen.downloadedMaps')}
              </Text>
              <Text>{i18n.t('plots.offlineMapsScreen.noMapsDownloaded')}</Text>
            </View>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
