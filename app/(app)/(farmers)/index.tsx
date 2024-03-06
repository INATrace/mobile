import Topbar from '@/components/common/Topbar';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '@/locales/i18n';
import SearchInput from '@/components/common/SearchInput';
import { useContext, useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '@/context/AuthContext';
import Card, { CardProps } from '@/components/common/Card';
import axios from 'axios';

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
  const [showSort, setShowSort] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>('BY_NAME_ASC');
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('BY_NAME');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<CardProps[]>([]);
  const [dataCount, setDataCount] = useState<number>(100);

  const { connection, accessToken, selectedCompany } = useContext(AuthContext);

  useEffect(() => {
    if (connection?.isConnected) {
      fetchFarmers(10, 0);
    } else {
      loadFarmers();
    }
  }, []);

  const fetchFarmers = async (limit: number, offset: number) => {
    setIsLoading(true);
    try {
      const sort = selectedSort.split('_');
      const sortBy = sort[0] + '_' + sort[1];
      const sortType = sort[2];

      const response = await axios.get(
        `https://test.inatrace.org/api/company/userCustomers/${39}/FARMER?limit=${limit}&offset=${offset}&sortBy=${sortBy}&sort=${sortType}&query=${search}&searchBy=${selectedFilter}`,
        {
          headers: {
            Cookie: `inatrace-accessToken=${accessToken}`,
          },
        }
      );

      if (response.data.status === 'OK') {
        console.log(response.data.data);
      }
    } catch (error) {
      setError(i18n.t('farmers.errorFetch'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadFarmers = async () => {};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex flex-col h-full bg-Background">
        <Topbar title={i18n.t('farmers.title')} goBack />
        <SearchInput
          input={search}
          setInput={setSearch}
          showSort={showSort}
          setShowSort={setShowSort}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          sortItems={sortItems}
          filterItems={filterItems}
        />
        <FlashList
          data={data}
          renderItem={({ item }) => <Card {...item} />}
          estimatedItemSize={dataCount}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
