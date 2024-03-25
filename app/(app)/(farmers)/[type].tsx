import Topbar from '@/components/common/Topbar';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '@/locales/i18n';
import SearchInput from '@/components/common/SearchInput';
import { useContext, useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '@/context/AuthContext';
import Card, { CardProps, ItemProps } from '@/components/common/Card';
import { Farmer } from '@/types/farmer';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import NewFarmerButton, {
  ButtonWrapper,
} from '@/components/farmers/NewFarmerButton';
import { useLocalSearchParams } from 'expo-router';
import { emptyComponent } from '@/components/common/FlashListComponents';
import realm from '@/realm/useRealm';
import { FarmerSchema, NewFarmerSchema } from '@/realm/schemas';

const sortItems = [
  { label: i18n.t('farmers.sort.name'), value: 'BY_NAME_ASC', icon: ChevronUp },
  {
    label: i18n.t('farmers.sort.name'),
    value: 'BY_NAME_DESC',
    icon: ChevronDown,
  },
  {
    label: i18n.t('farmers.sort.surname'),
    value: 'BY_SURNAME_ASC',
    icon: ChevronUp,
  },
  {
    label: i18n.t('farmers.sort.surname'),
    value: 'BY_SURNAME_DESC',
    icon: ChevronDown,
  },
  { label: i18n.t('farmers.sort.id'), value: 'BY_ID_ASC', icon: ChevronUp },
  { label: i18n.t('farmers.sort.id'), value: 'BY_ID_DESC', icon: ChevronDown },
];

const filterItems = [
  { label: i18n.t('farmers.filter.name'), value: 'BY_NAME' },
  { label: i18n.t('farmers.filter.surname'), value: 'BY_SURNAME' },
];

export default function Farmers() {
  const { type } = useLocalSearchParams();
  const [search, setSearch] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('BY_NAME_ASC');
  const [selectedFilter, setSelectedFilter] = useState<string>('BY_NAME');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<CardProps[]>([]);
  const [dataCount, setDataCount] = useState<number>(100);

  const [offset, setOffset] = useState<number>(0);
  const limit = 10;

  const { isConnected, makeRequest, selectedCompany } = useContext(AuthContext);

  useEffect(() => {
    if (offset !== 0) {
      handleFarmers(limit, offset, false);
    } else {
      handleFarmers(limit, offset, true);
    }
  }, [selectedSort, selectedFilter, search, selectedCompany, offset]);

  const handleFarmers = async (
    limitHF: number,
    offsetHF: number,
    resetData: boolean
  ) => {
    if (!isConnected) {
      fetchFarmers(limitHF, offsetHF, resetData);
    } else {
      loadFarmers(limitHF, offsetHF, resetData);
    }
  };

  const fetchFarmers = async (
    limit: number,
    offset: number,
    resetData: boolean
  ) => {
    setIsLoading(true);
    try {
      const sort = selectedSort.split('_');
      const sortBy = sort[0] + '_' + sort[1];
      const sortType = sort[2];

      const response = await makeRequest({
        url: `/api/company/userCustomers/${selectedCompany}/FARMER?limit=${limit}&offset=${offset}&sortBy=${sortBy}&sort=${sortType}&query=${search}&searchBy=${selectedFilter}`,
        method: 'GET',
      });

      if (response.data.status === 'OK') {
        const farmers = response.data.data.items.map((farmer: Farmer) => {
          return {
            title: `${farmer.name} ${farmer.surname}`,
            items: [
              {
                type: 'view',
                name: i18n.t('farmers.card.villageAndCell'),
                value: `${farmer.location.address.village}, ${farmer.location.address.cell}`,
              },
              {
                type: 'view',
                name: i18n.t('farmers.card.gender'),
                value: farmer.gender,
              },
            ] as ItemProps[],
            navigationPath:
              type === 'farmers' ? `info/${farmer.id}` : `view/${farmer.id}`,
            navigationParams: {
              type: 'farmer',
              data: farmer,
            },
          } as CardProps;
        });

        setDataCount(
          response.data.data.count === 0 ? 1 : response.data.data.count
        );
        if (resetData) {
          setData(farmers);
          setOffset(0);
        } else {
          setData([...data, ...farmers]);
        }
      }
    } catch (error) {
      setError(i18n.t('farmers.errorFetch'));
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  const loadFarmers = async (
    limit: number,
    offset: number,
    resetData: boolean
  ) => {
    try {
      const sort = selectedSort.split('_');
      const search = '';
      const newFarmersRealm = await realm.realmRead(
        NewFarmerSchema,
        limit,
        offset,
        sort[2] as 'ASC' | 'DESC',
        search
      );
      const newFarmersRealmData = newFarmersRealm.map(
        (farmer: any) => JSON.parse(farmer.data) as Farmer
      );
      const farmersRealm = await realm.realmRead(
        FarmerSchema,
        limit,
        offset,
        sort[2] as 'ASC' | 'DESC',
        search
      );
      const farmersRealmData = farmersRealm.map(
        (farmer: any) => JSON.parse(farmer.data) as Farmer
      );
      let offlineData: CardProps[] = [];

      if (newFarmersRealmData.length > 0) {
        offlineData = newFarmersRealmData.map((farmer: Farmer) => {
          return {
            title: `${farmer.name} ${farmer.surname}`,
            items: [
              {
                type: 'view',
                name: i18n.t('farmers.card.villageAndCell'),
                value: `${farmer.location.address.village}, ${farmer.location.address.cell}`,
              },
              {
                type: 'view',
                name: i18n.t('farmers.card.gender'),
                value: farmer.gender,
              },
            ] as ItemProps[],
            navigationPath:
              type === 'farmers' ? `info/${farmer.id}` : `view/${farmer.id}`,
            navigationParams: {
              type: 'farmer',
              data: farmer,
            },
          } as CardProps;
        });
      }

      if (farmersRealmData.length > 0) {
        offlineData = [
          ...data,
          ...farmersRealmData.map((farmer: Farmer) => {
            return {
              title: `${farmer.name} ${farmer.surname}`,
              items: [
                {
                  type: 'view',
                  name: i18n.t('farmers.card.villageAndCell'),
                  value: `${farmer.location.address.village}, ${farmer.location.address.cell}`,
                },
                {
                  type: 'view',
                  name: i18n.t('farmers.card.gender'),
                  value: farmer.gender,
                },
              ] as ItemProps[],
              navigationPath:
                type === 'farmers' ? `info/${farmer.id}` : `view/${farmer.id}`,
              navigationParams: {
                type: 'farmer',
                data: farmer,
              },
            } as CardProps;
          }),
        ];
      }

      setDataCount(offlineData.length);
      if (resetData) {
        setData(offlineData);
        setOffset(0);
      } else {
        setData([...data, ...offlineData]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setOffset(0);
    fetchFarmers(10, 0, true);
  };

  const onEndReached = () => {
    if (!isLoading) {
      setOffset((prevOffset) => prevOffset + 10);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator style={{ margin: 20 }} />;
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex flex-col h-full bg-Background"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="mb-3">
          <Topbar
            title={
              type === 'farmers'
                ? i18n.t('farmers.title')
                : i18n.t('farmers.titleNewPlot')
            }
            goBack
          />
          <SearchInput
            input={search}
            setInput={setSearch}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            sortItems={sortItems}
            filterItems={filterItems}
          />
        </View>
      </TouchableWithoutFeedback>

      <View style={{ flex: 1 }}>
        <FlashList
          data={data}
          renderItem={({ item }) => <Card {...item} />}
          estimatedItemSize={dataCount}
          keyExtractor={(_, index) => index.toString()}
          className="flex flex-col h-full"
          ListEmptyComponent={emptyComponent(i18n.t('farmers.noData'))}
          ListFooterComponent={renderFooter}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>
      {type === 'farmers' && (
        <ButtonWrapper>
          <NewFarmerButton />
        </ButtonWrapper>
      )}
    </SafeAreaView>
  );
}
