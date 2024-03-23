import { Text, View } from 'react-native';
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
import { Farmer } from '@/types/farmer';
import { User } from '@/types/user';

type SummaryData = {
  crop: string;
  numberOfPlots: number;
  totalArea: number;
};

export default function ListView({ viewType, setViewType }: ViewSwitcherProps) {
  const [data, setData] = useState<CardProps[]>([]);
  const [summary, setSummary] = useState<CardProps>({} as CardProps);

  const { selectedFarmer, user } = useContext(AuthContext) as {
    selectedFarmer: Farmer;
    user: User;
  };

  useEffect(() => {
    if (selectedFarmer) {
      loadPlotsAndSummary();
    }
  }, [selectedFarmer]);

  const loadPlotsAndSummary = async () => {
    let summaryData: SummaryData[] = [];

    const offlinePlots = await realm.realmRead(
      PlotSchema,
      undefined,
      undefined,
      undefined,
      `farmerId == '${selectedFarmer?.id}'  AND userId == '${user.id}'`
    );

    if (!offlinePlots) {
      return;
    }

    const dataToDisplay = offlinePlots.map((plot: any) => {
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

      return {
        items: [
          {
            type: 'view',
            name: i18n.t('plots.addPlot.crop'),
            value: plotData.crop,
            editable: false,
          },
          {
            type: 'view',
            name: i18n.t('plots.addPlot.numberOfPlants'),
            value: plotData.numberOfPlants,
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
          },
          {
            type: 'view',
            name: i18n.t('plots.addPlot.certification'),
            value: plotData.certification,
            editable: false,
          },
          {
            type: 'view',
            name: i18n.t('plots.addPlot.organicStartOfTransition'),
            value: Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
            }).format(new Date(plotData.organicStartOfTransition)),
            editable: false,
          },
        ],
        title: plotData.plotName,
        synced: false,
      } as CardProps;
    });

    if (summaryData.length !== 0) {
      const summaryItems = summaryData.map((s) => ({
        type: 'view',
        name: s.crop.charAt(0) + s.crop.slice(1).toLowerCase(),
        value: `${s.numberOfPlots} ${i18n.t('plots.plots')}, ${s.totalArea.toFixed(2) ?? 0} ha ${i18n.t('plots.totalArea')}`,
        editable: false,
      }));

      setSummary({
        items: summaryItems as ItemProps[],
      });
    }

    setData(dataToDisplay);
  };

  return (
    <View className="h-full">
      <ViewSwitcher viewType={viewType} setViewType={setViewType} padding />
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
          data={data}
          renderItem={({ item }) => <Card {...item} />}
          estimatedItemSize={200}
          keyExtractor={(_, index) => index.toString()}
          className="flex flex-col h-full"
          ListEmptyComponent={emptyComponent(i18n.t('plots.noData'))}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>
    </View>
  );
}
