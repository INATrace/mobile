import Topbar from '@/components/common/Topbar';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '@/locales/i18n';
import SearchInput from '@/components/common/SearchInput';
import { useState } from 'react';

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
  const [selectedSort, setSelectedSort] = useState<string>('BY_NAME');
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('BY_NAME');

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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
