import OfflinePack from '@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack';
import { useNavigation } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { createRef, useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
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

  const onDownloadArea = () => {
    if (bounds) {
      // Define offline pack bounds using the current visible bounds
      const offlinePackBounds = [
        [bounds[0][0], bounds[0][1]],
        [bounds[1][0], bounds[1][1]],
      ];

      // Proceed with Mapbox offline pack download using offlinePackBounds...
    }
    Alert.alert('Download area not implemented');
  };

  return (
    <View className="h-full">
      {offlinePacks.length > 0 ? (
        <>
          <Text>Downloaded Maps:</Text>
          {offlinePacks.map((pack, index) => (
            <Text key={index}>{pack.name}:</Text>
          ))}
          <Text>Total Size: 0</Text>
        </>
      ) : (
        <Text>No offline maps downloaded.</Text>
      )}
      <View className="flex-1 h-full">
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
        <Pressable onPress={onDownloadArea}>
          <Text>Download Selected Area</Text>
        </Pressable>
      </View>
    </View>
  );
}
