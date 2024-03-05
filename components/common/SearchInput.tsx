import { Pressable, TextInput, View, Text } from 'react-native';
import { ArrowDownUp, Filter, Search } from 'lucide-react-native';
import i18n from '@/locales/i18n';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import Colors from '@/constants/Colors';

type SearchInputProps = {
  input: string;
  setInput: (input: string) => void;
};

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

export default function SearchInput(props: SearchInputProps) {
  const [showSort, setShowSort] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>('BY_NAME');
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('BY_NAME');

  return (
    <View className="flex flex-row items-center justify-between px-5">
      <View className="relative flex flex-row items-center justify-between h-12 mt-1 border rounded-md border-LightGray bg-White w-[70%]">
        <Search className="absolute text-LightGray left-4" />
        <TextInput
          placeholder={i18n.t('farmers.search')}
          value={props.input}
          onChangeText={props.setInput}
          placeholderTextColor={Colors.darkGray}
          className="text-[16px] h-12 px-2 pl-12 rounded-md w-full"
        />
      </View>
      <Pressable
        onPress={() => setShowSort(!showSort)}
        className="flex flex-row items-center justify-center w-12 h-12 mt-1 border rounded-md border-LightGray bg-White"
      >
        <ArrowDownUp className="text-LightGray" />
      </Pressable>
      {showSort && (
        <View className="absolute bg-White top-20">
          <Picker
            selectedValue={selectedSort}
            onValueChange={(itemValue: string) => setSelectedSort(itemValue)}
            style={{ width: 300 }}
          >
            {sortItems.map((item, index) => {
              return (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              );
            })}
          </Picker>
        </View>
      )}
      <Pressable
        onPress={() => setShowFilter(!showFilter)}
        className="flex flex-row items-center justify-center w-12 h-12 mt-1 border rounded-md border-LightGray bg-White"
      >
        <Filter className="text-LightGray" />
      </Pressable>
      {/* <Picker
          selectedValue={selectedSort}
          onValueChange={(itemValue: string) => setSelectedSort(itemValue)}
          style={{ width: 300 }}
        >
          {sortItems.map((item, index) => {
            return (
              <Picker.Item key={index} label={item.label} value={item.value} />
            );
          })}
        </Picker> */}
    </View>
  );
}
