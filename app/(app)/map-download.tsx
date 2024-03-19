import OfflinePack from '@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack';
import { useNavigation } from 'expo-router';
import {
  ChevronLeft,
  CircleEllipsis,
  Download,
  Trash,
} from 'lucide-react-native';
import { createRef, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import i18n from '@/locales/i18n';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

export default function MapDownload() {
  const navigation = useNavigation();

  const [location, setLocation] = useState<LocationObject | null>(null);

  const [offlinePacks, setOfflinePacks] = useState<OfflinePack[]>([]);
  const [bounds, setBounds] = useState<any | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [selectingMap, setSelectingMap] = useState<boolean>(false);

  const mapRef = createRef<Mapbox.MapView>();

  const [totalSize, setTotalSize] = useState<number>(0);

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t('plots.mapDownload'),
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex flex-row items-center justify-center mr-3"
        >
          <ChevronLeft className="text-Orange" />
          <Text className="font-medium text-Orange text-[18px]">Back</Text>
        </Pressable>
      ),
    });

    checkForOfflineMaps();
    askForLocationPermission();
  }, []);

  const checkForOfflineMaps = async () => {
    try {
      const packs = await Mapbox.offlineManager.getPacks();
      setOfflinePacks(packs);
      packs.forEach(async (pack) => {
        console.log('Pack:', pack);
      });
      //const totalSize = packs.reduce(async (acc, pack) => acc + await pack.status, 0);
      setTotalSize(0);
    } catch (error) {
      console.error('Error fetching offline packs:', error);
    }
  };

  const askForLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    console.log('Current location:', currentLocation);
    setLocation(currentLocation);
  };

  const onRegionDidChange = async () => {
    if (mapRef.current) {
      const visibleBounds = await mapRef.current.getVisibleBounds();
      const zoomLevel = await mapRef.current.getZoom();
      console.log('Visible bounds:', visibleBounds);
      console.log('Zoom level:', zoomLevel);
      setBounds(visibleBounds);
    }
  };

  const onDownloadArea = async () => {
    if (!bounds) {
      Alert.alert('No area selected', 'Please select an area to download.');
      return;
    }

    const metadata = { name: 'Your Map Name', date: new Date().toISOString() };

    try {
      await Mapbox.offlineManager.createPack(
        {
          name: 'Your Map Name',
          styleURL: Mapbox.StyleURL.Street,
          bounds: [
            [bounds[0][1], bounds[0][0]],
            [bounds[1][1], bounds[1][0]],
          ],
          minZoom: 14,
          maxZoom: 20,
          metadata,
        },
        (pack) => {}
      );

      Alert.alert('Download Started', 'Your map is now downloading.');
    } catch (error) {
      console.error('Error starting offline pack download:', error);
      Alert.alert(
        'Download Error',
        'There was an error starting the download.'
      );
    }
  };

  const deletePack = (pack: OfflinePack) => async () => {
    try {
      await Mapbox.offlineManager.deletePack(pack.name);
      checkForOfflineMaps();
    } catch (error) {
      console.error('Error deleting offline pack:', error);
      Alert.alert('Error', 'There was an error deleting the pack.');
    }
  };

  return (
    <View className="h-full">
      {selectingMap ? (
        <View className="flex-1 h-full">
          <View className="flex-row items-center justify-center w-full p-5 bg-White flew">
            <Text className="text-[20px]">
              {i18n.t('plots.offlineMapsScreen.downloadThisMap')}
            </Text>
          </View>
          {location && (
            <Mapbox.MapView
              className="flex-1"
              ref={mapRef}
              onMapIdle={onRegionDidChange}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Mapbox.Camera
                zoomLevel={14}
                centerCoordinate={[
                  location.coords.longitude,
                  location.coords.latitude,
                ]}
              />
              {mapLoaded && location && (
                <Mapbox.UserLocation
                  onUpdate={(newLocation) => {}} //setLocation(newLocation)}
                />
              )}
            </Mapbox.MapView>
          )}

          <View className="flex flex-row items-center justify-between p-5 bg-White">
            <Pressable
              onPress={() => setSelectingMap(false)}
              className="w-[55%] px-5 py-3 rounded-md bg-Green flex flex-row items-center justify-center"
            >
              <Text className="text-White font-semibold text-[16px]">
                {i18n.t('plots.offlineMapsScreen.cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={onDownloadArea}
              className="flex flex-row items-center justify-center w-[40%] px-5 py-3 rounded-md bg-Orange"
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
              <Text className="text-[18px] font-medium">
                {i18n.t('plots.offlineMapsScreen.downloadedMaps')}
              </Text>
              {offlinePacks.map((pack, index) => (
                <View>
                  <View>
                    <Text key={index}>{pack.name}</Text>
                  </View>
                  <Pressable onPress={deletePack(pack)} className="flex-row">
                    <Trash className="text-red-500" size={20} />
                  </Pressable>
                </View>
              ))}
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
    </View>
  );
}
