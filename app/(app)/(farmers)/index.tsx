import Topbar from '@/components/common/Topbar';
import {
  View,
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

const sortItems = [
  { label: i18n.t('farmers.sort.name_asc'), value: 'BY_NAME_ASC' },
  { label: i18n.t('farmers.sort.name_desc'), value: 'BY_NAME_DESC' },
  {
    label: i18n.t('farmers.sort.surname_asc'),
    value: 'BY_SURNAME_ASC',
  },
  {
    label: i18n.t('farmers.sort.surname_desc'),
    value: 'BY_SURNAME_DESC',
  },
  { label: i18n.t('farmers.sort.id_asc'), value: 'BY_ID_ASC' },
  { label: i18n.t('farmers.sort.id_desc'), value: 'BY_ID_DESC' },
];

const filterItems = [
  { label: i18n.t('farmers.filter.name'), value: 'BY_NAME' },
  { label: i18n.t('farmers.filter.surname'), value: 'BY_SURNAME' },
];

export default function Farmers() {
  const [search, setSearch] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('BY_NAME_ASC');
  const [selectedFilter, setSelectedFilter] = useState<string>('BY_NAME');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<CardProps[]>([]);
  const [dataCount, setDataCount] = useState<number>(100);

  const [offset, setOffset] = useState<number>(0);

  const { getConnection, makeRequest, selectedCompany } =
    useContext(AuthContext);

  useEffect(() => {
    handleFarmers();
  }, [offset, selectedSort, selectedFilter, search]);

  const handleFarmers = async () => {
    const connection = await getConnection;
    if (connection.isConnected) {
      fetchFarmers(10, offset);
    } else {
      loadFarmers();
    }
  };

  const fetchFarmers = async (limit: number, offset: number) => {
    if (!isRefreshing) setIsLoading(true);
    try {
      const sort = selectedSort.split('_');
      const sortBy = sort[0] + '_' + sort[1];
      const sortType = sort[2];

      const response = await makeRequest({
        url: `https://test.inatrace.org/api/company/userCustomers/39/FARMER?limit=${limit}&offset=${offset}&sortBy=${sortBy}&sort=${sortType}&query=${search}&searchBy=${selectedFilter}`,
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
            navigationPath: `info/${farmer.id}`,
            navigationParams: {
              type: 'farmer',
              data: farmer,
            },
          } as CardProps;
        });

        setDataCount(response.data.data.count);
        setData([...data, ...farmers]);
      }
    } catch (error) {
      setError(i18n.t('farmers.errorFetch'));
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  const loadFarmers = async () => {};

  const onRefresh = () => {
    setIsRefreshing(true);
    setOffset(0);
    setData([]);
    fetchFarmers(10, 0);
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
    <SafeAreaView className="flex flex-col h-full bg-Background">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Topbar title={i18n.t('farmers.title')} goBack />
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
          ListFooterComponent={renderFooter}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
}
