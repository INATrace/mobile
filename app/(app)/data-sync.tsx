import { Farmer } from '@/types/farmer';
import { useNavigation } from 'expo-router';
import { ChevronLeft, RefreshCw } from 'lucide-react-native';
import { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import realm from '@/realm/useRealm';
import { FarmerSchema, PlotSchema } from '@/realm/schemas';
import Card, { ItemProps } from '@/components/common/Card';
import i18n from '@/locales/i18n';
import { emptyComponent } from '@/components/common/FlashListComponents';
import { ButtonWrapper } from '@/components/farmers/NewFarmerButton';
import cn from '@/utils/cn';
import { AuthContext } from '@/context/AuthContext';

export default function DataSync() {
  const navigation = useNavigation();
  const { isConnected, makeRequest, selectedCompany, user, selectedFarmer } =
    useContext(AuthContext) as {
      isConnected: boolean;
      makeRequest: any;
      selectedCompany: number;
      user: any;
      selectedFarmer: Farmer;
    };

  const [farmersToSync, setFarmersToSync] = useState<ItemProps[]>([]);
  const [plotsToSync, setPlotsToSync] = useState<ItemProps[]>([]);
  const [farmersToSyncData, setFarmersToSyncData] = useState<any>([]);
  const [plotsToSyncData, setPlotsToSyncData] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
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

    getItemsToSync();
  }, []);

  const getItemsToSync = async () => {
    setLoading(true);
    try {
      const farmers = (await realm.realmRead(
        FarmerSchema,
        undefined,
        undefined,
        undefined,
        undefined,
        `synced = false AND userId == '${user?.id}'`
      )) as any;
      const plots = (await realm.realmRead(
        PlotSchema,
        undefined,
        undefined,
        undefined,
        undefined,
        `synced = false AND userId == '${user?.id}'`
      )) as any;

      let farmersData: any = [];
      let plotsData: any = [];

      const farmersToSync = farmers.map((farmer: any) => {
        const data = JSON.parse(farmer.data);

        farmersData.push({ ...farmer, data });

        return {
          type: 'view',
          name: farmer.name + ' ' + farmer.surname,
          value: '',
          editable: false,
        } as ItemProps;
      });
      const plotsToSync = plots.map((plot: any) => {
        const data = JSON.parse(plot.data);

        plotsData.push({ ...plot, data });

        return {
          type: 'view',
          name: data.plotName,
          value: '',
          editable: false,
        } as ItemProps;
      });

      setFarmersToSync(farmersToSync);
      setPlotsToSync(plotsToSync);

      setFarmersToSyncData(farmersData);
      setPlotsToSyncData(plotsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    if (!isConnected) {
      return;
    }

    setSyncing(true);
    try {
      const farmerPromises = await farmersToSyncData.forEach(
        async (farmer: any) => {
          const farmerPlots = plotsToSyncData.filter(
            (plot: any) => plot.farmerId === farmer.id
          );

          const farmerBody = {
            ...farmer.data,
            plots:
              farmerPlots?.map((plot: any) => {
                return {
                  plotName: plot.data.plotName,
                  crop: { id: parseInt(plot.data.crop, 10) },
                  numberOfPlants: plot.data.numberOfPlants
                    ? parseInt(plot.data.numberOfPlants, 10)
                    : null,
                  unit: plot.data.size.split(' ')[1],
                  size: parseFloat(plot.data.size.split(' ')[0]),
                  geoId: '',
                  organicStartOfTransition: plot.data.organicStartOfTransition
                    ? plot.data.organicStartOfTransition
                    : null,
                  certification: plot.data.certification
                    ? plot.data.certification
                    : null,
                  coordinates:
                    plot.data.featureInfo.geometry.coordinates[0].map(
                      (coordinate: number[]) => {
                        return {
                          latitude: coordinate[1],
                          longitude: coordinate[0],
                        };
                      }
                    ),
                };
              }) ?? [],
          };

          return await makeRequest({
            url: `/api/company/userCustomers/add/${selectedCompany}`,
            method: 'POST',
            body: farmerBody,
          });
        }
      );

      const farmerPromiseResults = await Promise.all(farmerPromises);

      console.log(farmerPromiseResults);
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <View className="h-full">
      <ScrollView className="flex flex-col h-full pt-5 bg-White">
        <Text className="text-[18px] font-medium mx-5">
          {i18n.t('farmers.title')}
        </Text>
        {loading ? (
          emptyComponent(i18n.t('loading'))
        ) : farmersToSync.length > 0 ? (
          <Card items={farmersToSync} />
        ) : (
          emptyComponent(i18n.t('synced.noFarmers'))
        )}

        <Text className="text-[18px] font-medium mx-5">
          {i18n.t('plots.title')}
        </Text>
        {loading ? (
          emptyComponent(i18n.t('loading'))
        ) : plotsToSync.length > 0 ? (
          <Card items={plotsToSync} />
        ) : (
          emptyComponent(i18n.t('synced.noPlots'))
        )}
      </ScrollView>
      <Pressable className="bg-White" onPress={syncData}>
        {({ pressed }) => (
          <View
            className={cn(
              pressed ? 'bg-Orange/80' : 'bg-Orange',
              'flex flex-row m-5 p-3 items-center justify-center rounded-md h-[48px]'
            )}
          >
            {syncing ? (
              <ActivityIndicator />
            ) : (
              <RefreshCw className="text-White" />
            )}
            <View className="w-2" />
            <Text className="text-[16px] text-White font-semibold">
              {i18n.t('home.syncData')}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
