import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import ViewSwitcher, { ViewSwitcherProps } from './ViewSwitcher';
import { useContext, useEffect, useState } from 'react';
import { Plot } from '@/types/plot';
import { emptyComponent } from '../common/FlashListComponents';
import Card, { CardProps, ItemProps } from '../common/Card';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '@/context/AuthContext';
import i18n from '@/locales/i18n';
import realm from '@/realm/useRealm';
import { PlotSchema } from '@/realm/schemas';
import { Farmer, ProductTypeWithCompanyId } from '@/types/farmer';
import { User } from '@/types/user';
import { RequestParams } from '@/types/auth';
import cn from '@/utils/cn';

type SummaryData = {
  crop: string;
  numberOfPlots: number;
  totalArea: number;
};

export default function ListView({
  viewType,
  setViewType,
  setSeePlot,
}: ViewSwitcherProps) {
  const [data, setData] = useState<CardProps[]>([]);
  const [summary, setSummary] = useState<CardProps>({} as CardProps);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingGeoId, setLoadingGeoId] = useState<number>(-1);

  const {
    selectedFarmer,
    selectFarmer,
    user,
    productTypes,
    selectedCompany,
    isConnected,
    makeRequest,
  } = useContext(AuthContext) as {
    selectedFarmer: Farmer;
    selectFarmer: (farmer: Farmer) => void;
    user: User;
    productTypes: ProductTypeWithCompanyId[];
    selectedCompany: number;
    isConnected: boolean;
    makeRequest: ({
      url,
      method,
      body,
      headers,
    }: RequestParams) => Promise<any>;
  };

  useEffect(() => {
    if (selectedFarmer) {
      loadPlotsAndSummary();
    }
  }, [selectedFarmer]);

  const handleSeePlot = (plotId: string) => {
    if (setSeePlot) {
      setViewType('map');
      setSeePlot(plotId);
    }
  };

  const loadPlotsAndSummary = async () => {
    setLoading(true);
    try {
      let summaryData: SummaryData[] = [];

      const products = productTypes?.find(
        (product: ProductTypeWithCompanyId) => {
          return product.companyId === selectedCompany;
        }
      );

      const offlinePlots = await realm.realmRead(
        PlotSchema,
        undefined,
        undefined,
        undefined,
        undefined,
        `farmerId == '${selectedFarmer?.id}' AND userId == '${user.id}'`
      );

      const dataToDisplay =
        offlinePlots?.map((plot: any) => {
          const plotData = JSON.parse(plot.data) as Plot;
          const summarySize = parseFloat(plotData.size.split(' ')[0]);

          if (summaryData.find((s) => s.crop === plotData.crop)) {
            const summaryIndex = summaryData.findIndex(
              (s) => s.crop === plotData.crop
            );
            summaryData[summaryIndex].numberOfPlots += 1;
            summaryData[summaryIndex].totalArea += summarySize;
          } else {
            summaryData.push({
              crop: plotData.crop,
              numberOfPlots: 1,
              totalArea: summarySize,
            });
          }

          const crop = products?.productTypes.find(
            (product) => product.id.toString() === plotData.crop
          );

          return {
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
                value: plotData.numberOfPlants
                  ? plotData.numberOfPlants.toString()
                  : '0',
                editable: false,
              },
              {
                type: 'view',
                name: i18n.t('plots.addPlot.size'),
                value: plotData.size,
                editable: false,
              },
              {
                type: 'view',
                name: i18n.t('plots.addPlot.geoId'),
                value: plotData.geoId,
                editable: false,
                share: true,
              },
              {
                type: 'view',
                name: i18n.t('plots.addPlot.certification'),
                value: plotData.certification ? plotData.certification : '',
                editable: false,
              },
              {
                type: 'view',
                name: i18n.t('plots.addPlot.organicStartOfTransition'),
                value: plotData.organicStartOfTransition
                  ? Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                    }).format(new Date(plotData.organicStartOfTransition))
                  : '',
                editable: false,
              },
            ],
            title: plotData.plotName,
            synced: false,
            switchView: () => handleSeePlot(plotData.id.toString()),
          } as CardProps;
        }) ?? [];

      const farmerPlots =
        selectedFarmer?.plots?.map((plot: any) => {
          const summarySize = parseFloat(plot.size);

          if (summaryData.find((s) => s.crop === plot.crop.id.toString())) {
            const summaryIndex = summaryData.findIndex(
              (s) => s.crop === plot.crop.id.toString()
            );
            summaryData[summaryIndex].numberOfPlots += 1;
            summaryData[summaryIndex].totalArea += summarySize;
          } else {
            summaryData.push({
              crop: plot.crop.id.toString(),
              numberOfPlots: 1,
              totalArea: summarySize,
            });
          }

          const crop = products?.productTypes.find(
            (product) => product.id === plot.crop.id
          );

          return {
            id: plot.id,
            title: plot.plotName,
            synced: true,
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
                value: plot.numberOfPlants
                  ? plot.numberOfPlants.toString()
                  : '0',
                editable: false,
              },
              {
                type: 'view',
                name: i18n.t('plots.addPlot.size'),
                value: plot.size + ' ' + plot.unit,
                editable: false,
              },
              {
                type: 'view',
                name: i18n.t('plots.addPlot.geoId'),
                value: plot.geoId,
                editable: false,
                share: true,
              },
              {
                type: 'view',
                name: i18n.t('plots.addPlot.certification'),
                value: plot.certification ? plot.certification : '',
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
            switchView: () => handleSeePlot(plot.id.toString()),
          } as CardProps;
        }) ?? [];

      if (summaryData.length !== 0) {
        const summaryItems = summaryData.map((s: any) => {
          const crop = products?.productTypes.find(
            (product) => product.id.toString() === s.crop
          );
          return {
            type: 'view',
            name: crop?.name,
            value: `${s.numberOfPlots} ${i18n.t('plots.plots')}, ${s.totalArea.toFixed(2) ?? 0} ha ${i18n.t('plots.totalArea')}`,
            editable: false,
          };
        });

        setSummary({
          items: summaryItems as ItemProps[],
        });
      }

      setData([...dataToDisplay, ...farmerPlots]);
    } catch (error) {
      console.error('Failed to load plots:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshGeoId = async (plotId?: number, isSynced?: boolean) => {
    if (!isConnected || !plotId || !isSynced) return;

    setLoadingGeoId(plotId);

    try {
      const response = await makeRequest({
        url: `/api/company/userCustomers/${selectedFarmer.id}/plots/${plotId}/updateGeoID`,
        method: 'POST',
      });

      const geoId = response.data.data.geoId;

      if (!geoId) {
        Alert.alert(
          i18n.t('plots.refreshGeoIdError'),
          i18n.t('plots.refreshGeoIdErrorAGSTACK')
        );
        return;
      }

      selectFarmer({
        ...selectedFarmer,
        plots: selectedFarmer.plots?.map((plot) => {
          if (parseInt(plot.id) === plotId) {
            return {
              ...plot,
              geoId,
            };
          }
          return plot;
        }),
      } as Farmer);
      Alert.alert(
        i18n.t('plots.refreshGeoIdSuccess'),
        i18n.t('plots.refreshGeoIdSuccessMessage')
      );
    } catch (e) {
      console.error('Failed to refresh geoId:', e);
      Alert.alert(
        i18n.t('plots.refreshGeoIdError'),
        i18n.t('plots.refreshGeoIdErrorMessage')
      );
    } finally {
      setLoadingGeoId(-1);
    }
  };

  return (
    <View className="h-full">
      <ViewSwitcher
        viewType={viewType}
        setViewType={setViewType}
        padding
        setSeePlot={setSeePlot}
      />
      {summary?.items?.length > 0 && (
        <View>
          <Text className="text-[18px] font-medium mx-5">
            {i18n.t('plots.summaryTitle')}
          </Text>
          <Card {...summary} />
        </View>
      )}
      {data.length > 0 && (
        <Text className="text-[18px] font-medium my-2 mx-5">
          {i18n.t('plots.plotsTitle')}
        </Text>
      )}
      <View style={{ flex: 1 }}>
        <FlashList
          extraData={[loadingGeoId, isConnected]}
          data={data}
          renderItem={({ item }) => (
            <View>
              <Pressable
                className={cn(
                  'flex flex-row items-center self-start px-2 py-1 mt-3 ml-5 -mb-3 rounded-md',
                  isConnected ? 'bg-Orange' : 'bg-Orange/60'
                )}
                disabled={!isConnected || !item.synced}
                onPress={() => refreshGeoId(item.id, item.synced)}
              >
                {loadingGeoId === item.id && (
                  <ActivityIndicator
                    animating
                    color={'white'}
                    className="mr-2"
                  />
                )}
                <Text className="font-medium text-white">
                  {i18n.t('plots.refreshGeoId')}
                </Text>
              </Pressable>
              <Card {...item} />
            </View>
          )}
          estimatedItemSize={200}
          keyExtractor={(_, index) => index.toString()}
          className="flex flex-col h-full"
          ListEmptyComponent={emptyComponent(
            loading ? i18n.t('loading') : i18n.t('plots.noData')
          )}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>
    </View>
  );
}
